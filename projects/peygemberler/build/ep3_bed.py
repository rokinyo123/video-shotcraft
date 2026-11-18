# EP3 giriş: fon musiqisi + səs effektləri (VO-suz), Remotion-da VO və klip səsləri ilə qarışır
import sys; sys.path.insert(0, 'build')
import numpy as np, soundfile as sf
import audio as A
SR = A.SR; D = 78.53
buf = np.zeros((int(D * SR), 2))
def st(m):
    m = np.asarray(m); return m if m.ndim == 2 else np.stack([m, m], 1)
def add(snd, t, g, fi=0.0, fo=0.0):
    s = st(snd) * A.db(g); i = int(t * SR); n = min(len(s), len(buf) - i)
    if n <= 0: return
    s = s[:n].copy()
    if fi: k = int(fi * SR); s[:k] *= np.linspace(0, 1, k)[:, None]
    if fo: k = int(fo * SR); s[-k:] *= np.linspace(1, 0, k)[:, None]
    buf[i:i + n] += s
# yataqlar (səhnələrə görə)
add(A.mystery_bed(19.5), 0.0, -13, 0.5, 1.5)            # giriş, sirli
add(A.tension_bed(31.0), 18.6, -12, 1.5, 1.5)
for k in range(16): add(A.taiko(0.8), 19.0 + k * 1.9, -17)          # gəmi sirləri
add(A.drone_dark(9.5), 49.3, -10, 0.6, 1.2)
add(A.heartbeat(8.8), 49.5, -12, 0.5, 0.8)            # casus qadın
add(A.tension_bed(9.5), 58.0, -14, 0.8, 1.5)
add(A.pad_sacred(12.5), 66.0, -13, 1.5, 1.2)           # mənbələr
# effektlər
add(A.boom(), 1.0, -9); add(A.shimmer(4.0), 1.1, -15)   # başlıq
for t in [5.67, 18.95, 30.99, 37.31, 43.75, 58.27, 67.2]:
    add(A.whoosh(), t - 0.45, -17)
add(A.sub_hit(), 49.5, -8); add(A.braam(4.0), 49.5, -16)
add(A.riser(2.5), 41.3, -20); add(A.choir_hit(4.0), 43.75, -18)
add(A.paper(), 67.3, -14)
fo = int(1.0 * SR); buf[-fo:] *= np.linspace(1, 0, fo)[:, None]
sf.write('public/audio/ep3/bed.wav', np.clip(buf, -1, 1), SR); print('ok')
