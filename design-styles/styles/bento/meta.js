export default {id:"bento", group:"ui", gfonts:["Manrope:wght@300;500;800"], cn:"便当盒网格", short:"便当网格", en:"Bento Grid", era:"2022 → 今", place:"苹果发布会 · Linear · Vercel",
 origin:"便当盒网格得名于日式便当的分格餐盒：一个规整的矩形被分成大小不一的圆角格子，每格装一项内容。苹果在发布会和官网上用它总结产品特性，随后被 Linear、Vercel 等科技公司和大量个人主页采用。它本质上是 CSS Grid 的直接应用，信息密度高却不显乱。",
 traits:["大小不一的圆角卡片拼成规整矩形","每格只讲一件事：一个数字、一张图或一句话","统一的圆角、间距和内边距","重点格占更大面积，自然形成阅读顺序"],
 good:["产品特性介绍页","个人主页与作品集","数据看板、年度总结","设计系统展示"],
 avoid:"需要按顺序讲述的长内容；格子太多或每格信息不聚焦时，会变成杂乱的拼盘。",
 palette:[["#F5F5F7","浅灰底"],["#1D1D1F","深灰"],["#FFFFFF","卡片白"],["#0071E3","链接蓝"],["#FF9F0A","橙"]],
 fonts:"英文：Inter、SF Pro Display、Geist；中文：苹方、MiSans。大数字用很粗或很细的极端字重，比中间字重更有冲击力。",
 css:`.bento {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 120px;
  gap: 12px;
}
.bento .big  { grid-column: span 2; grid-row: span 2; }
.bento .wide { grid-column: span 2; }
.bento > *   { border-radius: 20px; padding: 18px; }`,
 m:[2,2,5], hint:"悬停格子：轻微浮起",
 tile:"background:linear-gradient(90deg,#1D1D1F 0 48%,transparent 48% 52%,#0071E3 52%) top/100% 48% no-repeat,linear-gradient(90deg,#FFF 0 48%,transparent 48% 52%,#FF9F0A 52%) bottom/100% 48% no-repeat,#F5F5F7;color:#F5F5F7;font-family:Manrope,sans-serif;font-weight:800;text-shadow:0 1px 3px rgba(0,0,0,.4)",
 spec:`<div class="bt-grid">
<div class="bt-c bt-big"><small>续航</small><b>22<span>小时</span></b><p>一整天，不用找插座。</p></div>
<div class="bt-c bt-wide bt-grad"><small>材质</small><b>航空级铝</b></div>
<div class="bt-c bt-ring"><span class="bt-r"><i>87%</i></span></div>
<div class="bt-c bt-star"><b>4.9</b><small>用户评分</small></div>
<div class="bt-c bt-wide bt-blue"><small>配色</small><span class="bt-dots"><i style="background:#1D1D1F"></i><i style="background:#F5F5F7"></i><i style="background:#FF9F0A"></i><i style="background:#30D158"></i></span></div>
<div class="bt-c bt-wide"><small>语言</small><b class="bt-l">40+ 种</b></div>
</div>`};
