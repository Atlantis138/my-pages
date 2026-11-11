import numpy as np, glob, os, hz
CACHE = hz.CACHE
EQ = 'BODY EQUATOR'
JD0 = 2450000.5                     # page epoch: 1995-10-10 00:00 UT; t = JD - JD0 (days)
GM_S = 37931207.7                   # km^3/s^2
R_S = 60268.0
def load(target, center, plane=EQ, t0=None, t1=None):
    """Concatenate every cached query for target/center/plane, sorted & de-duplicated."""
    import re
    key = re.sub(r'[^A-Za-z0-9_.-]', '_', f'{target}_{center}_')
    pk = re.sub(r'[^A-Za-z0-9_.-]', '_', f'_{plane}')
    fs = [f for f in glob.glob(os.path.join(CACHE, key + '*.npy')) if f.endswith(pk + '.npy')]
    a = np.concatenate([np.load(f) for f in fs])
    a = a[np.argsort(a[:, 0], kind='stable')]
    keep = np.r_[True, np.diff(a[:, 0]) > 1e-9]
    a = a[keep]
    if t0 is not None: a = a[a[:, 0] >= t0]
    if t1 is not None: a = a[a[:, 0] <= t1]
    return a

def kepler_pos(el, t):
    """el: a,e,inc,Om0,Omd,pi0,pid,l0,n,l2,l3 (angles rad, rates rad/day); t days from block centre."""
    a, e, inc, Om0, Omd, pi0, pid, l0, n, l2, l3 = el
    Om = Om0 + Omd * t; pi = pi0 + pid * t; lam = l0 + n * t + l2 * t * t + l3 * t ** 3
    M = np.mod(lam - pi + np.pi, 2 * np.pi) - np.pi
    E = M.copy()
    for _ in range(30): E = E - (E - e * np.sin(E) - M) / (1 - e * np.cos(E))
    nu = 2 * np.arctan2(np.sqrt(1 + e) * np.sin(E / 2), np.sqrt(1 - e) * np.cos(E / 2))
    r = a * (1 - e * np.cos(E)); u = nu + pi - Om
    cO, sO, cu, su, ci, si = np.cos(Om), np.sin(Om), np.cos(u), np.sin(u), np.cos(inc), np.sin(inc)
    return np.stack([r * (cO * cu - sO * su * ci), r * (sO * cu + cO * su * ci), r * su * si], -1)
