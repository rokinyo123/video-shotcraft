# Zaman xətti (v2): ifadə səviyyəsində dəqiq vaxtlar, qara fon yoxdur, videolar dövrədə davam edir.
import json, re
S = {s['id']: s for s in json.load(open('build/sentences.json', encoding='utf8'))}
PH = json.load(open('build/phrases.json', encoding='utf8'))
M = 'media/ep1/'
C_GOLD, C_GOLDSOFT, C_EMBER = '#d6a84e', '#f0d9a0', '#c4532b'
LEAD = 0.15  # görüntü səsdən bir az əvvəl dəyişsin

def st(k, i=0): return S[k]['sent'][i]['t']
def en(k, i=-1): return S[k]['sent'][i]['e']
def _shot_text(k):
    rows = [r for r in PH if r['shot'] == k]
    txt = ''; idx = []
    for r in rows:
        idx.append((len(txt), r)); txt += r['text'] + ' '
    return txt, idx
def pts(k, needle):
    txt, idx = _shot_text(k); out = []; i = txt.find(needle)
    while i >= 0:
        r = [r for s, r in idx if s <= i][-1]
        # ifadənin içində proporsional vaxt
        s0 = [s for s, rr in idx if rr is r][0]
        frac = (i - s0) / max(1, len(r['text']))
        out.append(r['a'] + frac * (r['b'] - r['a']))
        i = txt.find(needle, i + 1)
    return out
def pt(k, needle):
    v = pts(k, needle)
    if not v: raise KeyError((k, needle))
    return v[0]
def A(k): return S[k]['start'] - LEAD
def B(k): return S[k]['end'] - LEAD
def d(k): return B(k) - A(k)

shots, layers, sfx, nosub = [], [], [], set()
def shot(k, bg, a=None, b=None, tr=0.45, sid=None):
    shots.append({'id': sid or k, 'a': round(A(k) if a is None else a, 2), 'b': round(B(k) if b is None else b, 2), 'bg': bg, 'tr': tr})
def L(type, a, b, **p): layers.append({'type': type, 'a': round(a, 2), 'b': round(b, 2), **p})
def fx(name, t, g=1.0, dur=None):
    c = {'n': name, 't': round(t, 2), 'g': g}
    if dur: c['dur'] = round(dur, 2)
    sfx.append(c)
def leak(t): L('leak', t, t + 1.1)
def vid(k, dur, clip=7.93, start=0.0, minrate=0.55, **kw):
    rate = max(minrate, min(1.0, (clip - start) / max(dur, 0.1)))
    return {'type': 'video', 'src': f'{M}{k}.mp4', 'rate': round(rate, 3), 'startFrom': start, 'clipLen': clip, **kw}
def img(k, kb=None, **kw): return {'type': 'image', 'src': f'{M}{k}.jpg', 'kb': kb or [1.03, 0, 0, 1.16, 0, 0], **kw}
def GLOBE(name, clip): return {'type': 'video', 'src': f'{M}{name}.mp4', 'rate': 1.0, 'clipLen': clip + 5, 'kb': [1, 0, 0, 1, 0, 0], 'dark': 0.0}
def bed(name, at): fx(name, at, 1.0)

# ======================= 1. SOYUQ AÇILIŞ =======================
shot('K01', vid('K01', 4.0 / 0.84, clip=4.0, kb=[1.0, 0, 0, 1.06, 0, 0], dark=0.12), a=0.0, tr=0.0)
L('opener', 0.2, 5.0)
L('particles', 0, A('K04'), kind='dust')
shot('K02', vid('K02', d('K02'), start=1.0, kb=[1.05, 0, 0, 1.12, 0, -1], dark=0.1))
L('particles', A('K02'), A('K04'), kind='embers', n=40)
shot('K03', img('K03', kb=[1.0, 0, 0, 1.28, 0, 2], dark=0.05))
L('pulse', pt('K03', 'və onun zəif'), A('K04'))
fx('wind', 0.0, 0.8); fx('drone_dark', 0.0, 1.0); fx('shimmer', 0.4, 0.5); fx('sub_hit', 0.3, 0.6)
fx('heartbeat', A('K02'), 0.9); fx('whoosh_low', A('K02') - 0.2, 0.6); fx('sub_hit', pt('K03', 'və onun zəif'), 0.9)
# Möhür
shot('K04', vid('K55', d('K04'), kb=[1.06, 0, 0, 1.1, 0, 0], dark=0.35, grade='saturate(0.5)'), tr=0.0)
L('big', st('K04', 0), en('K04', 0) + 0.1, text='Bu səhnə nağıl deyil.'); nosub.add(('K04', 0))
L('stamp', st('K04', 1), B('K04') + 0.3, top='MƏNBƏ', main='SƏHİH MÜSLİM · 2611')
fx('cut_silence', A('K04'), 1.0); fx('stamp', st('K04', 1), 1.0); fx('paper', st('K04', 1) + 0.1, 0.6)
# Suallar
q = [pt('SUAL', 'Adəm həqiqətən'), pt('SUAL', 'Və niyə böyük'), pt('SUAL', 'Qadağan olunmuş'), pt('SUAL', 'Və min illər')]
shot('SUAL', vid('K13', q[0] - A('SUAL'), kb=[1.02, 0, 0, 1.1, 0, 0], dark=0.3), b=q[0])
L('particles', A('SUAL'), q[0], kind='embers', n=25, alpha=0.6)
shots.append({'id': 'QBG', 'a': round(q[0] - LEAD, 2), 'b': round(B('SUAL'), 2), 'bg': vid('K29', B('SUAL') - q[0], kb=[1.1, 0, 0, 1.2, 0, 0], dark=0.45, blur=2), 'tr': 0.3})
L('qcard', q[0] - LEAD, q[2] - LEAD, n=1, q='Adəm həqiqətən otuz metr boyunda idimi?', sub='…və İbn Həcər niyə bunu izah edə bilmədiyini etiraf etdi?', subAt=q[1], img=M + 'K19.jpg')
L('qcard', q[2] - LEAD, q[3] - LEAD, n=2, q='Qadağan meyvə alma deyildisə, bəs nə idi?', img=M + 'K38.jpg')
L('qcard', q[3] - LEAD, B('SUAL') + 0.1, n=3, q='Adəm Musaya hansı cümlə ilə qalib gəldi?', sub='Səhih Buxari · Səhih Müslim', subAt=q[3] + 2.5, img=M + 'K52.jpg')
for x in (q[0], q[2], q[3]): fx('whoosh', x - 0.5, 0.7); fx('impact', x - LEAD, 0.85); leak(x - LEAD)
for i in (2, 3, 4, 5): nosub.add(('SUAL', i))
fx('tension_bed', A('K04') + 0.5, 1.0)
# Başlıq — arxada qızılı kosmos videosu
ta = A('K05')
shot('K05', vid('K29', d('K05'), kb=[1.15, 0, 0, 1.25, 0, 0], dark=0.55, blur=3), tr=0.0)
L('title', ta, B('K05') + 0.2); nosub.add(('K05', 0)); nosub.add(('K05', 1))
fx('riser', ta - 5.0, 0.8); fx('cut_silence', ta, 1.0); fx('braam', ta, 1.0); fx('boom', ta, 1.0)
# Xəlifə xəbəri
shot('K06', img('K06', kb=[1.12, 0, 0, 1.02, 0, 0], dark=0.1))
bed('pad_sacred', A('K06') - 0.3); fx('whoosh_low', A('K06') - 0.4, 0.5); leak(A('K06'))
shot('K07', vid('K07', d('K07'), kb=[1.0, 0, 0, 1.08, 0, 1], dark=0.25))
L('particles', A('K07'), B('K07'), kind='lights', n=40, alpha=0.7)
a7 = pt('K07', 'Mən yer üzündə')
L('ayah', a7 - 0.2, B('K07') + 0.3, ar='إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً', az='Mən yer üzündə bir xəlifə yaradacağam.', ref_='BƏQƏRƏ · 2:30')
nosub.add(('K07', 0)); fx('shimmer', a7 - 0.2, 0.8); fx('choir_hit', a7 - 0.1, 0.7)

