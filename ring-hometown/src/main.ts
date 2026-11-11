// 环乡：入口
import { App } from './app';
import { fromDate } from './sim/calendar';
import { WeatherKind } from './sim/weather';
import { U } from './render/uniforms';
import { initUI } from './ui/ui';

const params = new URLSearchParams(location.search);
function num(name: string, def: number): number {
  const v = params.get(name);
  return v === null || v === '' ? def : parseFloat(v);
}

function pickQuality(): number {
  if (params.has('q')) return num('q', 2);
  const mobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  const cores = navigator.hardwareConcurrency || 4;
  if (mobile) return 0;
  return cores >= 8 ? 2 : 1;
}

async function main(): Promise<void> {
  const canvas = document.getElementById('view') as HTMLCanvasElement;
  const loading = document.getElementById('loading');
  const bar = document.getElementById('loading-bar');
  const msg = document.getElementById('loading-msg');
  const quality = pickQuality();
  const app = new App(canvas, {
    quality,
    lite: params.has('lite'),
    onProgress: (m, f) => {
      if (msg) msg.textContent = m;
      if (bar) bar.style.width = Math.round(f * 100) + '%';
    },
  });
  const now = new Date();
  // 默认：今天的月日，上午十点
  const month = num('month', now.getMonth() + 1);
  const day = num('day', now.getDate());
  const t0 = fromDate(1127, month, day, num('hour', 10));
  try {
    await app.init(t0);
  } catch (e) {
    console.error(e);
    if (msg) msg.textContent = '初始化失败：' + (e as Error).message;
    return;
  }
  const wk = params.get('weather') as WeatherKind | null;
  if (wk) {
    app.setWeather(wk);
    app.weather.snap(app.t);
  }
  if (params.has('yaw')) app.rig.lookAt((num('yaw', 0) * Math.PI) / 180, (num('pitch', 4) * Math.PI) / 180, num('fov', 58));
  if (params.has('speed')) app.speed = num('speed', 1);
  if (params.has('paused')) app.paused = true;
  app.jumpTo(app.t); // 让曝光与天气立刻对齐
  app.rig.view = { ...app.rig.targetView };
  const scale = num('scale', 1);
  app.resize(scale);
  window.addEventListener('resize', () => app.resize());
  const ui = initUI(app, params.has('noui'));
  loading?.classList.add('done');
  setTimeout(() => loading?.remove(), 1200);
  // 自适应分辨率：帧间隔持续偏长时降低内部渲染分辨率，宽裕时再升回去
  let curScale = scale;
  let acc = 0;
  let accN = 0;
  let lastLoop = performance.now();
  let lastAdjust = performance.now();
  const auto = !params.has('scale');
  const loop = () => {
    if ((window as unknown as { __stop?: boolean }).__stop) return;
    const nowL = performance.now();
    const dt = nowL - lastLoop;
    lastLoop = nowL;
    if (auto && dt < 500) {
      acc += dt;
      accN++;
      if (nowL - lastAdjust > 2500 && accN > 20) {
        const avg = acc / accN;
        let ns = curScale;
        if (avg > 30) ns = Math.max(0.5, curScale * 0.85);
        else if (avg < 17.5 && curScale < 1) ns = Math.min(1, curScale * 1.1);
        if (Math.abs(ns - curScale) > 0.01) {
          curScale = ns;
          app.resize(curScale);
        }
        acc = 0;
        accN = 0;
        lastAdjust = nowL;
      }
    }
    // 测试参数：固定云量
    if (params.has('cover')) U.uCloudCover.value = num('cover', 0);
    if (params.has('nospace')) U.uHasSpace.value = 0;
    app.render();
    ui.update();
    (window as unknown as { __frames: number }).__frames = ((window as unknown as { __frames: number }).__frames || 0) + 1;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  (window as unknown as { app: App }).app = app;
}

main();
