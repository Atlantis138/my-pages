from helio2 import *
H=load_hourly(); t=H[:,0]; rg=gse_to_inertial(t,H[:,3:6])
m=t>jd_iso('1984-01-20'); t=t[m]; rh=data_helio(t,rg[m])
ti,ri=load_icetrja()
for s in ['1984-03-01','1984-06-01','1984-09-01','1985-01-01','1985-06-01','1985-09-11','1986-01-01','1986-03-25','1986-09-01','1987-02-01']:
    j=jd_iso(s); k=np.argmin(abs(ti-j)); i=np.searchsorted(t,ti[k])
    if i<=0 or i>=len(t) or t[i]-t[i-1]>3: print(s,'gap'); continue
    w=(ti[k]-t[i-1])/(t[i]-t[i-1]); p=rh[i-1]*(1-w)+rh[i]*w
    d=ri[k]-p; u=p/np.linalg.norm(p)
    print(s,'icetrja-data |d|=%.4f AU (%.0f Mkm) radial %.4f  dlon %.3f deg dz %.4f AU'%(np.linalg.norm(d)/AU,np.linalg.norm(d)/1e6,d@u/AU,np.degrees(np.arctan2(ri[k][1],ri[k][0])-np.arctan2(p[1],p[0])),d[2]/AU))
