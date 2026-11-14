# Peyğəmbərlərin Gizli Tarixi

YouTube sənədli seriyası. Adəmdən başlayaraq hər peyğəmbər üçün 18–22 dəqiqəlik bir bölüm hazırlanır. Videolar [Remotion](https://www.remotion.dev/) ilə kodla qurulur.

## İstehsal mərhələləri

| # | Mərhələ | Status |
|---|---------|--------|
| 1 | Ssenari (mənbələrlə) — `docs/ep1-ssenari.md` | ✅ hazır |
| 2 | Vizual sistem: rənglər, şriftlər, başlıq, mənbə nişanı, sual kartı — `src/theme.ts`, `src/components/` | ✅ hazır |
| 3 | Soyuq açılış + seriya başlığı (0:00–0:55) — `src/ep1/Acilis.tsx` | ✅ qaralama |
| 4 | Səsləndirmə (müəllifin öz səsi) — `public/vo/ep1/` | ⏳ gözləyir |
| 5 | Səhnə 3–14 animasiyaları (xəritə, zaman xətti, ayə kartı, "Mənbə yoxlaması") | ⏳ |
| 6 | Musiqi və SFX (indi sintez olunmuş müvəqqəti səslər) | ⏳ |
| 7 | Altyazı faylı (.srt) + thumbnail | ⏳ |
| 8 | Son yoxlama və YouTube-a yükləmə | ⏳ |

## Qaydalar

- Peyğəmbərlərin üzü heç vaxt göstərilmir: yalnız siluet, nur, arxadan görüntü və ya abstrakt formalar.
- Hər faktın yanında mənbə nişanı (`SourceTag`) olur. Zəif rəvayətlər `weak` ilə qırmızı işarələnir.
- Hədis nömrələri yayımdan əvvəl çap nüsxəsi ilə yoxlanılır.

## İşə salmaq

```bash
npm install
npm run studio              # brauzerdə canlı önizləmə
npm run render:ep1-acilis   # out/ep1-acilis.mp4
```
