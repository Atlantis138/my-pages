from geotail import *
import pickle, itertools, sys
G=pickle.load(open('g0.pkl','rb'))
dec1=anc(1982,335); nov83=anc(1983,305)
def tday(s): return jd_of(s)
def inner_guide(ta,tb,rmin):
    fa=np.arctan2(*to_rot(ta,moon(ta))[[1,0]]); fb=np.arctan2(*to_rot(tb,moon(tb))[[1,0]])
    if fb<=fa: fb+=2*np.pi
    ra=np.linalg.norm(to_rot(ta,moon(ta))); rb=np.linalg.norm(to_rot(tb,moon(tb)))
    def f(t):
        s=(t-ta)/(tb-ta); ph=fa+(fb-fa)*s; s=min(max(s,0),1); r=(ra+(rb-ra)*s)-((ra+rb)/2-rmin*1e5)*np.sin(np.pi*s)**1.3
        return np.array([r*np.cos(ph),r*np.sin(ph),0.0])
    return guide_from(f)
def petal_guide(ta,tb,apex,side):
    apex=apex*1e5
    pa=to_rot(ta,moon(ta)); pb=to_rot(tb,moon(tb)); tm=(ta+tb)/2
    kn=[(ta,pa),(ta+(tb-ta)*0.22,np.array([apex*0.55, -side*apex*0.33,0])),(tm,np.array([apex,0,0])),
        (tb-(tb-ta)*0.22,np.array([apex*0.55, side*apex*0.33,0])),(tb,pb)]
    return spline_guide(kn)
gf=guide_prop(dec1[0],G['s_dec1'],125)
gb=guide_prop(nov83[0],G['s83n'],-20)
def arcs(t1,t2,t3,t4,petal=(14.5,1),rmin=2.0):
    A1=bvp(dec1,moonpt(t1),guide=gf)
    A2=bvp(moonpt(t1),moonpt(t2),guide=inner_guide(t1,t2,rmin))
    A3=bvp(moonpt(t2),moonpt(t3),guide=petal_guide(t2,t3,*petal),step=4.0)
    A4=bvp(moonpt(t3),moonpt(t4),guide=inner_guide(t3,t4,rmin))
    A5=bvp(moonpt(t4),nov83,guide=gb)
    return [A1,A2,A3,A4,A5]
def report(AR,ts):
    out=[]
    for i,t in enumerate(ts):
        vi,_=vinf_at(AR[i],'in',1.5); vo,_=vinf_at(AR[i+1],'out',1.5)
        a,b=np.linalg.norm(vi),np.linalg.norm(vo); d=np.degrees(np.arccos(np.clip(vi@vo/a/b,-1,1)))
        v=(a+b)/2; rp=4902.8/v**2*(1/np.sin(np.radians(d)/2)-1)
        out.append((date(t),round(a,3),round(b,3),round(d,1),round(rp)))
    return out
def rmax(seg):
    tt,rr,_,_=sample(seg[0],seg[1],1.0); return np.linalg.norm(rr,axis=1).max()/RE
if __name__=='__main__':
    t1=tday('1983-03-30T12:00'); t2=tday('1983-04-23T06:00'); t3=tday('1983-09-27T12:00'); t4=tday('1983-10-21T16:47')
    for side in (1,-1):
        AR=arcs(t1,t2,t3,t4,petal=(14.5,side))
        print('side',side,'errs',[round(a[2],2) for a in AR],'rmax A3',round(rmax(AR[2]),1))
        for r in report(AR,[t1,t2,t3,t4]): print('   ',r)
        pickle.dump(AR,open(f'ar_{side}.pkl','wb'))
