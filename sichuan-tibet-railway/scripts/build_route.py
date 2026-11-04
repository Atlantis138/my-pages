"""Stitch OSM railway ways into one continuous line per section (cy 成雅, yl 雅林, ll 拉林).

Input : raw/osm_main.json, raw/osm_extra.json (scripts/fetch_osm.py), data/atlas.json (station list)
Output: raw/route_geom.json — full-resolution polylines with per-edge attributes, consumed by
        build_terrain.py (corridor) and build_profile.py (rail elevations, final data/route.json).

Method: every OSM way becomes graph edges between its nodes; stations of each section are routed
one after another with Dijkstra. Breaks between unconnected ways (< 3 km) are bridged with
"gap" edges, which are reported and later drawn as rough.
"""
import heapq, math, sys
from collections import defaultdict
import numpy as np
from scipy.spatial import cKDTree
from common import RAW, DATA, hav, load_json, dump_json

LINE_NAMES = {'川藏线', '川藏铁路', '西环成雅联络线', '拉日线', '青藏线'}
OSM_STATION_ALIAS = {'邦达': '邦达机场'}
KX, KY = 111.32 * math.cos(math.radians(30)), 110.95
GAP_KM = 3.0


def load_osm():
    els = {}
    for f in ('osm_main.json', 'osm_extra.json'):
        for e in load_json(f'{RAW}/{f}')['elements']:
            els[(e['type'], e['id'])] = e
    ways, stations = [], defaultdict(list)
    for (typ, _), e in els.items():
        t = e.get('tags', {})
        if typ == 'way':
            if t.get('name') in LINE_NAMES and t.get('railway') in ('rail', 'construction'):
                ways.append(e)
        else:
            is_st = t.get('railway') == 'station' and t.get('station') != 'subway'
            is_cons = 'station' in (t.get('construction:railway', ''), t.get('construction', '') if t.get('railway') == 'construction' else '')
            if (is_st or is_cons) and t.get('name'):
                stations[t['name']].append((e['lon'], e['lat'], 'construction' if is_cons else 'station', t.get('note', '')))
    return ways, stations


def attrs(t):
    tun = t.get('tunnel') not in (None, 'no')
    bri = t.get('bridge') not in (None, 'no')
    kind = 2 if tun else 1 if bri else 0
    name = t.get('tunnel:name') if tun else t.get('bridge:name') if bri else None
    note = t.get('note', '')
    rough = 'preliminary' in note or 'rough' in note
    return kind, name, rough, t


def build_graph(ways):
    coord, adj = {}, defaultdict(list)
    winfo = []
    for w in ways:
        wi = len(winfo)
        winfo.append(attrs(w['tags']))
        ids, geo = w['nodes'], w['geometry']
        for nid, g in zip(ids, geo):
            coord[nid] = (g['lon'], g['lat'])
        for a, b in zip(ids, ids[1:]):
            d = hav(*coord[a], *coord[b])
            adj[a].append((b, d, wi)); adj[b].append((a, d, wi))
    # connected components
    comp, cid = {}, 0
    for n in coord:
        if n in comp: continue
        stack = [n]; comp[n] = cid
        while stack:
            u = stack.pop()
            for v, _, _ in adj[u]:
                if v not in comp: comp[v] = cid; stack.append(v)
        cid += 1
    ids = list(coord)
    xy = np.array([(coord[i][0] * KX, coord[i][1] * KY) for i in ids])
    tree = cKDTree(xy)
    gaps = 0
    for i, n in enumerate(ids):
        if len(adj[n]) != 1: continue
        cand = [(np.hypot(*(xy[j] - xy[i])), ids[j]) for j in tree.query_ball_point(xy[i], GAP_KM) if comp[ids[j]] != comp[n]]
        if cand:
            d, m = min(cand)
            adj[n].append((m, d * 3 + 0.5, -1)); adj[m].append((n, d * 3 + 0.5, -1)); gaps += 1
    # parallel tracks (double track, twin-bore tunnels) are often separate ways joined only at a few
    # crossovers; allow hopping between nodes < 80 m apart so the route never detours to a crossover
    hops = 0
    for i, j in tree.query_pairs(0.08):
        a, b = ids[i], ids[j]
        if any(v == b for v, _, _ in adj[a]): continue
        d = float(np.hypot(*(xy[i] - xy[j])))
        adj[a].append((b, d + 0.02, -2)); adj[b].append((a, d + 0.02, -2)); hops += 1
    print(f'graph: {len(coord)} nodes, {cid} components, {gaps} gap links, {hops} track hops')
    return coord, adj, winfo, ids, tree, xy


def fill_hops(edges):
    """Track-hop edges (-2) take the attributes of the previous real edge."""
    out, last = [], None
    for e in edges:
        if e == -2:
            e = last if last is not None else next((x for x in edges if x >= 0), -1)
        out.append(e)
        if e >= 0: last = e
    return out


def dijkstra(adj, s, t):
    dist, prev = {s: 0.0}, {}
    pq = [(0.0, s)]
    while pq:
        d, u = heapq.heappop(pq)
        if u == t: break
        if d > dist[u]: continue
        for v, w, wi in adj[u]:
            nd = d + w
            if nd < dist.get(v, 1e18):
                dist[v] = nd; prev[v] = (u, wi); heapq.heappush(pq, (nd, v))
    if t not in prev and s != t:
        raise RuntimeError('no path')
    path, edges = [t], []
    while path[-1] != s:
        u, wi = prev[path[-1]]
        edges.append(wi); path.append(u)
    return path[::-1], edges[::-1]


