"""Sun–Earth–Moon point-mass dynamics (geocentric, ecliptic of date, km & days) with STM,
and a robust local orbit fit to the NSSDC hourly GSE ephemeris."""
import numpy as np
from scipy.integrate import solve_ivp
from base import *
S2D=86400.0
MU_E=398600.4418*S2D**2; MU_S=1.32712440018e11*S2D**2; MU_M=4902.800066*S2D**2
def accel_grad(t,r):
    rn=np.linalg.norm(r); a=-MU_E*r/rn**3; G=MU_E*(3*np.outer(r,r)/rn**5-np.eye(3)/rn**3)
    for mu,rb in ((MU_S,SUN(t)),(MU_M,MOON(t))):
        d=r-rb; dn=np.linalg.norm(d); bn=np.linalg.norm(rb)
        a+=-mu*d/dn**3-mu*rb/bn**3; G+=mu*(3*np.outer(d,d)/dn**5-np.eye(3)/dn**3)
    return a,G
def rhs(t,y):
    a,G=accel_grad(t,y[:3]); out=np.empty_like(y); out[:3]=y[3:6]; out[3:6]=a
    if len(y)>6:
        P=y[6:].reshape(6,6)
        A=np.zeros((6,6)); A[:3,3:]=np.eye(3); A[3:,:3]=G; out[6:]=(A@P).ravel()
    return out
def prop(t0,s0,t1,stm=False,dense=True,rtol=1e-11,atol=1e-4):
    y0=np.concatenate([s0,np.eye(6).ravel()]) if stm else np.asarray(s0,float)
    return solve_ivp(rhs,(t0,t1),y0,method='DOP853',rtol=rtol,atol=atol,dense_output=dense)
H=load_hourly(); HT=H[:,0]; HR=gse_to_inertial(HT,H[:,3:6])
class Arc:
    """ballistic arc fitted around tc; evaluate pos/vel in [lo,hi]"""
    def __init__(s,tc,state,lo,hi):
        s.tc,s.state,s.lo,s.hi=tc,state,lo,hi
        s.f=prop(tc,state,hi) if hi>tc else None; s.b=prop(tc,state,lo) if lo<tc else None
    def __call__(s,t):
        t=np.atleast_1d(t); out=np.empty((len(t),6))
        for i,x in enumerate(t):
            out[i]=s.state if x==s.tc else (s.f.sol(x) if x>s.tc else s.b.sol(x))[:6]
        return out
def init_state(tc,W=0.25):
    m=np.abs(HT-tc)<=W
    if m.sum()<4: m=np.argsort(np.abs(HT-tc))[:6]
    tt=HT[m]-tc; c=np.polyfit(tt,HR[m],2); return np.concatenate([c[2],c[1]])
def fit(tc,W=1.0,s0=None,iters=12,verbose=False,kmin=15.0,gate=None):
    """gate: callable t->predicted positions; data farther than 400 km from it are dropped before fitting"""
    m=np.where(np.abs(HT-tc)<=W)[0]; tt=HT[m]; dd=HR[m]
    if gate is not None:
        g=np.linalg.norm(gate(tt)-dd,axis=1)<400
        if g.sum()>=max(8,0.4*len(tt)): tt=tt[g]; dd=dd[g]
    s=init_state(tc) if s0 is None else np.array(s0,float)
    w=np.ones(len(tt))
    for it in range(iters):
        P=np.empty((len(tt),3)); J=np.empty((len(tt),3,6))
        for sign in (1,-1):
            sel=(tt-tc)*sign>0
            if not sel.any(): continue
            te=tt[sel]; sol=prop(tc,s,te[-1] if sign>0 else te[0],stm=True)
            Y=sol.sol(te).T; P[sel]=Y[:,:3]; J[sel]=Y[:,6:].reshape(-1,6,6)[:,:3,:]
        z=tt==tc
        if z.any(): P[z]=s[:3]; J[z]=np.hstack([np.eye(3),np.zeros((3,3))])
        R=P-dd; rn=np.linalg.norm(R,axis=1)
        mad=np.median(rn); k=max(3*mad,kmin)
        w=np.where(rn<k,1.0,k/rn); w[rn>30*k]=0
        sw=np.sqrt(w)[:,None]
        A=(J*sw[:,:,None]).reshape(-1,6); b=-(R*sw).ravel()
        sc=np.array([1,1,1,0.01,0.01,0.01]); dx=np.linalg.lstsq(A/sc,b,rcond=None)[0]/sc
        s=s+dx
        if verbose: print(it,'rms %.2f med %.2f  |dr| %.3f |dv| %.4f'%(np.sqrt((rn**2*w).sum()/w.sum()),mad,np.linalg.norm(dx[:3]),np.linalg.norm(dx[3:])))
        if np.linalg.norm(dx[:3])<0.01 and it>1: break
    good=w>0.99
    return s, dict(rms=float(np.sqrt((rn[good]**2).mean())) if good.any() else np.nan, med=float(np.median(rn)), n=len(tt), nrej=int((w<0.99).sum()))
