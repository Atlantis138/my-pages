from explore import *
res=[]
for d1 in np.arange(-2,2.01,0.5):
    t1=tday('1983-03-30T12:00')+d1
    A1=bvp(dec1,moonpt(t1),guide=gf,step=6); v1,_=vinf_at(A1,'in',1.5); v1=np.linalg.norm(v1)
    for d2 in np.arange(-2,2.01,0.5):
        t2=tday('1983-04-23T06:00')+d2
        for rm in (2.5,5):
            A=bvp(moonpt(t1),moonpt(t2),guide=loop_guide(t1,t2,rm,True),step=2)
            if A[2]>5: continue
            vo,_=vinf_at(A,'out',1.5); vi,_=vinf_at(A,'in',1.5); a,b=rng(A)
            res.append((abs(np.linalg.norm(vo)-v1),date(t1),date(t2),rm,round(v1,3),round(np.linalg.norm(vo),3),round(np.linalg.norm(vi),3),round(a,1),round(b,1)))
            print(res[-1],flush=True)
res.sort(); print('BEST'); [print(r) for r in res[:8]]
