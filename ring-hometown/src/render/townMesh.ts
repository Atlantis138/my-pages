// 建筑、路灯、桥梁的网格
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
import buildingGlsl from '../glsl/building.glsl';
import { NEAR_HEADER } from './terrainMesh';
import common from '../glsl/common.glsl';
import { U } from './uniforms';
import { NU } from './nearUniforms';
import type { Building, TownData } from '../world/town';

function bodyGeometry(): BufferGeometry {
  // 单位盒：x,z ∈ [-0.5,0.5]，y ∈ [0,1]，无底面
  const P: number[] = [];
  const Nn: number[] = [];
  const quad = (a: number[], b: number[], c: number[], d: number[], n: number[]) => {
    P.push(...a, ...b, ...c, ...a, ...c, ...d);
    for (let i = 0; i < 6; i++) Nn.push(...n);
  };
  const h = 0.5;
  quad([h, 0, h], [h, 0, -h], [h, 1, -h], [h, 1, h], [1, 0, 0]);
  quad([-h, 0, -h], [-h, 0, h], [-h, 1, h], [-h, 1, -h], [-1, 0, 0]);
  quad([-h, 0, h], [h, 0, h], [h, 1, h], [-h, 1, h], [0, 0, 1]);
  quad([h, 0, -h], [-h, 0, -h], [-h, 1, -h], [h, 1, -h], [0, 0, -1]);
  quad([-h, 1, h], [h, 1, h], [h, 1, -h], [-h, 1, -h], [0, 1, 0]);
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(P), 3));
  g.setAttribute('normal', new BufferAttribute(new Float32Array(Nn), 3));
  return g;
}

function roofGeometry(): BufferGeometry {
  // 屋脊沿 x：檐口 y=0、z=±0.5；屋脊 y=1、z=0
  const P: number[] = [];
  const Nn: number[] = [];
  const h = 0.5;
  const tri = (a: number[], b: number[], c: number[], n: number[]) => {
    P.push(...a, ...b, ...c);
    for (let i = 0; i < 3; i++) Nn.push(...n);
  };
  // 南坡（+z）
  tri([-h, 0, h], [h, 0, h], [h, 1, 0], [0, 0.5, 1]);
  tri([-h, 0, h], [h, 1, 0], [-h, 1, 0], [0, 0.5, 1]);
  // 北坡（-z）
  tri([h, 0, -h], [-h, 0, -h], [-h, 1, 0], [0, 0.5, -1]);
  tri([h, 0, -h], [-h, 1, 0], [h, 1, 0], [0, 0.5, -1]);
  // 山墙
  tri([h, 0, h], [h, 0, -h], [h, 1, 0], [1, 0, 0]);
  tri([-h, 0, -h], [-h, 0, h], [-h, 1, 0], [-1, 0, 0]);
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(P), 3));
  const n = new Float32Array(Nn);
  for (let i = 0; i < n.length; i += 3) {
    const L = Math.hypot(n[i], n[i + 1], n[i + 2]);
    n[i] /= L;
    n[i + 1] /= L;
    n[i + 2] /= L;
  }
  g.setAttribute('normal', new BufferAttribute(n, 3));
  return g;
}

function instanceGeo(base: BufferGeometry, list: Building[]): InstancedBufferGeometry {
  const g = new InstancedBufferGeometry();
  g.setAttribute('position', base.getAttribute('position'));
  g.setAttribute('normal', base.getAttribute('normal'));
  const n = list.length;
  const pos = new Float32Array(n * 4);
  const size = new Float32Array(n * 4);
  const wall = new Float32Array(n * 4);
  const roof = new Float32Array(n * 4);
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  list.forEach((b, i) => {
    pos.set([b.x, b.y, b.z, b.rot], i * 4);
    size.set([b.w, b.h, b.d, b.roof], i * 4);
    wall.set([...b.wall, b.seed], i * 4);
    roof.set([...b.roofC, b.kind], i * 4);
    minX = Math.min(minX, b.x); maxX = Math.max(maxX, b.x);
    minZ = Math.min(minZ, b.z); maxZ = Math.max(maxZ, b.z);
  });
  g.setAttribute('iPos', new InstancedBufferAttribute(pos, 4));
  g.setAttribute('iSize', new InstancedBufferAttribute(size, 4));
  g.setAttribute('iWall', new InstancedBufferAttribute(wall, 4));
  g.setAttribute('iRoof', new InstancedBufferAttribute(roof, 4));
  g.instanceCount = n;
  const c = new Vector3((minX + maxX) / 2, 0, (minZ + maxZ) / 2);
  g.boundingSphere = new Sphere(c, Math.hypot(maxX - minX, maxZ - minZ) / 2 + 200);
  return g;
}

export function buildingMaterial(roof: boolean): ShaderMaterial {
  const defs = roof ? '#define ROOF\n' : '';
  return new ShaderMaterial({
    vertexShader: '#define VERTEX\n' + defs + common + '\n' + buildingGlsl,
    fragmentShader: '#define FRAGMENT\n' + defs + NEAR_HEADER + buildingGlsl,
    uniforms: { ...U, ...NU },
  });
}

export function createTownMeshes(town: TownData): Mesh[] {
  const out: Mesh[] = [];
  const bodies = new Mesh(instanceGeo(bodyGeometry(), town.buildings), buildingMaterial(false));
  out.push(bodies);
  const pitched = town.buildings.filter((b) => b.roof > 0.5);
  if (pitched.length) out.push(new Mesh(instanceGeo(roofGeometry(), pitched), buildingMaterial(true)));
  out.push(lampMesh(town));
  for (const br of town.bridges) out.push(bridgeMesh(br));
  return out;
}

