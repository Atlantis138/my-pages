export default {id:"material", cls:"mat", group:"ui", gfonts:["Roboto:wght@400;500;700"], cn:"Material Design", short:"Material", en:"Material Design", era:"2014 → 今", place:"Google · M1 / M2 / M3",
 origin:"Google 在 2014 年发布 Material Design，把扁平化做成了一套完整规范。界面被看作一张张有厚度的「纸」，用阴影表示高度（elevation），点击时像墨水一样扩散的涟漪提供反馈。2021 年的 Material 3 加入了从壁纸提取的动态配色和更大的圆角。",
 traits:["用阴影或色调表达层级高度","点击涟漪和有意义的过渡动效","8dp 网格与严格的组件规范","悬浮操作按钮 FAB、卡片、Chip 等标准组件"],
 good:["Android 与跨平台 Web 应用","管理后台、表单密集的工具","需要快速落地的产品原型","多人协作的设计系统"],
 avoid:"强调品牌个性的营销页：原样套用会「很像 Google」，需要改配色、字体和圆角。",
 palette:[["#6750A4","Primary"],["#EADDFF","Primary Container"],["#FEF7FF","Surface"],["#79747E","Outline"],["#1D1B20","On Surface"]],
 fonts:"英文：Roboto、Roboto Flex、Google Sans；中文：思源黑体，它本身就是 Google Noto 字体家族的一员。",
 css:`.card {
  border-radius: 12px;
  background: #F7F2FA;
  box-shadow: 0 1px 2px rgba(0,0,0,.3),
              0 1px 3px 1px rgba(0,0,0,.15); /* elevation 1 */
}
.fab {
  width: 56px; height: 56px;
  border-radius: 16px;
  background: #EADDFF; color: #21005D;
}`,
 m:[2,2,5], hint:"点击卡片或 + 按钮查看涟漪",
 tile:"background:#EADDFF;color:#21005D;font-family:Roboto,sans-serif;font-weight:500;border-radius:16px",
 spec:`<div class="mt-bar"><span class="mt-menu"><i></i><i></i><i></i></span><span class="mt-title">收件箱</span><span class="mt-av">M</span></div>
<div class="mt-body"><div class="mt-chips"><span class="mt-chip on">✓ 全部</span><span class="mt-chip">未读</span><span class="mt-chip">已加星标</span></div>
<div class="mt-card" data-ripple><span class="mt-ava" style="background:#7D5260">林</span><div class="mt-txt"><b>设计评审</b><small>下午 3 点 · 新版组件库走查</small></div></div>
<div class="mt-card" data-ripple><span class="mt-ava" style="background:#625B71">周</span><div class="mt-txt"><b>周报已提交</b><small>本周完成 12 项任务</small></div></div></div>
<button class="mt-fab" type="button" data-ripple aria-label="新建">+</button>`,
 setup(el){
  el.addEventListener("pointerdown", e=>{
   const t = e.target.closest("[data-ripple]"); if (!t) return;
   const r = t.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2.2;
   const s = document.createElement("span"); s.className = "rip";
   s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX-r.left-d/2}px;top:${e.clientY-r.top-d/2}px`;
   t.appendChild(s); setTimeout(()=>s.remove(), 650);
  });
 }
};
