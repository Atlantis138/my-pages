/* Material Design 完整页：动态配色、导航、组件交互与各节演示。 */
import { schemeFrom, palettesFrom, contrast, TONES } from "./color.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
};

/* =====================================================================
   Dynamic color
   ===================================================================== */
const WALLS = [
  { name: "紫藤", seed: "#6750A4", note: "M3 默认" },
  { name: "海湾", seed: "#1A6A8C" },
  { name: "赤陶", seed: "#A0482A" },
  { name: "苔原", seed: "#4A6B2E" },
  { name: "樱", seed: "#9A4B6E" },
  { name: "金麦", seed: "#8A6A00" },
];
const darkQuery = matchMedia("(prefers-color-scheme: dark)");
const state = {
  seed: store.get("md-seed") || WALLS[0].seed,
  theme: store.get("md-theme"), // "light" | "dark" | null(跟随系统)
};
const isDark = () => (state.theme ? state.theme === "dark" : darkQuery.matches);

function wallArt(seed) {
  const p = palettesFrom(seed);
  const t = (pal, n) => p[pal](n);
  return `background:linear-gradient(170deg,${t("primary", 30)} 0%,${t("primary", 60)} 45%,${t("tertiary", 80)} 100%)">
    <i style="width:46%;aspect-ratio:1;left:46%;top:16%;background:${t("tertiary", 90)}"></i>
    <i style="width:160%;aspect-ratio:1;left:-70%;top:62%;background:${t("secondary", 30)}"></i>
    <i style="width:120%;aspect-ratio:1;left:30%;top:74%;background:${t("primary", 20)}"></i>`;
}

function renderWalls() {
  $("#walls").innerHTML = WALLS.map(
    (w) => `<button class="wall" type="button" role="radio" aria-checked="false" data-seed="${w.seed}"><span class="wall-img" style="${wallArt(w.seed)}<span class="ms">check</span></span>${w.name}</button>`
  ).join("");
  $("#seedMenu").innerHTML = WALLS.map(
    (w) => `<button class="menu-item" type="button" role="menuitemradio" aria-checked="false" data-seed="${w.seed}"><i style="background:${w.seed}"></i><span class="body-large">${w.name}</span><span class="ms">check</span></button>`
  ).join("");
}

const ROLE_FAMILIES = [
  ["primary", "Primary"], ["secondary", "Secondary"], ["tertiary", "Tertiary"], ["error", "Error"],
];
const SURFACE_ROLES = [
  "surface-dim", "surface", "surface-bright",
  "surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest",
];
const MISC_ROLES = [
  ["on-surface", "surface"], ["on-surface-variant", "surface"], ["outline", "surface"], ["outline-variant", "on-surface"],
  ["inverse-surface", "inverse-on-surface"], ["inverse-primary", "inverse-surface"],
];
const PAL_LABEL = { primary: "P", secondary: "S", tertiary: "T", neutral: "N", neutralVariant: "NV", error: "E" };

function roleBox(roles, role, onRole, big) {
  const r = roles[role];
  return `<div class="role${big ? " big" : ""}" style="background:var(--md-sys-color-${role});color:var(--md-sys-color-${onRole})">${role}<small><span>${r.hex}</span><span>${PAL_LABEL[r.palette]}-${r.tone}</span></small></div>`;
}

