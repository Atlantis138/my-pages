// 人工昼夜与四季
import { DAYLIGHT } from '../config';
import { toDate } from './calendar';

function smooth01(x: number): number {
  x = Math.max(0, Math.min(1, x));
  return x * x * (3 - 2 * x);
}

/** 镜云调光进度 0–1（本地时，小时）：04:30–07:30 渐亮，16:30–19:30 渐暗 */
export function dayRamp(hour: number): number {
  const h = ((hour % 24) + 24) % 24;
  const { dawnStart, dawnEnd, duskStart, duskEnd } = DAYLIGHT;
  if (h < dawnStart || h >= duskEnd) return 0;
  if (h < dawnEnd) return smooth01((h - dawnStart) / (dawnEnd - dawnStart));
  if (h < duskStart) return 1;
  return smooth01((duskEnd - h) / (duskEnd - duskStart));
}

/** 光强（相对满昼 1）。在对数上近似线性地爬升，像真实的晨昏那样「柔和亮起」 */
export function dayIntensity(hour: number): number {
  const s = dayRamp(hour);
  if (s <= 0) return 0;
  const k = 5.6;
  return (Math.exp(k * s) - 1) / (Math.exp(k) - 1);
}

/** 镜光颜色：满昼为略暖的白，晨昏调光时稍暖一些（循环照明的设计取向） */
export function mirrorColor(hour: number): [number, number, number] {
  const s = dayRamp(hour);
  const warm = 1 - s;
  return [1.0, 0.965 - 0.07 * warm, 0.925 - 0.16 * warm];
}

/** 年内季节相位：0 = 1 月 1 日。返回各季权重与连续季节量 */
export interface SeasonState {
  /** 0–1 的年内进度 */
  yearPhase: number;
  /** 季节温度项：-1（最冷，约 1 月下旬）到 1（最暖，约 7 月下旬） */
  warmth: number;
  /** 落叶树叶量 0（光秃）–1（繁茂） */
  leaf: number;
  /** 秋色 0–1 */
  autumn: number;
  /** 春花 0–1 */
  bloom: number;
  /** 新绿 0–1 */
  fresh: number;
  /** 草地枯黄 0–1 */
  dry: number;
  /** 油菜花田 0–1 */
  canola: number;
  /** 稻麦成熟 0–1（金黄） */
  harvest: number;
  /** 收割后的空田 0–1 */
  stubble: number;
  riceFlood: number;
  riceGreen: number;
  riceGold: number;
  wheatGreen: number;
  wheatGold: number;
  summerCrop: number;
}

function bump(x: number, a: number, b: number, c: number, d: number): number {
  // 在 [a,b] 上升、[b,c] 平台、[c,d] 下降
  if (x <= a || x >= d) return 0;
  if (x < b) return smooth01((x - a) / (b - a));
  if (x <= c) return 1;
  return smooth01((d - x) / (d - c));
}

export function seasonState(t: number): SeasonState {
  const cd = toDate(t);
  const p = cd.doy / cd.yearLength; // 0..1
  const d = cd.doy; // 日序
  const warmth = Math.cos(((d - 202) / 365.2422) * Math.PI * 2);
  // 叶量：3 月中萌芽，5 月初繁茂，10 月下旬开始落，12 月初光秃
  const leaf = bump(d, 68, 125, 296, 340) * 0.88 + 0.12;
  const autumn = bump(d, 262, 292, 318, 345);
  const bloom = bump(d, 62, 80, 98, 118);
  const fresh = bump(d, 70, 95, 130, 165);
  const dry = Math.max(bump(d, 300, 335, 366, 400), bump(d + 365, 300, 335, 366, 420)) * 0.85;
  const canola = bump(d, 60, 78, 100, 120);
  const harvest = Math.max(bump(d, 140, 158, 168, 180), bump(d, 245, 268, 285, 300));
  const stubble = Math.max(bump(d, 168, 176, 182, 195), bump(d, 285, 300, 360, 400), bump(d + 365, 285, 300, 420, 430));
  const riceFlood = bump(d, 110, 122, 150, 166);
  const riceGreen = bump(d, 140, 176, 238, 256);
  const riceGold = bump(d, 238, 256, 282, 297);
  const wheatGreen = Math.max(bump(d, 290, 320, 366, 420), bump(d, -60, -20, 96, 128));
  const wheatGold = bump(d, 126, 142, 160, 172);
  const summerCrop = bump(d, 168, 192, 262, 286);
  return { yearPhase: p, warmth, leaf, autumn, bloom, fresh, dry, canola, harvest, stubble, riceFlood, riceGreen, riceGold, wheatGreen, wheatGold, summerCrop };
}

/** 气温（℃）：年均约 15℃，夏冬相差约 8℃，日较差随天气变化 */
export function temperature(t: number, cloudiness: number, rain: number, fog: number): number {
  const cd = toDate(t);
  const s = seasonState(t);
  const annual = 15 + 4 * s.warmth;
  // 日变化：最低约 06:00，最高约 15:00
  const h = cd.hour;
  const ph = ((h - 15) / 24) * Math.PI * 2;
  const diurnalAmp = 4.2 * (1 - 0.55 * cloudiness) * (1 - 0.3 * fog);
  let diurnal = Math.cos(ph) * diurnalAmp;
  // 清晨偏冷的不对称
  if (h > 3 && h < 9) diurnal -= 0.6 * Math.sin(((h - 3) / 6) * Math.PI);
  return annual + diurnal - 2.2 * rain;
}
