// 场景：画布、相机、投影、三维绘图基元、跟随三维点的文字标签。
// 一页只有一张图，所以这里是模块级的单例；任务代码直接 import 下面的函数和（只读的）状态量。
//
// 约定：z 轴朝上（黄道北 / 环平面北），基准面是 z = 0；相机绕目标点 (tx,ty,tz) 转动，az、el 为度。

import { TAU, DEG, clamp, smooth, rgba, niceStep } from './util.js';

const FOV_HALF = 19 * DEG;
const BASE_TOKENS = ['sheet', 'paper', 'ink', 'ink-2', 'rule', 'grid', 'pen', 'gold', 'blue'];

export const cam = { tx: 0, ty: 0, tz: 0, dist: 44, az: -92, el: 56 };
export const C = {};                       // 颜色令牌：C.ink、C.pen、C['ink-2'] …
export const PO = { x: 0, y: 0, z: 0 };    // proj() 的输出
export let ctx = null, W = 300, H = 300, DPR = 1;
export let focal = 1, DIST = 40, NEAR = 0.05, B = null;   // B = { pos, f, r, u }：相机位置与前 / 右 / 上方向
export let gAlpha = 1, isDark = false;

let sheetEl = null, cv = null, tagsBox = null, tokenNames = BASE_TOKENS, monoFont = 'monospace', onDirty = () => {};

export function initScene({ sheet, canvas, tags, tokens = [], dirty }) {
  sheetEl = sheet; cv = canvas; tagsBox = tags; ctx = cv.getContext('2d'); onDirty = dirty || onDirty;
  tokenNames = [...BASE_TOKENS, ...tokens];
  new ResizeObserver(resize).observe(sheetEl);
  new MutationObserver(readTokens).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { for (const tg of TAGS.values()) tg.w = 0; onDirty(); });
  readTokens(); resize();
}
// 任务用到基础令牌之外的颜色时登记一下（如 'titan'、'green'）
export function useTokens(names) { tokenNames = [...new Set([...tokenNames, ...names])]; readTokens(); }
export function readTokens() {
  const cs = getComputedStyle(document.documentElement);
  for (const n of tokenNames) C[n] = cs.getPropertyValue('--' + n).trim() || '#888';
  monoFont = cs.getPropertyValue('--f-mono').trim() || 'monospace';
  const hx = parseInt(C.sheet.replace('#', '').padEnd(6, '0').slice(0, 6), 16);
  isDark = (((hx >> 16) & 255) * 0.3 + ((hx >> 8) & 255) * 0.59 + (hx & 255) * 0.11) < 110;
  onDirty();
  document.dispatchEvent(new Event('tokenschange'));   // 示意图、图表等据此重画
}
export function resize() {
  const r = sheetEl.getBoundingClientRect();
  W = Math.max(50, r.width); H = Math.max(50, r.height); DPR = Math.min(2.5, window.devicePixelRatio || 1);
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  onDirty();
}

