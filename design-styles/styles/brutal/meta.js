export default {id:"brutal", group:"rebel", cn:"野兽派", short:"野兽派", en:"Web Brutalism", era:"2014 →", place:"名称借自 1950s 粗野主义建筑",
 origin:"粗野主义原指 1950 年代裸露混凝土的建筑风格。2014 年前后，Pascal Deville 创建 brutalistwebsites.com，收集一类刻意「不设计」的网站：浏览器默认字体、蓝色下划线链接、没有圆角也没有阴影。它反对千篇一律的模板网站，强调内容的原始、直接和坦率。",
 traits:["保留浏览器默认样式：Times 字体、蓝色下划线链接","无圆角、无阴影、无缓动","等宽字体、生硬边框、原生 HTML 元素","故意粗糙甚至「难看」，结构直接暴露"],
 good:["艺术家与独立创作者个人站","实验项目、宣言式页面","独立出版与小众媒体","开发者个人主页"],
 avoid:"电商、金融等需要信任感的产品：用户可能以为网站坏了。",
 palette:[["#FFFFFF","白"],["#000000","黑"],["#0000EE","默认链接蓝"],["#551A8B","已访问紫"],["#FFFF00","警示黄"]],
 fonts:"Times New Roman、Courier New、Arial 这类系统默认字体本身就是风格的一部分；中文直接用系统宋体或黑体。",
 css:`body  { font-family: "Times New Roman", serif; margin: 8px; }
a     { color: #0000EE; text-decoration: underline; }
a:visited { color: #551A8B; }
table, td { border: 1px solid #000; border-collapse: collapse; }
*     { border-radius: 0 !important; box-shadow: none !important; }`,
 m:[3,1,2], hint:"跑马灯：上世纪网页的遗产",
 tile:"background:#FFF;color:#0000EE;font-family:'Times New Roman',serif;text-decoration:underline",
 spec:`<h3>THIS IS A<br>WEBSITE.</h3>
<p>没有网格，没有圆角，没有设计。<br><span class="br-a">click here</span> · <span class="br-a">[ index ]</span> · <span class="br-a">about.html</span></p>
<hr>
<table><tr><td>last updated</td><td>1999-12-31</td></tr><tr><td>best viewed in</td><td>800 × 600</td></tr></table>
<div class="br-marq"><span>★ UNDER CONSTRUCTION ★ 本站正在施工 ★ UNDER CONSTRUCTION ★ 本站正在施工 ★</span></div>
<p class="br-count">visitors: <b>000417</b></p>`};
