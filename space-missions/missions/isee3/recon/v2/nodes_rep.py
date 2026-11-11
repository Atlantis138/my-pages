import pickle; from base import *
N=pickle.load(open('nodes.pkl','rb'))
t=np.array([x[0] for x in N]); med=np.array([x[2].get('med',np.nan) for x in N]); ok=np.array([x[1] is not None for x in N])
for y in range(1978,1988):
    m=(t>=jd_iso(f'{y}-01-01'))&(t<jd_iso(f'{y+1}-01-01'))
    if m.sum(): print(y,'nodes',m.sum(),'none',(~ok[m]).sum(),'med50 %.1f p90 %.1f max %.0f'%tuple(np.nanpercentile(med[m],[50,90,100])))
bad=np.where(ok&(med>60)&(t<jd_iso('1984-02-01')))[0]
print('bad pre84:',len(bad))
for i in bad[:60]: print(iso(t[i]),'med %.0f rms %.0f n %d rej %d'%(med[i],N[i][2]['rms'],N[i][2]['n'],N[i][2]['nrej']), 'r %.0f'%np.linalg.norm(N[i][1][:3]))
