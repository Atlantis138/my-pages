"""Fit one precessing Keplerian ellipse per moon per calendar year (+/-25 d overlap) to Horizons positions."""
import numpy as np, json, datetime as dt
from scipy.optimize import least_squares
from common import *
BL = {'607': 16.0, '609': 90.0}
MOONS = ['601', '602', '603', '604', '605', '606', '607', '608', '609']
J2, RREF = 0.016298, 60330.0
def jd(y): return (dt.datetime(y, 1, 1) - dt.datetime(2000, 1, 1, 12)).days + 2451545.0
def guess(tt, P, V):
    h = np.cross(P, V).mean(0); h /= np.linalg.norm(h)
    inc = np.arccos(h[2]); Om = np.arctan2(h[0], -h[1])
    # in-plane true longitude (from node) + Om
    nvec = np.array([np.cos(Om), np.sin(Om), 0]); m = np.cross(h, nvec)
    ang = np.unwrap(np.arctan2(P @ m, P @ nvec)) + Om
    r = np.linalg.norm(P, axis=1)
    A = np.c_[np.ones_like(tt), tt]; l0, n = np.linalg.lstsq(A, ang, rcond=None)[0]
    a = r.mean(); dpi = 1.5 * n * J2 * (RREF / a) ** 2
    lam = l0 + n * tt
    best = None
    for pid in (dpi, 0.0, -dpi, 2 * dpi):
        X = np.c_[np.ones_like(tt), np.cos(lam - pid * tt), np.sin(lam - pid * tt)]
        c = np.linalg.lstsq(X, r, rcond=None)[0]
        res = np.sum((X @ c - r) ** 2)
        if best is None or res < best[0]: best = (res, pid, c)
    _, pid, c = best
    e = np.hypot(c[1], c[2]) / c[0]; pi0 = np.arctan2(-c[2], -c[1])
    return [c[0], min(e, 0.5), inc, Om, -dpi if inc < 1.4 else 0.0, pi0, pid, l0, n, 0.0, 0.0]
out = {}
for m in MOONS:
    A = load(m, '500@699')
    blocks = []
    L = BL.get(m, 365.25); T0 = jd(2004); nb = int(np.ceil((jd(2018) - T0) / L))
    ov = max(4 * (A[1, 0] - A[0, 0]), 0.07 * L)
    for b in range(nb):
        b0, b1 = T0 + b * L, T0 + (b + 1) * L; tc = (b0 + b1) / 2
        sel = (A[:, 0] >= b0 - ov) & (A[:, 0] <= b1 + ov)
        tt = A[sel, 0] - tc; P = A[sel, 1:4]; V = A[sel, 4:7] * 86400
        x0 = guess(tt, P, V)
        f = lambda el: (kepler_pos(el, tt) - P).ravel()
        sol = least_squares(f, x0, method='lm', x_scale='jac', max_nfev=4000)
        if m in ('607', '609'):   # strongly perturbed: try extra polynomial freedom is already there; nothing else
            pass
        res = np.linalg.norm(kepler_pos(sol.x, tt) - P, axis=1)
        inner = (A[sel, 0] >= b0) & (A[sel, 0] < b1)
        blocks.append(dict(tc=tc - JD0, el=sol.x.tolist(), rms=float(np.sqrt((res[inner] ** 2).mean())), mx=float(res[inner].max())))
        if b % max(1, nb // 14) == 0 or blocks[-1]['mx'] > 2000: print(m, b, f"a={sol.x[0]:.0f} e={sol.x[1]:.4f} i={np.degrees(sol.x[2]):.2f} rms={blocks[-1]['rms']:.0f} max={blocks[-1]['mx']:.0f} km", flush=True)
    out[m] = dict(T0=T0 - JD0, L=L, blocks=[bk['el'] for bk in blocks]); print(m, 'worst max', max(bk['mx'] for bk in blocks))
json.dump(out, open('moonfit.json', 'w'))
