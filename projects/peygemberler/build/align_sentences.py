# Hər shot daxilində cümlə vaxtlarını səsdəki fasilələrə görə tapır.
import re, json, subprocess
OFF = {1: 0.0, 2: 312.45, 3: 312.45 + 397.5575}
def gaps(mp3):
    out = subprocess.run(['ffmpeg','-i',mp3,'-af','silencedetect=noise=-36dB:d=0.22','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',out)]
    en=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',out)]
    return [((a+b)/2, b-a) for a,b in zip(st,en)]
def split_sent(t):
    parts = re.split(r'(?<=[.!?…])\s+(?=[A-ZƏÖÜĞİŞÇ“"«(])', t.strip())
    return [p for p in parts if p]
def w(t): return len(re.sub(r'[^\w]','',t)) + 5*len(re.findall(r'[.…?!:,]',t))
shots=[]; sents=[]
for part in (1,2,3):
    G = gaps(f'public/vo/ep1/{part}.mp3')
    for r in json.load(open(f'storyboard/part{part}.json',encoding='utf8')):
        s0, s1 = r['start'], r['end']
        ss = split_sent(r['text'])
        ws = [w(x) for x in ss]; tot=sum(ws); acc=0; b=[s0]
        for x in ws[:-1]:
            acc+=x; est=s0+(s1-s0)*acc/tot
            cand=[g for g,d in G if abs(g-est)<1.3 and s0+0.4<g<s1-0.4 and g>b[-1]+0.4]
            b.append(min(cand,key=lambda g:abs(g-est)) if cand else max(est,b[-1]+0.4))
        b.append(s1)
        o=OFF[part]
        sh={'id':r['id'],'part':part,'start':round(s0+o,2),'end':round(s1+o,2),'sent':[]}
        for i,x in enumerate(ss):
            sh['sent'].append({'t':round(b[i]+o,2),'e':round(b[i+1]+o,2),'text':x})
        shots.append(sh)
json.dump(shots,open('build/sentences.json','w',encoding='utf8'),ensure_ascii=False,indent=1)
print(len(shots),'shot', sum(len(s['sent']) for s in shots),'cümlə; son:',shots[-1]['end'])
