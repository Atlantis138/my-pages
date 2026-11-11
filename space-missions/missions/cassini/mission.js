// 卡西尼–惠更斯号：数据、星历、阶段、事件、机位，以及两个坐标系各自怎么画。
// 时间 t 为距 1997-10-15 00:00 UT 的天数。
//   H  日心黄道坐标系：1 单位 = 0.1 AU（全站统一）
//   S  土星环平面坐标系：1 单位 = 1 万 km，土星在原点，z 轴为土星自转轴，坐标轴不随时间转动

import { TAU, DEG, clamp, smooth, bump, makeClock, fmtInt, fmtKm, fmtLight, rgba, flat, $ } from '../../shared/util.js';
import { unpackDelta, idxAt, interp, chordSpeed, pointAt, tableAt } from '../../shared/track.js';
import { AU, C_KMS, RADIUS, ZH, PLANET_PERIOD, kepE, wrapPI, trueAnom, moonGeoKm, planetHelioKm } from '../../shared/astro.js';
import { C, cam, ctx, gAlpha, isDark, B, PO, focal, proj, viewR, poly, seg3, arrow, grid, shadedDisk, body, sun, equinoxArrow, dot2, craftMark, dropLine, placeTag,
         lerpCam, lerpZoom, at, env, closeUp } from '../../shared/scene.js';
import { mountPlot, loadData, createPlayer, HELIO_FRAME, UH } from '../../shared/player.js';
import { mountCrumbs } from '../../shared/chrome.js';
import { mountProfile } from './profile.js';
import { mountMoons } from './moons.js';
import { mountCraft } from './craft.js';

const clock = makeClock(Date.UTC(1997, 9, 15), 2450736.5);
const { T, isoDate, utc, jd } = clock;

mountCrumbs();
mountPlot({ tokens: ['titan', 'encel', 'moon'] });
const [DATA] = await loadData([new URL('./data/cassini.json', import.meta.url)]);

const US = 1e4;
const RS = 60268, RS_POL = 54364;        // 土星赤道 / 极半径（1 bar 高度），km

/* ================= 轨迹 ================= */
const TH = unpackDelta(DATA.H, UH), TS = unpackDelta(DATA.S, US), THY0 = unpackDelta(DATA.HY, US);
const THY = (() => {   // 惠更斯号最后 1.2 天每 7 分钟重采样一次，这样换算到“相对泰坦”时才平滑
  const tE = THY0.t[THY0.n - 1], ts = [];
  for (let i = 0; i < THY0.n; i++) if (THY0.t[i] < tE - 1.2) ts.push(THY0.t[i]);
  for (let x = tE - 1.2; x < tE; x += 0.005) ts.push(x);
  ts.push(tE);
  const n = ts.length, t = new Float64Array(ts), p = new Float64Array(n * 3);
  for (let i = 0; i < n; i++) p.set(interp(THY0, ts[i]), 3 * i);
  return { t, p, n };
})();
const T_START = TH.t[0], T_END = TS.t[TS.n - 1];
const rawH = t => interp(TH, t), rawS = t => interp(TS, t);

/* ================= 行星（日心 J2000 黄道）=================
   JPL 近似根数，木星、土星另加 Horizons 改正表，借力前后再叠加局部改正。 */
const PLANETS = { venus: '299', earth: '399', mars: '499', jupiter: '599', saturn: '699' };
const PLC = { venus: 'gold', earth: 'blue', mars: 'ink-2', jupiter: 'gold', saturn: 'gold' };
function planetKm(name, t) {
  const p = planetHelioKm(name, jd(t)), id = PLANETS[name], tab = DATA.pc[id];
  if (tab) {
    const [i, k] = tableAt(tab, tab.d.length / 3, t);
    for (let c = 0; c < 3; c++) p[c] += (tab.d[3 * i + c] + (tab.d[3 * i + 3 + c] - tab.d[3 * i + c]) * k) * 100;
  }
  for (const f of DATA.pfly) if (f.p === id) {
    const dt = t - f.t, b = bump(dt, 0.25, 0.6);
    if (b > 0) for (let c = 0; c < 3; c++) p[c] += (f.off[c] + f.rate[c] * dt) * b;
  }
  return p;
}
const planetH = (name, t) => planetKm(name, t).map(v => v / UH);
const ORBITS = {};
for (const name of Object.keys(PLANETS)) ORBITS[name] = flat(Array.from({ length: 241 }, (_, i) => planetHelioKm(name, jd(T('2001-01-01') + i / 240 * PLANET_PERIOD[name])).map(v => v / UH)));

/* ================= 土星的卫星（环平面坐标系）=================
   每颗卫星按块拟合一条进动椭圆（对 Horizons），块与块之间平滑过渡；每次近距飞越再叠加由真实星历算出的改正量。 */
