/*
 * 六个装饰艺术母题，各自生成一个可以直接写进 background-image 的值。
 * 直线和放射用 CSS 渐变；带折角或圆弧的线用一小块内联 SVG 平铺。
 * 母题陈列和「纹样工坊」共用这里的函数。
 */
const n = (v) => +v.toFixed(2);

/** 把一块 SVG 平铺单元编码成 url("data:…")。只转义必须转义的字符，生成的代码还读得懂。 */
function tile(w, h, body, rgb, a, sw) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${n(w)}' height='${n(h)}'><g fill='none' stroke='rgb(${rgb.join(",")})' stroke-opacity='${n(a)}' stroke-width='${n(sw)}'>${body}</g></svg>`;
  return `url("data:image/svg+xml,${svg.replace(/</g, "%3C").replace(/>/g, "%3E").replace(/#/g, "%23")}")`;
}

/**
 * @param {string} name   sunburst | steps | chevron | scales | lattice | speed
 * @param {number} s      尺寸（一个重复单元的大小，px）
 * @param {number} w      线宽（px）
 * @param {number[]} rgb  颜色 [r, g, b]
 * @param {number} a      不透明度 0…1
 */
export function motifImage(name, s, w, rgb, a) {
  const C = `rgb(${rgb.join(" ")} / ${n(a)})`;
  switch (name) {
    case "sunburst": {
      const p = n(s / 5);                         /* 一道光芒占的角度 */
      const d = n(p * Math.min(0.8, w / 8));
      return `repeating-conic-gradient(from -90deg at 50% 100%, ${C} 0 ${d}deg, transparent ${d}deg ${p}deg)`;
    }
    case "lattice":
      return `repeating-linear-gradient(45deg, ${C} 0 ${w}px, transparent ${w}px ${s}px), repeating-linear-gradient(-45deg, ${C} 0 ${w}px, transparent ${w}px ${s}px)`;
    case "speed": {
      const g = Math.max(3, n(w * 2.5));          /* 三条线之间的间隔 */
      const end = Math.max(s, 3 * w + 4 * g);
      return `repeating-linear-gradient(180deg, ${C} 0 ${w}px, transparent ${w}px ${n(w + g)}px, ${C} ${n(w + g)}px ${n(2 * w + g)}px, transparent ${n(2 * w + g)}px ${n(2 * w + 2 * g)}px, ${C} ${n(2 * w + 2 * g)}px ${n(3 * w + 2 * g)}px, transparent ${n(3 * w + 2 * g)}px ${n(end)}px)`;
    }
    case "steps": {
      const u = s / 4;                            /* 一级台阶的宽和高 */
      const body = `<path d='M${n(-0.5 * u)} ${n(2.5 * u)}H${n(0.5 * u)}V${n(1.5 * u)}H${n(1.5 * u)}V${n(0.5 * u)}H${n(2.5 * u)}V${n(1.5 * u)}H${n(3.5 * u)}V${n(2.5 * u)}H${n(4.5 * u)}'/>`;
      return tile(s, 3 * u, body, rgb, a, w);
    }
    case "chevron": {
      const p = s / 2;
      const body = `<path d='M${n(-s / 2)} ${n(0.25 * p)}L0 ${n(0.75 * p)}L${n(s / 2)} ${n(0.25 * p)}L${n(s)} ${n(0.75 * p)}L${n(1.5 * s)} ${n(0.25 * p)}'/>`;
      return tile(s, p, body, rgb, a, w);
    }
    case "scales": {
      /* 两排半圆错开半个身位。每个半圆只画没被下一排挡住的那段弧，线才不会交叉。 */
      const r = s / 2;
      const arc = (x1, y1, x2, y2) => `<path d='M${n(x1 * r)} ${n(y1 * r)}A${n(r)} ${n(r)} 0 0 1 ${n(x2 * r)} ${n(y2 * r)}'/>`;
      const body = arc(0.129, 0.759, 1.871, 0.759) + arc(0, 0.75, 0.871, 1.259) + arc(1.129, 1.259, 2, 0.75) + arc(0, -0.25, 0.871, 0.259) + arc(1.129, 0.259, 2, -0.25);
      return tile(s, r, body, rgb, a, w);
    }
  }
  return "none";
}

export const MOTIF_NOTE = {
  sunburst: "放射：一行 repeating-conic-gradient。圆心放在底边中点，角度越小光芒越密。",
  steps: "阶梯：带直角转折的线用渐变画不出来，这里把一小块 SVG 编码进 url() 里平铺。",
  chevron: "人字：同样是内联 SVG。折线画得比单元宽一些，拼接处的尖角才完整。",
  scales: "扇鳞：内联 SVG。每个半圆只画露在外面的那段弧，所以线不会互相穿过。",
  lattice: "菱格：两道方向相反的 repeating-linear-gradient 叠在一起。",
  speed: "速度线：一道水平的 repeating-linear-gradient，三条线一组，组与组之间留白。",
};
