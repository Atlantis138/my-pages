"""Rivers and water areas from OpenStreetMap (data (c) OpenStreetMap contributors, ODbL).

Input : raw/osm_rivers.json, raw/osm_water.json (scripts/fetch_water.py), data/atlas.json (river label anchors)
Output: data/rivers.json  {q, rivers:[[class, x0, y0, dx, dy, ...]], labels:[{n, lon, lat}]}
          coordinates in units of q degrees (2e-4 ≈ 20 m): first point absolute (from lon 90 / lat 27),
          then deltas. Classes 0–3 from the upstream river length (see below).
        data/water.png    lakes, reservoirs and wide river channels as a signed distance field over the map box
          (row 0 = north, 2048 px across 14.2°; 128 = shoreline, 0 / 255 = SDF_RANGE px outside / inside)

River classes: every waterway=river way gets the summed length of itself and of all ways that drain into
it (OSM ways are drawn in flow direction; tributaries join at a shared vertex). Main stems that rise outside
the map box get their upstream length outside the box added by name. Ways with less than MIN_ACC km of
river upstream are dropped.
"""
import json, math, sys
from collections import defaultdict
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage
from shapely.geometry import LineString, Polygon, MultiPolygon, box
from shapely.ops import polygonize, unary_union, linemerge
from shapely import affinity
from common import RAW, DATA, BOX, load_json, dump_json

Q = 2e-4
MIN_ACC = 90.0                       # km of river upstream (incl. the way itself) to keep a way
CLASSES = [(90, 0), (250, 1), (700, 2), (1800, 3)]
SIMPLIFY = {0: 0.0012, 1: 0.001, 2: 0.0008, 3: 0.0006}   # degrees (~60–130 m)
# km of main stem upstream of the map box (rough, from the river lengths above their entry points)
INFLOW = {'雅鲁藏布江': 1500, '金沙江': 2300, '澜沧江': 900, '扎曲': 500, '怒江': 900, '那曲': 300, '雅砻江': 700,
          '大渡河': 500, '岷江': 250, '鲜水河': 150, '泥曲': 120, '达曲': 120, '玉曲': 50, '昂曲': 200, '吉曲': 50}
W_PX = 2048
SDF_RANGE = 2.0                      # pixels of distance encoded on each side of the shoreline
MIN_LAKE_KM2 = 1.0


def km_len(c):
    return sum(math.hypot((b[0] - a[0]) * 96.4, (b[1] - a[1]) * 111.0) for a, b in zip(c, c[1:]))


def name_of(t):
    n = t.get('name:zh') or t.get('name') or ''
    for k in INFLOW:
        if k in n:
            return k
    return n


def rivers():
    d = load_json(f'{RAW}/osm_rivers.json')
    ways = [e for e in d['elements'] if e['type'] == 'way' and len(e.get('geometry', [])) > 1]
    W = []
    for e in ways:
        c = [(p['lon'], p['lat']) for p in e['geometry']]
        W.append({'c': c, 'n': name_of(e.get('tags', {})), 'L': km_len(c)})
    at = defaultdict(list)                       # vertex -> [(way, index)]
    for i, w in enumerate(W):
        for k, p in enumerate(w['c']):
            at[p].append((i, k))
    down = defaultdict(set)                      # way -> ways it drains into
    up = defaultdict(set)
    for i, w in enumerate(W):
        for j, k in at[w['c'][-1]]:
            if j != i and k < len(W[j]['c']) - 1:
                down[i].add(j); up[j].add(i)
    sys.setrecursionlimit(100000)
    acc, state = {}, {}

    def f(i):
        if i in acc: return acc[i]
        if state.get(i) == 1: return 0.0       # cycle (braids, mis-drawn directions)
        state[i] = 1
        a = W[i]['L'] + sum(f(j) for j in up[i])
        state[i] = 2; acc[i] = a
        return a
    for i in range(len(W)): f(i)
    for i, w in enumerate(W):
        if w['n'] in INFLOW:
            acc[i] += INFLOW[w['n']]
    # a named stem keeps the class of its largest part downstream of where it reaches it
    best = defaultdict(float)
    for i, w in enumerate(W):
        if w['n']: best[w['n']] = max(best[w['n']], acc[i])

    def cls(a):
        c = -1
        for amin, k in CLASSES:
            if a >= amin: c = k
        return c
    groups = defaultdict(list)
    clip = box(*BOX)
    for i, w in enumerate(W):
        a = acc[i]
        if w['n'] in INFLOW: a = max(a, 0.6 * best[w['n']])
        c = cls(a)
        if c < 0: continue
        groups[c].append(LineString(w['c']))
    out, npts, km = [], 0, defaultdict(float)
    for c, ls in groups.items():
        m = linemerge(unary_union(ls)).intersection(clip)
        parts = getattr(m, 'geoms', [m])
        for g in parts:
            if g.is_empty or g.geom_type != 'LineString': continue
            s = g.simplify(SIMPLIFY[c], preserve_topology=False)
            xy = np.round((np.array(s.coords) - [90.0, 27.0]) / Q).astype(np.int64)
            keep = np.r_[True, np.any(np.diff(xy, axis=0) != 0, axis=1)]
            xy = xy[keep]
            if len(xy) < 2: continue
            dxy = np.r_[xy[:1], np.diff(xy, axis=0)]
            out.append([c] + dxy.ravel().tolist())
            npts += len(xy); km[c] += km_len(s.coords)
    out.sort(key=lambda r: r[0])
    print('rivers:', len(out), 'polylines,', npts, 'points; km by class', {k: round(v) for k, v in sorted(km.items())})
    return out


