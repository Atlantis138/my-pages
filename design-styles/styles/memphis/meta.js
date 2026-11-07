export default {id:"memphis", group:"rebel", gfonts:["Rubik Mono One"], cn:"孟菲斯", short:"孟菲斯", en:"Memphis Design", era:"1981 – 1987", place:"意大利 · 米兰",
 origin:"1981 年，设计师埃托·索特萨斯在米兰组建孟菲斯小组，名字取自鲍勃·迪伦的一首歌。他们故意用廉价的塑料贴面、刺眼的撞色和没有用途的几何形，来对抗现代主义的「好品味」。2010 年代中期，它在网页和插画里重新流行起来。",
 traits:["波浪线、锯齿线、波点、斜纹等图案碎片","粉、青、黄、黑撞色，饱和而轻快","几何形随意漂浮，构图不对称","整体俏皮、反严肃，带着 80 年代气息"],
 good:["节日与营销活动页","儿童、潮流、文创品牌","创意机构与工作室官网","音乐节、派对邀请"],
 avoid:"需要长时间专注的内容：图形密度太高，会干扰阅读和操作。",
 palette:[["#FFD3E2","泡泡粉"],["#3FC1C9","薄荷青"],["#FCE38A","奶油黄"],["#364F6B","石板蓝"],["#111111","黑"]],
 fonts:"英文：Rubik Mono One、Bungee、Righteous；中文：站酷快乐体、站酷庆科黄油体。标题可以加错位的彩色硬投影。",
 css:`.dots {
  background-image: radial-gradient(#111 2px, transparent 2.6px);
  background-size: 14px 14px;
}
.stripes {
  background: repeating-linear-gradient(45deg,
    #FCE38A 0 6px, #111 6px 9px);
}
h1 { text-shadow: 5px 5px 0 #3FC1C9; }`,
 m:[5,3,2], hint:"悬停：图形四散",
 tile:"background:#FFD3E2;color:#111;font-family:'Rubik Mono One',sans-serif;text-shadow:3px 3px 0 #3FC1C9",
 spec:`<span class="mp-s mp-dots"></span>
<svg class="mp-s mp-squig" viewBox="0 0 210 40" aria-hidden="true"><path fill="none" d="M5 20 Q 25 0 45 20 T 85 20 T 125 20 T 165 20 T 205 20"/></svg>
<svg class="mp-s mp-zig" viewBox="0 0 120 30" aria-hidden="true"><polyline fill="none" points="0,25 15,5 30,25 45,5 60,25 75,5 90,25 105,5 120,25"/></svg>
<span class="mp-s mp-tri"></span><span class="mp-s mp-circ"></span><span class="mp-s mp-half"></span><span class="mp-s mp-stick"></span>
<div class="mp-text"><h3>MEMPHIS</h3><span class="mp-tag">MILANO · 1981</span></div>`};
