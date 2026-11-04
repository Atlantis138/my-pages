"""Re-extract the river network from the 500 m Copernicus grid (D8 flow direction + accumulation).

Input : raw/z1_full.npy (build_terrain.py; 27–33°N, 90–105°E at 0.005°), data/atlas.json (river labels)
Output: data/rivers.json  {rivers:[{c, p:[lon,lat,...]}], labels:[{n, lon, lat}]}

Rivers that rise outside the processed window (Yarlung Tsangpo from the west, Jinsha, Lancang, Yalong
and Dadu from the north) get their upstream catchment injected at the boundary so that their class is
right. Classes are drainage-area bands, matched to the line widths of the page.
"""
import math
import numpy as np
if not hasattr(np, 'in1d'):          # pysheds 0.5 still calls np.in1d (removed in numpy 2.x)
    np.in1d = np.isin
from affine import Affine
from pysheds.grid import Grid
from pysheds.sview import Raster, ViewFinder
from common import RAW, DATA, BOX, load_json, dump_json

D = 0.005
LAT_TOP, LON_LEFT = 33.0, 90.0
# (name, lon, lat, upstream area outside the window in km², approximate)
INFLOW = [('雅鲁藏布江', 90.0, 29.35, 105000), ('金沙江', 97.3, 33.0, 140000), ('澜沧江', 95.6, 33.0, 17000),
          ('雅砻江', 98.0, 33.0, 15000), ('大渡河', 100.9, 33.0, 16000), ('怒江', 92.4, 33.0, 6000)]
CLASSES = [(900, 0), (1000, 1), (3000, 2), (10000, 3)]   # min drainage area (km²) -> class


def chaikin(p, it=2):
    for _ in range(it):
        if len(p) < 3: break
        q = [p[0]]
        for a, b in zip(p[:-1], p[1:]):
            q.append(0.75 * a + 0.25 * b); q.append(0.25 * a + 0.75 * b)
        q.append(p[-1]); p = np.array(q)
    return p


def dp(p, tol):
    keep = np.zeros(len(p), bool); keep[[0, -1]] = True
    st = [(0, len(p) - 1)]
    while st:
        a, b = st.pop()
        if b <= a + 1: continue
        s = p[b] - p[a]; L = math.hypot(*s); r = p[a + 1:b] - p[a]
        d = np.abs(s[0] * r[:, 1] - s[1] * r[:, 0]) / L if L > 0 else np.hypot(*r.T)
        k = int(d.argmax())
        if d[k] > tol: keep[a + 1 + k] = True; st += [(a, a + 1 + k), (a + 1 + k, b)]
    return p[keep]


DIRS = {64: (-1, 0), 128: (-1, 1), 1: (0, 1), 2: (1, 1), 4: (1, 0), 8: (1, -1), 16: (0, -1), 32: (-1, -1)}


