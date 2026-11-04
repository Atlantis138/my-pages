"""Estimate rail (formation) elevations along the OSM line and write data/route.json.

Input : raw/route_geom.json (build_route.py), raw/mosaic.npy (build_terrain.py), data/atlas.json
Output: data/route.json

OSM has no elevations, so the rail profile is inferred:
  * at-grade track follows the 90 m ground (robust, outliers down-weighted);
  * tunnel portals and bridge ends are pinned to the ground there;
  * inside tunnels / on bridges the rail is free, so it comes out as the smoothest line between the ends;
  * every 100 m step is held to |grade| <= 30 ‰ (hard constraint);
  * two published control points: 大渡河特大桥 rail 1,681.48 m, 金沙江特大桥 deck ~3,000 m.
Solved per section as one quadratic programme (OSQP) with a few robust reweighting passes.
"""
import math
import numpy as np
import osqp
from scipy import sparse
from scipy import ndimage
from common import RAW, DATA, load_json, dump_json

GRADE = 0.030
STEP = 0.1                     # km, solver spacing
PROFILE_STEP = 0.2             # km, spacing of the profile arrays in the page
CONTROL = {'泸定大渡河铁路大桥': ('大渡河特大桥', 1681.48, 'yl'), '罗麦金沙江特大桥': ('金沙江特大桥', 3000.0, 'yl')}
TUNNEL_MATCH = {'二郎山隧道': '二郎山隧道', '康定2号隧道（折多山隧道）': '康定2号隧道', '高尔寺隧道': '高尔寺山隧道',
                '果拉山隧道': '果拉山隧道', '伯舒拉岭隧道': '伯舒拉岭隧道', '易贡隧道': '易贡隧道', '拉月隧道': '拉月隧道',
                '色季拉山隧道': '色季拉山隧道'}
BRIDGE_MATCH = {'大渡河特大桥': '泸定大渡河铁路大桥', '金沙江特大桥': '罗麦金沙江特大桥', '怒江特大桥': '怒江特大桥',
                '东久曲特大桥': '东久曲特大桥', '尼洋河特大桥': '尼洋河特大桥', '藏木雅鲁藏布江双线特大桥': '藏木特大桥'}

M = np.load(f'{RAW}/mosaic.npy', mmap_mode='r')


def ground(lon, lat):
    r = (33.0 - np.asarray(lat)) * 1200
    c = (np.asarray(lon) - 90.0) * 1200
    r0, c0 = np.floor(r).astype(int), np.floor(c).astype(int)
    tr, tc = r - r0, c - c0
    a = M[r0, c0].astype(float); b = M[r0, c0 + 1]; cc = M[r0 + 1, c0]; d = M[r0 + 1, c0 + 1]
    return a * (1 - tr) * (1 - tc) + b * (1 - tr) * tc + cc * tr * (1 - tc) + d * tr * tc


def runs_of(S):
    """Structure runs [kind, k0, k1, name, rough] from per-vertex edge attributes."""
    out = []
    km, kind, name, rough = S['km'], S['kind'], S['name'], S['rough']
    i = 0
    while i < len(km) - 1:
        if kind[i] == 0: i += 1; continue
        j = i
        while j + 1 < len(km) - 1 and kind[j + 1] == kind[i] and name[j + 1] == name[i]: j += 1
        out.append([kind[i], km[i], km[j + 1], name[i], int(any(rough[i:j + 1]))])
        i = j + 1
    return out


