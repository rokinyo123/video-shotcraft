# Səhnə daxilində söz vaxtları: hər səhnənin (etibarlı fasilə sərhədləri) hecalarını o aralıqdakı heca nüvələrinə paylayır.
import re, json
src = open('build/align3.py', encoding='utf8').read().split('res_all=[]')[0]
exec(src)
import numpy as np
x = load('public/vo/ep3/ses_giris.mp3'); nt, e, fr = nuclei(x)
rows = dict(l.split('|', 1) for l in open('storyboard/ep3_intro.txt', encoding='utf8').read().strip().split('\n'))
B = {'K1': (0.0, 5.48), 'K2': (5.87, 18.78), 'K3': (19.12, 30.86), 'K4': (31.12, 37.18), 'K5': (37.44, 43.60), 'K6': (43.91, 49.37), 'K7': (49.64, 58.13), 'K8': (58.40, 78.32)}
def norm(s): return s.replace('80', 'səksən').replace('8 milyard', 'səkkiz milyard')
out = {}
for k, (a, b) in B.items():
    words = norm(rows[k]).split()
    n = [t for t in nt if a - 0.05 <= t <= b + 0.05]
    N = sum(syl(w) for w in words); M = len(n)
    acc = 0; res = []
    for w in words:
        i = int(acc * M / N); res.append((w, round(n[min(i, M - 1)], 2))); acc += syl(w)
    out[k] = res
    print(k, f'syl={N} nuc={M}', ' '.join(f'{w}@{t}' for w, t in res))
json.dump(out, open('build/ep3_words.json', 'w', encoding='utf8'), ensure_ascii=False)
