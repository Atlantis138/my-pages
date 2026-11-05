(() => {
'use strict';
const DATA = /*DATA*/;
const TAU = Math.PI * 2, DEG = Math.PI / 180;
const D0 = Date.UTC(1997, 9, 15);                       // page epoch: t = days since 1997-10-15 00:00 UT
const JDE = 2450736.5;
const T = s => (Date.parse(s.length === 10 ? s + 'T00:00:00Z' : s.length === 16 ? s + ':00Z' : s + 'Z') - D0) / 864e5;
const isoDate = t => new Date(D0 + t * 864e5).toISOString().slice(0, 10);
const utc = t => new Date(D0 + t * 864e5).toISOString().slice(0, 16).replace('T', ' ') + ' UT';
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const nf = new Intl.NumberFormat('en-US');
const fmtInt = x => nf.format(Math.round(x));

const AU = 149597870.7, UH = AU / 10, US = 1e4;          // H frame: 1 unit = 0.1 AU;  S frame: 1 unit = 10 000 km
const RS = 60268, RS_POL = 54364;

/* ================= Tracks ================= */
function unpack(o, unit) {
  const n = o.dt.length + 1, t = new Float64Array(n), p = new Float64Array(n * 3);
  let ts = o.t0, x = o.p0[0], y = o.p0[1], z = o.p0[2];
  t[0] = ts / 86400; p[0] = x / unit; p[1] = y / unit; p[2] = z / unit;
  for (let i = 1; i < n; i++) {
    ts += o.dt[i - 1]; x += o.dp[3 * i - 3]; y += o.dp[3 * i - 2]; z += o.dp[3 * i - 1];
    t[i] = ts / 86400; p[3 * i] = x / unit; p[3 * i + 1] = y / unit; p[3 * i + 2] = z / unit;
  }
  return { t, p, n };
}
const TH = unpack(DATA.H, UH), TS = unpack(DATA.S, US), THY0 = unpack(DATA.HY, US);
const THY = (() => {   // resample the last 1.2 days every ~7 minutes so the Titan-relative blend stays smooth
  const tE = THY0.t[THY0.n - 1], ts = [];
  for (let i = 0; i < THY0.n; i++) if (THY0.t[i] < tE - 1.2) ts.push(THY0.t[i]);
  for (let x = tE - 1.2; x < tE; x += 0.005) ts.push(x);
  ts.push(tE);
  const n = ts.length, t = new Float64Array(ts), p = new Float64Array(n * 3);
  for (let i = 0; i < n; i++) { const q = interp(THY0, ts[i]); p[3 * i] = q[0]; p[3 * i + 1] = q[1]; p[3 * i + 2] = q[2]; }
  return { t, p, n };
})();
function idxAt(tr, t) {
  if (t <= tr.t[0]) return 0;
  let lo = 0, hi = tr.n - 1;
  if (t >= tr.t[hi]) return hi;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tr.t[m] <= t) lo = m; else hi = m; }
  return lo;
}
function interp(tr, t) {
  const i = idxAt(tr, t), j = Math.min(i + 1, tr.n - 1), h = tr.t[j] - tr.t[i], k = h > 0 ? clamp((t - tr.t[i]) / h, 0, 1) : 0;
  return [tr.p[3 * i] + (tr.p[3 * j] - tr.p[3 * i]) * k, tr.p[3 * i + 1] + (tr.p[3 * j + 1] - tr.p[3 * i + 1]) * k, tr.p[3 * i + 2] + (tr.p[3 * j + 2] - tr.p[3 * i + 2]) * k];
}
function speedAt(tr, t, unit) {   // km/s, blended between neighbouring chords
  const i = idxAt(tr, t), j = Math.min(i + 1, tr.n - 1);
  const sp = (a, b) => { const h = (tr.t[b] - tr.t[a]) * 86400; return h > 0 ? Math.hypot(tr.p[3 * b] - tr.p[3 * a], tr.p[3 * b + 1] - tr.p[3 * a + 1], tr.p[3 * b + 2] - tr.p[3 * a + 2]) * unit / h : 0; };
  const s1 = sp(i, j); if (i === 0 || j === tr.n - 1) return s1;
  const s0 = sp(i - 1, i), s2 = sp(j, Math.min(j + 1, tr.n - 1)), k = clamp((t - tr.t[i]) / Math.max(1e-9, tr.t[j] - tr.t[i]), 0, 1);
  return k < 0.5 ? (s0 + s1) / 2 + (s1 - (s0 + s1) / 2) * (k * 2) : s1 + ((s1 + s2) / 2 - s1) * ((k - 0.5) * 2);
}
const T_START = TH.t[0], T_END = TS.t[TS.n - 1];
const rawH = t => interp(TH, t), rawS = t => interp(TS, t);

/* ================= Planets (heliocentric, J2000 ecliptic) =================
   JPL approximate Keplerian elements (1800–2050) + Horizons correction tables near flybys. */
const PEL = {
  venus:   [[0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255], [0.00000390, -0.00004107, -0.00078890, 58517.81538729, 0.00268329, -0.27769418], '299'],
  earth:   [[1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0], [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0.0], '399'],
  mars:    [[1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891], [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343], '499'],
  jupiter: [[5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909], [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106], '599'],
  saturn:  [[9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448], [-0.00125060, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794], '699'],
};
function kepE(M, e) { let E = M; for (let i = 0; i < 40; i++) { const d = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); E -= d; if (Math.abs(d) < 1e-13) break; } return E; }
const wrapPI = x => x - TAU * Math.floor((x + Math.PI) / TAU);
function planetElemKm(name, t) {
  const [e0, r] = PEL[name], Tc = (t + JDE - 2451545) / 36525;
  const a = e0[0] + r[0] * Tc, e = e0[1] + r[1] * Tc, I = (e0[2] + r[2] * Tc) * DEG, L = e0[3] + r[3] * Tc, w = e0[4] + r[4] * Tc, O = e0[5] + r[5] * Tc;
  const E = kepE(wrapPI((L - w) * DEG), e);
  const x = a * (Math.cos(E) - e), y = a * Math.sqrt(1 - e * e) * Math.sin(E);
  const om = (w - O) * DEG, Om = O * DEG, co = Math.cos(om), so = Math.sin(om), cO = Math.cos(Om), sO = Math.sin(Om), cI = Math.cos(I), sI = Math.sin(I);
  return [((co * cO - so * sO * cI) * x + (-so * cO - co * sO * cI) * y) * AU,
          ((co * sO + so * cO * cI) * x + (-so * sO + co * cO * cI) * y) * AU,
          ((so * sI) * x + (co * sI) * y) * AU];
}
const bump = (dt, full, zero) => 1 - smooth(full, zero, Math.abs(dt));
function planetKm(name, t) {
  const p = planetElemKm(name, t), id = PEL[name][2];
  const tab = DATA.pc[id];
  if (tab) {
    const x = (t - tab.t0) / tab.step, n = tab.d.length / 3, i = clamp(Math.floor(x), 0, n - 2), k = clamp(x - i, 0, 1);
    for (let c = 0; c < 3; c++) p[c] += (tab.d[3 * i + c] + (tab.d[3 * i + 3 + c] - tab.d[3 * i + c]) * k) * 100;
  }
  for (const f of DATA.pfly) if (f.p === id) {
    const dt = t - f.t, b = bump(dt, 0.25, 0.6);
    if (b > 0) for (let c = 0; c < 3; c++) p[c] += (f.off[c] + f.rate[c] * dt) * b;
  }
  return p;
}
const planetH = (name, t) => planetKm(name, t).map(v => v / UH);
const PR = { venus: 6051.8, earth: 6371, mars: 3389.5, jupiter: 69911, saturn: 58232 };
// Earth's Moon for the 1999 flyby close-up (Meeus ch.47, truncated; geocentric ecliptic of date, km)
const LR=[[0,0,1,0,6288774,-20905355],[2,0,-1,0,1274027,-3699111],[2,0,0,0,658314,-2955968],[0,0,2,0,213618,-569925],[0,1,0,0,-185116,48888],[0,0,0,2,-114332,-3149],[2,0,-2,0,58793,246158],[2,-1,-1,0,57066,-152138],[2,0,1,0,53322,-170733],[2,-1,0,0,45758,-204586],[0,1,-1,0,-40923,-129620],[1,0,0,0,-34720,108743],[0,1,1,0,-30383,104755],[2,0,0,-2,15327,10321],[0,0,1,2,-12528,0],[0,0,1,-2,10980,79661],[4,0,-1,0,10675,-34782],[0,0,3,0,10034,-23210],[4,0,-2,0,8548,-21636],[2,1,-1,0,-7888,24208],[2,1,0,0,-6766,30824],[1,0,-1,0,-5163,-8379],[1,1,0,0,4987,-16675],[2,-1,1,0,4036,-12831],[2,0,2,0,3994,-10445],[4,0,0,0,3861,-11650],[2,0,-3,0,3665,14403],[0,1,-2,0,-2689,-7003],[2,0,-1,2,-2602,0],[2,-1,-2,0,2390,10056]];
const BT=[[0,0,0,1,5128122],[0,0,1,1,280602],[0,0,1,-1,277693],[2,0,0,-1,173237],[2,0,-1,1,55413],[2,0,-1,-1,46271],[2,0,0,1,32573],[0,0,2,1,17198],[2,0,1,-1,9266],[0,0,2,-1,8822],[2,-1,0,-1,8216],[2,0,-2,-1,4324],[2,0,1,1,4200],[2,1,0,-1,-3359]];
function lunaKm(t) {
  const Tc = (t + JDE - 2451545) / 36525, r = DEG;
  const Lp = 218.3164477 + 481267.88123421 * Tc, D = 297.8501921 + 445267.1114034 * Tc, M = 357.5291092 + 35999.0502909 * Tc;
  const Mp = 134.9633964 + 477198.8675055 * Tc, F = 93.2720950 + 483202.0175233 * Tc, E = 1 - 0.002516 * Tc;
  let sl = 0, sr = 0, sb = 0;
  for (const [d, m, mp, f, cl, cr] of LR) { const a = (d * D + m * M + mp * Mp + f * F) * r, e = Math.pow(E, Math.abs(m)); sl += cl * e * Math.sin(a); sr += cr * e * Math.cos(a); }
  for (const [d, m, mp, f, cb] of BT) sb += cb * Math.pow(E, Math.abs(m)) * Math.sin((d * D + m * M + mp * Mp + f * F) * r);
  const lam = (Lp + sl / 1e6) * r, bet = sb / 1e6 * r, R = 385000.56 + sr / 1000;
  return [R * Math.cos(bet) * Math.cos(lam), R * Math.cos(bet) * Math.sin(lam), R * Math.sin(bet)];
}

/* ================= Saturn's moons (Saturn ring-plane frame) =================
   One precessing Keplerian ellipse per block (fitted to Horizons), blended at block edges,
   plus Horizons corrections around every close flyby. */
const MOONS = [
  { id: '601', zh: '弥玛斯', no: '土卫一', en: 'Mimas', R: 198.2, col: 'moon' },
  { id: '602', zh: '恩克拉多斯', no: '土卫二', en: 'Enceladus', R: 252.1, col: 'encel' },
  { id: '603', zh: '特提斯', no: '土卫三', en: 'Tethys', R: 531.0, col: 'moon' },
  { id: '604', zh: '狄俄涅', no: '土卫四', en: 'Dione', R: 561.4, col: 'moon' },
  { id: '605', zh: '瑞亚', no: '土卫五', en: 'Rhea', R: 763.5, col: 'moon' },
  { id: '606', zh: '泰坦', no: '土卫六', en: 'Titan', R: 2574.7, col: 'titan' },
  { id: '607', zh: '许珀里翁', no: '土卫七', en: 'Hyperion', R: 135.0, col: 'moon' },
  { id: '608', zh: '伊阿珀托斯', no: '土卫八', en: 'Iapetus', R: 734.5, col: 'moon' },
  { id: '609', zh: '菲比', no: '土卫九', en: 'Phoebe', R: 106.5, col: 'moon' },
];
const TITAN = 5, ENCEL = 1, PHOEBE = 8;
MOONS.forEach((m, i) => { m.fit = DATA.moons[m.id]; m.corr = DATA.corr.filter(c => c[1] === i); });
function keplerPos(el, dt, out) {
  const a = el[0], e = el[1], inc = el[2], Om = el[3] + el[4] * dt, pi = el[5] + el[6] * dt;
  const lam = el[7] + el[8] * dt + el[9] * dt * dt + el[10] * dt * dt * dt;
  const E = kepE(wrapPI(lam - pi), e);
  const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
  const r = a * (1 - e * Math.cos(E)), u = nu + pi - Om;
  const cO = Math.cos(Om), sO = Math.sin(Om), cu = Math.cos(u), su = Math.sin(u), ci = Math.cos(inc), si = Math.sin(inc);
  out[0] = r * (cO * cu - sO * su * ci); out[1] = r * (sO * cu + cO * su * ci); out[2] = r * su * si;
  return out;
}
const KT = [0, 0, 0];
function moonKm(i, t) {
  const m = MOONS[i], f = m.fit, B = f.B, L = f.L;
  const x = (t - f.T0) / L - 0.5, i0 = clamp(Math.floor(x), 0, B.length - 1), i1 = Math.min(i0 + 1, B.length - 1);
  let w = clamp((x - i0 - 0.5) / 0.1 + 0.5, 0, 1); w = w * w * (3 - 2 * w);
  if (x < 0) w = 0;
  const p = [0, 0, 0];
  if (w < 1) { keplerPos(B[i0], t - (f.T0 + (i0 + 0.5) * L), KT); for (let c = 0; c < 3; c++) p[c] += KT[c] * (1 - w); }
  if (w > 0) { keplerPos(B[i1], t - (f.T0 + (i1 + 0.5) * L), KT); for (let c = 0; c < 3; c++) p[c] += KT[c] * w; }
  // flyby corrections (truth − model), faded out over half a day
  const cs = m.corr;
  let lo = 0, hi = cs.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (cs[mid][0] < t - 0.6) lo = mid + 1; else hi = mid; }
  for (let k = lo; k < cs.length && cs[k][0] < t + 0.6; k++) {
    const c = cs[k], dt = t - c[0], b = bump(dt, 0.3, 0.6);
    if (b > 0) for (let q = 0; q < 3; q++) p[q] += (c[2 + q] + c[5 + q] * dt) * b;
  }
  return p;
}
const moonS = (i, t) => { const p = moonKm(i, t); return [p[0] / US, p[1] / US, p[2] / US]; };
function moonOrbitPts(i, t, n) {   // one revolution of the fitted ellipse around time t (S units)
  const m = MOONS[i], f = m.fit, B = f.B, L = f.L, bi = clamp(Math.floor((t - f.T0) / L), 0, B.length - 1), el = B[bi], tc = f.T0 + (bi + 0.5) * L;
  const P = TAU / el[8], out = new Float64Array((n + 1) * 3);
  for (let k = 0; k <= n; k++) { keplerPos(el, t - tc + (k / n - 0.5) * P, KT); out[3 * k] = KT[0] / US; out[3 * k + 1] = KT[1] / US; out[3 * k + 2] = KT[2] / US; }
  return out;
}
// Sun direction & Earth distance, Saturn frame
function sunDir(t) {
  const s = DATA.sun, x = (t - s.t0) / s.step, n = s.u.length / 3, i = clamp(Math.floor(x), 0, n - 2), k = clamp(x - i, 0, 1);
  const v = [0, 1, 2].map(c => s.u[3 * i + c] + (s.u[3 * i + 3 + c] - s.u[3 * i + c]) * k), l = Math.hypot(...v);
  return v.map(c => c / l);
}
function earthDistS(t) {
  const s = DATA.earth, x = (t - s.t0) / s.step, n = s.d.length, i = clamp(Math.floor(x), 0, n - 2), k = clamp(x - i, 0, 1);
  return (s.d[i] + (s.d[i + 1] - s.d[i]) * k) * 1e5;
}

