// 地形：距离场 → GPU 生成高程 → 读回 CPU → 纹理（高程、法线、距离）
import {
  DataTexture,
  FloatType,
  HalfFloatType,
  LinearFilter,
  Mesh,
  NearestFilter,
  OrthographicCamera,
  RedFormat,
  RGFormat,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  UnsignedByteType,
  WebGLRenderer,
  WebGLRenderTarget,
  ClampToEdgeWrapping,
  DataUtils,
  Vector4,
} from 'three';
import common from '../glsl/common.glsl';
import heightgen from '../glsl/heightgen.frag';
import { fullscreenTriangle } from '../render/sky';
import { FAR, NEAR, riverLine, railLine } from './geo';
import { lineDistanceField, Grid } from './edt';

export interface GridData {
  grid: Grid;
  h: Float32Array; // 高程（米）
  river: Float32Array; // 到河流中心线的距离（米）
  rail: Float32Array; // 到铁路中线的距离（米）
  texH: DataTexture; // R32F
  texN: DataTexture; // RGBA8 法线
  texD: DataTexture; // RG16F 距离
}

const VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

function makeFloatTex(data: Float32Array, res: number): DataTexture {
  const t = new DataTexture(data, res, res, RedFormat, FloatType);
  t.minFilter = NearestFilter;
  t.magFilter = NearestFilter;
  t.wrapS = t.wrapT = ClampToEdgeWrapping;
  t.needsUpdate = true;
  return t;
}

function gpuHeights(r: WebGLRenderer, grid: Grid, river: Float32Array, rail: Float32Array, isFar: boolean): Float32Array {
  const res = grid.res;
  const tRiver = makeFloatTex(river, res);
  const tRail = makeFloatTex(rail, res);
  const mat = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: common + '\n' + heightgen,
    uniforms: {
      tRiverD: { value: tRiver },
      tRailD: { value: tRail },
      uGrid: { value: new Vector4(grid.x0, grid.z0, grid.size, grid.res) },
      uIsFar: { value: isFar ? 1 : 0 },
    },
    depthTest: false,
    depthWrite: false,
  });
  const scene = new Scene();
  const m = new Mesh(fullscreenTriangle(), mat);
  m.frustumCulled = false;
  scene.add(m);
  const rt = new WebGLRenderTarget(res, res, { type: UnsignedByteType, format: RGBAFormat, depthBuffer: false });
  const cam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  r.setRenderTarget(rt);
  r.render(scene, cam);
  const buf = new Uint8Array(res * res * 4);
  r.readRenderTargetPixels(rt, 0, 0, res, res, buf);
  r.setRenderTarget(null);
  const h = new Float32Array(res * res);
  for (let i = 0; i < res * res; i++) {
    const v = buf[i * 4] * 65536 + buf[i * 4 + 1] * 256 + buf[i * 4 + 2];
    h[i] = (v / 16777215) * 3000 - 1000;
  }
  rt.dispose();
  mat.dispose();
  tRiver.dispose();
  tRail.dispose();
  return h;
}

function normalTex(h: Float32Array, res: number, cell: number): DataTexture {
  const out = new Uint8Array(res * res * 4);
  for (let z = 0; z < res; z++) {
    for (let x = 0; x < res; x++) {
      const xl = Math.max(0, x - 1);
      const xr = Math.min(res - 1, x + 1);
      const zl = Math.max(0, z - 1);
      const zr = Math.min(res - 1, z + 1);
      const dx = (h[z * res + xr] - h[z * res + xl]) / ((xr - xl) * cell);
      const dz = (h[zr * res + x] - h[zl * res + x]) / ((zr - zl) * cell);
      const L = Math.hypot(dx, 1, dz);
      const i = (z * res + x) * 4;
      out[i] = Math.round((-dx / L * 0.5 + 0.5) * 255);
      out[i + 1] = Math.round((1 / L) * 255);
      out[i + 2] = Math.round((-dz / L * 0.5 + 0.5) * 255);
      out[i + 3] = 255;
    }
  }
  const t = new DataTexture(out, res, res, RGBAFormat, UnsignedByteType);
  t.minFilter = LinearFilter;
  t.magFilter = LinearFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
}

