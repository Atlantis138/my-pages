// 卡西尼号外形示意：由平面拼成的模型，缓慢自转，可拖动旋转；部件名称跟着模型走。
// 模型单位为米，z 轴朝上，高增益天线在顶上。

import { TAU, DEG, clamp, rgba, reduceMotion } from '../../shared/util.js';
import { C } from '../../shared/scene.js';
import { createSketch } from '../../shared/sketch.js';

const MESH = [], LINES = [], LABELS = [];
const addQuad = (a, b, c, d, tone, two) => MESH.push({ v: [a, b, c, d], tone, two });
const addTri = (a, b, c, tone, two) => MESH.push({ v: [a, b, c], tone, two });
function prism(cx, cy, z0, z1, R, n, tone, rot = 0) {
  const ring = z => Array.from({ length: n }, (_, k) => { const a = rot + k / n * TAU; return [cx + R * Math.cos(a), cy + R * Math.sin(a), z]; });
  const lo = ring(z0), hi = ring(z1);
  for (let k = 0; k < n; k++) addQuad(lo[k], lo[(k + 1) % n], hi[(k + 1) % n], hi[k], tone);
  for (let k = 1; k < n - 1; k++) { addTri(hi[0], hi[k], hi[k + 1], tone * 0.9); addTri(lo[0], lo[k + 1], lo[k], tone * 0.9); }
}
function frustum(c, axis, r0, r1, len, n, tone, two) {   // 从 c 出发沿 axis 的圆台
  const [ax, ay, az] = axis, l = Math.hypot(ax, ay, az), u = [ax / l, ay / l, az / l];
  const t1 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let p = [u[1] * t1[2] - u[2] * t1[1], u[2] * t1[0] - u[0] * t1[2], u[0] * t1[1] - u[1] * t1[0]]; const pl = Math.hypot(...p); p = p.map(v => v / pl);
  const q = [u[1] * p[2] - u[2] * p[1], u[2] * p[0] - u[0] * p[2], u[0] * p[1] - u[1] * p[0]];
  const ring = (s, r) => Array.from({ length: n }, (_, k) => { const a = k / n * TAU; return [0, 1, 2].map(i => c[i] + u[i] * s + (p[i] * Math.cos(a) + q[i] * Math.sin(a)) * r); });
  const A = ring(0, r0), Bq = ring(len, r1);
  for (let k = 0; k < n; k++) addQuad(A[k], A[(k + 1) % n], Bq[(k + 1) % n], Bq[k], tone, two);
  return { A, B: Bq };
}
// 主体：下设备舱、推进剂贮箱、十二边形电子舱
prism(0, 0, 0.95, 1.45, 1.05, 12, 0.92);
prism(0, 0, 1.45, 4.55, 0.68, 16, 1.0);
prism(0, 0, 4.55, 5.25, 1.05, 12, 0.92, Math.PI / 12);
prism(0, 0, 5.25, 5.55, 0.55, 12, 0.9);
{ // 高增益天线：直径 4 m 的浅碟
  const n = 24, rings = [0, 0.7, 1.4, 2.0], z = r => 5.75 + 0.11 * r * r;
  const pt = (r, k) => [r * Math.cos(k / n * TAU), r * Math.sin(k / n * TAU), z(r)];
  for (let j = 0; j < rings.length - 1; j++) for (let k = 0; k < n; k++) addQuad(pt(rings[j], k), pt(rings[j], k + 1), pt(rings[j + 1], k + 1), pt(rings[j + 1], k), 1.1, true);
  for (let k = 0; k < 3; k++) { const a = k / 3 * TAU; LINES.push([[1.9 * Math.cos(a), 1.9 * Math.sin(a), z(1.9)], [0, 0, 6.85]]); }
  LABELS.push({ p: [0, 0, 7.0], t: '高增益天线 4 m' });
}
// 两台主发动机
frustum([0.32, 0, 0.95], [0, 0, -1], 0.12, 0.38, 0.85, 12, 0.85, true);
frustum([-0.32, 0, 0.95], [0, 0, -1], 0.12, 0.38, 0.85, 12, 0.85, true);
LABELS.push({ p: [0, 0, 0.05], t: '主发动机 ×2' });
// 三台 RTG：下设备舱外带散热片的圆筒
[0.25, 0.95, 1.55].forEach((k, idx) => {
  const a = Math.PI * k, base = [1.05 * Math.cos(a), 1.05 * Math.sin(a), 1.2], dir = [Math.cos(a), Math.sin(a), -0.55];
  const f = frustum(base, dir, 0.21, 0.21, 1.15, 10, 0.8, true);
  for (const kk of [0, 2, 5, 7]) {
    const A = f.A[kk], Bq = f.B[kk], o = [A[0] - base[0], A[1] - base[1], A[2] - base[2]], ol = Math.hypot(...o) || 1, e = o.map(v => v / ol * 0.16);
    addQuad(A, Bq, [Bq[0] + e[0], Bq[1] + e[1], Bq[2] + e[2]], [A[0] + e[0], A[1] + e[1], A[2] + e[2]], 0.75, true);
  }
  if (idx === 0) LABELS.push({ p: [base[0] + dir[0] * 1.3, base[1] + dir[1] * 1.3, base[2] + dir[2] * 1.3], t: '核电源 RTG ×3' });
});
{ // 侧面的惠更斯号（防热罩朝外）
  const c = [0.9, -0.9, 2.9], ax = [Math.SQRT1_2, -Math.SQRT1_2, 0];
  frustum(c, ax, 0.55, 1.35, 0.55, 20, 1.15, true);
  frustum(c, ax.map(v => -v), 0.55, 0.25, 0.4, 20, 1.0, true);
  LABELS.push({ p: [c[0] + ax[0] * 0.9, c[1] + ax[1] * 0.9, c[2] + 0.9], t: '惠更斯号' });
}
// 遥感仪器平台
prism(-0.95, 0.55, 4.6, 5.2, 0.42, 4, 0.95, Math.PI / 4);
// 磁强计杆（11 m）和三根射电天线（10 m），均截短示意
LINES.push([[0, 1.0, 5.0], [0, 4.0, 5.0], 'boom']); LINES.push([[0, 4.0, 5.0], [0, 4.7, 5.0], 'ant']);
LABELS.push({ p: [0, 4.4, 5.0], t: '磁强计杆' });
for (const v of [[-1, 0.15, 0.6], [-0.6, -0.8, 0.6], [-0.95, -0.25, -0.3]]) { const l = Math.hypot(...v); LINES.push([[-0.9, 0.2, 4.3], [-0.9 + v[0] / l * 3.2, 0.2 + v[1] / l * 3.2, 4.3 + v[2] / l * 3.2], 'ant']); }

