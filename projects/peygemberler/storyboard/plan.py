# Storyboard: hər kadr üçün növ (VİDEO / ŞƏKİL / ANİMASİYA) və ekranda nə olacaq.
import json
P={
# id: (növ, ekranda)
'K01':('VİDEO','Gil bədən, yuxarıdan nur. Altyazı söz-söz çıxır.'),
'K02':('VİDEO','Qara tüstü bədənin ətrafında fırlanır + G01 tüstü, G02 köz.'),
'K03':('VİDEO','Çatlamış sinəyə yaxın plan, qırmızı parıltı.'),
'K04':('ŞƏKİL','Əlyazma. Ekran donur, səs kəsilir → 3D mənbə möhürü “Səhih Müslim 2611” enir.'),
'SUAL':('ANİMASİYA','A01 · 3D fəzada üç sual kartı dərinlikdən kameraya uçur; hər sualda ikon (İ06) və kamera keçidi.'),
'K05':('ANİMASİYA','A02 · Seriya loqosu: 3D qızılı həcmli hərflər, işıq üzərindən keçir, toz partlayışı.'),
'K06':('VİDEO','Boş Yer kürəsi kosmosdan.'),
'K07':('VİDEO','Nur sütunları + ayə kartı: Bəqərə 2:30 (ərəbcə + tərcümə) ekrana yazılır.'),
'K08':('ŞƏKİL','Yanğınlı ufuq. Mələklərin sualı sitat kimi ağır-ağır yazılır.'),
'KART-DAYANIN':('ANİMASİYA','A03 · “DAYANIN” — kadr donur, rəngsizləşir, geri sarma səsi; böyük sual işarəsi 3D fırlanır.'),
'KART-IZAH':('ANİMASİYA','A04 · İki 3D panel havada: “1. Allah bildirmişdi” / “2. Xəlifə = yerinə gələn”; ikincisi önə çıxır.'),
'K09':('ŞƏKİL','Od silüetləri + “Təbəri — rəvayət” qırmızı nişanı. K09b: ikinci bucaq.'),
'K10':('ŞƏKİL','Nur şüası. “Mən sizin bilmədiklərinizi bilirəm” ekranda qalır, sonra “yadda saxlayın” ilə kiçilib küncə gedir (sonra geri qayıdacaq).'),
'K11':('ANİMASİYA','A05 · 3D Yer kürəsi fırlanır; 6 qitədən rəngli torpaq zərrələri axıb mərkəzdə bir ovuca toplanır. Mənbə: Tirmizi 2955.'),
'K12':('ŞƏKİL','Müxtəlif rəngli əllər. Sözlər çıxır: qırmızı · ağ · qara · yumşaq · sərt.'),
'K13':('VİDEO','K13 yuxarıdan tüstü halqası. “Səhih Müslim 2611” möhürü. K13b: K03 yenidən.'),
'K14':('ANİMASİYA','A06 · Şəffaf 3D insan silueti, içi boş; 4 söz (aclıq, qəzəb, şəhvət, istək) közə dönüb içinə daxil olur.'),
'K15':('VİDEO','Ruh üfürülür — nur bədənə axır.'),
'K16':('VİDEO','İlk oturuş, nur zərrələri. “Əlhəmdulillah” ərəbcə xəttatlıqla yazılır.'),
'K17':('ANİMASİYA','A07 · 3D miqyas: 1,75 m insan → 9 mərtəbəli bina → 30 m siluet; ölçü xətti 0→60 dirsək sayır, “≈ 27–30 m”. Mənbə: Buxari 3326.'),
'K18':('VİDEO','Getdikcə kiçilən silüetlər səhrada.'),
'K19':('ANİMASİYA','A08 · 3D qlobus Səudiyyəyə enir → Ələ (Mədain Saleh) yaşıl nişan → K19 şəkli/real foto; qapı ölçüsü xətti “≈ 2,5 m”.'),
'K20':('ŞƏKİL','Alim arxadan. İbn Həcərin sitatı köhnə kağız üzərində mürəkkəblə yazılır (F01). K20b: kitabxana.'),
'KART-ABUNE':('ANİMASİYA','A26 · Zəng ikonu + “Abunə ol”, qızılı, qısa.'),
'K21':('VİDEO','Kosmik divarda nurdan şəkillər + ərəbcə “عَلَّمَ آدَمَ الأَسْمَاءَ” (Bəqərə 2:31) ayə kartı.'),
'K22':('ŞƏKİL','Əyilən nur sütunları. Küncdəki “Mən sizin bilmədiklərinizi bilirəm” geri qayıdır — sirr açılır.'),
'K23':('ŞƏKİL','Silüet nura doğru. “Əssəlamu əleykum” → “…və rəhmətullah” sözü üzərinə əlavə olunur (söz animasiyası).'),
'K24':('VİDEO','Nur dalğası səcdəyə enir.'),
'K25':('VİDEO','Tək od sütunu ayaqda. Səs tam kəsilir — 1 saniyə sükut.'),
'K26':('ANİMASİYA','A11 · Bölünmüş ekran: OD vs PALÇIQ, ortada “Mən ondan üstünəm” çatlayır. Əraf 7:12.'),
'K27':('ANİMASİYA','A10 · “MƏNBƏ YOXLAMASI” möhürü (3D zərb) + Kəhf 18:50 ayə kartı + 3 sütun: MƏLƏK=nur · CİN=tüstüsüz od · İNSAN=palçıq. K27 şəkli fonda.'),
'K28':('VİDEO','Düşən od sütunu. Hicr 15:36 kiçik nişan.'),
'K29':('VİDEO','Milyardlarla nur zərrəsi + Əraf 7:172 ayə kartı “أَلَسْتُ بِرَبِّكُمْ”.'),
'K30':('ŞƏKİL','Nur nöqtələri. Tirmizi 3076 möhürü.'),
'K31':('ŞƏKİL','Bir nur daha parlaq. “DAVUD” adı nurdan yazılır.'),
'K32':('ANİMASİYA','A12 · 3D ömür çubuqları: ADƏM 1000 il → 40 il qopub DAVUDun 60 ilinə birləşir = 100. Qum saatı səsi.'),
'K33':('ŞƏKİL','Soyuq işıqlı otaq. Sayğac 960 / 1000 il.'),
'K34':('ŞƏKİL','Dağılan səhifələr. Üç cütlük sətir ritmlə: inkar etdi… unutdu… xəta etdi…'),
'K35':('ANİMASİYA','A13 · Bəqərə 2:282 — Quranın ən uzun ayəsi: səhifə 3D açılır, ayə uzunluğu vurğulanır.'),
'K36':('VİDEO','Cənnət bağı, uzaqda iki silüet.'),
'K37':('ŞƏKİL','Tək ağac. Bəqərə 2:35.'),
'K38':('ANİMASİYA','A14 · “MƏNBƏ YOXLAMASI №2” + alma şəkli, üstünə qırmızı 3D ✕ möhür.'),
'K39':('ŞƏKİL','Buğda · üzüm · əncir — hər biri adı ilə işarələnir, sonda üçü də sual işarəsinə çevrilir.'),
'KART-MALUM':('ANİMASİYA','A14b · Latın sözü “MALUM” iki mənaya bölünür: alma 🍎 / pislik; klassik rəsm fonu.'),
'K40':('ANİMASİYA','A15 · Üç sütunlu müqayisə: Əraf 7:20 “ikisinə” · Taha 20:120 “Ey Adəm” · Tövrat “Həvva”. Ayələr ərəbcə+tərcümə. K40 şəkli fonda.'),
'KART-HEDIS':('ANİMASİYA','A16 · Hədis kartı Buxari 3330 + alimlərin izahı alt sətirdə.'),
'K41':('VİDEO','Düşən yarpaqlar (G05 də üstə).'),
'K42':('ŞƏKİL','Diz çökmüş iki silüet. Əraf 7:23 duası ərəbcə xəttatlıqla yazılır.'),
'K43':('VİDEO','Kamera buludlardan Yerə enir.'),
'K44':('ANİMASİYA','A17 · 3D təqvim vərəqi “CÜMƏ” — 4 hadisə bir-bir: yaradıldı · Cənnətə girdi · çıxarıldı · Qiyamət. Müslim 854.'),
'K45':('ANİMASİYA','A18 · 3D qlobus: Şri-Lanka yaşıl nişan, Ciddə nişan, ikisindən Ərəfata işıqlı ox xətləri; “ZƏİF RƏVAYƏT” qırmızı möhür.'),
'KART-EVLILIK':('ANİMASİYA','A01b · Sual kartı (girişdəki stil).'),
'K46':('ANİMASİYA','A19 · Nəsil ağacı: əkiz cütlər, çarpaz xətlər; “sonrakı şəriətlərdə haram” möhürü. K46 şəkli fonda.'),
'K47':('ANİMASİYA','A20 · “QABİL / HABİL” adları üstündən xətt çəkilir → “Adəmin iki oğlu” (Maidə 5:27). Sonra K47 şəkli.'),
'K48':('ŞƏKİL','İki qardaş qürubda. Sitat ekranda. Sonda “təfsir rəvayəti” qırmızı nişanı.'),
'K49':('VİDEO','Qarğa torpağı eşir (G06).'),
'K50':('ŞƏKİL','Qan damlası çatlara yayılır. Buxari 3335.'),
'K51':('ANİMASİYA','A22 · 3 qapı 3D məkanda: BƏRZƏX · YUXU · MERAC — hər üçünün üstündə “?”. Buxari 6614 · Müslim 2652.'),
'K52':('ŞƏKİL','İki nur sütunu. Dialoq sitatları növbə ilə sol/sağ tərəfdə.'),
'K53':('ANİMASİYA','A23 · “ADƏM MUSAYA QALİB GƏLDİ” üç dəfə, hər dəfə daha böyük və parlaq; sonra “Mən yer üzündə bir xəlifə…” — K10-dakı ilk cümlə geri qayıdır (dairə tamamlanır).'),
'K54':('ŞƏKİL','Bölünmüş ekran: İblis sitatı vs Adəmin duası.'),
'K55':('VİDEO','Qələmdən ulduzlara. A25 · “2-ci bölüm: İDRİS” 3D loqo.'),
}
rows=[]; off=0.0
for part,dur in ((1,312.45),(2,397.56),(3,303.65)):
    for r in json.load(open(f'storyboard/part{part}.json',encoding='utf8')):
        rows.append((r['id'],off+r['start'],off+r['end'],r['text']))
    off+=dur
