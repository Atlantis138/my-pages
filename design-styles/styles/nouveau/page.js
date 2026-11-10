/* 新艺术运动完整页：四季配色、昼夜、海报生成、鞭线、勾线演示、组件、响应式示例、藤蔓画笔与复原。 */
import { el, smooth, thin, curl, whip, flowerMarkup, vine, LEAF_D } from "./vine.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
  del(k) { try { localStorage.removeItem(k); } catch (_) {} },
};
const KEYS = ["an-theme", "an-season"];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

const toastEl = $("#toast");
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
}

/* role="radio" 的按钮组：点击或方向键切换 */
function radioGroup(group, onChange) {
  const items = $$('[role="radio"]', group);
  const mark = (btn) => items.forEach((b) => { b.setAttribute("aria-checked", String(b === btn)); b.tabIndex = b === btn ? 0 : -1; });
  items.forEach((b) => {
    b.addEventListener("click", () => { mark(b); onChange(b); });
    b.addEventListener("keydown", (e) => {
      const i = items.indexOf(b);
      let j = -1;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") j = (i + 1) % items.length;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") j = (i - 1 + items.length) % items.length;
      if (j < 0) return;
      e.preventDefault(); mark(items[j]); items[j].focus(); onChange(items[j]);
    });
  });
  mark(items.find((b) => b.getAttribute("aria-checked") === "true") || items[0]);
  return (pred) => { const b = items.find(pred); if (b) mark(b); };
}

/* =====================================================================
   颜色工具：读出当前生效的变量，算对比度
   ===================================================================== */
const probe = document.createElement("i");
probe.style.cssText = "position:absolute;width:0;height:0;visibility:hidden";
document.body.appendChild(probe);
function hexOf(name) {
  probe.style.color = `var(${name})`;
  const m = getComputedStyle(probe).color.match(/[\d.]+/g).slice(0, 3).map(Number);
  return "#" + m.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
}
function lum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

function copyText(text, ok, fail) {
  try { navigator.clipboard.writeText(text).then(ok, fail); } catch (_) { fail(); }
}

/* =====================================================================
   四季与昼夜
   ===================================================================== */
const SEASONS = {
  spring: { cn: "春", word: "Printemps", flower: { n: 5, l: 44, w: 27, n2: 5, l2: 22, w2: 9, eye: 8 } },
  summer: { cn: "夏", word: "Été", flower: { n: 8, l: 48, w: 21, n2: 8, l2: 28, w2: 11, eye: 11 } },
  autumn: { cn: "秋", word: "Automne", flower: { n: 16, l: 50, w: 9, n2: 16, l2: 32, w2: 7, eye: 9 } },
  winter: { cn: "冬", word: "Hiver", flower: { n: 6, l: 46, w: 15, n2: 6, l2: 24, w2: 8, eye: 7 } },
};
let season = SEASONS[store.get("an-season")] ? store.get("an-season") : "spring";

const darkQuery = matchMedia("(prefers-color-scheme: dark)");
const themeBtn = $("#themeBtn");
let theme = store.get("an-theme");
const isDark = () => (theme ? theme === "dark" : darkQuery.matches);

/* =====================================================================
   海报：五层 = 画框、光环、主体、边饰、字带
   ===================================================================== */
