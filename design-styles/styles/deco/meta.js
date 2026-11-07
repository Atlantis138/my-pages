export default {id:"deco", group:"modern", gfonts:["Poiret One","Limelight"], cn:"装饰艺术", short:"装饰艺术", en:"Art Deco", era:"1920s – 1930s", place:"法国巴黎 → 纽约 / 上海",
 origin:"名称来自 1925 年巴黎的国际现代装饰与工业艺术博览会。它把机器时代的几何感和奢华材料结合在一起，纽约克莱斯勒大厦的尖顶、上海外滩的老建筑、《了不起的盖茨比》里的派对都属于这套语汇。放到网页上，它意味着对称、精致的细线和金色。",
 traits:["严格中轴对称，内容居中","放射线、扇形、阶梯形和重复几何纹样","金色、黄铜色配深黑、墨绿或藏青","高而窄的装饰字体，字距拉得很开"],
 good:["酒店、餐厅、酒吧","奢侈品与珠宝","婚礼与活动邀请函","剧院、爵士音乐节"],
 avoid:"日常工具与 SaaS：仪式感太重，反复使用容易疲劳；细金线在小屏幕上也容易糊成一片。",
 palette:[["#0E1D19","孔雀墨"],["#C9A45C","香槟金"],["#E8DCC0","象牙"],["#1F3A33","墨绿"],["#7A2E2A","勃艮第"]],
 fonts:"英文：Limelight、Poiret One、Cinzel Decorative；中文：思源宋体、方正清刻本悦宋。标题字距加到 0.3em 左右时效果最明显。",
 css:`.sunburst {
  background: repeating-conic-gradient(from -90deg at 50% 100%,
    #C9A45C22 0 2.5deg, transparent 2.5deg 8deg);
}
.frame {
  border: 1px solid #C9A45C;
  outline: 1px solid #C9A45C;
  outline-offset: 6px;          /* 双线框 */
}
h1 { font-family: Limelight; letter-spacing: .08em; }`,
 m:[4,3,3], hint:"悬停按钮：金色填充",
 tile:"background:#0E1D19;color:#D9B56A;font-family:Limelight,serif",
 spec:`<div class="dc-frame"><div class="dc-fan"></div><p class="dc-est">EST. MCMXXV</p><h3>THE GRAND</h3><p class="dc-cn">大饭店 · 金色年代</p><div class="dc-rule"><span></span>◆<span></span></div><button class="dc-btn" type="button">RESERVE</button></div>`};