def solve(k, g, w, lo_bound, hi_bound, extra):
    """min sum w (r-g)^2 + lam*|D2 r|^2 + extra anchors, s.t. |dr| <= GRADE*dk, r >= lo, r <= hi (soft via IRLS)."""
    n = len(k)
    dk = np.diff(k) * 1000.0
    D1 = sparse.diags([-np.ones(n - 1), np.ones(n - 1)], [0, 1], shape=(n - 1, n))
    D2 = sparse.diags([np.ones(n - 2), -2 * np.ones(n - 2), np.ones(n - 2)], [0, 1, 2], shape=(n - 2, n))
    lam = 40.0
    a = g.copy(); W = w.copy()
    for idx, val, wt in extra:
        a[idx] = (a[idx] * W[idx] + val * wt) / (W[idx] + wt); W[idx] += wt
    base_W, base_a = W.copy(), a.copy()
    r = None
    for it in range(6):
        P = sparse.diags(2 * W) + 2 * lam * (D2.T @ D2)
        q = -2 * W * a
        prob = osqp.OSQP()
        prob.setup(sparse.triu(P).tocsc(), q, D1.tocsc(), -GRADE * dk, GRADE * dk, verbose=False,
                   eps_abs=1e-4, eps_rel=1e-5, max_iter=40000, polishing=True)
        res = prob.solve()
        r = res.x
        # robust reweighting of ground anchors + soft bounds (bridge above ground, tunnel below)
        e = np.abs(r - base_a)
        W = base_W * np.where((base_W > 50) | (e <= 20), 1.0, 20 / np.maximum(e, 1e-6))
        a = base_a.copy()
        for mask, target, wt in ((r < lo_bound, lo_bound, 2.0), (r > hi_bound, hi_bound, 0.5)):
            a[mask] = (a[mask] * W[mask] + target[mask] * wt) / (W[mask] + wt)
            W[mask] += wt
    return r


