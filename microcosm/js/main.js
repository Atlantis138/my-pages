/* 微观之旅 · 主程序：缩放轴、相机、渲染调度、HUD 与交互 */
(function () {
  'use strict';
  const MC = window.MC;
  MC.smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  MC.clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const S = MC.SCENES;
  const $ = (id) => document.getElementById(id);
  const canvas = $('gl');
  const veil = $('veil');

  const gl = MC.createGL(canvas);
  if (!gl) {
    $('veilMsg').innerHTML = '<span class="err">此浏览器不支持 WebGL2，无法显示三维场景。请使用较新的 Chrome、Edge、Firefox 或 Safari。</span>';
    return;
  }
  MC._pc = gl.getExtension('KHR_parallel_shader_compile');

  /* ---------------- 缩放轴：每个场景一段停留区 + 一段过渡区 ---------------- */
  const EXTRA = 0.55;            // 过渡时各自额外缩放的数量级
  let zc = 0;
  S.forEach((s, i) => {
    s.index = i;
    s.state = s.state || {};
    s.orbit = { yaw: s.yaw != null ? s.yaw : 0.7, pitch: s.pitch != null ? s.pitch : 0.25, vy: 0, vp: 0 };
    s.z0 = zc; zc += s.dwell || 1; s.z1 = zc;
    if (i < S.length - 1) { s.t0 = zc; zc += s.transLen || 0.42; s.t1 = zc; }
  });
  const Z_MAX = S[S.length - 1].z1 - 0.001;

  const st = { z: 0.03, zt: 0.03, tour: false, lastInput: 0, active: null, time: 0, scale: 0.75, frames: 0, acc: 0 };

  function locate(z) {
    for (let i = 0; i < S.length; i++) {
      const s = S[i];
      if (z <= s.z1 || i === S.length - 1) {
        if (z < s.z0 && i > 0) { // 在前一段过渡区
          const p = S[i - 1];
          const t = (z - p.t0) / (p.t1 - p.t0);
          return { trans: true, a: p, b: s, t };
        }
        return { trans: false, a: s, u: MC.clamp((z - s.z0) / (s.z1 - s.z0), 0, 1) };
      }
    }
  }
  function sceneLogW(s, u) { return s.range[0] + (s.range[1] - s.range[0]) * u; }

  /* ---------------- 着色器编译（逐个、可并行） ---------------- */
  let compileQueue = S.slice();
  function compileNext() {
    const s = compileQueue.shift();
    if (!s) return;
    s.prog = MC.program(gl, MC.VS_FULL, MC.GLSL_HEAD + s.fs, s.key);
    if (s.init) s.init(gl);
  }
  function compiledCount() { return S.filter((s) => s.prog && s.prog.ready() && s.prog.check()).length; }

  /* ---------------- 渲染目标 ---------------- */
  let T = {};
  let curW = 0, curH = 0, curScale = 0;
  const FOV = 40 * Math.PI / 180;
  const TAN = Math.tan(FOV / 2);
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = Math.max(2, Math.round(innerWidth * dpr)), ch = Math.max(2, Math.round(innerHeight * dpr));
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    const q = Math.round(st.scale * 20) / 20;
    const base = Math.min(dpr, 1.5);
    const w = Math.max(64, Math.round(innerWidth * base * q)), h = Math.max(64, Math.round(innerHeight * base * q));
    if (w === curW && h === curH) return;
    curW = w; curH = h; curScale = q;
    for (const k in T) MC.freeTarget(gl, T[k]);
    T.a = MC.target(gl, w, h); T.b = MC.target(gl, w, h); T.c = MC.target(gl, w, h);
    const bw = Math.max(16, w >> 2), bh = Math.max(16, h >> 2);
    T.br = MC.target(gl, bw, bh); T.b1 = MC.target(gl, bw, bh); T.b2 = MC.target(gl, bw, bh);
  }
  const P = {
    comp: MC.program(gl, MC.VS_FULL, MC.FS_COMPOSITE, 'composite'),
    bright: MC.program(gl, MC.VS_FULL, MC.FS_BRIGHT, 'bright'),
    blur: MC.program(gl, MC.VS_FULL, MC.FS_BLUR, 'blur'),
    fin: MC.program(gl, MC.VS_FULL, MC.FS_FINAL, 'final')
  };

  /* ---------------- 相机 ---------------- */
  function norm(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function makeCtx(s, u, tgt) {
    const logW = sceneLogW(s, u);
    const W = Math.pow(10, logW) / s.unit;
    const dist = W / (2 * TAN);
    let target = s.getTarget ? s.getTarget(u, s.state) : (s.target || [0, 0, 0]);
    const o = s.orbit;
    const cp = Math.cos(o.pitch), sp = Math.sin(o.pitch);
    let ro = [target[0] + dist * cp * Math.sin(o.yaw), target[1] + dist * sp, target[2] + dist * cp * Math.cos(o.yaw)];
    if (s.camera) { const c = s.camera(u, o, dist, W, target); ro = c.ro; target = c.target; }
    const f = norm([target[0] - ro[0], target[1] - ro[1], target[2] - ro[2]]);
    const r = norm(cross(f, [0, 1, 0]));
    const up = cross(r, f);
    return { w: tgt.w, h: tgt.h, time: st.time, u, W, dist, logW, scene: s, cam: { ro, r, up, f, tanM: TAN } };
  }

  function renderScene(s, u, tgt) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, tgt.fb);
    gl.viewport(0, 0, tgt.w, tgt.h);
    if (!s.prog || !s.prog.ready() || !s.prog.check()) { gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT); return; }
    const ctx = makeCtx(s, u, tgt);
    s.lastCtx = ctx;
    gl.useProgram(s.prog.p);
    MC.setCommon(gl, s.prog, ctx);
    if (s.uniforms) s.uniforms(gl, s.prog, ctx);
    MC.drawFull(gl);
    if (s.drawExtra) s.drawExtra(gl, ctx);
  }

  function pass(prog, tgt, setup) {
    if (!prog.check()) return;
    gl.bindFramebuffer(gl.FRAMEBUFFER, tgt ? tgt.fb : null);
    gl.viewport(0, 0, tgt ? tgt.w : canvas.width, tgt ? tgt.h : canvas.height);
    gl.useProgram(prog.p);
    setup(prog);
    MC.drawFull(gl);
  }
  function bindTex(prog, name, unit, tex) {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(prog.u(name), unit);
  }

  /* ---------------- HUD：标尺 ---------------- */
  const RT = -1.2, RB = -35.6;
  const ruler = $('ruler');
  const yOf = (lw) => ((RT - lw) / (RT - RB)) * 100;
  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '.': '·' };
  const sup = (n) => String(n).split('').map((c) => SUP[c] || c).join('');
  MC.sup = sup;
  (function buildRuler() {
    let h = '<div class="track"></div>';
    for (let e = -2; e >= -35; e--) {
      const major = e % 5 === 0;
      h += `<div class="tick${major ? ' major' : ''}" style="top:${yOf(e)}%">${major ? `<span>10${sup(e)}</span>` : ''}</div>`;
    }
    S.forEach((s) => { h += `<div class="range" style="top:${yOf(s.range[0])}%;height:${yOf(s.range[1]) - yOf(s.range[0])}%"></div>`; });
    h += `<div class="desert" style="top:${yOf(-21)}%;height:${yOf(-31) - yOf(-21)}%">实验尚未触及</div>`;
    S.forEach((s, i) => {
      h += `<button class="stop${s.speculative ? ' spec' : ''}" data-i="${i}" style="top:${yOf((s.range[0] + s.range[1]) / 2)}%">${s.info.title}</button>`;
    });
    h += '<div class="marker" id="marker"></div>';
    ruler.innerHTML = h;
    ruler.querySelectorAll('.stop').forEach((b) => b.addEventListener('click', () => { const s = S[+b.dataset.i]; st.zt = s.z0 + 0.04; st.tour = false; syncTour(); st.lastInput = performance.now(); }));
  })();
  const marker = $('marker');
  // 场景标签：按中点定位，过近时依次下推，避免重叠
  function layoutStops() {
    const H = ruler.clientHeight; if (!H) return;
    let last = -1e9;
    ruler.querySelectorAll('.stop').forEach((b) => {
      const s = S[+b.dataset.i];
      let y = yOf((s.range[0] + s.range[1]) / 2) / 100 * H;
      y = Math.max(y, last + 18); last = y;
      b.style.top = y + 'px';
    });
  }
  layoutStops();
  addEventListener('resize', layoutStops);

  /* ---------------- HUD：读数 ---------------- */
  const UNITS = [[1, 'm'], [1e-3, 'mm'], [1e-6, 'μm'], [1e-9, 'nm'], [1e-12, 'pm'], [1e-15, 'fm'], [1e-18, 'am'], [1e-21, 'zm'], [1e-24, 'ym']];
  function fmtLen(m) {
    for (const [f, n] of UNITS) if (m >= f * 0.9999) { const v = m / f; return (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)) + ' ' + n; }
    const e = Math.floor(Math.log10(m)); const v = m / Math.pow(10, e);
    return v.toFixed(1) + ' × 10' + sup(e) + ' m';
  }
  MC.fmtLen = fmtLen;
  function fmtE(eV) {
    const U = [[1e24, 'YeV'], [1e21, 'ZeV'], [1e18, 'EeV'], [1e15, 'PeV'], [1e12, 'TeV'], [1e9, 'GeV'], [1e6, 'MeV'], [1e3, 'keV'], [1, 'eV']];
    if (eV >= 1e27) { const g = eV / 1e9; const e = Math.floor(Math.log10(g)); return (g / Math.pow(10, e)).toFixed(1) + ' × 10' + sup(e) + ' GeV'; }
    for (const [f, n] of U) if (eV >= f) { const v = eV / f; return (v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)) + ' ' + n; }
    return eV.toFixed(2) + ' eV';
  }
  MC.fmtE = fmtE;
  const rBig = $('rBig'), rSub = $('rSub'), rE = $('rE'), sbBar = $('sbBar'), sbTxt = $('sbTxt');
  function updateReadout(logW) {
    const m = Math.pow(10, logW);
    rBig.textContent = fmtLen(m);
    rSub.textContent = '10' + sup(logW.toFixed(1)) + ' m';
    if (logW < -8.5) rE.textContent = '分辨所需能量 ħc/λ ≈ ' + fmtE(1.97327e-7 / m);
    else if (logW < -6.3) rE.textContent = '已小于可见光波长（400–700 nm）';
    else rE.textContent = '';
    // 比例尺
    const minPx = Math.min(innerWidth, innerHeight);
    const pxPerM = minPx / m;
    let L = Math.pow(10, Math.floor(Math.log10(130 / pxPerM)));
    for (const k of [5, 2, 1]) if (k * L * pxPerM <= 140) { L *= k; break; }
    sbBar.style.width = (L * pxPerM).toFixed(1) + 'px';
    sbTxt.textContent = fmtLen(L).replace(/\.00 /, ' ').replace(/\.0 /, ' ');
    marker.style.top = yOf(MC.clamp(logW, RB, RT)) + '%';
  }

  /* ---------------- HUD：讲解卡片 ---------------- */
  const card = $('card');
  let tab = 'observe';
  function renderPane() {
    const s = st.active; if (!s) return;
    const I = s.info;
    let h = '';
    if (tab === 'facts') h = '<dl class="facts">' + I.facts.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('') + '</dl>' + (I.refs ? `<p style="margin-top:12px;font-size:12px;color:var(--ink-3)">${I.refs}</p>` : '');
    else h = String(I[tab]).split('\n').map((p) => `<p>${p}</p>`).join('');
    $('cPane').innerHTML = h;
    $('cPane').scrollTop = 0;
  }
  function setActive(s) {
    if (st.active === s) return;
    st.active = s;
    const I = s.info;
    $('cTitle').innerHTML = `${I.title}<small>${I.en}</small>`;
    $('cScale').textContent = '10' + sup(s.range[0].toFixed(0)) + ' → 10' + sup(s.range[1].toFixed(0)) + ' m';
    const b = $('cBadge'); b.textContent = I.badge; b.className = 'badge' + (s.speculative ? ' spec' : '');
    $('cLead').textContent = I.lead;
    $('cLegend').innerHTML = (s.legend || []).map(([c, t]) => `<span><i style="background:${c}"></i>${t}</span>`).join('');
    renderPane();
    buildControls(s);
    try { history.replaceState(null, '', '#' + s.key); } catch (e) { /* 框架内可能不允许 */ }
  }
  document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => {
    tab = b.dataset.tab;
    document.querySelectorAll('.tabs button').forEach((x) => x.setAttribute('aria-selected', x === b ? 'true' : 'false'));
    renderPane();
  }));
  $('fold').addEventListener('click', () => { const m = card.classList.toggle('min'); $('fold').textContent = m ? '+' : '–'; $('fold').setAttribute('aria-label', m ? '展开讲解' : '收起讲解'); });
  if (innerWidth < 820) { card.classList.add('min'); $('fold').textContent = '+'; }

  /* ---------------- 场景控件 ---------------- */
  const ctrls = $('ctrls');
  let meterEl = null;
  function buildControls(s) {
    let h = '';
    (s.controls || []).forEach((c) => {
      if (c.type === 'range') {
        h += `<div class="ctrl"><label for="c_${s.key}_${c.key}">${c.label}</label><div style="display:flex;gap:8px;align-items:center"><output id="o_${s.key}_${c.key}">${c.fmt(s.state[c.key])}</output><input type="range" id="c_${s.key}_${c.key}" min="${c.min}" max="${c.max}" step="${c.step}" value="${s.state[c.key]}"></div></div>`;
      } else {
        h += `<div class="ctrl"><label>${c.label}</label><div class="seg">` + c.options.map(([v, t]) => `<button data-k="${c.key}" data-v="${v}" aria-pressed="${String(s.state[c.key]) === String(v)}">${t}</button>`).join('') + '</div></div>';
      }
    });
    if (s.meter) h += '<div class="meter" id="meter"></div>';
    ctrls.innerHTML = h;
    meterEl = $('meter');
    ctrls.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => {
      const c = s.controls.find((x) => x.key === b.dataset.k);
      const v = typeof c.options[0][0] === 'number' ? +b.dataset.v : b.dataset.v;
      s.state[c.key] = v;
      b.parentNode.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      if (s.onControl) s.onControl(c.key, v);
    }));
    ctrls.querySelectorAll('input[type=range]').forEach((inp) => {
      const k = inp.id.split('_').pop();
      const c = s.controls.find((x) => x.key === k);
      inp.addEventListener('input', () => { s.state[k] = +inp.value; $(`o_${s.key}_${k}`).textContent = c.fmt(+inp.value); if (s.onControl) s.onControl(k, +inp.value); });
      inp.addEventListener('pointerdown', (e) => e.stopPropagation());
    });
  }

  /* ---------------- 字幕 ---------------- */
  const noteEl = $('note');
  let noteText = '';
  function updateNote(s, u, trans) {
    let t = '';
    if (!trans && s.notes) for (const n of s.notes) if (u >= n.u && u < (n.until != null ? n.until : n.u + 0.3)) t = n.text;
    if (trans && s.transNote) t = s.transNote;
    if (t !== noteText) { noteText = t; if (t) { noteEl.textContent = t; noteEl.classList.add('show'); } else noteEl.classList.remove('show'); }
  }

  /* ---------------- 交互 ---------------- */
  const pointers = new Map();
  let pinch0 = 0;
  function activeScene() { return st.active || S[0]; }
  function poke() { st.lastInput = performance.now(); }
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); }
    canvas.classList.add('drag'); poke();
  });
  canvas.addEventListener('pointermove', (e) => {
    const p = pointers.get(e.pointerId); if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (pointers.size === 1) {
      const s = activeScene(), o = s.orbit;
      o.vy = -dx * 0.0055; o.vp = dy * 0.0045;
      o.yaw += o.vy; o.pitch = MC.clamp(o.pitch + o.vp, s.pitchMin != null ? s.pitchMin : -1.45, s.pitchMax != null ? s.pitchMax : 1.45);
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch0 > 0) { st.zt = MC.clamp(st.zt + Math.log(d / pinch0) * 0.9, 0, Z_MAX); }
      pinch0 = d;
    }
    poke();
  });
  const up = (e) => { pointers.delete(e.pointerId); if (!pointers.size) canvas.classList.remove('drag'); pinch0 = 0; };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  addEventListener('wheel', (e) => {
    if (e.target.closest && e.target.closest('.pane')) return;
    e.preventDefault();
    const k = e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? 400 : 1;
    st.zt = MC.clamp(st.zt + e.deltaY * k * 0.0011, 0, Z_MAX);
    if (st.tour) { st.tour = false; syncTour(); }
    poke();
  }, { passive: false });
  addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    const s = activeScene();
    if (['ArrowUp', 'w', 'W', '+', '='].includes(e.key)) st.zt = Math.min(Z_MAX, st.zt + 0.08);
    else if (['ArrowDown', 's', 'S', '-'].includes(e.key)) st.zt = Math.max(0, st.zt - 0.08);
    else if (e.key === 'ArrowLeft') s.orbit.yaw += 0.15;
    else if (e.key === 'ArrowRight') s.orbit.yaw -= 0.15;
    else if (e.key === ' ') { st.tour = !st.tour; syncTour(); e.preventDefault(); }
    else if (e.key === 'Home') st.zt = 0;
    else if (e.key === 'End') st.zt = Z_MAX;
    else return;
    poke();
  });
  const btnTour = $('btnTour');
  function syncTour() { btnTour.setAttribute('aria-pressed', String(st.tour)); btnTour.textContent = st.tour ? '暂停' : '漫游'; }
  btnTour.addEventListener('click', () => { st.tour = !st.tour; if (st.tour && st.zt >= Z_MAX - 0.01) st.zt = st.z = 0; syncTour(); });
  $('btnFull').addEventListener('click', () => {
    const d = document;
    try { if (!d.fullscreenElement) d.documentElement.requestFullscreen().catch(() => {}); else d.exitFullscreen(); } catch (e) { /* 不支持 */ }
  });
  // 地址栏 #key 直达
  (function fromHash() {
    const k = (location.hash || '').slice(1);
    const s = S.find((x) => x.key === k);
    if (s) st.z = st.zt = s.z0 + 0.04;
  })();

  /* ---------------- 主循环 ---------------- */
  let last = performance.now(), started = false, frameMs = 16;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (compileQueue.length && (started || !S[0].prog || S[0].prog.ready())) compileNext();
    const n = compiledCount();
    $('veilBar').style.width = (n / S.length * 100) + '%';
    if (!started) {
      if (S[0].prog && S[0].prog.ready()) {
        if (!S[0].prog.check()) { $('veilMsg').innerHTML = '<span class="err">着色器编译失败，请查看控制台。</span>'; return; }
        started = true; veil.classList.add('gone');
      } else return;
    }
    st.time += dt;
    // 缩放
    if (st.tour) { st.zt = Math.min(Z_MAX, st.zt + dt * 0.05); if (st.zt >= Z_MAX) { st.tour = false; syncTour(); } }
    st.z += (st.zt - st.z) * (1 - Math.exp(-dt * 3.2));
    const L = locate(st.z);
    // 轨道：惯性与空闲自转
    const idle = now - st.lastInput > 2500;
    for (const s of [L.a, L.b]) {
      if (!s) continue;
      const o = s.orbit;
      if (!pointers.size) { o.yaw += o.vy; o.pitch = MC.clamp(o.pitch + o.vp, s.pitchMin != null ? s.pitchMin : -1.45, s.pitchMax != null ? s.pitchMax : 1.45); o.vy *= 0.92; o.vp *= 0.92; }
      if (idle && !reduceMotion) o.yaw += dt * (s.spin != null ? s.spin : 0.04);
    }
    resize();
    let logW, mix = 0;
    if (!L.trans) {
      logW = sceneLogW(L.a, L.u);
      if (L.a.update) L.a.update(dt, L.u);
      renderScene(L.a, L.u, T.a);
      setActive(L.a); updateNote(L.a, L.u, false);
    } else {
      const t = MC.clamp(L.t, 0, 1);
      logW = L.a.range[1] + (L.b.range[0] - L.a.range[1]) * t;
      const ua = 1 + t * EXTRA / Math.abs(L.a.range[1] - L.a.range[0]);
      const ub = -(1 - t) * EXTRA / Math.abs(L.b.range[1] - L.b.range[0]);
      mix = t;
      if (mix < 0.995) { if (L.a.update) L.a.update(dt, ua); renderScene(L.a, ua, T.a); }
      if (mix > 0.005) { if (L.b.update) L.b.update(dt, ub); renderScene(L.b, ub, mix < 0.995 ? T.b : T.a); }
      if (mix >= 0.995) mix = 0;
      setActive(t < 0.5 ? L.a : L.b);
      updateNote(L.a, 1, true);
    }
    // 合成
    pass(P.comp, T.c, (p) => {
      bindTex(p, 'uA', 0, T.a.tex); bindTex(p, 'uB', 1, T.b.tex);
      gl.uniform1f(p.u('uMix'), mix); gl.uniform2f(p.u('uRes'), T.c.w, T.c.h); gl.uniform1f(p.u('uTime'), st.time);
    });
    // 泛光
    pass(P.bright, T.br, (p) => { bindTex(p, 'uT', 0, T.c.tex); gl.uniform2f(p.u('uTexel'), 1 / T.br.w, 1 / T.br.h); });
    pass(P.blur, T.b1, (p) => { bindTex(p, 'uT', 0, T.br.tex); gl.uniform2f(p.u('uDir'), 1 / T.br.w, 0); });
    pass(P.blur, T.b2, (p) => { bindTex(p, 'uT', 0, T.b1.tex); gl.uniform2f(p.u('uDir'), 0, 1 / T.br.h); });
    pass(P.blur, T.b1, (p) => { bindTex(p, 'uT', 0, T.b2.tex); gl.uniform2f(p.u('uDir'), 2 / T.br.w, 0); });
    pass(P.blur, T.b2, (p) => { bindTex(p, 'uT', 0, T.b1.tex); gl.uniform2f(p.u('uDir'), 0, 2 / T.br.h); });
    pass(P.fin, null, (p) => {
      bindTex(p, 'uC', 0, T.c.tex); bindTex(p, 'uBloom', 1, T.b2.tex);
      gl.uniform2f(p.u('uRes'), canvas.width, canvas.height); gl.uniform1f(p.u('uTime'), st.time);
      gl.uniform1f(p.u('uBloomK'), st.active && st.active.bloom != null ? st.active.bloom : 0.6); gl.uniform1f(p.u('uFade'), 1);
    });
    updateReadout(logW);
    if (meterEl && st.active && st.active.meter) meterEl.innerHTML = st.active.meter(logW);
    // 动态分辨率
    frameMs = frameMs * 0.92 + dt * 1000 * 0.08;
    if (++st.frames % 30 === 0) {
      if (frameMs > 26 && st.scale > 0.35) st.scale = Math.max(0.35, st.scale - 0.1);
      else if (frameMs < 15 && st.scale < 1) st.scale = Math.min(1, st.scale + 0.05);
    }
  }
  // 自动化截图等场合可通过 MC.debug 控制
  MC.debug = { st, S, setZ(z) { st.z = st.zt = z; }, gotoScene(i, u) { const s = S[i]; st.z = st.zt = s.z0 + (s.z1 - s.z0) * (u || 0); } };
  requestAnimationFrame(frame);
})();
