// 通用天文：常数、开普勒方程、月球与行星的近似星历。
// 这里的星历只用来画天体的位置；探测器自己的轨迹一律来自各任务 recon/ 里处理好的数据。

import { TAU, DEG } from './util.js';

export const AU = 149597870.7;          // km
export const C_KMS = 299792.458;        // 光速 km/s
export const KGAUSS = 0.01720209895;    // 高斯引力常数，AU^1.5 / 天
export const J2000 = 2451545.0;
// 平均半径 km（土星、木星另有赤道半径，见各任务）
export const RADIUS = { sun: 695700, mercury: 2439.7, venus: 6051.8, earth: 6371, moon: 1737.4, mars: 3389.5, jupiter: 69911, saturn: 58232, uranus: 25362, neptune: 24622 };
export const ZH = { sun: '太阳', mercury: '水星', venus: '金星', earth: '地球', moon: '月球', mars: '火星', jupiter: '木星', saturn: '土星', uranus: '天王星', neptune: '海王星' };

/* ---------- 开普勒 ---------- */
export const wrapPI = x => x - TAU * Math.floor((x + Math.PI) / TAU);
export function kepE(M, e) {
  let E = e < 0.8 ? M : Math.PI;
  for (let i = 0; i < 60; i++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-13) break; }
  return E;
}
export const trueAnom = (E, e) => 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
// 轨道面内 (r, 真近点角 nu) → 黄道直角坐标；el: { i, Om, w }（度）
export function orbitXYZ(r, nu, el) {
  const u = el.w * DEG + nu, Om = el.Om * DEG, i = el.i * DEG;
  return [r * (Math.cos(Om) * Math.cos(u) - Math.sin(Om) * Math.sin(u) * Math.cos(i)),
          r * (Math.sin(Om) * Math.cos(u) + Math.cos(Om) * Math.sin(u) * Math.cos(i)),
          r * Math.sin(u) * Math.sin(i)];
}
// 彗星 / 小天体：el = { q (AU), e, i, Om, w (度), Tp (与 t 同一时间尺度的过近日点时刻) } → 日心黄道坐标 AU
export function cometAU(t, el) {
  const a = el.q / (1 - el.e), n = KGAUSS / Math.pow(a, 1.5), E = kepE(wrapPI(n * (t - el.Tp)), el.e);
  return orbitXYZ(a * (1 - el.e * Math.cos(E)), trueAnom(E, el.e), el);
}
// 一段轨道曲线（真近点角 −nuMax … +nuMax，度），AU
export function orbitCurveAU(el, nuMax, step) {
  const pts = [], p = el.q * (1 + el.e);
  for (let nu = -nuMax; nu <= nuMax + 1e-9; nu += step) pts.push(orbitXYZ(p / (1 + el.e * Math.cos(nu * DEG)), nu * DEG, el));
  return pts;
}

/* ---------- 月球 ----------
   Meeus《天文算法》第 47 章的截断级数（经度 / 距离 50 项，纬度 20 项），当日黄道地心坐标，km。
   ISEE-3 的 recon/v2/jsport.py 是这个函数的 Python 镜像，导出的轨迹点靠它与页面对齐：改这里就要同步改那里。 */
const LR=[[0,0,1,0,6288774,-20905355],[2,0,-1,0,1274027,-3699111],[2,0,0,0,658314,-2955968],[0,0,2,0,213618,-569925],[0,1,0,0,-185116,48888],[0,0,0,2,-114332,-3149],[2,0,-2,0,58793,246158],[2,-1,-1,0,57066,-152138],[2,0,1,0,53322,-170733],[2,-1,0,0,45758,-204586],[0,1,-1,0,-40923,-129620],[1,0,0,0,-34720,108743],[0,1,1,0,-30383,104755],[2,0,0,-2,15327,10321],[0,0,1,2,-12528,0],[0,0,1,-2,10980,79661],[4,0,-1,0,10675,-34782],[0,0,3,0,10034,-23210],[4,0,-2,0,8548,-21636],[2,1,-1,0,-7888,24208],[2,1,0,0,-6766,30824],[1,0,-1,0,-5163,-8379],[1,1,0,0,4987,-16675],[2,-1,1,0,4036,-12831],[2,0,2,0,3994,-10445],[4,0,0,0,3861,-11650],[2,0,-3,0,3665,14403],[0,1,-2,0,-2689,-7003],[2,0,-1,2,-2602,0],[2,-1,-2,0,2390,10056],[1,0,1,0,-2348,6322],[2,-2,0,0,2236,-9884],[0,1,2,0,-2120,5751],[0,2,0,0,-2069,0],[2,-2,-1,0,2048,-4950],[2,0,1,-2,-1773,4130],[2,0,0,2,-1595,0],[4,-1,-1,0,1215,-3958],[0,0,2,2,-1110,0],[3,0,-1,0,-892,3258],[2,1,1,0,-810,2616],[4,-1,-2,0,759,-1897],[0,2,-1,0,-713,-2117],[2,2,-1,0,-700,2354],[2,1,-2,0,691,0],[2,-1,0,-2,596,0],[4,0,1,0,549,-1423],[0,0,4,0,537,-1117],[4,-1,0,0,520,-1571],[1,0,-2,0,-487,-1739]];
const BT=[[0,0,0,1,5128122],[0,0,1,1,280602],[0,0,1,-1,277693],[2,0,0,-1,173237],[2,0,-1,1,55413],[2,0,-1,-1,46271],[2,0,0,1,32573],[0,0,2,1,17198],[2,0,1,-1,9266],[0,0,2,-1,8822],[2,-1,0,-1,8216],[2,0,-2,-1,4324],[2,0,1,1,4200],[2,1,0,-1,-3359],[2,-1,-1,1,2463],[2,-1,0,1,2211],[2,-1,-1,-1,2065],[0,1,-1,-1,-1870],[4,0,-1,-1,1828],[0,1,0,1,-1794]];
export function moonGeoKm(jd) {
  const T = (jd - 2451545) / 36525, r = Math.PI / 180;
  const Lp = 218.3164477 + 481267.88123421 * T, D = 297.8501921 + 445267.1114034 * T, M = 357.5291092 + 35999.0502909 * T;
  const Mp = 134.9633964 + 477198.8675055 * T, F = 93.2720950 + 483202.0175233 * T, E = 1 - 0.002516 * T;
  const A1 = 119.75 + 131.849 * T, A2 = 53.09 + 479264.290 * T, A3 = 313.45 + 481266.484 * T;
  let sl = 0, sr = 0, sb = 0;
  for (const [d, m, mp, f, cl, cr] of LR) { const a = (d * D + m * M + mp * Mp + f * F) * r, e = Math.pow(E, Math.abs(m)); sl += cl * e * Math.sin(a); sr += cr * e * Math.cos(a); }
  for (const [d, m, mp, f, cb] of BT) sb += cb * Math.pow(E, Math.abs(m)) * Math.sin((d * D + m * M + mp * Mp + f * F) * r);
  sl += 3958 * Math.sin(A1 * r) + 1962 * Math.sin((Lp - F) * r) + 318 * Math.sin(A2 * r);
  sb += -2235 * Math.sin(Lp * r) + 382 * Math.sin(A3 * r) + 175 * Math.sin((A1 - F) * r) + 175 * Math.sin((A1 + F) * r) + 127 * Math.sin((Lp - Mp) * r) - 115 * Math.sin((Lp + Mp) * r);
  const lam = (Lp + sl / 1e6) * r, bet = sb / 1e6 * r, R = 385000.56 + sr / 1000;
  return [R * Math.cos(bet) * Math.cos(lam), R * Math.cos(bet) * Math.sin(lam), R * Math.sin(bet)];
}

