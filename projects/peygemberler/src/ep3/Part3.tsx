import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, F, FPS} from '../theme';
import {AyahCard, env, Grain, Leak, Letterbox, Particles, SourceTag, Vignette} from '../ep1/layers';

// EP3 · Bölüm 3: Gəminin tikintisi və 3 mərtəbənin sirri. Səs YOX (istifadəçi özü qoyur), musiqi YOX.
// Vaxtlar mətndən hesablanıb (~5 heca/san) + yazıların oxuma vaxtı (2.5 s + 0.4 s/söz, tam açılandan sonra).
// Skill kartları: typography/blur-slide, typography/lead-word-zoom-assemble, transition/shot-transitions (whip/flash), effects/light-play.
export const P3_DUR = 92.0;
const M = 'media/ep3c/';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.sin);
const OUT = Easing.bezier(0.16, 1, 0.3, 1); // blur-slide quint-out

type Shot = {src: string; a: number; b: number; from?: number; rate?: number; vol?: number; z0?: number; z1?: number; ox?: number; oy?: number; dark?: number; flash?: boolean};
const isV = (s: string) => s.endsWith('.mp4');
export const SHOTS: Shot[] = [
  // 1 — İlahi əmr: səhrada tikinti (0–19.5)
  {src: 'c1_ark_build.mp4', a: 0, b: 4.6, vol: 0, z0: 1.12, z1: 1.04},
  {src: 'c2_hammer.mp4', a: 4.6, b: 8.2, from: 0.3, vol: 0.6, z0: 1.0, z1: 1.06},
  {src: 'c4_people_mock.mp4', a: 8.2, b: 11.0, from: 0.0, vol: 0, z0: 1.04, z1: 1.0},
  {src: 'c3_crowd_mock.mp4', a: 11.0, b: 19.5, vol: 0, z0: 1.0, z1: 1.08},
  // 2 — nəhəng miqyas + 3 mərtəbə (19.5–39)
  {src: 'img_deck.jpg', a: 19.5, b: 29.0, z0: 1.0, z1: 1.1, ox: 55, oy: 55, flash: true},
  {src: 'ark_section.jpg', a: 29.0, b: 39.0, z0: 1.0, z1: 1.0},
  // 3 — 1-ci mərtəbə (39–59)
  {src: 'c5_animals_board.mp4', a: 39.0, b: 41.75, from: 0.0, rate: 0.8, vol: 0.5, z0: 1.0, z1: 1.04, flash: true},
  {src: 'c5_animals_board.mp4', a: 41.75, b: 43.75, from: 6.3, rate: 0.8, vol: 0.5, z0: 1.04, z1: 1.08},
  {src: 'img_animals.jpg', a: 43.75, b: 54.5, z0: 1.0, z1: 1.12, ox: 60, oy: 60, dark: 0.15},
  {src: 'lion.mp4', a: 54.5, b: 59.0, vol: 0.25, z0: 1.04, z1: 1.1},
  // 4 — 2-ci və 3-cü mərtəbə (59–77)
  {src: 'img_store.jpg', a: 59.0, b: 67.5, z0: 1.0, z1: 1.1, ox: 50, oy: 45, flash: true},
  {src: 'img_deck.jpg', a: 67.5, b: 77.0, z0: 1.55, z1: 1.75, ox: 45, oy: 40},
  // 5 — tamamlanma (77–92)
  {src: 'ark_far.mp4', a: 77.0, b: 83.0, vol: 0.25, z0: 1.0, z1: 1.06, flash: true},
  {src: 'ark_valley.jpg', a: 83.0, b: 87.6, z0: 1.0, z1: 1.08},
];
const SCENE = [19.5, 39.0, 59.0, 77.0];

