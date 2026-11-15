# Peyğəmbərlərin Gizli Tarixi — 2-ci bölüm (İdris) girişi.
# Səsdəki fasilə + heca analizi ilə 7 blokun vaxtını tapır, klipləri həmin vaxtlara oturdur,
# başlıq yazıları, vinyet, crossfade, seriya başlığı və dərin "boom" ilə intro_1min.mp4 yığır.
import os, re, subprocess, json
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import signal

D = os.path.dirname(os.path.abspath(__file__))
SRC = f'{D}/src'; TMP = f'{D}/tmp'; os.makedirs(TMP, exist_ok=True)
VOICE = f'{SRC}/intro_voice.mp3'
W, H, FPS = 1920, 1080, 30
XF = 0.3      # crossfade
LEAD = 0.15   # görüntü cümlədən bir az əvvəl dəyişsin
GOLD = (214, 168, 78); IVORY = (239, 230, 210)
FONT7 = f'{D}/fonts/CormorantGaramond-700.ttf'; FONT6 = f'{D}/fonts/CormorantGaramond-600.ttf'

BLOCKS = [
    ('Smartphone_light_lifts_to_callig#U2026_937fc793.mp4', 'Bir saniyəlik dayanın... və əlinizdəki telefona baxın.'),
    ('Reed_pen_writing_on_parchment_0b8476a3.mp4', 'Ekranda gördüyünüz hər söz, hər rəqəm, hətta kosmosa göndərilən raketlərin hesablamaları — hamısı iki sadə kəşfdən başlayıb: yazı və riyaziyyat.'),
    ('Sage_looking_at_constellation_lines_2cab7333.mp4', 'Elm tarixçiləri min illər əvvəl insanlığın birdən-birə ibtidai həyatdan yazı, astronomiya və şəhərsalmaya necə sıçradığını hələ də araşdırır.'),
    ('Ancient_book_opening_with_light_8634b2ab.mp4', 'İndi isə Qurani-Kərimin Məryəm surəsinin əlli altı və əlli yeddinci ayələrinə qulaq asın: "Kitabda İdrisi də yad et! Həqiqətən, o, çox doğru danışan bir peyğəmbər idi. Biz onu uca bir məqama qaldırdıq."'),
    ('Golden_light_piercing_storm_clouds_82a35be3.mp4', 'Bir tərəfdə — insanlığa qələmi, hesabı və ulduzların elmini gətirən bir peyğəmbər... Digər tərəfdə — adi insan ölümlü olduğu halda, onun dördüncü qat səmaya qaldırılması sirri.'),
    ('Sage_overlooking_Mesopotamian_va#U2026_c7bcbc4c.mp4', 'Bu gün Adəmdən sonra bəşəriyyətin taleyini dəyişən ən müəmmalı şəxsiyyətin — Həzrəti İdrisin izinə düşürük.'),
    ('Stone_statue_under_storm_clouds_115c7677.mp4', 'Və videonun sonunda görəcəyik ki, onun yoxa çıxması insanlıq tarixində ən böyük fəlakətin başlanğıcına necə çevrildi...'),
]
# (blok, axtarılan söz, ekran yazısı, rəng)
CUES = [
    (1, 'yazı və riyaziyyat', 'YAZI  •  RİYAZİYYAT', GOLD),
    (3, 'Məryəm surəsinin', 'Məryəm surəsi, 56–57', IVORY),
    (4, 'dördüncü qat', '4-CÜ QAT SƏMA', GOLD),
    (5, 'Həzrəti İdrisin', 'HƏZRƏTİ İDRİS (Ə.S)', GOLD),
]

V = set('aıoueəiöüAIOUEƏİÖÜ')
def syl(s): return sum(ch in V for ch in s)
def run(cmd): subprocess.run(cmd, check=True)

# ---------------- 1. SƏS ANALİZİ ----------------
SR = 16000
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', VOICE, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
dur = len(x) / SR
hop = 160; fr = SR / hop
db = 20 * np.log10(np.sqrt(np.convolve(x ** 2, np.ones(hop) / hop, 'same')[::hop]) + 1e-6)
quiet = db < db.max() - 35
P = []; i = 0
while i < len(quiet):
    if quiet[i]:
        j = i
        while j < len(quiet) and quiet[j]: j += 1
        if (j - i) / fr >= 0.2: P.append((i / fr, j / fr))
        i = j
    else: i += 1
