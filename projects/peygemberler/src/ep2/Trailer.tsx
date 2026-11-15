import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {Background, BgSpec, BigText, env, Grain, Leak, Letterbox, Particles, Pulse, SeriesTitle, SourceTag, useT, Vignette} from '../ep1/layers';
import {C, F} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const TRAILER_DUR = 52;
const M = 'media/ep2/';
const V = (src: string, o: Partial<BgSpec> = {}): BgSpec => ({type: 'video', src: M + src + '.mp4', clipLen: 4.03, dark: 0.15, ...o});

type Shot = {id: string; a: number; b: number; bg: BgSpec & {blur?: number}; tr: number; crash?: boolean};
// Vaxtlar səsdən ölçülüb (səs 0.8 s-də başlayır).
const SHOTS: Shot[] = [
  {id: 'globe', a: 0, b: 3.6, bg: V('GLOBE', {clipLen: 3.8, dark: 0, kb: [1, 0, 0, 1.04, 0, 0]}), tr: 0},
  {id: 'zigg', a: 3.6, b: 6.6, bg: V('ZIGG', {kb: [1.0, 0, 0, 1.14, 0, -2]}), tr: 0.4},
  {id: 'fire', a: 6.6, b: 9.3, bg: V('FIRE', {kb: [1.05, 0, 0, 1.12, 2, 0]}), tr: 0},
  {id: 'needle', a: 9.3, b: 11.35, bg: V('NEEDLE', {kb: [1.0, 0, 0, 1.08, 0, 0]}), tr: 0, crash: true},
  {id: 'clay', a: 11.35, b: 14.4, bg: V('CLAY', {kb: [1.02, 0, 0, 1.12, 0, 0]}), tr: 0.3},
  {id: 'rod', a: 14.4, b: 16.9, bg: V('ROD', {kb: [1.0, 0, 0, 1.1, 0, 2]}), tr: 0.3},
  {id: 'clouds', a: 16.9, b: 24.6, bg: V('CLOUDS', {rate: 0.55, kb: [1.0, 0, 0, 1.15, 0, 0], dark: 0.3}), tr: 0.5},
  {id: 'pillar', a: 24.6, b: 31.3, bg: V('PILLAR', {rate: 0.62, kb: [1.0, 0, 0, 1.12, 0, 0], dark: 0.2}), tr: 0.6},
  {id: 'zigg2', a: 31.3, b: 32.1, bg: V('ZIGG', {startFrom: 1.5, kb: [1.12, 0, 0, 1.18, 0, 0]}), tr: 0},
  {id: 'clouds2', a: 32.1, b: 35.9, bg: V('CLOUDS', {kb: [1.05, 0, 0, 1.2, 0, 0], dark: 0.35}), tr: 0},
  {id: 'rod2', a: 35.9, b: 37.4, bg: V('ROD', {startFrom: 1.5, kb: [1.1, 0, 0, 1.18, 0, 0]}), tr: 0},
  {id: 'clay2', a: 37.4, b: 38.2, bg: V('CLAY', {startFrom: 2.0, kb: [1.15, 0, 0, 1.22, 0, 0]}), tr: 0},
  {id: 'needle2', a: 38.2, b: 39.7, bg: V('NEEDLE', {startFrom: 1.5, kb: [1.1, 0, 0, 1.18, 0, 0]}), tr: 0},
  {id: 'pillar2', a: 39.7, b: 41.75, bg: V('PILLAR', {startFrom: 1.0, kb: [1.05, 0, 0, 1.15, 0, 0], dark: 0.3}), tr: 0.3},
  {id: 'fire2', a: 41.75, b: 44.4, bg: V('FIRE', {startFrom: 1.0, kb: [1.1, 0, 0, 1.2, 0, 0], dark: 0.35, grade: 'sepia(0.5) saturate(2.2) hue-rotate(-20deg)'}), tr: 0},
  {id: 'zigg3', a: 44.4, b: 47.6, bg: V('ZIGG', {rate: 0.8, kb: [1.0, 0, 0, 1.2, 0, -3]}), tr: 0.3},
  {id: 'titlebg', a: 47.0, b: TRAILER_DUR, bg: {...V('CLOUDS', {rate: 0.5, dark: 0.55}), blur: 3}, tr: 0.6},
];

