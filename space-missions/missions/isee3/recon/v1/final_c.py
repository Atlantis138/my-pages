from final_b import *
import dyn
dyn.EPS_M=1500.0
# real ballistic from Dec 1 1982 (thin softening) gives state on Mar 20
sf=solve_ivp(rhs,(dec1[0],jd_of('1983-03-21')),G['s_dec1'],method='DOP853',rtol=1e-12,atol=1e-5,dense_output=True)
t0=jd_of('1983-03-20'); s0=sf.sol(t0)
t1=jd_of('1983-03-30T12:00'); t2=jd_of('1983-04-23T06:00')
tmpl=mapped_guide(t1,t2)
def guide(t):
    if t<t1-0.5: return sf.sol(t) if t<=jd_of('1983-03-21') else tmpl(t1)
    return tmpl(min(t,t2))
# end point: Moon at t2 offset 25 000 km along the template's approach side
p2=moon(t2)+25000*np.array([0,0,1.0])
def node_times(a,b):
    ts=list(np.arange(a,t1-1.5,2.0))+list(np.arange(t1-1.5,t1+1.5,0.25))+list(np.arange(t1+1.5,b,1.0))+[b]
    return np.array(sorted(set(np.round(ts,4))))
# patch shoot to accept explicit node times
def shoot_nodes(ts,p0,p1,guess,v0,iters=40):
    k=len(ts)-1; S=[np.array(guess(t),float) for t in ts[:-1]]; S[0]=np.concatenate([p0,v0])
    for it in range(iters):
        n=3+6*(k-1); J=np.zeros((6*(k-1)+3,n)); R=np.zeros(6*(k-1)+3)
        for i in range(k):
            yf=prop(ts[i],S[i],ts[i+1],stm=True).y[:,-1]; ph=yf[:6]; Phi=yf[6:].reshape(6,6)
            col=0 if i==0 else 3+6*(i-1); Pc=Phi[:,3:] if i==0 else Phi
            if i<k-1:
                R[6*i:6*i+6]=ph-S[i+1]; J[6*i:6*i+6,col:col+Pc.shape[1]]=Pc; J[6*i:6*i+6,3+6*i:3+6*i+6]-=np.eye(6)
            else:
                R[6*i:6*i+3]=ph[:3]-p1; J[6*i:6*i+3,col:col+Pc.shape[1]]=Pc[:3]
        err=np.abs(R).max(); print('  it',it,round(err,2),flush=True)
        if err<1: break
        dx=np.linalg.lstsq(J,-R,rcond=None)[0]; lam=1.0 if err<2e5 else 0.4
        S[0][3:]+=lam*dx[:3]
        for i in range(1,k): S[i]+=lam*dx[3+6*(i-1):3+6*i]
    return ts,S,err
ts=node_times(t0,t2)
seg=shoot_nodes(ts,s0[:3],p2,guide,s0[3:])
tt,rr,vv,_=sample(seg[0],seg[1],0.02)
d=np.array([np.linalg.norm(r-moon(t)) for t,r in zip(tt,rr)]); dE=np.linalg.norm(rr,axis=1)
i=np.argmin(d[:int(len(d)*0.6)])
print('LS1 pass',date(tt[i]),round(d[i]),'km; dv at Mar20 %.1f m/s'%(np.linalg.norm(seg[1][0][3:]-s0[3:])/S2D*1000),'perigees(Re):',[round(dE[j]/RE,1) for j in range(1,len(dE)-1) if dE[j]<dE[j-1] and dE[j]<dE[j+1]])
pickle.dump(seg,open('seg_mar_apr.pkl','wb'))