on = np.where(~quiet)[0]; s0, s1 = on[0] / fr, on[-1] / fr
inner = [p for p in P if s0 < p[0] and p[1] < s1]
# danışıq vaxtı xəritəsi (fasilələr çıxılmaqla)
segs = []; t = s0
for a, b in inner: segs.append((t, a)); t = b
segs.append((t, s1)); SPEECH = sum(b - a for a, b in segs)
def speech_to_time(u):  # danışıq saniyəsi -> real saniyə
    for a, b in segs:
        if u <= b - a: return a + u
        u -= b - a
    return s1
texts = [b[1] for b in BLOCKS]; N = sum(syl(t) for t in texts)
def est(k_syl): return speech_to_time(SPEECH * k_syl / N)

# blok sərhədləri: təxmini vaxta ən yaxın güclü fasilə
starts = [s0]; ends = []; acc = 0; used = -1
for k in range(len(texts) - 1):
    acc += syl(texts[k]); e = est(acc)
    cand = [(idx, p) for idx, p in enumerate(inner) if idx > used and abs((p[0] + p[1]) / 2 - e) < 3.0]
    idx, p = min(cand, key=lambda q: abs((q[1][0] + q[1][1]) / 2 - e) - 1.2 * min(q[1][1] - q[1][0], 1.0))
    used = idx; ends.append(p[0]); starts.append(p[1])
ends.append(s1)

# ekran yazıları üçün söz vaxtları (blok daxilində heca nisbəti + fasilə sonuna yapışdırma)
def word_time(bi, needle):
    tx = texts[bi]; c = tx.find(needle); assert c >= 0, needle
    frac = syl(tx[:c]) / max(1, syl(tx))
    bs, be = starts[bi], ends[bi]
    sp = [(max(a, bs), min(b, be)) for a, b in segs if b > bs and a < be]
    tot = sum(b - a for a, b in sp); u = tot * frac; tt = bs
    for a, b in sp:
        if u <= b - a: tt = a + u; break
        u -= b - a
    near = [p[1] for p in inner if abs(p[1] - tt) < 0.6 and bs <= p[1] <= be]
    return min(near, key=lambda q: abs(q - tt)) if near else tt
cue_t = [(word_time(bi, nd), txt, col) for bi, nd, txt, col in CUES]

print('\n=== SƏS VAXTLARI (intro_voice.mp3, %.2f s) ===' % dur)
for k, (f, tx) in enumerate(BLOCKS):
    print(f'{k + 1}. {starts[k]:6.2f} – {ends[k]:6.2f}  ({ends[k] - starts[k]:5.2f} s)  {tx[:58]}')
print('\n=== EKRAN YAZILARI ===')
for t, txt, _ in cue_t: print(f'{t:6.2f}  {txt}')

# ---------------- 2. KLİPLƏRİN HAZIRLANMASI ----------------
B = [starts[k] - LEAD for k in range(1, len(BLOCKS))]          # keçid mərkəzləri
VEND = ends[-1] + 0.6                                            # son klip səsdən sonra bir az davam edir
FADE = 1.0
lens = []
for k in range(len(BLOCKS)):
    a = 0.0 if k == 0 else B[k - 1] - XF / 2
    b = (B[k] + XF / 2) if k < len(BLOCKS) - 1 else VEND + FADE
    lens.append(b - a)
