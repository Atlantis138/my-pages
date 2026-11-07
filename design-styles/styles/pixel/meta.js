export default {id:"pixel", group:"retro", gfonts:["Press Start 2P","VT323"], cn:"像素复古", short:"像素复古", en:"Pixel Art / 8-bit", era:"1980s → 今", place:"街机与家用游戏机",
 origin:"像素风来自 8 位、16 位游戏机的硬件限制：分辨率很低，每个角色只能用几种颜色。这些限制反而塑造出一种清晰、可爱的美学，今天广泛用于独立游戏和怀旧主题网页。标本的配色取自 PICO-8 虚拟游戏机的官方 16 色调色板。",
 traits:["像素字体与方块图形，放大时不做平滑","有限调色板，例如 PICO-8 的 16 色","阶梯边框、对话框、血条等游戏界面元素","逐帧动画（CSS steps()）与闪烁提示"],
 good:["游戏与游戏化产品","开发者彩蛋、404 页面","怀旧主题活动","儿童与教育互动"],
 avoid:"正文和小字号：像素字体在 12px 以下几乎无法阅读，可选的中文像素字体也很少。",
 palette:[["#1D2B53","深蓝"],["#7E2553","酒红"],["#FF004D","红"],["#FFEC27","黄"],["#29ADFF","蓝"],["#FFF1E8","米白"]],
 fonts:"英文：Press Start 2P、VT323、Silkscreen；中文：Zpix 最地道，方正像素系列也可以，都需要自行托管字体文件。",
 css:`.sprite { image-rendering: pixelated; }
.box {   /* 缺角像素边框 */
  box-shadow:  0 -4px 0 #FFF1E8,  0 4px 0 #FFF1E8,
              -4px 0 0 #FFF1E8,  4px 0 0 #FFF1E8;
}
.blink { animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }`,
 m:[4,3,2], hint:"闪烁用 steps() 逐帧动画实现",
 tile:"background:#1D2B53;color:#FFEC27;font-family:'Press Start 2P',monospace;font-size:15px;text-shadow:2px 2px 0 #7E2553",
 spec:`<span class="px-stars"></span>
<div class="px-hud"><span>1UP 004200</span><span class="px-lives"><i class="px-heart"></i><i class="px-heart"></i><i class="px-heart px-empty"></i></span></div>
<div class="px-mid"><h3>LEVEL 25</h3><div class="px-box"><p>A WILD DESIGNER<br>APPEARED!</p><p class="px-menu"><span class="px-cur">&gt;</span> FIGHT&nbsp;&nbsp;STYLE<br>&nbsp;&nbsp;ITEM&nbsp;&nbsp;&nbsp;RUN</p></div></div>
<div class="px-start">PRESS START</div>`,
 setup(el){
  const heart = [".XX.XX.","XXXXXXX","XXXXXXX",".XXXXX.","..XXX..","...X..."];
  const sh = c => heart.flatMap((row,y)=>[...row].map((ch,x)=>ch==="X"?`${x*3}px ${y*3}px 0 ${c}`:null)).filter(Boolean).join(",");
  el.querySelectorAll(".px-heart").forEach(h=>h.style.setProperty("--heart", sh(h.classList.contains("px-empty")?"#5F574F":"#FF004D")));
  const stars=[]; for(let i=0;i<46;i++){stars.push(`${(i*137)%640}px ${(i*71+23)%430}px 0 ${i%6?"#5F574F":"#FFF1E8"}`)}
  el.querySelectorAll(".px-stars").forEach(s=>s.style.setProperty("--stars", stars.join(",")));
 }
};
