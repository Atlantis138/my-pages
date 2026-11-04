from common import *
from probe import anc, moon_close, date
import pickle
def bvp(a,b,guide=None,step=4.0):
    g=guide or lin_guide(a[0],a[1],b[0],b[1])
    ts,S,err=shoot(a[0],a[1],b[0],b[1],g,step=step); return (ts,S,err)
def end_state(seg): ts,S,_=seg; return prop(ts[-2],S[-1],ts[-1]).y[:6,-1]
def vinf_at(seg,which,dt=1.0):
    """velocity relative to Moon dt days before arrival (which='in') or after departure ('out')"""
    ts,S,_=seg
    if which=='in':
        t=ts[-1]-dt; i=np.searchsorted(ts,t)-1; s=prop(ts[i],S[i],t).y[:6,-1]
    else:
        t=ts[0]+dt; i=np.searchsorted(ts,t)-1; s=prop(ts[i],S[i],t).y[:6,-1]
    return (s[3:]-moon_vel(t)*S2D)/S2D, s
def moonpt(t): return (t,moon(t))
def guide_prop(t0,s0,span):
    sol=solve_ivp(rhs,(t0,t0+span),s0,method='DOP853',rtol=1e-10,atol=1e-3,dense_output=True)
    return lambda t: sol.sol(t)[:6]
if __name__=='__main__':
    jul1=anc(1982,182); nov1=anc(1982,305); dec1=anc(1982,335); nov83=anc(1983,305); dec83=anc(1983,335)
    # arc Jul1->Nov1 using backward-propagated guide from Nov1
    segNov=bvp(nov1,dec1); s_nov1=segNov[1][0]
    gb=guide_prop(nov1[0],s_nov1,jul1[0]-nov1[0])
    segJul=bvp(jul1,nov1,guide=gb); print('Jul-Nov err',segJul[2])
    s_dec1=end_state(segNov)
    gf=guide_prop(dec1[0],s_dec1,125)
    seg83a=bvp(nov83,dec83); s83n=seg83a[1][0]; s83d=end_state(seg83a)
    gback=guide_prop(nov83[0],s83n,-20)
    pickle.dump(dict(segJul=segJul,segNov=segNov,seg83a=seg83a,s_dec1=s_dec1,s83n=s83n,s83d=s83d),open('g0.pkl','wb'))
    print('ok')
