export default {id:"neobrutal", cls:"neob", group:"rebel", gfonts:["Archivo Black","Archivo:wght@400;600;800"], cn:"新野兽派", short:"新野兽派", en:"Neo-Brutalism", era:"2020 → 今", place:"创作者工具与初创公司",
 origin:"新野兽派保留了野兽派的直白和粗线条，又加上明亮的配色和用心的排版，把「粗糙」变成一种友好、有手作感的表达。2021 年前后 Gumroad 的改版是代表案例，此后大量创作者工具和初创公司跟进。它的识别特征几乎都能用一两行 CSS 写出来。",
 traits:["2 到 4px 的纯黑粗描边","不带模糊的偏移硬投影，如 6px 6px 0 #000","高饱和撞色色块，不用渐变","交互时元素被「按下去」：位移加阴影收起"],
 good:["创作者工具、初创公司 SaaS","年轻化品牌与社区产品","开发者工具着陆页","活动报名、表单页"],
 avoid:"银行、医疗、法律等严肃场景，以及需要细腻情绪的高端品牌。",
 palette:[["#FFE14D","柠檬黄"],["#FF7AA2","西瓜粉"],["#7AD3FF","天蓝"],["#FFF7E0","奶油"],["#000000","描边黑"]],
 fonts:"英文：Archivo Black、Space Grotesk、Lexend Mega；中文：思源黑体 Heavy、阿里巴巴普惠体 Bold。",
 css:`.card {
  border: 3px solid #000;
  border-radius: 10px;
  box-shadow: 8px 8px 0 #000;
}
.btn:hover  { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 #000; }
.btn:active { transform: translate(4px, 4px);   box-shadow: 0 0 0 #000; }`,
 m:[4,2,4], hint:"悬停、按下按钮",
 tile:"background:#FFE14D;color:#000;font-family:'Archivo Black',sans-serif;box-shadow:inset 0 0 0 3px #000",
 spec:`<div class="nb-card"><span class="nb-sticker">NEW!</span><div class="nb-tags"><span class="nb-tag">#创作者</span><span class="nb-tag">v2.0</span></div><h3>Ship it.</h3><p>把想法变成产品，就现在。</p><div class="nb-actions"><button class="nb-btn" type="button">免费开始</button><span class="nb-link">看看案例 ↗</span></div></div>`};