const VINE_D = "M72 508C40 452 104 412 76 352C58 312 86 282 68 234C56 200 64 160 90 134C106 118 128 126 122 143C118 153 105 151 106 142";
function buildPoster(svg, animate) {
  const S = SEASONS[season];
  const ticks = Array.from({ length: 48 }, (_, i) => `<line class="ps-tick" x1="200" y1="${222 - 86}" x2="200" y2="${222 - 98}" transform="rotate(${i * 7.5} 200 222)"/>`).join("");
  const dots = Array.from({ length: 24 }, (_, i) => `<circle class="ps-dot" cx="200" cy="${222 - 76}" r="3" transform="rotate(${i * 15 + 7.5} 200 222)"/>`).join("");
  svg.innerHTML = `
<g class="ly-frame">
  <rect class="ps-bg" x="6" y="6" width="388" height="588" rx="6"/>
  <rect class="ps-frame2" x="16" y="16" width="368" height="568" rx="3"/>
  <path class="ps-frame" d="M40 512V222A160 160 0 0 1 360 222V512Z"/>
  <path class="ps-spandrel" d="M40 40H360V222A160 160 0 0 0 40 222Z"/>
  <path class="ps-frame2" d="M50 512V222A150 150 0 0 1 350 222V512"/>
  <use href="#an-bloom" class="ps-dot" x="48" y="48" width="34" height="34"/><use href="#an-bloom" class="ps-dot" x="318" y="48" width="34" height="34"/>
</g>
<g class="ly-halo">
  <circle class="ps-halo" cx="200" cy="222" r="104"/>
  <g class="ly-halo-spin">${ticks}${dots}</g>
  <circle class="ps-ring" cx="200" cy="222" r="66"/>
</g>
<g class="ly-border${animate ? " growing" : ""}"><g data-vine></g><g data-vine transform="translate(400 0) scale(-1 1)"></g></g>
<g class="ly-figure${animate ? " growing" : ""}" style="--c-out:7px;--c-in:1.4px">
  <path class="f-rim" style="stroke-width:11px" d="M200 512C182 452 216 404 200 300" fill="none"/>
  <path class="v-stem" pathLength="1" stroke-width="5" d="M200 512C182 452 216 404 200 300"/>
  <use href="#an-leaf" class="v-leaf" style="--d:.35;stroke:var(--ink);stroke-width:.7" transform="translate(196 440) rotate(-62) scale(2.3)"/>
  <use href="#an-leaf" class="v-leaf" style="--d:.6;stroke:var(--ink);stroke-width:.7" transform="translate(205 386) rotate(58) scale(2)"/>
  <g class="v-flower" style="--d:.9" transform="translate(200 222) scale(1.5)">${flowerMarkup(S.flower)}</g>
</g>
<g class="ly-band">
  <rect class="ps-band" x="40" y="512" width="320" height="58"/>
  <path class="ps-bandline" d="M40 518H360M40 564H360"/>
  <text class="ps-word" x="206" y="555" lang="fr">${S.word}</text>
</g>`;
  for (const g of $$("[data-vine]", svg)) vine(g, VINE_D, { w: 3.5, gap: 46, size: 1, end: "bud", endScale: 0.2 });
}
const poster = $("#poster"), anatPoster = $("#anatPoster");

/* =====================================================================
   色卡与令牌表（随季节、昼夜实时更新）
   ===================================================================== */
const COLOR_ROLES = [
  ["--paper", "羊皮纸", "页面底色"],
  ["--panel", "旧纸", "卡片与面板底色"],
  ["--ink", "墨褐", "正文、轮廓线"],
  ["--ink2", "淡墨", "注释、次要文字"],
  ["--leaf", "叶", "标题、按钮、茎与框（随季节变）"],
  ["--bloom", "花", "强调、选中状态（随季节变）"],
  ["--gold", "古金", "细线、点缀，只做装饰"],
  ["--rose", "赭红", "错误与警告"],
];
function renderColors() {
  const paper = hexOf("--paper");
  $("#swatches").innerHTML = COLOR_ROLES.filter(([v]) => v !== "--ink2").map(([v, name]) => {
    const hex = hexOf(v);
    return `<button type="button" class="swatch" data-hex="${hex}" aria-label="复制 ${name} ${hex}"><i style="background:${hex}"></i><b>${name}</b><span>${hex}</span></button>`;
  }).join("");
  $("#tokColors tbody").innerHTML = COLOR_ROLES.map(([v, name, use]) => {
    const hex = hexOf(v), c = contrast(hex, paper);
    const verdict = v === "--paper" ? "" : c >= 4.5 ? "可写正文" : c >= 3 ? "大字与图形" : "仅装饰";
    return `<tr><td><i class="tok-sw" style="background:${hex}"></i>${name}</td><td><code>${v}</code></td><td><code>${hex}</code></td><td class="num">${v === "--paper" ? "—" : c.toFixed(1) + " : 1"}<span class="tok-ok">${verdict}</span></td><td>${use}</td></tr>`;
  }).join("");
}
$("#swatches").addEventListener("click", (e) => {
  const sw = e.target.closest(".swatch");
  if (!sw) return;
  copyText(sw.dataset.hex, () => toast(`已复制 ${sw.dataset.hex}`), () => toast(`色值：${sw.dataset.hex}`));
});

/* =====================================================================
   应用季节 / 昼夜
   ===================================================================== */
