export default {id:"constructivism", group:"modern", gfonts:["Oswald:wght@700"], cn:"构成主义", short:"构成主义", en:"Russian Constructivism", era:"1915 – 1930s", place:"俄国 · 莫斯科 / 彼得格勒",
 origin:"构成主义诞生于 1910 年代后期的俄国，罗德琴科、利西茨基等艺术家主张艺术应当服务社会，像工程一样被「建造」出来。他们的海报用强烈的对角线、红黑两色、粗体字和摄影拼贴制造冲击力。它和包豪斯相互影响，是现代海报和宣传设计的重要源头。",
 traits:["强烈的对角线构图，画面充满动势","红、黑配新闻纸米白，色彩极少","粗壮的窄体无衬线字，文字本身就是图形","几何楔形、圆形与摄影拼贴组合"],
 good:["活动与发布会海报页","新闻专题、观点类媒体","音乐节、剧场","宣言式品牌页面"],
 avoid:"温和、亲切的消费品牌。另外红黑配色加标语式文案容易带上政治联想，要留意语境。",
 palette:[["#C1272D","构成红"],["#1A1A1A","黑"],["#EDE4D3","新闻纸"],["#8A8172","铅灰"]],
 fonts:"英文：Oswald、Anton、Bebas Neue；中文：思源黑体 Heavy、站酷高端黑。整块文字可以用 transform: rotate() 倾斜，顺着对角线排布。",
 css:`.wedge {
  background: #C1272D;
  clip-path: polygon(0 0, 100% 50%, 0 100%);
  transform: rotate(-12deg);
}
.diagonal { transform: rotate(-12deg); transform-origin: left center; }
h1 {
  font: 700 6rem/0.9 Oswald, sans-serif;
  text-transform: uppercase;
}`,
 m:[4,2,3], hint:"悬停：红色楔形向前刺入",
 tile:"background:linear-gradient(-20deg,#EDE4D3 46%,#C1272D 46% 58%,#EDE4D3 58%);color:#1A1A1A;font-family:Oswald,sans-serif;font-weight:700",
 spec:`<p class="cv-top">КОНСТРУКТИВИЗМ<br>№ 3 · 1923</p><span class="cv-circle"></span><span class="cv-wedge"></span><h3 class="cv-h"><em>NEW</em> FORM</h3><div class="cv-bar">向前 · 建造新世界</div><span class="cv-bar2"></span>`};
