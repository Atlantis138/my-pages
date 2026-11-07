export default {id:"acid", group:"rebel", gfonts:["Unbounded:wght@800"], cn:"酸性设计", short:"酸性设计", en:"Acid Graphics", era:"2017 → 今", place:"源自 90 年代锐舞海报",
 origin:"酸性设计的源头是 80 年代末到 90 年代的 Acid House 锐舞文化，以及 The Designers Republic 等工作室的海报。2017 年前后，它借助 3D 软件和潮流品牌重新流行：液态铬金属字、被拉伸扭曲的字体、荧光色和大量技术符号。整体冷峻、机械又迷幻，像来自一个过曝的数字未来。",
 traits:["铬金属质感的变形文字","极端拉伸或压扁的宽体字","荧光酸性绿、电紫配黑白","星芒、线框、条形码、坐标等技术符号"],
 good:["电子音乐、锐舞派对","街头潮牌、球鞋发售","实验艺术、时尚大片","游戏与赛事活动"],
 avoid:"主流商业与公共服务：辨识度高，门槛也高，很多用户会觉得刺眼、看不懂。",
 palette:[["#0A0A0A","黑"],["#C6FF00","酸性绿"],["#D9D9D9","铬灰"],["#FFFFFF","白"],["#7A00FF","电紫"]],
 fonts:"英文：Unbounded、Syne、Monument Extended；中文：站酷酷黑、优设标题黑。用 transform: scale() 拉伸文字，比找特殊字体更灵活。",
 css:`.stretch { display: inline-block; transform: scale(1.12, 1.9); }
.star {
  background: #C6FF00;
  clip-path: polygon(50% 0, 56% 40%, 100% 50%, 56% 60%,
                     50% 100%, 44% 60%, 0 50%, 44% 40%);
}
.barcode {
  background: repeating-linear-gradient(90deg,
    #fff 0 2px, transparent 2px 5px, #fff 5px 6px, transparent 6px 9px);
}`,
 m:[5,3,2], hint:"悬停：星芒加速旋转",
 tile:"background:#0A0A0A;color:#C6FF00;font-family:Unbounded,sans-serif;font-weight:800",
 spec:`<div class="ac-lines"></div><span class="ac-ring"></span><span class="ac-star"></span><span class="ac-star ac-s2"></span>
<p class="ac-meta ac-m1">SYS_08 / ▲ 001</p><p class="ac-meta ac-m2">X:0428 Y:1997</p>
<h3 class="ac-title"><span>ACID</span></h3><p class="ac-sub">RAVE · 夜 · 不眠</p>
<div class="ac-bar"></div><p class="ac-meta ac-m3">0428 1997 2077</p>`};
