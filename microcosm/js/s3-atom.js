/* 场景 3 · 氧原子的电子云（单位：玻尔半径 a₀ = 52.9 pm）
   轨道：类氢径向函数 + Clementi–Raimondi 有效核电荷（1s 7.658，2s 4.492，2p 4.453） */
(function () {
  const MC = window.MC;
  const Z1 = 7.658, Z2 = 4.492, Z3 = 4.453;
  const MODES = { total: 0, s1: 1, s2: 2, p: 3, sup: 4 };

  const FS = `
// uP0: x 模式, y 叠加态相位, z 曝光, w 积分半径
const float Z1=${Z1}, Z2=${Z2}, Z3=${Z3};
const float Y0=.28209479, Y1=.48860251;
float R1s(float r){ return 2.*pow(Z1,1.5)*exp(-Z1*r); }
float R2s(float r){ float k=pow(Z2*.5,1.5); return 2.*k*(1.-Z2*r*.5)*exp(-Z2*r*.5); }
float R2p(float r){ float k=pow(Z3*.5,1.5); return .57735*k*Z3*exp(-Z3*r*.5); } // 已除以 r，乘坐标分量即得
// 返回 rgb = 发光颜色（已含强度），a = 吸收用密度
vec4 sampleCloud(vec3 p){
  float r=length(p);
  float mode=uP0.x;
  if(mode<.5){
    float a=R1s(r)*Y0, b=R2s(r)*Y0, c=R2p(r)*Y1;
    float d1=2.*a*a, d2=2.*b*b, d3=c*c*(2.*p.x*p.x+p.y*p.y+p.z*p.z);
    float rho=d1+d2+d3;
    vec3 col=(d1*vec3(.62,.55,1.)+d2*vec3(.30,.85,.95)+d3*vec3(1.,.66,.30))/max(rho,1e-9);
    return vec4(col*pow(rho,.65),rho);
  }
  float psi; vec3 col;
  if(mode<1.5){ psi=R1s(r)*Y0; }
  else if(mode<2.5){ psi=R2s(r)*Y0; }
  else if(mode<3.5){ psi=R2p(r)*Y1*p.z; }
  else {
    float a=R2s(r)*Y0, b=R2p(r)*Y1*p.z, ph=uP0.y;
    float re=(a+b*cos(ph))*.7071, im=(-b*sin(ph))*.7071;
    float rho=re*re+im*im;
    float hue=atan(im,re)/(2.*PI)+.5;
    col=hsv2rgb(vec3(hue,.55,1.));
    return vec4(col*pow(rho,.65),rho);
  }
  float rho=psi*psi;
  col=psi>0.? vec3(1.,.62,.28) : vec3(.30,.62,1.);
  return vec4(col*pow(rho,.65),rho);
}
void main(){
  vec3 rd=rayDir(gl_FragCoord.xy), ro=uRo;
  float Rm=uP0.w;
  float t0,t1; vec3 col=vec3(0.); float tr=1.;
  if(sphIntersect(ro,rd,vec3(0.),Rm,t0,t1)){
    float t=max(t0,0.);
    float j=hash12(gl_FragCoord.xy+fract(uTime)*37.);
    for(int i=0;i<230;i++){
      vec3 p=ro+rd*t; float r=length(p);
      float dt=clamp(.06*r,.0015,.09);
      dt=max(dt,uW*.004);
      vec4 s=sampleCloud(ro+rd*(t+dt*j));
      col+=tr*s.rgb*dt*uP0.z;
      tr*=exp(-pow(s.a,.65)*dt*.04);
      t+=dt; if(t>t1||tr<.02) break;
    }
  }
  vec2 sp=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  col+=tr*vec3(.003,.004,.01)*(1.-length(sp));
  col=aces(col*.9);
  outColor=vec4(toSRGB(col)+dither(gl_FragCoord.xy),1.);
}`;

  /* ---------- 按 |ψ|² 抽样“测量事件” ---------- */
  function radialTable(fn, rmax) {
    const n = 4096, cdf = new Float64Array(n + 1), rs = new Float64Array(n + 1);
    let s = 0;
    for (let i = 0; i <= n; i++) {
      const r = rmax * i / n; rs[i] = r;
      const v = fn(r); s += r * r * v * v; cdf[i] = s;
    }
    for (let i = 0; i <= n; i++) cdf[i] /= s;
    return (u) => { let lo = 0, hi = n; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cdf[m] < u) lo = m; else hi = m; } return rs[hi]; };
  }
  const R1 = (r) => 2 * Math.pow(Z1, 1.5) * Math.exp(-Z1 * r);
  const R2 = (r) => { const k = Math.pow(Z2 / 2, 1.5); return 2 * k * (1 - Z2 * r / 2) * Math.exp(-Z2 * r / 2); };
  const RP = (r) => { const k = Math.pow(Z3 / 2, 1.5); return 0.57735 * k * Z3 * r * Math.exp(-Z3 * r / 2); };
  const T1 = radialTable(R1, 3), T2 = radialTable(R2, 8), TP = radialTable(RP, 8);
  function dir() { let x, y, z, l; do { x = Math.random() * 2 - 1; y = Math.random() * 2 - 1; z = Math.random() * 2 - 1; l = x * x + y * y + z * z; } while (l > 1 || l < 1e-6); l = Math.sqrt(l); return [x / l, y / l, z / l]; }
  function pdir(axis) { for (;;) { const d = dir(); if (Math.random() < d[axis] * d[axis]) return d; } }
  function sampleOrb(o) {
    if (o === 's1') { const r = T1(Math.random()); const d = dir(); return [d[0] * r, d[1] * r, d[2] * r]; }
    if (o === 's2') { const r = T2(Math.random()); const d = dir(); return [d[0] * r, d[1] * r, d[2] * r]; }
    const ax = o === 'px' ? 0 : o === 'py' ? 1 : 2; const r = TP(Math.random()); const d = pdir(ax); return [d[0] * r, d[1] * r, d[2] * r];
  }
  const Y0 = 0.28209479, Y1 = 0.48860251;
  function sample(mode, ph) {
    if (mode === 'total') { const k = Math.random() * 8; return sampleOrb(k < 2 ? 's1' : k < 4 ? 's2' : k < 6 ? 'px' : k < 7 ? 'py' : 'pz'); }
    if (mode === 's1' || mode === 's2') return sampleOrb(mode);
    if (mode === 'p') return sampleOrb('pz');
    // 叠加态：以 2s、2pz 的混合为包络做拒绝抽样
    for (let k = 0; k < 50; k++) {
      const p = sampleOrb(Math.random() < 0.5 ? 's2' : 'pz');
      const r = Math.hypot(p[0], p[1], p[2]);
      const a = R2(r) * Y0, b = (r > 0 ? RP(r) / r : 0) * Y1 * p[2];
      const re = (a + b * Math.cos(ph)) * 0.7071, im = -b * Math.sin(ph) * 0.7071;
      if (Math.random() * (a * a + b * b) <= re * re + im * im) return p;
    }
    return [0, 0, 0];
  }

  const MAXP = 2400, LIFE = 0.9;
  const pts = []; let pset = null, phase = 0, spawnAcc = 0;
  const scene = {
    key: 'atom',
    range: [-9.45, -11.3],
    unit: 5.29177e-11,
    fs: FS,
    pitch: 0.35,
    spin: 0.06,
    bloom: 0.5,
    state: { mode: 'total', detect: 1 },
    controls: [
      { key: 'mode', label: '显示', options: [['total', '总电子密度'], ['s1', '1s'], ['s2', '2s'], ['p', '2p'], ['sup', '2s+2p 叠加态']] },
      { key: 'detect', label: '测量事件', options: [[1, '显示'], [0, '隐藏']] }
    ],
    legend: [['#9e8cff', '1s 内层'], ['#4dd9f2', '2s'], ['#ffa84d', '2p']],
    onControl(k) {
      if (k === 'mode') {
        pts.length = 0;
        const m = this.state.mode;
        this.legend = m === 'total' ? [['#9e8cff', '1s 内层'], ['#4dd9f2', '2s'], ['#ffa84d', '2p']]
          : m === 'sup' ? [['linear-gradient(90deg,#f66,#ff6,#6f6,#6ff,#66f,#f6f)', '颜色 = 波函数的复相位']]
          : [['#ffa04a', 'ψ > 0'], ['#4d9eff', 'ψ < 0'], ['#000', '黑色缝隙 = 节面（ψ = 0）']];
        document.getElementById('cLegend').innerHTML = this.legend.map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join('');
      }
    },
    init(gl) { pset = new MC.PointSet(gl, MAXP + 1); },
    update(dt) {
      phase += dt * 2 * Math.PI / 2.4;   // 真实周期约 0.25 fs，这里放慢到 2.4 s
      if (!this.state.detect) { pts.length = 0; return; }
      spawnAcc += dt * 700;
      while (spawnAcc >= 1) { spawnAcc -= 1; const p = sample(this.state.mode, phase); pts.push({ p, age: 0 }); }
      for (const q of pts) q.age += dt;
      while (pts.length && (pts[0].age > LIFE || pts.length > MAXP)) pts.shift();
    },
    uniforms(gl, prog, ctx) {
      const m = MODES[this.state.mode];
      const Rm = this.state.mode === 's1' ? 1.6 : 7.5;
      const exp = { total: 0.3, s1: 0.16, s2: 0.75, p: 0.75, sup: 0.75 }[this.state.mode];
      const ex = exp * Math.pow(Math.min(1, ctx.W / 6.7), 0.45);  // 深入 1s 内层时自动降低曝光
      gl.uniform4f(prog.u('uP0'), m, phase, ex, Rm);
    },
    drawExtra(gl, ctx) {
      if (!pset) return;
      let n = 0;
      const size = ctx.W * 0.0045;
      for (const q of pts) {
        const a = Math.max(0, 1 - q.age / LIFE);
        pset.pos[n * 4] = q.p[0]; pset.pos[n * 4 + 1] = q.p[1]; pset.pos[n * 4 + 2] = q.p[2]; pset.pos[n * 4 + 3] = size;
        pset.col[n * 4] = 0.85; pset.col[n * 4 + 1] = 0.95; pset.col[n * 4 + 2] = 1; pset.col[n * 4 + 3] = a * a * 0.9;
        n++;
      }
      // 原子核：半径约 2.7 fm，只有原子的十万分之一
      pset.pos[n * 4] = 0; pset.pos[n * 4 + 1] = 0; pset.pos[n * 4 + 2] = 0; pset.pos[n * 4 + 3] = ctx.W * 0.003;  // 只是位置标记，真实大小远小于一个像素
      pset.col[n * 4] = 1; pset.col[n * 4 + 1] = 0.85; pset.col[n * 4 + 2] = 0.6; pset.col[n * 4 + 3] = MC.smooth(0.55, 0.9, ctx.u) * 0.9;
      n++;
      pset.n = n;
      pset.draw(ctx, 1.6);
    },
    meter() {
      const m = this.state.mode;
      if (m === 'sup') return '<span>2s 与 2p 的能量差 ≈ 16.7 eV</span><span>电荷云振荡周期 ≈ 0.25 fs（此处放慢约 10¹⁶ 倍）</span>';
      if (m === 'total') return '<span>8 个电子：1s² 2s² 2p⁴</span><span>亮度 ∝ ρ<sup>0.65</sup>，以同时看清内层与外层</span>';
      return '';
    },
    info: {
      title: '原子', en: 'Oxygen Atom', badge: '量子力学 · 光电离显微',
      lead: '水分子中心的氧原子。电子不是绕核旋转的小球，而是弥散在空间中的概率振幅 ψ：云越亮，在那里测到电子的概率 |ψ|² 越大。每一次测量只给出一个点，许多次测量累积起来才显出云的形状。',
      observe: '电子云在 1980 年代以后逐渐“可见”：X 射线衍射能重建晶体中的电子密度分布；扫描隧道显微镜在 2005 年拍到单个分子的最高占据轨道；2013 年，光电离显微镜把氢原子电子的波函数节面结构直接投影到探测器上。画面里闪烁的白点模拟的正是这类单次测量：每个点按 |ψ|² 随机抽样，单个点不可预测，统计分布却精确可算。',
      method: '氧原子的 8 个电子取 1s² 2s² 2p⁴ 组态（此处画的是 2pₓ² 2p_y¹ 2p_z¹ 这一分量，三个方向平均后为球对称）。每个轨道用类氢径向函数，有效核电荷取 Clementi–Raimondi 值（1s 7.66、2s 4.49、2p 4.45），沿视线对密度做体积积分。总密度下按轨道着色；单个轨道下按 ψ 的正负着色，黑色缝隙就是 ψ = 0 的节面（2s 的球形节面、2p 的平面节面）。叠加态模式把 2s 与 2p_z 等权叠加，按哈特里–福克轨道能差（≈ 16.7 eV）演化，颜色表示复相位，可以看到电荷云沿 z 轴来回晃动，这就是原子发光时的振荡偶极子。\n原子核在中心，半径约 2.7 fm，只有原子的十万分之一，所以放大到底也只是一个光点。1s 电子在原子核处的密度不为零，它确实会“穿过”原子核，这也是电子俘获衰变能发生的原因。',
      facts: [['电子组态', '1s² 2s² 2p⁴（³P）'], ['1s 轨道半径 a₀/Z', '≈ 6.9 pm'], ['2p 径向峰', '≈ 24 pm'], ['共价半径', '66 pm'], ['第一电离能', '13.62 eV'], ['原子核半径 / 原子半径', '≈ 1 / 20 000'], ['原子核占原子质量', '99.97%']]
    },
    notes: [
      { u: 0.05, text: '电子云：每个白点是一次假想的位置测量' },
      { u: 0.45, text: '外层的 2s、2p 电子决定了氧的化学性质' },
      { u: 0.72, text: '1s 内层电子紧贴原子核，半径只有约 7 pm' },
      { u: 0.9, text: '中心那个点是原子核，还要再放大一万倍' }
    ]
  };
  MC.SCENES.push(scene);
})();
