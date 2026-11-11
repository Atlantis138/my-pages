/* 相机参数实验室 · 光学与曝光的数值模型
 * 档位都以「1/3 档」为整数单位：
 *   光圈 a：N = 2^(a/6)，a=0 → f/1，a=9 → f/2.8
 *   快门 s：t = 2^(s/3) 秒，s=0 → 1″，s=-21 → 1/125
 *   感光度 i：ISO = 100·2^(i/3)，i=0 → ISO 100
 * 于是 EV100 = log2(N²/t) − log2(ISO/100) = (a − s − i)/3，三者在同一把尺子上加减。
 */
(function () {
  'use strict';
  const CL = (window.CL = window.CL || {});

  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  CL.clamp = clamp;
  CL.lerp = lerp;
  CL.smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  /* ---------- 档位刻度（标称值） ---------- */
  const AP_LABELS = ['1.0', '1.1', '1.2', '1.4', '1.6', '1.8', '2', '2.2', '2.5', '2.8', '3.2', '3.5', '4', '4.5', '5', '5.6', '6.3', '7.1', '8', '9', '10', '11', '13', '14', '16', '18', '20', '22', '25', '29', '32'];
  const SH_LABELS = { '-39': '1/8000', '-38': '1/6400', '-37': '1/5000', '-36': '1/4000', '-35': '1/3200', '-34': '1/2500', '-33': '1/2000', '-32': '1/1600', '-31': '1/1250', '-30': '1/1000', '-29': '1/800', '-28': '1/640', '-27': '1/500', '-26': '1/400', '-25': '1/320', '-24': '1/250', '-23': '1/200', '-22': '1/160', '-21': '1/125', '-20': '1/100', '-19': '1/80', '-18': '1/60', '-17': '1/50', '-16': '1/40', '-15': '1/30', '-14': '1/25', '-13': '1/20', '-12': '1/15', '-11': '1/13', '-10': '1/10', '-9': '1/8', '-8': '1/6', '-7': '1/5', '-6': '1/4', '-5': '0.3″', '-4': '0.4″', '-3': '0.5″', '-2': '0.6″', '-1': '0.8″', '0': '1″', '1': '1.3″', '2': '1.6″', '3': '2″', '4': '2.5″', '5': '3.2″', '6': '4″', '7': '5″', '8': '6″', '9': '8″', '10': '10″', '11': '13″', '12': '15″', '13': '20″', '14': '25″', '15': '30″' };
  const ISO_LABELS = { '-3': '50', '-2': '64', '-1': '80', '0': '100', '1': '125', '2': '160', '3': '200', '4': '250', '5': '320', '6': '400', '7': '500', '8': '640', '9': '800', '10': '1000', '11': '1250', '12': '1600', '13': '2000', '14': '2500', '15': '3200', '16': '4000', '17': '5000', '18': '6400', '19': '8000', '20': '10000', '21': '12800', '22': '16000', '23': '20000', '24': '25600', '25': '32000', '26': '40000', '27': '51200', '28': '64000', '29': '80000', '30': '102400' };

  CL.A_MIN = 0; CL.A_MAX = 30;
  CL.S_MIN = -39; CL.S_MAX = 15;
  CL.I_MIN = -3; CL.I_MAX = 30;
  CL.I_NATIVE_MIN = 0; CL.I_NATIVE_MAX = 24; // 50、64、80 与 51200 以上属扩展感光度

  CL.N = (a) => Math.pow(2, a / 6);
  CL.T = (s) => Math.pow(2, s / 3);
  CL.ISO = (i) => 100 * Math.pow(2, i / 3);
  CL.apLabel = (a) => 'f/' + AP_LABELS[clamp(Math.round(a), 0, 30)];
  CL.apNum = (a) => AP_LABELS[clamp(Math.round(a), 0, 30)];
  CL.shLabel = (s) => SH_LABELS[String(clamp(Math.round(s), -39, 15))];
  CL.isoLabel = (i) => ISO_LABELS[String(clamp(Math.round(i), -3, 30))];
  CL.evOf = (a, s, i) => (a - s - i) / 3;
  CL.isFull = (k) => ((k % 3) + 3) % 3 === 0;
  CL.compLabel = (c) => {
    if (c === 0) return '±0';
    const sgn = c > 0 ? '+' : '−';
    const n = Math.abs(c), w = Math.floor(n / 3), r = n % 3;
    return sgn + (w ? w : (r ? '' : '0')) + (r ? (w ? ' ' : '') + r + '/3' : '');
  };
  CL.fmtEV = (x, d = 1) => (x >= 0 ? '+' : '−') + Math.abs(x).toFixed(d);

  /* ---------- 传感器 ---------- */
  CL.SENSORS = [
    { id: 'mf', name: '中画幅', en: '44×33', w: 43.8, h: 32.9, mp: 50, aspect: '4:3' },
    { id: 'ff', name: '全画幅', en: '36×24', w: 36, h: 24, mp: 24, aspect: '3:2' },
    { id: 'apsc', name: 'APS-C', en: '23.5×15.6', w: 23.5, h: 15.6, mp: 24, aspect: '3:2' },
    { id: 'm43', name: 'M4/3', en: '17.3×13', w: 17.3, h: 13, mp: 20, aspect: '4:3' },
    { id: 'one', name: '1 英寸', en: '13.2×8.8', w: 13.2, h: 8.8, mp: 20, aspect: '3:2' },
  ];
  CL.sensorInfo = (sen) => {
    const diag = Math.hypot(sen.w, sen.h);
    const crop = 43.27 / diag;
    const px = Math.sqrt(sen.mp * 1e6 * sen.w / sen.h); // 横向像素数
    return {
      diag, crop,
      coc: 0.03 / crop, // mm，按「对角线/1442」的惯例
      pitch: sen.w / px * 1000, // µm
      pxW: Math.round(px), pxH: Math.round(px * sen.h / sen.w),
      area: sen.w * sen.h,
    };
  };

  /* ---------- 镜头 ---------- */
  // aW/aT：广角端/长焦端最大光圈的 a 值；aMax：最小光圈；mfd：最近对焦距离（米）
  CL.LENSES = [
    { id: 'uwa14', name: '14mm F2.8', kind: '超广角定焦', f0: 14, f1: 14, aW: 9, aT: 9, aMax: 27, mfd: 0.2, blades: 9, round: 0.6, dist: [-0.05, -0.05], vig: 1.0 },
    { id: 'z2470', name: '24-70mm F2.8', kind: '标准变焦 · 恒定光圈', f0: 24, f1: 70, aW: 9, aT: 9, aMax: 27, mfd: 0.38, blades: 9, round: 0.7, dist: [-0.024, 0.012], vig: 0.8 },
    { id: 'p35', name: '35mm F1.4', kind: '人文定焦', f0: 35, f1: 35, aW: 3, aT: 3, aMax: 24, mfd: 0.3, blades: 11, round: 0.9, dist: [-0.012, -0.012], vig: 1.0 },
    { id: 'p50', name: '50mm F1.8', kind: '标准定焦 · 7 片直叶片', f0: 50, f1: 50, aW: 5, aT: 5, aMax: 24, mfd: 0.45, blades: 7, round: 0.05, dist: [0.004, 0.004], vig: 0.9 },
    { id: 'p85', name: '85mm F1.4', kind: '人像定焦', f0: 85, f1: 85, aW: 3, aT: 3, aMax: 24, mfd: 0.85, blades: 11, round: 0.95, dist: [0.006, 0.006], vig: 0.9 },
    { id: 'z70200', name: '70-200mm F2.8', kind: '长焦变焦 · 恒定光圈', f0: 70, f1: 200, aW: 9, aT: 9, aMax: 27, mfd: 1.0, blades: 11, round: 0.9, dist: [0.01, 0.016], vig: 0.7 },
    { id: 'z100400', name: '100-400mm F4.5-5.6', kind: '超长焦变焦 · 浮动光圈', f0: 100, f1: 400, aW: 13, aT: 15, aMax: 30, mfd: 1.5, blades: 9, round: 0.6, dist: [0.01, 0.014], vig: 0.7 },
    { id: 'm100', name: '100mm F2.8 微距', kind: '微距定焦 · 1:1', f0: 100, f1: 100, aW: 9, aT: 9, aMax: 30, mfd: 0.28, blades: 9, round: 0.7, dist: [0.002, 0.002], vig: 0.6, macro: true },
  ];
  CL.lensById = (id) => CL.LENSES.find((l) => l.id === id) || CL.LENSES[1];
  CL.lensT = (lens, f) => (lens.f1 === lens.f0 ? 0 : Math.log(f / lens.f0) / Math.log(lens.f1 / lens.f0));
  CL.lensMaxAp = (lens, f) => Math.round(lerp(lens.aW, lens.aT, clamp(CL.lensT(lens, f), 0, 1)));
  CL.lensDistortion = (lens, f) => lerp(lens.dist[0], lens.dist[1], clamp(CL.lensT(lens, f), 0, 1));

  /* ---------- 视角、景深 ---------- */
  CL.fov = (sizeMM, f) => 2 * Math.atan(sizeMM / (2 * f)); // 弧度
  CL.deg = (r) => (r * 180) / Math.PI;

  // 所有长度单位：毫米
  CL.hyperfocal = (f, N, c) => (f * f) / (N * c) + f;
  CL.dof = (f, N, c, S) => {
    const H = CL.hyperfocal(f, N, c);
    const near = (S * (H - f)) / (H + S - 2 * f);
    const far = S < H ? (S * (H - f)) / (H - S) : Infinity;
    return { H, near, far, total: far - near };
  };
  // 弥散圆直径（传感器上的毫米数）：物距 D、对焦距离 S
  CL.coc = (f, N, S, D) => {
    const A = f / N;
    if (!isFinite(D)) return (A * f) / Math.max(S - f, 1e-3);
    return Math.abs((A * f * (D - S)) / (D * Math.max(S - f, 1e-3)));
  };
  CL.magnification = (f, S) => f / Math.max(S - f, 1e-3);
  CL.airy = (N) => 2.44 * 0.55 * N; // 艾里斑直径，µm（λ = 550 nm）

  /* ---------- 色温 → RGB（黑体近似，线性） ---------- */
  function kelvinSRGB(K) {
    const t = K / 100;
    let r, g, b;
    if (t <= 66) { r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; }
    else { r = 329.698727446 * Math.pow(t - 60, -0.1332047592); g = 288.1221695283 * Math.pow(t - 60, -0.0755148492); }
    if (t >= 66) b = 255; else if (t <= 19) b = 0; else b = 138.5177312231 * Math.log(t - 10) - 305.0447927307;
    return [clamp(r, 0, 255) / 255, clamp(g, 0, 255) / 255, clamp(b, 0, 255) / 255];
  }
  const s2l = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  CL.kelvinLinear = (K) => kelvinSRGB(K).map(s2l);
  const REF = CL.kelvinLinear(5500);
  // 光源颜色（以 5500K 为白），供场景灯光使用
  CL.lightColor = (K) => {
    const c = CL.kelvinLinear(K);
    const r = [c[0] / REF[0], c[1] / REF[1], c[2] / REF[2]];
    const m = Math.max(r[0], r[1], r[2]);
    return r.map((x) => x / m);
  };
  // 白平衡增益：把色温 K 的光源校正为中性（G = 1）
  CL.wbGains = (K, tint) => {
    const c = CL.lightColor(K);
    const g = [c[1] / c[0], 1, c[1] / c[2]];
    const tg = Math.pow(2, -(tint || 0) * 0.05); // 正值偏品红：压低绿色
    return [g[0], g[1] * tg, g[2]];
  };

  CL.WB_PRESETS = [
    { id: 'auto', name: '自动', short: 'AWB', K: null },
    { id: 'sun', name: '日光', short: '☀', K: 5200 },
    { id: 'cloud', name: '阴天', short: '阴', K: 6000 },
    { id: 'shade', name: '阴影', short: '影', K: 7000 },
    { id: 'tung', name: '钨丝灯', short: '钨', K: 3200 },
    { id: 'fluo', name: '白色荧光灯', short: '荧', K: 4000 },
    { id: 'flash', name: '闪光灯', short: '闪', K: 5500 },
    { id: 'kelvin', name: '色温 K', short: 'K', K: 5500 },
  ];

  CL.STYLES = [
    { id: 'std', name: '标准', contrast: 0.12, sat: 1.1, sharp: 0.35 },
    { id: 'vivid', name: '鲜艳', contrast: 0.22, sat: 1.4, sharp: 0.4 },
    { id: 'portrait', name: '人像', contrast: 0.06, sat: 1.0, sharp: 0.15, warm: 0.04 },
    { id: 'land', name: '风光', contrast: 0.18, sat: 1.28, sharp: 0.55 },
    { id: 'flat', name: '平淡', contrast: -0.12, sat: 0.82, sharp: 0.1 },
    { id: 'mono', name: '单色', contrast: 0.16, sat: 0, sharp: 0.35, mono: 1 },
    { id: 'monoR', name: '单色 · 红滤镜', contrast: 0.22, sat: 0, sharp: 0.35, mono: 2 },
  ];

  CL.FILTERS = [
    { id: 'none', name: '无滤镜', stops: 0 },
    { id: 'nd3', name: 'ND8', stops: 3, note: '减 3 档' },
    { id: 'nd6', name: 'ND64', stops: 6, note: '减 6 档' },
    { id: 'nd10', name: 'ND1000', stops: 10, note: '减 10 档' },
    { id: 'cpl', name: '偏振镜 CPL', stops: 1.5, note: '减约 1.5 档，压暗天空、消除反光' },
    { id: 'gnd', name: '渐变灰 GND8', stops: 0, gnd: 3, note: '上半部减 3 档' },
  ];

  CL.FLASH_GN = 36; // 闪光指数（ISO 100，米）
  CL.SYNC_S = -24; // 闪光同步速度 1/250
  CL.CLIP = 0.18 * Math.pow(2, 3.3); // 原始数据饱和点：中灰以上约 3.3 档

  /* ---------- 工具 ---------- */
  CL.fmtDist = (mm) => {
    if (!isFinite(mm) || mm > 1e7) return '∞';
    const m = mm / 1000;
    if (m < 1) return (m * 100).toFixed(m < 0.3 ? 1 : 0) + ' cm';
    if (m < 10) return m.toFixed(2) + ' m';
    if (m < 100) return m.toFixed(1) + ' m';
    return Math.round(m) + ' m';
  };
  CL.fmtSec = (t) => (t >= 0.3 ? (t >= 1 ? t.toFixed(t < 10 ? 1 : 0) : t.toFixed(1)) + ' 秒' : '1/' + Math.round(1 / t) + ' 秒');
})();
