export default {id:"grunge", group:"rebel", gfonts:["Permanent Marker","Rubik Dirt","Special Elite"], cn:"垃圾摇滚风", short:"Grunge", en:"Grunge", era:"1990s · 持续回潮", place:"西雅图摇滚 · 《Ray Gun》杂志",
 origin:"Grunge 原是 90 年代初西雅图的摇滚乐风格，涅槃乐队是代表。平面设计上，大卫·卡森为音乐杂志《Ray Gun》做的版式成了它的视觉标志：文字被撕碎、叠印、倒置，甚至故意让人读不清。复印机噪点、胶带、污渍和手写涂鸦都是常用素材，表达的是对干净商业设计的厌倦。",
 traits:["脏污纹理、复印噪点、撕纸边缘","套印错位、文字叠压，打破网格","打字机字体与马克笔手写混用","胶带、污渍、涂改等手工痕迹"],
 good:["乐队、独立音乐与厂牌","街头潮牌、滑板文化","艺术展、独立杂志专题","游戏与影视预告页"],
 avoid:"任何需要清晰传达信息的页面：可读性正是它主动放弃的东西。",
 palette:[["#D9D2C3","复印纸"],["#1B1B1B","炭黑"],["#8B1E1E","锈红"],["#6F6A5E","污灰"],["#E4C04A","胶带黄"]],
 fonts:"英文：Special Elite、Permanent Marker、Rubik Dirt；中文：手写类或做旧类字体。纹理可以用 SVG feTurbulence 生成，不必用图片。",
 css:`.torn {
  clip-path: polygon(0 6%, 6% 0, 13% 5%, 21% 1%, 30% 6%, 41% 0,
                     52% 5%, 61% 1%, 72% 6%, 83% 0, 92% 5%, 100% 2%,
                     100% 100%, 0 100%);   /* 撕纸边 */
}
.misprint { text-shadow: 4px 2px 0 rgba(139,30,30,.85); }
.tape { background: rgba(228,192,74,.72); transform: rotate(-14deg); }`,
 m:[5,3,1], hint:"悬停：纸片和涂鸦错位",
 tile:"background:#D9D2C3;color:#1B1B1B;font-family:'Rubik Dirt','Special Elite',sans-serif;text-shadow:2px 1px 0 #8B1E1E",
 spec:`<div class="gr-noise"></div><span class="gr-stain gr-s1"></span><span class="gr-stain gr-s2"></span><p class="gr-upside">SIDE B · 33 RPM</p>
<div class="gr-paper"><p class="gr-type">ISSUE NO.07 — FALL '93</p><h3>NOISE</h3></div>
<span class="gr-tape gr-t1"></span><span class="gr-tape gr-t2"></span>
<p class="gr-cn">噪音，也是一种信号。</p>
<p class="gr-marker">DON'T READ<br>THE MANUAL</p>`};
