from data import *
from dyn import *
def rot_basis(t):
    l=sun_lam(t)*D2R; return np.array([cos(l),sin(l),0]), np.array([sin(l),-cos(l),0])
def inv_rot(t,r):
    s,y=rot_basis(t); return -r[0]*s+r[1]*y+np.array([0,0,r[2]])
def guide_from(fn_rot):  # fn_rot(t)-> rotating pos (km)
    def g(t):
        h=0.02; p=inv_rot(t,fn_rot(t)); p2=inv_rot(t+h,fn_rot(t+h)); return np.concatenate([p,(p2-p)/h])
    return g
def lin_guide(ta,pa,tb,pb):
    ra=to_rot(ta,pa); rb=to_rot(tb,pb)
    return guide_from(lambda t: ra+(rb-ra)*(t-ta)/(tb-ta))
def spline_guide(knots):  # knots: list of (t, rot_pos km) ; Catmull-Rom
    T=np.array([k[0] for k in knots]); P=np.array([k[1] for k in knots])
    from scipy.interpolate import CubicSpline
    cs=CubicSpline(T,P,axis=0)
    return guide_from(lambda t: cs(t))
def run_chain(points, guides=None, step=6.0):
    segs=[]
    for i in range(len(points)-1):
        ta,pa=points[i][0],points[i][1]; tb,pb=points[i+1][0],points[i+1][1]
        g=(guides or {}).get(i) or lin_guide(ta,pa,tb,pb)
        ts,S,err=shoot(ta,pa,tb,pb,g,step=step)
        segs.append((ts,S,err))
    return segs
def fit_halo(anchors, period_rng=(165,190)):
    T=np.array([a[0] for a in anchors]); R=np.array([to_rot(a[0],a[1]) for a in anchors])
    best=None
    for P in np.arange(*period_rng,0.25):
        w=2*np.pi/P; M=np.column_stack([np.ones_like(T),np.cos(w*T),np.sin(w*T)])
        c,res,_,_=np.linalg.lstsq(M,R,rcond=None); e=((M@c-R)**2).sum()
        if best is None or e<best[0]: best=(e,P,c)
    e,P,c=best; w=2*np.pi/P
    f=lambda t: np.array([1,np.cos(w*t),np.sin(w*t)])@c
    return P,f,np.sqrt(e/len(T))
def halo_guide(f,ta,pa,tb,pb):
    ra=to_rot(ta,pa)-f(ta); rb=to_rot(tb,pb)-f(tb)
    return guide_from(lambda t: f(t)+ra+(rb-ra)*(t-ta)/(tb-ta))
