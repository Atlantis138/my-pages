/* 玻璃拟态完整页：可拖动的光斑、六层拆解、时间轴与液态透镜、厚度对比度估算、组件、响应式示例、玻璃实验室。 */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
  del(k) { try { localStorage.removeItem(k); } catch (_) {} },
};
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

function toast(text) {
  const t = $("#toast");
  t.textContent = text; t.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* =====================================================================
   Color helpers：把 CSS 变量解析成 [r, g, b, a]，估算「着色层叠在背景上」后的文字对比度
   ===================================================================== */
const probe = document.createElement("i");
probe.style.display = "none";
document.body.appendChild(probe);
function rgba(css) {
  probe.style.color = "";
  probe.style.color = css;
  const m = getComputedStyle(probe).color.match(/[\d.]+/g).map(Number);
  return [m[0], m[1], m[2], m.length > 3 ? m[3] : 1];
}
const cssVar = (name) => getComputedStyle(root).getPropertyValue(name).trim();
const tok = (name) => rgba(`var(${name})`);
const hex = (c) => "#" + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();
const lum = (c) => {
  const [r, g, b] = c.slice(0, 3).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const over = (top, under) => { const a = top[3]; return [0, 1, 2].map((i) => top[i] * a + under[i] * (1 - a)).concat(1); };
const mixc = (a, b, t) => [0, 1, 2].map((i) => a[i] * t + b[i] * (1 - t)).concat(1);
/* 文字压在「着色层 + 背景中任一颜色」上时的最差对比度。未计入模糊造成的混色（模糊只会让结果更温和）与饱和度提升。 */
const worst = (ink, tint, colors) => Math.min(...colors.map((c) => contrast(ink, over(tint, c))));
const sceneColors = (bg) => {
  if (bg === "scene") return ["--sky1", "--sky2", "--sun", "--hill1", "--hill2", "--hill3"].map(tok);
  if (bg === "text") return [tok("--sb1"), tok("--sb2"), tok("--ink")];
  if (bg === "plain") return [tok("--plain")];
  return ["--sb1", "--sb2", "--o1", "--o2", "--o3", "--o4"].map(tok);
};
/* 整页背景：光斑以 50% 不透明度叠在底色上（第四个是 38%） */
const skyColors = () => {
  const b1 = tok("--sb1"), b2 = tok("--sb2");
  return [b1, b2, mixc(tok("--o1"), b1, .5), mixc(tok("--o2"), b2, .5), mixc(tok("--o3"), b2, .5), mixc(tok("--o4"), b1, .38)];
};
const fmt = (r) => `${r.toFixed(1)} : 1`;

/* =====================================================================
   Theme & reduced transparency
   ===================================================================== */
const darkQuery = matchMedia("(prefers-color-scheme: dark)");
let theme = store.get("gl-theme");
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
$("#themeBtn").addEventListener("click", () => { theme = isDark() ? "light" : "dark"; store.set("gl-theme", theme); applyTheme(); });
darkQuery.addEventListener("change", () => { if (!theme) applyTheme(); });

const solidBtn = $("#solidBtn");
function setSolid(on) {
  root.classList.toggle("solid", on);
  solidBtn.setAttribute("aria-checked", String(on));
  $("use", solidBtn).setAttribute("href", on ? "#i-solid" : "#i-drop");
}
solidBtn.addEventListener("click", () => {
  const on = solidBtn.getAttribute("aria-checked") !== "true";
  setSolid(on); store.set("gl-solid", on ? "1" : "0");
  toast(on ? "已降低透明度：界面面板改为实色" : "已恢复玻璃效果");
});

/* =====================================================================
   Shared widgets
   ===================================================================== */
/* role="radiogroup" 的分段控件：点击或方向键切换 */
function radioGroup(el, onChange) {
  const items = $$("[role=radio]", el);
  const pick = (b, focus) => {
    items.forEach((x) => { x.setAttribute("aria-checked", String(x === b)); x.tabIndex = x === b ? 0 : -1; });
    if (focus) b.focus();
    onChange?.(b);
  };
  items.forEach((b) => (b.tabIndex = b.getAttribute("aria-checked") === "true" ? 0 : -1));
  el.addEventListener("click", (e) => { const b = e.target.closest("[role=radio]"); if (b) pick(b); });
  el.addEventListener("keydown", (e) => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const i = items.findIndex((x) => x.getAttribute("aria-checked") === "true");
    pick(items[(i + k + items.length) % items.length], true);
  });
  return { pick, current: () => items.find((x) => x.getAttribute("aria-checked") === "true") };
}

/* 在容器里拖动一个绝对定位元素（百分比坐标），方向键也能移动 */
function draggable(el, box, get, set) {
  el.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    el.classList.add("dragging");
    const r = box.getBoundingClientRect(), [x0, y0] = get();
    const sx = e.clientX, sy = e.clientY;
    const move = (ev) => set(x0 + ((ev.clientX - sx) / r.width) * 100, y0 + ((ev.clientY - sy) / r.height) * 100);
    const up = () => { el.classList.remove("dragging"); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); set(...get(), true); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  });
  el.addEventListener("keydown", (e) => {
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (!d) return;
    e.preventDefault();
    const s = e.shiftKey ? 8 : 2, [x, y] = get();
    set(x + d[0] * s, y + d[1] * s, true);
  });
}
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* =====================================================================
   Nav scroll spy
   ===================================================================== */
