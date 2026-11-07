/* 包豪斯完整页：康定斯基问卷（整页换色）、明暗、拆解海报、时间轴、阿尔伯斯色彩、作图线、平衡秤与复原。 */
import { initPoster } from "./poster.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
  del(k) { try { localStorage.removeItem(k); } catch (_) {} },
};
const KEYS = ["bh-theme", "bh-answer", "bh-poster"];

/* ---------- toast ---------- */
const toastEl = $("#toast");
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

/* =====================================================================
   Theme
   ===================================================================== */
const darkQuery = matchMedia("(prefers-color-scheme: dark)");
const themeBtn = $("#themeBtn");
let theme = store.get("bh-theme");
const isDark = () => (theme ? theme === "dark" : darkQuery.matches);
function applyTheme() {
  const dark = isDark();
  root.dataset.theme = dark ? "dark" : "light";
  themeBtn.setAttribute("aria-checked", String(dark));
  $("use", themeBtn).setAttribute("href", dark ? "#i-moon" : "#i-sun");
}
themeBtn.addEventListener("click", () => {
  theme = isDark() ? "light" : "dark";
  store.set("bh-theme", theme);
  applyTheme();
});
darkQuery.addEventListener("change", () => { if (!theme) applyTheme(); });
applyTheme();

/* =====================================================================
   Kandinsky questionnaire — 形与色的对应关系写进六个 CSS 变量
   ===================================================================== */
const COLORS = ["yellow", "red", "blue"];
const SHAPES = ["tri", "sq", "ci"];
const CN_COLOR = { yellow: "黄", red: "红", blue: "蓝" };
const CN_SHAPE = { tri: "三角", sq: "方", ci: "圆" };
const KANDINSKY = { tri: "yellow", sq: "red", ci: "blue" };
const valid = (a) => a && SHAPES.every((s) => COLORS.includes(a[s])) && new Set(SHAPES.map((s) => a[s])).size === 3;

let answer = (() => {
  try { const a = JSON.parse(store.get("bh-answer")); if (valid(a)) return a; } catch (_) {}
  return { ...KANDINSKY };
})();
const getAnswer = () => ({ ...answer });

const qStatus = $("#qStatus"), qK = $("#qKandinsky"), mineText = $("#mineText");
const chip = (s) => `<i class="chip k-${s}" style="background:var(--${answer[s]})"></i>`;

function applyAnswer() {
  for (const s of SHAPES) {
    root.style.setProperty(`--${s}`, `var(--${answer[s]})`);
    root.style.setProperty(`--${s}-on`, `var(--on-${answer[s]})`);
  }
  const same = SHAPES.filter((s) => answer[s] === KANDINSKY[s]).length;
  const phrase = SHAPES.map((s) => `${chip(s)}${CN_COLOR[answer[s]]}${CN_SHAPE[s]}`).join("、");
  qStatus.innerHTML = same === 3
    ? `现在是康定斯基的答案：<b>${phrase}</b>。`
    : `这是你的答案：<b>${phrase}</b>。和康定斯基相同的有 ${same} 处。`;
  qK.disabled = same === 3;
  mineText.innerHTML = same === 3
    ? `和康定斯基完全一致：<b>3 / 3</b>。换几种颜色试试，看看整页会变成什么样。`
    : `和康定斯基一致的有 <b>${same} / 3</b>。${same === 0 ? "一处都不同——在当年的包豪斯，这份答卷大概会很显眼。" : "整页的图形现在用的是你的配色。"}`;
  for (const btn of $$(".q-shape")) {
    const s = btn.dataset.shape;
    btn.setAttribute("aria-label", `${CN_SHAPE[s]}形，现在是${CN_COLOR[answer[s]]}色，点击换色`);
  }
  document.dispatchEvent(new CustomEvent("bh:answer"));
}

$$(".q-shape").forEach((btn) => btn.addEventListener("click", () => {
  const s = btn.dataset.shape;
  const next = COLORS[(COLORS.indexOf(answer[s]) + 1) % 3];
  const other = SHAPES.find((x) => answer[x] === next);
  answer[other] = answer[s];
  answer[s] = next;
  store.set("bh-answer", JSON.stringify(answer));
  applyAnswer();
  btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
}));
qK.addEventListener("click", () => {
  answer = { ...KANDINSKY };
  store.del("bh-answer");
  applyAnswer();
  toast("已换回康定斯基的答案");
});
applyAnswer();

