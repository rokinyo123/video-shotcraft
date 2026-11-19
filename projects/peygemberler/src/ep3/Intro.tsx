import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, F, FPS} from '../theme';
import {env, Grain, Leak, Letterbox, Particles, SourceTag, Vignette} from '../ep1/layers';

// EP3 (Həzrəti Nuh) — giriş. Zamanlar səsdən: səhnə sərhədləri fasilələrdən, söz vaxtları build/ep3_words.py.
export const EP3_INTRO_DUR = 78.53;
const M = 'media/ep3/';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CLIP = 6.03;

type Shot = {kind: 'img' | 'vid' | 'eng'; src: string; a: number; b: number; from?: number; z0: number; z1: number; gray?: boolean; vol?: number; dark?: number;
  cut?: boolean; draw?: [number, number]; lamp?: [number, number]; away?: [number, number]; top?: boolean; flash?: number[]; rain?: [number, number]; candle?: boolean; origin?: string; crush?: boolean};
const I = (n: number, a: number, b: number, o: Partial<Shot> = {}): Shot => ({kind: 'img', src: `img_${n}.jpg`, a, b, z0: 1.0, z1: 1.04, ...o});
const Vd = (n: number, a: number, b: number, o: Partial<Shot> = {}): Shot => ({kind: 'vid', src: `vid_${n}.mp4`, a, b, z0: 1.04, z1: 1.08, vol: 0.27, ...o});
const E = (n: number, a: number, b: number, draw: [number, number], lamp: [number, number], o: Partial<Shot> = {}): Shot => ({kind: 'eng', src: `img_${n}.jpg`, a, b, z0: 1.0, z1: 1.05, draw, lamp, ...o});

export const SHOTS: Shot[] = [
  // 1 — salamlama + seriya başlığı (başlıq oxunsun deyə kadr bir az tündləşir)
  I(1, 0, 1.8, {dark: 0.3}), Vd(1, 1.8, 5.67, {dark: 0.3}),
  // 2 — "hamımız uşaqlıqdan eşitmişik": gəmi köhnə kitab qravürası kimi açılır; "yağış yağdı"da yağış + ildırım
  E(1, 5.67, 12.02, [5.75, 7.6], [7.5, 9.2], {cut: true, z0: 1.0, z1: 1.1, rain: [10.75, 12.1], flash: [10.95, 11.6]}),
  Vd(5, 12.02, 13.75, {from: 3.4, vol: 0, z0: 1.0, z1: 1.05, cut: true}),
  // "bu hekayənin arxasında çox az adamın bildiyi sirlər" — şam işığında köhnə kitablar
  I(8, 13.75, 18.95, {dark: 0.35, z0: 1.0, z1: 1.14, cut: true, candle: true}),
  // 3 — gəminin içi → şir və ceyran
  Vd(4, 18.95, 23.2, {vol: 0, z0: 1.0, z1: 1.06, cut: true}),
  I(3, 23.2, 24.7, {cut: true}), Vd(3, 24.7, 30.99),
  // 4 — 3 mərtəbə: kəsik qravüra kimi çəkilir, sonra mərtəbələr yanır
  E(4, 30.99, 37.75, [31.05, 32.3], [32.2, 33.05], {cut: true, z0: 1.0, z1: 1.0}),
  // 5 — 80 mömin
  I(5, 37.75, 39.3, {cut: true}), Vd(5, 39.3, 43.75, {vol: 0}),
  // 6 — 8 milyard, 3 oğul
  I(6, 43.75, 45.4, {cut: true}), Vd(6, 45.4, 49.5),
  // 7 — casus qadın: qadına yaxın kadr, mühafizəçilər kölgədə
  I(7, 49.5, 51.4, {cut: true, flash: [49.55], z0: 1.45, z1: 1.55, origin: '28% 45%', crush: true}),
  Vd(7, 51.4, 58.27, {vol: 0, z0: 1.4, z1: 1.5, origin: '22% 45%', crush: true}),
  // 8 — "standart hekayələri kənara qoyun": solğun kadr kart olub kənara uçur → mənbələr
  Vd(5, 58.27, 62.7, {from: 0.2, gray: true, vol: 0, z0: 1.0, z1: 1.06, cut: true}),
  I(8, 66.3, 69.1, {z0: 1.02, z1: 1.06}), Vd(8, 69.1, EP3_INTRO_DUR),
  Vd(1, 62.7, 67.25, {gray: true, vol: 0.1, z0: 1.05, z1: 1.0, away: [66.25, 67.2], top: true}),
];
const XF = 0.3;

