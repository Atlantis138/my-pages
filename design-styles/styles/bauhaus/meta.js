export default {id:"bauhaus", group:"modern", gfonts:["Josefin Sans:wght@400;700"], cn:"包豪斯", short:"包豪斯", en:"Bauhaus", era:"1919 – 1933", place:"德国 · 魏玛 / 德绍 / 柏林",
 origin:"1919 年由建筑师格罗皮乌斯在魏玛创办的包豪斯学校，主张打通艺术与手工艺，为工业化生产服务。学校只存在了 14 年，却奠定了现代设计教育的基础。基本几何形、三原色、无衬线字体和功能优先的构图，至今仍是网页视觉的底层语法。",
 traits:["圆、方、三角三种基本形构成画面","红黄蓝三原色加黑白，不用渐变","几何无衬线字体，常全大写或全小写","非对称构图，用色块和粗线条划分空间"],
 good:["艺术与教育机构","展览、文化活动页","品牌活动着陆页","海报式首屏"],
 avoid:"信息密集的后台和表单：大色块会和真正需要关注的数据争夺注意力。",
 palette:[["#D8352A","包豪斯红"],["#F2B705","铬黄"],["#1E4C9A","群青"],["#151515","墨黑"],["#EFE9DC","纸白"]],
 fonts:"英文：Josefin Sans、Futura、Jost；中文：思源黑体 Heavy、站酷高端黑。全小写排版是包豪斯印刷的标志做法，来自赫伯特·拜耳设计的 Universal 字体。",
 css:`.circle   { border-radius: 50%; background: #D8352A; }
.triangle { clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.layout   { display: grid; grid-template-columns: 2fr 1fr; }
h1 {
  font: 700 8rem/0.82 "Josefin Sans", Futura, sans-serif;
  text-transform: lowercase;
}`,
 m:[4,2,3], hint:"悬停：几何形开始运动",
 tile:"background:#EFE9DC;color:#D8352A;font-family:'Josefin Sans',sans-serif;font-weight:700",
 spec:`<span class="bh-circle"></span><span class="bh-square"></span><span class="bh-tri"></span><span class="bh-bar"></span>
<div class="bh-text"><h3>bau<br>haus</h3><p>艺术与技术，新的统一</p><small>weimar · dessau · berlin</small></div>`};
