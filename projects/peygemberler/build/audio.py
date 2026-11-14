"""Musiqi + səs effektləri sintezi və son miks (səsləndirmə hər şeydən aydın).

İstifadə: python3 build/audio.py FROM TO OUT.wav
"""
import json, sys, subprocess
import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
rng = np.random.default_rng(7)


def T(d):
    return np.arange(int(d * SR)) / SR


def lp(x, f, o=2):
    return signal.sosfilt(signal.butter(o, f, 'low', fs=SR, output='sos'), x)


def hp(x, f, o=2):
    return signal.sosfilt(signal.butter(o, f, 'high', fs=SR, output='sos'), x)


def bp(x, f1, f2, o=2):
    return signal.sosfilt(signal.butter(o, [f1, f2], 'band', fs=SR, output='sos'), x)


def saw(f, t, det=0.0):
    ph = np.cumsum(np.full_like(t, f * (1 + det)) / SR) if np.isscalar(f) else np.cumsum(f / SR)
    return 2 * (ph % 1) - 1


def adsr(n, a, r, sustain=1.0):
    e = np.ones(n) * sustain
    na, nr = min(int(a * SR), n // 2), min(int(r * SR), n // 2)
    if na: e[:na] = np.linspace(0, sustain, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr)
    return e


def stereo(x, w=0.0):
    if x.ndim == 2: return x
    d = int(0.012 * SR * w)
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x
    return np.stack([x, r], 1)


_IR = {}


def reverb(x, secs=2.5, wet=0.35):
    key = secs
    if key not in _IR:
        n = int(secs * SR)
        tt = np.arange(n) / SR
        ir = np.stack([rng.standard_normal(n), rng.standard_normal(n)], 1) * np.exp(-6.9 * tt / secs)[:, None]
        ir = np.stack([lp(ir[:, 0], 6000), lp(ir[:, 1], 6000)], 1)
        _IR[key] = ir / np.sqrt((ir ** 2).sum(0))
    ir = _IR[key]
    x = stereo(x)
    y = np.stack([signal.fftconvolve(x[:, c], ir[:, c])[: len(x) + len(ir) - 1] for c in range(2)], 1)
    out = np.zeros_like(y)
    out[: len(x)] += x * (1 - wet)
    return out + y * wet


def norm(x, peak=0.9):
    m = np.abs(x).max()
    return x * (peak / m) if m > 0 else x


# ----------------------------- SƏS ELEMENTLƏRİ -----------------------------
D1, D2, A2, D3, F3, A3 = 36.71, 73.42, 110.0, 146.83, 174.61, 220.0


def drone_dark(d):
    t = T(d)
    x = 0.6 * np.sin(2 * np.pi * D1 * t) + 0.35 * lp(saw(D2, t) + saw(D2, t, 0.004), 220)
    x += 0.18 * lp(saw(A2, t, -0.003), 300)
    hiss = bp(rng.standard_normal(len(t)), 300, 900) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t))
    x += 0.08 * hiss
    # Dissonant, qorxulu yüksək simli səs (Eb5) — yavaş gəlib gedir
    eb = lp(saw(622.25, t) + saw(622.25, t, 0.006), 1800) * np.clip(np.sin(2 * np.pi * t / max(d, 1) * 1.5), 0, 1) ** 2
    x += 0.035 * eb * (1 + 0.3 * np.sin(2 * np.pi * 5.5 * t))
    x *= adsr(len(t), 3.0, 0.4)
    return reverb(stereo(x, 1), 3.5, 0.35)


