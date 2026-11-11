// 播放器：图面的外框（坐标系名、日期、读数、工具按钮、时间轴）、播放循环、相机与时间轴的交互、
// 键盘快捷键、地址栏里的时刻、右栏章节与图面的联动。
// 任务代码只需描述“有哪些阶段、哪些事件、每个坐标系怎么画、读数显示什么”，见 ../GUIDE.md。

import { clamp, smooth, reduceMotion, fmtKm, $ } from './util.js';
import { AU } from './astro.js';
import * as S from './scene.js';

/* ================= 图面外框 ================= */
const PLOT_HTML = `
<div class="sheet" id="sheet">
  <canvas id="cv" role="img"></canvas>
  <div class="tags" id="tags" aria-hidden="true"></div>
  <div class="corner tl">
    <div class="frame-name" id="frameName"></div>
    <div class="frame-sub" id="frameSub"></div>
    <div class="scalebar"><i id="scaleBarLine" style="width:80px"></i><span id="scaleLabel"></span></div>
    <div class="note" id="note" hidden><small id="noteDate"></small><span id="noteText"></span></div>
  </div>
  <div class="corner tr">
    <div class="stamp-date" id="dDate"></div>
    <div class="stamp-time" id="dTime" hidden></div>
    <div class="stamp-phase" id="dPhase"></div>
  </div>
  <div class="corner bl"><dl class="readouts" id="readouts"></dl></div>
  <div class="lockchip" id="lockchip" hidden><span id="lockText"></span><button type="button" id="unlock" aria-label="解除锁定">×</button></div>
  <div class="corner br">
    <button class="tool" id="follow" type="button" aria-pressed="false" title="镜头跟随探测器（F）">跟随</button>
    <button class="tool wide-only" id="zoomOut" type="button" aria-label="缩小" title="缩小">−</button>
    <button class="tool wide-only" id="zoomIn" type="button" aria-label="放大" title="放大">+</button>
    <button class="tool" id="resetView" type="button" title="复位视角（R）">复位视角</button>
    <button class="tool" id="expand" type="button" aria-pressed="false" aria-label="全屏查看" title="全屏查看"><svg viewBox="0 0 14 14" id="expandIcon"><path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9"/></svg></button>
  </div>
  <p class="fallback" id="plotMsg">正在载入轨道数据…</p>
</div>
<div class="deck">
  <button class="step" id="prevEv" type="button" aria-label="上一个事件" title="上一个事件（[）"><svg viewBox="0 0 12 12"><path d="M2 1h1.6v10H2zM11 1v10L4.5 6z"/></svg></button>
  <button class="play" id="play" type="button" aria-label="播放" title="播放／暂停（空格）"><svg viewBox="0 0 20 20" id="playIcon"><path d="M5 3l12 7-12 7z"/></svg></button>
  <button class="step" id="nextEv" type="button" aria-label="下一个事件" title="下一个事件（]）"><svg viewBox="0 0 12 12"><path d="M8.4 1H10v10H8.4zM1 1v10l6.5-5z"/></svg></button>
  <div class="track" id="track" role="slider" tabindex="0" aria-label="任务时间" aria-valuemin="0" aria-valuemax="1000" aria-valuenow="0" aria-valuetext="">
    <div class="fill" id="fill"></div>
    <div class="bands" id="bands"></div>
    <div class="fticks" id="fticks"></div>
    <div class="ticks" id="ticks"></div>
    <div class="thumb" id="thumb"></div>
    <div class="tip" id="tip" hidden></div>
  </div>
  <button class="rate" id="rate" type="button" aria-label="播放速度 1 倍" title="播放速度">1×</button>
</div>`;

// 在 <section class="plot" id="plot"> 里建好图面外框；tokens 为任务额外用到的颜色令牌名
export function mountPlot({ tokens = [] } = {}) {
  const root = $('plot');
  root.innerHTML = PLOT_HTML;
  const cv = $('cv');
  cv.setAttribute('aria-label', (root.getAttribute('aria-label') || '三维轨迹图') + '，可拖动旋转、缩放');
  if (!cv.getContext) { $('plotMsg').textContent = '这个浏览器无法绘制画布。'; throw new Error('canvas unsupported'); }
  S.initScene({ sheet: $('sheet'), canvas: cv, tags: $('tags'), tokens, dirty: () => { sceneDirty = true; } });
}
let sceneDirty = true;

