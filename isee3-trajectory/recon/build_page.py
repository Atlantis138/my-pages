"""Fill isee3.src.html with model.json / track.json.
Writes ../index.html (with the HTML shell GitHub Pages needs) and, if a path is given, a shell-less copy for Artifacts."""
import json, os, sys
HERE=os.path.dirname(os.path.abspath(__file__))
src=open(os.path.join(HERE,'isee3.src.html'),encoding='utf-8').read()
model=open(os.path.join(HERE,'model.json'),encoding='utf-8').read().strip()
track=open(os.path.join(HERE,'track.json'),encoding='utf-8').read().strip()
json.loads(model); json.loads(track)
page=src.replace('/*MODEL*/',model,1).replace('/*TRACK*/',track,1)
SHELL=('<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n'
 '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
 '<style>:root{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>\n')
head,body=page.split('</style>\n',1)
out=SHELL+head+'</style>\n</head>\n<body>\n'+body.rstrip('\n')+'\n\n</body>\n</html>\n'
open(os.path.join(HERE,'..','index.html'),'w',encoding='utf-8').write(out)
print('index.html',len(out.encode()),'bytes')
if len(sys.argv)>1:
    open(sys.argv[1],'w',encoding='utf-8').write(page); print(sys.argv[1],len(page.encode()),'bytes')
