/* 场景 6 · 量子场与基本粒子（单位：am = 10⁻¹⁸ m） */
(function () {
  const MC = window.MC;
  const NP = 20;
  const HBARC = 197.327;          // GeV·am
  const MZ = 91.1876, MT = 172.7;

  const FS = `
uniform vec4 uPC[${NP}];   // 虚粒子对中心 xyz，w 尺寸
uniform vec4 uPD[${NP}];   // 半间距向量 xyz，w 强度
uniform vec4 uPH[${NP}];   // x 色相，y 类型（0 费米子对 1 胶子圈）
uniform vec4 uWv, uWk;     // 路过的波包：位置/宽度，波矢/强度
// uP0: x 中心电荷亮度, y 真空涨落强度, z 模式(0 电子 1 夸克), w 曝光
// uP1: 中心粒子颜色
vec2 vac(vec3 p){
  float T=uTime*.35;
  float jf=log2(4./uW);            // 让涨落的波长始终约为视野的 1/4（无限缩放）
  float j0=floor(jf)-.5;
  vec2 c=vec2(0.);
  for(int i=0;i<2;i++){
    float j=j0+float(i); float f=exp2(j); float w=exp(-pow((j-jf)*.9,2.));
    vec3 q=p*f;
    c+=w*vec2(snoise(q+vec3(0.,0.,T*1.3)),snoise(q+vec3(17.1,-3.2,T*1.3+5.)));
  }
  return c;
}
// 高斯光团沿视线的解析积分：∫exp(-|x-c|²/s²)dl = s√π·exp(-b²/s²)，b 为光团中心到视线的距离
float blobLine(vec3 ro, vec3 rd, vec3 c, float s){
  vec3 oc=c-ro; float tc=dot(oc,rd); if(tc<0.) return 0.;
  float b2=dot(oc,oc)-tc*tc; return s*1.7725*exp(-b2/(s*s));
}
void main(){
  vec3 rd=rayDir(gl_FragCoord.xy), ro=uRo;
  vec3 col=vec3(0.); float tr=1.;
  float Rb=uW*1.6; float t0,t1;
  if(sphIntersect(ro,rd,vec3(0.),Rb,t0,t1)){
    float t=max(t0,0.); float dt=(t1-t)/56.;
    float jit=hash12(gl_FragCoord.xy+fract(uTime)*23.);
    for(int i=0;i<56;i++){
      vec3 p=ro+rd*(t+dt*(float(i)+jit));
      vec2 v=vac(p); float a2=dot(v,v);
      float hue=atan(v.y,v.x)/(2.*PI)+.5;
      float m=smoothstep(.25,1.1,a2);
      vec3 e=hsv2rgb(vec3(hue,.6,1.))*m*m*uP0.y*.3/uW;
      if(uWk.w>0.){
        vec3 x=p-uWv.xyz; float env=exp(-dot(x,x)/(2.*uWv.w*uWv.w));
        float ph=dot(uWk.xyz,x)-uTime*6.;
        e+=hsv2rgb(vec3(fract(ph/(2.*PI)),.6,1.))*env*env*(.55+.45*cos(ph))*uWk.w*2.5/uW;
      }
      col+=tr*e*dt*uP0.w;
      tr*=exp(-m*dt/uW*.15);
    }
  }
  // 中心的点粒子与虚粒子对（解析积分，不受步长限制）
  float s=uW*.012;
  vec3 c=uP1.rgb*uP0.x*(1.6*blobLine(ro,rd,vec3(0.),s)+.35*blobLine(ro,rd,vec3(0.),uW*.08))/s*.5;
  for(int k=0;k<${NP};k++){
    if(uPD[k].w<=0.) continue;
    vec3 pc=uPC[k].xyz, d=uPD[k].xyz; float sz=uPC[k].w;
    vec3 ca=uPH[k].y>.5? vec3(1.,.9,.55) : hsv2rgb(vec3(uPH[k].x,.7,1.));
    vec3 cb=uPH[k].y>.5? vec3(1.,.9,.55) : hsv2rgb(vec3(fract(uPH[k].x+.5),.7,1.));
    c+=(ca*blobLine(ro,rd,pc+d,sz)+cb*blobLine(ro,rd,pc-d,sz))*uPD[k].w/sz*.45;
  }
  col+=c*(.35+.65*tr);
  vec2 sp=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  col+=vec3(.006,.008,.012)*(1.-length(sp));
  col=aces(col);
  outColor=vec4(toSRGB(col)+dither(gl_FragCoord.xy),1.);
}`;

  /* ---------- 跑动耦合常数（单圈） ---------- */
  function alphaS(Q) {
    const a0 = 1 / 0.1180;
    if (Q <= MT) return 1 / (a0 + (7.6667 / (4 * Math.PI)) * Math.log(Q * Q / (MZ * MZ)));
    const at = a0 + (7.6667 / (4 * Math.PI)) * Math.log(MT * MT / (MZ * MZ));
    return 1 / (at + (7 / (4 * Math.PI)) * Math.log(Q * Q / (MT * MT)));
  }
  function invAlphaEM(Q) {
    let v = 127.95 - (2 / (3 * Math.PI)) * (20 / 3) * Math.log(Q / MZ);
    if (Q > MT) v -= (2 / (3 * Math.PI)) * (4 / 3) * Math.log(Q / MT);
    return v;
  }
  MC.alphaS = alphaS; MC.invAlphaEM = invAlphaEM;

  /* ---------- 虚粒子对与路过的波包 ---------- */
  const pairs = [];
  const PC = new Float32Array(NP * 4), PD = new Float32Array(NP * 4), PH = new Float32Array(NP * 4);
  let curW = 25, spawn = 0, wave = null, waveT = 1.5;
  function rdir() { let x, y, z, l; do { x = Math.random() * 2 - 1; y = Math.random() * 2 - 1; z = Math.random() * 2 - 1; l = x * x + y * y + z * z; } while (l > 1 || l < 0.01); l = Math.sqrt(l); return [x / l, y / l, z / l]; }

  const QCOL = [[1, 0.3, 0.25], [0.35, 1, 0.45], [0.35, 0.55, 1]];
  let qc = 0, qcT = 0;
  MC.SCENES.push({
    key: 'field',
    range: [-16.6, -19.4],
    unit: 1e-18,
    fs: FS,
    pitch: 0.25,
    spin: 0.03,
    bloom: 0.6,
    transLen: 1.25,
    transNote: '向下穿越实验从未触及的十几个数量级……',
    state: { kind: 'quark' },
    controls: [{ key: 'kind', label: '中心的粒子', options: [['quark', '夸克'], ['electron', '电子']] }],
    legend: [['linear-gradient(90deg,#f66,#ff6,#6f6,#6ff,#66f,#f6f)', '颜色 = 场的相位'], ['#fff0b0', '胶子圈（仅夸克）']],
    update(dt, u) {
      const lw = this.range[0] + (this.range[1] - this.range[0]) * u;
      curW = Math.pow(10, lw) / this.unit;
      spawn += dt * 16;
      while (spawn >= 1) {
        spawn -= 1;
        if (pairs.length >= NP) break;
        const r = curW * Math.exp(Math.log(0.05) + Math.random() * Math.log(0.6 / 0.05));  // 距离按对数均匀分布，越近越密
        const d = rdir(), o = rdir();
        const sep = r * (0.18 + Math.random() * 0.15);
        const glu = this.state.kind === 'quark' && Math.random() < 0.5;
        pairs.push({ c: [d[0] * r, d[1] * r, d[2] * r], d: [o[0] * sep, o[1] * sep, o[2] * sep], s: sep * 0.45, h: Math.random(), glu, age: 0, life: 0.5 + Math.random() * 0.7 });
      }
      for (const p of pairs) p.age += dt;
      for (let i = pairs.length - 1; i >= 0; i--) if (pairs[i].age > pairs[i].life) pairs.splice(i, 1);
      PD.fill(0);
      pairs.forEach((p, k) => {
        const env = Math.sin(Math.PI * p.age / p.life);
        const sep = 0.35 + 0.65 * env;   // 先分开再合拢湮灭
        PC.set([p.c[0], p.c[1], p.c[2], p.s], k * 4);
        PD.set([p.d[0] * sep, p.d[1] * sep, p.d[2] * sep, env], k * 4);
        PH.set([p.h, p.glu ? 1 : 0, 0, 0], k * 4);
      });
      waveT -= dt;
      if (!wave && waveT <= 0) {
        const dir = rdir(), side = rdir();
        const off = [side[1] * dir[2] - side[2] * dir[1], side[2] * dir[0] - side[0] * dir[2], side[0] * dir[1] - side[1] * dir[0]];
        const b = curW * (0.2 + Math.random() * 0.25);
        wave = { dir, x0: [-dir[0] * curW * 1.6 + off[0] * b, -dir[1] * curW * 1.6 + off[1] * b, -dir[2] * curW * 1.6 + off[2] * b], sig: curW * 0.09, W: curW, age: 0 };
      }
      if (wave) { wave.age += dt; if (wave.age > 5) { wave = null; waveT = 2 + Math.random() * 3; } }
      qcT -= dt; if (qcT <= 0) { qcT = 0.6 + Math.random(); qc = (qc + 1 + Math.floor(Math.random() * 2)) % 3; }
    },
    uniforms(gl, prog, ctx) {
      gl.uniform4fv(prog.u('uPC[0]'), PC); gl.uniform4fv(prog.u('uPD[0]'), PD); gl.uniform4fv(prog.u('uPH[0]'), PH);
      if (wave) {
        const v = wave.W * 0.65, s = wave.age * v;
        const x = [wave.x0[0] + wave.dir[0] * s, wave.x0[1] + wave.dir[1] * s, wave.x0[2] + wave.dir[2] * s];
        const k = 2 * Math.PI / (wave.sig * 0.7);
        gl.uniform4f(prog.u('uWv'), x[0], x[1], x[2], wave.sig);
        gl.uniform4f(prog.u('uWk'), wave.dir[0] * k, wave.dir[1] * k, wave.dir[2] * k, Math.min(1, wave.age, 5 - wave.age));
      } else gl.uniform4f(prog.u('uWk'), 0, 0, 0, 0);
      const Q = HBARC / ctx.W;
      const quark = this.state.kind === 'quark';
      const I = quark ? alphaS(Q) / 0.18 : (131.4 / invAlphaEM(Q));
      const fl = 0.55 * Math.pow(25 / ctx.W, 0.12);   // 真空涨落随分辨率提高而增强（示意性压缩）
      gl.uniform4f(prog.u('uP0'), I, fl, quark ? 1 : 0, 0.9);
      const c = quark ? QCOL[qc] : [0.55, 0.8, 1];
      gl.uniform4f(prog.u('uP1'), c[0], c[1], c[2], 0);
    },
    meter(logW) {
      const W = Math.pow(10, logW) / 1e-18;
      const Q = HBARC / W;
      const q = Q >= 1000 ? (Q / 1000).toFixed(2) + ' TeV' : Q.toFixed(1) + ' GeV';
      const s = this.state.kind === 'quark';
      return `<span>分辨率对应的能量 Q ≈ <b>${q}</b></span>
        <span>强耦合 α<sub>s</sub>(Q) = <b>${alphaS(Q).toFixed(3)}</b>${s ? ' ← 中心亮度' : ''}</span>
        <span>电磁耦合 1/α(Q) = <b>${invAlphaEM(Q).toFixed(1)}</b>${s ? '' : ' ← 中心亮度'}</span>
        <span style="color:var(--ink-3)">${Q > 2e4 ? '已超出对撞机验证范围，按标准模型外推' : '单圈近似；α<sub>s</sub>(m<sub>Z</sub>) = 0.118，1/α(m<sub>Z</sub>) = 127.95'}</span>`;
    },
    info: {
      title: '量子场', en: 'Quantum Fields', badge: '对撞机 · 量子场论',
      lead: '到这里，“粒子”这个词需要换一种理解。现代物理认为宇宙中充满了各种量子场：电子场、夸克场、光子场、胶子场、希格斯场……我们称为粒子的东西，是这些场上局域的、量子化的激发。',
      observe: '在这个尺度上，“看”就是让粒子以极高能量相撞：要分辨尺寸 λ 的结构，探针的能量约需 ħc/λ。大型强子对撞机（LHC）的部分子碰撞可达数 TeV，对应约 10⁻¹⁹–10⁻²⁰ m。至今所有实验都没有发现夸克或电子有任何内部结构，两者的尺寸上限都在 10⁻¹⁹ m 量级甚至更小。\n我们能精确测量的是耦合强度如何随分辨率变化。电子周围的虚正负电子对会屏蔽它的电荷，离得越近，看到的电荷越大：1/α 从低能的 137 降到 Z 玻色子质量处的 128。夸克则相反，虚胶子造成“反屏蔽”，靠得越近强相互作用越弱，这就是渐近自由（2004 年诺贝尔奖）。右侧的数值随缩放实时计算。',
      method: '画面是一个示意性的复数场：颜色表示相位，亮度表示振幅。背景的闪烁代表真空的零点涨落，它们的波长始终约为视野的四分之一。量子场论里，在尺度 a 上平均后的场涨落正比于 1/a，越放大越剧烈，所以这里的涨落强度随缩放增强（亮度做了压缩）。\n中心的亮点是夸克或电子，它始终是一个点；亮度按实时计算的耦合常数缩放：夸克越放大越暗（渐近自由），电子越放大越亮（电荷屏蔽，但幅度只有约 8%）。中心附近不断出现又湮灭的彩色成对光斑代表虚粒子对，颜色互补表示粒子与反粒子；夸克模式下还有暖白色的虚胶子圈。偶尔横穿画面、带有彩色条纹的光团是一个波包，也就是另一个粒子：包络决定它在哪里，条纹是它的相位。希格斯场在这里处处取非零值 v = 246 GeV，它均匀地充满空间，因此无法在画面中显示为任何结构。',
      facts: [['标准模型的场', '12 种费米子场、4 种规范场、1 种希格斯场'], ['电弱尺度 ħc / 100 GeV', '≈ 2×10⁻¹⁸ m'], ['LHC 质心能量', '13.6 TeV'], ['夸克尺寸上限', '≲ 10⁻¹⁹ m'], ['电子尺寸上限', '≲ 10⁻¹⁹ m'], ['希格斯场真空期望值', '246 GeV']]
    },
    notes: [
      { u: 0.05, text: '粒子是量子场的局域激发；中心的亮点是一个夸克' },
      { u: 0.36, text: '≈ 2×10⁻¹⁸ m：电弱尺度，W、Z 玻色子与希格斯玻色子的世界' },
      { u: 0.8, text: '≈ 10⁻¹⁹ m：LHC 的分辨极限。夸克依然是点' }
    ]
  });
})();
