/* 新中式完整页：节气与昼夜、远山、疏密演示、版式拆解、竖排演示、组件、响应式示例、制印与复原。 */
import { TERMS, SEASONS, currentTerm } from "./terms.js";
import { drawSeal, sealCss } from "./seal.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
  del(k) { try { localStorage.removeItem(k); } catch (_) {} },
};
const KEYS = ["zh-theme", "zh-term"];

const toastEl = $("#toast");
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
}

/* ---------- 颜色工具 ---------- */
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
   节气与昼夜
   ===================================================================== */
const today = currentTerm(new Date());
const saved = parseInt(store.get("zh-term"), 10);
let term = saved >= 0 && saved < 24 ? saved : today;
const seasonOf = (i) => SEASONS[Math.floor(i / 6)];

const darkQuery = matchMedia("(prefers-color-scheme: dark)");
const themeBtn = $("#themeBtn");
let theme = store.get("zh-theme");
const isDark = () => (theme ? theme === "dark" : darkQuery.matches);

/* 远山：三层山脊，每个节气一副不同的轮廓（用节气序号做随机种子） */
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function ridge(rand, base, amp, f) {
  const ph = [0, 1, 2, 3].map(() => rand() * 6.283);
  let d = `M-40 470V${base}`;
  for (let x = -40; x <= 1240; x += 12) {
    let h = 0, n = 0;
    for (let k = 1; k <= 4; k++) { h += (1 - Math.abs(Math.sin(k * f * x + ph[k - 1]))) / k; n += 1 / k; }
    d += `L${x} ${(base - amp * Math.pow(h / n, 1.7)).toFixed(1)}`;
  }
  return d + "V470Z";
}
const hills = $("#hills");
function drawHills() {
  const r = rng(term * 97 + 13);
  hills.innerHTML =
    `<path class="h-far" filter="url(#zh-ink-soft)" d="${ridge(r, 300, 250, 0.0027)}"/>` +
    `<path class="h-mid" filter="url(#zh-ink)" d="${ridge(r, 356, 200, 0.004)}"/>` +
    `<path class="h-near" filter="url(#zh-ink)" d="${ridge(r, 410, 150, 0.0056)}"/>`;
}

const COLOR_ROLES = () => [
  ["--paper", "宣纸", "页面底色"],
  ["--paper2", "旧纸", "面板、代码块、演示区"],
  ["--ink", "焦墨", "正文与标题"],
  ["--ink2", "淡墨", "注释、次要文字"],
  ["--zhu", "朱砂", "链接记号、错误、当前项"],
  ["--tint", seasonOf(term).tint, `间色（${seasonOf(term).cn}），小标题与图形`],
  ["--ink3", "灰线", "禁用状态与辅助线，不写字"],
];
function renderColors() {
  const paper = hexOf("--paper"), roles = COLOR_ROLES();
  $("#swatches").innerHTML = roles.filter(([v]) => v !== "--ink3").map(([v, name, use]) => {
    const hex = hexOf(v);
    return `<button type="button" class="swatch" data-hex="${hex}" aria-label="复制 ${name} ${hex}"><i style="background:${hex}"></i><b>${name}</b><span>${hex}</span><em>${use.split("，")[0]}</em></button>`;
  }).join("");
  $("#tokColors tbody").innerHTML = roles.map(([v, name, use]) => {
    const hex = hexOf(v), c = contrast(hex, paper);
    const verdict = v === "--paper" ? "" : c >= 4.5 ? "可写正文" : c >= 3 ? "大字与线" : "仅装饰";
    return `<tr><td><i class="tok-sw" style="background:${hex}"></i>${name}</td><td><code>${v}</code></td><td><code>${hex}</code></td><td class="num">${v === "--paper" ? "—" : c.toFixed(1) + " : 1"}<span class="tok-ok">${verdict}</span></td><td>${use}</td></tr>`;
  }).join("");
}
$("#swatches").addEventListener("click", (e) => {
  const sw = e.target.closest(".swatch");
  if (sw) copyText(sw.dataset.hex, () => toast(`已复制 ${sw.dataset.hex}`), () => toast(`色值：${sw.dataset.hex}`));
});

function applyLook() {
  const t = TERMS[term], s = seasonOf(term);
  root.dataset.season = s.id;
  root.dataset.theme = isDark() ? "dark" : "light";
  themeBtn.setAttribute("aria-checked", String(isDark()));
  $("#termName").textContent = t.name;
  $("#heroHou").textContent = t.hou;
  $("#barTerm").textContent = t.name;
  $("#termNote").textContent = `${t.date}前后 · 初候「${t.hou}」 · ${s.cn}季，间色用${s.tint}。` +
    (term === today ? "这是今天所在的节气，按太阳黄经近似推算。" : "");
  $("#termToday").hidden = term === today;
  drawHills();
  renderColors();
}
function setTerm(i) {
  term = (i + 24) % 24;
  term === today ? store.del("zh-term") : store.set("zh-term", String(term));
  applyLook();
}
$("#termPrev").addEventListener("click", () => setTerm(term - 1));
$("#termNext").addEventListener("click", () => setTerm(term + 1));
$("#termToday").addEventListener("click", () => { setTerm(today); $("#termNext").focus(); });
themeBtn.addEventListener("click", () => { theme = isDark() ? "light" : "dark"; store.set("zh-theme", theme); applyLook(); });
darkQuery.addEventListener("change", () => { if (!theme) applyLook(); });

