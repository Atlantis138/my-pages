// 树木（实例化）：近处多团树冠，远处单团；季相、风摆、叶簇明暗与透光
import {
  BufferAttribute,
  BufferGeometry,
  IcosahedronGeometry,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  ShaderMaterial,
  Sphere,
  Vector3,
  CylinderGeometry,
} from 'three';
import { NEAR_HEADER } from './terrainMesh';
import common from '../glsl/common.glsl';
import { U } from './uniforms';
import { NU } from './nearUniforms';
import type { TreeInst } from '../world/vegetation';

const TREE_GLSL = /* glsl */ `
#ifdef VERTEX
attribute vec4 iPos;    // x, y, z, h
attribute vec4 iParam;  // r, type, seed, -
attribute float part;   // 0 树干, 1.. 树冠团
attribute vec3 blobC;   // 树冠团中心（单位空间）
varying vec3 vW;
varying vec3 vN;
varying vec3 vObj;
varying float vPart;
varying vec4 vParam;
varying float vAO;
#ifdef USE_LOGDEPTHBUF
varying float vFragDepth;
#endif
void main() {
  float h = iPos.w;
  float r = iParam.x;
  float type = iParam.y;
  float seed = iParam.z;
  vec3 p = position;
  vec3 n = normal;
  vec3 lp;
  if (part < 0.5) {
    // 树干：单位圆柱 y∈[0,1]
    float trunkH = type > 5.5 && type < 6.5 ? 0.0 : (type > 1.5 && type < 2.5 ? 0.55 : 0.42);
    float tr = max(0.12, h * 0.018) * (type > 2.5 && type < 3.5 ? 0.8 : 1.0);
    lp = vec3(p.x * tr, p.y * h * trunkH, p.z * tr);
    vAO = 0.6;
  } else {
    // 树冠：按树种塑形
    vec3 c = blobC;
    vec3 q = p; // 单位球上的点（半径 1）
    float rr = r;
    float cy;
    vec3 sc;
    if (type > 1.5 && type < 2.5) {
      // 针叶：锥形
      float yy = c.y + q.y * 0.5;
      float cone = mix(1.0, 0.15, sat(yy));
      sc = vec3(rr * cone, h * 0.62, rr * cone);
      cy = h * 0.32;
      lp = vec3((c.x + q.x * 0.55) * sc.x, cy + yy * sc.y, (c.z + q.z * 0.55) * sc.z);
    } else if (type > 2.5 && type < 3.5) {
      // 杨树：窄高
      sc = vec3(rr, h * 0.33, rr);
      cy = h * 0.6;
      lp = vec3((c.x * 0.6 + q.x * 0.7) * sc.x, cy + (c.y * 0.8 + q.y * 0.6) * sc.y, (c.z * 0.6 + q.z * 0.7) * sc.z);
    } else if (type > 3.5 && type < 4.5) {
      // 垂柳：下垂、底部更宽
      float droop = sat(-q.y * 0.5 + 0.5);
      sc = vec3(rr * (0.8 + 0.5 * droop), h * 0.4, rr * (0.8 + 0.5 * droop));
      cy = h * 0.58;
      lp = vec3((c.x + q.x * 0.6) * sc.x, cy + (c.y * 0.6 + q.y * 0.75) * sc.y, (c.z + q.z * 0.6) * sc.z);
    } else if (type > 5.5 && type < 6.5) {
      // 竹丛：细高的羽状团
      sc = vec3(rr * 0.9, h * 0.5, rr * 0.9);
      cy = h * 0.5;
      lp = vec3((c.x * 0.7 + q.x * 0.5) * sc.x, cy + (c.y + q.y * 0.6) * sc.y, (c.z * 0.7 + q.z * 0.5) * sc.z);
    } else {
      sc = vec3(rr, h * 0.3, rr);
      cy = h * 0.66;
      lp = vec3((c.x + q.x * 0.62) * sc.x, cy + (c.y + q.y * 0.62) * sc.y, (c.z + q.z * 0.62) * sc.z);
    }
    // 不规则：沿法线的噪声起伏
    float bump = vnoise3(q * 2.3 + seed * 17.0 + c * 3.0) - 0.5;
    lp += n * bump * rr * 0.28;
    n = normalize(n / max(sc, vec3(0.1)) * vec3(rr));
    vAO = sat(0.45 + 0.55 * (q.y * 0.5 + 0.5) + 0.25 * length(c.xz));
  }
  // 随机朝向
  float a = seed * 6.2832;
  float ca = cos(a), sa = sin(a);
  lp = vec3(ca * lp.x - sa * lp.z, lp.y, sa * lp.x + ca * lp.z);
  n = vec3(ca * n.x - sa * n.z, n.y, sa * n.x + ca * n.z);
  // 风摆
  float hf = lp.y / max(h, 1.0);
  float wind = length(uWind);
  vec2 wd = wind > 0.01 ? uWind / wind : vec2(1.0, 0.0);
  float sway = (0.02 + 0.012 * wind) * hf * hf * h;
  float ph = uTimeS * (1.3 + seed) + iPos.x * 0.05 + iPos.z * 0.04;
  float gust = 0.6 + 0.4 * sin(uTimeS * 0.21 + iPos.x * 0.003);
  lp.xz += wd * sway * (0.5 + 0.5 * sin(ph)) * gust;
  vec3 wp = lp + iPos.xyz;
  vW = wp;
  vN = n;
  vObj = (part < 0.5 ? p * 3.0 : p + blobC * 2.0) + seed * 31.0;
  vPart = part;
  vParam = iParam;
  gl_Position = projectionMatrix * viewMatrix * vec4(wp.x, wp.y + wp.x * wp.x * 1.0e-8, wp.z, 1.0);
#ifdef USE_LOGDEPTHBUF
  vFragDepth = 1.0 + gl_Position.w;
#endif
}
#endif

#ifdef FRAGMENT
uniform float uAlphaCut;
uniform vec4 uSeasonA;
uniform vec4 uSeasonB;
uniform vec4 uSeasonC;
uniform vec4 uSeasonD;
varying vec3 vW;
varying vec3 vN;
varying vec3 vObj;
varying float vPart;
varying vec4 vParam;
varying float vAO;

vec3 leafColor(float type, float seed, float n) {
  float leaf = uSeasonA.x;      // 0.12..1
  float aut = uSeasonA.y;
  float fresh = uSeasonA.w;
  vec3 summer = mix(vec3(0.035, 0.07, 0.025), vec3(0.06, 0.11, 0.035), n);
  summer = mix(summer, vec3(0.08, 0.15, 0.04), fresh * 0.6);
  if (type < 0.5) return mix(vec3(0.03, 0.06, 0.025), vec3(0.05, 0.085, 0.03), n); // 常绿阔叶
  if (type > 1.5 && type < 2.5) return mix(vec3(0.02, 0.04, 0.025), vec3(0.035, 0.06, 0.035), n); // 针叶
  if (type > 5.5 && type < 6.5) return mix(vec3(0.06, 0.1, 0.03), vec3(0.09, 0.13, 0.04), n) * mix(1.0, 0.85, uSeasonA.z); // 竹
  vec3 autumnC = type > 4.5 && type < 5.5 ? vec3(0.42, 0.3, 0.03) : mix(vec3(0.26, 0.08, 0.02), vec3(0.3, 0.2, 0.04), seed);
  if (type > 3.5 && type < 4.5) autumnC = vec3(0.2, 0.19, 0.05);
  vec3 c = mix(summer, autumnC, aut);
  if (type > 6.5) c = mix(c, mix(vec3(0.75, 0.62, 0.66), vec3(0.8, 0.8, 0.78), seed), uSeasonD.z);
  return c;
}

void main() {
#ifdef USE_LOGDEPTHBUF
  gl_FragDepth = log2(vFragDepth) * logDepthBufFC * 0.5;
#endif
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  float type = vParam.y;
  float seed = vParam.z;
  vec3 V = normalize(cameraPosition - vW);
  float camD = length(cameraPosition - vW);
  float px = camD * uPixAng;
  vec3 alb;
  float alpha = 1.0;
  float ao = vAO;
  if (vPart < 0.5) {
    alb = vec3(0.07, 0.055, 0.045) * (0.8 + 0.4 * vnoise3(vObj * 4.0));
    if (type > 5.5 && type < 6.5) alb = vec3(0.12, 0.13, 0.06);
  } else {
    // 叶簇：明暗块与参差的边缘
    float detailK = 1.0 - smoothstep(0.08, 0.6, px);
    float f1 = vnoise3(vObj * 4.2);
    float f2 = vnoise3(vObj * 12.0 + 3.0);
    float f3 = vnoise3(vObj * 30.0 + 7.0);
    float clump = f1 * 0.6 + mix(0.5, f2, max(detailK, 0.3)) * 0.28 + mix(0.5, f3, detailK) * 0.12;
    alb = leafColor(type, seed, clump);
    // 落叶树的叶量（冬季稀疏，露出枝条的灰褐色）
    float deciduous = (type > 0.5 && type < 1.5) || (type > 3.5 && type < 5.5) || type > 6.5 ? 1.0 : 0.0;
    float leaf = mix(1.0, uSeasonA.x, deciduous);
    vec3 twig = vec3(0.07, 0.06, 0.05);
    float sparse = smoothstep(0.55, 0.15, leaf);
    alb = mix(alb, twig, sparse * 0.85);
    // 边缘镂空：越靠轮廓越容易透
    float rim = 1.0 - abs(dot(N, V));
    float thr = mix(0.3, 0.66, rim) + sparse * 0.35;
    float farFade = smoothstep(0.4, 2.5, px);
    thr = mix(thr, thr * 0.4, farFade);
    alpha = smoothstep(thr - 0.08, thr + 0.08, clump + (1.0 - leaf) * -0.25 * deciduous);
    ao *= 0.6 + 0.4 * clump;
    // 透过叶隙看到的是树冠内侧：更暗
    if (!gl_FrontFacing) ao *= 0.45;
    // 叶片法线起伏
    N = normalize(N + (vec3(f2, f1, f2) - 0.5) * 0.7 * (1.0 - farFade));
  }
  if (alpha < uAlphaCut) discard;
#ifdef SHADOW_PASS
  if (alpha < 0.5) discard;
#endif
  SHADOW_OUT(vW)
  float cs = cloudShadow(vW.xz * 0.001);
  float ks = keyShadow(vW, N);
  vec3 col = shade(alb, N, vW, ao, 0.9, uWet * 0.6, cs, ks);
  // 透光：光从头顶穿过叶层，冠底泛出黄绿
  if (vPart > 0.5) {
    float back = sat(-dot(N, uMirrorDir)) * 0.5 + 0.15;
    col += alb * vec3(0.9, 1.15, 0.6) * uMirrorE * back * cs * 0.28;
  }
  col = applyAtmos(col, vW);
  gl_FragColor = vec4(col, alpha);
}
#endif
`;