def decode(r):
    xy = np.cumsum(np.array(r[1:]).reshape(-1, 2), axis=0) * Q + [90.0, 27.0]
    return xy


def water():
    d = load_json(f'{RAW}/osm_water.json')
    polys = []
    for e in d['elements']:
        t = e.get('tags', {})
        if t.get('water') in ('pond', 'basin', 'wastewater', 'reflecting_pool', 'drain', 'stream', 'harbour'): continue
        try:
            if e['type'] == 'way':
                g = [(p['lon'], p['lat']) for p in e.get('geometry', [])]
                if len(g) < 4 or g[0] != g[-1]: continue
                P = Polygon(g)
            else:
                mem = [m for m in e.get('members', []) if m['type'] == 'way' and m.get('geometry') and len(m['geometry']) > 1]
                lines = lambda role: [LineString([(p['lon'], p['lat']) for p in m['geometry']]) for m in mem if (m.get('role') == 'inner') == role]
                P = unary_union(list(polygonize(unary_union(lines(False)))))
                inner = lines(True)
                if inner: P = P.difference(unary_union(list(polygonize(unary_union(inner)))))
            P = P.buffer(0)
        except Exception:
            continue
        if P.is_empty: continue
        a = affinity.scale(P, 96.4, 111.0, origin=(0, 0)).area
        if a < MIN_LAKE_KM2: continue
        polys.append(P)
    U = unary_union(polys).intersection(box(BOX[0] - 0.05, BOX[1] - 0.05, BOX[2] + 0.05, BOX[3] + 0.05))
    print('water polygons:', len(polys), 'area km²', round(affinity.scale(U, 96.4, 111.0, origin=(0, 0)).area))
    # rasterize at 4x, distance transform, sample down to W_PX
    S = 6
    w = W_PX; h = int(round(W_PX * (BOX[3] - BOX[1]) / (BOX[2] - BOX[0])))
    W2, H2 = w * S, h * S
    img = Image.new('1', (W2, H2), 0); dr = ImageDraw.Draw(img)
    sx = W2 / (BOX[2] - BOX[0]); sy = H2 / (BOX[3] - BOX[1])
    pt = lambda c: [((x - BOX[0]) * sx, (BOX[3] - y) * sy) for x, y in c]
    for P in getattr(U, 'geoms', [U]):
        if P.geom_type != 'Polygon': continue
        dr.polygon(pt(P.exterior.coords), fill=1)
        for r in P.interiors: dr.polygon(pt(r.coords), fill=0)
    M = np.array(img, dtype=bool)
    din = ndimage.distance_transform_edt(M)              # inside: distance to nearest dry cell
    dout = ndimage.distance_transform_edt(~M)
    sd = np.where(M, din - 0.5, -(dout - 0.5)) / S         # signed distance in output pixels
    sd = sd.reshape(h, S, w, S).mean(axis=(1, 3))
    v = np.clip(np.round(128 + sd * (127 / SDF_RANGE)), 0, 255).astype(np.uint8)
    Image.fromarray(v, 'L').save(f'{DATA}/water.png', optimize=True)
    print('water.png', v.shape)
    return U


def labels(rv):
    pts = defaultdict(list)
    for r in rv:
        if r[0] >= 1:
            for p in decode(r): pts['all'].append(p)
    P = np.array(pts['all'])
    out = []
    for lb in load_json(f'{DATA}/atlas.json')['riverLabels']:
        dd = np.hypot((P[:, 0] - lb['lon']) * 96, (P[:, 1] - lb['lat']) * 111)
        k = int(dd.argmin())
        lon, lat = (P[k] if dd[k] < 12 else (lb['lon'], lb['lat']))
        out.append({'n': lb['n'], 'lon': round(float(lon), 4), 'lat': round(float(lat), 4)})
    return out


def main():
    rv = rivers()
    water()
    dump_json({'q': Q, 'rivers': rv, 'labels': labels(rv)}, f'{DATA}/rivers.json')


if __name__ == '__main__':
    main()
