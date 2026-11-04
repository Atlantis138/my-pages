from explore import *
t4=tday('1983-10-21T16:47')
A5=bvp(moonpt(t4),nov83,guide=gb,step=3); vo5,_=vinf_at(A5,'out',1.5); print('LS4 out vinf (data)',round(np.linalg.norm(vo5),3),flush=True)
for d in np.arange(-3,3.01,0.5):
    t3=tday('1983-09-27T12:00')+d
    for rm in (2.5,5):
        A=bvp(moonpt(t3),moonpt(t4),guide=loop_guide(t3,t4,rm,True),step=2)
        vo,_=vinf_at(A,'out',1.5); vi,_=vinf_at(A,'in',1.5); a,b=rng(A)
        ui=vi/np.linalg.norm(vi); uo=vo5/np.linalg.norm(vo5); turn=np.degrees(np.arccos(np.clip(ui@uo,-1,1)))
        print(date(t3),rm,'err %.2f'%A[2],'LS3out %.3f LS4in %.3f'%(np.linalg.norm(vo),np.linalg.norm(vi)),'turn@LS4 %.0f'%turn,'r %.1f-%.1f'%(a,b),flush=True)