/** Ulduz bürcü: nöqtələr və xətlər bir-bir çəkilir. */
const Constellation: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.3, 0.4);
  if (o <= 0) return null;
  const pts = [
    [1180, 210], [1290, 160], [1420, 230], [1530, 180], [1610, 300], [1480, 360], [1350, 330], [1700, 140],
  ];
  const lines = [[0, 1], [1, 2], [2, 3], [3, 7], [3, 4], [4, 5], [5, 6], [6, 2]];
  const p = interpolate(t, [a + 0.1, a + Math.min(1.8, (b - a) * 0.8)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: o, filter: 'drop-shadow(0 0 8px rgba(255,215,140,0.9))'}}>
      {lines.map(([i, j], k) => {
        const q = Math.max(0, Math.min(1, p * lines.length - k));
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[j];
        return q > 0 ? <line key={k} x1={x1} y1={y1} x2={x1 + (x2 - x1) * q} y2={y1 + (y2 - y1) * q} stroke={C.goldSoft} strokeWidth={2.2} /> : null;
      })}
      {pts.map(([x, y], k) => {
        const q = interpolate(p * pts.length - k, [0, 0.5], [0, 1], clamp);
        return <circle key={k} cx={x} cy={y} r={5 + 2 * Math.sin(t * 5 + k)} fill="#fff6dc" opacity={q} />;
      })}
    </svg>
  );
};

