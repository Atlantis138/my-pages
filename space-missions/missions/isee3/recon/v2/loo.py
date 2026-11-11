from base import *
H=load_hourly(); t=H[:,0]; g=H[:,3:6]; mf=H[:,2]
r=gse_to_inertial(t,g)
sel=t<jd_iso('1984-02-01')
res=np.zeros(len(t))
for i in range(2,len(t)-2):
    idx=[i-2,i-1,i+1,i+2]; tt=t[idx]
    if tt[-1]-tt[0]>0.25: res[i]=np.nan; continue
    # Lagrange cubic through 4 neighbors
    p=np.zeros(3)
    for a in range(4):
        L=1
        for b in range(4):
            if a!=b: L*=(t[i]-tt[b])/(tt[a]-tt[b])
        p+=L*r[idx[a]]
    res[i]=np.linalg.norm(p-r[i])
ok=~np.isnan(res)&sel
print('LOO residual km percentiles (pre-1984):',np.percentile(res[ok],[50,90,99,99.9]).round(2))
bad=np.where(ok&(res>50))[0]
print('n>50km',len(bad))
for i in bad[:80]: print(iso(t[i]),'res %.0f'%res[i],'dE %.0f'%np.linalg.norm(r[i]),'mf',int(mf[i]))
