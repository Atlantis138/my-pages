/*
 * 海报构成器：按固定规则 + 种子随机数生成一张构成，可导出 SVG 或 PNG。
 * 规则是本页自定的简化版：一大两小三个图形（大的出血）、黑条吸附 25 单位网格且不压标题、标题尽量大。
 * 两种尺寸：海报 300 × 400，网页分享图 600 × 315（导出为 1200 × 630，可用作 og:image）。
 * compose() 只产出一份图元清单，toSVG() 与 drawPNG() 分别把它画成 SVG 字符串和画布。
 * 图形颜色跟随页首问卷（getAnswer）；海报本身用固定色值，导出后不依赖页面变量。
 */
const $ = (s) => document.querySelector(s);
const PAL = { red: "#D8352A", yellow: "#F2B705", blue: "#1E4C9A", ink: "#151515", paper: "#EFE9DC" };
const SIZES = { poster: { W: 300, H: 400, out: [1200, 1600] }, og: { W: 600, H: 315, out: [1200, 630] } };
const U = 25;
const FONT = "Jost, Futura, 'Century Gothic', sans-serif";
const DEFAULTS = { seed: 1923, title: "Bauhaus", sub: "Ausstellung · Weimar", lower: true, diag: false, over: true, dark: false, size: "poster" };

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const snap = (v, step = U / 2) => Math.round(v / step) * step;

/* ---------- composition model ---------- */
export function compose(o, answer) {
  const { W, H } = SIZES[o.size] || SIZES.poster;
  const R = rng(o.seed);
  const pick = (a) => a[Math.floor(R() * a.length)];
  const int = (a, b) => a + Math.floor(R() * (b - a + 1));
  const kinds = ["ci", "sq", "tri"];
  for (let i = kinds.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [kinds[i], kinds[j]] = [kinds[j], kinds[i]]; }
  const bg = o.dark ? PAL.ink : PAL.paper, fg = o.dark ? PAL.paper : PAL.ink;
  const blend = o.over && !o.dark;
  const base = Math.min(W, H) / 300;              // 图形尺寸按短边缩放
  const cols = Math.floor(W / U), rows = Math.floor(H / U);

  /* 1 · 一个大图形，中心靠近边缘，保证出血 */
  const spots = [[0.86, 0.2], [0.14, 0.22], [0.9, 0.55], [0.1, 0.5], [0.82, 0.84], [0.18, 0.86]];
  const [bx, by] = pick(spots);
  const big = { kind: kinds[0], size: snap(int(7, 10) * U * base), x: snap(bx * W), y: snap(by * H) };
  /* 2 · 两个小图形，放在离已有图形尽量远的位置 */
  const cands = [];
  for (let gx = 2; gx <= cols - 2; gx += 2) for (let gy = 2; gy <= rows - 2; gy += 2) cands.push([gx * U, gy * U]);
  const placed = [[big.x, big.y, big.size / 2]];
  const others = [[kinds[1], int(3, 4) * U * base], [kinds[2], int(1, 2) * U * base]].map(([kind, size]) => {
    size = snap(size);
    const pool = cands.filter(([x, y]) => placed.every(([px, py, pr]) => Math.hypot(x - px, y - py) > pr + size / 2 + 12));
    const [x, y] = pool.length ? pick(pool) : pick(cands);
    placed.push([x, y, size / 2]);
    return { kind, size, x, y };
  });
  const rotFor = (k) => (k === "tri" ? pick([0, 90, 180, 270]) : k === "sq" && R() < 0.3 ? 45 : 0);
  const shapes = [big, ...others].map((s) => ({ ...s, rot: rotFor(s.kind), fill: PAL[answer[s.kind]] }));

  /* 3 · 标题尽量大，字宽按 0.56 em 估算；先定文字位置，黑条再绕开它 */
  const title = o.lower ? o.title.toLowerCase() : o.title;
  const sub = o.lower ? o.sub.toLowerCase() : o.sub;
  const L = Math.max(title.length, 1), sw = sub.length * 7.6;
  const texts = [];
  let box, sbox = [0, 0, 0, 0];
  if (o.diag) {
    const lmax = W > H ? 560 : 330;
    const fs = Math.min(H * 0.3, 100, lmax / (L * 0.56)), y = H / 2 + fs * 0.3, w = L * 0.56 * fs;
    texts.push({ big: true, x: W / 2, y, fs, str: title, anchor: "middle" }, { x: W / 2, y: y + 26, str: sub, anchor: "middle" });
    box = [W / 2 - w / 2, y - fs * 0.8, W / 2 + w / 2, y + 32];
  } else {
    const layout = W > H ? pick(["bottom", "top"]) : pick(["bottom", "top", "left"]);
    if (layout === "left") {
      const fs = Math.min(112, (H - 40) / (L * 0.56)), x = 14 + fs * 0.74;
      texts.push({ big: true, x, y: H - 20, fs, str: title, rot: -90 }, { x: W - 16, y: H - 18, str: sub, anchor: "end" });
      box = [0, H - 20 - L * 0.56 * fs, x + fs * 0.25, H];
      sbox = [W - 16 - sw, H - 30, W, H];
    } else {
      const fs = Math.min(112, H * 0.36, (W - 36) / (L * 0.56));
      const y = layout === "bottom" ? H - 34 : 22 + fs * 0.74;
      texts.push({ big: true, x: 18, y, fs, str: title }, { x: 20, y: layout === "bottom" ? 30 : H - 20, str: sub });
      box = [0, y - fs * 0.8, W, y + fs * 0.25];
      sbox = layout === "bottom" ? [20, 18, 20 + sw, 34] : [20, H - 32, 20 + sw, H];
    }
  }
  const hit = (b, x, y, w, h) => x < b[2] + 6 && x + w > b[0] - 6 && y < b[3] + 6 && y + h > b[1] - 6;

  /* 4 · 黑条只放在网格线上，并且不压住文字 */
  const bars = [];
  const nBars = int(1, 3);
  for (let i = 0, tries = 0; i < nBars && tries < 40; tries++) {
    const th = pick([6, 10, 14]);
    let r;
    if (R() < 0.6) {
      const len = int(4, Math.min(11, cols - 1)) * U;
      r = [R() < 0.5 ? 0 : int(0, cols - len / U) * U, int(2, rows - 2) * U, len, th];
    } else {
      const len = int(4, Math.min(12, rows - 1)) * U;
      r = [int(1, cols - 1) * U, R() < 0.5 ? H - len : int(0, rows - len / U) * U, th, len];
    }
    if (hit(box, ...r) || hit(sbox, ...r)) continue;
    bars.push(r);
    i++;
  }
  return { W, H, bg, fg, blend, shapes, bars, texts, groupRot: o.diag ? -30 : 0 };
}