/* =====================================================================
   Exploded poster
   ===================================================================== */
const exStage = $("#exStage"), exBtn = $("#exBtn");
exBtn.addEventListener("click", () => {
  const open = !exStage.classList.contains("open");
  exStage.classList.toggle("open", open);
  exBtn.setAttribute("aria-pressed", String(open));
  exBtn.textContent = open ? "合上" : "拆开";
});
let exPinned = "";
for (const b of $$("#exList button")) {
  const n = b.dataset.layer;
  const on = () => { exStage.dataset.active = n; };
  const off = () => { exStage.dataset.active = exPinned; };
  b.addEventListener("pointerenter", on);
  b.addEventListener("pointerleave", off);
  b.addEventListener("focus", on);
  b.addEventListener("blur", off);
  b.addEventListener("click", () => {
    exPinned = exPinned === n ? "" : n;
    exStage.dataset.active = exPinned || n;
    $$("#exList button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.layer === exPinned)));
  });
  b.setAttribute("aria-pressed", "false");
}

/* =====================================================================
   Timeline
   ===================================================================== */
const TL = {
  weimar: {
    years: "1919—1925", de: "Weimar", title: "魏玛：表现主义与手工艺",
    text: "国立包豪斯由魏玛的美术学院和工艺美术学校合并而成。1919 年 4 月的宣言写道：「一切造型活动的最终目标是建筑」，封面是费宁格的木刻《大教堂》。早期的包豪斯带着浓厚的表现主义和手工艺气息，每个工坊由一位艺术家和一位工匠共同带领。",
    facts: ["1919 发表宣言：建筑师、雕塑家、画家都要回到手工艺", "1923 第一次大型展览，口号变为「艺术与技术：新的统一」，样板住宅「号角屋」落成", "1924 图林根新政府大幅削减经费，学校决定迁走"],
  },
  dessau: {
    years: "1925—1932", de: "Dessau", title: "德绍：走向工业",
    text: "工业城市德绍接纳了包豪斯。格罗皮乌斯设计的新校舍 1926 年落成，工坊楼整面的玻璃幕墙成了现代建筑的标志。学校开始和企业合作，把工坊的样品变成量产商品：钢管家具、灯具、壁纸和字体都出自这一时期。",
    facts: ["1925 年底起，印刷品一律只用小写字母", "1926 校舍落成，学校改称「设计学院」", "1932 纳粹党占多数的市议会投票关闭学校"],
  },
  berlin: {
    years: "1932—1933", de: "Berlin", title: "柏林：最后十个月",
    text: "密斯把包豪斯改成私立学校，搬进柏林施泰格利茨一座废弃的电话厂房继续上课。1933 年 4 月，警方搜查并查封了校舍；7 月，教师们开会决定自行解散。",
    facts: ["1932 年 10 月在柏林复课", "1933 年 4 月 11 日校舍被搜查、查封", "1933 年 7 月 20 日教师会议决定解散"],
  },
  gropius: {
    years: "1919—1928", de: "Walter Gropius", title: "瓦尔特·格罗皮乌斯",
    text: "建筑师，包豪斯的创办者。他确立了「预备课程 + 工坊」的教学结构，主持了从魏玛到德绍的搬迁，并亲自设计了德绍校舍。1928 年辞去校长职务，回到建筑实践。",
    facts: ["1919 起草包豪斯宣言", "1923 提出「艺术与技术：新的统一」", "1937 起在哈佛大学执教"],
  },
  meyer: {
    years: "1928—1930", de: "Hannes Meyer", title: "汉内斯·迈耶",
    text: "瑞士建筑师，1927 年受聘主持新设立的建筑系，次年接任校长。他主张设计要满足「人民的需要，而不是奢侈的需要」，让工坊为大众生产便宜实用的产品。1930 年因政治立场被解职。",
    facts: ["1927 包豪斯建筑系成立", "1929 包豪斯壁纸上市，成为学校最赚钱的产品", "1930 被德绍市解职"],
  },
  mies: {
    years: "1930—1933", de: "Ludwig Mies van der Rohe", title: "路德维希·密斯·凡德罗",
    text: "建筑师。他把包豪斯改造成一所以建筑为核心的学校，并试图让它远离政治。德绍关闭后，他把学校迁到柏林私立办学，直到 1933 年自行解散。",
    facts: ["教学重心转向建筑", "1932 迁往柏林，改为私立", "1938 起在芝加哥阿穆尔理工学院执教"],
  },
};
const tlPanel = $("#tlPanel");
function showTL(k) {
  const d = TL[k];
  tlPanel.innerHTML = `<div class="tlp-years">${d.years}<small>${d.de}</small></div>
    <div class="tlp-body"><h3>${d.title}</h3><p>${d.text}</p><ul class="tlp-facts">${d.facts.map((f) => `<li>${f}</li>`).join("")}</ul></div>`;
  $$(".tl-seg").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === k)));
}
$$(".tl-seg").forEach((b) => {
  b.setAttribute("aria-controls", "tlPanel");
  b.addEventListener("click", () => showTL(b.dataset.k));
});
showTL("weimar");