# ======================= 1-ci HİSSƏ (davamı) =======================
shot('K08', img('K08', kb=[1.02, -1, 0, 1.14, 1, 0], dark=0.2))
L('particles', A('K08'), B('K08'), kind='embers', n=45)
L('quote', pt('K08', 'Orada fəsad') - 0.1, B('K08'), text='Orada fəsad törədəcək, qan tökəcək birinimi yaradırsan?', by='Mələklər · Bəqərə 2:30', size=60)
bed('drone_dark', A('K08')); fx('fire', A('K08'), 0.7, dur=d('K08')); fx('whoosh_low', A('K08') - 0.2, 0.5)
k = 'KART-DAYANIN'
shot(k, img('K08', kb=[1.14, 1, 0, 1.22, 1, 0], dark=0.3, grade='grayscale(0.85) contrast(1.15)'), tr=0.0)
L('big', st(k, 0), st(k, 1) - 0.1, text='DAYANIN…', size=150); nosub.add((k, 0))
L('big', st(k, 2), B(k) + 0.2, text='Haradan bilirdilər?', sub='İnsan hələ yaradılmamışdı', size=110)
fx('cut_silence', A(k), 1); fx('sub_hit', A(k), 1.0); fx('impact', A(k) + 0.02, 0.9)
bed('mystery_bed', st(k, 1))
k = 'KART-IZAH'
shot(k, vid('K07', d(k), kb=[1.1, 0, 0, 1.2, 0, 0], dark=0.4, blur=2))
L('columns', st(k, 0) + 0.3, st(k, 5) - 0.2, title='TƏFSİR ALİMLƏRİNİN İZAHI', items=[
    {'icon': 'light', 'mark': '1', 'h': 'Allah bildirmişdi', 't': 'Gələcək insanın təbiətini mələklərə əvvəlcədən xəbər vermişdi.', 'at': st(k, 1) - 0.2},
    {'icon': 'people', 'mark': '2', 'h': '“Xəlifə” sözü', 't': 'Xəlifə — başqasının yerinə gələn. Deməli, ondan əvvəl yer üzündə başqaları yaşayırdı.', 'at': st(k, 2) - 0.2}],
    focus={'i': 1, 'at': st(k, 3)})
L('big', st(k, 5) - 0.1, B(k) + 0.3, text='Bəs kimlər?', size=120); nosub.add((k, 5))
for i in (1, 2): fx('whoosh', st(k, i) - 0.5, 0.6)
fx('impact', st(k, 5) - 0.1, 0.8)
shot('K09', img('K09', kb=[1.02, 0, 0, 1.18, 0, 1], dark=0.12), tr=0.2)
L('particles', A('K09'), B('K09'), kind='embers', n=70)
L('source', st('K09', 0) + 0.3, en('K09', 0), label='Təbəri təfsiri', weak=True)
L('verdict', st('K09', 2), B('K09'), text='MƏLƏKLƏR BUNU GÖRMÜŞDÜLƏR', c=C_EMBER)
fx('fire', A('K09'), 0.9, dur=d('K09')); fx('boom', st('K09', 1), 0.6); fx('impact', st('K09', 0), 0.6); leak(A('K09'))
shot('K10', img('K10', kb=[1.0, 0, 2, 1.15, 0, -1], dark=0.15))
a10 = pt('K10', 'Mən sizin')
L('ayah', a10 - 0.2, B('K10') + 0.3, ar='إِنِّي أَعْلَمُ مَا لَا تَعْلَمُونَ', az='Mən sizin bilmədiklərinizi bilirəm.', ref_='BƏQƏRƏ · 2:30')
L('particles', A('K10'), B('K10'), kind='lights', n=40, alpha=0.8)
fx('shimmer', a10 - 0.2, 0.8); fx('choir_hit', a10 - 0.1, 0.7)
shot('K11', GLOBE('GlobeSoil', 15.6))
L('source', st('K11', 1), en('K11', 1), label='Tirmizi 2955 · Əbu Davud 4693')
bed('pad_sacred', A('K11') - 0.3); fx('whoosh_low', A('K11') - 0.5, 0.6)
for tt in (1.2, 2.6, 5.4, 6.6, 8.0, 10.0, 12.6): fx('tick', A('K11') + tt, 0.6)
shot('K12', img('K12', kb=[1.02, 0, 1, 1.14, 0, -1], dark=0.3))
c12 = [pt('K12', 'qırmızısı'), pt('K12', 'ağı'), pt('K12', 'qarası'), st('K12', 1), st('K12', 2)]
L('chips', c12[0] - 0.1, en('K12', 2) + 0.6, y=40, items=[
    {'text': 'qırmızı', 'at': c12[0], 'c': '#e07a5a'}, {'text': 'ağ', 'at': c12[1], 'c': '#f3ecdc'}, {'text': 'qara', 'at': c12[2], 'c': '#a89a8a'},
    {'text': 'yumşaq', 'at': c12[3], 'c': C_GOLD}, {'text': 'sərt', 'at': c12[3] + 0.8, 'c': C_GOLD}, {'text': 'pis', 'at': c12[4], 'c': C_EMBER}, {'text': 'yaxşı', 'at': c12[4] + 0.7, 'c': '#3ddc84'}])