const MOONS = [
  { id: '601', zh: '弥玛斯', no: '土卫一', en: 'Mimas', R: 198.2, col: 'moon' },
  { id: '602', zh: '恩克拉多斯', no: '土卫二', en: 'Enceladus', R: 252.1, col: 'encel' },
  { id: '603', zh: '特提斯', no: '土卫三', en: 'Tethys', R: 531.0, col: 'moon' },
  { id: '604', zh: '狄俄涅', no: '土卫四', en: 'Dione', R: 561.4, col: 'moon' },
  { id: '605', zh: '瑞亚', no: '土卫五', en: 'Rhea', R: 763.5, col: 'moon' },
  { id: '606', zh: '泰坦', no: '土卫六', en: 'Titan', R: 2574.7, col: 'titan' },
  { id: '607', zh: '许珀里翁', no: '土卫七', en: 'Hyperion', R: 135.0, col: 'moon' },
  { id: '608', zh: '伊阿珀托斯', no: '土卫八', en: 'Iapetus', R: 734.5, col: 'moon' },
  { id: '609', zh: '菲比', no: '土卫九', en: 'Phoebe', R: 106.5, col: 'moon' },
];
const ENCEL = 1, TITAN = 5, IAPETUS = 7, PHOEBE = 8;
MOONS.forEach((m, i) => { m.fit = DATA.moons[m.id]; m.corr = DATA.corr.filter(c => c[1] === i); });
function keplerPos(el, dt, out) {
  const a = el[0], e = el[1], inc = el[2], Om = el[3] + el[4] * dt, pi = el[5] + el[6] * dt;
  const lam = el[7] + el[8] * dt + el[9] * dt * dt + el[10] * dt * dt * dt;
  const E = kepE(wrapPI(lam - pi), e), r = a * (1 - e * Math.cos(E)), u = trueAnom(E, e) + pi - Om;
  const cO = Math.cos(Om), sO = Math.sin(Om), cu = Math.cos(u), su = Math.sin(u), ci = Math.cos(inc), si = Math.sin(inc);
  out[0] = r * (cO * cu - sO * su * ci); out[1] = r * (sO * cu + cO * su * ci); out[2] = r * su * si;
  return out;
}
const KT = [0, 0, 0];
function moonKm(i, t) {
  const m = MOONS[i], f = m.fit, Bk = f.B, L = f.L;
  const x = (t - f.T0) / L - 0.5, i0 = clamp(Math.floor(x), 0, Bk.length - 1), i1 = Math.min(i0 + 1, Bk.length - 1);
  let w = clamp((x - i0 - 0.5) / 0.1 + 0.5, 0, 1); w = w * w * (3 - 2 * w);
  if (x < 0) w = 0;
  const p = [0, 0, 0];
  if (w < 1) { keplerPos(Bk[i0], t - (f.T0 + (i0 + 0.5) * L), KT); for (let c = 0; c < 3; c++) p[c] += KT[c] * (1 - w); }
  if (w > 0) { keplerPos(Bk[i1], t - (f.T0 + (i1 + 0.5) * L), KT); for (let c = 0; c < 3; c++) p[c] += KT[c] * w; }
  // 飞越改正（真实 − 模型），前后半天内淡出
  const cs = m.corr;
  let lo = 0, hi = cs.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (cs[mid][0] < t - 0.6) lo = mid + 1; else hi = mid; }
  for (let k = lo; k < cs.length && cs[k][0] < t + 0.6; k++) {
    const c = cs[k], dt = t - c[0], b = bump(dt, 0.3, 0.6);
    if (b > 0) for (let q = 0; q < 3; q++) p[q] += (c[2 + q] + c[5 + q] * dt) * b;
  }
  return p;
}
const moonS = (i, t) => { const p = moonKm(i, t); return [p[0] / US, p[1] / US, p[2] / US]; };
function moonOrbitPts(i, t, n) {   // 时刻 t 所在那一块的椭圆，画一整圈
  const f = MOONS[i].fit, bi = clamp(Math.floor((t - f.T0) / f.L), 0, f.B.length - 1), el = f.B[bi], tc = f.T0 + (bi + 0.5) * f.L;
  const P = TAU / el[8], out = new Float64Array((n + 1) * 3);
  for (let k = 0; k <= n; k++) { keplerPos(el, t - tc + (k / n - 0.5) * P, KT); out[3 * k] = KT[0] / US; out[3 * k + 1] = KT[1] / US; out[3 * k + 2] = KT[2] / US; }
  return out;
}
// 太阳方向（单位矢量）与地球距离，土星坐标系，10 天一点
function sunDir(t) {
  const s = DATA.sun, [i, k] = tableAt(s, s.u.length / 3, t);
  const v = [0, 1, 2].map(c => s.u[3 * i + c] + (s.u[3 * i + 3 + c] - s.u[3 * i + c]) * k), l = Math.hypot(...v);
  return v.map(c => c / l);
}
function earthDistKm(t) {
  const s = DATA.earth, [i, k] = tableAt(s, s.d.length, t);
  return (s.d[i] + (s.d[i + 1] - s.d[i]) * k) * 1e5;
}

/* ================= 飞越、圈数、关键时刻 ================= */
const FLY = DATA.fly.map(f => ({ t: f[0], mi: f[1], alt: f[2], v: f[3] }));
// 计入页面的飞越：泰坦 7 万 km 以内，恩克拉多斯 5,000 km 以内，菲比那一次，其余卫星 1 万 km 以内
const isTarget = f => f.mi === TITAN ? f.alt < 70000 : f.mi === ENCEL ? f.alt < 5000 : f.mi === PHOEBE ? true : f.alt < 10000;
const TF = FLY.filter(isTarget);
let nT = 0, nE = 0;
for (const f of TF) {
  if (f.mi === TITAN) { f.name = nT < 3 ? 'T' + 'ABC'[nT] : 'T' + nT; nT++; }
  else if (f.mi === ENCEL) { f.name = 'E' + nE; nE++; }
  else f.name = MOONS[f.mi].zh;
  f.cls = MOONS[f.mi].col;
  f.title = f.name === MOONS[f.mi].zh ? '飞越' + f.name : `${f.name} · 飞越${MOONS[f.mi].zh}`;
}
const flyByName = n => TF.find(f => f.name === n);
const altTxt = f => fmtKm(f.alt);
const [pv1, pv2, pe, pj] = DATA.pfly;
const T_V1 = pv1.t, T_V2 = pv2.t, T_E = pe.t, T_J = pj.t, T_MAS = DATA.mas.t;
const REVS = DATA.revs.map(r => ({ t: r[0], r: r[1], inc: r[2], per: r[3] }));
const T_SOI = REVS[0].t, APO = DATA.apo;
const apoBefore = t => { let lo = 0, hi = APO.length; while (lo < hi) { const m = (lo + hi) >> 1; if (APO[m] <= t) lo = m + 1; else hi = m; } return lo; };
const revNo = t => t < T_SOI - 0.2 ? 0 : apoBefore(t) + 1;
const lastApo = t => { const k = apoBefore(t); return k > 0 ? APO[k - 1] : -1e9; };
const T_HY0 = THY.t[0], T_HYE = DATA.HYentry.t, T_LAND = T('2005-01-14T11:38');
const GF1 = DATA.gfX[0][0];
const PHO = TF.find(f => f.mi === PHOEBE), IAP = TF.find(f => f.mi === IAPETUS);
const TA = flyByName('TA'), E2 = flyByName('E2'), E5 = flyByName('E5'), E21 = flyByName('E21'), T126 = flyByName('T126');
const fT = FLY.find(f => f.mi === TITAN && f.t > T('2017-09-10') && f.t < T('2017-09-13'));   // 最后一次远距离经过泰坦
const T_GR = T('2002-06-21'), T_BURN0 = T('2004-07-01T01:12'), T_BURN1 = T('2004-07-01T02:48'), T_ENTRY = T('2017-09-15T10:31');

