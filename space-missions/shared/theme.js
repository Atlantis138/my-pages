// 主题：放在 <head> 里同步执行（不是模块），在首次绘制前把 <html data-theme> 定成 light 或 dark。
// 偏好存在 localStorage，图集首页和各任务页共用；没有偏好时跟随系统。
(function () {
  var KEY = 'space-missions:theme', root = document.documentElement, mq = matchMedia('(prefers-color-scheme: dark)');
  function pref() { try { var p = localStorage.getItem(KEY); return p === 'light' || p === 'dark' ? p : 'auto'; } catch (e) { return 'auto'; } }
  function apply() { var p = pref(); root.dataset.theme = p === 'auto' ? (mq.matches ? 'dark' : 'light') : p; root.dataset.themePref = p; }
  apply();
  mq.addEventListener('change', apply);
  window.spaceTheme = {
    get pref() { return pref(); },
    set: function (p) { try { if (p === 'auto') localStorage.removeItem(KEY); else localStorage.setItem(KEY, p); } catch (e) { /* 无痕模式下可能不可写 */ } apply(); },
    cycle: function () { var o = ['auto', 'light', 'dark'], p = o[(o.indexOf(pref()) + 1) % 3]; this.set(p); return p; }
  };
})();
