/* 相机参数实验室 · 主程序：相机状态、曝光模式、测光、对焦、界面、拍摄与回放、练习任务 */
(function () {
  'use strict';
  const CL = window.CL;
  const $ = (id) => document.getElementById(id);
  const clamp = CL.clamp;
  const LS = { get(k, d) { try { const v = localStorage.getItem('camlab.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem('camlab.' + k, JSON.stringify(v)); } catch (e) { /* 存储不可用时忽略 */ } } };

  /* ================= 相机状态 ================= */
  const S = {
    preset: 'golden', mode: 'A', a: 3, s: -21, i: 0, comp: 0, autoISO: false, ael: false, aelEV: 0,
    metering: 'eval', lens: 'p85', focal: 85, sensor: 'ff',
    af: 'AF-S', afX: 0.5, afY: 0.56, focus: 5.6, mfFocus: 5.6,
    wb: 'auto', K: 5500, tint: 0, style: 'std', nr: 'std', lensCorr: true,
    filter: 'none', support: 'hand', ibis: true, flash: 'off', flashPow: 2, flashComp: 0, rear: false, hss: false,
    camZ: 0, low: false, yaw: -0.15, pitch: -0.16, panOff: 0,
    zebra: false, histo: true, grid: true, peak: true, sound: true,
  };
  const R = { // 运行时
    presetGain: 1, EVm: 12, awb: [1, 1, 1], afState: 'idle', afTarget: null, afSubject: null, afT: 0, afFail: '',
    topic: 'aperture', busy: false, photos: [], task: null, frame: 0, lastT: 0, scale: 1, ftAvg: 16, meterGrid: null, hist: null,
  };

  /* ================= 渲染器与场景 ================= */
  const vf = $('vf'), canvas = $('vfCanvas');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
  } catch (e) { renderer = null; }
  if (!renderer || !renderer.capabilities.isWebGL2) {
    vf.insertAdjacentHTML('beforeend', '<div class="vf-err">这个浏览器不支持 WebGL 2，无法运行相机模拟。请使用较新的 Chrome、Edge、Firefox 或 Safari。</div>');
    return;
  }
  THREE.ColorManagement.legacyMode = false;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(1);
  const W = CL.createWorld();
  const P = CL.createPipeline(renderer, W);
  const cam = new THREE.PerspectiveCamera(40, 1.5, 0.05, 3000);
  cam.rotation.order = 'YXZ';
  const ray = new THREE.Raycaster();

  /* ================= 光学与曝光推导 ================= */
  const lensOf = () => CL.lensById(S.lens);
  const senOf = () => CL.SENSORS.find((x) => x.id === S.sensor);
  const filterOf = () => CL.FILTERS.find((f) => f.id === S.filter);
  const styleOf = () => CL.STYLES.find((x) => x.id === S.style);

  function safeS(focal, crop) { return Math.round(-3 * Math.log2(focal * crop)); }
  function compute() {
    const lens = lensOf(), sen = senOf(), si = CL.sensorInfo(sen), filt = filterOf();
    const focal = clamp(S.focal, lens.f0, lens.f1);
    const aMin = CL.lensMaxAp(lens, focal), aMax = lens.aMax;
    if (S.a < aMin) S.a = aMin;
    if (S.a > aMax) S.a = aMax;
    const EVm = S.ael ? S.aelEV : R.EVm;
    const T = Math.round((EVm - S.comp / 3) * 3); // 目标 EV（1/3 档）
    const sSafe = safeS(focal, si.crop);
    const isoMaxAuto = 21; // 自动 ISO 上限 12800
    let a = S.a, s = S.s, i = S.i;
    const blink = { a: false, s: false, i: false };
    const auto = { a: false, s: false, i: false };
    if (S.mode === 'M') {
      if (S.autoISO) { auto.i = true; i = a - s - T; if (i < 0 || i > isoMaxAuto) blink.i = true; i = clamp(i, 0, isoMaxAuto); }
    } else if (S.mode === 'A') {
      auto.s = true;
      if (S.autoISO) { auto.i = true; i = 0; s = a - i - T; if (s > sSafe) { i = clamp(a - T - sSafe, 0, isoMaxAuto); s = a - i - T; } }
      else s = a - i - T;
      if (s < CL.S_MIN || s > CL.S_MAX) blink.s = true;
      s = clamp(s, CL.S_MIN, CL.S_MAX);
    } else if (S.mode === 'S') {
      auto.a = true;
      if (S.autoISO) { auto.i = true; i = 0; a = T + s + i; if (a < aMin) { i = clamp(aMin - T - s, 0, isoMaxAuto); a = T + s + i; } }
      else a = T + s + i;
      if (a < aMin || a > aMax) blink.a = true;
      a = clamp(a, aMin, aMax);
    } else { // P：先开大光圈，快门到达安全快门后两者均分
      auto.a = auto.s = true;
      if (S.autoISO) auto.i = true;
      i = S.autoISO ? 0 : S.i;
      let E = T + i;
      let s0 = aMin - E;
      if (s0 >= sSafe) {
        a = aMin; s = s0;
        if (S.autoISO && s > sSafe) { i = clamp(aMin - T - sSafe, 0, isoMaxAuto); E = T + i; s = aMin - E; }
      } else {
        const x = sSafe - s0;
        a = clamp(aMin + Math.round(x / 2), aMin, Math.min(aMax, 24));
        s = a - E;
      }
      if (s < CL.S_MIN || s > CL.S_MAX) blink.s = true;
      s = clamp(s, CL.S_MIN, CL.S_MAX);
    }
    const N = CL.N(a), t = CL.T(s), iso = CL.ISO(i);
    const EVcam = CL.evOf(a, s, i);
    const P_ = W.preset;
    const fStops = filt.stops || 0;
    const gain = R.presetGain * Math.pow(2, -fStops) * Math.pow(2, P_.ev - EVcam);
    const coc = si.coc;
    const dof = CL.dof(focal, N, coc, Math.max(S.focus * 1000, focal * 1.1));
    const style = styleOf();
    const wbUse = S.wb === 'auto' ? [R.awb[0], R.awb[1] * Math.pow(2, -S.tint * 0.05), R.awb[2]] : CL.wbGains(S.wb === 'kelvin' ? S.K : CL.WB_PRESETS.find((w) => w.id === S.wb).K, S.tint);
    const ibisStops = S.support === 'hand' || S.support === 'pan' ? (S.ibis ? 5 : 0) : 0;
    const omega = S.support === 'tripod' ? 0 : 0.02 * Math.pow(2, -ibisStops) * (S.support === 'pan' ? 0.6 : 1);
    const shakeMM = omega * t * focal;
    return {
      lens, sen, si, filt, focal, aMin, aMax, a, s, i, N, t, iso, EVcam, EVm, T, blink, auto, gain, fStops, coc, dof, style, wb: wbUse,
      sSafe, ibisStops, omega, shakeMM, aspect: sen.w / sen.h,
      delta: EVm - EVcam, // 正值 = 比测光读数更亮
    };
  }

  function camFov(X) { return CL.deg(CL.fov(X.sen.h, X.focal)); }

  /* ================= 相机位姿 ================= */
  const camPos = () => new THREE.Vector3(0, S.low ? 0.6 : 1.6, S.camZ);
  function yawTo(p, from) { return Math.atan2(-(p.x - from.x), -(p.z - from.z)); }
  function pitchTo(p, from) { const d = Math.hypot(p.x - from.x, p.z - from.z); return Math.atan2(p.y - from.y, d); }
  function baseYaw(t) {
    if (S.support !== 'pan') return S.yaw;
    const rp = W.riderPos(t).add(new THREE.Vector3(0, 1.25, 0));
    return clamp(yawTo(rp, camPos()) + S.panOff, -1.25, 1.25);
  }
  function shakeAt(tau, seedA) {
    const f = [3.1, 7.3, 11.7], amp = [0.6, 0.35, 0.25];
    let x = Math.cos(seedA) * tau * 0.8, y = Math.sin(seedA) * tau * 0.8;
    for (let k = 0; k < 3; k++) {
      const w = 2 * Math.PI * f[k];
      x += (amp[k] * (Math.sin(w * tau + seedA * (k + 1)) - Math.sin(seedA * (k + 1)))) / w;
      y += (amp[k] * (Math.cos(w * tau + seedA * (k + 2.3)) - Math.cos(seedA * (k + 2.3)))) / w;
    }
    return [x, y];
  }
  function poseCam(X, t, extraYaw, extraPitch) {
    cam.position.copy(camPos());
    cam.rotation.set(clamp(S.pitch + (extraPitch || 0), -1.2, 1.3), baseYaw(t) + (extraYaw || 0), 0);
    cam.fov = camFov(X); cam.aspect = X.aspect; cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
  }

  /* ================= 测光 ================= */
  function meterWeights(mode, w, h) {
    const out = new Float32Array(w * h);
    const ax = S.afX, ay = 1 - S.afY;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const u = (x + 0.5) / w, v = (y + 0.5) / h;
      const dc = Math.hypot((u - 0.5) * 1.5, v - 0.5), da = Math.hypot((u - ax) * 1.5, v - ay);
      let wt;
      if (mode === 'eval') wt = 1 + 1.4 * Math.exp(-(dc * dc) / 0.06) + 2.2 * Math.exp(-(da * da) / 0.012);
      else if (mode === 'center') wt = 0.08 + Math.exp(-(dc * dc) / 0.045);
      else wt = da < 0.045 ? 1 : 0;
      out[y * w + x] = wt;
    }
    return out;
  }
  function meterEV(grid, mode) {
    const wts = meterWeights(mode, grid.w, grid.h);
    const cap = mode === 'eval' ? 0.18 * Math.pow(2, 3.5) : mode === 'center' ? 0.18 * 32 : 1e9;
    let sw = 0, sl = 0;
    for (let k = 0; k < grid.w * grid.h; k++) {
      const L = 0.2126 * grid.rgb[k * 3] + 0.7152 * grid.rgb[k * 3 + 1] + 0.0722 * grid.rgb[k * 3 + 2];
      sw += wts[k]; sl += wts[k] * Math.min(L, cap);
    }
    const Lw = Math.max(sl / Math.max(sw, 1e-6), 1e-6);
    return W.preset.ev + Math.log2(Lw / 0.18);
  }
  // 自动白平衡：只让「接近中性」的区域（路面、墙、云）投票，鲜艳的绿篱、红车不参与
  function grayWorld(grid) {
    let r = 0, g = 0, b = 0;
    for (let k = 0; k < grid.w * grid.h; k++) {
      const R_ = grid.rgb[k * 3], G = grid.rgb[k * 3 + 1], B = grid.rgb[k * 3 + 2];
      const mx = Math.max(R_, G, B) + 1e-6, mn = Math.min(R_, G, B);
      const sat = (mx - mn) / mx;
      const wt = CL.smooth(0.6, 0.15, sat) + 0.02;
      const L = Math.min(0.2126 * R_ + 0.7152 * G + 0.0722 * B, 1.2), k2 = (wt * L) / mx;
      r += R_ * k2; g += G * k2; b += B * k2;
    }
    const raw = [g / Math.max(r, 1e-6), 1, g / Math.max(b, 1e-6)];
    // 只校正约七成：保留日落、灯光的暖色氛围（多数相机的自动白平衡也这样做）
    return raw.map((x) => clamp(Math.pow(x, x < 1 ? 0.6 : 0.5), 0.4, 3));
  }

  function calibrate() {
    const X = compute();
    cam.position.set(0, 1.6, 0); cam.rotation.set(-0.1, 0, 0);
    cam.fov = CL.deg(CL.fov(24, 35)); cam.aspect = 1.5; cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    W.update(R.time || 0);
    P.renderSceneOnly(cam);
    const g = P.meter(1, 0);
    let sw = 0, sl = 0;
    const wts = meterWeights('center', g.w, g.h);
    for (let k = 0; k < g.w * g.h; k++) { const L = 0.2126 * g.rgb[k * 3] + 0.7152 * g.rgb[k * 3 + 1] + 0.0722 * g.rgb[k * 3 + 2]; sw += wts[k] * 0.5 + 0.5; sl += (wts[k] * 0.5 + 0.5) * Math.min(L, 50); }
    R.presetGain = 0.18 / Math.max(sl / sw, 1e-6);
    // 月面亮度与光线无关：Looney 11 法则对应 EV100 ≈ 15
    W.moon.material.color.setScalar((0.18 * Math.pow(2, 15 - W.preset.ev)) / R.presetGain / 0.5);
    R.EVm = W.preset.ev;
    void X;
  }

  /* ================= 对焦 ================= */
  function pickOne(u, v) {
    ray.setFromCamera(new THREE.Vector2(u * 2 - 1, -(v * 2 - 1)), cam);
    const hits = ray.intersectObjects(W.pickables, false);
    for (const h of hits) {
      let o = h.object, vis = true; while (o) { if (o.visible === false) vis = false; o = o.parent; }
      if (!vis) continue;
      const pc = h.point.clone().applyMatrix4(cam.matrixWorldInverse);
      return { dist: -pc.z, subject: W.subjectOf(h.object), point: h.point };
    }
    return null;
  }
  // 对焦框（约画面宽 3.5%）内撒 3×3 条射线，取最近的命中——和相机「区域内最近主体优先」一致
  function pickAt(u, v) {
    let best = null;
    const du = 0.016, dv = 0.016 * cam.aspect;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const h = pickOne(u + i * du, v + j * dv);
      if (h && (!best || h.dist < best.dist - 0.02 || (j === 0 && i === 0 && h.dist < best.dist + 0.02))) best = h;
    }
    return best;
  }
  const SUBJ = { bicycle: '自行车', pinwheel: '风车', chart: '色卡', fountain: '喷泉', cyclist: '骑车人', car: '汽车', moon: '月亮', tower: '钟楼', hedge: '灯篱', cafe: '咖啡座', building: '楼房', planter: '花坛', tree: '树', lights: '串灯', lamp: '路灯', road: '路面', ground: '地面', bench: '长椅', railing: '栏杆', hill: '远山' };
  function startAF() {
    if (S.af === 'MF') return;
    const hit = pickAt(S.afX, S.afY);
    const lens = lensOf();
    if (!hit) { R.afState = 'fail'; R.afFail = '对焦点落在天空等没有反差的地方，无法合焦'; R.afT = performance.now(); return; }
    R.afSubject = hit.subject;
    if (hit.dist < lens.mfd) { R.afTarget = lens.mfd; R.afState = 'fail'; R.afFail = `太近了：${SUBJ[hit.subject] || '目标'}只有 ${CL.fmtDist(hit.dist * 1000)}，这支镜头最近对焦 ${CL.fmtDist(lens.mfd * 1000)}`; R.afT = performance.now(); return; }
    R.afTarget = hit.dist; R.afState = 'busy'; R.afT = performance.now();
  }
  function updateFocus(dt) {
    const lens = lensOf();
    if (S.af === 'MF') { S.focus = Math.max(S.mfFocus, lens.mfd); return; }
    if (S.af === 'AF-C' && !R.busy) {
      const hit = pickAt(S.afX, S.afY);
      if (hit) { R.afTarget = Math.max(hit.dist, lens.mfd); R.afSubject = hit.subject; }
    }
    if (R.afTarget != null && (R.afState === 'busy' || S.af === 'AF-C' || R.afState === 'fail')) {
      const cur = 1 / S.focus, tgt = 1 / R.afTarget;
      const k = 1 - Math.exp(-dt * 14);
      const nd = cur + (tgt - cur) * k;
      S.focus = 1 / Math.max(nd, 1e-4);
      if (Math.abs(nd - tgt) < 0.004 * Math.max(tgt, 0.1) + 0.0004) {
        S.focus = R.afTarget;
        if (R.afState === 'busy') { R.afState = 'ok'; R.afT = performance.now(); beep(); }
        if (S.af === 'AF-C') R.afState = 'ok';
      } else if (S.af === 'AF-C') R.afState = 'busy';
    }
    if ((R.afState === 'ok' || R.afState === 'fail') && S.af === 'AF-S' && performance.now() - R.afT > 1600) R.afState = 'idle';
  }

  /* ================= 声音 ================= */
  let actx = null;
  function audio() { if (!S.sound) return null; try { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { actx = null; } return actx; }
  function beep() {
    const a = audio(); if (!a) return;
    [0, 0.075].forEach((d) => { const o = a.createOscillator(), g = a.createGain(); o.frequency.value = 2650; g.gain.setValueAtTime(0.0001, a.currentTime + d); g.gain.exponentialRampToValueAtTime(0.05, a.currentTime + d + 0.005); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + d + 0.045); o.connect(g).connect(a.destination); o.start(a.currentTime + d); o.stop(a.currentTime + d + 0.06); });
  }
  function clack(delay, vol) {
    const a = audio(); if (!a) return;
    const len = Math.round(a.sampleRate * 0.05), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let k = 0; k < len; k++) d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / len, 6);
    const src = a.createBufferSource(), bp = a.createBiquadFilter(), g = a.createGain();
    src.buffer = buf; bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = 0.9; g.gain.value = vol;
    src.connect(bp).connect(g).connect(a.destination); src.start(a.currentTime + delay);
  }

  /* ================= 刻度带控件 ================= */
  function Tape(el, opt) {
    const px = opt.px || 14;
    el.tabIndex = 0; el.setAttribute('role', 'slider'); el.setAttribute('aria-label', opt.name);
    const rail = document.createElement('div'); rail.className = 'rail';
    const needle = document.createElement('div'); needle.className = 'needle';
    el.append(rail, needle);
    let min = 0, max = 0, cur = 0, disabled = false;
    function build(mn, mx) {
      min = mn; max = mx; rail.innerHTML = '';
      for (let v = min; v <= max; v++) {
        const t = document.createElement('div'); t.className = 'tk' + (opt.major(v) ? ' maj' : '');
        t.style.left = (v - min) * px + 'px';
        const lab = opt.major(v) ? opt.label(v) : null;
        if (lab) { const s = document.createElement('span'); s.textContent = lab; s.dataset.v = v; t.appendChild(s); }
        rail.appendChild(t);
      }
      set(cur, true);
    }
    function set(v, quiet) {
      cur = clamp(Math.round(v), min, max);
      rail.style.transform = `translateX(${-(cur - min) * px}px)`;
      el.setAttribute('aria-valuenow', cur); el.setAttribute('aria-valuetext', opt.text ? opt.text(cur) : String(cur));
      el.setAttribute('aria-valuemin', min); el.setAttribute('aria-valuemax', max);
      void quiet;
    }
    function input(v) { if (disabled) { opt.onDisabled && opt.onDisabled(); return; } v = clamp(Math.round(v), min, max); if (v !== cur) { set(v); opt.onInput(v); } }
    let drag = null;
    el.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, v: cur, moved: false, target: e.target }; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove', (e) => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 3) drag.moved = true; if (drag.moved) input(drag.v - dx / px); });
    el.addEventListener('pointerup', () => { if (drag && !drag.moved && drag.target.dataset && drag.target.dataset.v != null) input(+drag.target.dataset.v); drag = null; });
    el.addEventListener('pointercancel', () => (drag = null));
    el.addEventListener('wheel', (e) => { e.preventDefault(); const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY; input(cur + (d > 0 ? 1 : -1)); }, { passive: false });
    el.addEventListener('keydown', (e) => {
      const k = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -3, PageUp: 3 }[e.key];
      if (k) { e.preventDefault(); input(cur + k); }
    });
    el.addEventListener('focus', () => opt.onFocus && opt.onFocus());
    return { build, set, get: () => cur, setDisabled(b) { disabled = b; el.setAttribute('aria-disabled', b); } };
  }

  const tapeS = Tape($('tS'), { name: '快门速度', major: (v) => CL.isFull(v), label: (v) => CL.shLabel(v), text: (v) => CL.shLabel(v) + ' 秒', onInput: (v) => { S.s = v; topic('shutter'); }, onFocus: () => topic('shutter'), onDisabled: () => toastAuto('shutter') });
  const tapeA = Tape($('tA'), { name: '光圈', major: (v) => CL.isFull(v), label: (v) => CL.apNum(v), text: (v) => CL.apLabel(v), onInput: (v) => { S.a = v; topic('aperture'); }, onFocus: () => topic('aperture'), onDisabled: () => toastAuto('aperture') });
  const tapeI = Tape($('tI'), { name: '感光度', major: (v) => CL.isFull(v), label: (v) => CL.isoLabel(v), text: (v) => 'ISO ' + CL.isoLabel(v), onInput: (v) => { S.i = v; topic('iso'); }, onFocus: () => topic('iso'), onDisabled: () => toastAuto('iso') });
  const tapeC = Tape($('tC'), { name: '曝光补偿', major: (v) => CL.isFull(v), label: (v) => (v === 0 ? '0' : (v > 0 ? '+' : '−') + Math.abs(v / 3)), text: (v) => CL.compLabel(v) + ' EV', onInput: (v) => { S.comp = v; topic('comp'); }, onFocus: () => topic('comp'), onDisabled: () => toastAuto('comp') });
  tapeS.build(CL.S_MIN, CL.S_MAX); tapeI.build(CL.I_MIN, CL.I_MAX); tapeC.build(-15, 15);
  let builtAp = '';
  function toastAuto(k) {
    const m = { P: 'P 档由相机同时决定光圈和快门', A: 'A 档（光圈优先）由相机决定快门', S: 'S 档（快门优先）由相机决定光圈', M: '' }[S.mode];
    if (k === 'iso') toast('已开启自动 ISO：感光度由相机决定。可在「测光与辅助显示」里关闭');
    else if (k === 'comp') toast('M 档曝光完全由你决定，曝光补偿不起作用（开启自动 ISO 时除外）');
    else toast(m + '。切到 ' + (k === 'shutter' ? 'S 或 M' : 'A 或 M') + ' 档即可手动调整');
  }

  /* ================= 小控件 ================= */
  function seg(id, key, onSet) {
    const el = $(id);
    el.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; S[key] = b.dataset.v; onSet && onSet(b.dataset.v); syncUI(); });
    return () => el.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(S[key] === b.dataset.v)));
  }
  function chips(id, items, key, onSet, labelFn) {
    const el = $(id);
    el.innerHTML = items.map((it) => `<button data-v="${it.id}" aria-pressed="false">${labelFn ? labelFn(it) : it.name}</button>`).join('');
    el.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; S[key] = b.dataset.v; onSet && onSet(b.dataset.v); syncUI(); });
    return () => el.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(S[key] === b.dataset.v)));
  }
  const syncers = [];
  function panPitch() { return pitchTo(W.riderPos(R.time).add(new THREE.Vector3(0, 1.25, 0)), camPos()); }
  syncers.push(seg('supportSeg', 'support', (v) => { if (v === 'pan') { S.panOff = 0; S.af = 'AF-C'; S.afX = 0.5; S.afY = 0.5; S.pitch = panPitch(); toast('追焦：取景器会跟着骑车人转动，背景在曝光期间被拉成流线。快门试试 1/30 到 1/15'); } topic('support'); }));
  syncers.push(seg('afSeg', 'af', (v) => { if (v === 'MF') S.mfFocus = S.focus; R.afState = 'idle'; topic('af'); }));
  syncers.push(seg('meterSeg', 'metering', () => topic('metering')));
  syncers.push(seg('nrSeg', 'nr', () => topic('nr')));
  syncers.push(seg('flashSeg', 'flash', () => topic('flash')));
  syncers.push(chips('presetChips', W.PRESETS, 'preset', (v) => { W.setPreset(renderer, v); calibrate(); topic('preset'); }));
  syncers.push(chips('wbChips', CL.WB_PRESETS, 'wb', () => topic('wb')));
  syncers.push(chips('styleChips', CL.STYLES, 'style', () => topic('style')));
  syncers.push(chips('sensorChips', CL.SENSORS, 'sensor', () => { resize(); topic('sensor'); }));
  syncers.push(chips('filterChips', CL.FILTERS, 'filter', () => topic('filter')));
  $('modes').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; setMode(b.dataset.mode); });
  function setMode(m) {
    const X = compute();
    S.a = X.a; S.s = X.s; if (!S.autoISO) S.i = X.i;
    S.mode = m; topic('mode'); syncUI();
  }
  const lensList = $('lensList');
  lensList.innerHTML = CL.LENSES.map((l) => `<button data-v="${l.id}" aria-pressed="false"><b>${l.name}</b><span>${l.kind}</span></button>`).join('');
  lensList.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; setLens(b.dataset.v); });
  function setLens(id) {
    const l = CL.lensById(id); S.lens = id;
    if (S.focal < l.f0 || S.focal > l.f1) S.focal = l.f0 === l.f1 ? l.f0 : clamp(S.focal, l.f0, l.f1);
    S.focal = clamp(S.focal, l.f0, l.f1);
    if (S.af === 'MF') S.mfFocus = Math.max(S.mfFocus, l.mfd);
    else startAF();
    topic('lens'); syncUI();
  }
  function bindRange(id, fn) { $(id).addEventListener('input', (e) => fn(+e.target.value)); }
  bindRange('camZ', (v) => { S.camZ = v; topic('position'); syncUI(); });
  bindRange('zoom', (v) => { const l = lensOf(); S.focal = Math.round(l.f0 * Math.pow(l.f1 / l.f0, v / 1000)); topic('focal'); syncUI(); });
  const mfToDist = (v) => (v >= 990 ? 1e5 : 0.2 * Math.pow(10, (v / 990) * Math.log10(1000 / 0.2)));
  const distToMf = (d) => (d >= 1e4 ? 1000 : Math.round((Math.log10(d / 0.2) / Math.log10(1000 / 0.2)) * 990));
  bindRange('mf', (v) => { S.mfFocus = Math.max(mfToDist(v), lensOf().mfd); topic('focus'); syncUI(); });
  bindRange('kel', (v) => { S.K = v; S.wb = 'kelvin'; topic('wb'); syncUI(); });
  bindRange('tint', (v) => { S.tint = v; topic('wb'); syncUI(); });
  bindRange('flashPow', (v) => { S.flashPow = v; S.flash = 'manual'; topic('flash'); syncUI(); });
  bindRange('flashComp', (v) => { S.flashComp = v; topic('flash'); syncUI(); });
  function bindCheck(id, key, fn) { $(id).addEventListener('change', (e) => { S[key] = e.target.checked; fn && fn(); syncUI(); }); }
  bindCheck('ibis', 'ibis', () => topic('support'));
  bindCheck('low', 'low', () => topic('position'));
  bindCheck('autoISO', 'autoISO', () => topic('iso'));
  bindCheck('zebra', 'zebra', () => topic('zebra'));
  bindCheck('histoT', 'histo', () => topic('histogram'));
  bindCheck('gridT', 'grid');
  bindCheck('peakT', 'peak', () => topic('focus'));
  bindCheck('soundT', 'sound');
  bindCheck('lensCorr', 'lensCorr', () => topic('lensCorr'));
  bindCheck('rear', 'rear', () => topic('flash'));
  bindCheck('hss', 'hss', () => topic('flash'));
  $('btnAEL').addEventListener('click', () => { S.ael = !S.ael; if (S.ael) S.aelEV = R.EVm; topic('ael'); syncUI(); });
  $('btnAF').addEventListener('click', () => { startAF(); topic('af'); });

  /* ================= 界面同步 ================= */
  function syncUI() {
    const X = compute();
    syncers.forEach((f) => f());
    document.querySelectorAll('#modes button').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.mode === S.mode)));
    lensList.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === S.lens)));
    const apKey = X.aMin + ':' + X.aMax;
    if (apKey !== builtAp) { tapeA.build(X.aMin, X.aMax); builtAp = apKey; }
    $('camZv').textContent = (S.camZ >= 0 ? '后退 ' : '前进 ') + Math.abs(S.camZ).toFixed(1) + ' m';
    $('camZ').value = S.camZ;
    const l = X.lens;
    $('zoomRow').hidden = l.f0 === l.f1;
    $('zoom').value = l.f0 === l.f1 ? 0 : Math.round((Math.log(X.focal / l.f0) / Math.log(l.f1 / l.f0)) * 1000);
    $('zoomV').textContent = X.focal + ' mm' + (X.si.crop > 1.05 || X.si.crop < 0.95 ? ` · 等效 ${Math.round(X.focal * X.si.crop)} mm` : '');
    $('mfRow').hidden = S.af !== 'MF';
    $('mf').value = distToMf(S.mfFocus);
    $('mfV').textContent = CL.fmtDist(S.mfFocus * 1000);
    $('kRow').hidden = S.wb !== 'kelvin';
    $('kel').value = S.K; $('kelV').textContent = S.K + ' K';
    $('tint').value = S.tint; $('tintV').textContent = S.tint === 0 ? '0' : (S.tint > 0 ? 'M' : 'G') + Math.abs(S.tint);
    $('flashPowRow').hidden = S.flash !== 'manual';
    $('flashCompRow').hidden = S.flash !== 'ttl';
    $('flashPowV').textContent = '1/' + Math.pow(2, S.flashPow);
    $('flashCompV').textContent = CL.compLabel(S.flashComp) + ' EV';
    ['ibis', 'low', 'autoISO', 'zebra', 'lensCorr', 'rear', 'hss'].forEach((k) => ($(k).checked = S[k]));
    $('histoT').checked = S.histo; $('gridT').checked = S.grid; $('peakT').checked = S.peak; $('soundT').checked = S.sound;
    $('btnAEL').setAttribute('aria-pressed', String(S.ael));
    $('presetNote').textContent = W.preset.desc + `（基准 EV ${W.preset.ev}）`;
    const si = X.si;
    $('sensorNote').innerHTML = `<b>${X.sen.name}</b> ${X.sen.w}×${X.sen.h} mm · 裁切系数 ${si.crop.toFixed(2)} · ${X.sen.mp} MP · 像素间距 ${si.pitch.toFixed(1)} µm · 允许弥散圆 ${(si.coc * 1000).toFixed(0)} µm`;
    vf.style.setProperty('--vf-aspect', X.aspect.toFixed(4));
    $('vfGrid').hidden = !S.grid;
    $('histo').hidden = !S.histo;
    syncDials(X);
    drawIris(X);
    renderTopic();
  }
  function syncDials(X) {
    X = X || compute();
    tapeS.set(X.s); tapeA.set(X.a); tapeI.set(X.i); tapeC.set(S.comp);
    $('vS').textContent = CL.shLabel(X.s); $('vA').textContent = CL.apLabel(X.a); $('vI').textContent = CL.isoLabel(X.i); $('vC').textContent = CL.compLabel(S.comp);
    const set = (d, auto, blink, tape) => { $(d).classList.toggle('auto', auto); $(d).classList.toggle('blink', blink); tape.setDisabled(auto); };
    set('dS', X.auto.s, X.blink.s, tapeS); set('dA', X.auto.a, X.blink.a, tapeA); set('dI', X.auto.i, X.blink.i, tapeI);
    const compOff = S.mode === 'M' && !S.autoISO;
    set('dC', compOff, false, tapeC);
  }

  /* ================= 取景器叠加层 ================= */
  const vfInfo = $('vfInfo'), vfTop = $('vfTop'), afBox = $('afBox');
  function meterSVG(v, blinkOver) {
    // v：以 EV 为单位，正值偏亮；刻度 −3…+3
    const W_ = 160, x = (e) => 6 + ((e + 3) / 6) * (W_ - 12);
    let s = `<svg viewBox="0 0 ${W_} 24" aria-hidden="true">`;
    for (let k = -9; k <= 9; k++) { const X_ = x(k / 3), maj = k % 3 === 0; s += `<line x1="${X_}" x2="${X_}" y1="${maj ? 2 : 6}" y2="12" stroke="#fff" stroke-width="${maj ? 1.6 : 1}"/>`; }
    [-3, -2, -1, 0, 1, 2, 3].forEach((e) => (s += `<text x="${x(e)}" y="23" fill="#fff" font-size="9" text-anchor="middle" font-family="Barlow Condensed,sans-serif">${e === 0 ? '0' : Math.abs(e)}</text>`));
    const vv = clamp(v, -3.2, 3.2);
    const over = Math.abs(v) > 3;
    s += `<polygon points="${x(vv) - 5},0 ${x(vv) + 5},0 ${x(vv)},7" fill="${over || blinkOver ? '#ffa24a' : '#fff'}" ${over ? 'class="blink"' : ''}/>`;
    if (v > 3) s += `<text x="${W_ - 2}" y="10" fill="#ffa24a" font-size="12" text-anchor="end">▶</text>`;
    if (v < -3) s += `<text x="2" y="10" fill="#ffa24a" font-size="12">◀</text>`;
    return s + '</svg>';
  }
  function updateVF(X) {
    // 刻度向 + 表示比测光读数更亮。M 档显示实际偏差；P/A/S 显示补偿量，超出范围时显示实际偏差
    const brighter = X.EVm - X.EVcam;
    const disp = (S.mode === 'M' && !S.autoISO) || X.blink.a || X.blink.s || X.blink.i ? brighter : S.comp / 3;
    const wbS = S.wb === 'auto' ? 'AWB' : S.wb === 'kelvin' ? S.K + 'K' : CL.WB_PRESETS.find((w) => w.id === S.wb).name;
    vfInfo.innerHTML =
      `<span class="m">${S.mode}</span>` +
      `<span class="${X.blink.s ? 'blink' : ''}">${CL.shLabel(X.s)}</span>` +
      `<span class="${X.blink.a ? 'blink' : ''}">F${CL.apNum(X.a)}</span>` +
      `<span class="meter-scale">${meterSVG(disp)}</span>` +
      `<span class="${X.blink.i ? 'blink' : ''}"><small>ISO</small>${CL.isoLabel(X.i)}</span>` +
      (S.mode !== 'M' || S.autoISO ? `<span><small>±</small>${CL.compLabel(S.comp)}</span>` : '') +
      `<span><small>WB</small>${wbS}</span>`;
    const tags = [];
    tags.push(`<span class="tag">${X.focal}mm${Math.abs(X.si.crop - 1) > 0.05 ? ' (≈' + Math.round(X.focal * X.si.crop) + ')' : ''}</span>`);
    tags.push(`<span class="tag">${S.af}</span>`);
    tags.push(`<span class="tag">${{ eval: '评价测光', center: '中央重点', spot: '点测光' }[S.metering]}</span>`);
    if (S.ael) tags.push('<span class="tag w">AE-L</span>');
    if (S.filter !== 'none') tags.push(`<span class="tag">${X.filt.name}</span>`);
    if (S.flash !== 'off') tags.push(`<span class="tag">闪光 ${S.flash === 'ttl' ? 'TTL' : '1/' + Math.pow(2, S.flashPow)}${X.s < CL.SYNC_S && !S.hss ? ' · 超同步' : ''}</span>`);
    if (S.support === 'hand' && X.shakeMM > X.coc * 1.0) tags.push(`<span class="tag w">手抖风险</span>`);
    if (S.support === 'tripod') tags.push('<span class="tag">三脚架</span>');
    if (S.support === 'pan') tags.push('<span class="tag">追焦</span>');
    if (R.afState === 'fail' && R.afFail) tags.push(`<span class="tag w">${R.afFail}</span>`);
    vfTop.innerHTML = tags.join('');
    afBox.style.left = S.afX * 100 + '%'; afBox.style.top = S.afY * 100 + '%';
    afBox.className = 'af' + (R.afState === 'busy' ? ' busy' : R.afState === 'ok' ? ' ok' : R.afState === 'fail' ? ' fail' : '') + (S.metering === 'spot' ? ' spot' : '');
  }

  /* 直方图 */
  const histCv = $('histo'), hctx = histCv.getContext('2d');
  function histogram(data, w, h) {
    const r = new Float32Array(64), g = new Float32Array(64), b = new Float32Array(64), l = new Float32Array(64);
    let hi = 0, lo = 0;
    for (let k = 0; k < w * h; k++) {
      const R_ = data[k * 4], G = data[k * 4 + 1], B = data[k * 4 + 2];
      r[R_ >> 2]++; g[G >> 2]++; b[B >> 2]++;
      const L = Math.round(0.2126 * R_ + 0.7152 * G + 0.0722 * B); l[L >> 2]++;
      if (R_ >= 254 || G >= 254 || B >= 254) hi++;
      if (L <= 3) lo++;
    }
    return { r, g, b, l, hi: hi / (w * h), lo: lo / (w * h) };
  }
  function drawHist(ctx, H, cw, ch, rgb) {
    ctx.clearRect(0, 0, cw, ch);
    const mx = Math.max(...H.l, ...(rgb ? [...H.r, ...H.g, ...H.b] : [])) * 0.9 + 1;
    const plot = (arr, col, mode) => { ctx.beginPath(); ctx.moveTo(0, ch); for (let k = 0; k < 64; k++) ctx.lineTo(((k + 0.5) / 64) * cw, ch - Math.min(1, Math.sqrt(arr[k] / mx)) * (ch - 6)); ctx.lineTo(cw, ch); ctx.closePath(); ctx.globalCompositeOperation = mode; ctx.fillStyle = col; ctx.fill(); };
    ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.lineWidth = 1;
    for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo((k / 4) * cw, 0); ctx.lineTo((k / 4) * cw, ch); ctx.stroke(); }
    if (rgb) { plot(H.r, 'rgba(255,70,60,.75)', 'lighter'); plot(H.g, 'rgba(70,220,90,.7)', 'lighter'); plot(H.b, 'rgba(80,130,255,.8)', 'lighter'); ctx.globalCompositeOperation = 'source-over'; }
    else plot(H.l, 'rgba(236,231,220,.85)', 'source-over');
    ctx.globalCompositeOperation = 'source-over';
    if (H.hi > 0.002) { ctx.fillStyle = '#ff5b50'; ctx.fillRect(cw - 4, 0, 4, ch); }
    if (H.lo > 0.02) { ctx.fillStyle = '#8cc4ff'; ctx.fillRect(0, 0, 4, ch); }
  }

  /* ================= 讲解卡 ================= */
  function topic(t) { R.topic = t; renderTopic(); }
  const fx = (x, d = 2) => (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
  function evFormula(X) {
    return `<div class="formula"><span class="c">EV = log₂(N²/t) − log₂(ISO/100)</span><br>` +
      `&nbsp;&nbsp; = log₂(${fx(X.N, 2)}² ÷ ${X.t < 1 ? '1/' + Math.round(1 / X.t) : fx(X.t, 1)}) − log₂(${Math.round(X.iso)}/100)<br>` +
      `&nbsp;&nbsp; = ${fx(Math.log2((X.N * X.N) / X.t))} − ${fx(Math.log2(X.iso / 100))} = <em>${fx(X.EVcam)}</em><br>` +
      `<span class="c">测光读数 EV ${fx(X.EVm, 1)}${S.mode !== 'M' ? ` · 补偿 ${CL.compLabel(S.comp)} → 目标 ${fx(X.EVm - S.comp / 3, 1)}` : ''} · 偏差 ${CL.fmtEV(X.EVm - X.EVcam, 1)} 档</span></div>`;
  }
  function riderPx(X, w) { return ((W.riderSpeed * X.t) / 15) * (X.focal / X.sen.w) * w; }
  const TOPICS = {
    shutter(X) {
      const safe = 1 / (X.focal * X.si.crop), w = 1500;
      const eff = safe * Math.pow(2, X.ibisStops);
      return {
        eb: 'Shutter Speed', h: `快门速度 ${CL.shLabel(X.s)}<small>${CL.fmtSec(X.t)}</small>`, term: 'shutter',
        body: `<p>快门打开多久，传感器就接收多久的光。时间加倍，进光量加倍，就是 <b>1 档</b>。</p>` +
          `<dl class="kv"><dt>骑车人位移</dt><dd>${fx(W.riderSpeed * X.t * 100, 1)} cm ≈ ${Math.round(riderPx(X, w))} 像素（1500 px 宽的照片）</dd>` +
          `<dt>风车叶尖</dt><dd>转过 ${fx(Math.min(360 * 2.4 * X.t, 9999), 0)}°</dd>` +
          `<dt>安全快门</dt><dd>1/${Math.round(X.focal * X.si.crop)} 秒（1 ÷ 等效焦距）${X.ibisStops ? ` · 开防抖约 ${eff >= 0.3 ? fx(eff, 1) + '″' : '1/' + Math.round(1 / eff)}` : ''}</dd>` +
          `<dt>手抖模糊</dt><dd>${S.support === 'tripod' ? '三脚架：0' : `约 ${fx(X.shakeMM * 1000, 0)} µm（允许 ${fx(X.coc * 1000, 0)} µm）`}</dd></dl>` + evFormula(X),
      };
    },
    aperture(X) {
      const D = X.focal / X.N, d = X.dof, airy = CL.airy(X.N);
      return {
        eb: 'Aperture · f-number', h: `光圈 ${CL.apLabel(X.a)}<small>N = ${fx(X.N, 2)}</small>`, term: 'aperture',
        body: `<p>f 值是焦距与入瞳直径之比。数字每乘以 √2（1.4 → 2 → 2.8 → 4），通光面积减半，少 1 档光；同时景深变深。</p>` +
          `<dl class="kv"><dt>入瞳直径</dt><dd>${X.focal} ÷ ${fx(X.N, 2)} = ${fx(D, 1)} mm</dd>` +
          `<dt>景深</dt><dd>${CL.fmtDist(d.near)} – ${CL.fmtDist(d.far)}${isFinite(d.far) ? `（共 ${CL.fmtDist(d.total)}）` : ''}</dd>` +
          `<dt>超焦距</dt><dd>${CL.fmtDist(d.H)}</dd>` +
          `<dt>艾里斑</dt><dd>${fx(airy, 1)} µm · 像素 ${fx(X.si.pitch, 1)} µm${airy > 2.5 * X.si.pitch ? ' · <b style="color:var(--warn)">衍射开始变软</b>' : ''}</dd>` +
          `<dt>最大光圈</dt><dd>${CL.apLabel(X.aMin)}（${X.lens.name}${X.lens.aW !== X.lens.aT ? '，浮动光圈' : ''}）</dd></dl>`,
      };
    },
    iso(X) {
      const g = X.iso / 100, Q = 26000 * (X.si.area / 864) / Math.max(g, 0.5);
      const mid = (Q * 0.18) / CL.CLIP, snr = mid / Math.sqrt(mid + 6.25), dr = Math.log2(Q / 2.5);
      return {
        eb: 'ISO · Sensitivity', h: `感光度 ISO ${CL.isoLabel(X.i)}`, term: 'iso',
        body: `<p>提高 ISO 并不让传感器收到更多光，只是把信号放大。光子少了，<b>散粒噪声</b>就显出来。</p>` +
          `<dl class="kv"><dt>放大倍数</dt><dd>${fx(g, 2)}× ISO 100</dd><dt>中灰处光子数</dt><dd>约 ${Math.round(mid)} 个/像素（按 1200×800 输出）</dd>` +
          `<dt>中灰信噪比</dt><dd>${fx(snr, 1)} ∶ 1 · ${fx(20 * Math.log10(snr), 0)} dB</dd><dt>动态范围</dt><dd>约 ${fx(dr, 1)} 档</dd>` +
          `<dt>原生范围</dt><dd>ISO 100 – 25600${X.i < 0 ? ' · <b style="color:var(--warn)">当前为扩展低感（L）</b>' : X.i > 24 ? ' · <b style="color:var(--warn)">当前为扩展高感（H）</b>' : ''}</dd></dl>`,
      };
    },
    comp(X) {
      return { eb: 'Exposure Compensation', h: `曝光补偿 ${CL.compLabel(S.comp)} EV`, term: 'ev-comp',
        body: `<p>测光表默认把画面平均成 18% 中灰。雪景、白墙要 <b>加</b> 补偿，夜景、黑衣服要 <b>减</b> 补偿。P/A/S 档里它改变相机的目标亮度；M 档里只有开启自动 ISO 才起作用。</p>` + evFormula(X) };
    },
    mode(X) {
      const d = { P: ['程序自动', '相机同时决定光圈和快门：先开大光圈，快门到达安全快门（1/等效焦距）后，两者一起收。'], A: ['光圈优先 A / Av', '你定光圈（控制景深），相机按测光算出快门。人像、风光最常用。快门数字闪烁说明超出了 1/8000–30″ 的范围。'], S: ['快门优先 S / Tv', '你定快门（控制动态），相机算出光圈。光圈数字闪烁说明镜头已经开到最大或收到最小，曝光不够或过度。'], M: ['手动 M', '三项都由你决定，取景器里的刻度显示与测光读数相差几档。开启自动 ISO 时，相机用 ISO 来补齐。'] }[S.mode];
      return { eb: 'Exposure Mode', h: d[0], term: 'mode-' + S.mode.toLowerCase(), body: `<p>${d[1]}</p>` + evFormula(X) };
    },
    metering(X) {
      const d = { eval: '把画面分区测量，对焦点附近和画面中央权重更高，并会压低极亮的灯光与天空。日常最省心。', center: '整个画面都参与，但越靠近中央权重越大，老式胶片机的经典方式，结果容易预判。', spot: '只测对焦点周围约 3% 的小圆（取景器里的小圆圈），完全不管其他地方。适合舞台、逆光、月亮。' }[S.metering];
      return { eb: 'Metering', h: { eval: '评价测光', center: '中央重点测光', spot: '点测光' }[S.metering], term: 'metering', body: `<p>${d}</p><dl class="kv"><dt>当前读数</dt><dd>EV ${fx(X.EVm, 2)}（ISO 100）</dd><dt>这一场景的基准</dt><dd>EV ${W.preset.ev}</dd></dl><p class="note">试试把对焦点移到暗处或亮处，点测光的读数会大幅变化。</p>` };
    },
    focal(X) {
      const hf = CL.deg(CL.fov(X.sen.w, X.focal)), df = CL.deg(CL.fov(X.si.diag, X.focal));
      return { eb: 'Focal Length', h: `焦距 ${X.focal} mm<small>等效 ${Math.round(X.focal * X.si.crop)} mm</small>`, term: 'focal-length',
        body: `<p>焦距决定视角：越长，看得越窄、放得越大。透视（远近物体的大小比例）只取决于<b>你站在哪里</b>，不取决于焦距——用下面的「机位」滑块后退、再拉长焦距，可以看到背景被「压缩」。</p><dl class="kv"><dt>水平视角</dt><dd>${fx(hf, 1)}°</dd><dt>对角视角</dt><dd>${fx(df, 1)}°</dd><dt>裁切系数</dt><dd>${fx(X.si.crop, 2)}</dd></dl>` };
    },
    focus(X) {
      const d = X.dof, m = CL.magnification(X.focal, S.focus * 1000);
      return { eb: 'Focus', h: `对焦距离 ${CL.fmtDist(S.focus * 1000)}`, term: 'dof',
        body: `<p>只有对焦平面上的点是锐利的。前后一段范围内的模糊小于「允许弥散圆」（${fx(X.coc * 1000, 0)} µm），看起来仍算清楚，这段范围就是<b>景深</b>。</p><dl class="kv"><dt>景深近界</dt><dd>${CL.fmtDist(d.near)}</dd><dt>景深远界</dt><dd>${CL.fmtDist(d.far)}</dd><dt>超焦距</dt><dd>${CL.fmtDist(d.H)}</dd><dt>放大倍率</dt><dd>${m >= 0.1 ? '1 : ' + fx(1 / m, 1) : fx(m, 3) + '×'}${X.lens.macro ? '（微距镜头在最近对焦时可达 1:1）' : ''}</dd></dl>${S.af === 'MF' ? '<p class="note">手动对焦时，画面中合焦的边缘会被<b>峰值对焦</b>描成红色。</p>' : ''}` };
    },
    af(X) {
      const d = { 'AF-S': '半按快门（或点画面）对焦一次后锁定。适合静物、风景、人像。', 'AF-C': '持续对焦，对焦点下的物体移动时相机会一直跟。适合运动、追焦，试试把对焦点放在路面上等骑车人经过。', MF: '转动对焦环自己对焦，配合峰值对焦（红色描边）和景深刻度。' }[S.af];
      return { eb: 'Autofocus', h: S.af === 'MF' ? '手动对焦 MF' : `自动对焦 ${S.af}`, term: 'af-mode', body: `<p>${d}</p><dl class="kv"><dt>当前对焦</dt><dd>${CL.fmtDist(S.focus * 1000)}${R.afSubject ? ' · ' + (SUBJ[R.afSubject] || R.afSubject) : ''}</dd><dt>最近对焦距离</dt><dd>${CL.fmtDist(X.lens.mfd * 1000)}</dd></dl>` };
    },
    wb(X) {
      const K = S.wb === 'auto' ? '自动' : S.wb === 'kelvin' ? S.K + ' K' : CL.WB_PRESETS.find((w) => w.id === S.wb).K + ' K';
      return { eb: 'White Balance', h: `白平衡 · ${CL.WB_PRESETS.find((w) => w.id === S.wb).name}`, term: 'wb',
        body: `<p>不同光源颜色不同：烛光约 1900K、钨丝灯 3200K、正午阳光 5500K、阴影 7000K 以上。白平衡告诉相机「什么颜色是白」，相机据此给红、蓝通道乘上增益。<b>设得比实际光源低</b>，画面偏蓝；设得高，画面偏暖。</p><dl class="kv"><dt>设定</dt><dd>${K}</dd><dt>场景主光</dt><dd>约 ${W.preset.K} K</dd><dt>通道增益</dt><dd>R ${fx(X.wb[0], 2)} · G ${fx(X.wb[1], 2)} · B ${fx(X.wb[2], 2)}</dd></dl>` };
    },
    style(X) { const s = X.style; return { eb: 'Picture Style', h: `照片风格 · ${s.name}`, term: 'picture-style', body: `<p>照片风格只影响机内生成的 JPEG：对比度、饱和度、锐化和黑白。RAW 文件保存的是传感器原始数据，后期可以重新选择。${s.mono === 2 ? '「红滤镜」模拟黑白胶片时代镜头前加红色滤镜：蓝天被压暗，云朵更突出。' : ''}</p><dl class="kv"><dt>对比度</dt><dd>${CL.fmtEV(s.contrast, 2)}</dd><dt>饱和度</dt><dd>${fx(s.sat, 2)}×</dd><dt>锐化</dt><dd>${fx(s.sharp, 2)}</dd></dl>` }; },
    sensor(X) {
      return { eb: 'Sensor Size', h: `传感器 · ${X.sen.name}`, term: 'sensor-size',
        body: `<p>同样的焦距，传感器越小，视角越窄（相当于裁掉了画面四周），所以有「等效焦距」。拍同样构图时，大传感器收集的总光量更多，噪点更低、背景更容易虚化。</p><dl class="kv"><dt>尺寸</dt><dd>${X.sen.w} × ${X.sen.h} mm（${X.sen.aspect}）</dd><dt>对角线</dt><dd>${fx(X.si.diag, 1)} mm</dd><dt>裁切系数</dt><dd>${fx(X.si.crop, 2)}</dd><dt>面积</dt><dd>${Math.round(X.si.area)} mm²（全画幅的 ${fx((X.si.area / 864) * 100, 0)}%）</dd><dt>像素</dt><dd>${X.si.pxW} × ${X.si.pxH} · 间距 ${fx(X.si.pitch, 1)} µm</dd></dl>` };
    },
    filter(X) {
      const f = X.filt;
      return { eb: 'Filter', h: f.name, term: f.id === 'cpl' ? 'cpl' : f.id === 'gnd' ? 'gnd' : 'nd',
        body: `<p>${f.id === 'none' ? '镜头前没有滤镜。白天想用慢门拍出丝滑的水流，就需要 ND 减光镜挡掉大部分光。' : f.id === 'cpl' ? '偏振镜只让一个振动方向的光通过：蓝天被压暗、饱和度提高，水面和玻璃上的反光减弱，同时损失约 1.5 档光。' : f.id === 'gnd' ? '上半部是灰色、下半部透明的渐变滤镜，专门压暗明亮的天空，让地面和天空同时曝光正确。' : `中性灰减光镜，均匀地挡掉光线而不改变颜色。${f.name} 的透过率 = 1/${Math.pow(2, f.stops)}，相当于减 ${f.stops} 档。`}</p>` +
          (f.stops ? `<div class="formula">无滤镜快门 ${CL.shLabel(X.s + f.stops * 3)} × 2<sup>${f.stops}</sup> → <em>${CL.shLabel(X.s)}</em></div>` : '') };
    },
    flash(X) {
      const gnd = CL.FLASH_GN * Math.sqrt(Math.pow(2, -S.flashPow) * (X.iso / 100));
      return { eb: 'Flash', h: '闪光灯', term: 'flash-sync',
        body: `<p>闪光只持续约 1/1000 秒，所以闪光照亮的部分几乎不受快门速度影响，只看<b>光圈、ISO、距离</b>。闪光指数 GN = 距离 × f 值；光照按距离平方衰减。</p><dl class="kv"><dt>有效闪光距离</dt><dd>${S.flash === 'manual' ? `GN ${fx(gnd, 0)} ÷ ${CL.apLabel(X.a)} = ${fx(gnd / X.N, 1)} m` : 'TTL：按下快门前预闪测光'}</dd><dt>同步速度</dt><dd>1/250${X.s < CL.SYNC_S ? (S.hss ? ' · 已开高速同步，输出降低' : ' · <b style="color:var(--warn)">当前快于同步速度，画面下方会出现黑边</b>') : ''}</dd><dt>同步方式</dt><dd>${S.rear ? '后帘：闪光在曝光结束时触发，拖影在物体后方' : '前帘：闪光在曝光开始时触发'}</dd></dl>` };
    },
    support(X) {
      return { eb: 'Stabilization', h: { hand: '手持拍摄', tripod: '三脚架', pan: '追焦（摇拍）' }[S.support], term: S.support === 'pan' ? 'panning' : 'stabilization',
        body: `<p>${S.support === 'tripod' ? '三脚架上相机完全不动，可以用任意长的快门；只有运动的物体会模糊。' : S.support === 'pan' ? '相机在曝光期间跟着骑车人转动：骑车人相对传感器静止而清晰，静止的背景反而被拉成横向流线。' : '手的抖动约为每秒 0.02 弧度量级。「安全快门 = 1/等效焦距」就是让手抖模糊小于允许弥散圆的经验值。机身防抖（IBIS）移动传感器抵消抖动，约能放宽 5 档。'}</p><dl class="kv"><dt>当前快门</dt><dd>${CL.shLabel(X.s)}</dd><dt>安全快门</dt><dd>1/${Math.round(X.focal * X.si.crop)}${X.ibisStops ? ' · 防抖 +5 档' : ''}</dd><dt>估计手抖</dt><dd>${fx(X.shakeMM * 1000, 0)} µm（允许 ${fx(X.coc * 1000, 0)} µm）</dd></dl>` };
    },
    lens(X) { const l = X.lens; return { eb: 'Lens', h: l.name, term: l.f0 === l.f1 ? 'prime-zoom' : 'max-aperture',
      body: `<p>${l.kind}。最大光圈 ${CL.apLabel(CL.lensMaxAp(l, l.f0))}${l.aW !== l.aT ? ` 到 ${CL.apLabel(l.aT)}（变焦时最大光圈随焦距变小，叫浮动光圈）` : ''}，最小光圈 ${CL.apLabel(l.aMax)}，最近对焦 ${CL.fmtDist(l.mfd * 1000)}，${l.blades} 片${l.round > 0.5 ? '圆形' : '直边'}光圈叶片。</p>${l.id === 'p50' ? '<p>直边叶片收小光圈后，焦外光斑会变成七边形，强光处还会出现 14 道星芒。</p>' : ''}` }; },
    preset(X) { const p = W.preset; return { eb: 'Light', h: p.name, term: 'light-quality', body: `<p>${p.desc}</p><dl class="kv"><dt>基准 EV</dt><dd>${p.ev}（ISO 100 下让平均亮度成为中灰）</dd><dt>主光色温</dt><dd>约 ${p.K} K</dd></dl>` + evFormula(X) }; },
    position(X) { return { eb: 'Perspective', h: '机位与透视', term: 'perspective', body: `<p>向后退再把焦距拉长，主体大小不变，但背景物体会显得更大、更靠近——这就是常说的「长焦压缩」，本质是距离改变了远近物体的大小比例。</p><dl class="kv"><dt>到自行车距离</dt><dd>${CL.fmtDist(camPos().distanceTo(W.bicycle.position) * 1000)}</dd><dt>到钟楼距离</dt><dd>${CL.fmtDist(camPos().distanceTo(new THREE.Vector3(-34, 30, -240)) * 1000)}</dd><dt>机位高度</dt><dd>${S.low ? '0.6 m（低机位）' : '1.6 m（眼平）'}</dd></dl>` }; },
    nr(X) { return { eb: 'Noise Reduction', h: '高 ISO 降噪', term: 'noise', body: `<p>降噪把相邻像素平均，压掉彩色噪点和颗粒，同时也抹掉细节。「强」降噪在高 ISO 下更干净，但画面会发糊。RAW 文件不受机内降噪影响。</p>` }; },
    zebra(X) { return { eb: 'Zebra', h: '斑马纹', term: 'zebra', body: '<p>画面中接近或达到最亮值（即将溢出）的区域会叠加滚动的斜纹，提示你降低曝光。拍视频时尤其常用。</p>' }; },
    histogram(X) { return { eb: 'Histogram', h: '直方图', term: 'histogram', body: '<p>横轴是亮度（左黑右白），纵轴是像素数量。堆在右边缘说明高光溢出（右侧亮起红条），堆在左边缘说明暗部死黑（左侧亮起蓝条）。直方图没有「标准形状」，只看两端有没有被截断。</p>' }; },
    lensCorr(X) { return { eb: 'Lens Correction', h: '镜头校正', term: 'vignetting', body: `<p>相机按镜头的配置文件修正暗角（四角变暗）和畸变（直线弯曲）。关掉它，用 14mm 拍楼房边缘会看到桶形畸变，大光圈时四角明显变暗。</p><dl class="kv"><dt>当前畸变</dt><dd>${fx(CL.lensDistortion(X.lens, X.focal) * 100, 1)}%（${CL.lensDistortion(X.lens, X.focal) < 0 ? '桶形' : '枕形'}）</dd></dl>` }; },
    ael(X) { return { eb: 'AE Lock', h: '曝光锁定 AE-L', term: 'ae-lock', body: `<p>${S.ael ? `已锁定在 EV ${fx(S.aelEV, 2)}。` : ''}先对准想要正确曝光的地方测光并锁定，再重新构图，曝光不再随画面变化。</p>` }; },
  };
  function renderTopic() {
    const X = compute();
    const f = TOPICS[R.topic] || TOPICS.aperture;
    const c = f(X);
    $('explain').innerHTML = `<div class="eb">${c.eb}</div><h2>${c.h}</h2>${c.body}${c.term && CL.TERM_BY_ID[c.term] ? `<button class="more" data-term="${c.term}">在词典中查看「${CL.TERM_BY_ID[c.term].zh}」→</button>` : ''}`;
  }
  $('explain').addEventListener('click', (e) => { const b = e.target.closest('[data-term]'); if (b) openTerm(b.dataset.term); });

  /* ================= 景深图与光圈叶片 ================= */
  const dofCv = $('dofCanvas'), dctx = dofCv.getContext('2d');
  const OBJ = [
    ['风车', () => W.pinwheel.getWorldPosition(new THREE.Vector3())], ['色卡', () => W.chart.getWorldPosition(new THREE.Vector3())],
    ['自行车', () => W.bicycle.position.clone().add(new THREE.Vector3(0, 0.6, 0))], ['咖啡座', () => new THREE.Vector3(3.1, 0.8, -7.6)],
    ['灯篱', () => new THREE.Vector3(2.4, 0.55, -8.85)], ['喷泉', () => new THREE.Vector3(-3.9, 1.6, -12.2)], ['骑车人', () => new THREE.Vector3(0, 1.2, -14.75)],
    ['楼房', () => new THREE.Vector3(0, 6, -26)], ['钟楼', () => new THREE.Vector3(-34, 40, -240)],
  ];
  function drawDOF(X) {
    const w = dofCv.width, h = dofCv.height, c = dctx;
    c.clearRect(0, 0, w, h);
    const L0 = Math.log10(0.2), L1 = Math.log10(1000), x0 = 22, x1 = w - 60, xInf = w - 26;
    const xm = (m) => (!isFinite(m) || m > 1000 ? xInf : x0 + ((Math.log10(Math.max(m, 0.2)) - L0) / (L1 - L0)) * (x1 - x0));
    const axisY = 120;
    const d = X.dof, near = d.near / 1000, far = d.far / 1000;
    c.fillStyle = 'rgba(224,178,92,.16)'; c.fillRect(xm(near), 18, Math.max(2, xm(far) - xm(near)), axisY - 18);
    c.fillStyle = 'rgba(224,178,92,.9)'; c.fillRect(xm(near), axisY - 3, Math.max(2, xm(far) - xm(near)), 3);
    c.strokeStyle = '#e0b25c'; c.lineWidth = 2; c.beginPath(); c.moveTo(xm(S.focus), 14); c.lineTo(xm(S.focus), axisY); c.stroke();
    c.strokeStyle = '#737980'; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, axisY); c.lineTo(xInf + 10, axisY); c.stroke();
    c.font = '600 19px "Barlow Condensed", sans-serif'; c.textAlign = 'center'; c.fillStyle = '#a8acb1';
    [0.3, 0.5, 1, 2, 3, 5, 10, 20, 50, 100, 300, 1000].forEach((m) => { const X_ = xm(m); c.fillRect(X_, axisY, 1, 7); c.fillText(m >= 1 ? String(m) : String(m), X_, axisY + 26); });
    c.fillText('∞', xInf, axisY + 26); c.fillRect(xInf, axisY, 1, 7);
    c.fillText('m', x0 - 6, axisY + 26);
    const H = d.H / 1000;
    if (H < 1000) { c.fillStyle = '#6fb6ff'; c.fillRect(xm(H) - 1, axisY + 2, 2, 12); c.font = '600 16px "Barlow Condensed", sans-serif'; c.fillText('H', xm(H), axisY + 44); }
    const pos = camPos(), fwd = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(S.pitch, baseYaw(R.time), 0, 'YXZ'));
    const pts = OBJ.map(([n, f]) => { const p = f(); const v = p.clone().sub(pos); const z = v.dot(fwd); return { n, z, inView: z > 0 }; }).filter((o) => o.z > 0.05);
    pts.push({ n: '月亮', z: Infinity });
    pts.sort((a, b) => a.z - b.z);
    c.font = '500 16px "Noto Sans SC", sans-serif';
    let row = 0, lastX = -999;
    pts.forEach((o) => {
      const X_ = xm(o.z);
      const cocmm = CL.coc(X.focal, X.N, S.focus * 1000, o.z * 1000);
      const inDof = o.z * 1000 >= d.near && o.z * 1000 <= d.far;
      const rpx = clamp((cocmm / X.sen.w) * 600, 1.5, 26);
      c.fillStyle = inDof ? 'rgba(120,214,144,.9)' : 'rgba(236,231,220,.35)';
      c.beginPath(); c.arc(X_, axisY - 30 - row * 0, Math.min(rpx, 26), 0, 7); c.fill();
      row = X_ - lastX < 46 ? (row + 1) % 3 : 0; lastX = X_;
      c.fillStyle = inDof ? '#78d690' : '#a8acb1'; c.textAlign = 'center';
      c.fillText(o.n, X_, 16 + row * 18 + (row ? 0 : 0));
    });
    c.textAlign = 'left'; c.fillStyle = '#737980'; c.font = '500 15px "Noto Sans SC", sans-serif';
    c.fillText('圆点大小 = 该距离处的模糊（弥散圆）', x0, h - 8);
  }
  const irisCv = $('irisCanvas'), ictx = irisCv.getContext('2d');
  function drawIris(X) {
    const c = ictx, w = irisCv.width, R0 = w * 0.46, cx = w / 2, cy = w / 2;
    c.clearRect(0, 0, w, w);
    const g = c.createRadialGradient(cx, cy, R0 * 0.2, cx, cy, R0); g.addColorStop(0, '#2b2f34'); g.addColorStop(1, '#16181b');
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R0, 0, 7); c.fill();
    const n = X.lens.blades, ratio = CL.N(X.aMin) / X.N, r = R0 * 0.92 * ratio;
    const round = X.a === X.aMin ? 1 : X.lens.round;
    const lg = c.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r * 1.2); lg.addColorStop(0, '#fff6dc'); lg.addColorStop(1, '#c9a764');
    c.fillStyle = lg; c.beginPath();
    const steps = 180;
    for (let k = 0; k <= steps; k++) {
      const a = (k / steps) * Math.PI * 2, seg = (Math.PI * 2) / n, x = ((a - 0.3) % seg + seg) % seg - seg / 2;
      const rr = r * (round + (1 - round) * (Math.cos(Math.PI / n) / Math.cos(x)));
      const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
      k ? c.lineTo(px, py) : c.moveTo(px, py);
    }
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 1;
    for (let k = 0; k < n; k++) { const a = 0.3 + (k / n) * Math.PI * 2; const vx = cx + Math.cos(a) * r, vy = cy + Math.sin(a) * r; c.beginPath(); c.moveTo(vx, vy); c.lineTo(vx + Math.cos(a + 1.25) * R0 * 1.1, vy + Math.sin(a + 1.25) * R0 * 1.1); c.stroke(); }
    c.save(); c.beginPath(); c.arc(cx, cy, R0, 0, 7); c.lineWidth = 6; c.strokeStyle = '#3b4148'; c.stroke(); c.restore();
    const rel = Math.pow(X.N / CL.N(X.aMin), 2);
    $('irisNote').innerHTML = `<b>${CL.apLabel(X.a)}</b> · ${n} 片${X.lens.round > 0.5 ? '圆形' : '直边'}叶片<br>入瞳直径 ${(X.focal / X.N).toFixed(1)} mm<br>通光量是最大光圈的 1/${rel < 10 ? rel.toFixed(1) : Math.round(rel)}`;
  }

  /* ================= 取景器尺寸 ================= */
  let cssW = 0, cssH = 0;
  function resize() {
    const X = compute();
    vf.style.setProperty('--vf-aspect', X.aspect.toFixed(4));
    const r = vf.getBoundingClientRect();
    cssW = r.width; cssH = r.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setSize(Math.round(cssW * dpr), Math.round(cssH * dpr), false);
    applyScale();
  }
  function applyScale() {
    const X = compute();
    const base = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = Math.round(cssW * base * R.scale);
    w = clamp(w, 320, 1400);
    P.setLiveSize(w, Math.round(w / X.aspect));
  }
  new ResizeObserver(() => resize()).observe(vf);

  /* ================= 取景器交互 ================= */
  let drag = null;
  vf.addEventListener('pointerdown', (e) => { if (R.busy) return; drag = { x: e.clientX, y: e.clientY, yaw: S.yaw, pitch: S.pitch, pan: S.panOff, moved: false }; vf.setPointerCapture(e.pointerId); audio(); });
  vf.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 5) { drag.moved = true; vf.classList.add('drag'); $('vfHint').style.opacity = 0; }
    if (!drag.moved) return;
    const vfov = (cam.fov * Math.PI) / 180, hfov = 2 * Math.atan(Math.tan(vfov / 2) * cam.aspect);
    if (S.support === 'pan') S.panOff = clamp(drag.pan + (dx / cssW) * hfov, -0.6, 0.6);
    else S.yaw = clamp(drag.yaw + (dx / cssW) * hfov, -1.6, 1.6);
    S.pitch = clamp(drag.pitch + (dy / cssH) * vfov, -1.0, 1.2);
  });
  vf.addEventListener('pointerup', (e) => {
    if (!drag) return;
    vf.classList.remove('drag');
    if (!drag.moved) {
      const r = vf.getBoundingClientRect();
      S.afX = clamp((e.clientX - r.left) / r.width, 0.04, 0.96); S.afY = clamp((e.clientY - r.top) / r.height, 0.05, 0.95);
      if (S.af === 'AF-S') startAF();
      topic(S.metering === 'spot' ? 'metering' : 'af');
    }
    drag = null;
  });
  vf.addEventListener('wheel', (e) => {
    const l = lensOf(); if (l.f0 === l.f1) return;
    e.preventDefault();
    S.focal = clamp(Math.round(S.focal * (e.deltaY > 0 ? 1 / 1.05 : 1.05)), l.f0, l.f1);
    topic('focal'); syncUI();
  }, { passive: false });

  const btnShutter = $('btnShutter');
  let halfAt = 0;
  btnShutter.addEventListener('pointerdown', (e) => { e.preventDefault(); audio(); halfAt = performance.now(); btnShutter.classList.add('half'); if (S.af === 'AF-S') startAF(); });
  btnShutter.addEventListener('pointerup', () => { btnShutter.classList.remove('half'); release(); });
  btnShutter.addEventListener('pointerleave', () => btnShutter.classList.remove('half'));
  btnShutter.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); if (!e.repeat) { if (S.af === 'AF-S') startAF(); release(); } } });
  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input,select,textarea,[role=slider],button')) return;
    if (currentTab !== 'shoot' || !$('playback').hidden) return;
    if (e.key === ' ') { e.preventDefault(); if (!e.repeat) { if (S.af === 'AF-S') startAF(); release(); } }
    if (e.key === 'f' || e.key === 'F') startAF();
  });
  async function release() {
    if (R.busy) return;
    if (S.af === 'AF-S' && R.afState === 'busy') { const t0 = performance.now(); while (R.afState === 'busy' && performance.now() - t0 < 900) await new Promise((r) => setTimeout(r, 30)); }
    void halfAt;
    shoot();
  }

  /* ================= 拍摄 ================= */
  async function shoot() {
    const X = compute();
    R.busy = true;
    const t = X.t;
    const aspect = X.aspect;
    const Wc = CL.CAPTURE_W || 1500, Hc = Math.round(Wc / aspect);
    const t0 = R.time;
    const seedA = Math.random() * 6.283;
    const pxPerRad = (X.focal / X.sen.w) * Wc;
    const motionPx = 1.0 * pxPerRad * t;
    const shakePx = X.omega * t * pxPerRad;
    let K = Math.ceil(Math.max(t * 300, motionPx / 1.6, shakePx / 1.2, 1));
    K = clamp(K, 1, 480);
    if (t < 1 / 3000) K = Math.min(K, 2);
    const plan = {
      w: Wc, h: Hc, K, t, t0, batch: K > 160 ? 8 : 5, budget: 600,
      pose: (c, frac) => {
        const tau = frac * t;
        let ey = 0, ep = 0;
        if (X.omega > 0) { const sh = shakeAt(tau, seedA); ey = sh[0] * X.omega; ep = sh[1] * X.omega; }
        poseCam(X, t0 + tau, ey, ep);
      },
    };
    // 闪光
    let flashInfo = null;
    if (S.flash !== 'off') {
      const tSync = CL.T(CL.SYNC_S);
      const M_unit = Math.pow(CL.FLASH_GN / X.N, 2) * (X.iso / 100) * Math.pow(2, -X.fStops);
      let pow = Math.pow(2, -S.flashPow), mask = 1, eff = 1;
      if (t < tSync) { if (S.hss) eff = (t / tSync) * 0.5; else mask = t / tSync; }
      if (S.flash === 'ttl') {
        poseCam(X, t0, 0, 0);
        W.update(t0);
        W.setFlashOnly(true, cam.localToWorld(new THREE.Vector3(0, 0.12, 0)));
        P.renderSceneOnly(cam);
        const fg = P.meter(1, 0);
        W.setFlashOnly(false);
        const amb = R.meterGrid;
        const wts = meterWeights('spot', fg.w, fg.h), wc = meterWeights('center', fg.w, fg.h);
        let sw = 0, sf = 0, sa = 0;
        const ambK = Math.pow(2, W.preset.ev - X.EVcam);
        for (let k = 0; k < fg.w * fg.h; k++) {
          const wt = wts[k] * 3 + wc[k];
          const F = 0.2126 * fg.rgb[k * 3] + 0.7152 * fg.rgb[k * 3 + 1] + 0.0722 * fg.rgb[k * 3 + 2];
          const A = amb ? (0.2126 * amb.rgb[k * 3] + 0.7152 * amb.rgb[k * 3 + 1] + 0.0722 * amb.rgb[k * 3 + 2]) * ambK : 0;
          sw += wt; sf += wt * Math.min(F, 50) * M_unit * eff; sa += wt * Math.min(A, 8);
        }
        const Xf = sf / sw, Xa = sa / sw, target = 0.18 * Math.pow(2, S.flashComp / 3);
        const need = Xa > 0.6 * target ? 0.5 * target : target - Xa;
        pow = clamp(need / Math.max(Xf, 1e-6), 1 / 256, 1);
      }
      // 累加缓冲区是「场景单位」，后期会再乘上 预设增益 × 滤镜透过率 × 2^(EV基准 − EV相机)。
      // 滤镜同样挡住闪光，所以这里只除掉预设增益和曝光倍数。
      const ambGain = R.presetGain * Math.pow(2, W.preset.ev - X.EVcam);
      plan.flash = { at: S.rear ? 'rear' : 'front', w: (Math.pow(CL.FLASH_GN / X.N, 2) * (X.iso / 100) * pow * eff) / ambGain, mask, pos: (c) => c.localToWorld(new THREE.Vector3(0, 0.12, 0)) };
      flashInfo = { pow, mask, eff, ttl: S.flash === 'ttl' };
    }
    // 取景器黑屏、快门声
    const black = $('vfBlack'), busyEl = $('vfBusy'), arc = $('busyArc');
    clack(0, 0.35);
    black.classList.add('on');
    const long = t >= 0.5 || K > 60;
    if (long) { busyEl.hidden = false; $('busyText').textContent = t >= 1 ? `曝光中 · ${CL.shLabel(X.s)}` : '曝光中'; }
    const o = postOpts(X, false, 0);
    o.seed = Math.random() * 1000;
    const res = await P.capture(cam, o, plan, (p) => { arc.style.strokeDashoffset = String(169.6 * (1 - p)); if (t >= 1) $('busyText').textContent = `曝光中 · 剩余 ${Math.max(0, t * (1 - p)).toFixed(t >= 10 ? 0 : 1)}″`; });
    clack(0, 0.3);
    // 记录拍摄瞬间（曝光中点）的机位，用于事后分析
    plan.pose(cam, 0.5);
    const camSnap = cam.clone();
    W.update(R.time);
    black.classList.remove('on'); busyEl.hidden = true; arc.style.strokeDashoffset = '169.6';
    const photo = analyze(res, X, camSnap, flashInfo, K);
    R.photos.unshift(photo);
    if (R.photos.length > 16) R.photos.pop();
    renderRoll();
    R.busy = false;
    openPlayback(photo);
  }

  function postOpts(X, live, time) {
    const l = X.lens;
    const wideOpen = clamp(1 - (X.a - X.aMin) / 7, 0, 1);
    let vig = l.vig * 0.55 * wideOpen + 0.22 * clamp(24 / X.focal, 0, 1.7);
    if (S.lensCorr) vig *= 0.25;
    const dist = CL.lensDistortion(l, X.focal) * (S.lensCorr ? 0.08 : 1);
    const airyPx = ((CL.airy(X.N) / 1000) / X.sen.w) * 1200;
    const nrBlur = { off: 0, std: 0.25, high: 0.7 }[S.nr] * clamp((X.i - 9) / 12, 0, 1);
    const Qpix = 26000 * (X.si.area / 864) * (960000 / (P.liveSize()[0] * P.liveSize()[1] || 960000));
    const g = X.iso / 100;
    return {
      focal: X.focal, N: X.N, focus: S.focus, sensorW: X.sen.w, aspect: X.aspect,
      minBlur: Math.max(0, airyPx * 0.45 - 0.25) + nrBlur,
      blades: l.blades, round: X.a === X.aMin ? 1 : l.round, bladeRot: 0.3,
      gain: X.gain, gnd: X.filt.gnd || 0, cpl: X.filt.id === 'cpl', vig, dist,
      wb: X.wb, ePerX: (Qpix / Math.max(g, 0.5)) / CL.CLIP, readE: 2.5, noise: true,
      nr: { off: 0, std: 0.45, high: 0.9 }[S.nr], sharp: X.style.sharp * (S.nr === 'high' && X.i > 12 ? 0.4 : 1), style: X.style,
      zebra: live && S.zebra, peak: live && S.af === 'MF' && S.peak, time, seed: live ? Math.random() * 1000 : 0,
      budget: live ? 160 : 600, canvasW: canvas.width, canvasH: canvas.height,
    };
  }

  /* ================= 照片分析与点评 ================= */
  function project(p, c, w, h) {
    const v = p.clone().project(c);
    const inFront = p.clone().applyMatrix4(c.matrixWorldInverse).z < 0;
    return { x: (v.x * 0.5 + 0.5) * w, y: (1 - (v.y * 0.5 + 0.5)) * h, ok: inFront && Math.abs(v.x) < 0.98 && Math.abs(v.y) < 0.98, ndc: v };
  }
  function sampleAvg(px, w, h, x, y, r) {
    let s = [0, 0, 0], n = 0;
    for (let yy = Math.round(y - r); yy <= y + r; yy++) for (let xx = Math.round(x - r); xx <= x + r; xx++) {
      if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
      const k = (yy * w + xx) * 4; s[0] += px[k]; s[1] += px[k + 1]; s[2] += px[k + 2]; n++;
    }
    return n ? s.map((v) => v / n) : null;
  }
  function visibleFrom(c, p, subject) {
    const dir = p.clone().sub(c.position).normalize();
    ray.set(c.position, dir);
    const hits = ray.intersectObjects(W.pickables, false);
    return hits.length && W.subjectOf(hits[0].object) === subject;
  }
  function analyze(res, X, c, flashInfo, K) {
    const H = histogram(res.hist.data, res.hist.w, res.hist.h);
    const pw = res.w, ph = res.h;
    let meanL = 0; { const d = res.hist.data; for (let k = 0; k < res.hist.w * res.hist.h; k++) meanL += 0.2126 * d[k * 4] + 0.7152 * d[k * 4 + 1] + 0.0722 * d[k * 4 + 2]; meanL /= res.hist.w * res.hist.h; }
    const subj = R.afSubject && S.af !== 'MF' ? R.afSubject : (pickAt(S.afX, S.afY) || {}).subject;
    const focusM = S.focus;
    const d = X.dof;
    const info = {
      X, S: JSON.parse(JSON.stringify(S)), preset: W.preset, cam: c, flash: flashInfo, K, H, meanL, subj, focusM,
      url: res.canvas.toDataURL('image/jpeg', 0.92), canvas: res.canvas, pixels: res.pixels, w: pw, h: ph,
      time: new Date(),
    };
    const crit = [];
    const brighter = X.EVm - X.EVcam;
    // 曝光
    if (H.hi > 0.04) crit.push(['bad', `<b>高光溢出 ${(H.hi * 100).toFixed(1)}%</b>：这些像素已经纯白、没有细节。减少曝光，或用渐变灰压暗天空。`]);
    else if (H.hi > 0.008) crit.push(['warn', `有 ${(H.hi * 100).toFixed(1)}% 的像素溢出（多半是灯泡、太阳等光源，可以接受）。`]);
    if (X.blink.a || X.blink.s || X.blink.i) crit.push(['bad', `<b>超出了相机能自动补偿的范围</b>：${X.blink.s ? `快门已到 ${CL.shLabel(X.s)} 的极限` : X.blink.a ? `光圈已到 ${CL.apLabel(X.a)} 的极限` : `ISO 已到 ${CL.isoLabel(X.i)} 的极限`}，照片比测光读数${brighter > 0 ? '亮' : '暗'}了 ${Math.abs(brighter).toFixed(1)} 档。${brighter > 0 ? '收小光圈、降低 ISO 或加 ND 减光镜' : '开大光圈、放慢快门或提高 ISO'}。`]);
    else if (S.mode === 'M' && Math.abs(brighter) >= 0.7) crit.push(['warn', `M 档下比测光读数${brighter > 0 ? '亮' : '暗'} ${Math.abs(brighter).toFixed(1)} 档。`]);
    if (H.lo > 0.3) crit.push(['warn', `<b>${(H.lo * 100).toFixed(0)}% 的像素接近纯黑</b>，暗部细节丢失。`]);
    if (meanL < 50 && H.hi < 0.01) crit.push(['warn', `整体偏暗（平均亮度 ${Math.round(meanL)}/255）。和测光读数相比，这张照片少了 ${Math.abs(brighter).toFixed(1)} 档。`]);
    else if (meanL > 175) crit.push(['warn', `整体偏亮（平均亮度 ${Math.round(meanL)}/255），比测光读数多了 ${brighter.toFixed(1)} 档。`]);
    else if (Math.abs(brighter) < 0.4 && H.hi < 0.01) crit.push(['good', '曝光与测光读数一致，直方图两端都没有被截断。']);
    // 手抖
    if (X.omega > 0) {
      const blurPx = (X.shakeMM / X.sen.w) * pw;
      if (X.shakeMM > X.coc * 1.5) crit.push(['bad', `<b>手抖模糊</b>：${CL.shLabel(X.s)} 慢于安全快门 1/${Math.round(X.focal * X.si.crop)}${X.ibisStops ? '（已算上防抖）' : ''}，整张照片大约被拖动了 ${blurPx.toFixed(0)} 像素。用三脚架、打开防抖或提高快门速度。`]);
      else if (X.shakeMM > X.coc * 0.7) crit.push(['warn', `手抖接近容许极限（约 ${blurPx.toFixed(1)} 像素），放大看会略软。`]);
    }
    // 对焦与景深
    if (subj) {
      const inDof = focusM * 1000 >= d.near - 1 && focusM * 1000 <= d.far + 1;
      crit.push([inDof ? 'good' : 'warn', `对焦在 <b>${SUBJ[subj] || subj}</b>（${CL.fmtDist(focusM * 1000)}）。景深 ${CL.fmtDist(d.near)} – ${CL.fmtDist(d.far)}。`]);
    }
    if (R.afState === 'fail' && S.af !== 'MF') crit.push(['bad', '拍摄时没有合焦：' + (R.afFail || '对焦失败')]);
    // 运动
    if (X.t >= 1 / 60) {
      const deg = 360 * 2.4 * X.t;
      crit.push(['note', `快门 ${CL.shLabel(X.s)} 期间风车转了 ${deg > 720 ? Math.round(deg / 360) + ' 圈' : Math.round(deg) + '°'}，骑车人移动了 ${(W.riderSpeed * X.t).toFixed(2)} m${X.t >= 1 ? '，车灯会拉成光轨' : ''}。`]);
    } else if (X.t <= 1 / 1000) crit.push(['note', `${CL.shLabel(X.s)} 足以冻结风车（叶尖只转过 ${(360 * 2.4 * X.t).toFixed(1)}°）。`]);
    // 噪点
    if (X.i >= 18) crit.push([X.i >= 24 ? 'bad' : 'warn', `ISO ${CL.isoLabel(X.i)}：中灰处每像素只收到约 ${Math.round((26000 * (X.si.area / 864) / (X.iso / 100)) * 0.18 / CL.CLIP)} 个光子，颗粒与彩色噪点明显。`]);
    // 衍射
    if (CL.airy(X.N) > 3 * X.si.pitch) crit.push(['warn', `${CL.apLabel(X.a)} 的艾里斑 ${CL.airy(X.N).toFixed(1)} µm，已是像素间距的 ${(CL.airy(X.N) / X.si.pitch).toFixed(1)} 倍，衍射让细节变软。风光常用 f/8–f/11。`]);
    // 闪光
    if (flashInfo) {
      if (flashInfo.mask < 1) crit.push(['bad', `快门 ${CL.shLabel(X.s)} 快于闪光同步速度 1/250：闪光时第二帘幕已经挡住了画面一部分，下方 ${Math.round((1 - flashInfo.mask) * 100)}% 没有被闪光照到。开启高速同步或放慢快门。`]);
      crit.push(['note', `闪光输出 1/${Math.round(1 / flashInfo.pow)}${flashInfo.ttl ? '（TTL 预闪测光决定）' : ''}${flashInfo.eff < 1 ? '，高速同步损失约 ' + Math.log2(1 / flashInfo.eff).toFixed(1) + ' 档' : ''}。`]);
    }
    // 白平衡：灰卡
    const gp = W.chart.localToWorld(W.grayPatchLocal.clone());
    const pr = project(gp, c, pw, ph);
    if (pr.ok && visibleFrom(c, gp, 'chart')) {
      const s = sampleAvg(res.pixels, pw, ph, pr.x, pr.y, 2);
      if (s && s[1] > 12) {
        const rg = s[0] / s[1], bg = s[2] / s[1];
        info.gray = { rg, bg, s };
        const cast = rg - bg;
        if (Math.abs(rg - 1) < 0.07 && Math.abs(bg - 1) < 0.07) crit.push(['good', `色卡第 22 格（中灰）读数 R${Math.round(s[0])} G${Math.round(s[1])} B${Math.round(s[2])}，白平衡准确。`]);
        else crit.push(['warn', `色卡中灰读数 R${Math.round(s[0])} G${Math.round(s[1])} B${Math.round(s[2])}，${cast > 0 ? '偏暖（红黄）——把色温设低一些' : '偏冷（蓝）——把色温设高一些'}。`]);
      }
    }
    // 月亮
    const mp = project(W.moon.position, c, pw, ph);
    const rpx = Math.atan(10.9 / 2400) * (X.focal / X.sen.w) * pw;
    if (W.moon.visible && mp.ok && rpx >= 4 && visibleFrom(c, W.moon.position, 'moon')) {
      const s = sampleAvg(res.pixels, pw, ph, mp.x, mp.y, Math.max(1, rpx * 0.5));
      if (s) { info.moon = { L: (s[0] + s[1] + s[2]) / 3, rpx }; crit.push([info.moon.L > 245 ? 'warn' : 'note', `月亮直径约 ${Math.round(rpx * 2)} 像素，平均亮度 ${Math.round(info.moon.L)}/255${info.moon.L > 245 ? '：过曝成白色圆盘。月面是被太阳照亮的，按 Looney 11 法则：f/11、快门 1/ISO' : ''}。`]); }
    }
    info.crit = crit;
    // 练习任务
    if (R.task) {
      const T = TASKS.find((x) => x.id === R.task);
      const r = T.check(info);
      info.taskRes = { id: T.id, ok: r.ok, msg: r.msg };
      if (r.ok) { const done = LS.get('done', {}); done[T.id] = true; LS.set('done', done); toast('任务完成：' + T.title, true); renderTasks(); renderTaskbar(); }
    }
    return info;
  }

  /* ================= 回放 ================= */
  const pb = $('playback'), pbView = $('pbView');
  let pbPhoto = null;
  function openPlayback(ph) {
    pbPhoto = ph;
    pbView.innerHTML = ''; pbView.classList.remove('zoom'); $('pbZoom').setAttribute('aria-pressed', 'false'); $('pbBlink').setAttribute('aria-pressed', 'false');
    pbView.appendChild(ph.canvas);
    const X = ph.X;
    $('pbTitle').textContent = `${ph.preset.name} · ${ph.time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    const stamp = ph.time.toISOString().slice(0, 19).replace(/[-:T]/g, '');
    $('pbSave').href = ph.url; $('pbSave').download = `camlab_${stamp}.jpg`;
    const ex = [
      ['机身', `${X.sen.name} · ${X.sen.mp} MP`], ['镜头', X.lens.name], ['焦距', `${X.focal} mm${Math.abs(X.si.crop - 1) > 0.05 ? `（等效 ${Math.round(X.focal * X.si.crop)} mm）` : ''}`],
      ['曝光模式', { P: '程序自动', A: '光圈优先', S: '快门优先', M: '手动' }[ph.S.mode]], ['光圈', CL.apLabel(X.a)], ['快门', CL.shLabel(X.s) + ' 秒'], ['ISO', CL.isoLabel(X.i) + (ph.S.autoISO ? '（自动）' : '')],
      ['曝光补偿', CL.compLabel(ph.S.comp) + ' EV'], ['EV（ISO 100）', X.EVcam.toFixed(2)], ['测光', { eval: '评价', center: '中央重点', spot: '点测光' }[ph.S.metering] + ` · 读数 EV ${X.EVm.toFixed(2)}`],
      ['对焦', `${ph.S.af} · ${CL.fmtDist(ph.focusM * 1000)}`], ['景深', `${CL.fmtDist(X.dof.near)} – ${CL.fmtDist(X.dof.far)}`],
      ['白平衡', ph.S.wb === 'kelvin' ? ph.S.K + ' K' : CL.WB_PRESETS.find((w) => w.id === ph.S.wb).name], ['照片风格', X.style.name], ['滤镜', X.filt.name],
      ['闪光', ph.flash ? (ph.flash.ttl ? 'TTL ' : '手动 ') + '1/' + Math.round(1 / ph.flash.pow) + (ph.S.rear ? ' · 后帘' : '') : '未闪光'],
      ['持机', { hand: '手持', tripod: '三脚架', pan: '追焦' }[ph.S.support] + (ph.S.ibis && ph.S.support !== 'tripod' ? ' · 防抖开' : '')], ['子帧', `${ph.K} 帧积分`],
    ];
    $('pbExif').innerHTML = ex.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('');
    const items = ph.crit.map(([c, t]) => `<li class="${c}">${t}</li>`);
    if (ph.taskRes) items.unshift(`<li class="task">${ph.taskRes.ok ? '✓ 任务完成：' : '任务未完成：'}${ph.taskRes.msg}</li>`);
    $('pbCrit').innerHTML = items.join('');
    const hc = $('pbHist');
    drawHist(hc.getContext('2d'), ph.H, hc.width, hc.height, true);
    pb.hidden = false;
    $('pbClose').focus();
  }
  function closePlayback() { pb.hidden = true; pbPhoto = null; btnShutter.focus({ preventScroll: true }); }
  $('pbClose').addEventListener('click', closePlayback);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pb.hidden) closePlayback(); });
  $('pbZoom').addEventListener('click', () => { const z = !pbView.classList.contains('zoom'); pbView.classList.toggle('zoom', z); $('pbZoom').setAttribute('aria-pressed', String(z)); if (z) { pbView.scrollLeft = (pbPhoto.w - pbView.clientWidth) / 2; pbView.scrollTop = (pbPhoto.h - pbView.clientHeight) / 2; } });
  pbView.addEventListener('click', () => { if (!pbView.classList.contains('zoom')) $('pbZoom').click(); });
  let pbDrag = null;
  pbView.addEventListener('pointerdown', (e) => { if (pbView.classList.contains('zoom')) { pbDrag = { x: e.clientX, y: e.clientY, l: pbView.scrollLeft, t: pbView.scrollTop }; } });
  pbView.addEventListener('pointermove', (e) => { if (pbDrag) { pbView.scrollLeft = pbDrag.l - (e.clientX - pbDrag.x); pbView.scrollTop = pbDrag.t - (e.clientY - pbDrag.y); } });
  window.addEventListener('pointerup', () => (pbDrag = null));
  pbView.style.overflow = 'auto';
  $('pbBlink').addEventListener('click', () => {
    const on = $('pbBlink').getAttribute('aria-pressed') !== 'true';
    $('pbBlink').setAttribute('aria-pressed', String(on));
    const old = pbView.querySelector('.pb-blink'); if (old) old.remove();
    if (!on || !pbPhoto) return;
    const cv = document.createElement('canvas'); cv.width = pbPhoto.w; cv.height = pbPhoto.h; cv.className = 'pb-blink';
    const g = cv.getContext('2d'), img = g.createImageData(pbPhoto.w, pbPhoto.h), px = pbPhoto.pixels;
    for (let k = 0; k < px.length; k += 4) if (px[k] >= 253 && px[k + 1] >= 253 && px[k + 2] >= 253) { img.data[k] = 255; img.data[k + 1] = 0; img.data[k + 2] = 40; img.data[k + 3] = 255; }
    g.putImageData(img, 0, 0);
    const r = pbPhoto.canvas.getBoundingClientRect(), pr = pbView.getBoundingClientRect();
    Object.assign(cv.style, { left: r.left - pr.left + pbView.scrollLeft + 'px', top: r.top - pr.top + pbView.scrollTop + 'px', width: r.width + 'px', height: r.height + 'px' });
    pbView.appendChild(cv);
  });
  function renderRoll() {
    const el = $('roll');
    if (!R.photos.length) return;
    el.innerHTML = R.photos.map((p, k) => `<button data-k="${k}" aria-label="查看第 ${R.photos.length - k} 张"><img src="${p.url}" alt=""><span>${CL.shLabel(p.X.s)} F${CL.apNum(p.X.a)} ISO${CL.isoLabel(p.X.i)}</span></button>`).join('');
  }
  $('roll').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) openPlayback(R.photos[+b.dataset.k]); });

  /* ================= 练习任务 ================= */
  const inView = (ph, p, m) => { const r = project(p, ph.cam, ph.w, ph.h); return r.ok && Math.abs(r.ndc.x) < (m || 0.95) && Math.abs(r.ndc.y) < (m || 0.95); };
  const feq = (ph) => ph.X.focal * ph.X.si.crop;
  const TASKS = [
    { id: 'meter', title: '把测光表归零', preset: 'overcast', setup: { mode: 'M' },
      desc: '切到 M 档，自己转快门、光圈、ISO，让取景器底部的测光指针停在 0 附近（±1/3 档以内），然后拍摄。',
      tips: ['指针偏右（+）说明比测光读数亮', '每转一格是 1/3 档，三格是 1 档'],
      check: (ph) => { const dd = ph.X.EVm - ph.X.EVcam; if (ph.S.mode !== 'M') return { ok: false, msg: '需要在 M 档完成。' }; if (Math.abs(dd) > 0.4) return { ok: false, msg: `与测光读数相差 ${CL.fmtEV(dd, 1)} 档，还需要调整。` }; return { ok: true, msg: `偏差 ${CL.fmtEV(dd, 2)} 档。EV ${ph.X.EVcam.toFixed(2)} = log₂(N²/t) − log₂(ISO/100)，三者的任意组合只要 EV 相同，亮度就相同（倒易律）。` }; } },
    { id: 'bokeh', title: '奶油般的背景虚化', preset: 'golden', setup: { lens: 'p85', mode: 'A' },
      desc: '对焦在红色自行车上，用长焦距和大光圈让后面绿篱上的小灯变成大光斑。',
      tips: ['等效焦距 ≥ 70 mm', '光圈 f/2.8 或更大', '光斑直径要超过画面宽度的 2%'],
      check: (ph) => { if (ph.subj !== 'bicycle') return { ok: false, msg: '对焦点要放在自行车上。' }; const c = CL.coc(ph.X.focal, ph.X.N, ph.focusM * 1000, (9 + ph.S.camZ) * 1000) / ph.X.sen.w; if (feq(ph) < 70) return { ok: false, msg: `等效焦距 ${Math.round(feq(ph))} mm，换长一点的镜头。` }; if (ph.X.N > 2.9) return { ok: false, msg: `${CL.apLabel(ph.X.a)} 太小，开大光圈。` }; if (c < 0.02) return { ok: false, msg: `灯篱光斑只有画面宽度的 ${(c * 100).toFixed(1)}%。` }; return { ok: true, msg: `灯篱上的光斑直径约为画面宽度的 ${(c * 100).toFixed(1)}%。虚化程度取决于入瞳直径（${(ph.X.focal / ph.X.N).toFixed(0)} mm）和主体与背景的距离比。` }; } },
    { id: 'freeze', title: '冻结转动的风车', preset: 'noon', setup: { mode: 'S', lens: 'z2470' },
      desc: '把镜头对准前景花坛里的风车，用足够快的快门让四片叶子清清楚楚。',
      tips: ['风车每秒转 2.4 圈', '快门 1/1000 或更快', '对焦在风车上'],
      check: (ph) => { if (ph.subj !== 'pinwheel' && ph.subj !== 'planter') return { ok: false, msg: '对焦点要放在风车上。' }; if (ph.X.t > 1 / 999) return { ok: false, msg: `${CL.shLabel(ph.X.s)} 期间叶尖转过 ${(360 * 2.4 * ph.X.t).toFixed(0)}°，还会糊。` }; return { ok: true, msg: `${CL.shLabel(ph.X.s)} 内叶尖只转了 ${(360 * 2.4 * ph.X.t).toFixed(1)}°。快门越快进光越少，所以在正午才容易做到。` }; } },
    { id: 'silk', title: '丝绢般的喷泉', preset: 'overcast', setup: { mode: 'S', support: 'tripod' },
      desc: '用三脚架和 1/2 秒以上的慢门，把喷泉的水滴拍成连续的丝线，同时画面不能过曝。',
      tips: ['白天光太强，慢门会过曝', '用 ND 减光镜、最低 ISO、小光圈', '喷泉要在画面里'],
      check: (ph) => { if (!inView(ph, new THREE.Vector3(-3.9, 1.6, -12.2))) return { ok: false, msg: '画面里没有喷泉。' }; if (ph.S.support !== 'tripod') return { ok: false, msg: '慢门要上三脚架。' }; if (ph.X.t < 0.49) return { ok: false, msg: `${CL.shLabel(ph.X.s)} 还不够慢。` }; if (ph.H.hi > 0.03 || ph.meanL > 180) return { ok: false, msg: `过曝了（溢出 ${(ph.H.hi * 100).toFixed(1)}%）。加 ND 减光镜。` }; return { ok: true, msg: `${CL.shLabel(ph.X.s)} 内每颗水滴都画出了自己的轨迹。${ph.X.filt.stops ? ph.X.filt.name + ' 挡掉了 ' + ph.X.filt.stops + ' 档光。' : ''}` }; } },
    { id: 'trails', title: '夜晚的车灯轨迹', preset: 'night', setup: { mode: 'M', support: 'tripod', lens: 'z2470' },
      desc: '在夜晚用三脚架、低 ISO 和 5 秒以上的长曝光，让来往车辆的前灯和尾灯拉成光轨。',
      tips: ['ISO ≤ 400 噪点才少', '快门 ≥ 5 秒', '道路要在画面里'],
      check: (ph) => { if (!['night', 'blue'].includes(ph.preset.id)) return { ok: false, msg: '要在夜晚或蓝调时刻拍。' }; if (ph.S.support !== 'tripod') return { ok: false, msg: '需要三脚架。' }; if (ph.X.t < 4.9) return { ok: false, msg: `${CL.shLabel(ph.X.s)} 太短，光轨不够长。` }; if (ph.X.iso > 410) return { ok: false, msg: `ISO ${CL.isoLabel(ph.X.i)} 偏高。` }; const p = ph.cam.position; if (!inView(ph, new THREE.Vector3(p.x, 0.7, -17.8), 0.99)) return { ok: false, msg: '画面里没有道路。' }; return { ok: true, msg: `${CL.shLabel(ph.X.s)} 里车辆驶过 ${Math.round(9 * ph.X.t)} 米以上，车身太暗没留下痕迹，只有车灯画出了线。` }; } },
    { id: 'pan', title: '追焦骑车人', preset: 'golden', setup: { support: 'pan', mode: 'S', af: 'AF-C', lens: 'z70200' },
      desc: '「持机方式」选追焦，相机跟着骑车人转动。用 1/60 到 1/8 秒的快门：人清楚，背景拉成流线。',
      tips: ['对焦用 AF-C', '快门不能太快，否则背景不动', '对焦点放在骑车人身上'],
      check: (ph) => { if (ph.S.support !== 'pan') return { ok: false, msg: '持机方式要选「追焦骑车人」。' }; if (ph.X.t < 1 / 61 || ph.X.t > 1 / 7.9) return { ok: false, msg: `快门 ${CL.shLabel(ph.X.s)} 不在 1/60–1/8 之间。` }; if (ph.subj !== 'cyclist') return { ok: false, msg: '对焦点没在骑车人身上。' }; return { ok: true, msg: `曝光期间相机转了 ${(CL.deg(W.riderSpeed * ph.X.t / 15)).toFixed(1)}°，背景被拉长了约 ${Math.round(riderPx(ph.X, ph.w))} 像素。` }; } },
    { id: 'wb', title: '让灰卡回到灰色', preset: 'night', setup: { mode: 'A', wb: 'sun', lens: 'z2470', focal: 35 },
      desc: '夜晚的灯是暖黄色的。把色卡拍进画面，调整白平衡，使第 22 格（18% 中灰）的 R、G、B 读数相等。',
      tips: ['日光白平衡下会严重偏黄', '试试钨丝灯或手动色温', '色卡在画面左侧的画架上'],
      check: (ph) => { if (!ph.gray) return { ok: false, msg: '画面里看不到色卡的中灰格。' }; const ok = Math.abs(ph.gray.rg - 1) < 0.07 && Math.abs(ph.gray.bg - 1) < 0.07; return ok ? { ok: true, msg: `中灰格 R/G = ${ph.gray.rg.toFixed(2)}、B/G = ${ph.gray.bg.toFixed(2)}，接近 1。` } : { ok: false, msg: `中灰格 R/G = ${ph.gray.rg.toFixed(2)}、B/G = ${ph.gray.bg.toFixed(2)}，还有色偏。` }; } },
    { id: 'moon', title: '拍出月面细节', preset: 'blue', setup: { lens: 'z100400', focal: 400, mode: 'M', support: 'tripod' },
      desc: '月亮在画面右上方的天空里。用 300 mm 以上的焦距把它放大，并让月面不过曝、能看到环形山。',
      tips: ['评价测光会把月亮拍成白圆', '点测光，或直接用 Looney 11：f/11、1/ISO', '对焦到无穷远'],
      check: (ph) => { if (feq(ph) < 290) return { ok: false, msg: `等效焦距 ${Math.round(feq(ph))} mm 不够长。` }; if (!ph.moon) return { ok: false, msg: '画面里没有月亮。' }; if (ph.moon.L > 240) return { ok: false, msg: `月面平均亮度 ${Math.round(ph.moon.L)}，过曝了。` }; if (ph.moon.L < 70) return { ok: false, msg: `月面平均亮度 ${Math.round(ph.moon.L)}，太暗。` }; return { ok: true, msg: `月面亮度 ${Math.round(ph.moon.L)}/255。月亮被太阳直射，亮度和白天的地面相近，所以曝光参数接近「阳光 16」再收一点。` }; } },
    { id: 'hyper', title: '用超焦距拍大景深', preset: 'noon', setup: { lens: 'uwa14', mode: 'A', af: 'MF' },
      desc: '用 28 mm 以下的广角，手动对焦到超焦距附近：前景的花坛（约 2 米）到远处钟楼都要在景深内。',
      tips: ['光圈收到 f/8 左右', '景深图里的蓝色 H 就是超焦距', '景深远界要到 ∞，近界 ≤ 1.8 m'],
      check: (ph) => { if (feq(ph) > 28.5) return { ok: false, msg: `等效焦距 ${Math.round(feq(ph))} mm，要 28 mm 以下。` }; if (isFinite(ph.X.dof.far)) return { ok: false, msg: `景深远界只到 ${CL.fmtDist(ph.X.dof.far)}，没到无穷远。` }; if (ph.X.dof.near > 1800) return { ok: false, msg: `景深近界 ${CL.fmtDist(ph.X.dof.near)}，前景的花坛不清楚。` }; return { ok: true, msg: `对焦 ${CL.fmtDist(ph.focusM * 1000)}，景深 ${CL.fmtDist(ph.X.dof.near)} 到 ∞。对焦在超焦距 H 上时，景深从 H/2 延伸到无穷远。` }; } },
    { id: 'slowsync', title: '慢速同步闪光', preset: 'blue', setup: { flash: 'ttl', mode: 'M', support: 'tripod', lens: 'p35' },
      desc: '蓝调时刻，用闪光灯照亮近处的自行车，同时用 1/15 秒或更慢的快门把背景的灯光和天空也拍出来。',
      tips: ['闪光管前景，快门管背景', '对焦在自行车上', '只开闪光、快门太快时背景会全黑'],
      check: (ph) => { if (!ph.flash) return { ok: false, msg: '没有使用闪光灯。' }; if (ph.X.t < 1 / 15.5) return { ok: false, msg: `快门 ${CL.shLabel(ph.X.s)} 太快，背景会很暗。` }; if (ph.subj !== 'bicycle') return { ok: false, msg: '对焦在自行车上。' }; if (ph.meanL < 45) return { ok: false, msg: '背景还是太暗，再放慢快门或提高 ISO。' }; return { ok: true, msg: `闪光输出 1/${Math.round(1 / ph.flash.pow)} 照亮了自行车，${CL.shLabel(ph.X.s)} 的快门让环境光也进来了。` }; } },
    { id: 'gnd', title: '压住阴天的白天空', preset: 'overcast', setup: { mode: 'A', lens: 'z2470', focal: 24 },
      desc: '阴天的天空比地面亮 2–3 档。把天空拍进画面上半部分，用渐变灰滤镜让天空不溢出，同时地面曝光正常。',
      tips: ['先不加滤镜拍一张，看高光警告', '镜头前加「渐变灰 GND8」', '溢出像素要少于 1%'],
      check: (ph) => { if (ph.cam.rotation.x < -0.05) return { ok: false, msg: '镜头要抬平一些，让天空占到画面上部。' }; if (ph.S.filter !== 'gnd') return { ok: false, msg: '没有使用渐变灰滤镜。' }; if (ph.H.hi > 0.01) return { ok: false, msg: `还有 ${(ph.H.hi * 100).toFixed(1)}% 溢出。` }; return { ok: true, msg: '天空被压暗 3 档，地面不受影响，一次曝光就容纳了原本超出动态范围的反差。' }; } },
  ];
  function renderTasks() {
    const done = LS.get('done', {});
    const n = TASKS.filter((t) => done[t.id]).length;
    $('taskProgress').innerHTML = `<i><b style="width:${(n / TASKS.length) * 100}%"></b></i> 已完成 ${n} / ${TASKS.length}`;
    $('taskList').innerHTML = TASKS.map((t, k) => `<article class="task${done[t.id] ? ' done' : ''}${R.task === t.id ? ' active' : ''}"><header><i>${String(k + 1).padStart(2, '0')}</i><h3>${t.title}</h3><span class="st">${done[t.id] ? '已完成' : R.task === t.id ? '进行中' : W.PRESETS.find((p) => p.id === t.preset).name}</span></header><p>${t.desc}</p><ul>${t.tips.map((x) => `<li>${x}</li>`).join('')}</ul><button class="go" data-task="${t.id}">${R.task === t.id ? '回到相机' : '开始'}</button></article>`).join('');
  }
  $('taskList').addEventListener('click', (e) => { const b = e.target.closest('[data-task]'); if (b) startTask(b.dataset.task); });
  function startTask(id) {
    const T = TASKS.find((t) => t.id === id);
    if (R.task !== id) {
      R.task = id;
      if (S.preset !== T.preset) { S.preset = T.preset; W.setPreset(renderer, T.preset); calibrate(); }
      applySettings(T.setup || {});
    }
    renderTasks(); renderTaskbar(); go('shoot');
  }
  function renderTaskbar() {
    const el = $('taskbar');
    if (!R.task) { el.hidden = true; return; }
    const T = TASKS.find((t) => t.id === R.task), done = LS.get('done', {})[T.id];
    el.hidden = false;
    el.innerHTML = `<span>练习 · <b>${T.title}</b>${done ? ' · 已完成' : ''}：${T.tips.join('；')}</span><button id="taskEnd">结束练习</button>`;
    $('taskEnd').onclick = () => { R.task = null; renderTaskbar(); renderTasks(); };
  }

  /* ================= 设置一组参数（词典「试一试」与任务共用） ================= */
  const AIM = {
    bicycle: () => W.bicycle.localToWorld(new THREE.Vector3(0.1, 0.845, 0)), pinwheel: () => W.pinwheel.getWorldPosition(new THREE.Vector3()),
    chart: () => W.chart.getWorldPosition(new THREE.Vector3()), fountain: () => new THREE.Vector3(-3.9, 1.7, -12.2), hedge: () => new THREE.Vector3(2.4, 0.55, -8.85),
    road: () => new THREE.Vector3(5, 1.0, -18), building: () => new THREE.Vector3(1.5, 6, -26), tower: () => new THREE.Vector3(-34, 40, -240),
    moon: () => W.moonDir.clone().multiplyScalar(2400), sky: () => new THREE.Vector3(0, 30, -60), cafe: () => new THREE.Vector3(3.1, 0.9, -7.6),
  };
  function applySettings(o) {
    if (o.preset && o.preset !== S.preset) { S.preset = o.preset; W.setPreset(renderer, o.preset); calibrate(); }
    if (o.lens) setLens(o.lens);
    ['mode', 'a', 's', 'i', 'comp', 'autoISO', 'metering', 'focal', 'sensor', 'af', 'wb', 'K', 'tint', 'style', 'nr', 'lensCorr', 'filter', 'support', 'ibis', 'flash', 'flashPow', 'rear', 'hss', 'camZ', 'low', 'zebra', 'peak'].forEach((k) => { if (o[k] !== undefined) S[k] = o[k]; });
    if (o.a !== undefined && typeof o.a === 'string') S.a = Math.round(Math.log2(parseFloat(o.a)) * 6);
    if (o.mf !== undefined) { S.af = 'MF'; S.mfFocus = o.mf; }
    if (o.support === 'pan') { S.panOff = 0; S.afX = 0.5; S.afY = 0.5; S.pitch = panPitch(); }
    S.ael = false;
    resize();
    if (o.aim && AIM[o.aim]) {
      const p = AIM[o.aim](), c = camPos();
      if (S.support !== 'pan') S.yaw = yawTo(p, c);
      S.pitch = clamp(pitchTo(p, c), -1, 1.2);
      S.afX = o.afX || 0.5; S.afY = o.afY || 0.5;
      const X = compute(); poseCam(X, R.time); cam.updateMatrixWorld();
      if (S.af !== 'MF') { startAF(); const hit = pickAt(S.afX, S.afY); if (hit) { S.focus = Math.max(hit.dist, lensOf().mfd); R.afTarget = S.focus; } }
    }
    if (o.topic) topic(o.topic);
    syncUI();
  }

  /* ================= 词典 ================= */
  let curCat = 'all';
  function renderCats() {
    $('catChips').innerHTML = [['all', '全部']].concat(CL.CATS.map((c) => [c.id, c.name])).map(([id, n]) => `<button data-c="${id}" aria-pressed="${curCat === id}">${n}</button>`).join('');
  }
  $('catChips').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; curCat = b.dataset.c; renderCats(); renderTerms(); });
  $('q').addEventListener('input', () => renderTerms());
  const catName = (id) => (CL.CATS.find((c) => c.id === id) || {}).name || '';
  function renderTerms(openId) {
    const q = $('q').value.trim().toLowerCase();
    const list = CL.TERMS.filter((t) => (curCat === 'all' || t.cat === curCat) && (!q || (t.zh + t.en + t.short + (t.alias || '')).toLowerCase().includes(q)));
    $('qCount').textContent = `${list.length} 条`;
    $('termList').innerHTML = list.map((t) => `<article class="term" id="term-${t.id}"><button aria-expanded="${openId === t.id}" data-id="${t.id}"><span class="tt"><b>${t.zh}</b><em>${t.en}</em><span class="cat">${catName(t.cat)}</span></span><span class="sd">${t.short}</span></button>${openId === t.id ? termFull(t) : ''}</article>`).join('');
  }
  function termFull(t) {
    const rel = (t.rel || []).filter((r) => CL.TERM_BY_ID[r]).map((r) => `<button data-rel="${r}">${CL.TERM_BY_ID[r].zh}</button>`).join('');
    return `<div class="full">${t.body}${t.try ? `<button class="try" data-try="${t.id}">在相机上试试 →</button>` : ''}${rel ? `<div class="rel">相关：${rel}</div>` : ''}</div>`;
  }
  $('termList').addEventListener('click', (e) => {
    const tr = e.target.closest('[data-try]');
    if (tr) { const t = CL.TERM_BY_ID[tr.dataset.try]; applySettings(t.try); go('shoot'); toast(t.try.msg || `已设置：${t.zh}`); return; }
    const rl = e.target.closest('[data-rel]');
    if (rl) { openTerm(rl.dataset.rel); return; }
    const b = e.target.closest('button[data-id]');
    if (!b) return;
    const art = b.parentElement, open = b.getAttribute('aria-expanded') === 'true';
    if (open) { art.querySelector('.full').remove(); b.setAttribute('aria-expanded', 'false'); }
    else { art.insertAdjacentHTML('beforeend', termFull(CL.TERM_BY_ID[b.dataset.id])); b.setAttribute('aria-expanded', 'true'); }
  });
  function openTerm(id) {
    curCat = 'all'; $('q').value = ''; renderCats(); renderTerms(id); go('terms');
    requestAnimationFrame(() => { const el = $('term-' + id); if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.classList.add('flash'); } });
  }

  /* ================= 页签 ================= */
  let currentTab = 'shoot', anatomy = null;
  const TABS = ['shoot', 'body', 'terms', 'tasks'];
  function go(tab, noHash) {
    if (!TABS.includes(tab)) tab = 'shoot';
    currentTab = tab;
    document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
    TABS.forEach((t) => ($('tab-' + t).hidden = t !== tab));
    if (tab === 'body') {
      if (!anatomy && CL.createAnatomy) anatomy = CL.createAnatomy({ canvas: $('anatCanvas'), stage: $('anatStage'), hotspots: $('hotspots'), list: $('partList'), card: $('partCard'), openTerm, explode: $('btnExplode'), rays: $('btnRays'), spin: $('btnSpin') });
      if (anatomy) { anatomy.setActive(true); const X = compute(); anatomy.setAperture(X.N, CL.N(X.aMin), X.lens.blades, X.lens.round); anatomy.setSensor(X.sen.w, X.sen.h); if (R.hist) anatomy.setLCD(R.hist.data, R.hist.w, R.hist.h); }
    } else if (anatomy) anatomy.setActive(false);
    if (tab === 'tasks') renderTasks();
    if (tab === 'terms' && !$('termList').children.length) renderTerms();
    if (tab === 'shoot') requestAnimationFrame(resize);
    if (!noHash) { try { history.replaceState(null, '', '#' + tab); } catch (e) { location.hash = tab; } }
    window.scrollTo({ top: 0 });
  }
  document.querySelector('.tabs').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(b.dataset.tab); });
  window.addEventListener('hashchange', () => go(location.hash.slice(1), true));

  /* ================= 提示 ================= */
  let toastT = 0;
  function toast(msg, good) { const el = $('toast'); el.textContent = msg; el.className = 'toast on' + (good ? ' good' : ''); clearTimeout(toastT); toastT = setTimeout(() => (el.className = 'toast'), 3600); }

  /* ================= 主循环 ================= */
  R.time = 0;
  let lastNow = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - lastNow) / 1000); lastNow = now;
    if (R.busy) return;
    R.time += dt;
    if (currentTab !== 'shoot' || document.hidden) return;
    if (!cssW) return;
    const t0 = performance.now();
    W.update(R.time);
    updateFocus(dt);
    const X = compute();
    // 手持时取景器轻微晃动（长焦明显，防抖压住）
    let sy = 0, sp = 0;
    if (S.support !== 'tripod') { const a = 0.0005 * (S.ibis ? 0.12 : 1) * (S.support === 'pan' ? 0.5 : 1); sy = a * (Math.sin(R.time * 1.3) + 0.6 * Math.sin(R.time * 3.1 + 1)); sp = a * (Math.cos(R.time * 1.1) + 0.5 * Math.sin(R.time * 2.7)); }
    poseCam(X, R.time, sy, sp);
    const o = postOpts(X, true, R.time);
    P.renderLive(cam, o);
    R.frame++;
    if (R.frame % 3 === 0) {
      const grid = P.meter(R.presetGain * Math.pow(2, -X.fStops), X.filt.gnd || 0);
      R.meterGrid = grid;
      const ev = meterEV(grid, S.metering);
      R.EVm += (ev - R.EVm) * (R.frame < 10 ? 1 : 0.4);
      const aw = grayWorld(grid);
      R.awb = R.awb.map((v, k) => v + (aw[k] - v) * 0.3);
    }
    if (R.frame % 4 === 1 && (S.histo || R.frame % 40 === 1)) {
      const hh = P.readHist();
      R.hist = { data: hh.data, w: hh.w, h: hh.h };
      if (S.histo) drawHist(hctx, histogram(hh.data, hh.w, hh.h), histCv.width, histCv.height, false);
    }
    if (R.frame % 6 === 0) { syncDials(X); updateVF(X); drawDOF(X); }
    if (R.frame % 15 === 0) renderTopicLive();
    // 自适应分辨率
    const ft = performance.now() - t0;
    R.ftAvg = R.ftAvg * 0.95 + Math.max(ft, dt * 1000) * 0.05;
    if (R.frame % 60 === 0) {
      const old = R.scale;
      if (R.ftAvg > 40) R.scale = Math.max(0.5, R.scale * 0.85);
      else if (R.ftAvg < 20 && R.scale < 1) R.scale = Math.min(1, R.scale * 1.1);
      if (old !== R.scale) applyScale();
    }
  }
  const LIVE_TOPICS = new Set(['shutter', 'aperture', 'iso', 'comp', 'mode', 'metering', 'focus', 'af', 'wb', 'support', 'position', 'preset']);
  function renderTopicLive() { if (LIVE_TOPICS.has(R.topic) && !$('explain').matches(':hover')) renderTopic(); }

  /* ================= 启动 ================= */
  W.setPreset(renderer, S.preset);
  resize();
  calibrate();
  // 预热：先跑几帧测光，让测光读数稳定
  (function warm() {
    const X = compute(); poseCam(X, 0);
    P.renderLive(cam, postOpts(X, true, 0));
    const grid = P.meter(R.presetGain, 0); R.meterGrid = grid; R.EVm = meterEV(grid, S.metering); R.awb = grayWorld(grid);
    // 默认对焦点放在自行车横梁上
    const tt = W.bicycle.localToWorld(new THREE.Vector3(0.1, 0.845, 0)).project(cam);
    S.afX = clamp(tt.x * 0.5 + 0.5, 0.05, 0.95); S.afY = clamp(0.5 - tt.y * 0.5, 0.05, 0.95);
    const hit = pickAt(S.afX, S.afY); if (hit) { S.focus = hit.dist; R.afSubject = hit.subject; R.afTarget = hit.dist; }
  })();
  renderCats();
  syncUI();
  updateVF(compute());
  go(TABS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'shoot', true);
  requestAnimationFrame(frame);
  CL.app = { S, R, W, P, cam, compute, applySettings, shoot, go, TASKS };
})();