for x in c12 + [c12[3] + 0.8, c12[4] + 0.7]: fx('tick', x, 0.5)
shot('K13', vid('K13', d('K13'), kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.15))
L('stamp', st('K13', 1), st('K13', 1) + 3.2, top='HƏDİS', main='SƏHİH MÜSLİM · 2611')
L('quote', st('K13', 3), B('K13'), text='…onun içinin boş olduğunu gördü.', by='Səhih Müslim', size=62)
bed('drone_dark', A('K13')); fx('heartbeat', A('K13'), 0.9, dur=B('K14') - A('K13')); fx('stamp', st('K13', 1), 1.0); fx('whoosh_low', st('K13', 2), 0.6)
L('particles', A('K13'), B('K14'), kind='embers', n=35, alpha=0.7)
shot('K14', vid('K02', d('K14'), start=0.5, kb=[1.1, 0, 0, 1.22, 0, 2], dark=0.3))
c14 = [pt('K14', 'Aclıq'), pt('K14', 'qəzəb'), pt('K14', 'şəhvət'), pt('K14', 'istək…')]
L('chips', c14[0] - 0.1, en('K14', 2) + 0.3, y=40, size=76, items=[
    {'text': 'ACLIQ', 'at': c14[0], 'c': C_EMBER}, {'text': 'QƏZƏB', 'at': c14[1], 'c': C_EMBER}, {'text': 'ŞƏHVƏT', 'at': c14[2], 'c': C_EMBER}, {'text': 'İSTƏK', 'at': c14[3], 'c': C_EMBER}])
L('pulse', c14[0], B('K14'))
L('big', st('K14', 3) - 0.1, B('K14') + 0.3, text='…və bu gün də elə o nöqtədən vurur.', size=70, color=C_EMBER); nosub.add(('K14', 3))
for x in c14: fx('impact', x, 0.55)
shot('K15', vid('K15', d('K15'), kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.05, grade='saturate(0.55) sepia(0.35) brightness(1.08) hue-rotate(-8deg)'))
L('particles', A('K15'), B('K16'), kind='lights', n=60)
bed('pad_sacred', A('K15') - 0.3); fx('choir_hit', st('K15', 0) + 0.2, 1.0); fx('shimmer', st('K15', 0), 0.9); fx('cut_amb', A('K15') - 0.2, 1); leak(A('K15'))
shot('K16', img('K16', kb=[1.04, 0, 0, 1.16, 0, 1], dark=0.2))
L('callig', pt('K16', 'Adəm asqırdı') + 1.2, st('K16', 1) + 0.2, ar='الْحَمْدُ لِلَّهِ', sub='Əlhəmdulillah', y=40)
L('quote', pt('K16', 'Allah sənə rəhm') - 0.1, en('K16', 1) - 2.2, text='Allah sənə rəhm etsin, ey Adəm.', size=64)
L('source', st('K16', 0), st('K16', 1) + 4, label='Tirmizi 3368')
fx('shimmer', pt('K16', 'Adəm asqırdı') + 1.2, 0.7)
shot('K17', vid('K18', d('K17'), kb=[1.15, 0, 0, 1.25, 0, 0], dark=0.5, blur=3), tr=0.4)
r17 = pt('K17', 'Allah Adəmi altmış')
L('scale', A('K17'), B('K17') + 0.2, ruler=r17, build=st('K17', 3) - 0.4, done=st('K17', 2))
L('source', st('K17', 0) + 0.3, st('K17', 0) + 6, label='Səhih Buxari 3326 · 6227')
bed('mystery_bed', A('K17') - 0.2)
for i in range(12): fx('tick', r17 + i * 0.45, 0.45)
fx('impact', st('K17', 2), 0.8); fx('boom', st('K17', 3), 0.5)
shot('K18', vid('K18', d('K18'), kb=[1.0, 0, 0, 1.08, 0, 0], dark=0.12))
fx('wind', A('K18'), 0.6, dur=d('K18'))
gh = A('K19')
shot('K19', GLOBE('GlobeHegra', 9.5), a=gh, b=gh + 9.3, sid='K19g')
shots.append({'id': 'K19', 'a': round(gh + 9.3, 2), 'b': round(B('K19'), 2), 'bg': img('K19', kb=[1.0, 0, 0, 1.14, 2, 0], dark=0.25), 'tr': 0.8})
qa = pt('K19', 'Səmud qövmünün')
L('quote', qa - 0.1, B('K19'), text='Səmud qövmünün qayalara oyulmuş evləri bu gün də durur. Onların qapıları göstərir ki, o insanların boyu o qədər də uca olmayıb.', by='İbn Həcər əl-Əsqəlani · Fəthul-Bari', size=50)
bed('tension_bed', A('K19')); fx('whoosh_low', gh - 0.4, 0.6); fx('tick', gh + 4.4, 0.7)
shot('K20', img('K20', kb=[1.03, 0, 0, 1.16, -1, 0], dark=0.25))
qb = pt('K20', 'Bu müşkülü')
L('quote', qb - 0.1, st('K20', 1) - 0.4, text='Bu müşkülü aradan qaldıran bir izahı indiyə qədər tapmadım.', by='İbn Həcər · Fəthul-Bari', size=64, color=C_GOLDSOFT)
L('comment', st('K20', 2), B('K20') + 0.4, text='Siz nə düşünürsünüz? Şərhdə yazın')
fx('paper', qb, 0.6); fx('impact', qb, 0.6); fx('tick', st('K20', 2), 0.7)
k = 'KART-ABUNE'
shot(k, vid('K21', d(k), kb=[1.15, 0, 0, 1.22, 0, 0], dark=0.45, blur=3))
L('subscribe', st(k, 0) + 0.2, B(k) + 0.1, click=st(k, 0) + 2.3)
bed('pad_sacred', A(k)); fx('click', st(k, 0) + 2.3, 0.9); fx('bell', st(k, 0) + 2.45, 0.9)

