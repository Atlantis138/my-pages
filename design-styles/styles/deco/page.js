/* 装饰艺术完整页：金属与日夜场、楼层指示盘、六步演示、母题、字距演示、组件、响应式示例、纹样工坊与复原。 */
import { motifImage, MOTIF_NOTE } from "./motifs.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
  del(k) { try { localStorage.removeItem(k); } catch (_) {} },
};
const KEYS = ["dc-theme", "dc-metal"];

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

/* ---------- 颜色工具 ---------- */
const probe = document.createElement("i");
probe.style.cssText = "position:absolute;width:0;height:0;visibility:hidden";
document.body.appendChild(probe);
function rgbOf(name) {
  probe.style.color = `var(${name})`;
  return getComputedStyle(probe).color.match(/[\d.]+/g).slice(0, 3).map((v) => Math.round(+v));
}
const hexOf = (name) => "#" + rgbOf(name).map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
function lum(hex) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
function copyText(text, ok, fail) {
  try { navigator.clipboard.writeText(text).then(ok, fail); } catch (_) { fail(); }
}

/* =====================================================================
   金属与日夜场
   ===================================================================== */
const METALS = { gold: "香槟金", chrome: "铬银", copper: "玫瑰铜" };
let metal = METALS[store.get("dc-metal")] ? store.get("dc-metal") : "gold";
const darkQuery = matchMedia("(prefers-color-scheme: dark)");
const themeBtn = $("#themeBtn");
let theme = store.get("dc-theme");
const isDark = () => (theme ? theme === "dark" : darkQuery.matches);

const COLOR_ROLES = [
  ["--bg", "底色", "页面底色"],
  ["--bg2", "面板", "卡片与代码块"],
  ["--text", "文字", "正文与标题"],
  ["--text2", "次要文字", "注释、标签"],
  ["--m", "金属", "夜场里的线、标题与高光；浅底上只做装饰"],
  ["--metal-ink", "金属文字", "需要写成金属色的文字"],
  ["--line", "金属线", "边框、分隔线"],
  ["--bad", "警示", "错误与警告"],
];
function renderColors() {
  const bg = hexOf("--bg");
  $("#swatches").innerHTML = COLOR_ROLES.filter(([v]) => !["--line", "--metal-ink"].includes(v)).map(([v, name]) => {
    const hex = hexOf(v);
    return `<button type="button" class="swatch" data-hex="${hex}" aria-label="复制 ${name} ${hex}"><i style="background:${hex}"></i><b>${name}</b><span>${hex}</span></button>`;
  }).join("");
  $("#tokColors tbody").innerHTML = COLOR_ROLES.map(([v, name, use]) => {
    const hex = hexOf(v), c = contrast(hex, bg);
    const verdict = v === "--bg" ? "" : c >= 4.5 ? "可写正文" : c >= 3 ? "大字与线" : "仅装饰";
    return `<tr><td><i class="tok-sw" style="background:${hex}"></i>${name}</td><td><code>${v}</code></td><td><code>${hex}</code></td><td class="num">${v === "--bg" ? "—" : c.toFixed(1) + " : 1"}<span class="tok-ok">${verdict}</span></td><td>${use}</td></tr>`;
  }).join("");
}
$("#swatches").addEventListener("click", (e) => {
  const sw = e.target.closest(".swatch");
  if (sw) copyText(sw.dataset.hex, () => toast(`已复制 ${sw.dataset.hex}`), () => toast(`色值：${sw.dataset.hex}`));
});

let pickBar, pickHero;
function applyLook() {
  root.dataset.metal = metal;
  root.dataset.theme = isDark() ? "dark" : "light";
  themeBtn.setAttribute("aria-checked", String(isDark()));
  $(".tool-t", themeBtn).textContent = isDark() ? "夜场" : "日场";
  pickBar?.((b) => b.dataset.metal === metal);
  pickHero?.((b) => b.dataset.metal === metal);
  renderColors();
  paintMotifs();
  renderLab();
}
function setMetal(m) {
  metal = m;
  m === "gold" ? store.del("dc-metal") : store.set("dc-metal", m);
  applyLook();
}
pickBar = radioGroup($("#metals"), (b) => setMetal(b.dataset.metal));
pickHero = radioGroup($("#heroMetals"), (b) => setMetal(b.dataset.metal));
themeBtn.addEventListener("click", () => { theme = isDark() ? "light" : "dark"; store.set("dc-theme", theme); applyLook(); });
darkQuery.addEventListener("change", () => { if (!theme) applyLook(); });

const rays = $("#rays");
function setRays() {
  root.style.setProperty("--ray", `${(180 / rays.value).toFixed(3)}deg`);
  $("#raysOut").textContent = `${rays.value} 道`;
}
rays.addEventListener("input", setRays);
setRays();

