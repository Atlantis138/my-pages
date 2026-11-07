/* 瑞士风格完整页：网格叠加层（G）、明暗、版面解剖、年表筛选、层级与对齐演示、界面组件、响应式示例与复原。 */
import { initLab } from "./lab.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
  del(k) { try { localStorage.removeItem(k); } catch (_) {} },
};
const KEYS = ["sw-theme", "sw-grid", "sw-lab"];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

const toastEl = $("#toast");
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
}

/* 单选组：点击或方向键切换（role="radio" 的按钮） */
function radioGroup(group, onChange) {
  const items = $$('[role="radio"]', group);
  const select = (btn, focus) => {
    items.forEach((b) => { b.setAttribute("aria-checked", String(b === btn)); b.tabIndex = b === btn ? 0 : -1; });
    if (focus) btn.focus();
    onChange(btn);
  };
  items.forEach((b) => {
    b.tabIndex = b.getAttribute("aria-checked") === "true" ? 0 : -1;
    b.addEventListener("click", () => select(b));
    b.addEventListener("keydown", (e) => {
      const i = items.indexOf(b);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select(items[(i + 1) % items.length], true); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select(items[(i - 1 + items.length) % items.length], true); }
    });
  });
  return (value, attr) => { const b = items.find((x) => x.dataset[attr] === value); if (b) select(b); };
}

/* =====================================================================
   Theme
   ===================================================================== */
const darkQuery = matchMedia("(prefers-color-scheme: dark)");
const themeBtn = $("#themeBtn");
let theme = store.get("sw-theme");
const isDark = () => (theme ? theme === "dark" : darkQuery.matches);
function applyTheme() {
  const dark = isDark();
  root.dataset.theme = dark ? "dark" : "light";
  themeBtn.setAttribute("aria-checked", String(dark));
}
themeBtn.addEventListener("click", () => { theme = isDark() ? "light" : "dark"; store.set("sw-theme", theme); applyTheme(); });
darkQuery.addEventListener("change", () => { if (!theme) applyTheme(); });
applyTheme();

/* =====================================================================
   Grid overlay — 按 G 或点按钮
   ===================================================================== */
const gridBtn = $("#gridBtn"), heroGrid = $("#heroGrid");
function setGrid(on, save = true) {
  root.classList.toggle("show-grid", on);
  gridBtn.setAttribute("aria-pressed", String(on));
  heroGrid.setAttribute("aria-pressed", String(on));
  heroGrid.textContent = on ? "隐藏网格" : "显示网格";
  if (save) on ? store.set("sw-grid", "1") : store.del("sw-grid");
}
const toggleGrid = () => setGrid(!root.classList.contains("show-grid"));
gridBtn.addEventListener("click", toggleGrid);
heroGrid.addEventListener("click", toggleGrid);
addEventListener("keydown", (e) => {
  if (e.key !== "g" && e.key !== "G") return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target;
  if (t.closest("input, textarea, select, [contenteditable='true']")) return;
  toggleGrid();
});
setGrid(store.get("sw-grid") === "1", false);

/* =====================================================================
   1 · annotated poster
   ===================================================================== */
