// ISEE-3 外形示意：十六面的自旋鼓体，四根径向线天线、两根轴向天线和一根磁强计杆，按真实的 19.76 rpm 自旋。

import { TAU, DEG, rgba, reduceMotion } from '../../shared/util.js';
import { C } from '../../shared/scene.js';
import { createSketch } from '../../shared/sketch.js';

const SPIN = 19.76 / 60 * TAU;                 // 弧度 / 秒
const N = 16, R = 0.885, HH = 0.79;            // 面数、半径、半高（米）
const VAZ = -62 * DEG, VEL = 17 * DEG;         // 观察方向

export function mountCraft(canvas) {
  const f = [-Math.cos(VEL) * Math.cos(VAZ), -Math.cos(VEL) * Math.sin(VAZ), -Math.sin(VEL)];
  const r = [Math.sin(VAZ), -Math.cos(VAZ), 0];
  const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  const towardViewer = a => Math.cos(a) * -f[0] + Math.sin(a) * -f[1] > 0;

  createSketch(canvas, (c, w, h, now) => {
    const spin = reduceMotion ? 0.35 : (now / 1000) * SPIN;
    const S = Math.min(w, h) / 7.4, ox = w / 2, oy = h * 0.47;
    const P = p => [ox + (p[0] * r[0] + p[1] * r[1] + p[2] * r[2]) * S, oy - (p[0] * u[0] + p[1] * u[1] + p[2] * u[2]) * S];
    const rim = (a, z, k = R) => [k * Math.cos(a), k * Math.sin(a), z];
    const line = (a, b, col, lw, alpha, dash) => { const A = P(a), Bp = P(b); c.globalAlpha = alpha; c.strokeStyle = col; c.lineWidth = lw; c.setLineDash(dash || []); c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(Bp[0], Bp[1]); c.stroke(); };
    const ang = k => k / N * TAU + spin;
    c.lineCap = 'round'; c.lineJoin = 'round';
    // 径向线天线：先画鼓体后面的，最后画前面的；末端虚线表示截短
    const wires = [0, 1, 2, 3].map(k => spin + k * Math.PI / 2 + Math.PI / 8);
    const wire = a => { line(rim(a, 0), rim(a, 0, 3.0), C['ink-2'], 1.2, 0.9); line(rim(a, 0, 3.0), rim(a, 0, 3.45), C['ink-2'], 1.2, 0.5, [2, 3]); };
    wires.filter(a => !towardViewer(a)).forEach(wire);
    // 背面的棱（虚线）
    for (let k = 0; k < N; k++) if (!towardViewer((ang(k) + ang(k + 1)) / 2)) line(rim(ang(k), -HH), rim(ang(k + 1), -HH), C.ink, 1, 0.28, [2, 3]);
    // 朝向观察者的侧面：贴着太阳能电池，中间一道仪器带
    for (let k = 0; k < N; k++) {
      const a = ang(k), b = ang(k + 1), mid = (a + b) / 2;
      if (!towardViewer(mid)) continue;
      const quad = [rim(a, HH), rim(b, HH), rim(b, -HH), rim(a, -HH)].map(P);
      const lit = 0.5 + 0.5 * Math.cos(mid - (VAZ + Math.PI + 0.6));
      c.globalAlpha = 1; c.setLineDash([]);
      c.beginPath(); quad.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath();
      c.fillStyle = C.sheet; c.fill();
      c.fillStyle = rgba(C.blue, 0.06 + 0.16 * (1 - lit)); c.fill();
      line(rim(a, -HH), rim(b, -HH), C.ink, 1.3, 1);
      line(rim(a, HH), rim(a, -HH), C.ink, 1, 0.75);
      line(rim(b, HH), rim(b, -HH), C.ink, 1, 0.75);
      for (const z of [0.1, -0.1]) line(rim(a, z), rim(b, z), C.ink, 0.9, 0.55);
    }
    // 顶面
    c.globalAlpha = 1; c.setLineDash([]); c.fillStyle = C.sheet;
    c.beginPath(); for (let k = 0; k < N; k++) { const q = P(rim(ang(k), HH)); if (k) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); } c.closePath(); c.fill();
    c.strokeStyle = C.ink; c.lineWidth = 1.3; c.stroke();
    // 轴向天线
    line([0, 0, HH], [0, 0, HH + 1.7], C.ink, 1.3, 0.9);
    line([0, 0, -HH], [0, 0, -HH - 1.7], C.ink, 1.3, 0.9);
    // 磁强计杆（转到前面时才看得见）
    const magA = spin + Math.PI / 8 + Math.PI / 4;
    if (towardViewer(magA)) {
      line(rim(magA, 0.35), rim(magA, 0.35, 2.5), C.pen, 1.6, 1);
      const e = P(rim(magA, 0.35, 2.5)); c.globalAlpha = 1; c.fillStyle = C.pen; c.fillRect(e[0] - 3, e[1] - 3, 6, 6);
    }
    wires.filter(towardViewer).forEach(wire);
    c.globalAlpha = 1;
  }, () => !reduceMotion);
}
