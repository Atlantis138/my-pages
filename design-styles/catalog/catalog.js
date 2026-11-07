/*
 * 图鉴页入口：载入注册表里的全部风格，渲染索引、分组卡片和挑选表，并处理通用交互。
 * 每个风格自己的标本交互写在 styles/<id>/meta.js 的 setup(el) 里，这里只负责调用。
 */
import { loadStyles } from "../styles/registry.js";
import { GROUPS, PICKS } from "./taxonomy.js";

const STYLES_BASE = new URL("../styles/", import.meta.url);

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pad = (n) => String(n).padStart(2, "0");
const $ = (id) => document.getElementById(id);

/* ---------- assets: specimen CSS + Google Fonts ---------- */

function loadCss(href) {
  return new Promise((resolve) => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    l.onload = l.onerror = resolve;
    document.head.appendChild(l);
  });
}

/* 合并各风格声明的 gfonts（如 "Manrope:wght@300;500"、"Cormorant Garamond:ital,wght@1,600"），
   同名字族的字重合并成一项，避免 Google Fonts 因重复 family 报错。 */
function fontsHref(specs) {
  const fam = new Map();
  for (const spec of specs) {
    const [name, axes] = spec.split(":");
    const set = fam.get(name) || new Set();
    if (!axes) set.add("0,400");
    else {
      const [keys, tuples] = axes.split("@");
      const ital = keys.includes("ital");
      for (const t of tuples.split(";")) set.add(ital ? t : `0,${t}`);
    }
    fam.set(name, set);
  }
  const parts = [...fam].map(([name, set]) => {
    const tuples = [...set].map((t) => t.split(",").map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const family = name.replace(/ /g, "+");
    if (tuples.length === 1 && tuples[0][0] === 0 && tuples[0][1] === 400) return `family=${family}`;
    if (tuples.some((t) => t[0] === 1)) return `family=${family}:ital,wght@${tuples.map((t) => t.join(",")).join(";")}`;
    return `family=${family}:wght@${tuples.map((t) => t[1]).join(";")}`;
  });
  return `https://fonts.googleapis.com/css2?${parts.sort().join("&")}&display=swap`;
}

/* ---------- markup ---------- */

function meter(label, v) {
  return `<div class="mtr"><span>${label}</span><span class="segs" aria-hidden="true">${[1, 2, 3, 4, 5]
    .map((i) => `<i${i <= v ? ' class="f"' : ""}></i>`)
    .join("")}</span><b>${v}/5</b></div>`;
}

function card(s) {
  const pageLink = s.page
    ? `<a class="c-page" href="styles/${s.id}/">进入完整页面 <span>→</span></a>`
    : "";
  return `<article class="card" id="s-${s.id}" style="--gc:var(--g-${s.group})">
  <div class="card-left">
    <div class="spec sp-${s.cls || s.id}" data-style="${s.id}">${s.spec}</div>
    <p class="spec-hint">↑ ${s.hint}</p>
    <div class="pal">${s.palette
      .map(
        ([h, n]) =>
          `<button type="button" class="sw" data-hex="${h}" aria-label="复制 ${n} ${h}"><span class="sw-c" style="background:linear-gradient(${h},${h}),repeating-conic-gradient(#CCC 0 25%,#FFF 0 50%) 0 0/10px 10px"></span><span class="sw-hex">${h}</span><span class="sw-n">${n}</span></button>`
      )
      .join("")}</div>
    <div class="meters">${meter("装饰强度", s.m[0])}${meter("实现难度", s.m[1])}${meter("可读性", s.m[2])}</div>
  </div>
  <div class="card-right">
    <header class="c-head"><span class="c-no">No.${pad(s.no)}</span><h3 class="c-name">${s.cn}</h3><p class="c-en">${s.en}</p><p class="c-era"><span>${s.era}</span><span>${s.place}</span></p>${pageLink}</header>
    <section><h4>起源</h4><p>${s.origin}</p></section>
    <section><h4>关键特征</h4><ul class="traits">${s.traits.map((t) => `<li>${t}</li>`).join("")}</ul></section>
    <div class="fit"><section><h4>适合</h4><div class="tags">${s.good.map((g) => `<span>${g}</span>`).join("")}</div></section><section><h4>慎用</h4><p>${s.avoid}</p></section></div>
    <section><h4>字体建议</h4><p>${s.fonts}</p></section>
    <section><h4>关键 CSS</h4><div class="code-box"><button type="button" class="copy">复制</button><pre><code>${esc(s.css)}</code></pre></div></section>
  </div>
</article>`;
}

function render(S) {
  const byId = Object.fromEntries(S.map((s) => [s.id, s]));

  $("index").innerHTML = S.map(
    (s) =>
      `<a class="tile" href="#s-${s.id}" style="--gc:var(--g-${s.group})"${s.page ? ' data-page title="有完整页面"' : ""}><span class="tile-box" style="${s.tile}">${s.tileText || "Aa"}</span><span class="tile-cap"><b>${pad(s.no)}</b><span>${s.short}</span></span></a>`
  ).join("");

  $("filters").innerHTML =
    `<button type="button" class="chip" data-f="all" aria-pressed="true">全部 ${S.length} 种</button>` +
    GROUPS.map(
      (g) =>
        `<button type="button" class="chip" data-f="${g.id}" aria-pressed="false" style="--gc:var(--g-${g.id})"><i></i>${g.name}</button>`
    ).join("");

  $("groups").innerHTML = GROUPS.map(
    (g) => `<section class="group" data-group="${g.id}" style="--gc:var(--g-${g.id})">
  <header class="g-head"><h2>${g.name}</h2><span class="g-en">${g.en} · ${g.span}</span><p>${g.desc}</p></header>
  ${S.filter((s) => s.group === g.id).map(card).join("")}
</section>`
  ).join("");

  $("pickGrid").innerHTML = PICKS.map(
    ([goal, ids]) =>
      `<div class="pick-row"><dt>${goal}</dt><dd>${ids
        .filter((id) => byId[id])
        .map((id) => `<a href="#s-${id}" style="--gc:var(--g-${byId[id].group})"><i></i>${byId[id].cn}</a>`)
        .join("")}</dd></div>`
  ).join("");

  document.querySelectorAll("[data-count]").forEach((el) => (el.textContent = S.length));
  document.querySelectorAll("[data-pages]").forEach((el) => (el.textContent = S.filter((s) => s.page).length));

  /* per-style specimen behaviour */
  for (const el of document.querySelectorAll(".spec[data-style]")) {
    const s = byId[el.dataset.style];
    if (typeof s.setup === "function") s.setup(el);
  }
}

/* ---------- shared interactions ---------- */

function flash(el, msg, back) {
  clearTimeout(el._t);
  el.textContent = msg;
  el._t = setTimeout(() => (el.textContent = back), 1300);
}
function setFilter(f) {
  document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.f === f)));
  document.querySelectorAll(".group").forEach((g) => (g.hidden = !(f === "all" || g.dataset.group === f)));
}

