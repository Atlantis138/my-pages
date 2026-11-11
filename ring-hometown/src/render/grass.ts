// 山顶脚下的草：观察点周围几十米内的实例化草叶，随风摆动、随季节变色
import { BufferAttribute, InstancedBufferAttribute, InstancedBufferGeometry, Mesh, ShaderMaterial, Sphere, Vector3 } from 'three';
import { NEAR_HEADER } from './terrainMesh';
import common from '../glsl/common.glsl';
import { U } from './uniforms';
import { NU } from './nearUniforms';
import type { Terrain } from '../world/terrain';
import { vnoise2 } from '../world/geo';

const GLSL = /* glsl */ `
#ifdef VERTEX
attribute vec4 iBlade; // x, y, z, 高度
attribute vec4 iVar;   // 朝向, 弯曲, 色差, 花
uniform float uTimeS;
uniform vec2 uWind;
varying vec3 vW;
varying vec3 vN;
varying float vT;
varying vec2 vVar;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  float t = position.y;          // 0..1 沿叶片
  float side = position.x;       // -1..1
  float h = iBlade.w;
  float a = iVar.x;
  vec2 dir = vec2(cos(a), sin(a));
  float w = (0.016 + 0.01 * iVar.z) * (1.0 - t * 0.85);
  float wind = length(uWind);
  vec2 wd = wind > 0.01 ? uWind / wind : vec2(1.0, 0.0);
  float gust = 0.55 + 0.45 * sin(uTimeS * 1.7 + iBlade.x * 0.31 + iBlade.z * 0.23) * sin(uTimeS * 0.43 + iBlade.x * 0.05);
  float bend = iVar.y + (0.06 + 0.04 * wind) * gust;
  vec2 off = (dir * iVar.y + wd * (0.04 + 0.035 * wind) * gust) * t * t * h;
  vec3 p = vec3(iBlade.x, iBlade.y, iBlade.z);
  vec2 perp = vec2(-dir.y, dir.x);
  p.xz += perp * side * w + off;
  p.y += t * h * (1.0 - 0.3 * bend * bend);
  vW = p;
  vN = normalize(vec3(dir.x * 0.4, 0.8, dir.y * 0.4) + vec3(perp.x, 0.0, perp.y) * side * 0.3);
  vT = t;
  vVar = iVar.zw;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
uniform vec4 uSeasonA;
uniform vec4 uSeasonD;
varying vec3 vW;
varying vec3 vN;
varying float vT;
varying vec2 vVar;
void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  SHADOW_OUT(vW)
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 base = mix(vec3(0.05, 0.09, 0.03), vec3(0.11, 0.17, 0.05), vVar.x);
  base = mix(base, vec3(0.13, 0.21, 0.05), uSeasonA.w * 0.6);
  base = mix(base, vec3(0.2, 0.17, 0.09), uSeasonA.z * (0.6 + 0.4 * vVar.x));
  vec3 alb = mix(base * 0.55, base, vT);
  // 野花（春夏）
  float flower = step(0.965, vVar.y) * step(0.82, vT) * (uSeasonA.w * 0.7 + uSeasonD.z + 0.25) * (1.0 - uSeasonA.z);
  vec3 fc = vVar.y > 0.985 ? vec3(0.7, 0.62, 0.15) : (vVar.y > 0.975 ? vec3(0.6, 0.58, 0.62) : vec3(0.42, 0.3, 0.55));
  alb = mix(alb, fc, sat(flower));
  float cs = cloudShadow(vW.xz * 0.001);
  vec3 col = shade(alb, N, vW, mix(0.45, 1.0, vT), 0.85, uWet * 0.25, cs, 1.0);
  // 透光
  col += alb * uMirrorE * cs * 0.12 * vT;
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, 1.0);
}
#endif
`;

export function createGrass(terrain: Terrain, quality: number): Mesh {
  const count = quality >= 2 ? 90000 : quality === 1 ? 52000 : 22000;
  // 叶片：两节、五个顶点（三角形条带展开为三角形）
  const P = [
    -1, 0, 0, 1, 0, 0, -1, 0.5, 0,
    1, 0, 0, 1, 0.5, 0, -1, 0.5, 0,
    -1, 0.5, 0, 1, 0.5, 0, 0, 1, 0,
  ];
  const g = new InstancedBufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(P), 3));
  const blade = new Float32Array(count * 4);
  const vars = new Float32Array(count * 4);
  let s = 4242;
  const r = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  let n = 0;
  let guard = 0;
  while (n < count && guard < count * 4) {
    guard++;
    // 越近越密
    const rad = 0.5 + Math.pow(r(), 2.0) * 30;
    const a = r() * Math.PI * 2;
    const x = Math.cos(a) * rad - 2;
    const z = Math.sin(a) * rad;
    // 山顶小路上少草
    const onPath = Math.abs(z - x * 0.6) < 0.9 && x > 2 && x < 40;
    if (onPath && r() < 0.85) continue;
    // 与地形顶点着色器相同的微地形
    const rr = Math.hypot(x, z);
    const ss = Math.max(0, Math.min(1, (rr - 50) / 210));
    const y = terrain.height(x, z) + (vnoise2(x * 0.33, z * 0.33) - 0.5) * 0.22 * (1 - ss * ss * (3 - 2 * ss));
    if (y < -20) continue;
    const h = 0.07 + Math.pow(r(), 1.8) * 0.26 + (rad > 12 ? 0.06 : 0);
    blade.set([x, y - 0.02, z, h], n * 4);
    vars.set([r() * Math.PI * 2, (r() - 0.5) * 0.5, r(), r()], n * 4);
    n++;
  }
  g.setAttribute('iBlade', new InstancedBufferAttribute(blade.subarray(0, n * 4), 4));
  g.setAttribute('iVar', new InstancedBufferAttribute(vars.subarray(0, n * 4), 4));
  g.instanceCount = n;
  g.boundingSphere = new Sphere(new Vector3(0, 0, 0), 40);
  const mat = new ShaderMaterial({
    vertexShader: '#define VERTEX\n' + common + GLSL,
    fragmentShader: '#define FRAGMENT\n' + NEAR_HEADER + GLSL,
    uniforms: { ...U, ...NU },
    side: 2,
  });
  return new Mesh(g, mat);
}
