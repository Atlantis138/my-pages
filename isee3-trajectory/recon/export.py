from geotail import *
from d2014 import D as D14
import pickle, json, sys
from scipy.interpolate import CubicSpline
J78=jd_of('1978-01-01')
P1=pickle.load(open('part1.pkl','rb')); G=pickle.load(open('g0.pkl','rb'))
AR=pickle.load(open(sys.argv[1],'rb')); ES=pickle.load(open('esc.pkl','rb'))
LS=[AR[i][0][-1] for i in range(4)]+[ES['t5']]
segs=P1+[G['segJul'],G['segNov']]+AR+[G['seg83a'],ES['A'],ES['B']]
# continuous dense evaluator over all segments
pieces=[]
for ts,S,_ in segs:
    for i in range(len(S)):
        sol=prop(ts[i],S[i],ts[i+1],dense=True); pieces.append((ts[i],ts[i+1],sol.sol))
# launch: back-propagate first state
t0=segs[0][0][0]; s0=segs[0][1][0]
bk=solve_ivp(rhs,(t0,jd_of('1978-08-12T15:12')),s0,method='DOP853',rtol=1e-11,atol=1e-4,dense_output=True)
# extend after escape
tE=segs[-1][0][-1]; sE=prop(segs[-1][0][-2],segs[-1][1][-1],tE).y[:6,-1]
fw=solve_ivp(rhs,(tE,tE+20),sE,method='DOP853',rtol=1e-10,atol=1e-3,dense_output=True)
def state(t):
    if t<t0: return bk.sol(t)
    if t>tE: return fw.sol(t)
    for a,b,f in pieces:
        if a<=t<=b: return f(t)
    raise ValueError(t)
# flyby hyperbolae
MUM=4902.8*S2D**2
fly=[]
for k,tL in enumerate(LS):
    vin=(state(tL-1.5)[3:]-moon_vel(tL-1.5)*S2D); vout=(state(tL+1.5)[3:]-moon_vel(tL+1.5)*S2D)
    v=(np.linalg.norm(vin)+np.linalg.norm(vout))/2; ui=vin/np.linalg.norm(vin); uo=vout/np.linalg.norm(vout)
    d=np.arccos(np.clip(ui@uo,-1,1)); rp=MUM/v**2*(1/np.sin(d/2)-1)
    rp_used = 1737.4+119.4 if k==4 else max(rp,1737.4+300)
    e=1+rp*v**2/MUM; a=MUM/v**2
    p=(ui-uo); p/=np.linalg.norm(p); q=(ui+uo); q/=np.linalg.norm(q)
    n=np.sqrt(MUM/a**3)
    def hyp(t,a=a,e=e,p=p,q=q,n=n,tL=tL):
        M=n*(t-tL); H=np.arcsinh(M/e) if abs(M)<1 else np.sign(M)*np.log(2*abs(M)/e+1.8)
        for _ in range(60): H-=(e*np.sinh(H)-H-M)/(e*np.cosh(H)-1)
        return moon(t)+a*(e-np.cosh(H))*p+a*np.sqrt(e*e-1)*np.sinh(H)*q
    fly.append((tL,hyp,rp,v/S2D,np.degrees(d)))
    print('LS%d'%(k+1),date(tL),'vinf %.3f/%.3f km/s turn %.1f deg  rp_model %d km (alt %d)'%(np.linalg.norm(vin)/S2D,np.linalg.norm(vout)/S2D,np.degrees(d),rp,rp-1737))
def pos(t):
    r=state(t)[:3]
    for tL,hyp,*_ in fly:
        if abs(t-tL)<1.4:
            w=1-smooth(abs(t-tL))
            if w>0: r=r*(1-w)+hyp(t)*w
    return r
def smooth(x):  # 1 near 0.. 0 at >=1.4
    s=np.clip((x-0.35)/(1.4-0.35),0,1); return s*s*(3-2*s)
# sample times
tA=jd_of('1978-08-12T15:12'); tB=tE+20
ts=list(np.arange(tA,tA+1.5,0.01))+list(np.arange(tA+1.5,jd_of('1982-06-01'),0.5))+list(np.arange(jd_of('1982-06-01'),tB,0.25))
for tL in LS: ts+=list(np.arange(tL-1.6,tL+1.6,0.01))
ts=sorted(set(round(t,4) for t in ts))
out=[]
for t in ts:
    r=to_rot(t,pos(t))/1e5; out.append([round(t-J78,3)]+[round(float(x),4) for x in r])
# 2014 track
T14=np.array([d[0] for d in D14]); P14=np.array([d[1] for d in D14])
cs=CubicSpline(T14,P14,axis=0)
t14=sorted(set(list(np.arange(T14[0],T14[-1],0.25))+list(np.arange(jd_of('2014-08-09'),jd_of('2014-08-12'),0.02))+[T14[-1]]))
o14=[[round(t-J78,3)]+[round(float(x),4) for x in to_rot(t,cs(t))/1e5] for t in t14]
d14=[np.linalg.norm(cs(t)-moon(t)) for t in t14]; i=int(np.argmin(d14)); print('2014 closest',date(t14[i]),round(d14[i]),'km from centre')
json.dump(dict(E=out,R=o14,LS=[round(t-J78,4) for t in LS],flyAlt=[round(f[2]-1737.4) for f in fly]),open('track.json','w'),separators=(',',':'))
print(len(out),len(o14))