/* ================= 阶段 ================= */
const INNER = { tx: -0.6, ty: 1.2, tz: 0, dist: 34, az: -96, el: 58 };
const SEG = [
  { id: 'launch', name: '发射，先朝太阳飞', short: '发射', yr: '1997–98', t0: T_START, t1: T('1999-01-01'), w: 9, frame: 'H',
    show: T_V1 - 1.5, cam: t => closeUp(INNER, t, [{ t: T_V1, a: 2.6, b: 0.22, cam: t => at(planetH('venus', t), { dist: 0.0045, az: -40, el: 20 }) }]) },
  { id: 'earth', name: '金星与地球', short: '金星·地球', yr: '1999', t0: T('1999-01-01'), t1: T('1999-09-15'), w: 9, frame: 'H',
    show: T_E - 1.4, cam: t => closeUp(INNER, t,
      [{ t: T_V2, a: 2.6, b: 0.22, cam: t => at(planetH('venus', t), { dist: 0.0048, az: -150, el: 22 }) },
       { t: T_E, a: 2.6, b: 0.22, cam: t => at(planetH('earth', t), { dist: 0.0056, az: -120, el: 24 }) }]) },
  { id: 'jupiter', name: '小行星与木星', short: '木星', yr: '1999–01', t0: T('1999-09-15'), t1: T('2001-07-01'), w: 7, frame: 'H',
    show: T_J - 30, cam: t => closeUp({ tx: -6, ty: -14, tz: 0, dist: 110, az: -100, el: 56 }, t,
      [{ t: T_J, a: 48, b: 6, cam: t => at(planetH('jupiter', t), { dist: 2.4, az: -80, el: 34 }) }]) },
  { id: 'cruise', name: '三年巡航', short: '巡航', yr: '2001–04', t0: T('2001-07-01'), t1: T('2004-05-01'), w: 6, frame: 'H',
    show: T_GR, cam: t => {
      const s = planetH('saturn', t), base = { tx: s[0] * 0.45, ty: s[1] * 0.45, tz: 0, dist: 190, az: -100, el: 56 };
      return lerpCam(base, { tx: 0, ty: 0, tz: 0, dist: 150, az: -70, el: 30 }, env(t, T_GR, 70, 25));
    } },
  { id: 'arrival', name: '菲比与入轨', short: '入轨', yr: '2004', t0: T('2004-05-01'), t1: T('2004-07-15'), w: 9, frame: 'S',
    show: T('2004-06-30T21:00'), cam: t => {
      const base = { tx: 0, ty: 0, tz: 0, dist: clamp(Math.hypot(...rawS(t)) * 1.25, 40, 3200), az: -60, el: 24 };
      return closeUp(base, t, [{ t: PHO.t, a: 2.5, b: 0.08, cam: t => at(moonS(PHOEBE, t), { dist: 0.55, az: -20, el: 18 }) }]);
    } },
  { id: 'huygens', name: '惠更斯号', short: '惠更斯', yr: '2004–05', t0: T('2004-07-15'), t1: T('2005-01-20'), w: 9, frame: 'S',
    show: T_HYE - 0.9, cam: t => {
      const k = smooth(T_HYE - 1.6, T_HYE - 0.12, t) * (1 - smooth(T_LAND + 0.12, T_LAND + 1.6, t));
      return lerpZoom({ tx: 0, ty: 0, tz: 0, dist: 420, az: -70, el: 40 }, at(moonS(TITAN, t), { dist: 11, az: -35, el: 22 }), k);
    } },
  { id: 'prime', name: '主任务', short: '主任务', yr: '2005–08', t0: T('2005-01-20'), t1: T('2008-07-01'), w: 13, frame: 'S',
    show: E2.t - 0.6, cam: () => ({ tx: 0, ty: 0, tz: 0, dist: 560, az: -80, el: 52 }) },
  { id: 'equinox', name: '春分任务', short: '春分', yr: '2008–10', t0: T('2008-07-01'), t1: T('2010-09-28'), w: 9, frame: 'S',
    show: T('2009-08-11'), cam: () => ({ tx: 0, ty: 0, tz: 0, dist: 380, az: -70, el: 30 }) },
  { id: 'solstice', name: '至日任务', short: '至日', yr: '2010–16', t0: T('2010-09-28'), t1: T('2016-11-30'), w: 14, frame: 'S',
    show: T('2013-07-19T21:00'), cam: () => ({ tx: 0, ty: 0, tz: 0, dist: 470, az: -60, el: 16 }) },
  { id: 'grazing', name: '擦着 F 环飞', short: '擦环', yr: '2016–17', t0: T('2016-11-30'), t1: T('2017-04-22T03:00'), w: 6, frame: 'S',
    show: T('2017-01-10'), cam: () => ({ tx: 0, ty: 0, tz: 0, dist: 120, az: -50, el: 22 }) },
  { id: 'finale', name: '大结局', short: '结局', yr: '2017', t0: T('2017-04-22T03:00'), t1: T_END, w: 10, frame: 'S',
    show: GF1 - 0.6, cam: t => {
      const sc = rawS(t), k = smooth(T_END - 0.55, T_END - 0.05, t);
      return lerpZoom({ tx: 0, ty: 0, tz: 0, dist: 62, az: -70, el: 12 }, at([sc[0] * 0.85, sc[1] * 0.85, sc[2] * 0.85], { dist: 4.2, az: -40, el: 10 }), k);
    } },
];

/* ================= 事件 =================
   t 注记出现的时刻，win 注记停留多久（天），at 事件按钮跳到的时刻（默认同 t）；key 为重要事件（刻度更高）。 */
