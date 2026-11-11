// 图集首页：按注册表生成任务卡片。每个任务的 theme.css、展示字体和轨迹缩略图都从它自己的文件夹里取。

import { MISSIONS } from '../missions/registry.js';
import { themeButton } from './chrome.js';

const head = document.head, add = (tag, attrs) => head.appendChild(Object.assign(document.createElement(tag), attrs));
// 各任务的主题令牌（作用在 .theme-<id> 上）和字体
for (const m of MISSIONS) add('link', { rel: 'stylesheet', href: `missions/${m.id}/theme.css` });
const fams = ['Noto+Serif+SC:wght@400;600;900', 'IBM+Plex+Mono:wght@500', ...MISSIONS.flatMap(m => m.gfonts)];
add('link', { rel: 'stylesheet', href: `https://fonts.googleapis.com/css2?${[...new Set(fams)].map(f => 'family=' + f).join('&')}&display=swap` });

document.querySelector('.top').appendChild(themeButton());

const list = document.getElementById('sheets');
list.innerHTML = MISSIONS.map((m, i) => `
  <li>
    <span class="no">${String(i + 1).padStart(2, '0')}</span>
    <a class="card theme-${m.id}" href="missions/${m.id}/">
      <div class="card-text">
        <p class="meta">${m.agency} · <b>${m.years}</b></p>
        <h2><span class="code">${m.code}</span><span class="zh">${m.zh}</span></h2>
        <p class="blurb">${m.blurb}</p>
        <p class="tags">${m.tags.map(t => `<span>${t}</span>`).join('')}</p>
        <span class="open">打开这张图 →</span>
      </div>
      <div class="card-fig">
        <div class="thumb" data-thumb="${m.id}"></div>
        <dl class="stats">${m.stats.map(([v, k]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      </div>
    </a>
  </li>`).join('');

// 缩略图由 tools/thumbs.mjs 从轨道数据生成；内联进来才能用上卡片的主题色
for (const box of list.querySelectorAll('[data-thumb]')) {
  fetch(`missions/${box.dataset.thumb}/thumb.svg`).then(r => r.ok ? r.text() : '').then(svg => { if (svg.startsWith('<svg')) box.innerHTML = svg; }).catch(() => {});
}
