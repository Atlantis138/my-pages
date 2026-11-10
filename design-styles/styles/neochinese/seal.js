/*
 * 制印：把一到四个字画成一方印（Canvas），并生成对应的纯 CSS 写法。
 * 残破效果是随机打上去的缺口，属于示意，不是真实的刻石痕迹。
 */
const RED = "#B7312C";

function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** 把印面分成格子。四字印按传统从右上起读：右上、右下、左上、左下。 */
function cells(n, x, y, w, h) {
  if (n <= 1) return [[x, y, w, h]];
  if (n === 2) return [[x, y, w, h / 2], [x, y + h / 2, w, h / 2]];
  const hw = w / 2;
  if (n === 3) return [[x + hw, y, hw, h], [x, y, hw, h / 2], [x, y + h / 2, hw, h / 2]];
  return [[x + hw, y, hw, h / 2], [x + hw, y + h / 2, hw, h / 2], [x, y, hw, h / 2], [x, y + h / 2, hw, h / 2]];
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{text:string, mode:"bai"|"zhu", shape:"square"|"round"|"tall", font:string, rough:number, seed:number}} o
 */
export function drawSeal(canvas, o) {
  const S = canvas.width, ctx = canvas.getContext("2d");
  const chars = [...o.text], rand = rng(o.seed * 1000 + chars.length);
  const w = o.shape === "tall" ? S * 0.52 : S * 0.86, h = S * 0.86;
  const x = (S - w) / 2, y = (S - h) / 2, cx = S / 2, cy = S / 2;
  const outline = () => {
    ctx.beginPath();
    if (o.shape === "round") ctx.arc(cx, cy, h / 2, 0, Math.PI * 2);
    else ctx.roundRect(x, y, w, h, S * 0.035);
  };

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.clearRect(0, 0, S, S);
  ctx.fillStyle = ctx.strokeStyle = RED;

  const edge = S * 0.045;                      /* 朱文印的边框粗细 */
  if (o.mode === "bai") { outline(); ctx.fill(); ctx.globalCompositeOperation = "destination-out"; }
  else { ctx.save(); outline(); ctx.clip(); ctx.lineWidth = edge * 2; outline(); ctx.stroke(); ctx.restore(); }

  /* 字：撑满各自的格子，像刻印时那样把笔画挤到边上 */
  const pad = o.mode === "bai" ? S * 0.07 : edge + S * 0.045;
  const k = o.shape === "round" ? 0.7 : 1;      /* 圆印取内接的方形 */
  const iw = (w - pad * 2) * k, ih = (h - pad * 2) * k;
  const weight = o.font === "Noto Serif SC" ? 900 : 400;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  cells(chars.length, cx - iw / 2, cy - ih / 2, iw, ih).forEach(([gx, gy, gw, gh], i) => {
    const fs = Math.min(gh, gw * 1.5) * 0.9;
    ctx.font = `${weight} ${fs}px "${o.font}", "Noto Serif SC", serif`;
    const m = ctx.measureText(chars[i]).width || fs;
    const sx = Math.min(1.5, Math.max(0.55, (gw * 0.9) / m)), sy = Math.min(1.6, Math.max(0.7, (gh * 0.9) / fs));
    ctx.save();
    ctx.translate(gx + gw / 2, gy + gh / 2 + fs * 0.03 * sy);
    ctx.scale(sx, sy);
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
  });

  /* 残破：沿边多打一些缺口，印面内零星几点 */
  ctx.globalCompositeOperation = "destination-out";
  const count = Math.round(o.rough * 2.4);
  for (let i = 0; i < count; i++) {
    let px, py;
    if (rand() < 0.6) {
      if (o.shape === "round") { const a = rand() * 6.283, r = h / 2 - rand() * rand() * 14; px = cx + Math.cos(a) * r; py = cy + Math.sin(a) * r; }
      else {
        const t = rand(), side = Math.floor(rand() * 4), j = rand() * rand() * 12;
        px = side < 2 ? x + t * w : side === 2 ? x + j : x + w - j;
        py = side === 0 ? y + j : side === 1 ? y + h - j : y + t * h;
      }
    } else { px = x + rand() * w; py = y + rand() * h; }
    const r = (0.6 + rand() * rand() * 5.5) * (0.5 + o.rough / 100) * (S / 360);
    ctx.beginPath();
    ctx.ellipse(px, py, r, r * (0.5 + rand() * 0.8), rand() * 3.14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

/** 同一方印的纯 CSS 写法（不含残破效果）。 */
export function sealCss(text, mode, shape, font) {
  const n = [...text].length;
  const face = font === "Noto Serif SC" ? `900 1em/1.05 "Noto Serif SC", serif` : `400 1em/1.05 "${font}", "Noto Serif SC", serif`;
  const size = n >= 3 ? "\n  width: 2.6em; height: 2.6em; text-align: center;" : "";
  return `<span class="seal">${text}</span>

.seal {
  display: inline-block;
  writing-mode: vertical-rl;       /* 竖排，多于两字时自动从右往左换列 */${size}
  padding: .28em .22em;
  font: ${face};
  border-radius: ${shape === "round" ? "50%" : "3px"};
  ${mode === "bai" ? "background: #B7312C; color: #F3EEE3;       /* 白文：红底白字 */" : "color: #B7312C;\n  box-shadow: inset 0 0 0 2px #B7312C;       /* 朱文：白底红字 */"}
}`;
}
