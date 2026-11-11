"""Assemble the page's tracks from the node fits (1978–87), JPL Horizons (2014) and an n-body backward
integration of the JPL 2014 solution (1987–2014). Writes ../../data/track.json and ../../data/model.json (the files the page loads)."""
import pickle, json, sys
from dyn2 import *
from jsport import moon_page, earth_h, J78
import helio2
from helio2 import AU, to_j2000, integ, EARTH, fetch as hfetch
T_LAUNCH=jd_iso('1978-08-12T15:12')
E_END=jd_iso('1984-01-27')
# ---------- A. continuous geocentric evaluator from node fits ----------
N=pickle.load(open('nodes.pkl','rb'))
G=[(t,s) for t,s,i in N if s is not None and i['med']<(40 if t<jd_iso('1984-02-01') else 150)]
GT=np.array([g[0] for g in G])
print('good nodes',len(G))
_arc={}
def arc(i):
    if i not in _arc:
        lo=GT[i-1] if i>0 else T_LAUNCH; hi=GT[i+1] if i+1<len(GT) else GT[i]+1
        _arc[i]=Arc(GT[i],G[i][1],min(lo,GT[i]-0.01),max(hi,GT[i]+0.01))
    return _arc[i]
def blended(t):
    if t<=GT[0]: return arc(0)(t)[0]
    if t>=GT[-1]: return arc(len(GT)-1)(min(t,GT[-1]+1))[0]
    i=np.searchsorted(GT,t)-1; a,b=GT[i],GT[i+1]
    if i in BREAK: return arc(i)(t)[0] if t<BREAK[i][0] else arc(i+1)(t)[0]
    k=(t-a)/(b-a); w=k*k*(3-2*k)
    return (1-w)*arc(i)(t)[0]+w*arc(i+1)(t)[0]
# --- data-segment breaks: the NSSDC file switches orbit solutions every couple of weeks, and at some
# switches neighbouring arcs disagree by 0.2–50 thousand km (mostly in Z). Short blends there make kinks,
# so at each such break the two sides are kept apart and the jump is shared out smoothly over up to ±12 days
# (narrower near close approaches, so flyby and perigee geometry is untouched).
CLOSE=[jd_iso(x) for x in ('1983-03-30T18:00','1983-04-23T23:00','1983-09-27T18:00','1983-10-21T16:30','1983-12-22T18:44',
       '1982-10-17','1982-12-22T12:00','1983-04-02T22:30','1983-04-20T20:40','1983-10-01T09:00','1983-10-17T22:00')]
BREAK={}
for i in range(len(GT)-1):
    a,b=GT[i],GT[i+1]
    if a>jd_iso('1984-01-31') or b-a>3: continue
    tt=np.linspace(a,b,7); d=np.linalg.norm(arc(i)(tt)[:,:3]-arc(i+1)(tt)[:,:3],axis=1).max()
    if d<150: continue
    tb=(a+b)/2; J=arc(i+1)(tb)[0][:3]-arc(i)(tb)[0][:3]
    L=min(12.0,max(0.75,min(abs(tb-c) for c in CLOSE)-1.5))
    BREAK[i]=(tb,J,L)
print('breaks',len(BREAK),'largest %.0f km'%max(np.linalg.norm(v[1]) for v in BREAK.values()))
BRK=sorted(BREAK.values(),key=lambda x:x[0])
def state(t):
    s=blended(t).copy()
    for tb,J,L in BRK:
        if abs(t-tb)>=L: continue
        k=np.clip((t-(tb-L))/(2*L),0,1); w=k*k*(3-2*k)
        s[:3]+=J*(w-(1.0 if t>=tb else 0.0))
    return s
# launch: back-propagate the first arc until it reaches the injection region
s1=arc(0)(GT[0])[0]
ev=lambda t,y: np.linalg.norm(y[:3])-6700; ev.terminal=True
bk=solve_ivp(rhs,(GT[0],T_LAUNCH),s1,method='DOP853',rtol=1e-11,atol=1e-4,dense_output=True,events=ev)
T_INJ=bk.t[-1]; print('backward from first node reaches r=6700 km at',iso(T_INJ,'%Y-%m-%d %H:%M'),'(launch 15:12)')
def state_full(t):
    if t<GT[0]: return bk.sol(max(t,T_INJ))
    return state(t)
