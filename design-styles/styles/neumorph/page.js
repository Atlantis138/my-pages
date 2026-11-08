/* 新拟态完整页：全局光源、时间轴、光影实验室、组件与可用性演示。 */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
  del(k) { try { localStorage.removeItem(k); } catch (_) {} },
};

/* ---------- color helpers ---------- */
const hexToRgb = (hex) => { const n = parseInt(hex.replace("#", ""), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const rgbToHex = (rgb) => "#" + rgb.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("").toUpperCase();
const shade = (hex, k) => rgbToHex(hexToRgb(hex).map((v) => v * (1 + k)));
const lum = (hex) => { const [r, g, b] = hexToRgb(hex).map((v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const mix = (a, b, t) => { const A = hexToRgb(a), B = hexToRgb(b); return rgbToHex(A.map((v, i) => v + (B[i] - v) * t)); };
const token = (name) => {
  /* 把 CSS 变量解析成 #RRGGBB（借助一个临时元素） */
  const probe = document.createElement("i");
  probe.style.color = `var(${name})`; probe.style.display = "none";
  document.body.appendChild(probe);
  const m = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g).map(Number);
  probe.remove();
  return rgbToHex(m.slice(0, 3));
};

/* =====================================================================
   Global light source
   ===================================================================== */
let lightDeg = 315; // 罗盘角：0° = 正上方，顺时针；315° = 左上方
const dial = $("#dial"), ring = $(".dial-ring"), sun = $("#sun"), mark = $(".dial-mark");
const DIRS = ["上方", "右上方", "右方", "右下方", "下方", "左下方", "左方", "左上方"];

function setLight(deg, save = true) {
  lightDeg = ((Math.round(deg) % 360) + 360) % 360;
  const r = (lightDeg * Math.PI) / 180;
  const lx = Math.sin(r), ly = -Math.cos(r); // 指向光源的单位向量（屏幕坐标，y 向下）
  root.style.setProperty("--sx", (-lx).toFixed(4));
  root.style.setProperty("--sy", (-ly).toFixed(4));
  root.style.setProperty("--ang", `${(lightDeg + 180) % 360}deg`);
  /* sun orbits in the ring; the mark sits on the dial edge */
  const rr = ring.clientWidth / 2, dr = dial.clientWidth / 2;
  const so = rr - (rr - dr) / 2;
  sun.style.left = `${rr + lx * so}px`; sun.style.top = `${rr + ly * so}px`;
  mark.style.left = `${dr + lx * (dr - 20)}px`; mark.style.top = `${dr + ly * (dr - 20)}px`;
  $("#dialDeg").textContent = `${lightDeg}°`;
  dial.setAttribute("aria-valuenow", lightDeg);
  dial.setAttribute("aria-valuetext", `光从${DIRS[Math.round(lightDeg / 45) % 8]}照来`);
  placeAnatomyTags(lx, ly);
  if (save) store.set("nm-light", lightDeg);
  if (typeof renderLab === "function") renderLab();
  const ts = document.getElementById("tokSxy"); if (ts) ts.textContent = sxy();
}

function angleFromPointer(e) {
  const b = dial.getBoundingClientRect();
  const dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}
dial.addEventListener("pointerdown", (e) => {
  dial.setPointerCapture(e.pointerId);
  setLight(angleFromPointer(e));
  const move = (ev) => setLight(angleFromPointer(ev));
  const up = () => { dial.removeEventListener("pointermove", move); dial.removeEventListener("pointerup", up); };
  dial.addEventListener("pointermove", move);
  dial.addEventListener("pointerup", up);
});
dial.addEventListener("dblclick", () => setLight(315));
dial.addEventListener("keydown", (e) => {
  const step = e.shiftKey ? 45 : 15;
  if (e.key === "ArrowRight" || e.key === "ArrowUp") { e.preventDefault(); setLight(lightDeg + step); }
  if (e.key === "ArrowLeft" || e.key === "ArrowDown") { e.preventDefault(); setLight(lightDeg - step); }
  if (e.key === "Home") { e.preventDefault(); setLight(315); }
});
addEventListener("resize", () => setLight(lightDeg, false));

function placeAnatomyTags(lx, ly) {
  const stage = $(".anat-stage"); if (!stage) return;
  const w = stage.clientWidth, h = stage.clientHeight;
  const rx = Math.min(w / 2 - 80, 230), ry = Math.min(h / 2 - 22, 170);
  const put = (el, k) => { el.style.left = `${w / 2 + lx * rx * k}px`; el.style.top = `${h / 2 + ly * ry * k}px`; };
  put($(".tag-hi"), 1); put($(".tag-lo"), -1); put($(".tag-bg"), 0);
}

/* =====================================================================
   Theme & enhanced mode
   ===================================================================== */
const darkQuery = matchMedia("(prefers-color-scheme: dark)");
let theme = store.get("nm-theme");
const isDark = () => (theme ? theme === "dark" : darkQuery.matches);
function applyTheme() {
  const dark = isDark();
  root.dataset.theme = dark ? "dark" : "light";
  const t = $("#themeBtn");
  t.setAttribute("aria-checked", String(dark));
  $("use", t).setAttribute("href", dark ? "#i-moon" : "#i-sun");
  requestAnimationFrame(() => { renderMeters(); renderTokens(); });
}
$("#themeBtn").addEventListener("click", () => { theme = isDark() ? "light" : "dark"; store.set("nm-theme", theme); applyTheme(); });
darkQuery.addEventListener("change", () => { if (!theme) applyTheme(); });

const enhanceBtn = $("#enhanceBtn");
function setEnhanced(on) {
  root.classList.toggle("enhanced", on);
  enhanceBtn.setAttribute("aria-checked", String(on));
  renderMeters();
}
enhanceBtn.addEventListener("click", () => {
  const on = enhanceBtn.getAttribute("aria-checked") !== "true";
  setEnhanced(on); store.set("nm-enhanced", on ? "1" : "0");
});

/* =====================================================================
   Nav scroll spy
   ===================================================================== */
const links = $$(".nav-links a");
const spy = new IntersectionObserver((entries) => {
  for (const en of entries) if (en.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === `#${en.target.id}`)));
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main > .sec").forEach((s) => spy.observe(s));

/* =====================================================================
   Timeline
   ===================================================================== */
const ERAS = [
  ["2007 – 2013", "拟物化的黄金年代", "初代 iPhone 让触屏走进大众。为了告诉用户「这里可以按」，界面大量模仿真实物体：皮革日历、木纹书架、带高光的果冻按钮。新拟态后来借用的，正是这种「看起来能按」的直觉。", `<span class="mini-skeuo">按钮</span>`],
  ["2013", "扁平化取而代之", "iOS 7 与此前微软的 Metro 设计语言把纹理、渐变和投影几乎全部拿掉，界面只剩纯色、排版和图标。界面变得清爽，却也常常分不清哪里能点。", `<span class="mini-flat">按钮</span>`],
  ["2019 年 11 月", "一组银行 App 概念图", "乌克兰设计师 Alexander Plyuto 在 Dribbble 发布了名为 Skeuomorph Mobile Banking 的概念作品：整个界面只有一种浅灰蓝，卡片和按钮全靠柔和的双向阴影浮起。作品迅速刷屏，Neumorphism 这个名字也随之流行开来（最早由谁提出说法不一）。", `<span class="mini-neu nm-raised" style="--d:8px"><svg class="ic"><use href="#i-play"/></svg></span>`],
  ["2020", "风靡设计社区", "Dribbble 和 Behance 上出现了大量新拟态的计算器、播放器和智能家居面板，在线阴影生成器、UI 套件和教程层出不穷。它很适合做静态概念图：干净、柔和、有触感。", `<span class="mini-grid">${'<i class="nm-raised" style="--d:4px"></i>'.repeat(6)}</span>`],
  ["2021 起", "热度消退", "真正落地的产品很少。低对比度、难以表达状态、无法与彩色内容共存，让它在实际项目里处处受限。设计圈的注意力转向了玻璃拟态和黏土拟态。", `<span class="mini-fade"></span>`],
  ["今天", "作为局部点缀", "新拟态很少再被整站使用，而是化作局部的质感：一个控制旋钮、一组音量按键、一张会员卡片，嵌在以扁平或 Material 为主的界面里。", `<span class="mini-mix"><i></i>主界面扁平，<br>旋钮新拟态</span>`],
];
function showEra(i) {
  $$(".t-node").forEach((n) => n.setAttribute("aria-selected", String(+n.dataset.i === i)));
  const [yr, title, body, demo] = ERAS[i];
  $("#tPanel").innerHTML = `<div><p class="yr">${yr}</p><h3>${title}</h3><p>${body}</p></div><div class="t-demo nm-inset" style="--d:6px">${demo}</div>`;
}
$("#timeline").addEventListener("click", (e) => { const n = e.target.closest(".t-node"); if (n) showEra(+n.dataset.i); });
$("#timeline").addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
  const cur = +$('.t-node[aria-selected="true"]').dataset.i;
  const next = (cur + (e.key === "ArrowRight" ? 1 : ERAS.length - 1)) % ERAS.length;
  showEra(next); $(`.t-node[data-i="${next}"]`).focus();
});

/* =====================================================================
   Light lab
   ===================================================================== */
const PRESETS = ["#E4E9F0", "#E0E0E0", "#EDE4DA", "#DCE8E2", "#E9DFEA", "#2A2F37", "#3A4A6B"];
const lab = { color: "#E4E9F0", shape: "flat" };
const L = (id) => $(id);
$("#labSwatches").innerHTML = PRESETS.map((c) => `<button class="swatch" type="button" role="radio" aria-checked="false" aria-label="底色 ${c}" data-c="${c}" style="background:${c}"></button>`).join("");
$("#labSwatches").addEventListener("click", (e) => { const s = e.target.closest(".swatch"); if (s) { lab.color = s.dataset.c; L("#labColor").value = s.dataset.c.toLowerCase(); renderLab(); } });
L("#labColor").addEventListener("input", (e) => { lab.color = e.target.value.toUpperCase(); renderLab(); });
$("#labShape").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { lab.shape = b.dataset.v; renderLab(); } });
$$(".lab-controls input[type=range]").forEach((r) => r.addEventListener("input", renderLab));

