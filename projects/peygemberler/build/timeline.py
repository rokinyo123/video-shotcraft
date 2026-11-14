# Zaman xətti: fon kadrları, üst qatlar, altyazılar, səs effektləri və musiqi bölmələri.
import json, re
S = {s['id']: s for s in json.load(open('build/sentences.json', encoding='utf8'))}
def st(k, i=0): return S[k]['sent'][i]['t']
def en(k, i=-1): return S[k]['sent'][i]['e']
M = 'media/ep1/'
C_GOLD, C_GOLDSOFT, C_EMBER = '#d6a84e', '#f0d9a0', '#c4532b'
shots, layers, sfx, music, nosub = [], [], [], [], set()

def shot(k, bg, a=None, b=None, tr=0.45):
    shots.append({'id': k, 'a': S[k]['start'] if a is None else a, 'b': S[k]['end'] if b is None else b, 'bg': bg, 'tr': tr})
def L(type, a, b, **p): layers.append({'type': type, 'a': round(a, 2), 'b': round(b, 2), **p})
def fx(name, t, g=1.0, dur=None):
    c = {'n': name, 't': round(t, 2), 'g': g}
    if dur: c['dur'] = round(dur, 2)
    sfx.append(c)
def vid(k, dur, clip=7.93, start=0.0, minrate=0.5, **kw):
    rate = max(minrate, min(1.0, (clip - start) / dur))
    return {'type': 'video', 'src': f'{M}{k}.mp4', 'last': f'{M}{k}_last.jpg', 'rate': round(rate, 3), 'startFrom': start, 'clipLen': clip, **kw}
def img(k, kb=None, **kw): return {'type': 'image', 'src': f'{M}{k}.jpg', 'kb': kb or [1.03, 0, 0, 1.16, 0, 0], **kw}
def d(k): return S[k]['end'] - S[k]['start']

# ---------- 1. SOYUQ AÇILIŞ ----------
shot('K01', vid('K01', d('K01') + 0.4, clip=4.0, kb=[1.0, 0, 0, 1.06, 0, 0], dark=0.2), tr=0.0)
L('particles', 0, 13.3, kind='dust')
L('opener', 0.2, 5.0)
fx('shimmer', 0.4, 0.5); fx('sub_hit', 0.3, 0.6)
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
fx('riser', ta - 5.0, 0.8); fx('cut_silence', ta, 1.0); fx('braam', ta, 1.0); fx('boom', ta, 1.0)
# ---------- XƏLİFƏ XƏBƏRİ ----------
shot('K06', img('K06', kb=[1.12, 0, 0, 1.02, 0, 0], dark=0.15))
fx('pad_sacred', S['K06']['start'] - 0.5, 1.0); fx('whoosh_low', S['K06']['start'] - 0.4, 0.5)
shot('K07', vid('K07', d('K07') + 1.0, kb=[1.0, 0, 0, 1.08, 0, 1], dark=0.35), b=S['K07']['end'] + 1.0)
L('particles', S['K07']['start'], S['K07']['end'] + 1, kind='lights', n=40, alpha=0.7)
L('ayah', st('K07') + 1.3, en('K07') + 0.9, ar='إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً', az='Mən yer üzündə bir xəlifə yaradacağam.', ref_='BƏQƏRƏ · 2:30')
nosub.add(('K07', 0))
fx('shimmer', st('K07') + 1.2, 0.8); fx('choir_hit', st('K07') + 1.3, 0.7)


# ======================= 1-ci HİSSƏ (davamı) =======================
GLOBE = lambda name, clip: {'type': 'video', 'src': f'{M}{name}.mp4', 'rate': 1.0, 'clipLen': clip, 'kb': [1, 0, 0, 1, 0, 0], 'dark': 0.0}
def bed(name, at): fx(name, at, 1.0)

# K08 — mələklərin sualı
shot('K08', img('K08', kb=[1.02, -1, 0, 1.14, 1, 0], dark=0.3))
L('particles', S['K08']['start'], S['K08']['end'], kind='embers', n=45)
L('quote', st('K08', 0) + 1.2, en('K08', 1), text='Orada fəsad törədəcək, qan tökəcək birinimi yaradırsan?', by='Mələklər · Bəqərə 2:30', size=60)
bed('drone_dark', 60.5); fx('fire', 60.7, 0.7); fx('whoosh_low', 60.4, 0.5)
# DAYANIN — kadr donur
k = 'KART-DAYANIN'
shot(k, img('K08', kb=[1.14, 1, 0, 1.2, 1, 0], dark=0.6, grade='grayscale(1) contrast(1.2)'), tr=0.0)
L('big', st(k, 0), en(k, 0) + 0.2, text='DAYANIN…', size=150); nosub.add((k, 0))
L('big', st(k, 2), en(k, 2) + 0.2, text='Haradan bilirdilər?', sub='İnsan hələ yaradılmamışdı', size=110)
fx('cut_silence', st(k, 0), 1); fx('rewind', st(k, 0) - 0.1, 0.9); fx('impact', st(k, 0) + 0.05, 0.9)
bed('mystery_bed', st(k, 1))
# İKİ İZAH
k = 'KART-IZAH'
shot(k, img('K22', kb=[1.05, 0, 0, 1.15, 0, -1], dark=0.62))
L('columns', st(k, 0) + 0.4, en(k, 4) + 0.3, title='TƏFSİR ALİMLƏRİNİN İZAHI', items=[
    {'mark': '1', 'h': 'Allah bildirmişdi', 't': 'Gələcək insanın təbiətini mələklərə əvvəlcədən xəbər vermişdi.', 'at': st(k, 1)},
    {'mark': '2', 'h': '“Xəlifə” sözü', 't': 'Xəlifə — başqasının yerinə gələn. Deməli, ondan əvvəl yer üzündə başqaları yaşayırdı.', 'at': st(k, 2)}],
    focus={'i': 1, 'at': st(k, 3)})
