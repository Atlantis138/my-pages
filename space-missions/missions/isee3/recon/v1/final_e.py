from explore import *
import dyn
dyn.EPS_M=300.0
nov83=anc(1983,305)
sb=solve_ivp(rhs,(nov83[0],jd_of('1983-04-15')),G['s83n'],method='DOP853',rtol=1e-12,atol=1e-5,dense_output=True,max_step=0.02)
pickle.dump([(t,sb.sol(t)) for t in np.arange(jd_of('1983-04-15'),nov83[0],0.01)],open('back83.pkl','wb'))
dyn.EPS_M=15000.0
t2=jd_of('1983-04-23T06:00')
res=[]
for tj in ('1983-06-01','1983-07-01','1983-08-01','1983-09-01'):
    tJ=jd_of(tj); sJ=sb.sol(tJ)
    g=lambda t: sb.sol(t)[:6]
    X=bvp(moonpt(t2),(tJ,sJ[:3]),guide=g,step=2)
    vin=prop(X[0][-2],X[1][-1],X[0][-1]).y[3:6,-1]; dv=np.linalg.norm(vin-sJ[3:])/S2D*1000
    vo,_=vinf_at(X,'out',1.5); a,b=rng(X)
    print(tj,'err %.2f'%X[2],'dv at join %.1f m/s'%dv,'LS2 out vinf %.3f'%np.linalg.norm(vo),'r %.1f-%.1f'%(a,b),flush=True)
    res.append((dv,tj,X))
res.sort(key=lambda r:r[0]); pickle.dump(res[0],open('tail2.pkl','wb')); print('BEST',res[0][:2])
