/* 场景 4 · 氧-16 原子核（单位：fm） */
(function () {
  const MC = window.MC;
  const MHO_A = 1.833, MHO_AL = 1.544;   // de Vries, De Jager & De Vries 1987，¹⁶O 修正谐振子型电荷分布

  const FS = `
uniform vec4 uNuc[16];
uniform vec4 uPa[4], uPb[4];
// uP0: x 模式(0 瞬时构型 / 1 实测电荷密度), y 目标距离, z 近裁剪, w 曝光
const float AN=.2425;   // 指数型密度的标度长度，使均方根半径为 0.84 fm
float segD(vec3 p, vec3 a, vec3 b){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h); }
float mho(float r){ float x=r/${MHO_A}; return (1.+${MHO_AL}*x*x)*exp(-x*x); }
vec3 inferno(float x){
  x=clamp(x,0.,1.);
  vec3 a=vec3(.0015,.0005,.014), b=vec3(.26,.04,.41), c=vec3(.73,.21,.33), d=vec3(.98,.55,.04), e=vec3(.99,1.,.64);
  return x<.25? mix(a,b,x*4.) : x<.5? mix(b,c,(x-.25)*4.) : x<.75? mix(c,d,(x-.5)*4.) : mix(d,e,(x-.75)*4.);
}
void main(){
  vec3 rd=rayDir(gl_FragCoord.xy), ro=uRo;
  vec2 sp=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec3 col=vec3(0.); float tr=1.;
  float t0,t1;
  if(uP0.x<.5){
    if(sphIntersect(ro,rd,vec3(0.),7.,t0,t1)){
      float t=max(t0,max(0.,uP0.y-uP0.z));
      float dtMin=clamp(uW*.01,.006,.05);
      float jit=hash12(gl_FragCoord.xy+fract(uTime)*11.);
      for(int i=0;i<140;i++){
        vec3 p=ro+rd*t;
        float dp=0., dn=0., dm=9.;
        for(int k=0;k<16;k++){ vec4 n=uNuc[k]; float l=length(p-n.xyz); dm=min(dm,l); float e=exp(-l/AN); dp+=e*n.w; dn+=e*(1.-n.w); }
        float pi=0.;
        for(int k=0;k<4;k++){ if(uPa[k].w<=0.) continue; float d=segD(p,uPa[k].xyz,uPb[k].xyz); dm=min(dm,d+.3); pi+=uPa[k].w*exp(-d*d/.06); }
        float dt=clamp(dm*.28,dtMin,.35)*(i==0?jit:1.);
        vec3 e=vec3(1.,.42,.16)*sqrt(dp)+vec3(.28,.52,1.)*sqrt(dn)+vec3(.55,1.,.6)*pi*.25;
        col+=tr*e*dt*uP0.w;
        tr*=exp(-(dp+dn)*dt*.9);
        t+=dt; if(t>t1||tr<.01) break;
      }
    }
  } else {
    // 实测电荷密度：过中心、垂直视线的截面，等值线每 10%
    float tp=dot(-ro,uCf)/dot(rd,uCf);
    vec3 p=ro+rd*tp; float r=length(p);
    if(sphIntersect(ro,rd,vec3(0.),6.,t0,t1)){
      float t=max(t0,0.); float dt=(t1-t)/48.;
      for(int i=0;i<48;i++){ vec3 q=ro+rd*(t+dt*(float(i)+.5)); if(t+dt*float(i)>tp) break; col+=vec3(1.,.55,.25)*mho(length(q))*dt*.05; }
    }
    if(tp>0. && r<6.){
      float v=mho(r)/1.085;
      vec3 c=inferno(v*.92+.04);
      float lv=v*10.; float fw=fwidth(lv);
      float line=1.-smoothstep(0.,fw*1.2,abs(fract(lv+.5)-.5));
      c=mix(c,vec3(1.),line*.35*step(.05,v));
      float ring=1.-smoothstep(0.,fwidth(r)*1.5,abs(r-2.70));
      float dash=step(.5,fract(atan(p.y,p.x)*12./PI));
      c=mix(c,vec3(.55,.85,1.),ring*dash*.9);
      float a=smoothstep(6.,5.6,r);
      col=mix(col,c,a*.96);
      tr=1.-a;
    }
  }
  col+=tr*vec3(.004,.003,.008)*(1.-length(sp));
  col=aces(col);
  outColor=vec4(toSRGB(col)+dither(gl_FragCoord.xy),1.);
}`;

  /* ---------- 瞬时构型：四个 α 团簇位于正四面体顶点 ---------- */
  const TET = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map((v) => v.map((x) => x / Math.sqrt(3)));
  const D = 2.25;                         // 团簇中心到质心的距离，使点核子均方根半径 ≈ 2.6 fm
  const SIG = 1.48;                       // 团簇内核子相对团簇中心的每轴涨落
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const nuc = [];
  for (let i = 0; i < 16; i++) {
    const w = [];
    for (let a = 0; a < 3; a++) for (let k = 0; k < 3; k++) w.push({ f: 0.25 + rnd() * 0.9, ph: rnd() * 6.283, amp: SIG * (0.45 + rnd() * 0.5) });
    nuc.push({ c: Math.floor(i / 4), p: i % 4 < 2 ? 1 : 0, w, pos: [0, 0, 0] });
  }
  const buf = new Float32Array(64), pa = new Float32Array(16), pb = new Float32Array(16);
  const links = [];
  let T = 0, linkAcc = 0;
  function rotate(v, a, b) { // 先绕 y 再绕 x
    let [x, y, z] = v;
    let c = Math.cos(a), s = Math.sin(a); [x, z] = [c * x + s * z, -s * x + c * z];
    c = Math.cos(b); s = Math.sin(b); [y, z] = [c * y - s * z, s * y + c * z];
    return [x, y, z];
  }
  function updateNuc(dt) {
    T += dt * 0.6;
    const br = 1 + 0.06 * Math.sin(T * 1.3);
    nuc.forEach((n, i) => {
      const cc = rotate(TET[n.c], T * 0.21, T * 0.13).map((x) => x * D * br);
      const o = [0, 0, 0];
      for (let a = 0; a < 3; a++) for (let k = 0; k < 3; k++) { const w = n.w[a * 3 + k]; o[a] += w.amp / 1.7 * Math.sin(T * w.f * 2.2 + w.ph); }
      n.pos = [cc[0] + o[0], cc[1] + o[1], cc[2] + o[2]];
      buf.set([n.pos[0], n.pos[1], n.pos[2], n.p], i * 4);
    });
    // 介子交换（汤川图像）：相距 < 2.2 fm 的核子之间偶尔闪现
    linkAcc += dt * 5;
    while (linkAcc >= 1) {
      linkAcc -= 1;
      const i = Math.floor(rnd() * 16), j = Math.floor(rnd() * 16);
      if (i !== j && Math.hypot(nuc[i].pos[0] - nuc[j].pos[0], nuc[i].pos[1] - nuc[j].pos[1], nuc[i].pos[2] - nuc[j].pos[2]) < 2.2 && links.length < 4) links.push({ i, j, age: 0 });
    }
    for (const l of links) l.age += dt;
    while (links.length && links[0].age > 0.35) links.shift();
    pa.fill(0); pb.fill(0);
    links.forEach((l, k) => {
      const a = nuc[l.i].pos, b = nuc[l.j].pos, s = Math.sin(Math.PI * l.age / 0.35);
      pa.set([a[0], a[1], a[2], s], k * 4); pb.set([b[0], b[1], b[2], 0], k * 4);
    });
  }
  updateNuc(0);

  function profileSVG() {
    const W = 220, H = 92, P = 22;
    let d = '';
    for (let i = 0; i <= 60; i++) { const r = i / 10; const x = r / 6; const v = (1 + MHO_AL * (r / MHO_A) ** 2) * Math.exp(-((r / MHO_A) ** 2)) / 1.1; d += (i ? 'L' : 'M') + (P + x * (W - P - 6)).toFixed(1) + ',' + (H - 16 - v * (H - 26)).toFixed(1); }
    const xr = P + 2.7 / 6 * (W - P - 6);
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="氧-16 电荷密度随半径的分布">
      <line x1="${P}" y1="${H - 16}" x2="${W - 6}" y2="${H - 16}" stroke="#66717f" stroke-width="1"/>
      <line x1="${P}" y1="6" x2="${P}" y2="${H - 16}" stroke="#66717f" stroke-width="1"/>
      <line x1="${xr}" y1="8" x2="${xr}" y2="${H - 16}" stroke="#8ecfff" stroke-dasharray="3 3" stroke-width="1"/>
      <path d="${d}" fill="none" stroke="#f2c27c" stroke-width="1.6"/>
      ${[0, 2, 4, 6].map((r) => `<text x="${P + r / 6 * (W - P - 6)}" y="${H - 3}" fill="#9ba7b5" font-size="10" text-anchor="middle" font-family="IBM Plex Mono, monospace">${r}</text>`).join('')}
      <text x="${W - 6}" y="${H - 20}" fill="#9ba7b5" font-size="10" text-anchor="end" font-family="IBM Plex Mono, monospace">r / fm</text>
      <text x="${xr + 4}" y="16" fill="#8ecfff" font-size="10" font-family="IBM Plex Mono, monospace">rms 2.70</text>
      <text x="${P + 4}" y="16" fill="#9ba7b5" font-size="10" font-family="IBM Plex Mono, monospace">ρ_ch</text></svg>`;
  }
  const SVG = profileSVG();

  MC.SCENES.push({
    key: 'nucleus',
    range: [-13.8, -14.85],
    unit: 1e-15,
    fs: FS,
    pitch: 0.3,
    spin: 0.05,
    bloom: 0.5,
    state: { mode: 'snap' },
    controls: [{ key: 'mode', label: '显示', options: [['snap', '瞬时构型（理论）'], ['charge', '电荷密度（实测）']] }],
    legend: [['#ff6b29', '质子'], ['#4785ff', '中子'], ['#8cff99', '介子交换（模型图像）']],
    onControl(k, v) {
      this.legend = v === 'snap' ? [['#ff6b29', '质子'], ['#4785ff', '中子'], ['#8cff99', '介子交换（模型图像）']]
        : [['linear-gradient(90deg,#000,#42096a,#ba3654,#fa8c0a,#fcffa4)', '电荷密度（截面，等值线每 10%）'], ['#8ecfff', '均方根半径 2.70 fm']];
      document.getElementById('cLegend').innerHTML = this.legend.map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join('');
    },
    update(dt) { updateNuc(dt); },
    getTarget(u) {
      if (this.state.mode !== 'snap') return [0, 0, 0];
      const k = MC.smooth(0.35, 0.85, u), p = nuc[0].pos;
      return [p[0] * k, p[1] * k, p[2] * k];
    },
    uniforms(gl, prog, ctx) {
      gl.uniform4fv(prog.u('uNuc[0]'), buf);
      gl.uniform4fv(prog.u('uPa[0]'), pa);
      gl.uniform4fv(prog.u('uPb[0]'), pb);
      const clipD = 9 + (1.3 - 9) * MC.smooth(0.3, 0.85, ctx.u);
      gl.uniform4f(prog.u('uP0'), this.state.mode === 'snap' ? 0 : 1, ctx.dist, clipD, 0.6 * Math.pow(Math.min(1, ctx.W / 14), 0.3));
    },
    meter() { return this.state.mode === 'charge' ? SVG + '<span>电子散射测得，修正谐振子型拟合</span>' : '<span>8 个质子 + 8 个中子</span><span>核子费米速度 ≈ 0.25c，此处放慢约 10²² 倍</span>'; },
    info: {
      title: '原子核', en: 'Oxygen-16 Nucleus', badge: '电子散射 · 第一性原理计算',
      lead: '氧原子的中心：8 个质子和 8 个中子挤在直径约 5 fm 的范围里，密度高达每立方厘米 2.7 亿吨。核子本身有大小，彼此大面积重叠，并以约四分之一光速不停运动。',
      observe: '原子核太小，任何显微镜都看不到。我们用高能电子去“照”它：电子只感受电磁力，按散射角统计电子数，再做傅里叶反演，就得到电荷的空间分布。霍夫斯塔特因此获得 1961 年诺贝尔奖。切换到“电荷密度（实测）”可以看到 ¹⁶O 的实测结果：密度在约 1 fm 处略有起伏，均方根电荷半径 2.70 fm。\n测到的是对量子态的平均。¹⁶O 基态自旋为零，平均后必然是球对称的；但“格点有效场论”等第一性原理计算显示，它在某一瞬间更像由四个 α 粒子（各含 2 质子 2 中子）排成的正四面体。',
      method: '“瞬时构型”画的是一种可能的快照：四个 α 团簇位于正四面体顶点，距中心 2.25 fm；每个核子在团簇内随时间涨落，涨落幅度与团簇间距一起使电荷均方根半径约为 2.7 fm，与实验相符。每个核子不是硬球，而是均方根半径 0.84 fm 的指数型密度分布（质子电荷半径的实测值），橙色为质子、蓝色为中子，叠加后体积积分。偶尔闪现的绿色细带表示两核子交换一个虚 π 介子，这是汤川秀树的核力模型图像，作用距离约 1.4 fm。\n“电荷密度（实测）”画的是 de Vries 等人 1987 年汇编的 ¹⁶O 电荷分布 ρ(r) ∝ [1 + α(r/a)²] e^{−(r/a)²}，a = 1.833 fm，α = 1.544，取过中心的截面并画出等值线。',
      facts: [['质子 / 中子', '8 / 8'], ['均方根电荷半径', '2.70 fm'], ['核物质密度', '0.16 核子/fm³ ≈ 2.7×10¹⁷ kg/m³'], ['每核子结合能', '7.98 MeV'], ['核子费米动量', '≈ 250 MeV/c'], ['强力作用距离', '≈ 1.4 fm（π 介子康普顿波长）']],
      refs: '电荷分布参数：H. de Vries, C. W. de Jager, C. de Vries, Atomic Data and Nuclear Data Tables 36 (1987) 495。α 团簇结构：Epelbaum 等，Phys. Rev. Lett. 112 (2014) 102501。'
    },
    notes: [
      { u: 0.05, text: '原子核：比原子小约两万倍，却集中了 99.97% 的质量' },
      { u: 0.45, text: '核子彼此重叠，没有清晰的边界' },
      { u: 0.82, text: '靠近一个质子' }
    ]
  });
})();