L('big', st(k, 5), en(k, 5) + 0.3, text='Bəs kimlər?', size=120); nosub.add((k, 5))
for i in (1, 2): fx('whoosh', st(k, i) - 0.3, 0.6)
fx('impact', st(k, 5), 0.8)
# K09 — cinlər
shot('K09', img('K09', kb=[1.02, 0, 0, 1.18, 0, 1], dark=0.2), tr=0.2)
L('particles', S['K09']['start'], S['K09']['end'], kind='embers', n=70)
L('source', st('K09', 0) + 0.5, en('K09', 0), label='Təbəri təfsiri', weak=True)
L('verdict', st('K09', 2), en('K09', 3), text='MƏLƏKLƏR BUNU GÖRMÜŞDÜLƏR', c=C_EMBER)
fx('fire', S['K09']['start'], 0.9); fx('boom', st('K09', 1), 0.6); fx('impact', st('K09', 0) + 0.1, 0.6)
# K10 — “bilmədiklərinizi bilirəm”
shot('K10', img('K10', kb=[1.0, 0, 2, 1.15, 0, -1], dark=0.25))
L('ayah', st('K10', 0) + 2.6, en('K10', 1) + 0.3, ar='إِنِّي أَعْلَمُ مَا لَا تَعْلَمُونَ', az='Mən sizin bilmədiklərinizi bilirəm.', ref_='BƏQƏRƏ · 2:30')
L('particles', S['K10']['start'], S['K10']['end'], kind='lights', n=40, alpha=0.8)
fx('shimmer', st('K10', 0) + 2.5, 0.8); fx('choir_hit', st('K10', 0) + 2.6, 0.7)
# K11 — qlobus: bir ovuc torpaq
shot('K11', GLOBE('GlobeSoil', 15.6), b=S['K11']['end'])
L('source', st('K11', 1), en('K11', 1), label='Tirmizi 2955 · Əbu Davud 4693')
bed('pad_sacred', S['K11']['start'] - 0.3); fx('whoosh_low', S['K11']['start'] - 0.5, 0.6)
for tt in (1.2, 2.6, 5.4, 6.6, 8.0, 10.0, 12.6): fx('tick', S['K11']['start'] + tt, 0.6)
# K12 — rənglər
shot('K12', img('K12', kb=[1.02, 0, 1, 1.14, 0, -1], dark=0.45))
L('chips', st('K12', 0), en('K12', 2) + 0.4, y=40, items=[
    {'text': 'qırmızı', 'at': st('K12', 0) + 0.3, 'c': '#e07a5a'}, {'text': 'ağ', 'at': st('K12', 0) + 1.3, 'c': '#f3ecdc'},
    {'text': 'qara', 'at': st('K12', 0) + 2.2, 'c': '#a89a8a'}, {'text': 'yumşaq', 'at': st('K12', 1), 'c': C_GOLD},
    {'text': 'sərt', 'at': st('K12', 1) + 0.8, 'c': C_GOLD}, {'text': 'pis', 'at': st('K12', 2), 'c': C_EMBER}, {'text': 'yaxşı', 'at': st('K12', 2) + 0.6, 'c': '#3ddc84'}])
