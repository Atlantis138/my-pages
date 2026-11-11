// 冒烟测试：打开图集首页、注册表里的每个任务和模板任务，把每个阶段都走一遍，
// 检查没有脚本报错、画布上确实画了东西、窄屏不出现横向滚动条。
// 用法（在 space-missions/ 目录下）：node tools/smoke.mjs
// 需要本机装有 playwright（npm i -D playwright；全局安装的话加上 NODE_PATH=$(npm root -g)）。
// 自带一个只读的静态文件服务器，不依赖别的工具。失败时以非零状态退出。

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

let chromium, devices;
try { ({ chromium, devices } = createRequire(import.meta.url)('playwright')); }   // require 也认全局安装（NODE_PATH）
catch { console.error('没有找到 playwright：先运行 npm i -D playwright && npx playwright install chromium'); process.exit(2); }

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^[/\\]+/, '');
  if (p === '' || p.endsWith('/') || p.endsWith('\\')) p += 'index.html';
  try { const buf = await readFile(join(ROOT, p)); res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' }); res.end(buf); }
  catch { res.writeHead(404); res.end('not found'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

const { MISSIONS } = await import('../missions/registry.js');
const pages = [...MISSIONS.map(m => m.id), '_template'];
let failed = 0;
const check = (ok, msg) => { if (!ok) failed++; console.log((ok ? '  ok   ' : '  FAIL ') + msg); };

const browser = await chromium.launch();
for (const [label, opts] of [['桌面', { viewport: { width: 1440, height: 900 } }], ['手机', { ...devices['iPhone 13'] }]]) {
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ ...opts, colorScheme: scheme });
    const page = await ctx.newPage(), errs = [];
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', e => errs.push(e.message));
    console.log(`\n${label} · ${scheme}`);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    check(await page.locator('.card').count() === MISSIONS.length, `首页列出 ${MISSIONS.length} 个任务`);
    check(await page.locator('.thumb svg').count() === MISSIONS.length, '每张卡片都有缩略图（没有就运行 node tools/thumbs.mjs）');
    for (const id of pages) {
      await page.goto(`${BASE}missions/${id}/`, { waitUntil: 'networkidle' });
      const ready = await page.waitForFunction(() => window.__mission, null, { timeout: 15000 }).then(() => true, () => false);
      if (!ready) { check(false, `${id}: 页面没有启动`); continue; }
      const n = await page.evaluate(() => window.__mission.segments.length);
      let drawn = true;
      for (let i = 0; i < n; i++) {
        await page.evaluate(i => window.__mission.jumpSeg(i), i);
        await page.waitForTimeout(350);
        // 画布上非透明像素的比例；任何阶段都不该是一张白纸
        const fill = await page.evaluate(() => { const c = document.getElementById('cv'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let k = 0; for (let j = 3; j < d.length; j += 64) if (d[j] > 0) k++; return k / (d.length / 64); });
        if (fill < 0.002) { drawn = false; console.log(`         阶段 ${i + 1} 的画布几乎是空的（${(fill * 100).toFixed(2)}%）`); }
      }
      check(drawn, `${id}: ${n} 个阶段都画出来了`);
      check(await page.locator('.ch[data-seg]').count() === n, `${id}: 日志里的章节数与阶段数一致`);
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${id}: 没有横向滚动条`);
    }
    check(errs.length === 0, `没有脚本报错${errs.length ? '：' + errs.slice(0, 3).join(' | ') : ''}`);
    await ctx.close();
  }
}
await browser.close(); server.close();
console.log(failed ? `\n${failed} 项没有通过` : '\n全部通过');
process.exit(failed ? 1 : 0);