/** Yeddi səma qatı: halqalar yuxarı qalxır, sayğac 1→4. */
const Heavens: React.FC<{t: number; a: number; b: number; steps: number[]}> = ({t, a, b, steps}) => {
  const o = env(t, a, b, 0.6, 0.5);
  if (o <= 0) return null;
  const n = steps.filter((s) => t >= s).length;
  const rise = interpolate(t, [a, b], [0, 1], clamp);
  const last = steps[steps.length - 1];
  const fl = interpolate(t, [last, last + 0.08, last + 0.7], [0, 0.7, 0], clamp);
  const pop = (s: number) => interpolate(t, [s, s + 0.25], [1.5, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  const cur = steps[Math.max(0, n - 1)] ?? a;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {new Array(7).fill(0).map((_, i) => {
          const y = 980 - i * 135 + rise * 260 - (n > 0 ? 0 : 0);
          const lit = i < n;
          const isFour = i === 3 && n >= 4;
          return (
            <g key={i}>
              <ellipse cx={960} cy={y} rx={560 - i * 30} ry={52 - i * 3} fill="none" stroke={isFour ? '#fff3cf' : lit ? C.gold : 'rgba(240,217,160,0.28)'} strokeWidth={isFour ? 5 : lit ? 3 : 1.5} style={{filter: lit ? 'drop-shadow(0 0 10px rgba(214,168,78,0.9))' : undefined}} />
              <text x={960 + (560 - i * 30) + 24} y={y + 10} fill={lit ? C.goldSoft : 'rgba(240,217,160,0.35)'} fontFamily="Inter" fontSize={26} letterSpacing={3}>
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      {n > 0 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <div style={{textAlign: 'center', transform: `scale(${pop(cur)})`}}>
            <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 230, lineHeight: 1, color: n >= 4 ? '#fff3cf' : C.gold, textShadow: '0 0 50px rgba(214,168,78,0.8), 0 8px 40px #000'}}>{n}</div>
            <div style={{fontFamily: F.sans, fontSize: 34, letterSpacing: 10, color: C.goldSoft, marginTop: 6}}>{n >= 4 ? '4-CÜ QAT SƏMA' : 'QAT'}</div>
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: '#fff6e0', opacity: fl, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

/** "OĞLUM" pozulur → "QARDAŞIM" qızılı yanır. */
const WordSwap: React.FC<{t: number; a: number; b: number; strikeAt: number; replAt: number}> = ({t, a, b, strikeAt, replAt}) => {
  const o = env(t, a, b, 0.15, 0.5);
  if (o <= 0) return null;
  const w1 = interpolate(t, [a, a + 0.3], [1.4, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const st = interpolate(t, [strikeAt, strikeAt + 0.3], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const fade1 = interpolate(t, [replAt - 0.1, replAt + 0.3], [1, 0.35], clamp);
  const r = interpolate(t, [replAt, replAt + 0.35], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  const glow = 30 + 30 * Math.abs(Math.sin((t - replAt) * 3));
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'relative', textAlign: 'center', transform: `translateY(${-90 * r}px) scale(${w1 * (1 - 0.25 * r)})`, opacity: fade1}}>
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 150, color: C.ivory, letterSpacing: 8, textShadow: '0 8px 40px #000'}}>“OĞLUM”</div>
        <div style={{position: 'absolute', left: -20, top: '52%', height: 10, width: `${st * 108}%`, background: '#d23a2a', boxShadow: '0 0 20px #d23a2a'}} />
      </div>
      {r > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '55%',
            fontFamily: F.serif,
            fontWeight: 700,
            fontSize: 170,
            letterSpacing: 8,
            color: '#ffe6a6',
            opacity: r,
            transform: `scale(${0.7 + 0.3 * r})`,
            textShadow: `0 0 ${glow}px rgba(214,168,78,0.95), 0 8px 40px #000`,
          }}
        >
          “QARDAŞIM”
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Kiçik başlıq (letterspace ilə açılır). */
const Kicker: React.FC<{t: number; a: number; b: number; text: string; y?: number; color?: string; size?: number}> = ({t, a, b, text, y = 50, color = C.goldSoft, size = 40}) => {
  const o = env(t, a, b, 0.35, 0.35);
  if (o <= 0) return null;
  const sp = interpolate(t, [a, a + 1.2], [30, 12], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: 'absolute', top: `${y}%`, left: 0, right: 0, textAlign: 'center', opacity: o, fontFamily: F.sans, fontWeight: 600, fontSize: size, letterSpacing: sp, color, textShadow: '0 4px 24px #000', filter: `blur(${(1 - o) * 6}px)`}}>
      {text}
    </div>
  );
};

export const Trailer: React.FC = () => {
  const t = useT(0);
  const shots = SHOTS.filter((s) => t >= s.a - 0.6 && t <= s.b + 0.6);
  const freeze = interpolate(t, [28.7, 28.85, 31.0, 31.3], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{filter: freeze > 0 ? `grayscale(${0.75 * freeze}) brightness(${1 - 0.35 * freeze})` : undefined}}>
        {shots.map((s) => {
          const fin = s.tr > 0 ? interpolate(t, [s.a - s.tr / 2, s.a + s.tr / 2], [0, 1], clamp) : t >= s.a ? 1 : 0;
          const next = SHOTS.find((n) => Math.abs(n.a - s.b) < 0.05 && n.id !== s.id);
          const hard = !next || next.tr === 0;
          const fout = t < (hard ? s.b : s.b + next!.tr / 2) ? 1 : 0;
          const o = fin * fout;
          if (o <= 0) return null;
          const cz = s.crash ? interpolate(t, [s.a, s.a + 0.28], [1.45, 1], {...clamp, easing: Easing.out(Easing.exp)}) : 1;
          return (
            <AbsoluteFill key={s.id} style={{opacity: o, transform: `scale(${cz})`}}>
              <Background bg={s.bg} t={t} a={s.a} b={s.b + 0.6} from={0} />
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>

      <Particles t={t} kind="dust" n={60} />
      {t > 11.3 && t < 14.5 && <Particles t={t} kind="lights" n={40} alpha={env(t, 11.4, 14.4, 0.5, 0.4)} />}
      {[3.6, 16.9, 31.3, 41.75, 47.0].map((a) => (
        <Leak key={a} t={t} a={a - 0.3} />
      ))}

      {/* 1: sirli peyğəmbər */}
      <BigText t={t} a={4.1} b={6.5} text="ƏN SİRLİ PEYĞƏMBƏR?" size={86} />
      {/* 2: ilk paltar */}
      <BigText t={t} a={9.42} b={11.3} text="İLK PALTAR?" size={120} color={C.goldSoft} />
      {/* 3: ilk yazı, ulduzlar */}
      <BigText t={t} a={12.92} b={14.4} text="İLK YAZI?" size={120} color={C.goldSoft} />
      <Constellation t={t} a={14.45} b={16.9} />
      <Kicker t={t} a={14.6} b={16.85} text="ULDUZLARIN HESABI?" y={72} size={46} />
      {/* 4: ən böyük sirr + 7 qat */}
      <BigText t={t} a={17.05} b={18.95} text="ƏN BÖYÜK SİRR…" size={110} color={C.gold} />
      <Heavens t={t} a={19.0} b={24.5} steps={[20.0, 20.75, 21.5, 22.3]} />
      {/* 5: Merac — oğlum / qardaşım */}
      <Kicker t={t} a={24.8} b={28.6} text="MERAC GECƏSİ" y={22} size={44} />
      <SourceTag t={t} a={25.0} b={28.6} label="Səhih Buxari, 3207 · Səhih Müslim, 162" icon="hadith" />
      <WordSwap t={t} a={28.84} b={31.25} strikeAt={29.45} replAt={29.92} />
      {/* 6: montaj */}
      <Kicker t={t} a={32.12} b={33.95} text="PEYĞƏMBƏRLƏRİN GİZLİ TARİXİ" y={46} size={46} color={C.ivory} />
      <BigText t={t} a={34.0} b={35.85} text="2-Cİ BÖLÜM" size={130} color={C.gold} />
      <Constellation t={t} a={35.95} b={37.4} />
      <Pulse t={t} a={41.9} b={44.35} />
      <BigText t={t} a={41.9} b={44.35} text="TARİXİN ƏN BÖYÜK FACİƏSİ" size={84} color="#ff8a6a" />
      <BigText t={t} a={44.56} b={47.1} text="HƏZRƏTİ İDRİS (Ə.S)" size={118} color={C.gold} />
      {/* başlıq */}
      <SeriesTitle t={t} a={47.0} b={51.9} ep="İkinci bölüm · Həzrəti İdris" />

      <Vignette />
      <Grain t={t} />
      <Letterbox />
      <AbsoluteFill style={{background: '#000', opacity: Math.max(interpolate(t, [0, 0.6], [1, 0], clamp), interpolate(t, [51.2, 52], [0, 1], clamp))}} />
    </AbsoluteFill>
  );
};
