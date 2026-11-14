# Zaman xətti: fon kadrları, üst qatlar, altyazılar, səs effektləri və musiqi bölmələri.
import json, re
S = {s['id']: s for s in json.load(open('build/sentences.json', encoding='utf8'))}
def st(k, i=0): return S[k]['sent'][i]['t']
def en(k, i=-1): return S[k]['sent'][i]['e']
M = 'media/ep1/'
shots, layers, sfx, music, nosub = [], [], [], [], set()

def shot(k, bg, a=None, b=None, tr=0.45):
    shots.append({'id': k, 'a': S[k]['start'] if a is None else a, 'b': S[k]['end'] if b is None else b, 'bg': bg, 'tr': tr})
def L(type, a, b, **p): layers.append({'type': type, 'a': round(a, 2), 'b': round(b, 2), **p})
def fx(name, t, g=1.0): sfx.append({'n': name, 't': round(t, 2), 'g': g})
def vid(k, dur, clip=7.93, start=0.0, minrate=0.5, **kw):
    rate = max(minrate, min(1.0, (clip - start) / dur))
    return {'type': 'video', 'src': f'{M}{k}.mp4', 'last': f'{M}{k}_last.jpg', 'rate': round(rate, 3), 'startFrom': start, 'clipLen': clip, **kw}
def img(k, kb=None, **kw): return {'type': 'image', 'src': f'{M}{k}.jpg', 'kb': kb or [1.03, 0, 0, 1.16, 0, 0], **kw}
def d(k): return S[k]['end'] - S[k]['start']

# ---------- 1. SOYUQ AÇILIŞ ----------
shot('K01', vid('K01', d('K01') + 0.4, clip=4.0, kb=[1.0, 0, 0, 1.06, 0, 0], dark=0.2), tr=0.0)
L('particles', 0, 13.3, kind='dust')
shot('K02', vid('K02', d('K02'), start=1.0, kb=[1.05, 0, 0, 1.12, 0, -1], dark=0.15))
L('particles', 4.6, 13.3, kind='embers', n=40)
shot('K03', img('K03', kb=[1.0, 0, 0, 1.28, 0, 2], dark=0.1))
L('pulse', 10.4, 13.26)
fx('wind', 0.0, 0.8); fx('drone_dark', 0.0, 1.0)
fx('heartbeat', 4.74, 0.9)
fx('whoosh_low', 4.5, 0.6); fx('sub_hit', 10.6, 0.9)
# 13.26 qəfil sükut + möhür
shot('K04', img('K35', kb=[1.08, 2, 0, 1.12, 0, 0], dark=0.55, grade='grayscale(0.6) contrast(1.1)'), tr=0.0)
L('big', st('K04', 0) + 0.15, en('K04', 0) + 0.1, text='Bu səhnə nağıl deyil.'); nosub.add(('K04', 0))
L('stamp', st('K04', 1), en('K04') + 0.3, top='MƏNBƏ', main='SƏHİH MÜSLİM · 2611')
fx('cut_silence', 13.26, 1.0); fx('stamp', st('K04', 1), 1.0); fx('paper', st('K04', 1) + 0.1, 0.6)
# ---------- SUALLAR ----------
q0 = st('SUAL', 2)
shot('SUAL', vid('K13', q0 - S['SUAL']['start'], kb=[1.02, 0, 0, 1.1, 0, 0], dark=0.5), b=q0 + 0.3)
L('particles', S['SUAL']['start'], q0, kind='embers', n=25, alpha=0.6)
qs = [
    (1, 'Adəm həqiqətən otuz metr boyunda idimi?', '…və İbn Həcər niyə bunu izah edə bilmədiyini etiraf etdi?', st('SUAL', 2), en('SUAL', 3), st('SUAL', 3), 'K19.jpg'),
    (2, 'Qadağan meyvə alma deyildisə, bəs nə idi?', None, st('SUAL', 4), en('SUAL', 4), None, 'K38.jpg'),
    (3, 'Adəm Musaya hansı cümlə ilə qalib gəldi?', 'Səhih Buxari · Səhih Müslim', st('SUAL', 5), en('SUAL', 5) - 0.3, st('SUAL', 5) + 3.0, 'K52.jpg'),
]
for n, q, sub, a, b, subAt, im in qs:
    L('qcard', a, b + 0.15, n=n, q=q, sub=sub, subAt=subAt, img=M + im)
    fx('whoosh', a - 0.35, 0.7); fx('impact', a, 0.85)
for i in (2, 3, 4, 5): nosub.add(('SUAL', i))
shots.append({'id': 'QBG', 'a': q0, 'b': en('SUAL'), 'bg': {'type': 'dark'}, 'tr': 0.3})
fx('tension_bed', 13.8, 1.0)
# ---------- BAŞLIQ ----------
ta = S['K05']['start']
L('title', ta, S['K05']['end'] + 0.2); nosub.add(('K05', 0)); nosub.add(('K05', 1))
shots.append({'id': 'K05', 'a': ta, 'b': S['K05']['end'], 'bg': {'type': 'dark'}, 'tr': 0.0})
fx('riser', ta - 5.0, 0.8); fx('braam', ta, 1.0); fx('boom', ta, 1.0)
# ---------- XƏLİFƏ XƏBƏRİ ----------
shot('K06', img('K06', kb=[1.12, 0, 0, 1.02, 0, 0], dark=0.15))
fx('pad_sacred', S['K06']['start'] - 0.5, 1.0); fx('whoosh_low', S['K06']['start'] - 0.4, 0.5)
shot('K07', vid('K07', d('K07') + 1.0, kb=[1.0, 0, 0, 1.08, 0, 1], dark=0.35), b=S['K07']['end'] + 1.0)
L('particles', S['K07']['start'], S['K07']['end'] + 1, kind='lights', n=40, alpha=0.7)
L('ayah', st('K07') + 1.3, en('K07') + 0.9, ar='إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً', az='Mən yer üzündə bir xəlifə yaradacağam.', ref_='BƏQƏRƏ · 2:30')
nosub.add(('K07', 0))
fx('shimmer', st('K07') + 1.2, 0.8); fx('choir_hit', st('K07') + 1.3, 0.7)

# ---------- ALTYAZILAR ----------
subs = []
def chunks(text, a, b, maxc=64):
    words = text.split(); out = []; cur = ''
    for w in words:
        if len(cur) + len(w) + 1 > maxc and cur:
            out.append(cur); cur = w
        else:
            cur = (cur + ' ' + w).strip()
    if cur: out.append(cur)
    tot = sum(len(c) for c in out); t = a; res = []
    for c in out:
        dt = (b - a) * len(c) / tot; res.append({'a': round(t, 2), 'b': round(t + dt - 0.05, 2), 'text': c}); t += dt
    return res
for k, s in S.items():
    for i, x in enumerate(s['sent']):
        if (k, i) in nosub or (k, i - len(s['sent'])) in nosub: continue
        subs += chunks(x['text'], x['t'], x['e'])
json.dump({'shots': shots, 'layers': layers, 'subs': subs, 'sfx': sfx}, open('src/ep1/timeline.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(shots), 'shot ·', len(layers), 'qat ·', len(subs), 'altyazı ·', len(sfx), 'səs effekti')
