// 公转、自转与恒星方向。
// 惯性系：轨道面为 XY，Z 为轨道法向。环轴按平均近点角匀速转向（指向「平均恒星」），
// 真实恒星方向随真近点角变化，两者之差即中心差 C，形成春照、秋照。
import { ORBIT, RING, ROT_PER_DAY, SPIN_PHASE0, OBSERVER } from '../config';

const TWO_PI = Math.PI * 2;
/** 近星点经度（任意） */
const VARPI = 1.05;

export interface OrbitState {
  M: number; // 平近点角
  E: number;
  nu: number; // 真近点角
  r: number; // 距离（千米）
  C: number; // 中心差 nu - M（-π..π）
}

export function solveKepler(M: number, e: number): number {
  let E = M + e * Math.sin(M);
  for (let i = 0; i < 12; i++) {
    const f = E - e * Math.sin(E) - M;
    E -= f / (1 - e * Math.cos(E));
  }
  return E;
}

export function orbitState(t: number): OrbitState {
  const { e, a, yearDays, perihelionDay } = ORBIT;
  const M = (((t - perihelionDay) / yearDays) * TWO_PI) % TWO_PI;
  const E = solveKepler(M, e);
  const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
  const r = a * (1 - e * Math.cos(E));
  let C = nu - M;
  C = Math.atan2(Math.sin(C), Math.cos(C));
  return { M, E, nu, r, C };
}

/** 自转角 Φ（弧度，未取模，用 t 计算以保留精度） */
export function spinAngle(t: number): number {
  return SPIN_PHASE0 + TWO_PI * ROT_PER_DAY * t;
}

export function wrapAngle(a: number): number {
  a = a % TWO_PI;
  return a < 0 ? a + TWO_PI : a;
}

export interface StarGeom {
  /** 恒星在本地系（x 东/顺旋，y 上/指向环心，z 南/星侧）中的单位方向 */
  dir: [number, number, number];
  elevation: number; // 弧度
  azimuthFromSouth: number; // 弧度，向东为正
  angRadius: number; // 弧度
  wallAngle: number; // 该方位上南墙墙顶的仰角
  /** 恒星上缘高出墙顶的角度（弧度，>0 表示露出） */
  margin: number;
  C: number;
  r: number;
}

const EYE_KM = OBSERVER.eyeHeight / 1000;

/** 计算 t 时刻观察者看到的恒星几何（含视差） */
export function starGeom(t: number, orb?: OrbitState): StarGeom {
  const o = orb ?? orbitState(t);
  const phi = spinAngle(t);
  const cp = Math.cos(phi);
  const sp = Math.sin(phi);
  const R = RING.R - EYE_KM;
  // 环系坐标（X=轨道法向，Y，Z=环轴指向平均恒星）
  const sx = 0;
  const sy = -Math.sin(o.C) * o.r;
  const sz = Math.cos(o.C) * o.r;
  const vx = sx - R * cp;
  const vy = sy - R * sp;
  const vz = sz;
  const L = Math.hypot(vx, vy, vz);
  // 本地基：E=(-sinΦ, cosΦ, 0)，U=(-cosΦ, -sinΦ, 0)，S=(0,0,1)
  const east = (-sp * vx + cp * vy) / L;
  const up = (-cp * vx - sp * vy) / L;
  const south = vz / L;
  const elevation = Math.asin(Math.max(-1, Math.min(1, up)));
  const az = Math.atan2(east, south);
  const wallAngle = Math.atan(((RING.wallHeight - EYE_KM) * Math.cos(az)) / RING.halfWidth);
  const angRadius = Math.asin(ORBIT.starRadius / L);
  return {
    dir: [east, up, south],
    elevation,
    azimuthFromSouth: az,
    angRadius,
    wallAngle,
    margin: elevation + angRadius - wallAngle,
    C: o.C,
    r: o.r,
  };
}

/**
 * 本地系 → 惯性系的 3x3 矩阵（列主序，供着色器旋转星空）。
 * 列：东、上、南 三个基向量在惯性系中的分量。
 */
export function localToInertial(t: number, orb?: OrbitState): number[] {
  const o = orb ?? orbitState(t);
  const lam = o.M + VARPI;
  // 环系基在惯性系中的表达
  const Xr = [0, 0, 1];
  const Zr = [-Math.cos(lam), -Math.sin(lam), 0];
  const Yr = [-Math.sin(lam), Math.cos(lam), 0];
  const phi = spinAngle(t);
  const cp = Math.cos(phi);
  const sp = Math.sin(phi);
  const E = [-sp * Xr[0] + cp * Yr[0], -sp * Xr[1] + cp * Yr[1], -sp * Xr[2] + cp * Yr[2]];
  const U = [-cp * Xr[0] - sp * Yr[0], -cp * Xr[1] - sp * Yr[1], -cp * Xr[2] - sp * Yr[2]];
  const S = Zr;
  // 列主序 mat3：第一列 E，第二列 U，第三列 S
  return [E[0], E[1], E[2], U[0], U[1], U[2], S[0], S[1], S[2]];
}

// ---------- 恒星露出的可见光通量比例（带临边昏暗） ----------
const LIMB_U = 0.6;
const FRAC_TABLE: number[] = (() => {
  const N = 128;
  const tab: number[] = [];
  // 在单位圆盘上数值积分：被墙遮住 y < 1 - x 的部分
  const G = 220;
  let total = 0;
  const samples: { y: number; w: number }[] = [];
  for (let i = 0; i < G; i++) {
    for (let j = 0; j < G; j++) {
      const px = ((i + 0.5) / G) * 2 - 1;
      const py = ((j + 0.5) / G) * 2 - 1;
      const rr = px * px + py * py;
      if (rr > 1) continue;
      const mu = Math.sqrt(1 - rr);
      const w = 1 - LIMB_U * (1 - mu);
      total += w;
      samples.push({ y: py, w });
    }
  }
  for (let k = 0; k <= N; k++) {
    const x = (k / N) * 2; // 露出高度 / 角半径
    let s = 0;
    for (const p of samples) if (p.y > 1 - x) s += p.w;
    tab.push(s / total);
  }
  return tab;
})();