// ---------- 路灯：灯杆 + 灯头（夜里发光） ----------
const LAMP_GLSL = /* glsl */ `
#ifdef VERTEX
attribute vec4 iLamp; // x, y, z, h
attribute float part;
varying vec3 vW;
varying float vHead;
varying vec3 vN;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  vec3 p = position;
  vec3 lp = part < 0.5 ? vec3(p.x * 0.14, p.y * iLamp.w, p.z * 0.14) : vec3(p.x * 0.8 + 0.3, iLamp.w + p.y * 0.2, p.z * 0.34);
  vec3 wp = lp + iLamp.xyz;
  vW = wp;
  vHead = part;
  vN = normal;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
varying vec3 vW;
varying float vHead;
varying vec3 vN;
void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  SHADOW_OUT(vW)
  vec3 N = normalize(vN);
  vec3 alb = vec3(0.12, 0.12, 0.13);
  vec3 col = shade(alb, N, vW, 1.0, 0.5, uWet, 1.0, 1.0);
  float on = smoothstep(0.25, 0.55, uNight);
  col += vHead * vec3(1.0, 0.78, 0.5) * on * 0.5 * (N.y < -0.5 ? 1.0 : 0.15);
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, 1.0);
}
#endif
`;

function lampMesh(town: TownData): Mesh {
  const pole = new BoxGeometry(1, 1, 1).toNonIndexed();
  pole.translate(0, 0.5, 0);
  const head = new BoxGeometry(1, 1, 1).toNonIndexed();
  const merged = mergeBoxes([pole, head]);
  const nPole = pole.getAttribute('position').count;
  const nHead = head.getAttribute('position').count;
  const part = new Float32Array(nPole + nHead);
  part.fill(1, nPole);
  const g = new InstancedBufferGeometry();
  g.setAttribute('position', merged.getAttribute('position'));
  g.setAttribute('normal', merged.getAttribute('normal'));
  g.setAttribute('part', new BufferAttribute(part, 1));
  const arr = new Float32Array(town.lamps.length * 4);
  town.lamps.forEach((l, i) => arr.set([l.x, l.y, l.z, l.h], i * 4));
  g.setAttribute('iLamp', new InstancedBufferAttribute(arr, 4));
  g.instanceCount = town.lamps.length;
  g.boundingSphere = new Sphere(new Vector3(2000, -60, 500), 12000);
  const mat = new ShaderMaterial({
    vertexShader: '#define VERTEX\n' + common + LAMP_GLSL,
    fragmentShader: '#define FRAGMENT\n' + NEAR_HEADER + LAMP_GLSL,
    uniforms: { ...U, ...NU },
  });
  return new Mesh(g, mat);
}

// ---------- 桥 ----------
const BRIDGE_GLSL = /* glsl */ `
#ifdef VERTEX
varying vec3 vW;
varying vec3 vN;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif
#ifdef FRAGMENT
varying vec3 vW;
varying vec3 vN;
void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  SHADOW_OUT(vW)
  vec3 N = normalize(vN);
  vec3 alb = vec3(0.34, 0.33, 0.31) * (0.9 + 0.2 * vnoise2(vW.xz * 0.3 + vW.y));
  if (N.y > 0.9) alb = vec3(0.06, 0.06, 0.065);
  vec3 col = shade(alb, N, vW, 1.0, 0.8, uWet, cloudShadow(vW.xz * 0.001), keyShadow(vW, N));
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, 1.0);
}
#endif
`;

function bridgeMesh(br: { a: [number, number]; b: [number, number]; width: number; y: number }): Mesh {
  const dx = br.b[0] - br.a[0];
  const dz = br.b[1] - br.a[1];
  const L = Math.hypot(dx, dz);
  const geo = new BoxGeometry(br.width, 1.2, L + 4);
  const parts: BufferGeometry[] = [geo];
  // 桥墩
  for (let k = 1; k < 4; k++) {
    const pier = new BoxGeometry(br.width * 0.7, 9, 2.2);
    pier.translate(0, -5, -L / 2 + (L * k) / 4);
    parts.push(pier);
  }
  // 栏杆
  for (const s of [-1, 1]) {
    const rail = new BoxGeometry(0.25, 1.1, L + 4);
    rail.translate(s * (br.width / 2 - 0.15), 1.15, 0);
    parts.push(rail);
  }
  const merged = mergeBoxes(parts);
  const mat = new ShaderMaterial({
    vertexShader: '#define VERTEX\n' + common + BRIDGE_GLSL,
    fragmentShader: '#define FRAGMENT\n' + NEAR_HEADER + BRIDGE_GLSL,
    uniforms: { ...U, ...NU },
  });
  const m = new Mesh(merged, mat);
  m.position.set((br.a[0] + br.b[0]) / 2, br.y + 0.2, (br.a[1] + br.b[1]) / 2);
  m.rotation.y = Math.atan2(dx, dz);
  m.updateMatrix();
  m.updateMatrixWorld();
  return m;
}

export function mergeBoxes(parts: BufferGeometry[]): BufferGeometry {
  const P: number[] = [];
  const Nn: number[] = [];
  for (const g0 of parts) {
    const g = g0.index ? g0.toNonIndexed() : g0;
    P.push(...(g.getAttribute('position').array as Float32Array));
    Nn.push(...(g.getAttribute('normal').array as Float32Array));
  }
  const out = new BufferGeometry();
  out.setAttribute('position', new BufferAttribute(new Float32Array(P), 3));
  out.setAttribute('normal', new BufferAttribute(new Float32Array(Nn), 3));
  return out;
}
