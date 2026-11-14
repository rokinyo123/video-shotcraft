import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const FPS = 30;
const ease = Easing.bezier(0.33, 0, 0.2, 1);

/** Qlobal saniyə (kompozisiyanın başlanğıcı + kadr). */
export const useT = (offset: number) => offset + useCurrentFrame() / FPS;

const env = (t: number, a: number, b: number, fin = 0.5, fout = 0.5) =>
  interpolate(t, [a, a + fin, b - fout, b], [0, 1, 1, 0], clamp);

/* ---------------- FON: şəkil / video + Ken Burns ---------------- */
export type BgSpec = {
  type: 'image' | 'video' | 'dark';
  src?: string;
  last?: string; // video bitəndən sonra qalan son kadr
  rate?: number;
  startFrom?: number; // saniyə
  clipLen?: number;
  kb?: [number, number, number, number, number, number]; // s0,x0,y0 → s1,x1,y1 (%)
  dark?: number;
  grade?: string;
};

export const Background: React.FC<{bg: BgSpec; t: number; a: number; b: number}> = ({bg, t, a, b}) => {
  const p = interpolate(t, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const [s0, x0, y0, s1, x1, y1] = bg.kb ?? [1.04, 0, 0, 1.14, 0, 0];
  const sc = s0 + (s1 - s0) * p;
  const tx = x0 + (x1 - x0) * p;
  const ty = y0 + (y1 - y0) * p;
  const style: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: `scale(${sc}) translate(${tx}%, ${ty}%)`,
    filter: bg.grade,
  };
  let media: React.ReactNode = null;
  if (bg.type === 'image' && bg.src) media = <Img src={staticFile(bg.src)} style={style} />;
  if (bg.type === 'video' && bg.src) {
    const rate = bg.rate ?? 1;
    const played = (t - a) * rate + (bg.startFrom ?? 0);
    const len = bg.clipLen ?? 7.9;
    media =
      played < len - 0.12 || !bg.last ? (
        <OffthreadVideo
          src={staticFile(bg.src)}
          muted
          playbackRate={rate}
          startFrom={Math.round((bg.startFrom ?? 0) * FPS)}
          style={style}
        />
      ) : (
        <Img src={staticFile(bg.last)} style={style} />
      );
  }
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      {media}
      <AbsoluteFill style={{background: `rgba(5,4,7,${bg.dark ?? 0.25})`}} />
    </AbsoluteFill>
  );
};

/* ---------------- Atmosfer ---------------- */
export const Particles: React.FC<{t: number; kind: 'dust' | 'embers' | 'lights'; n?: number; alpha?: number}> = ({
  t,
  kind,
  n = 70,
  alpha = 1,
}) => {
  const col = kind === 'embers' ? '#ff7a2e' : kind === 'lights' ? '#fff3cf' : C.goldSoft;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id={`pg-${kind}`}>
          <stop offset="0" stopColor={col} stopOpacity="1" />
          <stop offset="1" stopColor={col} stopOpacity="0" />
        </radialGradient>
      </defs>
      {new Array(n).fill(0).map((_, i) => {
        const sp = kind === 'embers' ? 40 + random(`s${i}`) * 90 : 8 + random(`s${i}`) * 22;
        const x = (random(`x${i}`) * 1920 + Math.sin(t * 0.6 + i) * 30) % 1920;
        const y = (((random(`y${i}`) * 1200 - t * sp) % 1200) + 1200) % 1200 - 60;
        const r = (kind === 'lights' ? 3 : 1.2) + random(`r${i}`) * (kind === 'embers' ? 3 : 4);
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * (1 + random(`w${i}`) * 2) + i));
        return <circle key={i} cx={x} cy={y} r={r * 2.4} fill={`url(#pg-${kind})`} opacity={tw * alpha * (kind === 'dust' ? 0.5 : 0.9)} />;
      })}
    </svg>
  );
};

