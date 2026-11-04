"""List places where neighbouring node arcs disagree (these become kinks after blending)."""
import pickle
from dyn2 import *
N=pickle.load(open('nodes.pkl','rb'))
G=[(t,s,i) for t,s,i in N if s is not None and i['med']<(40 if t<jd_iso('1984-02-01') else 150)]
out=[]
for (ta,sa,ia),(tb,sb,ib) in zip(G,G[1:]):
    if ta>jd_iso('1984-02-01'): break
    A=prop(ta,sa,tb); B=prop(tb,sb,ta)
    tt=np.linspace(ta,tb,9); d=np.linalg.norm(A.sol(tt)[:3]-B.sol(tt)[:3],axis=0)
    out.append((ta,tb,d.max()))
out=np.array(out); pickle.dump(out,open('seams.pkl','wb'))
print('pct',np.percentile(out[:,2],[50,90,99]).round(1))
for ta,tb,d in out:
    if d>150: print(iso(ta),'->',iso(tb),'gap %.2fd'%(tb-ta),'max mismatch %.0f km'%d)