const links = $$(".nav-links a");
const spy = new IntersectionObserver((entries) => {
  for (const en of entries) if (en.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${en.target.id}`)));
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main > .sec").forEach((s) => spy.observe(s));

/* =====================================================================
   Hero：光斑、配方滑块、背景切换
   ===================================================================== */
const stage = $("#stage"), heroCard = $("#heroCard");
const ORB_DEFAULT = [[16, 24], [78, 70], [62, 18]];
let orbPos;
try { orbPos = JSON.parse(store.get("gl-orbs")) || ORB_DEFAULT; } catch (_) { orbPos = ORB_DEFAULT; }
if (!Array.isArray(orbPos) || orbPos.length !== 3) orbPos = ORB_DEFAULT;
const orbs = $$(".orb");
const saveOrbs = () => store.set("gl-orbs", JSON.stringify(orbPos.map((p) => p.map((v) => Math.round(v)))));
orbs.forEach((o, i) => {
  const place = () => { o.style.setProperty("--x", `${orbPos[i][0]}%`); o.style.setProperty("--y", `${orbPos[i][1]}%`); };
  place();
  draggable(o, stage, () => orbPos[i], (x, y, done) => { orbPos[i] = [clamp(x, 0, 100), clamp(y, 0, 100)]; place(); if (done) saveOrbs(); });
});
$("#orbShuffle").addEventListener("click", () => {
  orbPos = orbPos.map(() => [10 + Math.random() * 80, 10 + Math.random() * 80]);
  orbs.forEach((o, i) => { o.style.setProperty("--x", `${orbPos[i][0]}%`); o.style.setProperty("--y", `${orbPos[i][1]}%`); });
  saveOrbs();
  if (stage.dataset.bg !== "blobs") bgGroup.pick($('#bgSeg [data-bg="blobs"]'));
});

const BG_NOTE = {
  blobs: "光斑在玻璃后面化成柔和的色晕，这是玻璃拟态最典型的样子。",
  scene: "照片类背景细节多，模糊要足够大，文字才不会和背景打架。",
  text: "背后的字被模糊成一片纹理：模糊的首要任务，是让背景「读不出来」。",
  plain: "背后只有一种颜色时，玻璃几乎消失了，因为没有东西可以被模糊。",
};
const bgGroup = radioGroup($("#bgSeg"), (b) => { stage.dataset.bg = b.dataset.bg; $("#bgNote").textContent = BG_NOTE[b.dataset.bg]; });
$("#bgNote").textContent = BG_NOTE.blobs;

const hB = $("#hBlur"), hT = $("#hTint"), hS = $("#hSat");
function renderHero() {
  const b = +hB.value, t = +hT.value / 100, s = +hS.value;
  heroCard.style.setProperty("--hb", `${b}px`);
  heroCard.style.setProperty("--ht", t);
  heroCard.style.setProperty("--hs", `${s}%`);
  $("#hvBlur").textContent = `${b}px`;
  $("#hvTint").textContent = `${Math.round(t * 100)}%`;
  $("#hvSat").textContent = `${s}%`;
  const rgb = cssVar("--tint-rgb");
  $("#heroCode").textContent = `backdrop-filter: blur(${b}px) saturate(${s}%);\nbackground: rgb(${rgb} / ${+t.toFixed(2)});`;
}
[hB, hT, hS].forEach((i) => i.addEventListener("input", renderHero));
afterTheme.push(renderHero);

/* =====================================================================
   01 · 六层
   ===================================================================== */
const pane = $("#pane");
$$(".layer-list input").forEach((cb) => cb.addEventListener("change", () => {
  const L = cb.dataset.layer;
  pane.classList.toggle(`L-${L}`, cb.checked);
  $$(`[data-layer="${L}"]:not(input)`).forEach((x) => x.classList.toggle("off", !cb.checked));
}));
$$(".layer-list input").forEach((cb) => cb.dispatchEvent(new Event("change")));

/* =====================================================================
   02 · 时间轴
   ===================================================================== */
const tabs = $$("#timeline [role=tab]");
function showEra(i, focus) {
  tabs.forEach((t, j) => {
    const on = i === j;
    t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1;
    $(`#${t.getAttribute("aria-controls")}`).hidden = !on;
  });
  if (focus) tabs[i].focus();
  if (i === 7) placeLens();
}
$("#timeline").addEventListener("click", (e) => { const t = e.target.closest("[role=tab]"); if (t) showEra(tabs.indexOf(t)); });
$("#timeline").addEventListener("keydown", (e) => {
  const cur = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
  const next = { ArrowRight: cur + 1, ArrowLeft: cur - 1, Home: 0, End: tabs.length - 1 }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  showEra((next + tabs.length) % tabs.length, true);
});

