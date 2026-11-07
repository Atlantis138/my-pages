export default {id:"flat", group:"ui", cn:"扁平化", short:"扁平化", en:"Flat Design", era:"2010 – 2015", place:"Windows Phone Metro → iOS 7",
 origin:"微软 2010 年的 Metro 设计语言最早把界面彻底「压平」，2013 年 iOS 7 让扁平化成为全行业的默认选择。它去掉了所有模拟质感，只留下纯色、简洁图标和排版。后来的「扁平 2.0」又补回少量阴影，用来解决按钮看起来不能点的问题。",
 traits:["纯色块，不用渐变、纹理和投影","简洁的线性或色块图标","高饱和但彼此协调的色板","排版与色彩承担全部层级"],
 good:["移动 App 与响应式网站","信息图、插画式着陆页","图标系统、仪表盘","几乎所有通用产品"],
 avoid:"完全扁平时，按钮和普通色块很难区分。可点击元素需要额外提示，比如颜色、下划线或轻微阴影。",
 palette:[["#1ABC9C","绿松石"],["#3498DB","彼得河蓝"],["#F1C40F","向日葵"],["#E74C3C","茜红"],["#2C3E50","午夜蓝"]],
 fonts:"英文：Open Sans、Lato、Source Sans 3；中文：思源黑体、HarmonyOS Sans。示例色板取自 2013 年流行的 Flat UI Colors。",
 css:`.btn {
  background: #1ABC9C;
  color: #fff;
  border: 0;
  border-radius: 4px;
}
.btn:hover { background: #16A085; }
.mountain {
  background: #2C3E50;
  clip-path: polygon(0 100%, 50% 0, 100% 100%);
}`,
 m:[2,1,4], hint:"悬停按钮查看颜色变化",
 tile:"background:#1ABC9C;color:#FFF;font-family:'Noto Sans SC',sans-serif;font-weight:900",
 spec:`<div class="fl-in"><div class="fl-art"><span class="fl-sun"></span><span class="fl-m1"></span><span class="fl-m2"></span><span class="fl-hill"></span></div>
<div class="fl-side"><h3>扁平化</h3><p>去掉阴影与纹理，只留色彩和形状。</p>
<div class="fl-tiles"><span style="background:#E74C3C">@</span><span style="background:#F1C40F">★</span><span style="background:#9B59B6">♫</span><span style="background:#2C3E50">✓</span></div>
<button class="fl-btn" type="button">开始使用</button></div></div>`};
