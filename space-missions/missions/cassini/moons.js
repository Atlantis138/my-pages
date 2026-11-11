// 九颗卫星的卡片：文字写在这里，飞越次数和最近距离由轨道数据算出。

import { $ } from '../../shared/util.js';

const TEXT = {
  606: { big: 1, d: '5,150 km', by: '1655 · 惠更斯', p: '太阳系第二大卫星，唯一有浓厚大气的卫星。地表气压是地球的 1.5 倍，温度约 −180 °C；甲烷在这里像水一样下雨、汇成河流和湖海。卡西尼号的雷达和红外光谱仪透过雾霾绘出了大半个泰坦，惠更斯号则直接降落在它的赤道附近。' },
  602: { big: 1, d: '504 km', by: '1789 · 赫歇尔', p: '只有 500 km 宽，却是太阳系最亮的天体之一。南极的裂缝不断向太空喷出水汽和冰粒，背后是一片含盐、有机物和热液迹象的全球海洋，它因此成了寻找地外生命的首选目标之一。' },
  608: { d: '1,469 km', by: '1671 · 卡西尼', p: '一面像沥青一样黑，一面像雪一样白，赤道上横着一道 20 km 高的山脊。乔凡尼·卡西尼当年就注意到它只在土星一侧时才看得见。' },
  605: { d: '1,527 km', by: '1672 · 卡西尼', p: '土星第二大卫星，布满古老撞击坑。卡西尼号在它周围测到由氧和二氧化碳组成的极稀薄大气。' },
  604: { d: '1,123 km', by: '1684 · 卡西尼', p: '拖曳面上有明亮的冰崖网；引力测量提示冰壳下可能也有液态水层。' },
  603: { d: '1,062 km', by: '1684 · 卡西尼', p: '一道 2,000 km 长的伊萨卡峡谷几乎绕了它大半圈，还有一个直径 400 km 的奥德修斯坑。' },
  601: { d: '396 km', by: '1789 · 赫歇尔', p: '巨大的赫歇尔撞击坑让它看起来像“死星”。卡西尼号的红外测量显示它表面的温度分布像一只吃豆人。' },
  607: { d: '270 km（不规则）', by: '1848 · 邦德、拉塞尔', p: '形状不规则、自转混沌，表面密布深坑，像一块海绵；密度只有水的一半多，内部大半是空隙。' },
  609: { d: '213 km', by: '1899 · 皮克林', p: '在 1,300 万 km 外沿逆行轨道运行，很可能是被俘获的外太阳系小天体。它撒出的尘埃形成了一个巨大的外环。' },
};

// order: 卡片顺序（MOONS 的下标）；前两张大卡，其后四张中卡，其余小卡。onPick(最近的那次飞越, 卫星下标)
export function mountMoons({ MOONS, TF, order, isoDate, altTxt, onPick }) {
  const box = $('moons');
  box.innerHTML = '';
  order.forEach((i, k) => {
    const m = MOONS[i], info = TEXT[m.id], fl = TF.filter(f => f.mi === i);
    const best = fl.length ? fl.reduce((a, b) => b.alt < a.alt ? b : a) : null;
    const div = document.createElement('div');
    div.className = 'mcard' + (info.big ? ' big' : k < 6 ? ' mid' : '');
    div.innerHTML = `<div class="mh"><h3><span class="dot" style="background:var(--${m.col})"></span>${m.zh}</h3><span class="en">${m.no} · ${m.en}</span></div>
      <div class="stats"><span>直径 ${info.d}</span><span>发现 ${info.by}</span><span>${fl.length} 次${m.col === 'moon' ? '近距' : '定向'}飞越</span>${best ? `<span>最近 ${altTxt(best)} · ${isoDate(best.t)}</span>` : ''}</div>
      <p>${info.p}</p>` + (best ? '<button class="goto sm" type="button">跳到最近的一次飞越 →</button>' : '');
    if (best) div.querySelector('button').addEventListener('click', () => onPick(best, i));
    box.appendChild(div);
  });
}
