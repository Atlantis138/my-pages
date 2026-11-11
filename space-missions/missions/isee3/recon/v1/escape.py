from geotail import *
import pickle
G=pickle.load(open('g0.pkl','rb'))
dec83=anc(1983,335)
def helio_target(s,r_au,lon_deg,lat_deg=0.1):
    jd=jd_of(s); lon=(lon_deg-prec(jd))*D2R; lat=lat_deg*D2R
    p=r_au*AU*np.array([cos(lat)*cos(lon),cos(lat)*sin(lon),sin(lat)])
    return jd, p+sun(jd)[0]   # geocentric = heliocentric + (Sun from Earth)
gf=guide_prop(dec83[0],G['s83d'],22)
best=None
for hh in (17.0,18.0,19.0):
    t5=jd_of('1983-12-22')+hh/24
    A=bvp(dec83,moonpt(t5),guide=gf)
    for rr in (0.946,0.947,0.948,0.949):
        tg=helio_target('1984-01-31',rr,132.2)
        sol=prop(dec83[0],G['s83d'],t5+3)  # unused
        B=bvp(moonpt(t5),tg,step=3.0)
        vi,_=vinf_at(A,'in',1.5); vo,_=vinf_at(B,'out',1.5)
        a,b=np.linalg.norm(vi),np.linalg.norm(vo); d=np.degrees(np.arccos(np.clip(vi@vo/a/b,-1,1)))
        v=(a+b)/2; rp=4902.8/v**2*(1/np.sin(np.radians(d)/2)-1)
        print(round(hh,1),rr,'vin %.3f vout %.3f turn %.1f rp %d'%(a,b,d,rp),'errs',round(A[2],2),round(B[2],2),flush=True)
        score=abs(a-b)*10+abs(rp-1856)/4000
        if best is None or score<best[0]: best=(score,hh,rr,A,B)
print('best',best[:3])
pickle.dump(dict(t5=jd_of('1983-12-22')+best[1]/24,A=best[3],B=best[4]),open('esc.pkl','wb'))
