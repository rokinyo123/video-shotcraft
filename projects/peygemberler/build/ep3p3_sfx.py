# EP3 · Bölüm 3: yalnız təbii səslər + keçid səsləri (musiqi YOX). İstifadəçi səsi sonra özü əlavə edir.
import sys; sys.path.insert(0, 'build')
import numpy as np, soundfile as sf, subprocess
import audio as A
SR = A.SR; D = 92.0
buf = np.zeros((int(D * SR), 2))
def st(m):
    m = np.asarray(m); return m if m.ndim == 2 else np.stack([m, m], 1)
def add(s, t, g, fi=0.0, fo=0.0):
    s = st(s) * A.db(g); i = int(t * SR); n = min(len(s), len(buf) - i)
    if n <= 0: return
    s = s[:n].copy()
    if fi: k = int(fi * SR); s[:k] *= np.linspace(0, 1, k)[:, None]
    if fo: k = int(fo * SR); s[-k:] *= np.linspace(1, 0, k)[:, None]
    buf[i:i + n] += s
def clip(path, a, b, lp=None):
    af = f'atrim={a}:{b},asetpts=PTS-STARTPTS' + (f',lowpass=f={lp},lowpass=f={lp}' if lp else '')
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-af', af, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2)
M = 'public/media/ep3c/'
# səhra küləyi (1–2 səhnə), gəmi içi taxta/külək (3–4), açıq səma (5)
add(A.wind(39.5), 0.0, -18, 0.3, 1.0)
add(A.wind(18.0), 59.0, -24, 1.0, 1.0)
add(A.wind(15.0), 77.0, -18, 1.0, 0.5)
# camaatın gülüşü/hay-küyü: klip səsi, danışıq anlaşılmasın deyə aşağı tezlik süzgəci
add(clip(M + 'c4_people_mock.mp4', 0, 2.8, lp=700), 8.2, -6, 0.1, 0.3)
add(clip(M + 'c3_crowd_mock.mp4', 0, 7.9, lp=700), 11.0, -6, 0.2, 0.8)
# keçidlər: whoosh + zərbə; başlanğıc hook
add(A.boom(), 0.1, -10); add(A.sub_hit(), 1.5, -9)
for c in (19.5, 39.0, 59.0, 77.0): add(A.whoosh(), c - 0.45, -12); add(A.impact(), c, -14)
for c in (4.6, 8.2, 11.0, 29.0, 43.75, 54.5, 67.5, 83.0): add(A.whoosh(), c - 0.4, -20)
# yazı vurğuları (incə)
for a in (30.6, 31.8, 33.0): add(A.click(), a, -16)
for a in (20.7, 21.0, 21.3): add(A.tick(), a, -18)
add(A.stamp(), 10.6, -16); add(A.stamp(), 44.0, -16)
# tamamlanma: hər şey zirvəyə qalxır və kəskin kəsilir
add(A.riser(3.0), 84.6, -14)
add(A.boom(), 87.6, -6); add(A.sub_hit(), 87.6, -8)
i = int(87.62 * SR); buf[i:int(87.75 * SR)] *= np.linspace(1, 0, int(87.75 * SR) - i)[:, None]; buf[int(87.75 * SR):int(89.0 * SR)] *= 0.25
sf.write('public/audio/ep3/sfx_p3.wav', np.clip(buf, -1, 1), SR); print('ok')
