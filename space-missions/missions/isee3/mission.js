// ISEE-3 / ICE：数据、阶段、事件、机位，以及两个坐标系各自怎么画。
// 时间 t 为距 1978-01-01 00:00 UT 的天数。
//   E  日地旋转坐标系：1 单位 = 10 万 km，x 轴背向太阳，y 轴沿地球公转方向，z 轴指向黄道北
//   H  日心黄道坐标系：1 单位 = 0.1 AU（全站统一）

import { TAU, DEG, clamp, smooth, makeClock, fmtInt, fmtKm, fmtLight, flat } from '../../shared/util.js';
import { unpackRows, idxAt, interp, speedAt, pointAt } from '../../shared/track.js';
import { AU, C_KMS, RADIUS, moonGeoKm, sunLon, earthHelioAU, cometAU, orbitCurveAU } from '../../shared/astro.js';
import { C, cam, ctx, gAlpha, poly, seg3, arrow, grid, body, sun, equinoxArrow, dot2, craftMark, dropLine, placeTag, lerpCam } from '../../shared/scene.js';
import { mountPlot, loadData, createPlayer, HELIO_FRAME, UH } from '../../shared/player.js';
import { mountCrumbs } from '../../shared/chrome.js';
import { mountCraft } from './craft.js';

const clock = makeClock(Date.UTC(1978, 0, 1), 2443509.5);
const { T, utc, jd } = clock;

mountCrumbs();
mountPlot({ tokens: ['green'] });
const [MODEL, TRACK] = await loadData([new URL('./data/model.json', import.meta.url), new URL('./data/track.json', import.meta.url)]);

/* ================= 地月段（E）=================
   由 NSSDC 的 GSE 位置（1978—83）在日地月引力模型里重建；2014 年取自 JPL Horizons。
   TRACK.E / R 每行 [t, x, y, z, 速度 km/s]，TRACK.H 每行 [t, x, y, z]。 */
const UE = 1e5;
const TE = unpackRows(TRACK.E, 5), TR = unpackRows(TRACK.R, 5), TH = unpackRows(TRACK.H, 4);
const LS = TRACK.LS, PER = TRACK.PER;                      // 月球借力时刻；近地点 [t, km]
const T_ESC = LS[4], T_ENC = TRACK.TGZ, T_HA = TRACK.THA, T_FLY14 = TRACK.T14;
const L1X = -14.92, L2X = 15.03, RM = 3.844;
const EARTH_R = 6378.1 / UE, MOON_R = RADIUS.moon / UE;
const rawE = t => interp(TE, t);
// 月球在旋转坐标系里的位置
const moon = t => { const m = moonGeoKm(jd(t)), l = sunLon(jd(t)), c = Math.cos(l), s = Math.sin(l); return [-(m[0] * c + m[1] * s) / UE, (m[0] * s - m[1] * c) / UE, m[2] / UE]; };
const lsPts = LS.map(rawE);
const circleXY = (R, n) => flat(Array.from({ length: n + 1 }, (_, i) => [R * Math.cos(i / n * TAU), R * Math.sin(i / n * TAU), 0]));
const moonOrbit = circleXY(RM, 160);

/* ================= 日心段（H）=================
   ICE：重建的日心轨迹（1983—87 来自 NSSDC，1987—2014 为 JPL 轨道解的反推）。
   彗星：JPL 在相遇时刻的密切根数（21P 取 1985 年、1P 取 1986 年），当日黄道。 */
const h10 = p => [p[0] * 10, p[1] * 10, p[2] * 10];
const earthH = t => h10(earthHelioAU(jd(t)));
const cometH = (t, el) => h10(cometAU(t, el));
const iceH = t => interp(TH, t);
const GZ = MODEL.comets.GZ, HA = MODEL.comets.HA;
const gzOrbit = flat(orbitCurveAU(GZ, 178, 0.75).map(h10));
const haOrbit = flat(orbitCurveAU(HA, 142, 0.5).map(h10));
const earthOrbit = flat(Array.from({ length: 184 }, (_, i) => earthH(T('1985-01-01') + i * 2)));
const encPt = iceH(T_ENC);

/* ================= 阶段 =================
   w 是在时间轴上占的宽度；show 是点“在图上看这一段”时跳到的时刻；cam(t) 是这一阶段的机位。 */
