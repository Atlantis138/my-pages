/*
 * 藤蔓引擎：把一串点拟合成光滑曲线，沿线摆叶子，末端收卷、开花。
 * 首屏海报、原理一节的鞭线和「藤蔓画笔」都用它。
 * 这里的做法是示意性的简化（Catmull-Rom 样条 + 等距摆叶），并不模拟真实的植物生长。
 */
const NS = "http://www.w3.org/2000/svg";
const f = (n) => Math.round(n * 10) / 10;

export const LEAF_D = "M0 0C7 -8 7 -21 0 -30C-7 -21 -7 -8 0 0Z";

export function el(name, attrs = {}, parent) {
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}

/** 均匀 Catmull-Rom 样条 → 三次贝塞尔路径。pts 是 [[x, y], …]。 */
export function smooth(pts) {
  if (pts.length < 2) return "";
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** 按最小间距抽稀手绘的点，去掉抖动。 */
export function thin(pts, gap) {
  const out = [pts[0]];
  for (const p of pts) {
    const q = out[out.length - 1];
    if (Math.hypot(p[0] - q[0], p[1] - q[1]) >= gap) out.push(p);
  }
  const last = pts[pts.length - 1], q = out[out.length - 1];
  if (Math.hypot(last[0] - q[0], last[1] - q[1]) > gap * 0.4) out.push(last);
  return out;
}

/** 在点列末端接一段越转越紧的螺线（卷须）。turns 为圈数，r0 为起始半径。 */
export function curl(pts, turns, r0) {
  const n = pts.length;
  if (n < 2 || turns <= 0 || r0 <= 0) return pts;
  const a = pts[Math.max(0, n - 3)], b = pts[n - 2], c = pts[n - 1];
  let th = Math.atan2(c[1] - b[1], c[0] - b[0]);
  const cross = (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]);
  const dir = cross < 0 ? -1 : 1;                 /* 顺着原来的弯向继续卷 */
  const step = 0.45, count = Math.max(3, Math.round((turns * 2 * Math.PI) / step));
  const out = pts.slice();
  let [x, y] = c;
  for (let k = 1; k <= count; k++) {
    const r = r0 * Math.pow(1 - k / (count + 3), 1.25);
    th += dir * step;
    x += Math.cos(th) * r * step;
    y += Math.sin(th) * r * step;
    out.push([x, y]);
  }
  return out;
}

/** 一条鞭线的点列：自下而上，摆幅渐小、频率渐快。t 为 0…1 的「张力」。 */
export function whip({ x, y, h, amp, t = 1, side = 1, n = 28 }) {
  const pts = [];
  const total = Math.PI * (0.8 + 1.8 * t);
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const phase = total * Math.pow(u, 1 + 0.8 * t);
    pts.push([x + side * amp * Math.sqrt(t) * Math.sin(phase) * (1 - 0.45 * u), y - u * h]);
  }
  return pts;
}

/** 生成一朵花的 SVG 字符串（以原点为花心）。spec: { n, l, w, n2, l2, w2, eye } */
export function flowerMarkup(spec) {
  const petal = (l, w) => `M0 0C${w} ${f(-l * 0.3)} ${w} ${f(-l * 0.85)} 0 ${-l}C${-w} ${f(-l * 0.85)} ${-w} ${f(-l * 0.3)} 0 0Z`;
  const ring = (n, l, w, off, cls) =>
    Array.from({ length: n }, (_, i) => `<path class="${cls}" d="${petal(l, w)}" transform="rotate(${f(off + (i * 360) / n)})"/>`).join("");
  return (
    ring(spec.n, spec.l, spec.w, 0, "f-rim") +
    ring(spec.n, spec.l, spec.w, 0, "f-out") +
    ring(spec.n2, spec.l2, spec.w2, 180 / spec.n2, "f-in") +
    `<circle class="f-eye" r="${spec.eye}"/>`
  );
}

/**
 * 在 g 里画一枝藤蔓：茎 + 交替的叶 + 末端。
 * o: { w 茎粗, gap 叶距, size 叶片缩放, end "flower" | "bud" | "none", flower 花的规格, endScale }
 * 返回叶片数量。
 */
export function vine(g, d, o) {
  const stem = el("path", { d, class: "v-stem", pathLength: 1, "stroke-width": o.w }, g);
  const L = stem.getTotalLength();
  let side = 1, leaves = 0;
  const tangent = (s) => {
    const p = stem.getPointAtLength(s), q = stem.getPointAtLength(Math.min(L, s + 1.5));
    return [p, (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI];
  };
  for (let s = o.gap * 0.7; s < L - o.gap * 0.6; s += o.gap) {
    const [p, ang] = tangent(s);
    const k = o.size * (0.75 + 0.45 * (1 - s / L));
    el("use", {
      href: "#an-leaf", class: "v-leaf",
      transform: `translate(${f(p.x)} ${f(p.y)}) rotate(${f(ang + 90 + side * 54)}) scale(${f(k * 10) / 10})`,
      style: `--d:${f(s / L)}`,
    }, g);
    side = -side; leaves++;
  }
  if (o.end && o.end !== "none") {
    const [p, ang] = tangent(Math.max(0, L - 2));
    const k = o.endScale || 0.36;
    if (o.end === "flower") {
      const fg = el("g", { class: "v-flower", transform: `translate(${f(p.x)} ${f(p.y)}) rotate(${f(ang + 90)}) scale(${k})`, style: "--d:1" }, g);
      fg.innerHTML = flowerMarkup(o.flower);
    } else {
      el("path", { class: "v-bud", d: "M0 4C9 -4 8 -20 0 -28C-8 -20 -9 -4 0 4Z", transform: `translate(${f(p.x)} ${f(p.y)}) rotate(${f(ang + 90)}) scale(${f(k * 2.2)})`, style: "--d:1" }, g);
    }
  }
  return leaves;
}