/* =====================================================================
   壹 · 疏密
   ===================================================================== */
const shumi = $("#shumi"), shumiStage = $("#shumiStage");
const SHUMI_SAY = [
  ["密不透风", "底纹、花框，加上八块内容挤在一张卡片上，每一样都在抢。"],
  ["仍然很满", "去掉底纹和两样次要的东西，花框换成细线。内容还是居中、均匀地摆满。"],
  ["开始透气", "拿掉外框和底色，内容靠向右边，标签和按钮褪成文字。空白开始连成片。"],
  ["疏密有致", "标题竖起来，正文退到左下角。一密一疏，中间是完整的一块白。这是新中式最常见的样子。"],
  ["疏可走马", "只剩题目、一方印和一句诗。适合首屏和封面，但承载不了多少信息。"],
];
function renderShumi() {
  const lv = +shumi.value;
  shumiStage.dataset.level = lv;
  requestAnimationFrame(() => {
    /* 数一数画面里还剩几样东西（外框和底纹各算一样） */
    let n = lv === 0 ? 2 : lv === 1 ? 1 : 0;
    for (const el of $$(".sm-title, .sm-poem, .sm-body, .sm-body2, .sm-tags, .sm-btn, .sm-btn2, .sm-foot", shumiStage)) if (el.getClientRects().length) n++;
    $("#shumiOut").textContent = SHUMI_SAY[lv][0];
    $("#shumiSay").innerHTML = `<b>${n} 样东西</b>${SHUMI_SAY[lv][1]}`;
  });
}
shumi.addEventListener("input", renderShumi);

/* =====================================================================
   叁 · 版式拆解、竖排演示
   ===================================================================== */
const leaf = $("#leaf");
let pinned = "";
for (const b of $$("#terms button")) {
  const n = b.dataset.hl;
  const on = () => { leaf.dataset.hl = n; };
  const off = () => { leaf.dataset.hl = pinned; };
  b.addEventListener("pointerenter", on);
  b.addEventListener("pointerleave", off);
  b.addEventListener("focus", on);
  b.addEventListener("blur", off);
  b.addEventListener("click", () => {
    pinned = pinned === n ? "" : n;
    leaf.dataset.hl = pinned || n;
    $$("#terms button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.hl === pinned)));
  });
}

const vertStage = $("#vertStage"), vTcy = $("#vTcy"), vUp = $("#vUp"), vEm = $("#vEm");
function renderVert() {
  const v = $('input[name="vDir"]:checked').value === "v";
  vertStage.className = "vert-stage" + (v ? " v" : "") + (vTcy.checked ? " tcy" : "") + (vUp.checked ? " up" : "") + (vEm.checked ? " em" : "");
  vTcy.disabled = vUp.disabled = !v;
  const lines = [];
  if (v) {
    lines.push("p    { writing-mode: vertical-rl; height: 9.4em; }");
    if (vUp.checked) lines.push("p    { text-orientation: upright; }");
    if (vTcy.checked) lines.push(".tcy { text-combine-upright: all; }");
  } else lines.push("p    { writing-mode: horizontal-tb; }  /* 默认值 */");
  if (vEm.checked) lines.push(`em   { text-emphasis: filled dot; text-emphasis-position: ${v ? "over" : "under"} right; }`);
  $("#vertCode").textContent = lines.join("\n");
}
$$('input[name="vDir"]').forEach((i) => i.addEventListener("change", renderVert));
[vTcy, vUp, vEm].forEach((i) => i.addEventListener("change", renderVert));

/* =====================================================================
   肆 · 组件
   ===================================================================== */
const uiForm = $("#uiForm"), telField = $("#telField"), telErr = $("#telErr"), formOk = $("#formOk");
uiForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = /^1\d{10}$/.test(uiForm.tel.value.replace(/[\s-]/g, ""));
  telField.classList.toggle("bad", !ok);
  uiForm.tel.setAttribute("aria-invalid", String(!ok));
  telErr.textContent = ok ? "" : "手机号应为十一位数字。";
  formOk.textContent = ok ? `已为${uiForm.name.value.trim() || "您"}留好${uiForm.slot.value}的「${uiForm.seat.value.split(" ")[0]}」。` : "";
  if (!ok) uiForm.tel.focus();
});
uiForm.tel.addEventListener("input", () => { telField.classList.remove("bad"); telErr.textContent = ""; uiForm.tel.removeAttribute("aria-invalid"); });

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
    /* 竖排的标签从右往左排，所以「左」是下一枚 */
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") { e.preventDefault(); selectTab(tabs[(i + 1) % tabs.length], true); }
    if (e.key === "ArrowUp" || e.key === "ArrowRight") { e.preventDefault(); selectTab(tabs[(i - 1 + tabs.length) % tabs.length], true); }
  });
});