# ---------- B. closest approaches ----------
def refine(f,t0,span,step=1/1440):
    ts=np.arange(t0-span,t0+span,step); d=np.array([f(x) for x in ts]); i=int(np.argmin(d))
    for _ in range(3):
        ts=np.linspace(ts[max(i-1,0)],ts[min(i+1,len(ts)-1)],41); d=np.array([f(x) for x in ts]); i=int(np.argmin(d))
    return ts[i],d[i]
LSG=['1983-03-30T18:00','1983-04-23T23:00','1983-09-27T18:00','1983-10-21T16:30','1983-12-22T18:44']
LS=[]
for g in LSG:
    t,d=refine(lambda x: np.linalg.norm(state(x)[:3]-MOON(x)),jd_iso(g),0.4)
    v=np.linalg.norm(state(t)[3:]-MOON(t,1))/S2D
    LS.append(dict(t=t,r=d,alt=d-1737.4,v=v)); print('LS',iso(t,'%Y-%m-%d %H:%M:%S'),'r %.0f alt %.0f vrel %.2f km/s'%(d,d-1737.4,v))
PER=[]
for g in ['1982-10-17T00:00','1982-12-22T12:00','1983-04-02T22:00','1983-04-20T20:00','1983-10-01T08:00','1983-10-17T22:00']:
    t,d=refine(lambda x: np.linalg.norm(state(x)[:3]),jd_iso(g),0.6,step=5/1440)
    PER.append(dict(t=t,r=d)); print('perigee',iso(t,'%Y-%m-%d %H:%M'),'r %.0f km = %.1f Re'%(d,d/6378.137))
# tail apogees beyond 200 Re
# ---------- C. sample E track ----------
def page_pt(t,s,moon_fix=True):
    p=inertial_to_page(t,s[:3])[0]
    if moon_fix:
        m=MOON(t); d=np.linalg.norm(s[:3]-m)
        if d<70000:
            k=np.clip((d-25000)/(70000-25000),0,1); w=1-k*k*(3-2*k)
            p=p+w*(moon_page(t)-inertial_to_page(t,m)[0])
    return p
ts=list(np.arange(T_INJ,T_INJ+2,0.005))+list(np.arange(T_INJ+2,E_END,0.05))
for x in LS: ts+=list(np.arange(x['t']-1.2,x['t']+1.2,0.002))
ts+=list(np.arange(LS[4]['t']-0.12,LS[4]['t']+0.12,0.0007))
for x in PER: ts+=list(np.arange(x['t']-1,x['t']+1,0.005))
ts=np.unique(np.round(np.array([t for t in ts if T_INJ<=t<=E_END]),6))
print('E raw samples',len(ts))
S=np.array([state_full(t) for t in ts]); P=np.array([page_pt(t,s) for t,s in zip(ts,S)])
V=np.linalg.norm(S[:,3:],axis=1)/S2D
def simplify(P,tol):
    """Douglas–Peucker on 3D points with per-point tolerance; returns kept indices"""
    keep=np.zeros(len(P),bool); keep[0]=keep[-1]=True; stack=[(0,len(P)-1)]
    while stack:
        a,b=stack.pop()
        if b-a<2: continue
        A=P[a]; Bv=P[b]; AB=Bv-A; L=AB@AB
        Q=P[a+1:b]-A
        if L>0: u=np.clip(Q@AB/L,0,1); D=np.linalg.norm(Q-u[:,None]*AB,axis=1)
        else: D=np.linalg.norm(Q,axis=1)
        D=D/tol[a+1:b]; j=int(np.argmax(D))
        if D[j]>1: keep[a+1+j]=True; stack+=[(a,a+1+j),(a+1+j,b)]
    return np.where(keep)[0]
dM=np.linalg.norm(S[:,:3]-MOON(ts),axis=1); dE=np.linalg.norm(S[:,:3],axis=1)
tol=np.where(dM<30000,0.0001,np.where(dE<80000,0.0002,0.0005))
# also keep enough points in time for smooth playback interpolation (max 1.5 d apart)
keep=simplify(P,tol)
kk=set(keep.tolist())|set(np.where(np.abs(ts-LS[4]['t'])<0.12)[0].tolist()); last=ts[0]
for i,t in enumerate(ts):
    if i in kk: last=t
    elif t-last>0.5: kk.add(i); last=t
keep=np.array(sorted(kk))
print('E kept',len(keep))
E=[]
for i in keep: E+=[round(float(ts[i]-J78),4)]+[round(float(x),4) for x in P[i]]+[round(float(V[i]),3)]
# ---------- D. 2014 (JPL Horizons -111, geocentric) ----------
from hz import fetch
def series(tg,ctr,a,b,st):
    A=fetch(tg,ctr,a,b,st); return A[:,0],to_date(A[:,0][:,None],A[:,1:4]),to_date(A[:,0][:,None],A[:,4:7])*S2D