/* =====================================================================
   Albers · construction guides
   ===================================================================== */
const albers = $("#albers"), albersBtn = $("#albersBtn"), albersOut = $("#albersOut");
albersBtn.addEventListener("click", () => {
  const on = !albers.classList.contains("on");
  albers.classList.toggle("on", on);
  albersBtn.setAttribute("aria-pressed", String(on));
  albersBtn.textContent = on ? "再把它们分开" : "把两块连起来";
  albersOut.textContent = on
    ? "两块是同一种灰色 #918A80。在明亮的黄底上，它显得更深、偏冷；在深蓝底上，它显得更浅、偏暖。"
    : "";
});

const guideBtn = $("#guideBtn"), buildPic = $("#buildPic");
guideBtn.addEventListener("click", () => {
  const on = !buildPic.classList.contains("show");
  buildPic.classList.toggle("show", on);
  guideBtn.setAttribute("aria-pressed", String(on));
  guideBtn.textContent = on ? "隐藏作图线" : "显示作图线";
});

/* =====================================================================
   Balance — 视觉重量按面积估算（示意）
   ===================================================================== */
const beam = $("#beam"), balCi = $("#balCi"), balSize = $("#balSize"), balPos = $("#balPos"), balStatus = $("#balStatus");
const PIVOT = 0.36, SQ = 0.22;
function balance() {
  const d = balSize.value / 100;
  const minX = PIVOT + d / 2 + 0.02, maxX = 1 - d / 2;
  const cx = minX + ((maxX - minX) * balPos.value) / 100;
  const left = SQ * SQ * (PIVOT - SQ / 2);
  const right = (Math.PI * d * d / 4) * (cx - PIVOT);
  const r = right / left;
  const ang = Math.max(-8, Math.min(8, (r - 1) * 10));
  beam.style.setProperty("--ang", `${ang.toFixed(2)}deg`);
  balCi.style.setProperty("--cx", cx.toFixed(4));
  balCi.style.setProperty("--d", d.toFixed(4));
  if (r < 0.94) balStatus.innerHTML = `<b>左边重</b>：方块的力矩是圆的 ${(1 / r).toFixed(1)} 倍。把圆放大一点，或者推得更远。`;
  else if (r > 1.06) balStatus.innerHTML = `<b>右边重</b>：圆的力矩是方块的 ${r.toFixed(1)} 倍。把圆缩小一点，或者拉近一点。`;
  else balStatus.innerHTML = `<b>平衡了</b>：小圆离支点更远，扛住了大方块。画面不对称，却是稳的。`;
}
balSize.addEventListener("input", balance);
balPos.addEventListener("input", balance);
balance();

/* =====================================================================
   6 · UI kit
   ===================================================================== */
const bhForm = $("#bhForm"), bhMail = $("#bhMailField"), bhErr = $("#bhErr"), bhOk = $("#bhOk");
const mailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
bhForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = bhForm.mail.value, ok = mailOk(v);
  bhMail.classList.toggle("bad", !ok);
  bhForm.mail.setAttribute("aria-invalid", String(!ok));
  bhErr.textContent = ok ? "" : v.trim() ? "邮箱格式不对，例如 name@example.de" : "请填写邮箱";
  bhOk.textContent = ok ? "已提交（示例，不会发送）" : "";
  if (!ok) bhForm.mail.focus();
});
bhForm.mail.addEventListener("input", () => {
  if (bhMail.classList.contains("bad") && mailOk(bhForm.mail.value)) {
    bhMail.classList.remove("bad"); bhErr.textContent = ""; bhForm.mail.removeAttribute("aria-invalid");
  }
});
const bhSwitch = $("#bhSwitch");
bhSwitch.addEventListener("click", () => bhSwitch.setAttribute("aria-checked", String(bhSwitch.getAttribute("aria-checked") !== "true")));

