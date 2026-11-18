import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, F, FPS} from '../theme';
import {env, Grain, Leak, Letterbox, Particles, Vignette} from '../ep1/layers';

// EP3 (Həzrəti Nuh) — ilk dəqiqə. Zamanlar səs faylından (build/align_ep3.py + fasilələr) götürülüb.
export const EP3_INTRO_DUR = 78.53;
const M = 'media/ep3/';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CLIP = 6.03;

type Shot = {kind: 'img' | 'vid'; src: string; a: number; b: number; from?: number; z0: number; z1: number; gray?: boolean; vol?: number; dark?: number};
const I = (n: number, a: number, b: number): Shot => ({kind: 'img', src: `img_${n}.jpg`, a, b, z0: 1.0, z1: 1.04});
const Vd = (n: number, a: number, b: number, o: Partial<Shot> = {}): Shot => ({kind: 'vid', src: `vid_${n}.mp4`, a, b, z0: 1.04, z1: 1.08, vol: 0.27, ...o});
// səhnə sərhədləri (fasilələrin ortası): 5.67 18.95 30.99 37.31 43.75 49.5 58.27
export const SHOTS: Shot[] = [
  I(1, 0, 1.8), Vd(1, 1.8, 5.67),
  I(2, 5.67, 7.6), Vd(2, 7.6, 13.64), Vd(1, 13.64, 18.95, {from: 2.0, z0: 1.0, z1: 1.1, dark: 0.25}),
  I(3, 18.95, 20.9), Vd(3, 20.9, 30.99),
  I(4, 30.99, 32.8), Vd(4, 32.8, 37.31, {vol: 0}),
  I(5, 37.31, 39.1), Vd(5, 39.1, 43.75, {vol: 0}),
  I(6, 43.75, 45.4), Vd(6, 45.4, 49.5),
  I(7, 49.5, 51.4), Vd(7, 51.4, 58.27, {vol: 0}),
  Vd(2, 58.27, 63.0, {from: 1.0, gray: true, vol: 0.12, z0: 1.0, z1: 1.06}), Vd(1, 63.0, 67.2, {gray: true, vol: 0.1, z0: 1.06, z1: 1.0}),
  I(8, 67.2, 69.1), Vd(8, 69.1, EP3_INTRO_DUR),
];
const SCENE_CUTS = [5.67, 18.95, 30.99, 37.31, 43.75, 49.5, 58.27, 67.2];
const XF = 0.3;