/* ================= Flybys ================= */
const FLY = DATA.fly.map(f => ({ t: f[0], mi: f[1], alt: f[2], v: f[3] }));
const isTarget = f => f.mi === TITAN ? f.alt < 70000 : f.mi === ENCEL ? f.alt < 5000 : f.mi === PHOEBE ? true : f.alt < 10000;
const TF = FLY.filter(isTarget);
let nT = 0, nE = 0;
for (const f of TF) {
  if (f.mi === TITAN) { f.name = nT < 3 ? 'T' + 'ABC'[nT] : 'T' + nT; nT++; }
  else if (f.mi === ENCEL) { f.name = 'E' + nE; nE++; }
  else f.name = MOONS[f.mi].zh;
  f.cls = MOONS[f.mi].col;
}
const flyByName = n => TF.find(f => f.name === n);
const lastFly = mi => TF.filter(f => f.mi === mi);
const fT = FLY.find(f => f.mi === TITAN && f.t > T('2017-09-10') && f.t < T('2017-09-13'));
const PF = {}; for (const f of DATA.pfly) PF[f.p] = f;
const pv1 = DATA.pfly[0], pv2 = DATA.pfly[1], pe = DATA.pfly[2], pj = DATA.pfly[3];
const T_V1 = pv1.t, T_V2 = pv2.t, T_E = pe.t, T_J = pj.t, T_MAS = DATA.mas.t;
const PHO = TF.find(f => f.mi === PHOEBE);
const REVS = DATA.revs.map(r => ({ t: r[0], r: r[1], inc: r[2], per: r[3] }));
const T_SOI = REVS[0].t, APO = DATA.apo;
const revNo = t => { if (t < T_SOI - 0.2) return 0; let lo = 0, hi = APO.length; while (lo < hi) { const m = (lo + hi) >> 1; if (APO[m] <= t) lo = m + 1; else hi = m; } return lo + 1; };
const lastApo = t => { let lo = 0, hi = APO.length; while (lo < hi) { const m = (lo + hi) >> 1; if (APO[m] <= t) lo = m + 1; else hi = m; } return lo > 0 ? APO[lo - 1] : -1e9; };
const T_HY0 = THY.t[0], T_HYE = DATA.HYentry.t, T_LAND = T('2005-01-14T11:38');
const GF1 = DATA.gfX[0][0];
const TA = flyByName('TA'), E2 = flyByName('E2'), E5 = flyByName('E5'), E21 = flyByName('E21'), T126 = flyByName('T126'), IAP = TF.find(f => f.mi === 7);

/* ================= Timeline ================= */
const SEG = [
  { id: 'launch', n: '01', name: '发射，先朝太阳飞', short: '发射', yr: '1997–98', t0: T_START, t1: T('1999-01-01'), w: 9, frame: 'H' },
  { id: 'earth', n: '02', name: '金星与地球', short: '金星·地球', yr: '1999', t0: T('1999-01-01'), t1: T('1999-09-15'), w: 9, frame: 'H' },
  { id: 'jupiter', n: '03', name: '小行星与木星', short: '木星', yr: '1999–01', t0: T('1999-09-15'), t1: T('2001-07-01'), w: 7, frame: 'H' },
  { id: 'cruise', n: '04', name: '三年巡航', short: '巡航', yr: '2001–04', t0: T('2001-07-01'), t1: T('2004-05-01'), w: 6, frame: 'H' },
  { id: 'arrival', n: '05', name: '菲比与入轨', short: '入轨', yr: '2004', t0: T('2004-05-01'), t1: T('2004-07-15'), w: 9, frame: 'S' },
  { id: 'huygens', n: '06', name: '惠更斯号', short: '惠更斯', yr: '2004–05', t0: T('2004-07-15'), t1: T('2005-01-20'), w: 9, frame: 'S' },
  { id: 'prime', n: '07', name: '主任务', short: '主任务', yr: '2005–08', t0: T('2005-01-20'), t1: T('2008-07-01'), w: 13, frame: 'S' },
  { id: 'equinox', n: '08', name: '春分任务', short: '春分', yr: '2008–10', t0: T('2008-07-01'), t1: T('2010-09-28'), w: 9, frame: 'S' },
  { id: 'solstice', n: '09', name: '至日任务', short: '至日', yr: '2010–16', t0: T('2010-09-28'), t1: T('2016-11-30'), w: 14, frame: 'S' },
  { id: 'grazing', n: '10', name: '擦着 F 环飞', short: '擦环', yr: '2016–17', t0: T('2016-11-30'), t1: T('2017-04-22T03:00'), w: 6, frame: 'S' },
  { id: 'finale', n: '11', name: '大结局', short: '结局', yr: '2017', t0: T('2017-04-22T03:00'), t1: T_END, w: 10, frame: 'S' },
];
const WSUM = SEG.reduce((s, g) => s + g.w, 0);
let acc = 0;
for (const g of SEG) { g.u0 = acc / WSUM; acc += g.w; g.u1 = acc / WSUM; }
const segOfU = u => { for (let i = 0; i < SEG.length; i++) if (u < SEG[i].u1) return i; return SEG.length - 1; };
const segOfT = t => { for (let i = 0; i < SEG.length; i++) if (t < SEG[i].t1) return i; return SEG.length - 1; };
const tFromU = u => { const g = SEG[segOfU(u)]; return g.t0 + (u - g.u0) / (g.u1 - g.u0) * (g.t1 - g.t0); };
const uFromT = t => { for (const g of SEG) if (t <= g.t1) return g.u0 + clamp((t - g.t0) / (g.t1 - g.t0), 0, 1) * (g.u1 - g.u0); return 1; };
const SHOW_T = [T_V1 - 1.5, T_E - 1.4, T_J - 30, T('2002-06-21'), T('2004-06-30T21:00'), T_HYE - 0.9, E2.t - 0.6, T('2009-08-11'), T('2013-07-19T21:00'), T('2017-01-10'), GF1 - 0.6];

const wan = km => km >= 1e5 ? (km / 1e4).toFixed(km >= 1e6 ? 0 : 1).replace(/\.0$/, '') + ' 万 km' : fmtInt(km) + ' km';
const altTxt = f => f.alt >= 1e5 ? wan(f.alt) : fmtInt(f.alt) + ' km';
// t: when the note appears; win: how long it stays (days); at: where the event buttons jump to
const EVENTS = [
  { t: T_START, at: T_START, win: 18, d: '1997-10-15 08:43 UT', x: '发射 · 大力神 IVB/半人马座 · 卡纳维拉尔角 40 号发射台' },
  { t: T_V1 - 1.2, at: T_V1, win: 2.4, d: utc(T_V1), x: `第一次金星借力 · 距金星表面 ${fmtInt(pv1.d - PR.venus)} km`, key: 1 },
  { t: T('1998-12-03'), win: 40, d: '1998-12-03', x: '深空机动：主发动机点火约 88 分钟，速度改变约 450 m/s' },
  { t: T_V2 - 1.2, at: T_V2, win: 2.4, d: utc(T_V2), x: `第二次金星借力 · 本图 ${fmtInt(pv2.d - PR.venus)} km（当年公布 623 km）`, key: 1 },
  { t: T_E - 1.2, at: T_E, win: 2.6, d: utc(T_E), x: `地球借力 · 距地面 ${fmtInt(pe.d - PR.earth)} km，相对速度 ${pe.v.toFixed(1)} km/s`, key: 1 },
  { t: T_MAS - 12, at: T_MAS, win: 24, d: '2000-01-23', x: `经过小行星 2685 Masursky，约 ${wan(DATA.mas.d)}` },
  { t: T_J - 12, at: T_J, win: 24, d: utc(T_J), x: `木星最近点 · 距木星中心约 ${wan(pj.d)}，与伽利略号联合观测`, key: 1 },
  { t: T('2002-06-06'), at: T('2002-06-21'), win: 31, d: '2002-06-06 — 07-07', x: '太阳合：信号擦过太阳，检验广义相对论' },
  { t: T('2004-06-01'), win: 7, d: '2004-06-01', x: '在照片里发现两颗新卫星 Methone 和 Pallene' },
  { t: PHO.t - 0.4, at: PHO.t, win: 0.8, d: utc(PHO.t), x: `飞越菲比 · 距表面 ${fmtInt(PHO.alt)} km（史料 2,068 km）`, key: 1 },
  { t: DATA.soiX[0][0] - 0.03, at: DATA.soiX[0][0], win: 0.05, d: utc(DATA.soiX[0][0]), x: `从 F 环与 G 环之间穿过环平面，距土星中心 ${wan(DATA.soiX[0][1])}` },
  { t: T('2004-07-01T01:12'), win: 0.067, d: '2004-07-01 01:12 UT', x: '入轨点火开始：96 分钟，减速 626 m/s' },
  { t: T_SOI - 0.004, at: T_SOI, win: 0.08, d: utc(T_SOI), x: `最接近土星：距云顶 ${fmtInt(REVS[0].r - RS)} km，成为第一个土星轨道器`, key: 1 },
  { t: DATA.soiX[1][0] - 0.01, at: DATA.soiX[1][0], win: 1.2, d: utc(DATA.soiX[1][0]), x: '从光环另一侧穿出环平面' },
  { t: TA.t - 0.5, at: TA.t, win: 1.2, d: utc(TA.t), x: `TA：第一次近距飞越泰坦，${altTxt(TA)}` },
  { t: T_HY0, at: T_HY0, win: 3, d: '2004-12-25 02:00 UT', x: '弹出惠更斯号，让它独自滑行 20 天飞向泰坦', key: 1 },
  { t: T_HYE - 0.02, at: T_HYE, win: 0.1, d: utc(T_HYE), x: '惠更斯号进入泰坦大气，开始两个半小时的降落', key: 1 },
  { t: T_LAND - 0.02, at: T_LAND, win: 0.3, d: '2005-01-14 约 11:38 UT', x: '惠更斯号着陆：−179 °C，1.47 个大气压' },
  { t: E2.t - 0.3, at: E2.t, win: 0.6, d: utc(E2.t), x: `E2：从恩克拉多斯上空 ${fmtInt(E2.alt)} km 穿过一团水汽` },
  { t: T('2005-11-27'), win: 20, d: '2005 年 11 月', x: '照片证实恩克拉多斯南极在喷水汽和冰粒' },
  { t: T('2006-07-22'), win: 30, d: '2006-07-22', x: 'T16：雷达在泰坦北极发现湖泊' },
  { t: IAP.t - 0.5, at: IAP.t, win: 1, d: utc(IAP.t), x: `唯一一次近距飞越伊阿珀托斯，${fmtInt(IAP.alt)} km` },
  { t: T('2008-06-30'), win: 25, d: '2008-06-30', x: '主任务结束，进入春分任务' },
  { t: E5.t - 0.3, at: E5.t, win: 0.6, d: utc(E5.t), x: `E5：离恩克拉多斯表面只有 ${fmtInt(E5.alt)} km，穿过羽流` },
  { t: T('2009-08-01'), at: T('2009-08-11'), win: 25, d: '2009-08-11', x: '土星春分：阳光平射环面，环上的垂直结构投下长影' },
  { t: T('2010-09-28'), win: 25, d: '2010-09-28', x: '进入至日任务' },
  { t: T('2010-12-05'), win: 60, d: '2010-12-05', x: '北半球爆发大风暴，两个月后绕土星一圈' },
  { t: T('2013-07-19'), at: T('2013-07-19T21:27'), win: 6, d: '2013-07-19', x: '“地球微笑的那一天”：在土星阴影里逆光拍摄光环和远处的地球' },
  { t: T('2015-09-15'), win: 20, d: '2015-09-15', x: '恩克拉多斯的摆动证明冰壳下有全球海洋' },
  { t: E21.t - 0.3, at: E21.t, win: 0.6, d: utc(E21.t), x: `E21：最深的一次羽流穿越，距表面 ${fmtInt(E21.alt)} km（史料 49 km）` },
  { t: T('2016-11-30'), win: 12, d: '2016-11-30', x: '开始擦 F 环的 20 圈轨道' },
  { t: T126.t - 0.4, at: T126.t, win: 1.2, d: utc(T126.t), x: `T126：最后一次近距飞越泰坦，${fmtInt(T126.alt)} km，开启大结局` },
  { t: GF1 - 0.08, at: GF1, win: 0.2, d: utc(GF1), x: '第一次穿过土星与光环之间的缝隙', key: 1 },
  { t: T('2017-05-24'), win: 6, d: '2017-05-24', x: '土星北半球夏至' },
  { t: fT.t - 0.6, at: fT.t, win: 1.5, d: utc(fT.t), x: `最后一次经过泰坦（${wan(fT.alt)}），把它推向土星` },
  { t: T('2017-09-15T10:31') - 0.03, at: T('2017-09-15T10:31'), win: 0.05, d: '2017-09-15 10:31 UT', x: '进入土星大气，推进器全力保持天线指向地球', key: 1 },
  { t: T_END - 0.0006, at: T_END, win: 1, d: '10:32 UT · 地球 11:55 UT', x: '信号中断。83 分钟后，地球收到最后的信号' },
];
for (const e of EVENTS) if (e.at === undefined) e.at = e.t;
EVENTS.sort((a, b) => a.at - b.at);
// playback eases off near the close passes: [time, width (days), max days per second at 1x]
const FOCUS = [[T_V1, 0.9, 0.3], [T_V2, 0.9, 0.3], [T_E, 0.9, 0.3], [T_J, 14, 5], [PHO.t, 0.3, 0.08], [T('2004-07-01T02:00'), 0.12, 0.03],
  [T_HYE, 0.12, 0.035], [GF1, 0.12, 0.04], [T_END - 0.02, 0.06, 0.012]];
