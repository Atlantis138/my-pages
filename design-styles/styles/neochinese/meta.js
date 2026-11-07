export default {id:"neochinese", group:"modern", gfonts:["Ma Shan Zheng"], cn:"新中式", short:"新中式", en:"Neo-Chinese Aesthetics", era:"2010s → 今", place:"源自宋代美学、文人画与古籍版式",
 origin:"新中式不是某个流派的正式名称，而是近十几年中文设计界对「用现代手法表达传统美学」的统称。它从宋代器物的素雅、文人画的留白、古籍的竖排版式和篆刻印章中取材，再用现代的网格、字体和克制的配色重新组织。博物馆的数字产品和许多茶饮、文旅品牌都是典型。",
 traits:["大量留白，讲究「计白当黑」","竖排文字，宋体或书法做标题","朱红印章作为唯一的高饱和点缀","水墨晕染、传统色、窗棂与云纹"],
 good:["茶、香、器物等生活方式品牌","博物馆、文旅、非遗","节气与传统节日专题","国潮、新消费品牌"],
 avoid:"堆砌龙凤、祥云和大面积金红会显得俗气；竖排只适合短句，网页上的长正文仍应横排。",
 palette:[["#F3EEE3","宣纸"],["#1F1F1F","焦墨"],["#B7312C","朱砂"],["#5B7B7A","青瓷"],["#C8B99A","绢黄"]],
 fonts:"中文：思源宋体、霞鹜文楷、方正清刻本悦宋；书法标题可用马善政体、智莽行，两者都能从 Google Fonts 直接加载。",
 css:`.vertical {
  writing-mode: vertical-rl;
  letter-spacing: .3em;
  font-family: "Noto Serif SC", serif;
}
.seal {
  background: #B7312C; color: #F3EEE3;
  padding: 4px; border-radius: 3px;
  font-family: "Ma Shan Zheng", serif;
}
.ink { background: radial-gradient(#1F1F1FAA, transparent 70%); filter: blur(6px); }`,
 m:[3,3,3], hint:"悬停：远山水墨晕开",
 tileText:"墨",
 tile:"background:#F3EEE3;color:#1F1F1F;font-family:'Ma Shan Zheng','Noto Serif SC',serif;box-shadow:inset -6px -6px 0 -3px #B7312C",
 spec:`<span class="zh-moon"></span><p class="zh-meta">白露 · 卯时</p><span class="zh-ink zh-i3"></span><span class="zh-ink zh-i2"></span><span class="zh-ink zh-i1"></span><div class="zh-col"><div class="zh-tc"><h3>听雨</h3><span class="zh-seal">清欢</span></div><span class="zh-line"></span><p class="zh-poem">山色有无中</p></div>`};