const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const Rain: React.FC<{t: number; o: number}> = ({t, o}) => (
  <AbsoluteFill style={{opacity: o}}>
    {Array.from({length: 150}, (_, i) => {
      const y = ((rnd(i + 7) + t * (1.6 + rnd(i) * 1.2)) % 1.2) * 1200 - 120;
      const x = rnd(i + 3) * 2100 - 90 - y * 0.18;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: 1.6, height: 40 + rnd(i + 9) * 60, background: 'linear-gradient(180deg, rgba(220,230,255,0), rgba(220,230,255,0.6))', transform: 'rotate(10deg)'}} />;
    })}
  </AbsoluteFill>
);

const Lines: React.FC<{src: string; t: number; draw: [number, number]; o: number}> = ({src, t, draw, o}) => {
  const k = interpolate(t, draw, [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const R = 60 + k * 1500;
  const mask = `radial-gradient(circle at 52% 48%, #000 ${R - 260}px, rgba(0,0,0,0.4) ${R - 120}px, transparent ${R}px)`;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o, WebkitMaskImage: mask, maskImage: mask, mixBlendMode: 'screen', filter: `drop-shadow(0 0 ${6 + 5 * Math.sin(t * 6)}px rgba(255,200,110,0.8))`}}>
      <Img src={staticFile(M + src.replace('.jpg', '_lines.png'))} style={{position: 'absolute', width: 1920, height: 1080, objectFit: 'cover'}} />
    </div>
  );
};

