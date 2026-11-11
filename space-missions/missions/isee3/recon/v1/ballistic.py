import dyn
dyn.EPS_M=300.0
from geotail import *
import pickle
G=pickle.load(open('g0.pkl','rb'))
def run(t0,s0,t1,label):
    sol=solve_ivp(rhs,(t0,t1),s0,method='DOP853',rtol=1e-12,atol=1e-5,dense_output=True,max_step=0.02)
    tt=np.arange(min(t0,t1),max(t0,t1),0.005); d=np.array([np.linalg.norm(sol.sol(t)[:3]-moon(t)) for t in tt])
    # local minima
    mins=[i for i in range(1,len(d)-1) if d[i]<d[i-1] and d[i]<d[i+1] and d[i]<60000]
    print(label); [print('   Moon pass',date(tt[i]),round(d[i]),'km  alt',round(d[i]-1737)) for i in mins]
    return sol
nov83=anc(1983,305); dec82=anc(1982,335)
run(nov83[0],G['s83n'],nov83[0]-50,'backward from 1983-11-01 (real state)')
run(dec82[0],G['s_dec1'],dec82[0]+150,'forward from 1982-12-01 (real state)')
