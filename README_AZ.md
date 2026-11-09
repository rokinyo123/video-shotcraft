<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/brand/logo-mark-reverse.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/brand/logo-mark.svg">
  <img alt="video-shotcraft loqosu" src="./assets/brand/logo-mark.svg" width="96" height="96">
</picture>

# video-shotcraft

[English](README.md) | [中文](README_CN.md) | [日本語](README_JA.md) | [Русский](README_RU.md) | **Azərbaycanca**

[![Gallery](https://img.shields.io/badge/Gallery-live%20previews-d3923c)](https://vincentwei1021.github.io/video-shotcraft/)
[![Showcase](https://img.shields.io/badge/Showcase-community%20videos-7c3aed)](https://vincentwei1021.github.io/video-shotcraft/showcase.html)

[![GitHub stars](https://img.shields.io/github/stars/Vincentwei1021/video-shotcraft)](https://github.com/Vincentwei1021/video-shotcraft/stargazers)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-skill-d97757)](SKILL.md)
[![Codex](https://img.shields.io/badge/Codex-skill-10a37f)](SKILL.md)

<img src="./assets/readme/cover.webp" width="100%" alt="Qalereyadan altı kadr: graze-face-tour, logo-shrink-wordmark-lockup, panel-grid-moves, product-card-progressive-assemble, space-camera-moves · exploded-view, spotlight-hero-card">

[**▶ Qalereyada 150 kadrın hamısına baxın**](https://vincentwei1021.github.io/video-shotcraft/) · [**🎬 Showcase-ə baxın**](https://vincentwei1021.github.io/video-shotcraft/showcase.html)

</div>

## Nə edir

Claude Code və ya Codex-ə "məhsulum üçün reklam videosu hazırla" deyin. Agent sizin real səhifələrinizin
şəkillərini çəkir, hazır hərəkət reseptləri kitabxanasından kadrlar seçir, ssenari (storyboard) qurur,
videonu [Remotion](https://www.remotion.dev/) ilə animasiya edir, musiqinin ritminə uyğun kəsir, səs
effektləri əlavə edir, hər kadrı yoxlayır və sizə redaktə etməyə davam edə biləcəyiniz hazır MP4 verir.

Bu, video generatoru deyil. Hər kadr sizin öz ekran görüntülərinizdən və mətnlərinizdən kodla çəkilir,
ona görə nəticə aydın, brendinizə uyğun və tam redaktə edilə biləndir.

**Necə işləyir**

![Səkkiz saniyəlik iş axını: məhsul → real səhifələrin çəkilməsi → resept kartları ilə storyboard → Remotion-da animasiya → ritmə uyğunlaşdırma və səs dizaynı → render və kadr yoxlaması → MP4, Motion Workbench və JianYing layihəsi](assets/readme/workflow.gif)

Addım-addım:

1. **Çəkiliş (capture).** Agent saytınızı açır və səhifələrin ekran görüntülərini çəkir.
2. **Kadr seçimi.** 124 resept kartından (150 kadr) hekayəyə uyğun olanları seçir.
3. **Storyboard.** Hər kadrın nə göstərəcəyini, nə qədər davam edəcəyini və hansı mətni daşıyacağını planlaşdırır.
4. **Animasiya.** Hər kadr Remotion-da React komponenti kimi yazılır.
5. **Ritm və səs.** Fon musiqisinin vuruşları (beat) təhlil edilir, kəsiklər onlara uyğunlaşdırılır, səs effektləri əlavə olunur.
6. **Yoxlama (QA).** Kadrlar render edilir və vizual qaydalara görə yoxlanılır.
7. **Təhvil.** Hazır MP4, tam Remotion layihəsi və brauzerdə redaktor (Motion Workbench).

## Yeniliklər

> [!IMPORTANT]
> ### 🎬 2026-10 · Kadr kitabxanası yeniləndi
> 216 demonun hamısı cilalandı və nəzərdən keçirildi. Ən yaxşı versiyalar indi
> **124 kart / 150 kadr** təşkil edir, yeni Qalereya önizləmələri və video-shotcraft brendi ilə.

- **2026-09 · [Motion Workbench](#motion-workbench).** Hazır videonu CapCut-a bənzər brauzer redaktorunda redaktə etməyə davam edin.
- **2026-08 · [video-talkcraft](https://github.com/Vincentwei1021/video-talkcraft)**, səsli izah videoları
  üçün qardaş layihə: ssenari + səsləndirmə daxil edirsiniz, hər hərəkət səsə bağlanır
  ([78 önizləmə](https://vincentwei1021.github.io/video-talkcraft/)).
- **2026-08 · JianYing (CapCut CN) ixracı.** Hazır video redaktə edilə bilən JianYing layihəsinə çevrilir:
  hər kadr ayrıca klip, altyazı trekləri, ayrıca SFX/BGM trekləri. macOS üçün JianYing Pro 11.2-də yoxlanılıb
  ([təlimat](references/jianying-export.md)).

## Quraşdırma

Claude Code və Codex üçün hazırlanıb. Ən sadə yol agentinizə linki verməkdir:

```text
Bu skill-i mənim üçün quraşdır: https://github.com/Vincentwei1021/video-shotcraft
```

Və ya [skills](https://skills.sh/) CLI ilə:

```bash
npx skills add Vincentwei1021/video-shotcraft
```

Və ya əl ilə:

```bash
git clone https://github.com/Vincentwei1021/video-shotcraft.git
cd video-shotcraft
ln -s "$(pwd)" ~/.claude/skills/video-shotcraft   # Claude Code
ln -s "$(pwd)" ~/.codex/skills/video-shotcraft    # Codex
```

## İstifadə

Sadəcə videonu təsvir edin. Heç bir komanda lazım deyil.

| Deyin | Nə baş verir |
|---|---|
| `video-shotcraft ilə məhsulum üçün reklam videosu hazırla.` | Agent Ink Press şablonunu təqdim edir və ondan istifadə edib-etməməyi soruşur, sonra səhifələrinizi çəkib videonu qurur |
| `Bu repo üçün Ink Press şablonu ilə təqdimat videosu hazırla.` | Ən sürətli yol: ekran görüntüləriniz, mətnləriniz və loqonuz yoxlanılmış şablona yerləşdirilir |
| `Bu funksiyanı göstərmək üçün deck-deal-flyin və row-embed kartlarından istifadə et.` | Kadrları adla siz seçirsiniz (adları birbaşa Qalereyadan kopyalayın) |
| `spotlight-hero-card-dan ilhamlanaraq məhsulun yaxın planını hazırla.` | Bir kadr, sizin məhsulunuza uyğunlaşdırılmış |

## Kadr kitabxanası

10 kateqoriyada 124 resept kartı, cəmi 150 kadr. Kart adlarını
[Qalereyada](https://vincentwei1021.github.io/video-shotcraft/) axtarın, süzün və kopyalayın.

| Kateqoriya | Kadr sayı | Nümunə |
|---|---|---|
| Açılış və brend | 11 | `text-as-mask`: məhsul başlığın hərflərinin içindən görünür |
| Kamera | 13 | `exploded-view`: səhifə 3D-də əyilir və hissələrə ayrılır |
| Keçidlər | 19 | `card-flock-tumble`: kartlar sürüsü başlığa çevrilir |
| Tipoqrafiya | 25 | `flying-words`: sözlər tuneli şüara çevrilir |
| UI girişi | 22 | `card-stack`: kartlar yelpik kimi açılır |
| Qarşılıqlı əlaqə | 13 | `palette-theme-ripple`: yeni mövzu interfeysdə dalğa kimi yayılır |
| Data | 9 | `axis-rescale-shock`: qrafik sıçrayır və ox yenidən miqyaslanır |
| İşıq və vurğu | 23 | `spotlight-sweep`: səhnə işığı başlığı tapır |
| Ritm | 8 | `paparazzi-flash`: üç flaş, üç kəsik, bir rəqəm |
| Final | 7 | `input-morph-assemble`: söhbət qutusu loqoya çevrilir |

Hər kart `references/shots/<kateqoriya>/<kart>.md` faylındadır, onun Remotion kodu isə
`demos/<kateqoriya>/<kart>/` qovluğundadır (layihənizə necə qoşmaq üçün [demos/README.md](demos/README.md)-ə baxın).

## Motion Workbench

Təhvildən sonra skill brauzerinizdə CapCut-a bənzər redaktor açır
(`node workbench/scripts/open.mjs <layihə>`). Video kadr, keçid, altyazı və SFX treklərinə bölünür.
İstənilən kadrı seçib mətnini, şrift ölçülərini və rənglərini dəyişə, klipləri köçürə, kəsə və sürətini
dəyişə, kitabxanadakı 150 kadrdan hər hansını sürükləyib əlavə edə, sonra Remotion ilə ixrac edə bilərsiniz.
Önizləmə və render kadr-kadr eynidir.

![Motion Workbench](workbench/docs/overview.png)

[Workbench təlimatı](workbench/GUIDE.md) (çincə) · [İnteqrasiya müqaviləsi](references/workbench.md)

## Nə əldə edirsiniz

| Nəticə | Təfərrüat |
|---|---|
| Hazır video | `MP4`, 1920×1080, 30 fps, h264, musiqi və səs dizaynı ilə |
| Remotion layihəsi | Videonuzun tam mənbə kodu: hər kadr sizin və ya agentin dəyişə biləcəyi React komponentidir |
| Motion Workbench | Təhvildən sonra açılır: treklər, parametrlər, vaxtlama, kadr dəyişmə, ixrac |
| JianYing layihəsi | İstəyə görə: kliplər, altyazılar və audio treklərlə redaktə edilə bilən JianYing (CapCut CN) layihəsi |
| Sosial şəbəkələrdə paylaşım | İstəyə görə: hazır videonu Upload-Post vasitəsilə TikTok, Instagram, YouTube, LinkedIn, X və s.-də paylaşın ([təlimat](references/publish-upload-post.md)) |

Bundan əlavə: təkrar istifadə olunan Remotion komponentləri (2.5D səhifə kamerası, altyazılar, flaş kəsiklər,
rəqəm fırlanması), Freesound SFX axtarış/yükləmə alətləri və 5 fon musiqisi, səhifə çəkmə skriptləri və
istehsal metodunun özü (çəkiliş, vizual istiqamət, storyboard, səs dizaynı, ritmə uyğunlaşdırma, son yoxlama)
[references/](references/pipeline.md) qovluğunda.

## Showcase

**Videonuzu paylaşın.** video-shotcraft ilə nəsə hazırlamısınız?
Showcase formu ilə [göndərin](https://github.com/Vincentwei1021/video-shotcraft/issues/new?template=showcase.yml).
Nəzərdən keçirildikdən sonra o, [Showcase səhifəsində](https://vincentwei1021.github.io/video-shotcraft/showcase.html) görünəcək.

## Tələblər

| Lazımdır | Nə üçün |
|---|---|
| Node.js və npm | Remotion render, şablon və workbench |
| ffmpeg / ffprobe | Kadr yoxlamaları və son QA |
| [uv](https://docs.astral.sh/uv/) | Yalnız fon musiqisinin ritm təhlili üçün (birdəfəlik Python skripti) |
| puppeteer | Yalnız səhifə çəkmək üçün; çəkmə skripti onu lazım olanda özü quraşdırır |

Remotion ilk renderdə öz headless Chrome-unu yükləyir. macOS-da yoxlanılıb; Linux aşağıdakı qeydlərlə işləyir.

<details>
<summary><b>Headless Linux / CI qeydləri</b></summary>

Ekransız Linux maşınında (yoxlanılıb: 2 nüvə, Node 22) render zamanı üç problem olur:

1. **Paralellik limiti.** Az nüvəli maşınlarda `remotion still/render` "Maximum for --concurrency is 2"
   xətası verir. `--concurrency=1` ötürün.
2. **Köhnə headless rejiminin silinməsi.** Yeni Chrome/Chromium köhnə headless rejimini silib, ona görə
   Remotion-u sistem Chromium-una yönəltmək işləmir. Tam Chrome əvəzinə chrome-headless-shell istifadə edin.
3. **Bloklanmış CDN.** remotion.media əlçatan deyilsə, headless-shell avtomatik yüklənmir.
   `--browser-executable=<yerli chrome-headless-shell yolu>` ötürün.

Bu üç parametrlə şablondan kadr renderi işləyir.

</details>

<details>
<summary><b>Repozitoriyanın quruluşu</b></summary>

```text
video-shotcraft/
├── SKILL.md                 # Agentin giriş nöqtəsi və əsas istehsal qaydaları
├── references/
│   ├── pipeline.md          # Başdan-sona istehsal prosesi
│   ├── shots/               # 10 kateqoriyada 124 kadr resept kartı
│   ├── sequences/           # Təkrar istifadə olunan tam video strukturları
│   ├── aesthetic-rules.md   # Vizual QA meyarları
│   ├── music-beat-sync.md   # Fon musiqisi təhlili və ritmə uyğunlaşdırma
│   ├── sound-design.md      # Səs dizaynı təlimatı və nümunələr
│   ├── sfx-sourcing.md      # Freesound axtarışı, yükləmə, təhlil və müəlliflik
│   ├── jianying-export.md   # JianYing (CapCut CN) ixrac təlimatı
│   ├── publish-upload-post.md # İstəyə görə sosial paylaşım (Upload-Post API)
│   └── workbench.md         # Motion workbench: manifest müqaviləsi və redaktə qaydaları
├── demos/                   # Remotion nümunə kodları (eyni kateqoriyalar)
├── gallery/                 # Statik hərəkət önizləmə Qalereyası
├── template/                # İşə salına bilən tam video şablonu
├── jianying-export/         # JianYing layihə quraşdırıcıları (mac yoxlanılıb / win yoxlanılmayıb)
├── publish/                 # İstəyə görə sosial paylaşım (yalnız standart Python) + testlər
├── workbench/               # Təhvildən sonrakı redaktor (Vite + Remotion Player)
└── assets/
    ├── lib/                 # Təkrar istifadə olunan Remotion komponentləri
    ├── scripts/             # Səhifə çəkmə + Freesound CLI və testlər
    └── audio/
        └── bgm/             # 5 fon musiqisi; SFX hər layihə üçün yüklənir
```

Tam iş axını üçün [SKILL.md](SKILL.md), [istehsal prosesi](references/pipeline.md) və
[vizual QA meyarları](references/aesthetic-rules.md) fayllarına baxın.

</details>

## Audio və resurslar

Səs effektləri (SFX) birbaşa [Freesound](https://freesound.org)-dan hər videonun layihəsinə yüklənir.
[Axtarış təlimatı](references/sfx-sourcing.md) axtarışı, CC0 / CC BY süzgəcini, MP3 önizləmə yükləmələrini,
ölçmələri və mənbə/müəllif manifestlərini əhatə edir. Python CLI yalnız standart kitabxanadan istifadə edir;
yükləmə və təhlil üçün FFmpeg lazımdır. API açarı tələb olunmur.
Vaxtlama və qarışdırma üçün [səs dizaynı](references/sound-design.md)-na baxın. Fon musiqiləri
`assets/audio/bgm/` qovluğundadır.

Şablondakı məhsul ekran görüntüləri nümayiş üçündür. Paylaşmazdan əvvəl onları öz məhsulunuzun
görüntüləri ilə əvəz edin və hər hansı məhsul, müştəri və ya şəxsi məlumatın gizlədilməli olub-olmadığını yoxlayın.

## Lisenziya

- Kod və sənədlər: [Apache-2.0](LICENSE).
- Freesound audio: hər fayl öz qeydə alınmış lisenziyası ilə; layihə manifestini saxlayın və tələb olunan CC BY müəlliflik qeydlərini dərc edin.
- Fon musiqisi: [ATTRIBUTION.md](assets/audio/ATTRIBUTION.md)-ə baxın. Köhnə şablon audiosu: [şablon müəllifləri](template/public/audio/ATTRIBUTION.md).
- [Remotion](https://www.remotion.dev/)-un öz
  [lisenziyası](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) var: fərdlər və kiçik
  komandalar üçün pulsuzdur, şirkətlərə ödənişli lisenziya lazım ola bilər.

## Təşəkkürlər

Bir çox reseptlər **ClickUp, Perplexity, Slack, Notion, Figma, Framer, Bear, Raycast, Pitch, Miro, Superhuman
və Loom** kimi şirkətlərin rəsmi məhsul videolarının hərəkət dilini öyrənməklə hazırlanıb. Kartlar sıfırdan
yenidən yazılmış texnikaları (vaxtlama, easing, xoreoqrafiya) təsvir edir; bu videolardan heç bir görüntü,
təsvir və ya brend resursu daxil edilməyib. Bütün ticarət nişanları sahiblərinə məxsusdur və bu şirkətlərin
heç biri bu layihə ilə əlaqəli deyil və onu dəstəkləmir.

Freesound axtarış prosesi **[vibe-motion/sound](https://github.com/vibe-motion/sound)** layihəsindən
ilhamlanıb. Video Shotcraft-ın axtarış/yükləmə CLI-ı müstəqil şəkildə yazılıb.

Həmçinin hər demo və şablonu işlədən **[Remotion](https://www.remotion.dev/)**-a,
layihə SFX-ləri üçün **[Freesound](https://freesound.org)** və onun iştirakçılarına,
fon musiqisi üçün **[Mixkit](https://mixkit.co/)**-ə və bu kitabxananın qurulduğu **Claude Code**-a təşəkkürlər.

## Müəllifi izləyin

<p>
  <a href="https://x.com/VincentWei93"><img alt="Vincent-i X-də izləyin" src="https://img.shields.io/badge/X-Follow_Me-000000?style=for-the-badge&logo=x&logoColor=white"></a>
</p>
