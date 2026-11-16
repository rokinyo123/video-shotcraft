# EP2 (İdris) əsas hissə: zaman xətti — kadrlar, qatlar, səs effektləri, qlobuslar.
import json, re

PHJ = json.load(open('build/ep2_phrases.json', encoding='utf8'))
PH = PHJ['phrases']
S = json.load(open('build/ep2_lines.json', encoding='utf8'))
ORDER = [f'L{i:02d}' for i in range(1, 82)]
LEAD = 0.2
T0 = 52.0
END = round(S['L81']['end'] + 3.2, 2)
M = 'media/ep2/'
V = set('aıoueəiöüAIOUEƏİÖÜ')
def syl(s): return max(1, sum(c in V for c in s))

def st(k, i=0): return S[k]['sent'][i]['t']
def en(k, i=-1): return S[k]['sent'][i]['e']
def A(k): return S[k]['start'] - LEAD
def B(k):
    i = ORDER.index(k)
    return (S[ORDER[i + 1]]['start'] if i + 1 < len(ORDER) else END) - LEAD
def pt(k, needle):
    rows = [r for r in PH if r['shot'] == k]
    txt = ''; idx = []
    for r in rows:
        idx.append((len(txt), r)); txt += r['text'] + ' '
    c = txt.find(needle)
    if c < 0: raise KeyError((k, needle))
    s0, r = [q for q in idx if q[0] <= c][-1]
    frac = syl(r['text'][: c - s0]) / syl(r['text']) if c > s0 else 0
    return r['a'] + (r['b'] - r['a']) * frac - LEAD

shots, layers, sfx = [], [], []
def shot(id, bg, a, b, tr=0.45): shots.append({'id': id, 'a': round(a, 2), 'b': round(b, 2), 'bg': bg, 'tr': tr})
def L(type, a, b, **p): layers.append({'type': type, 'a': round(a, 2), 'b': round(b, 2), **p})
def fx(n, t, g=1.0, dur=None):
    c = {'n': n, 't': round(t, 2), 'g': g}
    if dur: c['dur'] = round(dur, 2)
    sfx.append(c)
def bed(n, t, g=1.0): fx(n, t, g)
def leak(t): L('leak', t - 0.3, t + 0.8)
def vid(name, dur, start=0.0, kb=None, dark=0.15, blur=0, grade=None, clip=7.93):
    rate = max(0.6, min(1.0, (clip - start - 0.25) / max(0.5, dur)))
    d = {'type': 'video', 'src': f'{M}{name}.mp4', 'rate': round(rate, 3), 'startFrom': start, 'clipLen': clip, 'kb': kb or [1.03, 0, 0, 1.13, 0, 0], 'dark': dark}
    if blur: d['blur'] = blur
    if grade: d['grade'] = grade
    return d
EXPL = dict(dark=0.6, blur=4)       # izah anı: video qaranlıq və bulanıq
def seq(items, a, b, tr=0.35):
    """[(id, clip, kw)] kadrlarını [a,b] aralığına bərabər böl."""
    n = len(items); w = (b - a) / n
    for i, (sid, clip, kw) in enumerate(items):
        x0, x1 = a + i * w, a + (i + 1) * w
        shot(sid, vid(clip, x1 - x0, **kw), x0, x1, tr if i else kw.pop('_tr', 0.45) if '_tr' in kw else 0.45)
def chapter(n, title, t):
    L('chapter', t, t + 3.4, n=n, title=title); leak(t); fx('whoosh_low', t - 0.4, 0.7); fx('boom', t, 0.6)
def source(a, b, label, weak=False, icon=None):
    d = {'label': label}
    if weak: d['weak'] = True
    if icon: d['icon'] = icon
    L('source', a, b, **d)
def dayanin(k, nxt):
    a = st(k) - LEAD
    L('freeze', a - 0.1, A(nxt) + 0.2)
    fx('cut_silence', a - 0.15); fx('sub_hit', a, 1.0); fx('impact', a + 0.05, 0.7)
    L('big', a, A(nxt) + 0.1, text='DAYANIN', size=120, color='#ffe6a6')

