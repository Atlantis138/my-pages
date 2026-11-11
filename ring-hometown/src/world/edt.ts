// 欧氏距离变换（Felzenszwalb & Huttenlocher），用于河流、铁路、道路的距离场
import { P2, Polyline } from './geo';

const INF = 1e20;

function edt1d(f: Float32Array, n: number, d: Float32Array, v: Int32Array, z: Float32Array): void {
  let k = 0;
  v[0] = 0;
  z[0] = -INF;
  z[1] = INF;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = INF;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    const dq = q - v[k];
    d[q] = dq * dq + f[v[k]];
  }
}

/** 输入：种子掩码（1 = 在线上）。输出：到最近种子的距离（像素） */
export function edt(seed: Uint8Array, w: number, h: number): Float32Array {
  const g = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) g[i] = seed[i] ? 0 : INF;
  const n = Math.max(w, h);
  const f = new Float32Array(n);
  const d = new Float32Array(n);
  const v = new Int32Array(n);
  const z = new Float32Array(n + 1);
  // 列
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = g[y * w + x];
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y++) g[y * w + x] = d[y];
  }
  // 行
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = g[y * w + x];
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x++) g[y * w + x] = Math.sqrt(d[x]);
  }
  return g;
}

export interface Grid {
  x0: number;
  z0: number;
  size: number;
  res: number;
}

/** 把折线画进种子掩码 */
export function rasterLine(seed: Uint8Array, grid: Grid, pts: P2[]): void {
  const { x0, z0, size, res } = grid;
  const cell = size / res;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, az] = pts[i];
    const [bx, bz] = pts[i + 1];
    const L = Math.hypot(bx - ax, bz - az);
    const m = Math.max(1, Math.ceil(L / (cell * 0.4)));
    for (let j = 0; j <= m; j++) {
      const t = j / m;
      const x = ax + (bx - ax) * t;
      const z = az + (bz - az) * t;
      const ix = Math.floor((x - x0) / cell);
      const iz = Math.floor((z - z0) / cell);
      if (ix >= 0 && iz >= 0 && ix < res && iz < res) seed[iz * res + ix] = 1;
    }
  }
}

/** 折线的距离场（米） */
export function lineDistanceField(grid: Grid, line: Polyline): Float32Array {
  const seed = new Uint8Array(grid.res * grid.res);
  rasterLine(seed, grid, line.pts);
  const d = edt(seed, grid.res, grid.res);
  const cell = grid.size / grid.res;
  for (let i = 0; i < d.length; i++) d[i] = Math.min(d[i] * cell, 1e6);
  return d;
}

/** 由二值掩码得到有符号距离（米）：内部为负 */
export function signedDistance(mask: Uint8Array, w: number, h: number, cell: number): Float32Array {
  const inv = new Uint8Array(mask.length);
  for (let i = 0; i < mask.length; i++) inv[i] = mask[i] ? 0 : 1;
  const dOut = edt(mask, w, h);
  const dIn = edt(inv, w, h);
  const out = new Float32Array(mask.length);
  for (let i = 0; i < mask.length; i++) out[i] = (mask[i] ? -(dIn[i] - 0.5) : dOut[i] - 0.5) * cell;
  return out;
}
