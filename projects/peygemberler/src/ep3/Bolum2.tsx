import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, F, FPS} from '../theme';
import {AyahCard, env, Grain, Leak, Letterbox, Particles, SourceTag, Vignette} from '../ep1/layers';

// EP3 · Bölüm 2: "Öz evindəki casus". Səhnə sərhədləri səsdəki fasilələrdən (build/align_ep3b.py + silencedetect).
export const B2_DUR = 96.25;
const M = 'media/ep3b/';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.sin);
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Key = {t: number; s: number; x: number; y: number};
type Scene = {
  img: string; a: number; b: number; path: Key[];
  fg?: {x: number; y: number; rx: number; ry: number}; // personaj qatı (paralaks + nəfəs)
  rays?: boolean; rain?: number; fog?: boolean; flicker?: boolean; beam?: boolean; sea?: boolean; warm?: number; cold?: number;
  shake?: number[]; flash?: number[]; stones?: number;
};
// sərhədlər: 11.95 24.03 39.72 52.92 66.85 79.97
export const SCENES: Scene[] = [
  {img: 'k1.jpg', a: 0, b: 11.95, rays: true, warm: 0.08, fg: {x: 50, y: 48, rx: 10, ry: 40},
    path: [{t: 0, s: 1.18, x: 50, y: 42}, {t: 6.5, s: 1.08, x: 50, y: 45}, {t: 11.95, s: 1.0, x: 50, y: 48}]},
  {img: 'k2.jpg', a: 11.95, b: 24.03, warm: 0.05, fg: {x: 20, y: 62, rx: 22, ry: 45}, shake: [19.0, 20.75], stones: 19.0,
    path: [{t: 11.95, s: 1.12, x: 15, y: 55}, {t: 17.2, s: 1.18, x: 35, y: 52}, {t: 20.7, s: 1.26, x: 22, y: 45}, {t: 24.03, s: 1.3, x: 20, y: 44}]},
  {img: 'k3.jpg', a: 24.03, b: 39.72, beam: true, flicker: true, fg: {x: 57, y: 56, rx: 8, ry: 30},
    path: [{t: 24.03, s: 1.0, x: 55, y: 50}, {t: 32, s: 1.08, x: 57, y: 50}, {t: 36.2, s: 1.12, x: 58, y: 48}, {t: 39.72, s: 1.32, x: 58, y: 45}]},
  {img: 'k4.jpg', a: 39.72, b: 52.92, fog: true, flicker: true, rain: 0.35, cold: 0.12, fg: {x: 80, y: 55, rx: 10, ry: 30},
    path: [{t: 39.72, s: 1.05, x: 60, y: 55}, {t: 46, s: 1.15, x: 72, y: 55}, {t: 52.92, s: 1.32, x: 80, y: 55}]},
  {img: 'k5.jpg', a: 52.92, b: 66.85, fg: {x: 80, y: 55, rx: 18, ry: 45}, cold: 0.06,
    path: [{t: 52.92, s: 1.04, x: 70, y: 50}, {t: 58, s: 1.14, x: 85, y: 45}, {t: 62.6, s: 1.2, x: 80, y: 45}, {t: 66.85, s: 1.12, x: 75, y: 50}]},
  {img: 'k6.jpg', a: 66.85, b: 79.97, rays: true, warm: 0.06, fg: {x: 52, y: 62, rx: 24, ry: 42},
    path: [{t: 66.85, s: 1.02, x: 50, y: 55}, {t: 71.3, s: 1.12, x: 70, y: 50}, {t: 76, s: 1.24, x: 74, y: 45}, {t: 79.97, s: 1.3, x: 72, y: 45}]},
  {img: 'k7.jpg', a: 79.97, b: B2_DUR, sea: true, rain: 0.9, cold: 0.1, flash: [80.4, 88.2, 93.3, 94.0], shake: [93.3],
    path: [{t: 79.97, s: 1.12, x: 50, y: 50}, {t: 88, s: 1.06, x: 45, y: 55}, {t: 93.3, s: 1.08, x: 45, y: 58}, {t: B2_DUR, s: 1.0, x: 45, y: 58}]},
];
const XF = 0.6;