/* ================= 相机与投影 ================= */
export function basis() {
  const az = cam.az * DEG, el = cam.el * DEG, ce = Math.cos(el);
  DIST = cam.dist * Math.max(1, 1.3 / (W / H));   // 预设机位按宽幅画面取景；画面较窄时自动后退
  const pos = [cam.tx + DIST * ce * Math.cos(az), cam.ty + DIST * ce * Math.sin(az), cam.tz + DIST * Math.sin(el)];
  let f = [cam.tx - pos[0], cam.ty - pos[1], cam.tz - pos[2]]; const fl = Math.hypot(...f); f = f.map(v => v / fl);
  let r = [f[1], -f[0], 0]; const rl = Math.hypot(r[0], r[1]) || 1; r = [r[0] / rl, r[1] / rl, 0];
  const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  B = { pos, f, r, u };
  focal = (H / 2) / Math.tan(FOV_HALF);
  NEAR = DIST * 0.01;
}
export function proj(x, y, z) {
  const dx = x - B.pos[0], dy = y - B.pos[1], dz = z - B.pos[2];
  const zc = dx * B.f[0] + dy * B.f[1] + dz * B.f[2];
  if (zc < NEAR) { PO.z = -1; return false; }
  PO.x = W / 2 + (dx * B.r[0] + dy * B.r[1] + dz * B.r[2]) / zc * focal;
  PO.y = H / 2 - (dx * B.u[0] + dy * B.u[1] + dz * B.u[2]) / zc * focal;
  PO.z = zc; return true;
}
export const projP = p => proj(p[0], p[1], p[2]) ? { x: PO.x, y: PO.y, z: PO.z } : null;
// 目标点所在深度上，画面能看到的半径（场景单位）
export const viewR = () => DIST * Math.tan(FOV_HALF) * Math.max(1, W / H);
export function camSpace(p) {
  const dx = p[0] - B.pos[0], dy = p[1] - B.pos[1], dz = p[2] - B.pos[2];
  return [dx * B.r[0] + dy * B.r[1] + dz * B.r[2], dx * B.u[0] + dy * B.u[1] + dz * B.u[2], dx * B.f[0] + dy * B.f[1] + dz * B.f[2]];
}
// 屏幕上平移 (dx, dy) 像素对应的目标点位移
export function panBy(dx, dy) {
  const s = DIST / focal;
  cam.tx -= (B.r[0] * dx - B.u[0] * dy) * s; cam.ty -= (B.r[1] * dx - B.u[1] * dy) * s; cam.tz -= (B.r[2] * dx - B.u[2] * dy) * s;
}
export function lerpCam(a, b, k) {
  const daz = ((b.az - a.az + 540) % 360) - 180;
  return { tx: a.tx + (b.tx - a.tx) * k, ty: a.ty + (b.ty - a.ty) * k, tz: a.tz + (b.tz - a.tz) * k,
           dist: a.dist * Math.pow(b.dist / a.dist, k), az: a.az + daz * k, el: a.el + (b.el - a.el) * k };
}
// 朝一个点推近：目标点随距离同步移动，推近过程中该点始终留在画面里
export function lerpZoom(a, b, k) {
  const c = lerpCam(a, b, k);
  if (Math.abs(a.dist - b.dist) > 1e-12) {
    const w = clamp((a.dist - c.dist) / (a.dist - b.dist), 0, 1);
    c.tx = a.tx + (b.tx - a.tx) * w; c.ty = a.ty + (b.ty - a.ty) * w; c.tz = a.tz + (b.tz - a.tz) * w;
  }
  return c;
}
// 机位简写：at(点, { dist, az, el })
export const at = (p, o) => Object.assign({ tx: p[0], ty: p[1], tz: p[2] }, o);
// 近距飞越的特写：base 是这一阶段的远景机位，list 里每项 { t, a, b, cam(t) } 表示在时刻 t 前后
// 从 a 天外开始推近、b 天内完全到位（之后对称地拉回）。多个特写重叠时取权重最大的一个。
export const env = (t, tf, a, b) => smooth(tf - a, tf - b, t) * (1 - smooth(tf + b, tf + a, t));
export function closeUp(base, t, list) {
  let best = null, bk = 0;
  for (const z of list) { const k = env(t, z.t, z.a, z.b); if (k > bk) { bk = k; best = z; } }
  return best && bk > 0 ? lerpZoom(base, best.cam(t), bk) : base;
}

/* ================= 每帧的开始与结束 ================= */
export function beginFrame(alpha) {
  basis();
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.clearRect(0, 0, W, H);
  gAlpha = alpha; ctx.globalAlpha = gAlpha;
  for (const tg of TAGS.values()) tg.used = false;
  ctx.font = `600 10.5px ${monoFont}`;
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
}
export function endFrame() {
  for (const tg of TAGS.values()) if (!tg.used) tg.el.hidden = true;
}

