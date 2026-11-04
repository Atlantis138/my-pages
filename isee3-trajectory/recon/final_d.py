from explore import *
import itertools
t2=jd_of('1983-04-23T06:00'); t3=jd_of('1983-09-27T13:55')
best=None
for th,zw,tw in itertools.product((-30,-15,0,15,30),(-1.0,0.0,1.0),('1983-06-15','1983-07-08','1983-08-01')):
    tW=jd_of(tw); r=15.1e5*np.array([np.cos(np.radians(th)),np.sin(np.radians(th)),0]); r[2]=zw*1e5
    r=r/np.linalg.norm(r)*15.1e5
    pW=inv_rot(tW,r)
    try:
        X=bvp(moonpt(t2),(tW,pW),step=4); Y=bvp((tW,pW),moonpt(t3),step=4)
    except Exception as e: continue
    if X[2]>5 or Y[2]>5: continue
    vin=prop(X[0][-2],X[1][-1],X[0][-1]).y[3:6,-1]; vout=Y[1][0][3:]
    dv=np.linalg.norm(vin-vout)/S2D*1000
    _,b1=rng(X); _,b2=rng(Y)
    vo,_=vinf_at(X,'out',1.5); vi,_=vinf_at(Y,'in',1.5)
    print(th,zw,tw,'dv %.0f m/s'%dv,'rmax %.1f %.1f'%(b1,b2),'LS2out %.3f LS3in %.3f'%(np.linalg.norm(vo),np.linalg.norm(vi)),flush=True)
    sc=dv+ (0 if max(b1,b2)<15.6 else 1e4)
    if best is None or sc<best[0]: best=(sc,th,zw,tw,X,Y)
print('BEST',best[:4])
pickle.dump(best,open('tail.pkl','wb'))
