// 通用小工具：数学、时间、数字格式、颜色。不依赖 DOM 结构，任何任务都可以直接引用。

export const TAU = Math.PI * 2, DEG = Math.PI / 180;
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
export const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
// 1 在 |dt| ≤ full 时，到 |dt| ≥ zero 时平滑降到 0
export const bump = (dt, full, zero) => 1 - smooth(full, zero, Math.abs(dt));
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const $ = id => document.getElementById(id);

/* ---------- 时间 ----------
   页面内部的时间 t 一律是“距任务历元的天数”（UT）。每个任务选一个历元，用 makeClock 得到一组换算函数。 */
export function makeClock(epochMs, epochJD) {
  const date = t => new Date(epochMs + t * 864e5);
  return {
    epochMs, epochJD,
    // 'YYYY-MM-DD'、'YYYY-MM-DDTHH:MM' 或 'YYYY-MM-DDTHH:MM:SS'（均为 UT）→ t
    T: s => (Date.parse(s.length === 10 ? s + 'T00:00:00Z' : s.length === 16 ? s + ':00Z' : s + 'Z') - epochMs) / 864e5,
    jd: t => t + epochJD,
    isoDate: t => date(t).toISOString().slice(0, 10),                              // 2004-07-01
    isoMinute: t => date(t).toISOString().slice(0, 16),                            // 2004-07-01T02:37
    hms: t => date(t).toISOString().slice(11, 19) + ' UT',                         // 02:37:12 UT
    utc: t => date(t).toISOString().slice(0, 16).replace('T', ' ') + ' UT',        // 2004-07-01 02:37 UT
    yearFrac: t => { const d = date(t), y = d.getUTCFullYear(); return y + (d - Date.UTC(y, 0, 1)) / (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1)); },
  };
}

/* ---------- 数字 ----------
   全站统一：千位用逗号；10 万 km 起改用“万 km”（100 万以上取整，以下留一位小数）。 */
export const nf = new Intl.NumberFormat('en-US');
export const fmtInt = x => nf.format(Math.round(x));
export function fmtKm(km, wanFrom = 1e5) {
  if (km < wanFrom) return fmtInt(km) + ' km';
  const w = km / 1e4;
  if (km >= 1e6) return fmtInt(w) + ' 万 km';
  return w.toFixed(km >= 1e5 ? 1 : 2).replace(/\.?0+$/, '') + ' 万 km';
}
// 光行时：秒 → “1.3 秒”或“83.6 分钟”
export const fmtLight = s => s < 1 ? s.toFixed(3) + ' 秒' : s < 60 ? s.toFixed(1) + ' 秒' : (s / 60).toFixed(1) + ' 分钟';

/* ---------- 颜色与数组 ---------- */
export function rgba(hex, a) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
// [[x,y,z], …] → Float64Array，供 scene.poly 使用
export const flat = pts => { const P = new Float64Array(pts.length * 3); pts.forEach((p, i) => P.set(p, i * 3)); return P; };
export const niceStep = x => { const e = Math.pow(10, Math.floor(Math.log10(x))), m = x / e; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * e; };
