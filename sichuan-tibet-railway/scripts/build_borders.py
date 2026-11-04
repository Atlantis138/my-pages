"""International boundaries in the map box from Natural Earth 1:10m (public domain).

Downloads ne_10m_admin_0_boundary_lines_land and ..._disputed_areas (GeoJSON) into raw/ne/ and writes
data/borders.json {nat:[[lon,lat,...]], lac:[[...]]}:
  nat  China's boundary as China claims it: China–Bhutan and China–Myanmar boundaries plus the
       "Chinese claim" lines south of the McMahon Line
  lac  the line actually separating Chinese and Indian administration east of Bhutan (McMahon Line),
       drawn faintly as 实际控制线
"""
import json, os, urllib.request
from shapely.geometry import shape, box
from shapely.ops import linemerge, unary_union
from common import RAW, DATA, BOX, dump_json

BASE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
FILES = ['ne_10m_admin_0_boundary_lines_land', 'ne_10m_admin_0_boundary_lines_disputed_areas']


def load(name):
    path = f'{RAW}/ne/{name}.geojson'
    if not os.path.exists(path):
        os.makedirs(f'{RAW}/ne', exist_ok=True)
        urllib.request.urlretrieve(BASE + name + '.geojson', path)
    with open(path, encoding='utf8') as f:
        return json.load(f)['features']


def main():
    clip = box(*BOX)
    nat, lac = [], []
    for ft in load(FILES[0]):
        p, g = ft['properties'], shape(ft['geometry'])
        if not g.intersects(clip): continue
        pair = {p.get('ADM0_LEFT'), p.get('ADM0_RIGHT')}
        if 'China' not in pair: continue
        if p.get('FCLASS_CN') == 'Unrecognized':
            if 'India' in pair: lac.append(g)
            continue
        nat.append(g)
    for ft in load(FILES[1]):
        p, g = ft['properties'], shape(ft['geometry'])
        if g.intersects(clip) and p.get('FEATURECLA') == 'Claim boundary' and 'Chinese' in (p.get('NAME') or ''):
            nat.append(g)

    def flat(gs):
        m = linemerge(unary_union(gs).intersection(clip))
        out = []
        for ln in getattr(m, 'geoms', [m]):
            if ln.is_empty or ln.geom_type != 'LineString' or ln.length < 0.02: continue
            out.append([round(v, 3) for xy in ln.simplify(0.002).coords for v in xy])
        return out
    res = {'nat': flat(nat), 'lac': flat(lac)}
    print({k: (len(v), sum(len(x) // 2 for x in v)) for k, v in res.items()})
    dump_json(res, f'{DATA}/borders.json')


if __name__ == '__main__':
    main()