export function mountCraft(canvas, labelsBox) {
  const labelEls = LABELS.map(l => { const s = document.createElement('span'); s.textContent = l.t; labelsBox.appendChild(s); return s; });
  let yaw = -0.6, drag = null, last = 0;
  const PITCH = 16 * DEG, cp = Math.cos(PITCH), sp = Math.sin(PITCH);
  const sketch = createSketch(canvas, (c, w, h, now) => {
    if (!drag && !reduceMotion) yaw += Math.min(0.05, (now - last) / 1000) * 0.18;
    last = now;
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), S = Math.min(w / 10.2, h / 9.0), ox = w * 0.5, oy = h * 0.8;
    const P = v => { const x = v[0] * cyw - v[1] * syw, y = v[0] * syw + v[1] * cyw; return [ox + x * S, oy - (y * sp + v[2] * cp) * S, y * cp - v[2] * sp]; };
    c.lineJoin = 'round'; c.lineCap = 'round';
    const faces = [];
    for (const f of MESH) {
      const q = f.v.map(P), cr = (q[1][0] - q[0][0]) * (q[2][1] - q[0][1]) - (q[1][1] - q[0][1]) * (q[2][0] - q[0][0]);
      if (!f.two && cr > 0) continue;   // 背面
      faces.push({ q, depth: q.reduce((s, v) => s + v[2], 0) / q.length, tone: f.tone, cr });
    }
    faces.sort((a, b) => b.depth - a.depth);
    const lines = LINES.map(([a, b, kind]) => ({ a: P(a), b: P(b), kind }));
    const drawLine = L => { c.globalAlpha = L.kind === 'ant' ? 0.7 : 1; c.strokeStyle = L.kind === 'boom' ? C.ink : C['ink-2']; c.lineWidth = L.kind === 'boom' ? 1.6 : 1.1; c.setLineDash(L.kind === 'ant' ? [3, 3] : []); c.beginPath(); c.moveTo(L.a[0], L.a[1]); c.lineTo(L.b[0], L.b[1]); c.stroke(); c.setLineDash([]); c.globalAlpha = 1; };
    for (const L of lines) if ((L.a[2] + L.b[2]) / 2 > 0.5) drawLine(L);          // 模型后面的杆和天线
    for (const f of faces) {
      c.beginPath(); f.q.forEach((v, i) => i ? c.lineTo(v[0], v[1]) : c.moveTo(v[0], v[1])); c.closePath();
      c.fillStyle = C.sheet; c.fill();
      const shade = clamp(0.5 - 0.5 * Math.sign(f.cr) * 0.4 + (1.1 - f.tone) * 0.6, 0, 1);
      c.fillStyle = rgba(f.tone > 1.05 ? C.gold : C.ink, f.tone > 1.05 ? 0.16 : 0.03 + 0.1 * shade); c.fill();
      c.strokeStyle = C.ink; c.lineWidth = 0.7; c.globalAlpha = 0.75; c.stroke(); c.globalAlpha = 1;
    }
    for (const L of lines) if ((L.a[2] + L.b[2]) / 2 <= 0.5) drawLine(L);
    LABELS.forEach((l, i) => {   // 名称放在锚点的外侧
      const q = P(l.p), e = labelEls[i], lw = e.offsetWidth || 60;
      e.style.transform = `translate(${(q[0] < ox - 4 ? q[0] - lw - 8 : q[0] + 8).toFixed(1)}px,${(q[1] - 9).toFixed(1)}px)`;
    });
  }, () => !drag && !reduceMotion);
  canvas.dataset.drag = '';
  canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, yaw }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (drag) { yaw = drag.yaw - (e.clientX - drag.x) * 0.012; sketch.invalidate(); } });
  const up = () => { drag = null; sketch.invalidate(); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
}
