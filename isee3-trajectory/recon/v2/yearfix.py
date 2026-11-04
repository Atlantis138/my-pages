"""Measure the start-of-year GSE frame rotation in the NSSDC file (prints the YEARFIX table used in base.py).
Run after fit_all.py. Compares raw data (without the fix) with arcs fitted to late December."""
import pickle
import dyn2
from dyn2 import *
HR=dyn2.HR=gse_to_inertial(HT,H[:,3:6],datafix=False)
N=pickle.load(open('nodes.pkl','rb'))
fix=[]
for y in range(1979,1988):
    tb=jd_iso(f'{y}-01-01')
    c=[(t,s) for t,s,i in N if s is not None and tb-9<t<tb-3 and i['med']<(40 if y<1984 else 150)]
    t0,s0=c[-1]; a=Arc(t0,s0,t0,tb+30)
    m=(HT>tb-1)&(HT<tb+30); tt=HT[m]; P=a(tt)[:,:3]; D=HR[m]
    ang=np.degrees(np.arctan2(D[:,1],D[:,0])-np.arctan2(P[:,1],P[:,0])); ang=(ang+180)%360-180
    k=(tt>=tb)&(tt<tb+5); off=np.median(ang[k])
    inside=np.abs(ang-off)<np.abs(ang)
    # last consecutive inside point after tb
    idx=np.where((tt>=tb))[0]; last=None
    for i in idx:
        if inside[i]: last=i
        elif last is not None and tt[i]>tb+3: break
    first=idx[0]; prev_out=tt[first-1] if first>0 else tb
    nxt=tt[last+1] if last+1<len(tt) else tt[last]+0.02
    print(y,'offset %.4f°'%off,'from',iso(tt[first]),'(prev pt',iso(prev_out),') to',iso(tt[last]),'(next pt',iso(nxt),')')
    fix.append((float((prev_out+tt[first])/2),float((tt[last]+nxt)/2),float(off)))
print(fix)