function buildTreeGeometry(blobs: number, detail: number): BufferGeometry {
  const P: number[] = [];
  const Nn: number[] = [];
  const part: number[] = [];
  const bc: number[] = [];
  const trunk = new CylinderGeometry(1, 1.3, 1, blobs > 1 ? 6 : 4, 1, true).toNonIndexed();
  trunk.translate(0, 0.5, 0);
  const tp = trunk.getAttribute('position').array as Float32Array;
  const tn = trunk.getAttribute('normal').array as Float32Array;
  for (let i = 0; i < tp.length; i += 3) {
    P.push(tp[i], tp[i + 1], tp[i + 2]);
    Nn.push(tn[i], tn[i + 1], tn[i + 2]);
    part.push(0);
    bc.push(0, 0, 0);
  }
  const centers: number[][] =
    blobs === 1
      ? [[0, 0, 0]]
      : [
          [0, 0.15, 0],
          [0.42, -0.12, 0.1],
          [-0.35, -0.08, 0.32],
          [-0.1, -0.15, -0.45],
          [0.2, 0.42, -0.15],
        ].slice(0, blobs);
  const ico = new IcosahedronGeometry(1, detail).toNonIndexed();
  const ip = ico.getAttribute('position').array as Float32Array;
  centers.forEach((c, k) => {
    for (let i = 0; i < ip.length; i += 3) {
      const x = ip[i];
      const y = ip[i + 1];
      const z = ip[i + 2];
      const L = Math.hypot(x, y, z);
      P.push(x / L, y / L, z / L);
      Nn.push(x / L, y / L, z / L);
      part.push(k + 1);
      bc.push(c[0], c[1], c[2]);
    }
  });
  const g = new BufferGeometry();
  g.setAttribute('position', new BufferAttribute(new Float32Array(P), 3));
  g.setAttribute('normal', new BufferAttribute(new Float32Array(Nn), 3));
  g.setAttribute('part', new BufferAttribute(new Float32Array(part), 1));
  g.setAttribute('blobC', new BufferAttribute(new Float32Array(bc), 3));
  return g;
}