/* ---------- 太阳 / 地球（低精度，《天文年历》公式，约 0.01°） ---------- */
// 太阳的地心黄经（弧度）
export function sunLon(jd) {
  const d = jd - 2451545, g = (357.529 + 0.98560028 * d) * Math.PI / 180;
  return (280.459 + 0.98564736 * d + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * Math.PI / 180;
}
// 地球的日心黄道坐标 AU（z 取 0）
export function earthHelioAU(jd) {
  const d = jd - 2451545, g = (357.529 + 0.98560028 * d) * DEG, L = 280.459 + 0.98564736 * d;
  const lam = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g) + 180) * DEG;
  const R = 1.00014 - 0.01671 * Math.cos(g) - 0.00014 * Math.cos(2 * g);
  return [R * Math.cos(lam), R * Math.sin(lam), 0];
}

/* ---------- 行星 ----------
   JPL “Approximate Positions of the Planets” 表 1（1800—2050 年适用）：
   [a (AU), e, I, L, 近日点经度, 升交点经度]（度）及其每世纪变率，J2000 黄道。
   内行星的误差约几万 km，木星、土星可达几十万 km；需要更准时由任务自己叠加改正表（见 cassini/mission.js）。 */
export const PLANET_ELEMENTS = {
  mercury: [[0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593], [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081]],
  venus:   [[0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255], [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418]],
  earth:   [[1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0], [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0]],
  mars:    [[1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891], [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343]],
  jupiter: [[5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909], [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106]],
  saturn:  [[9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448], [-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794]],
  uranus:  [[19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.95427630, 74.01692503], [-0.00196176, -0.00004397, -0.00242939, 428.48202785, 0.40805281, 0.04240589]],
  neptune: [[30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574], [0.00026291, 0.00005105, 0.00035372, 218.45945325, -0.32241464, -0.00508664]],
};
export const PLANET_PERIOD = { mercury: 87.969, venus: 224.7, earth: 365.26, mars: 687, jupiter: 4333, saturn: 10759, uranus: 30687, neptune: 60190 };   // 天
// 行星（地球为地月质心）的日心 J2000 黄道坐标，km
export function planetHelioKm(name, jd) {
  const [e0, r] = PLANET_ELEMENTS[name], Tc = (jd - 2451545) / 36525;
  const a = e0[0] + r[0] * Tc, e = e0[1] + r[1] * Tc, I = (e0[2] + r[2] * Tc) * DEG, L = e0[3] + r[3] * Tc, w = e0[4] + r[4] * Tc, O = e0[5] + r[5] * Tc;
  let E = wrapPI((L - w) * DEG); const M = E;
  for (let i = 0; i < 40; i++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-13) break; }
  const x = a * (Math.cos(E) - e), y = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const om = (w - O) * DEG, Om = O * DEG, co = Math.cos(om), so = Math.sin(om), cO = Math.cos(Om), sO = Math.sin(Om), cI = Math.cos(I), sI = Math.sin(I);
  return [((co * cO - so * sO * cI) * x + (-so * cO - co * sO * cI) * y) * AU,
          ((co * sO + so * cO * cI) * x + (-so * sO + co * cO * cI) * y) * AU,
          ((so * sI) * x + (co * sI) * y) * AU];
}