const SEG = [
  { id: 'launch', name: '发射与转移', short: '转移', yr: '1978', t0: T('1978-08-12T15:12'), t1: T('1978-11-20'), w: 8, frame: 'E',
    show: T('1978-11-19T12:00'), cam: () => ({ tx: -7.5, ty: -2.2, tz: 0, dist: 33, az: -100, el: 40 }) },
  { id: 'halo', name: '第一条晕轨道', short: '晕轨道', yr: '1978–82', t0: T('1978-11-20'), t1: T('1982-06-10'), w: 15, frame: 'E',
    show: T('1982-06-01'), cam: () => ({ tx: -14.2, ty: 0, tz: 0, dist: 22, az: -40, el: 30 }) },
  { id: 'tail', name: '穿行地球磁尾', short: '磁尾', yr: '1982–83', t0: T('1982-06-10'), t1: T('1983-12-15'), w: 25, frame: 'E',
    show: T('1983-12-14'), cam: () => ({ tx: -1, ty: 0.3, tz: 0, dist: 42, az: -92, el: 60 }) },
  { id: 'escape', name: '最后一次借力', short: '借月', yr: '1983.12', t0: T('1983-12-15'), t1: T('1984-01-25'), w: 8, frame: 'E',
    show: LS[4] + 0.06, cam: t => {
      const m = moon(Math.min(t, LS[4] + 0.3));
      const near = { tx: m[0], ty: m[1], tz: m[2], dist: 1.8, az: -58, el: 24 };
      const mid = { tx: m[0] * 0.75, ty: m[1] * 0.75, tz: 0, dist: 11, az: -80, el: 38 };
      const far = { tx: -22, ty: 10, tz: 0, dist: 72, az: -92, el: 56 };
      return lerpCam(lerpCam(mid, near, smooth(LS[4] - 8, LS[4] - 0.5, t)), far, smooth(LS[4] + 0.5, LS[4] + 16, t));
    } },
  { id: 'gz', name: '第一次飞越彗星', short: 'G–Z', yr: '1984–85', t0: T('1984-01-25'), t1: T('1985-10-01'), w: 12, frame: 'H',
    show: T_ENC, cam: () => ({ tx: 3.5, ty: 1, tz: 0, dist: 35, az: -68, el: 46 }) },
  { id: 'halley', name: '哈雷舰队', short: '哈雷', yr: '1985–86', t0: T('1985-10-01'), t1: T('1986-05-01'), w: 7, frame: 'H',
    show: T_HA, cam: () => ({ tx: -4.5, ty: -3.5, tz: 0, dist: 34, az: -64, el: 50 }) },
  { id: 'drift', name: '绕太阳三十年', short: '漂流', yr: '1986–2014', t0: T('1986-05-01'), t1: T('2014-06-24'), w: 12, frame: 'H',
    show: T('2008-09-18'), cam: () => ({ tx: 0, ty: 0, tz: 0, dist: 40, az: -90, el: 66 }) },
  { id: 'return', name: '一次民间重启', short: '重返', yr: '2014', t0: T('2014-06-24'), t1: T('2014-09-16'), w: 13, frame: 'E',
    show: T_FLY14 - 0.02, cam: t => {
      const wide = { tx: -34, ty: -20, tz: 0, dist: 120, az: -105, el: 48 };
      const near = { tx: 1.5, ty: -0.8, tz: 0, dist: 15, az: -120, el: 26 };
      const out = { tx: 26, ty: 2, tz: 6, dist: 100, az: -100, el: 22 };
      return lerpCam(lerpCam(wide, near, smooth(T('2014-07-12'), T_FLY14 - 1.2, t)), out, smooth(T_FLY14 + 1, T('2014-09-08'), t));
    } },
];

/* ================= 事件 =================
   t 注记出现的时刻，win 注记停留多久（天），at 事件按钮跳到的时刻（默认同 t）；key 为重要事件（刻度更高）。 */
