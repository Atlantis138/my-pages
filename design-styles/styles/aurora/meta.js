export default {id:"aurora", group:"ui", gfonts:["Sora:wght@600"], cn:"弥散渐变", short:"弥散渐变", en:"Aurora / Mesh Gradient", era:"2018 → 今", place:"Stripe 官网 · macOS 壁纸 · AI 产品",
 origin:"弥散渐变用几块大面积模糊的色彩光斑叠出流动的渐变，像极光，也像光线穿过彩色玻璃。2020 年前后 Stripe 官网用 WebGL 做的动态渐变让它广为人知，macOS Big Sur 的壁纸进一步推广。近几年它几乎成了 AI 和 SaaS 产品官网的默认外观，想用出新意，要在配色和构图上多下功夫。",
 traits:["多个大面积模糊光斑相互融合","叠一层细颗粒噪点，避免色带，增加质感","深色或纯白背景，配大号无衬线标题","光斑缓慢流动，营造氛围"],
 good:["SaaS、AI 与科技产品官网","发布会、产品首屏","音乐封面、活动主视觉","卡片或按钮的氛围背景"],
 avoid:"已经被大量使用，容易同质化；光斑颜色太跳会抢走正文的注意力。",
 palette:[["#0B0C1E","深夜"],["#7B5CFF","电光紫"],["#22D3EE","冰青"],["#FF6AB0","霓粉"],["#FFC56B","暖金"]],
 fonts:"英文：Sora、Inter Tight、General Sans；中文：MiSans、HarmonyOS Sans。标题字距收紧到 -0.03em 左右。",
 css:`.aurora::before {
  content: ""; position: absolute; inset: -25%;
  background:
    radial-gradient(38% 42% at 25% 35%, #7B5CFF, transparent 70%),
    radial-gradient(32% 40% at 78% 30%, #22D3EE, transparent 70%),
    radial-gradient(40% 40% at 60% 80%, #FF6AB0, transparent 70%);
  filter: blur(30px);
  animation: drift 14s ease-in-out infinite alternate;
}
/* 颗粒：SVG feTurbulence 生成噪点，mix-blend-mode: overlay 叠加 */`,
 m:[3,2,4], hint:"光斑缓慢流动，上面叠了一层颗粒噪点",
 tile:"background:radial-gradient(60% 60% at 25% 30%,#7B5CFF,transparent),radial-gradient(60% 60% at 80% 75%,#22D3EE,transparent),radial-gradient(50% 50% at 70% 20%,#FF6AB0,transparent),#0B0C1E;color:#FFF;font-family:Sora,sans-serif;font-weight:600",
 spec:`<div class="au-bg"></div><div class="au-grain"></div><div class="au-c"><span class="au-pill">v4.0 新版本已发布 →</span><h3>Think in<br>color.</h3><p>让每一个想法都带着光。</p><div class="au-btns"><button class="au-b1" type="button">免费试用</button><button class="au-b2" type="button">观看演示</button></div></div>`};
