# EP2 əsas hissə: heca-nüvə uyğunlaşdırması (align3.py ilə eyni üsul), iki səs faylı.
import re, json, sys
src = open('build/align3.py', encoding='utf8').read().split('res_all=[]')[0]
src = src.replace("OFF = {1: 0.0, 2: 312.45, 3: 312.45 + 397.5575}", "")
exec(src)
import numpy as np
rows = [l.split('|', 1) for l in open('storyboard/ep3_b2.txt', encoding='utf8').read().strip().split('\n')]
SPLIT = 99
OA = 0.0
durA = len(load('public/vo/ep3/bolum2.mp3')) / SR
OB = OA + durA + 0.4
PARTS = [('public/vo/ep3/bolum2.mp3', rows, OA)]
res_all = []; rep = []
for mp3, prow, o in PARTS:
    x = load(mp3); dur = len(x) / SR
    nt, e, fr = nuclei(x); P = pauses(x)
    toks = []
    for sid, text in prow:
        sents = re.split(r'(?<=[.!?…])\s+(?=[A-ZƏÖÜĞİŞÇ“"«(])', text.strip())
        for si, s in enumerate(sents):
            ph = re.split(r'(?<=[,:;—])\s+', s)
            for pi, p in enumerate(ph):
                toks.append({'shot': sid, 'si': si, 'text': p, 'syl': syl(p.replace('950','doqquz yüz əlli').replace('10-cu','onuncu')), 'strong': pi == len(ph) - 1})
    N = sum(t['syl'] for t in toks); M = len(nt)
    rep.append((mp3, N, M, round(M / N, 3)))
    def t_of(k):
        pos = k * (M - 1) / N; i = int(np.floor(pos)); f = pos - i
        if i >= M - 1: return nt[-1]
        return nt[i] * (1 - f) + nt[i + 1] * f
    acc = 0; prev_end = max(0.0, nt[0] - 0.15)
    for k, tk in enumerate(toks):
        acc += tk['syl']
        if k == len(toks) - 1:
            tk['a'] = prev_end; tk['b'] = min(dur, nt[-1] + 0.35); break
        est = (t_of(acc - 0.5) + t_of(acc + 0.5)) / 2
        win = 0.9 if tk['strong'] else 0.5
        c = [(s, e2) for s, e2 in P if s - 0.05 <= est + win and e2 + 0.05 >= est - win and s > prev_end + 0.2]
        if c:
            s, e2 = min(c, key=lambda q: abs((q[0] + q[1]) / 2 - est) - (0.3 if tk['strong'] else 0.1) * min(q[1] - q[0], 0.6))
            tk['a'] = prev_end; tk['b'] = s; prev_end = e2
        else:
            tk['a'] = prev_end; tk['b'] = est; prev_end = est
    for tk in toks:
        res_all.append({'shot': tk['shot'], 'si': tk['si'], 'text': tk['text'], 'a': round(tk['a'] + o, 2), 'b': round(tk['b'] + o, 2)})
print('nüvə/heca:', rep, 'OA', OA, 'OB', round(OB, 3))
json.dump({'OA': OA, 'OB': OB, 'phrases': res_all}, open('build/ep3b_phrases.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
# sətir (shot) səviyyəsi
S = {}
for r in res_all:
    s = S.setdefault(r['shot'], {'start': r['a'], 'end': r['b'], 'sent': {}})
    s['end'] = r['b']
    se = s['sent'].setdefault(r['si'], {'t': r['a'], 'e': r['b']}); se['e'] = r['b']
for k, v in S.items(): v['sent'] = [v['sent'][i] for i in sorted(v['sent'])]
json.dump(S, open('build/ep3b_lines.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
for k in S:
    print(k, S[k]['start'], S[k]['end'])