t14,r14,v14=series('-111','500@399','2014-01-01','2014-12-31','1h')
_,sun14,_=series('10','500@399','2014-01-01','2014-12-31','3h'); tS=fetch('10','500@399','2014-01-01','2014-12-31','3h')[:,0]
_,mo14,_=series('301','500@399','2014-01-01','2014-12-31','3h')
SUN14=CubicSpline(tS,sun14,axis=0); MOON14=CubicSpline(tS,mo14,axis=0)
C14=CubicSpline(t14,r14,axis=0); CV14=CubicSpline(t14,v14,axis=0)
def page14(t,r):
    s=SUN14(t); s[2]=0; x=s/np.linalg.norm(s); y=np.cross([0,0,1],x)
    p=np.array([-(r@x),-(r@y),r[2]])/1e5
    m=MOON14(t); d=np.linalg.norm(r-m)
    if d<70000:
        k=np.clip((d-25000)/45000,0,1); w=1-k*k*(3-2*k)
        pm=np.array([-(m@x),-(m@y),m[2]])/1e5; p=p+w*(moon_page(t)-pm)
    return p
R0=jd_iso('2014-06-20'); R1=jd_iso('2014-09-20')
tr=np.unique(np.round(np.concatenate([np.arange(R0,R1,1/24),np.arange(jd_iso('2014-08-08'),jd_iso('2014-08-13'),0.002)]),6))
PR=np.array([page14(t,C14(t)) for t in tr]); VR=np.linalg.norm(CV14(tr),axis=1)/S2D
dmr=np.linalg.norm(C14(tr)-MOON14(tr),axis=1)
kr=np.array(sorted(set(simplify(PR,np.where(dmr<40000,0.0002,0.0015)).tolist())|set(np.where(np.abs(tr-jd_iso('2014-08-10T19:18'))<0.25)[0].tolist()))); print('R kept',len(kr))
Rr=[]
for i in kr: Rr+=[round(float(tr[i]-J78),4)]+[round(float(x),4) for x in PR[i]]+[round(float(VR[i]),3)]
t14ca,d14=refine(lambda x: np.linalg.norm(C14(x)-MOON14(x)),jd_iso('2014-08-10T19:18'),0.2)
t14e,d14e=refine(lambda x: np.linalg.norm(C14(x)),jd_iso('2014-08-09T03:00'),0.4)
print('2014 lunar CA',iso(t14ca,'%Y-%m-%d %H:%M:%S'),'%.0f km'%d14,' Earth CA',iso(t14e,'%Y-%m-%d %H:%M'),'%.0f km'%d14e)
# ---------- E. heliocentric 1983-12 .. 2014-06 ----------
H0=jd_iso("1983-12-10"); HD=float(GT[-1]); H1=jd_iso("2014-06-25")
I=hfetch('-111','500@10','2014-01-01','2014-12-31','6h'); s0=np.concatenate([I[0,1:4],I[0,4:7]*S2D])
back=integ(I[0,0],s0,HD-40)
def helio_page(t):
    if t<=HD:
        r=state(t)[:3]
        return earth_h(t)+r/AU*10
    if t>=I[0,0]:
        k=np.argmin(abs(I[:,0]-t)); r=to_date(t,CubicSpline(I[:,0],I[:,1:4],axis=0)(t))[0]; return r/AU*10
    rb=to_date(t,back.sol(t)[:3])[0]/AU*10
    if t<HD+40:  # blend the small seam (≈0.0005 AU) over 40 days
        rd=earth_h(HD)+state(HD)[:3]/AU*10; rb0=to_date(HD,back.sol(HD)[:3])[0]/AU*10
        k=(t-HD)/40; w=k*k*(3-2*k); return rb+(1-w)*(rd-rb0)
    return rb
