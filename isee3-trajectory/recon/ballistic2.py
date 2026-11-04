from ballistic import *
def track(sol,t0,t1,step=5):
    for t in np.arange(t0,t1,step*np.sign(t1-t0)):
        p=sol.sol(t)[:3]; r=to_rot(t,p)/1e5; print('   ',date(t)[:10],r.round(2),'R=%.0f Re'%(np.linalg.norm(p)/RE))
sb=run(nov83[0],G['s83n'],jd_of('1983-03-20'),'backward from 1983-11-01 to March')
track(sb,jd_of('1983-09-20'),jd_of('1983-03-20'),10)
sf=run(dec82[0],G['s_dec1'],jd_of('1983-06-01'),'forward from 1982-12-01 to June')
track(sf,jd_of('1983-04-01'),jd_of('1983-06-01'),5)
pickle.dump(dict(),open('/dev/null','wb'))
