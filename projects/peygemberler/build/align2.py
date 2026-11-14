# Dəqiq uyğunlaşdırma: mətndəki durğu işarələrini səsdəki fasilələrlə ardıcıl (yerli sürətlə) eşləşdirir.
import re, json, subprocess
OFF = {1: 0.0, 2: 312.45, 3: 312.45 + 397.5575}
V = set('aıoueəiöüAIOUEƏİÖÜ')
def syl(s): return max(1, sum(ch in V for ch in s))
def pauses(mp3):
    out = subprocess.run(['ffmpeg','-i',mp3,'-af','silencedetect=noise=-38dB:d=0.12','-f','null','-'],capture_output=True,text=True).stderr
    st=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',out)]
    en=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',out)]
    dur=float(re.findall(r'Duration: (\d+):(\d+):([\d.]+)',out)[0][2]) + 60*float(re.findall(r'Duration: (\d+):(\d+):([\d.]+)',out)[0][1])
    return list(zip(st,en)), dur
res_all=[]; stats=[]
for part in (1,2,3):
    rows=[l.split('|',1) for l in open(f'storyboard/part{part}.txt',encoding='utf8').read().strip().split('\n')]
    P, dur = pauses(f'public/vo/ep1/{part}.mp3')
    speech0 = P[0][1] if P and P[0][0] < 0.05 else 0.0
    speech1 = P[-1][0] if P and P[-1][1] > dur - 0.05 else dur
    # tokenlər: (shot, sentence idx, phrase text, boundary strength after)
    toks=[]
    for sid,text in rows:
        sents = re.split(r'(?<=[.!?…])\s+(?=[A-ZƏÖÜĞİŞÇ“"«(])', text.strip())
        for si,s in enumerate(sents):
            ph = re.split(r'(?<=[,:;—])\s+', s)
            for pi,p in enumerate(ph):
                last = pi == len(ph)-1
                strength = 2 if last else 1
                toks.append({'shot':sid,'si':si,'text':p,'syl':syl(p),'strength':strength,'last_in_sent':last})
    tot_syl=sum(t['syl'] for t in toks)
    rate=(speech1-speech0)/tot_syl
    cur=speech0; used=set(); matched=0; strong=0
    for k,tk in enumerate(toks):
        tk['a']=cur
        pred = cur + tk['syl']*rate
        if k==len(toks)-1:
            tk['b']=speech1; break
        win = 1.6 if tk['strength']==2 else 0.8
        mind = 0.22 if tk['strength']==2 else 0.12
        cands=[(s,e) for s,e in P if e-s>=mind and abs(s-pred)<win and s>cur+0.25 and (s,e) not in used]
        if tk['strength']==2: strong+=1
        if cands:
            # yaxınlıq + fasilənin uzunluğu
            s,e=min(cands,key=lambda c: abs(c[0]-pred) - (0.6 if tk['strength']==2 else 0.2)*min(c[1]-c[0],0.8))
            used.add((s,e)); tk['b']=s; nxt=e
            if tk['strength']==2: matched+=1
            obs=(s-cur)/tk['syl']
            rate=0.85*rate+0.15*min(max(obs,rate*0.6),rate*1.6)
        else:
            tk['b']=pred; nxt=pred
        cur=nxt
    stats.append((part,strong,matched,round(rate,3)))
    o=OFF[part]
    for tk in toks:
        res_all.append({'part':part,'shot':tk['shot'],'si':tk['si'],'text':tk['text'],'a':round(tk['a']+o,2),'b':round(tk['b']+o,2),'end_sent':tk['last_in_sent']})
json.dump(res_all,open('build/phrases.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
# shots/sentences in old format
shots={}
order=[]
for r in res_all:
    k=r['shot']
    if k not in shots: shots[k]={'id':k,'part':r['part'],'sent':{},'start':r['a']}; order.append(k)
    s=shots[k]['sent'].setdefault(r['si'],{'t':r['a'],'e':r['b'],'text':''})
    s['e']=r['b']; s['text']=(s['text']+' '+r['text']).strip()
out=[]
for i,k in enumerate(order):
    sh=shots[k]
    sents=[sh['sent'][j] for j in sorted(sh['sent'])]
    nxt = shots[order[i+1]]['start'] if i+1<len(order) else sents[-1]['e']
    out.append({'id':k,'part':sh['part'],'start':sh['start'],'end':round(nxt,2),'sent':sents})
# shot ardıcıllığı: hər shot növbəti shotun başlanğıcına qədər; ilk shot 0-dan
out[0]['start']=0.0
json.dump(out,open('build/sentences.json','w',encoding='utf8'),ensure_ascii=False,indent=1)
print('part, güclü sərhəd, fasiləyə uyğun, sürət(s/heca):',stats)
old={'K04':13.26,'SUAL':17.7,'K05':46.4,'KART-DAYANIN':71.56,'K13':163.13,'K17':222.34,'K25':392.58,'K45':730.41,'K53':916.84}
for o in out:
    if o['id'] in old: print(o['id'],'köhnə',old[o['id']],'yeni',o['start'])
