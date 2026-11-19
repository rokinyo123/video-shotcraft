# EP3 · Bölüm 2: fon musiqisi + effektlər (VO sonra sidechain ilə qarışır)
import sys; sys.path.insert(0, 'build')
import numpy as np, soundfile as sf
import audio as A
SR = A.SR; D = 96.25
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
# yataqlar
add(A.pad_sacred(12.5), 0.0, -14, 0.6, 1.2)            # 950 il — müqəddəs, ağır
add(A.tension_bed(12.6), 11.6, -13, 0.8, 1.0)          # istehza
for k in range(6): add(A.taiko(0.9), 12.2 + k * 1.95, -16)
add(A.drone_dark(16.2), 23.7, -11, 1.0, 1.2)           # ayə, Vailə
add(A.mystery_bed(13.6), 39.4, -13, 1.0, 1.0)          # gizli möminlər, gecə
add(A.tension_bed(14.4), 52.6, -12, 0.8, 1.0)          # casusluq
add(A.heartbeat(14.0), 52.9, -11, 0.5, 0.8)
add(A.mystery_bed(13.6), 66.6, -14, 1.0, 1.0)          # şayiə
add(A.sorrow_bed(16.6), 79.7, -12, 1.2, 1.5)           # dərs + tufan
add(A.rain if hasattr(A, 'rain') else A.water, 0, -99) if False else None
# effektlər
add(A.boom(), 0.3, -9); add(A.shimmer(3.0), 0.5, -15)  # fəsil kartı
add(A.riser(1.6), 6.0, -18); add(A.impact(), 7.6, -12); add(A.tick(), 8.0, -16)
for t in [11.95, 24.03, 39.72, 52.92, 66.85, 79.97]: add(A.whoosh(), t - 0.45, -16)
add(A.impact(), 19.0, -9); add(A.sub_hit(), 19.05, -10)  # daşqalaq
add(A.stamp(), 20.7, -9)                                # "sən dəli olmusan"
add(A.choir_hit(4.0), 28.0, -15)                        # ayə
add(A.sub_hit(), 36.4, -8); add(A.braam(3.0), 36.4, -16)  # VAİLƏ
add(A.clock(4.0), 40.0, -22)
add(A.stamp(), 43.2, -12); add(A.shimmer(1.2), 45.9, -14)
for m in [57.4, 57.75, 58.1, 58.45, 58.8, 59.15, 59.5, 59.85, 60.2, 60.55]: add(A.click(), m, -13)
add(A.whoosh(), 60.9, -12); add(A.sub_hit(), 64.6, -9)
add(A.wind(9.0), 70.5, -20, 1.0, 1.0)
add(A.water(16.0), 80.0, -13, 1.0, 1.0); add(A.wind(16.0), 80.0, -16, 1.0, 1.0)
for a in (82.0, 88.2, 93.3, 94.0): add(A.boom(), a, -10)
for a in (1.8, 13.75, 25.83, 41.52, 54.72, 68.65, 81.77): add(A.shimmer(1.2), a, -15); add(A.whoosh(), a - 0.2, -18)
add(A.impact(), 93.3, -8)
fo = int(1.2 * SR); buf[-fo:] *= np.linspace(1, 0, fo)[:, None]
sf.write('public/audio/ep3/bed_b2.wav', np.clip(buf, -1, 1), SR); print('ok')