export const Grain: React.FC<{t: number}> = ({t}) => {
  const k = Math.floor(t * 24);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${staticFile('fx/grain.png')})`,
        backgroundPosition: `${(k * 137) % 512}px ${(k * 241) % 512}px`,
        opacity: 0.07,
        mixBlendMode: 'overlay',
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)'}} />
);

export const BAR = 118;
export const Letterbox: React.FC = () => (
  <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: BAR, background: '#000'}} />
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: BAR, background: '#000'}} />
  </>
);

export const Corner: React.FC<{alpha: number}> = ({alpha}) => (
  <div
    style={{
      position: 'absolute',
      top: 44,
      right: 64,
      fontFamily: F.sans,
      fontSize: 15,
      letterSpacing: 5,
      color: C.gold,
      opacity: 0.55 * alpha,
    }}
  >
    PEYĞƏMBƏRLƏRİN GİZLİ TARİXİ · 1
  </div>
);

/* ---------------- Altyazı ---------------- */
const NAMES = /(Allah|Adəm\w*|İblis\w*|Həvva\w*|Musa\w*|Davud\w*|mələk\w*|Mələk\w*|Cənnət\w*|İbn Həcər|Səhih Müslim\w*|Səhih Buxari\w*)/;
export const Subtitle: React.FC<{text: string; t: number; a: number; b: number}> = ({text, t, a, b}) => {
  const o = env(t, a, b, 0.12, 0.12);
  if (o <= 0) return null;
  const parts = text.split(NAMES);
  return (
    <div
      style={{
        position: 'absolute',
        left: 160,
        right: 160,
        bottom: 0,
        height: BAR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: F.sans,
        fontWeight: 600,
        fontSize: 36,
        lineHeight: 1.25,
        color: '#f3ecdc',
        opacity: o,
      }}
    >
      <span>
        {parts.map((p, i) => (NAMES.test(p) ? <span key={i} style={{color: C.gold}}>{p}</span> : <span key={i}>{p}</span>))}
      </span>
    </div>
  );
};

/* ---------------- Kartlar ---------------- */
export const BigText: React.FC<{t: number; a: number; b: number; text: string; sub?: string; color?: string; size?: number}> = ({
  t,
  a,
  b,
  text,
  sub,
  color = C.ivory,
  size = 104,
}) => {
  const o = env(t, a, b, 0.25, 0.4);
  if (o <= 0) return null;
  const k = interpolate(t, [a, a + 0.35], [1.35, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const drift = interpolate(t, [a, b], [1, 1.05], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{textAlign: 'center', transform: `scale(${k * drift})`}}>
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: size, color, letterSpacing: 2, textShadow: '0 8px 50px rgba(0,0,0,0.95)'}}>
          {text}
        </div>
        {sub && (
          <div style={{marginTop: 18, fontFamily: F.serif, fontStyle: 'italic', fontSize: 46, color: C.goldSoft, opacity: interpolate(t, [a + 0.6, a + 1.1], [0, 1], clamp)}}>
            {sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const Stamp: React.FC<{t: number; a: number; b: number; top: string; main: string; color?: string}> = ({t, a, b, top, main, color = C.gold}) => {
  const o = env(t, a, b, 0.05, 0.4);
  if (o <= 0) return null;
  const k = interpolate(t, [a, a + 0.18], [2.6, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const shake = t - a < 0.35 ? Math.sin((t - a) * 90) * 6 * (1 - (t - a) / 0.35) : 0;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div
        style={{
          transform: `translate(${shake}px, ${shake * 0.6}px) scale(${k}) rotate(-4deg)`,
          border: `4px solid ${color}`,
          outline: `1px solid ${color}`,
          outlineOffset: 8,
          padding: '26px 56px',
          textAlign: 'center',
          background: 'rgba(8,6,4,0.72)',
          boxShadow: `0 0 80px rgba(0,0,0,0.9), 0 0 40px ${color}33`,
        }}
      >
        <div style={{fontFamily: F.sans, fontSize: 22, letterSpacing: 10, color}}>{top}</div>
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 78, color: C.ivory, marginTop: 6, letterSpacing: 3}}>{main}</div>
      </div>
    </AbsoluteFill>
  );
};

export const AyahCard: React.FC<{t: number; a: number; b: number; ar: string; az: string; ref_: string}> = ({t, a, b, ar, az, ref_}) => {
  const o = env(t, a, b, 0.6, 0.6);
  if (o <= 0) return null;
  const reveal = interpolate(t, [a + 0.2, a + 2.0], [0, 100], {...clamp, easing: ease});
  const azO = interpolate(t, [a + 1.4, a + 2.2], [0, 1], clamp);
  const lift = interpolate(t, [a, a + 0.8], [30, 0], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div
        style={{
          width: 1360,
          padding: '54px 70px 46px',
          textAlign: 'center',
          transform: `translateY(${lift}px) perspective(1400px) rotateX(${lift / 6}deg)`,
          background: 'linear-gradient(180deg, rgba(14,10,6,0.82), rgba(8,6,4,0.9))',
          border: `1px solid ${C.gold}66`,
          boxShadow: `0 30px 120px rgba(0,0,0,0.85), inset 0 0 60px ${C.gold}14`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 18}}>
          <div style={{height: 1, width: 140, background: `linear-gradient(90deg, transparent, ${C.gold})`}} />
          <div style={{fontFamily: F.sans, fontSize: 18, letterSpacing: 8, color: C.gold}}>QURANİ-KƏRİM</div>
          <div style={{height: 1, width: 140, background: `linear-gradient(90deg, ${C.gold}, transparent)`}} />
        </div>
        <div
          dir="rtl"
          style={{
            fontFamily: F.arabic,
            fontSize: 74,
            lineHeight: 1.7,
            color: C.goldSoft,
            textShadow: `0 0 30px ${C.gold}55`,
            clipPath: `inset(0 0 0 ${100 - reveal}%)`,
          }}
        >
          {ar}
        </div>
        <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 46, color: C.ivory, marginTop: 10, opacity: azO}}>
          “{az}”
        </div>
        <div style={{fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: C.gold, marginTop: 22, opacity: azO}}>{ref_}</div>
      </div>
    </AbsoluteFill>
  );
};

export const QCard: React.FC<{t: number; a: number; b: number; n: number; q: string; sub?: string; subAt?: number; img?: string}> = ({
  t,
  a,
  b,
  n,
  q,
  sub,
  subAt,
  img,
}) => {
  const o = env(t, a, b, 0.3, 0.3);
  if (o <= 0) return null;
  const inP = interpolate(t, [a, a + 0.6], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const z = interpolate(t, [a, b], [1.0, 1.08], clamp);
  const subO = sub ? interpolate(t, [(subAt ?? a + 1) - 0.1, (subAt ?? a + 1) + 0.5], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill style={{opacity: o}}>
      {img && (
        <AbsoluteFill style={{overflow: 'hidden'}}>
          <Img src={staticFile(img)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${z})`, filter: 'blur(3px) brightness(0.38) saturate(0.8)'}} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: 1400, textAlign: 'center', transform: `translateY(${(1 - inP) * 40}px)`}}>
          <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 200, lineHeight: 0.8, color: C.gold, opacity: 0.18 * inP}}>
            {String(n).padStart(2, '0')}
          </div>
          <div style={{fontFamily: F.sans, letterSpacing: 12, fontSize: 22, color: C.gold, marginTop: -40, marginBottom: 26}}>SUAL</div>
          <div
            style={{
              fontFamily: F.serif,
              fontWeight: 700,
              fontSize: 86,
              lineHeight: 1.1,
              color: C.ivory,
              filter: `blur(${(1 - inP) * 10}px)`,
              textShadow: '0 8px 50px rgba(0,0,0,0.95)',
            }}
          >
            {q}
          </div>
          {sub && (
            <div style={{marginTop: 28, fontFamily: F.serif, fontStyle: 'italic', fontSize: 44, color: C.goldSoft, opacity: subO}}>{sub}</div>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const SeriesTitle: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.05, 0.8);
  if (o <= 0) return null;
  const f = t - a;
  const line = interpolate(f, [0.1, 0.9], [0, 1], {...clamp, easing: ease});
  const title = interpolate(f, [0.0, 0.9], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const spacing = interpolate(f, [0, 4.5], [46, 16], {...clamp, easing: Easing.out(Easing.quad)});
  const ep = interpolate(f, [2.9, 3.5], [0, 1], clamp);
  const flash = interpolate(f, [0, 0.06, 0.6], [0, 0.85, 0], clamp);
  const sweep = interpolate(f, [0.6, 2.4], [-30, 130], clamp);
  return (
    <AbsoluteFill style={{opacity: o, background: C.bg}}>
      <Particles t={t} kind="dust" n={90} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: F.sans, fontSize: 28, letterSpacing: spacing / 2, color: C.gold, opacity: title, marginBottom: 14}}>
            PEYĞƏMBƏRLƏRİN
          </div>
          <div
            style={{
              fontFamily: F.serif,
              fontWeight: 700,
              fontSize: 150,
              letterSpacing: spacing,
              whiteSpace: 'nowrap',
              backgroundImage: `linear-gradient(100deg, ${C.ivory} ${sweep - 12}%, #fff8e0 ${sweep}%, ${C.ivory} ${sweep + 12}%)`,
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              filter: `blur(${(1 - title) * 14}px) drop-shadow(0 0 40px rgba(214,168,78,0.35))`,
              opacity: title,
            }}
          >
            GİZLİ TARİXİ
          </div>
          <div style={{margin: '24px auto', height: 2, width: 820 * line, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
          <div style={{opacity: ep, fontFamily: F.serif, fontSize: 52, color: C.goldSoft, fontStyle: 'italic'}}>Birinci bölüm · Adəm</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fff3d6', opacity: flash, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

export const Pulse: React.FC<{t: number; a: number; b: number; color?: string}> = ({t, a, b, color = '#a3140a'}) => {
  const o = env(t, a, b, 0.3, 0.8) * (0.55 + 0.45 * Math.sin((t - a) * 6.3));
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: `radial-gradient(ellipse 45% 40% at 50% 55%, ${color}aa, transparent 70%)`, opacity: o, mixBlendMode: 'screen'}} />;
};

export const SourceTag: React.FC<{t: number; a: number; b: number; label: string; weak?: boolean}> = ({t, a, b, label, weak}) => {
  const o = env(t, a, b, 0.4, 0.4);
  if (o <= 0) return null;
  const acc = weak ? C.ember : C.gold;
  return (
    <div style={{position: 'absolute', left: 80, bottom: BAR + 36, display: 'flex', gap: 14, alignItems: 'center', opacity: o, transform: `translateX(${(1 - o) * -20}px)`}}>
      <div style={{width: 4, height: 46, background: acc}} />
      <div style={{fontFamily: F.sans, color: C.ivory, fontSize: 24, letterSpacing: 2}}>
        <div style={{fontSize: 14, letterSpacing: 5, color: acc}}>{weak ? 'RƏVAYƏT · ZƏİF' : 'MƏNBƏ'}</div>
        {label}
      </div>
    </div>
  );
};