# ======================= 2-ci HİSSƏ =======================
shot('K21', vid('K21', d('K21'), kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.2))
L('quote', st('K21', 0) + 0.3, en('K21', 1), text='Mən sizin bilmədiklərinizi bilirəm.', by='Xatırlayın · Bəqərə 2:30', size=64, color=C_GOLDSOFT)
L('ayah', st('K21', 3) - 0.2, B('K21'), ar='وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا', az='Və Adəmə bütün adları öyrətdi.', ref_='BƏQƏRƏ · 2:31')
L('particles', A('K21'), B('K21'), kind='lights', n=50)
bed('mystery_bed', A('K21')); fx('shimmer', st('K21', 3) - 0.2, 0.9); fx('choir_hit', st('K21', 3), 0.7); leak(A('K21'))
shot('K22', img('K22', kb=[1.04, 0, 0, 1.16, 0, 1], dark=0.25))
L('quote', st('K22', 0) + 0.2, st('K22', 2) - 0.3, text='Sən pak və müqəddəssən! Bizim Sənin öyrətdiyindən başqa heç bir biliyimiz yoxdur.', by='Mələklər · Bəqərə 2:32', size=56)
L('big', st('K22', 2) - 0.1, B('K22') + 0.3, text='ELM', sub='Mələklərin görmədiyi tərəf', size=200, color=C_GOLD)
bed('pad_sacred', A('K22')); fx('braam', st('K22', 2) - 0.1, 0.6)
shot('K23', img('K23', kb=[1.02, 0, 0, 1.15, 0, 0], dark=0.18))
s1, s2, s3 = pt('K23', 'Əssəlamu əleykum'), pt('K23', 'Əssəlamu əleykə'), pt('K23', 'Yəni üstünə')
L('chips', s1 - 0.1, en('K23', 1) + 0.5, y=38, size=60, items=[
    {'text': 'Əssəlamu əleykum', 'at': s1, 'c': '#f3ecdc'}, {'text': 'Əssəlamu əleykə', 'at': s2, 'c': '#f3ecdc'}, {'text': '+ və rəhmətullah', 'at': s2 + 1.4, 'c': C_GOLD}])
L('source', st('K23', 0) + 1, en('K23', 1), label='Səhih Buxari 6227')
L('particles', A('K23'), B('K23'), kind='lights', n=50)
fx('tick', s1, 0.5); fx('tick', s2, 0.5); fx('shimmer', s2 + 1.4, 0.7)
shot('K24', vid('K24', d('K24'), kb=[1.0, 0, 0, 1.08, 0, 0], dark=0.15))
a24 = pt('K24', 'Adəmə səcdə')
L('ayah', a24 - 0.2, B('K24') + 0.1, ar='اسْجُدُوا لِآدَمَ', az='Adəmə səcdə edin!', ref_='BƏQƏRƏ · 2:34')
bed('epic_bed', A('K24')); fx('braam', a24 - 0.1, 0.9); fx('choir_hit', a24, 0.9); leak(A('K24'))
shot('K25', vid('K25', 5.0, kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.08), b=B('K25') + 1.6, tr=0.0)
L('big', st('K25', 0) - 0.05, B('K25') + 1.6, text='İBLİSDƏN BAŞQA', size=130, color=C_EMBER); nosub.add(('K25', 0))
fx('cut_silence', A('K25'), 1); fx('boom', A('K25') + 0.05, 1.0); fx('fire', A('K25'), 0.9, dur=6)
k26a = B('K25') + 1.6
shot('K26', vid('K25', B('K26') - k26a, start=3.0, kb=[1.15, 0, 0, 1.25, 0, 0], dark=0.45, blur=3), a=k26a, tr=0.4)
L('columns', k26a + 0.1, pt('K26', 'Tarixdə ilk') - 0.2, title='İBLİSİN MƏNTİQİ', items=[
    {'icon': 'fire', 'h': 'OD', 't': '“Məni oddan yaratdın…”', 'c': C_EMBER, 'at': k26a + 0.2, 'img': M + 'K28.jpg'},
    {'icon': 'clay', 'h': 'PALÇIQ', 't': '“…onu isə palçıqdan.”', 'c': '#b08a5a', 'at': pt('K26', 'Məni oddan') + 1.0, 'img': M + 'K03.jpg'}])
L('stamp', pt('K26', 'Tarixdə ilk') - 0.1, B('K26') + 0.3, top='TARİXDƏ İLK', main='İRQÇİLİK', color=C_EMBER)
bed('drone_dark', k26a); fx('whoosh', k26a, 0.6); fx('whoosh', pt('K26', 'Məni oddan') + 0.7, 0.6); fx('stamp', pt('K26', 'Tarixdə ilk') - 0.1, 1.0)
shot('K27', img('K27', kb=[1.02, 0, 0, 1.14, 0, 0], dark=0.3))
a27 = pt('K27', 'O, cinlərdən')
L('stamp', st('K27', 0), a27 - 0.4, top='MƏNBƏ YOXLAMASI', main='İBLİS MƏLƏK İDİMİ?')
L('ayah', a27 - 0.2, pt('K27', 'Mələklər nurdan') - 0.1, ar='كَانَ مِنَ الْجِنِّ', az='O, cinlərdən idi.', ref_='KƏHF · 18:50')
m27 = pt('K27', 'Mələklər nurdan')
L('columns', m27 - 0.1, en('K27', 3) + 0.6, items=[
    {'icon': 'light', 'h': 'MƏLƏK', 't': 'nurdan', 'c': '#fff3cf', 'at': m27},
    {'icon': 'fire', 'h': 'CİN', 't': 'tüstüsüz oddan', 'c': '#7fb3ff', 'at': st('K27', 3)},
    {'icon': 'clay', 'h': 'İNSAN', 't': 'palçıqdan', 'c': '#b08a5a', 'at': st('K27', 3) + 1.2}])
