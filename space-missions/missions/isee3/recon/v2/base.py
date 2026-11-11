"""Shared ephemerides & frames for the v2 reconstruction.
Inertial frame here = geocentric (or heliocentric) ecliptic & equinox OF DATE, km, time = JD (UT)."""
import os, numpy as np
from numpy import radians
from scipy.interpolate import CubicSpline
from hz import fetch
HERE=os.path.dirname(os.path.abspath(__file__))
DATA=os.path.join(HERE,'..','data')
J78=2443509.5                     # 1978-01-01 00:00 UT
def jd_ydoy(y,doy,sec):
    y=y+1900 if y<100 else y
    from datetime import datetime, timezone, timedelta
    d=datetime(y,1,1,tzinfo=timezone.utc)+timedelta(days=doy-1,seconds=sec)
    return d.timestamp()/86400+2440587.5
def jd_iso(s):
    from datetime import datetime, timezone
    return datetime.fromisoformat(s).replace(tzinfo=timezone.utc).timestamp()/86400+2440587.5
def iso(jd,fmt='%Y-%m-%d %H:%M'):
    from datetime import datetime, timezone
    return datetime.fromtimestamp((jd-2440587.5)*86400,timezone.utc).strftime(fmt)
def prec_angle(jd):
    T=(jd-2451545.0)/36525; return radians((5028.796195*T+1.1054348*T*T)/3600)
def to_date(jd,v):
    """J2000 ecliptic -> ecliptic of date (rotation in longitude by general precession). v: (...,3)"""
    p=prec_angle(np.asarray(jd,float)).reshape(-1); c,s=np.cos(p),np.sin(p); v=np.atleast_2d(np.asarray(v,float))
    return np.stack([c*v[...,0]-s*v[...,1], s*v[...,0]+c*v[...,1], v[...,2]],-1)
def _hz_series(tg,ctr,chunks,step):
    A=np.concatenate([fetch(tg,ctr,a,b,step) for a,b in chunks]); _,i=np.unique(A[:,0],return_index=True); A=A[i]
    return A[:,0], to_date(A[:,0][:,None],A[:,1:4]), to_date(A[:,0][:,None],A[:,4:7])*86400
CH=[('1978-08-01','1981-01-01'),('1981-01-01','1984-01-01'),('1984-01-01','1987-03-01')]
_tm,_pm,_vm=_hz_series('301','500@399',CH,'3h'); MOON=CubicSpline(_tm,_pm,axis=0)
_ts,_ps,_vs=_hz_series('10','500@399',CH,'3h'); SUN=CubicSpline(_ts,_ps,axis=0)
def moon(jd): return MOON(jd)
def sun(jd): return SUN(jd)
ABER=np.radians(20.5/3600)   # empirical: GSE X axis sits ~20.5" (one aberration constant) ahead of the geometric Sun; fixed by LS5 consistency
# The NSSDC file's GSE frame is rotated about the ecliptic pole for the first 7–12 days of every year
# (by -0.246°, i.e. a quarter-day of solar motion; +0.77° in 1981 and 1985): a day-count slip in the
# original processing. Intervals and angles measured by yearfix.py against ballistic arcs fitted to late December.
YEARFIX=[(2443874.486730324, 2443887.7374247685, -0.24638167250566312), (2444239.4850925924, 2444251.5522280093, -0.24957127148246627), (2444605.4961226853, 2444615.5604571756, 0.773061596134383), (2444970.4887037035, 2444979.4974131947, -0.2479072445401016), (2445335.505572917, 2445343.5182407405, -0.24806898983186443), (2445700.7830671296, 2445707.5152083333, -0.24549011458782388), (2446066.2689872687, 2446078.2861516206, 0.7703884835434565), (2446431.955792824, 2446440.6685300926, -0.2466159670606629), (2446797.52193287, 2446807.527789352, -0.24435102904979544)]
def data_frame_fix(jd):
    jd=np.atleast_1d(jd); a=np.zeros(len(jd))
    for t0,t1,off in YEARFIX: a[(jd>t0)&(jd<t1)]=-np.radians(off)
    return a
def gse_basis(jd,aber=None,datafix=False):
    a=(ABER if aber is None else aber)+(data_frame_fix(jd) if datafix else 0)
    s=np.atleast_2d(SUN(np.atleast_1d(jd))); s[:,2]=0; s=s/np.linalg.norm(s,axis=1)[:,None]
    c,sn=np.cos(a),np.sin(a); x=np.stack([c*s[:,0]-sn*s[:,1],sn*s[:,0]+c*s[:,1],0*s[:,0]],1)
    z=np.zeros_like(x); z[:,2]=1; y=np.cross(z,x); return x,y,z
def gse_to_inertial(jd,g,datafix=True):
    x,y,z=gse_basis(jd,datafix=datafix); g=np.atleast_2d(g); return g[:,0:1]*x+g[:,1:2]*y+g[:,2:3]*z
def inertial_to_page(jd,r):
    """page Earth frame: x anti-Sun, y along Earth's orbital motion (=-GSE Y), z ecliptic north. units 1e5 km"""
    x,y,z=gse_basis(jd); r=np.atleast_2d(r)
    return np.stack([-(r*x).sum(1),-(r*y).sum(1),(r*z).sum(1)],1)/1e5
def load_hourly():
    rows=[]
    for l in open(os.path.join(DATA,'isee3_dp_ephem.asc')).read().splitlines()[2:]:
        p=l.split();
        if len(p)<9: continue
        rows.append((jd_ydoy(int(p[0]),int(p[1]),int(p[2])),int(p[3]),int(p[4]),float(p[6]),float(p[7]),float(p[8])))
    a=np.array(rows); a=a[np.argsort(a[:,0])]
    _,i=np.unique(a[:,0],return_index=True); return a[i]
