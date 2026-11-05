import json, numpy as np
from common import kepler_pos, JD0
MF = json.load(open('moonfit.json'))
def moon_pos(m, jd):
    """Blend neighbouring blocks with a smooth weight (same rule as the page)."""
    f = MF[m]; t = np.atleast_1d(jd - JD0).astype(float); L = f['L']; B = np.array(f['blocks'])
    x = (t - f['T0']) / L - 0.5; i0 = np.clip(np.floor(x).astype(int), 0, len(B) - 1); i1 = np.clip(i0 + 1, 0, len(B) - 1)
    w = np.clip((x - i0 - 0.5) / 0.1 + 0.5, 0, 1); w = w * w * (3 - 2 * w)   # blend over the middle 10 % around each boundary
    out = np.zeros((len(t), 3))
    for idx in np.unique(np.r_[i0, i1]):
        wt = ((i0 == idx) * (1 - w)) + ((i1 == idx) * w); s = wt > 0
        if not s.any(): continue
        tc = f['T0'] + (idx + 0.5) * L
        out[s] += kepler_pos(B[idx], t[s] - tc) * wt[s, None]
    return out
