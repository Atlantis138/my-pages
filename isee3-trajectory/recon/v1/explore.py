from ls import *
import sys
def loop_guide(ta,tb,r_mid,ccw=True,turns=0):
    pa=to_rot(ta,moon(ta)); pb=to_rot(tb,moon(tb))
    fa=np.arctan2(pa[1],pa[0]); fb=np.arctan2(pb[1],pb[0])
    if ccw:
        while fb<=fa: fb+=2*np.pi
        fb+=2*np.pi*turns
    else:
        while fb>=fa: fb-=2*np.pi
    ra=np.linalg.norm(pa); rb=np.linalg.norm(pb)
    def f(t):
        s=min(max((t-ta)/(tb-ta),0),1); ph=fa+(fb-fa)*s
        r=ra+(rb-ra)*s+(r_mid*1e5-(ra+rb)/2)*np.sin(np.pi*s)
        return np.array([r*np.cos(ph),r*np.sin(ph),0.0])
    return guide_from(f)
def rng(seg):
    tt,rr,_,_=sample(seg[0],seg[1],0.5); d=np.linalg.norm(rr,axis=1)/1e5; return d.min(),d.max()
if __name__=="__main__":
  ta=tday(sys.argv[1]); tb=tday(sys.argv[2])
  for ccw in (True,False):
    for rm in (0.8,1.5,2.5,5,7,10,13):
      try:
          A=bvp(moonpt(ta),moonpt(tb),guide=loop_guide(ta,tb,rm,ccw),step=2)
          vo,_=vinf_at(A,'out',1.5); vi,_=vinf_at(A,'in',1.5); a,b=rng(A)
          print('ccw' if ccw else 'cw ',rm,'err %.2f'%A[2],'vinf out %.3f in %.3f'%(np.linalg.norm(vo),np.linalg.norm(vi)),'r %.1f-%.1f'%(a,b),flush=True)
      except Exception as e: print(ccw,rm,'fail',e)