function renderLab() {
  const size = +L("#labSize").value, radius = +L("#labRadius").value, dist = +L("#labDist").value, blur = +L("#labBlur").value, k = +L("#labInt").value / 100;
  const r = (lightDeg * Math.PI) / 180, sx = -Math.sin(r), sy = Math.cos(r);
  const x = Math.round(sx * dist), y = Math.round(sy * dist);
  const base = lab.color.toUpperCase(), dark = shade(base, -k), light = shade(base, k);
  const ang = (lightDeg + 180) % 360;
  const inset = lab.shape === "pressed" ? "inset " : "";
  const shadow = `${inset}${x}px ${y}px ${blur}px ${dark},\n              ${inset}${-x}px ${-y}px ${blur}px ${light}`;
  let bg = base;
  if (lab.shape === "concave") bg = `linear-gradient(${ang}deg, ${shade(base, -k / 2.2)}, ${shade(base, k / 2.2)})`;
  if (lab.shape === "convex") bg = `linear-gradient(${ang}deg, ${shade(base, k / 2.2)}, ${shade(base, -k / 2.2)})`;
  const br = radius >= 50 ? "50%" : `${Math.round((size * radius) / 100)}px`;

  $("#labStage").style.backgroundColor = base;
  Object.assign($("#labEl").style, { width: `${size}px`, height: `${size}px`, borderRadius: br, background: bg, boxShadow: shadow.replace(/\n\s+/g, " ") });
  $("#labCode").innerHTML =
    `<span class="c-k">.soft</span> {\n  border-radius: <span class="c-v">${br}</span>;\n  background: <span class="c-v">${bg}</span>;\n  box-shadow: <span class="c-v">${shadow}</span>;\n}`;
  $("#vSize").textContent = `${size}px`; $("#vRadius").textContent = radius >= 50 ? "圆形" : `${radius}%`;
  $("#vDist").textContent = `${dist}px`; $("#vBlur").textContent = `${blur}px`; $("#vInt").textContent = `${Math.round(k * 100)}%`;
  $$(".lab-controls input[type=range]").forEach((el) => el.style.setProperty("--p", `${((el.value - el.min) / (el.max - el.min)) * 100}%`));
  $$("#labShape button").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.v === lab.shape)));
  $$(".swatch").forEach((s) => s.setAttribute("aria-checked", String(s.dataset.c === base)));
  const c = contrast(dark, base);
  $("#labMeter").innerHTML = `暗影与底色的对比度只有 <b>${c.toFixed(2)} : 1</b>，亮影 <b>${contrast(light, base).toFixed(2)} : 1</b>。新拟态的边界正是由这两个数字决定的。`;
}
$("#labCopy").addEventListener("click", () => {
  const text = $("#labCode").textContent, label = $("#labCopy span");
  const done = (msg) => { label.textContent = msg; setTimeout(() => (label.textContent = "复制"), 1400); };
  try { navigator.clipboard.writeText(text).then(() => done("已复制"), () => done("请手动复制")); } catch (_) { done("请手动复制"); }
});

