// 模板任务（虚构）：一艘探测器沿霍曼转移轨道从地球飞到火星。
// 这是引擎约定的最小可运行示例：复制整个文件夹，把这里的解析轨道换成 recon/ 产出的真实数据。
// 各配置项的含义见 ../../GUIDE.md「任务脚本」。

import { makeClock, fmtKm, fmtLight, flat } from '../../shared/util.js';
import { idxAt, interp, pointAt } from '../../shared/track.js';
import { AU, C_KMS, KGAUSS, RADIUS, ZH, PLANET_PERIOD, kepE, trueAnom, wrapPI, planetHelioKm } from '../../shared/astro.js';
import { C, poly, seg3, grid, body, sun, equinoxArrow, dot2, craftMark, dropLine, placeTag, at, closeUp } from '../../shared/scene.js';
import { mountPlot, createPlayer, HELIO_FRAME, UH } from '../../shared/player.js';
import { mountCrumbs } from '../../shared/chrome.js';

// 1. 时钟：选一个历元，页面里的 t 都是距它的天数（UT）
const clock = makeClock(Date.UTC(2026, 0, 1), 2461041.5);
const { isoDate, jd } = clock;   // 真实任务还会用到 T('2004-07-01T02:37')：日期字符串 → t

// 2. 页面外框。真实任务在这里接着 await loadData([...]) 读 data/ 里的 JSON
mountCrumbs();
mountPlot();

/* 3. 轨迹：{ t, p, n }，单位是该坐标系的场景单位（日心系 1 单位 = 0.1 AU）。
      这里先找一个发射窗口（到达时火星正好在远日点方向），再沿转移椭圆取点。 */
const planetH = (name, t) => planetHelioKm(name, jd(t)).map(v => v / UH);
const lon = p => Math.atan2(p[1], p[0]), rxy = p => Math.hypot(p[0], p[1]) / 10;   // AU
const halfPeriod = (rD, rA) => Math.PI * Math.pow((rD + rA) / 2, 1.5) / KGAUSS;
const miss = tA => { const m = planetH('mars', tA), tD = tA - halfPeriod(1, rxy(m)); return wrapPI(lon(planetH('earth', tD)) - lon(m) + Math.PI); };
let lo = 200; while (lo < 1500 && !(miss(lo) <= 0 && miss(lo + 1) > 0 && Math.abs(miss(lo)) < 1)) lo++;   // 地球跑得比火星快，差角由负变正处即窗口
let hi = lo + 1; for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (miss(mid) <= 0) lo = mid; else hi = mid; }
const T_ARR = lo, MARS_ARR = planetH('mars', T_ARR), T_DEP = T_ARR - halfPeriod(1, rxy(MARS_ARR));
const EARTH_DEP = planetH('earth', T_DEP), rD = rxy(EARTH_DEP), rA = rxy(MARS_ARR), sma = (rD + rA) / 2, ecc = (rA - rD) / (rA + rD);
const TRACK = (() => {
  const n = 400, t = new Float64Array(n), p = new Float64Array(n * 3), lonP = lon(MARS_ARR) - Math.PI;
  for (let i = 0; i < n; i++) {
    t[i] = T_DEP + (T_ARR - T_DEP) * i / (n - 1);
    const E = kepE(KGAUSS / Math.pow(sma, 1.5) * (t[i] - T_DEP), ecc), r = sma * (1 - ecc * Math.cos(E)) * 10, nu = trueAnom(E, ecc);
    p.set([r * Math.cos(lonP + nu), r * Math.sin(lonP + nu), MARS_ARR[2] * (1 - Math.cos(nu)) / 2], 3 * i);
  }
  return { t, p, n };
})();
const ORBITS = Object.fromEntries(['earth', 'mars'].map(name => [name, flat(Array.from({ length: 181 }, (_, i) => planetH(name, T_DEP + i / 180 * PLANET_PERIOD[name])))]));

