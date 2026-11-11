from ls import *
import time, sys
side=int(sys.argv[1]); apex=float(sys.argv[2])
t1=tday('1983-03-30T12:00'); t2=tday('1983-04-23T06:00'); t3=tday('1983-09-27T12:00'); t4=tday('1983-10-21T16:47')
T0=time.time()
A1=bvp(dec1,moonpt(t1),guide=gf,step=6); print('A1',round(A1[2],2),round(time.time()-T0),flush=True)
A2=bvp(moonpt(t1),moonpt(t2),guide=inner_guide(t1,t2,2.0),step=3); print('A2',round(A2[2],2),round(time.time()-T0),flush=True)
A4=bvp(moonpt(t3),moonpt(t4),guide=inner_guide(t3,t4,2.0),step=3); print('A4',round(A4[2],2),round(time.time()-T0),flush=True)
A5=bvp(moonpt(t4),nov83,guide=gb,step=3); print('A5',round(A5[2],2),round(time.time()-T0),flush=True)
A3=bvp(moonpt(t2),moonpt(t3),guide=petal_guide(t2,t3,apex,side),step=6); print('A3',round(A3[2],2),'rmax',round(rmax(A3),1),round(time.time()-T0),flush=True)
AR=[A1,A2,A3,A4,A5]
for r in report(AR,[t1,t2,t3,t4]): print('   ',r,flush=True)
pickle.dump(AR,open(f'ar_{side}_{apex}.pkl','wb'))
