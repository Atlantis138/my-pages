/* 野兽派完整页：拆掉 CSS、模板印痕、材料清单、七条规矩的演示、去装修实验、令牌表。
   JavaScript 只做增强：关掉它，页面的全部内容依然可读。 */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
  del(k) { try { localStorage.removeItem(k); } catch (_) {} },
};
function toast(text) {
  const t = $("#toast");
  t.textContent = text; t.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove("show"), 2600);
}
const enc = new TextEncoder();
const bytes = (s) => enc.encode(s).length;
const kb = (n) => (n == null ? "未知" : `${(n / 1024).toFixed(1)} KB（${n.toLocaleString("en-US")} 字节）`);

/* ---------- 颜色：把系统颜色关键字解析成 rgb，计算对比度 ---------- */
function resolve(color) {
  const p = document.createElement("i");
  p.style.color = color; p.style.display = "none";
  document.body.appendChild(p);
  const m = getComputedStyle(p).color.match(/[\d.]+/g).map(Number);
  p.remove();
  return m.slice(0, 3);
}
const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

/* =====================================================================
   明暗：只改 color-scheme
   ===================================================================== */
const darkQuery = matchMedia("(prefers-color-scheme: dark)");
let theme = store.get("br-theme");
const isDark = () => (theme ? theme === "dark" : darkQuery.matches);
function applyTheme() {
  const dark = isDark();
  if (theme) root.dataset.theme = theme; else delete root.dataset.theme;
  const b = $("#themeBtn");
  b.textContent = dark ? "[亮色]" : "[暗色]";
  b.setAttribute("aria-pressed", String(dark));
  b.title = dark ? "切换到亮色（color-scheme: light）" : "切换到暗色（color-scheme: dark）";
  requestAnimationFrame(renderTokens);
}
$("#themeBtn").addEventListener("click", () => { theme = isDark() ? "light" : "dark"; store.set("br-theme", theme); applyTheme(); });
darkQuery.addEventListener("change", () => { if (!theme) applyTheme(); });

/* =====================================================================
   拆掉全部 CSS
   ===================================================================== */
const sheetLink = $('link[rel="stylesheet"][href="page.css"]');
const stripBtn = $("#stripBtn");
function setStripped(on) {
  sheetLink.disabled = on;
  $("#udStyle").disabled = on;
  $("#rawNote").hidden = !on;
  stripBtn.setAttribute("aria-pressed", String(on));
  stripBtn.textContent = on ? "[装回 CSS]" : "[拆掉全部 CSS]";
  if (on) { setFormwork(false); $("#rawNote").scrollIntoView({ block: "start" }); $(".strip-again").focus(); }
  else stripBtn.focus();
}
stripBtn.addEventListener("click", () => setStripped(stripBtn.getAttribute("aria-pressed") !== "true"));
$(".strip-again").addEventListener("click", () => { setStripped(false); stripBtn.scrollIntoView({ block: "center" }); });

/* =====================================================================
   模板印痕
   ===================================================================== */
const TAGS = "header,nav,main,section,article,aside,footer,h1,h2,h3,h4,p,ul,ol,li,table,form,fieldset,figure,pre,details,label,button,iframe,output,progress";
const fwBtn = $("#formworkBtn");
function setFormwork(on) {
  if (on) {
    for (const el of $$(TAGS)) {
      if (el.closest("dialog, .toast, .rf-frame, #udCard, .stats, thead")) continue;
      if (el.matches("li") && !el.closest(".rules")) continue;
      el.dataset.tag = `<${el.tagName.toLowerCase()}>`;
      if (getComputedStyle(el).position === "static") el.dataset.static = "";
    }
  } else {
    for (const el of $$("[data-tag]")) { delete el.dataset.tag; delete el.dataset.static; }
  }
  root.classList.toggle("formwork", on);
  fwBtn.setAttribute("aria-pressed", String(on));
  fwBtn.textContent = on ? "[隐藏模板印痕]" : "[显示模板印痕]";
}
fwBtn.addEventListener("click", () => {
  const on = fwBtn.getAttribute("aria-pressed") !== "true";
  setFormwork(on);
  if (on) toast(`已标出 ${$$("[data-tag]").length} 个元素的标签名`);
});

/* =====================================================================
   材料清单
   ===================================================================== */
