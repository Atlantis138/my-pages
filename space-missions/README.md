# 深空航迹

航天任务的三维轨道图集：把一次任务的整条航迹画在一张可以转动、可以播放的图上。轨迹来自实测星历或官方轨道解。

| 任务 | 文件夹 | 轨道数据 |
|---|---|---|
| ISEE-3 / ICE（1978—2014） | `missions/isee3/` | NSSDC 逐小时星历的动力学重建；JPL 2014 轨道解 |
| 卡西尼–惠更斯号（1997—2017） | `missions/cassini/` | JPL Horizons 最终重建轨道 |

## 结构

```
space-missions/
├── index.html        图集首页
├── shared/           共用的引擎：相机与绘图（scene.js）、时间轴与交互（player.js）、
│                     天文与轨迹工具（astro.js、track.js、util.js）、公共样式（mission.css）
├── missions/
│   ├── registry.js   任务注册表
│   ├── _template/    最小可运行的模板任务
│   ├── isee3/        每个任务一个文件夹：页面、主题、任务脚本、数据、处理脚本
│   └── cassini/
└── tools/            冒烟测试、缩略图生成
```

每个任务页由三部分组成：`index.html`（版面与文字）、`mission.js`（阶段、事件、机位、怎么画）和 `data/*.json`（由 `recon/` 里的脚本生成的轨道数据）。相机、时间轴、读数、快捷键、深浅色这些全部来自 `shared/`，所以各任务的操作方式完全一样。页面不需要构建。

## 本地预览

页面使用 ES 模块并用 `fetch` 读数据，需要通过 http 访问。在仓库根目录运行 `python -m http.server`，再打开 <http://localhost:8000/space-missions/>。

## 新增任务、修改页面

见 [`GUIDE.md`](GUIDE.md)：目录约定、任务脚本的接口、页面骨架、主题、文字与数字的写法、数据要求和提交前的检查清单。最快的起点是复制 `missions/_template/`。

```
node tools/smoke.mjs     # 冒烟测试：所有页面、所有阶段、深浅色、手机宽度（需要 playwright）
node tools/thumbs.mjs    # 轨道数据变了之后，重新生成首页卡片上的缩略图
```

## 旧地址

这两个任务原先是仓库根目录下各自独立的单文件页面（`cassini-mission/`、`isee3-trajectory/`）。那两个地址现在是跳转页，带 `#t=…` 的分享链接仍然有效。
