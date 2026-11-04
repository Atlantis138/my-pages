from common import *
import pickle
A=None
def anc(y,d): t=ydoy(y,d); return min(ANCH,key=lambda a:abs(a[0]-t))[:2]
def bvp(a,b,step=5.0):
    return shoot(a[0],a[1],b[0],b[1],lin_guide(a[0],a[1],b[0],b[1]),step=step)
def moon_close(t0,s0,t1):
    sol=solve_ivp(rhs,(t0,t1),s0,method='DOP853',rtol=1e-10,atol=1e-3,dense_output=True,max_step=0.05)
    tt=np.arange(min(t0,t1),max(t0,t1),0.01); best=(1e18,0)
    for t in tt:
        d=np.linalg.norm(sol.sol(t)[:3]-moon(t))
        if d<best[0]: best=(d,t)
    return best,sol
def date(t): return datetime.fromtimestamp((t-2440587.5)*86400,timezone.utc).strftime('%Y-%m-%d %H:%M')
if __name__=='__main__':
    # 1983 Nov1->Dec1 arc
    n1=anc(1983,305); d1=anc(1983,335)
    ts,S,err=bvp(n1,d1); s_nov=S[0]; print('Nov1-Dec1 err',err)
    (dmin,tmin),_=moon_close(n1[0],s_nov,n1[0]-25); print('backward from 1983-11-01: closest Moon',round(dmin),'km at',date(tmin))
    sd=prop(ts[-2],S[-1],ts[-1]).y[:6,-1]
    (dmin,tmin),_=moon_close(d1[0],sd,d1[0]+30); print('forward from 1983-12-01: closest Moon',round(dmin),'km at',date(tmin))
    # 1982 Nov1->Dec1
    n1=anc(1982,305); d1=anc(1982,335)
    ts,S,err=bvp(n1,d1); print('1982 Nov1-Dec1 err',err)
    sd=prop(ts[-2],S[-1],ts[-1]).y[:6,-1]
    (dmin,tmin),sol=moon_close(d1[0],sd,d1[0]+130); print('forward from 1982-12-01: closest Moon',round(dmin),'km at',date(tmin))
    for dd in [30,60,90,110,120]:
        print('  +%d d'%dd, (to_rot(d1[0]+dd,sol.sol(d1[0]+dd)[:3])/1e5).round(2))
    (dmin,tmin),solb=moon_close(n1[0],S[0],n1[0]-125); print('backward from 1982-11-01: closest Moon',round(dmin),'km at',date(tmin))
    for dd in [-20,-40,-60,-80,-100,-120]:
        p=solb.sol(n1[0]+dd)[:3]; print('  %d d'%dd, date(n1[0]+dd), (to_rot(n1[0]+dd,p)/1e5).round(2), 'rE',round(np.linalg.norm(p)/RE,1))
    pickle.dump(None,open('/dev/null','wb'))