const grayBtn = $("#grayBtn");
grayBtn.addEventListener("click", () => {
  const on = grayBtn.getAttribute("aria-pressed") !== "true";
  grayBtn.setAttribute("aria-pressed", String(on));
  $("#bhAlerts").classList.toggle("gray", on);
});

const tabs = $$('#bhTabs [role="tab"]');
function selectTab(t, focus) {
  tabs.forEach((x) => {
    const on = x === t;
    x.setAttribute("aria-selected", String(on));
    x.tabIndex = on ? 0 : -1;
    document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
  });
  if (focus) t.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => selectTab(t));
  t.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); selectTab(tabs[(i + 1) % tabs.length], true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); selectTab(tabs[(i - 1 + tabs.length) % tabs.length], true); }
  });
});

/* 响应式首屏：示例页按自身宽度（容器查询）切换布局，窄屏上整体缩放显示 */
const rfStage = $("#rfStage"), rfFrame = $("#rfFrame"), rfWidth = $("#rfWidth"), rfOut = $("#rfOut"), rfRead = $("#rfRead");
const RF_TEXT = {
  wide: "三栏按 5 : 3 : 2 不对称分配；标题字号是容器宽度的 11%，大圆冲出右上角，被 overflow: clip 裁掉。",
  mid: "降为两栏，第一栏跨满整行；标题放大到容器宽度的 13%，构图关系不变。",
  narrow: "单栏堆叠，导航收进「菜单」；标题放大到容器宽度的 19%，图形重新排到标题上方，首屏依然是一张海报。",
};
function layoutRF() {
  const w = +rfWidth.value;
  const k = Math.min(1, rfStage.clientWidth / w);
  rfFrame.style.setProperty("--w", w);
  rfFrame.style.setProperty("--k", k.toFixed(4));
  rfStage.style.height = `${Math.ceil(rfFrame.offsetHeight * k)}px`;
  rfOut.textContent = `${w} px`;
  const mode = w >= 900 ? "wide" : w >= 560 ? "mid" : "narrow";
  rfRead.innerHTML = `<b>${w} px</b> → ${RF_TEXT[mode]}${k < 1 ? `（按 ${Math.round(k * 100)}% 缩小显示）` : ""}`;
  $$("#rfPresets button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.w === w)));
}
rfWidth.addEventListener("input", layoutRF);
$$("#rfPresets button").forEach((b) => b.addEventListener("click", () => { rfWidth.value = b.dataset.w; layoutRF(); }));
new ResizeObserver(layoutRF).observe(rfStage);
layoutRF();

/* =====================================================================
   Poster maker
   ===================================================================== */
initPoster({ store, getAnswer, toast });

/* =====================================================================
   Nav scroll spy · copy · reset
   ===================================================================== */
const links = $$(".links a");
const spy = new IntersectionObserver((entries) => {
  for (const en of entries) {
    if (en.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${en.target.id}`)));
  }
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main > section").forEach((s) => spy.observe(s));

const copyBtn = $("#copyBtn");
copyBtn.addEventListener("click", () => {
  const label = $("span", copyBtn);
  const done = (t) => { label.textContent = t; setTimeout(() => (label.textContent = "复制"), 1400); };
  const fallback = () => {
    const range = document.createRange(); range.selectNodeContents($("#codeText"));
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
    done("已选中");
  };
  try { navigator.clipboard.writeText($("#codeText").textContent).then(() => done("已复制"), fallback); }
  catch (_) { fallback(); }
});

/* 一键复原：清掉本页保存的设置，把表单控件改回默认值（避免浏览器在刷新后恢复它们），再重新载入 */
$("#resetBtn").addEventListener("click", () => {
  KEYS.forEach(store.del);
  $$("input").forEach((i) => {
    if (i.type === "checkbox" || i.type === "radio") i.checked = i.defaultChecked;
    else i.value = i.defaultValue;
  });
  try { sessionStorage.setItem("bh-reset", "1"); } catch (_) {}
  location.reload();
});
try {
  if (sessionStorage.getItem("bh-reset")) { sessionStorage.removeItem("bh-reset"); toast("已恢复初始状态"); }
} catch (_) {}