/* ================= 线 ================= */
let SX = new Float32Array(8192), SY = new Float32Array(8192), SZ = new Float32Array(8192);
function ensure(n) { if (SX.length < n) { SX = new Float32Array(n * 2); SY = new Float32Array(n * 2); SZ = new Float32Array(n * 2); } }
const depthFade = z => clamp(1.32 - 0.62 * (z / DIST), 0.32, 1);
// 三维折线 P[i0..i1]（Float64Array，每点三个数）。透明度随远近变化；
// opt: { dash, flat（不随远近变化）, af(i)（逐点的透明度系数）}
export function poly(P, i0, i1, color, width, alpha, opt = {}) {
  const n = i1 - i0 + 1; if (n < 2) return;
  ensure(n);
  for (let k = 0; k < n; k++) { const j = (i0 + k) * 3; proj(P[j], P[j + 1], P[j + 2]); SX[k] = PO.x; SY[k] = PO.y; SZ[k] = PO.z; }
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(opt.dash || []);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  let open = false, cur = -1;
  for (let k = 1; k < n; k++) {
    if (SZ[k - 1] <= 0 || SZ[k] <= 0) { if (open) { ctx.stroke(); open = false; } continue; }
    let a = alpha * (opt.flat ? 1 : depthFade((SZ[k - 1] + SZ[k]) / 2));
    if (opt.af) a *= opt.af(i0 + k);
    const q = Math.round(a * 14) / 14;
    if (q <= 0.005) { if (open) { ctx.stroke(); open = false; } continue; }
    if (!open || q !== cur) {
      if (open) ctx.stroke();
      ctx.globalAlpha = q * gAlpha; ctx.beginPath(); ctx.moveTo(SX[k - 1], SY[k - 1]); cur = q; open = true;
    }
    ctx.lineTo(SX[k], SY[k]);
  }
  if (open) ctx.stroke();
  ctx.setLineDash([]); ctx.globalAlpha = gAlpha;
}
// 一条线段，按近裁剪面裁剪
export function seg3(a, b, color, width, alpha, dash) {
  const pa = camSpace(a), pb = camSpace(b);
  if (pa[2] < NEAR && pb[2] < NEAR) return;
  let A = pa, Bv = pb;
  if (A[2] < NEAR) { const k = (NEAR - A[2]) / (Bv[2] - A[2]); A = A.map((v, i) => v + (Bv[i] - v) * k); }
  if (Bv[2] < NEAR) { const k = (NEAR - Bv[2]) / (A[2] - Bv[2]); Bv = Bv.map((v, i) => v + (A[i] - v) * k); }
  ctx.globalAlpha = alpha * gAlpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []);
  ctx.beginPath(); ctx.moveTo(W / 2 + A[0] / A[2] * focal, H / 2 - A[1] / A[2] * focal); ctx.lineTo(W / 2 + Bv[0] / Bv[2] * focal, H / 2 - Bv[1] / Bv[2] * focal);
  ctx.stroke(); ctx.setLineDash([]);
}
export function arrow(a, b, color, w, alpha) {
  seg3(a, b, color, w, alpha);
  const pa = projP(a), pb = projP(b); if (!pa || !pb) return;
  const ang = Math.atan2(pb.y - pa.y, pb.x - pa.x);
  ctx.globalAlpha = alpha * gAlpha; ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath();
  ctx.moveTo(pb.x - 9 * Math.cos(ang - 0.45), pb.y - 9 * Math.sin(ang - 0.45)); ctx.lineTo(pb.x, pb.y); ctx.lineTo(pb.x - 9 * Math.cos(ang + 0.45), pb.y - 9 * Math.sin(ang + 0.45)); ctx.stroke();
}
// 从点 p 垂到基准面 z0 的虚线，脚上一道短横
export function dropLine(p, color, z0 = 0) {
  if (Math.abs(p[2] - z0) < viewR() * 0.004) return;
  seg3(p, [p[0], p[1], z0], color, 1, 0.55, [2, 3]);
  const q = projP([p[0], p[1], z0]); if (!q) return;
  ctx.globalAlpha = 0.6 * gAlpha; ctx.strokeStyle = color; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(q.x - 3, q.y); ctx.lineTo(q.x + 3, q.y); ctx.stroke();
}

/* ================= 坐标纸 =================
   网格画在 z = z0 的平面上，格距随缩放自动取 1 / 2 / 5 × 10ⁿ，每 5 格一条粗线，向画面边缘淡出。
   polar: 中心天体在视野内时画成同心圆加 12 条辐线，否则画成目标点附近的方格。
   fine:  每屏的格数，越大越密。 */
