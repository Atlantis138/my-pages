export default {id:"cyber", group:"retro", gfonts:["Share Tech Mono","Orbitron:wght@500;800"], cn:"赛博朋克", short:"赛博朋克", en:"Cyberpunk", era:"1980s 文学 → 2020 游戏", place:"《神经漫游者》《银翼杀手》《赛博朋克 2077》",
 origin:"赛博朋克源于 1980 年代的科幻小说与电影，代表作是威廉·吉布森 1984 年的《神经漫游者》和 1982 年的《银翼杀手》。核心意象是「高科技，低生活」：霓虹灯下的雨夜街道、黑客和巨型企业。2020 年的游戏《赛博朋克 2077》把黄青红配色和切角界面带成了网页上的流行样式。",
 traits:["深色背景配霓虹青、品红、警示黄","故障效果（glitch）、扫描线、噪点","切角面板（clip-path）与 HUD 读数","等宽或科技感字体，混入中日文招牌"],
 good:["游戏与电竞","科技发布会、黑客马拉松","暗色数据仪表盘","音乐与潮流活动"],
 avoid:"长文阅读和普通用户工具：高对比霓虹与动效容易疲劳，频繁闪烁对光敏用户有风险。",
 palette:[["#07070D","夜"],["#FCEE0A","警示黄"],["#00F0FF","霓虹青"],["#FF2A6D","霓虹红"],["#E6F7FF","冷白"]],
 fonts:"英文：Orbitron、Share Tech Mono、Rajdhani；中文：思源黑体 Heavy 加辉光，或站酷高端黑。",
 css:`.panel {
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px,
                     100% 100%, 16px 100%, 0 calc(100% - 16px));
}
.neon { color: #FF2A6D; text-shadow: 0 0 6px #FF2A6D, 0 0 18px #FF2A6D; }
.glitch::before {
  content: attr(data-text);
  position: absolute; color: #00F0FF;
  transform: translate(-3px, 0);
}`,
 m:[5,4,2], hint:"悬停：故障频率加快",
 tile:"background:#07070D;color:#FCEE0A;font-family:Orbitron,sans-serif;font-weight:800;text-shadow:-2px 0 #00F0FF,2px 0 #FF2A6D",
 spec:`<div class="cy-hud"><span>SYS://ONLINE</span><span>NET 98.6%</span></div>
<div class="cy-mid"><h3 class="cy-glitch" data-text="NIGHT//CITY">NIGHT//CITY</h3>
<div class="cy-panel"><p>&gt; 接入神经网络…… <b>OK</b></p><p>&gt; 区域：第 7 街区 / 雨</p><p>&gt; 信用点：¥ 2,077</p></div></div>
<div class="cy-foot"><button class="cy-btn" type="button">JACK IN_</button><span class="cy-code">0xFCEE0A</span></div>
<span class="cy-sign">霓虹夜市</span>`};