CLIP = 8.0
VIG = 'vignette=angle=0.42:mode=forward'
print('\n=== KLİPLƏR ===')
for k, (f, _) in enumerate(BLOCKS):
    L = lens[k]; src = f'{SRC}/{f}'; out = f'{TMP}/c{k + 1}.mp4'
    base = f'scale={W}:{H}:flags=lanczos,fps={FPS}'
    if L <= CLIP:
        vf = f'{base},trim=duration={L:.3f},setpts=PTS-STARTPTS,{VIG}'; how = 'kəsildi'
        run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-vf', vf, '-an', '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p', out])
    elif CLIP / L >= 0.75:
        r = CLIP / L
        vf = f'setpts=PTS/{r:.4f},{base},trim=duration={L:.3f},setpts=PTS-STARTPTS,{VIG}'; how = f'yavaşladıldı {r:.2f}x'
        run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-vf', vf, '-an', '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p', out])
    else:  # irəli-geri (ping-pong) — filtr daxilində, lazım olsa yüngül yavaş
        n_fr = int(round(CLIP * 24)) * 2
        reps = int(np.ceil(L / (2 * CLIP * 0.8)))
        r = max(0.8, min(1.0, 2 * CLIP * reps / L))
        fcx = (f'[0:v]trim=duration={CLIP},setpts=PTS-STARTPTS,split[a][b];[b]reverse[rv];[a][rv]concat=n=2:v=1:a=0,'
               f'loop=loop={reps - 1}:size={n_fr}:start=0,setpts=N/24/TB,setpts=PTS/{r:.4f},{base},trim=duration={L:.3f},setpts=PTS-STARTPTS,{VIG}[v]')
        how = f'ping-pong {r:.2f}x'
        run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-filter_complex', fcx, '-map', '[v]', '-an', '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p', out])
    print(f'clip{k + 1}: {L:5.2f} s  ({how})  {f[:40]}')

# ---------------- 3. EKRAN YAZILARI (PNG) ----------------
def text_png(txt, col, path, size=86, spacing=6):
    f = ImageFont.truetype(FONT7, size)
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    def draw(d, fill):
        widths = [d.textlength(ch, font=f) for ch in txt]; tw = sum(widths) + spacing * (len(txt) - 1)
        xx = (W - tw) / 2; y = int(H * 0.70)
        for ch, w_ in zip(txt, widths): d.text((xx, y), ch, font=f, fill=fill); xx += w_ + spacing
        return tw, y
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0)); tw, y = draw(ImageDraw.Draw(sh), (0, 0, 0, 230))
    sh = sh.filter(ImageFilter.GaussianBlur(10)); img.alpha_composite(sh, (0, 4))
    draw(ImageDraw.Draw(img), col + (255,))
    ImageDraw.Draw(img).rectangle([W / 2 - 60, y + size + 22, W / 2 + 60, y + size + 24], fill=col + (200,))
    img.save(path)
for i, (t, txt, col) in enumerate(cue_t): text_png(txt, col, f'{TMP}/t{i}.png')

# ---------------- 4. SERİYA BAŞLIĞI (4 s) ----------------
TC = 4.0; nF = int(TC * FPS)
def layer_text(txt, font, size, col, spacing):
    f = ImageFont.truetype(font, size); im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    widths = [d.textlength(ch, font=f) for ch in txt]; tw = sum(widths) + spacing * (len(txt) - 1)
    return im, f, widths, tw
def render_text(txt, font, size, col, spacing, y):
    im, f, widths, tw = layer_text(txt, font, size, col, spacing); d = ImageDraw.Draw(im); xx = (W - tw) / 2
    for ch, w_ in zip(txt, widths): d.text((xx, y), ch, font=f, fill=col + (255,)); xx += w_ + spacing
    glow = im.filter(ImageFilter.GaussianBlur(18))
    return np.asarray(im).astype(np.float32) / 255, np.asarray(glow).astype(np.float32) / 255