const wan = km => fmtKm(km, 1e4);
const reR = km => Math.round(km / 6371) + ' 个地球半径';
const T_EARTH14 = T('2014-08-09T03:01');
const EVENTS = [
  { t: T('1978-08-12T15:12'), win: 9, d: '1978-08-12 15:12 UT', x: '发射 · Thor-Delta 2914 · 卡纳维拉尔角 17B', key: 1 },
  { t: T('1978-11-20'), win: 45, d: '1978-11-20', x: '进入 L1 晕轨道，这是航天器第一次飞上晕轨道', key: 1 },
  { t: T('1982-06-10'), win: 28, d: '1982-06-10', x: '点火离开晕轨道，转向地球背面', key: 1 },
  { t: PER[0][0] - 3, at: PER[0][0], win: 9, d: utc(PER[0][0]), x: `从约 ${reR(PER[0][1])}处掠过地球，进入磁尾` },
  { t: PER[1][0] - 1.5, at: PER[1][0], win: 5, d: utc(PER[1][0]), x: `再次贴近地球，近地点约 ${reR(PER[1][1])}` },
  { t: T('1983-02-05'), at: T('1983-02-08T16:00'), win: 18, d: '1983-02-08', x: '第一次深入远磁尾，到达 L2 附近，约 222 个地球半径' },
  ...LS.slice(0, 4).map((t, i) => ({ t: t - 0.7, at: t, win: 1.9, d: utc(t), x: `第 ${i + 1} 次月球借力 · 距月面约 ${wan(TRACK.LSalt[i])}` })),
  { t: T('1983-06-26'), at: T('1983-06-30T11:30'), win: 12, d: '1983-06-30', x: '磁尾最远处：237 个地球半径，约 151 万 km' },
  { t: LS[4] - 1.2, at: LS[4], win: 1.6, d: utc(LS[4]), x: `第 5 次月球借力：距月面 ${Math.round(TRACK.LSalt[4])} km（史料 119.4 km），相对月球 ${TRACK.LSv[4].toFixed(1)} km/s，被甩出地月系统`, key: 1 },
  { t: LS[4] + 3.5, win: 40, d: '1983 年 12 月', x: '更名为国际彗星探测器 ICE' },
  { t: T_ENC, win: 45, d: utc(T_ENC), x: '穿过 G–Z 彗尾，距彗核 7,862 km', key: 1 },
  { t: T_HA - 7, at: T_HA, win: 30, d: utc(T_HA).slice(0, 10), x: `从太阳与哈雷彗星之间穿过，最近约 ${fmtInt(Math.round(TRACK.DHA / 1e5) * 10)} 万 km`, key: 1 },
  { t: T('1997-05-05'), win: 1100, d: '1997-05-05', x: 'NASA 停止运行，发射机只留载波' },
  { t: T('2008-09-18'), win: 1200, d: '2008-09-18', x: '深空网重新找到 ICE，13 台仪器 12 台仍在工作' },
  { t: T('2014-05-29'), win: 26, d: '2014-05-29', x: '借阿雷西博射电望远镜恢复双向通信', key: 1 },
  { t: T('2014-07-02'), win: 5.5, d: '2014-07-02', x: '推进器 27 年来第一次点火' },
  { t: T('2014-07-08'), win: 22, d: '2014-07-08', x: '长时间点火失败：只得到约 0.15 m/s' },
  { t: T('2014-08-08T12:00'), at: T_EARTH14, win: 1.2, d: '2014-08-09 03:01 UT', x: '掠过地球，距地心约 18.5 万 km' },
  { t: T_FLY14 - 0.7, at: T_FLY14, win: 4, d: utc(T_FLY14), x: `飞越月球，距月心约 ${wan(TRACK.D14)}（JPL 事后解算）`, key: 1 },
  { t: T_FLY14 + 5, win: 30, d: '2014 年 8—9 月', x: '月球引力把它甩向黄道面北侧，离开地月空间' },
  { t: T('2014-09-14'), win: 3, d: '2014-09-16', x: '最后一次收到信号', key: 1 },
];
// 时间轴上排的细刻度：每一次飞越月球
const MARKS = [
  ...LS.map((t, i) => ({ t, color: 'blue', d: utc(t), x: `第 ${i + 1} 次月球借力 · 距月面 ${i < 4 ? wan(TRACK.LSalt[i]) : Math.round(TRACK.LSalt[i]) + ' km'}` })),
  { t: T_FLY14, color: 'blue', d: utc(T_FLY14), x: `2014 年飞越月球 · 距月心 ${wan(TRACK.D14)}` },
];
// 播放到月球借力附近时放慢：[时刻, 宽度（天）, 1× 时每秒最多走几天]
const FOCUS = [...LS.slice(0, 4).map(t => [t, 0.5, 1.2]), [LS[4], 0.3, 0.35], [T_FLY14, 0.4, 0.6]];
const TIMEPTS = [...LS, ...PER.map(p => p[0]), T_EARTH14, T_FLY14];
const JUMPS = {
  LS1: { t: LS[0] - 0.5 }, FAR: { t: T('1983-06-30T11:30') }, EARTH14: { t: T_EARTH14 },
};