def trace(fd, acc, classes):
    """Polylines between channel heads / confluences / class changes, clipped to the map box."""
    ny, nx = fd.shape
    tmin = classes[0][0]
    chan = acc >= tmin
    down = -np.ones(fd.shape, np.int64)
    for code, (dr, dc) in DIRS.items():
        r, c = np.nonzero(chan & (fd == code))
        r2, c2 = r + dr, c + dc
        ok = (r2 >= 0) & (r2 < ny) & (c2 >= 0) & (c2 < nx)
        down[r[ok], c[ok]] = r2[ok] * nx + c2[ok]
    cls = np.full(fd.shape, -1)
    for amin, k in classes: cls[acc >= amin] = k
    flat_down = down.ravel(); flat_cls = cls.ravel()
    nup = np.bincount(flat_down[flat_down >= 0], minlength=ny * nx)
    lat = LAT_TOP - np.arange(ny) * D; lon = LON_LEFT + np.arange(nx) * D
    starts = [i for i in np.nonzero(chan.ravel())[0] if nup[i] != 1]   # heads and confluences
    out, queue, seen = [], list(starts), set(starts)
    while queue:
        s0 = queue.pop()
        line = [s0]; i = s0
        while True:
            j = flat_down[i]
            if j < 0 or not chan.ravel()[j]: break
            line.append(j)
            if nup[j] != 1: break
            if flat_cls[j] != flat_cls[s0]:          # class change: continue as a new line from here
                if j not in seen: seen.add(j); queue.append(j)
                break
            i = j
        if len(line) < 2: continue
        rr, cc = np.divmod(np.array(line), nx)
        xy = np.c_[lon[cc], lat[rr]]
        inside = (xy[:, 0] >= BOX[0]) & (xy[:, 0] <= BOX[2]) & (xy[:, 1] >= BOX[1]) & (xy[:, 1] <= BOX[3])
        j = 0
        while j < len(xy):
            if not inside[j]: j += 1; continue
            k = j
            while k + 1 < len(xy) and inside[k + 1]: k += 1
            if k > j:
                sm = chaikin(dp(xy[j:k + 1], D * 0.8), 1)
                out.append({'c': int(flat_cls[s0]), 'p': [round(float(v), 3) for v in sm.ravel()]})
            j = k + 1
    return out


def main():
    Z = np.load(f'{RAW}/z1_full.npy').astype(np.float64)
    ny, nx = Z.shape
    vf = ViewFinder(affine=Affine(D, 0, LON_LEFT - D / 2, 0, -D, LAT_TOP + D / 2), shape=Z.shape, nodata=-32768.0)
    grid = Grid(viewfinder=vf)
    dem = Raster(Z, viewfinder=vf)
    dem = grid.resolve_flats(grid.fill_depressions(grid.fill_pits(dem)))
    fdir = grid.flowdir(dem)
    lat = LAT_TOP - np.arange(ny) * D
    area = (D * 111.32) * (D * 110.95) * np.cos(np.radians(lat))[:, None] * np.ones((1, nx))
    for name, lo, la, a in INFLOW:   # inject at the lowest boundary cell near the given point
        r = int(round((LAT_TOP - la) / D)); c = int(round((lo - LON_LEFT) / D))
        if lo <= LON_LEFT:
            rr = np.arange(max(0, r - 40), min(ny, r + 40)); k = rr[np.argmin(Z[rr, 0])]; area[k, 0] += a
        else:
            cc = np.arange(max(0, c - 40), min(nx, c + 40)); k = cc[np.argmin(Z[0, cc])]; area[0, k] += a
    acc = grid.accumulation(fdir, weights=Raster(area, viewfinder=vf))
    acc = np.asarray(acc)
    fd = np.asarray(fdir)
    rivers = trace(fd, acc, CLASSES)
    # river labels: move to the nearest large-river vertex within ~10 km
    big = np.array([[r['p'][i], r['p'][i + 1]] for r in rivers if r['c'] >= 2 for i in range(0, len(r['p']), 2)])
    labels = []
    for lb in load_json(f'{DATA}/atlas.json')['riverLabels']:
        d = np.hypot((big[:, 0] - lb['lon']) * 96, (big[:, 1] - lb['lat']) * 111)
        k = int(d.argmin())
        lon, lat = (big[k] if d[k] < 10 else (lb['lon'], lb['lat']))
        labels.append({'n': lb['n'], 'lon': round(float(lon), 4), 'lat': round(float(lat), 4)})
    km = {}
    for r in rivers:
        p = r['p']; km[r['c']] = km.get(r['c'], 0) + sum(math.hypot((p[i + 2] - p[i]) * 96, (p[i + 3] - p[i + 1]) * 111) for i in range(0, len(p) - 2, 2))
    print(len(rivers), 'polylines; km by class', {k: round(v) for k, v in sorted(km.items())}, 'points', sum(len(r['p']) // 2 for r in rivers))
    dump_json({'rivers': rivers, 'labels': labels}, f'{DATA}/rivers.json')


if __name__ == '__main__':
    main()