const Rain: React.FC<{t: number; o: number}> = ({t, o}) => (
  <AbsoluteFill style={{opacity: o}}>
    {Array.from({length: 150}, (_, i) => {
      const y = ((rnd(i + 7) + t * (1.6 + rnd(i) * 1.2)) % 1.2) * 1200 - 120;
      const x = rnd(i + 3) * 2100 - 90 - y * 0.18;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: 1.6, height: 40 + rnd(i + 9) * 60, background: 'linear-gradient(180deg, rgba(220,230,255,0), rgba(220,230,255,0.55))', transform: 'rotate(10deg)'}} />;
    })}
  </AbsoluteFill>
);

// daşqalaq: kameraya doğru uçan daşlar
const Stones: React.FC<{t: number; at: number}> = ({t, at}) => {
  const f = t - at;
  if (f < 0 || f > 1.6) return null;
  return (
    <AbsoluteFill>
      {Array.from({length: 7}, (_, i) => {
        const st = i * 0.16, k = interpolate(f, [st, st + 0.55], [0, 1], clamp);
        if (k <= 0 || k >= 1) return null;
        const x0 = 300 + rnd(i) * 900, y0 = 520 + rnd(i + 2) * 120;
        const x1 = 200 + rnd(i + 4) * 1500, y1 = 200 + rnd(i + 6) * 700;
        const sz = 6 + k * k * 120;
        return <div key={i} style={{position: 'absolute', left: x0 + (x1 - x0) * k, top: y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * 120, width: sz, height: sz * 0.8, borderRadius: '45% 55% 40% 60%', background: 'radial-gradient(circle at 35% 30%, #8a7a62, #3a2f22 70%)', filter: `blur(${k * 3}px)`, transform: `rotate(${k * 300 * (i % 2 ? 1 : -1)}deg)`, boxShadow: '0 4px 10px rgba(0,0,0,0.6)'}} />;
      })}
    </AbsoluteFill>
  );
};

