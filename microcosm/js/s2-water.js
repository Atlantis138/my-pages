/* 场景 2 · 液态水（单位：Å）
   构型：TIP3P 水模型 + Metropolis 蒙特卡洛（300 K），96 个分子
   画面：原子叠加电子密度（Slater 轨道）等值面，表面按静电势着色 */
(function () {
  const MC = window.MC;
  const N = 96, RW = 8.9;
  const QO = -0.834, QH = 0.417, KC = 332.0636, SIG = 3.15061, EPS = 0.1521, KT = 0.5962;
  const HX = 0.75695, HY = 0.58588;   // O–H 0.9572 Å，∠HOH 104.52°

  /* ---------- 蒙特卡洛 ---------- */
  const O = new Float64Array(N * 3), Q = new Float64Array(N * 4); // 氧位置、取向四元数
  const site = new Float64Array(N * 9);                            // 三个位点的坐标
  function rotv(q, x, y, z, out, o) {
    const [w, a, b, c] = q;
    const tx = 2 * (b * z - c * y), ty = 2 * (c * x - a * z), tz = 2 * (a * y - b * x);
    out[o] = x + w * tx + (b * tz - c * ty); out[o + 1] = y + w * ty + (c * tx - a * tz); out[o + 2] = z + w * tz + (a * ty - b * tx);
  }
  const tmpS = new Float64Array(9);
  function sitesOf(i, ox, oy, oz, q, out) {
    out[0] = ox; out[1] = oy; out[2] = oz;
    rotv(q, HX, HY, 0, out, 3); out[3] += ox; out[4] += oy; out[5] += oz;
    rotv(q, -HX, HY, 0, out, 6); out[6] += ox; out[7] += oy; out[8] += oz;
  }
  const QS = [QO, QH, QH];
  function pairE(a, b) { // a, b: 9 元数组
    let e = 0;
    const dx = a[0] - b[0], dy = a[1] - b[1], dz = a[2] - b[2];
    const r2 = dx * dx + dy * dy + dz * dz;
    if (r2 > 144) return 0;
    const s6 = Math.pow(SIG * SIG / r2, 3);
    e += 4 * EPS * (s6 * s6 - s6);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const x = a[i * 3] - b[j * 3], y = a[i * 3 + 1] - b[j * 3 + 1], z = a[i * 3 + 2] - b[j * 3 + 2];
      e += KC * QS[i] * QS[j] / Math.sqrt(x * x + y * y + z * z);
    }
    return e;
  }
  function wallE(x, y, z) { const r = Math.hypot(x, y, z); return r > RW ? 4 * (r - RW) * (r - RW) : 0; }
  const view = (arr, i) => arr.subarray(i * 9, i * 9 + 9);
  function energyOf(i, s) {
    let e = wallE(s[0], s[1], s[2]);
    for (let j = 0; j < N; j++) if (j !== i) e += pairE(s, view(site, j));
    return e;
  }
  let rng = 12345;
  const rand = () => { rng = (rng * 1664525 + 1013904223) >>> 0; return rng / 4294967296; };
  function randQuat() {
    const u1 = rand(), u2 = rand() * 2 * Math.PI, u3 = rand() * 2 * Math.PI;
    return [Math.sqrt(1 - u1) * Math.sin(u2), Math.sqrt(1 - u1) * Math.cos(u2), Math.sqrt(u1) * Math.sin(u3), Math.sqrt(u1) * Math.cos(u3)];
  }
  function qmul(a, b) {
    return [a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3], a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2], a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1], a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]];
  }
  function init() {
    const cand = [];
    const a = Math.cbrt(29.9);
    for (let x = -4; x <= 4; x++) for (let y = -4; y <= 4; y++) for (let z = -4; z <= 4; z++) {
      const p = [x * a + (rand() - 0.5) * 0.4, y * a + (rand() - 0.5) * 0.4, z * a + (rand() - 0.5) * 0.4];
      cand.push(p);
    }
    cand.sort((p, q) => Math.hypot(...p) - Math.hypot(...q));
    for (let i = 0; i < N; i++) {
      O[i * 3] = cand[i][0]; O[i * 3 + 1] = cand[i][1]; O[i * 3 + 2] = cand[i][2];
      const q = randQuat(); Q.set(q, i * 4);
      sitesOf(i, O[i * 3], O[i * 3 + 1], O[i * 3 + 2], q, view(site, i));
    }
    for (let k = 0; k < 180 * N; k++) step(0.16, 0.22);
    disp.set(site);
  }
  let acc = 0, tries = 0;
  function step(dmax, amax) {
    const i = Math.floor(rand() * N);
    const s = view(site, i);
    const e0 = energyOf(i, s);
    const nx = O[i * 3] + (rand() - 0.5) * 2 * dmax, ny = O[i * 3 + 1] + (rand() - 0.5) * 2 * dmax, nz = O[i * 3 + 2] + (rand() - 0.5) * 2 * dmax;
    let ax = rand() - 0.5, ay = rand() - 0.5, az = rand() - 0.5; const al = Math.hypot(ax, ay, az) || 1;
    const ang = (rand() - 0.5) * 2 * amax, sh = Math.sin(ang / 2);
    const dq = [Math.cos(ang / 2), ax / al * sh, ay / al * sh, az / al * sh];
    const q0 = [Q[i * 4], Q[i * 4 + 1], Q[i * 4 + 2], Q[i * 4 + 3]];
    const nq = qmul(dq, q0);
    sitesOf(i, nx, ny, nz, nq, tmpS);
    const e1 = energyOf(i, tmpS);
    tries++;
    if (e1 <= e0 || rand() < Math.exp(-(e1 - e0) / KT)) {
      O[i * 3] = nx; O[i * 3 + 1] = ny; O[i * 3 + 2] = nz; Q.set(nq, i * 4); s.set(tmpS); acc++;
    }
  }
  /* 显示用的平滑坐标 + 氢键统计 */
  const disp = new Float64Array(N * 9);
  let center = 0, hbAvg = 3.4;
  function countHB() {
    let tot = 0, n = 0;
    for (let i = 0; i < N; i++) {
      const oi = view(site, i);
      if (Math.hypot(oi[0], oi[1], oi[2]) > 5.5) continue;
      let c = 0;
      for (let j = 0; j < N; j++) {
        if (j === i) continue;
        const oj = view(site, j);
        const dx = oj[0] - oi[0], dy = oj[1] - oi[1], dz = oj[2] - oi[2];
        const r = Math.hypot(dx, dy, dz);
        if (r > 3.5) continue;
        // i 作供体或 j 作供体：H–O···O 夹角 < 30°
        for (const [d, a, sgn] of [[oi, oj, 1], [oj, oi, -1]]) {
          for (let h = 1; h <= 2; h++) {
            const hx = d[h * 3] - d[0], hy = d[h * 3 + 1] - d[1], hz = d[h * 3 + 2] - d[2];
            const cos = (hx * dx + hy * dy + hz * dz) * sgn / (Math.hypot(hx, hy, hz) * r);
            if (cos > 0.866) c++;
          }
        }
      }
      tot += c; n++;
    }
    return n ? tot / n : 0;
  }

  const FS = `
uniform highp sampler2D uMol;
const int NM=${N};
const float BH=1.8897261;
float rhoO(float r){ r*=BH; return 286.2*exp(-15.32*r)+38.54*r*r*exp(-4.55*r); }
float rhoH(float r){ r*=BH; return .607*exp(-2.48*r); }
const float ISO=.025;
int nc; vec3 cO[16], c1[16], c2[16]; vec2 cT[16];
float dens(vec3 p, float t){
  float s=0.;
  for(int k=0;k<16;k++){ if(k>=nc) break; if(t<cT[k].x||t>cT[k].y) continue;
    s+=rhoO(length(p-cO[k]))+rhoH(length(p-c1[k]))+rhoH(length(p-c2[k])); }
  return s;
}
float densAll(vec3 p){
  float s=0.;
  for(int k=0;k<16;k++){ if(k>=nc) break; s+=rhoO(length(p-cO[k]))+rhoH(length(p-c1[k]))+rhoH(length(p-c2[k])); }
  return s;
}
float esp(vec3 p){
  float v=0.;
  for(int i=0;i<NM;i++){
    vec4 a=texelFetch(uMol,ivec2(i,0),0), b=texelFetch(uMol,ivec2(i,1),0), c=texelFetch(uMol,ivec2(i,2),0);
    v+=a.w/max(length(p-a.xyz),.35)+b.w/max(length(p-b.xyz),.35)+c.w/max(length(p-c.xyz),.35);
  }
  return v;
}
void main(){
  vec3 rd=rayDir(gl_FragCoord.xy), ro=uRo;
  float dist=uP0.x, clipD=uP0.y;
  float tStart=max(0.,dist-clipD);
  nc=0; float tmin=1e9, tmax=0.;
  for(int i=0;i<NM;i++){
    vec3 o=texelFetch(uMol,ivec2(i,0),0).xyz;
    float a,b;
    if(sphIntersect(ro,rd,o,2.7,a,b) && b>tStart && nc<16){
      cO[nc]=o; c1[nc]=texelFetch(uMol,ivec2(i,1),0).xyz; c2[nc]=texelFetch(uMol,ivec2(i,2),0).xyz;
      cT[nc]=vec2(max(a,tStart),b); tmin=min(tmin,max(a,tStart)); tmax=max(tmax,b); nc++;
    }
  }
  vec2 sp=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec3 bg=mix(vec3(.010,.022,.05),vec3(.002,.004,.012),length(sp)*1.2);
  vec3 fogC=vec3(.012,.03,.07);
  vec3 col=vec3(0.); float tr=1.;
  bool hit=false; float t=tmin;
  if(nc>0){
    float dt=.09; t=tmin+dt*hash12(gl_FragCoord.xy);
    float prev=dens(ro+rd*t,t);
    bool started=prev<ISO;
    for(int i=0;i<320;i++){
      t+=dt; if(t>tmax) break;
      vec3 p=ro+rd*t; float d=dens(p,t);
      // 低密度区的电子云辉光（氢键处更亮）
      float g=smoothstep(.0015,.012,d)*(1.-smoothstep(.02,ISO,d));
      float fog=smoothstep(dist+1.,dist+10.,t);
      col+=tr*g*dt*vec3(.30,.50,.85)*.16*(1.-fog);
      if(!started){ if(d<ISO) started=true; prev=d; continue; }
      if(d>=ISO){
        float ta=t-dt, tb=t;
        for(int k=0;k<5;k++){ float tm=.5*(ta+tb); if(dens(ro+rd*tm,tm)>=ISO) tb=tm; else ta=tm; }
        t=tb; hit=true; break;
      }
      prev=d;
    }
  }
  if(hit){
    vec3 p=ro+rd*t;
    float e=.02;
    vec3 gr=vec3(densAll(p+vec3(e,0,0))-densAll(p-vec3(e,0,0)),densAll(p+vec3(0,e,0))-densAll(p-vec3(0,e,0)),densAll(p+vec3(0,0,e))-densAll(p-vec3(0,0,e)));
    vec3 n=-normalize(gr);
    float phi=esp(p);                         // e/Å
    float x=clamp(phi/.2,-1.,1.); x=sign(x)*pow(abs(x),.8);
    vec3 neg=vec3(.80,.16,.08), mid=vec3(.55,.53,.50), pos=vec3(.10,.30,.82);
    vec3 alb=x<0.? mix(mid,neg,-x) : mix(mid,pos,x);
    vec3 v=-rd;
    vec3 L1=normalize(vec3(.6,.8,.4));
    float occ=clamp(1.-(densAll(p+n*.55)-.004)*14.,.25,1.);
    float dif=max(dot(n,L1),0.);
    float spec=pow(max(dot(reflect(-L1,n),v),0.),40.);
    float fr=pow(1.-max(dot(n,v),0.),3.);
    vec3 c=alb*(.07+.95*dif)*occ+vec3(.9,.95,1.)*spec*.3+vec3(.35,.55,1.)*fr*.22*occ;
    float fog=smoothstep(dist+1.,dist+10.,t);
    c=mix(c,fogC,fog*.92);
    col+=tr*c; tr=0.;
  }
  col+=tr*bg;
  col=aces(col*1.0);
  outColor=vec4(toSRGB(col)+dither(gl_FragCoord.xy),1.);
}`;

  let tex = null, buf = new Float32Array(N * 3 * 4), simReady = false, hbT = 0;
  MC.SCENES.push({
    key: 'water',
    range: [-8.6, -9.5],
    unit: 1e-10,
    fs: FS,
    pitch: 0.3,
    spin: 0.05,
    bloom: 0.2,
    legend: [['#dc4229', '负静电势（氧的孤对电子）'], ['#cdc8bd', '中性'], ['#2e6bdb', '正静电势（氢）']],
    init(gl) {
      init(); simReady = true;
      let best = 1e9; for (let i = 0; i < N; i++) { const r = Math.hypot(O[i * 3], O[i * 3 + 1], O[i * 3 + 2]); if (r < best) { best = r; center = i; } }
      tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, N, 3, 0, gl.RGBA, gl.FLOAT, null);
      hbAvg = countHB();
    },
    update(dt) {
      if (!simReady) return;
      for (let k = 0; k < N * 2; k++) step(0.1, 0.16);
      const a = 1 - Math.exp(-dt * 2.2);
      for (let i = 0; i < N * 9; i++) disp[i] += (site[i] - disp[i]) * a;
      hbT += dt; if (hbT > 1) { hbT = 0; hbAvg = hbAvg * 0.6 + countHB() * 0.4; }
    },
    getTarget() { return [disp[center * 9], disp[center * 9 + 1], disp[center * 9 + 2]]; },
    uniforms(gl, prog, ctx) {
      for (let i = 0; i < N; i++) for (let s = 0; s < 3; s++) {
        const o = (s * N + i) * 4;
        buf[o] = disp[i * 9 + s * 3]; buf[o + 1] = disp[i * 9 + s * 3 + 1]; buf[o + 2] = disp[i * 9 + s * 3 + 2]; buf[o + 3] = s ? QH : QO;
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, N, 3, gl.RGBA, gl.FLOAT, buf);
      gl.uniform1i(prog.u('uMol'), 0);
      const clipD = 11 + (2.6 - 11) * MC.smooth(0.25, 0.85, ctx.u);
      gl.uniform4f(prog.u('uP0'), ctx.dist, clipD, 0, 0);
    },
    meter() { return `<span>内部分子平均氢键数 <b>${hbAvg.toFixed(2)}</b></span><span>蒙特卡洛接受率 ${(acc / Math.max(1, tries) * 100).toFixed(0)}%</span>`; },
    info: {
      title: '液态水', en: 'Liquid Water', badge: '计算 · X 射线/中子衍射',
      lead: '放大一千万倍后，水不再连续。每个水分子是一团弯折的电子云，氧端带负电、氢端带正电；相邻分子靠氢键连成一张时刻重组的三维网络，每个氢键只存在约一皮秒。',
      observe: '液态水里的分子无法逐个“拍照”。我们对它的认识来自统计测量：X 射线和中子衍射给出分子对的距离分布，第一峰在 O–O ≈ 2.8 Å；振动光谱和超快红外光谱测出氢键的寿命约为 1 ps。冰或表面上的二维水层已能用针尖带一氧化碳分子的 qPlus 原子力显微镜直接成像，可以看到单个分子与氢键的排列。',
      method: '分子构型来自页面里实时运行的蒙特卡洛模拟：96 个 TIP3P 刚性水分子（O–H 0.9572 Å、∠HOH 104.52°、氧带 −0.834e、氢各带 +0.417e，氧之间有 Lennard-Jones 作用），在 300 K 下按 Metropolis 规则不断抽样，画面把相继的构型平滑地连起来。这是统计抽样而非真实时间演化，播放速度约慢了 10¹² 倍。\n每个分子画的是电子密度：氧用 Slater 轨道（1s ζ = 7.66，2s2p ζ = 2.275），氢用 ζ = 1.24 的 1s，叠加后取 ρ = 0.025 a.u. 的等值面。在这个阈值下，相邻分子在氢键处正好连成细颈。表面颜色是全部 288 个点电荷产生的静电势，等值面外淡蓝色的辉光是更稀薄的电子云。原子核只有 10⁻⁵ Å 大，这里看不见。',
      facts: [['O–H 键长', '0.957 Å'], ['H–O–H 键角', '104.5°'], ['O–O 最近邻距离', '≈ 2.8 Å'], ['每分子氢键数（常温）', '≈ 3.5'], ['氢键能', '≈ 20 kJ/mol'], ['氢键寿命', '≈ 1 ps'], ['偶极矩（液态）', '≈ 2.9 D']]
    },
    notes: [
      { u: 0.05, text: '液态水：一张不断断开、重组的氢键网络' },
      { u: 0.5, text: '红色是氧上孤对电子的负电区，蓝色是氢的正电区；二者相对就是氢键' },
      { u: 0.85, text: '单个水分子的电子云。继续放大，进入氧原子' }
    ]
  });
})();