/* ================= 画：日地旋转坐标系 ================= */
const tailR = x => 1.7 * Math.sqrt(clamp((x + 0.35) / 3, 0, 1));
function renderE(g, t) {
  const ret = g.id === 'return', blue = C.blue, ink = C.ink, red = C.pen, ghost = C['ink-2'];
  grid({ fine: 16 });
  // 磁尾：太阳风把地球磁场向背阳一侧拉成一条长尾
  for (let k = 0; k < 6; k++) {
    const a = k / 6 * TAU, pts = [];
    for (let x = -0.35; x <= 18; x += 0.35) pts.push([x, tailR(x) * Math.cos(a), tailR(x) * Math.sin(a)]);
    poly(flat(pts), 0, pts.length - 1, blue, 1, 0.22, { af: i => 1 - i / pts.length * 0.7 });
  }
  for (const x of [0.6, 2, 4.5, 8, 12, 16]) {
    const pts = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * TAU; pts.push([x, tailR(x) * Math.cos(a), tailR(x) * Math.sin(a)]); }
    poly(flat(pts), 0, 48, blue, 1, 0.26 * (1 - x / 26));
  }
  placeTag('magtail', [10.5, 0, 1.95], '地球磁尾', 'zh blue', 0, -8);
  poly(moonOrbit, 0, 160, blue, 1.1, 0.75, { dash: [5, 5] });
  // 太阳方向
  arrow([-20, 0, 0], [-23.5, 0, 0], C.gold, 1.6, 0.9);
  placeTag('sundir', ret ? [-22.2, 0, 0] : [-23.6, 0, 0], '太阳方向 · 1.5 亿 km 外', 'zh gold', ret ? -14 : -6, ret ? -16 : -12);
  // L1、L2
  for (const [x, name] of [[L1X, 'L1'], [L2X, 'L2']]) {
    seg3([x - 0.55, 0, 0], [x + 0.55, 0, 0], ink, 1.2, 0.85);
    seg3([x, -0.55, 0], [x, 0.55, 0], ink, 1.2, 0.85);
    seg3([x, 0, -0.55], [x, 0, 0.55], ink, 1.2, 0.85);
    placeTag(name, [x, 0, 0], name, '', 8, 12);
  }
  // 先画天体，再画轨迹，轨迹经过天体前方时不被盖住
  const sunDir = [-1, 0, 0], m = moon(t);
  const eb = body([0, 0, 0], EARTH_R, sunDir, C.sheet, blue, 5);
  const mb = body(m, MOON_R, sunDir, C.sheet, ink, 3.5);
  placeTag('earth', [0, 0, 0], '地球', 'zh', (eb ? eb.r : 4) * 0.8 + 6, (eb ? eb.r : 4) * 0.8 + 6);
  if (!(eb && mb && Math.hypot(eb.x - mb.x, eb.y - mb.y) < 60)) placeTag('moon', m, '月球', 'zh faint', -((mb ? mb.r : 3) * 0.6 + 3), (mb ? mb.r : 3) + 13);
  // 轨迹：飞过的用笔色，没飞到的用灰色
  const tr = ret ? TR : TE, iNow = idxAt(tr, t), sc = interp(tr, t);
  if (ret) poly(TE.p, 0, TE.n - 1, ghost, 1, 0.16);                   // 三十年前留下的旧轨迹
  if (iNow < tr.n - 1) poly(tr.p, iNow, tr.n - 1, ghost, ret ? 1.2 : 1.1, ret ? 0.5 : 0.42);
  if (iNow > 0) poly(tr.p, 0, iNow, red, ret ? 2.4 : 2.2, 1);
  seg3(pointAt(tr, iNow), sc, red, ret ? 2.4 : 2.2, 1);
  // 月球借力的编号：轨迹上的小圆环，数字写在旁边
  if (g.id === 'tail' || g.id === 'escape') {
    ctx.textAlign = 'center';
    LS.forEach((tl, i) => {
      if (Math.abs(t - tl) < 0.6 && cam.dist < 8) return;   // 借力的特写里，月球本身就是标记
      const o = dot2(lsPts[i], 4.5, null, blue, 1.4);
      if (!o) return;
      ctx.globalAlpha = (t >= tl ? 1 : 0.55) * gAlpha; ctx.fillStyle = blue;
      ctx.beginPath(); ctx.arc(o.x, o.y, 1.6, 0, TAU); ctx.fill();
      ctx.fillStyle = ink; ctx.fillText(String(i + 1), o.x + 9, o.y - 8);
    });
  }
  dropLine(sc, red);
  craftMark(sc, (ret || t > LS[4] + 3) ? 'ICE' : 'ISEE-3');
  return sc;
}

