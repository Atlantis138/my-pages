export default {id:"nouveau", group:"modern", gfonts:["Cormorant Garamond:ital,wght@1,600"], cn:"新艺术运动", short:"新艺术", en:"Art Nouveau", era:"1890 – 1910", place:"巴黎 · 布鲁塞尔 · 维也纳",
 origin:"新艺术运动在 1890 到 1910 年间席卷欧洲，从巴黎、布鲁塞尔到维也纳都有它的身影。它反对工业化的粗糙复制，从植物、藤蔓和女性长发中提取流动的曲线。阿尔丰斯·穆夏的海报和赫克托·吉马尔设计的巴黎地铁入口是最有名的例子。它是装饰艺术的前身，比后者更柔软、更有机。",
 traits:["鞭线般流动的有机曲线","花卉、藤蔓、光环等自然纹样","拱形画框与繁复的装饰边框","橄榄绿、赭石、古金等柔和的大地色"],
 good:["花店、茶饮、香氛、美妆","手工艺与独立出版","婚礼、节庆邀请","酒庄、精品酒店"],
 avoid:"科技产品与效率工具：曲线和纹样会让界面显得繁重，也很难做好响应式适配。",
 palette:[["#F1E6CF","羊皮纸"],["#4F6B4A","橄榄绿"],["#B8873B","古金"],["#8E4A3C","赭红"],["#2E2A24","墨褐"]],
 fonts:"英文：Cormorant Garamond、Federo、Cinzel Decorative；中文：思源宋体、霞鹜文楷。纹样优先用 SVG 绘制，方便缩放和换色。",
 css:`.arch {
  border-radius: 50% 50% 0 0 / 34% 34% 0 0;   /* 拱形画框 */
  border: 2px solid #4F6B4A;
  outline: 1px solid #B8873B;
  outline-offset: 6px;
}
.halo {
  border-radius: 50%;
  background: repeating-conic-gradient(#B8873B 0 1.2deg,
                                       transparent 1.2deg 9deg);
}`,
 m:[5,4,3], hint:"悬停：光环缓缓转动",
 tile:"background:#F1E6CF;color:#4F6B4A;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600",
 spec:`<svg class="an-vine an-l" viewBox="0 0 60 300" aria-hidden="true"><path fill="none" d="M40 300 C 0 250, 55 200, 25 150 S 50 60, 15 6"/><ellipse fill="#4F6B4A" cx="34" cy="232" rx="5" ry="12" transform="rotate(-40 34 232)"/><ellipse fill="#4F6B4A" cx="22" cy="178" rx="5" ry="12" transform="rotate(35 22 178)"/><ellipse fill="#4F6B4A" cx="38" cy="104" rx="5" ry="12" transform="rotate(-30 38 104)"/><ellipse fill="#4F6B4A" cx="22" cy="52" rx="4" ry="10" transform="rotate(30 22 52)"/><circle cx="15" cy="6" r="6" fill="#B8873B"/></svg> <svg class="an-vine an-r" viewBox="0 0 60 300" aria-hidden="true"><path fill="none" d="M40 300 C 0 250, 55 200, 25 150 S 50 60, 15 6"/><ellipse fill="#4F6B4A" cx="34" cy="232" rx="5" ry="12" transform="rotate(-40 34 232)"/><ellipse fill="#4F6B4A" cx="22" cy="178" rx="5" ry="12" transform="rotate(35 22 178)"/><ellipse fill="#4F6B4A" cx="38" cy="104" rx="5" ry="12" transform="rotate(-30 38 104)"/><ellipse fill="#4F6B4A" cx="22" cy="52" rx="4" ry="10" transform="rotate(30 22 52)"/><circle cx="15" cy="6" r="6" fill="#B8873B"/></svg>
<div class="an-arch"><span class="an-halo"></span><span class="an-stem"></span><svg class="an-flower" viewBox="-50 -50 100 100" aria-hidden="true"><g fill="#B8873B">${[0,45,90,135,180,225,270,315].map(r=>`<ellipse rx="9" ry="21" cy="-22" transform="rotate(${r})"/>`).join("")}</g><g fill="#8E4A3C">${[22.5,67.5,112.5,157.5,202.5,247.5,292.5,337.5].map(r=>`<ellipse rx="5" ry="13" cy="-16" transform="rotate(${r})"/>`).join("")}</g><circle r="9" fill="#4F6B4A"/></svg></div>
<div class="an-text"><h3>Printemps</h3><p>春之花信</p></div>`};
