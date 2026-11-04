"""Download railway data from OpenStreetMap via the Overpass API (data (c) OpenStreetMap contributors, ODbL).

Endpoint: env OVERPASS_URL (full .../interpreter URL), default https://overpass-api.de/api/interpreter
  e.g. OVERPASS_URL=https://api.overpass.ch/v1/<KEY>/interpreter python scripts/fetch_osm.py
Writes raw/osm_main.json (the corridor query) and raw/osm_extra.json (stations under construction,
and the Lhasa-Rikaze line between Xierong and Lhasa, which is not named "川藏").
"""
import os, sys, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BBOX = '27.8,90.3,32.3,104.5'
QUERIES = {
    'osm_main.json': f'''[out:json][timeout:180];
(
  way["railway"]["name"~"川藏|拉林|成雅|成蒲"]({BBOX});
  way["construction:railway"]({BBOX});
  node["railway"="station"]({BBOX});
);
out geom;''',
    'osm_extra.json': f'''[out:json][timeout:180];
(
  node["construction:railway"~"station|halt"]({BBOX});
  node["railway"="construction"]["construction"~"station|halt"]({BBOX});
  way["railway"]["name"~"拉日|青藏"](29.3,90.8,29.75,91.2);
  node["railway"="station"]["name"~"拉萨"](29.3,90.8,29.75,91.2);
);
out geom;''',
}

def main():
    url = os.environ.get('OVERPASS_URL', 'https://overpass-api.de/api/interpreter')
    os.makedirs(os.path.join(ROOT, 'raw'), exist_ok=True)
    for name, q in QUERIES.items():
        body = urllib.parse.urlencode({'data': q}).encode()
        for attempt in range(4):
            try:
                with urllib.request.urlopen(urllib.request.Request(url, data=body), timeout=300) as r:
                    data = r.read()
                break
            except Exception as e:  # network hiccup or rate limit
                print(f'{name}: {e}; retrying', file=sys.stderr); time.sleep(2 ** (attempt + 1))
        else:
            sys.exit(f'{name}: failed')
        open(os.path.join(ROOT, 'raw', name), 'wb').write(data)
        print(name, len(data), 'bytes')

if __name__ == '__main__':
    main()