const EVENTS = [
  { t: T_START, win: 18, d: '1997-10-15 08:43 UT', x: '发射 · 大力神 IVB/半人马座 · 卡纳维拉尔角 40 号发射台', key: 1 },
  { t: T_V1 - 1.2, at: T_V1, win: 2.4, d: utc(T_V1), x: `第一次金星借力 · 距金星表面 ${fmtInt(pv1.d - RADIUS.venus)} km`, key: 1 },
  { t: T('1998-12-03'), win: 40, d: '1998-12-03', x: '深空机动：主发动机点火约 88 分钟，速度改变约 450 m/s' },
  { t: T_V2 - 1.2, at: T_V2, win: 2.4, d: utc(T_V2), x: `第二次金星借力 · 本图 ${fmtInt(pv2.d - RADIUS.venus)} km（当年公布 623 km）`, key: 1 },
  { t: T_E - 1.2, at: T_E, win: 2.6, d: utc(T_E), x: `地球借力 · 距地面 ${fmtInt(pe.d - RADIUS.earth)} km，相对速度 ${pe.v.toFixed(1)} km/s`, key: 1 },
  { t: T_MAS - 12, at: T_MAS, win: 24, d: '2000-01-23', x: `经过小行星 2685 Masursky，约 ${fmtKm(DATA.mas.d)}` },
  { t: T_J - 12, at: T_J, win: 24, d: utc(T_J), x: `木星最近点 · 距木星中心约 ${fmtKm(pj.d)}，与伽利略号联合观测`, key: 1 },
  { t: T('2002-06-06'), at: T_GR, win: 31, d: '2002-06-06 — 07-07', x: '太阳合：信号擦过太阳，检验广义相对论' },
  { t: T('2004-06-01'), win: 7, d: '2004-06-01', x: '在照片里发现两颗新卫星 Methone 和 Pallene' },
  { t: PHO.t - 0.4, at: PHO.t, win: 0.8, d: utc(PHO.t), x: `飞越菲比 · 距表面 ${fmtInt(PHO.alt)} km（史料 2,068 km）`, key: 1 },
  { t: DATA.soiX[0][0] - 0.03, at: DATA.soiX[0][0], win: 0.05, d: utc(DATA.soiX[0][0]), x: `从 F 环与 G 环之间穿过环平面，距土星中心 ${fmtKm(DATA.soiX[0][1])}` },
  { t: T_BURN0, win: 0.067, d: '2004-07-01 01:12 UT', x: '入轨点火开始：96 分钟，减速 626 m/s' },
  { t: T_SOI - 0.004, at: T_SOI, win: 0.08, d: utc(T_SOI), x: `最接近土星：距云顶 ${fmtInt(REVS[0].r - RS)} km，成为第一个土星轨道器`, key: 1 },
  { t: DATA.soiX[1][0] - 0.01, at: DATA.soiX[1][0], win: 1.2, d: utc(DATA.soiX[1][0]), x: '从光环另一侧穿出环平面' },
  { t: TA.t - 0.5, at: TA.t, win: 1.2, d: utc(TA.t), x: `TA：第一次近距飞越泰坦，${altTxt(TA)}` },
  { t: T_HY0, win: 3, d: '2004-12-25 02:00 UT', x: '弹出惠更斯号，让它独自滑行 20 天飞向泰坦', key: 1 },
  { t: T_HYE - 0.02, at: T_HYE, win: 0.1, d: utc(T_HYE), x: '惠更斯号进入泰坦大气，开始两个半小时的降落', key: 1 },
  { t: T_LAND - 0.02, at: T_LAND, win: 0.3, d: '2005-01-14 约 11:38 UT', x: '惠更斯号着陆：−179 °C，1.47 个大气压' },
  { t: E2.t - 0.3, at: E2.t, win: 0.6, d: utc(E2.t), x: `E2：从恩克拉多斯上空 ${fmtInt(E2.alt)} km 穿过一团水汽` },
  { t: T('2005-11-27'), win: 20, d: '2005 年 11 月', x: '照片证实恩克拉多斯南极在喷水汽和冰粒' },
  { t: T('2006-07-22'), win: 30, d: '2006-07-22', x: 'T16：雷达在泰坦北极发现湖泊' },
  { t: IAP.t - 0.5, at: IAP.t, win: 1, d: utc(IAP.t), x: `唯一一次近距飞越伊阿珀托斯，${fmtInt(IAP.alt)} km` },
  { t: T('2008-06-30'), win: 25, d: '2008-06-30', x: '主任务结束，进入春分任务' },
  { t: E5.t - 0.3, at: E5.t, win: 0.6, d: utc(E5.t), x: `E5：离恩克拉多斯表面只有 ${fmtInt(E5.alt)} km，穿过羽流` },
  { t: T('2009-08-01'), at: T('2009-08-11'), win: 25, d: '2009-08-11', x: '土星春分：阳光平射环面，环上的垂直结构投下长影', key: 1 },
  { t: T('2010-09-28'), win: 25, d: '2010-09-28', x: '进入至日任务' },
  { t: T('2010-12-05'), win: 60, d: '2010-12-05', x: '北半球爆发大风暴，两个月后绕土星一圈' },
  { t: T('2013-07-19'), at: T('2013-07-19T21:27'), win: 6, d: '2013-07-19', x: '“地球微笑的那一天”：在土星阴影里逆光拍摄光环和远处的地球' },
  { t: T('2015-09-15'), win: 20, d: '2015-09-15', x: '恩克拉多斯的摆动证明冰壳下有全球海洋' },
  { t: E21.t - 0.3, at: E21.t, win: 0.6, d: utc(E21.t), x: `E21：最深的一次羽流穿越，距表面 ${fmtInt(E21.alt)} km（史料 49 km）` },
  { t: T('2016-11-30'), win: 12, d: '2016-11-30', x: '开始擦 F 环的 20 圈轨道' },
  { t: T126.t - 0.4, at: T126.t, win: 1.2, d: utc(T126.t), x: `T126：最后一次近距飞越泰坦，${fmtInt(T126.alt)} km，开启大结局` },
  { t: GF1 - 0.08, at: GF1, win: 0.2, d: utc(GF1), x: '第一次穿过土星与光环之间的缝隙', key: 1 },
  { t: T('2017-05-24'), win: 6, d: '2017-05-24', x: '土星北半球夏至' },
  { t: fT.t - 0.6, at: fT.t, win: 1.5, d: utc(fT.t), x: `最后一次经过泰坦（${fmtKm(fT.alt)}），把它推向土星` },
  { t: T_ENTRY - 0.03, at: T_ENTRY, win: 0.05, d: '2017-09-15 10:31 UT', x: '进入土星大气，推进器全力保持天线指向地球', key: 1 },
  { t: T_END - 0.0006, at: T_END, win: 1, d: '10:32 UT · 地球 11:55 UT', x: '信号中断。83 分钟后，地球收到最后的信号', key: 1 },
];
// 时间轴上排的细刻度：每一次卫星飞越
const MARKS = TF.map(f => ({ t: f.t, color: f.cls, d: utc(f.t), x: `${f.title} · ${altTxt(f)}` }));
// 播放到近距飞越附近时放慢：[时刻, 宽度（天）, 1× 时每秒最多走几天]
const FOCUS = [[T_V1, 0.9, 0.3], [T_V2, 0.9, 0.3], [T_E, 0.9, 0.3], [T_J, 14, 5], [PHO.t, 0.3, 0.08], [T('2004-07-01T02:00'), 0.12, 0.03],
  [T_HYE, 0.12, 0.035], [GF1, 0.12, 0.04], [T_END - 0.02, 0.06, 0.012]];