const timeShown = t => FOCUS.some(f => Math.abs(t - f[0]) < Math.max(0.6, f[1] * 2)) || TF.some(f => Math.abs(t - f.t) < 0.3) || (t > T_HY0 - 0.5 && t < T_LAND + 0.5 && t > T_HYE - 1);
const JUMPS = {
  V1: { t: T_V1 - 1.1 }, V2: { t: T_V2 - 1.1 }, E: { t: T_E - 1.1 }, J: { t: T_J - 20 }, GR: { t: T('2002-06-21') },
  PH: { t: PHO.t - 0.25, lock: PHOEBE }, SOI: { t: T('2004-06-30T22:30') }, HY: { t: T_HYE - 0.5 },
  E2: { t: E2.t - 0.12, lock: ENCEL }, IA: { t: IAP.t - 0.2, lock: 7 }, E5: { t: E5.t - 0.06, lock: ENCEL }, EQ: { t: T('2009-08-11') },
  E21: { t: E21.t - 0.06, lock: ENCEL }, SMILE: { t: T('2013-07-19T21:27') }, GF1: { t: GF1 - 0.35 }, END: { t: T_END - 0.06 },
};

/* ================= DOM ================= */
const $ = id => document.getElementById(id);
const sheet = $('sheet'), cv = $('cv'), ctx = cv.getContext('2d'), tagsBox = $('tags');
const track = $('track'), thumb = $('thumb'), fillEl = $('fill'), bands = $('bands'), ticks = $('ticks'), fticks = $('fticks');
const playBtn = $('play'), playIcon = $('playIcon');
const chapters = [...document.querySelectorAll('.ch')];
SEG.forEach(g => {
  const b = document.createElement('div');
  b.className = 'band'; b.style.flex = `${g.w} 1 0`;
  b.innerHTML = `<b>${g.short}</b><span>${g.yr}</span>`;
  bands.appendChild(b); g.band = b;
});
for (const e of EVENTS) {
  const i = document.createElement('i'); e.u = uFromT(e.at); i.style.left = (e.u * 100) + '%'; ticks.appendChild(i);
}
for (const f of TF) {
  const i = document.createElement('i'); i.style.left = (uFromT(f.t) * 100) + '%';
  i.style.background = `var(--${f.cls})`; fticks.appendChild(i);
}
// fill in reconstructed numbers next to the historical ones
$('dV1').textContent = `1998-04-26 · ${fmtInt(pv1.d - PR.venus)} km`;
$('dV2').textContent = `1999-06-24 · 623 km（本图 ${fmtInt(pv2.d - PR.venus)} km）`;
$('dE').textContent = `1999-08-18 03:28 UT · 1,171 km（本图 ${fmtInt(pe.d - PR.earth)} km）`;
$('dMas').textContent = `2000-01-23 · 约 160 万 km（本图 ${wan(DATA.mas.d)}）`;
$('dJ').textContent = `${isoDate(T_J)} · 距木星中心 ${wan(pj.d)}`;
$('dPh').textContent = `2004-06-11 · 2,068 km（本图 ${fmtInt(PHO.alt)} km）`;
$('dSOIX').textContent = `${utc(DATA.soiX[0][0]).slice(11)} · 距土星中心 ${wan(DATA.soiX[0][1])}`;
const rg = REVS.filter(r => r.t > T('2016-12-01') && r.t < T('2017-04-22'));
$('dRG').textContent = `距土星中心 ${wan(Math.min(...rg.map(r => r.r)))}—${wan(Math.max(...rg.map(r => r.r)))}`;
const gfR = DATA.gfX.map(x => x[1]);
$('dGF').textContent = `距云顶 ${fmtInt(Math.min(...gfR) - RS)}—${fmtInt(Math.max(...gfR) - RS)} km`;

let C = {}, isDark = false, dirty = true;
const tokenNames = ['sheet', 'paper', 'ink', 'ink-2', 'rule', 'grid', 'pen', 'gold', 'titan', 'encel', 'moon', 'blue', 'titan-ink', 'encel-ink', 'moon-ink'];
function readTokens() {
  const cs = getComputedStyle(document.documentElement);
  for (const n of tokenNames) C[n] = cs.getPropertyValue('--' + n).trim() || '#888';
  const hx = parseInt(C.sheet.replace('#', '').padEnd(6, '0').slice(0, 6), 16);
  isDark = (((hx >> 16) & 255) * 0.3 + ((hx >> 8) & 255) * 0.59 + (hx & 255) * 0.11) < 110;
  dirty = true; if (typeof drawProfile === 'function' && profReady) drawProfile();
}
function rgba(hex, a) {
  let h = hex.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h, 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/* ================= Camera ================= */
const cam = { tx: 0, ty: 0, tz: 0, dist: 44, az: -92, el: 56 };
let W = 300, H = 300, DPR = 1, focal = 1, B = null, NEAR = 0.05, DIST = 40;
function basis() {
  const az = cam.az * DEG, el = cam.el * DEG, ce = Math.cos(el);
  DIST = cam.dist * Math.max(1, 1.3 / (W / H));
  const pos = [cam.tx + DIST * ce * Math.cos(az), cam.ty + DIST * ce * Math.sin(az), cam.tz + DIST * Math.sin(el)];
  let f = [cam.tx - pos[0], cam.ty - pos[1], cam.tz - pos[2]]; const fl = Math.hypot(...f); f = f.map(v => v / fl);
  let r = [f[1], -f[0], 0]; const rl = Math.hypot(r[0], r[1]) || 1; r = [r[0] / rl, r[1] / rl, 0];
  const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  B = { pos, f, r, u };
  focal = (H / 2) / Math.tan(19 * DEG);
  NEAR = DIST * 0.01;
}
const PO = { x: 0, y: 0, z: 0 };
function proj(x, y, z) {
  const dx = x - B.pos[0], dy = y - B.pos[1], dz = z - B.pos[2];
  const zc = dx * B.f[0] + dy * B.f[1] + dz * B.f[2];
  if (zc < NEAR) { PO.z = -1; return false; }
  PO.x = W / 2 + (dx * B.r[0] + dy * B.r[1] + dz * B.r[2]) / zc * focal;
  PO.y = H / 2 - (dx * B.u[0] + dy * B.u[1] + dz * B.u[2]) / zc * focal;
  PO.z = zc; return true;
}
const projP = p => proj(p[0], p[1], p[2]) ? { x: PO.x, y: PO.y, z: PO.z } : null;
const viewR = () => DIST * Math.tan(19 * DEG) * Math.max(1, W / H);

/* ================= Drawing primitives ================= */
let SX = new Float32Array(8192), SY = new Float32Array(8192), SZ = new Float32Array(8192);
let gAlpha = 1;
function ensure(n) { if (SX.length < n) { SX = new Float32Array(n * 2); SY = new Float32Array(n * 2); SZ = new Float32Array(n * 2); } }
const depthFade = z => clamp(1.32 - 0.62 * (z / DIST), 0.32, 1);
function poly(P, i0, i1, color, width, alpha, opt = {}) {
  const n = i1 - i0 + 1; if (n < 2) return;
  ensure(n);
  for (let k = 0; k < n; k++) { const j = (i0 + k) * 3; proj(P[j], P[j + 1], P[j + 2]); SX[k] = PO.x; SY[k] = PO.y; SZ[k] = PO.z; }
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(opt.dash || []);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  let open = false, cur = -1;
  for (let k = 1; k < n; k++) {
    if (SZ[k - 1] <= 0 || SZ[k] <= 0) { if (open) { ctx.stroke(); open = false; } continue; }
    let a = alpha * (opt.flat ? 1 : depthFade((SZ[k - 1] + SZ[k]) / 2));
    if (opt.af) a *= opt.af(i0 + k);
    const q = Math.round(a * 14) / 14;
    if (q <= 0.005) { if (open) { ctx.stroke(); open = false; } continue; }
    if (!open || q !== cur) {
      if (open) ctx.stroke();
      ctx.globalAlpha = q * gAlpha; ctx.beginPath(); ctx.moveTo(SX[k - 1], SY[k - 1]); cur = q; open = true;
    }
    ctx.lineTo(SX[k], SY[k]);
  }
  if (open) ctx.stroke();
  ctx.setLineDash([]); ctx.globalAlpha = gAlpha;
}
function camSpace(p) {
  const dx = p[0] - B.pos[0], dy = p[1] - B.pos[1], dz = p[2] - B.pos[2];
  return [dx * B.r[0] + dy * B.r[1] + dz * B.r[2], dx * B.u[0] + dy * B.u[1] + dz * B.u[2], dx * B.f[0] + dy * B.f[1] + dz * B.f[2]];
}
function seg3(a, b, color, width, alpha, dash) {
  const pa = camSpace(a), pb = camSpace(b);
  if (pa[2] < NEAR && pb[2] < NEAR) return;
  let A = pa, Bv = pb;
  if (A[2] < NEAR) { const k = (NEAR - A[2]) / (Bv[2] - A[2]); A = A.map((v, i) => v + (Bv[i] - v) * k); }
  if (Bv[2] < NEAR) { const k = (NEAR - Bv[2]) / (A[2] - Bv[2]); Bv = Bv.map((v, i) => v + (A[i] - v) * k); }
  ctx.globalAlpha = alpha * gAlpha; ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash || []);
  ctx.beginPath(); ctx.moveTo(W / 2 + A[0] / A[2] * focal, H / 2 - A[1] / A[2] * focal); ctx.lineTo(W / 2 + Bv[0] / Bv[2] * focal, H / 2 - Bv[1] / Bv[2] * focal);
  ctx.stroke(); ctx.setLineDash([]);
}
const flat = pts => { const P = new Float64Array(pts.length * 3); pts.forEach((p, i) => P.set(p, i * 3)); return P; };
const niceStep = x => { const e = Math.pow(10, Math.floor(Math.log10(x))), m = x / e; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * e; };
// graph paper: polar around the central body when it is in view, otherwise a local square grid
function grid(center, z0) {
  const vr = viewR(), tgt = [cam.tx, cam.ty, cam.tz];
  const dC = Math.hypot(tgt[0] - center[0], tgt[1] - center[1]);
  const step = niceStep(vr / 4.2), major = step * 5;
  const vig = (x, y, z) => clamp(1.2 - Math.hypot(x - tgt[0], y - tgt[1], (z - tgt[2]) * 0.5) / (vr * 1.55), 0, 1);
  if (dC < vr * 2.2) {
    const rMax = dC + vr * 1.7, n = Math.min(70, Math.floor(rMax / step));
    for (let k = 1; k <= n; k++) {
      const R = k * step, pts = new Float64Array(97 * 3), mj = Math.abs(R / major - Math.round(R / major)) < 1e-6;
      for (let i = 0; i <= 96; i++) { const a = i / 96 * TAU; pts[3 * i] = center[0] + R * Math.cos(a); pts[3 * i + 1] = center[1] + R * Math.sin(a); pts[3 * i + 2] = z0; }
      poly(pts, 0, 96, C.grid, mj ? 1.05 : 0.8, mj ? 0.62 : 0.28, { flat: true, af: i => vig(pts[3 * i], pts[3 * i + 1], z0) });
    }
    for (let s = 0; s < 12; s++) {
      const a = s / 12 * TAU, pts = new Float64Array(15 * 3);
      for (let i = 0; i <= 14; i++) { const R = step + (rMax - step) * i / 14; pts[3 * i] = center[0] + R * Math.cos(a); pts[3 * i + 1] = center[1] + R * Math.sin(a); pts[3 * i + 2] = z0; }
      poly(pts, 0, 14, C.grid, 0.8, s % 3 === 0 ? 0.36 : 0.18, { flat: true, af: i => vig(pts[3 * i], pts[3 * i + 1], z0) });
    }
  } else {
    const ext = vr * 1.6, x0 = Math.ceil((tgt[0] - ext) / step) * step, y0 = Math.ceil((tgt[1] - ext) / step) * step, zz = tgt[2];
    const line = (ax, ay, bx, by, mj) => {
      const pts = new Float64Array(15 * 3);
      for (let i = 0; i <= 14; i++) { const k = i / 14; pts[3 * i] = ax + (bx - ax) * k; pts[3 * i + 1] = ay + (by - ay) * k; pts[3 * i + 2] = zz; }
      poly(pts, 0, 14, C.grid, mj ? 1.05 : 0.8, mj ? 0.6 : 0.26, { flat: true, af: i => vig(pts[3 * i], pts[3 * i + 1], zz) });
    };
    for (let x = x0; x <= tgt[0] + ext; x += step) line(x, tgt[1] - ext, x, tgt[1] + ext, Math.abs(x / major - Math.round(x / major)) < 1e-6);
    for (let y = y0; y <= tgt[1] + ext; y += step) line(tgt[0] - ext, y, tgt[0] + ext, y, Math.abs(y / major - Math.round(y / major)) < 1e-6);
  }
}
// sphere seen as a disk, night side shaded from the true sun direction; optional squash for an oblate planet
function sunScreen(v) {   // sun direction as a screen angle plus its component toward the viewer
  const sx = v[0] * B.r[0] + v[1] * B.r[1] + v[2] * B.r[2], sy = v[0] * B.u[0] + v[1] * B.u[1] + v[2] * B.u[2];
  return { ang: Math.atan2(-sy, sx), sz: -(v[0] * B.f[0] + v[1] * B.f[1] + v[2] * B.f[2]) };
}
function shadedDisk(rr, sunDirV, fillCol, strokeCol, nightA, angOffset = 0) {
  const { ang, sz } = sunScreen(sunDirV);
  ctx.rotate(ang - angOffset);
  ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.fillStyle = C.sheet; ctx.fill();
  if (fillCol !== C.sheet) { ctx.fillStyle = fillCol; ctx.fill(); }
  const c2 = -sz;
  ctx.beginPath(); ctx.arc(0, 0, rr, Math.PI / 2, Math.PI * 1.5, false);
  ctx.ellipse(0, 0, Math.max(0.001, Math.abs(c2) * rr), rr, 0, -Math.PI / 2, Math.PI / 2, c2 < 0);
  ctx.closePath(); ctx.fillStyle = isDark ? `rgba(0,0,0,${nightA + 0.12})` : rgba(C.ink, nightA); ctx.fill();
  if (strokeCol) { ctx.beginPath(); ctx.arc(0, 0, rr, 0, TAU); ctx.lineWidth = 1.3; ctx.strokeStyle = strokeCol; ctx.stroke(); }
}
function body(c, R, sunDirV, fillCol, strokeCol, minPx, nightA) {
  if (!proj(c[0], c[1], c[2])) return null;
  const x = PO.x, y = PO.y, rr = Math.max(minPx, R / PO.z * focal);
  if (x < -rr - 50 || x > W + rr + 50 || y < -rr - 50 || y > H + rr + 50) return { x, y, r: rr };
  ctx.save(); ctx.globalAlpha = gAlpha; ctx.translate(x, y);
  shadedDisk(rr, sunDirV, fillCol, strokeCol, nightA);
  ctx.restore();
  return { x, y, r: rr };
}
function dot2(p, r, fill, stroke, w = 1.5) {
  if (!proj(p[0], p[1], p[2])) return null;
  ctx.globalAlpha = gAlpha; ctx.beginPath(); ctx.arc(PO.x, PO.y, r, 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.stroke(); }
  return { x: PO.x, y: PO.y };
}
function craftMark(p, name, left) {
  if (!proj(p[0], p[1], p[2])) return;
  const x = PO.x, y = PO.y;
  ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.strokeStyle = C.pen; ctx.lineWidth = 1; ctx.globalAlpha = 0.45 * gAlpha; ctx.stroke();
  ctx.globalAlpha = gAlpha;
  ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.lineTo(x + 5, y); ctx.lineTo(x, y + 5); ctx.lineTo(x - 5, y); ctx.closePath();
  ctx.fillStyle = C.pen; ctx.fill();
  placeTag('sc', p, name, 'sc', left ? -12 : 12, 0);
}
function dropLine(p, color, z0 = 0) {
  if (Math.abs(p[2] - z0) < viewR() * 0.004) return;
  seg3(p, [p[0], p[1], z0], color, 1, 0.55, [2, 3]);
  const q = projP([p[0], p[1], z0]); if (!q) return;
  ctx.globalAlpha = 0.6 * gAlpha; ctx.strokeStyle = color; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(q.x - 3, q.y); ctx.lineTo(q.x + 3, q.y); ctx.stroke();
}
function arrow(a, b, color, w, alpha) {
  seg3(a, b, color, w, alpha);
  const pa = projP(a), pb = projP(b); if (!pa || !pb) return;
  const ang = Math.atan2(pb.y - pa.y, pb.x - pa.x);
  ctx.globalAlpha = alpha * gAlpha; ctx.strokeStyle = color; ctx.lineWidth = w; ctx.beginPath();
  ctx.moveTo(pb.x - 9 * Math.cos(ang - 0.45), pb.y - 9 * Math.sin(ang - 0.45)); ctx.lineTo(pb.x, pb.y); ctx.lineTo(pb.x - 9 * Math.cos(ang + 0.45), pb.y - 9 * Math.sin(ang + 0.45)); ctx.stroke();
}

