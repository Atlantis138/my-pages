/* 场景 7 · 普朗克尺度（单位：普朗克长度 ℓP = 1.616×10⁻³⁵ m）—— 推测性内容 */
(function () {
  const MC = window.MC;
  const LP = 1.616255e-35;

  const FS = `
// uP0: x 模式(0 量子泡沫 1 自旋网络 2 弦), y 度规涨落幅度 δ ~ ℓP/L, z 曝光
vec3 bendField(vec3 q, float T){ return vec3(snoise(q+vec3(0.,0.,T)),snoise(q+vec3(31.4,7.1,T)),snoise(q+vec3(-9.7,23.3,T))); }
float gridD(vec3 p, float G){ vec3 q=(fract(p/G+.5)-.5)*G; return min(min(length(q.yz),length(q.xz)),length(q.xy)); }
vec3 h3(vec3 c){ return hash33(c*1.7+vec3(3.1,7.7,1.3)); }
float segD(vec3 p, vec3 a, vec3 b){ vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.); return length(pa-ba*h); }
// 自旋网络：格点附近抖动的节点，沿三个方向随机连边
vec4 spinNet(vec3 p, float S){
  vec3 c=floor(p/S); float dE=9., dN=9., j=0.;
  for(int z=0;z<2;z++) for(int y=0;y<2;y++) for(int x=0;x<2;x++){
    vec3 cc=c+vec3(x,y,z)-.0;
    vec3 n0=(cc+.25+.5*h3(cc))*S;
    dN=min(dN,length(p-n0));
    for(int k=0;k<3;k++){
      vec3 o=k==0?vec3(-1,0,0):k==1?vec3(0,-1,0):vec3(0,0,-1);
      vec3 c2=cc+o; float keep=hash13(cc*3.3+c2*1.9);
      if(keep<.35) continue;
      vec3 n1=(c2+.25+.5*h3(c2))*S;
      float d=segD(p,n0,n1); if(d<dE){ dE=d; j=floor(keep*4.)*.5+.5; }
    }
  }
  return vec4(dE,dN,j,0.);
}
// 闭弦：截面上振动的圈（近似距离场）
float stringD(vec3 p, vec3 c, vec3 ax, float R, float ph, float n){
  vec3 q=p-c; vec3 u=normalize(cross(ax,vec3(.3,1.,.2))), v=cross(ax,u);
  float x=dot(q,u), y=dot(q,v), z=dot(q,ax);
  float th=atan(y,x); float rho=length(vec2(x,y));
  float Rt=R*(1.+.22*sin(n*th-ph)); float zt=R*.25*cos((n+1.)*th+ph*1.3);
  return length(vec2(rho-Rt,z-zt));
}
void main(){
  vec3 rd=rayDir(gl_FragCoord.xy), ro=uRo;
  float W=uW, amp=uP0.y, T=uTime*.4;
  vec3 col=vec3(0.); float tr=1.;
  float L=W*2.4; float dt=L/72.; float t=dt*hash12(gl_FragCoord.xy+fract(uTime)*5.);
  float G=W/4.;
  for(int i=0;i<72;i++){
    vec3 p=ro+rd*t;
    // 光线在涨落的度规中弯折
    vec3 b=bendField(p*(3./W),T);
    rd=normalize(rd+b*amp*dt/W*.55);
    vec3 e=vec3(0.);
    if(uP0.x<.5){
      float f=snoise(vec4(p*(2.2/W),T*1.5));
      float sh=exp(-f*f/.0025)*smoothstep(.12,.7,amp);
      vec3 ir=mix(vec3(.7,.8,1.),.5+.5*cos(6.2831*(f*3.+dot(rd,vec3(.3,.5,.7))+vec3(0.,.33,.67))),.45);
      e+=ir*sh*.22;
    } else if(uP0.x<1.5){
      vec4 s=spinNet(p,W/2.6);
      float w=W*.006*sqrt(s.z*(s.z+1.));
      e+=vec3(.75,.6,1.)*exp(-s.x*s.x/(w*w))*1.4+vec3(1.,.9,1.)*exp(-s.y*s.y/(W*W*2e-4))*2.;
    } else {
      float d=9.;
      for(int k=0;k<4;k++){
        vec3 hk=hash33(vec3(float(k)*3.7,1.,2.));
        vec3 c=(hk-.5)*vec3(2.6,1.6,2.6);
        d=min(d,stringD(p,c,normalize(hk-.4),.55+.3*hk.x,uTime*(1.5+hk.y)+hk.z*6.,2.+floor(hk.y*4.)));
      }
      float w=max(W*.004,.02);
      e+=vec3(1.,.78,.45)*exp(-d*d/(w*w))*1.6;
    }
    col+=tr*e*dt/W*uP0.z;
    t+=dt;
  }
  // 远处的参考坐标网格（经纬线），通过弯折后的光线看去：大尺度上规整，接近 ℓP 时被搅乱
  float az=atan(rd.x,rd.z)/(PI/12.), el=asin(clamp(rd.y,-1.,1.))/(PI/12.);
  vec2 g=abs(fract(vec2(az,el)+.5)-.5); vec2 fw=fwidth(vec2(az,el))*1.2;
  float gl=max(1.-smoothstep(0.,fw.x+.004,g.x),1.-smoothstep(0.,fw.y+.004,g.y));
  col+=tr*vec3(.30,.42,.80)*gl*.55;
  vec2 sp=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  col+=vec3(.006,.004,.012)*(1.-length(sp));
  col=aces(col);
  outColor=vec4(toSRGB(col)+dither(gl_FragCoord.xy),1.);
}`;

  MC.SCENES.push({
    key: 'planck',
    range: [-33.0, -35.3],
    unit: LP,
    fs: FS,
    pitch: 0.25,
    spin: 0.03,
    bloom: 0.6,
    speculative: true,
    state: { mode: 'foam' },
    controls: [{ key: 'mode', label: '假说（均未经实验证实）', options: [['foam', '量子泡沫'], ['spin', '圈量子引力'], ['string', '弦论']] }],
    legend: [['#5973bf', '参考坐标网格（被度规涨落扭曲）']],
    uniforms(gl, prog, ctx) {
      const m = { foam: 0, spin: 1, string: 2 }[this.state.mode];
      const amp = Math.min(1, 1.6 / ctx.W);
      gl.uniform4f(prog.u('uP0'), m, amp, 0.8, 0);
    },
    meter(logW) {
      const L = Math.pow(10, logW) / LP;
      return `<span>视野 ≈ <b>${L >= 10 ? L.toFixed(0) : L.toFixed(2)} ℓ<sub>P</sub></b></span><span>预期度规涨落 δg ~ ℓ<sub>P</sub>/L ≈ <b>${Math.min(1, 1 / L).toPrecision(2)}</b></span>${this.state.mode === 'spin' ? '<span>面积本征值 A = 8πγℓ<sub>P</sub>² Σ√(j(j+1))</span>' : ''}`;
    },
    info: {
      title: '普朗克尺度', en: 'Planck Length', badge: '推测 · 尚无实验',
      lead: '1.6×10⁻³⁵ m，比质子小 10²⁰ 倍。在这里，量子力学与引力同样重要：时空本身的几何也应当像其他量子场一样涨落。我们还没有被实验确认的量子引力理论，这一站展示的都是假说。',
      observe: '没有任何实验能直接探测这个尺度：分辨普朗克长度需要约 10¹⁹ GeV 的能量，比 LHC 高 10¹⁵ 倍。科学家只能寻找间接痕迹。例如 2009 年费米伽马射线望远镜观测暴发 GRB 090510，能量相差百万倍的光子穿越 70 多亿光年几乎同时到达，排除了一类“光速随能量线性变化、特征能标低于普朗克能量”的时空泡沫模型。\n在普朗克尺度与 LHC 之间，还隔着约 15 个数量级的未知区域。大统一理论预言，三种规范相互作用大约在 10⁻³² m（约 10¹⁶ GeV）附近趋于统一，但这同样尚未证实。',
      method: '三种画面都基于同一个估计：在尺度 L 上，时空度规的量子涨落约为 δg ~ ℓP/L。画面中的蓝色网格是一套参考坐标，光线穿过时按随机的度规扰动偏折，扰动幅度按 ℓP/L 计算，所以视野几十个普朗克长度时网格几乎笔直，放大到一个普朗克长度附近就被搅成一团。\n“量子泡沫”是惠勒 1955 年提出的图像：时空在最小尺度上不断改变拓扑，像泡沫一样。“圈量子引力”把空间看成自旋网络，网络的每条边携带量子数 j，穿过它的面积只能取分立的值。“弦论”认为基本单元是振动的弦，弦长可能接近普朗克长度（具体数值依赖模型），不同振动模式对应不同粒子；这里的弦长与振动模式只是示意。三者都不是对真实形态的描绘。',
      facts: [['普朗克长度 √(ħG/c³)', '1.616×10⁻³⁵ m'], ['普朗克时间', '5.39×10⁻⁴⁴ s'], ['普朗克能量', '1.22×10¹⁹ GeV'], ['与质子半径之比', '≈ 2×10⁻²⁰'], ['大统一能标（推测）', '≈ 10¹⁶ GeV'], ['实验状态', '无直接探测手段']],
      refs: 'GRB 090510：A. A. Abdo 等，Nature 462 (2009) 331。'
    },
    notes: [
      { u: 0.04, text: '普朗克尺度：这里的一切都是推测' },
      { u: 0.55, text: '视野只剩几个普朗克长度，时空几何的涨落与它本身一样大' }
    ]
  });
})();