def tension_bed(d):
    t = T(d)
    n = len(t)
    out = np.zeros(n)
    # Pulsasiya edən bas ostinato (8-lik notlar, 112 bpm), getdikcə güclənir
    step = 60 / 112 / 2
    notes = [D2, D2, D2, 77.78, D2, D2, 69.30, D2]
    k = 0
    tt = 0.0
    while tt < d - 0.2:
        f = notes[k % len(notes)]
        seg = T(0.22)
        tone = lp(saw(f, seg) + 0.5 * saw(f * 2, seg, 0.003), 500 + 900 * (tt / d)) * np.exp(-seg * 9)
        i = int(tt * SR)
        m = min(len(tone), n - i)
        out[i : i + m] += tone[:m] * (0.35 + 0.65 * tt / d)
        # yüksək "tik" (hi-hat kimi)
        tick = hp(rng.standard_normal(int(0.03 * SR)), 6000) * np.exp(-np.arange(int(0.03 * SR)) / SR * 140)
        m2 = min(len(tick), n - i)
        out[i : i + m2] += 0.12 * tick[:m2] * (0.3 + 0.7 * tt / d)
        tt += step
        k += 1
    out += 0.45 * np.sin(2 * np.pi * D1 * t) * (0.4 + 0.6 * t / d)
    # sonda dissonant simli klaster yüksəlir
    clus = sum(lp(saw(f, t, j * 0.002), 2500) for j, f in enumerate([293.66, 311.13, 349.23, 369.99]))
    out += 0.05 * clus * (t / d) ** 3
    out *= adsr(n, 1.5, 0.3)
    return reverb(stereo(out, 1), 2.2, 0.25)


def pad_sacred(d):
    t = T(d)
    n = len(t)
    out = np.zeros((n, 2))
    chords = [[D3, F3, A3, 293.66], [116.54, 146.83, 174.61, 233.08], [87.31, 174.61, 220.0, 261.63], [130.81, 196.0, 261.63, 329.63]]
    seg = 4.5
    for ci in range(int(np.ceil(d / seg)) + 1):
        a = ci * seg
        if a >= d: break
        L = min(seg + 2.0, d - a)
        tt = T(L)
        ch = chords[ci % len(chords)]
        v = sum(lp(saw(f, tt, 0.003) + saw(f, tt, -0.003), 900) for f in ch)
        v += 0.4 * sum(np.sin(2 * np.pi * f * 2 * tt) for f in ch[:2])
        v *= adsr(len(tt), 1.8, 1.8) * 0.12
        i = int(a * SR)
        out[i : i + len(tt)] += stereo(v, 1)[: n - i]
    out[:, 0] += 0.25 * np.sin(2 * np.pi * D2 * t)
    out[:, 1] += 0.25 * np.sin(2 * np.pi * D2 * t)
    out *= adsr(n, 2.0, 1.5)[:, None]
    return reverb(out, 4.0, 0.45)


def heartbeat(d, bpm=66):
    n = int(d * SR)
    out = np.zeros(n)
    per = 60 / bpm
    tt = 0.0
    while tt < d:
        for off, f, g in ((0, 52, 1.0), (0.24, 44, 0.65)):
            s = T(0.18)
            th = np.sin(2 * np.pi * f * s * (1 - 0.3 * s)) * np.exp(-s * 22) * g
            i = int((tt + off) * SR)
            m = min(len(th), n - i)
            if m > 0: out[i : i + m] += th[:m]
        tt += per
        per = max(0.62, per * 0.985)  # tədricən sürətlənir
    out *= np.linspace(0.5, 1.0, n)
    return stereo(lp(out, 160))


def wind(d):
    t = T(d)
    x = np.cumsum(rng.standard_normal(len(t)))
    x = hp(x - np.convolve(x, np.ones(2000) / 2000, 'same'), 60)
    x = bp(x / np.abs(x).max(), 150, 1200) * (0.55 + 0.45 * np.sin(2 * np.pi * 0.07 * t + 1))
    x = norm(x, 0.5) * adsr(len(t), 2.0, 1.0)
    return stereo(x, 2)


def whoosh(d=1.3, low=False):
    t = T(d)
    nz = rng.standard_normal(len(t))
    env = np.sin(np.pi * t / d) ** 2
    out = np.zeros(len(t))
    blocks = 40
    for b in range(blocks):
        a, e = int(b * len(t) / blocks), int((b + 1) * len(t) / blocks)
        c = (250 if low else 600) + (1500 if low else 4200) * np.sin(np.pi * (a / len(t)))
        out[a:e] = bp(nz[max(0, a - 2000) : e], c * 0.6, min(c * 1.4, 20000))[-(e - a) :]
    out *= env
    pan = np.linspace(-1, 1, len(t))
    st = np.stack([out * (1 - pan) / 2, out * (1 + pan) / 2], 1)
    return reverb(norm(st, 0.6), 1.5, 0.3)