function instanced(base: BufferGeometry, list: TreeInst[]): InstancedBufferGeometry {
  const g = new InstancedBufferGeometry();
  for (const k of ['position', 'normal', 'part', 'blobC']) g.setAttribute(k, base.getAttribute(k));
  const pos = new Float32Array(list.length * 4);
  const par = new Float32Array(list.length * 4);
  list.forEach((t, i) => {
    pos.set([t.x, t.y, t.z, t.h], i * 4);
    par.set([t.r, t.type, t.seed, 0], i * 4);
  });
  g.setAttribute('iPos', new InstancedBufferAttribute(pos, 4));
  g.setAttribute('iParam', new InstancedBufferAttribute(par, 4));
  g.instanceCount = list.length;
  g.boundingSphere = new Sphere(new Vector3(0, 0, 0), 20000);
  return g;
}

export function treeMaterial(msaa: boolean): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: '#define VERTEX\n' + common + '\nuniform float uTimeS;\nuniform vec2 uWind;\n' + TREE_GLSL,
    fragmentShader: '#define FRAGMENT\n' + NEAR_HEADER + TREE_GLSL,
    uniforms: { ...U, ...NU, uAlphaCut: { value: msaa ? 0.02 : 0.5 } },
    side: 2,
    alphaToCoverage: msaa,
  });
}

export function createTreeMeshes(trees: TreeInst[], msaa = true): Mesh[] {
  const nearL: TreeInst[] = [];
  const midL: TreeInst[] = [];
  const farL: TreeInst[] = [];
  for (const t of trees) {
    const d = Math.hypot(t.x, t.z);
    if (d < 320) nearL.push(t);
    else if (d < 1800) midL.push(t);
    else farL.push(t);
  }
  const mat = treeMaterial(msaa);
  const out: Mesh[] = [];
  if (nearL.length) out.push(new Mesh(instanced(buildTreeGeometry(5, 1), nearL), mat));
  if (midL.length) out.push(new Mesh(instanced(buildTreeGeometry(3, 0), midL), mat));
  if (farL.length) out.push(new Mesh(instanced(buildTreeGeometry(1, 0), farL), mat));
  return out;
}