T1, G1 = render_text('PEYĞƏMBƏRLƏRİN GİZLİ TARİXİ', FONT7, 92, IVORY, 6, 420)
T2, _ = render_text('2-Cİ BÖLÜM: HƏZRƏTİ İDRİS (Ə.S)', FONT6, 50, GOLD, 6, 600)
rng = np.random.default_rng(7); NP = 260
px, py = rng.uniform(0, W, NP), rng.uniform(0, H, NP); vx, vy = rng.normal(0, 6, NP), rng.uniform(-28, -8, NP)
ps, pa = rng.uniform(1.0, 3.2, NP), rng.uniform(0.25, 0.9, NP)
yy, xx = np.mgrid[0:H, 0:W]
glowbg = np.exp(-(((xx - W / 2) / 700) ** 2 + ((yy - 470) / 260) ** 2))[..., None] * np.array([0.33, 0.24, 0.10], np.float32)
def sm(t, a, b): return float(np.clip((t - a) / (b - a), 0, 1)) ** 2 * (3 - 2 * float(np.clip((t - a) / (b - a), 0, 1)))
title_mp4 = f'{TMP}/title.mp4'
p = subprocess.Popen(['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                      '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p', title_mp4], stdin=subprocess.PIPE)
for n in range(nF):
    t = n / FPS
    out = (0.5 + 0.5 * sm(t, 0, 1.0)) * (1 - sm(t, 3.1, 4.0))
    fr_ = glowbg * (0.6 + 0.4 * np.sin(t * 2.2) ** 2) * out
    img = Image.new('L', (W, H), 0); d = ImageDraw.Draw(img)
    X = (px + vx * t) % W; Y = (py + vy * t) % H
    for k in range(NP):
        tw_ = 0.55 + 0.45 * np.sin(t * 3 + k)
        d.ellipse([X[k] - ps[k], Y[k] - ps[k], X[k] + ps[k], Y[k] + ps[k]], fill=int(255 * pa[k] * tw_))
    dust = np.asarray(img.filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)[..., None] / 255
    fr_ = fr_ + dust * np.array([0.95, 0.78, 0.42], np.float32) * out
    a1 = sm(t, 0.15, 1.0) * (1 - sm(t, 3.1, 3.9)); a2 = sm(t, 0.8, 1.6) * (1 - sm(t, 3.1, 3.9))
    fr_ = fr_ + G1[..., :3] * G1[..., 3:] * 0.6 * a1
    fr_ = fr_ * (1 - T1[..., 3:] * a1) + T1[..., :3] * T1[..., 3:] * a1
    lw = 260 * sm(t, 0.7, 1.4)
    if lw > 1: fr_[562:565, int(W / 2 - lw):int(W / 2 + lw)] = np.array([0.84, 0.66, 0.31]) * a2 + fr_[562:565, int(W / 2 - lw):int(W / 2 + lw)] * (1 - a2)
    fr_ = fr_ * (1 - T2[..., 3:] * a2) + T2[..., :3] * T2[..., 3:] * a2
    p.stdin.write((np.clip(fr_, 0, 1) * 255).astype(np.uint8).tobytes())
p.stdin.close(); p.wait()

# ---------------- 5. SƏS DİZAYNI (sintez: fon + effektlər) ----------------
import wave
ASR = 48000
VTOT = VEND + FADE; TOTAL = VTOT + TC; NS = int(TOTAL * ASR)
ar = np.random.default_rng(11)
def tt(d): return np.arange(int(d * ASR)) / ASR
def lp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, 'low', fs=ASR, output='sos'), x)
def hp(x, f, o=2): return signal.sosfilt(signal.butter(o, f, 'high', fs=ASR, output='sos'), x)
def bp(x, a, b, o=2): return signal.sosfilt(signal.butter(o, [a, b], 'band', fs=ASR, output='sos'), x)
def db2(g): return 10 ** (g / 20)
def peak(x, g): return x / (np.abs(x).max() + 1e-9) * db2(g)
def reverb(x, sec=2.2, decay=2.4, mix=0.45, tone=2500):
    ir = lp(ar.normal(0, 1, int(sec * ASR)) * np.exp(-tt(sec) * decay), tone)
    w = signal.fftconvolve(x, ir)[: len(x) + int(sec * ASR)]; w /= np.abs(w).max() + 1e-9
    y = np.zeros(len(w)); y[: len(x)] += x / (np.abs(x).max() + 1e-9); return (1 - mix) * y + mix * w
bus = np.zeros((NS, 2))
def place(x, t0, g, pan=0.0):
    x = peak(x, g); a = int(t0 * ASR)
    if a < 0: x = x[-a:]; a = 0
    n = min(len(x), NS - a)
    if n <= 0: return
    bus[a:a + n, 0] += x[:n] * np.sqrt(0.5 - pan / 2) * np.sqrt(2)
    bus[a:a + n, 1] += x[:n] * np.sqrt(0.5 + pan / 2) * np.sqrt(2)

