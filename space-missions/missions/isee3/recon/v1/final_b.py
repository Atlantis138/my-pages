from explore import *
B=pickle.load(open('ballistic34.pkl','rb'))
t3=B['t3']; t4=B['t4']
bt=np.array([y[0] for y in B['y']]); br=np.array([to_rot(t,s[:3]) for t,s in B['y']])
from scipy.interpolate import interp1d
bf=interp1d(bt,br,axis=0)
phi=lambda t: np.arctan2(*to_rot(t,moon(t))[[1,0]])
def wrap(a): return (a+np.pi)%(2*np.pi)-np.pi
def mapped_guide(t1,t2):
    d1=wrap(phi(t1)-phi(t3)); d2=wrap(phi(t2)-phi(t4))
    def f(t):
        s=(t-t1)/(t2-t1); tb=t3+s*(t4-t3); a=d1+(d2-d1)*s; r=bf(np.clip(tb,bt[0],bt[-1]))
        c,sn=np.cos(a),np.sin(a); return np.array([c*r[0]-sn*r[1],sn*r[0]+c*r[1],r[2]])
    return guide_from(f)
t2=jd_of('1983-04-23T06:00')
out={}
for s1 in ('1983-03-30T12:00','1983-03-31T19:19'):
    t1=jd_of(s1)
    A1=bvp(dec1,moonpt(t1),guide=gf,step=6); v1,_=vinf_at(A1,'in',1.5)
    A2=bvp(moonpt(t1),moonpt(t2),guide=mapped_guide(t1,t2),step=1.5)
    vo,_=vinf_at(A2,'out',1.5); vi,_=vinf_at(A2,'in',1.5); a,b=rng(A2)
    print(s1,'err %.2f A1in %.3f A2out %.3f A2in %.3f r %.2f-%.2f'%(A2[2],np.linalg.norm(v1),np.linalg.norm(vo),np.linalg.norm(vi),a,b),flush=True)
    out[s1]=(A1,A2)
pickle.dump(out,open('pair12.pkl','wb'))