/* ================= 画：日心黄道坐标系 ================= */
function renderH(g, t) {
  const red = C.pen, green = C.green, gold = C.gold;
  grid({ polar: true });
  equinoxArrow();
  poly(earthOrbit, 0, earthOrbit.length / 3 - 1, C.blue, 1.1, 0.7);
  // ICE 未来一年的路径（虚线），直接读自重建的轨迹
  const iNow = idxAt(TH, t), iAhead = idxAt(TH, t + 356);
  if (iAhead > iNow) poly(TH.p, iNow, iAhead, C['ink-2'], 1.1, 0.7, { dash: [4, 4] });
  // 两颗彗星的轨道：当前阶段的主角画得更实
  const gzStrong = g.id === 'gz' ? 1 : 0.35, haStrong = g.id === 'halley' ? 1 : g.id === 'gz' ? 0.45 : 0.3;
  const rAf = (P, R1, R2) => i => 1 - smooth(R1, R2, Math.hypot(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]));
  poly(gzOrbit, 0, gzOrbit.length / 3 - 1, green, 1.3, 0.85 * gzStrong, { af: rAf(gzOrbit, 16, 34) });
  poly(haOrbit, 0, haOrbit.length / 3 - 1, gold, 1.3, 0.85 * haStrong, { af: rAf(haOrbit, 16, 34) });
  // 与 G–Z 的相遇点
  if (t >= T_ENC - 200) {
    const o = dot2(encPt, 6, null, green, 1.4);
    if (o && t >= T_ENC) { ctx.strokeStyle = green; ctx.lineWidth = 1.4; ctx.globalAlpha = gAlpha; ctx.beginPath(); ctx.moveTo(o.x - 4, o.y - 4); ctx.lineTo(o.x + 4, o.y + 4); ctx.moveTo(o.x + 4, o.y - 4); ctx.lineTo(o.x - 4, o.y + 4); ctx.stroke(); }
    if (g.id !== 'drift') placeTag('enc', encPt, t >= T_ENC ? '相遇点 · 1985-09-11' : '相遇点', 'green', 10, 18);
  }
  // 彗星：彗核加一条背向太阳的彗尾，离太阳越近越长
  const comet = (el, col, id, name, cls, strong) => {
    const p = cometH(t, el), r = Math.hypot(...p);
    if (r > 32) return;
    const dir = p.map(v => v / r), L = clamp(14 / (r * r) * 10, 0.4, 5), side = [-dir[1], dir[0], 0];
    for (const [k, a] of [[0, 0.9], [0.09, 0.45], [-0.09, 0.45]]) {
      const pts = [];
      for (let i = 0; i <= 10; i++) { const s = i / 10 * L; pts.push([p[0] + dir[0] * s + side[0] * k * s, p[1] + dir[1] * s + side[1] * k * s, p[2] + dir[2] * s]); }
      poly(flat(pts), 0, 10, col, 1.3, a * strong, { af: i => 1 - i / 11 });
    }
    dropLine(p, col);
    dot2(p, 3.2, col, null);
    placeTag(id, p, name, 'zh ' + cls, 9, -15);
  };
  comet(GZ, green, 'gz', 'Giacobini–Zinner 彗星', 'green', gzStrong);
  comet(HA, gold, 'ha', '哈雷彗星', 'gold', haStrong);
  sun([0, 0, 0], RADIUS.sun / UH, 7);
  const E = earthH(t), eL = Math.hypot(...E);
  body(E, RADIUS.earth / UH, E.map(v => -v / eL), C.sheet, C.blue, 4.5);
  placeTag('earthH', E, '地球', 'zh blue', 9, 12);
  // ICE：近 11 个月的尾迹，以及它在黄经上领先地球的那段弧
  const I = iceH(t);
  if (g.id === 'drift' || g.id === 'gz' || g.id === 'halley') {
    const lonE = Math.atan2(E[1], E[0]), lonI = Math.atan2(I[1], I[0]);
    let lead = ((lonI - lonE) % TAU + TAU) % TAU; if (lead > Math.PI) lead -= TAU;
    const pts = []; for (let i = 0; i <= 64; i++) { const a = lonE + lead * i / 64; pts.push([10.55 * Math.cos(a), 10.55 * Math.sin(a), 0]); }
    poly(flat(pts), 0, 64, red, 1, 0.38, { dash: [1.5, 3.5] });
  }
  const iBack = idxAt(TH, Math.max(T_ESC, t - 330));
  if (iNow > iBack) { const span = iNow - iBack; poly(TH.p, iBack, iNow, red, 2.2, 1, { af: i => 0.15 + 0.85 * (i - iBack) / span }); }
  seg3(pointAt(TH, iNow), I, red, 2.2, 1);
  if (g.id === 'halley') {
    const h = cometH(t, HA);
    if (Math.hypot(I[0] - h[0], I[1] - h[1], I[2] - h[2]) < 6) seg3(I, h, gold, 1.1, 0.8, [3, 3]);
  }
  dropLine(I, red);
  craftMark(I, 'ICE', true);
  return I;
}