def main():
    geom = load_json(f'{RAW}/route_geom.json')
    atlas = load_json(f'{DATA}/atlas.json')
    out = {'sections': {}, 'runs': [], 'stations': {}, 'profile': {'step': PROFILE_STEP}, 'calibration': [], 'checks': {}}
    for sec, S in geom['sections'].items():
        km = np.array(S['km']); lon = np.array(S['lon']); lat = np.array(S['lat'])
        kind = np.array(S['kind']); rough = np.array(S['rough'])
        runs = runs_of(S)
        # sample positions: uniform grid + all vertices of structure ends
        ends = sorted({x for rr in runs for x in (rr[1], rr[2])})
        grid = np.r_[np.arange(0, km[-1], STEP), km[-1]]
        if ends:   # drop grid points within 20 m of a structure end so no step is degenerate
            e_ = np.array(ends)
            grid = grid[np.min(np.abs(grid[:, None] - e_[None, :]), axis=1) > 0.02]
        k = np.unique(np.r_[grid, ends])
        k = k[np.r_[True, np.diff(k) > 0.005]]
        seg = np.clip(np.searchsorted(km, k, side='right') - 1, 0, len(km) - 2)
        t = (k - km[seg]) / np.maximum(km[seg + 1] - km[seg], 1e-9)
        slon = lon[seg] + (lon[seg + 1] - lon[seg]) * t
        slat = lat[seg] + (lat[seg + 1] - lat[seg]) * t
        g = ground(slon, slat)
        skind = kind[seg].copy(); srough = rough[seg].copy()
        is_end = np.isin(k, ends)
        # at a structure end the sample belongs to the structure on one side: pin it
        w = np.where(skind == 0, np.where(srough == 1, 0.05, 1.0), 0.0)
        w[is_end] = 3.0
        lo_b = np.full(len(k), -1e9); hi_b = np.full(len(k), 1e9)
        lo_b[(skind == 1) & ~is_end] = g[(skind == 1) & ~is_end] + 3     # deck above ground
        hi_b[(skind == 2) & ~is_end] = g[(skind == 2) & ~is_end] - 10    # tunnel under ground
        extra = []
        for rr in runs:
            if rr[3] in CONTROL and CONTROL[rr[3]][2] == sec:
                mid = 0.5 * (rr[1] + rr[2]); idx = int(np.argmin(np.abs(k - mid)))
                extra.append((idx, CONTROL[rr[3]][1], 400.0, rr[3]))
        # naive profile (what you get from interpolation alone) for the grade check
        naive = np.where(skind == 0, g, np.nan)
        naive[is_end] = g[is_end]
        good = ~np.isnan(naive)
        naive = np.interp(k, k[good], naive[good])
        gr_naive = np.abs(np.diff(naive)) / (np.diff(k) * 1000)
        r0 = solve(k, g, w, lo_b, hi_b, [])
        r = solve(k, g, w, lo_b, hi_b, [(i, v, wt) for i, v, wt, _ in extra])
        gr = np.abs(np.diff(r)) / (np.diff(k) * 1000)
        dkm = np.diff(k)
        out['checks'][sec] = dict(
            km=round(float(k[-1]), 2),
            naive_over_30_km=round(float(dkm[gr_naive > GRADE + 1e-4].sum()), 1),
            solved_max_grade_permille=round(float(gr.max() * 1000), 2),
            solved_over_30_km=round(float(dkm[gr > GRADE + 5e-4].sum()), 2),
            at_grade_median_abs_dev_m=round(float(np.median(np.abs(r - g)[(skind == 0) & (srough == 0)])), 1) if ((skind == 0) & (srough == 0)).any() else None,
            tunnel_max_cover_m=round(float(np.max((g - r)[skind == 2])), 0) if (skind == 2).any() else None,
            bridge_max_height_m=round(float(np.max((r - g)[skind == 1])), 0) if (skind == 1).any() else None)
        for i, v, wt, nm in extra:
            out['calibration'].append(dict(name=CONTROL[nm][0], osm=nm, control=v, uncalibrated=round(float(r0[i]), 1),
                                           calibrated=round(float(r[i]), 1), ground=round(float(g[i]), 1), km=round(float(k[i]), 2)))
        # OSM ele tags as an independent check
        # vertex values
        rv = np.interp(km, k, r); gv = ground(lon, lat)
        code = ''.join(str(int(a) + 3 * int(b)) for a, b in zip(kind, rough))
        out['sections'][sec] = dict(lon=[round(float(x), 5) for x in lon], lat=[round(float(x), 5) for x in lat],
                                    km=[round(float(x), 3) for x in km], a=code,
                                    r=[int(round(x)) for x in rv], g=[int(round(x)) for x in gv])
        pk = np.arange(0, k[-1] + 1e-9, PROFILE_STEP)
        pg = ground(np.interp(pk, k, slon), np.interp(pk, k, slat))
        # profile ground: max over each 200 m bin is too spiky; use the sample itself
        out['profile'][sec] = dict(g=[int(round(x)) for x in pg], r=[int(round(x)) for x in np.interp(pk, k, r)])
        for rr in runs:
            out['runs'].append([sec, rr[0], round(rr[1], 3), round(rr[2], 3), rr[3], rr[4]])
        S['_k'], S['_r'], S['_g'], S['_kind'], S['_lon'], S['_lat'] = k, r, g, skind, slon, slat

    # stations
    for key, st in geom['stations'].items():
        S = geom['sections'][st['s']]
        e = float(ground(st['lon'], st['lat']))
        rr = float(np.interp(st['km'], S['_k'], S['_r']))
        out['stations'][key] = dict(n=st['n'], s=st['s'], lon=st['lon'], lat=st['lat'], km=st['km'], src=st['src'],
                                    ground=int(round(e)), rail=int(round(rr)), osm_note=st['osm_note'])
    # 雅安 sits at the cy/yl junction
    ya = out['stations'].get('yl雅安')

    # key tunnels / bridges in the atlas -> OSM positions (or mapped sketch positions)
    def km_map(sec, legacy_km):
        legacy = [(s['km'], out['stations'][s['s'] + s['n']]['km']) for s in atlas['stations'] if s['s'] == sec and (s['s'] + s['n']) in out['stations']]
        if sec == 'll':
            legacy = [(0.0, 0.0)] + legacy
        legacy.sort()
        a = np.array(legacy)
        return float(np.interp(legacy_km, a[:, 0], a[:, 1]))

    def find_run(name, sec):
        rs = [r for r in out['runs'] if r[4] == name and r[0] == sec]
        if not rs: return None
        return min(r[2] for r in rs), max(r[3] for r in rs)

    out['tunnels'], out['bridges'] = {}, {}
    for t in atlas['tunnels']:
        hit = find_run(TUNNEL_MATCH.get(t['n']), 'yl') if t['n'] in TUNNEL_MATCH else None
        if hit:
            out['tunnels'][t['n']] = dict(k0=round(hit[0], 2), k1=round(hit[1], 2), src='osm', osm=TUNNEL_MATCH[t['n']])
        else:
            out['tunnels'][t['n']] = dict(k0=round(km_map('yl', t['k0']), 2), k1=round(km_map('yl', t['k1']), 2), src='sketch')
    for b in atlas['bridges']:
        hit = find_run(BRIDGE_MATCH.get(b['n']), b['s'])
        S = geom['sections'][b['s']]
        if hit:
            kk = 0.5 * (hit[0] + hit[1]); src = 'osm'
        else:
            kk = km_map(b['s'], b['km']); src = 'sketch'
        lo_ = float(np.interp(kk, S['km'], S['lon'])); la_ = float(np.interp(kk, S['km'], S['lat']))
        out['bridges'][b['n']] = dict(s=b['s'], km=round(kk, 2), lon=round(lo_, 5), lat=round(la_, 5), src=src,
                                      osm=BRIDGE_MATCH.get(b['n']) if hit else None,
                                      rail=int(round(float(np.interp(kk, S['_k'], S['_r'])))),
                                      ground=int(round(float(np.interp(kk, S['_k'], S['_g'])))))
    # OSM ele tags vs estimate (independent check, not used in the fit)
    ele = []
    for f in ('osm_main.json',):
        for e in load_json(f'{RAW}/{f}')['elements']:
            t = e.get('tags', {})
            if e['type'] == 'way' and t.get('ele') and t.get('name') == '川藏线':
                g0 = e['geometry'][len(e['geometry']) // 2]
                best = None
                for sec, S in geom['sections'].items():
                    d = np.hypot((np.array(S['lon']) - g0['lon']) * 96, (np.array(S['lat']) - g0['lat']) * 111)
                    i = int(d.argmin())
                    if d[i] < 1 and (best is None or d[i] < best[0]):
                        best = (d[i], sec, S['km'][i])
                if best:
                    S = geom['sections'][best[1]]
                    nm = t.get('bridge:name') or t.get('tunnel:name') or ''
                    if not any(x['name'] == nm and abs(x['km'] - best[2]) < 2 for x in ele):
                        ele.append(dict(name=nm, osm_ele=float(t['ele']), km=round(best[2], 2), sec=best[1],
                                        estimate=int(round(float(np.interp(best[2], S['_k'], S['_r']))))))
    out['checks']['osm_ele'] = ele
    # vegetation within 10 km of the Ya'an–Nyingchi line (1:1M vegetation map, 0.01° raster)
    from PIL import Image
    from scipy.spatial import cKDTree
    veg = np.array(Image.open(f'{DATA}/veg.png').convert('L'))
    vy, vx = np.mgrid[0:veg.shape[0], 0:veg.shape[1]]
    vlon = 90.3 + (vx + 0.5) * 0.01; vlat = 32.3 - (vy + 0.5) * 0.01
    Syl = geom['sections']['yl']
    kk = np.arange(0, Syl['km'][-1], 0.2)
    pl = np.interp(kk, Syl['km'], Syl['lon']); pa = np.interp(kk, Syl['km'], Syl['lat'])
    tr = cKDTree(np.c_[pl * 96.4, pa * 110.95])
    d, _ = tr.query(np.c_[vlon.ravel() * 96.4, vlat.ravel() * 110.95], distance_upper_bound=10)
    cls = veg.ravel()[np.isfinite(d)]
    cnt = np.bincount(cls, minlength=12)
    tot = cnt.sum()
    out['vegStats'] = [[int(c), round(float(cnt[c]) / tot * 100, 1)] for c in np.argsort(-cnt) if cnt[c] / tot >= 0.005]
    out['attribution'] = 'Line, stations, tunnels and bridges © OpenStreetMap contributors (ODbL); rail elevations estimated from Copernicus GLO-90.'
    dump_json(out, f'{DATA}/route.json')
    import json
    print(json.dumps({'checks': out['checks'], 'calibration': out['calibration']}, ensure_ascii=False, indent=1))
    print('tunnels', {k: v['src'] for k, v in out['tunnels'].items()})
    print('bridges', {k: (v['src'], v['rail'], v['ground']) for k, v in out['bridges'].items()})


if __name__ == '__main__':
    main()