/* =====================================================================
   Kit
   ===================================================================== */
let temp = 22;
function setTemp(t) {
  temp = Math.max(16, Math.min(30, t));
  $("#thermoVal").textContent = temp;
  $("#thermoRing").style.setProperty("--p", `${((temp - 16) / 14) * 75}%`);
}
$("#tUp").addEventListener("click", () => setTemp(temp + 1));
$("#tDown").addEventListener("click", () => setTemp(temp - 1));

document.addEventListener("click", (e) => {
  const t = e.target;
  const tile = t.closest(".tile");
  if (tile) { const on = tile.getAttribute("aria-pressed") !== "true"; tile.setAttribute("aria-pressed", String(on)); $("small", tile).textContent = on ? "开" : "关"; return; }
  const sw = t.closest(".switch");
  if (sw) { sw.setAttribute("aria-checked", String(sw.getAttribute("aria-checked") !== "true")); return; }
  const seg = t.closest(".seg button");
  if (seg && !seg.closest("#labShape")) { seg.parentElement.querySelectorAll("button").forEach((b) => b.setAttribute("aria-checked", String(b === seg))); }
});

/* 键盘：分段控件（单选）用方向键切换 */
document.addEventListener("keydown", (e) => {
  const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  const b = k && e.target.closest?.('.seg[role="radiogroup"] [role="radio"]');
  if (!b) return;
  e.preventDefault();
  const items = [...b.parentElement.querySelectorAll('[role="radio"]')];
  const n = items[(items.indexOf(b) + k + items.length) % items.length];
  n.focus(); n.click();
});