const ShotView: React.FC<{s: Shot; t: number}> = ({s, t}) => {
  const isCut = SCENE_CUTS.some((c) => Math.abs(c - s.a) < 0.01);
  const fin = isCut ? interpolate(t, [s.a - XF / 2, s.a + XF / 2], [0, 1], clamp) : 1;
  const z = interpolate(t, [s.a, s.b], [s.z0, s.z1], clamp);
  const style: React.CSSProperties = {position: 'absolute', width: 1920, height: 1080, objectFit: 'cover', transform: `scale(${z})`,
    filter: `${s.gray ? 'grayscale(0.85) sepia(0.35) brightness(0.8) ' : ''}contrast(1.08) saturate(0.97) brightness(${1 - (s.dark ?? 0)})`};
  const dur = s.b - s.a + 0.4;
  const from = s.from ?? 0;
  const rate = Math.max(0.6, Math.min(1, (CLIP - from - 0.05) / dur));
  return (
    <AbsoluteFill style={{opacity: fin}}>
      {s.kind === 'img' ? (
        <Img src={staticFile(M + s.src)} style={style} />
      ) : (
        <Sequence from={Math.round((s.a - (isCut ? XF / 2 : 0)) * FPS)} layout="none">
          <OffthreadVideo src={staticFile(M + s.src)} startFrom={Math.round(from * FPS)} playbackRate={rate} volume={s.vol ?? 0.27} style={style} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

// ---------- başlıq ----------
const Title: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.6, 0.6);
  if (o <= 0) return null;
  const f = t - a;
  const sc = interpolate(f, [0, b - a], [0.94, 1.03], clamp);
  const sweep = interpolate(f, [0.4, 2.6], [-30, 130], clamp);
  const sub = interpolate(f, [1.1, 1.8], [0, 1], clamp);
  const line = interpolate(f, [0.5, 1.5], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const GOLD = `linear-gradient(100deg, #b8862e 0%, #f3d58a ${sweep - 14}%, #fff6d8 ${sweep}%, #f3d58a ${sweep + 14}%, #9c6d26 100%)`;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(0,0,0,0.72), rgba(0,0,0,0) 80%)'}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${sc})`}}>
        <div style={{textAlign: 'center'}}>
          <div style={{position: 'relative', fontFamily: F.serif, fontWeight: 700, fontSize: 86, letterSpacing: 6, whiteSpace: 'nowrap'}}>
            <div style={{position: 'absolute', inset: 0, color: '#2a1a06', transform: 'translate(0, 6px)', filter: 'blur(6px)', opacity: 0.9}}>PEYĞƏMBƏRLƏRİN GİZLİ TARİXİ</div>
            <div style={{position: 'relative', backgroundImage: GOLD, WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 26px rgba(214,168,78,0.45))'}}>PEYĞƏMBƏRLƏRİN GİZLİ TARİXİ</div>
          </div>
          <div style={{margin: '22px auto', height: 2, width: 900 * line, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
          <div style={{opacity: sub, transform: `translateY(${(1 - sub) * 12}px)`, fontFamily: F.sans, fontWeight: 600, fontSize: 40, letterSpacing: 12, color: C.goldSoft, textShadow: '0 4px 20px #000'}}>BÖLÜM 3: HƏZRƏTİ NUH</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- 1: lower-third ----------
const LowerThird: React.FC<{t: number; a: number; b: number; k: string; text: string}> = ({t, a, b, k, text}) => {
  const o = env(t, a, b, 0.2, 0.5);
  if (o <= 0) return null;
  const f = t - a;
  const line = interpolate(f, [0, 0.6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const txt = interpolate(f, [0.35, 0.9], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 90, bottom: 170, opacity: o}}>
      <div style={{height: 2, width: 560 * line, background: `linear-gradient(90deg, ${C.gold}, rgba(214,168,78,0))`}} />
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 14, opacity: txt, transform: `translateX(${(1 - txt) * -24}px)`}}>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: C.gold}}>{k}</div>
        <div style={{width: 2, height: 34, background: C.gold, opacity: 0.7, alignSelf: 'center'}} />
        <div style={{fontFamily: F.serif, fontWeight: 600, fontSize: 46, color: C.ivory, textShadow: '0 3px 16px #000'}}>{text}</div>
      </div>
    </div>
  );
};

// ---------- 2: gəminin 3 mərtəbəsi ----------
const Floors: React.FC<{t: number; a: number; b: number; at: number[]}> = ({t, a, b, at}) => {
  const o = env(t, a, b, 0.3, 0.5);
  if (o <= 0) return null;
  const rows = [{y: 760, n: '1-Cİ MƏRTƏBƏ', v: 'Heyvanlar'}, {y: 560, n: '2-Cİ MƏRTƏBƏ', v: 'İnsanlar'}, {y: 360, n: '3-CÜ MƏRTƏBƏ', v: 'Quşlar'}];
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 45%)'}} />
      {/* şaquli ox */}
      <div style={{position: 'absolute', left: 1330, top: 360, width: 2, height: 400 * interpolate(t, [at[0] - 0.4, at[2]], [0, 1], clamp), transformOrigin: 'bottom', background: `linear-gradient(0deg, ${C.gold}, rgba(214,168,78,0.2))`, transform: 'translateY(0)'}} />
      {rows.map((r, i) => {
        const k = interpolate(t, [at[i], at[i] + 0.5], [0, 1], clamp);
        const glow = interpolate(t, [at[i], at[i] + 0.25, at[i] + 1.2], [0, 1, 0.35], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: 1330, top: r.y - 1, opacity: Math.max(0.15, k)}}>
            <div style={{position: 'absolute', left: -7, top: -7, width: 16, height: 16, borderRadius: 8, background: k > 0.5 ? C.gold : 'transparent', border: `2px solid ${C.gold}`, boxShadow: `0 0 ${24 * glow}px ${C.gold}`}} />
            <div style={{position: 'absolute', left: 16, top: 0, height: 2, width: 90 * k, background: C.gold}} />
            <div style={{position: 'absolute', left: 124, top: -40, whiteSpace: 'nowrap', opacity: k}}>
              <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 24, letterSpacing: 6, color: C.gold}}>{r.n}</div>
              <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 50, color: C.ivory, textShadow: `0 0 ${20 * glow}px rgba(240,217,160,0.8), 0 3px 14px #000`}}>{r.v}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 3: 80 mömin -> 3 qol ----------
