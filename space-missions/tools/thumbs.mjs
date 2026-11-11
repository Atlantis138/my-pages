// 生成图集首页卡片上的轨迹缩略图：missions/<id>/thumb.svg。
// 用法（在 space-missions/ 目录下）：node tools/thumbs.mjs
// 轨迹数据变了、或新增任务时重跑一次。新任务在下面的 THUMBS 里加一项：读哪份数据、从哪个角度看、还画些什么。
// 颜色一律写成主题令牌（var(--pen) 等），首页把 SVG 内联进卡片后会跟随该任务的主题和深浅色。

import { readFileSync, writeFileSync } from 'node:fs';
globalThis.matchMedia = () => ({ matches: false });          // shared/util.js 在浏览器里会查询减弱动效的偏好
const { unpackRows, unpackDelta } = await import('../shared/track.js');

const ROOT = new URL('../missions/', import.meta.url);
const load = p => JSON.parse(readFileSync(new URL(p, ROOT)));
const W = 480, H = 300, PAD = 14, DEG = Math.PI / 180;

// 正交投影：从方位角 az、仰角 el（度）看向原点
function view(az, el) {
  const a = az * DEG, e = el * DEG, f = [-Math.cos(e) * Math.cos(a), -Math.cos(e) * Math.sin(a), -Math.sin(e)];
  const r = [f[1], -f[0], 0], rl = Math.hypot(r[0], r[1]), R = [r[0] / rl, r[1] / rl, 0];
  const U = [R[1] * f[2] - R[2] * f[1], R[2] * f[0] - R[0] * f[2], R[0] * f[1] - R[1] * f[0]];
  return p => [p[0] * R[0] + p[1] * R[1] + p[2] * R[2], -(p[0] * U[0] + p[1] * U[1] + p[2] * U[2])];
}
// Douglas–Peucker 抽稀（屏幕坐标，容差为像素）
function simplify(pts, tol) {
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); let md = 0, mi = -1;
    const ax = pts[a][0], ay = pts[a][1], dx = pts[b][0] - ax, dy = pts[b][1] - ay, L = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) {
      const d = L < 1e-6 ? Math.hypot(pts[i][0] - ax, pts[i][1] - ay) : Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / L;
      if (d > md) { md = d; mi = i; }
    }
    if (md > tol) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const trackPts = (tr, i0 = 0, i1 = tr.n - 1) => { const out = []; for (let i = i0; i <= i1; i++) out.push([tr.p[3 * i], tr.p[3 * i + 1], tr.p[3 * i + 2]]); return out; };
const circle = (R, n = 96, z = 0) => Array.from({ length: n + 1 }, (_, i) => [R * Math.cos(i / n * 2 * Math.PI), R * Math.sin(i / n * 2 * Math.PI), z]);

/* 每个任务：view 视角；fit 用哪些点定取景范围；layers 依次画的东西
   layer: { pts（三维点）, stroke, width, opacity, dash, tol } 或 { dot: 点, r, fill, stroke } */
const THUMBS = {
  isee3() {
    const T = load('isee3/data/track.json'), E = unpackRows(T.E, 5), all = trackPts(E);
    // 取景只看地月空间（200 万 km 以内）；最后被月球甩出去的那一段伸出画面
    return { view: view(-92, 58), fit: all.filter(p => Math.hypot(p[0], p[1], p[2]) < 20), layers: [
      { pts: circle(3.844), stroke: 'var(--blue)', width: 0.9, opacity: 0.8, dash: '3 3' },
      { pts: all, stroke: 'var(--pen)', width: 1.25, opacity: 0.9, tol: 0.25 },
      { cross: [-14.92, 0, 0], size: 0.7 }, { cross: [15.03, 0, 0], size: 0.7 },
      { dot: [0, 0, 0], r: 3.2, fill: 'var(--sheet)', stroke: 'var(--blue)' },
    ] };
  },
  cassini() {
    // 只画主任务的四年（2004-07 入轨到 2008-07，76 圈）：全部 294 圈在这个尺寸下会糊成一片
    const D = load('cassini/data/cassini.json'), S = unpackDelta(D.S, 1e4), idx = t => { let i = 0; while (i < S.n - 1 && S.t[i] < t) i++; return i; };
    const all = trackPts(S, idx(2445), idx(3912)), ring = (a, b) => [...circle(a / 1e4), ...circle(b / 1e4).reverse()];
    return { view: view(-80, 50), fit: all.filter(p => Math.hypot(p[0], p[1], p[2]) < 330), layers: [
      { pts: circle(122.2), stroke: 'var(--titan)', width: 0.9, opacity: 0.85 },
      { pts: all, stroke: 'var(--pen)', width: 0.6, opacity: 0.7, tol: 0.3 },
      { pts: ring(74490, 136775), fill: 'var(--gold)', opacity: 0.45 },
      { dot: [0, 0, 0], r: 2.6, fill: 'var(--gold)' },
    ] };
  },
};

for (const [id, make] of Object.entries(THUMBS)) {
  const spec = make(), P = spec.view;
  const fit = spec.fit.map(P), xs = fit.map(p => p[0]), ys = fit.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const k = Math.min((W - 2 * PAD) / (x1 - x0), (H - 2 * PAD) / (y1 - y0)), ox = (W - (x1 - x0) * k) / 2 - x0 * k, oy = (H - (y1 - y0) * k) / 2 - y0 * k;
  const S = p => { const q = P(p); return [q[0] * k + ox, q[1] * k + oy]; };
  const d = pts => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
  let body = '', n = 0;
  for (const L of spec.layers) {
    if (L.dot) { const c = S(L.dot); body += `<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${L.r}" fill="${L.fill || 'none'}"${L.stroke ? ` stroke="${L.stroke}" stroke-width="1.3"` : ''}/>`; continue; }
    if (L.cross) { const c = S(L.cross), s = L.size * k; body += `<path d="M${(c[0] - s).toFixed(1)} ${c[1].toFixed(1)}h${(2 * s).toFixed(1)}M${c[0].toFixed(1)} ${(c[1] - s).toFixed(1)}v${(2 * s).toFixed(1)}" stroke="var(--ink)" stroke-width="1"/>`; continue; }
    const pts = L.tol ? simplify(L.pts.map(S), L.tol) : L.pts.map(S); n += pts.length;
    body += `<path d="${d(pts)}${L.fill ? 'Z' : ''}" fill="${L.fill || 'none'}"${L.fill ? ' fill-rule="evenodd"' : ` stroke="${L.stroke}" stroke-width="${L.width}" stroke-linejoin="round" stroke-linecap="round"`}${L.opacity ? ` opacity="${L.opacity}"` : ''}${L.dash ? ` stroke-dasharray="${L.dash}"` : ''}/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" aria-hidden="true">${body}</svg>\n`;
  writeFileSync(new URL(`${id}/thumb.svg`, ROOT), svg);
  console.log(id, 'thumb.svg', (svg.length / 1024).toFixed(1) + ' KB', n, 'points');
}
