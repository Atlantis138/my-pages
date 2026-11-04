import json, numpy as np, matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt, subprocess
new=json.load(open('../track.json'))
old=json.loads(subprocess.check_output(['git','show','8c7a47f:isee3-trajectory/recon/track.json']))
E=np.array(new['E']).reshape(-1,5); O=np.array(old['E']).reshape(-1,4); Hh=np.array(new['H']).reshape(-1,4); R=np.array(new['R']).reshape(-1,5)
fig,ax=plt.subplots(2,3,figsize=(21,13))
def T(y,m=1,d=1):
    import datetime; return (datetime.date(y,m,d)-datetime.date(1978,1,1)).days
a=ax[0,0]; m=E[:,0]<T(1982,6,10); a.plot(E[m,1],E[m,2],lw=.5); a.set_title('1978–82.06 new (x,y)'); a.set_aspect('equal')
a=ax[0,1]; m=(E[:,0]>T(1982,6,10)); mo=(O[:,0]>T(1982,6,10)); a.plot(O[mo,1],O[mo,2],'r',lw=.5,alpha=.5,label='old'); a.plot(E[m,1],E[m,2],'k',lw=.6,label='new'); a.legend(); a.set_aspect('equal'); a.set_title('1982.06–1984.01 (x,y)')
a=ax[0,2]; m=(E[:,0]>T(1983,3,25))&(E[:,0]<T(1983,10,1)); mo=(O[:,0]>T(1983,3,25))&(O[:,0]<T(1983,10,1)); a.plot(O[mo,1],O[mo,2],'r',lw=.6,alpha=.6); a.plot(E[m,1],E[m,2],'k',lw=.7); a.set_aspect('equal'); a.set_title('1983-03-25..10-01 new(black) old(red)')
a=ax[1,0]; a.plot(E[:,0]/365.25+1978,E[:,4],lw=.5); a.set_title('speed km/s'); a.set_ylim(0,4)
a=ax[1,1]; a.plot(Hh[:,1],Hh[:,2],lw=.4); a.set_aspect('equal'); a.set_title('helio 1984–2014 (10=1AU)')
a=ax[1,2]; a.plot(R[:,1],R[:,2],lw=.8); a.set_aspect('equal'); a.set_title('2014 Earth frame')
plt.tight_layout(); plt.savefig('/tmp/claude-0/-home-user-my-pages/2ef65288-fd0a-5762-89ec-63e0c78851a3/scratchpad/check.png',dpi=60)
