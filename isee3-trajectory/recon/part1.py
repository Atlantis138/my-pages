from common import *
import pickle
A=[(t,p) for t,p,k in ANCH if t<ydoy(1982,182)+0.5]
HA=[(t,p) for t,p in A if ydoy(1978,330)<t<ydoy(1982,140)]
P,f,rms=fit_halo(HA); print('halo period',P,'rms km',rms)
c=f  # print amplitudes
guides={}
for i in range(len(A)-1):
    if A[i][0]>ydoy(1978,300): guides[i]=halo_guide(f,A[i][0],A[i][1],A[i+1][0],A[i+1][1])
segs=run_chain(A,guides,step=5.0)
print('max err',max(s[2] for s in segs))
for i in range(1,len(segs)):
    ts,S,_=segs[i-1]; vin=prop(ts[-2],S[-1],ts[-1]).y[3:6,-1]; vout=segs[i][1][0][3:]
    dv=np.linalg.norm(vin-vout)/S2D*1000
    if dv>3: print('joint',i, datetime.fromtimestamp((segs[i][0][0]-2440587.5)*86400,timezone.utc).date(),'dv m/s',round(dv,1))
pickle.dump(segs,open('part1.pkl','wb'))