const ShotView: React.FC<{s: Shot; t: number}> = ({s, t}) => {
  const fin = s.cut ? interpolate(t, [s.a - XF / 2, s.a + XF / 2], [0, 1], clamp) : 1;
  let z = interpolate(t, [s.a, s.b], [s.z0, s.z1], clamp);
  const fl = Math.max(0, ...(s.flash ?? []).map((a) => interpolate(t, [a, a + 0.04, a + 0.1, a + 0.16, a + 0.45], [0, 0.9, 0.25, 0.7, 0], clamp)));
  const rk = s.rain ? interpolate(t, [s.rain[0], s.rain[0] + 0.3], [0, 1], clamp) : 0;
  const cf = s.candle ? 1 + 0.06 * Math.sin(t * 13) + 0.04 * Math.sin(t * 29) : 1;
  const style: React.CSSProperties = {position: 'absolute', width: 1920, height: 1080, objectFit: 'cover',
    filter: `${s.gray ? 'grayscale(0.85) sepia(0.35) brightness(0.8) ' : ''}${s.crush ? 'contrast(1.35) saturate(0.8) ' : 'contrast(1.08) saturate(0.97) '}${rk ? `saturate(${1 - 0.5 * rk}) hue-rotate(${-12 * rk}deg) ` : ''}brightness(${(1 - (s.dark ?? 0)) * (1 - 0.45 * rk) * cf * (s.crush ? 0.9 : 1) * (1 + fl * 0.8)})`};
  // kənara uçan kart
  let wrap: React.CSSProperties = {opacity: fin};
  if (s.away) {
    const k = interpolate(t, s.away, [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
    const card = interpolate(t, [s.away[0] - 0.6, s.away[0]], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
    wrap = {opacity: fin, transform: `translateX(${-k * 2300}px) rotate(${-k * 14}deg) scale(${1 - 0.2 * card})`, boxShadow: card > 0 ? `0 30px 80px rgba(0,0,0,${0.8 * card})` : undefined};
  }
  if (s.kind === 'eng') {
    const lr = interpolate(t, [s.lamp![0], s.lamp![0] + 0.3, s.lamp![1] - 0.3, s.lamp![1] + 0.5], [0, 260, 330, 2400], clamp);
    const lx = interpolate(t, s.lamp!, [18, 80], {...clamp, easing: Easing.inOut(Easing.sin)});
    const ly = 48 + Math.sin(t * 2.2) * 8;
    const cm = `radial-gradient(circle at ${lx}% ${ly}%, #000 ${lr * 0.55}px, rgba(0,0,0,0.6) ${lr * 0.8}px, transparent ${lr}px)`;
    const lo = interpolate(t, [s.lamp![1] - 0.1, s.lamp![1] + 0.7], [1, 0], clamp);
    return (
      <AbsoluteFill style={wrap}>
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2b1e10 0%, #120c06 70%)'}} />
        <AbsoluteFill style={{transform: `scale(${z})`}}>
          <div style={{position: 'absolute', inset: 0, WebkitMaskImage: cm, maskImage: cm}}><Img src={staticFile(M + s.src)} style={style} /></div>
          <Lines src={s.src} t={t} draw={s.draw!} o={lo} />
        </AbsoluteFill>
        {rk > 0 ? <Rain t={t} o={rk * 0.85} /> : null}
        {fl > 0 ? <AbsoluteFill style={{background: '#dfe8ff', opacity: fl * 0.35, mixBlendMode: 'screen'}} /> : null}
        {t > s.lamp![0] && t < s.lamp![1] + 0.6 ? <AbsoluteFill style={{background: `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,190,100,0.28) 0px, rgba(255,190,100,0) ${lr * 1.1}px)`, mixBlendMode: 'screen'}} /> : null}
      </AbsoluteFill>
    );
  }
  const from = s.from ?? 0;
  const dur = s.b - s.a + 0.4;
  const rate = Math.max(0.6, Math.min(1, (CLIP - from - 0.05) / dur));
  return (
    <AbsoluteFill style={wrap}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: s.origin ?? '50% 50%'}}>
        {s.kind === 'img' ? (
          <Img src={staticFile(M + s.src)} style={style} />
        ) : (
          <Sequence from={Math.round((s.a - (s.cut ? XF / 2 : 0)) * FPS)} layout="none">
            <OffthreadVideo src={staticFile(M + s.src)} startFrom={Math.round(from * FPS)} playbackRate={rate} volume={s.vol ?? 0.27} style={style} />
          </Sequence>
        )}
      </AbsoluteFill>
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
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 45% at 50% 50%, rgba(0,0,0,0.82), rgba(0,0,0,0.25) 85%)'}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${sc})`}}>
        <div style={{textAlign: 'center'}}>
          <div style={{position: 'relative', fontFamily: F.serif, fontWeight: 700, fontSize: 86, letterSpacing: 6, whiteSpace: 'nowrap'}}>
            <div style={{position: 'absolute', inset: 0, color: '#000', transform: 'translate(0, 5px)', filter: 'blur(8px)', opacity: 1, WebkitTextStroke: '6px #000'}}>PEYĞƏMBƏRLƏRİN GİZLİ TARİXİ</div>
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
    <div style={{position: 'absolute', left: 60, bottom: 150, opacity: o, padding: '18px 34px 20px 30px', background: 'linear-gradient(90deg, rgba(6,4,2,0.82) 0%, rgba(6,4,2,0.65) 70%, rgba(6,4,2,0) 100%)'}}>
      <div style={{height: 2, width: 560 * line, background: `linear-gradient(90deg, ${C.gold}, rgba(214,168,78,0))`}} />
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginTop: 14, opacity: txt, transform: `translateX(${(1 - txt) * -24}px)`}}>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 30, letterSpacing: 6, color: C.gold}}>{k}</div>
        <div style={{width: 2, height: 34, background: C.gold, opacity: 0.7, alignSelf: 'center'}} />
        <div style={{fontFamily: F.serif, fontWeight: 600, fontSize: 46, color: C.ivory, textShadow: '0 3px 16px #000'}}>{text}</div>
      </div>
    </div>
  );
};

