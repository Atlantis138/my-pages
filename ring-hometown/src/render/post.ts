// 后期：辉光（多级降采样/升采样）、局部曝光、色调映射、颗粒与暗角
import {
  AddEquation,
  CustomBlending,
  GLSL3,
  HalfFloatType,
  LinearFilter,
  Mesh,
  NoBlending,
  OneFactor,
  OrthographicCamera,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';
import { fullscreenTriangle } from './sky';

const VERT = /* glsl */ `
out vec2 vUv;
void main() {
  vUv = position.xy * 0.5 + 0.5;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const DOWN = /* glsl */ `
uniform sampler2D tSrc;
uniform vec2 uTexel;
uniform float uFirst;
in vec2 vUv;
vec3 tap(vec2 o) { return texture(tSrc, vUv + o * uTexel).rgb; }
float kw(vec3 c) { return 1.0 / (1.0 + dot(c, vec3(0.2126, 0.7152, 0.0722))); }
void main() {
  vec3 a = tap(vec2(-2, 2)), b = tap(vec2(0, 2)), c = tap(vec2(2, 2));
  vec3 d = tap(vec2(-2, 0)), e = tap(vec2(0, 0)), f = tap(vec2(2, 0));
  vec3 g = tap(vec2(-2, -2)), h = tap(vec2(0, -2)), i = tap(vec2(2, -2));
  vec3 j = tap(vec2(-1, 1)), k = tap(vec2(1, 1)), l = tap(vec2(-1, -1)), m = tap(vec2(1, -1));
  vec3 col;
  if (uFirst > 0.5) {
    // Karis 平均，抑制极亮小点造成的闪烁
    vec3 g0 = (a + b + d + e) * 0.25, g1 = (b + c + e + f) * 0.25, g2 = (d + e + g + h) * 0.25, g3 = (e + f + h + i) * 0.25, g4 = (j + k + l + m) * 0.25;
    float w0 = kw(g0), w1 = kw(g1), w2 = kw(g2), w3 = kw(g3), w4 = kw(g4);
    col = (g0 * w0 * 0.125 + g1 * w1 * 0.125 + g2 * w2 * 0.125 + g3 * w3 * 0.125 + g4 * w4 * 0.5) / (w0 * 0.125 + w1 * 0.125 + w2 * 0.125 + w3 * 0.125 + w4 * 0.5);
  } else {
    col = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  }
  gl_FragColor = vec4(min(col, vec3(6.0e4)), 1.0);
}
`;

const UP = /* glsl */ `
uniform sampler2D tSrc;
uniform vec2 uTexel;
uniform float uWeight;
in vec2 vUv;
void main() {
  vec2 t = uTexel;
  vec3 s = texture(tSrc, vUv).rgb * 4.0;
  s += (texture(tSrc, vUv + vec2(-t.x, 0)).rgb + texture(tSrc, vUv + vec2(t.x, 0)).rgb + texture(tSrc, vUv + vec2(0, -t.y)).rgb + texture(tSrc, vUv + vec2(0, t.y)).rgb) * 2.0;
  s += texture(tSrc, vUv + vec2(-t.x, -t.y)).rgb + texture(tSrc, vUv + vec2(t.x, -t.y)).rgb + texture(tSrc, vUv + vec2(-t.x, t.y)).rgb + texture(tSrc, vUv + vec2(t.x, t.y)).rgb;
  gl_FragColor = vec4(s / 16.0 * uWeight, 1.0);
}
`;

const COMPOSITE = /* glsl */ `
uniform sampler2D tHdr;
uniform sampler2D tBloom;
uniform sampler2D tLocal;
uniform float uExposure;
uniform float uBloom;
uniform float uLocalAmt;
uniform float uNightVis;
uniform float uGrain;
uniform float uTime;
uniform vec2 uRes;
uniform vec3 uGlarePos;   // 屏幕坐标 xy（0–1），z = 强度
uniform float uGlareAspect;
uniform float uFade;
in vec2 vUv;

// AgX（Troy Sobotka 方案的拟合实现）
vec3 agxContrast(vec3 x) {
  vec3 x2 = x * x;
  vec3 x4 = x2 * x2;
  return 15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4 - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232;
}
vec3 agx(vec3 c) {
  const mat3 inMat = mat3(0.842479062253094, 0.0423282422610123, 0.0423756549057051,
                          0.0784335999999992, 0.878468636469772, 0.0784336,
                          0.0792237451477643, 0.0791661274605434, 0.879142973793104);
  const mat3 outMat = mat3(1.19687900512017, -0.0528968517574562, -0.0529716355144438,
                           -0.0980208811401368, 1.15190312990417, -0.0980434501171241,
                           -0.0990297440797205, -0.0989611768448433, 1.15107367264116);
  const float minEv = -12.47393;
  const float maxEv = 4.026069;
  c = inMat * c;
  c = clamp(log2(max(c, vec3(1e-10))), minEv, maxEv);
  c = (c - minEv) / (maxEv - minEv);
  c = agxContrast(c);
  // 略加饱和与对比，避免过灰
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  c = l + (c - l) * 1.12;
  c = outMat * c;
  c = pow(max(c, vec3(0.0)), vec3(2.2));
  return c;
}

float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }

void main() {
  vec3 hdr = texture(tHdr, vUv).rgb;
  vec3 bloom = texture(tBloom, vUv).rgb;
  vec3 c = hdr + bloom * uBloom;
  // 局部曝光：只压暗明显过亮的区域（夜里明亮的对岸、白天的镜云）
  float Lloc = dot(texture(tLocal, vUv).rgb, vec3(0.2126, 0.7152, 0.0722));
  float ref = 0.5 / uExposure;
  float f = pow(max(Lloc / ref, 1.0), -uLocalAmt);
  // 只压暗本身就亮的像素，避免在亮物体周围留下暗晕
  float Lpix = dot(hdr, vec3(0.2126, 0.7152, 0.0722));
  f = mix(1.0, f, smoothstep(0.25, 1.2, Lpix / max(Lloc, 1e-9)));
  c *= uExposure * clamp(f, 0.03, 1.0);
  // 恒星眩光
  if (uGlarePos.z > 0.0) {
    vec2 dp = (vUv - uGlarePos.xy) * vec2(uGlareAspect, 1.0);
    float r = length(dp);
    float halo = uGlarePos.z * (0.02 / (r * r * 400.0 + 1.0) + 0.004 / (r * 30.0 + 0.4));
    float ang = atan(dp.y, dp.x);
    float spikes = pow(abs(cos(ang * 3.0)), 60.0) * exp(-r * 18.0) * uGlarePos.z * 0.15;
    c += vec3(1.0, 0.82, 0.6) * (halo + spikes);
  }
  // 暗视觉：极暗时偏蓝、去饱和
  float L = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float scot = uNightVis * (1.0 - smoothstep(0.02, 0.35, L));
  c = mix(c, vec3(L) * vec3(0.78, 0.9, 1.15), scot * 0.55);
  vec3 o = agx(c);
  // 克制的调色：高光略暖，阴影略青
  float lo = dot(o, vec3(0.2126, 0.7152, 0.0722));
  o = mix(o, o * vec3(0.97, 1.0, 1.03), (1.0 - lo) * 0.25);
  // 暗角
  vec2 q = vUv - 0.5;
  o *= 1.0 - dot(q, q) * 0.32;
  o *= uFade;
  // 输出 sRGB
  o = pow(max(o, vec3(0.0)), vec3(1.0 / 2.2));
  // 颗粒与抖动
  float n = hash(vUv * uRes + fract(uTime) * 917.0) - 0.5;
  o += n * (uGrain + 1.0 / 255.0);
  gl_FragColor = vec4(o, 1.0);
}
`;

export class Post {
  private scene = new Scene();
  private cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private mesh: Mesh;
  private down: ShaderMaterial;
  private up: ShaderMaterial;
  readonly composite: ShaderMaterial;
  private levels: WebGLRenderTarget[] = [];
  private localRT: WebGLRenderTarget | null = null;
  private w = 0;
  private h = 0;

  constructor() {
    this.down = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: DOWN,
      uniforms: { tSrc: { value: null }, uTexel: { value: new Vector2() }, uFirst: { value: 0 } },
      depthTest: false,
      depthWrite: false,
      blending: NoBlending,
    });
    this.up = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: UP,
      uniforms: { tSrc: { value: null }, uTexel: { value: new Vector2() }, uWeight: { value: 1 } },
      depthTest: false,
      depthWrite: false,
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneFactor,
    });
    this.composite = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: COMPOSITE,
      uniforms: {
        tHdr: { value: null },
        tBloom: { value: null },
        tLocal: { value: null },
        uExposure: { value: 3 },
        uBloom: { value: 0.01 },
        uLocalAmt: { value: 0.55 },
        uNightVis: { value: 0 },
        uGrain: { value: 0.012 },
        uTime: { value: 0 },
        uRes: { value: new Vector2() },
        uGlarePos: { value: new Vector3() },
        uGlareAspect: { value: 1 },
        uFade: { value: 1 },
      },
      depthTest: false,
      depthWrite: false,
      blending: NoBlending,
    });
    this.mesh = new Mesh(fullscreenTriangle(), this.down);
    this.mesh.frustumCulled = false;
    this.scene.add(this.mesh);
  }

  setSize(w: number, h: number): void {
    if (w === this.w && h === this.h) return;
    this.w = w;
    this.h = h;
    for (const l of this.levels) l.dispose();
    this.levels = [];
    this.localRT?.dispose();
    let lw = Math.max(1, w >> 1);
    let lh = Math.max(1, h >> 1);
    for (let i = 0; i < 7; i++) {
      this.levels.push(
        new WebGLRenderTarget(lw, lh, { type: HalfFloatType, format: RGBAFormat, minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false }),
      );
      lw = Math.max(1, lw >> 1);
      lh = Math.max(1, lh >> 1);
    }
    const l4 = this.levels[3];
    this.localRT = new WebGLRenderTarget(l4.width, l4.height, { type: HalfFloatType, format: RGBAFormat, minFilter: LinearFilter, magFilter: LinearFilter, depthBuffer: false });
  }

  private pass(r: WebGLRenderer, mat: ShaderMaterial, target: WebGLRenderTarget | null): void {
    this.mesh.material = mat;
    r.setRenderTarget(target);
    r.render(this.scene, this.cam);
  }

  render(r: WebGLRenderer, hdr: Texture, out: WebGLRenderTarget | null): void {
    // 降采样链
    let src: Texture = hdr;
    let sw = this.w;
    let sh = this.h;
    for (let i = 0; i < this.levels.length; i++) {
      this.down.uniforms.tSrc.value = src;
      this.down.uniforms.uTexel.value.set(1 / sw, 1 / sh);
      this.down.uniforms.uFirst.value = i === 0 ? 1 : 0;
      this.pass(r, this.down, this.levels[i]);
      src = this.levels[i].texture;
      sw = this.levels[i].width;
      sh = this.levels[i].height;
    }
    // 局部曝光：在叠加辉光之前，把第 3 级再模糊一次存起来（约 1/32 分辨率）
    const l3 = this.levels[2];
    this.down.uniforms.tSrc.value = l3.texture;
    this.down.uniforms.uTexel.value.set(1 / l3.width, 1 / l3.height);
    this.down.uniforms.uFirst.value = 0;
    this.pass(r, this.down, this.localRT!);
    // 升采样：逐级叠加
    for (let i = this.levels.length - 1; i > 0; i--) {
      const s = this.levels[i];
      this.up.uniforms.tSrc.value = s.texture;
      this.up.uniforms.uTexel.value.set(1 / s.width, 1 / s.height);
      this.up.uniforms.uWeight.value = 1;
      this.pass(r, this.up, this.levels[i - 1]);
    }
    const c = this.composite.uniforms;
    c.tHdr.value = hdr;
    c.tBloom.value = this.levels[0].texture;
    c.tLocal.value = this.localRT!.texture;
    c.uRes.value.set(this.w, this.h);
    this.pass(r, this.composite, out);
  }
}
