/* 黏土拟态完整页：可以捏的团子（弹簧物理）、逐项拆解、时间轴、规则演示、组件、响应式示例、黏土生成器与弹簧缓动生成器。 */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
  del(k) { try { localStorage.removeItem(k); } catch (_) {} },
};
const reduceQuery = matchMedia("(prefers-reduced-motion: reduce)");
const calm = () => root.classList.contains("calm") || reduceQuery.matches;

function toast(text) {
  const t = $("#toast");
  t.textContent = text; t.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove("show"), 2400);
}

/* =====================================================================
   Color：sRGB ⇄ OKLab，用来在 JS 里复现 color-mix(in oklab, …)，并计算对比度
   ===================================================================== */
const toRgb = (hex) => { const n = parseInt(hex.replace("#", "").slice(0, 6), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const toHex = (c) => "#" + c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("").toUpperCase();
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const gam = (v) => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
function oklab([r, g, b]) {
  [r, g, b] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function fromOklab([L, A, B]) {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3, m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3, s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [gam(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s), gam(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s), gam(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s)];
}
/* color-mix(in oklab, a, b t) —— t 是 b 所占的比例 */
const mix = (a, b, t) => { const A = oklab(toRgb(a)), B = oklab(toRgb(b)); return toHex(fromOklab(A.map((v, i) => v * (1 - t) + B[i] * t))); };
const lum = (hex) => { const [r, g, b] = toRgb(hex).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const cssVar = (n) => getComputedStyle(root).getPropertyValue(n).trim();
const fmt = (r) => `${r.toFixed(1)} : 1`;
const CANDY = [["lav", "薰衣草"], ["blue", "云朵蓝"], ["orange", "杏橙"], ["mint", "薄荷"], ["pink", "樱花粉"], ["lemon", "柠檬黄"], ["coral", "珊瑚"]];
const candy = (k) => cssVar(`--c-${k}`).toUpperCase();
const shadeTarget = () => ({ to: cssVar("--sd-to"), amt: parseFloat(cssVar("--sd-amt")) / 100, hl: parseFloat(cssVar("--hl-amt")) / 100 });

/* =====================================================================
   Spring：阻尼弹簧 m·x'' = −k(x − 1) − c·x'，采样成 linear() 缓动
   ===================================================================== */
function spring(k, c, m) {
  const dt = 1 / 1000; let x = 0, v = 0, t = 0, still = 0, peak = 0, crossings = 0, prev = -1;
  const xs = [0];
  while (t < 5) {
    const a = (-k * (x - 1) - c * v) / m; v += a * dt; x += v * dt; t += dt;
    peak = Math.max(peak, x);
    const side = Math.sign(x - 1); if (side !== 0 && side !== prev && Math.abs(x - 1) > 0.01) { if (prev !== -1 || side === 1) crossings++; prev = side; }
    if (Math.abs(x - 1) < 0.002 && Math.abs(v) < 0.02) { if ((still += dt) > 0.05) break; } else still = 0;
    xs.push(x);
  }
  const n = Math.max(12, Math.min(48, Math.round(t * 40)));
  const pts = [];
  for (let i = 0; i <= n; i++) pts.push(i === n ? 1 : +xs[Math.round((i / n) * (xs.length - 1))].toFixed(3));
  return { ms: Math.round(t * 1000), pts, xs, peak, bounces: Math.max(0, Math.floor(crossings / 2)), css: `linear(${pts.join(", ")})` };
}

/* =====================================================================
   Theme & calm
   ===================================================================== */
const darkQuery = matchMedia("(prefers-color-scheme: dark)");
let theme = store.get("cl-theme");
const isDark = () => (theme ? theme === "dark" : darkQuery.matches);
const afterTheme = [];
function applyTheme() {
  const dark = isDark();
  root.dataset.theme = dark ? "dark" : "light";
  const t = $("#themeBtn");
  t.setAttribute("aria-checked", String(dark));
  $("use", t).setAttribute("href", dark ? "#i-moon" : "#i-sun");
  requestAnimationFrame(() => afterTheme.forEach((fn) => fn()));
}
$("#themeBtn").addEventListener("click", () => { theme = isDark() ? "light" : "dark"; store.set("cl-theme", theme); applyTheme(); });
darkQuery.addEventListener("change", () => { if (!theme) applyTheme(); });

const calmBtn = $("#calmBtn");
function setCalm(on) {
  root.classList.toggle("calm", on);
  calmBtn.setAttribute("aria-checked", String(on));
  $("use", calmBtn).setAttribute("href", on ? "#i-line" : "#i-wave");
}
calmBtn.addEventListener("click", () => {
  const on = calmBtn.getAttribute("aria-checked") !== "true";
  setCalm(on); store.set("cl-calm", on ? "1" : "0");
  toast(on ? "已减少弹跳：只保留颜色和阴影的变化" : "弹跳动效已恢复");
});

/* =====================================================================
   Shared widgets
   ===================================================================== */
function radioGroup(el, onChange) {
  const items = $$("[role=radio]", el);
  const pick = (b, focus) => {
    items.forEach((x) => { x.setAttribute("aria-checked", String(x === b)); x.tabIndex = x === b ? 0 : -1; });
    if (focus) b.focus();
    onChange?.(b);
  };
  items.forEach((b) => (b.tabIndex = b.getAttribute("aria-checked") === "true" ? 0 : -1));
  el.addEventListener("click", (e) => { const b = e.target.closest("[role=radio]"); if (b && el.contains(b)) pick(b); });
  el.addEventListener("keydown", (e) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!k) return;
    e.preventDefault();
    const i = items.findIndex((x) => x.getAttribute("aria-checked") === "true");
    pick(items[(i + k + items.length) % items.length], true);
  });
  return { pick, current: () => items.find((x) => x.getAttribute("aria-checked") === "true"), items };
}
function tabs(list, onShow) {
  const ts = $$("[role=tab]", list);
  const show = (i, focus) => {
    ts.forEach((t, j) => { const on = i === j; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; $(`#${t.getAttribute("aria-controls")}`).hidden = !on; });
    if (focus) ts[i].focus();
    onShow?.(i, ts[i]);
  };
  list.addEventListener("click", (e) => { const t = e.target.closest("[role=tab]"); if (t) show(ts.indexOf(t)); });
  list.addEventListener("keydown", (e) => {
    const cur = ts.findIndex((t) => t.getAttribute("aria-selected") === "true");
    const n = { ArrowRight: cur + 1, ArrowLeft: cur - 1, Home: 0, End: ts.length - 1 }[e.key]; if (n === undefined) return;
    e.preventDefault(); show((n + ts.length) % ts.length, true);
  });
  return { show, tabs: ts };
}
const boing = (el, cls = "boing") => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

/* =====================================================================
   Nav scroll spy
   ===================================================================== */
const links = $$(".nav-links a");
const spy = new IntersectionObserver((entries) => {
  for (const en of entries) if (en.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${en.target.id}`)));
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main > .sec").forEach((s) => spy.observe(s));

/* =====================================================================
   Hero：标题字块、团子
   ===================================================================== */
$$(".title .ch").forEach((c) => c.addEventListener("pointerdown", () => boing(c)));

const mochi = $("#mochi"), mbody = $("#mochiBody");
let s = 1, sv = 0, ang = 0, ox = 0, oy = 0, vx = 0, vy = 0, raf = 0;
function paintMochi() {
  mbody.style.transform = `translate(${ox.toFixed(2)}px, ${oy.toFixed(2)}px) rotate(${ang}rad) scale(${s.toFixed(4)}, ${(1 / s).toFixed(4)}) rotate(${-ang}rad)`;
  const a = Math.max(s, 1 / s), b = Math.min(s, 1 / s);
  $("#mrA").textContent = a.toFixed(2); $("#mrB").textContent = b.toFixed(2); $("#mrV").textContent = (a * b).toFixed(2);
}
function settle() {
  cancelAnimationFrame(raf);
  if (calm()) { s = 1; ox = oy = 0; sv = vx = vy = 0; paintMochi(); mochi.classList.remove("squeezed"); return; }
  const K = 240, C = 10, dt = 1 / 60;
  const step = () => {
    sv += (-K * (s - 1) - C * sv) * dt; s += sv * dt;
    vx += (-K * ox - C * vx) * dt; ox += vx * dt;
    vy += (-K * oy - C * vy) * dt; oy += vy * dt;
    s = Math.max(.55, s);
    paintMochi();
    if (Math.abs(s - 1) < .0015 && Math.abs(sv) < .02 && Math.abs(ox) < .2 && Math.abs(oy) < .2) {
      s = 1; ox = oy = 0; sv = vx = vy = 0; paintMochi(); mochi.classList.remove("squeezed"); return;
    }
    raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}
function poke() { cancelAnimationFrame(raf); ang = Math.PI / 2; s = .72; sv = 0; mochi.classList.add("squeezed"); paintMochi(); settle(); }
mochi.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  cancelAnimationFrame(raf);
  mochi.setPointerCapture(e.pointerId);
  const sx = e.clientX, sy = e.clientY; let moved = false;
  const move = (ev) => {
    const dx = ev.clientX - sx, dy = ev.clientY - sy, d = Math.hypot(dx, dy);
    if (d > 4) moved = true;
    if (!moved) return;
    mochi.classList.add("squeezed");
    ang = Math.atan2(dy, dx); s = 1 + Math.min(d, 200) / 230; sv = 0;
    ox = Math.max(-40, Math.min(40, dx * .16)); oy = Math.max(-40, Math.min(0, dy * .16)); vx = vy = 0;
    paintMochi();
  };
  const up = () => {
    mochi.removeEventListener("pointermove", move); mochi.removeEventListener("pointerup", up); mochi.removeEventListener("pointercancel", up);
    if (moved) settle(); else poke();
  };
  mochi.addEventListener("pointermove", move); mochi.addEventListener("pointerup", up); mochi.addEventListener("pointercancel", up);
});
mochi.addEventListener("click", (e) => { if (e.detail === 0) poke(); });
mochi.addEventListener("keydown", (e) => {
  const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (!d) return;
  e.preventDefault(); cancelAnimationFrame(raf);
  ang = Math.atan2(d[1], d[0]); s = d[1] === 1 ? .76 : 1.4; sv = 0; ox = d[0] * 18; oy = d[1] === -1 ? -18 : 0;
  mochi.classList.add("squeezed"); paintMochi(); settle();
});
paintMochi();

const pots = radioGroup($("#pots"), (b) => {
  mbody.style.setProperty("--mochi", `var(--c-${b.dataset.c})`);
  store.set("cl-color", b.dataset.c);
});
const savedColor = store.get("cl-color");
if (savedColor && $(`#pots [data-c="${savedColor}"]`)) pots.pick($(`#pots [data-c="${savedColor}"]`));

/* =====================================================================
   01 · 拆解
   ===================================================================== */
const anat = $("#anat");
$$(".anat-ctl input").forEach((cb) => cb.addEventListener("change", () => {
  const p = cb.dataset.part;
  anat.classList.toggle(`A-${p}`, cb.checked);
  $$(`#anatCode [data-part="${p}"]`).forEach((x) => x.classList.toggle("off", !cb.checked));
}));
$$(".anat-ctl input").forEach((cb) => cb.dispatchEvent(new Event("change")));

/* =====================================================================
   02 · 时间轴
   ===================================================================== */
tabs($("#shelf"));

/* =====================================================================
   03 · 规则
   ===================================================================== */
/* 同心圆角 */
const nestPad = $("#nestPad"), nestOuter = $("#nestOuter"), nestInner = $("#nestInner");
const nestSeg = radioGroup($("#nestSeg"), renderNest);
function renderNest() {
  const p = +nestPad.value, R = 40, concentric = nestSeg.current().dataset.m === "concentric";
  const r = concentric ? Math.max(4, R - p) : R;
  nestOuter.style.setProperty("--p", `${p}px`);
  nestInner.style.setProperty("--r", `${r}px`);
  $("#nestPadOut").textContent = `${p}px`;
  $("#nestLabel").textContent = `外 ${R}px · 内 ${r}px`;
}
nestPad.addEventListener("input", renderNest);

/* 色板：高光与暗部从底色推导 */
const swRow = $("#swatchRow");
function renderSwatches() {
  const gray = swRow.classList.contains("grayish"), { to, amt, hl } = shadeTarget();
  swRow.innerHTML = CANDY.slice(0, 6).map(([k, n]) => {
    const c = candy(k), h = mix(c, "#FFFFFF", hl), d = gray ? mix(c, "#000000", .42) : mix(c, to, amt);
    return `<div class="sw-tile"><span class="clay" style="--c:var(--c-${k})"></span><span class="mix" aria-hidden="true"><i style="background:${h}"></i><i style="background:${c}"></i><i style="background:${d}"></i></span><code>${c}</code><span class="sr">${n}：高光 ${h}，暗部 ${d}</span></div>`;
  }).join("");
}
radioGroup($("#shadeSeg"), (b) => { swRow.classList.toggle("grayish", b.dataset.m === "gray"); renderSwatches(); });
afterTheme.push(renderSwatches);

/* 三种缓动 */
const jelly = spring(180, 12, 1);
$("#springBall").style.setProperty("--ease", jelly.css);
$("#easePlay").addEventListener("click", (e) => {
  const tr = $("#tracks"), on = !tr.classList.contains("go");
  tr.classList.toggle("go", on);
  e.currentTarget.lastChild.textContent = on ? "滚回去" : "滚一次";
});

/* =====================================================================
   04 · 组件
   ===================================================================== */
const form = $("#signForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nick = form.elements.nick, v = nick.value.trim();
  const msg = !v ? "先给自己起个昵称吧" : v.length < 2 ? "昵称至少两个字" : "";
  nick.closest(".field").classList.toggle("invalid", !!msg);
  nick.setAttribute("aria-invalid", String(!!msg));
  $("#nickErr").textContent = msg;
  $("#signOk").textContent = msg ? "" : `欢迎你，${v}！（演示，不会保存任何数据）`;
  if (msg) nick.focus(); else toast(`账号已创建：${v}`);
});
$$(".jelly").forEach((j) => j.addEventListener("click", () => {
  j.setAttribute("aria-checked", String(j.getAttribute("aria-checked") !== "true"));
  if (!calm()) boing(j, "wob");
}));
const goal = $("#goal");
goal.addEventListener("input", () => ($("#goalOut").textContent = `${goal.value} 个单词`));
$("#goalOut").textContent = `${goal.value} 个单词`;
let steps = 3;
const stepVal = $("#stepVal");
const setStep = (n) => { steps = Math.max(1, Math.min(9, n)); stepVal.textContent = steps; if (!calm()) boing(stepVal, "pop"); };
$("#stepDown").addEventListener("click", () => setStep(steps - 1));
$("#stepUp").addEventListener("click", () => setStep(steps + 1));

const ctabs = $("#ctabs"), ind = $("#ctabInd");
const moveInd = (i, t) => { ind.style.width = `${t.offsetWidth}px`; ind.style.transform = `translateX(${t.offsetLeft}px)`; };
const ct = tabs(ctabs, moveInd);
new ResizeObserver(() => { const t = ct.tabs.find((x) => x.getAttribute("aria-selected") === "true"); moveInd(0, t); }).observe(ctabs);

$("#sayBtn").addEventListener("click", () => toast("apple · /ˈæp.əl/（演示，没有声音）"));
$("#rightBtn").addEventListener("click", () => toast("太棒了！今天第 10 个单词 ✓"));
$("#againBtn").addEventListener("click", () => toast("好的，稍后再复习一次"));
$("#emptyBtn").addEventListener("click", () => toast("单词库正在路上（演示）"));

/* 响应式示例 */
const rfStage = $("#rfStage"), rfFrame = $("#rfFrame"), rfWidth = $("#rfWidth");
const RF_TEXT = {
  narrow: "单栏：每块黏土占满一行，底部出现一条黏土标签栏；课程按两列排开，手指好按。",
  mid: "两栏：今日目标跨满整行，单词卡和课程并排；标签栏收起，课程变成三列。",
  wide: "三栏：左侧出现侧栏导航，单词卡挪到目标右边，课程排成一整行六块。圆角、阴影令牌始终不变。",
};
function layoutRF() {
  const w = +rfWidth.value, k = Math.min(1, rfStage.clientWidth / w);
  rfFrame.style.setProperty("--w", w); rfFrame.style.setProperty("--k", k.toFixed(4));
  rfStage.style.height = `${Math.ceil(rfFrame.offsetHeight * k)}px`;
  $("#rfOut").textContent = `${w}px`;
  const mode = w >= 900 ? "wide" : w >= 560 ? "mid" : "narrow";
  $("#rfRead").innerHTML = `<b>${w}px</b> → ${RF_TEXT[mode]}${k < 1 ? `（按 ${Math.round(k * 100)}% 缩小显示）` : ""}`;
  $$("#rfPresets button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.w === w)));
}
rfWidth.addEventListener("input", layoutRF);
$$("#rfPresets button").forEach((b) => b.addEventListener("click", () => { rfWidth.value = b.dataset.w; layoutRF(); }));
new ResizeObserver(layoutRF).observe(rfStage);

/* =====================================================================
   05 · 工坊
   ===================================================================== */
tabs($("#wsTabs"));

/* 黏土生成器 */
$("#genColors").innerHTML = CANDY.map(([k, n], i) => `<button type="button" role="radio" class="clay press" aria-checked="${i === 0}" data-k="${k}" style="--c:var(--c-${k})" aria-label="${n}"></button>`).join("");
const G = { r: $("#gR"), d: $("#gD"), l: $("#gL"), h: $("#gH"), s: $("#gS") };
const genColorInput = $("#genColor");
let genHex = null;
const genDots = radioGroup($("#genColors"), () => { genHex = null; renderGen(); });
const genShape = radioGroup($("#genShape"), renderGen);
genColorInput.addEventListener("input", () => {
  genHex = genColorInput.value.toUpperCase();
  genDots.items.forEach((x) => x.setAttribute("aria-checked", "false"));
  renderGen();
});
const SHAPES = {
  card: { w: 250, h: 170, r: null },
  pill: { w: 250, h: 92, r: "46px" },
  ball: { w: 170, h: 170, r: "50%" },
  blob: { w: 220, h: 180, r: "50% 50% 44% 44% / 60% 60% 40% 40%" },
};
function renderGen() {
  const c = genHex || candy(genDots.current()?.dataset.k || "lav");
  const shape = genShape.current().dataset.s, S = SHAPES[shape];
  const R = +G.r.value, D = +G.d.value, L = +G.l.value, H = +G.h.value / 100, Sd = +G.s.value / 100;
  const { to } = shapeTargetFor();
  const hl = mix(c, "#FFFFFF", H), sd = mix(c, to, Sd);
  const dark = root.dataset.theme === "dark";
  const drop = dark ? "rgb(0 0 0 / .45)" : "rgb(61 44 92 / .2)";
  const radius = S.r || `${R}px`;
  const shadow = `${L ? `${L}px ${+(L * 1.25).toFixed(1)}px ${+(L * 2.5).toFixed(1)}px ${drop},\n    ` : ""}inset ${D}px ${D}px ${D * 2}px ${hl},\n    inset -${D}px -${D}px ${D * 2}px ${sd}`;
  const grape = "#33244F", white = "#FFFFFF", cg = contrast(grape, c), cw = contrast(white, c);
  const ink = cg >= cw ? grape : white, best = Math.max(cg, cw);
  const p = $("#genPiece");
  Object.assign(p.style, { width: `${S.w}px`, maxWidth: "100%", height: `${S.h}px`, borderRadius: radius, background: c, color: ink, boxShadow: shadow.replace(/\n\s*/g, " ") });
  G.r.disabled = !!S.r;
  $("#gvR").textContent = S.r ? "由形状决定" : `${R}px`;
  $("#gvD").textContent = `${D}px`; $("#gvL").textContent = `${L}px`;
  $("#gvH").textContent = `${Math.round(H * 100)}%`; $("#gvS").textContent = `${Math.round(Sd * 100)}%`;
  $("#genMeter").innerHTML = `文字用 <b>${ink === grape ? "葡萄紫" : "白色"}</b>：<b class="${best >= 4.5 ? "pass" : "fail"}">${fmt(best)}</b>${best >= 4.5 ? " · 正文达标" : best >= 3 ? " · 只够大字（≥ 3 : 1）" : " · 不达标，换一个颜色"}<br><small>葡萄紫 ${fmt(cg)} · 白色 ${fmt(cw)}　高光 ${hl} · 暗部 ${sd}</small>`;
  $("#genCode").textContent = `.clay {
  background: ${c};
  color: ${ink};              /* 对比度 ${fmt(best)} */
  border-radius: ${radius};
  box-shadow:
    ${shadow};
}
.clay:active { transform: scale(1.06, .88); }

/* 现代写法：只改 --c，高光和暗部自动推导 */
.clay {
  --c: ${c};
  background: var(--c);
  box-shadow:
    ${L ? `${L}px ${+(L * 1.25).toFixed(1)}px ${+(L * 2.5).toFixed(1)}px ${drop},\n    ` : ""}inset ${D}px ${D}px ${D * 2}px color-mix(in oklab, var(--c), white ${Math.round(H * 100)}%),
    inset -${D}px -${D}px ${D * 2}px color-mix(in oklab, var(--c), ${to} ${Math.round(Sd * 100)}%);
}`;
}
const shapeTargetFor = () => ({ to: root.dataset.theme === "dark" ? "#0C0716" : "#3D2C5C" });
Object.values(G).forEach((i) => i.addEventListener("input", renderGen));
afterTheme.push(renderGen);

/* 弹簧缓动生成器 */
const SP = { k: $("#sK"), c: $("#sC"), m: $("#sM") };
const spBall = $("#spBall"), spBtn = $("#spBtn"), spDemo = $(".spring-demo");
let cur = null;
function renderSpring() {
  const k = +SP.k.value, c = +SP.c.value, m = +SP.m.value;
  cur = spring(k, c, m);
  $("#svK").textContent = k; $("#svC").textContent = c; $("#svM").textContent = m.toFixed(1);
  const max = Math.max(1.3, cur.peak + .05), N = cur.xs.length;
  const pts = [];
  for (let i = 0; i <= 120; i++) { const x = cur.xs[Math.round((i / 120) * (N - 1))]; pts.push(`${(i / 120 * 300).toFixed(1)},${(140 - (x / max) * 140).toFixed(1)}`); }
  $("#springLine").setAttribute("points", pts.join(" "));
  const gl = $("#springPlot .goal-line"); const gy = (140 - (1 / max) * 140).toFixed(1); gl.setAttribute("y1", gy); gl.setAttribute("y2", gy);
  const over = Math.max(0, (cur.peak - 1) * 100);
  $("#springMeter").innerHTML = `时长约 <b>${cur.ms}ms</b> · 最大过冲 <b>${over.toFixed(1)}%</b> · 来回晃 <b>${cur.bounces}</b> 次<br><small>${over < 1 ? "几乎不过冲：稳重，适合开关和标签切换。" : over < 12 ? "轻微过冲：利落又有弹性，适合按钮回弹。" : "明显的果冻感：适合吉祥物、奖励和弹窗出场，别用在频繁操作的控件上。"}</small>`;
  $("#springCode").textContent = `:root {
  /* stiffness ${k} · damping ${c} · mass ${m.toFixed(1)} → 约 ${cur.ms}ms */
  --spring: ${cur.css};
}
.clay {
  transition: transform ${cur.ms}ms var(--spring);
}
.clay:active {
  transform: scale(1.06, .88);
  transition-duration: 100ms;   /* 按下要快，松开再慢慢弹回 */
}
@supports not (transition-timing-function: linear(0, 1)) {
  :root { --spring: cubic-bezier(.34, 1.56, .64, 1); }
}`;
  spDemo.style.setProperty("--sd", `${cur.ms}ms`);
  spDemo.style.setProperty("--se", cur.css);
}
Object.values(SP).forEach((i) => i.addEventListener("input", renderSpring));
$$(".presets .chip").forEach((b) => b.addEventListener("click", () => {
  SP.k.value = b.dataset.k; SP.c.value = b.dataset.c; SP.m.value = b.dataset.m; renderSpring(); playSpring();
}));
function playSpring() { spDemo.classList.toggle("go"); }
$("#springPlay").addEventListener("click", playSpring);
spBtn.addEventListener("click", () => toast(`松手后按 ${cur.ms}ms 的弹簧回弹`));

/* =====================================================================
   07 · 令牌表
   ===================================================================== */
function renderTokens() {
  const bg = cssVar("--bg").toUpperCase(), surf = cssVar("--surface").toUpperCase(), ink = cssVar("--ink").toUpperCase(), ink2 = cssVar("--ink-2").toUpperCase(), onc = cssVar("--on-c").toUpperCase();
  const row = (name, val, use, ct, sw) => `<tr><td><code>${name}</code></td><td>${sw ? `<i class="sw" style="--c:${sw}"></i>` : ""}<code>${val}</code></td><td>${use}</td><td>${ct == null ? "—" : `<span class="ct ${ct >= 4.5 ? "pass" : "fail"}">${fmt(ct)}</span>`}</td></tr>`;
  $("#tokenBody").innerHTML = [
    row("--ink", ink, "正文文字（在页面底色上）", contrast(ink, bg), ink),
    row("--ink-2", ink2, "次要文字（在卡片上）", contrast(ink2, surf), ink2),
    row("--surface", surf, "卡片黏土的底色", null, surf),
    ...CANDY.map(([k, n]) => row(`--c-${k}`, candy(k), `${n}黏土 · 上面放 --on-c 文字`, contrast(onc, candy(k)), candy(k))),
    row("--drop", cssVar("--drop"), "外投影颜色：带一点葡萄紫，而不是纯黑", null),
    row("圆角", "16 / 22 / 26 / 34 / 40px · 50%", "标签 / 按钮 / 小卡片 / 卡片 / 大区块 · 圆形按钮", null),
    row("体积 --d", "4 / 6 / 10 / 22px", "小控件 / 按钮 / 卡片 / 吉祥物：内阴影的偏移，模糊取两倍", null),
    row("--spring", "300 · 26 · 1 → 约 550ms", "按钮、开关的回弹", null),
    row("--jelly", "180 · 12 · 1 → 约 1050ms", "吉祥物、标签指示块、徽章出场", null),
  ].join("");
}
afterTheme.push(renderTokens);

/* =====================================================================
   Copy · reset · boot
   ===================================================================== */
document.addEventListener("click", (e) => {
  const b = e.target.closest(".copy"); if (!b) return;
  const code = $(`#${b.dataset.copy}`), label = $("span", b);
  const done = (msg) => { label.textContent = msg; setTimeout(() => (label.textContent = "复制"), 1400); };
  try { navigator.clipboard.writeText(code.textContent).then(() => done("已复制"), () => done("请手动复制")); }
  catch (_) { done("请手动复制"); }
});

$("#resetBtn").addEventListener("click", () => {
  ["cl-theme", "cl-calm", "cl-color"].forEach(store.del);
  $$("input").forEach((i) => {
    if (i.type === "checkbox" || i.type === "radio") i.checked = i.defaultChecked;
    else i.value = i.defaultValue;
  });
  try { sessionStorage.setItem("cl-reset", "1"); } catch (_) {}
  location.reload();
});

const calmPref = store.get("cl-calm");
setCalm(calmPref === "1" || (calmPref === null && reduceQuery.matches));
applyTheme();
renderNest();
renderSpring();
layoutRF();
try {
  if (sessionStorage.getItem("cl-reset")) { sessionStorage.removeItem("cl-reset"); toast("已恢复初始状态"); }
} catch (_) {}
