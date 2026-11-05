"""data/route.json → export/sichuan-tibet-railway.kml，供 Google Earth 导入。

线位按 route.json 的逐段属性（a 串：0 地面、1 桥、2 隧道，≥3 为 OSM 标注 preliminary 的粗略段）切分：
  地面段  贴地（clampToGround），避免与 Google Earth 自身地形打架
  桥梁    用推算轨面高程（absolute）并向下 extrude，形成桥墩幕墙，可看出桥高
  隧道    默认画为地表投影（贴地、半透明）；另有一层“山体内轨面”用推算高程，默认关闭
车站、重点桥梁与重点隧道为带说明的地标。
"""
import json, os
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
D = json.load(open(os.path.join(ROOT, 'data', 'route.json'), encoding='utf-8'))

SEC_NAME = {'cy': '成雅段（成都—雅安，已通车）', 'yl': '雅林段（雅安—林芝，在建）', 'll': '拉林段（拉萨—林芝，已通车）'}
# KML 颜色为 aabbggrr
SEC_COL = {'cy': '333333', 'yl': '2b45d9', 'll': '333333'}
BRIDGE = '26a5e0'


def runs_of(s):
    S = D['sections'][s]
    n = len(S['km'])
    kind = [int(c) % 3 for c in S['a']]
    rough = [int(c) >= 3 for c in S['a']]
    out, i = [], 0
    while i < n - 1:
        j = i
        while j + 1 < n - 1 and kind[j + 1] == kind[i] and rough[j + 1] == rough[i]:
            j += 1
        out.append((kind[i], rough[i], i, j + 1))
        i = j + 1
    return S, out


def name_for(s, kind, k0, k1):
    best, ov = None, 0.0
    for r in D['runs']:
        if r[0] != s or r[1] != kind or not r[4]:
            continue
        o = min(k1, r[3]) - max(k0, r[2])
        if o > ov:
            best, ov = r[4], o
    return best


STEP = D['profile']['step']


def prof(s, key, k):
    a = D['profile'][s][key]
    x = min(max(k / STEP, 0), len(a) - 1)
    i = min(int(x), len(a) - 2)
    return a[i] + (x - i) * (a[i + 1] - a[i])


def coords(S, i0, i1, alt, s):
    """折线顶点之间按剖面步长（0.2 km）加密，高程取推算轨面剖面，使桥面与隧道纵坡贴合。"""
    pts = []
    for i in range(i0, i1 + 1):
        ks = [S['km'][i]]
        if i < i1:
            a, b = S['km'][i], S['km'][i + 1]
            k = (int(a / STEP) + 1) * STEP
            while alt and k < b - 1e-6:
                ks.append(k); k += STEP
        for k in ks:
            t = 0 if i == i1 else (k - S['km'][i]) / ((S['km'][i + 1] - S['km'][i]) or 1)
            j = min(i + 1, i1)
            lon = S['lon'][i] + t * (S['lon'][j] - S['lon'][i])
            lat = S['lat'][i] + t * (S['lat'][j] - S['lat'][i])
            z = prof(s, 'r', k) if alt else 0
            pts.append(f"{lon:.5f},{lat:.5f},{z:.0f}")
    return ' '.join(pts)


def span_max(s, k0, k1, f):
    ks = [k0 + (k1 - k0) * q / 50 for q in range(51)]
    return max(f(prof(s, 'r', k), prof(s, 'g', k)) for k in ks)


def style(id_, col, width, alpha='ff', poly=None):
    p = f'<PolyStyle><color>{poly}</color></PolyStyle>' if poly else ''
    return f'<Style id="{id_}"><LineStyle><color>{alpha}{col}</color><width>{width}</width></LineStyle>{p}</Style>'


def line(name, sty, S, s, i0, i1, mode, desc='', extrude=False, visible=True):
    alt = mode == 'absolute'
    return (f'<Placemark><name>{escape(name)}</name>'
            + (f'<description>{escape(desc)}</description>' if desc else '')
            + ('' if visible else '<visibility>0</visibility>')
            + f'<styleUrl>#{sty}</styleUrl><LineString>'
            + ('<extrude>1</extrude>' if extrude else '')
            + ('<tessellate>1</tessellate>' if not alt else '')
            + f'<altitudeMode>{mode}</altitudeMode><coordinates>{coords(S, i0, i1, alt, s)}</coordinates>'
            + '</LineString></Placemark>')


def point(name, sty, lon, lat, desc):
    return (f'<Placemark><name>{escape(name)}</name><description>{escape(desc)}</description>'
            f'<styleUrl>#{sty}</styleUrl><Point><coordinates>{lon:.5f},{lat:.5f},0</coordinates></Point></Placemark>')


def folder(name, items, visible=True, open_=False):
    return (f'<Folder><name>{escape(name)}</name>' + ('' if visible else '<visibility>0</visibility>')
            + ('<open>1</open>' if open_ else '') + ''.join(items) + '</Folder>')