const uiInk = $("#uiInk"), uiInkBar = $("#uiInkBar");
function setInk() {
  uiInkBar.style.setProperty("--v", `${uiInk.value}%`);
  uiInkBar.setAttribute("aria-valuenow", uiInk.value);
  $("#uiInkOut").textContent = `${uiInk.value}%`;
}
uiInk.addEventListener("input", setInk);
setInk();

const pager = $("#pager"), NUMS = ["一", "二", "三", "四", "五"];
let pageNo = 2;
function renderPager() {
  pager.innerHTML = NUMS.map((c, i) => `<button type="button" data-p="${i + 1}" aria-label="第 ${i + 1} 页"${i + 1 === pageNo ? ' aria-current="page"' : ""}>${c}</button>`).join("");
}
pager.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  pageNo = +b.dataset.p; renderPager();
  $(`[data-p="${pageNo}"]`, pager).focus();
});
renderPager();

/* ---------- 响应式示例 ---------- */
const rsStage = $("#rsStage"), rsFrame = $("#rsFrame"), rsWidth = $("#rsWidth"), rsRead = $("#rsRead");
const RS_TEXT = [
  [900, "<b>宽屏</b>：标题竖排在右上，正文沉在左下，中间隔着一大片空白；三款茶用细竖线分栏。"],
  [560, "<b>平板</b>：左右边距从 56 收到 32，标题小了一号，仍然竖排。上下的距离基本没动。"],
  [0, "<b>手机</b>：竖排标题改回横排，放到正文上面；导航收成「目录」；三栏变成三行，竖线换成横线。左右只留 20 的边距，上方的留白还在。"],
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
   伍 · 制印
   ===================================================================== */
const sealCanvas = $("#sealCanvas"), sealText = $("#sealText"), slipInput = $("#slipInput"), sealRough = $("#sealRough"), slip = $("#slip");
let sealSeed = 7, sealJob = 0;
const pick = (name) => $(`input[name="${name}"]:checked`).value;
const sealChars = () => [...sealText.value.replace(/\s/g, "")].slice(0, 4).join("") || "印";
async function renderSeal() {
  const job = ++sealJob;
  const o = { text: sealChars(), mode: pick("sealMode"), shape: pick("sealShape"), font: pick("sealFont"), rough: +sealRough.value, seed: sealSeed };
  slip.dataset.pos = pick("sealPos");
  $("#slipText").textContent = [...slipInput.value.trim()].slice(0, 10).join("") || "山色有无中";
  $("#sealRoughOut").textContent = sealRough.value;
  try { await document.fonts.load(`64px "${o.font}"`, o.text + $("#slipText").textContent); } catch (_) {}
  if (job !== sealJob) return;
  drawSeal(sealCanvas, o);
  sealCanvas.setAttribute("aria-label", `印章预览：${o.mode === "bai" ? "白文" : "朱文"}「${o.text}」`);
  const n = [...o.text].length;
  $("#sealSay").textContent = `${o.mode === "bai" ? "白文" : "朱文"}${{ square: "方", round: "圆", tall: "长" }[o.shape]}印，${n} 字` +
    (n === 4 ? "，读序：右上、右下、左上、左下。" : n === 3 ? "，右边一字，左边两字。" : n === 2 ? "，上下排列。" : "。");
}
$$("#lab input").forEach((i) => i.addEventListener(i.type === "radio" ? "change" : "input", renderSeal));
$("#sealAgain").addEventListener("click", () => { sealSeed = (sealSeed * 31 + 17) % 9973; renderSeal(); });
$("#sealSave").addEventListener("click", () => {
  sealCanvas.toBlob((blob) => {
    if (!blob) return toast("导出失败");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "seal.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast("已下载透明底的 PNG");
  });
});
$("#sealCss").addEventListener("click", () => {
  const css = sealCss(sealChars(), pick("sealMode"), pick("sealShape"), pick("sealFont"));
  copyText(css, () => toast("CSS 与 HTML 已复制"), () => toast("复制失败，请到「实现」一节手动复制"));
});

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
    else if (i.tagName === "SELECT") i.selectedIndex = 0;
    else i.value = i.defaultValue;
  });
  $$("details").forEach((d) => (d.open = false));
  try { sessionStorage.setItem("zh-reset", "1"); } catch (_) {}
  location.reload();
});
try {
  if (sessionStorage.getItem("zh-reset")) { sessionStorage.removeItem("zh-reset"); toast("已恢复初始状态"); }
} catch (_) {}

/* ---------- boot ---------- */
applyLook();
renderShumi();
renderVert();
if (rsStage.clientWidth < 600) rsWidth.value = 375;   /* 窄屏上先展示手机宽度，免得缩得太小 */
layoutRS();
renderSeal();
document.fonts?.ready.then(() => { renderSeal(); renderShumi(); layoutRS(); });