def sub_hit():
    s = T(2.5)
    f = 40 + 50 * np.exp(-s * 6)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-s * 1.6)
    return reverb(stereo(norm(x, 0.95)), 2.0, 0.2)


def boom():
    s = T(4.0)
    f = 30 + 70 * np.exp(-s * 5)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-s * 1.1)
    x += 0.5 * lp(rng.standard_normal(len(s)), 300) * np.exp(-s * 5)
    x = np.tanh(2.2 * x)
    return reverb(stereo(norm(x, 0.95)), 3.5, 0.35)


def impact():
    s = T(3.0)
    f = 45 + 90 * np.exp(-s * 9)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-s * 2.2)
    metal = sum(np.sin(2 * np.pi * fr * s) * np.exp(-s * dc) for fr, dc in ((410, 5), (823, 7), (1297, 9), (1980, 12)))
    crack = hp(rng.standard_normal(len(s)), 1500) * np.exp(-s * 40)
    x = np.tanh(1.8 * x) + 0.12 * metal + 0.35 * crack
    return reverb(stereo(norm(x, 0.95)), 2.8, 0.38)


def braam(d=5.0):
    t = T(d)
    sweep = 200 + 1600 * np.exp(-t * 1.4) * (1 - np.exp(-t * 20))
    x = sum(saw(f, t, j * 0.0025) for j, f in enumerate([D1, D2, D2, A2, D3]))
    blocks = 60
    y = np.zeros_like(x)
    for b in range(blocks):
        a, e = int(b * len(t) / blocks), int((b + 1) * len(t) / blocks)
        y[a:e] = lp(x[max(0, a - 3000) : e], float(sweep[a]))[-(e - a) :]
    y = np.tanh(2.5 * y) * adsr(len(t), 0.06, 2.5)
    y += 0.7 * np.sin(2 * np.pi * D1 * t) * np.exp(-t * 0.6)
    return reverb(stereo(norm(y, 0.95), 1), 4.0, 0.4)


def riser(d=5.0):
    t = T(d)
    f = 150 * 2 ** (3.2 * t / d)
    tone = sum(np.sin(2 * np.pi * np.cumsum(f * m) / SR) for m in (1, 1.5, 2.01))
    nz = hp(rng.standard_normal(len(t)), 2000) * (t / d) ** 2
    x = (0.5 * tone + 0.6 * nz) * (t / d) ** 2.2
    x[-int(0.04 * SR) :] *= np.linspace(1, 0, int(0.04 * SR))
    return reverb(stereo(norm(x, 0.8), 1), 1.8, 0.3)


def stamp():
    s = T(1.2)
    f = 50 + 60 * np.exp(-s * 25)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-s * 9)
    click = hp(rng.standard_normal(len(s)), 2500) * np.exp(-s * 160)
    return reverb(stereo(norm(x + 0.5 * click, 0.95)), 1.2, 0.25)


def paper(d=0.8):
    t = T(d)
    nz = bp(rng.standard_normal(len(t)), 2000, 7000)
    env = np.zeros(len(t))
    for _ in range(14):
        c = rng.uniform(0, d)
        env += np.exp(-((t - c) ** 2) / (2 * 0.012 ** 2))
    return stereo(norm(nz * env, 0.4), 1)


def shimmer(d=4.0):
    t = T(d)
    x = np.zeros(len(t))
    for _ in range(26):
        f = rng.uniform(1800, 6500)
        a = rng.uniform(0, d * 0.6)
        e = np.clip(t - a, 0, None)
        x += np.sin(2 * np.pi * f * t) * (t > a) * np.exp(-e * rng.uniform(1.5, 4))
    return reverb(stereo(norm(x, 0.35), 2), 3.0, 0.55)


def choir_hit(d=5.0):
    t = T(d)
    out = np.zeros(len(t))
    for f in (293.66, 349.23, 440.0, 587.33):
        vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * t)
        src = saw(f * vib, t) if False else 2 * ((np.cumsum(f * vib / SR)) % 1) - 1
        v = bp(src, 600, 800) + 0.7 * bp(src, 1100, 1350) + 0.3 * bp(src, 2400, 2800)
        out += v
    out *= adsr(len(t), 0.4, 3.0)
    return reverb(stereo(norm(out, 0.5), 1), 4.0, 0.5)