const weights = {};
async function measure() {
  const get = async (u) => { try { const r = await fetch(u, { cache: "force-cache" }); return r.ok ? bytes(await r.text()) : null; } catch (_) { return null; } };
  const [h, c, j] = await Promise.all([get(location.pathname), get("page.css"), get("page.js")]);
  Object.assign(weights, { html: h, css: c, js: j });
  let rules = 0;
  const count = (list) => { for (const r of list) { rules++; if (r.cssRules) count(r.cssRules); } };
  try { count(sheetLink.sheet.cssRules); } catch (_) { rules = null; }
  const nav = performance.getEntriesByType("navigation")[0];
  const set = (k, v) => ($(`[data-stat="${k}"]`).textContent = v);
  set("html", kb(h)); set("css", kb(c)); set("js", kb(j));
  set("fonts", `${document.fonts ? [...document.fonts].length : 0} 个（只用系统字体）`);
  set("img", `${document.images.length} 张`);
  set("dom", `${document.getElementsByTagName("*").length} 个`);
  set("rules", rules == null ? "未知" : `${rules} 条`);
  set("time", nav ? `${Math.round(nav.domContentLoadedEventEnd)} ms` : "未知");
  const total = (h || 0) + (c || 0) + (j || 0);
  $("#weightLine").textContent = `HTML + CSS + JS 一共 ${(total / 1024).toFixed(1)} KB。`;
  $("#footWeight").textContent = `HTML ${(h / 1024).toFixed(1)} KB · CSS ${(c / 1024).toFixed(1)} KB · JS ${(j / 1024).toFixed(1)} KB。`;
  if (total) $("#weightBar").innerHTML = [["html", "HTML", h], ["css", "CSS", c], ["js", "JS", j]]
    .map(([k, n, v]) => `<i class="b-${k}" style="width:${((v / total) * 100).toFixed(1)}%">${n} ${Math.round((v / total) * 100)}%</i>`).join("");
}

/* =====================================================================
   §4 七条规矩
   ===================================================================== */
/* 1 · 响应式示例：没有媒体查询，宽度变了它自己排 */
const rfStage = $("#rfStage"), rfFrame = $("#rfFrame"), rfWidth = $("#rfWidth");
function layoutRF() {
  const w = +rfWidth.value, k = Math.min(1, rfStage.clientWidth / w);
  rfFrame.style.setProperty("--w", w); rfFrame.style.setProperty("--k", k.toFixed(4));
  rfStage.style.height = `${Math.ceil(rfFrame.offsetHeight * k)}px`;
  $("#rfOut").textContent = `${w}px`;
  const cols = Math.max(1, Math.floor((w - 32 + 0.1) / 288));
  const read = `${w}px → 卡片自动排成 ${Math.min(4, cols)} 列（auto-fit + minmax(16rem, 1fr)），标题按容器宽度缩放到约 ${Math.round(Math.min(96, Math.max(28, w * 0.09)))}px。没有任何断点。`;
  $("#rfRead").textContent = read + (k < 1 ? `（按 ${Math.round(k * 100)}% 缩小显示）` : "");
  $$("#rfPresets button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.w === w)));
}
rfWidth.addEventListener("input", layoutRF);
$$("#rfPresets button").forEach((b) => b.addEventListener("click", () => { rfWidth.value = b.dataset.w; layoutRF(); }));
new ResizeObserver(layoutRF).observe(rfStage);

/* 2 · div 假按钮 vs 真按钮 */
let divN = 0, btnN = 0, keyN = 0;
const r2 = () => ($("#r2Out").textContent = `div 被点了 ${divN} 次 · button 被按了 ${btnN} 次（其中 ${keyN} 次来自键盘）`);
$("#fakeBtn").addEventListener("click", () => { divN++; r2(); });
$("#realBtn").addEventListener("click", (e) => { btnN++; if (e.detail === 0) keyN++; r2(); });

/* 5 · 可排序表格 */
const table = $("#sortTable");
table.addEventListener("click", (e) => {
  const b = e.target.closest("th button"); if (!b) return;
  const th = b.parentElement, col = +b.dataset.col, num = !!b.dataset.num;
  const dir = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
  $$("thead th", table).forEach((x) => x.setAttribute("aria-sort", x === th ? dir : "none"));
  const body = $("tbody", table);
  const rows = $$("tr", body).sort((x, y) => {
    const a = x.cells[col].textContent, c = y.cells[col].textContent;
    const r = num ? a - c : a.localeCompare(c, "zh-CN");
    return dir === "ascending" ? r : -r;
  });
  rows.forEach((r) => body.appendChild(r));
});

/* 6 · 表单、进度、对话框 */
$("#subForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("#subOut").textContent = `OK: 已订阅 ${e.target.elements.mail.value}（演示，不会发送任何数据）`;
});
$("#progBtn").addEventListener("click", () => {
  const p = $("#prog"); p.value = p.value >= 100 ? 0 : Math.min(100, p.value + 10); p.textContent = `${p.value}%`;
  if (p.value === 100) toast("DONE: 上传完成");
});
const dlg = $("#dlg");
$("#dlgBtn").addEventListener("click", () => dlg.showModal());
dlg.addEventListener("close", () => toast(dlg.returnValue === "ok" ? "OK: 对话框已确认" : "CANCEL: 对话框已关闭"));

