export default {id:"swiss", group:"modern", cn:"瑞士国际主义", short:"瑞士风格", en:"International Typographic Style", era:"1950s – 1970s", place:"瑞士 · 苏黎世 / 巴塞尔",
 origin:"又叫国际主义平面风格，代表人物有约瑟夫·米勒-布罗克曼和阿明·霍夫曼，1957 年诞生的 Helvetica 字体就是它的产物。核心信念是设计应当客观、清晰、可复用，网格是组织一切的工具。今天绝大多数「看起来很专业」的网站都直接继承了它。",
 traits:["严格的模块网格，元素对齐到栏线","无衬线字体，如 Helvetica、Akzidenz-Grotesk","左对齐，右侧自然参差，不强行两端对齐","大小字号强烈对比，红黑白是经典配色"],
 good:["企业官网与作品集","文档、数据与信息设计","新闻与长文排版","设计系统的基础风格"],
 avoid:"需要情绪和亲和力的消费品牌：做得不到位会显得冷淡，像模板。",
 palette:[["#E30613","瑞士红"],["#0E0E0E","黑"],["#F3F2EE","白"],["#8C8C8C","灰"]],
 fonts:"英文：Helvetica Neue、Inter、Neue Haas Grotesk；中文：思源黑体、苹方。字重只用常规和粗体两级，层级靠字号拉开。",
 css:`.page {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  column-gap: 24px;
}
h1 {
  font: 700 clamp(3rem, 9vw, 8rem)/0.9 "Helvetica Neue", Arial;
  letter-spacing: -0.04em;
}
p { text-align: left; hyphens: auto; }`,
 m:[2,2,5], hint:"悬停：红色模块沿网格延展",
 tile:"background:#E30613;color:#FFF;font-family:'Helvetica Neue',Arial,sans-serif;font-weight:700;letter-spacing:-.04em",
 spec:`<div class="sw-num">57</div><div class="sw-red"></div><h3 class="sw-h">Neue<br>Grafik</h3><p class="sw-p">网格是秩序的工具。<br>Das Raster als Ordnungssystem.</p><p class="sw-meta">Zürich<br>Helvetica, 1957</p>`};