/* =====================================================================
   楼层指示盘：指针跟着滚动走
   ===================================================================== */
const dial = $("#dial"), floors = $$("a", dial);
function setFloor(id) {
  const i = floors.findIndex((a) => a.getAttribute("href") === `#${id}`);
  dial.style.setProperty("--a", i < 0 ? "-90deg" : `${-78 + i * 26}deg`);
  floors.forEach((a, k) => a.setAttribute("aria-current", String(k === i)));
}
const spy = new IntersectionObserver((entries) => {
  for (const en of entries) if (en.isIntersecting) setFloor(en.target.id);
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main > section").forEach((s) => spy.observe(s));

/* =====================================================================
   I · 六步
   ===================================================================== */
const STEP_CODE = {
  1: "/* 对称 */  .card  { text-align: center; justify-items: center; }",
  2: "/* 字   */  .title { font-family: Limelight; text-transform: uppercase; letter-spacing: .08em; }\n            .label { font-family: \"Poiret One\"; letter-spacing: .4em; margin-right: -.4em; }",
  3: "/* 线   */  .card  { border: 1px solid var(--metal); outline: 1px solid var(--metal); outline-offset: 5px; }",
  4: "/* 阶梯 */  .btn   { clip-path: polygon(7px 0, calc(100% - 7px) 0, calc(100% - 7px) 7px, 100% 7px, …); }",
  5: "/* 放射 */  .card::before { background: repeating-conic-gradient(from -90deg at 50% 100%, var(--metal) 0 3deg, transparent 3deg 9deg); }",
  6: "/* 金属 */  .title { background: linear-gradient(#F0D99A, #C9A45C 48%, #8A6A2C); background-clip: text; color: transparent; }",
};
const demoCard = $("#demoCard"), stepBoxes = $$("#stepList input");
function renderSteps() {
  const on = stepBoxes.filter((b) => b.checked).map((b) => b.dataset.step);
  demoCard.className = "demo-card " + on.map((n) => `s${n}`).join(" ");
  $("#stepsCode").textContent = on.length ? on.map((n) => STEP_CODE[n]).join("\n") : "/* 一张普通的卡片：左对齐、默认字体、实色、直角，没有任何装饰 */";
}
stepBoxes.forEach((b) => b.addEventListener("change", renderSteps));
$("#stepsOff").addEventListener("click", () => { stepBoxes.forEach((b) => (b.checked = false)); renderSteps(); });
$("#stepsOn").addEventListener("click", () => { stepBoxes.forEach((b) => (b.checked = true)); renderSteps(); });
renderSteps();

/* =====================================================================
   III · 母题陈列、字距演示
   ===================================================================== */
const MOTIF_DEFAULT = {
  sunburst: [44, 3, 0.45], steps: [44, 1.5, 0.8], chevron: [40, 1.5, 0.8],
  scales: [44, 1.5, 0.8], lattice: [22, 1, 0.55], speed: [40, 1.5, 0.7],
};
function paintMotifs() {
  const rgb = rgbOf("--m");
  for (const el of $$("#motifs .motif")) {
    const [s, w, a] = MOTIF_DEFAULT[el.dataset.motif];
    el.style.backgroundImage = motifImage(el.dataset.motif, s, w, rgb, a);
  }
}

const trackLs = $("#trackLs"), trackFix = $("#trackFix"), trackWord = $("#trackWord");
function renderTrack() {
  const ls = +trackLs.value, fix = trackFix.checked;
  trackWord.style.letterSpacing = `${ls}em`;
  trackWord.style.marginRight = fix ? `${-ls}em` : "0";
  /* 底色只铺到最后一个字母为止，方便看出文字本身的位置 */
  trackWord.style.backgroundImage = `linear-gradient(90deg, color-mix(in srgb, var(--m) 18%, transparent) calc(100% - ${ls}em), transparent 0)`;
  trackWord.style.backgroundColor = "transparent";
  $("#trackOut").textContent = `${ls.toFixed(2)} em`;
  const off = (ls * parseFloat(getComputedStyle(trackWord).fontSize)) / 2;
  $("#trackSay").textContent = ls === 0 ? "字距为 0：不需要补偿，但也没有装饰艺术的味道。"
    : fix ? `已补偿：margin-right: -${ls.toFixed(2)}em，文字回到中轴上。`
    : `未补偿：文字的视觉中心比中轴偏左约 ${off.toFixed(1)} px。`;
}
trackLs.addEventListener("input", renderTrack);
trackFix.addEventListener("change", renderTrack);

/* =====================================================================
   IV · 组件
   ===================================================================== */
const uiForm = $("#uiForm"), nameField = $("#nameField"), nameErr = $("#nameErr"), formOk = $("#formOk");
let guests = 2;
const gOut = $("#gOut");
const setGuests = (n) => { guests = Math.min(12, Math.max(1, n)); gOut.textContent = guests; };
$("#gMinus").addEventListener("click", () => setGuests(guests - 1));
$("#gPlus").addEventListener("click", () => setGuests(guests + 1));
uiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = uiForm.name.value.trim(), ok = name.length > 0;
  nameField.classList.toggle("bad", !ok);
  uiForm.name.setAttribute("aria-invalid", String(!ok));
  nameErr.textContent = ok ? "" : "请填写姓名，订位需要一个称呼。";
  formOk.textContent = ok ? `已为${name}预留 ${uiForm.slot.value}:00 的 ${guests} 人位。` : "";
  if (!ok) uiForm.name.focus();
});
uiForm.name.addEventListener("input", () => { nameField.classList.remove("bad"); nameErr.textContent = ""; uiForm.name.removeAttribute("aria-invalid"); });

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