/* =====================================================================
   §5 去装修：这里的 CSS 字符串就是作用在卡片上的全部样式
   ===================================================================== */
const BASE = `#udCard { padding: 24px; max-width: 320px; }
#udCard .ud-btn { all: revert; font: inherit; cursor: pointer; }`;
const SNIP = {
  gradient: `#udCard { background: linear-gradient(135deg, #7F5BFF, #4DA3FF); color: #FFFFFF; }
#udCard .ud-btn { background: linear-gradient(90deg, #FFD36B, #FF8A65); color: #2A1250;
  border: 0; padding: 10px 20px; font-weight: 700; }`,
  radius: `#udCard { border-radius: 20px; }
#udCard .ud-btn { border-radius: 999px; }`,
  shadow: `#udCard { box-shadow: 0 24px 48px rgb(80 60 200 / .28), 0 2px 6px rgb(0 0 0 / .08); }`,
  font: `#udCard { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; letter-spacing: -.01em; }
#udCard .ud-title { font-weight: 800; }`,
  motion: `#udCard { transition: transform .4s cubic-bezier(.2, .8, .2, 1); }
#udCard:hover { transform: translateY(-6px) rotate(-1deg); }`,
  badge: `#udCard .ud-badge { display: inline-block; padding: 2px 10px; border-radius: 99px;
  background: #FFE36B; color: #2A1250; font-size: 12px; font-weight: 700; }`,
  icon: `#udCard .ud-icon { display: inline-grid; place-items: center; width: 40px; height: 40px;
  margin-left: 8px; border-radius: 12px; background: rgb(255 255 255 / .22); }`,
  border: `#udCard { border: 3px solid currentColor; }
#udCard .ud-btn { border: 3px solid currentColor; border-radius: 0; background: Canvas;
  color: CanvasText; padding: 8px 16px; font-weight: 700; }`,
  invert: `#udCard .ud-btn:hover { background: CanvasText; color: Canvas; }`,
  mono: `#udCard { font-family: "Courier New", Courier, monospace; }`,
  huge: `#udCard .ud-price { font-size: 64px; line-height: .9; font-weight: 700; letter-spacing: -.04em; }`,
  mark: `#udCard .ud-title { display: inline; background: Mark; color: MarkText; }`,
};
const NAMES = { gradient: "渐变", radius: "圆角", shadow: "投影", font: "定制字体设置", motion: "悬停浮起", badge: "徽章", icon: "装饰图标", border: "3px 边框", invert: "悬停反色", mono: "等宽字体", huge: "巨型价格", mark: "高亮标题" };
const DECOR = ["gradient", "radius", "shadow", "font", "motion", "badge", "icon"];
const udBoxes = $$("#udForm input[data-k]");
for (const [k, v] of Object.entries(SNIP)) $(`[data-b="${k}"]`).textContent = `${bytes(v)} B`;
function renderUD() {
  const on = udBoxes.filter((b) => b.checked).map((b) => b.dataset.k);
  const css = [`/* 基础（不算装修） */\n${BASE}`, ...on.map((k) => `/* ${NAMES[k]} */\n${SNIP[k]}`)].join("\n");
  $("#udStyle").textContent = css;
  $("#udCode").textContent = css;
  $(".ud-badge").hidden = !on.includes("badge");
  $(".ud-icon").hidden = !on.includes("icon");
  const d = on.filter((k) => DECOR.includes(k)), b = on.filter((k) => !DECOR.includes(k));
  const sum = (ks) => ks.reduce((n, k) => n + bytes(SNIP[k]), 0);
  $("#udBytes").innerHTML = `装修 <b>${sum(d)} 字节</b>（${d.length} 项）· 野兽派处理 <b>${sum(b)} 字节</b>（${b.length} 项）· 基础 ${bytes(BASE)} 字节。${d.length === 0 ? "装修拆光了：价格、说明和按钮一样都没少。" : ""}`;
}
udBoxes.forEach((b) => b.addEventListener("change", renderUD));
$("#udStrip").addEventListener("click", () => { udBoxes.forEach((b) => (b.checked = false)); renderUD(); });
$("#udBrutal").addEventListener("click", () => { udBoxes.forEach((b) => (b.checked = !DECOR.includes(b.dataset.k))); renderUD(); });

