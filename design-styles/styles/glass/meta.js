export default {id:"glass", group:"ui", gfonts:["Manrope:wght@300;500;800"], cn:"玻璃拟态", short:"玻璃拟态", en:"Glassmorphism", era:"2020 → 今", place:"Windows Aero → macOS Big Sur → Liquid Glass",
 origin:"半透明的模糊面板早在 2007 年 Windows Vista 的 Aero 里就出现过，iOS 7 和 macOS Big Sur 让它回归，2020 年设计圈给它起名「玻璃拟态」。2025 年苹果推出 Liquid Glass 设计语言，这种质感再次成为焦点。CSS 的 backdrop-filter 让它在网页上实现起来非常简单。",
 traits:["半透明背景加背景模糊 backdrop-filter","面板边缘一条细细的高光描边","背后必须有丰富的渐变或光斑，玻璃感才出得来","多层叠放，营造前后纵深"],
 good:["叠在图片或视频上的信息卡","音乐、天气、仪表盘小组件","登录弹窗、导航栏","科技产品着陆页"],
 avoid:"文字对比度取决于背后的内容，很难保证；大面积模糊在低端设备上会掉帧。",
 palette:[["#1B1530","深底"],["#FF5FA2","光斑粉"],["#5B7CFF","光斑蓝"],["#2FE0C4","光斑青"],["#FFFFFF24","玻璃 14%"]],
 fonts:"英文：Inter Display、SF Pro、Plus Jakarta Sans；中文：苹方、思源黑体。数字用细字重的大字号，和模糊背景形成对比。",
 css:`.glass {
  background: rgba(255,255,255,.14);
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 22px;
}`,
 m:[3,3,3], hint:"背后的光斑在缓慢流动",
 tile:"background:linear-gradient(135deg,#FF5FA2,#5B7CFF 70%,#2FE0C4);color:#FFF;font-family:Manrope,sans-serif;font-weight:300",
 spec:`<span class="gl-b gl-b1"></span><span class="gl-b gl-b2"></span><span class="gl-b gl-b3"></span>
<div class="gl-card"><div class="gl-top"><span>大理</span><span>晴转多云</span></div><div class="gl-temp">21°</div>
<div class="gl-hours"><span><small>14时</small>22°</span><span><small>15时</small>22°</span><span><small>16时</small>21°</span><span><small>17时</small>19°</span></div></div>`};