L('source', st('K27', 4), en('K27', 4), label='Təbəri · İbn Abbas rəvayəti', weak=True)
L('verdict', pt('K27', 'İblis cin idi') - 0.3, B('K27') + 0.2, text='ALİMLƏRİN ƏKSƏRİYYƏTİ: CİN')
bed('tension_bed', A('K27')); fx('stamp', st('K27', 0), 1.0); fx('shimmer', a27 - 0.2, 0.6)
for x in (m27, st('K27', 3), st('K27', 3) + 1.2): fx('whoosh', x - 0.4, 0.5)
fx('impact', pt('K27', 'İblis cin idi') - 0.3, 0.7)
shot('K28', vid('K28', d('K28'), kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.1))
L('big', st('K28', 1) - 0.1, B('K28') + 0.2, text='QİYAMƏTƏ QƏDƏR MÖHLƏT', size=90, color=C_EMBER)
L('source', st('K28', 0), B('K28'), label='Hicr 15:36–38')
bed('drone_dark', A('K28')); fx('whoosh_low', A('K28'), 0.8); fx('boom', st('K28', 1), 0.7)
shot('K29', vid('K29', d('K29'), kb=[1.0, 0, 0, 1.15, 0, 0], dark=0.15))
a29 = pt('K29', 'Mən sizin Rəbbiniz')
L('ayah', a29 - 0.2, st('K29', 2) - 2.4, ar='أَلَسْتُ بِرَبِّكُمْ ۖ قَالُوا بَلَىٰ شَهِدْنَا', az='Mən sizin Rəbbiniz deyiləmmi? — Bəli, şahidik!', ref_='ƏRAF · 7:172')
L('big', st('K29', 2) - 2.3, B('K29') + 0.4, text='Bu sual sizə də verilib.', size=84)
bed('pad_sacred', A('K29')); fx('choir_hit', a29, 0.9); fx('shimmer', a29 - 0.2, 0.7); leak(A('K29'))
shot('K30', vid('K29', d('K30'), start=3.0, kb=[1.15, 0, 0, 1.3, 0, 0], dark=0.2))
L('particles', A('K30'), B('K30'), kind='lights', n=110)
L('source', st('K30', 0), B('K30'), label='Tirmizi 3076')
shot('K31', img('K31', kb=[1.02, 0, 0, 1.25, 4, 0], dark=0.18))
L('dialog', pt('K31', 'Ya Rəbb, bu kimdir') - 0.1, pt('K31', 'Adı Davuddur') - 0.1, who='ADƏM', text='Ya Rəbb, bu kimdir?', side='left')
dv = pt('K31', 'Adı Davuddur')
L('big', dv - 0.1, dv + 2.4, text='DAVUD', size=170, color='#fff3cf')
L('dialog', dv + 2.4, B('K31'), who='ADƏM', text='Onun ömrünü nə qədər etdin? — Altmış il.', side='left')
fx('shimmer', dv - 0.1, 0.8); fx('impact', dv - 0.1, 0.5)
shot('K32', vid('K29', d('K32') + 3.0, start=1.0, kb=[1.2, 0, 0, 1.25, 0, 0], dark=0.5, blur=4), b=B('K32') + 3.0, tr=0.4)
L('bars', A('K32'), B('K32') + 3.0, cut=A('K32') + 2.0, join=A('K32') + 3.0)
bed('mystery_bed', A('K32')); fx('sand', A('K32') + 1.8, 0.8)
k33a = B('K32') + 3.0
shot('K33', img('K33', kb=[1.02, 0, 0, 1.14, -1, 0], dark=0.2), a=k33a)
ax = pt('K33', 'Axı mənim'); mg = pt('K33', 'Məgər onu')
layers.append({'type': 'counter', 'a': round(k33a + 0.2, 2), 'b': round(ax - 0.2, 2), 'from': 0, 'to': 960, 'at': round(k33a + 0.2, 2), 'dur': 2.2, 'label': 'İL', 'y': 26})
L('dialog', ax - 0.1, mg - 0.1, who='ADƏM', text='Axı mənim ömrümdən hələ qırx il qalmayıbmı?', side='left')
L('dialog', mg - 0.1, B('K33'), who='ÖLÜM MƏLƏYİ', text='Məgər onu oğlun Davuda verməmişdinmi?', side='right', c='#cfd8e6')
fx('clock', k33a, 0.6, dur=B('K33') - k33a); fx('whoosh_low', st('K33', 1), 0.6)
shot('K34', img('K34', kb=[1.04, 0, 0, 1.18, 2, 0], dark=0.25))
c34 = [pt('K34', 'Adəm inkar'), st('K34', 1), st('K34', 2)]
L('chips', c34[0] - 0.1, B('K34') + 0.4, y=42, size=54, items=[
    {'text': 'inkar etdi', 'at': c34[0], 'c': C_EMBER}, {'text': 'unutdu', 'at': c34[1], 'c': C_GOLD}, {'text': 'xəta etdi', 'at': c34[2], 'c': '#cfd8e6'}])
