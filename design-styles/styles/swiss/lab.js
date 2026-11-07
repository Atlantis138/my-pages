/*
 * 网格实验室：栏、行、间距、页边距和三种排法。
 * 每个元素的位置用 0–1 的比例写死，再吸附到当前网格最近的线上；
 * 间距和页边距按 420 × 560 的版面计算，用 cqi 随海报缩放。
 */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const DEFAULTS = { cols: 4, rows: 5, gap: 12, pad: 24, layout: "A", title: "Raster", show: true };
const W = 420, H = 560;

/* [x0, x1, y0, y1]，比例坐标 */
const LAYOUTS = {
  A: { top: [0, 0.5, 0, 0.1], red: [0.5, 1, 0, 0.4], title: [0, 1, 0.42, 0.65], body: [0, 0.5, 0.7, 1], meta: [0.75, 1, 0.8, 1] },
  B: { red: [0, 0.25, 0, 1], title: [0.25, 1, 0, 0.3], top: [0.25, 0.75, 0.35, 0.45], body: [0.25, 0.75, 0.6, 1], meta: [0.75, 1, 0.8, 1] },
  C: { title: [0, 0.75, 0, 0.25], top: [0.75, 1, 0, 0.1], red: [0.25, 1, 0.35, 0.75], body: [0, 0.5, 0.8, 1], meta: [0.5, 0.75, 0.8, 1] },
};
const NAMES = { title: ".title", red: ".block", body: ".text ", meta: ".meta ", top: ".top  " };

function snap([x0, x1, y0, y1], c, r) {
  const a = Math.min(c - 1, Math.round(x0 * c)), b = Math.max(a + 1, Math.min(c, Math.round(x1 * c)));
  const d = Math.min(r - 1, Math.round(y0 * r)), e = Math.max(d + 1, Math.min(r, Math.round(y1 * r)));
  return { c0: a + 1, c1: b + 1, r0: d + 1, r1: e + 1 };
}

export function initLab({ store, reduceMotion, radioGroup }) {
  const posterEl = $("#labPoster"), gridEl = $("#lpGrid"), itemsEl = $("#lpItems"), codeEl = $("#labCode"), statEl = $("#labStat");
  const el = { cols: $("#lCols"), rows: $("#lRows"), gap: $("#lGap"), pad: $("#lPad"), title: $("#lTitle"), show: $("#lShow") };
  const out = { cols: $("#oCols"), rows: $("#oRows"), gap: $("#oGap"), pad: $("#oPad") };
  let o = { ...DEFAULTS };
  try { Object.assign(o, JSON.parse(store.get("sw-lab")) || {}); } catch (_) {}
  for (const k of ["cols", "rows", "gap", "pad"]) el[k].value = o[k];
  el.title.value = o.title; el.show.checked = !!o.show;

  function render({ save = true, animate = false } = {}) {
    const before = animate && !reduceMotion.matches ? new Map($$("[data-k]", itemsEl).map((n) => [n, n.getBoundingClientRect()])) : null;
    const { cols: c, rows: r, gap: g, pad: m } = o;
    posterEl.style.setProperty("--c", c); posterEl.style.setProperty("--r", r);
    posterEl.style.setProperty("--g", g); posterEl.style.setProperty("--m", m);
    posterEl.classList.toggle("show", o.show);
    if (gridEl.childElementCount !== c * r) gridEl.innerHTML = "<i></i>".repeat(c * r);

    const L = LAYOUTS[o.layout];
    const lines = [];
    for (const [k, frac] of Object.entries(L)) {
      const p = snap(frac, c, r);
      const node = $(`[data-k="${k}"]`, itemsEl);
      node.style.gridArea = `${p.r0} / ${p.c0} / ${p.r1} / ${p.c1}`;
      if (k === "title") {
        const span = p.c1 - p.c0, colW = (W - 2 * m - (c - 1) * g) / c, spanW = span * colW + (span - 1) * g;
        const len = Math.max(1, o.title.length);
        node.style.setProperty("--fs", Math.max(4, Math.min(17, (spanW / W) * 100 / (len * 0.62))).toFixed(2));
        node.textContent = o.title || " ";
      }
      lines.push(`${NAMES[k]} { grid-column: ${p.c0} / ${p.c1}; grid-row: ${p.r0} / ${p.r1}; }`);
    }

    const fw = (W - 2 * m - (c - 1) * g) / c, fh = (H - 2 * m - (r - 1) * g) / r;
    statEl.textContent = `${c} 栏 × ${r} 行 = ${c * r} 个场 · 每场约 ${Math.max(0, Math.round(fw))} × ${Math.max(0, Math.round(fh))} px（按 420 × 560 的版面计）`;
    out.cols.textContent = c; out.rows.textContent = r; out.gap.textContent = `${g} px`; out.pad.textContent = `${m} px`;
    $$("#presets button").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.c === c && +b.dataset.r === r)));

    codeEl.textContent = `.poster {
  display: grid;
  grid-template-columns: repeat(${c}, minmax(0, 1fr));
  grid-template-rows: repeat(${r}, minmax(0, 1fr));
  gap: ${g}px;
  padding: ${m}px;
  aspect-ratio: 3 / 4;
}
${lines.join("\n")}`;

    if (before) {
      for (const [n, a] of before) {
        const b = n.getBoundingClientRect();
        if (!b.width || !a.width) continue;
        n.animate([
          { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}, ${a.height / b.height})`, transformOrigin: "0 0" },
          { transform: "none", transformOrigin: "0 0" },
        ], { duration: 420, easing: "cubic-bezier(.2,.8,.2,1)" });
      }
    }
    if (save) store.set("sw-lab", JSON.stringify(o));
  }

  for (const k of ["cols", "rows", "gap", "pad"]) el[k].addEventListener("input", () => { o[k] = +el[k].value; render(); });
  el.title.addEventListener("input", () => { o.title = el.title.value; render(); });
  el.show.addEventListener("change", () => { o.show = el.show.checked; render(); });
  $$("#presets button").forEach((b) => b.addEventListener("click", () => {
    o.cols = +b.dataset.c; o.rows = +b.dataset.r;
    el.cols.value = o.cols; el.rows.value = o.rows;
    render({ animate: true });
  }));
  $$('#lLayout [role="radio"]').forEach((b) => b.setAttribute("aria-checked", String(b.dataset.l === o.layout)));
  radioGroup($("#lLayout"), (b) => { if (o.layout !== b.dataset.l) { o.layout = b.dataset.l; render({ animate: true }); } });
  render({ save: false });
}
