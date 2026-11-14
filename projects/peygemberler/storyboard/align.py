import re,subprocess,json,sys
part=sys.argv[1]
mp3=f'public/vo/ep1/{part}.mp3'
dur=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',mp3],capture_output=True,text=True).stdout)
out=subprocess.run(['ffmpeg','-i',mp3,'-af','silencedetect=noise=-38dB:d=0.35','-f','null','-'],capture_output=True,text=True).stderr
st=[float(x) for x in re.findall(r'silence_start: ([0-9.]+)',out)]
en=[float(x) for x in re.findall(r'silence_end: ([0-9.]+)',out)]
gaps=[(a+b)/2 for a,b in zip(st,en)]
lead=en[0] if st and st[0]<0.05 else 0
rows=[l.split('|',1) for l in open(f'storyboard/part{part}.txt',encoding='utf8').read().strip().split('\n')]
w=[len(re.sub(r'[^\w]','',t))+6*len(re.findall(r'[.…?!:]',t)) for _,t in rows]
tot=sum(w);acc=0;b=[lead]
for x in w[:-1]:
    acc+=x;est=lead+(dur-lead)*acc/tot
    s=min(gaps,key=lambda g:abs(g-est)) if gaps else est
    b.append(s if abs(s-est)<4 and s>b[-1]+0.8 else max(est,b[-1]+0.8))
b.append(dur);res=[]
for i,(k,t) in enumerate(rows):
    a,c=b[i],b[i+1];res.append({'id':k,'start':round(a,2),'end':round(c,2),'text':t})
    print(f"{k:12s} {int(a//60)}:{a%60:05.2f} – {int(c//60)}:{c%60:05.2f} ({c-a:4.1f}s)")
json.dump(res,open(f'storyboard/part{part}.json','w',encoding='utf8'),ensure_ascii=False,indent=1)