/** 露出部分占整个星盘光通量的比例；margin、angRadius 为弧度 */
export function visibleStarFraction(margin: number, angRadius: number): number {
  const x = Math.max(0, Math.min(2, margin / angRadius));
  const f = (x / 2) * 128;
  const i = Math.min(127, Math.floor(f));
  const a = f - i;
  return FRAC_TABLE[i] * (1 - a) + FRAC_TABLE[i + 1] * a;
}

// ---------- 春照、秋照的搜索 ----------
const ROT_DAYS = RING.rotationMinutes / 1440;

/** 在一圈之内找恒星仰角最大的时刻（黄金分割，粗略起点由解析式给出） */
function rotationPeak(tGuess: number): number {
  let a = tGuess - ROT_DAYS * 0.25;
  let b = tGuess + ROT_DAYS * 0.25;
  const gr = 0.6180339887;
  let c = b - gr * (b - a);
  let d = a + gr * (b - a);
  let fc = starGeom(c).margin;
  let fd = starGeom(d).margin;
  for (let i = 0; i < 40; i++) {
    if (fc > fd) {
      b = d;
      d = c;
      fd = fc;
      c = b - gr * (b - a);
      fc = starGeom(c).margin;
    } else {
      a = c;
      c = d;
      fc = fd;
      d = a + gr * (b - a);
      fd = starGeom(d).margin;
    }
  }
  return (a + b) / 2;
}

/** 给定 t 附近、下一个（或当前）恒星仰角极大的时刻的粗略估计 */
function nextPeakGuess(t: number): number {
  const o = orbitState(t);
  // C>0 时 Φ≈90° 取极大；C<0 时 Φ≈270°
  const target = o.C >= 0 ? Math.PI / 2 : (3 * Math.PI) / 2;
  const phi = wrapAngle(spinAngle(t));
  let dphi = target - phi;
  if (dphi < -0.3) dphi += Math.PI * 2;
  return t + (dphi / (Math.PI * 2)) * ROT_DAYS;
}

function bisectEdge(tIn: number, tOut: number): number {
  let a = tIn;
  let b = tOut;
  for (let i = 0; i < 40; i++) {
    const m = (a + b) / 2;
    if (starGeom(m).margin > 0) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

export interface PeekEvent {
  start: number;
  peak: number;
  end: number;
  maxMargin: number;
  kind: 'spring' | 'autumn';
}

/** 从 t 起向后寻找下一次「露星」（恒星上缘越过南墙）。maxDays 内找不到返回 null */
export function findNextPeek(t: number, maxDays = 400): PeekEvent | null {
  // 若此刻正在露星，返回当前这一次
  if (starGeom(t).margin > 0) {
    let a = t;
    while (starGeom(a).margin > 0) a -= 0.5 / 1440;
    const start = bisectEdge(a + 0.5 / 1440, a);
    let b = t;
    while (starGeom(b).margin > 0) b += 0.5 / 1440;
    const end = bisectEdge(b - 0.5 / 1440, b);
    const peak = rotationPeak((start + end) / 2);
    const o = orbitState(peak);
    return { start, peak, end, maxMargin: starGeom(peak).margin, kind: o.C >= 0 ? 'spring' : 'autumn' };
  }
  let tc = t;
  const limit = t + maxDays;
  while (tc < limit) {
    // 先粗略判断：若中心差远小于阈值，整段跳过
    const o = orbitState(tc);
    const absC = Math.abs(o.C);
    if (absC < 0.0935) {
      tc += 0.5; // 半天一步
      continue;
    }
    const guess = nextPeakGuess(tc);
    const pk = rotationPeak(guess);
    const g = starGeom(pk);
    if (g.margin > 0 && pk >= t - 1e-6) {
      // 求起止时刻
      const half = ROT_DAYS * 0.2;
      const start = bisectEdge(pk, pk - half);
      const end = bisectEdge(pk, pk + half);
      if (end > t) {
        return { start, peak: pk, end, maxMargin: g.margin, kind: o.C >= 0 ? 'spring' : 'autumn' };
      }
    }
    tc = Math.max(pk, guess) + ROT_DAYS * 0.5;
  }
  return null;
}

export interface PeekWindow {
  kind: 'spring' | 'autumn';
  start: number; // 第一次露星开始
  end: number; // 最后一次露星结束
  center: number;
  count: number;
  longest: number; // 最长一次（分钟）
}

/** 计算从 t0 开始一年内的两个窗口 */
export function computeWindows(t0: number): PeekWindow[] {
  const wins: PeekWindow[] = [];
  let t = t0;
  let cur: PeekWindow | null = null;
  const limit = t0 + ORBIT.yearDays + 2;
  while (t < limit) {
    const ev = findNextPeek(t, limit - t);
    if (!ev) break;
    if (cur && ev.start - cur.end < 2) {
      cur.end = ev.end;
      cur.count++;
      cur.longest = Math.max(cur.longest, (ev.end - ev.start) * 1440);
    } else {
      if (cur) wins.push(cur);
      cur = { kind: ev.kind, start: ev.start, end: ev.end, center: 0, count: 1, longest: (ev.end - ev.start) * 1440 };
    }
    t = ev.end + 1e-4;
  }
  if (cur) wins.push(cur);
  for (const w of wins) w.center = (w.start + w.end) / 2;
  return wins;
}
