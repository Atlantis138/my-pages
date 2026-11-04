"""Pack Horizons data + fitted models into data.json for the page.
Times: days since 1997-10-15 00:00 UT (page epoch).  Positions: km.
H = heliocentric J2000 ecliptic (cruise);  S = Saturn-centred, Saturn equator (= ring plane)."""
import numpy as np, json, datetime as dt
from common import *
from moonmodel import moon_pos, MF
from planets import planet
JDE = 2450736.5
cal = lambda jd: (dt.datetime(2000,1,1,12)+dt.timedelta(days=jd-2451545)).strftime('%Y-%m-%d %H:%M:%S')
MO = ['601','602','603','604','605','606','607','608','609']
RAD = {'601':198.2,'602':252.1,'603':531.0,'604':561.4,'605':763.5,'606':2574.7,'607':135.0,'608':734.5,'609':106.5}
T_END = 2458011.5 + (10 + 32/60) / 24          # 2017-09-15 10:32 UT, loss of signal at Saturn
out = {}

def simplify(T, P, tol):
    """Greedy: keep as few samples as possible so that linear-in-time interpolation stays within tol (km)."""
    N = len(T); keep = [0]; i = 0
    def ok(i, j):
        k = np.arange(i + 1, j)
        if len(k) == 0: return True
        f = ((T[k] - T[i]) / (T[j] - T[i]))[:, None]
        e = np.linalg.norm(P[i] + (P[j] - P[i]) * f - P[k], axis=1)
        return bool(np.all(e <= tol[k]))
    while i < N - 1:
        s = 1
        while i + 2 * s < N and ok(i, i + 2 * s) and s < 4096: s *= 2
        lo, hi = i + s, min(N - 1, i + 2 * s)
        if ok(i, hi): lo = hi
        else:
            while hi - lo > 1:
                mid = (lo + hi) // 2
                if ok(i, mid): lo = mid
                else: hi = mid
        keep.append(lo); i = lo
    return np.array(keep)

def pack(T, P, ndig=0):
    ts = np.round((T - JDE) * 86400).astype(np.int64); ps = np.round(P).astype(np.int64)
    return dict(t0=int(ts[0]), dt=np.diff(ts).tolist(), p0=ps[0].tolist(), dp=np.diff(ps, axis=0).ravel().tolist())

# ---------------- cruise (heliocentric) ----------------
H = load('-82', '500@10', 'ECLIPTIC', t1=2453189.0)
Tn, Pn = H[:, 0], H[:, 1:4]
near = np.linalg.norm(Pn, axis=1)
for p in ('299', '399', '599', '699'):
    near = np.minimum(near, np.linalg.norm(Pn - planet(p, Tn), axis=1))
tol = np.maximum(0.5, 0.0008 * near)
k = simplify(Tn, Pn, tol); print('H track', len(Tn), '->', len(k))
out['H'] = pack(Tn[k], Pn[k])

def flyby_planet(p, tag_center_jd, step_rows=None):
    C = load('-82', '500@10', 'ECLIPTIC', t0=tag_center_jd - 2.1, t1=tag_center_jd + 2.1)
    Q = load(p, '500@10', 'ECLIPTIC', t0=tag_center_jd - 2.1, t1=tag_center_jd + 2.1)
    common = np.intersect1d(np.round(C[:, 0] * 1440), np.round(Q[:, 0] * 1440))
    C = C[np.isin(np.round(C[:, 0] * 1440), common)]; Q = Q[np.isin(np.round(Q[:, 0] * 1440), common)]
    rel = C[:, 1:4] - Q[:, 1:4]; vrel = C[:, 4:7] - Q[:, 4:7]; d = np.linalg.norm(rel, axis=1); i = d.argmin()
    tau = -np.dot(rel[i], vrel[i]) / np.dot(vrel[i], vrel[i])
    tca = C[i, 0] + tau / 86400
    # hyperbolic bending: refine on a fine local polynomial of |rel|^2
    j = slice(max(0, i - 6), i + 7); tt = (C[j, 0] - tca) * 1440
    cf = np.polyfit(tt, d[j] ** 2, 4); ts = np.linspace(tt[0], tt[-1], 20001); dd = np.polyval(cf, ts)
    tca2 = tca + ts[dd.argmin()] / 1440; dca = np.sqrt(dd.min())
    j = slice(max(0, i - 40), i + 41); corr = Q[j, 1:4] - planet(p, Q[j, 0]); tt = Q[j, 0] - tca2
    A = np.c_[np.ones_like(tt), tt]; cff = np.linalg.lstsq(A, corr, rcond=None)[0]
    return dict(p=p, t=float(tca2 - JDE), d=float(dca), v=float(np.linalg.norm(vrel[i])), off=np.round(cff[0], 1).tolist(), rate=np.round(cff[1], 1).tolist(), res=float(np.abs(A @ cff - corr).max()))