function distTex(river: Float32Array, rail: Float32Array, res: number): DataTexture {
  const out = new Uint16Array(res * res * 2);
  for (let i = 0; i < res * res; i++) {
    out[i * 2] = DataUtils.toHalfFloat(Math.min(river[i], 60000));
    out[i * 2 + 1] = DataUtils.toHalfFloat(Math.min(rail[i], 60000));
  }
  const t = new DataTexture(out, res, res, RGFormat, HalfFloatType);
  t.minFilter = LinearFilter;
  t.magFilter = LinearFilter;
  t.needsUpdate = true;
  return t;
}

function build(r: WebGLRenderer, grid: Grid, isFar: boolean): GridData {
  const river = lineDistanceField(grid, riverLine);
  const rail = lineDistanceField(grid, railLine);
  const h = gpuHeights(r, grid, river, rail, isFar);
  return {
    grid,
    h,
    river,
    rail,
    texH: makeFloatTex(h, grid.res),
    texN: normalTex(h, grid.res, grid.size / grid.res),
    texD: distTex(river, rail, grid.res),
  };
}

function bilinear(arr: Float32Array, g: Grid, x: number, z: number): number {
  const cell = g.size / g.res;
  let u = (x - g.x0) / cell - 0.5;
  let v = (z - g.z0) / cell - 0.5;
  u = Math.max(0, Math.min(g.res - 1.001, u));
  v = Math.max(0, Math.min(g.res - 1.001, v));
  const i = Math.floor(u);
  const j = Math.floor(v);
  const fu = u - i;
  const fv = v - j;
  const r = g.res;
  const a = arr[j * r + i];
  const b = arr[j * r + i + 1];
  const c = arr[(j + 1) * r + i];
  const d = arr[(j + 1) * r + i + 1];
  return a + (b - a) * fu + (c - a) * fv + (a - b - c + d) * fu * fv;
}

export class Terrain {
  near: GridData;
  far: GridData;

  constructor(r: WebGLRenderer) {
    this.near = build(r, NEAR, false);
    this.far = build(r, FAR, true);
  }

  /** 近景网格内的混合权重（与着色器一致：边缘 800 m 过渡） */
  nearWeight(x: number, z: number): number {
    const g = this.near.grid;
    const m = Math.min(x - g.x0, g.x0 + g.size - x, z - g.z0, g.z0 + g.size - z);
    if (m <= 0) return 0;
    const t = Math.min(1, m / 800);
    return t * t * (3 - 2 * t);
  }

  height(x: number, z: number): number {
    const w = this.nearWeight(x, z);
    const hf = bilinear(this.far.h, this.far.grid, x, z);
    if (w <= 0) return hf;
    const hn = bilinear(this.near.h, this.near.grid, x, z);
    return hf + (hn - hf) * w;
  }

  riverDist(x: number, z: number): number {
    if (this.nearWeight(x, z) > 0.5) return bilinear(this.near.river, this.near.grid, x, z);
    return bilinear(this.far.river, this.far.grid, x, z);
  }

  railDist(x: number, z: number): number {
    if (this.nearWeight(x, z) > 0.5) return bilinear(this.near.rail, this.near.grid, x, z);
    return bilinear(this.far.rail, this.far.grid, x, z);
  }

  /** 坡度（tan） */
  slope(x: number, z: number): number {
    const e = 6;
    const dx = (this.height(x + e, z) - this.height(x - e, z)) / (2 * e);
    const dz = (this.height(x, z + e) - this.height(x, z - e)) / (2 * e);
    return Math.hypot(dx, dz);
  }
}