# 1) Dərin kosmik fon (bütün video boyu, -24 dB RMS)
t = tt(TOTAL)
brown = np.cumsum(ar.normal(0, 1, NS)); brown = hp(brown, 20); brown = lp(brown, 140, 4)
wind = bp(ar.normal(0, 1, NS), 250, 700) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t + 1) ** 2)
sub = np.sin(2 * np.pi * 41.2 * t) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.05 * t)) + 0.5 * np.sin(2 * np.pi * 55 * t + 0.6) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.031 * t))
dr = brown / np.abs(brown).max() * 0.9 + wind / np.abs(wind).max() * 0.35 + sub / np.abs(sub).max() * 0.45
env = np.minimum(1, t / 2.0) * np.minimum(1, (TOTAL - t) / 1.2).clip(0, 1)
dr = dr * env; dr = dr / np.sqrt(np.mean(dr ** 2)) * db2(-25.4)
wl = bp(ar.normal(0, 1, NS), 250, 700) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t + 2.5) ** 2)
wl = wl / np.sqrt(np.mean(wl ** 2)) * db2(-25.4) * 0.35 * env
bus[:, 0] += dr + wl; bus[:, 1] += dr - wl

# 2) 0:00 — rəqəmsal glitch + sub-bass drop
g = np.zeros(int(0.5 * ASR))
for k in range(9):
    a = int(ar.uniform(0, 0.4) * ASR); n = int(ar.uniform(0.008, 0.045) * ASR)
    seg = np.sign(np.sin(2 * np.pi * ar.uniform(300, 2400) * tt(n / ASR))) * 0.6 + ar.normal(0, 0.5, n)
    seg = np.round(seg * 4) / 4  # bit-crush
    g[a:a + n] += seg[: len(g) - a]
g = hp(g, 200)
place(g, 0.0, -14, 0.25)
td = tt(2.4); f = 32 + 90 * np.exp(-td * 3.2)
drop = np.sin(2 * np.pi * np.cumsum(f) / ASR) * np.exp(-td * 1.3); drop[:200] *= np.linspace(0, 1, 200)
place(drop, 0.0, -11)

# 3) keçidlərdə yumşaq whoosh
def whoosh(d=0.9, f0=300, f1=2400):
    n = int(d * ASR); x = ar.normal(0, 1, n); y = np.zeros(n); blk = 512
    for s0 in range(0, n, blk):
        u = s0 / n; fc_ = f0 + (f1 - f0) * np.sin(np.pi * u)
        y[s0:s0 + blk] = bp(x[max(0, s0 - 2048):s0 + blk], fc_ * 0.6, min(fc_ * 1.6, 20000))[-len(x[s0:s0 + blk]):]
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return y * e
for k, b in enumerate(B):
    place(whoosh(), b - 0.45, -14, 0.35 if k % 2 else -0.35)

# 4) ekran yazılarında dərin kinematoqrafik zərbə
def boom(d=3.0, f_hi=62, f_lo=36, decay=1.5, verb=0.4):
    td = tt(d); f = f_lo + (f_hi - f_lo) * np.exp(-td * 2.5)
    x = np.sin(2 * np.pi * np.cumsum(f) / ASR) * np.exp(-td * decay)
    x += lp(ar.normal(0, 1, len(td)), 160) * np.exp(-td * 6) * 0.4
    x[:200] *= np.linspace(0, 1, 200)
    return reverb(x, 2.0, 2.2, verb, 900)
for tc_, _, _ in cue_t:
    place(boom(), tc_ - 0.1, -11)

# 5) clip7-nin sonunda yüksələn gərginlik (riser)
rd = 5.5; td = tt(rd); u = td / rd
nz = ar.normal(0, 1, len(td)); r = np.zeros(len(td)); blk = 512
for s0 in range(0, len(td), blk):
    fc_ = 200 + 3800 * (s0 / len(td)) ** 2
    r[s0:s0 + blk] = bp(nz[max(0, s0 - 2048):s0 + blk], fc_ * 0.7, min(fc_ * 1.4, 20000))[-len(nz[s0:s0 + blk]):]