let pickBar, pickHero;
function applyLook(animate) {
  root.dataset.season = season;
  root.dataset.theme = isDark() ? "dark" : "light";
  themeBtn.setAttribute("aria-checked", String(isDark()));
  pickBar?.((b) => b.dataset.season === season);
  pickHero?.((b) => b.dataset.season === season);
  buildPoster(poster, animate && !reduceMotion.matches);
  buildPoster(anatPoster, false);
  drawContour();
  renderColors();
}
function setSeason(s) {
  season = s;
  s === "spring" ? store.del("an-season") : store.set("an-season", s);
  applyLook(true);
}
pickBar = radioGroup($("#seasons"), (b) => setSeason(b.dataset.season));
pickHero = radioGroup($("#heroSeasons"), (b) => setSeason(b.dataset.season));
themeBtn.addEventListener("click", () => { theme = isDark() ? "light" : "dark"; store.set("an-theme", theme); applyLook(false); });
darkQuery.addEventListener("change", () => { if (!theme) applyLook(false); });
$("#regrow").addEventListener("click", () => buildPoster(poster, !reduceMotion.matches));

/* =====================================================================
   1 · 鞭线与海报拆解
   ===================================================================== */
const whipT = $("#whipT"), whipPath = $("#whipPath"), whipSay = $("#whipSay");
const WHIP_SAY = [
  [8, "<b>直线。</b>工业的线：最省事，也最没有性格。"],
  [36, "<b>弧线。</b>有了方向，但处处一样弯，还是圆规画的。"],
  [70, "<b>S 形。</b>曲线开始回头，有了节奏。"],
  [101, "<b>鞭线。</b>越走越急，末端猛地收成一个卷。这就是新艺术的签名。"],
];
function drawWhip() {
  const t = whipT.value / 100;
  let pts = whip({ x: 150, y: 338, h: 236, amp: 74, t });
  if (t > 0.6) pts = curl(pts, 1.35 * ((t - 0.6) / 0.4), 34 * ((t - 0.6) / 0.4));
  whipPath.setAttribute("d", smooth(pts));
  $("#whipOut").textContent = whipT.value;
  whipSay.innerHTML = WHIP_SAY.find(([max]) => whipT.value < max)[1];
}
whipT.addEventListener("input", drawWhip);
drawWhip();

let pinned = "";
for (const b of $$("#layers button")) {
  const n = b.dataset.hl;
  const on = () => { anatPoster.dataset.hl = n; };
  const off = () => { anatPoster.dataset.hl = pinned; };
  b.addEventListener("pointerenter", on);
  b.addEventListener("pointerleave", off);
  b.addEventListener("focus", on);
  b.addEventListener("blur", off);
  b.addEventListener("click", () => {
    pinned = pinned === n ? "" : n;
    anatPoster.dataset.hl = pinned || n;
    $$("#layers button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.hl === pinned)));
  });
}

/* =====================================================================
   3 · 勾线演示、纹样
   ===================================================================== */
const contourSvg = $("#contourSvg"), cOuter = $("#cOuter"), cInner = $("#cInner");
function drawContour() {
  contourSvg.innerHTML = `
<path class="f-rim" d="M0 66C-10 40 8 26 0 6" fill="none" style="stroke-width:calc(var(--c-out) + 5px)"/>
<path class="v-stem" d="M0 66C-10 40 8 26 0 6" stroke-width="5"/>
<g transform="translate(0 -12) scale(.92)">${flowerMarkup(SEASONS[season].flower)}</g>`;
  setContour();
}
function setContour() {
  const o = +cOuter.value, i = +cInner.value;
  contourSvg.style.setProperty("--c-out", `${o * 2}px`);   /* 描边向两侧各扩一半，露在外面的只有一半 */
  contourSvg.style.setProperty("--c-in", `${i}px`);
  $("#cOuterOut").textContent = `${o.toFixed(1)} px`;
  $("#cInnerOut").textContent = `${i.toFixed(1)} px`;
  const say = $("#contourSay");
  if (o === 0) say.textContent = "没有外轮廓：花和背景粘在了一起。";
  else if (i === 0) say.textContent = "没有内部线：只剩一个剪影，看不出花瓣的层次。";
  else if (o <= i * 1.3) say.textContent = "内外差不多粗：画面变平，分不清哪条线更重要。";
  else if (o / i > 5.5) say.textContent = `外轮廓是内线的 ${(o / i).toFixed(1)} 倍：太重了，像一张贴纸。`;
  else say.textContent = `外轮廓约为内线的 ${(o / i).toFixed(1)} 倍：形体清楚，结构也看得见。`;
}
cOuter.addEventListener("input", setContour);
cInner.addEventListener("input", setContour);

radioGroup($("#patPick"), (b) => $("#patView rect").setAttribute("fill", `url(#an-pat-${b.dataset.pat})`));

/* =====================================================================
   4 · 组件
   ===================================================================== */
const uiForm = $("#uiForm"), dateField = $("#dateField"), dateErr = $("#dateErr"), formOk = $("#formOk");
uiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const m = uiForm.date.value.trim().match(/^(\d{1,2})\s*[\/／.\-]\s*(\d{1,2})$/);
  const ok = m && +m[1] >= 1 && +m[1] <= 12 && +m[2] >= 1 && +m[2] <= 31;
  dateField.classList.toggle("bad", !ok);
  uiForm.date.setAttribute("aria-invalid", String(!ok));
  dateErr.textContent = ok ? "" : "请按「月/日」填写，例如 5/20。";
  formOk.textContent = ok ? `已收到，${uiForm.kind.value}将在 ${+m[1]} 月 ${+m[2]} 日送达。` : "";
  if (!ok) uiForm.date.focus();
});
uiForm.date.addEventListener("input", () => { dateField.classList.remove("bad"); dateErr.textContent = ""; uiForm.date.removeAttribute("aria-invalid"); });