const playBtn = $("#playBtn");
let progTimer, prog = 38;
playBtn.addEventListener("click", () => {
  const on = playBtn.getAttribute("aria-pressed") !== "true";
  playBtn.setAttribute("aria-pressed", String(on));
  playBtn.setAttribute("aria-label", on ? "暂停" : "播放");
  $("use", playBtn).setAttribute("href", on ? "#i-pause" : "#i-play");
  $(".player").classList.toggle("playing", on);
  clearInterval(progTimer);
  if (on) progTimer = setInterval(() => { prog = prog >= 100 ? 0 : prog + 0.5; $("#progFill").style.width = `${prog}%`; }, 250);
});
const bright = $("#bright");
const setBright = () => { $("#vBright").textContent = `${bright.value}%`; bright.style.setProperty("--p", `${bright.value}%`); };
bright.addEventListener("input", setBright);

/* =====================================================================
   A11y: quiz & live contrast meters
   ===================================================================== */
$("#quiz").addEventListener("click", (e) => {
  const b = e.target.closest(".quiz-btn"); if (!b) return;
  $$(".quiz-btn").forEach((q) => q.classList.remove("right", "wrong"));
  const ok = b.dataset.ok === "1";
  b.classList.add(ok ? "right" : "wrong");
  $("#quizMsg").textContent = ok
    ? (root.classList.contains("enhanced") ? "答对了。增强模式下，强调色和描边让答案一目了然。" : "答对了，是 B。不过你是不是犹豫了一下？")
    : "不对，开启的是 B。只差几像素的阴影，确实很难分辨。";
});

