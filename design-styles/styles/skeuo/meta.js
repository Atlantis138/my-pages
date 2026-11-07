export default {id:"skeuo", group:"ui", gfonts:["Share Tech Mono"], cn:"拟物化", short:"拟物化", en:"Skeuomorphism", era:"2007 – 2013", place:"苹果 iOS 1–6 · Mac OS X",
 origin:"拟物化让界面模仿现实物体，早期 iOS 的木纹书架、皮革日历和黄色便签本都是例子。触屏刚普及时，这些真实质感告诉用户「这个可以按」。2013 年 iOS 7 转向扁平后它迅速退潮，但在音频插件、游戏和硬件控制面板里一直活着。",
 traits:["模拟真实材质：金属、皮革、木纹、纸张","多层渐变、高光和投影，强调立体感","物理隐喻：旋钮、拨杆、指示灯、缝线","凹刻或浮雕文字，用 1px 亮色 text-shadow 实现"],
 good:["音频插件、合成器、音乐 App","游戏与儿童教育","硬件和智能设备控制面板","需要触感和趣味的小组件"],
 avoid:"大型信息产品：视觉负担重，制作成本高，整站使用容易显得过时。",
 palette:[["#2B2D31","阳极黑"],["#A6AAB0","拉丝铝"],["#869C73","LCD 绿"],["#FF3B30","指示灯红"],["#DADDE0","高光"]],
 fonts:"英文：Helvetica、Lucida Grande 配凹刻效果；数码屏用 Share Tech Mono 或 DSEG 七段字体。中文：苹方、思源黑体。",
 css:`.panel {
  background: linear-gradient(#4a4d52, #2b2d31);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.25),
              0 14px 28px rgba(0,0,0,.45);
}
.engraved {
  color: #1c1d20;
  text-shadow: 0 1px 0 rgba(255,255,255,.18);
}`,
 m:[5,5,3], hint:"点击 POWER 拨杆，悬停转动旋钮",
 tile:"background:linear-gradient(#4A4D52,#2B2D31);color:#DADDE0;font-family:'Helvetica Neue',Arial,sans-serif;font-weight:700;text-shadow:0 -1px 0 #000",
 spec:`<div class="sk-panel">
<i class="sk-screw" style="top:8px;left:8px"></i><i class="sk-screw" style="top:8px;right:8px"></i><i class="sk-screw" style="bottom:8px;left:8px"></i><i class="sk-screw" style="bottom:8px;right:8px"></i>
<div class="sk-brand">STUDIO RECORDER · MK II</div>
<div class="sk-lcd"><span class="sk-lcd-l">○ STBY</span><span>00:42</span></div>
<div class="sk-row">
<div class="sk-ctl"><div class="sk-knob"></div><span class="sk-lbl">GAIN</span></div>
<div class="sk-ctl"><button type="button" class="sk-switch" aria-pressed="false" aria-label="电源开关"><i></i></button><span class="sk-lbl">POWER</span></div>
<div class="sk-ctl"><span class="sk-led"></span><span class="sk-lbl">REC</span></div>
</div></div>`,
 setup(el){
  el.addEventListener("click", e=>{
   const sk = e.target.closest(".sk-switch"); if (!sk) return;
   const on = sk.getAttribute("aria-pressed")!=="true";
   sk.setAttribute("aria-pressed", String(on));
   el.classList.toggle("on", on);
   el.querySelector(".sk-lcd-l").textContent = on ? "● REC" : "○ STBY";
  });
 }
};