/* Liquid Glass 透镜：生成一张位移贴图（R = x 位移，G = y 位移），边缘一圈把内侧的像素往外「推」，近似透镜折射 */
const lens = $("#lens"), lqStage = $("#liquidStage");
function lensMap(W, H, R, band) {
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d"), img = ctx.createImageData(W, H);
  const sdf = (x, y) => {
    const px = Math.abs(x - W / 2) - (W / 2 - R), py = Math.abs(y - H / 2) - (H / 2 - R);
    return Math.hypot(Math.max(px, 0), Math.max(py, 0)) + Math.min(Math.max(px, py), 0) - R;
  };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const d = sdf(x + .5, y + .5);
    let dx = 0, dy = 0;
    if (d < 0 && -d < band) {
      const gx = sdf(x + 1.5, y + .5) - sdf(x - .5, y + .5), gy = sdf(x + .5, y + 1.5) - sdf(x + .5, y - .5);
      const gl = Math.hypot(gx, gy) || 1, k = (1 + d / band) ** 2;
      dx = (-gx / gl) * k; dy = (-gy / gl) * k;
    }
    const i = (y * W + x) * 4;
    img.data[i] = 128 + dx * 127; img.data[i + 1] = 128 + dy * 127; img.data[i + 2] = 128; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}
const chromium = !!navigator.userAgentData?.brands?.some((b) => /Chromium|Google Chrome|Microsoft Edge/.test(b.brand));
if (chromium) {
  const url = lensMap(200, 132, 66, 34);
  const fe = $("#lqMap");
  fe.setAttribute("href", url);
  fe.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", url);
  lens.classList.add("refract");
  $("#lqNote").textContent = "Chromium：边缘折射由 feDisplacementMap 计算";
} else {
  $("#lqNote").textContent = "当前浏览器不支持在 backdrop-filter 里使用 SVG 滤镜，显示为普通模糊";
}
let lensPos = [30, 22];
function placeLens() {
  const r = lqStage.getBoundingClientRect();
  if (!r.width) return;
  const mx = 100 - (200 / r.width) * 100, my = 100 - (132 / r.height) * 100;
  lensPos = [clamp(lensPos[0], 0, Math.max(0, mx)), clamp(lensPos[1], 0, Math.max(0, my))];
  lens.style.setProperty("--lx", `${lensPos[0]}%`); lens.style.setProperty("--ly", `${lensPos[1]}%`);
}
draggable(lens, lqStage, () => lensPos, (x, y) => { lensPos = [x, y]; placeLens(); });
addEventListener("resize", placeLens);

/* =====================================================================
   03 · 规则
   ===================================================================== */
function renderThick() {
  const ink = tok("--ink"), rgb = cssVar("--tint-rgb").split(/\s+/).map(Number), colors = sceneColors("blobs");
  $$("#thickRow .tk").forEach((tk) => {
    const t = +getComputedStyle(tk).getPropertyValue("--t");
    const r = worst(ink, [...rgb, t], colors);
    const em = $("em", tk);
    em.textContent = fmt(r);
    em.classList.toggle("fail", r < 4.5);
    em.title = r < 4.5 ? "正文不达标（< 4.5 : 1）" : "正文达标";
  });
}
afterTheme.push(renderThick);