$("#pGrid").innerHTML = "<i></i>".repeat(48);
const poster = $("#poster");
let pinned = "";
for (const b of $$("#rules button")) {
  const n = b.dataset.hl;
  const on = () => { poster.dataset.hl = n; };
  const off = () => { poster.dataset.hl = pinned; };
  b.addEventListener("pointerenter", on);
  b.addEventListener("pointerleave", off);
  b.addEventListener("focus", on);
  b.addEventListener("blur", off);
  b.addEventListener("click", () => {
    pinned = pinned === n ? "" : n;
    poster.dataset.hl = pinned || n;
    $$("#rules button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.hl === pinned)));
  });
}

/* =====================================================================
   2 · timeline filter
   ===================================================================== */
const tlItems = $$("#tl li"), tlCount = $("#tlCount");
function filterTL(f) {
  let n = 0;
  tlItems.forEach((li) => { const show = f === "all" || li.dataset.t === f; li.hidden = !show; if (show) n++; });
  $$("#filters button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.f === f)));
  tlCount.textContent = f === "all" ? `共 ${tlItems.length} 条` : `显示 ${tlItems.length} 条中的 ${n} 条`;
}
$$("#filters button").forEach((b) => b.addEventListener("click", () => filterTL(b.dataset.f)));
filterTL("all");

/* =====================================================================
   4 · hierarchy · alignment
   ===================================================================== */
const STEP_NOTES = {
  1: "只有一种字号、一种字重，所有文字连成一片。读者分不清哪句是标题，只能从头读起。",
  2: "只拉开字号，层级就出现了大半：标题、副标题、正文、图注一眼可分。",
  3: "再给标题加粗。两种字重已经足够，再多就会互相打架。",
  4: "最后用位置和留白：编号和图注退到左边的窄栏，正文分两栏，都从同一条竖线开始。整个过程没有用一点颜色。",
};
const hier = $("#hier"), stepNote = $("#stepNote");
radioGroup($("#steps"), (b) => { hier.dataset.step = b.dataset.s; stepNote.textContent = STEP_NOTES[b.dataset.s]; });
stepNote.textContent = STEP_NOTES[4];

const alignDemo = $("#alignDemo");
radioGroup($("#alignSeg"), (b) => { alignDemo.dataset.a = b.dataset.a; });
$("#hyph").addEventListener("change", (e) => alignDemo.classList.toggle("hy", e.target.checked));

/* =====================================================================
   6 · ui kit
   ===================================================================== */
const form = $("#uiForm"), mailField = $("#mailField"), mailErr = $("#mailErr"), formOk = $("#formOk");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = form.mail.value.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  mailField.classList.toggle("bad", !ok);
  form.mail.setAttribute("aria-invalid", String(!ok));
  mailErr.textContent = ok ? "" : v ? "错误：邮箱格式不对，例如 name@example.ch" : "错误：请填写邮箱";
  formOk.textContent = ok ? "已提交（示例，不会发送）" : "";
  if (!ok) form.mail.focus();
});
form.mail.addEventListener("input", () => {
  if (!mailField.classList.contains("bad")) return;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail.value.trim())) { mailField.classList.remove("bad"); mailErr.textContent = ""; form.mail.removeAttribute("aria-invalid"); }
});

/* 示例数据：苏黎世出发的列车 */
const DEPS = [
  { time: "08:02", train: "IC 1", dest: "Bern", track: 31, delay: 0 },
  { time: "08:04", train: "IR 36", dest: "Basel SBB", track: 7, delay: 0 },
  { time: "08:09", train: "IC 5", dest: "Lausanne", track: 32, delay: 4 },
  { time: "08:12", train: "S 12", dest: "Winterthur", track: 41, delay: 0 },
  { time: "08:15", train: "IR 70", dest: "Luzern", track: 5, delay: 2 },
  { time: "08:17", train: "EC 151", dest: "Lugano", track: 6, delay: 0 },
  { time: "08:22", train: "IC 3", dest: "Chur", track: 9, delay: 7 },
  { time: "08:32", train: "IC 75", dest: "St. Gallen", track: 34, delay: 0 },
];
const table = $("#depTable"), tbody = $("tbody", table);
let sortK = "time", sortDir = 1;
function renderTable() {
  const rows = [...DEPS].sort((a, b) => {
    const x = a[sortK], y = b[sortK];
    return (typeof x === "number" ? x - y : String(x).localeCompare(String(y), "de", { numeric: true })) * sortDir;
  });
  tbody.innerHTML = rows.map((r) => `<tr><td><b>${r.time}</b></td><td>${r.train}</td><td lang="de">${r.dest}</td><td class="num">${r.track}</td><td class="num">${r.delay ? `<span class="late">+${r.delay} 分钟</span>` : `<span class="ontime">准点</span>`}</td></tr>`).join("");
  $$("th", table).forEach((th) => {
    const k = $("button", th).dataset.k;
    if (k === sortK) th.setAttribute("aria-sort", sortDir > 0 ? "ascending" : "descending");
    else th.removeAttribute("aria-sort");
  });
}
$$("th button", table).forEach((b) => b.addEventListener("click", () => {
  if (sortK === b.dataset.k) sortDir = -sortDir; else { sortK = b.dataset.k; sortDir = 1; }
  renderTable();
}));
renderTable();