/* ---------- renderers ---------- */
const triPts = (s) => { const h = s.size / 2; return [[s.x, s.y - h], [s.x + h, s.y + h], [s.x - h, s.y + h]]; };

export function toSVG(m, [ow, oh] = [m.W, m.H]) {
  const st = m.blend ? ' style="mix-blend-mode:multiply"' : "";
  const shapes = m.shapes.map((s) => {
    const tf = s.rot ? ` transform="rotate(${s.rot} ${s.x} ${s.y})"` : "", h = s.size / 2;
    if (s.kind === "ci") return `<circle cx="${s.x}" cy="${s.y}" r="${h}" fill="${s.fill}"${st}/>`;
    if (s.kind === "sq") return `<rect x="${s.x - h}" y="${s.y - h}" width="${s.size}" height="${s.size}" fill="${s.fill}"${tf}${st}/>`;
    return `<polygon points="${triPts(s).map((p) => p.join(",")).join(" ")}" fill="${s.fill}"${tf}${st}/>`;
  }).join("");
  const bars = m.bars.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${m.fg}"/>`).join("");
  const texts = m.texts.map((t) => {
    const size = t.big ? t.fs : 11, weight = t.big ? 700 : 500;
    const extra = (t.anchor ? ` text-anchor="${t.anchor}"` : "") + (t.rot ? ` transform="rotate(${t.rot} ${t.x} ${t.y})"` : "") + (t.big ? "" : ' letter-spacing="1.6"');
    return `<text x="${t.x}" y="${t.y}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${m.fg}"${extra}>${esc(t.str)}</text>`;
  }).join("");
  const top = m.groupRot ? `<g transform="rotate(${m.groupRot} ${m.W / 2} ${m.H / 2})">${bars}${texts}</g>` : bars + texts;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${m.W} ${m.H}" width="${ow}" height="${oh}">
<defs><clipPath id="bh-pc"><rect width="${m.W}" height="${m.H}"/></clipPath></defs>
<g clip-path="url(#bh-pc)"><g style="isolation:isolate"><rect width="${m.W}" height="${m.H}" fill="${m.bg}"/>${shapes}</g>${top}</g>
</svg>`;
}

export async function drawPNG(m, [ow, oh]) {
  try { await document.fonts.load('700 40px "Jost"'); await document.fonts.load('500 11px "Jost"'); } catch (_) {}
  const cv = Object.assign(document.createElement("canvas"), { width: ow, height: oh });
  const ctx = cv.getContext("2d");
  ctx.scale(ow / m.W, oh / m.H);
  ctx.fillStyle = m.bg; ctx.fillRect(0, 0, m.W, m.H);
  ctx.globalCompositeOperation = m.blend ? "multiply" : "source-over";
  for (const s of m.shapes) {
    ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(((s.rot || 0) * Math.PI) / 180); ctx.translate(-s.x, -s.y);
    ctx.fillStyle = s.fill; ctx.beginPath();
    const h = s.size / 2;
    if (s.kind === "ci") ctx.arc(s.x, s.y, h, 0, Math.PI * 2);
    else if (s.kind === "sq") ctx.rect(s.x - h, s.y - h, s.size, s.size);
    else { const p = triPts(s); ctx.moveTo(...p[0]); ctx.lineTo(...p[1]); ctx.lineTo(...p[2]); ctx.closePath(); }
    ctx.fill(); ctx.restore();
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.save();
  if (m.groupRot) { ctx.translate(m.W / 2, m.H / 2); ctx.rotate((m.groupRot * Math.PI) / 180); ctx.translate(-m.W / 2, -m.H / 2); }
  ctx.fillStyle = m.fg;
  for (const [x, y, w, h] of m.bars) ctx.fillRect(x, y, w, h);
  for (const t of m.texts) {
    ctx.save();
    ctx.font = t.big ? `700 ${t.fs}px Jost, Futura, sans-serif` : "500 11px Jost, Futura, sans-serif";
    if ("letterSpacing" in ctx) ctx.letterSpacing = t.big ? "0px" : "1.6px";
    ctx.textAlign = t.anchor === "middle" ? "center" : t.anchor === "end" ? "right" : "left";
    ctx.textBaseline = "alphabetic";
    ctx.translate(t.x, t.y); if (t.rot) ctx.rotate((t.rot * Math.PI) / 180);
    ctx.fillText(t.str, 0, 0);
    ctx.restore();
  }
  ctx.restore();
  return new Promise((res) => cv.toBlob(res, "image/png"));
}

/* ---------- UI ---------- */
function save(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function initPoster({ store, getAnswer, toast }) {
  const frame = $("#mkFrame"), no = $("#mkNo");
  const sizeBtns = [...document.querySelectorAll('#mkSize [role="radio"]')];
  const el = { title: $("#mkTitle"), sub: $("#mkSub"), lower: $("#mkLower"), diag: $("#mkDiag"), over: $("#mkOver"), dark: $("#mkDark") };
  let o = { ...DEFAULTS };
  try { Object.assign(o, JSON.parse(store.get("bh-poster")) || {}); } catch (_) {}
  if (!SIZES[o.size]) o.size = "poster";
  el.title.value = o.title; el.sub.value = o.sub;
  for (const k of ["lower", "diag", "over", "dark"]) el[k].checked = !!o[k];

  let model;
  function render(persist = true) {
    el.over.disabled = o.dark;
    model = compose(o, getAnswer());
    frame.classList.toggle("og", o.size === "og");
    frame.innerHTML = toSVG(model).replace("<svg ", `<svg role="img" aria-label="${o.size === "og" ? "分享图" : "海报"}预览：${esc(o.title || "无标题")}，构成 ${o.seed}" `);
    no.textContent = `构成 No. ${String(o.seed).padStart(4, "0")} · ${SIZES[o.size].out.join(" × ")}`;
    sizeBtns.forEach((b) => { const on = b.dataset.v === o.size; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; });
    if (persist) store.set("bh-poster", JSON.stringify(o));
  }
  sizeBtns.forEach((b, i) => {
    b.addEventListener("click", () => { o.size = b.dataset.v; render(); });
    b.addEventListener("keydown", (e) => {
      if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
      e.preventDefault();
      const next = sizeBtns[(i + (e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : sizeBtns.length - 1)) % sizeBtns.length];
      o.size = next.dataset.v; render(); next.focus();
    });
  });
  el.title.addEventListener("input", () => { o.title = el.title.value; render(); });
  el.sub.addEventListener("input", () => { o.sub = el.sub.value; render(); });
  for (const k of ["lower", "diag", "over", "dark"]) el[k].addEventListener("change", () => { o[k] = el[k].checked; render(); });
  $("#mkShuffle").addEventListener("click", () => {
    let n; do { n = 1 + Math.floor(Math.random() * 9999); } while (n === o.seed);
    o.seed = n; render();
  });
  const fname = (ext) => `bauhaus-${o.size === "og" ? "og-" : ""}${o.seed}.${ext}`;
  $("#mkSave").addEventListener("click", () => {
    save(new Blob([toSVG(model, SIZES[o.size].out)], { type: "image/svg+xml" }), fname("svg"));
    toast("已下载 SVG");
  });
  $("#mkPng").addEventListener("click", async () => {
    const blob = await drawPNG(model, SIZES[o.size].out);
    if (blob) { save(blob, fname("png")); toast(`已下载 PNG · ${SIZES[o.size].out.join(" × ")}`); }
    else toast("这个浏览器无法导出 PNG");
  });
  document.addEventListener("bh:answer", () => render(false));
  render(false);
}
