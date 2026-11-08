# 设计风格图鉴

25 种网页视觉风格的活体标本。图鉴页（`index.html`）给每种风格一张卡片；部分风格还有一张**完整介绍页**——用该风格本身写成的、介绍该风格的页面。

## 目录结构

```
design-styles/
├── PAGE_GUIDE.md           完整介绍页的制作规范
├── index.html              图鉴页外壳：只有页面骨架，内容由 catalog.js 渲染
├── catalog/                图鉴页自己的代码
│   ├── catalog.css         图鉴外框样式（索引、分组、卡片、挑选表）
│   ├── catalog.js          入口：载入全部风格、合并字体、渲染、通用交互
│   └── taxonomy.js         四个谱系的说明、「按目标挑选」表
└── styles/
    ├── registry.js         风格注册表：有哪些风格、顺序、哪些有完整页
    ├── bauhaus/            每个风格一个文件夹，文件夹名 = 风格 id
    │   ├── meta.js         卡片数据 + 标本 HTML + 可选的 setup(el) 交互
    │   └── specimen.css    标本样式（类名以该风格的前缀开头）
    ├── material/           带完整页的风格多出下面这些文件
    │   ├── meta.js
    │   ├── specimen.css
    │   ├── index.html      完整介绍页
    │   ├── page.css
    │   ├── page.js
    │   └── color.js        （页面自己的模块，按需拆分）
    └── neumorph/
        └── …
```

每个风格的所有东西都在自己的文件夹里，互不依赖。图鉴页只通过 `registry.js` 知道有哪些风格。

## 新增一种风格

1. 新建 `styles/<id>/meta.js`，默认导出一个对象，字段参考已有风格：
   `id`、`group`（`modern` / `ui` / `rebel` / `retro`）、`gfonts`（Google Fonts 字族，如 `"Manrope:wght@300;800"`）、
   `cn`、`short`、`en`、`era`、`place`、`origin`、`traits`、`good`、`avoid`、`palette`、`fonts`、`css`、
   `m`（装饰强度 / 实现难度 / 可读性，1–5）、`hint`、`tile`、`spec`，可选 `cls`（标本类名不等于 id 时）、`tileText`、`setup(el)`。
2. 新建 `styles/<id>/specimen.css`，标本根元素的类名是 `.sp-<cls 或 id>`。
3. 在 `styles/registry.js` 的 `STYLES` 里按位置加一行 `{ id: "<id>" }`。编号会自动重排。

## 给某种风格加完整页

1. 在 `styles/<id>/` 里新建 `index.html`（以及需要的 css / js），页面完全按该风格设计，不必沿用其他页面的样式。
2. 在 `registry.js` 里把该行改成 `{ id: "<id>", page: true }`。图鉴卡片会出现「进入完整页面」，索引格右上角出现 ↗。
3. 页面怎么做，见 [`PAGE_GUIDE.md`](PAGE_GUIDE.md)：一页自成一体，只留一个返回图鉴的入口（`../../#s-<id>`），并提供一键复原。

已有完整页：`bauhaus/`（包豪斯）、`swiss/`（瑞士风格）、`material/`（Material Design）、`neumorph/`（新拟态）、`glass/`（玻璃拟态）、`clay/`（黏土拟态）、`brutal/`（野兽派）。

## 本地预览

页面使用 ES 模块，需要通过 http 访问。在仓库根目录运行 `python -m http.server`，再打开 <http://localhost:8000/design-styles/>。