const SceneView: React.FC<{s: Scene; t: number; first: boolean}> = ({s, t, first}) => {
  const fin = first ? 1 : interpolate(t, [s.a - XF / 2, s.a + XF / 2], [0, 1], clamp);
  const ts = s.path.map((p) => p.t);
  const z = interpolate(t, ts, s.path.map((p) => p.s), {...clamp, easing: ease});
  const ox = interpolate(t, ts, s.path.map((p) => p.x), {...clamp, easing: ease});
  const oy = interpolate(t, ts, s.path.map((p) => p.y), {...clamp, easing: ease});
  const prog = (t - s.a) / (s.b - s.a);
  const par = (prog - 0.5) * 22; // paralaks məsafəsi
  const breathe = 1 + 0.006 * Math.sin(t * 1.6);
  const sh = Math.max(0, ...(s.shake ?? []).map((a) => interpolate(t, [a, a + 0.05, a + 0.6], [0, 1, 0], clamp)));
  const shx = sh * (Math.sin(t * 61) * 10), shy = sh * (Math.cos(t * 53) * 7);
  const fl = Math.max(0, ...(s.flash ?? []).map((a) => interpolate(t, [a, a + 0.04, a + 0.1, a + 0.16, a + 0.45], [0, 0.9, 0.25, 0.7, 0], clamp)));
  const flick = s.flicker ? 1 + 0.05 * Math.sin(t * 11) + 0.04 * Math.sin(t * 23.7) : 1;
  const grade = `contrast(1.1) saturate(${1 - (s.cold ?? 0)}) brightness(${flick * (1 + fl * 0.9)})`;
  const img: React.CSSProperties = {position: 'absolute', width: 1920, height: 1080, objectFit: 'cover', filter: grade};
  const fgMask = s.fg ? `radial-gradient(ellipse ${s.fg.rx}% ${s.fg.ry}% at ${s.fg.x}% ${s.fg.y}%, #000 55%, transparent 100%)` : '';
  return (
    <AbsoluteFill style={{opacity: fin, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${shx}px, ${shy}px) scale(${z})`, transformOrigin: `${ox}% ${oy}%`}}>
        {/* arxa plan qatı */}
        <AbsoluteFill style={{transform: `translateX(${-par}px) scale(1.03)`}}>
          <Img src={staticFile(M + s.img)} style={img} />
          {s.sea ? (
            <div style={{position: 'absolute', inset: 0, WebkitMaskImage: 'linear-gradient(180deg, transparent 45%, #000 60%)', maskImage: 'linear-gradient(180deg, transparent 45%, #000 60%)'}}>
              <Img src={staticFile(M + s.img)} style={{...img, filter: `url(#water) ${grade}`}} />
            </div>
          ) : null}
        </AbsoluteFill>
        {/* personaj qatı: önə çıxır, nəfəs alır */}
        {s.fg ? (
          <AbsoluteFill style={{WebkitMaskImage: fgMask, maskImage: fgMask, transform: `translateX(${par * 0.6}px) scale(${1.03 * breathe})`, transformOrigin: `${s.fg.x}% ${s.fg.y + s.fg.ry * 0.8}%`}}>
            <Img src={staticFile(M + s.img)} style={{...img, filter: `${grade} url(#cloth)`}} />
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      {/* atmosfer */}
      {s.warm ? <AbsoluteFill style={{background: `rgba(255,170,80,${s.warm})`, mixBlendMode: 'overlay'}} /> : null}
      {s.cold ? <AbsoluteFill style={{background: `rgba(60,90,140,${s.cold})`, mixBlendMode: 'soft-light'}} /> : null}
      {s.rays ? (
        <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.55}}>
          {Array.from({length: 6}, (_, i) => (
            <div key={i} style={{position: 'absolute', left: `${30 + i * 8 + Math.sin(t * 0.4 + i) * 3}%`, top: '-20%', width: 60 + i * 14, height: '140%', transform: `rotate(${18 + i * 2}deg)`, background: 'linear-gradient(180deg, rgba(255,225,160,0.35), rgba(255,225,160,0))', filter: 'blur(18px)', opacity: 0.5 + 0.5 * Math.sin(t * 0.7 + i * 1.3)}} />
          ))}
        </AbsoluteFill>
      ) : null}
      {s.beam ? (
        <AbsoluteFill style={{mixBlendMode: 'screen'}}>
          <div style={{position: 'absolute', left: '44%', top: '18%', width: 520, height: 900, transform: 'rotate(-38deg)', transformOrigin: 'top left', background: 'linear-gradient(180deg, rgba(255,215,150,0.32), rgba(255,215,150,0))', filter: 'blur(22px)', opacity: 0.75 + 0.2 * Math.sin(t * 1.1)}} />
          {Array.from({length: 40}, (_, i) => {
            const y = ((rnd(i) + t * 0.02 * (1 + rnd(i + 1))) % 1) * 600 + 250;
            const x = 760 + rnd(i + 5) * 380 + Math.sin(t * 0.8 + i) * 20 - (y - 250) * 0.5;
            return <div key={i} style={{position: 'absolute', left: x, top: y, width: 3, height: 3, borderRadius: 2, background: 'rgba(255,235,190,0.9)', opacity: 0.4 + 0.6 * Math.sin(t * 2 + i)}} />;
          })}
        </AbsoluteFill>
      ) : null}
      {s.fog ? (
        <AbsoluteFill style={{opacity: 0.55}}>
          <div style={{position: 'absolute', left: -400 + ((t * 30) % 400), top: 520, width: 2800, height: 600, background: 'radial-gradient(ellipse at 50% 50%, rgba(170,180,200,0.35), rgba(170,180,200,0) 70%)', filter: 'blur(30px)'}} />
        </AbsoluteFill>
      ) : null}
      {s.rain ? <Rain t={t} o={s.rain} /> : null}
      {s.stones ? <Stones t={t} at={s.stones} /> : null}
      {fl > 0 ? <AbsoluteFill style={{background: '#dfe8ff', opacity: fl * 0.35, mixBlendMode: 'screen'}} /> : null}
    </AbsoluteFill>
  );
};

// ---------- qrafikalar ----------
const Glass: React.CSSProperties = {background: 'rgba(10,8,5,0.58)', backdropFilter: 'blur(14px) saturate(1.2)', WebkitBackdropFilter: 'blur(14px) saturate(1.2)', border: '1.5px solid rgba(243,213,138,0.7)', borderRadius: 6, boxShadow: '0 0 30px rgba(214,168,78,0.25), inset 0 0 20px rgba(214,168,78,0.1)'};

const ChapterCard: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.5, 0.8);
  if (o <= 0) return null;
  const f = t - a;
  const sp = interpolate(f, [0, b - a], [4, 14], clamp);
  const line = interpolate(f, [0.3, 1.3], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 55% 40% at 50% 50%, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 85%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, height: 320, background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 25%, rgba(0,0,0,0.75) 75%, rgba(0,0,0,0) 100%)'}} />
      <div style={{textAlign: 'center', position: 'relative'}}>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 28, letterSpacing: 14, color: C.gold}}>BÖLÜM 2</div>
        <div style={{margin: '18px auto', height: 2, width: 640 * line, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 96, letterSpacing: sp, backgroundImage: 'linear-gradient(180deg, #fff3cc, #e6c06a 55%, #9c6d26)', WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 26px rgba(214,168,78,0.45)) drop-shadow(0 6px 18px #000)'}}>ÖZ EVİNDƏKİ CASUS</div>
      </div>
    </AbsoluteFill>
  );
};

