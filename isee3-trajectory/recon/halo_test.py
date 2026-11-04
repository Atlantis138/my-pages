from data import *
from dyn import *
import time
A=[a for a in ANCH]
# guess from linear interpolation in rotating frame between anchors
def mk_guess(ta,pa,tb,pb):
    ra=to_rot(ta,pa); rb=to_rot(tb,pb)
    def rot_pos(t):
        s=(t-ta)/(tb-ta); return ra+(rb-ra)*s
    def inv(t,r):
        l=sun_lam(t)*D2R; s=np.array([cos(l),sin(l),0]); y=np.array([sin(l),-cos(l),0])
        return -r[0]*s+r[1]*y+np.array([0,0,r[2]])
    def g(t):
        h=0.01; p=inv(t,rot_pos(t)); p2=inv(t+h,rot_pos(t+h)); return np.concatenate([p,(p2-p)/h])
    return g
t0=time.time()
i0=[i for i,a in enumerate(A) if a[2]=='m' and abs(a[0]-ydoy(1979,1))<1][0]
ta,pa,_=A[i0]; tb,pb,_=A[i0+1]
ts,S,err=shoot(ta,pa,tb,pb,mk_guess(ta,pa,tb,pb),verbose=True)
print('err',err,'time',time.time()-t0)