for x in c34: fx('impact', x, 0.5)
fx('paper', st('K34', 0), 0.5)
shot('K35', img('K35', kb=[1.04, 0, 0, 1.16, 0, 0], dark=0.25))
L('stamp', st('K35', 1) - 0.1, st('K35', 2) - 0.1, top='BƏQƏRƏ · 2:282', main='ƏN UZUN AYƏ')
L('big', st('K35', 2) - 0.1, B('K35') + 0.3, text='Çünki insan unudur.', size=96, color=C_GOLDSOFT); nosub.add(('K35', 2))
fx('stamp', st('K35', 1) - 0.1, 1.0); fx('paper', st('K35', 0), 0.5)
shot('K36', vid('K36', d('K36'), kb=[1.0, 0, 0, 1.08, 0, 0], dark=0.05))
L('source', st('K36', 0) + 1, B('K36'), label='Nisa 4:1')
bed('pad_sacred', A('K36')); fx('water', A('K36'), 0.7, dur=B('K37') - A('K36')); leak(A('K36'))
shot('K37', img('K37', kb=[1.0, 0, 0, 1.14, 0, -1], dark=0.2))
a37 = pt('K37', 'Bu ağaca')
L('ayah', a37 - 0.2, B('K37') + 0.2, ar='وَلَا تَقْرَبَا هَٰذِهِ الشَّجَرَةَ', az='Bu ağaca yaxınlaşmayın.', ref_='BƏQƏRƏ · 2:35')
fx('shimmer', a37 - 0.2, 0.5)
shot('K38', img('K38', kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.15), tr=0.0)
L('stamp', st('K38', 0), st('K38', 1) + 1.0, top='MƏNBƏ YOXLAMASI · 2', main='ALMA?')
xm = pt('K38', 'sözü bir dəfə') + 1.6
L('xmark', xm, B('K38') + 0.2)
bed('tension_bed', A('K38')); fx('stamp', st('K38', 0), 1.0); fx('impact', xm, 0.9)
shot('K39', img('K39', kb=[1.02, 0, 0, 1.14, 0, 0], dark=0.2))
b39 = [pt('K39', 'buğda'), pt('K39', 'üzüm'), pt('K39', 'əncir')]
L('chips', b39[0] - 0.1, en('K39', 1) + 0.3, y=30, items=[{'text': 'buğda ?', 'at': b39[0] + 1.4}, {'text': 'üzüm ?', 'at': b39[1]}, {'text': 'əncir ?', 'at': b39[2]}])
L('big', st('K39', 3) - 0.1, B('K39') + 0.3, text='Məsələ meyvədə deyildi', sub='Məsələ — əmrə itaətdə idi', size=84); nosub.add(('K39', 3)); nosub.add(('K39', 4))
for x in (b39[0] + 1.4, b39[1], b39[2]): fx('tick', x, 0.5)
k = 'KART-MALUM'
shot(k, img('K38', kb=[1.2, 0, 0, 1.3, 0, 0], dark=0.45, blur=3, grade='saturate(0.7)'))
L('malum', pt(k, 'Latın dilində') - 0.1, B(k) + 0.3, split=pt(k, 'həm də') - 0.2)
fx('whoosh', pt(k, 'Latın dilində') - 0.4, 0.6); fx('impact', pt(k, 'həm də') - 0.2, 0.6)
shot('K40', img('K40', kb=[1.02, 0, 0, 1.12, 0, 0], dark=0.35, blur=1))
c40 = [pt('K40', 'Əraf surəsində'), pt('K40', 'Taha surəsində'), pt('K40', 'Və ayə səhvi')]
yq = pt('K40', 'Yəni Quran')
L('stamp', st('K40', 0), c40[0] - 0.3, top='MƏNBƏ YOXLAMASI · 3', main='GÜNAHI HƏVVA İŞLƏTDİ?', color=C_EMBER)
L('columns', c40[0] - 0.2, yq - 0.2, title='QURAN NƏ DEYİR?', items=[
    {'icon': 'quran', 'mark': 'Əraf 7:20', 'h': 'İkisinə birlikdə', 't': 'Şeytan ikisinə vəsvəsə edir.', 'c': C_GOLD, 'at': c40[0]},
    {'icon': 'quran', 'mark': 'Taha 20:120', 'h': '“Ey Adəm…”', 't': 'Şeytan birbaşa Adəmə müraciət edir.', 'c': C_GOLD, 'at': c40[1]},
    {'icon': 'quran', 'mark': 'Taha 20:121', 'h': 'Adəm asi oldu', 'ar': 'وَعَصَىٰ آدَمُ رَبَّهُ', 't': 'Səhv Adəmin adı ilə çəkilir.', 'c': C_GOLD, 'at': c40[2]}])
L('verdict', yq - 0.1, B('K40') + 0.2, text='QURAN SƏHVİ QADINA YÜKLƏMİR')
fx('stamp', st('K40', 0), 1.0)
for x in c40: fx('whoosh', x - 0.5, 0.5)
fx('impact', yq - 0.1, 0.7)
k = 'KART-HEDIS'
shot(k, img('K35', kb=[1.1, 0, 0, 1.18, 0, 0], dark=0.4, blur=2))
L('quote', st(k, 0) + 1.2, en(k, 0), text='Həvva olmasaydı, heç bir qadın ərinə xəyanət etməzdi.', by='Səhih Buxari 3330', size=58)
L('verdict', st(k, 1) - 0.1, en(k, 1) + 0.2, text='ALİMLƏR: İLK GÜNAH HƏVVAYA YÜKLƏNMİR', c=C_GOLD)
L('verdict', st(k, 2) - 0.1, B(k) + 0.3, text='“HƏVVA ALDATDI” — TÖVRAT RƏVAYƏTİ', c=C_EMBER)
fx('paper', st(k, 0) + 1.2, 0.6)
shot('K41', vid('K41', d('K41'), kb=[1.0, 0, 0, 1.08, 0, 0], dark=0.08))
bed('sorrow_bed', A('K41')); fx('leaves', A('K41'), 0.7, dur=d('K41'))
shot('K42', img('K54', kb=[1.02, 0, 0, 1.16, 0, 0], dark=0.2))
a42 = pt('K42', 'Rəbbimiz, biz')
L('ayah', a42 - 0.2, en('K42', 2) + 0.3, ar='رَبَّنَا ظَلَمْنَا أَنْفُسَنَا', az='Rəbbimiz, biz özümüzə zülm etdik…', ref_='ƏRAF · 7:23')
L('big', st('K42', 4) - 0.1, B('K42') + 0.4, text='Səhv edildi. Tövbə edildi. Bağışlandı.', size=74, color=C_GOLDSOFT); nosub.add(('K42', 4))
fx('choir_hit', a42 - 0.1, 0.7)

