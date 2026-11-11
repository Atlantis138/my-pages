import numpy as np, json
from common import *
from moonmodel import moon_pos
C = np.load(os.path.join(CACHE, 'C10.npy'))
NAMES = {'601':'Mimas','602':'Enceladus','603':'Tethys','604':'Dione','605':'Rhea','606':'Titan','607':'Hyperion','608':'Iapetus','609':'Phoebe'}
cands = []
for m in NAMES:
    P = moon_pos(m, C[:,0]); d = np.linalg.norm(C[:,1:4]-P, axis=1)
    lim = 150000 if m == '606' else 100000
    idx = np.where((d[1:-1] < d[:-2]) & (d[1:-1] <= d[2:]) & (d[1:-1] < lim))[0] + 1
    for i in idx: cands.append((float(C[i,0]), m, float(d[i])))
    print(NAMES[m], len(idx), flush=True)
cands.sort(); json.dump(cands, open('cache/cands.json','w'))
r = np.linalg.norm(C[:,1:4],axis=1)
pk = np.where((r[1:-1]<r[:-2])&(r[1:-1]<=r[2:]))[0]+1
json.dump([[float(C[i,0]), float(r[i])] for i in pk], open('cache/peri10.json','w'))
print('periapses', len(pk), 'r<200000:', int((r[pk]<200000).sum()))
