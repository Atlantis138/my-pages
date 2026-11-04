from explore import *
t2=tday('1983-04-23T06:00'); t3=tday('1983-09-25T00:00')
for side in (1,-1):
  for apex in (12,15,17):
    A=bvp(moonpt(t2),moonpt(t3),guide=petal_guide(t2,t3,apex,side),step=5)
    vo,_=vinf_at(A,'out',1.5); vi,_=vinf_at(A,'in',1.5); a,b=rng(A)
    print(side,apex,'err %.2f'%A[2],'LS2out %.3f LS3in %.3f'%(np.linalg.norm(vo),np.linalg.norm(vi)),'r %.1f-%.1f (Re %.0f)'%(a,b,b*1e5/6371),flush=True)
    pickle.dump(A,open(f'A3_{side}_{apex}.pkl','wb'))