def t(x): return f"{int(x//60)}:{int(x%60):02d}"
cnt={'VİDEO':0,'ŞƏKİL':0,'ANİMASİYA':0}
L=['# 1-ci bölüm: Adəm — Storyboard','',
'Cəmi müddət: **16:54**. Vaxtlar səsə görə təxminidir (±1–2 san).','',
'**Növlər:**',
'- 🎥 **VİDEO** — siz şəkli yaradıb promptla videoya çevirirsiniz (5–8 san). Mən onu yavaşladıb, uzadıb, üstünə effekt qoyuram.',
'- 🖼 **ŞƏKİL** — yalnız şəkil lazımdır. Hərəkəti mən verirəm: 3D kamera hərəkəti, işıq, toz, tüstü, fonu qaraldıb önündə mətn.',
'- ✨ **ANİMASİYA** — tam mənim işimdir: 3D qlobus, xəritə, rəqəm, ayə kartı, müqayisə və s. Sizdən heç nə lazım deyil (fonda şəkil yazılıbsa, o şəkil).','',
'Bütün videoda: aşağıda altyazı (açar sözlər qızılı rənglə), sağ yuxarıda kiçik seriya loqosu.','',
'| Vaxt | Kadr | Növ | Ekranda nə olur |','|---|---|---|---|']
ic={'VİDEO':'🎥','ŞƏKİL':'🖼','ANİMASİYA':'✨'}
for k,a,b,_ in rows:
    n,d=P[k]; cnt[n]+=1
    L.append(f"| {t(a)}–{t(b)} | **{k}** | {ic[n]} {n} | {d} |")
L+=['',f"**Cəmi:** {cnt['VİDEO']} video · {cnt['ŞƏKİL']} şəkil · {cnt['ANİMASİYA']} animasiya.",'',
'## Sizin hazırlayacağınız siyahı','',
'**Video (şəkil + video promptu):** '+', '.join(k for k,*_ in rows if P[k][0]=='VİDEO'),'',
'**Yalnız şəkil:** '+', '.join(k for k,*_ in rows if P[k][0]=='ŞƏKİL')+' + ikinci bucaqlar K09b, K13b, K20b','',
'**Animasiyaların fonu üçün şəkil:** K19, K27, K38, K40, K46, K47','',
'**Green screen:** G01, G02, G05, G06 (qalanlarını mən kodla edə bilirəm).','',
'**Lazım deyil:** ikonlar (İ01–İ09) və arxa fonlar (F01–F06) — onları mən 3D/kodla çəkirəm, stil vahid olsun deyə.']
open('docs/ep1-storyboard.md','w',encoding='utf8').write('\n'.join(L)+'\n')
print(cnt)
