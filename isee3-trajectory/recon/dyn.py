import numpy as np
from scipy.integrate import solve_ivp
from astro import *
S2D=86400.0
MU_E=398600.4418*S2D**2; MU_S=1.32712440018e11*S2D**2; MU_M=4902.8*S2D**2
USE_MOON=True
EPS_M=15000.0
def grav(r,mu):
    rn=np.linalg.norm(r); return -mu*r/rn**3, mu*(3*np.outer(r,r)/rn**5-np.eye(3)/rn**3)
from scipy.interpolate import CubicSpline
_cache={}
def _tab(lo,hi):
    tt=np.arange(lo,hi,0.05)
    _cache['m']=CubicSpline(tt,np.array([moon(t) for t in tt]),axis=0)
    _cache['s']=CubicSpline(tt,np.array([sun(t)[0] for t in tt]),axis=0)
    _cache['rng']=(lo+1,hi-1)
_tab(jd_of('1978-08-01'),jd_of('1984-04-01'))
def moon_f(jd):
    a,b=_cache['rng']; return _cache['m'](jd) if a<jd<b else moon(jd)
def sun_f(jd):
    a,b=_cache['rng']; return _cache['s'](jd) if a<jd<b else sun(jd)[0]
def accel(jd,r,stm=False):
    a,G=grav(r,MU_E)
    rs=sun_f(jd); d=r-rs
    a2,G2=grav(d,MU_S); a=a+a2-MU_S*rs/np.linalg.norm(rs)**3; G=G+G2
    if USE_MOON:
        rm=moon_f(jd); d=r-rm; q=d@d+EPS_M**2; a3=-MU_M*d/q**1.5
        G3=MU_M*(3*np.outer(d,d)/q**2.5-np.eye(3)/q**1.5)
        a=a+a3-MU_M*rm/np.linalg.norm(rm)**3; G=G+G3
    return (a,G) if stm else a
def rhs(t,y):
    r=y[:3]; v=y[3:6]; a,G=accel(t,r,True)
    out=np.empty_like(y); out[:3]=v; out[3:6]=a
    if len(y)>6:
        P=y[6:].reshape(6,6); A=np.zeros((6,6)); A[:3,3:]=np.eye(3); A[3:,:3]=G
        out[6:]=(A@P).ravel()
    return out
def prop(t0,s0,t1,stm=False,dense=False):
    y0=np.concatenate([s0,np.eye(6).ravel()]) if stm else np.array(s0,float)
    sol=solve_ivp(rhs,(t0,t1),y0,method='DOP853',rtol=1e-10,atol=1e-3,dense_output=dense)
    return sol
def shoot(t0,p0,t1,p1,guess,step=6.0,iters=40,verbose=False):
    """multiple shooting: guess(t)->(r,v) inertial km, km/day. returns node times, node states"""
    k=max(1,int(np.ceil((t1-t0)/step))); ts=np.linspace(t0,t1,k+1)
    S=[np.array(guess(t),float) for t in ts[:-1]]; S[0][:3]=p0
    for it in range(iters):
        res=[];rows=[]
        n=3+6*(k-1); J=np.zeros((6*(k-1)+3,n)); R=np.zeros(6*(k-1)+3)
        for i in range(k):
            sol=prop(ts[i],S[i],ts[i+1],stm=True); yf=sol.y[:,-1]; ph=yf[:6]; Phi=yf[6:].reshape(6,6)
            col = 0 if i==0 else 3+6*(i-1)
            Pc = Phi[:,3:] if i==0 else Phi
            if i<k-1:
                R[6*i:6*i+6]=ph-S[i+1]; J[6*i:6*i+6,col:col+Pc.shape[1]]=Pc
                J[6*i:6*i+6,3+6*i:3+6*i+6]-=np.eye(6)
            else:
                R[6*i:6*i+3]=ph[:3]-p1; J[6*i:6*i+3,col:col+Pc.shape[1]]=Pc[:3]
        # scale: positions km, velocities km/day -> weight
        err=np.abs(R).max()
        if verbose: print(it,err)
        if err<1.0: break
        dx=np.linalg.lstsq(J,-R,rcond=None)[0]
        lam=1.0
        if err>1e5: lam=0.5
        S[0][3:]+=lam*dx[:3]
        for i in range(1,k): S[i]+=lam*dx[3+6*(i-1):3+6*i]
    return ts,S,err
def sample(ts,S,dt=0.25):
    out_t=[];out_r=[];out_v=[]
    for i in range(len(S)):
        sol=prop(ts[i],S[i],ts[i+1],dense=True)
        tt=np.arange(ts[i],ts[i+1],dt)
        y=sol.sol(tt); out_t+=list(tt); out_r+=list(y[:3].T); out_v+=list(y[3:6].T)
    sol=prop(ts[-2],S[-1],ts[-1]); 
    return np.array(out_t),np.array(out_r),np.array(out_v), sol.y[3:6,-1]