/* ================= 画：日心黄道坐标系（巡航段）================= */
const H_FLY = [
  { t: T_V1, p: 'venus', n: '金星借力 ①' }, { t: T_V2, p: 'venus', n: '金星借力 ②' }, { t: T_E, p: 'earth', n: '地球借力' }, { t: T_J, p: 'jupiter', n: '木星借力' },
];
function renderH(g, t) {
  const vr = viewR(), close = vr < 0.3, z0 = close ? cam.tz : 0, red = C.pen;
  grid({ polar: true, z0 });
  if (!close) equinoxArrow();
  for (const name of Object.keys(ORBITS)) {
    if (name === 'saturn' && vr < 20 && g.id !== 'cruise') continue;
    poly(ORBITS[name], 0, 240, C[PLC[name]], 1.1, name === 'mars' ? 0.4 : 0.7);
  }
  sun([0, 0, 0], RADIUS.sun / UH, 6);
  for (const name of Object.keys(PLANETS)) {
    const p = planetH(name, t), l = Math.hypot(...p);
    const b = body(p, RADIUS[name] / UH, p.map(v => -v / l), C.sheet, C[PLC[name]], name === 'jupiter' || name === 'saturn' ? 4.5 : 3.6);
    if (name === 'saturn' && b && b.r < 40) {   // 远景时示意一下光环
      ctx.save(); ctx.globalAlpha = gAlpha * 0.8; ctx.strokeStyle = C.gold; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r * 2.2, b.r * 0.75, -0.35, 0, TAU); ctx.stroke(); ctx.restore();
    }
    placeTag('pl-' + name, p, ZH[name], 'zh ' + (PLC[name] === 'ink-2' ? 'faint' : PLC[name]), (b ? b.r : 4) * 0.8 + 6, (b ? b.r : 4) * 0.8 + 6);
  }
  // 1999 年地球借力的特写里画出月球
  if (Math.abs(t - T_E) < 1.5 && vr < 0.2) {
    const e = planetH('earth', t), m = moonGeoKm(jd(t)).map((v, i) => e[i] + v / UH), l = Math.hypot(...m);
    body(m, RADIUS.moon / UH, m.map(v => -v / l), C.sheet, C.ink, 3);
    placeTag('luna', m, '月球', 'zh faint', 8, 12);
  }
  if (Math.abs(t - T_MAS) < 30) {
    const M = DATA.mas, dt = t - T_MAS, p = [0, 1, 2].map(c => (M.p[c] + M.v[c] * dt) / UH);
    dot2(p, 2.6, C['ink-2'], null); placeTag('mas', p, '2685 Masursky', 'faint', 8, -10);
  }
  // 2002 年太阳合期间的无线电链路
  const sc = rawH(t);
  if (t > T('2002-06-06') && t < T('2002-07-08')) {
    const e = planetH('earth', t); seg3(e, sc, C.blue, 1.1, 0.75, [5, 4]);
    placeTag('link', [(e[0] + sc[0]) / 2, (e[1] + sc[1]) / 2, (e[2] + sc[2]) / 2], '无线电信号擦过太阳', 'zh blue', 8, 16);
  }
  // 轨迹：整个巡航段，飞过的用笔色
  const iNow = idxAt(TH, t);
  poly(TH.p, iNow, TH.n - 1, C['ink-2'], 1.1, 0.5);
  poly(TH.p, 0, iNow, red, 2.2, 1);
  seg3(pointAt(TH, iNow), sc, red, 2.2, 1);
  // 借力的位置（最近点时探测器所在处）
  H_FLY.forEach((f, i) => {
    if (close && Math.abs(t - f.t) < 1) return;
    const p = rawH(f.t), col = C[PLC[f.p]], o = dot2(p, 4.5, t >= f.t ? col : null, col, 1.4);
    if (o && !close && vr < 30) placeTag('hf' + i, p, f.n, 'zh ' + PLC[f.p], -12, -12);
  });
  dropLine(sc, red, z0);
  craftMark(sc, '卡西尼号');
  return sc;
}

