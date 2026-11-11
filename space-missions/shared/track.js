// 轨迹：一条轨迹是 { t: Float64Array(n), p: Float64Array(3n), v?: Float32Array(n), n }。
// t 为距任务历元的天数，p 为该坐标系的场景单位。

import { clamp } from './util.js';

// 行式数组 [t, x, y, z, (v)] × n，k 为每行的列数（4 或 5）
export function unpackRows(a, k) {
  const n = a.length / k, t = new Float64Array(n), p = new Float64Array(n * 3), v = k > 4 ? new Float32Array(n) : null;
  for (let i = 0; i < n; i++) {
    t[i] = a[k * i]; p[3 * i] = a[k * i + 1]; p[3 * i + 1] = a[k * i + 2]; p[3 * i + 2] = a[k * i + 3];
    if (v) v[i] = a[k * i + 4];
  }
  return { t, p, v, n };
}
// 差分编码 { t0（秒）, p0（km）, dt: [秒…], dp: [km…] }，unit 为每个场景单位的 km 数
export function unpackDelta(o, unit) {
  const n = o.dt.length + 1, t = new Float64Array(n), p = new Float64Array(n * 3);
  let ts = o.t0, x = o.p0[0], y = o.p0[1], z = o.p0[2];
  t[0] = ts / 86400; p[0] = x / unit; p[1] = y / unit; p[2] = z / unit;
  for (let i = 1; i < n; i++) {
    ts += o.dt[i - 1]; x += o.dp[3 * i - 3]; y += o.dp[3 * i - 2]; z += o.dp[3 * i - 1];
    t[i] = ts / 86400; p[3 * i] = x / unit; p[3 * i + 1] = y / unit; p[3 * i + 2] = z / unit;
  }
  return { t, p, v: null, n };
}
// 最后一个 t[i] ≤ t 的下标
export function idxAt(tr, t) {
  if (t <= tr.t[0]) return 0;
  let lo = 0, hi = tr.n - 1;
  if (t >= tr.t[hi]) return hi;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tr.t[m] <= t) lo = m; else hi = m; }
  return lo;
}
const frac = (tr, i, j, t) => { const h = tr.t[j] - tr.t[i]; return h > 0 ? clamp((t - tr.t[i]) / h, 0, 1) : 0; };
// 按时间线性插值的位置
export function interp(tr, t) {
  const i = idxAt(tr, t), j = Math.min(i + 1, tr.n - 1), k = frac(tr, i, j, t), p = tr.p;
  return [p[3 * i] + (p[3 * j] - p[3 * i]) * k, p[3 * i + 1] + (p[3 * j + 1] - p[3 * i + 1]) * k, p[3 * i + 2] + (p[3 * j + 2] - p[3 * i + 2]) * k];
}
export const pointAt = (tr, i) => [tr.p[3 * i], tr.p[3 * i + 1], tr.p[3 * i + 2]];
// 轨迹自带速度列时：线性插值的速度（km/s）
export function speedAt(tr, t) {
  const i = idxAt(tr, t), j = Math.min(i + 1, tr.n - 1), k = frac(tr, i, j, t);
  return tr.v[i] + (tr.v[j] - tr.v[i]) * k;
}
// 没有速度列时：由相邻弦长估算的速度（km/s），在弦与弦之间平滑过渡
export function chordSpeed(tr, t, unit) {
  const i = idxAt(tr, t), j = Math.min(i + 1, tr.n - 1), p = tr.p;
  const sp = (a, b) => { const h = (tr.t[b] - tr.t[a]) * 86400; return h > 0 ? Math.hypot(p[3 * b] - p[3 * a], p[3 * b + 1] - p[3 * a + 1], p[3 * b + 2] - p[3 * a + 2]) * unit / h : 0; };
  const s1 = sp(i, j); if (i === 0 || j === tr.n - 1) return s1;
  const s0 = sp(i - 1, i), s2 = sp(j, Math.min(j + 1, tr.n - 1)), k = clamp((t - tr.t[i]) / Math.max(1e-9, tr.t[j] - tr.t[i]), 0, 1);
  return k < 0.5 ? (s0 + s1) / 2 + (s1 - (s0 + s1) / 2) * (k * 2) : s1 + ((s1 + s2) / 2 - s1) * ((k - 0.5) * 2);
}
// 等间隔表（{ t0, step, 数组 }）上的线性插值：返回 [下标, 权重]
export function tableAt(tab, n, t) {
  const x = (t - tab.t0) / tab.step, i = clamp(Math.floor(x), 0, n - 2);
  return [i, clamp(x - i, 0, 1)];
}