RP = {'299': 6051.8, '399': 6371.0, '599': 71492.0}
PF = [flyby_planet('299', 2450930.07), flyby_planet('299', 2451354.35), flyby_planet('399', 2451408.64), flyby_planet('599', 2451908.92)]
for f in PF:
    f['alt'] = f['d'] - RP[f['p']]
    print('planet flyby', f['p'], cal(f['t'] + JDE), 'alt %.0f km  v %.2f km/s  corr res %.1f' % (f['alt'], f['v'], f['res']))
out['pfly'] = PF
# Jupiter & Saturn correction tables (truth - model), every 20 days, units km
pc = {}
for p in ('599', '699'):
    A = load(p, '500@10', 'ECLIPTIC'); A = A[(A[:, 0] >= JDE - 30) & (A[:, 0] <= 2453250)][::4]
    d = A[:, 1:4] - planet(p, A[:, 0])
    pc[p] = dict(t0=float(A[0, 0] - JDE), step=float(A[1, 0] - A[0, 0]), d=np.round(d / 100).astype(int).ravel().tolist())
out['pc'] = pc
# Masursky (asteroid 2685) closest approach
Ma = load('2685;', '500@10', 'ECLIPTIC'); Hc = load('-82', '500@10', 'ECLIPTIC', t0=Ma[0, 0] - 0.6, t1=Ma[-1, 0] + 0.6)
def interpH(t):  # cubic Hermite on 6-h samples
    i = np.searchsorted(Hc[:, 0], t) - 1; h = (Hc[i + 1, 0] - Hc[i, 0]) * 86400; s = (t - Hc[i, 0]) * 86400 / h
    p0, p1, v0, v1 = Hc[i, 1:4], Hc[i + 1, 1:4], Hc[i, 4:7] * h, Hc[i + 1, 4:7] * h
    return (2*s**3-3*s**2+1)*p0 + (s**3-2*s**2+s)*v0 + (-2*s**3+3*s**2)*p1 + (s**3-s**2)*v1
ds = [np.linalg.norm(interpH(t) - Ma[k, 1:4]) for k, t in enumerate(Ma[:, 0])]; km = int(np.argmin(ds))
out['mas'] = dict(t=float(Ma[km, 0] - JDE), p=np.round(Ma[km, 1:4]).tolist(), v=np.round(Ma[km, 4:7] * 86400).tolist(), d=float(ds[km]))
print('Masursky', cal(Ma[km, 0]), '%.0f km' % ds[km])

# ---------------- Saturn tour ----------------
S = load('-82', '500@699', t1=T_END)
S = S[S[:, 0] >= 2453126.5]                      # from 2004-05-01
Tn, Pn, Vn = S[:, 0], S[:, 1:4], S[:, 4:7]
r = np.linalg.norm(Pn, axis=1); near = r.copy()
for m in MO:
    if m == '609':
        sel = Tn < 2453200
        near[sel] = np.minimum(near[sel], np.linalg.norm(Pn[sel] - moon_pos(m, Tn[sel]), axis=1))
    else:
        near = np.minimum(near, np.linalg.norm(Pn - moon_pos(m, Tn), axis=1))
tol = np.maximum(0.4, 0.002 * near)
k = simplify(Tn, Pn, tol)
# keep the exact end point
if k[-1] != len(Tn) - 1: k = np.r_[k, len(Tn) - 1]
print('S track', len(Tn), '->', len(k))
out['S'] = pack(Tn[k], Pn[k])

# periapses / apoapses (true extrema within +/-2.5 d), per-rev geometry
pk = np.where((r[1:-1] < r[:-2]) & (r[1:-1] <= r[2:]))[0] + 1
pk = [i for i in pk if r[i] <= r[(Tn > Tn[i] - 2.5) & (Tn < Tn[i] + 2.5)].min() + 1e-6]
ap = np.where((r[1:-1] > r[:-2]) & (r[1:-1] >= r[2:]))[0] + 1
ap = [i for i in ap if r[i] >= r[(Tn > Tn[i] - 2.5) & (Tn < Tn[i] + 2.5)].max() - 1e-6]
print('periapses', len(pk), 'apoapses', len(ap))
revs = []
for n, i in enumerate(pk):
    h = np.cross(Pn[i], Vn[i]); inc = np.degrees(np.arccos(h[2] / np.linalg.norm(h)))
    a0 = [Tn[j] for j in ap if Tn[j] < Tn[i]]; a1 = [Tn[j] for j in ap if Tn[j] > Tn[i]]
    per = (a1[0] - a0[-1]) if (a0 and a1) else None
    revs.append([round(Tn[i] - JDE, 5), round(r[i]), round(inc, 2), round(per, 3) if per else None])