function renderColorDocs(scheme) {
  const { roles, palettes } = scheme;
  /* tonal palettes */
  const rows = [["primary", "Primary"], ["secondary", "Secondary"], ["tertiary", "Tertiary"], ["neutral", "Neutral"], ["neutralVariant", "Neutral variant"]];
  $("#palettes").innerHTML = rows.map(([k, label]) => {
    const cells = TONES.map((t) => `<span style="background:${palettes[k](t)};color:${t < 60 ? "#FFF" : "#000"}">${t}</span>`).join("");
    return `<div class="pal-row"><span class="pal-name">${label}</span>${cells}</div>`;
  }).join("");

  /* roles */
  const fam = ROLE_FAMILIES.map(([k]) => `<div class="role-fam">
    ${roleBox(roles, k, `on-${k}`, true)}${roleBox(roles, `on-${k}`, k)}
    ${roleBox(roles, `${k}-container`, `on-${k}-container`, true)}${roleBox(roles, `on-${k}-container`, `${k}-container`)}
  </div>`).join("");
  const surf = `<div class="role-fam wide">${SURFACE_ROLES.map((r) => roleBox(roles, r, "on-surface")).join("")}</div>`;
  const misc = `<div class="role-fam wide s6">${MISC_ROLES.map(([r, on]) => roleBox(roles, r, on)).join("")}</div>`;
  $("#roles").innerHTML = fam + surf + misc;

  /* contrast */
  const pairs = [
    ["primary", "on-primary"], ["primary-container", "on-primary-container"],
  ];
  $("#contrastDemo").innerHTML = pairs.map(([bg, fg]) => {
    const ratio = contrast(roles[bg].hex, roles[fg].hex);
    const dt = Math.abs(roles[bg].tone - roles[fg].tone);
    return `<div class="cd" style="background:var(--md-sys-color-${bg});color:var(--md-sys-color-${fg})"><b>${ratio.toFixed(2)} : 1</b><span>${fg} / ${bg}</span><span>色调差 ${dt}</span></div>`;
  }).join("");
}

function applyScheme() {
  const dark = isDark();
  const scheme = schemeFrom(state.seed, dark);
  for (const [role, v] of Object.entries(scheme.roles)) root.style.setProperty(`--md-sys-color-${role}`, v.hex);
  root.dataset.theme = dark ? "dark" : "light";
  root.style.colorScheme = dark ? "dark" : "light";
  $("#themeBtn .ms").textContent = dark ? "light_mode" : "dark_mode";
  $("#themeBtn").setAttribute("aria-label", dark ? "切换浅色模式" : "切换深色模式");
  $$("[data-seed]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.seed.toUpperCase() === state.seed.toUpperCase())));
  $("#seedInput").value = state.seed.toLowerCase();
  $("#seedHex").textContent = state.seed.toUpperCase();
  let meta = $('meta[name="theme-color"]');
  if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta); }
  meta.content = scheme.roles.surface.hex;
  renderColorDocs(scheme);
  renderLevels();
  updateElevation();
}

function setSeed(seed, announce) {
  state.seed = seed.toUpperCase();
  store.set("md-seed", state.seed);
  applyScheme();
  if (announce) snack(announce);
}

/* =====================================================================
   Ripple (state layers are pure CSS)
   ===================================================================== */
document.addEventListener("pointerdown", (e) => {
  const el = e.target.closest("[data-ripple], .chip, .icon-btn, .segmented button, .tabs [role=tab], .drawer-item, .menu-item, .ct-card");
  if (!el || el.disabled || reduceMotion) return;
  const r = el.getBoundingClientRect();
  const d = Math.hypot(Math.max(e.clientX - r.left, r.right - e.clientX), Math.max(e.clientY - r.top, r.bottom - e.clientY)) * 2;
  const w = document.createElement("span");
  w.className = "ripple-wave";
  w.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  el.appendChild(w);
  const release = () => { w.classList.add("out"); setTimeout(() => w.remove(), 600); };
  addEventListener("pointerup", release, { once: true });
  addEventListener("pointercancel", release, { once: true });
});

/* =====================================================================
   Snackbar & dialog
   ===================================================================== */
let snackTimer;
function snack(text, action) {
  const bar = $("#snackbar"), btn = $("#snackAction");
  $("#snackText").textContent = text;
  btn.hidden = !action;
  if (action) btn.textContent = action;
  bar.classList.add("show");
  clearTimeout(snackTimer);
  snackTimer = setTimeout(() => bar.classList.remove("show"), 4000);
}
$("#snackAction").addEventListener("click", () => { $("#snackbar").classList.remove("show"); setTimeout(() => snack("已撤销"), 250); });
$("#openDialog").addEventListener("click", () => $("#dialog").showModal());
$("#dialog").addEventListener("click", (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });

/* =====================================================================
   Navigation: drawer, top app bar, scroll spy
   ===================================================================== */
