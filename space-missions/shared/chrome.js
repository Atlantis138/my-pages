// 页面公共部件：页首的小导航（回图集、上一个 / 下一个任务）和主题切换按钮。
// 任务页在 <html data-mission="id"> 上写明自己是谁，这里据此从注册表里找到相邻的任务。

import { MISSIONS } from '../missions/registry.js';

const THEME_LABEL = { auto: '跟随系统', light: '浅色', dark: '深色' };

export function themeButton() {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'theme-btn';
  const sync = () => { const p = window.spaceTheme.pref; b.textContent = '主题 · ' + THEME_LABEL[p]; b.setAttribute('aria-label', `主题：${THEME_LABEL[p]}，点击切换`); };
  b.addEventListener('click', () => { window.spaceTheme.cycle(); sync(); });
  sync();
  return b;
}

// 在 .mast 顶上插入导航。hubHref 为图集首页相对当前页的路径。
export function mountCrumbs(hubHref = '../../') {
  const id = document.documentElement.dataset.mission, i = MISSIONS.findIndex(m => m.id === id);
  const mast = document.querySelector('.mast'); if (!mast) return;
  const nav = document.createElement('nav');
  nav.className = 'crumbs'; nav.setAttribute('aria-label', '图集导航');
  const link = (m, arrow, label) => m ? `<a href="../${m.id}/" title="${label}：${m.zh}">${arrow === '←' ? '← ' + m.short : m.short + ' →'}</a>` : '';
  const prev = i > 0 ? MISSIONS[i - 1] : null, next = i >= 0 && i < MISSIONS.length - 1 ? MISSIONS[i + 1] : null;
  nav.innerHTML = `<a class="home" href="${hubHref}">深空航迹</a><span class="sib">${link(prev, '←', '上一个任务')}${link(next, '→', '下一个任务')}</span>`;
  nav.appendChild(themeButton());
  mast.prepend(nav);
}