/* ================= HTML tags that follow 3D points ================= */
const TAGS = new Map();
function placeTag(id, p, text, cls, dx = 8, dy = 0) {
  let tg = TAGS.get(id);
  if (!tg) { const el = document.createElement('div'); tagsBox.appendChild(el); tg = { el, text: null, cls: null }; TAGS.set(id, tg); }
  const k = 'tag ' + (cls || '');
  if (tg.text !== text || tg.cls !== k) { tg.el.textContent = text; tg.text = text; tg.el.className = k; tg.cls = k; tg.w = 0; }
  tg.used = true;
  if (!proj(p[0], p[1], p[2])) { tg.el.hidden = true; return; }
  if (tg.el.hidden) tg.el.hidden = false;
  if (!tg.w) tg.w = tg.el.offsetWidth || 60;
  const x0 = dx < 0 ? PO.x + dx - tg.w : PO.x + dx, y0 = PO.y + dy;
  if (x0 < 4 || x0 + tg.w > W - 4 || y0 < 10 || y0 > H - 10) { tg.el.hidden = true; return; }
  tg.el.style.opacity = gAlpha;
  tg.el.style.transform = `translate(${x0.toFixed(1)}px,${y0.toFixed(1)}px) translateY(-50%)`;
}

/* ================= State & camera presets ================= */
const state = { u: 0, t: 0 };
let segIdx = -1, playing = false, userCam = false, tween = null, fadeStart = -1e9, lastFrame = '';
let follow = false, scNow = null, rateIdx = 1, lock = null;
const RATES = [0.5, 1, 2, 4];
function lerpCam(a, b, k) {
  const daz = ((b.az - a.az + 540) % 360) - 180;
  return { tx: a.tx + (b.tx - a.tx) * k, ty: a.ty + (b.ty - a.ty) * k, tz: a.tz + (b.tz - a.tz) * k,
           dist: a.dist * Math.pow(b.dist / a.dist, k), az: a.az + daz * k, el: a.el + (b.el - a.el) * k };
}
// zoom toward a point: the target moves in step with the distance, so the point stays in frame throughout
function lerpZoom(a, b, k) {
  const c = lerpCam(a, b, k);
  if (Math.abs(a.dist - b.dist) > 1e-12) {
    const w = clamp((a.dist - c.dist) / (a.dist - b.dist), 0, 1);
    c.tx = a.tx + (b.tx - a.tx) * w; c.ty = a.ty + (b.ty - a.ty) * w; c.tz = a.tz + (b.tz - a.tz) * w;
  }
  return c;
}
const at = (p, o) => Object.assign({ tx: p[0], ty: p[1], tz: p[2] }, o);
const env = (t, tf, a, b) => smooth(tf - a, tf - b, t) * (1 - smooth(tf + b, tf + a, t));
function closeUp(base, t, list) {
  let best = null, bk = 0;
  for (const z of list) { const k = env(t, z.t, z.a, z.b); if (k > bk) { bk = k; best = z; } }
  if (!best || bk <= 0) return base;
  return lerpZoom(base, best.cam(t), bk);
}
const PRESET = {
  launch: t => closeUp({ tx: -0.6, ty: 1.2, tz: 0, dist: 34, az: -96, el: 58 }, t,
    [{ t: T_V1, a: 2.6, b: 0.22, cam: t => at(planetH('venus', t), { dist: 0.0045, az: -40, el: 20 }) }]),
  earth: t => closeUp({ tx: -0.6, ty: 1.2, tz: 0, dist: 34, az: -96, el: 58 }, t,
    [{ t: T_V2, a: 2.6, b: 0.22, cam: t => at(planetH('venus', t), { dist: 0.0048, az: -150, el: 22 }) },
     { t: T_E, a: 2.6, b: 0.22, cam: t => at(planetH('earth', t), { dist: 0.0056, az: -120, el: 24 }) }]),
  jupiter: t => closeUp({ tx: -6, ty: -14, tz: 0, dist: 110, az: -100, el: 56 }, t,
    [{ t: T_J, a: 48, b: 6, cam: t => at(planetH('jupiter', t), { dist: 2.4, az: -80, el: 34 }) }]),
  cruise: t => {
    const s = planetH('saturn', t), base = { tx: s[0] * 0.45, ty: s[1] * 0.45, tz: 0, dist: 190, az: -100, el: 56 };
    const gr = { tx: 0, ty: 0, tz: 0, dist: 150, az: -70, el: 30 };
    return lerpCam(base, gr, env(t, T('2002-06-21'), 70, 25));
  },
  arrival: t => {
    const r = Math.hypot(...rawS(t));
    const base = { tx: 0, ty: 0, tz: 0, dist: clamp(r * 1.25, 40, 3200), az: -60, el: 24 };
    return closeUp(base, t, [{ t: PHO.t, a: 2.5, b: 0.08, cam: t => at(moonS(PHOEBE, t), { dist: 0.55, az: -20, el: 18 }) }]);
  },
  huygens: t => {
    const base = { tx: 0, ty: 0, tz: 0, dist: 420, az: -70, el: 40 };
    const k = smooth(T_HYE - 1.6, T_HYE - 0.12, t) * (1 - smooth(T_LAND + 0.12, T_LAND + 1.6, t));
    return lerpZoom(base, at(moonS(TITAN, t), { dist: 11, az: -35, el: 22 }), k);
  },
  prime: () => ({ tx: 0, ty: 0, tz: 0, dist: 560, az: -80, el: 52 }),
  equinox: () => ({ tx: 0, ty: 0, tz: 0, dist: 380, az: -70, el: 30 }),
  solstice: () => ({ tx: 0, ty: 0, tz: 0, dist: 470, az: -60, el: 16 }),
  grazing: () => ({ tx: 0, ty: 0, tz: 0, dist: 120, az: -50, el: 22 }),
  finale: t => {
    const base = { tx: 0, ty: 0, tz: 0, dist: 62, az: -70, el: 12 };
    const k = smooth(T_END - 0.55, T_END - 0.05, t);
    const sc = rawS(t);
    return lerpZoom(base, at([sc[0] * 0.85, sc[1] * 0.85, sc[2] * 0.85], { dist: 4.2, az: -40, el: 10 }), k);
  },
};
const presetNow = () => PRESET[SEG[segIdx].id](state.t);
function startTween() {
  if (reduceMotion) { Object.assign(cam, presetNow()); tween = null; return; }
  tween = { start: performance.now(), dur: 1150, from: { ...cam } };
}
function setU(u) {
  state.u = clamp(u, 0, 1); state.t = tFromU(state.u);
  const si = segOfU(state.u);
  if (si !== segIdx) {
    const prev = segIdx; segIdx = si;
    userCam = false; setLock(null);
    if (prev < 0) Object.assign(cam, presetNow()); else startTween();
    if (prev >= 0 && SEG[prev].frame !== SEG[si].frame) fadeStart = performance.now();
    SEG.forEach((g, i) => g.band.classList.toggle('on', i === si));
    chapters.forEach((c, i) => { const on = i === si; c.classList.toggle('active', on); if (on) c.setAttribute('aria-current', 'step'); else c.removeAttribute('aria-current'); });
  }
  dirty = true;
}
function setPlaying(p) {
  if (playing && !p) saveHash();
  playing = p;
  playBtn.setAttribute('aria-label', p ? '暂停' : '播放');
  playIcon.innerHTML = p ? '<path d="M5 3h3.5v14H5zM11.5 3H15v14h-3.5z"/>' : '<path d="M5 3l12 7-12 7z"/>';
}
function jumpTo(si) { setPlaying(false); setU(uFromT(SHOW_T[si])); saveHash(); }
function jumpT(t, lockMi) {
  setPlaying(false); setU(uFromT(t));
  if (lockMi !== undefined && lockMi !== null) lockOn(lockMi, t);
  saveHash();
}
function jumpEvent(dir) {
  setPlaying(false);
  const t = state.t, list = dir > 0 ? EVENTS.filter(e => e.at > t + 1e-4) : EVENTS.filter(e => e.at < t - 1e-4);
  if (!list.length) return;
  const e = dir > 0 ? list.reduce((a, b) => b.at < a.at ? b : a) : list.reduce((a, b) => b.at > a.at ? b : a);
  setU(uFromT(e.at)); saveHash();
}
// camera lock on a moon (from the moon cards / chapter buttons)
const lockchip = $('lockchip');
function setLock(l) { lock = l; lockchip.hidden = !l; if (l) $('lockText').textContent = `镜头锁定 ${MOONS[l.mi].zh}`; dirty = true; }
function lockOn(mi, t) {
  const m = MOONS[mi], fl = TF.filter(f => f.mi === mi), near = fl.reduce((a, b) => Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a, fl[0]);
  const altKm = near ? near.alt : 5000;
  const d = clamp((m.R + altKm) * 9 / US, m.R * 9 / US, 80);
  userCam = true; tween = null; follow = false; followBtn.setAttribute('aria-pressed', 'false');
  const p = moonS(mi, t); Object.assign(cam, { tx: p[0], ty: p[1], tz: p[2], dist: d, az: cam.az, el: 20 });
  setLock({ mi });
}
let hashTimer = 0;
function saveHash() {
  clearTimeout(hashTimer);
  hashTimer = setTimeout(() => {
    const iso = new Date(D0 + state.t * 864e5).toISOString().slice(0, 16);
    try { history.replaceState(null, '', '#t=' + iso); } catch (e) { /* sandboxed frames may refuse */ }
  }, 250);
}
function readHash() {
  const m = /[#&]t=(\d{4}-\d\d-\d\d(?:T\d\d:\d\d)?)/.exec(location.hash || '');
  if (!m) return null;
  const t = T(m[1]); return Number.isFinite(t) && t >= T_START && t <= T_END ? t : null;
}

/* ================= Render ================= */
let lastHud = {};
function hud(id, val) { if (lastHud[id] !== val) { lastHud[id] = val; $(id).textContent = val; } }
function hudHTML(id, val) { if (lastHud[id] !== val) { lastHud[id] = val; $(id).innerHTML = val; } }
function render(now) {
  const g = SEG[segIdx], t = state.t;
  basis();
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.clearRect(0, 0, W, H);
  gAlpha = reduceMotion ? 1 : smooth(0, 380, now - fadeStart);
  ctx.globalAlpha = gAlpha;
  for (const tg of TAGS.values()) tg.used = false;
  ctx.font = '600 10.5px "JetBrains Mono", ui-monospace, monospace';
  ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  if (g.frame === 'H') renderH(g, t); else renderS(g, t);
  for (const tg of TAGS.values()) if (!tg.used) tg.el.hidden = true;
  updateHUD(g, t);
}

/* ---------- heliocentric cruise ---------- */
const ORBITS = {};
for (const name of Object.keys(PEL)) {
  const P = { venus: 224.7, earth: 365.26, mars: 687, jupiter: 4333, saturn: 10759 }[name], t0 = T('2001-01-01');
  ORBITS[name] = flat(Array.from({ length: 241 }, (_, i) => planetElemKm(name, t0 + i / 240 * P).map(v => v / UH)));
}
const PLC = { venus: 'gold', earth: 'blue', mars: 'ink-2', jupiter: 'gold', saturn: 'gold' };
const PZH = { venus: '金星', earth: '地球', mars: '火星', jupiter: '木星', saturn: '土星' };
const H_FLY = [
  { t: T_V1, p: 'venus', n: '金星借力 ①' }, { t: T_V2, p: 'venus', n: '金星借力 ②' }, { t: T_E, p: 'earth', n: '地球借力' }, { t: T_J, p: 'jupiter', n: '木星借力' },
];
function renderH(g, t) {
  const vr = viewR();
  const close = vr < 0.3;
  grid([0, 0, 0], close ? cam.tz : 0);
  const ink = C.ink, red = C.pen, gold = C.gold;
  if (!close) {
    const R0 = clamp(vr * 0.72, 12, 900);
    arrow([R0, 0, 0], [R0 * 1.18, 0, 0], ink, 1.2, 0.65);
    placeTag('equinox', [R0 * 1.18, 0, 0], '春分点方向 ♈', 'zh faint', -2, -14);
  }
  // planet orbits
  for (const name of Object.keys(ORBITS)) {
    if (name === 'saturn' && vr < 20 && g.id !== 'cruise') continue;
    poly(ORBITS[name], 0, 240, C[PLC[name]], 1.1, name === 'mars' ? 0.4 : 0.7);
  }
  // Sun
  const s = projP([0, 0, 0]);
  if (s) {
    const rad = Math.max(6, 696000 / UH / s.z * focal);
    const gr = ctx.createRadialGradient(s.x, s.y, rad * 0.6, s.x, s.y, rad * 4);
    gr.addColorStop(0, rgba(gold, 0.35)); gr.addColorStop(1, rgba(gold, 0));
    ctx.globalAlpha = gAlpha; ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(s.x, s.y, rad * 4, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(s.x, s.y, rad, 0, TAU); ctx.fillStyle = gold; ctx.fill();
    placeTag('sun', [0, 0, 0], '太阳', 'zh gold', rad + 6, 0);
  }
  // planets
  for (const name of Object.keys(PEL)) {
    const p = planetH(name, t), l = Math.hypot(...p), sd = p.map(v => -v / l);
    const b = body(p, PR[name] / UH, sd, C.sheet, C[PLC[name]], name === 'jupiter' || name === 'saturn' ? 4.5 : 3.6, 0.55);
    if (name === 'saturn' && b && b.r < 40) {   // a hint of the rings at small sizes
      ctx.save(); ctx.globalAlpha = gAlpha * 0.8; ctx.strokeStyle = gold; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r * 2.2, b.r * 0.75, -0.35, 0, TAU); ctx.stroke(); ctx.restore();
    }
    placeTag('pl-' + name, p, PZH[name], 'zh ' + (PLC[name] === 'ink-2' ? 'faint' : PLC[name]), (b ? b.r : 4) * 0.8 + 6, (b ? b.r : 4) * 0.8 + 6);
  }
  // Earth's Moon, in the 1999 close-up
  if (Math.abs(t - T_E) < 1.5 && vr < 0.2) {
    const e = planetH('earth', t), m = lunaKm(t).map((v, i) => e[i] + v / UH), l = Math.hypot(...m);
    body(m, 1737.4 / UH, m.map(v => -v / l), C.sheet, C.ink, 3, 0.55);
    placeTag('luna', m, '月球', 'zh faint', 8, 12);
  }
  // Masursky
  if (Math.abs(t - T_MAS) < 30) {
    const M = DATA.mas, dt = t - T_MAS, p = [0, 1, 2].map(c => (M.p[c] + M.v[c] * dt) / UH);
    dot2(p, 2.6, C['ink-2'], null); placeTag('mas', p, '2685 Masursky', 'faint', 8, -10);
  }
  // radio link during the 2002 solar conjunction
  const sc = rawH(t);
  if (t > T('2002-06-06') && t < T('2002-07-08')) {
    const e = planetH('earth', t); seg3(e, sc, C.blue, 1.1, 0.75, [5, 4]);
    placeTag('link', [(e[0] + sc[0]) / 2, (e[1] + sc[1]) / 2, (e[2] + sc[2]) / 2], '无线电信号擦过太阳', 'zh blue', 8, 16);
  }
  // trajectory: everything up to the end of the cruise, past part in red
  const iNow = idxAt(TH, t), iEnd = TH.n - 1;
  poly(TH.p, iNow, iEnd, C['ink-2'], 1.1, 0.5);
  poly(TH.p, 0, iNow, red, 2.2, 1);
  seg3([TH.p[3 * iNow], TH.p[3 * iNow + 1], TH.p[3 * iNow + 2]], sc, red, 2.2, 1);
  // flyby markers (where Cassini was at closest approach)
  H_FLY.forEach((f, i) => {
    if (close && Math.abs(t - f.t) < 1) return;
    const p = rawH(f.t), done = t >= f.t, o = dot2(p, 4.5, done ? C[PLC[f.p]] : null, C[PLC[f.p]], 1.4);
    if (o && !close && vr < 30) placeTag('hf' + i, p, f.n, 'zh ' + PLC[f.p], -12, -12);
  });
  dropLine(sc, red, close ? cam.tz : 0);
  craftMark(sc, '卡西尼号');
  scNow = sc;
}

/* ---------- Saturn ring plane ---------- */
const RINGS = [ // inner, outer (km), opacity
  [66900, 74490, 0.10], [74490, 91980, 0.32], [91980, 117580, 0.66], [117580, 122170, 0.13], [122170, 133423, 0.48], [133745, 136775, 0.44],
];
function annulusHalf(r0, r1, a0, a1, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([r1 * Math.cos(a), r1 * Math.sin(a)]); }
  for (let i = n; i >= 0; i--) { const a = a0 + (a1 - a0) * i / n; pts.push([r0 * Math.cos(a), r0 * Math.sin(a)]); }
  return pts;
}
function pathXY(pts, z) {
  ctx.beginPath(); let ok = true;
  pts.forEach((q, i) => { if (!proj(q[0], q[1], z)) ok = false; if (i) ctx.lineTo(PO.x, PO.y); else ctx.moveTo(PO.x, PO.y); });
  ctx.closePath(); return ok;
}
function drawRings(half, sunU) {
  // half: 'far' or 'near' relative to the planet as seen by the camera
  const phi = Math.atan2(B.f[1], B.f[0]);         // ring azimuth pointing away from the camera
  const a0 = half === 'far' ? phi - Math.PI / 2 : phi + Math.PI / 2, a1 = a0 + Math.PI;
  const lit = Math.sign(B.pos[2] || 1) === Math.sign(sunU[2] || 1) ? 1 : 0.55;
  const gold = C.gold;
  ctx.save(); ctx.globalAlpha = gAlpha;
  for (const [r0, r1, op] of RINGS) {
    if (!pathXY(annulusHalf(r0 / US, r1 / US, a0, a1, 64), 0)) continue;
    ctx.fillStyle = rgba(gold, op * lit * (isDark ? 0.9 : 1)); ctx.fill();
  }
  // planet's shadow on the rings: a strip along the anti-sun direction
  const sh = Math.hypot(sunU[0], sunU[1]), el = Math.abs(sunU[2]);
  if (sh > 1e-3) {
    const ax = -sunU[0] / sh, ay = -sunU[1] / sh, px = -ay, py = ax, Rp = RS / US;
    const L = Math.min(137000 / US * 1.05, Rp / Math.max(el, 1e-3));
    const shp = [[Rp * px, Rp * py], [Rp * px + ax * L, Rp * py + ay * L], [-Rp * px + ax * L, -Rp * py + ay * L], [-Rp * px, -Rp * py]];
    // clip to this half of the rings
    if (pathXY(annulusHalf(66900 / US, 136775 / US, a0, a1, 64), 0)) {
      ctx.clip();
      if (pathXY(shp, 0)) { ctx.fillStyle = isDark ? 'rgba(0,0,0,.55)' : rgba(C.ink, 0.32); ctx.fill(); }
    }
  }
  ctx.restore();
  // F ring and G ring as lines
  const ringLine = (R, a, w) => { const pts = new Float64Array(49 * 3); for (let i = 0; i <= 48; i++) { const ang = a0 + Math.PI * i / 48; pts[3 * i] = R * Math.cos(ang); pts[3 * i + 1] = R * Math.sin(ang); } poly(pts, 0, 48, gold, w, a * lit, { flat: true }); };
  ringLine(140180 / US, 0.85, 1.1); ringLine(170000 / US, 0.25, 3); ringLine(238000 / US, 0.08, 9);
}
function saturnBody(sunU) {
  if (!proj(0, 0, 0)) return null;
  const x = PO.x, y = PO.y, aPx = (RS / US) / PO.z * focal;
  const pc = [B.r[2], B.u[2], B.f[2]];                 // pole (0,0,1) in camera axes
  const cb = Math.abs(pc[2]), bPx = Math.sqrt((RS_POL / RS) ** 2 * (1 - cb * cb) + cb * cb) * aPx;
  const rot = Math.atan2(-pc[1], pc[0]);
  const rr = Math.max(4.5, aPx), ratio = Math.max(0.2, bPx / Math.max(aPx, 1e-6));
  // local x along the projected pole (squashed to the polar radius); the night side is drawn in that frame
  ctx.save(); ctx.globalAlpha = gAlpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(ratio, 1);
  shadedDisk(rr, sunU, rgba(C.gold, isDark ? 0.55 : 0.38), C.gold, 0.5, rot);
  ctx.restore();
  // a few latitude bands (drafting style), only on the visible hemisphere
  if (aPx > 14) {
    const a = RS / US, c = RS_POL / US, cp = B.pos;
    for (const lat of [-60, -40, -20, 0, 20, 40, 60]) {
      const pts = new Float64Array(97 * 3), cl = Math.cos(lat * DEG), sl = Math.sin(lat * DEG);
      for (let i = 0; i <= 96; i++) { const l = i / 96 * TAU; pts[3 * i] = a * cl * Math.cos(l); pts[3 * i + 1] = a * cl * Math.sin(l); pts[3 * i + 2] = c * sl; }
      poly(pts, 0, 96, C.gold, lat === 0 ? 1.1 : 0.8, lat === 0 ? 0.6 : 0.4, { flat: true, af: i => {
        const px = pts[3 * i], py = pts[3 * i + 1], pz = pts[3 * i + 2];
        const n = [px / (a * a), py / (a * a), pz / (c * c)];
        return n[0] * (px - cp[0]) + n[1] * (py - cp[1]) + n[2] * (pz - cp[2]) < 0 ? 1 : 0;
      } });
    }
  }
  return { x, y, r: rr };
}
// is a point hidden behind Saturn (as seen from the camera)?
function behindSaturn(px, py, pz) {
  const o = B.pos, dx = px - o[0], dy = py - o[1], dz = pz - o[2], L2 = dx * dx + dy * dy + dz * dz;
  const tc = -(o[0] * dx + o[1] * dy + o[2] * dz) / L2;           // closest approach of the sight line to Saturn's centre
  if (tc <= 0 || tc >= 1) return false;
  const cx = o[0] + dx * tc, cy = o[1] + dy * tc, cz = o[2] + dz * tc, R = RS / US;
  return cx * cx + cy * cy + cz * cz * (RS / RS_POL) ** 2 < R * R;
}
function renderS(g, t) {
  const vr = viewR(), sunU = sunDir(t);
  const nearSat = Math.hypot(cam.tx, cam.ty, cam.tz) < vr * 2.2;
  grid([0, 0, 0], nearSat ? 0 : cam.tz);
  const ink = C.ink, red = C.pen, gold = C.gold;
  // sun direction, with its foot on the ring plane
  if (nearSat) {
    const R0 = clamp(vr * 0.62, 18, 4000), a = sunU.map(v => v * R0), b = sunU.map(v => v * R0 * 1.3);
    arrow(a, b, gold, 1.6, 0.9);
    seg3([0, 0, 0], [b[0], b[1], 0], gold, 1, 0.45, [3, 4]);
    seg3([b[0], b[1], 0], b, gold, 1, 0.45, [2, 3]);
    const elv = Math.asin(sunU[2]) / DEG;
    placeTag('sundir', b, `太阳方向 · 环平面${Math.abs(elv) < 0.3 ? '上' : (elv < 0 ? '以南 ' : '以北 ') + Math.abs(elv).toFixed(1) + '°'}`, 'zh gold', 8, -12);
  }
  // moon orbits
  MOONS.forEach((m, i) => {
    if (i === PHOEBE && g.id !== 'arrival') return;
    const P = moonOrbitPts(i, t, 160);
    const col = m.col === 'moon' ? C['ink-2'] : C[m.col];
    poly(P, 0, 160, col, i === TITAN ? 1.3 : 1, i === TITAN ? 0.75 : m.col === 'encel' ? 0.6 : 0.38, i === PHOEBE ? { dash: [4, 4] } : {});
  });
  // Saturn & rings, far half first
  drawRings('far', sunU);
  const sb = saturnBody(sunU);
  drawRings('near', sunU);
  if (sb) placeTag('saturn', [0, 0, 0], '土星', 'zh gold', sb.r * 0.75 + 8, -(sb.r * 0.75 + 10));
  // moons
  MOONS.forEach((m, i) => {
    if (i === PHOEBE && g.id !== 'arrival') return;
    const p = moonS(i, t), sd = sunU;
    const col = m.col === 'moon' ? C.ink : C[m.col];
    const b = body(p, m.R / US, sd, C.sheet, col, i === TITAN ? 4.5 : 3, 0.55);
    const cls = 'zh ' + (m.col === 'moon' ? 'faint' : m.col);
    // skip labels of moons whose orbit is too small on screen to separate from Saturn
    const orbPx = proj(0, 0, 0) ? Math.hypot(...p) / PO.z * focal : 999;
    if (orbPx > (i === TITAN ? 22 : 46) || (lock && lock.mi === i)) placeTag('m' + i, p, m.zh, cls, (b ? b.r : 3) * 0.7 + 6, (b ? b.r : 3) * 0.7 + 8);
  });
  // Huygens
  if (g.id === 'huygens' && t >= T_HY0) {
    const iH = idxAt(THY, t);
    // the last hours are drawn relative to Titan (Titan moves ~5.6 km/s, so in the Saturn frame the path would end in empty space)
    const gA = smooth(T_HYE - 1.0, T_HYE - 0.6, t), tiNow = moonS(TITAN, t), PHY = new Float64Array(THY.p);
    if (gA > 0) for (let k = 0; k < THY.n; k++) {
      const w = gA * smooth(T_HYE - 0.6, T_HYE - 0.15, THY.t[k]); if (w <= 0) continue;
      const ti = moonS(TITAN, THY.t[k]);
      for (let c = 0; c < 3; c++) PHY[3 * k + c] += w * (tiNow[c] - ti[c]);
    }
    poly(PHY, 0, THY.n - 1, gold, 1, 0.45, { dash: [3, 4] });
    let hp;
    if (t < T_HYE) {
      poly(PHY, 0, iH, gold, 2, 1);
      hp = interp(THY, t); seg3([PHY[3 * iH], PHY[3 * iH + 1], PHY[3 * iH + 2]], hp, gold, 2, 1);
      if (iH + 1 < THY.n) { const k = clamp((t - THY.t[iH]) / (THY.t[iH + 1] - THY.t[iH]), 0, 1); hp = [0, 1, 2].map(c => PHY[3 * iH + c] + (PHY[3 * iH + 3 + c] - PHY[3 * iH + c]) * k); }
    } else {
      // after entry the probe stays with Titan, at the entry point (Titan rotates synchronously)
      const ti = moonS(TITAN, t), te = moonS(TITAN, T_HYE), rel = DATA.HYentry.rel, R = MOONS[TITAN].R;
      const ang = Math.atan2(ti[1], ti[0]) - Math.atan2(te[1], te[0]), ca = Math.cos(ang), sa = Math.sin(ang);
      const k = (R + clamp(1270 * (1 - (t - T_HYE) / (T_LAND - T_HYE)), 0, 1270)) / Math.hypot(...rel);
      hp = [ti[0] + (rel[0] * ca - rel[1] * sa) * k / US, ti[1] + (rel[0] * sa + rel[1] * ca) * k / US, ti[2] + rel[2] * k / US];
      poly(PHY, 0, THY.n - 1, gold, 2, 1);
    }
    if (proj(hp[0], hp[1], hp[2])) {
      ctx.globalAlpha = gAlpha; ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(PO.x, PO.y, 3.6, 0, TAU); ctx.fill();
      placeTag('huy', hp, t >= T_LAND ? '惠更斯号 · 已着陆' : '惠更斯号', 'zh gold', -10, 14);
    }
  }
  // Cassini: this phase's track — earlier orbits faint, current orbit bold, the rest ahead in grey
  const i0 = idxAt(TS, g.t0), i1 = Math.min(TS.n - 1, idxAt(TS, g.t1) + 1), iNow = idxAt(TS, t);
  const tRev = Math.max(g.t0, lastApo(t)), iRev = idxAt(TS, tRev);
  const P = TS.p, sat3 = Math.max(0, (RS / US) / (Math.hypot(B.pos[0], B.pos[1], B.pos[2]) || 1) * focal);
  const occl = sat3 > 5 ? (i => behindSaturn(P[3 * i], P[3 * i + 1], P[3 * i + 2]) ? 0.07 : 1) : null;
  const tr0 = TS.t[iRev], tspan = Math.max(1e-6, t - tr0);
  if (iNow < i1) poly(P, iNow, i1, C['ink-2'], 1.05, 0.42, occl ? { af: occl } : {});
  if (iRev > i0) poly(P, i0, iRev, red, 1, 0.3, occl ? { af: occl } : {});
  if (iNow > iRev) poly(P, iRev, iNow, red, 2.2, 1, { af: i => (0.35 + 0.65 * (TS.t[i] - tr0) / tspan) * (occl ? occl(i) : 1) });
  const sc = rawS(t);
  seg3([P[3 * iNow], P[3 * iNow + 1], P[3 * iNow + 2]], sc, red, 2.2, 1);
  // SOI burn arc
  if (g.id === 'arrival') {
    const a = idxAt(TS, T('2004-07-01T01:12')), b = idxAt(TS, T('2004-07-01T02:48')) + 1;
    poly(P, a, b, gold, 4.2, 0.5);
    if (vr < 60) placeTag('burn', rawS(T('2004-07-01T02:00')), '入轨点火 96 分钟', 'zh gold', 10, 14);
  }
  // flyby markers for this phase
  const showLabelsWithin = 1.2;
  for (const f of TF) {
    if (f.t < g.t0 || f.t > g.t1) continue;
    if (lock && lock.mi === f.mi && Math.abs(t - f.t) < 0.5) continue;
    if (!f.pos) f.pos = rawS(f.t);
    const done = t >= f.t, col = C[f.cls], r = f.mi === TITAN ? 3.2 : 2.8;
    const o = dot2(f.pos, r, done ? col : C.sheet, col, 1.3);
    if (o && Math.abs(t - f.t) < showLabelsWithin) placeTag('fl', f.pos, `${f.name} · ${altTxt(f)}`, f.cls, 9, -11);
  }
  dropLine(sc, red, 0);
  craftMark(sc, '卡西尼号');
  scNow = sc;
}

