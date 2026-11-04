"""Shared constants and helpers for the data pipeline."""
import json, math, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, 'raw')
DATA = os.path.join(ROOT, 'data')
TILES = os.path.join(ROOT, 'tiles')

BOX = (90.3, 27.8, 104.5, 32.3)          # lon0, lat0, lon1, lat1 (map extent)
CORRIDOR_KM = 15.0                       # fine terrain on each side of the line

# Terrain pyramid. Tiles are aligned to whole degrees and carry one extra sample on every side
# (so normals can be computed across tile edges). Heights: R*256+G-1000 metres (1 m steps).
Z1 = dict(size=1.0, n=200)               # 1° tiles, 0.005° (~500 m) spacing
Z2 = dict(size=0.25, n=300)              # 0.25° tiles, 3" (~90 m) spacing — Copernicus native
Z2_150 = dict(size=0.25, n=180)          # 0.25° tiles, 5" (~150 m) spacing (lighter variant)
ENC_OFFSET = 1000


def hav(lon1, lat1, lon2, lat2):
    r = 6371.0088
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lon2 - lon1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(h))


def load_json(path):
    with open(path, encoding='utf8') as f:
        return json.load(f)


def dump_json(obj, path, compact=True):
    with open(path, 'w', encoding='utf8') as f:
        if compact:
            json.dump(obj, f, ensure_ascii=False, separators=(',', ':'))
        else:
            json.dump(obj, f, ensure_ascii=False, indent=1)
