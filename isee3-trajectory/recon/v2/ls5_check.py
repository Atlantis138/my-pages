"""LS5 consistency vs. GSE axis offset (arcsec): fit pre- and post-flyby data separately, compare.
usage: python3 ls5_check.py 20.5"""
import sys, base, dyn2
from dyn2 import *
def ca_search(A,tc):
    ts=np.arange(tc-0.25,tc+0.25,1/1440); d=np.linalg.norm(A(ts)[:,:3]-MOON(ts),axis=1); i=np.argmin(d)
    tt=np.linspace(ts[i]-2/1440,ts[i]+2/1440,481); d2=np.linalg.norm(A(tt)[:,:3]-MOON(tt),axis=1); j=np.argmin(d2); return tt[j],d2[j]
ab=float(sys.argv[1]); base.ABER=np.radians(ab/3600); dyn2.HR=gse_to_inertial(dyn2.HT,dyn2.H[:,3:6])
tc=jd_iso('1983-12-22T18:45')
sA,iA=fit(tc-0.6,W=0.5); sB,iB=fit(tc+0.6,W=0.5)
A=Arc(tc-0.6,sA,tc-1,tc+1); B=Arc(tc+0.6,sB,tc-1,tc+1)
ta,da=ca_search(A,tc); tb,db=ca_search(B,tc)
a=A(tc+0.5)[0]; b=B(tc+0.5)[0]; a2=A(tc-0.5)[0]; b2=B(tc-0.5)[0]
print(ab,'pre %s %.1f | post %s %.1f | dv(+.5) %.2f dv(-.5) %.2f m/s'%(iso(ta,'%H:%M:%S'),da-1737.4,iso(tb,'%H:%M:%S'),db-1737.4,np.linalg.norm(a[3:]-b[3:])/86.4,np.linalg.norm(a2[3:]-b2[3:])/86.4))
