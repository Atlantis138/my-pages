"""Download rivers and water areas from OpenStreetMap via the Overpass API (data (c) OpenStreetMap contributors, ODbL).

Endpoint: env OVERPASS_URL (full .../interpreter URL), default https://overpass-api.de/api/interpreter
  e.g. OVERPASS_URL=https://api.overpass.ch/v1/<KEY>/interpreter python scripts/fetch_water.py
Writes raw/osm_rivers.json   waterway=river ways (with geometry) and waterway=river relations (members only)
       raw/osm_water.json    natural=water ways and multipolygons (with geometry), for lakes and wide rivers
"""
import os, sys, time, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BBOX = '27.8,90.3,32.3,104.5'
QUERIES = {
    'osm_rivers.json': f'''[out:json][timeout:600];
way["waterway"="river"]({BBOX});
out tags geom;
relation["waterway"="river"]({BBOX});
out tags;''',
    'osm_water.json': f'''[out:json][timeout:600];
(
  way["natural"="water"]({BBOX});
  relation["natural"="water"]({BBOX});
  way["waterway"="riverbank"]({BBOX});
);
out geom;''',
}


def main():
    url = os.environ.get('OVERPASS_URL', 'https://overpass-api.de/api/interpreter')
    os.makedirs(os.path.join(ROOT, 'raw'), exist_ok=True)
    for name, q in QUERIES.items():
        if len(sys.argv) > 1 and name not in sys.argv[1:]:
            continue
        body = urllib.parse.urlencode({'data': q}).encode()
        for attempt in range(4):
            try:
                with urllib.request.urlopen(urllib.request.Request(url, data=body), timeout=900) as r:
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