// 载入任务目录里的 JSON 数据；失败时在图面上说明原因
export async function loadData(urls) {
  try {
    return await Promise.all(urls.map(async u => {
      const r = await fetch(u);
      if (!r.ok) throw new Error(`${r.status} ${u}`);
      return r.json();
    }));
  } catch (err) {
    $('plotMsg').innerHTML = location.protocol === 'file:'
      ? '轨道数据没有载入：直接双击打开时浏览器不允许读取数据文件。<br>请在仓库根目录运行 <code>python -m http.server</code>，再从 http://localhost:8000 打开。'
      : '轨道数据没有载入，请刷新重试。';
    throw err;
  }
}

/* ================= 常用坐标系 =================
   日心黄道坐标系全站统一：1 个场景单位 = 0.1 AU，网格在黄道面上。 */
export const UH = AU / 10;
export const HELIO_FRAME = { en: 'HELIOCENTRIC ECLIPTIC', zh: '日心黄道坐标系', sub: '太阳位于中心，网格为黄道面', unit: UH };

const SCALE_OPTS = [];
for (const km of [10, 20, 50, 100, 200, 500, 1e3, 2e3, 5e3, 1e4, 2e4, 5e4, 1e5, 2e5, 5e5, 1e6, 2e6, 5e6, 1e7]) SCALE_OPTS.push([km, fmtKm(km, 1e4)]);
for (const au of [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50]) SCALE_OPTS.push([au * AU, au + ' AU']);

const NUM_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='];