/* 4. 阶段：id 与 HTML 里 .ch 的 data-seg 对应；w 是时间轴上的宽度，show 是“在图上看这一段”跳到的时刻，cam(t) 是机位 */
const WIDE = { tx: 1, ty: 0, tz: 0, dist: 52, az: -95, el: 58 };
const SEG = [
  { id: 'cruise', name: '地火转移', short: '转移', yr: isoDate(T_DEP).slice(0, 4), t0: T_DEP, t1: T_ARR - 20, w: 3, frame: 'H', show: T_DEP + 90, cam: () => WIDE },
  { id: 'arrival', name: '到达火星', short: '到达', yr: isoDate(T_ARR).slice(0, 4), t0: T_ARR - 20, t1: T_ARR, w: 2, frame: 'H', show: T_ARR - 3,
    cam: t => closeUp(WIDE, t, [{ t: T_ARR, a: 18, b: 1.5, cam: t => at(planetH('mars', t), { dist: 0.6, az: -60, el: 28 }) }]) },
];

/* 5. 事件：t 注记出现的时刻，win 停留天数，at 跳转时刻（默认同 t），d 日期文字，x 说明，key 重要事件 */
const EVENTS = [
  { t: T_DEP, win: 12, d: isoDate(T_DEP), x: '离开地球，进入转移轨道', key: 1 },
  { t: (T_DEP + T_ARR) / 2, win: 12, d: isoDate((T_DEP + T_ARR) / 2), x: '中途修正' },
  { t: T_ARR - 1, at: T_ARR, win: 1, d: isoDate(T_ARR), x: '到达火星', key: 1 },
];

/* 6. 每个坐标系怎么画：render(g, t) 画完后返回探测器的位置（“跟随”按钮要用） */
function renderH(g, t) {
  grid({ polar: true });
  equinoxArrow();
  for (const [name, col] of [['earth', C.blue], ['mars', C.gold]]) {
    poly(ORBITS[name], 0, 180, col, 1.1, 0.7);
    const p = planetH(name, t), l = Math.hypot(...p), b = body(p, RADIUS[name] / UH, p.map(v => -v / l), C.sheet, col, 4);
    placeTag(name, p, ZH[name], 'zh ' + (name === 'earth' ? 'blue' : 'gold'), (b ? b.r : 4) + 6, 12);
  }
  sun([0, 0, 0], RADIUS.sun / UH);
  const iNow = idxAt(TRACK, t), sc = interp(TRACK, t);
  poly(TRACK.p, iNow, TRACK.n - 1, C['ink-2'], 1.1, 0.5);     // 还没飞到的部分
  poly(TRACK.p, 0, iNow, C.pen, 2.2, 1);                      // 已经飞过的路径
  seg3(pointAt(TRACK, iNow), sc, C.pen, 2.2, 1);
  dot2(pointAt(TRACK, 0), 4, C.blue, null);
  dropLine(sc, C.pen);
  craftMark(sc, '探测器');
  return sc;
}

/* 7. 左下角的读数：rows 是 [名称, 数值] 的列表（窄屏只显示前两三行，重要的放前面），src 是数据来源 */
function readouts(g, t) {
  const sc = interp(TRACK, t), dist = name => { const p = planetH(name, t); return Math.hypot(sc[0] - p[0], sc[1] - p[1], sc[2] - p[2]) * UH; };
  const dE = dist('earth'), dM = dist('mars');
  return { rows: [['距太阳', (Math.hypot(...sc) / 10).toFixed(3) + ' AU'], ['距火星', dM > 0.05 * AU ? (dM / AU).toFixed(3) + ' AU' : fmtKm(dM)],
                  ['距地球', dE > 0.05 * AU ? (dE / AU).toFixed(3) + ' AU' : fmtKm(dE)], ['信号单程', fmtLight(dE / C_KMS)]], src: '示例数据 · 解析的霍曼转移轨道' };
}

// 8. 启动
window.__mission = createPlayer({
  clock, segments: SEG, events: EVENTS, playMs: 40000, startT: T_DEP + 90,
  focus: [[T_ARR, 2, 0.8]],                                   // 到达前后放慢：[时刻, 宽度（天）, 1× 时每秒最多走几天]
  frames: { H: { ...HELIO_FRAME, minDist: 0.01, maxDist: 300, render: renderH } },
  readouts,
});
