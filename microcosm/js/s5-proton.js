/* 场景 5 · 质子（单位：fm） */
(function () {
  const MC = window.MC;

  const FS = `
uniform vec4 uQ[3];          // 价夸克位置 + 色荷标签
uniform vec4 uG0, uG1;       // 胶子交换的两端，w = 强度
uniform vec4 uY;             // 通量管的费马点，w = 管半径
// uP0: x 价夸克显示半径, y 真空涨落最高空间频率, z 曝光, w 通量管显示开关
vec3 qcol(float c){ return c<.5? vec3(1.,.26,.2) : c<1.5? vec3(.3,1.,.42) : vec3(.32,.5,1.); }
vec2 segDH(vec3 p, vec3 a, vec3 b){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return vec2(length(pa-ba*h),h); }
float tubeD(vec3 p){ return min(min(segDH(p,uQ[0].xyz,uY.xyz).x,segDH(p,uQ[1].xyz,uY.xyz).x),segDH(p,uQ[2].xyz,uY.xyz).x); }
float vac(vec3 p){
  float T=uTime*.22;
  float q=snoise(vec4(p*2.4,T));
  float f=5.3, a=.55;
  for(int i=0;i<3;i++){ if(f>uP0.y) break; q+=a*snoise(vec4(p*f,T*1.6+float(i)*3.1))*smoothstep(uP0.y,uP0.y*.5,f); f*=2.2; a*=.62; }
  return q;
}
void main(){
  vec3 rd=rayDir(gl_FragCoord.xy), ro=uRo;
  vec3 col=vec3(0.); float tr=1.;
  float t0,t1;
  if(sphIntersect(ro,rd,vec3(0.),2.8,t0,t1)){
    float t=max(t0,0.);
    float jit=hash12(gl_FragCoord.xy+fract(uTime)*17.);
    for(int i=0;i<120;i++){
      float dt=clamp(.07*abs(t-length(uRo)*.0)+uW*.02,uW*.025,.09);
      vec3 p=ro+rd*(t+dt*jit);
      float dT=tubeD(p);
      float supp=smoothstep(uY.w*1.5,uY.w*.55,dT)*uP0.w;
      float q=vac(p)*(1.-.85*supp);
      float pos=smoothstep(.42,.85,q), neg=smoothstep(.42,.85,-q);
      vec3 e=(pos*vec3(1.,.42,.12)+neg*vec3(.12,.52,1.))*.6;
      vec3 eq=vec3(0.);
      // 通量管：色电场集中区（内部微亮，边界一层薄光）
      e+=uP0.w*(vec3(.55,.62,.8)*.10*(1.-smoothstep(0.,uY.w,dT))+vec3(.75,.85,1.)*.7*exp(-pow((dT-uY.w)/(.022+uW*.01),2.)));
      // 质子的电荷分布轮廓（均方根 0.84 fm）
      e+=vec3(1.,.7,.45)*.035*exp(-length(p)/.2425);
      // 价夸克
      for(int k=0;k<3;k++){
        float d=length(p-uQ[k].xyz);
        eq+=qcol(uQ[k].w)*(2.2*exp(-d*d/(uP0.x*uP0.x))+.8*exp(-d*d/(uW*uW*2e-4)));
      }
      // 正在交换的胶子
      if(uG0.w>0.){
        vec2 g=segDH(p,uG0.xyz,uG1.xyz);
        float wig=.5+.5*sin(g.y*40.-uTime*25.);
        eq+=vec3(1.,.95,.75)*uG0.w*wig*3.*exp(-g.x*g.x/.0012);
      }
      col+=(tr*e+sqrt(tr)*eq)*dt*uP0.z;
      tr*=exp(-(pos+neg)*dt*.7);
      t+=dt; if(t>t1||tr<.02) break;
    }
  }
  vec2 sp=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  col+=tr*vec3(.004,.003,.007)*(1.-length(sp));
  col=aces(col);
  outColor=vec4(toSRGB(col)+dither(gl_FragCoord.xy),1.);
}`;

  /* ---------- 价夸克运动、色荷交换与费马点 ---------- */
  let seed = 3;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const Q = [0, 1, 2].map((i) => ({ c: i, w: Array.from({ length: 9 }, () => ({ f: 0.4 + rnd() * 0.9, ph: rnd() * 6.283 })), p: [0, 0, 0] }));
  const qbuf = new Float32Array(12);
  let T = 0, swapT = 0.8, gl0 = [0, 0, 0, 0], gl1 = [0, 0, 0, 0], gAge = 9, Y = [0, 0, 0];
  function fermat(P) {
    let x = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3, (P[0][2] + P[1][2] + P[2][2]) / 3];
    for (let it = 0; it < 30; it++) {
      let nx = [0, 0, 0], ws = 0;
      for (const p of P) { const d = Math.max(1e-4, Math.hypot(p[0] - x[0], p[1] - x[1], p[2] - x[2])); nx[0] += p[0] / d; nx[1] += p[1] / d; nx[2] += p[2] / d; ws += 1 / d; }
      x = nx.map((v) => v / ws);
    }
    return x;
  }
  function updQ(dt) {
    T += dt * 0.55;
    Q.forEach((q, i) => {
      const base = [Math.cos(i * 2.094 + T * 0.12), Math.sin(i * 2.094 + T * 0.12) * 0.6, Math.sin(i * 2.094 + T * 0.12) * 0.8].map((x) => x * 0.38);
      for (let a = 0; a < 3; a++) { let o = 0; for (let k = 0; k < 3; k++) { const w = q.w[a * 3 + k]; o += 0.11 * Math.sin(T * w.f * 2 + w.ph); } q.p[a] = base[a] + o; }
      qbuf.set([q.p[0], q.p[1], q.p[2], q.c], i * 4);
    });
    Y = fermat(Q.map((q) => q.p));
    swapT -= dt; gAge += dt;
    if (swapT <= 0) {
      swapT = 0.7 + rnd() * 1.4;
      const i = Math.floor(rnd() * 3); const j = (i + 1 + Math.floor(rnd() * 2)) % 3;
      gl0 = [...Q[i].p]; gl1 = [...Q[j].p]; gAge = 0;
      const c = Q[i].c; Q[i].c = Q[j].c; Q[j].c = c;   // 交换一个胶子后二者交换色荷，整体仍是色单态
    }
  }
  updQ(0);

  /* ---------- 高分辨率下出现的海夸克与胶子 ---------- */
  const partons = []; let pset = null, pacc = 0;
  const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const COL = [[1, 0.3, 0.25], [0.35, 1, 0.45], [0.35, 0.55, 1]];
  const ANTI = [[0.3, 1, 1], [1, 0.35, 1], [1, 1, 0.35]];

  MC.SCENES.push({
    key: 'proton',
    range: [-14.75, -15.75],
    unit: 1e-15,
    fs: FS,
    pitch: 0.2,
    spin: 0.05,
    bloom: 0.55,
    state: { q2: 0.6, tube: 1 },
    controls: [
      { key: 'q2', type: 'range', label: '探测分辨率 Q²', min: 0, max: 4, step: 0.01, fmt: (v) => `10${MC.sup ? MC.sup(v.toFixed(1)) : v} GeV² · ${(0.1973 / Math.sqrt(Math.pow(10, v))).toPrecision(2)} fm` },
      { key: 'tube', label: '色通量管', options: [[1, '显示'], [0, '隐藏']] }
    ],
    legend: [['#ff6a1a', '拓扑荷 > 0'], ['#1a80ff', '拓扑荷 < 0'], ['linear-gradient(90deg,#ff4233,#4dff6b,#5280ff)', '价夸克（色荷只是标签）'], ['#fff3c4', '胶子 / 海夸克']],
    init(gl) { pset = new MC.PointSet(gl, 900); },
    update(dt) {
      updQ(dt);
      const q2 = this.state.q2;
      const target = Math.round(4 + 55 * q2 + 18 * q2 * q2);     // 可分辨的部分子数随 Q² 增长（示意）
      pacc += dt * target * 2.2;
      while (pacc >= 1 && partons.length < 880) {
        pacc -= 1;
        const p = [gauss() * 0.42, gauss() * 0.42, gauss() * 0.42];
        if (Math.random() < 0.72) partons.push({ p, life: 0.25 + Math.random() * 0.5, age: 0, col: [1, 0.93, 0.7] });
        else {
          const c = Math.floor(Math.random() * 3), d = [gauss() * 0.04, gauss() * 0.04, gauss() * 0.04];
          const life = 0.15 + Math.random() * 0.3;
          partons.push({ p: [p[0] + d[0], p[1] + d[1], p[2] + d[2]], life, age: 0, col: COL[c] });
          partons.push({ p: [p[0] - d[0], p[1] - d[1], p[2] - d[2]], life, age: 0, col: ANTI[c] });
        }
      }
      for (const q of partons) q.age += dt;
      for (let i = partons.length - 1; i >= 0; i--) if (partons[i].age > partons[i].life) partons.splice(i, 1);
      while (partons.length > target * 1.6 + 6) partons.shift();
    },
    getTarget(u) { const k = MC.smooth(0.4, 0.92, u), p = Q[0].p; return [p[0] * k, p[1] * k, p[2] * k]; },
    uniforms(gl, prog, ctx) {
      const Qv = Math.sqrt(Math.pow(10, this.state.q2));
      const rq = Math.max(ctx.W * 0.012, 0.2 / Qv);        // 低 Q² 下夸克像“组分夸克”那样臃肿
      gl.uniform4fv(prog.u('uQ[0]'), qbuf);
      const gi = gAge < 0.35 ? Math.sin(Math.PI * gAge / 0.35) : 0;
      gl.uniform4f(prog.u('uG0'), gl0[0], gl0[1], gl0[2], gi);
      gl.uniform4f(prog.u('uG1'), gl1[0], gl1[1], gl1[2], 0);
      gl.uniform4f(prog.u('uY'), Y[0], Y[1], Y[2], 0.22);
      gl.uniform4f(prog.u('uP0'), rq, 7 / Math.max(ctx.W, 0.05), 0.85 * Math.pow(Math.min(1, ctx.W / 2), 0.25), this.state.tube);
    },
    drawExtra(gl, ctx) {
      if (!pset) return;
      const Qv = Math.sqrt(Math.pow(10, this.state.q2));
      const size = Math.max(0.2 / Qv, ctx.W * 0.004);
      let n = 0;
      for (const q of partons) {
        const a = Math.sin(Math.PI * q.age / q.life);
        pset.pos.set([q.p[0], q.p[1], q.p[2], size], n * 4);
        pset.col.set([q.col[0], q.col[1], q.col[2], a * 0.75], n * 4);
        n++;
      }
      pset.n = n;
      pset.draw(ctx, 1.5);
    },
    meter() {
      return '<span>质子质量 938.3 MeV 的来源（格点 QCD，2018）</span><span>夸克质量（希格斯机制）<b>≈ 9%</b> · 夸克动能 <b>≈ 32%</b></span><span>胶子场能 <b>≈ 37%</b> · 量子反常 <b>≈ 23%</b></span>';
    },
    info: {
      title: '质子', en: 'Proton', badge: '深度非弹性散射 · 格点 QCD',
      lead: '质子不是一个小球，而是三个价夸克、无数转瞬即逝的胶子和夸克–反夸克对组成的沸腾系统。三个夸克本身的质量只占质子质量的约 1%，其余几乎全部来自胶子场和夸克运动的能量。',
      observe: '1968 年，斯坦福直线加速器把 20 GeV 的电子打进质子，发现电子常以大角度反弹，说明质子里有点状的带电成分，这就是夸克存在的直接证据（1990 年诺贝尔奖）。这种“深度非弹性散射”测得的是部分子分布函数：用分辨率 Q 去看，携带动量分数 x 的夸克和胶子各有多少。分辨率越高，看到的胶子和海夸克越多，拖动右侧的 Q² 滑块就能看到这个变化。质子电荷半径的精确值 0.841 fm 则来自 μ 子氢原子的激光光谱。\n胶子场的真空涨落无法直接测量，只能在超级计算机上做格点 QCD 计算。画面里的橙色与蓝色团块正是这类计算的经典可视化：真空中的拓扑荷密度，它们不只在质子内部，而是遍布整个空间。',
      method: '真空涨落用随时间演化的四维噪声场表示，团块尺度约 0.4 fm，与格点计算中瞬子的典型大小相当；放大时会逐级出现更细的涨落。三个价夸克之间画的是 Y 形色通量管：格点 QCD（Bissey、Leinweber 等，2007）发现，夸克之间的胶子场会凝聚成管状，管内的真空涨落被排开，所以管内的团块被压低，边界以一层淡光标出。\n价夸克上的红、绿、蓝只是色荷的标签，并不是看得见的颜色；它是规范相关的量，只有三者合成的“白色”（色单态）才有物理意义。两个夸克交换胶子时，它们的色标签随之互换，画面中以一道闪过的胶子线表示。Q² 滑块控制分辨率：低 Q² 下夸克像带着胶子云的“组分夸克”，高 Q² 下夸克变成点，同时浮现大量寿命极短的胶子（暖白点）和夸克–反夸克对（成对的彩点）。部分子的数量与分布是示意性的。',
      facts: [['质量', '938.272 MeV/c²'], ['电荷半径', '0.8409 fm'], ['价夸克', 'u u d'], ['u / d 夸克质量', '≈ 2.2 / 4.7 MeV'], ['自旋 1/2 中夸克自旋的贡献', '≈ 30%'], ['平均寿命下限', '> 10³⁴ 年']],
      refs: '质量分解：Y.-B. Yang 等（χQCD），Phys. Rev. Lett. 121 (2018) 212001。Y 形通量管：F. Bissey 等，Phys. Rev. D 76 (2007) 114512。'
    },
    notes: [
      { u: 0.05, text: '橙蓝团块：胶子场的真空涨落，充满质子内外' },
      { u: 0.4, text: '三个夸克被 Y 形色通量管连在一起，管内真空涨落被排开' },
      { u: 0.8, text: '靠近一个价夸克：在目前所有实验中它都是点' }
    ]
  });
})();
