// 中文界面：时刻、日期、季节、春照秋照、天气、标注、说明、隐藏
import { Vector3 } from 'three';
import type { App } from '../app';
import { toDate, fromDate, yearStart, daysInYear, formatClock, seasonOf, SEASON_NAMES } from '../sim/calendar';
import { dayRamp, dayIntensity, temperature } from '../sim/climate';
import { computeWindows, findNextPeek, PeekWindow, PeekEvent, spinAngle, wrapAngle } from '../sim/astro';
import { WEATHER_KINDS, WEATHER_NAMES, WeatherKind } from '../sim/weather';
import { RING } from '../config';
import { U } from '../render/uniforms';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

function dirName(a: number): string {
  // a：向量方向（0 = 东，π/2 = 南）
  const names = ['东', '东南', '南', '西南', '西', '西北', '北', '东北'];
  const k = Math.round(((a % (Math.PI * 2)) + Math.PI * 2) / (Math.PI / 4)) % 8;
  return names[k];
}

function fmtDur(minutes: number): string {
  if (minutes < 1) return Math.max(1, Math.round(minutes * 60)) + ' 秒';
  if (minutes < 60) return Math.round(minutes) + ' 分钟';
  const h = minutes / 60;
  if (h < 48) return (h < 10 ? h.toFixed(1) : Math.round(h)) + ' 小时';
  return Math.round(h / 24) + ' 天';
}

const SPEEDS = [1, 10, 60, 600, 3600];
const SPEED_LABEL = ['实时', '×10', '×60', '×600', '×3600'];