const specCard = $("#specCard");
radioGroup($("#edgeSeg"), (b) => (specCard.dataset.edge = b.dataset.edge));
specCard.addEventListener("pointermove", (e) => {
  const r = specCard.getBoundingClientRect();
  specCard.style.setProperty("--mx", `${e.clientX - r.left}px`);
  specCard.style.setProperty("--my", `${e.clientY - r.top}px`);
});
specCard.addEventListener("pointerleave", () => { specCard.style.removeProperty("--mx"); specCard.style.removeProperty("--my"); });

/* =====================================================================
   04 · 组件
   ===================================================================== */
/* 登录表单 */
const form = $("#loginForm");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const mail = form.elements.mail, pass = form.elements.pass;
  const errs = [
    [mail, !mail.value ? "请输入邮箱" : !mail.validity.valid ? "邮箱格式不对，例如 you@example.com" : ""],
    [pass, !pass.value ? "请输入密码" : pass.value.length < 6 ? "密码至少 6 位" : ""],
  ];
  let first = null;
  for (const [inp, msg] of errs) {
    inp.closest(".field").classList.toggle("invalid", !!msg);
    inp.setAttribute("aria-invalid", String(!!msg));
    $(`#${inp.getAttribute("aria-describedby")}`).textContent = msg;
    if (msg && !first) first = inp;
  }
  $("#loginOk").textContent = first ? "" : "登录成功（演示，不会发送任何数据）";
  first?.focus();
});

/* 控制中心 */
$$(".cc-tile").forEach((t) => t.addEventListener("click", () => {
  const on = t.getAttribute("aria-pressed") !== "true";
  t.setAttribute("aria-pressed", String(on));
  const name = $("b", t).textContent;
  $("small", t).textContent = on ? (name === "Wi-Fi" ? "已连接" : "开启") : "关闭";
}));
$("#bright").addEventListener("input", (e) => ($("#vBright").textContent = `${e.target.value}%`));
$("#vBright").textContent = `${$("#bright").value}%`;
radioGroup($("#periodSeg"));

/* 通知 */
const NOTES = [
  ["#i-bell", "#E0457F", "新消息", "小林：今晚一起去看展吗？"],
  ["#i-cloud", "#3E62E8", "天气", "大理 · 傍晚 18 时起有阵雨"],
  ["#i-play", "#7B4FE0", "音乐", "Frosted Morning 已加入歌单"],
  ["#i-grid", "#0F8F78", "日历", "15:00 设计评审 · 三楼会议室"],
];
let noteIdx = 0;
const stack = $("#notifStack");
function layoutNotes() { $$(".nt", stack).forEach((n, i) => { n.style.setProperty("--n", i); n.style.opacity = String(1 - i * .18); n.style.zIndex = String(10 - i); }); }
$("#notifBtn").addEventListener("click", () => {
  const [ic, c, title, text] = NOTES[noteIdx++ % NOTES.length];
  const n = document.createElement("div");
  n.className = "nt enter";
  n.innerHTML = `<span class="nt-ic" style="background:${c}"><svg class="ic"><use href="${ic}"/></svg></span><p><b>${title}</b>${text}</p><button type="button" aria-label="关闭通知：${title}"><svg class="ic"><use href="#i-x"/></svg></button>`;
  stack.prepend(n);
  $$(".nt", stack).slice(3).forEach((x) => x.remove());
  layoutNotes();
  requestAnimationFrame(() => requestAnimationFrame(() => n.classList.remove("enter")));
});
stack.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { b.closest(".nt").remove(); layoutNotes(); $("#notifBtn").focus(); } });

/* 筛选标签：多选 */
$("#chips").addEventListener("click", (e) => {
  const c = e.target.closest(".chip"); if (!c) return;
  c.setAttribute("aria-pressed", String(c.getAttribute("aria-pressed") !== "true"));
});

/* 播放器 */
const playBtn = $("#playBtn");
let prog = 32, timer = null;
playBtn.addEventListener("click", () => {
  const on = playBtn.getAttribute("aria-pressed") !== "true";
  playBtn.setAttribute("aria-pressed", String(on));
  playBtn.setAttribute("aria-label", on ? "暂停" : "播放");
  $("use", playBtn).setAttribute("href", on ? "#i-pause" : "#i-play");
  clearInterval(timer);
  if (on) timer = setInterval(() => { prog = (prog + .5) % 100; $("#plFill").style.width = `${prog}%`; }, 200);
});

