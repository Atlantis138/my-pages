/* 场景 1 · 硅藻（单位：微米） */
(function () {
  const MC = window.MC;
  const R = 60, H = 16, DOME = 3, RR = 5, THK = 1.1, A = 2.4, WALL = 0.28, CRD = 0.2, CRT = 0.05;

  const FS = `
const float R=${R}., H=${H}., DOME=${DOME}., RR=${RR}., THK=${THK}, A=${A}, WALL=${WALL}, CRD=${CRD}, CRT=${CRT}, PB=.15, PR=.036;
// uP0.x：SEM 混合（0 = 暗场光学，1 = 扫描电镜）  uP0.y：像素尺寸（μm）
float solid(vec3 p){
  float r=length(p.xz);
  float top=H+DOME*(1.-min(r*r/(R*R),1.));
  vec2 q=vec2(r-(R-RR),abs(p.y)-(top-RR));
  return length(max(q,0.))+min(max(q.x,q.y),0.)-RR;
}
vec2 hexCell(vec2 p, out vec2 id){
  const vec2 s=vec2(1.,1.7320508);
  vec4 hC=floor(vec4(p,p-vec2(.5,1.))/s.xyxy)+.5;
  vec4 h=vec4(p-hC.xy*s,p-(hC.zw+.5)*s);
  if(dot(h.xy,h.xy)<dot(h.zw,h.zw)){ id=hC.xy; return h.xy; }
  id=hC.zw+.5; return h.zw;
}
float hexD(vec2 p){ p=abs(p); return max(dot(p,vec2(.5,.8660254)),p.x); }

float map(vec3 p){
  float so=solid(p);
  float d=abs(so)-THK*.5;
  if(d>1.2) return d;
  float r=length(p.xz);
  float s=THK*.5-so;                         // 外表面以下的深度
  if(r<R-5.5 && uP0.y<.1){
    float w=1.+.35*r*r/(R*R);                // 向边缘逐渐变小的室孔
    vec2 id; vec2 h=hexCell(p.xz*w/A,id);
    float hd=hexD(h)*A/w;
    float inner=hd-(.5*A/w-WALL*.5);
    inner=max(inner,4.-r);                   // 中央无孔区
    float ch=max(inner,max(-.4-s,s-(THK-.17)));
    d=max(d,-ch);
    // 筛板（cribrum）及其纳米筛孔
    float pl=max(inner-.03,max(CRD-s,s-(CRD+CRT)));
    if(uP0.y<.04 && uP0.x>.3 && pl<.05){
      vec2 id2; vec2 h2=hexCell(p.xz/PB,id2);
      pl=max(pl,-(length(h2)*PB-PR));
    }
    d=min(d,pl);
    // 内侧的圆形孔口（foramen）
    float fo=max(length(h)*A/w-.42,max(THK-.3-s,s-THK-.2));
    d=max(d,-max(fo,-inner-.05));
  } else {
    // 壳套（mantle）上的纵向细纹与一圈唇形突
    float ang=atan(p.z,p.x);
    d+=.08*smoothstep(.2,.9,abs(sin(ang*260.)))*step(abs(p.y),H-1.);
  }
  if(uP0.y<.006) d+=.0025*snoise(p*90.);     // 二氧化硅纳米颗粒质感
  return d;
}
vec3 calcN(vec3 p, float e){
  const vec2 k=vec2(1.,-1.);
  return normalize(k.xyy*map(p+k.xyy*e)+k.yyx*map(p+k.yyx*e)+k.yxy*map(p+k.yxy*e)+k.xxx*map(p+k.xxx*e));
}
// 叶绿体（含岩藻黄素，金褐色），贴着细胞壁分布
float plastid(vec3 p){
  vec3 q=p/5.; vec3 i=floor(q); vec3 f=fract(q); float m=9.;
  for(int z=-1;z<=1;z++) for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){
    vec3 g=vec3(x,y,z); vec3 o=hash33(i+g);
    vec3 dd=(g+o-f)*vec3(1.,1.6,1.); m=min(m,dot(dd,dd));
  }
  float so=solid(p);
  return smoothstep(.22,.05,m)*smoothstep(-10.,-3.,so)*step(so,-THK);
}

void main(){
  vec3 rd=rayDir(gl_FragCoord.xy), ro=uRo;
  float pix=uP0.y;
  float sem=uP0.x;
  vec3 bgO=vec3(.004,.006,.012)+vec3(.01,.015,.03)*(1.-length((gl_FragCoord.xy-.5*uRes)/uRes.y));
  vec3 bgS=vec3(.10,.10,.105)*(1.-.4*length((gl_FragCoord.xy-.5*uRes)/uRes.y));
  // 包围球
  float t0,t1; vec3 col;
  bool any=sphIntersect(ro,rd,vec3(0.),R+4.,t0,t1);
  float t=max(t0,0.); bool hit=false;
  if(any){
    for(int i=0;i<220;i++){
      vec3 p=ro+rd*t; float d=map(p);
      float fp=t*2.*uTanM/min(uRes.x,uRes.y);
      if(d<max(fp*.4,1e-5)){ hit=true; break; }
      t+=d*.85; if(t>t1) break;
    }
  }
  vec3 cO=bgO, cS=bgS;
  if(hit){
    vec3 p=ro+rd*t; vec3 n=calcN(p,max(t*uTanM*.002,2e-4));
    vec3 v=-rd; float ndv=abs(dot(n,v));
    // 暗场：只有被结构散射进物镜的光才可见；周期结构带来结构色
    float rim=pow(1.-ndv,4.);
    float r=length(p.xz);
    float pat=0.;
    if(uP0.y>=.1 && r<R-5.5 && abs(solid(p))<THK){
      // 室孔小于几个像素时，用解析滤波的蜂窝纹代替几何细节
      float w=1.+.35*r*r/(R*R); vec2 id; vec2 h=hexCell(p.xz*w/A,id);
      float e=(.5*A/w)-hexD(h)*A/w;                 // 到室孔边墙的距离
      float aa=uP0.y*1.2;
      float wall=1.-smoothstep(WALL*.5-aa,WALL*.5+aa,e);
      float avg=2.*WALL/A;
      pat=mix(wall,avg,smoothstep(.6,1.6,uP0.y/(A/w)*2.))*step(4.,r);
      pat*=.85+.15*hash12(id);
    }
    float ph=dot(n,normalize(vec3(.3,1.,.2)))*1.3+length(p.xz)*.011;
    vec3 irid=.5+.5*cos(6.2831*(ph+vec3(0.,.33,.67)));
    vec3 glass=mix(vec3(1.,.93,.8),irid,.3)*(rim*2.4+pat*.4+.01);
    // 透过玻璃壳看见里面的叶绿体
    vec3 inside=vec3(0.); float tr=1.;
    float L=min(2.*H,t1-t); float dt=L/18.;
    for(int k=0;k<18;k++){
      vec3 q=p+rd*(dt*(float(k)+.5+hash12(gl_FragCoord.xy+float(k))*.5));
      float den=plastid(q);
      inside+=tr*den*vec3(1.,.62,.2)*dt*.15; tr*=exp(-den*dt*.25);
    }
    cO=glass+inside*(1.-rim*.5)*(1.-smoothstep(.12,.32,uU));
    // 扫描电镜：二次电子产额随表面倾角增大（边缘发亮），凹陷处因信号被遮挡而偏暗
    float ao=1.; float e=max(.03,t*uTanM*.02);
    for(int k=1;k<=4;k++){ float h=e*float(k); ao-=(h-map(p+n*h))/h*.18; }
    ao=clamp(ao,.15,1.);
    float sg=.20+.65*pow(1.-max(dot(n,v),0.),1.5)+.22*max(dot(n,normalize(vec3(-.5,.75,.35))),0.);
    cS=vec3(sg*ao)*vec3(1.,1.,1.02);
  } else if(any){
    // 未命中壳体：可能穿过细胞内部
    cO=bgO;
  }
  // SEM 扫描噪声
  float nz=hash12(gl_FragCoord.xy+floor(uTime*24.)*13.1)-.5;
  cS+=nz*.05+.015*sin(gl_FragCoord.y*3.14159);
  col=mix(aces(cO*1.2),cS,sem);
  outColor=vec4(toSRGB(col)+dither(gl_FragCoord.xy),1.);
}`;

  // 让最终镜头停在某个室孔的筛板中央
  function targetPoint() {
    const yaw = 0.7, r0 = 15;
    const g0 = [r0 * Math.sin(yaw), r0 * Math.cos(yaw)];
    const w0 = 1 + 0.35 * r0 * r0 / (R * R);
    const p = [g0[0] * w0 / A, g0[1] * w0 / A];
    const s = [1, Math.sqrt(3)];
    const c1 = [(Math.floor(p[0] / s[0]) + 0.5) * s[0], (Math.floor(p[1] / s[1]) + 0.5) * s[1]];
    const c2 = [(Math.floor((p[0] - 0.5) / s[0]) + 0.5 + 0.5) * s[0], (Math.floor((p[1] - 1) / s[1]) + 0.5 + 0.5) * s[1]];
    const d1 = Math.hypot(p[0] - c1[0], p[1] - c1[1]), d2 = Math.hypot(p[0] - c2[0], p[1] - c2[1]);
    const c = d1 < d2 ? c1 : c2;
    const cl = Math.hypot(c[0], c[1]) * A;   // = r * w(r)
    let r = r0;
    for (let i = 0; i < 20; i++) { const f = r * (1 + 0.35 * r * r / (R * R)) - cl; const df = 1 + 1.05 * r * r / (R * R); r -= f / df; }
    const k = r / Math.hypot(c[0], c[1]);
    const x = c[0] * k, z = c[1] * k;
    const top = H + DOME * (1 - r * r / (R * R));
    return [x, top + THK / 2 - CRD - CRT / 2, z];
  }
  const TP = targetPoint();

  MC.SCENES.push({
    key: 'diatom',
    range: [-3.6, -6.45],
    unit: 1e-6,
    fs: FS,
    pitch: 0.62, pitchMin: 0.2, pitchMax: 1.5,
    bloom: 0.55,
    getTarget(u) {
      const k = MC.smooth(0.12, 0.62, u);
      return [TP[0] * k, TP[1] * k, TP[2] * k];
    },
    uniforms(gl, prog, ctx) {
      const sem = MC.smooth(0.56, 0.74, ctx.u);
      const pix = ctx.W / Math.min(ctx.w, ctx.h);
      gl.uniform4f(prog.u('uP0'), sem, pix, 0, 0);
    },
    info: {
      title: '硅藻', en: 'Diatom', badge: '暗场光学 → 扫描电镜',
      lead: '水滴里的一个单细胞藻类，直径约 120 μm。它住在自己用二氧化硅造的“玻璃盒”里：上下两片壳像培养皿一样扣合，壳面布满蜂窝状室孔，每个室孔底下又有一层带纳米筛孔的薄板。',
      observe: '前半段是暗场显微镜下的样子：照明光从斜侧射入，只有被样品散射的光进入物镜，所以玻璃壳的边缘、棱线发亮，背景全黑；壳内金褐色的是含岩藻黄素的叶绿体。周期性的室孔会衍射白光，带来淡淡的结构色。\n继续放大到几微米时，光学显微镜碰到阿贝衍射极限 d = λ/(2NA) ≈ 200 nm，更细的筛孔再也分辨不出。画面于是换成扫描电子显微镜（SEM）的成像方式：电子束逐点扫描，探测器收集表面激发出的二次电子，倾斜的面和棱边信号更强，凹陷处被遮挡而偏暗，所以 SEM 图像是灰度的、带扫描噪声。',
      method: '硅藻壳由有符号距离场实时光线步进生成：以圆筛藻（Coscinodiscus）为原型的圆盒形壳体、向边缘逐渐变小的六边形室孔、室孔外侧的筛板（孔径约 70 nm、间距 150 nm）与内侧的圆形孔口，以及壳套上的细纹。暗场模式按表面倾角计算散射亮度并叠加周期结构的干涉色；壳内叶绿体用体积采样绘制。SEM 模式按二次电子产额随入射角增大的规律着色，并加入遮蔽与扫描噪声。筛孔只在 SEM 模式下出现，因为光学显微镜本来就看不到它们。',
      facts: [['细胞直径', '≈ 120 μm（属内 30–500 μm）'], ['室孔间距', '≈ 2.4 μm（中心）'], ['筛孔直径', '≈ 40–80 nm'], ['壳的成分', '无定形 SiO₂·nH₂O'], ['可见光衍射极限', '≈ 200 nm'], ['SEM 分辨率', '≈ 1 nm'], ['硅藻贡献的全球初级生产', '约 20%']]
    },
    notes: [
      { u: 0.05, text: '暗场显微镜：黑色背景上，只有散射光勾出玻璃壳的轮廓' },
      { u: 0.4, text: '六边形室孔，间距约 2.4 μm' },
      { u: 0.56, until: 0.8, text: '已接近可见光的衍射极限（≈ 200 nm），切换为扫描电子显微镜' },
      { u: 0.86, text: '筛板上的纳米孔，直径约 70 nm' }
    ]
  });
})();