# ================= 0. GİRİŞ: treylerdən keçid =================
shot('L01', vid('D1', B('L01') - T0, kb=[1.0, 0, 0, 1.12, 0, 0], **EXPL), T0, B('L01'), 0.6)
chapter(1, 'QARANLIQ DÖVR', T0 + 0.1)
bed('mystery_bed', T0); fx('water', T0, 0.5, dur=B('L02') - T0)
a_on = pt('L01', 'On əsr')
L('tline', A('L01') + 2.6, B('L03'), at0=a_on - 0.2, at1=a_on + 1.4, dimA=A('L03') + 0.6, dimB=B('L03') - 0.4)
source(A('L01') + 0.5, min(a_on + 2.5, A('L02')), 'İbn Hibban, 6190')
for i in range(10): fx('tick', a_on - 0.2 + i * 0.16, 0.5)
shot('L02', vid('D1', B('L02') - A('L02'), start=3.0, kb=[1.12, 0, 0, 1.18, 0, 0], dark=0.45, blur=2), A('L02'), B('L02'), 0.5)
L('chips', A('L02') + 1.0, B('L02') - 0.2, items=[{'text': 'TÖVHİD', 'at': pt('L02', 'haqq yol'), 'c': '#f0d9a0'}], y=74, size=58)
source(A('L02') + 0.7, B('L02') - 0.3, 'əl-Hakim, Müstədrək · İbn Abbas')
shot('L03', vid('D2', B('L03') - A('L03'), kb=[1.05, 0, 0, 1.16, 0, 0], dark=0.2), A('L03'), B('L03'), 0.6)
fx('drip', pt('L03', 'sönməyə'), 0.6)
# --- nəsillər artır / zülm
shot('L04', vid('D3', B('L04') - A('L04'), kb=[1.0, 0, 0, 1.12, 0, -2]), A('L04'), B('L04'), 0.4)
leak(A('L04')); fx('whoosh', A('L04') - 0.3, 0.5); bed('tension_bed', A('L05'), 0.9)
shot('L05', vid('D3', B('L05') - A('L05'), start=3.0, kb=[1.12, 0, 0, 1.2, 0, 0], dark=0.35, grade='saturate(0.6)'), A('L05'), B('L05'), 0.5)
shot('L06', vid('D4', B('L06') - A('L06'), kb=[1.05, 0, 0, 1.15, 0, 0], dark=0.25), A('L06'), B('L06'), 0)
fx('fire', A('L06'), 0.8, dur=B('L06') - A('L06')); fx('impact', A('L06'), 0.7)
L('pulse', A('L06'), B('L06'))
L('chips', A('L06') + 0.2, B('L06') - 0.1, items=[{'text': 'ZÜLM', 'at': pt('L06', 'zülm'), 'c': '#ff8a6a'}, {'text': 'HAQSIZLIQ', 'at': pt('L06', 'haqsızlıq'), 'c': '#ff8a6a'}, {'text': 'AZĞINLIQ', 'at': pt('L06', 'azğınlıq'), 'c': '#ff8a6a'}], y=78, size=50)
for w in ('zülm', 'haqsızlıq', 'azğınlıq'): fx('stamp', pt('L06', w), 0.5)
# --- doğum, soy ağacı
shot('L07', vid('D5', B('L07') - A('L07'), kb=[1.0, 0, 0, 1.1, 0, 0], **EXPL), A('L07'), B('L07'), 0.6)
bed('pad_sacred', A('L07')); fx('shimmer', pt('L07', 'İdris dünyaya'), 0.6)
L('ftree', A('L07') + 0.3, B('L07') + 0.1, at0=A('L07') + 0.5, step=0.55, hiAt=pt('L07', 'İdris dünyaya'))
source(A('L07') + 0.5, B('L07') - 0.2, 'Təbəri, Tarix · İbn İshaq', icon='quill')
shot('L08', vid('GlobeBirth', B('L08') - A('L08'), clip=7.0, kb=[1, 0, 0, 1.04, 0, 0], dark=0.0), A('L08'), B('L08'), 0.5)
source(A('L08') + 0.5, B('L08') - 0.2, 'Tarix mənbələri · rəvayət', weak=True)
fx('whoosh_low', A('L08') - 0.3, 0.6); fx('click', pt('L08', 'Babil'), 0.7); fx('click', pt('L08', 'Misirdə'), 0.7)
# --- adlar
shot('L09', vid('D5', B('L09') - A('L09'), start=2.5, kb=[1.1, 0, 0, 1.18, 0, 0], **EXPL), A('L09'), B('L09'), 0.5)
L('chips', A('L09') + 0.2, B('L09') - 0.1, items=[{'text': 'XANOK', 'at': pt('L09', 'Xanok')}, {'text': 'ƏNUX', 'at': pt('L09', 'Ənux')}, {'text': 'İDRİS', 'at': pt('L09', 'Ənux') + 0.9, 'c': '#f0d9a0'}], y=50, size=70)
shot('L10', vid('D7', B('L10') - A('L10'), kb=[1.0, 0, 0, 1.15, 0, 0], **EXPL), A('L10'), B('L10'), 0.5)
L('strike', A('L10') + 0.2, B('L10') - 0.2, words=['DƏRS → İDRİS?'], strikeAt=pt('L10', 'Amma İbn Kəsir'), repl='QƏDİM BİR AD', replAt=pt('L10', 'daha qədim'))
fx('paper', A('L10') + 0.3, 0.6); fx('impact', pt('L10', 'Amma İbn Kəsir'), 0.7)
source(pt('L10', 'Amma İbn Kəsir'), B('L10') - 0.2, 'İbn Kəsir, Qisasul-Ənbiya', icon='quill')
# --- Quran
shot('L11', vid('D6', B('L11') - A('L11'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.25), A('L11'), B('L11'), 0.6)
leak(A('L11')); bed('pad_sacred', A('L11')); fx('shimmer', A('L11'), 0.6)
L('counter', A('L11') + 0.4, B('L11') - 0.3, **{'from': 0, 'to': 2, 'at': pt('L11', 'cəmi iki'), 'dur': 0.6, 'label': 'QURANDA ADI ÇƏKİLƏN YER', 'y': 30})
shot('L12', vid('D6', B('L13') - A('L12'), start=2.0, kb=[1.12, 0, 0, 1.2, 0, 0], **EXPL), A('L12'), B('L13'), 0.5)
L('ayah', A('L12') + 0.3, B('L13') - 0.1, ar='وَاذْكُرْ فِي الْكِتَابِ إِدْرِيسَ ۚ إِنَّهُ كَانَ صِدِّيقًا نَّبِيًّا ۝ وَرَفَعْنَاهُ مَكَانًا عَلِيًّا', az='Kitabda İdrisi də yad et! O, çox doğru danışan bir peyğəmbər idi. Biz onu uca bir məqama qaldırdıq.', ref_='MƏRYƏM · 19:56–57')
shot('L14', vid('D6', B('L14') - A('L14'), start=4.0, kb=[1.15, 0, 0, 1.22, 0, 0], **EXPL), A('L14'), B('L14'), 0.4)
L('ayah', A('L14') + 0.2, B('L14') - 0.1, ar='وَإِسْمَاعِيلَ وَإِدْرِيسَ وَذَا الْكِفْلِ ۖ كُلٌّ مِّنَ الصَّابِرِينَ', az='İsmayıl, İdris və Zülkifl — hamısı səbir edənlərdən idi.', ref_='ƏNBİYA · 21:85')
# --- Tövrat, 365, Dayanın
shot('L15', vid('D7', B('L15') - A('L15'), start=1.5, kb=[1.0, 0, 0, 1.14, 0, 0], **EXPL), A('L15'), B('L15'), 0.5)
bed('mystery_bed', A('L15')); fx('paper', A('L15'), 0.5)
L('counter', pt('L15', 'üç yüz'), B('L15') - 0.1, **{'from': 0, 'to': 365, 'at': pt('L15', 'üç yüz'), 'dur': 1.6, 'label': 'İL', 'y': 28})
source(A('L15') + 0.4, B('L15') - 0.2, 'Tövrat, Yaradılış 5:23–24', icon='quill')
dayanin('L16', 'L17')
shot('L16', vid('D7', B('L16') - A('L16'), start=4.5, kb=[1.2, 0, 0, 1.22, 0, 0], dark=0.55, blur=5), A('L16'), B('L16'), 0)
shot('L17', vid('ROD', B('L18') - A('L17'), clip=4.03, kb=[1.0, 0, 0, 1.15, 0, 0], **EXPL), A('L17'), B('L18'), 0.4)
L('calendar', A('L17') + 0.2, B('L18') - 0.1, at=pt('L17', 'Bir ildə'), dur=2.2)
bed('pad_sacred', A('L17')); fx('clock', A('L17'), 0.6, dur=B('L18') - A('L17'))
L('constellation', A('L18'), B('L18'))
shot('L19', vid('D8', B('L19') - A('L19'), kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.1), A('L19'), B('L19'), 0.6)
L('quote', pt('L19', 'Sadəcə deyir'), B('L19') - 0.1, text='Allahla birgə yeriyirdi… sonra yox oldu, çünki Allah onu götürdü.', by='Yaradılış 5:24', size=50, side='center')
fx('shimmer', pt('L19', 'sonra yox oldu'), 0.8); fx('wind', A('L19'), 0.5, dur=B('L19') - A('L19'))

# ================= 2-Cİ FƏSİL: İLKLƏR =================
shot('L20', vid('E1', B('L20') - A('L20'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.2), A('L20'), B('L20'), 0.6)
chapter(2, 'İNSANLIĞI DƏYİŞƏN “İLK”LƏR', A('L20'))
bed('epic_bed', A('L20'), 0.85)
shot('L21', vid('E1', B('L21') - A('L21'), start=3.0, kb=[1.12, 0, 0, 1.2, 0, 0], **EXPL), A('L21'), B('L21'), 0.4)
L('chips', A('L21') + 0.3, B('L21') - 0.2, items=[{'text': 'İBN KƏSİR', 'at': pt('L21', 'İbn Kəsir')}, {'text': 'TƏBƏRİ', 'at': pt('L21', 'Təbəri')}, {'text': 'FƏXRƏDDİN ƏR-RAZİ', 'at': pt('L21', 'Fəxrəddin')}], y=46, size=46)
source(A('L21') + 0.3, B('L21') - 0.2, 'Təfsir alimlərinin rəvayətləri', weak=True)
il = [('YAZI', pt('L22', 'O, qələmlə')), ('PALTAR', pt('L23', 'iynə ilə')), ('TƏRƏZİ', pt('L26', 'tərəzi')), ('DƏMİR', pt('L26', 'dəmirdən')), ('ƏKİNÇİLİK', pt('L26', 'əkinçiliyi')), ('ULDUZLAR', pt('L27', 'ulduzların'))]
L('ilk', A('L22'), B('L27'), items=[{'text': t, 'at': a} for t, a in il])
for _, a in il: fx('tick', a, 0.7)
# yazı
w22 = B('L22') - A('L22')
shot('L22a', vid('CLAY', w22 * 0.45, clip=4.03, kb=[1.05, 0, 0, 1.15, 0, 0]), A('L22'), A('L22') + w22 * 0.45, 0.4)
shot('L22b', vid('E2', w22 * 0.55, kb=[1.0, 0, 0, 1.1, 0, 0]), A('L22') + w22 * 0.45, B('L22'), 0.4)
source(A('L22') + 0.3, B('L22') - 0.2, 'İbn Hibban, Əbu Zərr hədisi', weak=True)
fx('sand', A('L22'), 0.5); fx('paper', A('L22') + w22 * 0.45, 0.5)
# paltar
w23 = B('L23') - A('L23')
shot('L23a', vid('NEEDLE', w23 * 0.5, clip=4.03, kb=[1.0, 0, 0, 1.1, 0, 0]), A('L23'), A('L23') + w23 * 0.5, 0)
shot('L23b', vid('FIRE', w23 * 0.5, clip=4.03, kb=[1.05, 0, 0, 1.12, 0, 0], dark=0.25), A('L23') + w23 * 0.5, B('L23'), 0.3)
fx('fire', A('L23') + w23 * 0.5, 0.6, dur=w23 * 0.5)
source(A('L23') + 0.3, B('L23') - 0.2, 'əl-Hakim, Müstədrək · İbn Abbas')
shot('L24', vid('E3', B('L24') - A('L24'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.3), A('L24'), B('L24'), 0.5)
L('callig', pt('L24', 'Sübhanallah') - 0.2, B('L24') - 0.1, ar='سُبْحَانَ اللّٰه', sub='Sübhanallah', y=40)
fx('shimmer', pt('L24', 'Sübhanallah'), 0.6)
shot('L25', vid('E4', B('L25') - A('L25'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.25), A('L25'), B('L25'), 0.5)
L('stamp', pt('L25', 'piri'), B('L25') - 0.3, top='TÜRK ƏSNAF ƏNƏNƏSİ', main='DƏRZİLƏRİN PİRİ')
fx('stamp', pt('L25', 'piri'), 0.8)
# tərəzi, dəmir, əkinçilik
t26 = [A('L26'), pt('L26', 'dəmirdən') - 0.1, pt('L26', 'əkinçiliyi') - 0.1, B('L26')]
shot('L26a', vid('E5', t26[1] - t26[0]), t26[0], t26[1], 0.4)
shot('L26b', vid('E6', t26[2] - t26[1], dark=0.2), t26[1], t26[2], 0)
shot('L26c', vid('E7', t26[3] - t26[2]), t26[2], t26[3], 0)
fx('click', t26[0] + 0.5, 0.6); fx('impact', t26[1] + 0.1, 0.6); fx('whoosh', t26[2] - 0.2, 0.4)
# ulduzlar
shot('L27', vid('ROD', B('L27') - A('L27'), clip=4.03, kb=[1.0, 0, 0, 1.18, 0, 2], dark=0.2), A('L27'), B('L27'), 0.4)
L('constellation', pt('L27', 'ulduzların') - 0.3, B('L27'))
fx('shimmer', pt('L27', 'ulduzların'), 0.7)
# 72 dil, 100 şəhər
t28 = pt('L28', 'şəhərsalma')
shot('L28a', vid('E8', t28 - A('L28'), dark=0.45, blur=2), A('L28'), t28, 0.4)
shot('L28b', vid('E9', B('L28') - t28, dark=0.45, blur=2), t28, B('L28'), 0.35)
L('counter', pt('L28', 'yetmiş iki'), t28 - 0.1, **{'from': 0, 'to': 72, 'at': pt('L28', 'yetmiş iki'), 'dur': 1.2, 'label': 'DİL', 'y': 30})
L('counter', pt('L28', 'yüzə yaxın'), B('L28') - 0.1, **{'from': 0, 'to': 100, 'at': pt('L28', 'yüzə yaxın'), 'dur': 1.2, 'label': 'ŞƏHƏR', 'suffix': '+', 'y': 30})
source(A('L28') + 0.3, B('L28') - 0.2, 'Tarix kitabları · rəvayət', weak=True)
fx('tick', pt('L28', 'yetmiş iki'), 0.6); fx('dig', t28, 0.5, dur=B('L28') - t28)
# Hermes
shot('L29', vid('E10', B('L30') - A('L29'), kb=[1.0, 0, 0, 1.15, 0, 0], dark=0.3), A('L29'), B('L30'), 0.6)
bed('tension_bed', A('L29'), 0.9); leak(A('L29'))
L('big', pt('L29', '"Hermes"'), B('L29') - 0.1, text='HERMES = İDRİS?', size=100, color='#f0d9a0')
L('glitch', pt('L29', '"Hermes"'), pt('L29', '"Hermes"') + 0.6)
L('stamp', A('L30') + 0.4, B('L30') - 0.1, top='QURAN VƏ SƏHİH HƏDİS', main='SÜBUT OLUNMAYIB', color='#e2483a')
fx('stamp', A('L30') + 0.4, 1.0); fx('braam', A('L30') + 0.3, 0.6)

# ================= 3-CÜ FƏSİL: OTUZ SƏHİFƏ =================
shot('L31', vid('F1', B('L31') - A('L31'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.25), A('L31'), B('L31'), 0.6)
chapter(3, 'OTUZ SƏHİFƏ VƏ İLK MÜBARİZƏ', A('L31'))
bed('pad_sacred', A('L31'))
L('counter', pt('L31', 'otuz'), B('L31') - 0.1, **{'from': 0, 'to': 30, 'at': pt('L31', 'otuz'), 'dur': 1.0, 'label': 'SƏHİFƏ', 'y': 30})
source(A('L31') + 0.5, B('L31') - 0.2, 'Təbəri · Əbu Zərr hədisi', weak=True)
shot('L32', vid('D5', B('L32') - A('L32'), start=1.0, kb=[1.05, 0, 0, 1.15, 0, 0], **EXPL), A('L32'), B('L32'), 0.4)
L('chips', A('L32') + 0.2, B('L32') - 0.1, items=[{'text': 'ADƏM', 'at': pt('L32', 'Adəm')}, {'text': 'ŞEYS', 'at': pt('L32', 'Şeysin')}, {'text': 'İDRİS', 'at': pt('L32', 'qoruyub'), 'c': '#f0d9a0'}], y=50, size=66)
fx('paper', A('L32') + 0.3, 0.5)
t33 = pt('L33', 'Bu gün')
shot('L33a', vid('F2', t33 - A('L33'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.2), A('L33'), t33, 0.5)
bed('mystery_bed', A('L33'))
L('big', pt('L33', '"Xanok kitabı"'), t33 - 0.1, text='“XANOK KİTABI”', size=96, color='#f0d9a0')
gb0 = t33; gb1 = pt('L34', 'iki min') - 0.3
shot('L33g', vid('GlobeBooks', gb1 - gb0, clip=9.0, kb=[1, 0, 0, 1.03, 0, 0], dark=0.0), gb0, gb1, 0.5)
shot('L34', vid('F3', B('L34') - gb1, kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.3), gb1, B('L34'), 0.5)
L('counter', gb1 + 0.1, B('L34') - 0.1, **{'from': 0, 'to': 2000, 'at': gb1 + 0.1, 'dur': 1.4, 'label': 'İLDƏN ÇOX', 'suffix': '+', 'y': 30})
source(A('L34') + 0.3, B('L34') - 0.2, 'Qumran (Ölü dəniz) əlyazmaları', icon='search')
fx('whoosh_low', gb0 - 0.3, 0.6); fx('wind', gb1, 0.5, dur=B('L34') - gb1)
shot('L35', vid('D7', B('L35') - A('L35'), start=2.5, kb=[1.08, 0, 0, 1.16, 0, 0], **EXPL), A('L35'), B('L35'), 0.5)
L('columns', A('L35') + 0.4, B('L35') - 0.2, items=[
    {'h': 'XANOK KİTABI', 't': 'Qədim kitab, xalqların yaddaşı', 'at': A('L35') + 0.5, 'icon': 'quill', 'c': '#d6a84e'},
    {'h': 'VƏHY DEYİL', 't': 'Müsəlman alimlər onu vəhy saymır', 'at': pt('L35', 'Müsəlman alimlər'), 'icon': 'cross', 'c': '#e2483a'}])
fx('impact', pt('L35', 'Müsəlman alimlər'), 0.6)
# --- 2-ci səs faylı
shot('L36', vid('F4', B('L36') - A('L36'), kb=[1.0, 0, 0, 1.14, 0, 0], dark=0.2), A('L36'), B('L36'), 0.5)
bed('tension_bed', A('L36')); fx('boom', pt('L36', 'Nuh tufanını'), 0.7); L('flash', pt('L36', 'Nuh tufanını'), pt('L36', 'Nuh tufanını') + 0.5)
fx('wind', A('L36'), 0.6, dur=B('L36') - A('L36'))
shot('L37', vid('D4', B('L37') - A('L37'), start=3.0, kb=[1.1, 0, 0, 1.18, 0, 0], dark=0.3), A('L37'), B('L37'), 0)
fx('fire', A('L37'), 0.7, dur=B('L37') - A('L37')); L('pulse', A('L37'), B('L37'))
shot('L38', vid('F5', B('L38') - A('L38'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.15), A('L38'), B('L38'), 0)
bed('epic_bed', A('L38')); fx('impact', A('L38'), 0.8); fx('dig', A('L38'), 0.6, dur=B('L38') - A('L38'))
source(A('L38') + 0.4, B('L38') - 0.2, 'Tarix mənbələri · rəvayət', weak=True)
shot('L39', vid('F6', B('L39') - A('L39'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.2), A('L39'), B('L39'), 0.5)
L('big', pt('L39', 'ilk dəfə'), B('L39') - 0.2, text='İLK MÜBARİZƏ', size=110, color='#f0d9a0')
fx('braam', pt('L39', 'ilk dəfə'), 0.6)

# ================= 4-CÜ FƏSİL: DÖRDÜNCÜ SƏMA =================
shot('L40', vid('PILLAR', B('L40') - A('L40'), clip=4.03, kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.2), A('L40'), B('L40'), 0.6)
chapter(4, 'ÖLÜM MƏLƏYİ VƏ DÖRDÜNCÜ SƏMA', A('L40'))
bed('mystery_bed', A('L40'))
shot('L41', vid('PILLAR', B('L41') - A('L41'), clip=4.03, start=1.0, kb=[1.1, 0, 0, 1.15, 0, 0], **EXPL), A('L41'), B('L41'), 0.4)
L('columns', A('L41') + 0.3, B('L41') - 0.1, items=[
    {'h': 'QƏTİ MƏLUMAT', 't': 'Quran və səhih hədis', 'at': pt('L41', 'Quranda'), 'icon': 'quran', 'c': '#d6a84e'},
    {'h': 'RƏVAYƏT', 't': 'Tarix kitablarındakı hekayələr', 'at': pt('L41', 'tarix kitablarındakı'), 'icon': 'warn', 'c': '#9a8f80'}])
shot('L42', vid('G1', B('L42') - A('L42'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.3), A('L42'), B('L42'), 0.5)
L('stamp', pt('L42', 'Kəb əl-Əhbardan'), B('L42') - 0.2, top='KƏB ƏL-ƏHBAR', main='İSRAİLİYYAT', color='#c4532b')
fx('stamp', pt('L42', 'Kəb əl-Əhbardan'), 0.9); fx('paper', A('L42'), 0.5)
source(A('L42') + 0.4, pt('L42', 'Kəb əl-Əhbardan') - 0.3, 'İbn Kəsir, Təfsir', icon='quill')
shot('L43', vid('G2', B('L43') - A('L43'), kb=[1.0, 0, 0, 1.14, 0, 0], dark=0.15), A('L43'), B('L43'), 0.6)
bed('pad_sacred', A('L43')); fx('shimmer', A('L43') + 0.5, 0.6); fx('wind', A('L43'), 0.5, dur=B('L44') - A('L43'))
source(A('L43') + 0.4, B('L43') - 0.2, 'Kəb əl-Əhbar rəvayəti', weak=True)
t44 = pt('L44', 'Dördüncü səmaya')
shot('L44a', vid('G2', t44 - A('L44'), start=3.0, kb=[1.1, 0, 0, 1.2, 0, 0]), A('L44'), t44, 0.4)
shot('L44b', vid('G3', B('L44') - t44, kb=[1.0, 0, 0, 1.15, 0, 0], dark=0.2), t44, B('L44'), 0.5)
bed('drone_dark', t44); fx('braam', pt('L44', 'Ölüm mələyi'), 0.7)
shot('L45', vid('G3', B('L46') - A('L45'), start=2.0, kb=[1.1, 0, 0, 1.2, 0, 0], **EXPL), A('L45'), B('L46'), 0.4)
L('dialog', pt('L45', 'Bəs İdris'), B('L45') + 0.3, who='ƏZRAİL', text='Bəs İdris haradadır?', side='left', c='#9fb3c8')
L('dialog', A('L46') + 0.05, B('L46') + 1.2, who='MƏLƏK', text='Kürəyimdədir.', side='right')
shot('L47a', vid('G3', (B('L47') - A('L47')) * 0.6, start=4.0, kb=[1.15, 0, 0, 1.25, 0, 0], **EXPL), A('L47'), A('L47') + (B('L47') - A('L47')) * 0.6, 0.4)
L('quote', A('L47') + 0.3, pt('L47', 'Və onun ruhu') - 0.2, text='Sübhanallah! Mənə əmr olunmuşdu ki, İdrisin ruhunu dördüncü səmada alım…', by='Əzrail · rəvayət', size=48)
t47 = A('L47') + (B('L47') - A('L47')) * 0.6
shot('L47b', vid('G4', B('L47') - t47, kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.1), t47, B('L47'), 0.6)
fx('shimmer', pt('L47', 'Və onun ruhu'), 0.8)
shot('L48', vid('G1', B('L48') - A('L48'), start=3.0, kb=[1.1, 0, 0, 1.18, 0, 0], dark=0.35), A('L48'), B('L48'), 0.5)
source(A('L48') + 0.3, B('L48') - 0.2, 'Digər rəvayət', weak=True)
t49 = pt('L49', 'Cənnətə daxil')
shot('L49a', vid('G5', t49 - A('L49') + 1.5, kb=[1.0, 0, 0, 1.15, 0, 0], dark=0.15), A('L48') + (B('L48') - A('L48')) * 0.7, t49, 0.5)
bed('tension_bed', A('L48') + (B('L48') - A('L48')) * 0.7); fx('fire', A('L48') + (B('L48') - A('L48')) * 0.7, 0.7, dur=t49 - A('L48'))
shot('L49b', vid('G6', B('L50') - t49, kb=[1.0, 0, 0, 1.14, 0, 0], dark=0.25), t49, B('L50'), 0.8)
bed('pad_sacred', t49); fx('water', t49, 0.5, dur=B('L50') - t49); fx('shimmer', t49, 0.7)
ay = [('Hər nəfs ölümü dadacaq', 'mən daddım', 'ALİ-İMRAN 3:185', "'Hər nəfs"), ('Hamı Cəhənnəmə uğrayacaq', 'mən keçdim', 'MƏRYƏM 19:71', "'Hamı"), ('Oradan çıxmayacaqlar', 'mən də çıxmıram', 'HİCR 15:48', "'Onlar")]
L('ayahchecks', A('L50') + 0.2, B('L50') - 0.1, items=[{'q': q, 'r': r, 'ref': f, 'at': pt('L50', nd), 'ok': pt('L50', 'mən' if i == 0 else nd) + 1.2} for i, (q, r, f, nd) in enumerate(ay)])
for _, _, _, nd in ay: fx('tick', pt('L50', nd), 0.6)
# Merac — qəti həqiqət
shot('L51', vid('CLOUDS', B('L51') - A('L51'), clip=4.03, kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.3), A('L51'), B('L51'), 0.6)
bed('epic_bed', A('L51'), 0.9); leak(A('L51'))
L('chips', pt('L51', 'Qurandakı ayə'), B('L51') - 0.1, items=[{'text': 'QURAN', 'at': pt('L51', 'Qurandakı ayə')}, {'text': 'SƏHİH HƏDİS', 'at': pt('L51', 'səhih hədis')}], y=74, size=50)
shot('L52', vid('CLOUDS', B('L55') - A('L52'), clip=4.03, kb=[1.0, 0, 0, 1.25, 0, 0], dark=0.45, blur=2), A('L52'), B('L55'), 0.5)
fx('riser', pt('L52', 'dördüncü qat') - 5.0, 0.7)
L('heavens', A('L52') + 0.3, B('L55') - 0.1, steps=[A('L52') + 1.0 + i * 0.5 for i in range(3)] + [pt('L52', 'dördüncü qat')], mid=A('L55') + 0.3,
  names=['ADƏM', 'YƏHYA VƏ İSA', 'YUSİF', 'İDRİS', 'HARUN', 'MUSA', 'İBRAHİM'], all_at=pt('L52', 'Həzrəti İdrislə') + 0.8)
fx('boom', pt('L52', 'dördüncü qat'), 0.9); fx('choir_hit', pt('L52', 'dördüncü qat'), 0.6)
source(A('L52') + 0.4, A('L53') - 0.1, 'Səhih Buxari, 3207 · Səhih Müslim, 162')
source(A('L53') + 0.2, B('L54') - 0.2, 'Tirmizi, 3157')
L('chips', pt('L54', '"uca məqam"'), B('L54') - 0.1, items=[{'text': 'UCA MƏQAM', 'at': pt('L54', '"uca məqam"')}, {'text': '=', 'at': pt('L54', '"uca məqam"') + 0.4}, {'text': '4-CÜ SƏMA', 'at': pt('L54', 'dördüncü səma'), 'c': '#f0d9a0'}], y=84, size=44)
fx('shimmer', A('L55') + 0.3, 0.6)
shot('L56', vid('PILLAR', B('L56') - A('L56'), clip=4.03, start=0.5, kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.25), A('L56'), B('L56'), 0.5)
L('quote', pt('L56', '"Əməlisaleh'), B('L56') - 0.1, text='Əməlisaleh qardaş və əməlisaleh peyğəmbər, xoş gəldin!', by='Səhih Buxari, 3207', size=52)
bed('pad_sacred', A('L56'))
dayanin('L57', 'L58')
shot('L57', vid('PILLAR', B('L57') - A('L57'), clip=4.03, start=2.5, kb=[1.15, 0, 0, 1.16, 0, 0], dark=0.55, blur=4), A('L57'), B('L57'), 0)
shot('L58', vid('PILLAR', B('L59') - A('L58'), clip=4.03, start=1.0, kb=[1.1, 0, 0, 1.2, 0, 0], **EXPL), A('L58'), B('L59'), 0.3)
bed('mystery_bed', A('L58'))
L('columns', A('L58') + 0.3, B('L59') - 0.1, items=[
    {'h': 'ADƏM', 't': '“Əməlisaleh oğul”', 'mark': '1', 'at': pt('L58', 'birinci səmada'), 'c': '#d6a84e'},
    {'h': 'İDRİS', 't': '“Əməlisaleh qardaş”', 'mark': '4', 'at': pt('L59', 'Bəs İdris'), 'c': '#e2483a'},
    {'h': 'İBRAHİM', 't': '“Əməlisaleh oğul”', 'mark': '7', 'at': pt('L58', 'Yeddinci səmada'), 'c': '#d6a84e'}], focus={'i': 1, 'at': pt('L59', '"oğlum"')})
fx('impact', pt('L59', '"qardaşım"'), 0.8)
shot('L60', vid('D7', B('L63') - A('L60'), start=0.5, kb=[1.0, 0, 0, 1.2, 0, 0], **EXPL), A('L60'), B('L63'), 0.5)
L('columns', A('L60') + 0.3, B('L62') - 0.1, items=[
    {'h': '1-Cİ FİKİR', 't': 'Nuhdan sonra yaşayıb? “İlyas elə İdrisdir.”', 'mark': '?', 'at': A('L61'), 'icon': 'hadith', 'c': '#d6a84e'},
    {'h': '2-Cİ FİKİR', 't': 'Təvazökarlıq: peyğəmbərlər qardaşdır', 'mark': '♡', 'at': A('L62'), 'icon': 'people', 'c': '#f0d9a0'}])
source(pt('L61', 'İmam Buxari'), B('L61') - 0.2, 'Səhih Buxari, Peyğəmbərlər kitabı')
L('big', A('L63') + 0.1, B('L63') - 0.1, text='Qəti cavabı yalnız Allah bilir.', size=74, color='#f0d9a0')

# ================= 5-Cİ FƏSİL: FACİƏ =================
shot('L64', vid('ZIGG', B('L64') - A('L64'), clip=4.03, kb=[1.0, 0, 0, 1.15, 0, -2], dark=0.2), A('L64'), B('L64'), 0.6)
chapter(5, 'GEDİŞİNDƏN SONRAKI FACİƏ', A('L64'))
bed('sorrow_bed', A('L64'))
shot('L65', vid('H1', B('L66') - A('L65'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.3), A('L65'), B('L66'), 0.6)
fx('wind', A('L65'), 0.6, dur=B('L66') - A('L65'))
nm = [('وَدّ', 'VƏDD', "Vədd"), ('سُوَاع', 'SUVA', "Suva"), ('يَغُوث', 'YƏĞUS', "Yəğus"), ('يَعُوق', 'YƏUQ', "Yəuq"), ('نَسْر', 'NƏSR', "Nəsr")]
L('fivenames', A('L66') + 0.2, B('L66') - 0.1, items=[{'ar': a, 'az': z, 'at': pt('L66', nd)} for a, z, nd in nm])
for *_, nd in nm: fx('bell', pt('L66', nd), 0.35)
source(A('L66') + 0.3, B('L66') - 0.2, 'Səhih Buxari, 4920 · Nuh 71:23')
shot('L67', vid('H2', B('L67') - A('L67'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.3), A('L67'), B('L67'), 0.5)
bed('drone_dark', A('L67'))
L('quote', pt('L67', '"Onların'), B('L67') - 0.1, text='Onların oturduğu yerlərə heykəllərini qoyun, xatirələrini yaşadın.', by='şeytanın pıçıltısı', size=48, color='#ffb4a0')
shot('L68', vid('H3', B('L68') - A('L68'), kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.2), A('L68'), B('L68'), 0.5)
shot('L69', vid('H4', B('L69') - A('L69'), kb=[1.0, 0, 0, 1.15, 0, 0], dark=0.2), A('L69'), B('L69'), 0.4)
bed('tension_bed', A('L69')); L('pulse', pt('L69', 'ibadət'), B('L69')); fx('braam', pt('L69', 'ibadət'), 0.7)
shot('L70', vid('D2', B('L70') - A('L70'), start=2.0, kb=[1.1, 0, 0, 1.2, 0, 0], dark=0.35), A('L70'), B('L70'), 0.5)
L('quote', pt('L70', '"O nəsil'), B('L70') - 0.1, text='O nəsil ölüb elm unudulanda, o heykəllərə ibadət olundu.', by='İbn Abbas · Səhih Buxari, 4920', size=54)
fx('drip', pt('L70', 'elm unudulanda'), 0.7)
shot('L71', vid('H4', B('L71') - A('L71'), start=3.0, kb=[1.12, 0, 0, 1.22, 0, 0], dark=0.3, grade='sepia(0.4) saturate(1.6)'), A('L71'), B('L71'), 0.4)
L('big', pt('L71', 'ilk bütpərəstlik'), B('L71') - 0.1, text='İLK BÜTPƏRƏSTLİK', size=110, color='#ff8a6a')
dayanin('L72', 'L73')
shot('L72', vid('H4', B('L72') - A('L72'), start=5.0, kb=[1.2, 0, 0, 1.22, 0, 0], dark=0.55, blur=4), A('L72'), B('L72'), 0)
shot('L73', vid('H3', B('L73') - A('L73'), start=3.0, kb=[1.1, 0, 0, 1.15, 0, 0], dark=0.3), A('L73'), B('L73'), 0.3)
bed('mystery_bed', A('L73'))
gi0 = A('L74')
shot('L74', vid('GlobeIdols', B('L75') - gi0, clip=26.0, kb=[1, 0, 0, 1.03, 0, 0], dark=0.0), gi0, B('L75'), 0.6)
source(A('L74') + 0.3, B('L74') - 0.2, 'Səhih Buxari, 4920 · İbn Abbas')
tribes = [('Vədd', 'KƏLB', 29.81, 39.87), ('Suva', 'HÜZEYL', 21.6, 40.4), ('Yəğus', 'MURAD', 16.9, 45.5), ('Yəuq', 'HƏMDAN', 15.9, 43.6), ('Nəsr', 'HİMYƏR', 14.3, 44.6)]
for nd, *_ in tribes: fx('click', pt('L74', nd), 0.7)
mekke = pt('L75', 'Məkkədə')
fx('shimmer', mekke, 0.6)
shot('L76', vid('H5', B('L76') - A('L76'), kb=[1.0, 0, 0, 1.15, 0, 0], dark=0.15), A('L76'), B('L76'), 0.5)
bed('epic_bed', A('L76')); fx('boom', pt('L76', 'Böyük Tufan'), 1.0); L('flash', pt('L76', 'Böyük Tufan'), pt('L76', 'Böyük Tufan') + 0.5)
fx('water', A('L76'), 0.8, dur=B('L76') - A('L76'))
shot('L77', vid('D2', B('L77') - A('L77'), start=4.0, kb=[1.15, 0, 0, 1.25, 0, 0], dark=0.4), A('L77'), B('L77'), 0.5)
bed('sorrow_bed', A('L77'))
L('big', A('L77') + 0.1, B('L77') - 0.1, text='Elm unudulanda yarandı.', sub='Bütlər bir gündə yaranmadı', size=88, color='#f0d9a0')
shot('L78', vid('H6', B('L78') - A('L78'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.2), A('L78'), B('L78'), 0.6)
L('quote', pt('L78', 'elmin olması'), B('L78') - 0.1, text='Elmin olması kifayət deyil — onu unutmaq olar.', size=56)
shot('L79', vid('H7', B('L79') - A('L79'), kb=[1.0, 0, 0, 1.14, 0, 0], dark=0.15), A('L79'), B('L79'), 0.6)
bed('epic_bed', A('L79')); leak(A('L79')); fx('boom', pt('L79', 'Həzrəti Nuhun'), 0.8)
L('next', pt('L79', 'Həzrəti Nuhun') - 0.3, B('L79') + 0.4, name='NUH', sub='Tufan, gəmi və gəmiyə minməyən oğul')
shot('L80', vid('H7', END - A('L80'), start=3.5, kb=[1.12, 0, 0, 1.2, 0, 0], dark=0.5, blur=3), A('L80'), END, 0.5)
L('comment', A('L80') + 0.1, B('L80') + 0.3, text='Sizcə, bu gün ən çox unudulan elm hansıdır?')
L('subscribe', A('L81') + 0.2, END - 0.6, click=A('L81') + 2.4)
fx('click', A('L81') + 2.4, 0.9); fx('bell', A('L81') + 2.5, 0.6)
fx('cut_silence', END - 0.05)

# ================= QLOBUSLAR (konfiqurasiya) =================
G = '#3ddc84'
def gpin(lat, lon, at, title, sub, c='#d6a84e', left=False, size=0.09):
    d = {'lat': lat, 'lon': lon, 'color': c, 'at': round(at, 2), 'title': title, 'sub': sub, 'size': size}
    if left: d['left'] = True; d['dlon'] = -0.6
    return d
gbL = B('L08') - A('L08')
globes = {
    'GlobeBirth': {'dur': round(gbL + 0.6, 2), 'keys': [[0, 24, 38, 2.9], [gbL * 0.45, 31, 40, 2.0], [gbL + 0.6, 30.5, 38, 1.95]],
                   'pins': [gpin(32.54, 44.42, pt('L08', 'Babil') - A('L08'), 'BABİL', 'Mesopotamiya'), gpin(29.85, 31.25, pt('L08', 'Misirdə') - A('L08'), 'MİSİR', 'rəvayət', c='#c9b98f', left=True)],
                   'highlight': {'368': '#3a2c1a', '818': '#2c2416'}},
    'GlobeBooks': {'dur': round(gb1 - gb0 + 0.6, 2), 'keys': [[0, 10, 39, 2.4], [(gb1 - gb0) * 0.4, 12, 39, 2.2], [gb1 - gb0 + 0.6, 30, 35.8, 1.9]],
                   'pins': [gpin(9.0, 38.7, 0.4, 'EFİOPİYA', 'Xanok kitabı · kilsə kanonu'), gpin(31.74, 35.46, (gb1 - gb0) * 0.55, 'QUMRAN', 'Ölü dəniz əlyazmaları', c=G)],
                   'arcs': [{'from': [9.0, 38.7], 'to': [31.74, 35.46], 'a': (gb1 - gb0) * 0.35, 'b': (gb1 - gb0) * 0.6, 'color': '#d6a84e', 'h': 0.12}]},
}
idL = B('L75') - gi0
pins = [gpin(lat, lon, pt('L74', nd) - gi0, f'{nd.upper()}', f'{tr} qəbiləsi', left=(i % 2 == 1), size=0.075) for i, (nd, tr, lat, lon) in enumerate(tribes)]
pins.append(gpin(21.42, 39.83, mekke - gi0, 'MƏKKƏ', 'bütlərin son məkanı', c='#e2483a', size=0.085))
globes['GlobeIdols'] = {'dur': round(idL + 0.6, 2), 'keys': [[0, 26, 46, 2.8], [3.0, 22, 43, 1.95], [mekke - gi0 - 1.0, 20, 43, 1.95], [idL + 0.6, 21.5, 40.5, 1.7]],
                        'pins': pins, 'highlight': {'682': '#3a2c1a', '887': '#3a2c1a'}}
json.dump(globes, open('src/ep2/globes_ep2.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)

json.dump({'T0': T0, 'END': END, 'shots': shots, 'layers': layers, 'sfx': sfx}, open('src/ep2/timeline.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
# yoxlama: boşluq/qara fon
sh = sorted(shots, key=lambda s: s['a']); gaps = [(a['id'], b['id'], round(b['a'] - a['b'], 2)) for a, b in zip(sh, sh[1:]) if b['a'] - a['b'] > 0.05]
print(len(shots), 'kadr ·', len(layers), 'qat ·', len(sfx), 'səs · END', END, '· boşluq:', gaps or 'YOXDUR')
used = {s['bg']['src'].split('/')[-1][:-4] for s in shots}
allc = [f'{p}{i}' for p, n in (('D', 8), ('E', 10), ('F', 6), ('G', 6), ('H', 7)) for i in range(1, n + 1)]
print('istifadə olunmayan kliplər:', [c for c in allc if c not in used] or 'YOXDUR')
