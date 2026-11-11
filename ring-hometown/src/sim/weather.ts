// 天气：五种天气预设、自动天气序列、参数平滑过渡，以及与着色器一致的云场（用于判断头顶是否下雨）
import { toDate, seasonOf } from './calendar';
import { dayIntensity } from './climate';

export type WeatherKind = 'clear' | 'cloudy' | 'fog' | 'showers' | 'rain';
export const WEATHER_KINDS: WeatherKind[] = ['clear', 'cloudy', 'fog', 'showers', 'rain'];
export const WEATHER_NAMES: Record<WeatherKind, string> = {
  clear: '晴',
  cloudy: '流云',
  fog: '晨雾',
  showers: '阵雨',
  rain: '阴雨',
};

export interface WeatherParams {
  cover: number; // 低云量 0–1
  cloudBase: number; // 云底高度（千米）
  cloudThick: number; // 云层厚度（千米）
  cloudDark: number; // 积雨云的暗度
  stratus: number; // 0 积云 – 1 层云
  wind: number; // 风速 m/s
  haze: number; // 气溶胶倍数（能见度）
  fog: number; // 河谷雾 0–1
  fogTop: number; // 雾顶高出河面（米）
  rainBase: number; // 层状降水强度 0–1
  showers: number; // 阵性雨柱 0–1
  high: number; // 高云（卷云）0–1
}

const PRESETS: Record<WeatherKind, WeatherParams> = {
  clear: { cover: 0.16, cloudBase: 1.7, cloudThick: 0.9, cloudDark: 0, stratus: 0, wind: 2.6, haze: 0.75, fog: 0, fogTop: 40, rainBase: 0, showers: 0, high: 0.3 },
  cloudy: { cover: 0.5, cloudBase: 1.35, cloudThick: 1.5, cloudDark: 0.12, stratus: 0.05, wind: 7.5, haze: 0.95, fog: 0, fogTop: 40, rainBase: 0, showers: 0, high: 0.45 },
  fog: { cover: 0.06, cloudBase: 2.2, cloudThick: 0.6, cloudDark: 0, stratus: 0, wind: 0.9, haze: 1.7, fog: 1, fogTop: 46, rainBase: 0, showers: 0, high: 0.2 },
  showers: { cover: 0.6, cloudBase: 1.15, cloudThick: 3.4, cloudDark: 0.5, stratus: 0.08, wind: 6.2, haze: 1.25, fog: 0, fogTop: 40, rainBase: 0, showers: 1, high: 0.3 },
  rain: { cover: 1.0, cloudBase: 0.75, cloudThick: 2.2, cloudDark: 0.55, stratus: 1, wind: 4.6, haze: 2.6, fog: 0.22, fogTop: 40, rainBase: 0.72, showers: 0.25, high: 0 },
};

export function presetOf(k: WeatherKind): WeatherParams {
  return { ...PRESETS[k] };
}

function lerpParams(a: WeatherParams, b: WeatherParams, t: number): WeatherParams {
  const o = {} as WeatherParams;
  for (const k of Object.keys(a) as (keyof WeatherParams)[]) o[k] = a[k] + (b[k] - a[k]) * t;
  return o;
}

// ---------- 与着色器相同的值噪声（用于在 CPU 上判断头顶云的浓度） ----------
export function hash3(x: number, y: number, z: number): number {
  // 与 GLSL 中 hash13 一致的无三角函数哈希
  let px = fract(x * 0.1031);
  let py = fract(y * 0.1031);
  let pz = fract(z * 0.1031);
  const d = px * (py + 33.33) + py * (pz + 33.33) + pz * (px + 33.33);
  px += d;
  py += d;
  pz += d;
  return fract((px + py) * pz);
}

function fract(x: number): number {
  return x - Math.floor(x);
}

function smoothstep01(x: number): number {
  return x * x * (3 - 2 * x);
}