function renderMeters() {
  const bg = token("--bg"), lo = token("--lo"), hi = token("--hi"), text = token("--text"), muted = token("--muted"), accent = token("--accent");
  const rows = [
    ["暗影 / 底色（组件边界）", contrast(lo, bg), 3],
    ["亮影 / 底色（组件边界）", contrast(hi, bg), 3],
    ["正文 / 底色", contrast(text, bg), 4.5],
    ["次要文字 / 底色", contrast(muted, bg), 4.5],
    ["强调色 / 底色", contrast(accent, bg), 3],
  ];
  if (root.classList.contains("enhanced")) rows.splice(2, 0, ["增强描边 / 底色", contrast(mix(bg, text, 0.45), bg), 3]);
  $("#meterList").innerHTML = rows.map(([name, c, need]) => {
    const pass = c >= need;
    const w = Math.min(100, (c / 7) * 100);
    return `<li><span>${name}</span><span class="ratio">${c.toFixed(2)} : 1</span><span class="badge ${pass ? "ok" : "no"}">${pass ? "达标" : `需 ${need}`}</span><span class="bar"><i style="width:${w}%;background:var(${pass ? "--ok" : "--bad"})"></i></span></li>`;
  }).join("");
}

/* =====================================================================
   响应式示例：示例页按自身宽度（容器查询）重排，窄屏缩小阴影距离
   ===================================================================== */
const rfStage = $("#rfStage"), rfFrame = $("#rfFrame"), rfWidth = $("#rfWidth");
const RF_TEXT = {
  wide: "三列一字排开，阴影用完整的距离，卡片间距 28px：每块凸起周围都留够了「地面」。",
  mid: "两列：温度和场景并排，用电图横跨一行；阴影距离缩到 80%，间距 22px。",
  narrow: "单列，底部出现标签栏；阴影距离缩到 55%，间距 14px。否则卡片的暗影会越过间隙，压到下一张卡片上。",
};
function layoutRF() {
  const w = +rfWidth.value, k = Math.min(1, rfStage.clientWidth / w);
  rfFrame.style.setProperty("--w", w);
  rfFrame.style.setProperty("--k", k.toFixed(4));
  rfStage.style.height = `${Math.ceil(rfFrame.offsetHeight * k)}px`;
  $("#rfOut").textContent = `${w}px`;
  rfWidth.style.setProperty("--p", `${((w - rfWidth.min) / (rfWidth.max - rfWidth.min)) * 100}%`);
  const mode = w >= 900 ? "wide" : w >= 560 ? "mid" : "narrow";
  $("#rfRead").innerHTML = `<b>${w}px</b> → ${RF_TEXT[mode]}${k < 1 ? `（按 ${Math.round(k * 100)}% 缩小显示）` : ""}`;
  $$("#rfPresets button").forEach((b) => b.setAttribute("aria-checked", String(+b.dataset.w === w)));
}
rfWidth.addEventListener("input", layoutRF);
$("#rfPresets").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { rfWidth.value = b.dataset.w; layoutRF(); } });
new ResizeObserver(layoutRF).observe(rfStage);