const Lineage: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.3, 0.5);
  if (o <= 0) return null;
  const f = t - a;
  const dotsIn = interpolate(f, [0, 0.8], [0, 1], clamp);
  const fade = interpolate(f, [1.3, 2.4], [0, 1], clamp); // 77-si sönür
  const arrow = interpolate(f, [2.0, 2.6], [0, 1], clamp);
  const sons = ['SAM', 'HAM', 'YAFƏS'];
  const keep = new Set([33, 39, 46]);
  return (
    <div style={{position: 'absolute', right: 80, top: 150, width: 560, padding: '26px 30px', opacity: o, background: 'rgba(8,6,4,0.62)', border: '1px solid rgba(214,168,78,0.55)', borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.6)'}}>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 26, letterSpacing: 6, color: C.gold}}>80 MÖMİN</div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: 9, margin: '16px 0 18px'}}>
        {Array.from({length: 80}, (_, i) => {
          const on = i / 80 < dotsIn;
          const k = keep.has(i);
          return <div key={i} style={{width: 18, height: 18, borderRadius: 9, background: k ? C.gold : C.ivory, opacity: on ? (k ? 1 : 1 - 0.85 * fade) : 0, boxShadow: k && fade > 0.5 ? `0 0 14px ${C.gold}` : 'none', transform: `scale(${k ? 1 + 0.3 * fade : 1 - 0.3 * fade})`}} />;
        })}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: arrow}}>
        <div style={{fontFamily: F.serif, fontSize: 46, color: C.gold}}>→</div>
        <div>
          <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 26, letterSpacing: 5, color: C.ivory}}>YALNIZ 3 QOL</div>
          <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 44, color: C.goldSoft, letterSpacing: 3}}>{sons.join(' · ')}</div>
        </div>
      </div>
    </div>
  );
};

// ---------- 4: casus — gərginlik vinyetkası ----------
const Tension: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const p = 0.5 + 0.5 * Math.sin((t - a) * 5.2);
  const shake = Math.sin(t * 37) * 1.2;
  return (
    <AbsoluteFill style={{opacity: o, transform: `translateX(${shake}px)`}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse 62% 58% at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,${0.78 + 0.12 * p}) 100%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 55%, rgba(110,10,6,${0.18 * p}) 100%)`, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

export const Ep3Intro: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const fadeOut = interpolate(t, [EP3_INTRO_DUR - 1.0, EP3_INTRO_DUR - 0.03], [0, 1], clamp);
  const fadeIn = interpolate(t, [0, 0.35], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map((s, i) => (t >= s.a - XF && t < s.b + XF ? <ShotView key={i} s={s} t={t} /> : null))}
      {/* rəng bütövlüyü: isti işıqlar, dərin kölgələr */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,170,80,0.07), rgba(20,10,40,0.10))', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: 'rgba(255,190,120,0.05)', mixBlendMode: 'overlay'}} />
      <Particles t={t} kind="dust" n={45} />
      {SCENE_CUTS.map((c) => <Leak key={c} t={t} a={c - 0.35} />)}

      <Title t={t} a={1.0} b={6.0} />
      <LowerThird t={t} a={21.0} b={30.6} k="SİRR #1" text="Gəmidəki İlahi Sükunət" />
      <Floors t={t} a={31.3} b={37.1} at={[33.3, 34.3, 35.3]} />
      <Lineage t={t} a={44.0} b={49.35} />
      <Tension t={t} a={49.5} b={58.3} />

      <Vignette />
      <Grain t={t} />
      <Letterbox />
      <AbsoluteFill style={{background: '#000', opacity: Math.max(fadeIn, fadeOut)}} />

      <Audio src={staticFile('vo/ep3/ses_giris.mp3')} />
      <Audio src={staticFile('audio/ep3/bed.wav')} volume={0.9} />
    </AbsoluteFill>
  );
};