const pager = $("#pager"), ROMAN = ["I", "II", "III", "IV", "V"];
let pageNo = 2;
function renderPager() {
  pager.innerHTML = ROMAN.map((r, i) => `<button type="button" data-p="${i + 1}" aria-label="第 ${i + 1} 页"${i + 1 === pageNo ? ' aria-current="page"' : ""}>${r}</button>`).join("");
}
pager.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  pageNo = +b.dataset.p; renderPager();
  $(`[data-p="${pageNo}"]`, pager).focus();
});
renderPager();

const uiProg = $("#uiProg"), uiProgBar = $("#uiProgBar");
uiProgBar.innerHTML = Array.from({ length: 10 }, (_, i) => `<i style="--k:${i}"></i>`).join("");
function setProg() {
  $$("i", uiProgBar).forEach((el, i) => el.classList.toggle("on", i < uiProg.value / 10));
  uiProgBar.setAttribute("aria-valuenow", uiProg.value);
  $("#uiProgOut").textContent = `${uiProg.value}%`;
}
uiProg.addEventListener("input", setProg);
setProg();

const dlg = $("#dlg");
$("#openDlg").addEventListener("click", () => { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", ""); });
dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });

/* ---------- 响应式示例 ---------- */
const rsStage = $("#rsStage"), rsFrame = $("#rsFrame"), rsWidth = $("#rsWidth"), rsRead = $("#rsRead");
const RS_TEXT = [
  [900, "<b>宽屏</b>：三栏对称。导航也对称地分在店名两侧，中间的主角带双线框和光芒。"],
  [560, "<b>平板</b>：主角仍在中轴上，占满一行；两翼折到它下面，左右各一，对称还在。"],
  [0, "<b>手机</b>：只剩一条中轴。导航收成店名下的「菜单」，双线框减为单线，标题字距从 0.3em 收到 0.16em，两翼变成两行列表。"],
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
   V · 纹样工坊
   ===================================================================== */
const lbSize = $("#lbSize"), lbLine = $("#lbLine"), lbAlpha = $("#lbAlpha");
let labMotif = "sunburst";
function renderLab() {
  const s = +lbSize.value, w = +lbLine.value, a = lbAlpha.value / 100;
  const rgb = rgbOf("--m");
  const img = motifImage(labMotif, s, w, rgb, a);
  $("#labPat").style.backgroundImage = img;
  $("#labCardTop").style.backgroundImage = motifImage(labMotif, Math.max(16, s * 0.6), Math.max(1, w * 0.75), rgb, Math.min(1, a + 0.2));
  $("#lbSizeOut").textContent = s;
  $("#lbLineOut").textContent = w.toFixed(1);
  $("#lbAlphaOut").textContent = `${lbAlpha.value}%`;
  $("#lbSay").textContent = MOTIF_NOTE[labMotif];
  $("#labCode").textContent = `.pattern {\n  background-color: #0E1D19;\n  background-image:\n    ${img.replace(/\), (?=repeating|url)/g, "),\n    ")};\n}`;
}
radioGroup($("#labMotif"), (b) => { labMotif = b.dataset.m; renderLab(); });
[lbSize, lbLine, lbAlpha].forEach((i) => i.addEventListener("input", renderLab));

/* =====================================================================
   copy · reset
   ===================================================================== */
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
  $$("input").forEach((i) => {
    if (i.type === "checkbox" || i.type === "radio") i.checked = i.defaultChecked;
    else i.value = i.defaultValue;
  });
  try { sessionStorage.setItem("dc-reset", "1"); } catch (_) {}
  location.reload();
});
try {
  if (sessionStorage.getItem("dc-reset")) { sessionStorage.removeItem("dc-reset"); toast("已恢复初始状态"); }
} catch (_) {}

/* ---------- boot ---------- */
applyLook();
if (rsStage.clientWidth < 600) rsWidth.value = 375;   /* 窄屏上先展示手机宽度，免得缩得太小 */
layoutRS();
document.fonts?.ready.then(renderTrack);
renderTrack();
