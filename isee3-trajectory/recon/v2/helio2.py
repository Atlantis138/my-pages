"""Heliocentric ICE track 1984–2014 (J2000 ecliptic internally)."""
import numpy as np
from scipy.integrate import solve_ivp
from scipy.interpolate import CubicSpline
from base import *
from hz import fetch
AU=149597870.7; S2D=86400.0
def to_j2000(jd,v):
    p=-prec_angle(np.asarray(jd,float)).reshape(-1); c,s=np.cos(p),np.sin(p); v=np.atleast_2d(v)
    return np.stack([c*v[:,0]-s*v[:,1], s*v[:,0]+c*v[:,1], v[:,2]],-1)
EA=fetch('399','500@10','1983-11-01','2015-01-01','1d'); EARTH=CubicSpline(EA[:,0],EA[:,1:4],axis=0)
GM={'10':1.32712440041e11,'199':22031.78,'299':324858.592,'399':398600.435,'301':4902.8,'499':42828.375,'599':126712764.1,'699':37940585.2,'799':5794556.4,'899':6836527.1}
PL={k:CubicSpline(*(lambda a:(a[:,0],a[:,1:4]))(fetch(k,'500@10','1983-11-01','2015-01-01','2d')),axis=0) for k in ('199','299','499','599','699','799','899','301')}
PL['399']=EARTH
def rhs(t,y,srp=0.0):
    r=y[:3]; rn=np.linalg.norm(r); a=-GM['10']*S2D**2*r/rn**3*(1-srp)
    for k,f in PL.items():
        rb=f(t); d=r-rb; a+=-GM[k]*S2D**2*(d/np.linalg.norm(d)**3+rb/np.linalg.norm(rb)**3)
    return np.concatenate([y[3:],a])
def integ(t0,s0,t1,srp=0.0,dense=True):
    return solve_ivp(rhs,(t0,t1),s0,method='DOP853',rtol=1e-11,atol=1e-3,dense_output=dense,args=(srp,))
def load_icetrja():
    rows=[]
    for l in open(DATA+'/icetrja.asc'):
        p=l.split()
        if len(p)<6: continue
        y,d,r,lat,lon=int(p[0]),float(p[1]),float(p[2]),float(p[3]),float(p[4])
        jd=jd_ydoy(y,1,0)+d-1
        b,l_=np.radians(lat),np.radians(lon)
        rows.append((jd,r*np.cos(b)*np.cos(l_)*AU,r*np.cos(b)*np.sin(l_)*AU,r*np.sin(b)*AU))
    a=np.array(rows); return a[:,0],to_j2000(a[:,0],a[:,1:4])
def data_helio(t,r_geo_ofdate):
    return EARTH(t)+to_j2000(t,r_geo_ofdate)
