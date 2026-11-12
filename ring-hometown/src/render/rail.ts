// 铁路：道床上的轨枕与钢轨、接触网立柱、站台、铁路桥，以及按时刻表往来的列车
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  ShaderMaterial,
  Sphere,
  Vector3,
} from 'three';
import { NEAR_HEADER } from './terrainMesh';
import common from '../glsl/common.glsl';
import { U } from './uniforms';
import { NU } from './nearUniforms';
import { railLine, riverLevel, riverHalfWidth, sampleAt, STATION, Polyline } from '../world/geo';
import { mergeBoxes } from './townMesh';
import type { Terrain } from '../world/terrain';

const GENERIC = /* glsl */ `
#ifdef VERTEX
attribute vec2 uvw;
varying vec3 vW;
varying vec3 vN;
varying vec2 vUvw;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  vUvw = uvw;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
uniform float uKind; // 0 轨道带, 1 混凝土结构, 2 金属立柱
varying vec3 vW;
varying vec3 vN;
varying vec2 vUvw;
void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  SHADOW_OUT(vW)
  vec3 N = normalize(vN);
  float camD = length(cameraPosition - vW);
  float px = camD * uPixAng;
  vec3 alb;
  float rough = 0.9;
  float wet = uWet * 0.6;
  if (uKind < 0.5) {
    // 轨道：u = 沿线距离，v = 横向（米）
    float u = vUvw.x;
    float v = vUvw.y;
    vec3 ballast = vec3(0.17, 0.16, 0.15) * (0.85 + 0.3 * vnoise2(vec2(u, v) * 3.0));
    float sl = smoothstep(0.62, 0.5, abs(fract(u / 0.6) - 0.5)) * step(abs(v), 1.3);
    float fade = 1.0 - smoothstep(0.08, 0.5, px);
    vec3 sleeper = vec3(0.25, 0.24, 0.23);
    alb = mix(ballast, sleeper, sl * fade + 0.35 * (1.0 - fade) * step(abs(v), 1.3));
    float rails = (1.0 - smoothstep(0.035, 0.035 + px, abs(abs(v) - 0.7175)));
    alb = mix(alb, vec3(0.32, 0.31, 0.3), rails * max(fade, 0.3));
    rough = mix(rough, 0.25, rails);
  } else if (uKind < 1.5) {
    alb = vec3(0.36, 0.35, 0.33) * (0.9 + 0.2 * vnoise2(vW.xz * 0.2 + vW.y * 0.5));
  } else {
    alb = vec3(0.24, 0.25, 0.27);
    rough = 0.5;
  }
  vec3 col = shade(alb, N, vW, 1.0, rough, wet, cloudShadow(vW.xz * 0.001), keyShadow(vW, N));
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, 1.0);
}
#endif
`;

function genericMat(kind: number): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: '#define VERTEX\n' + common + GENERIC,
    fragmentShader: '#define FRAGMENT\n' + NEAR_HEADER + GENERIC,
    uniforms: { ...U, ...NU, uKind: { value: kind } },
  });
}

/** 轨道顶面高度 */
export function railHeight(terrain: Terrain, x: number, z: number): number {
  const grade = riverLevel(x) + 5.6 + 0.35;
  const w = terrain.nearWeight(x, z);
  const hT = terrain.height(x, z) + 0.3;
  return w > 0.5 ? grade : Math.max(hT, grade * w + hT * (1 - w));
}

export interface RailSystem {
  meshes: Mesh[];
  train: Train;
}