# ======================= 3-cü HİSSƏ =======================
shot('K43', vid('K43', d('K43'), kb=[1.0, 0, 0, 1.08, 0, 0], dark=0.08))
bed('epic_bed', A('K43') - 0.2); fx('whoosh_low', A('K43') - 0.3, 0.7); fx('wind', A('K43'), 0.5, dur=d('K43')); leak(A('K43'))
shot('K44', vid('K43', d('K44'), start=2.0, kb=[1.12, 0, 0, 1.2, 0, 0], dark=0.4, blur=3))
f44 = [pt('K44', 'yaradıldı'), pt('K44', 'Cənnətə daxil'), pt('K44', 'oradan çıxarıldı'), pt('K44', 'Qiyamət')]
L('list', A('K44') + 0.2, B('K44') + 0.2, title='CÜMƏ', sub='Səhih Müslim 854', items=[
    {'text': 'Adəm yaradıldı', 'at': f44[0]}, {'text': 'Cənnətə daxil edildi', 'at': f44[1]}, {'text': 'Cənnətdən çıxarıldı', 'at': f44[2]}, {'text': 'Qiyamət qopacaq', 'at': f44[3]}])
for x in f44[:3]: fx('tick', x, 0.6)
fx('impact', f44[3], 0.8)
shot('K45', GLOBE('GlobeArrival', 27.8), b=A('K45') + 27.0)
shot('K45', {'type': 'image', 'src': f'{M}GlobeArrival_hold.jpg', 'kb': [1.0, 0, 0, 1.08, 0, 0], 'dark': 0.0}, a=A('K45') + 27.0, tr=0.8, sid='K45h')
fx('whoosh_low', A('K45'), 0.6); fx('stamp', A('K45') + 19.8, 1.0)
for x in (6.5, 13.5, 20.3): fx('tick', A('K45') + x, 0.6)
k = 'KART-EVLILIK'
shots.append({'id': k, 'a': round(A(k), 2), 'b': round(B(k), 2), 'bg': vid('K46', 0, kb=[1, 0, 0, 1, 0, 0]) | {'type': 'image', 'src': M + 'K46.jpg'}, 'tr': 0.3})
L('qcard', A(k), B(k), n=4, q='Adəmin övladları kiminlə evləndi?', img=M + 'K46.jpg'); nosub.add((k, 0))
bed('mystery_bed', A(k)); fx('whoosh', A(k) - 0.3, 0.7); fx('impact', A(k), 0.8); leak(A(k))
shot('K46', img('K46', kb=[1.1, 0, 0, 1.2, 0, 0], dark=0.45, blur=2))
L('tree', A('K46') + 0.2, B('K46') + 0.2, cross=pt('K46', 'başqa doğumdan'), ban=pt('K46', 'oğlan öz əkizi'), haram=st('K46', 5) - 0.1)
L('source', st('K46', 0), en('K46', 1), label='Təfsir rəvayətləri', weak=True)
fx('impact', pt('K46', 'oğlan öz əkizi'), 0.6); fx('whoosh', pt('K46', 'başqa doğumdan') - 0.3, 0.6); fx('stamp', st('K46', 5) - 0.1, 0.9)
qp = pt('K47', 'Quran deyir ki')
shot('K47', img('K48', kb=[1.15, 0, 0, 1.22, 0, 0], dark=0.45, blur=4), b=qp - LEAD, tr=0.4)
L('strike', A('K47') + 0.1, qp, words=['Qabil', 'Habil'], strikeAt=pt('K47', 'adları Quranda') if pts('K47', 'adları Quranda') else st('K47', 0) + 3.0, repl='Adəmin iki oğlu', replAt=pt('K47', 'Quran onları'), ar='ابْنَيْ آدَمَ', ref_='MAİDƏ · 5:27')
shots.append({'id': 'K47b', 'a': round(qp - LEAD, 2), 'b': round(B('K47'), 2), 'bg': img('K47', kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.12), 'tr': 0.6})
bed('drone_dark', A('K47')); fx('impact', st('K47', 0) + 3.0, 0.7); fx('fire', qp, 0.6, dur=B('K47') - qp)
shot('K48', img('K48', kb=[1.02, 0, 0, 1.16, 0, 0], dark=0.18))
o48 = pt('K48', 'Səni öldürəcəyəm'); s48 = pt('K48', 'Sən məni öldürmək')
L('dialog', o48 - 0.1, s48 - 0.1, who='QƏBUL OLUNMAYAN', text='Səni öldürəcəyəm!', side='left', c=C_EMBER)
L('dialog', s48 - 0.1, st('K48', 1) + 2.6, who='O BİRİ', text='Sən məni öldürmək üçün əlini mənə uzatsan da, mən əlimi sənə uzatmayacağam.', side='right')
L('source', st('K48', 2), B('K48'), label='Təfsir rəvayəti — Quran ayəsi deyil', weak=True)
fx('boom', o48, 0.6); fx('heartbeat', o48, 0.8, dur=B('K48') - o48)
shot('K49', vid('K49', d('K49'), kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.1))
L('quote', st('K49', 3) - 0.1, B('K49'), text='Vay halıma! Bu qarğa qədər də ola bilmədimmi?', by='Maidə 5:31', size=62)
fx('dig', st('K49', 2), 0.8, dur=5); fx('wind', A('K49'), 0.5, dur=d('K49'))
shot('K50', img('K50', kb=[1.0, 0, 0, 1.25, 0, 0], dark=0.12))
L('source', st('K50', 0) + 1, en('K50', 1), label='Səhih Buxari 3335')
L('big', st('K50', 2) - 0.1, B('K50') + 0.4, text='…hər haqsız qan', size=96, color=C_EMBER)
fx('drip', st('K50', 0) + 0.3, 0.8); fx('sub_hit', st('K50', 2), 0.8)
shot('K51', img('K52', kb=[1.15, 0, 0, 1.25, 0, 0], dark=0.45, blur=3), tr=0.4)
L('stamp', st('K51', 0) + 0.2, st('K51', 2) - 0.2, top='SƏHİH BUXARİ 6614 · SƏHİH MÜSLİM 2652', main='ADƏM VƏ MUSA')
b51 = pt('K51', 'Alimlər bərzəx')
L('columns', b51 - 0.2, B('K51') + 0.3, title='GÖRÜŞ HARADA OLDU?', items=[
    {'icon': 'question', 'h': 'Bərzəx', 't': 'ruhlar aləmi', 'at': b51 + 0.6}, {'icon': 'question', 'h': 'Yuxu', 't': 'Peyğəmbərə göstərilən', 'at': b51 + 1.3},
    {'icon': 'question', 'h': 'Merac', 't': 'səmalar gecəsi', 'at': b51 + 2.4}])
