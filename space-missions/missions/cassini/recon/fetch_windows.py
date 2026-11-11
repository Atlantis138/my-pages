"""1-minute Horizons windows around every close moon flyby and every low periapsis."""
import json, hz, datetime as dt
from concurrent.futures import ThreadPoolExecutor
EQ = 'BODY EQUATOR'
def cal(jd, dh=0):
    d = dt.datetime(2000, 1, 1, 12) + dt.timedelta(days=jd - 2451545.0, hours=dh)
    d = d.replace(second=0, microsecond=0); return d.strftime('%Y-%m-%d %H:%M')
cands = json.load(open('cache/cands.json')); peri = json.load(open('cache/peri10.json'))
jobs = set()
for t, m, d in cands:
    if m == '609' or (m != '606' and d > 100000): continue
    h = 3 if d > 20000 else 2
    s, e = cal(t, -h), cal(t, h)
    jobs.add(('-82', '500@699', s, e, '1m', EQ)); jobs.add((m, '500@699', s, e, '1m', EQ))
# Phoebe flyby (approach; Phoebe not in the Saturn-frame model accurately enough)
jobs.add(('-82', '500@699', '2004-06-11 17:30', '2004-06-11 21:30', '1m', EQ)); jobs.add(('609', '500@699', '2004-06-11 17:30', '2004-06-11 21:30', '1m', EQ))
for t, r in peri:
    if r < 200000: jobs.add(('-82', '500@699', cal(t, -2), cal(t, 2), '1m', EQ))
jobs = sorted(jobs); print(len(jobs), flush=True)
def run(j):
    try: hz.fetch(*j); return None
    except Exception as ex: return (j, str(ex)[-200:])
with ThreadPoolExecutor(4) as ex:
    for r in ex.map(run, jobs):
        if r: print('FAIL', r, flush=True)
print('done')