// ---------- 2: gəminin 3 mərtəbəsi (kəsik şəklin real mərtəbələri üzərində) ----------
// img_4 1376x768 → 1920x1080 cover (x1.406, x-7.5): quşlar y 56–387, insanlar 415–654, heyvanlar 675–962; en 569–1567
const FL = [
  {y0: 676, y1: 960, n: '1-Cİ MƏRTƏBƏ', v: 'Heyvanlar', at: 33.25},
  {y0: 418, y1: 652, n: '2-Cİ MƏRTƏBƏ', v: 'İnsanlar', at: 34.1},
  {y0: 150, y1: 392, n: '3-CÜ MƏRTƏBƏ', v: 'Quşlar', at: 34.95},
];
const Floors: React.FC<{t: number; a: number; b: number; all: number}> = ({t, a, b, all}) => {
  const o = env(t, a, b, 0.3, 0.4);
  if (o <= 0) return null;
  const dim = interpolate(t, [FL[0].at - 0.3, FL[0].at], [0, 1], clamp) * interpolate(t, [all, all + 0.4], [1, 0.35], clamp);
  const cur = FL.reduce((c, f, i) => (t >= f.at ? i : c), -1);
  const allK = interpolate(t, [all, all + 0.4], [0, 1], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      {/* aktiv mərtəbədən başqa hər yer qaralır */}
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <mask id="fl">
            <rect width="1920" height="1080" fill="white" />
            {FL.map((f, i) => (i === cur || allK > 0 ? <rect key={i} x={560} y={f.y0} width={1015} height={f.y1 - f.y0} rx={6} fill="black" opacity={i === cur ? 1 : allK} /> : null))}
          </mask>
        </defs>
        <rect width="1920" height="1080" fill="black" opacity={0.62 * dim} mask="url(#fl)" />
        {FL.map((f, i) => {
          const k = interpolate(t, [f.at, f.at + 0.45], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          if (k <= 0) return null;
          const P = 2 * (1015 + (f.y1 - f.y0));
          const act = i === cur ? 1 : 0.55;
          return (
            <g key={i} opacity={act}>
              <rect x={560} y={f.y0} width={1015} height={f.y1 - f.y0} rx={6} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray={P} strokeDashoffset={P * (1 - k)} style={{filter: `drop-shadow(0 0 ${i === cur ? 12 : 4}px ${C.gold})`}} />
              <line x1={1575} y1={(f.y0 + f.y1) / 2} x2={1575 + 60 * k} y2={(f.y0 + f.y1) / 2} stroke={C.gold} strokeWidth={2} />
              <circle cx={1575} cy={(f.y0 + f.y1) / 2} r={6} fill={C.gold} />
            </g>
          );
        })}
      </svg>
      {FL.map((f, i) => {
        const k = interpolate(t, [f.at + 0.15, f.at + 0.55], [0, 1], clamp);
        if (k <= 0) return null;
        const act = i === cur ? 1 : 0.7;
        return (
          <div key={i} style={{position: 'absolute', left: 1648, top: (f.y0 + f.y1) / 2 - 52, opacity: k * act, transform: `translateX(${(1 - k) * 20}px)`, padding: '10px 18px', background: 'rgba(8,6,4,0.72)', borderLeft: `3px solid ${C.gold}`}}>
            <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 20, letterSpacing: 5, color: C.gold}}>{f.n}</div>
            <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 46, color: C.ivory, lineHeight: 1.05}}>{f.v}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- 3: 80 mömin -> 3 qol ----------
const Lineage: React.FC<{t: number; a: number; b: number; dots: number; gone: number; sonsAt: number}> = ({t, a, b, dots, gone, sonsAt}) => {
  const o = env(t, a, b, 0.3, 0.5);
  if (o <= 0) return null;
  const f = t - a;
  const dotsIn = interpolate(t, [dots, dots + 1.2], [0, 1], clamp);
  const fade = interpolate(t, [gone, gone + 1.4], [0, 1], clamp); // 77-si sönür
  const arrow = interpolate(t, [sonsAt, sonsAt + 0.7], [0, 1], clamp);
  void f;
  const sons = ['SAM', 'HAM', 'YAFƏS'];
  const keep = new Set([33, 39, 46]);
  return (
    <div style={{position: 'absolute', right: 70, top: 150, width: 660, padding: '30px 36px', opacity: o, background: 'rgba(6,4,2,0.84)', border: '1.5px solid rgba(214,168,78,0.8)', borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.6)'}}>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 34, letterSpacing: 6, color: C.gold}}>80 MÖMİN</div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: 11, margin: '18px 0 20px'}}>
        {Array.from({length: 80}, (_, i) => {
          const on = i / 80 < dotsIn;
          const k = keep.has(i);
          return <div key={i} style={{width: 22, height: 22, borderRadius: 11, background: k ? C.gold : C.ivory, opacity: on ? (k ? 1 : 1 - 0.85 * fade) : 0, boxShadow: k && fade > 0.5 ? `0 0 14px ${C.gold}` : 'none', transform: `scale(${k ? 1 + 0.3 * fade : 1 - 0.3 * fade})`}} />;
        })}
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: arrow}}>
        <div style={{fontFamily: F.serif, fontSize: 46, color: C.gold}}>→</div>
        <div>
          <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 32, letterSpacing: 5, color: '#ffffff'}}>YALNIZ 3 QOL</div>
          <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 52, color: '#ffd96b', letterSpacing: 3, textShadow: '0 0 18px rgba(255,200,90,0.55)'}}>{sons.join(' · ')}</div>
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
      {/* mühafizəçilər kölgədə qalır, işıq qadının üzərindədir */}
      <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.9) 26%, rgba(0,0,0,0) 44%)'}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 55%, rgba(110,10,6,${0.18 * p}) 100%)`, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

