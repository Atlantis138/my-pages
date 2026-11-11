// 轨道剖面图：每个近土点一个点，上图是轨道倾角，下图是近土点距离，底下一条带标出每次卫星飞越。
// 指向可看这一圈的数据，点击（或点表格里的一行）在三维图里跳到那个近土点；一条竖线标出三维图当前的时刻。

import { clamp, fmtInt, fmtKm, $ } from '../../shared/util.js';
import { C, isDark } from '../../shared/scene.js';

const SVGNS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, parent, text) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text !== undefined) e.textContent = text; if (parent) parent.appendChild(e); return e; };
const ROWS = { titan: '泰坦', encel: '恩克拉多斯', moon: '其他卫星' };

export function mountProfile({ clock, REVS, TF, SEG, RS, T_END, tStart, onPick }) {
  const { T, utc } = clock;
  const svg = $('profSvg'), tip = $('profTip'), box = $('profile');
  const tA = tStart, tB = T_END + 20;
  let x = null, nowLine = null, nowT = null, y0 = 0, y1 = 0;

  function draw() {
    const Wd = Math.max(560, svg.parentElement.clientWidth), m = { l: 76, r: 14, t: 26, b: 26 };
    const h1 = 170, gap = 34, h2 = 150, stripH = 44;
    const Ht = m.t + h1 + gap + h2 + 18 + stripH + m.b;
    svg.setAttribute('viewBox', `0 0 ${Wd} ${Ht}`); svg.setAttribute('width', Wd); svg.setAttribute('height', Ht);
    svg.innerHTML = '';
    x = t => m.l + (t - tA) / (tB - tA) * (Wd - m.l - m.r);
    const yI = v => m.t + h1 - v / 80 * h1;
    const y2top = m.t + h1 + gap, yR = v => y2top + (1 - Math.log10(Math.max(1, v)) / Math.log10(30)) * h2;
    const ySt = y2top + h2 + 18;
    y0 = m.t; y1 = ySt + stripH;
    const rule = C.rule, hline = (y, col, dash) => el('line', Object.assign({ x1: m.l, x2: Wd - m.r, y1: y, y2: y, stroke: col, 'stroke-width': 1 }, dash ? { 'stroke-dasharray': dash } : {}), svg);
    // 阶段底纹与名称
    SEG.forEach((g, i) => {
      if (g.frame !== 'S') return;
      const a = x(Math.max(g.t0, tA)), b = x(g.t1);
      if (i % 2 === 1) el('rect', { x: a, y: y0, width: b - a, height: y1 - y0, fill: C.ink, opacity: isDark ? 0.05 : 0.035 }, svg);
      if (b - a > 40) el('text', { x: a + 4, y: y0 - 9, class: 'ph' }, svg, g.short);
    });
    // 坐标轴
    for (const v of [0, 20, 40, 60, 80]) { hline(yI(v), rule); el('text', { x: m.l - 8, y: yI(v) + 4, 'text-anchor': 'end' }, svg, v + '°'); }
    for (const v of [1, 2, 5, 10, 20, 30]) { hline(yR(v), rule); el('text', { x: m.l - 8, y: yR(v) + 4, 'text-anchor': 'end' }, svg, v + ' Rs'); }
    for (const [r, txt] of [[140180, 'F 环'], [66900, 'D 环内缘']]) { hline(yR(r / RS), C.gold, '4 4'); el('text', { x: Wd - m.r - 4, y: yR(r / RS) - 5, 'text-anchor': 'end' }, svg, txt); }
    el('text', { x: m.l + 4, y: m.t + 13, class: 'ttl' }, svg, '轨道倾角（相对环平面）');
    el('text', { x: m.l + 4, y: y2top + 13, class: 'ttl' }, svg, `近土点距土星中心（对数刻度，1 Rs = ${fmtInt(RS)} km）`);
    for (let y = 2005; y <= 2017; y++) {
      const xx = x(T(y + '-01-01'));
      el('line', { x1: xx, x2: xx, y1: y0, y2: y1, stroke: rule, 'stroke-width': 1, opacity: 0.6 }, svg);
      el('text', { x: xx, y: y1 + 16, 'text-anchor': 'middle' }, svg, y);
    }
    // 两条折线
    for (const yOf of [r => yI(r.inc), r => yR(r.r / RS)]) {
      el('polyline', { points: REVS.map(r => `${x(r.t).toFixed(1)},${yOf(r).toFixed(1)}`).join(' '), fill: 'none', stroke: C.pen, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, svg);
      for (const r of REVS) el('circle', { cx: x(r.t), cy: yOf(r), r: 1.9, fill: C.pen }, svg);
    }
    // 飞越
    const rowsY = { titan: ySt + 8, encel: ySt + 22, moon: ySt + 36 };
    for (const k in rowsY) el('text', { x: m.l - 8, y: rowsY[k] + 4, 'text-anchor': 'end', class: 'ph' }, svg, ROWS[k]);
    for (const f of TF) if (f.t >= tA) el('line', { x1: x(f.t), x2: x(f.t), y1: rowsY[f.cls] - 5, y2: rowsY[f.cls] + 5, stroke: C[f.cls], 'stroke-width': 1.6 }, svg);
    // 当前时刻、十字线、可点区域
    nowLine = el('line', { y1: y0, y2: y1, stroke: C.pen, 'stroke-width': 1.5, 'pointer-events': 'none', opacity: 0 }, svg);
    const ch = el('line', { y1: y0, y2: y1, stroke: C.ink, 'stroke-width': 1, opacity: 0, 'pointer-events': 'none' }, svg);
    const hi = [0, 1].map(() => el('circle', { r: 4.5, fill: 'none', stroke: C.ink, 'stroke-width': 1.5, opacity: 0, 'pointer-events': 'none' }, svg));
    const hit = el('rect', { x: m.l, y: y0, width: Wd - m.l - m.r, height: y1 - y0, fill: 'transparent', style: 'cursor:pointer' }, svg);
    const pick = ev => {
      const r = svg.getBoundingClientRect(), sx = (ev.clientX - r.left) * (Wd / r.width);
      let best = null, bd = 1e9; for (const q of REVS) { const d = Math.abs(x(q.t) - sx); if (d < bd) { bd = d; best = q; } }
      return best;
    };
    hit.addEventListener('pointermove', ev => {
      const q = pick(ev); if (!q) return;
      const xx = x(q.t);
      ch.setAttribute('x1', xx); ch.setAttribute('x2', xx); ch.setAttribute('opacity', 0.5);
      hi[0].setAttribute('cx', xx); hi[0].setAttribute('cy', yI(q.inc)); hi[1].setAttribute('cx', xx); hi[1].setAttribute('cy', yR(q.r / RS));
      hi.forEach(h => h.setAttribute('opacity', 1));
      const fl = TF.filter(f => Math.abs(f.t - q.t) < (q.per || 10) / 2);
      tip.innerHTML = `<b>第 ${REVS.indexOf(q) + 1} 个近土点</b> · ${utc(q.t)}<br>倾角 ${q.inc.toFixed(1)}° · 近土点 ${(q.r / RS).toFixed(2)} Rs（${fmtKm(q.r)}）`
        + (q.per ? `<br>周期 ${q.per.toFixed(1)} 天` : '') + (fl.length ? `<br>这一圈的飞越：${fl.map(f => f.name).join('、')}` : '');
      tip.hidden = false;
      const br = box.getBoundingClientRect(), r = svg.getBoundingClientRect(), px = r.left - br.left + xx * (r.width / Wd);
      tip.style.left = clamp(px + 12, 4, br.width - tip.offsetWidth - 4) + 'px'; tip.style.top = (r.top - br.top + 30) + 'px';
    });
    hit.addEventListener('pointerleave', () => { tip.hidden = true; ch.setAttribute('opacity', 0); hi.forEach(h => h.setAttribute('opacity', 0)); });
    hit.addEventListener('click', ev => { const q = pick(ev); if (q) onPick(q.t); });
    if (nowT !== null) setNow(nowT);
  }
  function setNow(t) {
    nowT = t; if (!nowLine) return;
    const on = t >= tA && t <= tB;
    nowLine.setAttribute('opacity', on ? 0.9 : 0);
    if (on) { const xx = x(t).toFixed(1); nowLine.setAttribute('x1', xx); nowLine.setAttribute('x2', xx); }
  }

  // 表格（图表的无障碍替代，也可以点）
  const tbl = $('profTable');
  tbl.innerHTML = '<table><thead><tr><th>#</th><th>近土点时刻</th><th>倾角</th><th>Rs</th><th>距土星中心 km</th><th>周期（天）</th></tr></thead><tbody>'
    + REVS.map((q, i) => `<tr data-i="${i}"><td>${i + 1}</td><td>${utc(q.t)}</td><td>${q.inc.toFixed(1)}°</td><td>${(q.r / RS).toFixed(2)}</td><td>${fmtInt(q.r)}</td><td>${q.per ? q.per.toFixed(1) : '—'}</td></tr>`).join('') + '</tbody></table>';
  tbl.addEventListener('click', e => { const tr = e.target.closest('tr[data-i]'); if (tr) onPick(REVS[+tr.dataset.i].t); });

  draw();
  new ResizeObserver(draw).observe(svg.parentElement);
  document.addEventListener('tokenschange', draw);
  return { setNow };
}
