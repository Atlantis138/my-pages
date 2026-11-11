// 任务注册表：图集首页和任务页的导航都从这里读。顺序即首页卡片和“上一个 / 下一个”的顺序（按发射时间）。
// 新增任务：建好 missions/<id>/ 之后在这里加一项，见 ../GUIDE.md。
//
// id      文件夹名，也是主题类名 .theme-<id>
// code    卡片上的大字（拉丁字母，用任务自己的展示字体）
// zh      中文全名        short  导航里用的短名
// agency  机构            years  起止年份
// gfonts  卡片要用到的字体在 Google Fonts 上的写法（展示字体、等宽字体各一项；与任务页 <head> 里的保持一致）
// tags    两三个关键词    blurb  一两句话的介绍
// stats   卡片底部的三组数字 [数值, 说明]

export const MISSIONS = [
  {
    id: 'isee3', code: 'ISEE-3', zh: '国际日地探测器 3 号', short: 'ISEE-3',
    agency: 'NASA / ESA', years: '1978—2014', gfonts: ['Big+Shoulders+Display:wght@900', 'IBM+Plex+Mono:wght@500'],
    tags: ['日地 L1 晕轨道', '月球借力', '彗星'],
    blurb: '第一个飞上晕轨道的航天器。借 5 次月球引力穿过地球磁尾，再被甩向太阳轨道，成为第一个飞越彗星的探测器；36 年后又被一支民间团队重新唤醒。',
    stats: [['5', '次月球借力'], ['119 km', '最后一次掠过月面'], ['36 年', '发射到失联']],
  },
  {
    id: 'cassini', code: 'CASSINI', zh: '卡西尼–惠更斯号', short: '卡西尼',
    agency: 'NASA / ESA / ASI', years: '1997—2017', gfonts: ['Saira+Extra+Condensed:wght@800', 'JetBrains+Mono:wght@500'],
    tags: ['行星借力', '土星环绕', '泰坦着陆'],
    blurb: '借金星、金星、地球、木星四次引力飞到土星，绕行 294 圈、飞越泰坦 127 次，把惠更斯号送上泰坦，最后穿过光环内侧坠入土星。',
    stats: [['294', '圈土星轨道'], ['127', '次飞越泰坦'], ['20 年', '发射到坠入土星']],
  },
];
