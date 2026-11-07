export default {id:"clay", group:"ui", gfonts:["Fredoka:wght@500;700"], cn:"黏土拟态", short:"黏土拟态", en:"Claymorphism", era:"2021 → 今", place:"Dribbble · 3D 插画潮流",
 origin:"黏土拟态由设计师 Michał Malewicz 在 2021 年命名，紧跟在新拟态和玻璃拟态之后。它让元素看起来像一团圆润的黏土或充气玩具：外面有柔和的投影，里面用一亮一暗两道 inset 阴影做出体积。和新拟态不同，它的每个元素都有自己的颜色，会从背景上「浮」起来，对比度也好得多。",
 traits:["超大圆角，形状圆润饱满","外投影加两道内阴影（上亮下暗）塑造体积","柔和的糖果色，每个元素自带颜色","常配 3D 风格的图标与吉祥物插画"],
 good:["儿童、教育类产品","休闲游戏、社交 App","品牌吉祥物与营销插画","引导页、空状态"],
 avoid:"专业工具和严肃行业：显得幼稚；多层阴影用在长列表里也会拖累渲染性能。",
 palette:[["#FFE8F0","樱花底"],["#9AD8FF","云朵蓝"],["#FFB86B","杏橙"],["#B79CFF","薰衣草"],["#3D2C5C","葡萄紫"]],
 fonts:"英文：Fredoka、Nunito、Baloo 2；中文：阿里妈妈方圆体、站酷快乐体。字重用到 600 以上，才配得上圆润的形状。",
 css:`.clay {
  border-radius: 32px;
  background: #9AD8FF;
  box-shadow: 14px 14px 28px rgba(61,44,92,.18),
              inset -8px -8px 16px rgba(0,0,0,.12),
              inset 8px 8px 16px rgba(255,255,255,.65);
}
.clay:active { transform: scale(.92, .86); }   /* 被按扁 */`,
 m:[4,3,4], hint:"按住按钮：黏土被压扁",
 tile:"background:#9AD8FF;color:#3D2C5C;font-family:Fredoka,sans-serif;font-weight:700;border-radius:22px;box-shadow:inset -5px -5px 10px rgba(0,0,0,.12),inset 5px 5px 10px rgba(255,255,255,.65)",
 spec:`<span class="cl-ball cl-b1"></span><span class="cl-ball cl-b2"></span><span class="cl-ball cl-b3"></span>
<div class="cl-card"><div class="cl-buddy"><i></i><i></i><b></b></div><h3>Play Time!</h3><p>今天也要开开心心</p><div class="cl-row"><button class="cl-btn" type="button">开始</button><button class="cl-btn cl-alt" type="button" aria-label="收藏">★</button></div></div>`};
