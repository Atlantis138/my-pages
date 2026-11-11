from base import *
H=load_hourly(); t=H[:,0]; g=H[:,3:6]
print('n',len(t),iso(t[0]),iso(t[-1]))
r=gse_to_inertial(t,g); m=moon(t); dM=np.linalg.norm(r-m,axis=1); dE=np.linalg.norm(r,axis=1)
dt=np.diff(t)*24
print('step hours: median %.3f  >2h: %d  >6h: %d >24h: %d'%(np.median(dt),(dt>2).sum(),(dt>6).sum(),(dt>24).sum()))
big=np.where(dt>24)[0]; print('gaps>1d:',[(iso(t[i],'%Y-%m-%d'),round(dt[i]/24,1)) for i in big])
for i in range(1,len(t)-1):
    if dM[i]<dM[i-1] and dM[i]<=dM[i+1] and dM[i]<1.2e5: print('moon min',iso(t[i]),int(dM[i]),'dE',int(dE[i]))
for i in range(1,len(t)-1):
    if dE[i]<dE[i-1] and dE[i]<=dE[i+1] and dE[i]<6e5 and t[i]>jd_iso('1978-09-01'): print('earth min',iso(t[i]),int(dE[i]),'Re %.1f'%(dE[i]/6371))