export function initUI(app: App, startHidden: boolean): { update(): void } {
  const ui = $('ui');
  const showBtn = $<HTMLButtonElement>('show-ui');
  const toastEl = $('toast');
  let toastTimer = 0;
  const toast = (msg: string, ms = 3600) => {
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove('on'), ms);
  };

  // ---------- 按钮组 ----------
  const mkChip = (parent: HTMLElement, label: string, onClick: () => void, title?: string, cls = '') => {
    const b = document.createElement('button');
    b.className = 'chip ' + cls;
    b.textContent = label;
    if (title) b.title = title;
    b.addEventListener('click', onClick);
    parent.appendChild(b);
    return b;
  };
  const sep = (parent: HTMLElement) => {
    const s = document.createElement('span');
    s.className = 'sep';
    parent.appendChild(s);
  };

  // 速度
  const speedBox = $('speeds');
  const speedBtns = SPEEDS.map((s, i) =>
    mkChip(speedBox, SPEED_LABEL[i], () => {
      app.speed = s;
      app.paused = false;
      refreshButtons();
    }, i === 0 ? '与真实时间同步流逝' : `一秒钟过去 ${s >= 3600 ? s / 3600 + ' 小时' : s >= 60 ? s / 60 + ' 分钟' : s + ' 秒'}`),
  );
  const playBtn = $<HTMLButtonElement>('btn-play');
  playBtn.addEventListener('click', () => {
    app.paused = !app.paused;
    refreshButtons();
  });

  // 时刻预设
  const presetBox = $('presets');
  const PRESETS: [string, number, string][] = [
    ['清晨', 5.9, '04:30 起镜云渐亮'],
    ['白昼', 11.0, '07:30—16:30 维持白昼'],
    ['黄昏', 18.1, '16:30 起镜云渐暗'],
    ['夜晚', 22.6, '对岸光照着河谷'],
  ];
  const gotoHour = (h: number) => {
    const cd = toDate(app.t);
    let target = Math.floor(app.t) + h / 24;
    if (target <= app.t + 1e-6) target += 1;
    const span = (target - app.t) * 24;
    app.jumpTo(target, Math.min(3.2, 0.8 + span * 0.12));
    void cd;
  };
  PRESETS.forEach(([name, h, tip]) => mkChip(presetBox, name, () => gotoHour(h), tip));

  // 春照、秋照
  const peekBox = $('peeks');
  let windows: PeekWindow[] = [];
  let windowsYear = -1;
  const ensureWindows = () => {
    const cd = toDate(app.t);
    if (cd.year !== windowsYear) {
      windowsYear = cd.year;
      windows = computeWindows(yearStart(cd.year) - 1);
      // 也算下一年的，便于「下一次」跨年
      windows = windows.concat(computeWindows(yearStart(cd.year + 1) - 1).filter((w) => w.start > windows[windows.length - 1]?.end));
      drawYearWindows();
    }
  };
  const gotoPeek = (kind: 'spring' | 'autumn') => {
    ensureWindows();
    // 若正处在该类窗口中，跳到下一次露星；否则跳到下一个窗口中最长的那一次
    const inWin = windows.find((w) => w.kind === kind && app.t >= w.start - 0.5 && app.t <= w.end);
    let ev: PeekEvent | null = null;
    if (inWin) {
      ev = findNextPeek(app.t + 2 / 1440, 30);
      if (ev && ev.kind !== kind) ev = null;
    }
    if (!ev) {
      const w = windows.find((x) => x.kind === kind && x.center > app.t) ?? windows.find((x) => x.kind === kind);
      if (!w) return;
      ev = findNextPeek(w.center - 0.09, 2);
    }
    if (!ev) return;
    const pre = 100 / 86400;
    app.flash();
    app.jumpTo(ev.start - pre);
    app.speed = 6;
    app.paused = false;
    // 面向东南：南墙上的恒星在右侧，河谷在前方
    app.rig.lookAt(0.62, 0.075, 64);
    const cd = toDate(ev.start);
    const dur = (ev.end - ev.start) * 1440;
    const day = dayRamp(cd.hour) > 0.5 ? '人工白昼' : dayRamp(cd.hour) > 0 ? '镜云调光时' : '深夜';
    toast(`${kind === 'spring' ? '春照' : '秋照'}：${cd.month} 月 ${cd.day} 日 ${formatClock(cd.hour)} 起，正值${day}。恒星上缘将越过南墙约 ${dur.toFixed(1)} 分钟（时间放慢到 ×6）`, 6500);
    refreshButtons();
  };
  mkChip(peekBox, '春照', () => gotoPeek('spring'), '跳到下一次春照：恒星上缘越过南墙', 'warm');
  mkChip(peekBox, '秋照', () => gotoPeek('autumn'), '跳到下一次秋照', 'warm');

  // 季节
  const seasonBox = $('seasons');
  const SEASONS: [string, number, number][] = [
    ['春', 4, 18],
    ['夏', 7, 12],
    ['秋', 10, 26],
    ['冬', 1, 16],
  ];
  const seasonBtns = SEASONS.map(([name, m, d]) =>
    mkChip(seasonBox, name, () => {
      const cd = toDate(app.t);
      app.flash();
      app.jumpTo(fromDate(cd.year, m, d, cd.hour));
      refreshButtons();
    }, `${m} 月 ${d} 日`),
  );

  // 天气
  const wxBox = $('weathers');
  const wxBtns: HTMLButtonElement[] = [];
  wxBtns.push(mkChip(wxBox, '自动', () => setWx('auto'), '按季节自然变化'));
  for (const k of WEATHER_KINDS) wxBtns.push(mkChip(wxBox, WEATHER_NAMES[k], () => setWx(k)));
  const setWx = (k: 'auto' | WeatherKind) => {
    app.setWeather(k);
    if (k === 'fog') {
      const h = toDate(app.t).hour;
      if (h > 10.5 && h < 21) toast('河谷晨雾在清晨最浓——可点「清晨」去看');
    }
    refreshButtons();
  };

  // ---------- 滑杆 ----------
  const dayTrack = $('day-track');
  const dayThumb = $('day-thumb');
  const yearTrack = $('year-track');
  const yearThumb = $('year-thumb');
  const dragTrack = (el: HTMLElement, onSet: (f: number, end: boolean) => void) => {
    let active = false;
    const set = (e: PointerEvent, end: boolean) => {
      const r = el.getBoundingClientRect();
      const f = Math.max(0, Math.min(0.99999, (e.clientX - r.left) / r.width));
      onSet(f, end);
    };
    el.addEventListener('pointerdown', (e) => {
      active = true;
      el.setPointerCapture(e.pointerId);
      set(e, false);
    });
    el.addEventListener('pointermove', (e) => active && set(e, false));
    el.addEventListener('pointerup', (e) => {
      if (active) set(e, true);
      active = false;
    });
  };
  dragTrack(dayTrack, (f) => {
    app.jumpTo(Math.floor(app.t) + f);
  });
  dragTrack(yearTrack, (f, end) => {
    const cd = toDate(app.t);
    const y0 = yearStart(cd.year);
    const d = Math.floor(f * daysInYear(cd.year));
    app.jumpTo(y0 + d + cd.hour / 24);
    if (end) app.flash();
  });
  const drawYearWindows = () => {
    const box = $('year-wins');
    box.innerHTML = '';
    const y0 = yearStart(windowsYear);
    const len = daysInYear(windowsYear);
    for (const w of windows) {
      const a = (w.start - y0) / len;
      const b = (w.end - y0) / len;
      if (b < 0 || a > 1) continue;
      const el = document.createElement('b');
      el.style.left = a * 100 + '%';
      el.style.width = Math.max(0.3, (b - a) * 100) + '%';
      el.title = `${w.kind === 'spring' ? '春照' : '秋照'}窗口：约 ${(w.end - w.start).toFixed(1)} 日，最长一次 ${w.longest.toFixed(1)} 分钟`;
      box.appendChild(el);
      const lab = document.createElement('em');
      lab.style.left = ((a + b) / 2) * 100 + '%';
      lab.textContent = w.kind === 'spring' ? '春照' : '秋照';
      box.appendChild(lab);
    }
  };

  // ---------- 顶部按钮 ----------
  const labelsEl = $('labels');
  let labelsOn = false;
  const labelBtn = $<HTMLButtonElement>('btn-labels');
  const toggleLabels = () => {
    labelsOn = !labelsOn;
    labelBtn.classList.toggle('on', labelsOn);
    labelsEl.innerHTML = '';
    labelEls.clear();
  };
  labelBtn.addEventListener('click', toggleLabels);
  const help = $('help');
  const toggleHelp = (v?: boolean) => {
    help.hidden = v === undefined ? !help.hidden : !v;
  };
  $('btn-help').addEventListener('click', () => toggleHelp());
  $('help-close').addEventListener('click', () => toggleHelp(false));
  help.addEventListener('click', (e) => {
    if (e.target === help) toggleHelp(false);
  });
  const toggleFull = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };
  $('btn-full').addEventListener('click', toggleFull);
  let hidden = false;
  let showTimer = 0;
  const setHidden = (v: boolean) => {
    hidden = v;
    ui.classList.toggle('hidden', v);
    showBtn.hidden = !v;
    if (v) toast('界面已隐藏 · 按 H 或移动鼠标后点右下角恢复', 2600);
  };
  $('btn-hide').addEventListener('click', () => setHidden(true));
  showBtn.addEventListener('click', () => setHidden(false));
  window.addEventListener('pointermove', () => {
    if (!hidden) return;
    showBtn.classList.add('visible');
    clearTimeout(showTimer);
    showTimer = window.setTimeout(() => showBtn.classList.remove('visible'), 2200);
  });
  if (startHidden) {
    ui.classList.add('hidden');
    hidden = true;
  }

  // ---------- 键盘 ----------
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement) return;
    const k = e.key;
    if (k === ' ') {
      app.paused = !app.paused;
      refreshButtons();
      e.preventDefault();
    } else if (k === 'h' || k === 'H') setHidden(!hidden);
    else if (k === 'l' || k === 'L') toggleLabels();
    else if (k === 'f' || k === 'F') toggleFull();
    else if (k === '?' || k === '/') toggleHelp();
    else if (k === 'Escape') toggleHelp(false);
    else if (k >= '1' && k <= '4') gotoHour(PRESETS[+k - 1][1]);
    else if (k === '[' || k === ']') {
      let i = SPEEDS.indexOf(app.speed);
      if (i < 0) i = 0;
      i = Math.max(0, Math.min(SPEEDS.length - 1, i + (k === ']' ? 1 : -1)));
      app.speed = SPEEDS[i];
      app.paused = false;
      refreshButtons();
    } else if (k === 'ArrowLeft') app.rig.turn(-0.12, 0);
    else if (k === 'ArrowRight') app.rig.turn(0.12, 0);
    else if (k === 'ArrowUp') app.rig.turn(0, 0.08);
    else if (k === 'ArrowDown') app.rig.turn(0, -0.08);
    else if (k === '+' || k === '=') app.rig.zoomBy(0.8);
    else if (k === '-' || k === '_') app.rig.zoomBy(1.25);
  });

  function refreshButtons(): void {
    playBtn.textContent = app.paused ? '▶' : '❚❚';
    playBtn.setAttribute('aria-label', app.paused ? '继续' : '暂停');
    speedBtns.forEach((b, i) => b.classList.toggle('on', !app.paused && app.speed === SPEEDS[i]));
    const mode = app.weather.mode;
    wxBtns.forEach((b, i) => b.classList.toggle('on', (i === 0 ? 'auto' : WEATHER_KINDS[i - 1]) === mode));
    const s = seasonOf(toDate(app.t).month);
    const order = [1, 2, 3, 0];
    seasonBtns.forEach((b, i) => b.classList.toggle('on', order[i] === s));
  }
  refreshButtons();

  // ---------- 罗盘 ----------
  const compassInner = $('compass-inner');
  const compassW = () => compassInner.parentElement!.clientWidth;
  const COMPASS: [number, string, boolean][] = [];
  const pts: [number, string][] = [[0, '北'], [45, '东北'], [90, '东'], [135, '东南'], [180, '南'], [225, '西南'], [270, '西'], [315, '西北']];
  for (const [a, n] of pts) COMPASS.push([a, n, a % 90 === 0]);
  const pxPerDeg = 3.2;
  for (let k = -1; k <= 1; k++) {
    for (const [a, n, major] of COMPASS) {
      const s = document.createElement('span');
      s.textContent = n;
      if (major) s.className = 'major';
      s.style.left = (a + k * 360) * pxPerDeg + 'px';
      compassInner.appendChild(s);
    }
    for (let a = 0; a < 360; a += 15) {
      const i = document.createElement('i');
      i.style.left = (a + k * 360) * pxPerDeg + 'px';
      compassInner.appendChild(i);
    }
  }

  // ---------- 标注 ----------
  const labelEls = new Map<string, HTMLElement>();
  const tmp = new Vector3();
  const R = RING.R;
  const sky = (x: number, y: number, z: number) => new Vector3(x, y, z).normalize();
  const spokeDirs = RING.spokeLongitudes.map((d) => {
    const th = (d * Math.PI) / 180;
    return sky(R * Math.sin(th), R * (1 - Math.cos(th)), 0);
  });
  interface Lab {
    id: string;
    text: string;
    sub?: string;
    dir?: Vector3;
    pos?: Vector3;
    cls?: string;
  }
  const staticLabels = (): Lab[] => {
    const L: Lab[] = [
      { id: 'hub', text: '中央星港', sub: '环心 · 五万公里', dir: sky(0.0012, 1, 0.0006), cls: 'sky' },
      { id: 'mirror', text: '中央镜云', sub: '距环轴 3000–7000 km', dir: sky(0.06, 1, 0.07), cls: 'sky' },
      { id: 'far', text: '对岸', sub: '与此地相差半个昼夜', dir: sky(Math.cos((80 * Math.PI) / 180), Math.sin((80 * Math.PI) / 180), 0), cls: 'sky' },
      { id: 'wallS', text: '南侧边墙', sub: '高 50 km · 500 km 外 · 朝向恒星', dir: sky(0.15, Math.tan((5.2 * Math.PI) / 180), 1), cls: 'sky' },
      { id: 'wallN', text: '北侧边墙', sub: '高 50 km · 500 km 外', dir: sky(0.15, Math.tan((5.2 * Math.PI) / 180), -1), cls: 'sky' },
      { id: 'east', text: '东 · 顺旋方向', sub: '大地向上弯起', dir: sky(1, 0.06, 0), cls: 'sky' },
      { id: 'west', text: '西 · 逆旋方向', sub: '大地向上弯起', dir: sky(-1, 0.06, 0), cls: 'sky' },
      { id: 'school', text: '中学', pos: new Vector3(300, -40, -20) },
      { id: 'station', text: '车站', pos: new Vector3(980, -48, -470) },
      { id: 'bridge', text: '大桥', pos: new Vector3(1384, -54, 560) },
      { id: 'gap', text: '铁路出谷口', sub: '约 18 公里', pos: new Vector3(17800, -40, 4600) },
    ];
    spokeDirs.forEach((d, i) => {
      if (d.y > 0.05) L.push({ id: 'spoke' + i, text: '辐条', sub: `落点 ${Math.abs(RING.spokeLongitudes[i] > 180 ? RING.spokeLongitudes[i] - 360 : RING.spokeLongitudes[i])}°${(RING.spokeLongitudes[i] > 0 && RING.spokeLongitudes[i] < 180) ? '东' : '西'}`, dir: d, cls: 'sky' });
    });
    return L;
  };
  const LABELS = staticLabels();
  const updateLabels = () => {
    if (!labelsOn) return;
    const cam = app.pipe.camera;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const list: Lab[] = [...LABELS];
    // 恒星
    const sd = U.uStarDir.value;
    const vis = app.light.starFrac > 0;
    list.push({ id: 'star', text: '恒星', sub: vis ? '上缘正越过南墙' : app.light.star.elevation > 0 ? '在南墙之后' : '在地平之下', dir: new Vector3(sd.x, sd.y, sd.z), cls: 'warm' });
    const seen = new Set<string>();
    for (const L of list) {
      if (L.dir) tmp.copy(L.dir).multiplyScalar(1000).add(cam.position);
      else if (L.pos) tmp.copy(L.pos);
      tmp.project(cam);
      if (tmp.z > 1 || tmp.z < -1 || Math.abs(tmp.x) > 1.05 || Math.abs(tmp.y) > 1.05) continue;
      let el = labelEls.get(L.id);
      if (!el) {
        el = document.createElement('div');
        el.className = 'lb ' + (L.cls ?? '');
        labelsEl.appendChild(el);
        labelEls.set(L.id, el);
      }
      el.innerHTML = L.text + (L.sub ? `<small>${L.sub}</small>` : '');
      el.style.left = ((tmp.x * 0.5 + 0.5) * w).toFixed(1) + 'px';
      el.style.top = ((-tmp.y * 0.5 + 0.5) * h).toFixed(1) + 'px';
      el.style.display = '';
      seen.add(L.id);
    }
    for (const [id, el] of labelEls) if (!seen.has(id)) el.style.display = 'none';
  };

  // ---------- 信息面板 ----------
  const clockEl = $('clock');
  const dateEl = $('date');
  const phaseEl = $('phase');
  const wxEl = $('wx');
  const ringEl = $('ring');
  const peekEl = $('peek');
  const elevEl = $('compass-elev');
  let nextPeek: PeekEvent | null = null;
  let nextPeekAt = -1;
  let lastInfo = 0;
  let lastT = app.t;

  const updateInfo = () => {
    const t = app.t;
    const cd = toDate(t);
    clockEl.textContent = formatClock(cd.hour, app.speed <= 10 && !app.paused);
    const season = SEASON_NAMES[seasonOf(cd.month)];
    dateEl.textContent = `环历 ${cd.year} 年 ${cd.month} 月 ${cd.day} 日 · ${season}`;
    const ramp = dayRamp(cd.hour);
    const di = dayIntensity(cd.hour);
    let phase: string;
    if (ramp <= 0) phase = '夜 · 对岸光照着河谷';
    else if (ramp >= 1) phase = '白昼 · 镜光自头顶洒下';
    else {
      const pct = di < 0.01 ? '不足 1%' : Math.round(di * 100) + '%';
      phase = cd.hour < 12 ? `镜云渐亮 · 光照 ${pct}` : `镜云渐暗 · 光照 ${pct}`;
    }
    phaseEl.textContent = phase;
    const ws = app.weather.state;
    const temp = temperature(t, ws.cover, ws.rain, ws.fogNow);
    const from = dirName(ws.windDir + Math.PI);
    const kindName = app.weather.mode === 'auto' ? WEATHER_NAMES[ws.kind] : WEATHER_NAMES[app.weather.mode];
    const rainTxt = ws.rain > 0.05 ? ` · ${ws.rain > 0.5 ? '雨势较大' : '小雨'}` : '';
    wxEl.textContent = `${kindName}${rainTxt} · ${temp.toFixed(1)}℃ · ${from}风 ${ws.wind.toFixed(1)} m/s`;
    const spin = (wrapAngle(spinAngle(t)) * 180) / Math.PI;
    ringEl.textContent = `环体自转 ${spin.toFixed(0)}° · 每 3 小时 56 分一圈 · 公转第 ${Math.floor(cd.doy) + 1} 日`;
    // 春照、秋照
    ensureWindows();
    if (!nextPeek || t > nextPeek.end || t < nextPeekAt - 1e-6 || Math.abs(t - lastT) > 0.5) {
      nextPeek = findNextPeek(t, 400);
      nextPeekAt = t;
    }
    lastT = t;
    peekEl.classList.remove('now');
    const win = windows.find((w) => t >= w.start && t <= w.end + 0.02);
    if (nextPeek && t >= nextPeek.start && t <= nextPeek.end) {
      const left = (nextPeek.end - t) * 1440;
      peekEl.textContent = `${nextPeek.kind === 'spring' ? '春照' : '秋照'}：恒星上缘正越过南墙 · 还有 ${fmtDur(left)}`;
      peekEl.classList.add('now');
    } else if (win && nextPeek) {
      const dayN = Math.floor(t - win.start) + 1;
      const total = Math.ceil(win.end - win.start);
      const pk = toDate(nextPeek.start);
      peekEl.textContent = `${win.kind === 'spring' ? '春照' : '秋照'}窗口第 ${dayN}/${total} 日 · 下次露星 ${pk.month === cd.month && pk.day === cd.day ? '' : pk.month + '月' + pk.day + '日 '}${formatClock(pk.hour)}，约 ${((nextPeek.end - nextPeek.start) * 1440).toFixed(1)} 分钟`;
    } else if (nextPeek) {
      const days = nextPeek.start - t;
      peekEl.textContent = `距${nextPeek.kind === 'spring' ? '春照' : '秋照'}还有 ${fmtDur(days * 1440)}`;
    } else peekEl.textContent = '';
    refreshButtons();
  };

  const update = () => {
    const now = performance.now();
    const cd = toDate(app.t);
    // 滑杆位置
    dayThumb.style.left = (cd.hour / 24) * 100 + '%';
    yearThumb.style.left = (cd.doy / cd.yearLength) * 100 + '%';
    // 罗盘
    const head = app.rig.heading();
    compassInner.style.transform = `translateX(${compassW() / 2 - head * pxPerDeg}px)`;
    const elev = (app.rig.view.pitch * 180) / Math.PI;
    elevEl.style.display = Math.abs(elev) > 20 ? 'block' : 'none';
    elevEl.textContent = `仰角 ${elev.toFixed(0)}°`;
    if (now - lastInfo > 120) {
      lastInfo = now;
      updateInfo();
    }
    updateLabels();
  };
  updateInfo();
  return { update };
}
