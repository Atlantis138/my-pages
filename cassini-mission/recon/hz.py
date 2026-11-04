"""Fetch & cache JPL Horizons state vectors (km, km/s, UT).
plane: 'ECLIPTIC' (J2000 ecliptic) or 'BODY EQUATOR' (equator of the center body; for Saturn = ring plane)."""
import os, re, json, time, urllib.request, urllib.parse, numpy as np
CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'cache'); os.makedirs(CACHE, exist_ok=True)
API = 'https://ssd.jpl.nasa.gov/api/horizons.api'

def fetch(target, center, start, stop, step, plane='ECLIPTIC'):
    key = re.sub(r'[^A-Za-z0-9_.-]', '_', f'{target}_{center}_{start}_{stop}_{step}_{plane}')
    fn = os.path.join(CACHE, key + '.npy')
    if os.path.exists(fn): return np.load(fn)
    q = dict(format='json', COMMAND=f"'{target}'", EPHEM_TYPE='VECTORS', CENTER=f"'{center}'",
             START_TIME=f"'{start}'", STOP_TIME=f"'{stop}'", STEP_SIZE=f"'{step}'", REF_PLANE=f"'{plane}'",
             REF_SYSTEM='ICRF', VEC_TABLE='2', OUT_UNITS='KM-S', CSV_FORMAT='YES', TIME_TYPE='UT', OBJ_DATA='NO')
    url = API + '?' + urllib.parse.urlencode(q)
    for attempt in range(5):
        try:
            txt = json.load(urllib.request.urlopen(url, timeout=300))['result']; break
        except Exception as e:
            if attempt == 4: raise
            time.sleep(2 ** attempt)
    if '$$SOE' not in txt: raise RuntimeError(txt[-1500:])
    body = txt.split('$$SOE')[1].split('$$EOE')[0]
    rows = []
    for l in body.strip().splitlines():
        p = [s.strip() for s in l.split(',')]
        rows.append([float(p[0])] + [float(x) for x in p[2:8]])
    a = np.array(rows); np.save(fn, a); return a
