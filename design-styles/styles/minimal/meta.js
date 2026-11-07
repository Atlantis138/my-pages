export default {id:"minimal", cls:"min", group:"ui", gfonts:["Manrope:wght@300;500;800"], cn:"极简主义", short:"极简主义", en:"Minimalism", era:"2010s →", place:"源自 1960s 极简艺术与日本美学",
 origin:"网页极简主义在 2010 年代随苹果和高端品牌成为主流，思想上可以追溯到 1960 年代的极简艺术、密斯·凡·德·罗的「少即是多」，以及迪特·拉姆斯的「少，但更好」。它看起来最容易，做起来最难：元素越少，每一处间距和字重的偏差都越显眼。",
 traits:["大量留白，留白本身就是构图","元素极少，只有一种强调色或干脆纯黑白","细字重、宽松行距、精确对齐","靠排版层级而不是装饰引导视线"],
 good:["高端产品与品牌官网","摄影与设计作品集","个人博客、长文阅读","SaaS 着陆页"],
 avoid:"功能多、入口多的门户和电商首页：内容一多，极简就变成了「找不到东西」。",
 palette:[["#FAFAF7","米白"],["#121212","近黑"],["#6D6D6D","中灰"],["#E5E5E0","分隔线"]],
 fonts:"英文：Manrope、Inter、Söhne；中文：思源黑体 Light / Regular、苹方。控制在 1 个字族、2 到 3 个字重以内。",
 css:`.hero { padding: 20vh 8vw; }
h1 {
  font: 300 clamp(2.5rem, 6vw, 5rem)/1.05 Manrope, sans-serif;
  letter-spacing: -0.03em;
}
p { max-width: 38ch; color: #6d6d6d; }
a { border-bottom: 1px solid currentColor; text-decoration: none; }`,
 m:[1,3,4], hint:"悬停：底部细线延伸",
 tile:"background:#FAFAF7;color:#121212;font-family:Manrope,sans-serif;font-weight:300",
 spec:`<div class="mn-top"><span>Studio Kōyō</span><span>Work About</span></div>
<div class="mn-mid"><h3>Less,<br>but better.</h3><p>好的设计是尽可能少的设计。</p><p class="mn-cite">Dieter Rams · 好设计十原则</p></div>
<div class="mn-bot"><span class="mn-line"></span><span>查看作品 →</span><span class="mn-dot"></span></div>`};