bed('mystery_bed', A('K51')); fx('stamp', st('K51', 0) + 0.2, 1.0)
for x in (0.6, 1.3, 2.4): fx('whoosh', b51 + x - 0.4, 0.5)
shot('K52', img('K52', kb=[1.02, 0, 0, 1.14, 0, 0], dark=0.25))
em = pt('K52', 'Ey Musa')
L('dialog', st('K52', 0) - 0.1, em - 0.2, who='MUSA', text='Sən bizim atamızsan. Bizi Cənnətdən çıxardın!', side='left', c='#cfd8e6')
L('dialog', em - 0.1, B('K52'), who='ADƏM', text='Məni yaradılmamdan qırx il əvvəl yazılmış bir işə görəmi qınayırsan?', side='right')
fx('whoosh_low', em - 0.3, 0.5)
shot('K53', vid('K07', d('K53'), kb=[1.1, 0, 0, 1.25, 0, 0], dark=0.4, blur=2))
rp = pts('K53', 'Adəm Musaya qalib')
rp = (rp + [rp[-1] + 2.7, rp[-1] + 5.4])[:3]
L('repeat', rp[0] - 0.2, rp[2] + 2.6, text='ADƏM MUSAYA QALİB GƏLDİ', times=rp); nosub.add(('K53', 1))
a53 = pt('K53', 'Mən yer üzündə')
L('ayah', a53 - 0.2, B('K53') + 0.3, ar='إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً', az='Mən yer üzündə bir xəlifə yaradacağam.', ref_='BƏQƏRƏ · 2:30')
bed('epic_bed', A('K53'))
for x in rp: fx('braam', x - 0.05, 0.55); fx('impact', x - 0.05, 0.6)
fx('choir_hit', a53 - 0.1, 0.9)
shot('K54', img('K54', kb=[1.0, 0, 0, 1.12, 0, 0], dark=0.18))
mi = pt('K54', 'Mən ondan üstünəm'); rb = pt('K54', 'Rəbbimiz')
L('dialog', mi - 0.1, rb - 0.1, who='İBLİS', text='Mən ondan üstünəm.', side='left', c=C_EMBER)
L('dialog', rb - 0.1, st('K54', 3) + 2, who='ADƏM', text='Rəbbimiz, biz özümüzə zülm etdik.', side='right')
L('big', st('K54', 4) - 0.1, en('K54', 5) + 0.3, text='Fərq səhvdə deyil.', sub='Fərq səhvdən sonra nə etdiyimizdədir.', size=96, color=C_GOLDSOFT); nosub.add(('K54', 4)); nosub.add(('K54', 5))
L('comment', st('K54', 6), B('K54') + 0.6, text='Hansını ilk dəfə eşitdiniz? Şərhdə yazın')
bed('sorrow_bed', A('K54')); fx('tick', st('K54', 6), 0.6)
shot('K55', vid('K55', d('K55') + 1.5, kb=[1.0, 0, 0, 1.1, 0, 0], dark=0.18), b=B('K55') + 1.5)
a55 = pt('K55', 'Biz onu uca')
L('ayah', a55 - 0.2, st('K55', 1) - 0.1, ar='وَرَفَعْنَاهُ مَكَانًا عَلِيًّا', az='Biz onu uca bir məkana qaldırdıq.', ref_='MƏRYƏM · 19:57')
L('next', st('K55', 2) - 0.1, B('K55') + 1.5)
bed('mystery_bed', A('K55')); fx('choir_hit', a55 - 0.1, 0.7); fx('riser', st('K55', 2) - 5.1, 0.8); fx('braam', st('K55', 2) - 0.1, 0.9); fx('boom', st('K55', 2) - 0.1, 0.8)

# ======================= ALTYAZILAR (ifadə səviyyəsində) =======================
subs = []
def chunks(text, a, b, maxc=62):
    words = text.split(); out = []; cur = ''
    for w in words:
        if len(cur) + len(w) + 1 > maxc and cur: out.append(cur); cur = w
        else: cur = (cur + ' ' + w).strip()
    if cur: out.append(cur)
    tot = sum(len(c) for c in out); t = a; res = []
    for c in out:
        dt = (b - a) * len(c) / tot; res.append({'a': round(t, 2), 'b': round(t + dt - 0.04, 2), 'text': c}); t += dt
    return res
sent_n = {k: len(v['sent']) for k, v in S.items()}
for r in PH:
    if (r['shot'], r['si']) in nosub: continue
    subs += chunks(r['text'], r['a'] - 0.05, r['b'] + 0.1)
# 2-ci və 3-cü hissə: görüntü/altyazı/effektlər səsdən 0.2 s əvvəl (gecikmə hissi olmasın)
ADV = 0.2
for coll, keys in ((shots, ('a', 'b')), (layers, ('a', 'b')), (subs, ('a', 'b'))):
    for o in coll:
        if o['a'] >= 312.6:
            for kk in keys: o[kk] = round(o[kk] - ADV, 3)
            for kk in ('at', 'subAt', 'strikeAt', 'replAt', 'click', 'cut', 'join', 'ruler', 'build', 'done', 'cross', 'ban', 'haram', 'split'):
                if isinstance(o.get(kk), (int, float)) and not isinstance(o.get(kk), bool) and o[kk] > 300: o[kk] = round(o[kk] - ADV, 3)
for o in sfx:
    if o['t'] >= 312.6: o['t'] = round(o['t'] - ADV, 3)
json.dump({'shots': shots, 'layers': layers, 'subs': subs, 'sfx': sfx}, open('src/ep1/timeline.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(shots), 'shot ·', len(layers), 'qat ·', len(subs), 'altyazı ·', len(sfx), 'səs')
dark = [s['id'] for s in shots if s['bg'].get('type') == 'dark']
print('qara fon:', dark or 'YOXDUR')