// ---------- böyük sual ----------
const BigQ: React.FC<{t: number; a: number; b: number; text: string}> = ({t, a, b, text}) => {
  const o = env(t, a, b, 0.15, 0.4);
  if (o <= 0) return null;
  const sc = interpolate(t - a, [0, 0.35], [1.25, 1], {...clamp, easing: Easing.out(Easing.exp)});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 55% 35% at 50% 50%, rgba(0,0,0,0.6), rgba(0,0,0,0) 80%)'}} />
      <div style={{transform: `scale(${sc})`, fontFamily: F.serif, fontWeight: 700, fontSize: 120, letterSpacing: 10, color: '#f3d58a', textShadow: '0 0 40px rgba(214,168,78,0.55), 0 8px 30px #000'}}>{text}</div>
    </AbsoluteFill>
  );
};

// ---------- mənbələr ----------
const SRC: {k: string; at: number}[] = [
  {k: 'QURANİ-KƏRİM', at: 67.5}, {k: 'SƏHİH HƏDİSLƏR', at: 68.05}, {k: 'İBN KƏSİR', at: 68.85}, {k: 'TƏBƏRİ', at: 69.9},
];
const Sources: React.FC<{t: number; b: number}> = ({t, b}) => {
  const fr = Math.round(t * FPS);
  const out = interpolate(t, [b - 0.5, b], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 165, display: 'flex', justifyContent: 'center', gap: 22, opacity: out}}>
      {SRC.map((s) => {
        const k = spring({frame: fr - Math.round(s.at * FPS), fps: FPS, config: {damping: 14, stiffness: 170}});
        const glow = interpolate(t, [s.at, s.at + 0.2, s.at + 1.0], [0, 1, 0], clamp);
        return (
          <div key={s.k} style={{opacity: Math.min(1, k * 1.4), transform: `translateY(${(1 - k) * 30}px)`, padding: '14px 30px', background: 'rgba(10,7,4,0.75)', border: `1.5px solid rgba(214,168,78,${0.6 + 0.4 * glow})`, boxShadow: `0 0 ${30 * glow}px rgba(214,168,78,0.6)`, fontFamily: F.sans, fontWeight: 600, fontSize: 28, letterSpacing: 5, color: C.goldSoft}}>
            {s.k}
          </div>
        );
      })}
    </div>
  );
};