export function createRail(terrain: Terrain): RailSystem {
  const pl = railLine;
  const meshes: Mesh[] = [];
  // ---------- 轨道带 ----------
  const P: number[] = [];
  const Nn: number[] = [];
  const UV: number[] = [];
  const idx: number[] = [];
  let row = 0;
  const halfW = 1.7;
  const sStart = 0;
  for (let s = sStart; s <= pl.length; s += 6) {
    const { p, t } = sampleAt(pl, s);
    if (p[0] < -14000 || p[0] > 26000) continue;
    const y = railHeight(terrain, p[0], p[1]);
    for (const a of [-1, 1]) {
      P.push(p[0] - t[1] * halfW * a, y, p[1] + t[0] * halfW * a);
      Nn.push(0, 1, 0);
      UV.push(s, halfW * a);
    }
    if (row > 0) {
      const b = (row - 1) * 2;
      const c = row * 2;
      idx.push(b, b + 1, c, b + 1, c + 1, c);
    }
    row++;
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(P), 3));
  g.setAttribute('normal', new BufferAttribute(new Float32Array(Nn), 3));
  g.setAttribute('uvw', new BufferAttribute(new Float32Array(UV), 2));
  g.setIndex(idx);
  g.boundingSphere = new Sphere(new Vector3(6000, -60, 1500), 24000);
  meshes.push(new Mesh(g, genericMat(0)));

  // ---------- 接触网立柱、站台、雨棚、铁路桥 ----------
  const parts: BufferGeometry[] = [];
  const metal: BufferGeometry[] = [];
  const addBox = (list: BufferGeometry[], w: number, h: number, d: number, x: number, y: number, z: number, rot: number) => {
    const b = new BoxGeometry(w, h, d).toNonIndexed();
    b.rotateY(rot);
    b.translate(x, y, z);
    list.push(b);
  };
  for (let s = 20; s < pl.length; s += 55) {
    const { p, t } = sampleAt(pl, s);
    if (p[0] < -6000 || p[0] > 21000) continue;
    const y = railHeight(terrain, p[0], p[1]);
    const rot = -Math.atan2(t[1], t[0]);
    const ox = -t[1] * 3.1;
    const oz = t[0] * 3.1;
    addBox(metal, 0.3, 7.2, 0.3, p[0] + ox, y + 3.6, p[1] + oz, rot);
    addBox(metal, 0.12, 0.12, 3.6, p[0] + ox * 0.45, y + 6.6, p[1] + oz * 0.45, rot);
  }
  // 站台
  {
    const sp = nearestS(pl, STATION.x);
    for (let s = sp - STATION.len / 2; s < sp + STATION.len / 2; s += 10) {
      const { p, t } = sampleAt(pl, s);
      const y = railHeight(terrain, p[0], p[1]);
      const rot = -Math.atan2(t[1], t[0]);
      addBox(parts, 10.2, 1.0, 5.2, p[0] - t[1] * 4.6, y - 0.1, p[1] + t[0] * 4.6, rot);
      // 雨棚
      if (Math.abs(s - sp) < 55) {
        addBox(metal, 10.2, 0.18, 5.6, p[0] - t[1] * 4.8, y + 4.2, p[1] + t[0] * 4.8, rot);
        addBox(metal, 0.25, 3.8, 0.25, p[0] - t[1] * 5.6, y + 2.2, p[1] + t[0] * 5.6, rot);
      }
    }
  }
  // 铁路桥：铁路跨河处
  for (let s = 0; s < pl.length; s += 4) {
    const { p, t } = sampleAt(pl, s);
    if (p[0] < -6000 || p[0] > 26000) continue;
    const dr = terrain.riverDist(p[0], p[1]);
    const hw = riverHalfWidth(p[0]);
    if (dr < hw + 14) {
      const y = railHeight(terrain, p[0], p[1]);
      const rot = -Math.atan2(t[1], t[0]);
      addBox(parts, 4.4, 1.6, 6.0, p[0], y - 1.0, p[1], rot + Math.PI / 2);
      if (Math.round(s) % 24 === 0) addBox(parts, 3.0, 9, 2.0, p[0], y - 5.5, p[1], rot + Math.PI / 2);
      // 钢桁架
      for (const a of [-1, 1]) addBox(metal, 6.2, 0.35, 0.3, p[0] - t[1] * 2.2 * a, y + 1.6, p[1] + t[0] * 2.2 * a, rot);
    }
  }
  const concrete = new Mesh(withUv(mergeBoxes(parts)), genericMat(1));
  concrete.geometry.boundingSphere = new Sphere(new Vector3(6000, -60, 1500), 24000);
  meshes.push(concrete);
  const steel = new Mesh(withUv(mergeBoxes(metal)), genericMat(2));
  steel.geometry.boundingSphere = new Sphere(new Vector3(6000, -60, 1500), 24000);
  meshes.push(steel);

  const train = new Train(terrain, pl);
  meshes.push(train.mesh);
  return { meshes, train };
}

function withUv(g: BufferGeometry): BufferGeometry {
  const n = g.getAttribute('position').count;
  g.setAttribute('uvw', new BufferAttribute(new Float32Array(n * 2), 2));
  return g;
}