const ShotView: React.FC<{s: Shot; t: number}> = ({s, t}) => {
  const z = interpolate(t, [s.a, s.b], [s.z0 ?? 1, s.z1 ?? 1.05], {...clamp, easing: ease});
  const st: React.CSSProperties = {position: 'absolute', width: 1920, height: 1080, objectFit: 'cover', filter: `contrast(1.1) saturate(0.95) brightness(${1 - (s.dark ?? 0)})`};
  const rate = s.rate ?? (isV(s.src) ? Math.min(1, (7.9 - (s.from ?? 0)) / (s.b - s.a + 0.1)) : 1);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${s.ox ?? 50}% ${s.oy ?? 50}%`}}>
        {isV(s.src) ? (
          <Sequence from={Math.round(s.a * FPS)} layout="none">
            <OffthreadVideo src={staticFile(M + s.src)} startFrom={Math.round((s.from ?? 0) * FPS)} playbackRate={rate} volume={s.vol ?? 0} style={st} />
          </Sequence>
        ) : (
          <Img src={staticFile(M + s.src)} style={st} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- typography/blur-slide: söz-söz bulanıqdan çıxma ----------
const Words: React.FC<{t: number; a: number; b: number; text: string; size: number; color?: string; serif?: boolean; ls?: number; weight?: number; stagger?: number; align?: string}> = ({t, a, b, text, size, color = C.ivory, serif = true, ls = 2, weight = 700, stagger = 0.13, align = 'center'}) => {
  const out = interpolate(t, [b - 0.45, b], [1, 0], clamp);
  if (t < a || t > b) return null;
  return (
    <div style={{display: 'flex', gap: '0.32em', fontSize: size, justifyContent: align, flexWrap: 'wrap', opacity: out}}>
      {text.split(' ').map((w, i) => {
        const p = interpolate(t, [a + i * stagger, a + i * stagger + 0.75], [0, 1], {...clamp, easing: OUT});
        return <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * size * 0.38}px)`, filter: `blur(${(1 - p) * 16}px)`, fontFamily: serif ? F.serif : F.sans, fontWeight: weight, fontSize: size, letterSpacing: ls, color, textShadow: '0 6px 30px rgba(0,0,0,0.85)'}}>{w}</span>;
      })}
    </div>
  );
};
const Center: React.FC<{y?: number; children: React.ReactNode; shade?: number}> = ({y = 50, children, shade = 0.6}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 30% at 50% ${y}%, rgba(0,0,0,${shade}), rgba(0,0,0,0) 80%)`}} />
    <div style={{position: 'absolute', left: 80, right: 80, top: `${y}%`, transform: 'translateY(-50%)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>{children}</div>
  </AbsoluteFill>
);

// ---------- typography/lead-word-zoom-assemble: hook ----------
const Hook: React.FC<{t: number}> = ({t}) => {
  if (t > 4.7) return null;
  const k1 = interpolate(t, [0.15, 0.9], [0, 1], {...clamp, easing: OUT});
  const z = interpolate(t, [0.15, 1.3], [1.35, 1.0], {...clamp, easing: OUT});
  const g = t < 1.5 ? 0 : spring({frame: Math.round((t - 1.5) * FPS), fps: FPS, config: {damping: 11, stiffness: 190}});
  const out = interpolate(t, [4.2, 4.65], [1, 0], clamp);
  return (
    <Center y={46} shade={0.7}>
      <div style={{opacity: out}}>
        <div style={{opacity: k1, transform: `scale(${z})`, filter: `blur(${(1 - k1) * 14}px)`, fontFamily: F.sans, fontWeight: 600, fontSize: 54, letterSpacing: 10, color: C.ivory, textShadow: '0 6px 26px #000'}}>SUYU OLMAYAN SƏHRADA…</div>
        <div style={{transform: `scale(${0.6 + 0.4 * g})`, opacity: Math.min(1, g * 1.4), fontFamily: F.serif, fontWeight: 700, fontSize: 210, lineHeight: 1.05, letterSpacing: 14, color: '#ffd76a', textShadow: '0 0 60px rgba(255,200,90,0.7), 0 10px 40px #000'}}>GƏMİ?</div>
      </div>
    </Center>
  );
};

// ---------- ölçü kartı ----------
const SizeCard: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const vals = [{v: 300, u: 'UZUNLUQ'}, {v: 50, u: 'EN'}, {v: 30, u: 'HÜNDÜRLÜK'}];
  const bar = interpolate(t, [a + 1.4, a + 2.6], [0, 1], {...clamp, easing: OUT});
  return (
    <div style={{position: 'absolute', left: 110, top: 250, opacity: o, padding: '26px 38px 28px', width: 760, background: 'rgba(10,8,5,0.6)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1.5px solid rgba(243,213,138,0.7)', borderRadius: 6, boxShadow: '0 0 30px rgba(214,168,78,0.25)'}}>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 22, letterSpacing: 8, color: C.gold}}>GƏMİNİN ÖLÇÜSÜ · ARŞIN</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 22, marginTop: 10}}>
        {vals.map((x, i) => {
          const k = interpolate(t, [a + 0.3 + i * 0.3, a + 1.3 + i * 0.3], [0, 1], {...clamp, easing: OUT});
          return (
            <div key={i} style={{textAlign: 'center', opacity: k}}>
              <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 96, lineHeight: 1, color: '#fff3cc', textShadow: '0 0 24px rgba(243,213,138,0.5)'}}>{Math.round(x.v * k)}{i < 2 ? <span style={{color: C.gold, fontSize: 60, marginLeft: 18}}>×</span> : null}</div>
              <div style={{fontFamily: F.sans, fontSize: 18, letterSpacing: 4, color: C.goldSoft}}>{x.u}</div>
            </div>
          );
        })}
      </div>
      {/* miqyas: insan siluetiylə müqayisə */}
      <svg width={680} height={70} style={{marginTop: 18}}>
        <line x1={20} y1={50} x2={20 + 600 * bar} y2={50} stroke={C.gold} strokeWidth={4} />
        <line x1={20} y1={38} x2={20} y2={62} stroke={C.gold} strokeWidth={3} />
        <line x1={20 + 600 * bar} y1={38} x2={20 + 600 * bar} y2={62} stroke={C.gold} strokeWidth={3} opacity={bar} />
        <g transform="translate(640 50)" opacity={bar}><circle cy={-26} r={5} fill={C.ivory} /><path d="M-6 0 L-6 -18 L6 -18 L6 0Z" fill={C.ivory} /></g>
        <text x={330} y={28} textAnchor="middle" fill={C.ivory} fontFamily="Inter" fontWeight={600} fontSize={22} opacity={bar}>≈ 150 METR — FUTBOL MEYDANINDAN 1.5 DƏFƏ UZUN</text>
      </svg>
    </div>
  );
};

// ---------- 3 mərtəbə pinləri (kəsik şəkil üzərində) ----------
const FLO = [
  {y: 871, n: '1-Cİ MƏRTƏBƏ', v: 'HEYVANLAR', at: 30.6},
  {y: 545, n: '2-Cİ MƏRTƏBƏ', v: 'İNSANLAR VƏ AZUQƏ', at: 31.8},
  {y: 236, n: '3-CÜ MƏRTƏBƏ', v: 'QUŞLAR', at: 33.0},
];
const Pins: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const o = env(t, a, b, 0.3, 0.45);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: o}}>
      <AbsoluteFill style={{background: 'rgba(0,0,0,0.18)'}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {FLO.map((f, i) => {
          const k = interpolate(t, [f.at, f.at + 0.5], [0, 1], {...clamp, easing: OUT});
          if (k <= 0) return null;
          const pulse = ((t - f.at) % 1.4) / 1.4;
          return (
            <g key={i}>
              <line x1={120} y1={f.y} x2={120 + 1030 * k} y2={f.y} stroke="#f3d58a" strokeWidth={2} opacity={0.75} style={{filter: 'drop-shadow(0 0 6px #d6a84e)'}} />
              <circle cx={1150} cy={f.y} r={20 + 24 * pulse} fill="none" stroke="#f3d58a" strokeWidth={2} opacity={(1 - pulse) * 0.8 * k} />
              <circle cx={1150} cy={f.y} r={9 * k} fill="#ffe7a6" style={{filter: 'drop-shadow(0 0 8px #d6a84e)'}} />
              <line x1={1160} y1={f.y} x2={1160 + 140 * k} y2={f.y} stroke="#f3d58a" strokeWidth={2} />
            </g>
          );
        })}
      </svg>
      {FLO.map((f, i) => {
        const k = interpolate(t, [f.at + 0.25, f.at + 0.85], [0, 1], {...clamp, easing: OUT});
        if (k <= 0) return null;
        return (
          <div key={i} style={{position: 'absolute', left: 1310, top: f.y - 50, opacity: k, transform: `translateX(${(1 - k) * 30}px)`, padding: '12px 24px 14px', background: 'rgba(10,8,5,0.6)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1.5px solid rgba(243,213,138,0.75)', borderRadius: 6}}>
            <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 20, letterSpacing: 6, color: C.gold}}>{f.n}</div>
            <div style={{fontFamily: F.sans, fontWeight: 700, fontSize: 36, color: '#fff7e2'}}>{f.v}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- mərtəbə başlığı (sol üst kicker + böyük söz) ----------
const FloorTitle: React.FC<{t: number; a: number; b: number; n: string; v: string}> = ({t, a, b, n, v}) => {
  const o = env(t, a, b, 0.2, 0.45);
  if (o <= 0) return null;
  const line = interpolate(t, [a, a + 0.6], [0, 1], {...clamp, easing: OUT});
  return (
    <div style={{position: 'absolute', left: 110, bottom: 190, opacity: o}}>
      <div style={{position: 'absolute', left: -40, top: -30, right: -300, bottom: -30, background: 'linear-gradient(90deg, rgba(0,0,0,0.65), rgba(0,0,0,0))', zIndex: -1}} />
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 26, letterSpacing: 10, color: C.gold}}>{n}</div>
      <div style={{height: 2, width: 420 * line, background: `linear-gradient(90deg, ${C.gold}, rgba(214,168,78,0))`, margin: '10px 0 12px'}} />
      <div><Words t={t} a={a + 0.25} b={b} text={v} size={70} align="flex-start" /></div>
    </div>
  );
};

// ---------- növbəti bölüm kartı ----------
const NextCard: React.FC<{t: number; a: number}> = ({t, a}) => {
  if (t < a) return null;
  const k = interpolate(t, [a + 0.2, a + 1.0], [0, 1], {...clamp, easing: OUT});
  const sp = interpolate(t, [a, P3_DUR], [24, 12], clamp);
  return (
    <AbsoluteFill style={{background: '#000', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{textAlign: 'center', opacity: k}}>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 26, letterSpacing: 12, color: C.gold}}>DAVAMI</div>
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 120, letterSpacing: sp, color: '#f3d58a', textShadow: '0 0 40px rgba(214,168,78,0.5)'}}>BÖLÜM 4</div>
      </div>
    </AbsoluteFill>
  );
};

export const Part3: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const flashes = [...SCENE, 87.6];
  const wf = Math.max(0, ...flashes.map((c) => interpolate(t, [c - 0.06, c, c + 0.28], [0, 0.85, 0], clamp)));
  const fadeIn = interpolate(t, [0, 0.12], [1, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SHOTS.map((s, i) => (t >= s.a && t < s.b ? <ShotView key={i} s={s} t={t} /> : null))}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,170,80,0.07), rgba(20,10,40,0.10))', mixBlendMode: 'soft-light'}} />
      <Particles t={t} kind="dust" n={50} />
      {[4.6, 8.2, 11.0, 29.0, 43.75, 54.5, 67.5, 83.0].map((c) => <Leak key={c} t={t} a={c - 0.3} />)}

      {/* 1 */}
      <Hook t={t} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 160}}><Words t={t} a={5.0} b={10.4} text="BÖLÜM 3 · GƏMİNİN TİKİNTİSİ VƏ 3 MƏRTƏBƏNİN SİRRİ" size={30} serif={false} weight={600} ls={7} color={C.goldSoft} stagger={0.07} /></div>
      <AyahCard t={t} a={10.6} b={19.3} ar="وَيَصْنَعُ الْفُلْكَ وَكُلَّمَا مَرَّ عَلَيْهِ مَلَأٌ مِّن قَوْمِهِ سَخِرُوا مِنْهُ" az="O, gəmini düzəldirdi. Qövmünün başçıları hər dəfə yanından keçəndə onu məsxərəyə qoyurdular." ref_="HUD · 11:38" />
      {/* 2 */}
      <SizeCard t={t} a={20.4} b={28.6} />
      <SourceTag t={t} a={21.0} b={28.6} label="Rəvayət · İbn Kəsir, Təbəri (Tövrat mənbəli)" weak icon="quill" />
      <Pins t={t} a={29.3} b={38.7} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 150}}><Words t={t} a={29.4} b={38.7} text="HƏR MƏRTƏBƏNİN ÖZ VƏZİFƏSİ" size={34} serif={false} weight={600} ls={8} color={C.goldSoft} stagger={0.1} /></div>
      {/* 3 */}
      <Center y={50} shade={0.55}><Words t={t} a={39.25} b={43.7} text="1-Cİ MƏRTƏBƏ" size={130} color="#f3d58a" /></Center>
      <AyahCard t={t} a={44.0} b={54.3} ar="قُلْنَا احْمِلْ فِيهَا مِن كُلٍّ زَوْجَيْنِ اثْنَيْنِ" az="Dedik: «Hər növdən bir cüt (erkək və dişi) gəmiyə mindir»." ref_="HUD · 11:40" />
      <Center y={78} shade={0.55}><Words t={t} a={54.7} b={58.9} text="MİNLƏRLƏ CANLI · BİR GƏMİDƏ" size={64} /></Center>
      {/* 4 */}
      <FloorTitle t={t} a={59.4} b={67.2} n="2-Cİ MƏRTƏBƏ" v="TARAZLIQ VƏ EHTİYAT" />
      <FloorTitle t={t} a={67.9} b={76.7} n="3-CÜ MƏRTƏBƏ" v="İŞIQ VƏ SƏMA" />
      {/* 5 */}
      <Center y={50} shade={0.6}><Words t={t} a={83.3} b={87.5} text="BÖYÜK SINAĞIN ASTANASINDA…" size={86} color="#f3d58a" stagger={0.18} /></Center>
      <NextCard t={t} a={87.6} />

      <AbsoluteFill style={{background: '#fff3d6', opacity: wf, mixBlendMode: 'screen'}} />
      <Vignette />
      <Grain t={t} />
      <Letterbox />
      <AbsoluteFill style={{background: '#000', opacity: Math.max(fadeIn, interpolate(t, [P3_DUR - 0.8, P3_DUR - 0.05], [0, 1], clamp))}} />
    </AbsoluteFill>
  );
};
