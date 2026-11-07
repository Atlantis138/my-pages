export default {id:"terminal", group:"retro", gfonts:["VT323"], cn:"复古终端", short:"复古终端", en:"Retro Terminal / CRT", era:"1970s – 1980s → 今", place:"VT100 终端 · 绿屏显示器",
 origin:"早期电脑没有图形界面，人们通过终端在黑底上输入命令，1978 年的 VT100 是其中最著名的型号。荧光屏会发出绿色或琥珀色的光，留下扫描线和余辉。今天这种样式成了程序员文化的符号，常见于开发者个人站、技术文档和黑客马拉松页面，有时整个网站都被做成一个能输入命令的终端。",
 traits:["黑底配荧光绿或琥珀色等宽文字","扫描线、屏幕暗角与文字辉光","闪烁的光标和命令提示符","ASCII 字符画与方框线条"],
 good:["开发者个人站与博客","技术文档、命令行工具官网","CTF、黑客马拉松","404 页面与彩蛋"],
 avoid:"面向普通用户的产品：命令行隐喻门槛高；大面积高亮绿字长时间阅读也很刺眼。",
 palette:[["#0B0F0A","屏幕黑"],["#33FF66","P1 荧光绿"],["#FFB000","琥珀"],["#1F3B22","暗绿"],["#9DFFB0","辉光"]],
 fonts:"英文：VT323、IBM Plex Mono、JetBrains Mono；中文：更纱黑体 Mono、霞鹜文楷 Mono，保证中英文等宽对齐。",
 css:`.crt {
  background: radial-gradient(ellipse at center, #0F1A10, #060906 75%);
  color: #33FF66;
  text-shadow: 0 0 4px rgba(51,255,102,.6), 0 0 10px rgba(51,255,102,.6);
  font-family: VT323, monospace;
}
.crt::after {   /* 扫描线 */
  content: ""; position: absolute; inset: 0;
  background: repeating-linear-gradient(0deg,
    rgba(0,0,0,.28) 0 1px, transparent 1px 3px);
}`,
 m:[3,1,3], hint:"点击屏幕：切换绿屏与琥珀屏",
 tileText:"&gt;_",
 tile:"background:#0B0F0A;color:#33FF66;font-family:VT323,monospace;font-size:34px;text-shadow:0 0 6px rgba(51,255,102,.8)",
 spec:`<div class="tm-screen" role="button" tabindex="0" aria-label="切换绿屏与琥珀屏"><pre class="tm-pre"><span class="tm-dim">guest@vt100:~$</span> whoami
designer
<span class="tm-dim">guest@vt100:~$</span> ls styles | wc -l
25
<span class="tm-dim">guest@vt100:~$</span> cat motd.txt
+--------------------------+
|  WELCOME TO THE GRID     |
|  ALL SYSTEMS NOMINAL     |
+--------------------------+
<span class="tm-dim">guest@vt100:~$</span> <span class="tm-cur"></span></pre></div>`,
 setup(el){
  const tm = el.querySelector(".tm-screen");
  tm.addEventListener("click", ()=>tm.classList.toggle("amber"));
  tm.addEventListener("keydown", e=>{ if (e.key==="Enter"||e.key===" "){ e.preventDefault(); tm.classList.toggle("amber"); } });
 }
};
