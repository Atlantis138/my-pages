"""Sequential robust local orbit fits to the hourly NSSDC ephemeris. Output: nodes.pkl"""
import sys, pickle, time
from multiprocessing import Pool
from dyn2 import *
def node_times():
    T=[]; t=HT[0]+0.25; tE=HT[-1]-0.5
    dM=np.linalg.norm(HR-MOON(HT),axis=1); dE=np.linalg.norm(HR,axis=1)
    while t<tE:
        i=np.searchsorted(HT,t); i=min(i,len(HT)-1)
        if t<jd_iso('1984-02-01'):
            close=dM[max(0,i-30):i+30].min()<8e4 or dE[max(0,i-30):i+30].min()<2.5e5 or t<HT[0]+3
            h=0.25 if close else 0.5
        else: h=2.0
        T.append(t); t+=h
    return np.array(T)
def W_for(t): return 0.5 if t<jd_iso('1984-02-01') else 2.0
def run(chunk):
    ts=chunk; out=[]; prev=None
    for t in ts:
        W=W_for(t); n=(np.abs(HT-t)<=W).sum()
        if n<8: out.append((t,None,dict(n=int(n)))); continue
        cands=[]
        if prev is not None and abs(prev[0]-t)<3:
            try:
                pa=Arc(prev[0],prev[1],min(prev[0],t-W),t+W)
                cands.append((pa(t)[0],lambda x,pa=pa: pa(x)[:,:3]))
            except Exception: pass
        cands.append((None,None))
        best=None
        for s0,gate in cands:
            try: s,info=fit(t,W=W,s0=s0,gate=gate)
            except Exception as e: continue
            if best is None or info['med']<best[1]['med']: best=(s,info)
            if info['med']<5: break
        if best is None: out.append((t,None,dict(n=int(n)))); continue
        out.append((t,best[0],best[1])); prev=(t,best[0])
    return out
if __name__=='__main__':
    T=node_times(); print('nodes',len(T)); t0=time.time()
    K=16; parts=np.array_split(T,K)
    with Pool(4) as p: res=p.map(run,parts)
    N=[x for r in res for x in r]
    pickle.dump(N,open('nodes.pkl','wb')); print('done %.0fs'%(time.time()-t0))
    med=np.array([x[2].get('med',np.nan) for x in N]); print('med pct',np.nanpercentile(med,[50,90,99]).round(2),'none',sum(x[1] is None for x in N))