out['revs'] = revs
out['apo'] = [round(Tn[j] - JDE, 5) for j in ap]
# ring-plane crossings around SOI and at each Grand Finale periapsis
z = Pn[:, 2]; zc = np.where(np.sign(z[1:]) != np.sign(z[:-1]))[0]
def cross(i):
    f = z[i] / (z[i] - z[i + 1]); t = Tn[i] + (Tn[i + 1] - Tn[i]) * f; p = Pn[i] + (Pn[i + 1] - Pn[i]) * f
    return float(t - JDE), float(np.hypot(p[0], p[1]))
soi = [cross(i) for i in zc if 2453187.4 < Tn[i] < 2453187.9]
print('SOI ring-plane crossings', [(cal(t + JDE), round(R)) for t, R in soi])
out['soiX'] = soi
gfx = [cross(i) for i in zc if Tn[i] > 2457869.5 and np.hypot(*Pn[i, :2]) < 70000]
print('GF crossings', len(gfx), 'radius range', min(R for t, R in gfx), max(R for t, R in gfx))
out['gfX'] = gfx

# moons: model + flyby corrections
mo = {}
for m in MO:
    f = MF[m]; B = f['blocks']
    if m == '609': B = B[:6]
    mo[m] = dict(T0=f['T0'] + JD0 - JDE, L=f['L'], B=[[float('%.12g' % x) for x in b] for b in B])
out['moons'] = mo
FL = json.load(open('cache/flybys.json'))
fly = []; corr = []
for f in FL:
    mi = MO.index(f['m'])
    corr.append([round(f['t'] - JDE, 6), mi] + [round(x, 1) for x in f['off']] + [round(x, 1) for x in f['rate']])
    fly.append([round(f['t'] - JDE, 6), mi, round(f['alt'], 1), round(f['v'], 2)])
out['fly'] = fly; out['corr'] = corr
# Sun direction (unit) and Earth distance, Saturn frame
Su = load('10', '500@699'); Su = Su[np.abs(((Su[:, 0] - Su[0, 0]) / 10) - np.round((Su[:, 0] - Su[0, 0]) / 10)) < 1e-6]; u = Su[:, 1:4] / np.linalg.norm(Su[:, 1:4], axis=1)[:, None]
out['sun'] = dict(t0=float(Su[0, 0] - JDE), step=float(Su[1, 0] - Su[0, 0]), u=np.round(u, 5).ravel().tolist())
Ea = load('399', '500@699'); Ea = Ea[np.abs(((Ea[:, 0] - Ea[0, 0]) / 10) - np.round((Ea[:, 0] - Ea[0, 0]) / 10)) < 1e-6]
out['earth'] = dict(t0=float(Ea[0, 0] - JDE), step=float(Ea[1, 0] - Ea[0, 0]), d=np.round(np.linalg.norm(Ea[:, 1:4], axis=1) / 1e5).astype(int).tolist())
# Huygens (Saturn frame). Last hours: probe relative to Titan + Titan model.
Hy = load('-150', '500@699'); Hy = Hy[Hy[:, 0] < 2453384.75]
Ht = load('-150', '500@606')
Ht = Ht[Ht[:, 0] >= 2453384.75]
Pt = Ht[:, 1:4] + moon_pos('606', Ht[:, 0])
Tq = np.r_[Hy[:, 0], Ht[:, 0]]; Pq = np.r_[Hy[:, 1:4], Pt]
alt_h = np.linalg.norm(Ht[:, 1:4], axis=1) - RAD['606']
ie = np.argmax(alt_h < 1270); print('Huygens 1270 km interface', cal(Ht[ie, 0]), 'last row', cal(Ht[-1, 0]), round(alt_h[-1]))
near = np.linalg.norm(Pq - moon_pos('606', Tq), axis=1)
k = simplify(Tq, Pq, np.maximum(0.3, 0.001 * near)); print('Huygens', len(Tq), '->', len(k))
out['HY'] = pack(Tq[k], Pq[k])
out['HYentry'] = dict(t=float(Ht[ie, 0] - JDE), rel=np.round(Ht[ie, 1:4], 1).tolist())
json.dump(out, open('data.json', 'w'), separators=(',', ':'))
import os; print('data.json', os.path.getsize('data.json'))
