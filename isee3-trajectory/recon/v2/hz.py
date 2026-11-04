"""Fetch & cache JPL Horizons vectors (ecliptic J2000, km, UT)."""
import os, json, urllib.request, urllib.parse, numpy as np
CACHE=os.path.join(os.path.dirname(__file__),'cache'); os.makedirs(CACHE,exist_ok=True)
API='https://ssd.jpl.nasa.gov/api/horizons.api'
def fetch(target,center,start,stop,step):
    import re; fn=os.path.join(CACHE,re.sub(r'[^A-Za-z0-9_.-]','_',f'{target}_{center}_{start}_{stop}_{step}')+'.npy')
    if os.path.exists(fn): return np.load(fn)
    q=dict(format='json',COMMAND=f"'{target}'",EPHEM_TYPE='VECTORS',CENTER=f"'{center}'",START_TIME=f"'{start}'",
           STOP_TIME=f"'{stop}'",STEP_SIZE=f"'{step}'",REF_PLANE='ECLIPTIC',REF_SYSTEM='ICRF',VEC_TABLE='2',
           OUT_UNITS='KM-S',CSV_FORMAT='YES',TIME_TYPE='UT',OBJ_DATA='NO')
    url=API+'?'+urllib.parse.urlencode(q)
    txt=json.load(urllib.request.urlopen(url,timeout=120))['result']
    body=txt.split('$$SOE')[1].split('$$EOE')[0]
    rows=[]
    for l in body.strip().splitlines():
        p=[s.strip() for s in l.split(',')]
        rows.append([float(p[0])]+[float(x) for x in p[2:8]])
    a=np.array(rows); np.save(fn,a); return a