def simplify(pts, tol_km):
    """Douglas-Peucker on (x,y) km coords; returns kept indices."""
    keep = np.zeros(len(pts), bool); keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        a, b = stack.pop()
        if b <= a + 1: continue
        p, q = pts[a], pts[b]
        seg = q - p; L = np.hypot(*seg)
        r = pts[a + 1:b] - p
        d = np.abs(seg[0] * r[:, 1] - seg[1] * r[:, 0]) / L if L > 1e-9 else np.hypot(r[:, 0], r[:, 1])
        k = int(np.argmax(d))
        if d[k] > tol_km:
            m = a + 1 + k; keep[m] = True; stack += [(a, m), (m, b)]
    return np.nonzero(keep)[0]


def main():
    atlas = load_json(f'{DATA}/atlas.json')
    ways, osm_st = load_osm()
    coord, adj, winfo, ids, tree, xy = build_graph(ways)

    legacy = {s['s'] + s['n']: s for s in atlas['stations']}
    order = {
        'cy': ['cy成都西', 'yl雅安'],
        'yl': [k for k in legacy if k.startswith('yl')],
        'll': ['yl林芝'] + [k for k in legacy if k.startswith('ll')],
    }
    st_out, sections, report = {}, {}, []
    for sec, keys in order.items():
        snapped = []
        for k in keys:
            s = legacy[k]; nm = OSM_STATION_ALIAS.get(s['n'], s['n'])
            cands = osm_st.get(nm, [])
            if cands:
                lon, lat, status, note = min(cands, key=lambda c: hav(c[0], c[1], s['lon'], s['lat']))
                src = 'osm'
            else:
                lon, lat, status, note, src = s['lon'], s['lat'], None, '', 'sketch'
            d, j = tree.query((lon * KX, lat * KY))
            snapped.append((k, ids[j], lon, lat, src, d, status, note))
            if d > 1.5: report.append(f'{k}: station {d:.1f} km from track')
        path, edges = [snapped[0][1]], []
        for a, b in zip(snapped, snapped[1:]):
            p, e = dijkstra(adj, a[1], b[1])
            path += p[1:]; edges += e
        pts = [coord[n] for n in path]
        cum = [0.0]
        for (a0, b0), (a1, b1) in zip(pts, pts[1:]):
            cum.append(cum[-1] + hav(a0, b0, a1, b1))
        idx_of = {}
        for i, n in enumerate(path):
            idx_of.setdefault(n, i)
        # stations: km along the stitched line
        last = 0
        for k, nid, lon, lat, src, d, status, note in snapped:
            i = next(i for i in range(last, len(path)) if path[i] == nid); last = i
            name = k[2:]
            if sec != 'll' or k != 'yl林芝':
                if not (sec == 'cy' and k == 'yl雅安'):
                    st_out[k] = dict(n=name, s=k[:2], lon=round(lon, 5), lat=round(lat, 5), km=round(cum[i], 2), src=src,
                                     status=status, osm_note=note, off_km=round(d, 2))
        # per-edge attributes
        edges = fill_hops(edges)
        kind = [0 if e < 0 else winfo[e][0] for e in edges]
        name = [None if e < 0 else winfo[e][1] for e in edges]
        rough = [1 if e < 0 or winfo[e][2] else 0 for e in edges]
        gap = [1 if e < 0 else 0 for e in edges]
        sections[sec] = dict(pts=pts, cum=cum, kind=kind, name=name, rough=rough, gap=gap)
        print(f'{sec}: {len(pts)} pts, {cum[-1]:.1f} km, gaps {sum(gap)}, rough {sum(r * (cum[i + 1] - cum[i]) for i, r in enumerate(rough)):.1f} km, '
              f'tunnel {sum(cum[i + 1] - cum[i] for i, k in enumerate(kind) if k == 2):.1f} km, bridge {sum(cum[i + 1] - cum[i] for i, k in enumerate(kind) if k == 1):.1f} km')

    # simplify: keep every attribute change, DP 6 m within uniform runs
    for sec, S in sections.items():
        pts = np.array([(p[0] * KX, p[1] * KY) for p in S['pts']])
        sig = list(zip(S['kind'], S['name'], S['rough'], S['gap']))
        keep = {0, len(pts) - 1}
        i = 0
        while i < len(sig):
            j = i
            while j + 1 < len(sig) and sig[j + 1] == sig[i]: j += 1
            a, b = i, j + 1
            keep.update(a + k for k in simplify(pts[a:b + 1], 0.006))
            i = j + 1
        ki = sorted(keep)
        S['keep'] = ki
    out = {'sections': {}, 'stations': st_out, 'report': report}
    for sec, S in sections.items():
        ki = S['keep']
        out['sections'][sec] = dict(
            lon=[round(S['pts'][i][0], 5) for i in ki], lat=[round(S['pts'][i][1], 5) for i in ki],
            km=[round(S['cum'][i], 3) for i in ki],
            # attributes of the edge that starts at each kept vertex
            kind=[S['kind'][i] if i < len(S['kind']) else 0 for i in ki],
            name=[S['name'][i] if i < len(S['name']) else None for i in ki],
            rough=[S['rough'][i] if i < len(S['rough']) else 0 for i in ki],
            gap=[S['gap'][i] if i < len(S['gap']) else 0 for i in ki])
        print(sec, 'simplified', len(S['pts']), '->', len(ki))
    for r in report: print('  !', r)
    dump_json(out, f'{RAW}/route_geom.json')


if __name__ == '__main__':
    main()