/* ================= 画：土星环平面坐标系 ================= */
const RINGS = [ // 内缘、外缘（km）、不透明度：D、C、B、卡西尼缝、A（恩克缝内外）
  [66900, 74490, 0.10], [74490, 91980, 0.32], [91980, 117580, 0.66], [117580, 122170, 0.13], [122170, 133423, 0.48], [133745, 136775, 0.44],
];
function annulusHalf(r0, r1, a0, a1, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([r1 * Math.cos(a), r1 * Math.sin(a)]); }
  for (let i = n; i >= 0; i--) { const a = a0 + (a1 - a0) * i / n; pts.push([r0 * Math.cos(a), r0 * Math.sin(a)]); }
  return pts;
}
function pathXY(pts, z) {
  ctx.beginPath(); let ok = true;
  pts.forEach((q, i) => { if (!proj(q[0], q[1], z)) ok = false; if (i) ctx.lineTo(PO.x, PO.y); else ctx.moveTo(PO.x, PO.y); });
  ctx.closePath(); return ok;
}
// half: 'far' 或 'near'，相对土星而言离相机远的半边 / 近的半边
function drawRings(half, sunU) {
  const phi = Math.atan2(B.f[1], B.f[0]);
  const a0 = half === 'far' ? phi - Math.PI / 2 : phi + Math.PI / 2, a1 = a0 + Math.PI;
  const lit = Math.sign(B.pos[2] || 1) === Math.sign(sunU[2] || 1) ? 1 : 0.55, gold = C.gold;
  ctx.save(); ctx.globalAlpha = gAlpha;
  for (const [r0, r1, op] of RINGS) {
    if (!pathXY(annulusHalf(r0 / US, r1 / US, a0, a1, 64), 0)) continue;
    ctx.fillStyle = rgba(gold, op * lit * (isDark ? 0.9 : 1)); ctx.fill();
  }
  // 土星投在环上的影子：沿背阳方向的一条带
  const sh = Math.hypot(sunU[0], sunU[1]), el = Math.abs(sunU[2]);
  if (sh > 1e-3) {
    const ax = -sunU[0] / sh, ay = -sunU[1] / sh, px = -ay, py = ax, Rp = RS / US;
    const L = Math.min(137000 / US * 1.05, Rp / Math.max(el, 1e-3));
    const shp = [[Rp * px, Rp * py], [Rp * px + ax * L, Rp * py + ay * L], [-Rp * px + ax * L, -Rp * py + ay * L], [-Rp * px, -Rp * py]];
    if (pathXY(annulusHalf(66900 / US, 136775 / US, a0, a1, 64), 0)) {
      ctx.clip();
      if (pathXY(shp, 0)) { ctx.fillStyle = isDark ? 'rgba(0,0,0,.55)' : rgba(C.ink, 0.32); ctx.fill(); }
    }
  }
  ctx.restore();
  // F、G、E 环画成线
  const ringLine = (R, a, w) => { const pts = new Float64Array(49 * 3); for (let i = 0; i <= 48; i++) { const ang = a0 + Math.PI * i / 48; pts[3 * i] = R * Math.cos(ang); pts[3 * i + 1] = R * Math.sin(ang); } poly(pts, 0, 48, gold, w, a * lit, { flat: true }); };
  ringLine(140180 / US, 0.85, 1.1); ringLine(170000 / US, 0.25, 3); ringLine(238000 / US, 0.08, 9);
}
function saturnBody(sunU) {
  if (!proj(0, 0, 0)) return null;
  const x = PO.x, y = PO.y, aPx = (RS / US) / PO.z * focal;
  const pc = [B.r[2], B.u[2], B.f[2]];                 // 自转轴 (0,0,1) 在相机坐标里的分量
  const cb = Math.abs(pc[2]), bPx = Math.sqrt((RS_POL / RS) ** 2 * (1 - cb * cb) + cb * cb) * aPx;
  const rot = Math.atan2(-pc[1], pc[0]);
  const rr = Math.max(4.5, aPx), ratio = Math.max(0.2, bPx / Math.max(aPx, 1e-6));
  // 沿投影后的自转轴方向压扁到极半径；背阳面也在这个坐标里画
  ctx.save(); ctx.globalAlpha = gAlpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(ratio, 1);
  shadedDisk(rr, sunU, rgba(C.gold, isDark ? 0.55 : 0.38), C.gold, 0.5, rot);
  ctx.restore();
  // 几条纬线（只画朝向相机的半球）
  if (aPx > 14) {
    const a = RS / US, c = RS_POL / US, cp = B.pos;
    for (const lat of [-60, -40, -20, 0, 20, 40, 60]) {
      const pts = new Float64Array(97 * 3), cl = Math.cos(lat * DEG), sl = Math.sin(lat * DEG);
      for (let i = 0; i <= 96; i++) { const l = i / 96 * TAU; pts[3 * i] = a * cl * Math.cos(l); pts[3 * i + 1] = a * cl * Math.sin(l); pts[3 * i + 2] = c * sl; }
      poly(pts, 0, 96, C.gold, lat === 0 ? 1.1 : 0.8, lat === 0 ? 0.6 : 0.4, { flat: true, af: i => {
        const px = pts[3 * i], py = pts[3 * i + 1], pz = pts[3 * i + 2];
        return px / (a * a) * (px - cp[0]) + py / (a * a) * (py - cp[1]) + pz / (c * c) * (pz - cp[2]) < 0 ? 1 : 0;
      } });
    }
  }
  return { x, y, r: rr };
}
// 从相机看去，这一点是否被土星挡住
function behindSaturn(px, py, pz) {
  const o = B.pos, dx = px - o[0], dy = py - o[1], dz = pz - o[2], L2 = dx * dx + dy * dy + dz * dz;
  const tc = -(o[0] * dx + o[1] * dy + o[2] * dz) / L2;
  if (tc <= 0 || tc >= 1) return false;
  const cx = o[0] + dx * tc, cy = o[1] + dy * tc, cz = o[2] + dz * tc, R = RS / US;
  return cx * cx + cy * cy + cz * cz * (RS / RS_POL) ** 2 < R * R;
}
const locked = i => player.lock && player.lock.id === i;
function renderS(g, t) {
  const vr = viewR(), sunU = sunDir(t), red = C.pen, gold = C.gold;
  const nearSat = Math.hypot(cam.tx, cam.ty, cam.tz) < vr * 2.2;
  grid({ polar: true, z0: nearSat ? 0 : cam.tz });
  // 太阳方向，以及它在环平面上的垂足
  if (nearSat) {
    const R0 = clamp(vr * 0.62, 18, 4000), a = sunU.map(v => v * R0), b = sunU.map(v => v * R0 * 1.3);
    arrow(a, b, gold, 1.6, 0.9);
    seg3([0, 0, 0], [b[0], b[1], 0], gold, 1, 0.45, [3, 4]);
    seg3([b[0], b[1], 0], b, gold, 1, 0.45, [2, 3]);
    const elv = Math.asin(sunU[2]) / DEG;
    placeTag('sundir', b, `太阳方向 · 环平面${Math.abs(elv) < 0.3 ? '上' : (elv < 0 ? '以南 ' : '以北 ') + Math.abs(elv).toFixed(1) + '°'}`, 'zh gold', 8, -12);
  }
  // 卫星轨道（菲比只在到达阶段画）
  MOONS.forEach((m, i) => {
    if (i === PHOEBE && g.id !== 'arrival') return;
    poly(moonOrbitPts(i, t, 160), 0, 160, m.col === 'moon' ? C['ink-2'] : C[m.col], i === TITAN ? 1.3 : 1, i === TITAN ? 0.75 : m.col === 'encel' ? 0.6 : 0.38, i === PHOEBE ? { dash: [4, 4] } : {});
  });
  // 土星与光环：先画远的半边
  drawRings('far', sunU);
  const sb = saturnBody(sunU);
  drawRings('near', sunU);
  if (sb) placeTag('saturn', [0, 0, 0], '土星', 'zh gold', sb.r * 0.75 + 8, -(sb.r * 0.75 + 10));
  MOONS.forEach((m, i) => {
    if (i === PHOEBE && g.id !== 'arrival') return;
    const p = moonS(i, t), b = body(p, m.R / US, sunU, C.sheet, m.col === 'moon' ? C.ink : C[m.col], i === TITAN ? 4.5 : 3);
    // 轨道在屏幕上太小、与土星分不开的卫星不标名字
    const orbPx = proj(0, 0, 0) ? Math.hypot(...p) / PO.z * focal : 999;
    if (orbPx > (i === TITAN ? 22 : 46) || locked(i)) placeTag('m' + i, p, m.zh, 'zh ' + (m.col === 'moon' ? 'faint' : m.col), (b ? b.r : 3) * 0.7 + 6, (b ? b.r : 3) * 0.7 + 8);
  });
  // 惠更斯号
  if (g.id === 'huygens' && t >= T_HY0) {
    const iH = idxAt(THY, t);
    // 最后几小时画成相对泰坦的路径（泰坦每秒走约 5.6 km，在土星坐标系里这条路径会停在空处）
    const gA = smooth(T_HYE - 1.0, T_HYE - 0.6, t), tiNow = moonS(TITAN, t), PHY = new Float64Array(THY.p);
    if (gA > 0) for (let k = 0; k < THY.n; k++) {
      const w = gA * smooth(T_HYE - 0.6, T_HYE - 0.15, THY.t[k]); if (w <= 0) continue;
      const ti = moonS(TITAN, THY.t[k]);
      for (let c = 0; c < 3; c++) PHY[3 * k + c] += w * (tiNow[c] - ti[c]);
    }
    poly(PHY, 0, THY.n - 1, gold, 1, 0.45, { dash: [3, 4] });
    let hp;
    if (t < T_HYE) {
      poly(PHY, 0, iH, gold, 2, 1);
      hp = interp(THY, t); seg3([PHY[3 * iH], PHY[3 * iH + 1], PHY[3 * iH + 2]], hp, gold, 2, 1);
      if (iH + 1 < THY.n) { const k = clamp((t - THY.t[iH]) / (THY.t[iH + 1] - THY.t[iH]), 0, 1); hp = [0, 1, 2].map(c => PHY[3 * iH + c] + (PHY[3 * iH + 3 + c] - PHY[3 * iH + c]) * k); }
    } else {
      // 进入大气后，探测器随泰坦一起运动，停在进入点上方（泰坦同步自转）
      const ti = moonS(TITAN, t), te = moonS(TITAN, T_HYE), rel = DATA.HYentry.rel, R = MOONS[TITAN].R;
      const ang = Math.atan2(ti[1], ti[0]) - Math.atan2(te[1], te[0]), ca = Math.cos(ang), sa = Math.sin(ang);
      const k = (R + clamp(1270 * (1 - (t - T_HYE) / (T_LAND - T_HYE)), 0, 1270)) / Math.hypot(...rel);
      hp = [ti[0] + (rel[0] * ca - rel[1] * sa) * k / US, ti[1] + (rel[0] * sa + rel[1] * ca) * k / US, ti[2] + rel[2] * k / US];
      poly(PHY, 0, THY.n - 1, gold, 2, 1);
    }
    if (proj(hp[0], hp[1], hp[2])) {
      ctx.globalAlpha = gAlpha; ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(PO.x, PO.y, 3.6, 0, TAU); ctx.fill();
      placeTag('huy', hp, t >= T_LAND ? '惠更斯号 · 已着陆' : '惠更斯号', 'zh gold', -10, 14);
    }
  }
  // 卡西尼号：本阶段的轨迹。早先的圈画淡，当前这一圈加粗，还没飞到的用灰色
  const i0 = idxAt(TS, g.t0), i1 = Math.min(TS.n - 1, idxAt(TS, g.t1) + 1), iNow = idxAt(TS, t);
  const iRev = idxAt(TS, Math.max(g.t0, lastApo(t)));
  const P = TS.p, satPx = (RS / US) / (Math.hypot(B.pos[0], B.pos[1], B.pos[2]) || 1) * focal;
  const occl = satPx > 5 ? (i => behindSaturn(P[3 * i], P[3 * i + 1], P[3 * i + 2]) ? 0.07 : 1) : null;
  const tr0 = TS.t[iRev], tspan = Math.max(1e-6, t - tr0);
  if (iNow < i1) poly(P, iNow, i1, C['ink-2'], 1.05, 0.42, occl ? { af: occl } : {});
  if (iRev > i0) poly(P, i0, iRev, red, 1, 0.3, occl ? { af: occl } : {});
  if (iNow > iRev) poly(P, iRev, iNow, red, 2.2, 1, { af: i => (0.35 + 0.65 * (TS.t[i] - tr0) / tspan) * (occl ? occl(i) : 1) });
  const sc = rawS(t);
  seg3(pointAt(TS, iNow), sc, red, 2.2, 1);
  // 入轨点火的那一段弧
  if (g.id === 'arrival') {
    poly(P, idxAt(TS, T_BURN0), idxAt(TS, T_BURN1) + 1, gold, 4.2, 0.5);
    if (vr < 60) placeTag('burn', rawS(T('2004-07-01T02:00')), '入轨点火 96 分钟', 'zh gold', 10, 14);
  }
  // 本阶段的飞越：发生过的实心，尚未发生的空心；临近时标出名字
  for (const f of TF) {
    if (f.t < g.t0 || f.t > g.t1) continue;
    if (locked(f.mi) && Math.abs(t - f.t) < 0.5) continue;
    if (!f.pos) f.pos = rawS(f.t);
    const col = C[f.cls], o = dot2(f.pos, f.mi === TITAN ? 3.2 : 2.8, t >= f.t ? col : C.sheet, col, 1.3);
    if (o && Math.abs(t - f.t) < 1.2) placeTag('fl', f.pos, `${f.name} · ${altTxt(f)}`, f.cls, 9, -11);
  }
  dropLine(sc, red, 0);
  craftMark(sc, '卡西尼号');
  return sc;
}