/* ---------- HUD ---------- */
const scaleOpts = [];
for (const km of [10, 20, 50, 100, 200, 500, 1e3, 2e3, 5e3, 1e4, 2e4, 5e4, 1e5, 2e5, 5e5, 1e6, 2e6, 5e6, 1e7]) scaleOpts.push([km, km >= 1e4 ? (km / 1e4) + ' 万 km' : nf.format(km) + ' km']);
for (const au of [0.2, 0.5, 1, 2, 5, 10]) scaleOpts.push([au * AU, au + ' AU']);
function nearestMoon(sc, t) {
  let best = null;
  MOONS.forEach((m, i) => { if (i === PHOEBE && t > T('2004-07-15')) return; const p = moonKm(i, t), d = Math.hypot(sc[0] * US - p[0], sc[1] * US - p[1], sc[2] * US - p[2]) - m.R; if (!best || d < best.d) best = { i, d }; });
  return best;
}
function updateHUD(g, t) {
  hud('dDate', isoDate(t));
  const showTime = timeShown(t) || !!lock;
  const tm = $('dTime'); if (tm.hidden === showTime) tm.hidden = !showTime;
  if (showTime) hud('dTime', new Date(D0 + t * 864e5).toISOString().slice(11, 19) + ' UT');
  hudHTML('dPhase', `${g.n} · <span>${g.name}</span>`);
  if (g.frame !== lastFrame) {
    lastFrame = g.frame;
    hudHTML('frameName', g.frame === 'H' ? '<em>HELIOCENTRIC ECLIPTIC · </em><span>日心黄道坐标系</span>' : '<em>SATURN RING PLANE · </em><span>土星环平面坐标系</span>');
    hud('frameSub', g.frame === 'H' ? '太阳位于中心，网格为黄道面' : '土星位于中心，网格为环平面，坐标轴不随时间转动');
  }
  const unit = g.frame === 'H' ? UH : US, unitPx = focal / DIST;
  let pick = scaleOpts[scaleOpts.length - 1];
  for (const o of scaleOpts) { if (o[0] / unit * unitPx >= 46) { pick = o; break; } }
  const px = Math.round(pick[0] / unit * unitPx);
  if (lastHud.scalePx !== px) { lastHud.scalePx = px; $('scaleBarLine').style.width = px + 'px'; }
  hud('scaleLabel', pick[1]);
  let rows, src;
  if (g.frame === 'H') {
    const p = rawH(t), r = Math.hypot(...p) * UH, e = planetKm('earth', t), dE = Math.hypot(p[0] * UH - e[0], p[1] * UH - e[1], p[2] * UH - e[2]);
    rows = [['距太阳', (r / AU).toFixed(3) + ' AU'], ['日心速度', speedAt(TH, t, UH).toFixed(2) + ' km/s']];
    let near = null;
    for (const name of ['venus', 'earth', 'jupiter']) { const q = planetKm(name, t), d = Math.hypot(p[0] * UH - q[0], p[1] * UH - q[1], p[2] * UH - q[2]); if (d < (name === 'jupiter' ? 3e7 : 3e6) && (!near || d < near.d)) near = { name, d }; }
    if (near) rows.push([`距${PZH[near.name]}${near.name === 'jupiter' ? '中心' : '表面'}`, near.name === 'jupiter' ? wan(near.d) : fmtInt(near.d - PR[near.name]) + ' km']);
    const lt = dE / 299792.458;
    if (!(near && near.name === 'earth')) rows.push(['距地球', dE > 0.05 * AU ? (dE / AU).toFixed(3) + ' AU' : wan(dE)]);
    rows.push(['信号单程', lt < 1 ? lt.toFixed(3) + ' 秒' : lt < 60 ? lt.toFixed(1) + ' 秒' : (lt / 60).toFixed(1) + ' 分钟']);
    src = 'JPL Horizons · 卡西尼号最终重建轨道';
  } else {
    const p = rawS(t), r = Math.hypot(...p) * US, v = speedAt(TS, t, US), n = revNo(t);
    rows = [['距土星中心', (r < 6e5 ? fmtInt(r) + ' km' : wan(r)) + '<span class="rs"> · ' + (r / RS).toFixed(r < 10 * RS ? 2 : 1) + ' Rs</span>']];
    rows.push(['速度', v.toFixed(2) + ' km/s']);
    const nm = nearestMoon(p, t);
    if (nm && nm.d < (nm.i === TITAN ? 2e5 : 6e4)) rows.push([`距${MOONS[nm.i].zh}表面`, fmtInt(nm.d) + ' km']);
    if (r < 3 * RS) rows.push(['距云顶', fmtInt(r - RS) + ' km']);
    rows.push(['轨道', n > 0 ? `第 ${n} 圈 / 294` : '未入轨']);
    const dE = earthDistS(t); rows.push(['信号单程', (dE / 299792.458 / 60).toFixed(1) + ' 分钟']);
    src = g.id === 'huygens' && t > T_HY0 ? 'JPL Horizons · 卡西尼号 -82、惠更斯号 -150' : 'JPL Horizons · 卡西尼号最终重建轨道';
  }
  hudHTML('readouts', rows.map(r => `<dt>${r[0]}</dt><dd>${r[1]}</dd>`).join('') + `<span class="model">${src}</span>`);
  let ev = null;
  for (const e of EVENTS) if (t >= e.t && t <= e.t + e.win) ev = e;
  if (!ev && g.frame === 'S') {   // a flyby happening now
    const f = TF.find(f => Math.abs(t - f.t) < 0.4);
    if (f) ev = { d: utc(f.t), x: `${f.name === MOONS[f.mi].zh ? '飞越' + f.name : f.name + ' · 飞越' + MOONS[f.mi].zh} · 距表面 ${altTxt(f)}，相对速度 ${f.v.toFixed(1)} km/s` };
  }
  const note = $('note');
  if (ev) { note.hidden = false; hud('noteDate', ev.d); hud('noteText', ev.x); } else note.hidden = true;
  const pct = (state.u * 100).toFixed(3) + '%';
  thumb.style.left = pct; fillEl.style.width = pct;
  track.setAttribute('aria-valuenow', String(Math.round(state.u * 1000)));
  track.setAttribute('aria-valuetext', `${isoDate(t)}，${g.name}`);
}

