/* 场景 0 · 一滴水（单位：毫米） */
(function () {
  const MC = window.MC;
  MC.SCENES = MC.SCENES || [];

  const FS = `
const vec3 DC=vec3(0.,1.297,0.);       // 水滴中心
const vec3 DR=vec3(1.5,1.38,1.5);      // 半径：重力使其略扁（邦德数≈0.3）
const vec3 SUN=normalize(vec3(-.55,.72,.42));
const float NW=1.333;
// uP0.x：暗场程度（镜头潜入显微镜时环境变暗）  uP0.y：对焦距离

bool ellip(vec3 ro, vec3 rd, vec3 c, vec3 r, out float t0, out float t1){
  vec3 o=(ro-c)/r; vec3 d=rd/r; float a=dot(d,d); float b=dot(o,d); float cc=dot(o,o)-1.;
  float h=b*b-a*cc; if(h<0.) return false; h=sqrt(h); t0=(-b-h)/a; t1=(-b+h)/a; return t1>0.;
}
vec3 enorm(vec3 p){ return normalize((p-DC)/(DR*DR)); }

vec3 sky(vec3 rd){
  float y=rd.y;
  vec3 hor=vec3(.70,.76,.72), zen=vec3(.26,.44,.74);
  vec3 c=mix(hor,zen,pow(clamp(y,0.,1.),.55));
  // 远处失焦的荷叶与花：大块色斑
  vec2 sp=vec2(atan(rd.x,rd.z)*2.2, y*5.);
  float n=snoise(vec3(sp,1.7))*.5+.5; float n2=snoise(vec3(sp*2.3,4.1))*.5+.5;
  vec3 bok=mix(vec3(.03,.09,.04),vec3(.22,.34,.12),n);
  bok=mix(bok,vec3(.95,.62,.70),smoothstep(.78,.9,n2)*.6);
  c=mix(bok,c,smoothstep(-.05,.32,y+.08*n));
  float s=max(dot(rd,SUN),0.);
  c+=vec3(1.,.95,.86)*(pow(s,900.)*40.+pow(s,10.)*.22);
  return c*(1.-uP0.x*.985);
}

// 荷叶表面：叶脉、乳突（约 10–20 μm）与蜡质的银白光泽
vec3 leaf(vec3 p, vec3 rd, float t){
  float foot=t*2.*uTanM/min(uRes.x,uRes.y);      // 像素足迹（mm）
  float blur=clamp(abs(t-uP0.y)/max(uP0.y,1e-3)*1.6,0.,1.); // 景深
  vec2 q=p.xz;
  vec2 c=q-vec2(-38.,-70.); float rad=length(c); float ang=atan(c.y,c.x);
  float vein=abs(fract(ang*26./PI+.08*snoise(vec3(q*.05,1.)))-.5);
  vein=smoothstep(.035,.0,vein)*(1.-blur);
  float sub=abs(fract(rad*.12+.3*snoise(vec3(q*.08,2.)))-.5); sub=smoothstep(.03,0.,sub)*(1.-blur)*.6;
  float big=snoise(vec3(q*.06,3.))*.5+.5;
  vec3 base=mix(vec3(.035,.11,.05),vec3(.09,.20,.07),big);
  base=mix(base,vec3(.20,.32,.13),max(vein,sub)*.5);
  // 乳突法线扰动（亚像素时淡出）
  float fd=smoothstep(.03,.008,foot)*(1.-blur);
  vec2 g=q*55.; vec2 gi=floor(g); vec2 gf=fract(g)-.5+.25*(hash22(gi)-.5);
  vec3 n=normalize(vec3(-gf.x*fd*1.6,1.,-gf.y*fd*1.6));
  vec3 v=-rd;
  float diff=max(dot(n,SUN),0.);
  // 水滴的阴影与焦散：球形水滴是一枚短焦透镜（f≈2R），叶面位于焦点内，形成亮斑与暗环
  vec3 toC=DC-p; float along=dot(toC,SUN); float rho=length(toC-along*SUN)/1.46;
  float sh=1., caus=0.;
  if(along>0.){
    sh=mix(1.,.18,smoothstep(.5,.62,rho)*smoothstep(1.06,.94,rho));
    caus=(rho<.58? 1.1*smoothstep(.58,.1,rho)+2.2*exp(-pow((rho-.55)/.025,2.)) : 0.);
  }
  float sheen=pow(1.-max(dot(n,v),0.),4.);
  vec3 col=base*(.25+1.4*diff*(sh+caus))+vec3(.45,.55,.6)*sheen*.10*(.4+.6*sh);
  col+=vec3(1.)*pow(max(dot(reflect(-SUN,n),v),0.),24.)*.06*sh;
  // 远处失焦叶面
  col=mix(col,base*.9+vec3(.02,.04,.02),smoothstep(30.,140.,t));
  return col*(1.-uP0.x*.985);
}

vec3 scene(vec3 o, vec3 d){
  if(d.y<0.){ float t=-o.y/d.y; return leaf(o+d*t,d,t+length(o-uRo)); }
  return sky(d);
}

// 水中悬浮物：中央一枚硅藻（下一站），其余为细菌、碎屑
mat3 rotY(float a){ float c=cos(a),s=sin(a); return mat3(c,0.,-s,0.,1.,0.,s,0.,c); }
mat3 rotX(float a){ float c=cos(a),s=sin(a); return mat3(1.,0.,0.,0.,c,s,0.,-s,c); }
vec4 specks(vec3 ro, vec3 rd, float tmax){
  vec4 hit=vec4(0.,0.,0.,tmax);
  // 硅藻：直径约 120 μm 的圆盒状细胞
  mat3 M=rotX(.55)*rotY(uTime*.15);
  vec3 lro=M*(ro-DC), lrd=M*rd;
  float a,b;
  if(ellip(lro,lrd,vec3(0.),vec3(.06,.022,.06),a,b) && a>0. && a<hit.w){
    vec3 lp=lro+lrd*a; vec3 ln=normalize(lp/vec3(.0036,.000484,.0036));
    float rim=pow(1.-abs(dot(ln,lrd)),2.);
    float pores=.5+.5*sin(length(lp.xz)*700.)*sin(atan(lp.z,lp.x)*40.);
    vec3 lit=vec3(.55,.42,.16)*(.45+.4*max(dot(ln,M*SUN),0.))+vec3(.9,.8,.5)*rim*.4;
    vec3 dark=vec3(1.,.78,.35)*(rim*1.6+.25*pores)+vec3(.7,.55,.2)*.25;
    hit=vec4(mix(lit,dark*1.4,uP0.x),a);
  }
  for(int i=0;i<10;i++){
    vec3 h=hash33(vec3(float(i)*7.13,3.1,1.7));
    vec3 c=DC+(h-.5)*vec3(1.9,1.5,1.9);
    float r=mix(.004,.014,hash13(h*9.1));
    float t0,t1;
    if(sphIntersect(ro,rd,c,r,t0,t1) && t0>0. && t0<hit.w){
      vec3 n=normalize(ro+rd*t0-c); float rim=pow(1.-abs(dot(n,rd)),2.);
      vec3 lit=vec3(.75,.78,.72)*(.5+.5*max(dot(n,SUN),0.));
      vec3 dark=vec3(.8,.9,1.)*rim*1.2;
      hit=vec4(mix(lit,dark,uP0.x),t0);
    }
  }
  return hit;
}

vec3 throughDrop(vec3 p, vec3 rIn){
  float a,b; ellip(p+rIn*1e-4,rIn,DC,DR,a,b);
  vec4 s=specks(p,rIn,b);
  if(s.w<b) return s.rgb;
  vec3 q=p+rIn*b; vec3 n2=enorm(q);
  vec3 rOut=refract(rIn,-n2,NW);
  float ci=dot(rIn,n2);
  if(dot(rOut,rOut)<1e-4){
    vec3 r2=reflect(rIn,-n2);
    float a2,b2; ellip(q+r2*1e-4,r2,DC,DR,a2,b2);
    vec3 q2=q+r2*b2; vec3 r3=refract(r2,-enorm(q2),NW);
    return scene(q2,dot(r3,r3)>1e-4?r3:reflect(r2,-enorm(q2)))*.85;
  }
  float F2=.02+.98*pow(1.-clamp(dot(rOut,n2),0.,1.),5.);
  return scene(q,rOut)*(1.-F2)+sky(reflect(rIn,-n2))*F2*.3;
}

void main(){
  vec3 rd=rayDir(gl_FragCoord.xy);
  vec3 ro=uRo;
  vec3 col;
  float t0,t1;
  bool hitDrop=ellip(ro,rd,DC,DR,t0,t1);
  float tPlane=rd.y<0.? -ro.y/rd.y : 1e9;
  if(hitDrop && t0<0.){
    // 相机已在水滴之内
    col=throughDrop(ro,rd);
    col=mix(col,col*vec3(.92,.97,1.),.5);
  } else if(hitDrop && t0<tPlane){
    vec3 p=ro+rd*t0; vec3 n=enorm(p);
    float ci=-dot(rd,n);
    float F=.02+.98*pow(1.-ci,5.);
    vec3 rr=reflect(rd,n);
    vec3 refl=scene(p,rr);
    vec3 rIn=refract(rd,n,1./NW);
    vec3 inner=throughDrop(p,rIn);
    col=refl*F+inner*(1.-F);
    // 暗场：照明来自空心锥，水滴边缘的散射光
    col+=uP0.x*vec3(.35,.45,.6)*pow(1.-ci,3.)*.5;
  } else {
    col=scene(ro,rd);
  }
  col=aces(col*1.05);
  outColor=vec4(toSRGB(col)+dither(gl_FragCoord.xy),1.);
}`;

  MC.SCENES.push({
    key: 'droplet',
    range: [-1.6, -3.05],
    unit: 1e-3,
    fs: FS,
    pitch: 0.5,
    bloom: 0.18,
    pitchMin: 0.08, pitchMax: 1.3,
    target: [0, 1.297, 0],
    uniforms(gl, prog, ctx) {
      const dark = MC.smooth(0.72, 1.0, ctx.u);
      gl.uniform4f(prog.u('uP0'), dark, ctx.dist, 0, 0);
    },
    info: {
      title: '一滴水', en: 'A Drop of Water', badge: '肉眼 · 光学',
      lead: '荷叶上一颗直径约 3 毫米的水滴。表面张力把它拉成近乎完美的球，叶面的蜡质微结构让接触角高达约 160°。它里面有约 4×10²⁰ 个水分子，还漂着肉眼看不见的单细胞生物。',
      observe: '我们靠可见光看见它：光在水—空气界面发生折射（n = 1.333）与菲涅耳反射，水滴像一枚短焦透镜，把阳光会聚到叶面上形成亮斑，周围是一圈暗环。人眼的分辨极限约 0.1 毫米，再往下就需要显微镜。',
      method: '画面由光线追踪实时计算：水滴为轻微扁平的椭球（重力与表面张力之比，邦德数约 0.3），每条光线在入射与出射面按斯涅尔定律折射，掠射时按菲涅耳公式反射并处理全反射；叶面的焦散亮斑与暗环由球透镜焦距 f ≈ nR/2(n−1) ≈ 2R 估算。荷叶表面 10–20 μm 的乳突只在像素足以分辨时出现。',
      facts: [['水滴直径', '≈ 3 mm'], ['体积', '≈ 13 μL'], ['水分子数', '≈ 4×10²⁰'], ['表面张力', '72 mN/m'], ['毛细长度', '2.7 mm'], ['接触角（荷叶）', '≈ 160°']]
    },
    notes: [
      { u: 0.05, text: '滚动或捏合放大，拖拽旋转视角' },
      { u: 0.55, text: '人眼分辨极限 ≈ 0.1 mm' },
      { u: 0.8, text: '换到暗场显微镜：只收集被样品散射的光' }
    ]
  });
})();