// 950 il sayğacı + zaman zolağı
const Years: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.3, 0.6);
  if (o <= 0) return null;
  const k = interpolate(t, [a, a + 1.6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const n = Math.round(950 * k);
  return (
    <div style={{position: 'absolute', left: 110, top: 300, opacity: o, ...Glass, padding: '26px 40px 30px', width: 470}}>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 22, letterSpacing: 8, color: C.gold}}>TƏBLİĞ MÜDDƏTİ</div>
      <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 132, lineHeight: 1, color: '#fff3cc', textShadow: '0 0 30px rgba(243,213,138,0.6)'}}>{n}<span style={{fontSize: 56, marginLeft: 14, color: C.goldSoft}}>İL</span></div>
      <div style={{height: 6, marginTop: 14, background: 'rgba(240,217,160,0.18)', borderRadius: 3}}>
        <div style={{height: 6, width: `${k * 100}%`, background: `linear-gradient(90deg, ${C.gold}, #fff3cc)`, borderRadius: 3, boxShadow: `0 0 14px ${C.gold}`}} />
      </div>
      <div style={{fontFamily: F.sans, fontSize: 20, letterSpacing: 4, color: C.ivory, marginTop: 10, opacity: 0.8}}>ƏNKƏBUT 29:14</div>
    </div>
  );
};

// istehza sitatı
const Mock: React.FC<{t: number; a: number; b: number; text: string}> = ({t, a, b, text}) => {
  const o = env(t, a, b, 0.08, 0.5);
  if (o <= 0) return null;
  const sc = interpolate(t - a, [0, 0.25], [1.6, 1], {...clamp, easing: Easing.out(Easing.exp)});
  const jit = Math.sin(t * 47) * 2;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{transform: `scale(${sc}) rotate(-3deg) translate(${jit}px, 0)`, padding: '10px 40px', background: 'rgba(120,14,8,0.82)', border: '3px solid rgba(255,190,170,0.8)', boxShadow: '0 10px 40px rgba(0,0,0,0.7)', fontFamily: F.sans, fontWeight: 700, fontSize: 82, letterSpacing: 4, color: '#fff2ea'}}>{text}</div>
    </AbsoluteFill>
  );
};

// ad kartı
const NameCard: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const k = interpolate(t, [a, a + 0.8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', right: 120, top: 330, opacity: o, ...Glass, padding: '22px 34px', borderColor: 'rgba(196,83,43,0.85)', boxShadow: '0 0 30px rgba(196,83,43,0.35)'}}>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 22, letterSpacing: 8, color: '#e58a6a'}}>NUHUN HƏYAT YOLDAŞI</div>
      <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 92, letterSpacing: 12 * k, color: '#fff2ea', textShadow: '0 0 24px rgba(196,83,43,0.6)'}}>VAİLƏ</div>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 22, letterSpacing: 3, color: '#f0a080'}}>⚠ ad rəvayətdəndir</div>
    </div>
  );
};

// xəyanətin növü: ✗ / ✓
const Betrayal: React.FC<{t: number; a: number; b: number; xAt: number; vAt: number}> = ({t, a, b, xAt, vAt}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const fr = Math.round(t * FPS);
  const kx = spring({frame: fr - Math.round(xAt * FPS), fps: FPS, config: {damping: 14}});
  const kv = spring({frame: fr - Math.round(vAt * FPS), fps: FPS, config: {damping: 14}});
  const strike = interpolate(t, [xAt + 0.3, xAt + 0.8], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 110, top: 280, opacity: o, ...Glass, padding: '26px 38px', width: 600}}>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 22, letterSpacing: 8, color: C.gold, marginBottom: 16}}>XƏYANƏTİN NÖVÜ</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, opacity: kx, transform: `translateX(${(1 - kx) * -30}px)`}}>
        <div style={{width: 44, height: 44, borderRadius: 22, border: '2px solid #c4532b', color: '#e58a6a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontFamily: F.sans}}>✕</div>
        <div style={{position: 'relative', fontFamily: F.serif, fontWeight: 700, fontSize: 50, color: 'rgba(239,230,210,0.6)'}}>Namus xəyanəti
          <div style={{position: 'absolute', left: 0, top: '54%', height: 4, width: `${strike * 100}%`, background: '#c4532b', boxShadow: '0 0 10px #c4532b'}} />
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 16, opacity: kv, transform: `translateX(${(1 - kv) * -30}px)`}}>
        <div style={{width: 44, height: 44, borderRadius: 22, border: `2px solid ${C.gold}`, color: '#ffe08a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontFamily: F.sans, boxShadow: `0 0 14px ${C.gold}`}}>✓</div>
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 50, color: '#ffe08a', textShadow: '0 0 18px rgba(255,200,90,0.5)'}}>İman və casusluq</div>
      </div>
    </div>
  );
};