/* ================= Loop ================= */
const PLAY_MS = 150000;
let prevNow = performance.now();
function frame(now) {
  const dt = Math.min(64, now - prevNow); prevNow = now;
  if (playing) {
    const g = SEG[segIdx], dPerU = (g.t1 - g.t0) / (g.u1 - g.u0), rate = RATES[rateIdx];
    let dps = rate * dPerU * 1000 / PLAY_MS;
    for (const [tf, w, c] of FOCUS) { const x = (state.t - tf) / w; if (x * x < 9) dps = Math.min(dps, c * rate / Math.max(Math.exp(-x * x), 1e-4)); }
    if (lock) {   // locked on a moon: slow down so that the remaining approach always takes a few seconds
      const p = rawS(state.t), q = moonS(lock.mi, state.t), dk = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) * US;
      const near = TF.filter(f => f.mi === lock.mi).reduce((a, b) => Math.abs(b.t - state.t) < Math.abs(a.t - state.t) ? b : a, { t: 1e9, v: 6 });
      dps = Math.min(dps, 0.25 * rate, clamp(dk / Math.max(near.v, 1) / 86400 / 3, 2e-5, 1) * rate);
    }
    let u = state.u + dps * dt / 1000 / dPerU;
    if (u >= 1) { u = 1; setPlaying(false); }
    setU(u);
  }
  if (tween) {
    const k = clamp((now - tween.start) / tween.dur, 0, 1), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    Object.assign(cam, lerpCam(tween.from, presetNow(), e));
    if (k >= 1) tween = null;
    dirty = true;
  } else if (!userCam && (playing || dirty)) {
    Object.assign(cam, presetNow());
  }
  const tgt = lock ? moonS(lock.mi, state.t) : follow ? scNow : null;
  if (tgt) {
    const k = lock ? 0.5 : tween ? 0.35 : 0.22, dx = tgt[0] - cam.tx, dy = tgt[1] - cam.ty, dz = tgt[2] - cam.tz;
    if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > 1e-6) { cam.tx += dx * k; cam.ty += dy * k; cam.tz += dz * k; dirty = true; }
  }
  if (now - fadeStart < 400) dirty = true;
  if (dirty && segIdx >= 0) { dirty = false; render(now); }
  drawCraft(now);
  requestAnimationFrame(frame);
}

/* ================= Sizing & theme ================= */
function resize() {
  const r = sheet.getBoundingClientRect();
  W = Math.max(50, r.width); H = Math.max(50, r.height); DPR = Math.min(2.5, window.devicePixelRatio || 1);
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  dirty = true;
}
new ResizeObserver(resize).observe(sheet);

/* ================= Interaction: camera ================= */
const ptrs = new Map();
let pinch0 = null;
const userTouch = () => { userCam = true; tween = null; dirty = true; };
sheet.addEventListener('contextmenu', e => e.preventDefault());
sheet.addEventListener('pointerdown', e => {
  if (e.target.closest('button')) return;
  sheet.setPointerCapture(e.pointerId);
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY, pan: e.button === 2 || e.shiftKey });
  sheet.classList.add('dragging');
  if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = { d: Math.hypot(a.x - b.x, a.y - b.y), dist: cam.dist, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 }; }
});
sheet.addEventListener('pointermove', e => {
  const p = ptrs.get(e.pointerId); if (!p) return;
  const dx = e.clientX - p.x, dy = e.clientY - p.y;
  if (ptrs.size === 1) {
    if (p.pan) { pan(dx, dy); if (lock) setLock(null); }
    else { cam.az -= dx * 0.32; cam.el = clamp(cam.el + dy * 0.28, -85, 88); }
    userTouch();
  } else if (ptrs.size === 2 && pinch0) {
    p.x = e.clientX; p.y = e.clientY;
    const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
    cam.dist = clamp(pinch0.dist * pinch0.d / Math.max(10, d), minDist(), maxDist());
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; pan(mx - pinch0.mx, my - pinch0.my); pinch0.mx = mx; pinch0.my = my;
    userTouch(); return;
  }
  p.x = e.clientX; p.y = e.clientY;
});
const endPtr = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = null; if (!ptrs.size) sheet.classList.remove('dragging'); };
sheet.addEventListener('pointerup', endPtr); sheet.addEventListener('pointercancel', endPtr);
function pan(dx, dy) {
  const s = DIST / focal;
  cam.tx -= (B.r[0] * dx - B.u[0] * dy) * s; cam.ty -= (B.r[1] * dx - B.u[1] * dy) * s; cam.tz -= (B.r[2] * dx - B.u[2] * dy) * s;
}
const minDist = () => SEG[segIdx].frame === 'H' ? 0.0015 : 0.03;
const maxDist = () => SEG[segIdx].frame === 'H' ? 400 : 5000;
sheet.addEventListener('wheel', e => {
  e.preventDefault();
  cam.dist = clamp(cam.dist * Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0013)), minDist(), maxDist());
  userTouch();
}, { passive: false });
$('zoomIn').addEventListener('click', () => { cam.dist = clamp(cam.dist / 1.35, minDist(), maxDist()); userTouch(); });
$('zoomOut').addEventListener('click', () => { cam.dist = clamp(cam.dist * 1.35, minDist(), maxDist()); userTouch(); });
function resetView() { userCam = false; setLock(null); startTween(); dirty = true; }
$('resetView').addEventListener('click', resetView);
$('unlock').addEventListener('click', resetView);
const followBtn = $('follow');
function setFollow(on) { follow = on; if (on) setLock(null); followBtn.setAttribute('aria-pressed', String(on)); dirty = true; }
followBtn.addEventListener('click', () => setFollow(!follow));
const plotEl = document.querySelector('.plot'), expandBtn = $('expand');
function setExpanded(on) {
  plotEl.classList.toggle('expanded', on); document.body.classList.toggle('has-expanded', on);
  expandBtn.setAttribute('aria-pressed', String(on)); expandBtn.setAttribute('aria-label', on ? '退出全屏' : '全屏查看');
  $('expandIcon').innerHTML = on ? '<path d="M5 1v4H1M9 1v4h4M13 9H9v4M1 9h4v4"/>' : '<path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9"/>';
  dirty = true;
}
expandBtn.addEventListener('click', () => setExpanded(!plotEl.classList.contains('expanded')));