/* =====================================================================
   §7 令牌表
   ===================================================================== */
function renderTokens() {
  const canvas = resolve("Canvas");
  const alert = resolve("var(--alert)");
  const row = (name, c, use, vs, need = 4.5) => {
    const r = c && vs ? contrast(c, vs) : null;
    return `<tr><td>${name}</td><td>${c ? `<i class="sw" style="background:${hex(c)}"></i>${hex(c)}` : "—"}</td><td>${use}</td><td>${r == null ? "—" : `<span class="${r >= need ? "ok" : "bad"}">${r.toFixed(1)} : 1</span>`}</td></tr>`;
  };
  const txt = (name, val, use) => `<tr><td>${name}</td><td><code>${val}</code></td><td>${use}</td><td>—</td></tr>`;
  $("#tokenBody").innerHTML = [
    row("Canvas", canvas, "页面底色", null),
    row("CanvasText", resolve("CanvasText"), "正文、边框、反色块", canvas),
    row("LinkText", resolve("LinkText"), "未访问的链接", canvas),
    row("VisitedText", resolve("VisitedText"), "访问过的链接", canvas),
    row("Mark / MarkText", resolve("Mark"), "焦点与高亮底色（对比度为 MarkText 对 Mark）", resolve("MarkText")),
    row("--alert", alert, "错误（唯一的自定义颜色，暗色下换成浅红）", canvas),
    txt("衬线", "\"Times New Roman\", Times, \"Songti SC\", SimSun, serif", "正文与标题"),
    txt("等宽", "\"Courier New\", Courier, monospace", "标签、按钮、代码、数字"),
    txt("字号", "18px 正文 · clamp(46px, 11.6vw, 186px) 主标题", "两档为主，反差约 10 : 1"),
    txt("线", "1px · 3px · 8px", "表格 · 区块与控件 · 章节"),
    txt("宽度", "max-width: 70ch", "所有长段落"),
  ].join("");
}

/* =====================================================================
   Copy · visits · reset · boot
   ===================================================================== */
document.addEventListener("click", (e) => {
  const b = e.target.closest(".copy"); if (!b) return;
  const code = $(`#${b.dataset.copy}`);
  const done = (msg) => { b.textContent = msg; setTimeout(() => (b.textContent = "[复制]"), 1400); };
  try { navigator.clipboard.writeText(code.textContent).then(() => done("[已复制]"), () => done("[请手动复制]")); }
  catch (_) { done("[请手动复制]"); }
});

let visits = parseInt(store.get("br-visits") || "0", 10) || 0;
visits++;
store.set("br-visits", String(visits));
$("#visits").textContent = String(visits).padStart(6, "0");

$("#resetBtn").addEventListener("click", () => {
  ["br-theme", "br-visits"].forEach(store.del);
  $$("input").forEach((i) => {
    if (i.type === "checkbox" || i.type === "radio") i.checked = i.defaultChecked;
    else i.value = i.defaultValue;
  });
  try { sessionStorage.setItem("br-reset", "1"); } catch (_) {}
  history.replaceState(null, "", location.pathname + location.search);
  location.reload();
});

applyTheme();
renderUD();
layoutRF();
measure();
try {
  if (sessionStorage.getItem("br-reset")) { sessionStorage.removeItem("br-reset"); toast("OK: 已恢复初始状态"); }
} catch (_) {}
