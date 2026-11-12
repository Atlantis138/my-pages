// 环历：沿用格里高利式的月日与闰年规则。
// 模拟时间 t 以「日」为单位，从环历 1127 年 1 月 1 日 0 时（小镇本地时）起算。
import { EPOCH_YEAR } from '../config';

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInYear(y: number): number {
  return isLeap(y) ? 366 : 365;
}

export function daysInMonth(y: number, m: number): number {
  return m === 2 && isLeap(y) ? 29 : MONTH_DAYS[m - 1];
}

/** 某年 1 月 1 日 0 时对应的 t */
export function yearStart(y: number): number {
  let d = 0;
  if (y >= EPOCH_YEAR) for (let k = EPOCH_YEAR; k < y; k++) d += daysInYear(k);
  else for (let k = y; k < EPOCH_YEAR; k++) d -= daysInYear(k);
  return d;
}

export interface CalDate {
  year: number;
  month: number; // 1–12
  day: number; // 1–31
  hour: number; // 0–24（含小数）
  doy: number; // 年内第几天（0 起，含小数）
  yearLength: number;
}

export function toDate(t: number): CalDate {
  let y = EPOCH_YEAR;
  let d = Math.floor(t);
  while (d < 0) {
    y--;
    d += daysInYear(y);
  }
  while (d >= daysInYear(y)) {
    d -= daysInYear(y);
    y++;
  }
  const doyInt = d;
  let m = 1;
  while (m <= 12 && d >= daysInMonth(y, m)) {
    d -= daysInMonth(y, m);
    m++;
  }
  const frac = t - Math.floor(t);
  return { year: y, month: m, day: d + 1, hour: frac * 24, doy: doyInt + frac, yearLength: daysInYear(y) };
}

export function fromDate(year: number, month: number, day: number, hour: number): number {
  let t = yearStart(year);
  for (let m = 1; m < month; m++) t += daysInMonth(year, m);
  return t + (day - 1) + hour / 24;
}

/** 年内进度 0–1（用于季节） */
export function yearFraction(t: number): number {
  const c = toDate(t);
  return c.doy / c.yearLength;
}

export const SEASON_NAMES = ['冬', '春', '夏', '秋'];

/** 季节：3–5 月春，6–8 月夏，9–11 月秋，12–2 月冬 */
export function seasonOf(month: number): number {
  if (month >= 3 && month <= 5) return 1;
  if (month >= 6 && month <= 8) return 2;
  if (month >= 9 && month <= 11) return 3;
  return 0;
}

export function pad2(n: number): string {
  return (n < 10 ? '0' : '') + n;
}

export function formatClock(hour: number, withSeconds = false): string {
  let totalSec = Math.floor(hour * 3600 + 1e-6);
  totalSec = ((totalSec % 86400) + 86400) % 86400;
  const h = Math.floor(totalSec / 3600);
  const mi = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return withSeconds ? `${pad2(h)}:${pad2(mi)}:${pad2(s)}` : `${pad2(h)}:${pad2(mi)}`;
}
