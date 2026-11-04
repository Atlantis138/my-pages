import pickle, sys
from common import *
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
def rot_track(segs,dt=0.5):
    T=[];R=[]
    for ts,S,_ in segs:
        tt,rr,vv,_=sample(ts,S,dt)
        for t,r in zip(tt,rr): T.append(t); R.append(to_rot(t,r)/1e5)
    return np.array(T),np.array(R)
if __name__=='__main__':
    files=sys.argv[1].split(','); out=sys.argv[2]; lim=float(sys.argv[3]) if len(sys.argv)>3 else 20
    fig,ax=plt.subplots(1,2,figsize=(16,7.5))
    for fn in files:
        segs=pickle.load(open(fn,'rb')); T,R=rot_track(segs)
        ax[0].plot(R[:,0],R[:,1],lw=.6); ax[1].plot(R[:,0],R[:,2],lw=.6)
    for t,p,k in ANCH:
        r=to_rot(t,p)/1e5; ax[0].plot(r[0],r[1],'k.',ms=3); ax[1].plot(r[0],r[2],'k.',ms=3)
    th=np.linspace(0,2*np.pi,100); ax[0].plot(3.844*np.cos(th),3.844*np.sin(th),'--',c='gray',lw=.6)
    for a in ax: a.plot(0,0,'bo',ms=4); a.plot([-14.92,15.03],[0,0],'k+',ms=10); a.set_aspect('equal'); a.grid(alpha=.3); a.set_xlim(-lim,lim)
    ax[0].set_ylim(-lim*.8,lim*.8); ax[1].set_ylim(-lim*.3,lim*.3); ax[0].set_title('x-y (sun at left)'); ax[1].set_title('x-z')
    plt.tight_layout(); plt.savefig(out,dpi=72)