// casusluq şəbəkəsi: möminlər bir-bir qeyd olunur → zalım başçılar
const Person: React.FC<{c: string}> = ({c}) => (
  <svg width="54" height="64" viewBox="0 0 54 64"><circle cx="27" cy="16" r="11" fill={c} /><path d="M6 62 C6 40 14 32 27 32 C40 32 48 40 48 62Z" fill={c} /></svg>
);
const Ledger: React.FC<{t: number; a: number; b: number; marks: number[]; sendAt: number; tortureAt: number}> = ({t, a, b, marks, sendAt, tortureAt}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const send = interpolate(t, [sendAt, sendAt + 0.9], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const tor = interpolate(t, [tortureAt, tortureAt + 0.4], [0, 1], clamp);
  const pulse = tor * (0.5 + 0.5 * Math.sin(t * 7));
  return (
    <AbsoluteFill style={{opacity: o}}>
      <div style={{position: 'absolute', left: 100, top: 250, ...Glass, padding: '24px 30px', width: 470}}>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 22, letterSpacing: 7, color: C.gold, marginBottom: 14}}>GİZLİ İMAN GƏTİRƏNLƏR</div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14}}>
          {marks.map((m, i) => {
            const k = interpolate(t, [m, m + 0.3], [0, 1], clamp);
            return (
              <div key={i} style={{position: 'relative', opacity: 0.5 + 0.5 * k}}>
                <Person c={k > 0.5 ? (tor > 0.5 ? `rgba(196,60,40,${0.6 + 0.4 * pulse})` : '#e58a6a') : 'rgba(239,230,210,0.55)'} />
                {k > 0 ? <svg width="54" height="64" style={{position: 'absolute', left: 0, top: 0}}><circle cx="27" cy="32" r={30 * k} fill="none" stroke="#c4532b" strokeWidth="3" strokeDasharray="190" strokeDashoffset={190 * (1 - k)} /></svg> : null}
              </div>
            );
          })}
        </div>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <path d="M 572 420 C 760 420 820 300 1010 300" fill="none" stroke="#c4532b" strokeWidth={3} strokeDasharray="520" strokeDashoffset={520 * (1 - send)} style={{filter: 'drop-shadow(0 0 8px #c4532b)'}} />
      </svg>
      <div style={{position: 'absolute', left: 1020, top: 250, opacity: send, transform: `scale(${0.9 + 0.1 * send})`, ...Glass, borderColor: 'rgba(196,83,43,0.9)', padding: '18px 28px', boxShadow: `0 0 ${20 + 30 * pulse}px rgba(196,60,40,0.5)`}}>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 20, letterSpacing: 6, color: '#e58a6a'}}>XƏBƏR ÖTÜRÜLÜR</div>
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 48, color: '#fff2ea'}}>ZALIM BAŞÇILAR</div>
      </div>
    </AbsoluteFill>
  );
};