export function grid({ center = [0, 0, 0], z0 = 0, polar = false, fine = 4.2 } = {}) {
  const vr = viewR(), tgt = [cam.tx, cam.ty, cam.tz];
  const dC = Math.hypot(tgt[0] - center[0], tgt[1] - center[1]);
  const step = niceStep(vr / fine), major = step * 5;
  const isMajor = v => Math.abs(v / major - Math.round(v / major)) < 1e-6;
  const vig = (x, y, z) => clamp(1.2 - Math.hypot(x - tgt[0], y - tgt[1], (z - tgt[2]) * 0.5) / (vr * 1.55), 0, 1);
  if (polar && dC < vr * 2.2) {
    const rMax = dC + vr * 1.7, n = Math.min(70, Math.floor(rMax / step));
    for (let k = 1; k <= n; k++) {
      const R = k * step, pts = new Float64Array(97 * 3), mj = isMajor(R);
      for (let i = 0; i <= 96; i++) { const a = i / 96 * TAU; pts[3 * i] = center[0] + R * Math.cos(a); pts[3 * i + 1] = center[1] + R * Math.sin(a); pts[3 * i + 2] = z0; }
      poly(pts, 0, 96, C.grid, mj ? 1.05 : 0.8, mj ? 0.62 : 0.28, { flat: true, af: i => vig(pts[3 * i], pts[3 * i + 1], z0) });
    }
    for (let s = 0; s < 12; s++) {
      const a = s / 12 * TAU, pts = new Float64Array(15 * 3);
      for (let i = 0; i <= 14; i++) { const R = step + (rMax - step) * i / 14; pts[3 * i] = center[0] + R * Math.cos(a); pts[3 * i + 1] = center[1] + R * Math.sin(a); pts[3 * i + 2] = z0; }
      poly(pts, 0, 14, C.grid, 0.8, s % 3 === 0 ? 0.36 : 0.18, { flat: true, af: i => vig(pts[3 * i], pts[3 * i + 1], z0) });
    }
    return;
  }
  const ext = vr * 1.6, x0 = Math.ceil((tgt[0] - ext) / step) * step, y0 = Math.ceil((tgt[1] - ext) / step) * step;
  const line = (ax, ay, bx, by, mj) => {
    const pts = new Float64Array(15 * 3);
    for (let i = 0; i <= 14; i++) { const k = i / 14; pts[3 * i] = ax + (bx - ax) * k; pts[3 * i + 1] = ay + (by - ay) * k; pts[3 * i + 2] = z0; }
    poly(pts, 0, 14, C.grid, mj ? 1.05 : 0.8, mj ? 0.6 : 0.26, { flat: true, af: i => vig(pts[3 * i], pts[3 * i + 1], z0) });
  };
  for (let x = x0; x <= tgt[0] + ext; x += step) line(x, tgt[1] - ext, x, tgt[1] + ext, isMajor(x));
  for (let y = y0; y <= tgt[1] + ext; y += step) line(tgt[0] - ext, y, tgt[0] + ext, y, isMajor(y));
}

