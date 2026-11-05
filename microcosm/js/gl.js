/* 微观之旅 · WebGL2 基础设施：着色器编译、渲染目标、全屏三角形、公共 GLSL、后期处理 */
(function () {
  'use strict';
  const MC = (window.MC = window.MC || {});

  MC.GLSL_HEAD = `#version 300 es
precision highp float;
precision highp int;
uniform vec2  uRes;      // 渲染目标像素尺寸
uniform float uTime;     // 秒
uniform vec3  uRo;       // 相机位置（场景单位）
uniform vec3  uCr, uCu, uCf; // 相机右/上/前
uniform float uTanM;     // 短边半视角正切
uniform float uU;        // 场景内局部进度
uniform float uW;        // 视野短边宽度（场景单位）
uniform vec4  uP0, uP1, uP2; // 场景参数
out vec4 outColor;
const float PI = 3.14159265359;
vec3 rayDir(vec2 fc){ vec2 uv=(2.*fc-uRes)/min(uRes.x,uRes.y); return normalize(uCf+uv.x*uTanM*uCr+uv.y*uTanM*uCu); }
float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float hash13(vec3 p3){ p3=fract(p3*.1031); p3+=dot(p3,p3.zyx+31.32); return fract((p3.x+p3.y)*p3.z); }
vec3 hash33(vec3 p3){ p3=fract(p3*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yxz+33.33); return fract((p3.xxy+p3.yxx)*p3.zyx); }
vec2 hash22(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
// Ashima simplex noise 3D / 4D (MIT)
vec4 _perm(vec4 x){ return mod(((x*34.)+1.)*x,289.); }
float _perm1(float x){ return mod(((x*34.)+1.)*x,289.); }
vec4 _tis(vec4 r){ return 1.79284291400159-0.85373472095314*r; }
float _tis1(float r){ return 1.79284291400159-0.85373472095314*r; }
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod(i,289.);
  vec4 p=_perm(_perm(_perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=1./7.; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=_tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
vec4 _grad4(float j, vec4 ip){
  const vec4 ones=vec4(1.,1.,1.,-1.); vec4 p,s;
  p.xyz=floor(fract(vec3(j)*ip.xyz)*7.)*ip.z-1.; p.w=1.5-dot(abs(p.xyz),ones.xyz);
  s=vec4(lessThan(p,vec4(0.))); p.xyz=p.xyz+(s.xyz*2.-1.)*s.www; return p;
}
float snoise(vec4 v){
  const vec2 C=vec2(.138196601125010504,.309016994374947451);
  vec4 i=floor(v+dot(v,C.yyyy)); vec4 x0=v-i+dot(i,C.xxxx);
  vec4 i0; vec3 isX=step(x0.yzw,x0.xxx); vec3 isYZ=step(x0.zww,x0.yyz);
  i0.x=isX.x+isX.y+isX.z; i0.yzw=1.-isX; i0.y+=isYZ.x+isYZ.y; i0.zw+=1.-isYZ.xy; i0.z+=isYZ.z; i0.w+=1.-isYZ.z;
  vec4 i3=clamp(i0,0.,1.); vec4 i2=clamp(i0-1.,0.,1.); vec4 i1=clamp(i0-2.,0.,1.);
  vec4 x1=x0-i1+C.xxxx; vec4 x2=x0-i2+2.*C.xxxx; vec4 x3=x0-i3+3.*C.xxxx; vec4 x4=x0-1.+4.*C.xxxx;
  i=mod(i,289.);
  float j0=_perm1(_perm1(_perm1(_perm1(i.w)+i.z)+i.y)+i.x);
  vec4 j1=_perm(_perm(_perm(_perm(i.w+vec4(i1.w,i2.w,i3.w,1.))+i.z+vec4(i1.z,i2.z,i3.z,1.))+i.y+vec4(i1.y,i2.y,i3.y,1.))+i.x+vec4(i1.x,i2.x,i3.x,1.));
  vec4 ip=vec4(1./294.,1./49.,1./7.,0.);
  vec4 p0=_grad4(j0,ip); vec4 p1=_grad4(j1.x,ip); vec4 p2=_grad4(j1.y,ip); vec4 p3=_grad4(j1.z,ip); vec4 p4=_grad4(j1.w,ip);
  vec4 norm=_tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w; p4*=_tis1(dot(p4,p4));
  vec3 m0=max(.6-vec3(dot(x0,x0),dot(x1,x1),dot(x2,x2)),0.); vec2 m1=max(.6-vec2(dot(x3,x3),dot(x4,x4)),0.);
  m0=m0*m0; m1=m1*m1;
  return 49.*(dot(m0*m0,vec3(dot(p0,x0),dot(p1,x1),dot(p2,x2)))+dot(m1*m1,vec2(dot(p3,x3),dot(p4,x4))));
}
float fbm3(vec3 p){ float a=.5,s=0.; for(int i=0;i<4;i++){ s+=a*snoise(p); p=p*2.03+vec3(1.7,9.2,3.1); a*=.5; } return s; }
vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }
vec3 toSRGB(vec3 c){ return pow(clamp(c,0.,1.),vec3(1./2.2)); }
float dither(vec2 fc){ return (hash12(fc+fract(uTime*7.31)*91.7)-.5)/255.; }
bool sphIntersect(vec3 ro, vec3 rd, vec3 c, float r, out float t0, out float t1){
  vec3 oc=ro-c; float b=dot(oc,rd); float h=b*b-dot(oc,oc)+r*r; if(h<0.) return false; h=sqrt(h); t0=-b-h; t1=-b+h; return t1>0.;
}
vec3 hsv2rgb(vec3 c){ vec3 p=abs(fract(c.xxx+vec3(0.,2./3.,1./3.))*6.-3.); return c.z*mix(vec3(1.),clamp(p-1.,0.,1.),c.y); }
`;

  MC.VS_FULL = `#version 300 es
void main(){ vec2 p=vec2((gl_VertexID<<1)&2, gl_VertexID&2); gl_Position=vec4(p*2.-1.,0.,1.); }`;

  MC.createGL = function (canvas) {
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    if (!gl) return null;
    gl.getExtension('EXT_color_buffer_float');
    gl.getExtension('OES_texture_float_linear');
    MC.vaoEmpty = gl.createVertexArray();
    return gl;
  };

  function shader(gl, type, src, label) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  // 编译程序；用 KHR_parallel_shader_compile 时可异步检查
  MC.program = function (gl, vsSrc, fsSrc, label) {
    const vs = shader(gl, gl.VERTEX_SHADER, vsSrc, label);
    const fs = shader(gl, gl.FRAGMENT_SHADER, fsSrc, label);
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    const prog = { gl, p, vs, fs, label, loc: {}, ok: null };
    prog.check = function () {
      if (prog.ok !== null) return prog.ok;
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error('[' + label + '] link failed\n', gl.getShaderInfoLog(vs) || '', gl.getShaderInfoLog(fs) || '', gl.getProgramInfoLog(p));
        prog.ok = false;
      } else prog.ok = true;
      return prog.ok;
    };
    prog.ready = function () {
      const ext = MC._pc;
      if (ext && !gl.getProgramParameter(p, ext.COMPLETION_STATUS_KHR)) return false;
      return true;
    };
    prog.u = function (name) {
      let l = prog.loc[name];
      if (l === undefined) { l = gl.getUniformLocation(p, name); prog.loc[name] = l; }
      return l;
    };
    return prog;
  };

  MC.target = function (gl, w, h, opts) {
    opts = opts || {};
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex, fb, w, h };
  };
  MC.freeTarget = function (gl, t) { if (!t) return; gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fb); };

  MC.drawFull = function (gl) {
    gl.bindVertexArray(MC.vaoEmpty);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // 设置相机等公共 uniform
  MC.setCommon = function (gl, prog, ctx) {
    gl.uniform2f(prog.u('uRes'), ctx.w, ctx.h);
    gl.uniform1f(prog.u('uTime'), ctx.time);
    const c = ctx.cam;
    gl.uniform3fv(prog.u('uRo'), c.ro);
    gl.uniform3fv(prog.u('uCr'), c.r);
    gl.uniform3fv(prog.u('uCu'), c.up);
    gl.uniform3fv(prog.u('uCf'), c.f);
    gl.uniform1f(prog.u('uTanM'), c.tanM);
    gl.uniform1f(prog.u('uU'), ctx.u);
    gl.uniform1f(prog.u('uW'), ctx.W);
  };

  /* ---------- 点精灵（探测事件、部分子等） ---------- */
  MC.POINTS_VS = `#version 300 es
precision highp float;
layout(location=0) in vec4 aPos;   // xyz, size
layout(location=1) in vec4 aCol;   // rgb, alpha
uniform vec3 uRo, uCr, uCu, uCf; uniform float uTanM; uniform vec2 uRes; uniform float uPx;
out vec4 vCol;
void main(){
  vec3 d=aPos.xyz-uRo; float z=dot(d,uCf);
  float m=min(uRes.x,uRes.y);
  vec2 s=vec2(dot(d,uCr),dot(d,uCu))/(z*uTanM);
  gl_Position = z>0. ? vec4(s.x*m/uRes.x, s.y*m/uRes.y, 0., 1.) : vec4(2.,2.,2.,1.);
  float px = aPos.w/(z*uTanM)*m*.5;
  gl_PointSize = clamp(max(px, uPx), 1., 64.);
  float fade = clamp(px/max(uPx,1e-3),0.,1.);
  vCol = vec4(aCol.rgb, aCol.a*mix(fade*fade,1.,step(uPx,px)));
}`;
  MC.POINTS_FS = `#version 300 es
precision highp float;
in vec4 vCol; out vec4 o;
void main(){ vec2 q=gl_PointCoord*2.-1.; float r=dot(q,q); if(r>1.) discard; float a=exp(-r*4.)*vCol.a; o=vec4(vCol.rgb*a,a); }`;

  MC.PointSet = function (gl, max) {
    this.gl = gl; this.max = max; this.n = 0;
    this.pos = new Float32Array(max * 4);
    this.col = new Float32Array(max * 4);
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    this.bp = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bp);
    gl.bufferData(gl.ARRAY_BUFFER, this.pos.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
    this.bc = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bc);
    gl.bufferData(gl.ARRAY_BUFFER, this.col.byteLength, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
  };
  MC.PointSet.prototype.draw = function (ctx, minPx) {
    const gl = this.gl;
    if (!this.n) return;
    if (!MC._ptProg) MC._ptProg = MC.program(gl, MC.POINTS_VS, MC.POINTS_FS, 'points');
    const p = MC._ptProg;
    if (!p.check()) return;
    gl.useProgram(p.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bp);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.pos, 0, this.n * 4);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bc);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.col, 0, this.n * 4);
    const c = ctx.cam;
    gl.uniform3fv(p.u('uRo'), c.ro); gl.uniform3fv(p.u('uCr'), c.r); gl.uniform3fv(p.u('uCu'), c.up); gl.uniform3fv(p.u('uCf'), c.f);
    gl.uniform1f(p.u('uTanM'), c.tanM); gl.uniform2f(p.u('uRes'), ctx.w, ctx.h); gl.uniform1f(p.u('uPx'), minPx || 1.5);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.POINTS, 0, this.n);
    gl.bindVertexArray(null);
    gl.disable(gl.BLEND);
  };

  /* ---------- 合成与后期 ---------- */
  MC.FS_COMPOSITE = `#version 300 es
precision highp float;
uniform sampler2D uA, uB; uniform float uMix; uniform vec2 uRes; uniform float uTime;
out vec4 o;
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec3 a=texture(uA,uv).rgb;
  if(uMix<=0.){ o=vec4(a,1.); return; }
  // 由中心向外扩张的圆形过渡：下一尺度从画面中心“长出来”
  vec2 q=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);
  float r=length(q);
  float R=mix(-.25,1.25,smoothstep(0.,1.,uMix));
  float m=smoothstep(R+.22,R-.22,r);
  // 过渡带的径向模糊（向心缩放）
  vec3 b=texture(uB,uv).rgb;
  vec3 az=vec3(0.); float zs=0.03*sin(PI_*uMix);
  for(int i=0;i<6;i++){ float k=float(i)/5.; az+=texture(uA,.5+(uv-.5)*(1.-zs*k)).rgb; }
  az/=6.;
  vec3 c=mix(az,b,m);
  o=vec4(c,1.);
}`.replace('PI_', '3.14159265');

  MC.FS_BRIGHT = `#version 300 es
precision highp float;
uniform sampler2D uT; uniform vec2 uTexel; out vec4 o;
void main(){
  vec2 uv=gl_FragCoord.xy*uTexel;
  vec3 c=vec3(0.);
  c+=texture(uT,uv+uTexel*vec2(-.5,-.5)).rgb; c+=texture(uT,uv+uTexel*vec2(.5,-.5)).rgb;
  c+=texture(uT,uv+uTexel*vec2(-.5,.5)).rgb; c+=texture(uT,uv+uTexel*vec2(.5,.5)).rgb; c*=.25;
  float l=max(c.r,max(c.g,c.b));
  o=vec4(c*smoothstep(.45,1.,l),1.);
}`;
  MC.FS_BLUR = `#version 300 es
precision highp float;
uniform sampler2D uT; uniform vec2 uDir; out vec4 o;
void main(){
  vec2 uv=gl_FragCoord.xy/vec2(textureSize(uT,0));
  vec3 c=texture(uT,uv).rgb*.227027;
  c+=(texture(uT,uv+uDir*1.3846).rgb+texture(uT,uv-uDir*1.3846).rgb)*.316216;
  c+=(texture(uT,uv+uDir*3.2308).rgb+texture(uT,uv-uDir*3.2308).rgb)*.070270;
  o=vec4(c,1.);
}`;
  MC.FS_FINAL = `#version 300 es
precision highp float;
uniform sampler2D uC, uBloom; uniform vec2 uRes; uniform float uTime; uniform float uBloomK; uniform float uFade;
out vec4 o;
float h(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;
  vec3 c=texture(uC,uv).rgb;
  vec3 b=texture(uBloom,uv).rgb;
  c=1.-(1.-c)*(1.-b*uBloomK);
  vec2 q=uv-.5; float v=1.-dot(q,q)*.55; c*=v;
  c+=(h(gl_FragCoord.xy+fract(uTime)*317.)-.5)*.018;
  o=vec4(c*uFade,1.);
}`;
})();
