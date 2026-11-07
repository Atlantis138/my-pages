/*
 * 动态配色的简化实现。
 *
 * Material 3 用 HCT 色彩空间（CAM16 的色相、彩度 + CIELAB 的明度 L*）从一个种子色生成五组色调板，
 * 再按固定的「色调编号」给每个颜色角色取值。这里用 CIELAB 的 LCh 近似 HCT：
 * 明度 L* 与 HCT 的 Tone 完全一致（所以对比度规律也一致），色相和彩度只是近似。
 */

/* ---------- sRGB ⇄ CIELAB (D65) ---------- */

const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const WHITE = [0.95047, 1, 1.08883];

export function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? [...h].map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function rgbToHex(rgb) {
  return "#" + rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToLch([r, g, b]) {
  const [R, G, B] = [r, g, b].map((v) => toLinear(v / 255));
  const xyz = [
    0.4124564 * R + 0.3575761 * G + 0.1804375 * B,
    0.2126729 * R + 0.7151522 * G + 0.072175 * B,
    0.0193339 * R + 0.119192 * G + 0.9503041 * B,
  ];
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const [fx, fy, fz] = xyz.map((v, i) => f(v / WHITE[i]));
  const L = 116 * fy - 16, a = 500 * (fx - fy), bb = 200 * (fy - fz);
  return { l: L, c: Math.hypot(a, bb), h: ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360 };
}

/* 返回线性 sRGB；超出色域时分量会落在 [0,1] 之外 */
function lchToLinear(l, c, h) {
  const a = c * Math.cos((h * Math.PI) / 180), b = c * Math.sin((h * Math.PI) / 180);
  const fy = (l + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
  const inv = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));
  const [X, Y, Z] = [inv(fx), l > 8 ? fy ** 3 : l / (24389 / 27), inv(fz)].map((v, i) => v * WHITE[i]);
  return [
    3.2404542 * X - 1.5371385 * Y - 0.4985314 * Z,
    -0.969266 * X + 1.8760108 * Y + 0.041556 * Z,
    0.0556434 * X - 0.2040259 * Y + 1.0572252 * Z,
  ];
}
const inGamut = (rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** 给定色相、期望彩度和色调（0–100），在 sRGB 色域内取彩度尽量接近期望值的颜色。 */
export function tone(h, c, t) {
  if (t <= 0) return "#000000";
  if (t >= 100) return "#FFFFFF";
  let lo = 0, hi = c, best = lchToLinear(t, 0, h);
  if (inGamut(lchToLinear(t, c, h))) best = lchToLinear(t, c, h);
  else {
    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2, rgb = lchToLinear(t, mid, h);
      if (inGamut(rgb)) { lo = mid; best = rgb; } else hi = mid;
    }
  }
  return rgbToHex(best.map((v) => toGamma(Math.min(1, Math.max(0, v))) * 255));
}

/* ---------- palettes & roles ---------- */

export const TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

/** 由种子色生成 M3 的五组关键色调板（primary / secondary / tertiary / neutral / neutral variant）。 */
export function palettesFrom(seed) {
  const { h, c } = rgbToLch(hexToRgb(seed));
  const spec = {
    primary: [h, Math.max(c, 52)],
    secondary: [h, 18],
    tertiary: [(h + 60) % 360, 30],
    neutral: [h, 4],
    neutralVariant: [h, 9],
    error: [38, 72],
  };
  const out = {};
  for (const [k, [hh, cc]] of Object.entries(spec)) {
    out[k] = (t) => tone(hh, cc, t);
    out[k].hue = hh;
    out[k].chroma = cc;
  }
  return out;
}

/* 颜色角色 → [色调板, 浅色主题色调, 深色主题色调]；对应 M3 的 md.sys.color.* 令牌 */
const ROLES = {
  "primary": ["primary", 40, 80], "on-primary": ["primary", 100, 20],
  "primary-container": ["primary", 90, 30], "on-primary-container": ["primary", 10, 90],
  "secondary": ["secondary", 40, 80], "on-secondary": ["secondary", 100, 20],
  "secondary-container": ["secondary", 90, 30], "on-secondary-container": ["secondary", 10, 90],
  "tertiary": ["tertiary", 40, 80], "on-tertiary": ["tertiary", 100, 20],
  "tertiary-container": ["tertiary", 90, 30], "on-tertiary-container": ["tertiary", 10, 90],
  "error": ["error", 40, 80], "on-error": ["error", 100, 20],
  "error-container": ["error", 90, 30], "on-error-container": ["error", 10, 90],
  "surface": ["neutral", 98, 6], "surface-dim": ["neutral", 87, 6], "surface-bright": ["neutral", 98, 24],
  "surface-container-lowest": ["neutral", 100, 4], "surface-container-low": ["neutral", 96, 10],
  "surface-container": ["neutral", 94, 12], "surface-container-high": ["neutral", 92, 17],
  "surface-container-highest": ["neutral", 90, 22],
  "on-surface": ["neutral", 10, 90], "on-surface-variant": ["neutralVariant", 30, 80],
  "outline": ["neutralVariant", 50, 60], "outline-variant": ["neutralVariant", 80, 30],
  "inverse-surface": ["neutral", 20, 90], "inverse-on-surface": ["neutral", 95, 20],
  "inverse-primary": ["primary", 80, 40], "scrim": ["neutral", 0, 0], "shadow": ["neutral", 0, 0],
};

export function schemeFrom(seed, dark) {
  const p = palettesFrom(seed);
  const out = {};
  for (const [role, [pal, lt, dk]] of Object.entries(ROLES)) {
    out[role] = { hex: p[pal](dark ? dk : lt), palette: pal, tone: dark ? dk : lt };
  }
  return { roles: out, palettes: p };
}

/* ---------- contrast ---------- */

export function contrast(a, b) {
  const lum = (hex) => {
    const [r, g, b2] = hexToRgb(hex).map((v) => toLinear(v / 255));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b2;
  };
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
