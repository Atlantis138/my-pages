/* 谱系分组与「按目标挑选」表。风格本身的数据在 styles/<id>/meta.js。 */

export const GROUPS = [
  {id:"modern", name:"艺术与印刷源流", en:"ART & PRINT ROOTS", span:"1890s → 今", desc:"网页设计的底层语法：曲线与几何、对称与网格、字体层级，大多来自一百多年来的艺术运动和印刷传统，也包括我们自己的古籍与书画。"},
  {id:"ui", name:"数字界面范式", en:"INTERFACE PARADIGMS", span:"2007 → 今", desc:"屏幕普及之后形成的界面语言。它们围绕同一个问题演化：界面要多像现实世界，用户才知道怎么用？"},
  {id:"rebel", name:"反叛与表达", en:"REBELLION", span:"1981 → 今", desc:"对「好品味」和模板化的反抗。它们故意打破规则，所以辨识度极高。"},
  {id:"retro", name:"怀旧与未来", en:"NOSTALGIA & FUTURES", span:"1980s → 今", desc:"从旧时代的科技里取材，或者想象一个霓虹闪烁的未来。情绪浓烈，适合主题鲜明的页面。"}
];

export const PICKS = [
  ["专业、可信、长期使用", ["swiss","material","minimal","bento"]],
  ["高级、奢华、有仪式感", ["deco","nouveau","minimal"]],
  ["东方韵味、文化传承", ["neochinese","nouveau","minimal"]],
  ["年轻、活泼、有个性", ["neobrutal","memphis","clay","y2k"]],
  ["科技感、未来感", ["cyber","aurora","glass","acid"]],
  ["怀旧、情绪、主题活动", ["pixel","vapor","terminal","skeuo"]],
  ["艺术、实验、态度鲜明", ["brutal","grunge","constructivism","bauhaus"]],
  ["开发者与技术社区", ["terminal","brutal","neobrutal"]],
  ["小组件的局部质感", ["neumorph","clay","glass","skeuo"]],
  ["通用产品打底", ["flat","material","bento"]]
];