const uiGrow = $("#uiGrow"), uiGrowBar = $("#uiGrowBar");
function setGrow() {
  uiGrowBar.style.setProperty("--v", `${uiGrow.value}%`);
  uiGrowBar.setAttribute("aria-valuenow", uiGrow.value);
  $("#uiGrowOut").textContent = `${uiGrow.value}%`;
}
uiGrow.addEventListener("input", setGrow);
setGrow();

const tabs = $$("#uiTabs [role=tab]");
function selectTab(tab, focus) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
  if (focus) tab.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => selectTab(t));
  t.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); selectTab(tabs[(i + 1) % tabs.length], true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); selectTab(tabs[(i - 1 + tabs.length) % tabs.length], true); }
  });
});

const dlg = $("#dlg");
$("#openDlg").addEventListener("click", () => { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); });
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

/* ---------- 响应式示例：宽度由滑块决定，版式由容器查询决定 ---------- */
const rsStage = $("#rsStage"), rsFrame = $("#rsFrame"), rsWidth = $("#rsWidth"), rsRead = $("#rsRead");
const RS_TEXT = [
  [900, "<b>宽屏</b>：两侧出现藤蔓边饰，主图是带双线的拱形，三张卡片并排。装饰全部到场。"],
  [560, "<b>平板</b>：边饰最先去掉，把宽度还给内容；拱形和花线保留，卡片减为两张。"],
  [0, "<b>手机</b>：拱形收成一条普通的横幅，卡片变成列表，导航折进「菜单」。剩下的装饰只有一条花线和配色，但仍然认得出来。"],
];
function layoutRS() {
  const w = +rsWidth.value;
  const avail = rsStage.clientWidth - 2 * parseFloat(getComputedStyle(rsStage).paddingLeft);
  const k = Math.min(1, avail / w);
  rsFrame.style.width = `${w}px`;
  rsFrame.style.transform = k < 1 ? `scale(${k})` : "";
  rsFrame.style.marginLeft = k < 1 ? "0" : "";
  rsFrame.style.marginBottom = k < 1 ? `${-(1 - k) * rsFrame.offsetHeight}px` : "";
  $("#rsOut").textContent = `${w} px`;
  rsRead.innerHTML = `<b>${w} px</b> · ${RS_TEXT.find(([min]) => w >= min)[1]}${k < 1 ? `（按 ${Math.round(k * 100)}% 缩小显示）` : ""}`;
  $$("#rsPresets button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.w === w)));
}
rsWidth.addEventListener("input", layoutRS);
$$("#rsPresets button").forEach((b) => b.addEventListener("click", () => { rsWidth.value = b.dataset.w; layoutRS(); }));
new ResizeObserver(layoutRS).observe(rsStage);

/* =====================================================================
   5 · 藤蔓画笔
   ===================================================================== */
const labSvg = $("#labSvg"), labVines = $("#labVines"), labDraft = $("#labDraft"), labHint = $("#labHint"), lbStat = $("#lbStat");
const lbGap = $("#lbGap"), lbW = $("#lbW"), lbCurl = $("#lbCurl"), lbMirror = $("#lbMirror");
let labW = 0, labH = 0;
const strokes = [];           /* 每一笔：{ g, leaves } */
function sizeLab() {
  const r = labSvg.getBoundingClientRect();
  if (!r.width) return;
  labW = Math.round(r.width); labH = Math.round(r.height);
  labSvg.setAttribute("viewBox", `0 0 ${labW} ${labH}`);
}
new ResizeObserver(sizeLab).observe(labSvg);
sizeLab();

function labStat() {
  if (!strokes.length) { lbStat.textContent = "画板是空的。"; labHint.classList.remove("off"); return; }
  labHint.classList.add("off");
  const leaves = strokes.reduce((n, s) => n + s.leaves, 0);
  lbStat.textContent = `已画 ${strokes.length} 枝，共 ${leaves} 片叶。导出的 SVG 约 ${(exportSvg().length / 1024).toFixed(1)} KB。`;
}
function addVine(pts) {
  const len = pts.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);
  if (pts.length < 3 || len < 40) return false;
  if (lbCurl.checked) pts = curl(pts, 1.3, Math.min(34, Math.max(12, len * 0.09)));
  const end = $('input[name="lbEnd"]:checked').value;
  const g = el("g", { class: reduceMotion.matches ? "" : "growing" }, labVines);
  const one = el("g", {}, g);
  let leaves = vine(one, smooth(pts), { w: +lbW.value, gap: +lbGap.value, size: 0.55 + lbW.value * 0.13, end, flower: SEASONS[season].flower, endScale: 0.22 + lbW.value * 0.035 });
  if (lbMirror.checked) {
    const two = one.cloneNode(true);
    two.setAttribute("transform", `translate(${labW} 0) scale(-1 1)`);
    g.appendChild(two);
    leaves *= 2;
  }
  strokes.push({ g, leaves });
  labStat();
  return true;
}

