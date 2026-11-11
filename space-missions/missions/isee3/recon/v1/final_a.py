from explore import *
import dyn
# ballistic LS3->LS4->Nov1 from real data (thin softening)
dyn.EPS_M=300.0
nov83=anc(1983,305)
sb=solve_ivp(rhs,(nov83[0],jd_of('1983-09-24')),G['s83n'],method='DOP853',rtol=1e-12,atol=1e-5,dense_output=True,max_step=0.02)
t3=jd_of('1983-09-27T13:55'); t4=jd_of('1983-10-21T16:33')
s3=sb.sol(t3+1.5); v3out=np.linalg.norm(s3[3:]-moon_vel(t3+1.5)*S2D)/S2D
s4=sb.sol(t4-1.5); v4in=np.linalg.norm(s4[3:]-moon_vel(t4-1.5)*S2D)/S2D
s4o=sb.sol(t4+1.5); v4out=np.linalg.norm(s4o[3:]-moon_vel(t4+1.5)*S2D)/S2D
print('ballistic LS3 out %.3f  LS4 in %.3f out %.3f'%(v3out,v4in,v4out),flush=True)
pickle.dump(dict(t3=t3,t4=t4,y=[ (t,sb.sol(t)) for t in np.arange(jd_of('1983-09-25'),nov83[0],0.01)]),open('ballistic34.pkl','wb'))
dyn.EPS_M=15000.0
t2=jd_of('1983-04-23T06:00')
for s1 in ('1983-03-30T12:00','1983-03-31T00:00','1983-03-31T12:00','1983-03-31T19:19'):
    t1=jd_of(s1); A1=bvp(dec1,moonpt(t1),guide=gf,step=6); v1,_=vinf_at(A1,'in',1.5)
    for rm in (2.5,5):
        A=bvp(moonpt(t1),moonpt(t2),guide=loop_guide(t1,t2,rm,True),step=2)
        vo,_=vinf_at(A,'out',1.5); vi,_=vinf_at(A,'in',1.5); a,b=rng(A)
        print(s1,rm,'A1in %.3f A2out %.3f A2in %.3f r %.1f-%.1f'%(np.linalg.norm(v1),np.linalg.norm(vo),np.linalg.norm(vi),a,b),flush=True)
        pickle.dump((A1,A),open(f'pair12_{s1[5:16]}_{rm}.pkl','wb'))
