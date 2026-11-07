export default {id:"neumorph", cls:"neu", group:"ui", gfonts:["Manrope:wght@300;500;800"], cn:"新拟态", short:"新拟态", en:"Neumorphism / Soft UI", era:"2019 – 2021", place:"Dribbble 概念作品",
 origin:"2019 年底，设计师 Alexander Plyuto 在 Dribbble 发布的一个银行 App 概念让这种风格迅速走红，名字由 new 和 skeuomorphism 拼成。元素与背景完全同色，只靠一亮一暗两道阴影「挤」出凸起或凹陷，像一块软塑料上压出的形状。",
 traits:["元素与背景同色，几乎没有边框","左上亮阴影加右下暗阴影是凸起，inset 是凹陷","低对比、低饱和的柔和色调","大圆角，适合圆形按钮与滑块"],
 good:["计算器、播放器等单一功能小工具","智能家居、硬件控制面板","作品集里的视觉概念","局部点缀一两个控件"],
 avoid:"整站使用：对比度普遍达不到 WCAG 标准，按下和未按下的状态难以分辨，对视力较弱的用户不友好。",
 palette:[["#E3E8EF","底色"],["#FFFFFF","亮阴影"],["#BEC4CE","暗阴影"],["#6A788C","文字"],["#5B8DEF","强调"]],
 fonts:"英文：Manrope、Nunito、Poppins；中文：思源黑体 Medium、苹方。文字颜色要比看上去需要的再深一档。",
 css:`.raised {
  background: #E3E8EF;
  box-shadow: 10px 10px 20px #BEC4CE,
             -10px -10px 20px #FFFFFF;
}
.pressed {
  box-shadow: inset 6px 6px 12px #BEC4CE,
              inset -6px -6px 12px #FFFFFF;
}`,
 m:[3,3,2], hint:"点击圆形按钮和风速键：凸起与凹陷切换",
 tile:"background:#E3E8EF;color:#6A788C;font-family:Manrope,sans-serif;font-weight:800;box-shadow:inset 4px 4px 8px #BEC4CE,inset -4px -4px 8px #FFF",
 spec:`<div class="nu-wrap"><h3>SOFT UI</h3><button class="nu-btn" type="button" aria-pressed="false" aria-label="播放"><i></i></button>
<div class="nu-track"><span class="nu-fill"></span><span class="nu-knob"></span></div>
<div class="nu-row"><button class="nu-key" type="button" aria-pressed="false">低</button><button class="nu-key" type="button" aria-pressed="true">中</button><button class="nu-key" type="button" aria-pressed="false">高</button></div></div>`,
 setup(el){
  el.addEventListener("click", e=>{
   const nb = e.target.closest(".nu-btn");
   if (nb){ nb.setAttribute("aria-pressed", String(nb.getAttribute("aria-pressed")!=="true")); return; }
   const nk = e.target.closest(".nu-key");
   if (nk) nk.parentElement.querySelectorAll(".nu-key").forEach(k=>k.setAttribute("aria-pressed", String(k===nk)));
  });
 }
};
