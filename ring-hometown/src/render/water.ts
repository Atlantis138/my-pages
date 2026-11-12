// 河面：沿河道的带状网格；反射天空（环境图）与岸上景物（屏幕空间），风与雨改变水面
import { BufferAttribute, BufferGeometry, Mesh, ShaderMaterial, Sphere, Vector3 } from 'three';
import { NEAR_HEADER } from './terrainMesh';
import common from '../glsl/common.glsl';
import { U } from './uniforms';
import { NU } from './nearUniforms';
import { riverLine, riverLevel, riverHalfWidth, sampleAt } from '../world/geo';
import type { Terrain } from '../world/terrain';

const WATER_GLSL = /* glsl */ `
#ifdef VERTEX
attribute vec2 flow; // 沿河距离、横向 -1..1
varying vec3 vW;
varying vec2 vFlow;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  vW = position;
  vFlow = flow;
  gl_Position = projectionMatrix * viewMatrix * vec4(position.x, position.y + position.x * position.x * 1.0e-8, position.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
uniform sampler2D tScene;   // rgb = 场景颜色，a = 视距（米）
uniform mat4 uViewProj;
varying vec3 vW;
varying vec2 vFlow;

// 水面法线：风浪 + 顺流的波纹 + 雨点涟漪
vec3 waterNormal(vec3 w, float px) {
  float wind = length(uWind);
  float k = 0.012 + 0.012 * min(wind, 10.0);
  vec2 p = w.xz;
  vec2 drift = uWind * uTimeS * 0.06;
  float t = uTimeS;
  vec2 g = vec2(0.0);
  float fade = 1.0 - smoothstep(0.15, 2.5, px);
  // 两层随风移动的噪声
  for (int i = 0; i < 3; i++) {
    float s = 0.6 * pow(2.2, float(i));
    vec2 q = (p - drift * (1.0 + float(i) * 0.4)) * s / 6.0;
    float e = 0.07;
    float n0 = vnoise2(q + float(i) * 13.1 + t * 0.05);
    float nx = vnoise2(q + vec2(e, 0.0) + float(i) * 13.1 + t * 0.05);
    float nz = vnoise2(q + vec2(0.0, e) + float(i) * 13.1 + t * 0.05);
    g += vec2(n0 - nx, n0 - nz) / e * (0.5 / pow(1.8, float(i)));
  }
  g *= k * mix(0.35, 1.0, fade);
  // 顺流的细长波纹
  g.x += sin(vFlow.x * 0.9 - t * 1.4 + vFlow.y * 2.0) * 0.006 * fade;
  // 雨点涟漪
  if (uRain > 0.01) {
    vec2 cell = floor(p * 1.6);
    for (int j = 0; j < 4; j++) {
      vec2 c = cell + vec2(float(j % 2), float(j / 2));
      vec2 o = hash22(c) ;
      float ph = fract(t * 0.9 + hash12(c + 3.1));
      vec2 d = p * 1.6 - (c + o);
      float r = length(d);
      float ring = sin((r - ph * 1.2) * 28.0) * exp(-r * 4.0) * (1.0 - ph) * step(hash12(c * 1.3), uRain * 0.9 + 0.1);
      g += normalize(d + 1e-4) * ring * 0.12 * uRain * fade;
    }
  }
  return normalize(vec3(-g.x, 1.0, -g.y));
}

void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  vec3 w = vW;
  vec3 V = normalize(cameraPosition - w);
  float camD = length(cameraPosition - w);
  float px = camD * uPixAng / max(V.y, 0.03);
  vec3 N = waterNormal(w, px);
  vec3 R = reflect(-V, N);
  R.y = abs(R.y);
  float F = 0.02 + 0.98 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
  // 天空反射
  vec3 refl = envSpec(R, 0.03 + 0.1 * smoothstep(0.5, 6.0, px));
  // 屏幕空间反射：沿反射方向找岸上的景物
  vec4 c0 = uViewProj * vec4(w, 1.0);
  vec2 uv0 = c0.xy / c0.w * 0.5 + 0.5;
  float hitA = 0.0;
  vec3 hitC = vec3(0.0);
  float stepLen = max(camD * 0.025, 1.5);
  vec3 q = w;
  for (int i = 0; i < 20; i++) {
    q += R * stepLen;
    stepLen *= 1.18;
    vec4 c = uViewProj * vec4(q, 1.0);
    if (c.w <= 0.0) break;
    vec2 uv = c.xy / c.w * 0.5 + 0.5;
    if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) break;
    vec4 sc = texture(tScene, uv);
    float qd = length(q - cameraPosition);
    if (sc.a < qd && sc.a > qd - stepLen * 3.0 - 6.0) {
      float edge = smoothstep(0.0, 0.08, min(min(uv.x, uv.y), min(1.0 - uv.x, 1.0 - uv.y)));
      hitC = sc.rgb;
      hitA = edge;
      break;
    }
  }
  refl = mix(refl, hitC, hitA);
  // 水体本色：微浑的青绿，雨后更浑
  vec3 body = mix(vec3(0.012, 0.02, 0.018), vec3(0.03, 0.03, 0.022), uWet);
  vec3 lit = body * (uMirrorE + uAmbSky * 1.5 + uArchE * 1.5) / PI;
  vec3 col = mix(lit, refl, F);
  // 镜光在水面上的高光（光源在头顶，只有俯视近处才看得到）
  float sp = pow(max(dot(R, uMirrorDir), 0.0), 300.0);
  col += uMirrorE * sp * 40.0 * F;
  // 雾与空气透视
  col = applyAtmos(col, w);
  // 岸边渐隐（与地形相交处柔和）
  gl_FragColor = vec4(col, 1.0);
}
#endif
`;

export function createWater(terrain: Terrain): { mesh: Mesh; mat: ShaderMaterial } {
  const pl = riverLine;
  const P: number[] = [];
  const F: number[] = [];
  const idx: number[] = [];
  const step = 12;
  let row = 0;
  const across = 5;
  for (let s = 0; s <= pl.length; s += step) {
    const { p, t } = sampleAt(pl, s);
    const x = p[0];
    if (x < -42000 || x > 90000) continue;
    const hw = riverHalfWidth(x) + 16;
    // 远离近景高程网格的地方，地形未刻河道 → 水面抬到谷底之上
    const wNear = terrain.nearWeight(x, p[1]);
    const y = riverLevel(x) + (1 - wNear) * 3.6;
    for (let j = 0; j <= across; j++) {
      const a = (j / across) * 2 - 1;
      P.push(x - t[1] * hw * a, y, p[1] + t[0] * hw * a);
      F.push(s, a);
    }
    if (row > 0) {
      const b = (row - 1) * (across + 1);
      const c = row * (across + 1);
      for (let j = 0; j < across; j++) idx.push(b + j, b + j + 1, c + j, b + j + 1, c + j + 1, c + j);
    }
    row++;
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(P), 3));
  g.setAttribute('flow', new BufferAttribute(new Float32Array(F), 2));
  g.setIndex(idx);
  g.boundingSphere = new Sphere(new Vector3(20000, -70, 4000), 90000);
  const mat = new ShaderMaterial({
    vertexShader: '#define VERTEX\n' + common + WATER_GLSL,
    fragmentShader: '#define FRAGMENT\n' + NEAR_HEADER + WATER_GLSL,
    uniforms: {
      ...U,
      ...NU,
      tScene: { value: null },
      uViewProj: { value: null },
    },
  });
  const mesh = new Mesh(g, mat);
  return { mesh, mat };
}