/* ================= 天体 ================= */
// 太阳方向在屏幕上的角度，以及它朝向观察者的分量
export function sunScreen(v) {
  const sx = v[0] * B.r[0] + v[1] * B.r[1] + v[2] * B.r[2], sy = v[0] * B.u[0] + v[1] * B.u[1] + v[2] * B.u[2];
  return { ang: Math.atan2(-sy, sx), sz: -(v[0] * B.f[0] + v[1] * B.f[1] + v[2] * B.f[2]) };
}
// 以当前原点为圆心的圆面，背阳的一半按真实的太阳方向涂暗。调用前自行 translate / scale。
export function shadedDisk(rr, sunDirV, fillCol, strokeCol, nightA, angOffset = 0) {
  const { ang, sz } = sunScreen(sunDirV);
  ctx.rotate(ang - angOffset);
  ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.fillStyle = C.sheet; ctx.fill();
  if (fillCol !== C.sheet) { ctx.fillStyle = fillCol; ctx.fill(); }
  else if (isDark) { ctx.fillStyle = rgba(C.ink, 0.24); ctx.fill(); }      // 深色纸面上让受光面亮一些
  const c2 = -sz;
  ctx.beginPath(); ctx.arc(0, 0, rr, Math.PI / 2, Math.PI * 1.5, false);
  ctx.ellipse(0, 0, Math.max(0.001, Math.abs(c2) * rr), rr, 0, -Math.PI / 2, Math.PI / 2, c2 < 0);
  ctx.closePath(); ctx.fillStyle = isDark ? `rgba(0,0,0,${nightA + 0.12})` : rgba(C.ink, nightA); ctx.fill();
  if (strokeCol) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.lineWidth = 1.3; ctx.strokeStyle = strokeCol; ctx.stroke(); }
}
// 球形天体：拉近后按真实半径 R 画，远景时不小于 minPx 像素。返回屏幕上的 { x, y, r }
export function body(c, R, sunDirV, fillCol, strokeCol, minPx, nightA = 0.55) {
  if (!proj(c[0], c[1], c[2])) return null;
  const x = PO.x, y = PO.y, rr = Math.max(minPx, R / PO.z * focal);
  if (x < -rr - 50 || x > W + rr + 50 || y < -rr - 50 || y > H + rr + 50) return { x, y, r: rr };
  ctx.save(); ctx.globalAlpha = gAlpha; ctx.translate(x, y);
  shadedDisk(rr, sunDirV, fillCol, strokeCol, nightA);
  ctx.restore();
  return { x, y, r: rr };
}
// 太阳：实心圆加一圈光晕
export function sun(p, R, minPx = 6.5, label = '太阳') {
  const s = projP(p); if (!s) return null;
  const rad = Math.max(minPx, R / s.z * focal), gold = C.gold;
  const gr = ctx.createRadialGradient(s.x, s.y, rad * 0.6, s.x, s.y, rad * 4);
  gr.addColorStop(0, rgba(gold, 0.35)); gr.addColorStop(1, rgba(gold, 0));
  ctx.globalAlpha = gAlpha; ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(s.x, s.y, rad * 4, 0, TAU); ctx.fill();
  ctx.beginPath(); ctx.arc(s.x, s.y, rad, 0, TAU); ctx.fillStyle = gold; ctx.fill();
  if (label) placeTag('sun', p, label, 'zh gold', rad + 6, 0);
  return { x: s.x, y: s.y, r: rad };
}
// 日心坐标系里的春分点方向
export function equinoxArrow() {
  const R0 = clamp(viewR() * 0.72, 12, 900);
  arrow([R0, 0, 0], [R0 * 1.18, 0, 0], C.ink, 1.2, 0.65);
  placeTag('equinox', [R0 * 1.18, 0, 0], '春分点方向 ♈', 'zh faint', -2, -14);
}
export function dot2(p, r, fill, stroke, w = 1.5) {
  if (!proj(p[0], p[1], p[2])) return null;
  ctx.globalAlpha = gAlpha; ctx.beginPath(); ctx.arc(PO.x, PO.y, r, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.stroke(); }
  return { x: PO.x, y: PO.y };
}
// 探测器：笔色菱形加一圈细环，旁边是名字
export function craftMark(p, name, left) {
  if (!proj(p[0], p[1], p[2])) return;
  const x = PO.x, y = PO.y;
  ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.strokeStyle = C.pen; ctx.lineWidth = 1; ctx.globalAlpha = 0.45 * gAlpha; ctx.stroke();
  ctx.globalAlpha = gAlpha;
  ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x + 5, y); ctx.lineTo(x, y + 5); ctx.lineTo(x - 5, y); ctx.closePath();
  ctx.fillStyle = C.pen; ctx.fill();
  placeTag('sc', p, name, 'sc', left ? -12 : 12, 0);
}

/* ================= 跟随三维点的 HTML 标签 =================
   每帧对要显示的标签调用一次 placeTag(id, 点, 文字, 类名, dx, dy)；这一帧没调用到的自动隐藏。
   类名：zh（中文衬线体）、sc（探测器）、faint，以及与颜色令牌同名的 gold、blue 等。 */
const TAGS = new Map();
export function placeTag(id, p, text, cls, dx = 8, dy = 0) {
  let tg = TAGS.get(id);
  if (!tg) { const el = document.createElement('div'); tagsBox.appendChild(el); tg = { el, text: null, cls: null }; TAGS.set(id, tg); }
  const k = 'tag ' + (cls || '');
  if (tg.text !== text || tg.cls !== k) { tg.el.textContent = text; tg.text = text; tg.el.className = k; tg.cls = k; tg.w = 0; }
  tg.used = true;
  if (!proj(p[0], p[1], p[2])) { tg.el.hidden = true; return; }
  if (tg.el.hidden) tg.el.hidden = false;
  if (!tg.w) tg.w = tg.el.offsetWidth || 60;
  const x0 = dx < 0 ? PO.x + dx - tg.w : PO.x + dx, y0 = PO.y + dy;
  if (x0 < 4 || x0 + tg.w > W - 4 || y0 < 10 || y0 > H - 10) { tg.el.hidden = true; return; }
  tg.el.style.opacity = gAlpha;
  tg.el.style.transform = `translate(${x0.toFixed(1)}px,${y0.toFixed(1)}px) translateY(-50%)`;
}