const pager = $("#pager"), PAGES = 8;
let page = 1;
function renderPager() {
  const nums = [...new Set([1, page - 1, page, page + 1, PAGES])].filter((n) => n >= 1 && n <= PAGES).sort((a, b) => a - b);
  let html = `<button type="button" data-p="${page - 1}" aria-label="上一页"${page === 1 ? " disabled" : ""}>←</button>`;
  nums.forEach((n, i) => {
    if (i && n - nums[i - 1] > 1) html += `<span aria-hidden="true">…</span>`;
    html += `<button type="button" data-p="${n}" aria-label="第 ${n} 页"${n === page ? ' aria-current="page"' : ""}>${n}</button>`;
  });
  html += `<button type="button" data-p="${page + 1}" aria-label="下一页"${page === PAGES ? " disabled" : ""}>→</button>`;
  pager.innerHTML = html;
}
pager.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-p]");
  if (!b || b.disabled) return;
  page = +b.dataset.p;
  renderPager();
  ($(`button[data-p="${page}"][aria-current]`, pager) || pager.querySelector("button")).focus();
});
renderPager();

/* 6.2 · responsive frame：示例页按自身宽度（容器查询）切换栏数，窄屏上整体缩放显示 */
const rsStage = $("#rsStage"), rsFrame = $("#rsFrame"), rsWidth = $("#rsWidth"), rsOut = $("#rsOut"), rsRead = $("#rsRead");
const RS_TEXT = {
  12: "12 栏，栏间距 24 px：标题跨 9 栏，主图 8 栏，信息栏 4 栏，正文三段并排。",
  8: "8 栏，栏间距 20 px：标题和主图跨满全宽，信息栏改成横排三格，正文两段一行。",
  4: "4 栏，栏间距 16 px：所有内容单栏堆叠，导航收进「菜单」，标题缩小到 40 px。",
};
function layoutRS() {
  const w = +rsWidth.value;
  const k = Math.min(1, rsStage.clientWidth / w);
  rsFrame.style.setProperty("--w", w);
  rsFrame.style.setProperty("--k", k.toFixed(4));
  rsStage.style.height = `${Math.ceil(rsFrame.offsetHeight * k)}px`;
  rsOut.textContent = `${w} px`;
  const cols = w >= 960 ? 12 : w >= 600 ? 8 : 4;
  rsRead.innerHTML = `<b>${w} px</b> → ${RS_TEXT[cols]}${k < 1 ? `（按 ${Math.round(k * 100)}% 缩小显示）` : ""}`;
  $$("#rsPresets button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.w === w)));
}
rsWidth.addEventListener("input", layoutRS);
$$("#rsPresets button").forEach((b) => b.addEventListener("click", () => { rsWidth.value = b.dataset.w; layoutRS(); }));
new ResizeObserver(layoutRS).observe(rsStage);
layoutRS();

/* =====================================================================
   5 · lab
   ===================================================================== */
initLab({ store, reduceMotion, radioGroup });

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
  try { navigator.clipboard.writeText(code.textContent).then(() => done("已复制"), fallback); }
  catch (_) { fallback(); }
}));

/* 一键复原：清掉本页保存的设置，把表单控件改回默认值（避免浏览器在刷新后恢复它们），再重新载入 */
$("#resetBtn").addEventListener("click", () => {
  KEYS.forEach(store.del);
  $$("input").forEach((i) => {
    if (i.type === "checkbox" || i.type === "radio") i.checked = i.defaultChecked;
    else i.value = i.defaultValue;
  });
  try { sessionStorage.setItem("sw-reset", "1"); } catch (_) {}
  location.reload();
});
try {
  if (sessionStorage.getItem("sw-reset")) { sessionStorage.removeItem("sw-reset"); toast("已恢复初始状态"); }
} catch (_) {}
