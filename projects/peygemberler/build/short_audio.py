# Shorts treyleri səsi: treyler səsindən 3 seqment + açılış zərbəsi + sonluq kartı səsləri
import sys; sys.path.insert(0, 'build')
import numpy as np, soundfile as sf
import audio as A
SR = A.SR
x, sr = sf.read('out/ep2_trailer_audio.wav', always_2d=True)
assert sr == SR
segs = [(24.72, 200), (0.8, 714), (31.4, 618)]
parts = []
for a, fr in segs:
    s = x[int(round(a * SR)): int(round(a * SR)) + int(round(fr / 30 * SR))].copy()
    f = int(0.04 * SR)
    s[:f] *= np.linspace(0, 1, f)[:, None]; s[-f:] *= np.linspace(1, 0, f)[:, None]
    parts.append(s)
body = np.concatenate(parts)
def st(m):
    m = np.asarray(m)
    return m if m.ndim == 2 else np.stack([m, m], 1)
def add(buf, snd, t, g):
    snd = st(snd) * A.db(g); i = int(t * SR); n = min(len(snd), len(buf) - i)
    if n > 0: buf[i:i + n] += snd[:n]
# açılış zərbəsi (ilk kadrda diqqət)
add(body, A.sub_hit(), 0.0, -6); add(body, A.boom(), 0.0, -10)
end = np.zeros((int(8 * SR), 2))
add(end, A.pad_sacred(8.0), 0.0, -16)
add(end, A.whoosh(), 0.0, -10)
add(end, A.shimmer(3.0), 0.1, -12)
for t in (74, 104, 134):
    add(end, A.click(), t / 30, -6); add(end, A.shimmer(1.2), t / 30, -16)
add(end, A.bell(), 134 / 30 + 0.05, -8)
fo = int(0.4 * SR); end[-fo:] *= np.linspace(1, 0, fo)[:, None]
out = np.concatenate([body, end])
sf.write('out/short_audio_raw.wav', np.clip(out, -1, 1), SR)
print(len(out) / SR)
