import numpy as np
from math import *
from scipy.optimize import fsolve
from datetime import datetime, timezone
K=0.01720209895
def jd(s):
    d=datetime.fromisoformat(s).replace(tzinfo=timezone.utc)
    return d.timestamp()/86400+2440587.5
def earth(J):
    d=J-2451545.0
    g=radians((357.529+0.98560028*d)%360)
    L=(280.459+0.98564736*d)%360
    lam=L+1.915*sin(g)+0.020*sin(2*g)
    R=1.00014-0.01671*cos(g)-0.00014*cos(2*g)
    lon=radians(lam+180)
    return np.array([R*cos(lon),R*sin(lon),0.0])
def kepE(M,e):
    E=M if e<0.8 else pi
    for _ in range(60):
        E-= (E-e*sin(E)-M)/(1-e*cos(E))
    return E
def comet(J,q,e,i,Om,w,T):
    a=q/(1-e); n=K/a**1.5
    M=n*(J-T); M=(M+pi)%(2*pi)-pi
    E=kepE(M,e)
    nu=2*atan2(sqrt(1+e)*sin(E/2),sqrt(1-e)*cos(E/2))
    r=a*(1-e*cos(E))
    i,Om,w=map(radians,(i,Om,w)); u=w+nu
    return np.array([r*(cos(Om)*cos(u)-sin(Om)*sin(u)*cos(i)),
                     r*(sin(Om)*cos(u)+cos(Om)*sin(u)*cos(i)),
                     r*sin(u)*sin(i)])
GZ=dict(q=1.028,e=0.7076,i=31.88,Om=195.4,w=172.5,T=jd('1985-09-05T05:00'))
HA=dict(q=0.5871,e=0.9673,i=162.24,Om=58.86,w=111.87,T=jd('1986-02-09T11:00'))
Jenc=jd('1985-09-11T11:02'); Jesc=jd('1983-12-22T00:00')
pg=comet(Jenc,**GZ)
print('GZ at encounter',pg, 'r',np.linalg.norm(pg),'lon',degrees(atan2(pg[1],pg[0]))%360)
pe=earth(Jenc); print('Earth-GZ dist AU',np.linalg.norm(pg-pe))
# ICE planar orbit: aphelion at GZ pos on Jenc
Q=np.linalg.norm(pg[:2]); lonA=atan2(pg[1],pg[0]); varpi=lonA+pi
def ice_pos(J,e,P,Jap=Jenc):
    a=Q/(1+e); n=2*pi/P
    M=pi+n*(J-Jap)
    M=(M+pi)%(2*pi)-pi
    E=kepE(M,e); nu=2*atan2(sqrt(1+e)*sin(E/2),sqrt(1-e)*cos(E/2)); r=a*(1-e*cos(E))
    return np.array([r*cos(nu+varpi),r*sin(nu+varpi),0.0])
def f(x):
    e,P=x
    p=ice_pos(Jesc,e,P); E=earth(Jesc)
    return [np.linalg.norm(p)-np.linalg.norm(E), atan2(p[1],p[0])-atan2(E[1],E[0])]
sol=fsolve(f,[0.05,355]); print('ICE e,P',sol)
e1,P1=sol; a1=Q/(1+e1); print('a',a1,'q',a1*(1-e1),'Q',Q)
for s in ['1986-03-13','1986-03-20','1986-03-25','1986-03-28','1986-04-01']:
    J=jd(s); d=np.linalg.norm(ice_pos(J,e1,P1)-comet(J,**HA))
    print(s,'ICE-Halley AU %.3f  Mkm %.1f'%(d,d*149.6), 'Halley r %.3f'%np.linalg.norm(comet(J,**HA)))
for s in ['1984-06-01','1985-01-01','1985-09-11','1986-03-28','1990-01-01']:
    J=jd(s); p=ice_pos(J,e1,P1); E=earth(J)
    print(s,'lead deg %.1f'%((degrees(atan2(p[1],p[0])-atan2(E[1],E[0]))+180)%360-180),'r %.3f'%np.linalg.norm(p))

Jsw=jd('1987-01-01'); Jret=jd('2014-08-10T18:16')
def ice2(J,P2):
    if J<=Jsw: return ice_pos(J,e1,P1)
    # continuous mean anomaly
    M_sw=pi+2*pi/P1*(Jsw-Jenc)
    a=Q/(1+e1); M=M_sw+2*pi/P2*(J-Jsw)
    M=(M+pi)%(2*pi)-pi
    E=kepE(M,e1); nu=2*atan2(sqrt(1+e1)*sin(E/2),sqrt(1-e1)*cos(E/2)); r=a*(1-e1*cos(E))
    return np.array([r*cos(nu+varpi),r*sin(nu+varpi),0.0])
def g(P2):
    p=ice2(Jret,P2[0]); E=earth(Jret)
    return [(atan2(p[1],p[0])-atan2(E[1],E[0])+pi)%(2*pi)-pi]
P2=fsolve(g,[353.7])[0]; print('P2',P2)
def rot(J):
    p=ice2(J,P2); E=earth(J); E2=earth(J+0.01); v=(E2-E)/0.01
    er=E/np.linalg.norm(E); et=v-er*np.dot(v,er); et/=np.linalg.norm(et)
    d=p-E
    return np.array([d@er,d@et])*1.496e8/1e5  # units of 1e5 km
for s in ['2014-03-01','2014-05-01','2014-06-01','2014-07-01','2014-08-10T18:16','2014-09-16','2014-11-01']:
    print(s, rot(jd(s)).round(1))
for y in range(1987,2015,3):
    J=jd(f'{y}-01-01'); p=ice2(J,P2); E=earth(J)
    print(y,'lead %.0f'%((degrees(atan2(p[1],p[0])-atan2(E[1],E[0])))%360))