/* ================= 读数 ================= */
function nearestMoon(sc, t) {
  let best = null;
  MOONS.forEach((m, i) => {
    if (i === PHOEBE && t > T('2004-07-15')) return;
    const p = moonKm(i, t), d = Math.hypot(sc[0] * US - p[0], sc[1] * US - p[1], sc[2] * US - p[2]) - m.R;
    if (!best || d < best.d) best = { i, d };
  });
  return best;
}
function readouts(g, t) {
  let rows, src = 'JPL Horizons · 卡西尼号最终重建轨道';
  if (g.frame === 'H') {
    const p = rawH(t).map(v => v * UH), dist = name => { const q = planetKm(name, t); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
    rows = [['距太阳', (Math.hypot(...p) / AU).toFixed(3) + ' AU'], ['日心速度', chordSpeed(TH, t, UH).toFixed(2) + ' km/s']];
    let near = null;
    for (const name of ['venus', 'earth', 'jupiter']) { const d = dist(name); if (d < (name === 'jupiter' ? 3e7 : 3e6) && (!near || d < near.d)) near = { name, d }; }
    if (near) rows.push(near.name === 'jupiter' ? ['距木星中心', fmtKm(near.d)] : [`距${ZH[near.name]}表面`, fmtInt(near.d - RADIUS[near.name]) + ' km']);
    const dE = dist('earth');
    if (!(near && near.name === 'earth')) rows.push(['距地球', dE > 0.05 * AU ? (dE / AU).toFixed(3) + ' AU' : fmtKm(dE)]);
    rows.push(['信号单程', fmtLight(dE / C_KMS)]);
  } else {
    const p = rawS(t), r = Math.hypot(...p) * US, n = revNo(t);
    rows = [['距土星中心', (r < 6e5 ? fmtInt(r) + ' km' : fmtKm(r)) + '<span class="rs"> · ' + (r / RS).toFixed(r < 10 * RS ? 2 : 1) + ' Rs</span>'],
            ['速度', chordSpeed(TS, t, US).toFixed(2) + ' km/s']];
    const nm = nearestMoon(p, t);
    if (nm && nm.d < (nm.i === TITAN ? 2e5 : 6e4)) rows.push([`距${MOONS[nm.i].zh}表面`, fmtInt(nm.d) + ' km']);
    if (r < 3 * RS) rows.push(['距云顶', fmtInt(r - RS) + ' km']);
    rows.push(['轨道', n > 0 ? `第 ${n} 圈 / 294` : '未入轨']);
    rows.push(['信号单程', fmtLight(earthDistKm(t) / C_KMS)]);
    if (g.id === 'huygens' && t > T_HY0) src = 'JPL Horizons · 卡西尼号 -82、惠更斯号 -150';
  }
  return { rows, src };
}
// 没有事件注记时，正在发生的飞越也说一句
function liveNote(g, t) {
  if (g.frame !== 'S') return null;
  const f = TF.find(f => Math.abs(t - f.t) < 0.4);
  return f ? { d: utc(f.t), x: `${f.title} · 距表面 ${altTxt(f)}，相对速度 ${f.v.toFixed(1)} km/s` } : null;
}

/* ================= 镜头锁定卫星 ================= */
function lockMoon(mi, t) {
  const m = MOONS[mi], fl = TF.filter(f => f.mi === mi);
  const near = fl.reduce((a, b) => Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a, fl[0]) || { alt: 5000, v: 6 };
  player.lockOn({
    id: mi, label: m.zh, pos: t => moonS(mi, t),
    // 播放时放慢，让剩下的接近过程总要走上几秒
    maxDps: (t, rate) => {
      const p = rawS(t), q = moonS(mi, t), dk = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) * US;
      const nf = fl.reduce((a, b) => Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a, { t: 1e9, v: 6 });
      return Math.min(0.25, clamp(dk / Math.max(nf.v, 1) / 86400 / 3, 2e-5, 1)) * rate;
    },
  }, { dist: clamp((m.R + near.alt) * 9 / US, m.R * 9 / US, 80), el: 20 });
}
const lockAt = mi => t => lockMoon(mi, t);
const JUMPS = {
  V1: { t: T_V1 - 1.1 }, V2: { t: T_V2 - 1.1 }, E: { t: T_E - 1.1 }, J: { t: T_J - 20 }, GR: { t: T_GR },
  PH: { t: PHO.t - 0.25, then: lockAt(PHOEBE) }, SOI: { t: T('2004-06-30T22:30') }, HY: { t: T_HYE - 0.5 },
  E2: { t: E2.t - 0.12, then: lockAt(ENCEL) }, IA: { t: IAP.t - 0.2, then: lockAt(IAPETUS) }, E5: { t: E5.t - 0.06, then: lockAt(ENCEL) }, EQ: { t: T('2009-08-11') },
  E21: { t: E21.t - 0.06, then: lockAt(ENCEL) }, SMILE: { t: T('2013-07-19T21:27') }, GF1: { t: GF1 - 0.35 }, END: { t: T_END - 0.06 },
};

