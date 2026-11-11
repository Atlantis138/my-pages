// 飞行器示意图用的小画布：负责尺寸、高分屏、只在看得见时才画、换主题时重画。
// draw(c, w, h, now) 用 CSS 像素作图；live() 返回 true 时每帧都画（比如在自转），否则只在需要时画。

export function createSketch(canvas, draw, live = () => false) {
  const c = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, dirty = true, visible = false, raf = 0;
  const tick = now => {
    raf = 0;
    if (!visible) return;
    if (w && (dirty || live())) { dirty = false; c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h); draw(c, w, h, now); }
    raf = requestAnimationFrame(tick);
  };
  const wake = () => { dirty = true; if (visible && !raf) raf = requestAnimationFrame(tick); };
  new ResizeObserver(() => {
    const r = canvas.getBoundingClientRect(); w = r.width; h = r.height; dpr = Math.min(2.5, devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); wake();
  }).observe(canvas);
  new IntersectionObserver(es => { visible = es[es.length - 1].isIntersecting; wake(); }).observe(canvas);
  document.addEventListener('tokenschange', wake);
  return { invalidate: wake };
}