ELEM = {
    'whoosh': lambda: whoosh(1.3),
    'whoosh_low': lambda: whoosh(1.8, low=True),
    'sub_hit': sub_hit,
    'boom': boom,
    'impact': impact,
    'braam': lambda: braam(5.5),
    'riser': lambda: riser(5.0),
    'stamp': stamp,
    'paper': paper,
    'shimmer': shimmer,
    'choir_hit': choir_hit,
}
BEDS = {'drone_dark': drone_dark, 'tension_bed': tension_bed, 'pad_sacred': pad_sacred}
AMB = {'heartbeat': heartbeat, 'wind': wind}
GAIN = {  # qrup səviyyələri (dB) — danışıq üstün olsun deyə
    'beds': -15, 'amb': -16, 'sfx': -10,
}


def db(x): return 10 ** (x / 20)


def main(t0, t1, out_path):
    tl = json.load(open('src/ep1/timeline.json', encoding='utf8'))
    cues = [c for c in tl['sfx'] if t0 - 6 <= c['t'] <= t1]
    n = int((t1 - t0) * SR)
    music = np.zeros((n, 2))
    sfxb = np.zeros((n, 2))
    stops = sorted([c['t'] for c in cues if c['n'] in BEDS or c['n'] in ('cut_silence', 'braam')] + [t1])

    def place(buf, x, at, g):
        i = int((at - t0) * SR)
        a = max(0, -i)
        b = min(len(x), n - i)
        if b > a: buf[i + a : i + b] += x[a:b] * g

    for c in sorted(cues, key=lambda c: c['t']):
        nm, at, g = c['n'], c['t'], c['g']
        if nm in BEDS or nm in AMB:
            end = min([s for s in stops if s > at + 0.5] or [t1])
            x = (BEDS.get(nm) or AMB.get(nm))(end - at + 0.3)
            fo = int(0.25 * SR)
            x[-fo:] *= np.linspace(1, 0, fo)[:, None]
            place(music, x, at, g * db(GAIN['beds'] if nm in BEDS else GAIN['amb']))
        elif nm in ELEM:
            x = ELEM[nm]()
            buf = music if nm in ('braam', 'riser', 'choir_hit', 'shimmer') else sfxb
            place(buf, x, at, g * db(GAIN['sfx']))
    sf.write('build/_music.wav', np.clip(music, -1, 1), SR)
    sf.write('build/_sfx.wav', np.clip(sfxb, -1, 1), SR)

    # Səsləndirmə: 3 hissə qlobal vaxta görə
    offs = [(1, 0.0), (2, 312.45), (3, 312.45 + 397.5575)]
    inputs, chains = [], []
    k = 0
    for p, o in offs:
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'public/vo/ep1/{p}.mp3'], capture_output=True, text=True).stdout)
        if o + dur < t0 or o > t1: continue
        ss = max(0, t0 - o)
        delay = max(0, o - t0)
        inputs += ['-ss', f'{ss:.3f}', '-i', f'public/vo/ep1/{p}.mp3']
        chains.append(f'[{k}:a]aresample=48000,pan=stereo|c0=c0|c1=c0,adelay={int(delay*1000)}|{int(delay*1000)}[v{k}]')
        k += 1
    vmix = ''.join(f'[v{i}]' for i in range(k)) + f'amix=inputs={k}:normalize=0,atrim=0:{t1-t0:.3f}'
    fc = ';'.join(chains) + f';{vmix},highpass=f=70,equalizer=f=3200:t=q:w=1.2:g=2.5,acompressor=threshold=-18dB:ratio=3:attack=8:release=120,volume=1.0,asplit=2[vo][key];'
    fc += f'[{k}:a][key]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=450:makeup=1[md];'
    fc += f'[vo][md][{k+1}:a]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[out]'
    cmd = ['ffmpeg', '-y', '-loglevel', 'error'] + inputs + ['-i', 'build/_music.wav', '-i', 'build/_sfx.wav', '-filter_complex', fc, '-map', '[out]', '-ac', '2', out_path]
    subprocess.run(cmd, check=True)
    print('ok', out_path)


if __name__ == '__main__':
    main(float(sys.argv[1]), float(sys.argv[2]), sys.argv[3])