/* ================= 日志里由数据算出的数值 ================= */
$('dV1').textContent = `1998-04-26 · ${fmtInt(pv1.d - RADIUS.venus)} km`;
$('dV2').textContent = `1999-06-24 · 623 km（本图 ${fmtInt(pv2.d - RADIUS.venus)} km）`;
$('dE').textContent = `1999-08-18 03:28 UT · 1,171 km（本图 ${fmtInt(pe.d - RADIUS.earth)} km）`;
$('dMas').textContent = `2000-01-23 · 约 160 万 km（本图 ${fmtKm(DATA.mas.d)}）`;
$('dJ').textContent = `${isoDate(T_J)} · 距木星中心 ${fmtKm(pj.d)}`;
$('dPh').textContent = `2004-06-11 · 2,068 km（本图 ${fmtInt(PHO.alt)} km）`;
$('dSOIX').textContent = `${utc(DATA.soiX[0][0]).slice(11)} · 距土星中心 ${fmtKm(DATA.soiX[0][1])}`;
const rg = REVS.filter(r => r.t > T('2016-12-01') && r.t < T('2017-04-22')).map(r => r.r);
$('dRG').textContent = `距土星中心 ${fmtKm(Math.min(...rg))}—${fmtKm(Math.max(...rg))}`;
const gfR = DATA.gfX.map(x => x[1]);
$('dGF').textContent = `距云顶 ${fmtInt(Math.min(...gfR) - RS)}—${fmtInt(Math.max(...gfR) - RS)} km`;

/* ================= 启动 ================= */
// 点图表或卫星卡片：跳到那个时刻，并把三维图滚回视野
const goto = (t, mi) => { player.jumpT(t, mi === undefined ? null : lockAt(mi)); player.reveal(); };
const profile = mountProfile({ clock, REVS, TF, SEG, RS, T_END, tStart: T('2004-06-01'), onPick: t => goto(t - 0.15) });
const player = createPlayer({
  clock, segments: SEG, events: EVENTS, marks: MARKS, focus: FOCUS, jumps: JUMPS,
  playMs: 150000, startT: T('2004-06-30T21:00'),
  frames: {
    H: { ...HELIO_FRAME, minDist: 0.0015, maxDist: 400, render: renderH },
    S: { en: 'SATURN RING PLANE', zh: '土星环平面坐标系', sub: '土星位于中心，网格为环平面，坐标轴不随时间转动', unit: US, minDist: 0.03, maxDist: 5000, render: renderS },
  },
  readouts, liveNote,
  timeShown: t => TF.some(f => Math.abs(t - f.t) < 0.3) || (t > T_HYE - 1 && t < T_LAND + 0.5),
  onTime: t => profile.setNow(t),
});
mountMoons({ MOONS, TF, order: [TITAN, ENCEL, IAPETUS, 4, 3, 2, 0, 6, PHOEBE], isoDate, altTxt, onPick: (f, mi) => goto(f.t - (mi === TITAN ? 0.08 : 0.04), mi) });
mountCraft($('craft'), $('craftLabels'));
window.__mission = Object.assign(player, { lockMoon, debug: { moonS, rawS, rawH, planetH, TF, REVS } });
