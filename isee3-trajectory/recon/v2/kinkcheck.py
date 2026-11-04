"""Find kinks in the exported Earth-frame track: compare the track's numerical acceleration
(inertial, from a uniform resample of the final positions) with the gravity model."""
import json
from dyn2 import *
E=np.array(json.load(open('../track.json'))['E']).reshape(-1,5)
t=E[:,0]+2443509.5
from scipy.interpolate import interp1d
f=interp1d(t,E[:,1:4],axis=0)
def to_inertial(tt,p):
    x,y,z=gse_basis(tt); p=p*1e5
    return -p[:,0:1]*x-p[:,1:2]*y+p[:,2:3]*z
h=0.1; ts=np.arange(t[0]+1,t[-1]-1,h)
R=to_inertial(ts,f(ts))
acc=(R[2:]-2*R[1:-1]+R[:-2])/h**2
grav=np.array([accel_grad(x,r)[0] for x,r in zip(ts[1:-1],R[1:-1])])
res=np.linalg.norm(acc-grav,axis=1)/86400**2*1e6  # mm/s^2
dE=np.linalg.norm(R[1:-1],axis=1)
ok=dE>1.2e5   # near-Earth/Moon curvature is under-resolved by h=0.1 d
print('residual accel (mm/s²) pct 50/99/99.9:',np.percentile(res[ok],[50,99,99.9]).round(3))
idx=np.argsort(-res*ok)[:25]
for i in sorted(idx): print(iso(ts[i+1]),'%.2f mm/s²'%res[i],'r %.0f km'%dE[i])