document.addEventListener("click", (e) => {
  const t = e.target;
  const sw = t.closest(".sw");
  if (sw) {
    const hex = sw.dataset.hex, label = sw.querySelector(".sw-hex");
    try { navigator.clipboard.writeText(hex).then(() => flash(label, "已复制", hex), () => flash(label, "请手动复制", hex)); }
    catch (_) { flash(label, "请手动复制", hex); }
    return;
  }
  const cp = t.closest(".copy");
  if (cp) {
    const pre = cp.parentElement.querySelector("pre");
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents(pre);
      const s = getSelection(); s.removeAllRanges(); s.addRange(r);
      flash(cp, "已选中", "复制");
    };
    try { navigator.clipboard.writeText(pre.textContent).then(() => flash(cp, "已复制", "复制"), fallback); }
    catch (_) { fallback(); }
    return;
  }
  const chip = t.closest(".chip");
  if (chip) { setFilter(chip.dataset.f); return; }
  const link = t.closest('a[href^="#s-"]');
  if (link) {
    const target = document.querySelector(link.getAttribute("href"));
    if (target && target.closest(".group").hidden) setFilter("all");
  }
});

/* ---------- boot ---------- */

const S = await loadStyles(STYLES_BASE);
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = fontsHref(S.flatMap((s) => s.gfonts || []));
document.head.appendChild(fontLink);
await Promise.all(S.map((s) => loadCss(new URL(`${s.id}/specimen.css`, STYLES_BASE).href)));
render(S);
$("loading")?.remove();

/* 内容是异步渲染的，带锚点打开时需要手动滚动一次 */
if (location.hash) {
  try { document.querySelector(decodeURIComponent(location.hash))?.scrollIntoView(); } catch (_) {}
}