/* ================= 播放器 ================= */
export function createPlayer(cfg) {
  const { clock, segments: SEG, events: EVENTS, frames } = cfg;
  const FOCUS = cfg.focus || [], MARKS = cfg.marks || [], JUMPS = cfg.jumps || {}, PLAY_MS = cfg.playMs || 120000;
  const { T, isoDate, isoMinute, hms } = clock;
  const T_MIN = SEG[0].t0, T_MAX = SEG[SEG.length - 1].t1;
  const cam = S.cam;

  /* ---------- 时间轴：各阶段按权重 w 分配宽度，u ∈ [0,1] 与 t 分段线性对应 ---------- */
  const WSUM = SEG.reduce((s, g) => s + g.w, 0);
  let acc = 0;
  SEG.forEach((g, i) => { g.n = String(i + 1).padStart(2, '0'); g.u0 = acc / WSUM; acc += g.w; g.u1 = acc / WSUM; });
  const segOfU = u => { for (let i = 0; i < SEG.length; i++) if (u < SEG[i].u1) return i; return SEG.length - 1; };
  const tFromU = u => { const g = SEG[segOfU(u)]; return g.t0 + (u - g.u0) / (g.u1 - g.u0) * (g.t1 - g.t0); };
  const uFromT = t => { for (const g of SEG) if (t <= g.t1) return g.u0 + clamp((t - g.t0) / (g.t1 - g.t0), 0, 1) * (g.u1 - g.u0); return 1; };
  const segIdOf = new Map(SEG.map((g, i) => [g.id, i]));

  for (const e of EVENTS) { if (e.at === undefined) e.at = e.t; e.u = uFromT(e.at); }
  EVENTS.sort((a, b) => a.at - b.at);
  for (const m of MARKS) m.u = uFromT(m.t);

  /* ---------- DOM ---------- */
  const plotEl = $('plot'), sheet = $('sheet');
  const track = $('track'), thumb = $('thumb'), fillEl = $('fill'), bands = $('bands'), tip = $('tip');
  const playBtn = $('play'), playIcon = $('playIcon'), followBtn = $('follow'), expandBtn = $('expand'), rateBtn = $('rate'), lockchip = $('lockchip');
  const chapters = [...document.querySelectorAll('.ch[data-seg]')].map(el => ({ el, si: segIdOf.get(el.dataset.seg) })).filter(c => c.si !== undefined);
  SEG.forEach(g => {
    const b = document.createElement('div');
    b.className = 'band'; b.style.flex = `${g.w} 1 0`;
    b.innerHTML = `<b>${g.short}</b><span>${g.yr}</span>`;
    bands.appendChild(b); g.band = b;
  });
  track.classList.toggle('dense', SEG.length > 9);
  for (const e of EVENTS) {
    const i = document.createElement('i'); if (e.key) i.className = 'key';
    i.style.left = (e.u * 100) + '%'; $('ticks').appendChild(i);
  }
  for (const m of MARKS) {
    const i = document.createElement('i'); i.style.left = (m.u * 100) + '%'; i.style.background = `var(--${m.color})`; $('fticks').appendChild(i);
  }
  const legend = document.querySelector('.legend');
  if (legend) {
    const n = Math.min(SEG.length, NUM_KEYS.length), keys = NUM_KEYS.slice(0, n);
    const numKeys = n <= 9 ? `<kbd>1</kbd>–<kbd>${n}</kbd>` : `<kbd>1</kbd>–<kbd>9</kbd> ${keys.slice(9).map(k => `<kbd>${k}</kbd>`).join(' ')}`;
    legend.insertAdjacentHTML('beforeend',
      `<p class="hint">拖动旋转，滚轮或双指缩放，Shift 加拖动或右键平移。下方时间轴可拖动或播放，各阶段按不同比例缩放，播放到近距飞越时会自动放慢；` +
      `${MARKS.length ? '上排彩色细刻度是每一次飞越，下排是事件' : '刻度是事件'}，点一下就跳过去。天体拉近后按真实大小显示，远景时画成最小可见尺寸。</p>` +
      `<p class="hint keys">快捷键：<kbd>空格</kbd> 播放／暂停　<kbd>←</kbd><kbd>→</kbd> 逐步（加 <kbd>Shift</kbd> 快进）　<kbd>[</kbd><kbd>]</kbd> 上／下一个事件　` +
      `${numKeys} 跳到第 1—${n} 阶段　<kbd>F</kbd> 跟随探测器　<kbd>R</kbd> 复位视角。地址栏会记住当前时刻，可直接分享。</p>`);
  }

  /* ---------- 状态 ---------- */
  const state = { u: 0, t: 0 };
  const RATES = [0.5, 1, 2, 4];
  let segIdx = -1, playing = false, userCam = false, tween = null, fadeStart = -1e9, lastFrame = '';
  let follow = false, scNow = null, rateIdx = 1, lock = null, scrubbing = false;
  const markDirty = () => { sceneDirty = true; };
  const presetNow = () => SEG[segIdx].cam(state.t);
  function startTween() {
    if (reduceMotion) { Object.assign(cam, presetNow()); tween = null; return; }
    tween = { start: performance.now(), dur: 1150, from: { ...cam } };
  }
  function setU(u) {
    state.u = clamp(u, 0, 1); state.t = tFromU(state.u);
    const si = segOfU(state.u);
    if (si !== segIdx) {
      const prev = segIdx; segIdx = si;
      userCam = false; setLock(null);
      if (prev < 0) Object.assign(cam, presetNow()); else startTween();
      if (prev >= 0 && SEG[prev].frame !== SEG[si].frame) fadeStart = performance.now();
      SEG.forEach((g, i) => g.band.classList.toggle('on', i === si));
      for (const c of chapters) { const on = c.si === si; c.el.classList.toggle('active', on); if (on) c.el.setAttribute('aria-current', 'step'); else c.el.removeAttribute('aria-current'); }
    }
    markDirty();
  }
  function setPlaying(p) {
    if (playing && !p) saveHash();
    playing = p;
    playBtn.setAttribute('aria-label', p ? '暂停' : '播放');
    playIcon.innerHTML = p ? '<path d="M5 3h3.5v14H5zM11.5 3H15v14h-3.5z"/>' : '<path d="M5 3l12 7-12 7z"/>';
  }
  const togglePlay = () => { if (!playing && state.u >= 0.999) setU(0); setPlaying(!playing); };
  // 跳到某个时刻；then 可在跳转后再做点事（比如锁定镜头）
  function jumpT(t, then) { setPlaying(false); setU(uFromT(t)); if (then) then(t); saveHash(); }
  const jumpSeg = si => { if (SEG[si]) jumpT(SEG[si].show); };
  function jumpEvent(dir) {
    setPlaying(false);
    const t = state.t, list = dir > 0 ? EVENTS.filter(e => e.at > t + 1e-4) : EVENTS.filter(e => e.at < t - 1e-4);
    if (!list.length) return;
    const e = dir > 0 ? list.reduce((a, b) => b.at < a.at ? b : a) : list.reduce((a, b) => b.at > a.at ? b : a);
    setU(uFromT(e.at)); saveHash();
  }
  // 镜头锁定在一个运动的天体上。l: { id, label, pos(t) → 场景坐标, maxDps?(t, rate) → 播放时每秒最多走几天 }
  function setLock(l) { lock = l; lockchip.hidden = !l; if (l) $('lockText').textContent = `镜头锁定 ${l.label}`; markDirty(); }
  function lockOn(l, view = {}) {
    userCam = true; tween = null; follow = false; followBtn.setAttribute('aria-pressed', 'false');
    const p = l.pos(state.t); Object.assign(cam, { tx: p[0], ty: p[1], tz: p[2] }, view);
    setLock(l);
  }
  function setFollow(on) { follow = on; if (on) setLock(null); followBtn.setAttribute('aria-pressed', String(on)); markDirty(); }
  function resetView() { userCam = false; setLock(null); startTween(); markDirty(); }

  /* ---------- 地址栏 #t=YYYY-MM-DDTHH:MM ---------- */
  let hashTimer = 0;
  function saveHash() {
    clearTimeout(hashTimer);
    hashTimer = setTimeout(() => {
      try { history.replaceState(null, '', '#t=' + isoMinute(state.t)); } catch (e) { /* 沙盒化的框架里可能被拒绝 */ }
    }, 250);
  }
  function readHash() {
    const m = /[#&]t=(\d{4}-\d\d-\d\d(?:T\d\d:\d\d)?)/.exec(location.hash || '');
    if (!m) return null;
    const t = T(m[1]); return Number.isFinite(t) && t >= T_MIN && t <= T_MAX ? t : null;
  }

  /* ---------- 画一帧 ---------- */
  const lastHud = {};
  const hud = (id, val) => { if (lastHud[id] !== val) { lastHud[id] = val; $(id).textContent = val; } };
  const hudHTML = (id, val) => { if (lastHud[id] !== val) { lastHud[id] = val; $(id).innerHTML = val; } };
  const nearFocus = t => FOCUS.some(f => Math.abs(t - f[0]) < Math.max(0.6, f[1] * 2));
  function render(now) {
    const g = SEG[segIdx], t = state.t, fr = frames[g.frame];
    S.beginFrame(reduceMotion ? 1 : smooth(0, 380, now - fadeStart));
    scNow = fr.render(g, t) || null;
    S.endFrame();
    // 日期、阶段、坐标系
    hud('dDate', isoDate(t));
    const showTime = nearFocus(t) || !!lock || !!(cfg.timeShown && cfg.timeShown(t, g));
    const tm = $('dTime'); if (tm.hidden === showTime) tm.hidden = !showTime;
    if (showTime) hud('dTime', hms(t));
    hudHTML('dPhase', `${g.n} · <span>${g.name}</span>`);
    if (g.frame !== lastFrame) {
      lastFrame = g.frame;
      hudHTML('frameName', `<em>${fr.en} · </em><span>${fr.zh}</span>`);
      hud('frameSub', fr.sub);
    }
    // 比例尺：量在相机目标点所在的深度上
    const unitPx = S.focal / S.DIST;
    let pick = SCALE_OPTS[SCALE_OPTS.length - 1];
    for (const o of SCALE_OPTS) { if (o[0] / fr.unit * unitPx >= 46) { pick = o; break; } }
    const px = Math.round(pick[0] / fr.unit * unitPx);
    if (lastHud.scalePx !== px) { lastHud.scalePx = px; $('scaleBarLine').style.width = px + 'px'; }
    hud('scaleLabel', pick[1]);
    // 读数
    const { rows, src } = cfg.readouts(g, t);
    hudHTML('readouts', rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('') + `<span class="model">${src}</span>`);
    // 事件注记：落在某个事件的时间窗里就显示它；否则问任务此刻有没有要说的
    let ev = null;
    for (const e of EVENTS) if (t >= e.t && t <= e.t + e.win) ev = e;
    if (!ev && cfg.liveNote) ev = cfg.liveNote(g, t);
    const note = $('note');
    if (ev) { note.hidden = false; hud('noteDate', ev.d); hud('noteText', ev.x); } else note.hidden = true;
    // 时间轴
    const pct = (state.u * 100).toFixed(3) + '%';
    thumb.style.left = pct; fillEl.style.width = pct;
    track.setAttribute('aria-valuenow', String(Math.round(state.u * 1000)));
    track.setAttribute('aria-valuetext', `${isoDate(t)}，${g.name}`);
    if (cfg.onTime) cfg.onTime(t, g);
  }

  /* ---------- 循环 ---------- */
  let prevNow = performance.now();
  function frame(now) {
    const dt = Math.min(64, now - prevNow); prevNow = now;
    if (playing) {
      // 各阶段走完所需的时间与它在时间轴上的宽度成正比；靠近 FOCUS 里的时刻时限速：[时刻, 宽度（天）, 1× 时每秒最多走几天]
      const g = SEG[segIdx], dPerU = (g.t1 - g.t0) / (g.u1 - g.u0), rate = RATES[rateIdx];
      let dps = rate * dPerU * 1000 / PLAY_MS;
      for (const [tf, w, c] of FOCUS) { const x = (state.t - tf) / w; if (x * x < 9) dps = Math.min(dps, c * rate / Math.max(Math.exp(-x * x), 1e-4)); }
      if (lock && lock.maxDps) dps = Math.min(dps, lock.maxDps(state.t, rate));
      let u = state.u + dps * dt / 1000 / dPerU;
      if (u >= 1) { u = 1; setPlaying(false); }
      setU(u);
    }
    if (tween) {
      const k = clamp((now - tween.start) / tween.dur, 0, 1), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      Object.assign(cam, S.lerpCam(tween.from, presetNow(), e));
      if (k >= 1) tween = null;
      markDirty();
    } else if (!userCam && (playing || sceneDirty)) {
      Object.assign(cam, presetNow());
    }
    const tgt = lock ? lock.pos(state.t) : follow ? scNow : null;
    if (tgt) {
      const k = lock ? 0.5 : tween ? 0.35 : 0.22, dx = tgt[0] - cam.tx, dy = tgt[1] - cam.ty, dz = tgt[2] - cam.tz;
      if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > 1e-6 * Math.max(1e-3, cam.dist)) { cam.tx += dx * k; cam.ty += dy * k; cam.tz += dz * k; markDirty(); }
    }
    if (now - fadeStart < 400) markDirty();
    if (sceneDirty && segIdx >= 0) { sceneDirty = false; render(now); }
    requestAnimationFrame(frame);
  }

  /* ---------- 交互：相机 ---------- */
  const ptrs = new Map();
  let pinch0 = null;
  const userTouch = () => { userCam = true; tween = null; markDirty(); };
  const minDist = () => frames[SEG[segIdx].frame].minDist, maxDist = () => frames[SEG[segIdx].frame].maxDist;
  sheet.addEventListener('contextmenu', e => e.preventDefault());
  sheet.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    sheet.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, pan: e.button === 2 || e.shiftKey });
    sheet.classList.add('dragging');
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = { d: Math.hypot(a.x - b.x, a.y - b.y), dist: cam.dist, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }; }
  });
  sheet.addEventListener('pointermove', e => {
    const p = ptrs.get(e.pointerId); if (!p || !S.B) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    if (ptrs.size === 1) {
      if (p.pan) { S.panBy(dx, dy); if (lock) setLock(null); }
      else { cam.az -= dx * 0.32; cam.el = clamp(cam.el + dy * 0.28, -85, 88); }
      userTouch();
    } else if (ptrs.size === 2 && pinch0) {
      p.x = e.clientX; p.y = e.clientY;
      const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      cam.dist = clamp(pinch0.dist * pinch0.d / Math.max(10, d), minDist(), maxDist());
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; S.panBy(mx - pinch0.mx, my - pinch0.my); pinch0.mx = mx; pinch0.my = my;
      userTouch(); return;
    }
    p.x = e.clientX; p.y = e.clientY;
  });
  const endPtr = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = null; if (!ptrs.size) sheet.classList.remove('dragging'); };
  sheet.addEventListener('pointerup', endPtr); sheet.addEventListener('pointercancel', endPtr);
  sheet.addEventListener('wheel', e => {
    e.preventDefault(); if (!S.B) return;
    const d0 = cam.dist;
    cam.dist = clamp(d0 * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0013)), minDist(), maxDist());
    if (!lock && !follow) {   // 朝指针所指的地方缩放：指针下的那一点留在原处
      const r = sheet.getBoundingClientRect(), k = 1 - cam.dist / d0;
      S.panBy(-(e.clientX - r.left - S.W / 2) * k, -(e.clientY - r.top - S.H / 2) * k);
    }
    userTouch();
  }, { passive: false });
  $('zoomIn').addEventListener('click', () => { cam.dist = clamp(cam.dist / 1.35, minDist(), maxDist()); userTouch(); });
  $('zoomOut').addEventListener('click', () => { cam.dist = clamp(cam.dist * 1.35, minDist(), maxDist()); userTouch(); });
  $('resetView').addEventListener('click', resetView);
  $('unlock').addEventListener('click', resetView);
  followBtn.addEventListener('click', () => setFollow(!follow));
  function setExpanded(on) {
    plotEl.classList.toggle('expanded', on); document.body.classList.toggle('has-expanded', on);
    expandBtn.setAttribute('aria-pressed', String(on)); expandBtn.setAttribute('aria-label', on ? '退出全屏' : '全屏查看'); expandBtn.title = on ? '退出全屏（Esc）' : '全屏查看';
    $('expandIcon').innerHTML = on ? '<path d="M5 1v4H1M9 1v4h4M13 9H9v4M1 9h4v4"/>' : '<path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9"/>';
    markDirty();
  }
  expandBtn.addEventListener('click', () => setExpanded(!plotEl.classList.contains('expanded')));

  /* ---------- 交互：时间轴 ---------- */
  playBtn.addEventListener('click', togglePlay);
  $('prevEv').addEventListener('click', () => jumpEvent(-1));
  $('nextEv').addEventListener('click', () => jumpEvent(1));
  rateBtn.addEventListener('click', () => {
    rateIdx = (rateIdx + 1) % RATES.length;
    const r = RATES[rateIdx]; rateBtn.textContent = (r < 1 ? '½' : r) + '×'; rateBtn.setAttribute('aria-label', `播放速度 ${r} 倍`);
  });
  // 拖动即拖时间；悬停（或拖动）时显示日期；在刻度附近轻点会吸附到那个事件。上排（飞越）和下排（事件）分开判断。
  let downX = 0;
  const TIPS = [...EVENTS.map(e => ({ u: e.u, at: e.at, d: e.d, x: e.x })), ...MARKS.map(m => ({ u: m.u, at: m.t, d: m.d, x: m.x, mark: 1 }))];
  const uAt = e => { const r = track.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width, 0, 0.99999); };
  function nearEvent(e) {
    const r = track.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = null, bd = 7;
    const wantMark = MARKS.length > 0 && y > r.height - 20 && y < r.height - 9;
    for (const ev of TIPS) { if (!!ev.mark !== wantMark) continue; const d = Math.abs(ev.u * r.width - x); if (d < bd) { bd = d; best = ev; } }
    return best;
  }
  function showTip(e) {
    const r = track.getBoundingClientRect(), ev = nearEvent(e), u = ev ? ev.u : uAt(e), t = ev ? ev.at : tFromU(u);
    const g = SEG[segOfU(u)];
    tip.innerHTML = `${ev ? ev.d : isoDate(t)}<span>${ev ? ev.x : g.n + ' · ' + g.name}</span>`;
    tip.hidden = false;
    const w = tip.offsetWidth, x = clamp(u * r.width, w / 2 - 4, r.width - w / 2 + 4);
    tip.style.left = x + 'px';
  }
  track.addEventListener('pointerdown', e => { scrubbing = true; downX = e.clientX; track.setPointerCapture(e.pointerId); setPlaying(false); setU(uAt(e)); showTip(e); });
  track.addEventListener('pointermove', e => { if (scrubbing && Math.abs(e.clientX - downX) > 3) setU(uAt(e)); if (scrubbing || e.pointerType === 'mouse') showTip(e); });
  track.addEventListener('pointerup', e => {
    if (scrubbing && Math.abs(e.clientX - downX) <= 3) { const ev = nearEvent(e); if (ev) setU(uFromT(ev.at)); }
    scrubbing = false; saveHash(); if (e.pointerType !== 'mouse') tip.hidden = true;
  });
  track.addEventListener('pointercancel', () => { scrubbing = false; tip.hidden = true; });
  track.addEventListener('pointerleave', () => { if (!scrubbing) tip.hidden = true; });
  // 方向键一步走当前阶段的 1%，加 Shift（或 PageUp / PageDown）走 10%
  const nudge = (dir, big) => { const g = SEG[segIdx]; setPlaying(false); setU(state.u + dir * (g.u1 - g.u0) * (big ? 0.1 : 0.01)); saveHash(); };
  track.addEventListener('keydown', e => {
    const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowUp') nudge(1, e.shiftKey);
    else if (k === 'ArrowLeft' || k === 'ArrowDown') nudge(-1, e.shiftKey);
    else if (k === 'PageUp') nudge(1, true);
    else if (k === 'PageDown') nudge(-1, true);
    else if (k === 'Home') { setPlaying(false); setU(0); saveHash(); }
    else if (k === 'End') { setPlaying(false); setU(1); saveHash(); }
    else if (k === ' ') togglePlay();
    else return;
    e.preventDefault();
  });
  document.addEventListener('keydown', e => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
    const tg = e.target, tag = tg && tg.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (tg && tg.isContentEditable)) return;
    const k = e.key, num = NUM_KEYS.indexOf(k);
    if (k === ' ' && tag !== 'BUTTON' && tag !== 'A' && tag !== 'SUMMARY') { togglePlay(); e.preventDefault(); }
    else if (k === 'ArrowRight' || k === 'ArrowLeft') { nudge(k === 'ArrowRight' ? 1 : -1, e.shiftKey); e.preventDefault(); }
    else if (k === ']' || k === '[') { jumpEvent(k === ']' ? 1 : -1); e.preventDefault(); }
    else if (num >= 0 && num < SEG.length) jumpSeg(num);
    else if (k === 'f' || k === 'F') setFollow(!follow);
    else if (k === 'r' || k === 'R') resetView();
    else if (k === 'Escape' && plotEl.classList.contains('expanded')) setExpanded(false);
  });

  /* ---------- 交互：章节 ----------
     右栏滚到哪一章，图就跳到那一阶段；.goto[data-seg] 跳到阶段的代表时刻，.goto[data-jump] 跳到 cfg.jumps 里的命名时刻。 */
  const narrowMQ = matchMedia('(max-width: 900px)');
  let ioPause = 0, scrolled = false, io = null;
  // 让图回到视野里：滚到当前阶段对应的那一章（这样滚动联动不会把图又带走）
  function reveal() {
    const c = chapters.find(c => c.si === segIdx); if (!c) return;
    ioPause = performance.now() + 1800;
    const r = c.el.getBoundingClientRect(), top = scrollY + r.top - innerHeight * (narrowMQ.matches ? 0.6 : 0.36);
    scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  const jump = name => { const j = JUMPS[name]; if (j) jumpT(j.t, j.then); };
  document.querySelectorAll('.goto[data-seg]').forEach(b => b.addEventListener('click', () => jumpSeg(segIdOf.get(b.dataset.seg))));
  document.querySelectorAll('.goto[data-jump]').forEach(b => b.addEventListener('click', () => jump(b.dataset.jump)));
  addEventListener('scroll', () => { scrolled = true; }, { passive: true });
  function makeObserver() {
    if (io) io.disconnect();
    io = new IntersectionObserver(entries => {
      if (!scrolled || playing || scrubbing || performance.now() < ioPause) return;
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        const c = chapters.find(c => c.el === en.target);
        if (c && c.si !== segIdx) jumpSeg(c.si);
      }
    }, { rootMargin: narrowMQ.matches ? '-70% 0px -24% 0px' : '-42% 0px -54% 0px' });
    chapters.forEach(c => io.observe(c.el));
  }
  makeObserver();
  narrowMQ.addEventListener('change', makeObserver);

  /* ---------- 启动 ---------- */
  $('plotMsg').remove();
  const tHash = readHash();
  setU(uFromT(tHash !== null ? tHash : cfg.startT));
  addEventListener('hashchange', () => { const t = readHash(); if (t !== null && Math.abs(t - state.t) > 1e-4) { setPlaying(false); setU(uFromT(t)); } });
  requestAnimationFrame(frame);

  return {
    state, cam, segments: SEG, events: EVENTS, uFromT, tFromU,
    get lock() { return lock; }, get segment() { return SEG[segIdx]; },
    setT: s => { setPlaying(false); setU(uFromT(typeof s === 'string' ? T(s) : s)); },
    jumpT, jumpSeg, jump, lockOn, setLock, reveal, invalidate: markDirty,
  };
}
