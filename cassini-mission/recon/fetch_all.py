"""Download everything from JPL Horizons into cache/ (run once; later steps read the cache)."""
import hz, datetime as dt
from concurrent.futures import ThreadPoolExecutor
EQ = 'BODY EQUATOR'
jobs = []
# --- cruise, heliocentric ecliptic J2000
jobs.append(('-82', '500@10', '1997-10-15 09:30', '2004-07-03 00:00', '6h', 'ECLIPTIC'))
FLY = {'299a': '1998-04-26 13:45', '299b': '1999-06-24 20:30', '399': '1999-08-18 03:28'}
def shift(s, h):
    d = dt.datetime.strptime(s, '%Y-%m-%d %H:%M') + dt.timedelta(hours=h); return d.strftime('%Y-%m-%d %H:%M')
for k, t in FLY.items():
    body = k[:3]
    for tgt in ('-82', body):
        jobs.append((tgt, '500@10', shift(t, -48), shift(t, 48), '10m', 'ECLIPTIC'))
        jobs.append((tgt, '500@10', shift(t, -4), shift(t, 4), '480', 'ECLIPTIC'))
for tgt in ('-82', '599'):
    jobs.append((tgt, '500@10', '2000-11-20 00:00', '2001-02-10 00:00', '1h', 'ECLIPTIC'))
# planets (for checking the analytic model)
for p in ('199', '299', '399', '499', '599', '699'):
    jobs.append((p, '500@10', '1997-10-01', '2004-08-01', '5d', 'ECLIPTIC'))
jobs.append(('2685;', '500@10', '2000-01-22 00:00', '2000-01-25 00:00', '1h', 'ECLIPTIC'))
# --- Saturn tour, Saturn ring plane (equator)
def quarters(a, b):
    out = []; y, m = a
    while (y, m) < b:
        y2, m2 = (y, m + 3) if m + 3 <= 12 else (y + 1, m + 3 - 12)
        out.append((f'{y}-{m:02d}-01 00:00', f'{y2}-{m2:02d}-01 00:00')); y, m = y2, m2
    return out
for s, e in quarters((2004, 4), (2017, 10)):
    if s >= '2017-10': break
    e = min(e, '2017-09-15 10:40')
    jobs.append(('-82', '500@699', s, e, '10m', EQ))
# moons: per-year blocks, step ~ P/24
MOONS = {'601': '1h', '602': '1h', '603': '1h', '604': '2h', '605': '4h', '606': '12h', '607': '12h', '608': '2d', '609': '4d'}
for m, st in MOONS.items():
    for y in range(2004, 2018):
        jobs.append((m, '500@699', f'{y}-01-01', f'{y+1}-01-01', st, EQ))
jobs.append(('10', '500@699', '2004-01-01', '2018-01-01', '10d', EQ))
jobs.append(('399', '500@699', '2004-01-01', '2018-01-01', '5d', EQ))
jobs.append(('-150', '500@699', '2004-12-25 02:10', '2005-01-14 09:00', '10m', EQ))
jobs.append(('-150', '500@606', '2005-01-14 06:00', '2005-01-14 09:10', '1m', EQ))
jobs.append(('-82', '500@606', '2005-01-14 06:00', '2005-01-14 14:00', '5m', EQ))

def run(j):
    try: a = hz.fetch(*j); return j, len(a), None
    except Exception as ex: return j, 0, str(ex)[-300:]
with ThreadPoolExecutor(4) as ex:
    for j, n, err in ex.map(run, jobs):
        if err: print('FAIL', j, err)
print('done', len(jobs))