// ---------- son sətir ----------
const Final: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.5, 0.6);
  if (o <= 0) return null;
  const sp = interpolate(t, [a, b], [12, 5], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 85%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 400, height: 280, background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 22%, rgba(0,0,0,0.8) 78%, rgba(0,0,0,0) 100%)'}} />
      <div style={{textAlign: 'center', position: 'relative'}}>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 34, letterSpacing: 12, color: '#f0d9a0'}}>HƏZRƏTİ NUHUN</div>
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 100, letterSpacing: sp, WebkitTextStroke: '0px', backgroundImage: 'linear-gradient(180deg, #fff3cc, #e6c06a 55%, #9c6d26)', WebkitBackgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 30px rgba(214,168,78,0.45))'}}>GİZLİ HƏQİQƏTLƏRİ</div>
      </div>
    </AbsoluteFill>
  );
};

export const Ep3Intro: React.FC<{withAudio?: boolean}> = () => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const fadeOut = interpolate(t, [EP3_INTRO_DUR - 1.0, EP3_INTRO_DUR - 0.03], [0, 1], clamp);
  const order = [...SHOTS].sort((x, y) => Number(!!x.top) - Number(!!y.top));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {order.map((s, i) => (t >= s.a - XF && t < s.b + XF ? <ShotView key={i} s={s} t={t} /> : null))}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,170,80,0.07), rgba(20,10,40,0.10))', mixBlendMode: 'soft-light'}} />
      <AbsoluteFill style={{background: 'rgba(255,190,120,0.05)', mixBlendMode: 'overlay'}} />
      <Particles t={t} kind="dust" n={45} />
      {[5.67, 18.95, 30.99, 37.31, 43.75, 49.5, 58.27].map((c) => <Leak key={c} t={t} a={c - 0.35} />)}

      <Title t={t} a={0.25} b={5.5} />
      <LowerThird t={t} a={25.0} b={30.7} k="SİRR #1" text="Gəmidəki İlahi Sükunət" />
      <LowerThird t={t} a={31.2} b={32.95} k="SİRR #2" text="Üç Mərtəbəli Gəmi" />
      <SourceTag t={t} a={33.3} b={37.6} label="Rəvayət · İbn Abbas (Təbəri, İbn Kəsir)" weak icon="quill" />
      <LowerThird t={t} a={39.9} b={43.6} k="SİRR #3" text="İz Qoymayan Nəsillər" />
      <LowerThird t={t} a={44.0} b={49.3} k="SİRR #4" text="Bəşəriyyətin Üç Atası" />
      <Floors t={t} a={33.0} b={37.75} all={35.85} />
      <Lineage t={t} a={39.3} b={49.6} dots={39.9} gone={42.3} sonsAt={47.8} />
      <Tension t={t} a={49.5} b={58.3} />
      <BigQ t={t} a={49.7} b={51.3} text="ƏN BÖYÜK SUAL…" />
      {t > 67.3 && t < 76.5 ? <Sources t={t} b={76.3} /> : null}
      <Final t={t} a={76.7} b={78.3} />

      <Vignette />
      <Grain t={t} />
      <Letterbox />
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />
    </AbsoluteFill>
  );
};