/* ================= 读数 ================= */
function readouts(g, t) {
  let rows;
  if (g.frame === 'E') {
    const tr = g.id === 'return' ? TR : TE, p = interp(tr, t), m = moon(t);
    const dE = Math.hypot(...p) * UE, dM = Math.hypot(p[0] - m[0], p[1] - m[1], p[2] - m[2]) * UE, v = speedAt(tr, t);
    rows = [['距地球', fmtKm(dE)],
            dM < 6e4 ? ['距月面', fmtInt(dM - RADIUS.moon) + ' km'] : ['距月球', dM < 1.2e6 ? fmtKm(dM) : '—'],
            ['速度', v.toFixed(v < 1 ? 3 : 2) + ' km/s'],
            ['地球半径', (dE / 6371).toFixed(dE < 64e4 ? 1 : 0) + ' R⊕'],
            ['信号单程', fmtLight(dE / C_KMS)]];
  } else {
    const I = iceH(t), E = earthH(t), r = Math.hypot(...I) / 10, d = Math.hypot(I[0] - E[0], I[1] - E[1], I[2] - E[2]) / 10;
    const lead = ((Math.atan2(I[1], I[0]) - Math.atan2(E[1], E[0])) / DEG % 360 + 360) % 360;
    rows = [['距太阳', r.toFixed(3) + ' AU'], ['距地球', d.toFixed(3) + ' AU'],
            ['相对地球', lead <= 180 ? '领先 ' + lead.toFixed(1) + '°' : '落后 ' + (360 - lead).toFixed(1) + '°']];
    if (g.id === 'halley' || (g.id === 'gz' && t > T_ENC)) {
      const h = cometH(t, HA), dh = Math.hypot(I[0] - h[0], I[1] - h[1], I[2] - h[2]) / 10;
      if (dh < 1.2) rows.push(['距哈雷', dh.toFixed(3) + ' AU']);
    }
    rows.push(['信号单程', fmtLight(d * AU / C_KMS)]);
  }
  const src = t < T('1987-02-07') ? (g.id === 'return' ? 'JPL Horizons 轨道解' : 'NSSDC 星历 · 动力学拟合') : t < T('2014-01-01') ? 'JPL 2014 轨道解反推' : 'JPL Horizons 轨道解';
  return { rows, src };
}

/* ================= 启动 ================= */
const player = createPlayer({
  clock, segments: SEG, events: EVENTS, marks: MARKS, focus: FOCUS, jumps: JUMPS,
  playMs: 108000, startT: T('1983-12-14'),
  frames: {
    E: { en: 'SUN–EARTH ROTATING', zh: '日地旋转坐标系', sub: '太阳固定在左侧，地球位于中心', unit: UE, minDist: 0.15, maxDist: 260, render: renderE },
    H: { ...HELIO_FRAME, minDist: 0.4, maxDist: 260, render: renderH },
  },
  readouts,
  timeShown: (t, g) => TIMEPTS.some(tf => Math.abs(t - tf) < 1) || g.id === 'escape' || (g.id === 'return' && Math.abs(t - T_FLY14) < 3),
});
mountCraft(document.getElementById('craft'));
window.__mission = player;
