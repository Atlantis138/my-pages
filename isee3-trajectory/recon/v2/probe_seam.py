import pickle,sys
from dyn2 import *
N=pickle.load(open('nodes.pkl','rb'))
G=[(t,s) for t,s,i in N if s is not None and i['med']<40]
GT=np.array([g[0] for g in G])
for d in sys.argv[1:]:
    tb=jd_iso(d); k=np.searchsorted(GT,tb-0.6)-1; t0,s0=G[k]
    a=Arc(t0,s0,t0,tb+2)
    m=(HT>t0)&(HT<tb+2); tt=HT[m]; P=a(tt)[:,:3]; D=HR[m]
    print('== around',d,'ref node',iso(t0))
    for t,p,q,mf in zip(tt,P,D,H[m,2]):
        dd=q-p; ang=np.degrees(np.arctan2(q[1],q[0])-np.arctan2(p[1],p[0]))
        print(iso(t),'mf',int(mf),'|d| %7.0f'%np.linalg.norm(dd),'d=(%6.0f %6.0f %6.0f)'%tuple(dd),'ang %.3f'%ang,'r %.0f'%np.linalg.norm(q))