th=list(np.arange(H0,jd_iso('1985-08-01'),1.0))+list(np.arange(jd_iso('1985-08-01'),jd_iso('1986-05-01'),0.5))+list(np.arange(jd_iso('1986-05-01'),HD,2.0))+list(np.arange(HD,H1,4.0))+[H1]
th=np.array(sorted(set(np.round(th,4))))
PH=np.array([helio_page(t) for t in th])
Hh=[]
for t,p in zip(th,PH): Hh+=[round(float(t-J78),3)]+[round(float(x),5) for x in p]
print('H points',len(th))
# seam & checks
print('seam 1987-02: data vs back-integration %.5f AU'%(np.linalg.norm((earth_h(HD)+state(HD)[:3]/AU*10)-to_date(HD,back.sol(HD)[:3])[0]/AU*10)/10))
# ---------- F. comets: osculating elements from JPL (ecliptic of date at epoch) ----------
def elements(r,v,mu=1.32712440041e11*S2D**2):
    h=np.cross(r,v); n=np.cross([0,0,1],h); rn=np.linalg.norm(r)
    ev=np.cross(v,h)/mu-r/rn; e=np.linalg.norm(ev)
    i=np.degrees(np.arccos(h[2]/np.linalg.norm(h))); Om=np.degrees(np.arctan2(n[1],n[0]))%360
    w=np.degrees(np.arccos(np.clip(n@ev/(np.linalg.norm(n)*e),-1,1)));
    if ev[2]<0: w=360-w
    p=h@h/mu; q=p/(1+e)/AU
    nu=np.arccos(np.clip(ev@r/(e*rn),-1,1));
    if r@v<0: nu=-nu
    a=q*AU/(1-e); E=2*np.arctan(np.sqrt((1-e)/(1+e))*np.tan(nu/2)); M=E-e*np.sin(E)
    nmot=np.sqrt(mu/a**3); return dict(q=q,e=e,i=i,Om=Om,w=w,dtp=-M/nmot)
COM={}
for key,cmd,ep in [('GZ','DES=21P;CAP<1986;','1985-09-11T11:00'),('HA','DES=1P;CAP<1987;','1986-03-25T00:00')]:
    A=hfetch(cmd,'500@10','1984-01-01','1986-06-01' if key=='GZ' else '1987-06-01','1d')
    j=jd_iso(ep); cs=CubicSpline(A[:,0],A[:,1:4],axis=0); cv=CubicSpline(A[:,0],A[:,4:7],axis=0)
    r=to_date(j,cs(j))[0]; v=to_date(j,cv(j))[0]*S2D; el=elements(r,v); el['Tp']=round(j+el['dtp']-J78,5); del el['dtp']
    COM[key]={k:(round(float(x),6)) for k,x in el.items()}; print(key,COM[key])
# encounter check: ICE (data) vs GZ (JPL)
gz=hfetch('DES=21P;CAP<1986;','500@10','1985-09-10','1985-09-13','5m')
cg=CubicSpline(gz[:,0],gz[:,1:4],axis=0)
def ice_helio_j2000(t): return EARTH(t)+to_j2000(t,state(t)[:3])[0]
tg,dg=refine(lambda x: np.linalg.norm(ice_helio_j2000(x)-cg(x)),jd_iso('1985-09-11T11:02'),0.3)
print('G-Z closest (NSSDC ICE vs JPL 21P):',iso(tg,'%Y-%m-%d %H:%M'),'%.0f km'%dg)
ha=hfetch('DES=1P;CAP<1987;','500@10','1986-03-20','1986-04-01','1h'); chh=CubicSpline(ha[:,0],ha[:,1:4],axis=0)
th_,dh=refine(lambda x: np.linalg.norm(ice_helio_j2000(x)-chh(x)),jd_iso('1986-03-26'),5,step=1/24)
print('Halley closest:',iso(th_,'%Y-%m-%d %H:%M'),'%.3e km = %.4f AU'%(dh,dh/AU))
# distance Earth at GZ
print('ICE–Earth at G-Z: %.3f AU'%(np.linalg.norm(state(jd_iso('1985-09-11T11:02'))[:3])/AU))
# ---------- G. write ----------
meta=dict(LS=[round(float(x['t']-J78),5) for x in LS], LSalt=[round(float(x['alt']),1) for x in LS], LSv=[round(float(x['v']),3) for x in LS],
          PER=[[round(float(x['t']-J78),4),round(float(x['r']))] for x in PER], T14=round(float(t14ca-J78),5), D14=round(float(d14)),
          TGZ=round(float(tg-J78),5), DGZ=round(float(dg)), THA=round(float(th_-J78),4), DHA=round(float(dh)), TINJ=round(float(T_INJ-J78),4))
json.dump(dict(E=E,R=Rr,H=Hh,**meta),open('../../data/track.json','w'),separators=(',',':'))
json.dump(dict(comets=COM),open('../../data/model.json','w'),separators=(',',':'))
import os; print('track.json bytes',os.path.getsize('../../data/track.json'))
pickle.dump(dict(LS=LS,PER=PER),open('events.pkl','wb'))