for i, d_ in ((0, .3), (0, 1.3), (0, 2.2), (1, 0), (1, .8), (2, 0), (2, .6)): fx('tick', st('K12', i) + d_, 0.5)
# K13 — İblis dolanır
shot('K13', vid('K13', d('K13'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.25))
L('stamp', st('K13', 1), st('K13', 1) + 3.2, top='HƏDİS', main='SƏHİH MÜSLİM · 2611')
L('quote', st('K13', 3), en('K13', 3), text='…onun içinin boş olduğunu gördü.', by='Səhih Müslim', size=62)
bed('drone_dark', S['K13']['start']); fx('heartbeat', S['K13']['start'], 0.9, dur=39.6); fx('stamp', st('K13', 1), 1.0); fx('whoosh_low', st('K13', 2), 0.6)
L('particles', S['K13']['start'], S['K14']['end'], kind='embers', n=35, alpha=0.7)
# K14 — içi boş
shot('K14', img('K03', kb=[1.2, 0, 2, 1.32, 0, 3], dark=0.55))
L('chips', st('K14', 1), en('K14', 2) + 0.3, y=42, size=76, items=[
    {'text': 'ACLIQ', 'at': st('K14', 1) + 0.1, 'c': C_EMBER}, {'text': 'QƏZƏB', 'at': st('K14', 1) + 1.2, 'c': C_EMBER},
    {'text': 'ŞƏHVƏT', 'at': st('K14', 1) + 2.4, 'c': C_EMBER}, {'text': 'İSTƏK', 'at': st('K14', 1) + 3.5, 'c': C_EMBER}])
L('pulse', st('K14', 1), en('K14', 3))
L('big', st('K14', 3), en('K14', 3) + 0.3, text='…və bu gün də elə o nöqtədən vurur.', size=70, color=C_EMBER); nosub.add(('K14', 3))
for d_ in (0.1, 1.2, 2.4, 3.5): fx('impact', st('K14', 1) + d_, 0.55)
# K15 — ruh
shot('K15', vid('K15', d('K15') + 0.5, kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.1, grade='saturate(0.55) sepia(0.35) brightness(1.08) hue-rotate(-8deg)'), b=S['K15']['end'] + 0.5)
L('particles', S['K15']['start'], S['K16']['end'], kind='lights', n=60)
bed('pad_sacred', S['K15']['start'] - 0.3); fx('choir_hit', st('K15', 0) + 0.3, 1.0); fx('shimmer', st('K15', 0) + 0.2, 0.9); fx('cut_amb', S['K15']['start'] - 0.2, 1)
# K16 — Əlhəmdulillah
shot('K16', img('K16', kb=[1.04, 0, 0, 1.16, 0, 1], dark=0.3))
L('callig', st('K16', 0) + 1.2, st('K16', 1) + 0.3, ar='الْحَمْدُ لِلَّهِ', sub='Əlhəmdulillah', y=40)
L('quote', st('K16', 1) + 1.6, en('K16', 1) - 0.2, text='Allah sənə rəhm etsin, ey Adəm.', size=64)
L('source', st('K16', 0), st('K16', 1) + 4, label='Tirmizi 3368')
fx('shimmer', st('K16', 0) + 1.2, 0.7)
# K17 — 60 dirsək (miqyas)
shot('K17', {'type': 'dark'}, tr=0.4)
L('scale', S['K17']['start'], S['K17']['end'] + 0.2, ruler=st('K17', 0) + 2.0, build=st('K17', 3) - 0.6, done=st('K17', 2))
L('source', st('K17', 0) + 0.5, st('K17', 0) + 6, label='Səhih Buxari 3326 · 6227')
bed('mystery_bed', S['K17']['start'] - 0.2)
for i in range(12): fx('tick', st('K17', 0) + 2.0 + i * 0.45, 0.45)
fx('impact', st('K17', 2), 0.8); fx('boom', st('K17', 3), 0.5)
# K18 — kiçilmə
shot('K18', vid('K18', d('K18'), kb=[1.0, 0, 0, 1.08, 0, 0], dark=0.25))
fx('wind', S['K18']['start'], 0.6, dur=9)
# K19 — Ələ: qlobus → şəkil
gh = S['K19']['start']
shot('K19g', GLOBE('GlobeHegra', 9.5), a=gh, b=gh + 9.3)
shots[-1]['id'] = 'K19g'
shots.append({'id': 'K19', 'a': gh + 9.3, 'b': S['K19']['end'], 'bg': img('K19', kb=[1.0, 0, 0, 1.14, 2, 0], dark=0.35), 'tr': 0.8})
L('quote', st('K19', 1) + 2.0, en('K19', 3), text='Səmud qövmünün qayalara oyulmuş evləri bu gün də durur. Onların qapıları göstərir ki, o insanların boyu o qədər də uca olmayıb.', by='İbn Həcər əl-Əsqəlani · Fəthul-Bari', size=50)
bed('tension_bed', S['K19']['start']); fx('whoosh_low', gh - 0.4, 0.6); fx('tick', gh + 4.4, 0.7)
# K20 — İbn Həcərin etirafı
shot('K20', img('K20', kb=[1.03, 0, 0, 1.16, -1, 0], dark=0.4))
L('quote', st('K20', 0) + 4.0, st('K20', 1) - 0.4, text='Bu müşkülü aradan qaldıran bir izahı indiyə qədər tapmadım.', by='İbn Həcər · Fəthul-Bari', size=64, color=C_GOLDSOFT)
L('comment', st('K20', 2), en('K20', 3) + 0.5, text='Siz nə düşünürsünüz? Şərhdə yazın')
fx('paper', st('K20', 0) + 4.0, 0.6); fx('impact', st('K20', 0) + 4.0, 0.6); fx('tick', st('K20', 2), 0.7)
# ABUNƏ
k = 'KART-ABUNE'
shot(k, img('K16', kb=[1.2, 0, 0, 1.26, 0, 0], dark=0.75))
L('subscribe', st(k, 0) + 0.3, en(k, 1) + 0.1, click=st(k, 0) + 2.3)
bed('pad_sacred', S[k]['start']); fx('click', st(k, 0) + 2.3, 0.9); fx('bell', st(k, 0) + 2.45, 0.9)

# ======================= 2-ci HİSSƏ =======================
shot('K21', vid('K21', d('K21'), kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.3))
L('quote', st('K21', 0) + 0.5, en('K21', 1), text='Mən sizin bilmədiklərinizi bilirəm.', by='Xatırlayın · Bəqərə 2:30', size=64, color=C_GOLDSOFT)
L('ayah', st('K21', 3), en('K21', 4), ar='وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا', az='Və Adəmə bütün adları öyrətdi.', ref_='BƏQƏRƏ · 2:31')
L('particles', S['K21']['start'], S['K21']['end'], kind='lights', n=50)
bed('mystery_bed', S['K21']['start']); fx('shimmer', st('K21', 3), 0.9); fx('choir_hit', st('K21', 3) + 0.2, 0.7)
shot('K22', img('K22', kb=[1.04, 0, 0, 1.16, 0, 1], dark=0.4))
L('quote', st('K22', 0) + 0.3, st('K22', 2) - 0.3, text='Sən pak və müqəddəssən! Bizim Sənin öyrətdiyindən başqa heç bir biliyimiz yoxdur.', by='Mələklər · Bəqərə 2:32', size=56)
L('big', st('K22', 2), en('K22', 4) + 0.3, text='ELM', sub='Mələklərin görmədiyi tərəf', size=200, color=C_GOLD)
bed('pad_sacred', S['K22']['start']); fx('braam', st('K22', 2), 0.6)
shot('K23', img('K23', kb=[1.02, 0, 0, 1.15, 0, 0], dark=0.3))
L('chips', st('K23', 1) + 3.0, en('K23', 1) + 0.5, y=38, size=60, items=[
    {'text': 'Əssəlamu əleykum', 'at': st('K23', 1) + 3.0, 'c': '#f3ecdc'},
    {'text': 'Əssəlamu əleykə', 'at': st('K23', 1) + 6.0, 'c': '#f3ecdc'},
    {'text': '+ və rəhmətullah', 'at': st('K23', 1) + 8.5, 'c': C_GOLD}])
L('source', st('K23', 0) + 1, en('K23', 1), label='Səhih Buxari 6227')
L('particles', S['K23']['start'], S['K23']['end'], kind='lights', n=50)
fx('shimmer', st('K23', 1) + 8.5, 0.7)
shot('K24', vid('K24', d('K24'), kb=[1.0, 0, 0, 1.08, 0, 0], dark=0.25))
L('ayah', st('K24', 0) + 1.2, en('K24', 0) + 0.2, ar='اسْجُدُوا لِآدَمَ', az='Adəmə səcdə edin!', ref_='BƏQƏRƏ · 2:34')
bed('epic_bed', S['K24']['start']); fx('braam', S['K24']['start'] + 1.2, 0.9); fx('choir_hit', S['K24']['start'] + 1.2, 0.9)
shot('K25', vid('K25', 4.0, kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.15), b=S['K25']['end'] + 2.0, tr=0.0)
L('big', st('K25', 0) + 0.1, en('K25', 0) + 2.0, text='İBLİSDƏN BAŞQA', size=130, color=C_EMBER); nosub.add(('K25', 0))
fx('cut_silence', S['K25']['start'], 1); fx('boom', S['K25']['start'] + 0.1, 1.0); fx('fire', S['K25']['start'], 0.9, dur=6)
# K26 — od vs palçıq
k26a = S['K25']['end'] + 2.0
shot('K26', {'type': 'dark'}, a=k26a, tr=0.4)
L('columns', k26a + 0.2, en('K26', 1) - 2.5, title='İBLİSİN MƏNTİQİ', items=[
    {'h': 'OD', 't': '“Məni oddan yaratdın…”', 'c': C_EMBER, 'at': k26a + 0.3, 'img': M + 'K28.jpg'},
    {'h': 'PALÇIQ', 't': '“…onu isə palçıqdan.”', 'c': '#b08a5a', 'at': st('K26', 1), 'img': M + 'K03.jpg'}])
L('stamp', en('K26', 1) - 2.6, en('K26', 1) + 0.3, top='TARİXDƏ İLK', main='İRQÇİLİK', color=C_EMBER)
bed('drone_dark', k26a); fx('whoosh', k26a + 0.2, 0.6); fx('whoosh', st('K26', 1) - 0.3, 0.6); fx('stamp', en('K26', 1) - 2.6, 1.0)
# K27 — Mənbə yoxlaması: İblis cin idi
shot('K27', img('K27', kb=[1.02, 0, 0, 1.14, 0, 0], dark=0.55))
L('stamp', st('K27', 0) + 0.2, st('K27', 2) - 0.2, top='MƏNBƏ YOXLAMASI', main='İBLİS MƏLƏK İDİMİ?')
L('ayah', st('K27', 2), st('K27', 2) + 4.6, ar='كَانَ مِنَ الْجِنِّ', az='O, cinlərdən idi.', ref_='KƏHF · 18:50')
L('columns', st('K27', 2) + 4.8, en('K27', 3) + 0.4, items=[
    {'h': 'MƏLƏK', 't': 'nurdan', 'c': '#fff3cf', 'at': st('K27', 2) + 4.9},
    {'h': 'CİN', 't': 'tüstüsüz oddan', 'c': '#7fb3ff', 'at': st('K27', 3)},
    {'h': 'İNSAN', 't': 'palçıqdan', 'c': '#b08a5a', 'at': st('K27', 3) + 1.2}])
L('source', st('K27', 4), en('K27', 4), label='Təbəri · İbn Abbas rəvayəti', weak=True)
L('verdict', st('K27', 5) + 1.0, en('K27', 5) + 0.3, text='ALİMLƏRİN ƏKSƏRİYYƏTİ: CİN')
bed('tension_bed', S['K27']['start']); fx('stamp', st('K27', 0) + 0.2, 1.0); fx('shimmer', st('K27', 2), 0.6)
for x_ in (st('K27', 2) + 4.9, st('K27', 3), st('K27', 3) + 1.2): fx('whoosh', x_ - 0.3, 0.5)
fx('impact', st('K27', 5) + 1.0, 0.7)
# K28 — qovulma
shot('K28', vid('K28', d('K28'), kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.2))
L('big', st('K28', 1), en('K28', 1) + 1.2, text='QİYAMƏTƏ QƏDƏR MÖHLƏT', size=90, color=C_EMBER)
L('source', st('K28', 0), en('K28', 2), label='Hicr 15:36–38')
bed('drone_dark', S['K28']['start']); fx('whoosh_low', S['K28']['start'], 0.8); fx('boom', st('K28', 1), 0.7)
# K29 — əhd
shot('K29', vid('K29', d('K29'), kb=[1.0, 0, 0, 1.15, 0, 0], dark=0.25))
L('ayah', st('K29', 1) + 6.0, en('K29', 1) + 0.3, ar='أَلَسْتُ بِرَبِّكُمْ ۖ قَالُوا بَلَىٰ شَهِدْنَا', az='Mən sizin Rəbbiniz deyiləmmi? — Bəli, şahidik!', ref_='ƏRAF · 7:172')
L('big', st('K29', 2) - 2.2, en('K29', 3) + 0.4, text='Bu sual sizə də verilib.', size=84)
bed('pad_sacred', S['K29']['start']); fx('choir_hit', st('K29', 1) + 6.0, 0.9); fx('shimmer', st('K29', 1) + 6.0, 0.7)
# K30 — nəsil (nur zərrələri, kodla)
shot('K30', vid('K29', d('K30'), start=3.0, kb=[1.15, 0, 0, 1.3, 0, 0], dark=0.35))
L('particles', S['K30']['start'], S['K30']['end'], kind='lights', n=110)
L('source', st('K30', 0), en('K30', 2), label='Tirmizi 3076')
# K31 — Davud
shot('K31', img('K31', kb=[1.02, 0, 0, 1.25, 4, 0], dark=0.3))
L('dialog', st('K31', 2), st('K31', 3) + 0.2, who='ADƏM', text='Ya Rəbb, bu kimdir?', side='left')
L('big', st('K31', 3), st('K31', 3) + 2.4, text='DAVUD', size=170, color='#fff3cf')
L('dialog', st('K31', 3) + 2.4, en('K31', 3), who='ADƏM', text='Onun ömrünü nə qədər etdin? — Altmış il.', side='left')
fx('shimmer', st('K31', 3), 0.8); fx('impact', st('K31', 3), 0.5)
# K32 — 40 il
shot('K32', {'type': 'dark'}, a=S['K32']['start'], b=S['K32']['end'] + 3.0, tr=0.4)
L('bars', S['K32']['start'], S['K32']['end'] + 3.0, cut=S['K32']['start'] + 2.0, join=S['K32']['start'] + 3.0)
bed('mystery_bed', S['K32']['start']); fx('sand', S['K32']['start'] + 1.8, 0.8)
# K33 — ölüm mələyi
k33a = S['K32']['end'] + 3.0
shot('K33', img('K33', kb=[1.02, 0, 0, 1.14, -1, 0], dark=0.35), a=k33a)
layers.append({'type': 'counter', 'a': round(k33a + 0.2, 2), 'b': round(st('K33', 2) + 1.5, 2), 'from': 0, 'to': 960, 'at': round(k33a + 0.2, 2), 'dur': 2.2, 'label': 'İL', 'y': 26})
L('dialog', st('K33', 2), st('K33', 2) + 4.4, who='ADƏM', text='Axı mənim ömrümdən hələ qırx il qalmayıbmı?', side='left')
L('dialog', st('K33', 2) + 4.4, en('K33', 2) - 1.5, who='ÖLÜM MƏLƏYİ', text='Məgər onu oğlun Davuda verməmişdinmi?', side='right', c='#cfd8e6')
fx('clock', k33a, 0.6, dur=en('K33', 2) - k33a); fx('whoosh_low', st('K33', 1), 0.6)
# K34 — unutdu
shot('K34', img('K34', kb=[1.04, 0, 0, 1.18, 2, 0], dark=0.4))
L('chips', st('K34', 0) + 1.5, en('K34', 2) + 0.4, y=42, size=54, items=[
    {'text': 'inkar etdi', 'at': st('K34', 0) + 2.0, 'c': C_EMBER}, {'text': 'unutdu', 'at': st('K34', 1), 'c': C_GOLD}, {'text': 'xəta etdi', 'at': st('K34', 2), 'c': '#cfd8e6'}])
for x_ in (st('K34', 0) + 2.0, st('K34', 1), st('K34', 2)): fx('impact', x_, 0.5)
fx('paper', st('K34', 0), 0.5)
# K35 — ən uzun ayə
shot('K35', img('K35', kb=[1.04, 0, 0, 1.16, 0, 0], dark=0.45))
L('stamp', st('K35', 1), st('K35', 2), top='BƏQƏRƏ · 2:282', main='ƏN UZUN AYƏ')
L('big', st('K35', 2), en('K35', 3) + 0.3, text='Çünki insan unudur.', size=96, color=C_GOLDSOFT); nosub.add(('K35', 2))
fx('stamp', st('K35', 1), 1.0); fx('paper', st('K35', 0), 0.5)
# K36 — Cənnət
shot('K36', vid('K36', d('K36'), kb=[1.0, 0, 0, 1.08, 0, 0], dark=0.1))
L('source', st('K36', 0) + 1, en('K36', 0), label='Nisa 4:1')
bed('pad_sacred', S['K36']['start']); fx('water', S['K36']['start'], 0.7, dur=d('K36') + d('K37'))
shot('K37', img('K37', kb=[1.0, 0, 0, 1.14, 0, -1], dark=0.35))
L('ayah', st('K37', 0) + 1.0, en('K37', 0) + 0.3, ar='وَلَا تَقْرَبَا هَٰذِهِ الشَّجَرَةَ', az='Bu ağaca yaxınlaşmayın.', ref_='BƏQƏRƏ · 2:35')
fx('shimmer', st('K37', 0) + 1, 0.5)
# K38 — alma
shot('K38', img('K38', kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.3), tr=0.0)
L('stamp', st('K38', 0), st('K38', 1) + 1.0, top='MƏNBƏ YOXLAMASI · 2', main='ALMA?')
L('xmark', st('K38', 1) + 3.0, en('K38', 1) + 0.3)
bed('tension_bed', S['K38']['start']); fx('stamp', st('K38', 0), 1.0); fx('impact', st('K38', 1) + 3.0, 0.9)
shot('K39', img('K39', kb=[1.02, 0, 0, 1.14, 0, 0], dark=0.35))
L('chips', st('K39', 0) + 1.6, en('K39', 1) + 0.3, y=30, items=[{'text': 'buğda ?', 'at': st('K39', 0) + 1.6}, {'text': 'üzüm ?', 'at': st('K39', 0) + 2.4}, {'text': 'əncir ?', 'at': st('K39', 0) + 3.2}])
L('big', st('K39', 3), en('K39', 4) + 0.3, text='Məsələ meyvədə deyildi', sub='Məsələ — əmrə itaətdə idi', size=84); nosub.add(('K39', 3)); nosub.add(('K39', 4))
for x_ in (1.6, 2.4, 3.2): fx('tick', st('K39', 0) + x_, 0.5)
k = 'KART-MALUM'
shot(k, img('K38', kb=[1.2, 0, 0, 1.3, 0, 0], dark=0.75, grade='grayscale(0.6)'))
L('malum', st(k, 1), en(k, 2) + 0.3, split=st(k, 1) + 3.5)
fx('whoosh', st(k, 1) - 0.2, 0.6); fx('impact', st(k, 1) + 3.5, 0.6)
# K40 — ikinci əfsanə
shot('K40', img('K40', kb=[1.02, 0, 0, 1.12, 0, 0], dark=0.6))
L('stamp', st('K40', 0), st('K40', 1) + 0.6, top='MƏNBƏ YOXLAMASI · 3', main='GÜNAHI HƏVVA İŞLƏTDİ?', color=C_EMBER)
k40 = S['K40']['sent'][2]
seg = (k40['e'] - k40['t'])
L('columns', k40['t'], k40['e'] - 3.5, title='QURAN NƏ DEYİR?', items=[
    {'h': 'İkisinə birlikdə', 't': 'Şeytan ikisinə vəsvəsə edir.', 'c': C_GOLD, 'at': k40['t'] + 0.3, 'mark': 'Əraf 7:20'},
    {'h': '“Ey Adəm…”', 't': 'Şeytan birbaşa Adəmə müraciət edir.', 'c': C_GOLD, 'at': k40['t'] + seg * 0.42, 'mark': 'Taha 20:120'},
    {'h': 'Adəm asi oldu', 'ar': 'وَعَصَىٰ آدَمُ رَبَّهُ', 't': 'Səhv Adəmin adı ilə çəkilir.', 'c': C_GOLD, 'at': k40['t'] + seg * 0.62, 'mark': 'Taha 20:121'}])
L('verdict', k40['e'] - 3.4, k40['e'] + 0.2, text='QURAN SƏHVİ QADINA YÜKLƏMİR')
fx('stamp', st('K40', 0), 1.0)
for x_ in (0.3, seg * 0.42, seg * 0.62): fx('whoosh', k40['t'] + x_ - 0.3, 0.5)
fx('impact', k40['e'] - 3.4, 0.7)
k = 'KART-HEDIS'
shot(k, img('K35', kb=[1.1, 0, 0, 1.18, 0, 0], dark=0.65))
L('quote', st(k, 0) + 1.5, en(k, 0), text='Həvva olmasaydı, heç bir qadın ərinə xəyanət etməzdi.', by='Səhih Buxari 3330', size=58)
L('verdict', st(k, 1), en(k, 1) + 0.2, text='ALİMLƏR: İLK GÜNAH HƏVVAYA YÜKLƏNMİR', c=C_GOLD)
L('verdict', st(k, 2), en(k, 2) + 0.3, text='“HƏVVA ALDATDI” — TÖVRAT RƏVAYƏTİ', c=C_EMBER)
fx('paper', st(k, 0) + 1.5, 0.6)
# K41–K42 — tövbə
shot('K41', vid('K41', d('K41') + 0.5, kb=[1.0, 0, 0, 1.08, 0, 0], dark=0.15))
bed('sorrow_bed', S['K41']['start']); fx('leaves', S['K41']['start'], 0.7, dur=d('K41'))
shot('K42', img('K54', kb=[1.02, 0, 0, 1.16, 0, 0], dark=0.35))
L('ayah', st('K42', 1), en('K42', 2) + 0.3, ar='رَبَّنَا ظَلَمْنَا أَنْفُسَنَا', az='Rəbbimiz, biz özümüzə zülm etdik…', ref_='ƏRAF · 7:23')
L('big', st('K42', 4), en('K42', 4) + 0.4, text='Səhv edildi. Tövbə edildi. Bağışlandı.', size=74, color=C_GOLDSOFT); nosub.add(('K42', 4))
fx('choir_hit', st('K42', 1), 0.7)

# ======================= 3-cü HİSSƏ =======================
shot('K43', vid('K43', d('K43'), kb=[1.0, 0, 0, 1.08, 0, 0], dark=0.15))
bed('epic_bed', S['K43']['start'] - 0.2); fx('whoosh_low', S['K43']['start'] - 0.3, 0.7); fx('wind', S['K43']['start'], 0.5, dur=d('K43'))
shot('K44', img('K43_last', kb=[1.1, 0, 0, 1.2, 0, 0], dark=0.7) | {'src': M + 'K43_last.jpg'})
L('list', S['K44']['start'] + 0.2, S['K44']['end'] + 0.2, title='CÜMƏ', sub='Səhih Müslim 854', items=[
    {'text': 'Adəm yaradıldı', 'at': st('K44', 0) + 2.6}, {'text': 'Cənnətə daxil edildi', 'at': st('K44', 0) + 4.6},
    {'text': 'Cənnətdən çıxarıldı', 'at': st('K44', 0) + 6.8}, {'text': 'Qiyamət qopacaq', 'at': st('K44', 1)}])
for x_ in (2.6, 4.6, 6.8): fx('tick', st('K44', 0) + x_, 0.6)
fx('impact', st('K44', 1), 0.8)
shot('K45', GLOBE('GlobeArrival', 27.8))
fx('whoosh_low', S['K45']['start'], 0.6); fx('stamp', st('K45', 4), 1.0)
for x_ in (6.5, 13.5, 20.3): fx('tick', S['K45']['start'] + x_, 0.6)
k = 'KART-EVLILIK'
shots.append({'id': k, 'a': S[k]['start'], 'b': S[k]['end'], 'bg': {'type': 'dark'}, 'tr': 0.3})
L('qcard', S[k]['start'] + 0.2, S[k]['end'], n=4, q='Adəmin övladları kiminlə evləndi?', img=M + 'K46.jpg'); nosub.add((k, 0))
bed('mystery_bed', S[k]['start']); fx('whoosh', S[k]['start'] - 0.2, 0.7); fx('impact', S[k]['start'] + 0.2, 0.8)
shot('K46', img('K46', kb=[1.1, 0, 0, 1.2, 0, 0], dark=0.72))
L('tree', S['K46']['start'] + 0.3, S['K46']['end'] + 0.2, cross=st('K46', 3), ban=st('K46', 2) + 1.2, haram=st('K46', 5))
L('source', st('K46', 0), en('K46', 1), label='Təfsir rəvayətləri', weak=True)
fx('impact', st('K46', 2) + 1.2, 0.6); fx('whoosh', st('K46', 3), 0.6); fx('stamp', st('K46', 5), 0.9)
shot('K47', {'type': 'dark'}, tr=0.4)
L('strike', S['K47']['start'] + 0.2, st('K47', 2) + 0.3, words=['Qabil', 'Habil'], strikeAt=st('K47', 0) + 3.0, repl='Adəmin iki oğlu', replAt=st('K47', 1), ar='ابْنَيْ آدَمَ', ref_='MAİDƏ · 5:27')
shots.append({'id': 'K47b', 'a': st('K47', 2), 'b': S['K47']['end'], 'bg': img('K47', kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.2), 'tr': 0.6})
bed('drone_dark', S['K47']['start']); fx('impact', st('K47', 0) + 3.0, 0.7); fx('fire', st('K47', 2), 0.6, dur=8)
shot('K48', img('K48', kb=[1.02, 0, 0, 1.16, 0, 0], dark=0.3))
L('dialog', st('K48', 0), st('K48', 0) + 3.0, who='QƏBUL OLUNMAYAN', text='Səni öldürəcəyəm!', side='left', c=C_EMBER)
L('dialog', st('K48', 0) + 3.0, st('K48', 1) + 2.6, who='O BİRİ', text='Sən məni öldürmək üçün əlini mənə uzatsan da, mən əlimi sənə uzatmayacağam.', side='right')
L('source', st('K48', 2), en('K48', 3), label='Təfsir rəvayəti — Quran ayəsi deyil', weak=True)
fx('boom', st('K48', 0), 0.6); fx('heartbeat', st('K48', 0), 0.8, dur=26)
shot('K49', vid('K49', d('K49'), kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.2))
L('quote', st('K49', 3), en('K49', 4), text='Vay halıma! Bu qarğa qədər də ola bilmədimmi?', by='Maidə 5:31', size=62)
fx('dig', st('K49', 2), 0.8, dur=5); fx('wind', S['K49']['start'], 0.5, dur=d('K49'))
shot('K50', img('K50', kb=[1.0, 0, 0, 1.25, 0, 0], dark=0.25))
L('source', st('K50', 0) + 1, en('K50', 1), label='Səhih Buxari 3335')
L('big', st('K50', 2), en('K50', 2) + 0.4, text='…hər haqsız qan', size=96, color=C_EMBER)
fx('drip', st('K50', 0) + 0.3, 0.8); fx('sub_hit', st('K50', 2), 0.8)
shot('K51', {'type': 'dark'}, tr=0.4)
L('stamp', st('K51', 0) + 0.3, st('K51', 1) + 0.5, top='SƏHİH BUXARİ 6614 · SƏHİH MÜSLİM 2652', main='ADƏM VƏ MUSA')
L('columns', st('K51', 3), en('K51', 4) + 0.3, title='GÖRÜŞ HARADA OLDU?', items=[
    {'mark': '?', 'h': 'Bərzəx', 't': 'ruhlar aləmi', 'at': st('K51', 3) + 0.4}, {'mark': '?', 'h': 'Yuxu', 't': 'Peyğəmbərə göstərilən', 'at': st('K51', 3) + 1.6},
    {'mark': '?', 'h': 'Merac', 't': 'səmalar gecəsi', 'at': st('K51', 3) + 2.8}])
bed('mystery_bed', S['K51']['start']); fx('stamp', st('K51', 0) + 0.3, 1.0)
for x_ in (0.4, 1.6, 2.8): fx('whoosh', st('K51', 3) + x_ - 0.3, 0.5)
shot('K52', img('K52', kb=[1.02, 0, 0, 1.14, 0, 0], dark=0.45))
L('dialog', st('K52', 0), st('K52', 2) + 3.0, who='MUSA', text='Sən bizim atamızsan. Bizi Cənnətdən çıxardın!', side='left', c='#cfd8e6')
L('dialog', st('K52', 3), en('K52', 4), who='ADƏM', text='Məni yaradılmamdan qırx il əvvəl yazılmış bir işə görəmi qınayırsan?', side='right')
fx('whoosh_low', st('K52', 3), 0.5)
shot('K53', img('K10', kb=[1.1, 0, 0, 1.25, 0, 0], dark=0.55))
L('repeat', st('K53', 0) + 3.2, st('K53', 2) + 2.6, text='ADƏM MUSAYA QALİB GƏLDİ', times=[st('K53', 0) + 3.4, st('K53', 1), st('K53', 2)]); nosub.add(('K53', 1))
L('ayah', st('K53', 6), en('K53', 6) + 0.4, ar='إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً', az='Mən yer üzündə bir xəlifə yaradacağam.', ref_='BƏQƏRƏ · 2:30')
bed('epic_bed', S['K53']['start'])
for x_ in (st('K53', 0) + 3.4, st('K53', 1), st('K53', 2)): fx('braam', x_, 0.55); fx('impact', x_, 0.6)
fx('choir_hit', st('K53', 6), 0.9)
shot('K54', img('K54', kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.35))
L('dialog', st('K54', 2), st('K54', 2) + 4.2, who='İBLİS', text='Mən ondan üstünəm.', side='left', c=C_EMBER)
L('dialog', st('K54', 2) + 4.2, st('K54', 3) + 2, who='ADƏM', text='Rəbbimiz, biz özümüzə zülm etdik.', side='right')
L('big', st('K54', 4), en('K54', 5) + 0.3, text='Fərq səhvdə deyil.', sub='Fərq səhvdən sonra nə etdiyimizdədir.', size=96, color=C_GOLDSOFT); nosub.add(('K54', 4)); nosub.add(('K54', 5))
L('comment', st('K54', 6), en('K54', 7) + 0.6, text='Hansını ilk dəfə eşitdiniz? Şərhdə yazın')
bed('sorrow_bed', S['K54']['start']); fx('tick', st('K54', 6), 0.6)
shot('K55', vid('K55', d('K55'), kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.3))
L('ayah', st('K55', 0) + 6.5, st('K55', 1), ar='وَرَفَعْنَاهُ مَكَانًا عَلِيًّا', az='Biz onu uca bir məkana qaldırdıq.', ref_='MƏRYƏM · 19:57')
L('next', st('K55', 2), S['K55']['end'] + 0.6)
bed('mystery_bed', S['K55']['start']); fx('choir_hit', st('K55', 0) + 6.5, 0.7); fx('riser', st('K55', 2) - 5.0, 0.8); fx('braam', st('K55', 2), 0.9); fx('boom', st('K55', 2), 0.8)

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
