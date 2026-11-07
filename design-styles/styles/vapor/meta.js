export default {id:"vapor", group:"retro", cn:"蒸汽波", short:"蒸汽波", en:"Vaporwave", era:"2010 – 2013 · 持续流行", place:"互联网音乐亚文化",
 origin:"蒸汽波最早是一种音乐流派：把 80、90 年代的商场背景音乐和广告配乐放慢、切碎、重新拼贴。2011 年 Macintosh Plus 的专辑《Floral Shoppe》是标志性作品，封面上的希腊雕像、粉紫渐变和日文标题定义了它的视觉。它对早期消费主义和数字乌托邦既怀念又带着讽刺。",
 traits:["粉紫、青、橙的落日渐变","透视网格地面与条纹夕阳","Windows 95 窗口、早期 3D 渲染、希腊雕像","全角英文（ＡＥＳＴＨＥＴＩＣ）和日文片假名"],
 good:["音乐人、电子音乐活动","潮流与复古主题页","个人主页、创意实验","社交媒体专题"],
 avoid:"需要明确转化的商业页面：风格里的讽刺意味很重，容易被读成玩梗。",
 palette:[["#1B0B3A","午夜紫"],["#C2357E","霓虹洋红"],["#FF9A76","落日橙"],["#FF4FD8","网格粉"],["#C0C0C0","Win95 灰"]],
 fonts:"英文：Times New Roman 斜体、Monoton、VT323；全角字符用中日文字体即可，例如思源黑体、Noto Sans JP。",
 css:`.floor {
  background-image:
    linear-gradient(#FF4FD8 2px, transparent 2px),
    linear-gradient(90deg, #FF4FD8 2px, transparent 2px);
  background-size: 44px 44px;
  transform: perspective(180px) rotateX(62deg);
}
.win95 {
  background: #C0C0C0;
  border: 2px solid;
  border-color: #fff #404040 #404040 #fff;   /* 立体斜面 */
}`,
 m:[5,3,2], hint:"网格地面在无限前进",
 tile:"background:linear-gradient(180deg,#4A1670,#C2357E 60%,#FF9A76);color:#FFF;font-family:'Times New Roman',serif;font-style:italic;font-weight:700;text-shadow:2px 2px 0 #00E5FF,-1px -1px 0 #FF4FD8",
 spec:`<div class="vp-sun"></div><div class="vp-floor"><div class="vp-grid"></div></div>
<p class="vp-title">ＳＵＮＳＥＴ<span>夕日の記憶</span></p>
<div class="vp-win"><div class="vp-tb"><span>ａｅｓｔｈｅｔｉｃｓ.exe</span><span class="vp-btns"><i>_</i><i>□</i><i>×</i></span></div>
<div class="vp-body"><p>ヴェイパーウェイヴ</p><div class="vp-prog"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><button class="vp-ok" type="button">ＯＫ</button></div></div>`};