/** 3D 值噪声，x/z 方向以 period 为周期 */
export function vnoise3(x: number, y: number, z: number, period: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = smoothstep01(x - ix);
  const fy = smoothstep01(y - iy);
  const fz = smoothstep01(z - iz);
  const P = period;
  const m = (a: number) => ((a % P) + P) % P;
  const x0 = m(ix);
  const x1 = m(ix + 1);
  const z0 = m(iz);
  const z1 = m(iz + 1);
  const a = hash3(x0, iy, z0);
  const b = hash3(x1, iy, z0);
  const c = hash3(x0, iy + 1, z0);
  const d = hash3(x1, iy + 1, z0);
  const e = hash3(x0, iy, z1);
  const f = hash3(x1, iy, z1);
  const g = hash3(x0, iy + 1, z1);
  const h = hash3(x1, iy + 1, z1);
  const l0 = a + (b - a) * fx;
  const l1 = c + (d - c) * fx;
  const l2 = e + (f - e) * fx;
  const l3 = g + (h - g) * fx;
  const m0 = l0 + (l1 - l0) * fy;
  const m1 = l2 + (l3 - l2) * fy;
  return m0 + (m1 - m0) * fz;
}

/**
 * 低云的二维覆盖场（与 sky.glsl 中 cloudField 一致）。
 * u,v：本地坐标（千米），offU/offV：风吹动的累计位移，evo：演化时间
 */
export function cloudField(u: number, v: number, offU: number, offV: number, evo: number, cover: number, showers: number): number {
  const sx = (u - offU) / 3.2;
  const sz = (v - offV) / 3.2;
  let n = 0;
  let amp = 0.5;
  let f = 1;
  let norm = 0;
  for (let i = 0; i < 4; i++) {
    n += amp * vnoise3(sx * f, evo * f * 0.7 + i * 17.0, sz * f, 1440 * f);
    norm += amp;
    amp *= 0.5;
    f *= 2.03;
  }
  n /= norm;
  // 阵雨：叠加更大尺度的对流单体
  const cell = vnoise3((u - offU) / 14.4, evo * 0.5 + 91.0, (v - offV) / 14.4, 320);
  n = n * (1 - 0.45 * showers) + cell * 0.45 * showers;
  const thr = 1.0 - cover;
  return Math.max(0, Math.min(1, (n - thr * 0.92 - 0.04) / 0.22));
}

export interface WeatherState extends WeatherParams {
  kind: WeatherKind; // 当前主导天气
  windDir: number; // 风去向（弧度，0=向东，π/2=向南）
  offU: number; // 云场累计位移（千米）
  offV: number;
  evo: number; // 云的演化时间
  rain: number; // 观察点实际雨强 0–1
  wet: number; // 地面湿润度 0–1
  fogNow: number; // 当前雾浓度（含晨间消散）
  overhead: number; // 头顶云量
}

/** 自动天气：每天分三段（0–8、8–16、16–24 时），按季节概率选择 */
function autoKindForSegment(dayIndex: number, seg: number, month: number): WeatherKind {
  const season = seasonOf(month);
  const probs: Record<number, [number, number, number, number, number]> = {
    0: [0.3, 0.3, 0.2, 0.02, 0.18], // 冬
    1: [0.3, 0.3, 0.15, 0.1, 0.15], // 春
    2: [0.36, 0.28, 0.06, 0.24, 0.06], // 夏
    3: [0.36, 0.24, 0.2, 0.06, 0.14], // 秋
  };
  // 段与段之间有持续性：先看上一段
  const r0 = hash3(dayIndex * 3 + seg, 7.0, 3.0);
  const pick = (r: number): WeatherKind => {
    const p = probs[season];
    let acc = 0;
    for (let i = 0; i < 5; i++) {
      acc += p[i];
      if (r < acc) return WEATHER_KINDS[i];
    }
    return 'clear';
  };
  let k = pick(r0);
  if (seg > 0 && hash3(dayIndex * 3 + seg, 11.0, 5.0) < 0.45) {
    k = autoKindForSegment(dayIndex, seg - 1, month);
  }
  // 雾只出现在凌晨—上午那一段；其他时段的「雾」改为晴
  if (k === 'fog' && seg !== 0) k = 'clear';
  // 阵雨多发于午后
  if (k === 'showers' && seg === 0) k = 'cloudy';
  return k;
}

function autoTarget(t: number): { params: WeatherParams; kind: WeatherKind } {
  const segLen = 8 / 24;
  const seg = Math.floor(t / segLen);
  const local = t / segLen - seg; // 0..1 段内进度
  const day = Math.floor(seg / 3);
  const cd = toDate(t);
  const kNow = autoKindForSegment(day, seg - day * 3, cd.month);
  const prevSeg = seg - 1;
  const prevDay = Math.floor(prevSeg / 3);
  const kPrev = autoKindForSegment(prevDay, prevSeg - prevDay * 3, cd.month);
  // 段首 1.6 小时内由上一段过渡过来
  const blend = Math.min(1, (local * 8) / 1.6);
  const p = lerpParams(PRESETS[kPrev], PRESETS[kNow], smoothstep01(blend));
  return { params: p, kind: blend > 0.5 ? kNow : kPrev };
}

