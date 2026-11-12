// 由时间、天文与天气推出各路光源的强度、方向，写入共享 uniform
import { Vector3 } from 'three';
import { RING } from '../config';
import { orbitState, starGeom, localToInertial, spinAngle, wrapAngle, visibleStarFraction, StarGeom } from './astro';
import { dayIntensity, dayRamp, mirrorColor, seasonState, SeasonState } from './climate';
import { toDate } from './calendar';
import { U } from '../render/uniforms';
import { NU } from '../render/nearUniforms';
import type { WeatherState } from './weather';

export interface LightInfo {
  hour: number;
  mirror: number; // 本地镜光强度 0–1
  arch: number; // 对岸光（标量）
  starGround: number; // 地面恒星光（标量）
  starFrac: number; // 露出比例
  star: StarGeom;
  season: SeasonState;
  /** 场景平均照度（用于自动曝光） */
  sceneE: number;
  /** 被恒星照亮的高空比例 */
  skyLit: number;
}

const tmp = new Vector3();

/** 对岸光：把整条环带上各处（按各自的本地时）被照亮的地面对本地水平面的照度积分起来 */
function archLight(hour: number, out: Vector3): number {
  const N = 96;
  let ex = 0;
  let ey = 0;
  let sum = 0;
  const w = RING.halfWidth * 2;
  const k = w / (4 * RING.R);
  const tauZ = 0.11; // 竖直光学厚度（绿光附近）
  for (let i = 0; i < N; i++) {
    const th = ((i + 0.5) / N) * Math.PI * 2; // 0..2π
    const elev = th / 2;
    const se = Math.sin(elev);
    if (se < 0.03) continue;
    const loc = hour + (th / (Math.PI * 2)) * 24;
    const E = dayIntensity(loc);
    if (E <= 0) continue;
    const T = Math.exp((-2 * tauZ) / Math.max(se, 0.05));
    const L = (0.2 * E * T) / Math.PI; // 平均反照率约 0.2
    const dE = k * L * ((Math.PI * 2) / N);
    sum += dE;
    ex += dE * Math.cos(elev);
    ey += dE * se;
  }
  const n = Math.hypot(ex, ey) || 1;
  out.set(ex / n, ey / n, 0);
  return sum;
}

let archMax = -1;

