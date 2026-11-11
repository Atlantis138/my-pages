from helio2 import *
I=fetch('-111','500@10','2014-01-01','2014-12-31','6h')
t0=I[0,0]; s0=np.concatenate([I[0,1:4],I[0,4:7]*S2D])
ti,ri=load_icetrja()
H=load_hourly(); t=H[:,0]; m=t>jd_iso('1986-12-01'); rh=data_helio(t[m],gse_to_inertial(t[m],H[m,3:6]))
for srp in (0.0,1e-6,3e-6,1e-5):
    sol=integ(t0,s0,jd_iso('1986-12-01'),srp=srp)
    out=[]
    for s in ['2005-01-01','1997-09-01','1992-01-01','1988-01-01']:
        j=jd_iso(s); k=np.argmin(abs(ti-j)) if j<ti[-1] else None
        if k is None: continue
        d=sol.sol(ti[k])[:3]-ri[k]; out.append('%s %.4f AU (dlon %.2f°)'%(s[:4],np.linalg.norm(d)/AU,np.degrees(np.arctan2(sol.sol(ti[k])[1],sol.sol(ti[k])[0])-np.arctan2(ri[k][1],ri[k][0]))))
    j=t[m][-1]; d=sol.sol(j)[:3]-rh[-1]; out.append('1987-02 vs data %.4f AU'%(np.linalg.norm(d)/AU))
    print('srp',srp,' | '.join(out))
