"""One-off: split the single-file page (v1) into data files under data/.

Usage: python scripts/extract_legacy.py OLD_INDEX_HTML
Writes data/atlas.json, data/dem5k.png (284x90, R*256+G-1000 m), data/veg.png, data/geo.png,
and keeps the v1 sketch route in raw/legacy_route.json for reference.
"""
import base64, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

def main(src):
    html = open(src, encoding='utf8').read()
    data = json.loads(re.search(r'<script id="data" type="application/json">(.*?)</script>', html, re.S).group(1))
    b64 = dict(re.findall(r'([A-Z]+)_B64="([^"]+)"', html))
    os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
    os.makedirs(os.path.join(ROOT, 'raw'), exist_ok=True)
    import numpy as np
    from PIL import Image
    v = (np.frombuffer(base64.b64decode(b64['DEM']), '<i2').astype(int) + 1000).reshape(data['dem']['ny'], data['dem']['nx'])
    rgb = np.zeros(v.shape + (3,), np.uint8); rgb[..., 0] = v >> 8; rgb[..., 1] = v & 255
    Image.fromarray(rgb, 'RGB').save(os.path.join(ROOT, 'data', 'dem5k.png'), optimize=True)
    open(os.path.join(ROOT, 'data', 'veg.png'), 'wb').write(base64.b64decode(b64['VEG']))
    open(os.path.join(ROOT, 'data', 'geo.png'), 'wb').write(base64.b64decode(b64['GEO']))
    json.dump({'route': data['route'], 'stations': data['stations'], 'bridges': data['bridges'],
               'tunnels': data['tunnels'], 'rivers': data['rivers']},
              open(os.path.join(ROOT, 'raw', 'legacy.json'), 'w'), ensure_ascii=False)
    json.dump(data, open(os.path.join(ROOT, 'data', 'atlas.json'), 'w'), ensure_ascii=False, separators=(',', ':'))

if __name__ == '__main__':
    main(sys.argv[1])