export class Weather {
  mode: 'auto' | WeatherKind = 'auto';
  state: WeatherState;
  private target: WeatherParams = presetOf('clear');
  private targetKind: WeatherKind = 'clear';

  constructor(t: number) {
    const a = autoTarget(t);
    this.state = {
      ...a.params,
      kind: a.kind,
      windDir: 0.35,
      offU: 37.0,
      offV: 11.0,
      evo: 3.0,
      rain: 0,
      wet: a.params.rainBase > 0.3 ? 0.8 : 0,
      fogNow: 0,
      overhead: 0,
    };
  }

  setMode(m: 'auto' | WeatherKind): void {
    this.mode = m;
  }

  /** 时间跳转后直接对齐到目标天气（不做慢过渡） */
  snap(t: number): void {
    this.computeTarget(t);
    Object.assign(this.state, this.target);
    this.state.kind = this.targetKind;
    this.state.wet = this.target.rainBase > 0.3 ? 0.85 : this.state.wet * 0.3;
  }

  private computeTarget(t: number): void {
    if (this.mode === 'auto') {
      const a = autoTarget(t);
      this.target = a.params;
      this.targetKind = a.kind;
    } else {
      this.target = presetOf(this.mode);
      this.targetKind = this.mode;
    }
  }

  /**
   * @param t 模拟时间（日）
   * @param dtSim 本帧模拟时间步长（日）
   * @param dtReal 真实时间步长（秒）
   */
  update(t: number, dtSim: number, dtReal: number): void {
    this.computeTarget(t);
    const s = this.state;
    // 过渡速度：手动切换时数秒内完成；随时间流逝也会推进
    const k = 1 - Math.exp(-(dtReal / 3.5 + (dtSim * 24) / 0.6));
    for (const key of Object.keys(this.target) as (keyof WeatherParams)[]) {
      s[key] += (this.target[key] - s[key]) * k;
    }
    s.kind = this.targetKind;

    // 风向缓慢摆动；位移按风速累积（千米）
    const hour = ((t % 1) + 1) % 1 * 24;
    s.windDir = 0.35 + 0.5 * Math.sin(t * 0.37) + 0.25 * Math.sin(t * 2.1);
    const dtSec = dtSim * 86400;
    const vKm = (s.wind * 1.6 * dtSec) / 1000; // 云层处风更大
    s.offU += Math.cos(s.windDir) * vKm;
    s.offV += Math.sin(s.windDir) * vKm;
    // 位移取模，保持数值精度（云场周期 1440×3.2 = 320×14.4 = 4608 km）
    const P = 4608;
    s.offU = ((s.offU % P) + P) % P;
    s.offV = ((s.offV % P) + P) % P;
    s.evo += dtSim * 24 * 0.9;
    if (s.evo > 4000) s.evo -= 4000;

    // 晨雾：夜里生成，日出后随镜光增强消散
    const di = dayIntensity(hour);
    const morning = hour < 12 ? 1 : 0;
    let fogDecay = 1 - Math.min(1, Math.max(0, (di - 0.25) / 0.75)) * (morning ? 0.85 : 0.6);
    if (hour > 9.5 && hour < 19) fogDecay = Math.min(fogDecay, 0.45 - 0.25 * Math.sin(((hour - 9.5) / 9.5) * Math.PI));
    s.fogNow = s.fog * Math.max(0.12, fogDecay);

    // 观察点头顶的云 → 雨
    const over = cloudField(0, 0, s.offU, s.offV, s.evo, s.cover, s.showers);
    s.overhead = over;
    const showerRain = s.showers * Math.max(0, (over - 0.55) / 0.35) * Math.min(1, s.cloudThick / 2.5);
    s.rain = Math.min(1, Math.max(s.rainBase * (0.8 + 0.2 * over), showerRain));
    // 湿润度：下雨时变湿，雨停后几小时内变干
    const dtH = dtSim * 24;
    s.wet += s.rain * dtH * 3.0;
    s.wet -= dtH * (0.18 + 0.3 * di) * (1 - s.rain);
    s.wet = Math.max(0, Math.min(1, s.wet));
  }
}