/* ================= Interaction: timeline ================= */
function togglePlay() { if (!playing && state.u >= 0.999) setU(0); setPlaying(!playing); }
playBtn.addEventListener('click', togglePlay);
$('prevEv').addEventListener('click', () => jumpEvent(-1));
$('nextEv').addEventListener('click', () => jumpEvent(1));
const rateBtn = $('rate');
rateBtn.addEventListener('click', () => {
  rateIdx = (rateIdx + 1) % RATES.length;
  const r = RATES[rateIdx]; rateBtn.textContent = (r < 1 ? '½' : r) + '×'; rateBtn.setAttribute('aria-label', `播放速度 ${r} 倍`);
});
let scrubbing = false, downX = 0;
const tip = $('tip');
const uAt = e => { const r = track.getBoundingClientRect(); return clamp((e.clientX - r.left) / r.width, 0, 0.99999); };
const TIPS = [...EVENTS.map(e => ({ u: e.u, at: e.at, d: e.d, x: e.x })), ...TF.map(f => ({ u: uFromT(f.t), at: f.t, d: utc(f.t), x: `${f.name === MOONS[f.mi].zh ? '飞越' + f.name : f.name + ' · ' + MOONS[f.mi].zh} · ${altTxt(f)}`, fly: 1 }))];
function nearEvent(e) {
  const r = track.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; let best = null, bd = 7;
  const wantFly = y > r.height - 20 && y < r.height - 9;
  for (const ev of TIPS) { if (!!ev.fly !== wantFly) continue; const d = Math.abs(ev.u * r.width - x); if (d < bd) { bd = d; best = ev; } }
  return best;
}
function showTip(e) {
  const r = track.getBoundingClientRect(), ev = nearEvent(e), u = ev ? ev.u : uAt(e), t = ev ? ev.at : tFromU(u);
  const g = SEG[segOfU(u)];
  tip.innerHTML = `${ev ? ev.d : isoDate(t)}<span>${ev ? ev.x : g.n + ' · ' + g.name}</span>`;
  tip.hidden = false;
  const w = tip.offsetWidth, x = clamp(u * r.width, w / 2 - 4, r.width - w / 2 + 4);
  tip.style.left = x + 'px';
}
track.addEventListener('pointerdown', e => { scrubbing = true; downX = e.clientX; track.setPointerCapture(e.pointerId); setPlaying(false); setU(uAt(e)); showTip(e); });
track.addEventListener('pointermove', e => { if (scrubbing && Math.abs(e.clientX - downX) > 3) setU(uAt(e)); if (scrubbing || e.pointerType === 'mouse') showTip(e); });
track.addEventListener('pointerup', e => {
  if (scrubbing && Math.abs(e.clientX - downX) <= 3) { const ev = nearEvent(e); if (ev) setU(uFromT(ev.at)); }
  scrubbing = false; saveHash(); if (e.pointerType !== 'mouse') tip.hidden = true;
});
track.addEventListener('pointercancel', () => { scrubbing = false; tip.hidden = true; });
track.addEventListener('pointerleave', () => { if (!scrubbing) tip.hidden = true; });
track.addEventListener('keydown', e => {
  const step = { ArrowRight: 0.002, ArrowUp: 0.002, ArrowLeft: -0.002, ArrowDown: -0.002, PageUp: 0.03, PageDown: -0.03 }[e.key];
  if (step !== undefined) { setPlaying(false); setU(state.u + step); e.preventDefault(); }
  else if (e.key === 'Home') { setPlaying(false); setU(0); e.preventDefault(); }
  else if (e.key === 'End') { setPlaying(false); setU(1); e.preventDefault(); }
  else if (e.key === ' ') { togglePlay(); e.preventDefault(); }
  if (step !== undefined || e.key === 'Home' || e.key === 'End') saveHash();
});
document.addEventListener('keydown', e => {
  if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
  const tg = e.target, tag = tg && tg.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (tg && tg.isContentEditable)) return;
  const k = e.key;
  if (k === ' ' && tag !== 'BUTTON' && tag !== 'A' && tag !== 'SUMMARY') { togglePlay(); e.preventDefault(); }
  else if (k === 'ArrowRight' || k === 'ArrowLeft') { setPlaying(false); setU(state.u + (k === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 0.02 : 0.001)); saveHash(); e.preventDefault(); }
  else if (k === ']' || k === '[') { jumpEvent(k === ']' ? 1 : -1); e.preventDefault(); }
  else if (/^[1-9]$/.test(k)) jumpTo(+k - 1);
  else if (k === '0') jumpTo(9);
  else if (k === '-') jumpTo(10);
  else if (k === 'f' || k === 'F') setFollow(!follow);
  else if (k === 'r' || k === 'R') resetView();
  else if (k === 'Escape' && plotEl.classList.contains('expanded')) setExpanded(false);
});

/* ================= Interaction: chapters ================= */
const narrowMQ = matchMedia('(max-width: 900px)');
let ioPause = 0;
// bring the plot into view by scrolling to the chapter that matches the current phase (so the scroll-linked chapters agree)
function revealPlot() {
  const c = chapters[segIdx]; if (!c) return;
  ioPause = performance.now() + 1800;
  const r = c.getBoundingClientRect(), top = scrollY + r.top - innerHeight * (narrowMQ.matches ? 0.6 : 0.36);
  scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
}
document.querySelectorAll('.goto[data-seg]').forEach(b => b.addEventListener('click', () => jumpTo(+b.dataset.seg)));
document.querySelectorAll('.goto[data-jump]').forEach(b => b.addEventListener('click', () => { const j = JUMPS[b.dataset.jump]; if (j) jumpT(j.t, j.lock); }));
let scrolled = false;
addEventListener('scroll', () => { scrolled = true; }, { passive: true });
let io = null;
function makeObserver() {
  if (io) io.disconnect();
  const narrow = narrowMQ.matches;
  io = new IntersectionObserver(entries => {
    if (!scrolled || playing || scrubbing || performance.now() < ioPause) return;
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const si = +en.target.dataset.seg;
      if (si !== segIdx) jumpTo(si);
    }
  }, { rootMargin: narrow ? '-70% 0px -24% 0px' : '-42% 0px -54% 0px' });
  chapters.forEach(c => io.observe(c));
}
makeObserver();
narrowMQ.addEventListener('change', makeObserver);