// şayiə: pıçıltı dalğaları + sözlər
const Rumor: React.FC<{t: number; a: number; b: number; words: {s: string; at: number}[]; cx: number; cy: number}> = ({t, a, b, words, cx, cy}) => {
  const o = env(t, a, b, 0.4, 0.6);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 5}, (_, i) => {
          const p = ((t - a) * 0.5 + i / 5) % 1;
          return <circle key={i} cx={cx} cy={cy} r={60 + p * 900} fill="none" stroke="#e8c27a" strokeWidth={2} opacity={(1 - p) * 0.45} />;
        })}
      </svg>
      {words.map((w, i) => {
        const k = interpolate(t, [w.at, w.at + 0.5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        if (k <= 0) return null;
        return (
          <div key={i} style={{position: 'absolute', left: 140, top: 260 + i * 96, opacity: k, transform: `translateX(${(1 - k) * -30}px)`, filter: `blur(${(1 - k) * 6}px)`,
            fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 64, color: '#fff2dc', textShadow: '0 4px 20px #000, 0 0 30px rgba(232,194,122,0.4)'}}>
            {w.s}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// dərs kartı
const Lesson: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.6, 0.6);
  if (o <= 0) return null;
  const k = interpolate(t, [a, a + 1.0], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{...Glass, padding: '34px 60px 30px', textAlign: 'center', transform: `translateY(${(1 - k) * 24}px)`}}>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 24, letterSpacing: 10, color: C.gold}}>TARİXİN DƏRSİ</div>
        <div style={{margin: '14px auto 10px', height: 2, width: 420 * k, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 70, color: '#fff3cc', letterSpacing: 2, textShadow: '0 0 26px rgba(243,213,138,0.4)'}}>İmansız yaxınlıq xilas etmir</div>
        <div style={{fontFamily: F.sans, fontSize: 22, letterSpacing: 4, color: C.goldSoft, marginTop: 12}}>TƏHRİM 66:10</div>
      </div>
    </AbsoluteFill>
  );
};

export const Bolum2: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const fadeIn = interpolate(t, [0, 0.4], [1, 0], clamp);
  const fadeOut = interpolate(t, [B2_DUR - 1.2, B2_DUR - 0.05], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id="water"><feTurbulence type="fractalNoise" baseFrequency={`${0.008 + 0.002 * Math.sin(t * 1.3)} 0.028`} numOctaves={2} seed={Math.floor(t * 12)} result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={18} xChannelSelector="R" yChannelSelector="G" /></filter>
        <filter id="cloth"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves={1} seed={Math.floor(t * 3)} result="n" /><feDisplacementMap in="SourceGraphic" in2="n" scale={3} xChannelSelector="R" yChannelSelector="G" /></filter>
      </svg>
      {SCENES.map((s, i) => (t >= s.a - XF && t < s.b + XF ? <SceneView key={i} s={s} t={t} first={i === 0} /> : null))}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,170,80,0.06), rgba(20,10,40,0.10))', mixBlendMode: 'soft-light'}} />
      <Particles t={t} kind="dust" n={45} />
      {[11.95, 24.03, 39.72, 52.92, 66.85, 79.97].map((c) => <Leak key={c} t={t} a={c - 0.35} />)}

      <ChapterCard t={t} a={0.3} b={4.6} />
      <Years t={t} a={7.5} b={11.7} />
      <SourceTag t={t} a={13.9} b={18.7} label="Qurani-Kərim · Nuh 71:7" icon="quran" />
      <Mock t={t} a={20.7} b={23.6} text="«SƏN DƏLİ OLMUSAN!»" />
      <AyahCard t={t} a={28.0} b={35.3} ar="ضَرَبَ اللَّهُ مَثَلًا لِّلَّذِينَ كَفَرُوا امْرَأَتَ نُوحٍ وَامْرَأَتَ لُوطٍ ۖ كَانَتَا تَحْتَ عَبْدَيْنِ مِنْ عِبَادِنَا صَالِحَيْنِ فَخَانَتَاهُمَا" az="Allah kafirlərə Nuhun və Lutun qadınlarını misal çəkdi: onlar Bizim iki saleh qulumuzun nikahında idilər, lakin onlara xəyanət etdilər." ref_="TƏHRİM · 66:10" />
      <NameCard t={t} a={36.4} b={39.5} />
      <SourceTag t={t} a={40.1} b={52.5} label="İbn Kəsir (Təfsir) · Təbəri (Tarix)" icon="quill" />
      <Betrayal t={t} a={42.9} b={52.6} xAt={43.2} vAt={45.9} />
      <Ledger t={t} a={55.0} b={66.5} marks={[57.4, 57.75, 58.1, 58.45, 58.8, 59.15, 59.5, 59.85, 60.2, 60.55]} sendAt={60.9} tortureAt={64.6} />
      <Rumor t={t} a={70.9} b={79.6} cx={1250} cy={560} words={[{s: '«Ərimə inanmayın…»', at: 71.4}, {s: '«O, ağlını itirib…»', at: 72.9}, {s: '«Məcnun olub!»', at: 74.9}]} />
      <Lesson t={t} a={83.6} b={91.0} />

      <Vignette />
      <Grain t={t} />
      <Letterbox />
      <AbsoluteFill style={{background: '#000', opacity: Math.max(fadeIn, fadeOut)}} />
    </AbsoluteFill>
  );
};
