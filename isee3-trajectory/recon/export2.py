import json
from final_b import *     # mapped_guide, ballistic template, helpers
import dyn
from d2014 import D as D14
from scipy.interpolate import CubicSpline
J78=jd_of('1978-01-01')
P1=pickle.load(open('part1.pkl','rb')); PR=pickle.load(open('pair12.pkl','rb'))
ES=pickle.load(open('esc.pkl','rb')); B34=pickle.load(open('ballistic34.pkl','rb'))
BK=pickle.load(open('back83.pkl','rb')); bkt=np.array([b[0] for b in BK]); bkp=np.array([b[1][:6] for b in BK])
t1=jd_of('1983-03-30T12:00'); t2=jd_of('1983-04-23T06:00'); t3=B34['t3']; t4=B34['t4']; t5=ES['t5']
A1=PR['1983-03-30T12:00'][0]
csBK=CubicSpline(bkt,bkp[:,:3],axis=0)
tJ=jd_of('1983-06-01'); sJ=np.concatenate([csBK(tJ),bkp[np.argmin(abs(bkt-tJ)),3:]])
X=shoot(t2,moon(t2),tJ,sJ[:3],lambda t: CubicSpline(bkt,bkp,axis=0)(t),step=2)
def dense(segs):
    out=[]
    for ts,S,_ in segs:
        for i in range(len(S)):
            sol=prop(ts[i],S[i],ts[i+1],dense=True); out.append((ts[i],ts[i+1],sol.sol))
    return out
def evaluator(pieces):
    def f(t):
        for a,b,g in pieces:
            if a-1e-9<=t<=b+1e-9: return g(t)[:3]
        raise ValueError(t)
    return f
segsA=P1+[G['segJul'],G['segNov'],A1]
fA=evaluator(dense(segsA))
tmpl=mapped_guide(t1,t2); fT=lambda t: tmpl(t)[:3]
fX=evaluator(dense([X]))
bt34=np.array([y[0] for y in B34['y']]); bp34=np.array([y[1][:3] for y in B34['y']]); cs34=CubicSpline(bt34,bp34,axis=0); fB=lambda t: cs34(t)
fC=evaluator(dense([G['seg83a'],ES['A'],ES['B']]))
# launch backward & escape forward
s0=P1[0][1][0]; tA0=P1[0][0][0]
bk=solve_ivp(rhs,(tA0,jd_of('1978-08-12T15:12')),s0,method='DOP853',rtol=1e-11,atol=1e-4,dense_output=True)
tE=ES['B'][0][-1]; sE=prop(ES['B'][0][-2],ES['B'][1][-1],tE).y[:6,-1]
fw=solve_ivp(rhs,(tE,tE+20),sE,method='DOP853',rtol=1e-10,atol=1e-3,dense_output=True)
def sm(a,b,t): s=np.clip((t-a)/(b-a),0,1); return s*s*(3-2*s)
# LS5 hyperbola
MUM=4902.8*S2D**2
vin=fC(t5-1.5+0.001)-fC(t5-1.5); vin=vin/0.001-moon_vel(t5-1.5)*S2D
vout=(fC(t5+1.501)-fC(t5+1.5))/0.001-moon_vel(t5+1.5)*S2D
v=(np.linalg.norm(vin)+np.linalg.norm(vout))/2; ui=vin/np.linalg.norm(vin); uo=vout/np.linalg.norm(vout)
rp=1737.4+119.4; e=1+rp*v*v/MUM; a=MUM/v**2; n=np.sqrt(MUM/a**3)
p_=(ui-uo); p_/=np.linalg.norm(p_); q_=(ui+uo); q_/=np.linalg.norm(q_)
def hyp5(t):
    M=n*(t-t5); H=np.arcsinh(M/e)
    for _ in range(60): H-=(e*np.sinh(H)-H-M)/(e*np.cosh(H)-1)
    return moon(t)+a*(e-np.cosh(H))*p_+a*np.sqrt(e*e-1)*np.sinh(H)*q_
print('LS5 vinf %.3f turn %.1f'%(v/S2D,np.degrees(np.arccos(np.clip(ui@uo,-1,1)))))
def pos(t):
    if t<tA0: return bk.sol(t)[:3]
    if t<t1-1.6: return fA(t)
    if t<t1-0.2: k=sm(t1-1.6,t1-0.2,t); return fA(t)*(1-k)+fT(t)*k
    if t<t2+0.2: return fT(t)
    if t<t2+1.6: k=sm(t2+0.2,t2+1.6,t); return fT(t)*(1-k)+fX(t)*k
    if t<tJ-4: return fX(t)
    if t<tJ: k=sm(tJ-4,tJ,t); return fX(t)*(1-k)+csBK(t)*k
    if t<bkt[-1]-0.01: return csBK(t)
    r=fC(t) if t<=tE else fw.sol(t)[:3]
    if abs(t-t5)<1.4:
        w=1-sm(0.35,1.4,abs(t-t5)); r=r*(1-w)+hyp5(t)*w
    return r
tS=jd_of('1978-08-12T15:12'); tZ=tE+20
ts=list(np.arange(tS,tS+1.5,0.01))+list(np.arange(tS+1.5,jd_of('1982-06-01'),0.5))+list(np.arange(jd_of('1982-06-01'),tZ,0.25))
for tl in (t1,t2,t3,t4,t5): ts+=list(np.arange(tl-1.6,tl+1.6,0.02))
ts=sorted(set(round(float(t),4) for t in ts if tS<=t<=tZ))
E=[]; mind={}
for t in ts:
    p=pos(t); r=to_rot(t,p)/1e5; E+= [round(t-J78,3)]+[round(float(x),4) for x in r]
LS=[t1,t2,t3,t4,t5]
for k,tl in enumerate(LS):
    tt=np.arange(tl-1.5,tl+1.5,0.005); d=[np.linalg.norm(pos(t)-moon(t)) for t in tt]; i=int(np.argmin(d))
    mind[k]=(date(tt[i]),round(d[i]))
    print('LS%d closest'%(k+1),date(tt[i]),round(d[i]),'km from centre')
T14=np.array([d[0] for d in D14]); P14=np.array([d[1] for d in D14]); c14=CubicSpline(T14,P14,axis=0)
t14=sorted(set([round(float(t),4) for t in list(np.arange(T14[0],T14[-1],0.25))+list(np.arange(jd_of('2014-08-09'),jd_of('2014-08-12'),0.02))+[T14[-1]]]))
R=[]
for t in t14: R+=[round(t-J78,3)]+[round(float(x),4) for x in to_rot(t,c14(t))/1e5]
dd=[(np.linalg.norm(c14(t)-moon(t)),t) for t in t14]; m=min(dd); print('2014 closest',date(m[1]),round(m[0]))
json.dump(dict(E=E,R=R,LS=[round(float(t-J78),4) for t in LS],UNC=[round(t1-J78+1.0,2),round(jd_of('1983-09-20')-J78,2)]),open('track.json','w'),separators=(',',':'))
print('points',len(E)//4,len(R)//4, 'bytes',len(open('track.json').read()))
