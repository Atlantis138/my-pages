"""Exact closest approaches from the 1-minute windows (truth Cassini minus truth moon), plus model corrections."""
import numpy as np, json
from common import *
from moonmodel import moon_pos
RAD = {'601':198.2,'602':252.1,'603':531.0,'604':561.4,'605':763.5,'606':2574.7,'607':135.0,'608':734.5,'609':106.5}
NAMES = {'601':'Mimas','602':'Enceladus','603':'Tethys','604':'Dione','605':'Rhea','606':'Titan','607':'Hyperion','608':'Iapetus','609':'Phoebe'}
C1 = load('-82', '500@699')        # every Cassini sample (10-min + all 1-min windows)
def refine(m, t0):
    M = load(m, '500@699', t0=t0 - 0.13, t1=t0 + 0.13)
    M = M[np.abs(np.diff(np.r_[M[0,0]-1, M[:, 0]]) - 1/1440) < 1e-6] if len(M) > 50 else M
    C = C1[(C1[:, 0] >= M[0, 0] - 1e-7) & (C1[:, 0] <= M[-1, 0] + 1e-7)]
    common = np.intersect1d(np.round(C[:, 0] * 1440), np.round(M[:, 0] * 1440))
    if len(common) < 20: return None
    Ci = C[np.isin(np.round(C[:, 0] * 1440), common)]; Mi = M[np.isin(np.round(M[:, 0] * 1440), common)]
    rel = Ci[:, 1:4] - Mi[:, 1:4]; vrel = Ci[:, 4:7] - Mi[:, 4:7]
    d = np.linalg.norm(rel, axis=1); i = d.argmin()
    if i == 0 or i == len(d) - 1: return None
    # straight-line refinement using the relative velocity at the sample
    tau = -np.dot(rel[i], vrel[i]) / np.dot(vrel[i], vrel[i])
    tca = Ci[i, 0] + tau / 86400; dca = np.linalg.norm(rel[i] + vrel[i] * tau)
    vr = np.linalg.norm(vrel[i])
    # model correction (truth - model) and its rate, at CA
    j = slice(max(0, i - 30), min(len(Mi), i + 31))
    corr = Mi[j, 1:4] - moon_pos(m, Mi[j, 0]); tt = Mi[j, 0] - tca
    A = np.c_[np.ones_like(tt), tt]; cf = np.linalg.lstsq(A, corr, rcond=None)[0]
    res = np.abs(A @ cf - corr).max()
    return dict(t=float(tca), m=m, d=float(dca), alt=float(dca - RAD[m]), v=float(vr), off=cf[0].tolist(), rate=cf[1].tolist(), fitres=float(res))
cands = json.load(open('cache/cands.json'))
out = []
for t, m, d in cands:
    if m == '609' and d > 100000: continue
    if m != '606' and d > 100000: continue
    r = refine(m, t)
    if r: out.append(r)
out.sort(key=lambda r: r['t'])
json.dump(out, open('cache/flybys.json', 'w'))
for m in NAMES:
    L = [r for r in out if r['m'] == m]
    if not L: continue
    alts = sorted(r['alt'] for r in L)
    print(f"{NAMES[m]:10s} n={len(L):3d} alt<5000:{sum(a<5000 for a in alts):3d} <10000:{sum(a<10000 for a in alts):3d} <30000:{sum(a<30000 for a in alts):3d} <70000:{sum(a<70000 for a in alts):3d}  min={alts[0]:.0f}  maxfitres={max(r['fitres'] for r in L):.1f}")