const drawer = $("#drawer"), scrim = $("#scrim"), menuBtn = $("#menuBtn");
const wide = matchMedia("(min-width: 1100px)");
function setDrawer(open) {
  if (wide.matches) open = false;
  drawer.classList.toggle("open", open);
  scrim.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  if (open) drawer.querySelector(".drawer-item")?.focus();
}
menuBtn.addEventListener("click", () => setDrawer(!drawer.classList.contains("open")));
scrim.addEventListener("click", () => setDrawer(false));
drawer.addEventListener("click", (e) => { if (e.target.closest("a")) setDrawer(false); });
wide.addEventListener("change", () => setDrawer(false));

const appbar = $("#appbar");
const onScroll = () => appbar.classList.toggle("scrolled", scrollY > 4);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const sections = $$("main > .section");
const navLinks = $$('.drawer-item[href^="#"]');
const spy = new IntersectionObserver((entries) => {
  for (const en of entries) {
    if (!en.isIntersecting) continue;
    navLinks.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${en.target.id}`)));
  }
}, { rootMargin: "-40% 0px -55% 0px" });
sections.forEach((s) => spy.observe(s));

/* seed menu */
const seedBtn = $("#seedBtn"), seedMenu = $("#seedMenu");
function setMenu(open) {
  seedMenu.hidden = !open;
  seedBtn.setAttribute("aria-expanded", String(open));
  if (open) seedMenu.querySelector('[aria-checked="true"], .menu-item')?.focus();
}
seedBtn.addEventListener("click", (e) => { e.stopPropagation(); setMenu(seedMenu.hidden); });
document.addEventListener("click", (e) => { if (!seedMenu.hidden && !e.target.closest("#seedMenu")) setMenu(false); });
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!seedMenu.hidden) { setMenu(false); seedBtn.focus(); }
  if (drawer.classList.contains("open")) { setDrawer(false); menuBtn.focus(); }
  if (!$("#ctDetail").hidden) closeCT();
});

/* theme */
$("#themeBtn").addEventListener("click", () => {
  state.theme = isDark() ? "light" : "dark";
  store.set("md-theme", state.theme);
  applyScheme();
});
darkQuery.addEventListener("change", () => { if (!state.theme) applyScheme(); });

/* seed pickers */
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-seed]");
  if (!b) return;
  const w = WALLS.find((x) => x.seed === b.dataset.seed);
  setSeed(b.dataset.seed, `已从「${w.name}」壁纸提取种子色 ${w.seed}`);
  setMenu(false);
});
$("#seedInput").addEventListener("input", (e) => setSeed(e.target.value));
$("#seedInput").addEventListener("change", (e) => snack(`已用自定义种子色 ${e.target.value.toUpperCase()} 生成配色`));

/* =====================================================================
   Typography & shape
   ===================================================================== */
const TYPE = [
  ["Display", [["display-large", "57 / 64", "Material 设计"], ["display-medium", "45 / 52", "Material 设计"], ["display-small", "36 / 44", "Material 设计"]]],
  ["Headline", [["headline-large", "32 / 40", "纸、墨水与光"], ["headline-medium", "28 / 36", "纸、墨水与光"], ["headline-small", "24 / 32", "纸、墨水与光"]]],
  ["Title", [["title-large", "22 / 28", "卡片与对话框的标题"], ["title-medium", "16 / 24 · 500", "列表项与小标题"], ["title-small", "14 / 20 · 500", "分组标题"]]],
  ["Body", [["body-large", "16 / 24", "正文用于长段阅读，行高宽松，字距略放开。"], ["body-medium", "14 / 20", "正文用于长段阅读，行高宽松，字距略放开。"], ["body-small", "12 / 16", "正文用于长段阅读，行高宽松，字距略放开。"]]],
  ["Label", [["label-large", "14 / 20 · 500", "按钮文字 Button"], ["label-medium", "12 / 16 · 500", "导航标签 Label"], ["label-small", "11 / 16 · 500", "徽标与注释 Caption"]]],
];
$("#typeScale").innerHTML = TYPE.map(([group, rows]) =>
  `<div class="ts-group">${group}</div>` + rows.map(([cls, m, text]) =>
    `<div class="ts-row"><div class="ts-meta"><b>${cls.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</b><span>${m}</span></div><div class="ts-sample ${cls}">${text}</div></div>`
  ).join("")
).join("");

const SHAPES = [
  ["无", "0dp", "0", "全屏对话框"],
  ["超小", "4dp", "4px", "菜单、提示条"],
  ["小", "8dp", "8px", "Chip"],
  ["中", "12dp", "12px", "卡片"],
  ["大", "16dp", "16px", "FAB、导航抽屉"],
  ["超大", "28dp", "28px", "对话框、大号 FAB"],
  ["全圆", "50%", "999px", "按钮、开关、搜索栏"],
];
$("#shapes").innerHTML = SHAPES.map(([n, dp, r, ex]) => `<div class="shape" style="--r:${r}"><i></i><b>${n} · ${dp}</b><span>${ex}</span></div>`).join("");

/* polar shapes for morphing (all sampled with the same number of points so they can interpolate) */
const N = 180;
const SHAPE_FNS = [
  ["圆形", () => 1],
  ["四瓣饼干", (a) => 1 + 0.12 * Math.cos(4 * a)],
  ["柔方", (a) => 1.08 / Math.pow(Math.abs(Math.cos(a)) ** 4 + Math.abs(Math.sin(a)) ** 4, 1 / 4) * 0.93],
  ["六瓣饼干", (a) => 1 + 0.08 * Math.cos(6 * a)],
  ["花朵", (a) => 1 + 0.2 * Math.pow(Math.abs(Math.cos(4 * a)), 1.6) - 0.08],
  ["九瓣饼干", (a) => 1 + 0.06 * Math.cos(9 * a)],
  ["阳光", (a) => 1 + 0.07 * Math.cos(12 * a)],
];
const sample = (fn, rot = 0) => Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2;
  const r = fn(a - rot);
  return [r * Math.cos(a - Math.PI / 2), r * Math.sin(a - Math.PI / 2)];
});
const toPath = (pts) => "M" + pts.map(([x, y]) => `${x.toFixed(4)} ${y.toFixed(4)}`).join("L") + "Z";

function morpher(pathEl, startIndex) {
  let i = startIndex, pts = sample(SHAPE_FNS[i][1]), anim;
  pathEl.setAttribute("d", toPath(pts));
  return (next) => {
    i = next ?? (i + 1) % SHAPE_FNS.length;
    const from = pts, to = sample(SHAPE_FNS[i][1]), t0 = performance.now(), dur = reduceMotion ? 1 : 650;
    cancelAnimationFrame(anim);
    /* 简化的弹簧：带一点过冲的缓出 */
    const spring = (t) => 1 - Math.exp(-6 * t) * Math.cos(7 * t);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur), k = t === 1 ? 1 : spring(t);
      pts = from.map(([x, y], j) => [x + (to[j][0] - x) * k, y + (to[j][1] - y) * k]);
      pathEl.setAttribute("d", toPath(pts));
      if (t < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
    return SHAPE_FNS[i][0];
  };
}
const morphStage = morpher($("#morphPath"), 0);
$("#morphStage").addEventListener("click", () => { $("#morphName").textContent = morphStage(); });
const heroMorph = morpher($("#heroShape"), 1);
if (!reduceMotion) setInterval(() => { if (!document.hidden) heroMorph(); }, 2600);

/* =====================================================================
   Elevation
   ===================================================================== */
const LEVELS = [["0dp", "平铺内容"], ["1dp", "卡片、按钮"], ["3dp", "菜单、导航栏"], ["6dp", "FAB、对话框"], ["8dp", "悬停中"], ["12dp", "拖动中"]];
const TINT = [0, 5, 8, 11, 12, 14];
function renderLevels() {
  $("#levels").innerHTML = LEVELS.map(([dp, use], i) =>
    `<div class="level" style="box-shadow:var(--md-elev-${i});background:color-mix(in srgb,var(--md-sys-color-primary) ${TINT[i]}%,var(--md-sys-color-surface))"><b>Level ${i}</b><span>${dp} · ${use}</span></div>`
  ).join("");
}
let elevMode = "both";
function updateElevation() {
  const lv = +$("#elevSlider").value;
  const sample = $("#elevSample");
  const shadow = elevMode !== "tone", tone = elevMode !== "shadow";
  sample.style.boxShadow = shadow ? `var(--md-elev-${lv})` : "none";
  sample.style.background = tone ? `color-mix(in srgb,var(--md-sys-color-primary) ${TINT[lv]}%,var(--md-sys-color-surface))` : "var(--md-sys-color-surface)";
  sample.style.transform = shadow ? `translateY(${-lv}px)` : "none";
  $("#elevVal").textContent = `Level ${lv} · ${LEVELS[lv][0]}`;
  setSliderFill($("#elevSlider"));
}
$("#elevSlider").addEventListener("input", updateElevation);
$("#elevMode").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  elevMode = b.dataset.v; updateElevation();
});

/* =====================================================================
   Motion
   ===================================================================== */
const EASES = [
  ["强调", "Emphasized", "cubic-bezier(.2,0,0,1)", [0.2, 0, 0, 1]],
  ["强调 · 减速", "Emphasized decelerate", "cubic-bezier(.05,.7,.1,1)", [0.05, 0.7, 0.1, 1]],
  ["强调 · 加速", "Emphasized accelerate", "cubic-bezier(.3,0,.8,.15)", [0.3, 0, 0.8, 0.15]],
  ["线性（对照）", "Linear", "linear", [0, 0, 1, 1]],
];
$("#easeList").innerHTML = EASES.map(([cn, en, css, [x1, y1, x2, y2]]) => {
  const P = (x, y) => `${4 + x * 44} ${48 - y * 44}`;
  return `<div class="ease"><svg viewBox="0 0 52 52" aria-hidden="true"><line x1="4" y1="48" x2="48" y2="4"/><path d="M${P(0, 0)}C${P(x1, y1)} ${P(x2, y2)} ${P(1, 1)}"/></svg>
  <div class="ease-name"><b>${cn}</b><code>${css}</code></div><div class="ease-track" aria-hidden="true"><span class="ease-dot" style="transition-timing-function:${css}"></span></div></div>`;
}).join("");
$("#easePlay").addEventListener("click", () => $$(".ease-track").forEach((t) => t.classList.toggle("go")));

/* container transform (FLIP between a card and the detail sheet) */
const CT = [
  ["海边相册", "photo_library", "128 张照片 · 上周六。容器变换让用户明白：眼前的详情页就是刚才那张卡片「长大」后的样子，而不是一个新页面。"],
  ["未读邮件", "mail", "你有 3 封未读邮件。展开时卡片的圆角、颜色和位置同时过渡到详情页，返回时再原路收回。"],
  ["周末日程", "calendar_month", "周六 10:00 爬山，周日 15:00 看展。动效时长约 450ms，使用「强调」缓动曲线。"],
];
const ct = $("#ctDetail");
let ctFrom = null;
function targetRect() {
  const w = Math.min(innerWidth, 640), h = Math.min(innerHeight, 560);
  return innerWidth < 600 ? { left: 0, top: 0, width: innerWidth, height: innerHeight, r: 0 } : { left: (innerWidth - w) / 2, top: (innerHeight - h) / 2, width: w, height: h, r: 28 };
}
function openCT(card) {
  const [title, icon, body] = CT[+card.dataset.ct];
  $("#ctTitle").textContent = title; $("#ctIcon").textContent = icon; $("#ctBody").textContent = body;
  ctFrom = card;
  const a = card.getBoundingClientRect(), b = targetRect();
  Object.assign(ct.style, { left: b.left + "px", top: b.top + "px", width: b.width + "px", height: b.height + "px", borderRadius: b.r + "px" });
  ct.hidden = false;
  scrim.hidden = false; scrim.dataset.ct = "1";
  const dur = reduceMotion ? 1 : 450;
  ct.animate([
    { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px", borderRadius: "12px", backgroundColor: getComputedStyle(card).backgroundColor },
    { left: b.left + "px", top: b.top + "px", width: b.width + "px", height: b.height + "px", borderRadius: b.r + "px", backgroundColor: getComputedStyle(ct).backgroundColor },
  ], { duration: dur, easing: "cubic-bezier(.2,0,0,1)" });
  $(".ct-inner", ct).animate([{ opacity: 0 }, { opacity: 0, offset: 0.3 }, { opacity: 1 }], { duration: dur });
  card.style.visibility = "hidden";
  $("#ctClose").focus();
}
function closeCT() {
  if (ct.hidden) return;
  const a = ctFrom.getBoundingClientRect(), b = ct.getBoundingClientRect();
  const dur = reduceMotion ? 1 : 400;
  $(".ct-inner", ct).animate([{ opacity: 1 }, { opacity: 0, offset: 0.4 }, { opacity: 0 }], { duration: dur });
  const anim = ct.animate([
    { left: b.left + "px", top: b.top + "px", width: b.width + "px", height: b.height + "px", borderRadius: ct.style.borderRadius, backgroundColor: getComputedStyle(ct).backgroundColor },
    { left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px", borderRadius: "12px", backgroundColor: getComputedStyle(ctFrom).backgroundColor },
  ], { duration: dur, easing: "cubic-bezier(.2,0,0,1)" });
  anim.onfinish = () => { ct.hidden = true; ctFrom.style.visibility = ""; ctFrom.focus(); };
  scrim.hidden = true; delete scrim.dataset.ct;
}
$("#ctGrid").addEventListener("click", (e) => { const c = e.target.closest(".ct-card"); if (c) openCT(c); });
$("#ctClose").addEventListener("click", closeCT);
scrim.addEventListener("click", () => { if (!ct.hidden) closeCT(); });

/* =====================================================================
   Components
   ===================================================================== */
function setSliderFill(el) {
  const p = ((el.value - el.min) / (el.max - el.min)) * 100;
  el.style.setProperty("--p", p + "%");
}
$$(".slider").forEach((s) => { setSliderFill(s); s.addEventListener("input", () => setSliderFill(s)); });
$("#vol").addEventListener("input", (e) => ($("#volVal").textContent = e.target.value));

document.addEventListener("click", (e) => {
  const t = e.target;
  const filter = t.closest(".chip-filter");
  if (filter) { filter.setAttribute("aria-pressed", String(filter.getAttribute("aria-pressed") !== "true")); return; }
  const toggle = t.closest(".ib-toggle");
  if (toggle) { const on = toggle.getAttribute("aria-pressed") !== "true"; toggle.setAttribute("aria-pressed", String(on)); if (on) snack("已收藏"); return; }
  const rm = t.closest(".chip-input button");
  if (rm) { const chip = rm.closest(".chip-input"); chip.remove(); snack("已移除「设计评审」"); return; }
  const seg = t.closest(".segmented button");
  if (seg) { seg.parentElement.querySelectorAll("button").forEach((b) => b.setAttribute("aria-checked", String(b === seg))); return; }
  const tab = t.closest(".tabs [role=tab]");
  if (tab) { tab.parentElement.querySelectorAll("[role=tab]").forEach((b) => b.setAttribute("aria-selected", String(b === tab))); placeTabIndicator(tab.parentElement); return; }
  const sn = t.closest("[data-snack]");
  if (sn) snack(sn.dataset.snack, sn.dataset.snackAction);
});

function placeTabIndicator(tabs) {
  const sel = tabs.querySelector('[aria-selected="true"]'), ind = tabs.querySelector(".tab-ind");
  const label = sel.getBoundingClientRect(), box = tabs.getBoundingClientRect();
  const w = Math.max(24, sel.textContent.length * 14 + 8);
  ind.style.left = label.left - box.left + (label.width - w) / 2 + "px";
  ind.style.width = w + "px";
}
$$(".tabs").forEach(placeTabIndicator);
addEventListener("resize", () => $$(".tabs").forEach(placeTabIndicator));

/* =====================================================================
   Boot
   ===================================================================== */
renderWalls();
applyScheme();

/* 导航数据单独动态载入：即使失败，也只影响页脚的上一篇 / 下一篇，不影响页面本身 */
import("../shared/siblings.js").then((m) => m.siblings("material")).then((nav) => {
  $$("[data-no]").forEach((el) => (el.textContent = `No.${String(nav.no).padStart(2, "0")}`));
  const card = (s, dir) => s
    ? `<a class="next-card ${dir}" href="${s.href}"><span>${dir === "prev" ? '<span class="ms">arrow_back</span>上一个风格' : '下一个风格<span class="ms">arrow_forward</span>'}</span><b>${s.cn}</b></a>`
    : "";
  $("#footNav").insertAdjacentHTML("beforeend", card(nav.prev, "prev") + card(nav.next, "next"));
}).catch(() => {});
