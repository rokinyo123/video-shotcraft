# Hibrit giriş: kağız səhifələrinin səsləri (xışıltı, pop, möhür, sayğac)
import sys; sys.path.insert(0, 'build')
import numpy as np, soundfile as sf
import audio as A
SR = A.SR; buf = np.zeros((int(78.6 * SR), 2))
def st(m):
    m = np.asarray(m); return m if m.ndim == 2 else np.stack([m, m], 1)
def add(s, t, g):
    s = st(s) * A.db(g); i = int(t * SR); n = min(len(s), len(buf) - i); buf[i:i + n] += s[:n]
def pop():
    tt = np.arange(int(0.09 * SR)) / SR
    f = 900 * np.exp(-tt * 30) + 420
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 45) * 0.8
for a in (31.0, 37.6): add(A.paper(0.9), a, -6); add(A.whoosh(), a - 0.1, -14)
add(A.paper(0.7), 49.35, -10)
for base in (33.25, 34.45, 35.65):
    for k, d in enumerate((0, 0.15, 0.3, 0.45, 0.6)): add(pop(), base + d, -12 - k)
for a in (39.7, 40.0, 47.6, 48.2): add(pop(), a, -10)
add(A.stamp(), 42.9, -6); add(A.sub_hit(), 42.9, -14)
for k in range(18): add(A.tick(), 44.9 + k * 0.08 * (1 + k / 12), -16)
add(A.shimmer(1.2), 46.4, -14)
sf.write('public/audio/ep3/sfx_hybrid.wav', np.clip(buf, -1, 1), SR); print('ok')