tone = np.sin(2 * np.pi * np.cumsum(70 + 330 * u ** 2) / ASR) * 0.5
r = (r / np.abs(r).max() + tone) * (u ** 2.2)
place(r, VEND - rd + 0.1, -12)

# 6) Title Card: güclü təmiz boom + shimmer
place(boom(4.0, 70, 34, 1.1, 0.5), VTOT, -10)
sd = 3.6; td = tt(sd)
sh = sum(np.sin(2 * np.pi * fq * td + ph) * (0.6 + 0.4 * np.sin(2 * np.pi * (5 + k) * td)) for k, (fq, ph) in enumerate([(2093, 0), (2637, 1), (3136, 2), (4186, 3), (5274, 4)]))
sh = sh * np.minimum(1, td / 0.15) * np.exp(-td * 0.9)
place(reverb(sh, 2.5, 1.6, 0.55, 9000), VTOT + 0.05, -20)

# yazılış: 24-bit stereo wav
with wave.open(f'{TMP}/bus.wav', 'wb') as wv:
    wv.setnchannels(2); wv.setsampwidth(2); wv.setframerate(ASR)
    wv.writeframes((np.clip(bus, -1, 1) * 32767).astype(np.int16).tobytes())
print('\n=== SƏS EFFEKTLƏRİ ===')
print('0.00  glitch + sub-bass drop')
for b in B: print(f'{b:5.2f}  whoosh (keçid)')
for tc_, txt, _ in cue_t: print(f'{tc_ - 0.1:5.2f}  boom — {txt}')
print(f'{VEND - rd + 0.1:5.2f}  riser ({rd} s)')
print(f'{VTOT:5.2f}  Title Card boom + shimmer')

# ---------------- 6. YIĞIM ----------------
inputs = []; [inputs.extend(['-i', f'{TMP}/c{k + 1}.mp4']) for k in range(len(BLOCKS))]
fc = []; last = '[0:v]'
for k in range(1, len(BLOCKS)):
    off = B[k - 1] - XF / 2
    fc.append(f'{last}[{k}:v]xfade=transition=fade:duration={XF}:offset={off:.3f}[x{k}]'); last = f'[x{k}]'
fc.append(f'{last}trim=duration={VTOT:.3f},fade=t=out:st={VEND:.3f}:d={FADE},setpts=PTS-STARTPTS[base]')
ni = len(BLOCKS); last = '[base]'
for i, (t, _, _) in enumerate(cue_t):
    inputs += ['-loop', '1', '-t', f'{VTOT:.3f}', '-i', f'{TMP}/t{i}.png']
    a, b = t - 0.1, t + 3.0
    fc.append(f'[{ni + i}:v]format=rgba,fade=t=in:st={a:.3f}:d=0.45:alpha=1,fade=t=out:st={b - 0.5:.3f}:d=0.5:alpha=1[o{i}]')
    fc.append(f"{last}[o{i}]overlay=0:0:enable='between(t,{a:.3f},{b:.3f})'[v{i}]"); last = f'[v{i}]'
nt = ni + len(cue_t)
inputs += ['-i', title_mp4]
fc.append(f'{last}fps={FPS},format=yuv420p,setsar=1[m1];[{nt}:v]fps={FPS},format=yuv420p,setsar=1[m2];[m1][m2]concat=n=2:v=1:a=0[vout]')
inputs += ['-i', VOICE, '-i', f'{TMP}/bus.wav']
bd = int(VTOT * 1000)
fc.append(f'[{nt + 1}:a]aresample=48000,aformat=channel_layouts=stereo,apad[va]')
fc.append(f'[va][{nt + 2}:a]amix=inputs=2:duration=longest:normalize=0,atrim=duration={VTOT + TC:.3f},alimiter=limit=0.95:attack=2:release=60:level=disabled[aout]')
OUT = f'{D}/intro_1min.mp4'
run(['ffmpeg', '-y', '-v', 'error', *inputs, '-filter_complex', ';'.join(fc), '-map', '[vout]', '-map', '[aout]',
     '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', str(FPS), '-c:a', 'aac', '-b:a', '256k',
     '-movflags', '+faststart', OUT])
print(f'\nHAZIR: {OUT}  ({VTOT + TC:.2f} s)')