styles = [
    '<Style id="sta"><IconStyle><scale>0.9</scale><Icon><href>http://maps.google.com/mapfiles/kml/shapes/rail.png</href></Icon></IconStyle><LabelStyle><scale>0.9</scale></LabelStyle></Style>',
    '<Style id="poi"><IconStyle><scale>0.8</scale><Icon><href>http://maps.google.com/mapfiles/kml/shapes/star.png</href></Icon></IconStyle><LabelStyle><scale>0.8</scale></LabelStyle></Style>',
    style('br', BRIDGE, 5, poly='7f26a5e0'),
]
for s, c in SEC_COL.items():
    styles += [style(f'{s}_g', c, 4), style(f'{s}_r', c, 3, alpha='aa'),
               style(f'{s}_t', c, 3, alpha='66'), style(f'{s}_ti', c, 3, alpha='dd')]

secs = []
for s in ('cy', 'yl', 'll'):
    S, runs = runs_of(s)
    grade, rough, bridges, tun, tun_in = [], [], [], [], []
    for kind, rg, i0, i1 in runs:
        k0, k1 = S['km'][i0], S['km'][i1]
        span = f'K{k0:.1f}–K{k1:.1f}（{k1 - k0:.2f} km）'
        if kind == 0:
            (rough if rg else grade).append(line(span, f'{s}_r' if rg else f'{s}_g', S, s, i0, i1, 'clampToGround',
                                                 'OSM 标注为 preliminary 的粗略线位' if rg else ''))
        elif kind == 1:
            nm = name_for(s, 1, k0, k1) or '桥梁'
            hi = span_max(s, k0, k1, lambda r, g: r - g)
            bridges.append(line(nm, 'br', S, s, i0, i1, 'absolute',
                                f'{span}；推算轨面 {prof(s, "r", k0):.0f}–{prof(s, "r", k1):.0f} m，最大桥高约 {hi:.0f} m', extrude=True))
        else:
            nm = name_for(s, 2, k0, k1) or '隧道'
            cover = span_max(s, k0, k1, lambda r, g: g - r)
            desc = f'{span}；推算轨面 {prof(s, "r", k0):.0f}–{prof(s, "r", k1):.0f} m，最大埋深约 {cover:.0f} m'
            tun.append(line(nm, f'{s}_t', S, s, i0, i1, 'clampToGround', desc))
            tun_in.append(line(nm, f'{s}_ti', S, s, i0, i1, 'absolute', desc, visible=False))
    items = [folder('地面段', grade)]
    if rough:
        items.append(folder('粗略线位（OSM preliminary）', rough))
    items += [folder('桥梁（推算轨面高程，带桥墩幕墙）', bridges),
              folder('隧道（地表投影）', tun),
              folder('隧道（山体内推算轨面，从地下才看得到）', tun_in, visible=False)]
    secs.append(folder(SEC_NAME[s], items, open_=True))

sta = [point(v['n'], 'sta', v['lon'], v['lat'],
             f"{SEC_NAME[v['s']].split('（')[0]} K{v['km']:.1f}；地面 {v['ground']} m，推算轨面 {v['rail']} m")
       for v in D['stations'].values()]
poi = [point(k, 'poi', v['lon'], v['lat'], f"推算轨面 {v['rail']} m，桥下地面 {v['ground']} m，桥高约 {v['rail'] - v['ground']} m")
       for k, v in D['bridges'].items()]

yl = D['sections']['yl']
def at_km(k):
    km = yl['km']
    for i in range(len(km) - 1):
        if km[i] <= k <= km[i + 1]:
            t = (k - km[i]) / ((km[i + 1] - km[i]) or 1)
            return yl['lon'][i] + t * (yl['lon'][i + 1] - yl['lon'][i]), yl['lat'][i] + t * (yl['lat'][i + 1] - yl['lat'][i])
    return yl['lon'][-1], yl['lat'][-1]
tpoi = []
for k, v in D['tunnels'].items():
    lon, lat = at_km((v['k0'] + v['k1']) / 2)
    note = '' if v['src'] == 'osm' else '（OSM 无对应线位，位置为示意）'
    tpoi.append(point(k, 'poi', lon, lat, f"雅林段 K{v['k0']:.1f}–K{v['k1']:.1f}，长约 {v['k1'] - v['k0']:.1f} km{note}"))

doc = ('<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document>'
       '<name>川藏铁路</name><open>1</open>'
       f'<description>{escape(D["attribution"] + " 轨面高程为按地形与 30‰ 坡度上限推算，并非设计值。")}</description>'
       + ''.join(styles) + ''.join(secs)
       + folder('车站', sta) + folder('重点桥梁', poi) + folder('重点隧道', tpoi)
       + '</Document></kml>\n')

out = os.path.join(ROOT, 'export', 'sichuan-tibet-railway.kml')
os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, 'w', encoding='utf-8').write(doc)
print(out, f'{len(doc.encode()) / 1024:.0f} KB')
