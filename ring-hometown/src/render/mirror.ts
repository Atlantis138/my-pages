// 中央镜云的点层：成千上万面反射模块，静止于惯性系，随环体自转在我们头顶缓缓移动。
// 朝向本地的模块在白昼把恒星光反射下来（镜闪），夜里只有被恒星照亮的边框，像一团银色的星簇。
import { AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial } from 'three';
import common from '../glsl/common.glsl';
import { U } from './uniforms';
import { RING } from '../config';
import { hash3 } from '../sim/weather';

function vnoise3(x: number, y: number, z: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const s = (t: number) => t * t * (3 - 2 * t);
  const fx = s(x - ix);
  const fy = s(y - iy);
  const fz = s(z - iz);
  const h = (a: number, b: number, c: number) => hash3(ix + a, iy + b, iz + c);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  return l(
    l(l(h(0, 0, 0), h(1, 0, 0), fx), l(h(0, 1, 0), h(1, 1, 0), fx), fy),
    l(l(h(0, 0, 1), h(1, 0, 1), fx), l(h(0, 1, 1), h(1, 1, 1), fx), fy),
    fz,
  );
}

function smooth(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** 与 sky.frag 中 mirrorDensity 相同（静止系坐标） */
function density(rho: number, psi: number, z: number): number {
  const az = Math.abs(z);
  const cx = Math.cos(psi) * rho;
  const cy = Math.sin(psi) * rho;
  const warp = vnoise3(cx / 1800, cy / 1800, z / 1800) - 0.5;
  const rIn = 3000 + 500 * warp;
  const rOut = 7000 - 700 * (vnoise3(cx / 2300 + 7, cy / 2300 + 7, z / 2300 + 7) - 0.3);
  const zOut = 3750 - 900 * vnoise3(cx / 2600 + 3, cy / 2600 + 3, z / 2600 + 3);
  const env = smooth(rIn, rIn + 600, rho) * (1 - smooth(rOut - 900, rOut, rho)) * (1 - smooth(zOut - 700, zOut, az)) * smooth(260, 510, az);
  if (env <= 0) return 0;
  const shell = Math.pow(Math.abs(Math.sin(((rho + 300 * warp) / 1000) * Math.PI)), 6);
  const flock = smooth(0.42, 0.72, vnoise3(cx / 1500, cy / 1500, z / 1500) * 0.65 + vnoise3(cx / 640, cy / 640, z / 640) * 0.35);
  const clump = vnoise3(cx / 260, cy / 260, z / 260);
  const fine = vnoise3(cx / 90, cy / 90, z / 90);
  const c = smooth(0.3, 0.9, clump * 0.65 + fine * 0.35);
  return env * flock * (0.3 + 0.7 * shell) * (0.1 + 0.9 * c * c);
}

const VERT = /* glsl */ `
attribute vec4 mod4; // rho, psi, z, seed
uniform float uSpin;
uniform float uTimeS;
uniform float uMirrorDay;
uniform float uPixAng;
uniform vec3 uDayE;
varying vec3 vCol;
void main() {
  float rho = mod4.x, psi = mod4.y, z = mod4.z, seed = mod4.w;
  float a = psi - uSpin;
  vec3 P = vec3(rho * sin(a), 50000.0 - rho * cos(a), z);
  vec3 dir = normalize(P);
  gl_Position = projectionMatrix * viewMatrix * vec4(cameraPosition + dir * 100.0, 1.0);
  // 是否正把光反射给我们：按时隙随机切换，白昼比例高
  float slot = floor(uTimeS / 180.0 + seed * 17.0);
  float r = hash12(vec2(slot, seed * 1000.0));
  float frac = 0.015 + 0.42 * uMirrorDay;
  float t = fract(uTimeS / 180.0 + seed * 17.0);
  float env = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.92, t);
  float act = step(r, frac) * env;
  // 夜里偶尔的镜闪
  float flash = step(0.9993, hash12(vec2(floor(uTimeS / 9.0), seed * 733.0))) * (1.0 - uMirrorDay);
  float glint = act * (0.6 + 0.8 * hash12(vec2(seed, 3.0))) * mix(0.25, 1.0, uMirrorDay) + flash * 3.0;
  // 惯性系中被恒星照亮的模块背面（极淡）
  float passive = 0.08 + 0.05 * hash12(vec2(seed, 9.0));
  vCol = uDayE * glint * 12.0 + vec3(0.8, 0.84, 0.92) * passive * 0.0015;
  gl_PointSize = 1.0 + glint * 1.6;
}
`;

const FRAG = /* glsl */ `
varying vec3 vCol;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float r2 = dot(q, q) * 4.0;
  float a = exp(-r2 * 3.0);
  gl_FragColor = vec4(vCol * a, 1.0);
}
`;

export function createMirrorPoints(count: number): Points {
  const { rMin, rMax, zMax } = RING.mirror;
  const data = new Float32Array(count * 4);
  let n = 0;
  let seed = 12345;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  let guard = 0;
  while (n < count && guard < count * 60) {
    guard++;
    const rho = Math.sqrt(rMin * rMin * 0.7 + rnd() * (rMax * rMax * 1.05 - rMin * rMin * 0.7));
    const psi = rnd() * Math.PI * 2;
    const z = (rnd() * 2 - 1) * zMax;
    const d = density(rho, psi, z);
    if (rnd() > d * 1.6) continue;
    data.set([rho, psi, z, rnd()], n * 4);
    n++;
  }
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3));
  g.setAttribute('mod4', new BufferAttribute(data.subarray(0, n * 4), 4));
  const mat = new ShaderMaterial({
    vertexShader: common + VERT,
    fragmentShader: FRAG,
    uniforms: { ...U },
    blending: AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true,
  });
  const p = new Points(g, mat);
  p.frustumCulled = false;
  return p;
}