/* ================= Tour profile chart ================= */
const profSvg = $('profSvg'), profTip = $('profTip'), profBox = $('profile');
let profReady = false, profGeom = null;
const SVGNS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, parent) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const yearFrac = t => { const d = new Date(D0 + t * 864e5), y = d.getUTCFullYear(); return y + (d - Date.UTC(y, 0, 1)) / (Date.UTC(y + 1, 0, 1) - Date.UTC(y, 0, 1)); };
function drawProfile() {
  const Wd = Math.max(560, profSvg.parentElement.clientWidth), m = { l: 52, r: 14, t: 26, b: 26 };
  const h1 = 170, gap = 34, h2 = 150, stripH = 44;
  const Ht = m.t + h1 + gap + h2 + 18 + stripH + m.b;
  profSvg.setAttribute('viewBox', `0 0 ${Wd} ${Ht}`); profSvg.setAttribute('width', Wd); profSvg.setAttribute('height', Ht);
  profSvg.innerHTML = '';
  const tA = T('2004-06-01'), tB = T_END + 20, x = t => m.l + (t - tA) / (tB - tA) * (Wd - m.l - m.r);
  const yI = v => m.t + h1 - v / 80 * h1;
  const y2top = m.t + h1 + gap, lr = v => Math.log10(v), yR = v => y2top + (1 - (lr(v) - lr(1)) / (lr(30) - lr(1))) * h2;
  const ySt = y2top + h2 + 18;
  const ink2 = C['ink-2'], rule = C.rule;
  // phase bands
  SEG.forEach((g, i) => {
    if (g.frame !== 'S') return;
    const a = x(Math.max(g.t0, tA)), b = x(g.t1);
    if (i % 2 === 1) el('rect', { x: a, y: m.t, width: b - a, height: ySt + stripH - m.t, fill: C.ink, opacity: isDark ? 0.05 : 0.035 }, profSvg);
    if (b - a > 40) { const tx = el('text', { x: a + 4, y: m.t - 9, class: 'ph' }, profSvg); tx.textContent = g.short; }
  });
  // axes & grid
  for (const v of [0, 20, 40, 60, 80]) {
    el('line', { x1: m.l, x2: Wd - m.r, y1: yI(v), y2: yI(v), stroke: rule, 'stroke-width': 1 }, profSvg);
    const tx = el('text', { x: m.l - 8, y: yI(v) + 4, 'text-anchor': 'end' }, profSvg); tx.textContent = v + '°';
  }
  for (const v of [1, 2, 5, 10, 20, 30]) {
    el('line', { x1: m.l, x2: Wd - m.r, y1: yR(v), y2: yR(v), stroke: rule, 'stroke-width': 1 }, profSvg);
    const tx = el('text', { x: m.l - 8, y: yR(v) + 4, 'text-anchor': 'end' }, profSvg); tx.textContent = v + ' Rs';
  }
  const lbl = (y, txt, col) => { el('line', { x1: m.l, x2: Wd - m.r, y1: y, y2: y, stroke: col, 'stroke-width': 1, 'stroke-dasharray': '4 4' }, profSvg); const tx = el('text', { x: Wd - m.r - 4, y: y - 5, 'text-anchor': 'end' }, profSvg); tx.textContent = txt; };
  lbl(yR(140180 / RS), 'F 环', C.gold); lbl(yR(66900 / RS), 'D 环内缘', C.gold);
  const ty1 = el('text', { x: m.l + 4, y: m.t + 13, class: 'ttl' }, profSvg); ty1.textContent = '轨道倾角（相对环平面）';
  const ty2 = el('text', { x: m.l + 4, y: y2top + 13, class: 'ttl' }, profSvg); ty2.textContent = '近土点距土星中心（对数刻度，1 Rs = 60,268 km）';
  for (let y = 2005; y <= 2017; y++) {
    const xx = x(T(y + '-01-01'));
    el('line', { x1: xx, x2: xx, y1: m.t, y2: ySt + stripH, stroke: rule, 'stroke-width': 1, opacity: 0.6 }, profSvg);
    const tx = el('text', { x: xx, y: ySt + stripH + 16, 'text-anchor': 'middle' }, profSvg); tx.textContent = y;
  }
  // series
  const ptsI = REVS.map(r => `${x(r.t).toFixed(1)},${yI(r.inc).toFixed(1)}`).join(' ');
  const ptsR = REVS.map(r => `${x(r.t).toFixed(1)},${yR(Math.max(1, r.r / RS)).toFixed(1)}`).join(' ');
  el('polyline', { points: ptsI, fill: 'none', stroke: C.pen, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, profSvg);
  el('polyline', { points: ptsR, fill: 'none', stroke: C.pen, 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, profSvg);
  for (const r of REVS) {
    el('circle', { cx: x(r.t), cy: yI(r.inc), r: 1.9, fill: C.pen }, profSvg);
    el('circle', { cx: x(r.t), cy: yR(Math.max(1, r.r / RS)), r: 1.9, fill: C.pen }, profSvg);
  }
  // flyby strip
  const rowsY = { titan: ySt + 8, encel: ySt + 22, moon: ySt + 36 };
  const names = { titan: '泰坦', encel: '土卫二', moon: '其他' };
  for (const k in rowsY) { const tx = el('text', { x: m.l - 8, y: rowsY[k] + 4, 'text-anchor': 'end', class: 'ph' }, profSvg); tx.textContent = names[k]; }
  for (const f of TF) {
    if (f.t < tA) continue;
    el('line', { x1: x(f.t), x2: x(f.t), y1: rowsY[f.cls] - 5, y2: rowsY[f.cls] + 5, stroke: C[f.cls], 'stroke-width': 1.6 }, profSvg);
  }
  // crosshair
  const ch = el('line', { x1: 0, x2: 0, y1: m.t, y2: ySt + stripH, stroke: C.ink, 'stroke-width': 1, opacity: 0, 'pointer-events': 'none' }, profSvg);
  const hi1 = el('circle', { r: 4.5, fill: 'none', stroke: C.ink, 'stroke-width': 1.5, opacity: 0 }, profSvg);
  const hi2 = el('circle', { r: 4.5, fill: 'none', stroke: C.ink, 'stroke-width': 1.5, opacity: 0 }, profSvg);
  const hit = el('rect', { x: m.l, y: m.t, width: Wd - m.l - m.r, height: ySt + stripH - m.t, fill: 'transparent', style: 'cursor:pointer' }, profSvg);
  profGeom = { x, yI, yR, ch, hi1, hi2, hit, Wd, m };
  const pick = ev => {
    const r = profSvg.getBoundingClientRect(), sx = (ev.clientX - r.left) * (Wd / r.width);
    let best = null, bd = 1e9; for (const q of REVS) { const d = Math.abs(x(q.t) - sx); if (d < bd) { bd = d; best = q; } }
    return best;
  };
  hit.addEventListener('pointermove', ev => {
    const q = pick(ev); if (!q) return;
    const xx = x(q.t), n = REVS.indexOf(q) + 1;
    ch.setAttribute('x1', xx); ch.setAttribute('x2', xx); ch.setAttribute('opacity', 0.5);
    hi1.setAttribute('cx', xx); hi1.setAttribute('cy', yI(q.inc)); hi1.setAttribute('opacity', 1);
    hi2.setAttribute('cx', xx); hi2.setAttribute('cy', yR(Math.max(1, q.r / RS))); hi2.setAttribute('opacity', 1);
    const fl = TF.filter(f => Math.abs(f.t - q.t) < (q.per || 10) / 2);
    profTip.innerHTML = `<b>第 ${n} 个近土点</b> · ${utc(q.t)}<br>倾角 ${q.inc.toFixed(1)}° · 近土点 ${(q.r / RS).toFixed(2)} Rs（${wan(q.r)}）` + (q.per ? `<br>周期 ${q.per.toFixed(1)} 天` : '') + (fl.length ? `<br>这一圈的飞越：${fl.map(f => f.name === MOONS[f.mi].zh ? f.name : f.name).join('、')}` : '');
    profTip.hidden = false;
    const br = profBox.getBoundingClientRect(), r = profSvg.getBoundingClientRect(), px = r.left - br.left + xx * (r.width / Wd), tw = profTip.offsetWidth;
    profTip.style.left = clamp(px + 12, 4, br.width - tw - 4) + 'px'; profTip.style.top = (r.top - br.top + 30) + 'px';
  });
  hit.addEventListener('pointerleave', () => { profTip.hidden = true; ch.setAttribute('opacity', 0); hi1.setAttribute('opacity', 0); hi2.setAttribute('opacity', 0); });
  hit.addEventListener('click', ev => { const q = pick(ev); if (q) { jumpT(q.t - 0.15); revealPlot(); } });
  profReady = true;
}
function buildTable() {
  const rows = REVS.map((q, i) => `<tr><td>${i + 1}</td><td>${utc(q.t)}</td><td>${q.inc.toFixed(1)}°</td><td>${(q.r / RS).toFixed(2)}</td><td>${fmtInt(q.r)}</td><td>${q.per ? q.per.toFixed(1) : '—'}</td></tr>`).join('');
  $('profTable').innerHTML = `<table><thead><tr><th>#</th><th>近土点时刻</th><th>倾角</th><th>Rs</th><th>距土星中心 km</th><th>周期（天）</th></tr></thead><tbody>${rows}</tbody></table>`;
}
buildTable();
new ResizeObserver(() => { if (profReady) drawProfile(); }).observe(profSvg.parentElement);

/* ================= Moon cards ================= */
const MOON_TXT = {
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
function buildMoons() {
  const box = $('moons'), order = [5, 1, 7, 4, 3, 2, 0, 6, 8];
  box.innerHTML = '';
  for (const i of order) {
    const m = MOONS[i], info = MOON_TXT[m.id], fl = TF.filter(f => f.mi === i);
    const best = fl.length ? fl.reduce((a, b) => b.alt < a.alt ? b : a) : null;
    const div = document.createElement('div');
    div.className = 'mcard' + (info.big ? ' big' : order.indexOf(i) < 6 ? ' mid' : '');
    const cntTxt = i === TITAN ? `${fl.length} 次定向飞越` : i === ENCEL ? `${fl.length} 次定向飞越` : `${fl.length} 次近距飞越`;
    div.innerHTML = `<div class="mh"><h3><span class="dot" style="background:var(--${m.col})"></span>${m.zh}</h3><span class="en">${m.no} · ${m.en}</span></div>
      <div class="stats"><span>直径 ${info.d}</span><span>发现 ${info.by}</span><span>${cntTxt}</span>${best ? `<span>最近 ${altTxt(best)} · ${isoDate(best.t)}</span>` : ''}</div>
      <p>${info.p}</p>` + (best ? `<button class="mbtn" type="button">跳到最近的一次飞越 →</button>` : '');
    if (best) div.querySelector('button').addEventListener('click', () => { jumpT(best.t - (i === TITAN ? 0.08 : 0.04), i); revealPlot(); });
    box.appendChild(div);
  }
}
buildMoons();

/* ================= Spacecraft drawing (facet model, drag to turn) ================= */
const cc = $('craft'), cx2 = cc.getContext('2d'), labelsBox = $('craftLabels');
let cW = 0, cH = 0, cDPR = 1, craftYaw = -0.6, craftDrag = null, craftLast = 0, craftDirty = true;
new ResizeObserver(() => {
  const r = cc.getBoundingClientRect(); cW = r.width; cH = r.height; cDPR = Math.min(2.5, devicePixelRatio || 1);
  cc.width = Math.round(cW * cDPR); cc.height = Math.round(cH * cDPR); craftDirty = true;
}).observe(cc);
// mesh in metres; z up, the high-gain antenna on top
const MESH = [], LINES = [], LABELS = [];
const addQuad = (a, b, c, d, tone, two) => MESH.push({ v: [a, b, c, d], tone, two });
const addTri = (a, b, c, tone, two) => MESH.push({ v: [a, b, c], tone, two });
function prism(cx, cy, z0, z1, R, n, tone, rot = 0) {
  const ring = z => Array.from({ length: n }, (_, k) => { const a = rot + k / n * TAU; return [cx + R * Math.cos(a), cy + R * Math.sin(a), z]; });
  const lo = ring(z0), hi = ring(z1);
  for (let k = 0; k < n; k++) addQuad(lo[k], lo[(k + 1) % n], hi[(k + 1) % n], hi[k], tone);
  for (let k = 1; k < n - 1; k++) { addTri(hi[0], hi[k], hi[k + 1], tone * 0.9); addTri(lo[0], lo[k + 1], lo[k], tone * 0.9); }
}
function frustum(c, axis, r0, r1, len, n, tone, two) {   // along axis from c
  const [ax, ay, az] = axis, l = Math.hypot(ax, ay, az), u = [ax / l, ay / l, az / l];
  const t1 = Math.abs(u[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let p = [u[1] * t1[2] - u[2] * t1[1], u[2] * t1[0] - u[0] * t1[2], u[0] * t1[1] - u[1] * t1[0]]; const pl = Math.hypot(...p); p = p.map(v => v / pl);
  const q = [u[1] * p[2] - u[2] * p[1], u[2] * p[0] - u[0] * p[2], u[0] * p[1] - u[1] * p[0]];
  const ring = (s, r) => Array.from({ length: n }, (_, k) => { const a = k / n * TAU; return [0, 1, 2].map(i => c[i] + u[i] * s + (p[i] * Math.cos(a) + q[i] * Math.sin(a)) * r); });
  const A = ring(0, r0), Bq = ring(len, r1);
  for (let k = 0; k < n; k++) addQuad(A[k], A[(k + 1) % n], Bq[(k + 1) % n], Bq[k], tone, two);
  return { A, B: Bq };
}
// stack
prism(0, 0, 0.95, 1.45, 1.05, 12, 0.92);                // lower equipment module
prism(0, 0, 1.45, 4.55, 0.68, 16, 1.0);                 // propellant tanks (insulated)
prism(0, 0, 4.55, 5.25, 1.05, 12, 0.92, Math.PI / 12);  // 12-bay electronics bus
prism(0, 0, 5.25, 5.55, 0.55, 12, 0.9);
// high-gain antenna: a shallow dish, 4 m across
{
  const n = 24, rings = [0, 0.7, 1.4, 2.0], z = r => 5.75 + 0.11 * r * r;
  const pt = (r, k) => [r * Math.cos(k / n * TAU), r * Math.sin(k / n * TAU), z(r)];
  for (let j = 0; j < rings.length - 1; j++) for (let k = 0; k < n; k++) addQuad(pt(rings[j], k), pt(rings[j], k + 1), pt(rings[j + 1], k + 1), pt(rings[j + 1], k), 1.1, true);
  for (let k = 0; k < 3; k++) { const a = k / 3 * TAU; LINES.push([[1.9 * Math.cos(a), 1.9 * Math.sin(a), z(1.9)], [0, 0, 6.85]]); }
  LABELS.push({ p: [0, 0, 7.0], t: '高增益天线 4 m' });
}
// main engines
frustum([0.32, 0, 0.95], [0, 0, -1], 0.12, 0.38, 0.85, 12, 0.85, true);
frustum([-0.32, 0, 0.95], [0, 0, -1], 0.12, 0.38, 0.85, 12, 0.85, true);
LABELS.push({ p: [0, 0, 0.05], t: '主发动机 ×2' });
// RTGs: three finned cylinders on the lower module
for (const a of [Math.PI * 0.25, Math.PI * 0.95, Math.PI * 1.55]) {
  const base = [1.05 * Math.cos(a), 1.05 * Math.sin(a), 1.2], dir = [Math.cos(a), Math.sin(a), -0.55];
  const f = frustum(base, dir, 0.21, 0.21, 1.15, 10, 0.8, true);
  for (let k = 0; k < 10; k += 2.5) {
    const kk = Math.floor(k), A = f.A[kk], Bq = f.B[kk], o = [A[0] - base[0], A[1] - base[1], A[2] - base[2]], ol = Math.hypot(...o) || 1;
    const e = o.map(v => v / ol * 0.16);
    addQuad(A, Bq, [Bq[0] + e[0], Bq[1] + e[1], Bq[2] + e[2]], [A[0] + e[0], A[1] + e[1], A[2] + e[2]], 0.75, true);
  }
  if (a === Math.PI * 0.25) LABELS.push({ p: [base[0] + dir[0] * 1.3, base[1] + dir[1] * 1.3, base[2] + dir[2] * 1.3], t: '核电源 RTG ×3' });
}
// Huygens probe on the side (heat shield facing outward)
{
  const c = [0.9, -0.9, 2.9], ax = [Math.SQRT1_2, -Math.SQRT1_2, 0];
  frustum(c, ax, 0.55, 1.35, 0.55, 20, 1.15, true);
  const back = frustum(c, ax.map(v => -v), 0.55, 0.25, 0.4, 20, 1.0, true);
  LABELS.push({ p: [c[0] + ax[0] * 0.9, c[1] + ax[1] * 0.9, c[2] + 0.9], t: '惠更斯号' });
}
// remote-sensing pallet and fields-and-particles pallet
prism(-0.95, 0.55, 4.6, 5.2, 0.42, 4, 0.95, Math.PI / 4);
// magnetometer boom (11 m, true length) and three radio antennas (10 m, shortened)
LINES.push([[0, 1.0, 5.0], [0, 4.0, 5.0], 'boom']); LINES.push([[0, 4.0, 5.0], [0, 4.7, 5.0], 'ant']);
LABELS.push({ p: [0, 4.4, 5.0], t: '磁强计杆' });
for (const v of [[-1, 0.15, 0.6], [-0.6, -0.8, 0.6], [-0.95, -0.25, -0.3]]) { const l = Math.hypot(...v); LINES.push([[-0.9, 0.2, 4.3], [-0.9 + v[0] / l * 3.2, 0.2 + v[1] / l * 3.2, 4.3 + v[2] / l * 3.2], 'ant']); }
const labelEls = LABELS.map(l => { const s = document.createElement('span'); s.textContent = l.t; labelsBox.appendChild(s); return s; });
cc.addEventListener('pointerdown', e => { craftDrag = { x: e.clientX, yaw: craftYaw }; cc.setPointerCapture(e.pointerId); });
cc.addEventListener('pointermove', e => { if (craftDrag) { craftYaw = craftDrag.yaw - (e.clientX - craftDrag.x) * 0.012; craftDirty = true; } });
const craftUp = () => { craftDrag = null; };
cc.addEventListener('pointerup', craftUp); cc.addEventListener('pointercancel', craftUp);
let craftVisible = true;
new IntersectionObserver(es => { craftVisible = es[0].isIntersecting; }).observe(cc);
function drawCraft(now) {
  if (!cW || !craftVisible) return;
  if (!craftDrag && !reduceMotion) { craftYaw += Math.min(0.05, (now - craftLast) / 1000) * 0.18; craftDirty = true; }
  craftLast = now;
  if (!craftDirty) return; craftDirty = false;
  const yaw = craftYaw, pitch = 16 * DEG, cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const S = Math.min(cW / 10.2, cH / 9.0), ox = cW * 0.5, oy = cH * 0.8;
  const P = v => { const x = v[0] * cyw - v[1] * syw, y = v[0] * syw + v[1] * cyw, z = v[2]; const yy = y * cp - z * sp, zz = y * sp + z * cp; return [ox + x * S, oy - zz * S, yy]; };
  const c = cx2; c.setTransform(cDPR, 0, 0, cDPR, 0, 0); c.clearRect(0, 0, cW, cH);
  c.lineJoin = 'round'; c.lineCap = 'round';
  const faces = [];
  for (const f of MESH) {
    const q = f.v.map(P);
    const ax = q[1][0] - q[0][0], ay = q[1][1] - q[0][1], bx = q[2][0] - q[0][0], by = q[2][1] - q[0][1], cr = ax * by - ay * bx;
    if (!f.two && cr > 0) continue;
    const depth = q.reduce((s, v) => s + v[2], 0) / q.length;
    faces.push({ q, depth, tone: f.tone, cr });
  }
  faces.sort((a, b) => b.depth - a.depth);
  const lines = LINES.map(([a, b, kind]) => ({ a: P(a), b: P(b), kind }));
  const drawLine = L => { c.globalAlpha = L.kind === 'ant' ? 0.7 : 1; c.strokeStyle = L.kind === 'boom' ? C.ink : C['ink-2']; c.lineWidth = L.kind === 'boom' ? 1.6 : 1.1; c.setLineDash(L.kind === 'ant' ? [3, 3] : []); c.beginPath(); c.moveTo(L.a[0], L.a[1]); c.lineTo(L.b[0], L.b[1]); c.stroke(); c.setLineDash([]); c.globalAlpha = 1; };
  for (const L of lines) if ((L.a[2] + L.b[2]) / 2 > 0.5) drawLine(L);
  for (const f of faces) {
    c.beginPath(); f.q.forEach((v, i) => i ? c.lineTo(v[0], v[1]) : c.moveTo(v[0], v[1])); c.closePath();
    c.fillStyle = C.sheet; c.fill();
    const shade = clamp(0.5 - 0.5 * Math.sign(f.cr) * 0.4 + (1.1 - f.tone) * 0.6, 0, 1);
    c.fillStyle = rgba(f.tone > 1.05 ? C.gold : C.ink, f.tone > 1.05 ? 0.16 : 0.03 + 0.1 * shade); c.fill();
    c.strokeStyle = C.ink; c.lineWidth = 0.7; c.globalAlpha = 0.75; c.stroke(); c.globalAlpha = 1;
  }
  for (const L of lines) if ((L.a[2] + L.b[2]) / 2 <= 0.5) drawLine(L);
  LABELS.forEach((l, i) => {   // labels sit on the outer side of their anchor
    const q = P(l.p), e = labelEls[i], w = e.offsetWidth || 60, left = q[0] < ox - 4;
    e.style.transform = `translate(${(left ? q[0] - w - 8 : q[0] + 8).toFixed(1)}px,${(q[1] - 9).toFixed(1)}px)`;
  });
}

/* ================= Boot ================= */
readTokens();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', readTokens);
new MutationObserver(() => { readTokens(); craftDirty = true; }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { dirty = true; for (const tg of TAGS.values()) tg.w = 0; });
resize();
drawProfile();
const tHash = readHash();
setU(uFromT(tHash !== null ? tHash : T('2004-06-30T21:00')));
addEventListener('hashchange', () => { const t = readHash(); if (t !== null && Math.abs(t - state.t) > 1e-4) { setPlaying(false); setU(uFromT(t)); } });
if (!cv.getContext) sheet.insertAdjacentHTML('beforeend', '<p class="fallback">这个浏览器无法绘制画布。</p>');
window.__cassini = { jump: jumpTo, setU, setT: s => { setPlaying(false); setU(uFromT(T(s))); }, state, cam, lockOn, debug: { moonS, rawS, rawH, planetH, TF, REVS } };
requestAnimationFrame(frame);
})();