/* =====================================================================
   设计令牌表
   ===================================================================== */
const sxy = () => ["--sx", "--sy"].map((k) => (+getComputedStyle(root).getPropertyValue(k)).toFixed(2)).join(" / ");
function renderTokens() {
  const bg = token("--bg");
  const row = (name, hex, use, need) => {
    let ct = "—";
    if (need) {
      const c = contrast(hex, bg), pass = c >= need;
      ct = `<span class="ct ${need === 1 ? "deco" : pass ? "pass" : "fail"}">${c.toFixed(2)} : 1<small>${need === 1 ? "装饰" : pass ? "达标" : `需 ${need}`}</small></span>`;
    }
    return `<tr><td><code>${name}</code></td><td><i class="sw" style="--c:${hex}"></i><code>${hex}</code></td><td>${use}</td><td>${ct}</td></tr>`;
  };
  const txt = (name, val, use) => `<tr><td><code>${name}</code></td><td><code>${val}</code></td><td>${use}</td><td>—</td></tr>`;
  $("#tokenBody").innerHTML = [
    row("--bg", bg, "底色：页面和所有凸起、凹陷元素共用", 0),
    row("--text", token("--text"), "正文、标题、数值", 4.5),
    row("--muted", token("--muted"), "次要文字、图标", 4.5),
    row("--accent", token("--accent"), "选中、开启、焦点与链接", 4.5),
    row("--ok", token("--ok"), "成功与「正确」标记", 4.5),
    row("--bad", token("--bad"), "错误与「错误」标记", 4.5),
    row("--hi", token("--hi"), "亮影：底色提亮", 1),
    row("--lo", token("--lo"), "暗影：底色压暗", 1),
    `<tr><td><code>--sx / --sy</code></td><td><code id="tokSxy">${sxy()}</code></td><td>暗影偏移方向的单位向量，由页首旋钮实时写入</td><td>—</td></tr>`,
    txt("--d", "3 · 5 · 8 · 12 · 14px", "高度：开关 · 小按钮 · 磁贴 · 面板 · 旋钮"),
    txt("模糊", "外阴影 2 × --d · 内阴影 1 × --d", "模糊取距离的倍数，阴影才柔和"),
    txt("圆角", "12 · 16 · 22 · 30px · 50%", "分段 · 色块 · 磁贴 · 面板 · 圆形按钮"),
  ].join("");
}

/* =====================================================================
   Boot
   ===================================================================== */
applyTheme();
layoutRF();
setEnhanced(store.get("nm-enhanced") === "1" || (store.get("nm-enhanced") === null && matchMedia("(prefers-contrast: more)").matches));
showEra(2);
setTemp(22);
setBright();
setLight(+(store.get("nm-light") ?? 315), false);
renderLab();

/* 一键复原：清掉本页保存的设置，把表单控件改回默认值（避免浏览器在刷新后恢复它们），再重新载入 */
function toast(text) {
  const t = $("#toast");
  t.textContent = text; t.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove("show"), 2600);
}
$("#resetBtn").addEventListener("click", () => {
  ["nm-light", "nm-theme", "nm-enhanced"].forEach(store.del);
  $$("input").forEach((i) => {
    if (i.type === "checkbox" || i.type === "radio") i.checked = i.defaultChecked;
    else i.value = i.defaultValue;
  });
  try { sessionStorage.setItem("nm-reset", "1"); } catch (_) {}
  location.reload();
});
try {
  if (sessionStorage.getItem("nm-reset")) { sessionStorage.removeItem("nm-reset"); toast("已恢复初始状态"); }
} catch (_) {}
