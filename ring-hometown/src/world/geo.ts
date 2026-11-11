// 小镇周边的地理设计：河流、铁路、道路骨架与网格范围。单位：米；x 向东（顺旋），z 向南（星侧）
// 基准面 0 m = 观察者所在的后山山顶

export type P2 = [number, number];

/** 近景高程网格：覆盖河谷主要可见范围 */
export const NEAR = { x0: -6000, z0: -11000, size: 22000, res: 2048 };
/** 远景高程网格：180 km 见方 */
export const FAR = { x0: -90000, z0: -90000, size: 180000, res: 1024 };
/** 镇区细节（道路距离场、灯光）范围 */
export const TOWN = { x0: -700, z0: -2400, size: 6000, res: 2048 };

/** 河流中心线（自西向东流） */
export const RIVER_CTRL: P2[] = [
  [-60000, 9000], [-38000, 6500], [-24000, 4200], [-14000, 2600], [-9000, 1700], [-5200, 1450],
  [-2600, 930], [-900, 700], [300, 570], [1100, 430], [1900, 470], [2700, 690], [3600, 980],
  [4600, 900], [5600, 1240], [7000, 1680], [8600, 1520], [10200, 2080], [12400, 2580],
  [14600, 2420], [16600, 3050], [18600, 3300], [20800, 3850], [24000, 3500], [28000, 4400],
  [34000, 4100], [42000, 5600], [52000, 5200], [64000, 7400], [80000, 8200], [96000, 9000],
];

/** 铁路中线（自西向东） */
export const RAIL_CTRL: P2[] = [
  [-40000, -4200], [-20000, -2600], [-12000, -1700], [-7000, -1250], [-3500, -880], [-1500, -700],
  [0, -620], [700, -540], [1300, -520], [2200, -515], [3500, -420], [5000, -200], [6400, 260],
  [7600, 1000], [8600, 1850], [9800, 2700], [11600, 3400], [13800, 3820], [16000, 4150],
  [17800, 4600], [19400, 4950], [21500, 5100], [26000, 5600], [40000, 7000], [70000, 9500],
];

/** 车站：站台中心 x 与长度 */
export const STATION = { x: 980, len: 220 };

/** 学校校园（矩形，米） */
export const SCHOOL = { x0: 165, x1: 525, z0: -185, z1: 175, level: -59.2 };
/** 操场跑道：中心与朝向（长轴沿 x） */
export const TRACK = { cx: 395, cz: 52, straight: 84.39, radius: 36.5, lanes: 6, laneW: 1.22 };

/** 镇区范围（若干椭圆的并集），用于建筑密度 */
export const TOWN_BLOBS: [number, number, number, number, number][] = [
  // cx, cz, rx, rz, weight
  [1500, 120, 1500, 520, 1.0],
  [2600, 500, 900, 520, 0.85],
  [1600, 1050, 900, 300, 0.75],
  [900, -330, 520, 200, 0.9],
];

export function riverLevel(x: number): number {
  return -63 - 0.00025 * Math.max(-40000, Math.min(90000, x));
}

export function riverHalfWidth(x: number): number {
  const t = Math.max(0, Math.min(1, (x + 8000) / 40000));
  return 24 + 34 * t + (x > 400 && x < 3400 ? 6 : 0);
}

// ---------- 样条与折线 ----------
export function catmull(ctrl: P2[], step: number): P2[] {
  const out: P2[] = [];
  const n = ctrl.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = ctrl[Math.max(0, i - 1)];
    const p1 = ctrl[i];
    const p2 = ctrl[i + 1];
    const p3 = ctrl[Math.min(n - 1, i + 2)];
    const len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
    const m = Math.max(1, Math.ceil(len / step));
    for (let j = 0; j < m; j++) {
      const t = j / m;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(ctrl[n - 1]);
  return out;
}

export interface Polyline {
  pts: P2[];
  cum: number[];
  length: number;
}

export function polyline(pts: P2[]): Polyline {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, length: cum[cum.length - 1] };
}

/** 沿折线弧长 s 处的点与切向 */
export function sampleAt(pl: Polyline, s: number): { p: P2; t: P2 } {
  const { pts, cum } = pl;
  s = Math.max(0, Math.min(pl.length, s));
  let lo = 0;
  let hi = cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= s) lo = mid;
    else hi = mid;
  }
  const seg = cum[hi] - cum[lo] || 1;
  const a = (s - cum[lo]) / seg;
  const p0 = pts[lo];
  const p1 = pts[hi];
  const dx = p1[0] - p0[0];
  const dz = p1[1] - p0[1];
  const L = Math.hypot(dx, dz) || 1;
  return { p: [p0[0] + dx * a, p0[1] + dz * a], t: [dx / L, dz / L] };
}

/** 点到折线的最近距离、最近点弧长 */
export function nearestOn(pl: Polyline, x: number, z: number, hint?: { lo: number; hi: number }): { d: number; s: number } {
  let best = Infinity;
  let bs = 0;
  const lo = hint ? Math.max(0, hint.lo) : 0;
  const hi = hint ? Math.min(pl.pts.length - 1, hint.hi) : pl.pts.length - 1;
  for (let i = lo; i < hi; i++) {
    const [ax, az] = pl.pts[i];
    const [bx, bz] = pl.pts[i + 1];
    const ux = bx - ax;
    const uz = bz - az;
    const L2 = ux * ux + uz * uz || 1;
    let t = ((x - ax) * ux + (z - az) * uz) / L2;
    t = Math.max(0, Math.min(1, t));
    const px = ax + ux * t - x;
    const pz = az + uz * t - z;
    const d = px * px + pz * pz;
    if (d < best) {
      best = d;
      bs = pl.cum[i] + Math.sqrt(L2) * t;
    }
  }
  return { d: Math.sqrt(best), s: bs };
}

export const riverLine = polyline(catmull(RIVER_CTRL, 40));
export const railLine = polyline(catmull(RAIL_CTRL, 40));

/** 镇区密度（0–1） */
export function townDensity(x: number, z: number): number {
  let d = 0;
  for (const [cx, cz, rx, rz, w] of TOWN_BLOBS) {
    const q = ((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2;
    d = Math.max(d, w * Math.max(0, 1 - q));
  }
  return Math.min(1, d * 1.6);
}

// ---------- 与 GLSL 一致的值噪声 ----------
function fract(x: number): number {
  return x - Math.floor(x);
}
export function hash12(x: number, y: number): number {
  let px = fract(x * 0.1031);
  let py = fract(y * 0.1031);
  let pz = fract(x * 0.1031);
  const d = px * (py + 33.33) + py * (pz + 33.33) + pz * (px + 33.33);
  px += d;
  py += d;
  pz += d;
  return fract((px + py) * pz);
}
export function vnoise2(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash12(ix, iy);
  const b = hash12(ix + 1, iy);
  const c = hash12(ix, iy + 1);
  const d = hash12(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
export function fbm2(x: number, y: number, oct: number): number {
  let s = 0;
  let a = 0.5;
  let n = 0;
  for (let i = 0; i < oct; i++) {
    s += a * vnoise2(x, y);
    n += a;
    x = x * 2.03 + 17.1;
    y = y * 2.03 + 9.7;
    a *= 0.5;
  }
  return s / n;
}

/** 可复现的伪随机数 */
export function rng(seed: number): () => number {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}