function nearestS(pl: Polyline, x: number): number {
  let lo = 0;
  let hi = pl.length;
  for (let i = 0; i < 40; i++) {
    const m = (lo + hi) / 2;
    if (sampleAt(pl, m).p[0] < x) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// ---------- 列车 ----------
const TRAIN_GLSL = /* glsl */ `
#ifdef VERTEX
attribute vec4 iCar;  // x, y, z, heading
attribute vec4 iCar2; // 车厢序号, 是否车头(±1), 可见, -
varying vec3 vW;
varying vec3 vN;
varying vec3 vL;
varying vec4 vCar2;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  vec3 p = position; // 单位盒，x 沿车身
  vec3 lp = vec3(p.x * 25.0, p.y * 3.7 + 1.85 + 0.35, p.z * 3.2);
  // 车头流线
  float nose = iCar2.y;
  if (nose != 0.0 && p.x * nose > 0.45) lp.y -= (p.y > 0.3 ? 1.1 : 0.0);
  float c = cos(iCar.w), s = sin(iCar.w);
  vec3 wp = vec3(c * lp.x - s * lp.z, lp.y, s * lp.x + c * lp.z) + iCar.xyz;
  if (iCar2.z < 0.5) wp = vec3(0.0, -1.0e5, 0.0);
  vW = wp;
  vN = vec3(c * normal.x - s * normal.z, normal.y, s * normal.x + c * normal.z);
  vL = vec3(p.x * 25.0, lp.y, p.z);
  vCar2 = iCar2;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
varying vec3 vW;
varying vec3 vN;
varying vec3 vL;
varying vec4 vCar2;
void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  SHADOW_OUT(vW)
  vec3 N = normalize(vN);
  vec3 alb = vec3(0.72, 0.73, 0.74);
  // 腰线与窗带
  float y = vL.y;
  float stripe = step(1.25, y) * step(y, 1.55);
  alb = mix(alb, vec3(0.12, 0.3, 0.42), stripe);
  float win = step(2.0, y) * step(y, 3.1) * step(0.12, fract(vL.x / 2.6)) * step(abs(N.y), 0.5);
  alb = mix(alb, vec3(0.03, 0.035, 0.04), win);
  vec3 col = shade(alb, N, vW, 1.0, mix(0.4, 0.1, win), max(uWet, win), cloudShadow(vW.xz * 0.001), keyShadow(vW, N));
  float night = smoothstep(0.2, 0.6, uNight);
  col += vec3(1.0, 0.92, 0.8) * win * 0.004 * night;
  // 车头灯
  if (vCar2.y != 0.0 && vL.x * vCar2.y > 12.0 && y < 1.9 && y > 0.9) col += vec3(1.0, 0.95, 0.85) * 0.3 * (0.3 + night);
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, 1.0);
}
#endif
`;

export class Train {
  readonly mesh: Mesh;
  private a1: InstancedBufferAttribute;
  private a2: InstancedBufferAttribute;
  private cars = 4;
  private nTrains = 2;
  /** 当前是否有车在镇附近（供状态显示） */
  nearTown = false;

  constructor(private terrain: Terrain, private pl: Polyline) {
    const box = new BoxGeometry(1, 1, 1).toNonIndexed();
    const g = new InstancedBufferGeometry();
    g.setAttribute('position', box.getAttribute('position'));
    g.setAttribute('normal', box.getAttribute('normal'));
    const n = this.cars * this.nTrains;
    this.a1 = new InstancedBufferAttribute(new Float32Array(n * 4), 4);
    this.a2 = new InstancedBufferAttribute(new Float32Array(n * 4), 4);
    g.setAttribute('iCar', this.a1);
    g.setAttribute('iCar2', this.a2);
    g.instanceCount = n;
    g.boundingSphere = new Sphere(new Vector3(6000, -60, 1500), 30000);
    const mat = new ShaderMaterial({
      vertexShader: '#define VERTEX\n' + common + TRAIN_GLSL,
      fragmentShader: '#define FRAGMENT\n' + NEAR_HEADER + TRAIN_GLSL,
      uniforms: { ...U, ...NU },
    });
    this.mesh = new Mesh(g, mat);
    this.mesh.frustumCulled = false;
  }

  /** t：模拟时间（日）。每 40 分钟一对列车，东行与西行错开 20 分钟，进站停 50 秒 */
  update(t: number): void {
    const period = 40 / 1440;
    const L = this.pl.length;
    const sStation = nearestS(this.pl, STATION.x);
    const sA = nearestS(this.pl, -14000);
    const sB = nearestS(this.pl, 26000);
    const v = 33; // m/s
    const dwell = 50;
    this.nearTown = false;
    for (let k = 0; k < this.nTrains; k++) {
      const east = k === 0;
      const phase = (((t + (east ? 0 : period / 2)) % period) + period) % period;
      const sec = phase * 86400;
      // 从起点出发，到车站减速停靠，再加速驶离
      const d1 = Math.abs(sStation - (east ? sA : sB));
      const tArr = d1 / v;
      let dist: number;
      if (sec < tArr) dist = sec * v;
      else if (sec < tArr + dwell) dist = d1;
      else dist = d1 + (sec - tArr - dwell) * v;
      // 进出站时的减速与加速（平滑）
      const brake = 600;
      if (sec < tArr && d1 - dist < brake) {
        const rem = d1 - dist;
        dist = d1 - brake * Math.pow(rem / brake, 2) * 0.5 - rem * 0.5;
      }
      const s = east ? sA + dist : sB - dist;
      const visible = s > sA - 200 && s < sB + 200 && s > 0 && s < L;
      for (let c = 0; c < this.cars; c++) {
        const sc = east ? s - c * 26 - 13 : s + c * 26 + 13;
        const { p, t: tg } = sampleAt(this.pl, Math.max(0, Math.min(L, sc)));
        const y = railHeight(this.terrain, p[0], p[1]);
        const heading = Math.atan2(tg[1], tg[0]);
        const i = k * this.cars + c;
        this.a1.setXYZW(i, p[0], y, p[1], heading);
        const nose = c === 0 ? (east ? 1 : -1) : c === this.cars - 1 ? (east ? -1 : 1) : 0;
        this.a2.setXYZW(i, c, nose, visible ? 1 : 0, 0);
        if (visible && Math.abs(p[0] - 1500) < 4000) this.nearTown = true;
      }
    }
    this.a1.needsUpdate = true;
    this.a2.needsUpdate = true;
  }
}