/* 对话框与标签栏 */
const dlg = $("#dlg");
$("#dlgBtn").addEventListener("click", () => dlg.showModal());
dlg.addEventListener("close", () => toast(dlg.returnValue === "ok" ? "已开启通知（演示）" : "已关闭对话框"));
$("#tabbar").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  $$("#tabbar button").forEach((x) => (x === b ? x.setAttribute("aria-current", "page") : x.removeAttribute("aria-current")));
});

/* 响应式示例：按自身宽度（容器查询）切换布局，窄屏上整体缩放显示 */
const rfStage = $("#rfStage"), rfFrame = $("#rfFrame"), rfWidth = $("#rfWidth");
const RF_TEXT = {
  narrow: "单栏堆叠：侧栏收起，底部出现一条玻璃标签栏（position: sticky），内容从它下面滚过。",
  mid: "两栏：当前温度跨两行，逐小时预报和空气质量并排；标签栏隐藏，搜索留在顶栏。",
  wide: "四栏：左侧出现玻璃侧栏，主区按 1.1 : 1 : 1 分配。面板始终是同一套玻璃令牌，变的只是排列。",
};
function layoutRF() {
  const w = +rfWidth.value, k = Math.min(1, rfStage.clientWidth / w);
  rfFrame.style.setProperty("--w", w);
  rfFrame.style.setProperty("--k", k.toFixed(4));
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
   05 · 实验室
   ===================================================================== */
const L = { blur: $("#lBlur"), sat: $("#lSat"), tint: $("#lTint"), edge: $("#lEdge"), rad: $("#lRad"), noise: $("#lNoise"), shadow: $("#lShadow") };
const labGlass = $("#labGlass"), labStage = $("#labStage");
const labBg = radioGroup($("#labBg"), (b) => { labStage.dataset.bg = b.dataset.bg; renderLab(); });
const labTint = radioGroup($("#labTintC"), renderLab);
const labInk = radioGroup($("#labInk"), renderLab);
const a2 = (v) => String(+v.toFixed(2)).replace(/^0\./, ".");
function renderLab() {
  const blur = +L.blur.value, sat = +L.sat.value, t = +L.tint.value / 100, e = +L.edge.value / 100, rad = +L.rad.value;
  const c = labTint.current().dataset.c, ink = labInk.current().dataset.c;
  const s = labGlass.style;
  s.setProperty("--lb", `${blur}px`); s.setProperty("--ls", `${sat}%`); s.setProperty("--lc", c.replace(/,/g, " "));
  s.setProperty("--lt", t); s.setProperty("--le", e); s.setProperty("--lr", `${rad}px`); s.setProperty("--lk", ink);
  s.setProperty("--ln", L.noise.checked ? "var(--noise)" : "none");
  s.setProperty("--lsh", L.shadow.checked ? "0 20px 50px rgb(20 10 60 / .25)" : "none");
  $("#lvBlur").textContent = `${blur}px`; $("#lvSat").textContent = `${sat}%`; $("#lvTint").textContent = `${Math.round(t * 100)}%`;
  $("#lvEdge").textContent = `${Math.round(e * 100)}%`; $("#lvRad").textContent = `${rad}px`;

  const rgb = c.split(",").map(Number), inkC = rgba(ink);
  const r = worst(inkC, [...rgb, t], sceneColors(labStage.dataset.bg));
  const pass = r >= 4.5, large = r >= 3;
  $("#labMeter").innerHTML = `最差文字对比度 <b class="${pass ? "pass" : "fail"}">${fmt(r)}</b> · ${pass ? "正文达标" : large ? "只够大标题（≥ 3 : 1），正文请加厚着色或换文字颜色" : "不达标：加厚着色、换深浅相反的文字，或换背景"}<br><small>估算方法：着色层分别叠在背景最亮、最暗的颜色上，取最差值；未计入模糊带来的混色。</small>`;

  const fb = rgb[0] > 128 ? `rgb(${rgb.join(" ")} / ${a2(Math.max(.85, t))})` : `rgb(${rgb.join(" ")} / ${a2(Math.max(.9, t))})`;
  $("#labCode").textContent = `.glass {
  background-color: rgb(${rgb.join(" ")} / ${a2(t)});${L.noise.checked ? `\n  background-image: url("noise.svg");   /* 约 4% 的细噪点 */` : ""}
  -webkit-backdrop-filter: blur(${blur}px) saturate(${sat}%);
          backdrop-filter: blur(${blur}px) saturate(${sat}%);
  border: 1px solid rgb(255 255 255 / ${a2(e)});
  border-radius: ${rad}px;
  box-shadow: ${L.shadow.checked ? "0 20px 50px rgb(20 10 60 / .25),\n              " : ""}inset 0 1px 0 rgb(255 255 255 / ${a2(Math.min(1, e * 1.4))});
  color: ${ink};
}
/* 不支持 backdrop-filter 时，换成更不透明的底色 */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass { background-color: ${fb}; }
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background-color: ${fb}; backdrop-filter: none; -webkit-backdrop-filter: none; }
}`;
}
Object.values(L).forEach((i) => i.addEventListener("input", renderLab));
afterTheme.push(renderLab);

/* =====================================================================
   07 · 令牌表
   ===================================================================== */
function renderTokens() {
  const sky = skyColors(), white = [255, 255, 255, 1];
  const tint = tok("--tint"), thick = tok("--tint-thick");
  const row = (name, val, use, ct, need = 4.5, sw = null) => {
    const c = ct == null ? "—" : `<span class="ct ${ct >= need ? "pass" : "fail"}">${fmt(ct)}</span>`;
    return `<tr><td><code>${name}</code></td><td>${sw ? `<i class="sw" style="--c:${sw}"></i>` : ""}<code>${val}</code></td><td>${use}</td><td>${c}</td></tr>`;
  };
  const ink = tok("--ink"), ink2 = tok("--ink-2"), acc = tok("--accent"), focus = tok("--focus");
  $("#tokenBody").innerHTML = [
    row("--ink", hex(ink), "正文文字（常规玻璃上）", worst(ink, tint, sky), 4.5, hex(ink)),
    row("--ink-2", hex(ink2), "次要文字", worst(ink2, tint, sky), 4.5, hex(ink2)),
    row("--tint", cssVar("--tint"), "常规玻璃着色 · blur 20px", null, 0, cssVar("--tint")),
    row("--tint-thick", cssVar("--tint-thick"), "厚玻璃：首屏文案、通知、对话框 · blur 28px", worst(ink, thick, sky), 4.5, cssVar("--tint-thick")),
    row("--accent", hex(acc), "主按钮底色（白字）", contrast(white, acc), 4.5, hex(acc)),
    row("--focus", hex(focus), "焦点环（界面元素 ≥ 3 : 1）", worst(focus, tint, sky), 3, hex(focus)),
    row("--line", cssVar("--line"), "玻璃描边与高光", null, 0, cssVar("--line")),
    row("模糊", "12 / 20 / 28px", "按钮 / 面板 / 厚面板", null),
    row("圆角", "14 / 18 / 24 / 28 / 999px", "输入框 / 磁贴 / 面板 / 区块 / 胶囊", null),
  ].join("");
}
afterTheme.push(renderTokens);

/* =====================================================================
   Copy · reset · boot
   ===================================================================== */
document.addEventListener("click", (e) => {
  const b = e.target.closest(".copy-btn"); if (!b) return;
  const code = $(`#${b.dataset.copy}`), label = $("span", b);
  const done = (msg) => { label.textContent = msg; setTimeout(() => (label.textContent = "复制"), 1400); };
  try { navigator.clipboard.writeText(code.textContent).then(() => done("已复制"), () => done("请手动复制")); }
  catch (_) { done("请手动复制"); }
});

$("#resetBtn").addEventListener("click", () => {
  ["gl-theme", "gl-solid", "gl-orbs"].forEach(store.del);
  $$("input").forEach((i) => {
    if (i.type === "checkbox" || i.type === "radio") i.checked = i.defaultChecked;
    else i.value = i.defaultValue;
  });
  try { sessionStorage.setItem("gl-reset", "1"); } catch (_) {}
  location.reload();
});

const solidPref = store.get("gl-solid");
setSolid(solidPref === "1" || (solidPref === null && matchMedia("(prefers-reduced-transparency: reduce), (prefers-contrast: more)").matches));
applyTheme();
showEra(4);
layoutRF();
/* 实验室的文字颜色默认跟随明暗：浅色背景用深字，深色背景用白字 */
labInk.pick($(`#labInk [data-c="${isDark() ? "#FFFFFF" : "#14152B"}"]`));
if (reduceMotion.matches) orbs.forEach((o) => (o.style.animation = "none"));
try {
  if (sessionStorage.getItem("gl-reset")) { sessionStorage.removeItem("gl-reset"); toast("已恢复初始状态"); }
} catch (_) {}