/* 指针绘制 */
let drawing = null;
const toLocal = (e) => { const r = labSvg.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
labSvg.addEventListener("pointerdown", (e) => {
  if (e.button > 0) return;
  labSvg.setPointerCapture(e.pointerId);
  drawing = [toLocal(e)];
  labHint.classList.add("off");
});
labSvg.addEventListener("pointermove", (e) => {
  if (!drawing) return;
  const p = toLocal(e), q = drawing[drawing.length - 1];
  if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 4) return;
  drawing.push(p);
  labDraft.setAttribute("d", "M" + drawing.map((d) => `${d[0].toFixed(1)} ${d[1].toFixed(1)}`).join("L"));
});
function endDraw() {
  if (!drawing) return;
  const pts = thin(drawing, 18);
  drawing = null;
  labDraft.removeAttribute("d");
  if (!addVine(pts)) { labStat(); toast("这一笔太短了，再拖长一点"); }
}
labSvg.addEventListener("pointerup", endDraw);
labSvg.addEventListener("pointercancel", endDraw);

$("#lbRandom").addEventListener("click", () => {
  sizeLab();
  const side = Math.random() < 0.5 ? -1 : 1;
  const x = labW * (0.25 + Math.random() * 0.5);
  const pts = whip({ x, y: labH - 14, h: labH * (0.5 + Math.random() * 0.22), amp: Math.min(labW * 0.16, 40 + Math.random() * 50), t: 0.75 + Math.random() * 0.25, side, n: 14 });
  addVine(pts);
});
$("#lbUndo").addEventListener("click", () => { const s = strokes.pop(); if (s) s.g.remove(); labStat(); });
$("#lbClear").addEventListener("click", () => { strokes.length = 0; labVines.innerHTML = ""; labStat(); });
$("#lbGap").addEventListener("input", () => ($("#lbGapOut").textContent = lbGap.value));
$("#lbW").addEventListener("input", () => ($("#lbWOut").textContent = (+lbW.value).toFixed(1)));

