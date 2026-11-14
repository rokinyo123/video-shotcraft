# Heca-əsaslı uyğunlaşdırma: səsdəki heca nüvələrini (enerji zirvələri) sayıb mətndəki hecalarla xəritələyir.
import re, json, subprocess
import numpy as np
from scipy import signal
OFF = {1: 0.0, 2: 312.45, 3: 312.45 + 397.5575}
V = set('aıoueəiöüAIOUEƏİÖÜ')
def syl(s): return max(1, sum(ch in V for ch in s))
SR = 16000
def load(mp3):
    raw = subprocess.run(['ffmpeg','-v','error','-i',mp3,'-ac','1','-ar',str(SR),'-f','s16le','-'],capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
def nuclei(x):
    b = signal.sosfilt(signal.butter(4,[300,2500],'band',fs=SR,output='sos'), x)
    env = signal.sosfiltfilt(signal.butter(2,10,'low',fs=SR,output='sos'), np.abs(b))
    hop = 160; e = env[::hop]; fr = SR/hop
    thr = np.percentile(e, 35)
    pk,_ = signal.find_peaks(e, distance=int(0.085*fr), prominence=0.12*np.percentile(e,90), height=thr)
    return pk/fr, e, fr
def pauses(x):
    hop=160; fr=SR/hop
    rms=np.sqrt(np.convolve(x**2,np.ones(hop)/hop,'same')[::hop])
    db=20*np.log10(rms+1e-6); thr=-38
    quiet=db<thr; P=[]; i=0
    while i<len(quiet):
        if quiet[i]:
            j=i
            while j<len(quiet) and quiet[j]: j+=1
            if (j-i)/fr>=0.12: P.append((i/fr,j/fr))
            i=j
        else: i+=1
    return P
res_all=[]; rep=[]
for part in (1,2,3):
    x = load(f'public/vo/ep1/{part}.mp3'); dur=len(x)/SR
    nt, e, fr = nuclei(x); P = pauses(x)
    rows=[l.split('|',1) for l in open(f'storyboard/part{part}.txt',encoding='utf8').read().strip().split('\n')]
    toks=[]
    for sid,text in rows:
        sents = re.split(r'(?<=[.!?…])\s+(?=[A-ZƏÖÜĞİŞÇ“"«(])', text.strip())
        for si,s in enumerate(sents):
            ph = re.split(r'(?<=[,:;—])\s+', s)
            for pi,p in enumerate(ph):
                toks.append({'shot':sid,'si':si,'text':p,'syl':syl(p),'strong':pi==len(ph)-1})
    N=sum(t['syl'] for t in toks); M=len(nt)
    rep.append((part, N, M, round(M/N,2)))
    # kümulativ heca → vaxt
    def t_of(k):
        pos = k * (M-1) / N
        i = int(np.floor(pos)); f = pos - i
        if i >= M-1: return nt[-1]
        return nt[i]*(1-f)+nt[i+1]*f
    acc=0; prev_end=max(0.0, nt[0]-0.15)
    for k,tk in enumerate(toks):
        acc += tk['syl']
        if k == len(toks)-1:
            tk['a']=prev_end; tk['b']=min(dur, nt[-1]+0.35); break
        est = (t_of(acc-0.5) + t_of(acc+0.5))/2  # son heca ilə növbəti heca arası
        win = 0.9 if tk['strong'] else 0.5
        c=[(s,e2) for s,e2 in P if s-0.05 <= est+win and e2+0.05 >= est-win and s > prev_end+0.2]
        if c:
            s,e2 = min(c, key=lambda q: abs((q[0]+q[1])/2-est) - (0.3 if tk['strong'] else 0.1)*min(q[1]-q[0],0.6))
            tk['a']=prev_end; tk['b']=s; prev_end=e2
        else:
            tk['a']=prev_end; tk['b']=est; prev_end=est
    o=OFF[part]
    for tk in toks:
        res_all.append({'part':part,'shot':tk['shot'],'si':tk['si'],'text':tk['text'],'a':round(tk['a']+o,2),'b':round(tk['b']+o,2)})
print('part, mətn heca, səs nüvə, nisbət:', rep)
json.dump(res_all,open('build/phrases.json','w',encoding='utf8'),ensure_ascii=False,indent=0)
shots={}; order=[]
for r in res_all:
    k=r['shot']
    if k not in shots: shots[k]={'id':k,'part':r['part'],'sent':{},'start':r['a']}; order.append(k)
    s=shots[k]['sent'].setdefault(r['si'],{'t':r['a'],'e':r['b'],'text':''})
    s['e']=r['b']; s['text']=(s['text']+' '+r['text']).strip()
out=[]
for i,k in enumerate(order):
    sh=shots[k]; sents=[sh['sent'][j] for j in sorted(sh['sent'])]
    nxt = shots[order[i+1]]['start'] if i+1<len(order) else sents[-1]['e']+0.5
    out.append({'id':k,'part':sh['part'],'start':sh['start'],'end':round(nxt,2),'sent':sents})
out[0]['start']=0.0
json.dump(out,open('build/sentences.json','w',encoding='utf8'),ensure_ascii=False,indent=1)
old={'K04':13.26,'SUAL':17.7,'K05':46.4,'KART-DAYANIN':71.56,'K13':163.13,'K17':222.34,'K21':312.45,'K25':392.58,'K36':566.68,'K43':710.01,'K45':730.41,'K53':916.84,'K55':985.86}
for o in out:
    if o['id'] in old: print(f"{o['id']:13s} köhnə {old[o['id']]:8.2f}  yeni {o['start']:8.2f}  fərq {o['start']-old[o['id']]:+.2f}")