export function updateLighting(t: number, weather: WeatherState): LightInfo {
  const cd = toDate(t);
  const hour = cd.hour;
  const orb = orbitState(t);
  const star = starGeom(t, orb);

  // 镜光
  const di = dayIntensity(hour);
  const mc = mirrorColor(hour);
  U.uLocalHour.value = hour;
  U.uMirrorE.value.set(mc[0] * di, mc[1] * di, mc[2] * di).multiply(U.uDayE.value);
  // 光源近天顶，随镜群的周转有极轻的摆动
  const phi = spinAngle(t);
  U.uMirrorDir.value.set(0.045 * Math.sin(phi) + 0.02, 1, 0.03 + 0.02 * Math.cos(phi * 0.5)).normalize();
  U.uMirrorDay.value = di;

  // 对岸光
  if (archMax < 0) {
    let m = 0;
    for (let h = 0; h < 24; h += 0.5) m = Math.max(m, archLight(h, tmp));
    archMax = m;
  }
  const arch = archLight(hour, U.uArchDir.value);
  const cloudBlock = 1 - 0.75 * weather.cover;
  U.uArchE.value.set(0.78, 0.84, 1.0).multiplyScalar(arch * cloudBlock);
  U.uArchMax.value = archMax;

  // 恒星
  U.uStarDir.value.set(star.dir[0], star.dir[1], star.dir[2]);
  U.uStarAlpha.value = star.angRadius;
  const rAU = star.r / 149597870.7;
  const full = 1.4 / (rAU * rAU);
  const e = star.elevation;
  // 恒星低于本地水平面太多时对大气已无影响
  const starOn = e > -0.02 ? Math.min(1, (e + 0.02) / 0.02) : 0;
  U.uStarE.value.set(1.0, 0.955, 0.9).multiplyScalar(full * starOn);
  U.uStarSpaceE.value.set(1.0, 0.955, 0.9).multiplyScalar(full);
  const frac = visibleStarFraction(star.margin, star.angRadius);
  const airmass = 1 / Math.max(Math.sin(Math.max(e, 0.001)) + 0.015, 0.03);
  const Tg = Math.exp(-0.11 * airmass * (1 + 0.6 * weather.haze));
  const starGround = full * frac * Tg * (1 - 0.85 * weather.cover * (0.4 + 0.6 * weather.stratus));
  U.uStarGround.value.set(1.0, 0.75, 0.5).multiplyScalar(starGround);
  U.uStarMargin0.value = star.margin;
  U.uStarVisSky.value = frac;

  // 恒星照亮的高空空气：南墙阴影顶面的高度（km）越低，天空被照亮的部分越多
  const hShadow = RING.wallHeight - RING.halfWidth * Math.tan(e + star.angRadius * 0.5);
  const skyLit = e > -0.012 ? Math.exp(-Math.max(hShadow, 0) / 8) * Math.min(1, (e + 0.012) / 0.02) : 0;
  // 多次散射的天光近似
  U.uAmbSky.value.copy(U.uMirrorE.value).multiplyScalar(0.28 * (1 + weather.cover * 0.6));

  // 天体姿态
  const m = localToInertial(t, orb);
  U.uL2I.value.set(m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]);
  U.uSpin.value = wrapAngle(phi);
  U.uTimeS.value = (t * 86400) % 86400;
  U.uFarTime.value = (t * 24) % 2400;

  // 季节
  const ss = seasonState(t);
  U.uSeasonA.value.set(ss.leaf, ss.autumn, ss.dry, ss.fresh);
  U.uSeasonB.value.set(ss.harvest, ss.stubble, ss.canola, ss.warmth);
  NU.uSeasonC.value.set(ss.riceFlood, ss.riceGreen, ss.riceGold, ss.wheatGreen);
  NU.uSeasonD.value.set(ss.wheatGold, ss.summerCrop, ss.bloom, 0);

  // 天气 → 着色器
  U.uMieK.value = 0.0042 * weather.haze + 0.03 * weather.rain + 0.002 * weather.fogNow;
  U.uRainExt.value = weather.rain * 0.12;
  U.uCloudCover.value = weather.cover;
  U.uCloudBase.value = weather.cloudBase;
  U.uCloudThick.value = weather.cloudThick;
  U.uCloudDark.value = weather.cloudDark;
  U.uStratus.value = weather.stratus;
  U.uShowers.value = weather.showers;
  U.uHighCloud.value = weather.high;
  U.uCloudOff.value.set(weather.offU, weather.offV);
  U.uCloudEvo.value = weather.evo;
  U.uRain.value = weather.rain;
  U.uFogNow.value = weather.fogNow;
  U.uFogTop.value = weather.fogTop;
  U.uWet.value = weather.wet;
  U.uWind.value.set(Math.cos(weather.windDir) * weather.wind, Math.sin(weather.windDir) * weather.wind);
  U.uFarCloudBias.value = 0.0;

  // 夜晚亮灯程度
  const night = 1 - dayRamp(hour);
  U.uNight.value = night;
  // 灯光穹顶：镇区与几个村子向空中漏出的灯光（km）
  const lampsOn = Math.max(0, Math.min(1, (night - 0.25) / 0.3));
  const late = hour > 0.5 && hour < 5 ? 0.6 : 1;
  const G = U.uGlow.value;
  G[0].set(1.6, 0.3, 1.5, 0.0018 * lampsOn * late);
  G[1].set(9.7, 1.25, 0.7, 0.0005 * lampsOn * late);
  G[2].set(7.3, 2.3, 0.6, 0.0004 * lampsOn * late);
  G[3].set(24.0, 3.1, 1.2, 0.0006 * lampsOn * late);

  // 场景平均照度（相对满昼）
  const overcast = weather.cover * (0.35 + 0.65 * weather.stratus);
  const sceneE = di * (1 - 0.72 * overcast) + arch * cloudBlock * 1.0 + starGround * 4 + skyLit * full * 0.07 * (1 - 0.7 * overcast) + 0.00006;
  return { hour, mirror: di, arch, starGround, starFrac: frac, star, season: ss, sceneE, skyLit };
}