/* 导出：把 CSS 变量换成实际色值，把 <use> 换成路径，得到一份不依赖本页的 SVG */
function exportSvg() {
  const c = { leaf: hexOf("--leaf"), bloom: hexOf("--bloom"), gilt: hexOf("--gilt"), ink: hexOf("--ink") };
  const clone = labVines.cloneNode(true);
  const paint = {
    "v-stem": (n) => { n.setAttribute("fill", "none"); n.setAttribute("stroke", c.leaf); n.setAttribute("stroke-linecap", "round"); },
    "v-leaf": (n) => {
      const p = el("path", { d: LEAF_D, fill: c.leaf, transform: n.getAttribute("transform") });
      n.replaceWith(p);
    },
    "v-bud": (n) => { n.setAttribute("fill", c.bloom); n.setAttribute("stroke", c.ink); n.setAttribute("stroke-width", "1.2"); },
    "f-rim": (n) => n.remove(),
    "f-out": (n) => { n.setAttribute("fill", c.bloom); n.setAttribute("stroke", c.ink); n.setAttribute("stroke-width", "1.2"); },
    "f-in": (n) => { n.setAttribute("fill", c.gilt); n.setAttribute("stroke", c.ink); n.setAttribute("stroke-width", "1.2"); },
    "f-eye": (n) => { n.setAttribute("fill", c.leaf); n.setAttribute("stroke", c.ink); n.setAttribute("stroke-width", "1.2"); },
  };
  for (const n of [...clone.querySelectorAll("*")]) {
    const cls = n.getAttribute("class");
    n.removeAttribute("style"); n.removeAttribute("pathLength");
    if (cls && paint[cls]) paint[cls](n);
    n.removeAttribute("class");
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${labW} ${labH}">${clone.innerHTML}</svg>`;
}
$("#lbCopy").addEventListener("click", () => {
  if (!strokes.length) return toast("先画一笔，或点「随机一枝」");
  copyText(exportSvg(), () => toast("SVG 已复制"), () => toast("复制失败，请改用下载"));
});
$("#lbSave").addEventListener("click", () => {
  if (!strokes.length) return toast("先画一笔，或点「随机一枝」");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([exportSvg()], { type: "image/svg+xml" }));
  a.download = "art-nouveau-vine.svg";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast("已下载 art-nouveau-vine.svg");
});

/* =====================================================================
   6 · 只播一次的生长动画
   ===================================================================== */
const onceStem = $(".v-stem.once");
function replayOnce() { onceStem.classList.remove("once"); void onceStem.getBoundingClientRect(); onceStem.classList.add("once"); }
$("#replayOnce").addEventListener("click", replayOnce);
new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { replayOnce(); io.disconnect(); } }, { threshold: 0.6 }).observe(onceStem);

/* =====================================================================
   scroll spy · copy · reset
   ===================================================================== */
const links = $$(".toc a");
const spy = new IntersectionObserver((entries) => {
  for (const en of entries) if (en.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${en.target.id}`)));
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main > section").forEach((s) => spy.observe(s));

$$("[data-copy]").forEach((btn) => btn.addEventListener("click", () => {
  const code = document.getElementById(btn.dataset.copy);
  const done = (t) => { btn.textContent = t; setTimeout(() => (btn.textContent = "复制"), 1400); };
  const fallback = () => {
    const r = document.createRange(); r.selectNodeContents(code);
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    done("已选中");
  };
  copyText(code.textContent, () => done("已复制"), fallback);
}));

/* 一键复原：清掉本页保存的设置，把表单控件改回默认值（避免浏览器在刷新后恢复它们），再重新载入 */
$("#resetBtn").addEventListener("click", () => {
  KEYS.forEach(store.del);
  $$("input, select").forEach((i) => {
    if (i.type === "checkbox" || i.type === "radio") i.checked = i.defaultChecked;
    else if (i.tagName === "SELECT") i.selectedIndex = [...i.options].findIndex((o) => o.defaultSelected) > -1 ? [...i.options].findIndex((o) => o.defaultSelected) : 0;
    else i.value = i.defaultValue;
  });
  try { sessionStorage.setItem("an-reset", "1"); } catch (_) {}
  location.reload();
});
try {
  if (sessionStorage.getItem("an-reset")) { sessionStorage.removeItem("an-reset"); toast("已恢复初始状态"); }
} catch (_) {}

/* ---------- boot ---------- */
applyLook(true);
if (rsStage.clientWidth < 600) rsWidth.value = 375;   /* 窄屏上先展示手机宽度，免得缩得太小 */
layoutRS();
labStat();
