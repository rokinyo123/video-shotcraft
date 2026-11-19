import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring} from 'remotion';
import {FPS} from '../theme';

// "Sözlər Köşkü" üslubu: isti krem kağız üzərində vektor motion graphics səhifələri.
const PAPER = '#F5F0E6', INK = '#2B2620', ACC = '#D96B27', BROWN = '#8C6A43', RED = '#9E2A1C';
const MS = 'Montserrat, Inter, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const k01 = (t: number, a: number, d = 0.5) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
const sp = (t: number, a: number, damping = 13) => (t < a ? 0 : spring({frame: Math.round((t - a) * FPS), fps: FPS, config: {damping, stiffness: 170}}));

// kağız fonu + giriş/çıxış (diaqonal vərəq keçidi)
const Page: React.FC<{t: number; a: number; b: number; children: React.ReactNode; inWipe?: boolean; outFade?: boolean}> = ({t, a, b, children, inWipe = true, outFade = true}) => {
  if (t < a - 0.01 || t > b + 0.5) return null;
  const w = inWipe ? interpolate(t, [a, a + 0.6], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 1;
  const out = outFade ? interpolate(t, [b - 0.05, b + 0.45], [1, 0], clamp) : 1;
  const x = -40 + w * 180; // diaqonal xətt (%)
  const clip = `polygon(0% 0%, ${x + 20}% 0%, ${x}% 100%, 0% 100%)`;
  return (
    <AbsoluteFill style={{clipPath: w < 1 ? clip : undefined, opacity: out}}>
      <AbsoluteFill style={{background: PAPER}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 0.55, mixBlendMode: 'multiply'}}>
        <filter id="paperN"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={4} /><feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0.22 0" /></filter>
        <rect width="1920" height="1080" filter="url(#paperN)" />
        <filter id="paperF"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={9} /><feColorMatrix values="0 0 0 0 0.6  0 0 0 0 0.48  0 0 0 0 0.3  0 0 0 0.12 0" /></filter>
        <rect width="1920" height="1080" filter="url(#paperF)" />
      </svg>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 62%, rgba(110,80,40,0.22) 100%)'}} />
      {children}
      {/* keçid kənarında kölgə */}
      {w < 1 ? <AbsoluteFill style={{background: `linear-gradient(100deg, rgba(0,0,0,0) ${x - 6}%, rgba(60,40,20,0.35) ${x + 8}%, rgba(0,0,0,0) ${x + 14}%)`}} /> : null}
    </AbsoluteFill>
  );
};

const Header: React.FC<{t: number; a: number; k: string; text: string}> = ({t, a, k, text}) => {
  const o = k01(t, a, 0.5);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * -12}px)`}}>
      <span style={{fontFamily: MS, fontWeight: 800, fontSize: 24, letterSpacing: 8, color: ACC}}>{k}</span>
      <span style={{fontFamily: MS, fontWeight: 700, fontSize: 24, letterSpacing: 8, color: BROWN, marginLeft: 18}}>· {text}</span>
    </div>
  );
};

// ---------- ikonlar (sadə vektor) ----------
const ink = {stroke: INK, strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
const Lion = () => (
  <g>
    <path d="M0 -34 L9 -26 L20 -30 L22 -18 L34 -14 L28 -2 L36 8 L24 14 L24 27 L10 24 L0 34 L-10 24 L-24 27 L-24 14 L-36 8 L-28 -2 L-34 -14 L-22 -18 L-20 -30 L-9 -26Z" fill={ACC} opacity={0.85} {...ink} />
    <circle r={17} fill={PAPER} {...ink} /><circle cx={-6} cy={-3} r={2} fill={INK} /><circle cx={6} cy={-3} r={2} fill={INK} /><path d="M-5 7 Q0 11 5 7" fill="none" {...ink} />
  </g>
);
const Gazelle = () => (
  <g>
    <path d="M-30 6 Q-28 -8 -6 -8 L16 -8 Q22 -10 24 -20 L30 -22 L30 -14 Q26 0 18 6 Z" fill="#E9DFCC" {...ink} />
    <path d="M26 -21 Q22 -40 30 -50 M29 -22 Q30 -42 40 -50" fill="none" {...ink} />
    <path d="M-24 6 L-26 30 M-12 6 L-12 30 M8 6 L8 30 M16 6 L18 30" fill="none" {...ink} />
  </g>
);
const Human = ({c = '#E9DFCC'}: {c?: string}) => (
  <g><circle cy={-24} r={11} fill={c} {...ink} /><path d="M-18 30 C-18 4 -10 -8 0 -8 C10 -8 18 4 18 30Z" fill={c} {...ink} /></g>
);
const Wheat = () => (
  <g>
    <path d="M0 34 L0 -30" fill="none" {...ink} />
    {[-22, -10, 2, 14].map((y, i) => <g key={i}><ellipse cx={-8} cy={y} rx={6} ry={10} transform={`rotate(-30 -8 ${y})`} fill={ACC} {...ink} strokeWidth={2} /><ellipse cx={8} cy={y} rx={6} ry={10} transform={`rotate(30 8 ${y})`} fill={ACC} {...ink} strokeWidth={2} /></g>)}
  </g>
);
const Chest = () => (
  <g><rect x={-30} y={-10} width={60} height={36} rx={4} fill="#C99A5B" {...ink} /><path d="M-30 -10 Q0 -34 30 -10" fill="#B3824A" {...ink} /><rect x={-6} y={-4} width={12} height={12} fill={INK} /></g>
);
const Eagle = () => (
  <path d="M0 -6 C-12 -26 -40 -30 -56 -18 C-40 -16 -30 -8 -24 2 C-14 0 -6 2 0 10 C6 2 14 0 24 2 C30 -8 40 -16 56 -18 C40 -30 12 -26 0 -6Z M-4 -10 L0 -22 L4 -10Z" fill={BROWN} {...ink} />
);
const Dove = () => (
  <path d="M-26 6 C-12 -4 4 -4 14 2 L28 -6 L22 6 C16 16 -6 20 -26 6Z M-4 -2 C-8 -20 6 -30 20 -26 C10 -18 6 -10 2 -2Z" fill="#FFFFFF" {...ink} />
);
const Icon: React.FC<{t: number; at: number; x: number; y: number; s?: number; children: React.ReactNode}> = ({t, at, x, y, s = 1, children}) => {
  const k = sp(t, at, 11);
  if (k <= 0) return null;
  return <g transform={`translate(${x} ${y}) scale(${k * s * 1.5})`} opacity={Math.min(1, k * 1.5)}>{children}</g>;
};

// ---------- SƏHİFƏ 1: gəminin 3 mərtəbəsi ----------
export const PaperArk: React.FC<{t: number; a: number; b: number; f1: number; f2: number; f3: number}> = ({t, a, b, f1, f2, f3}) => {
  const draw = interpolate(t, [a + 0.4, a + 2.0], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const deck = interpolate(t, [a + 1.4, a + 2.3], [0, 1], clamp);
  const L = 3400;
  const floors = [
    {y0: 590, y1: 735, at: f1, n: '1-Cİ MƏRTƏBƏ', v: 'Vəhşi və Ev Heyvanları'},
    {y0: 455, y1: 590, at: f2, n: '2-Cİ MƏRTƏBƏ', v: 'İnsanlar və Azuqə'},
    {y0: 320, y1: 455, at: f3, n: '3-CÜ MƏRTƏBƏ', v: 'Quş Növləri'},
  ];
  return (
    <Page t={t} a={a} b={b}>
      <Header t={t} a={a + 0.4} k="SİRR #2" text="ÜÇ MƏRTƏBƏLİ GƏMİ" />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {/* mərtəbə vurğusu */}
        {floors.map((f, i) => {
          const k = k01(t, f.at, 0.4);
          return <rect key={i} x={405} y={f.y0 + 4} width={1010} height={f.y1 - f.y0 - 8} fill={ACC} opacity={0.13 * k} />;
        })}
        {/* gövdə */}
        <path d="M 380 320 L 1440 320 L 1400 735 Q 910 800 420 735 Z" fill="none" stroke={INK} strokeWidth={5} strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
        <path d="M 380 320 L 520 230 L 1300 230 L 1440 320" fill="none" stroke={INK} strokeWidth={4} strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)} />
        <path d="M 520 230 L 520 320 M 1300 230 L 1300 320" stroke={INK} strokeWidth={2} opacity={deck} />
        {/* göyərtələr */}
        <line x1={390} y1={455} x2={390 + 1040 * deck} y2={455} stroke={INK} strokeWidth={3} />
        <line x1={395} y1={590} x2={395 + 1030 * deck} y2={590} stroke={INK} strokeWidth={3} />
        {/* taxta xətləri */}
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={600 + i * 150} y1={320} x2={600 + i * 150} y2={735} stroke={BROWN} strokeWidth={1.5} opacity={0.35 * deck} strokeDasharray="6 8" />)}
        {/* ikonlar */}
        <Icon t={t} at={f1} x={600} y={660}><Lion /></Icon>
        <Icon t={t} at={f1 + 0.15} x={760} y={670}><Gazelle /></Icon>
        <Icon t={t} at={f1 + 0.3} x={1000} y={660} s={0.9}><Lion /></Icon>
        <Icon t={t} at={f1 + 0.45} x={1170} y={670} s={0.9}><Gazelle /></Icon>
        <Icon t={t} at={f2} x={600} y={525}><Human /></Icon>
        <Icon t={t} at={f2 + 0.12} x={660} y={530} s={0.85}><Human c="#D9C7A6" /></Icon>
        <Icon t={t} at={f2 + 0.3} x={880} y={522}><Wheat /></Icon>
        <Icon t={t} at={f2 + 0.45} x={1080} y={530}><Chest /></Icon>
        <Icon t={t} at={f2 + 0.6} x={1260} y={522} s={0.85}><Human /></Icon>
        <Icon t={t} at={f3} x={680} y={395}><Eagle /></Icon>
        <Icon t={t} at={f3 + 0.15} x={920} y={392}><Dove /></Icon>
        <Icon t={t} at={f3 + 0.3} x={1150} y={395} s={0.85}><Eagle /></Icon>
        {/* etiket xətləri */}
        {floors.map((f, i) => {
          const k = k01(t, f.at + 0.1, 0.4);
          const y = (f.y0 + f.y1) / 2;
          return <g key={i} opacity={k}><line x1={1430} y1={y} x2={1430 + 60 * k} y2={y} stroke={ACC} strokeWidth={3} /><circle cx={1430} cy={y} r={6} fill={ACC} /></g>;
        })}
      </svg>
      {floors.map((f, i) => {
        const k = sp(t, f.at + 0.2, 14);
        if (k <= 0) return null;
        return (
          <div key={i} style={{position: 'absolute', left: 1505, top: (f.y0 + f.y1) / 2 - 46, opacity: Math.min(1, k * 1.4), transform: `translateX(${(1 - k) * 30}px)`}}>
            <div style={{fontFamily: MS, fontWeight: 800, fontSize: 22, letterSpacing: 5, color: ACC}}>{f.n}</div>
            <div style={{fontFamily: MS, fontWeight: 700, fontSize: 34, color: INK, lineHeight: 1.12, maxWidth: 400}}>{f.v}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', fontFamily: MS, fontWeight: 700, fontSize: 20, letterSpacing: 3, color: BROWN, opacity: k01(t, f1, 0.6)}}>RƏVAYƏT · İBN ABBAS (TƏBƏRİ, İBN KƏSİR)</div>
    </Page>
  );
};

// ---------- SƏHİFƏ 2: 80 mömin ✗ — 3 oğul → 8 milyard ----------
const Tree: React.FC<{t: number; at: number}> = ({t, at}) => {
  const k = interpolate(t, [at, at + 0.9], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <svg width={520} height={230} viewBox="-260 -20 520 230" style={{display: 'block', margin: '0 auto'}}>
      <circle cx={0} cy={6} r={22 * Math.min(1, k * 2)} fill={ACC} stroke={INK} strokeWidth={3} />
      {[-170, 0, 170].map((x, i) => {
        const kk = interpolate(k, [0.25 + i * 0.12, 0.7 + i * 0.1], [0, 1], clamp);
        return (
          <g key={i}>
            <path d={`M0 28 C 0 80 ${x} 80 ${x} 140`} fill="none" stroke={INK} strokeWidth={4} strokeDasharray={200} strokeDashoffset={200 * (1 - kk)} />
            <circle cx={x} cy={158} r={18 * kk} fill="#F0E2C8" stroke={INK} strokeWidth={3} />
          </g>
        );
      })}
    </svg>
  );
};
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
export const PaperLineage: React.FC<{t: number; a: number; b: number; m80: number; cut: number; bn: number; sons: number}> = ({t, a, b, m80, cut, bn, sons}) => {
  const g = sp(t, m80 - 0.3);
  const n80 = sp(t, m80);
  const strike = interpolate(t, [cut, cut + 0.45], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const stamp = sp(t, cut + 0.4, 9);
  const cnt = interpolate(t, [bn, bn + 1.5], [0, 8e9], {...clamp, easing: Easing.out(Easing.cubic)});
  const cntK = sp(t, bn);
  const treeK = sp(t, sons);
  const arrow = interpolate(t, [sons + 0.6, sons + 1.1], [0, 1], clamp);
  return (
    <Page t={t} a={a} b={b}>
      <Header t={t} a={a + 0.4} k="SİRR #3–4" text="NƏSİL SİRRİ" />
      {/* sol: 80 mömin */}
      <div style={{position: 'absolute', left: 140, top: 250, width: 700, textAlign: 'center'}}>
        <svg width={560} height={170} viewBox="-210 -50 420 130" style={{opacity: Math.min(1, g * 1.4), transform: `scale(${0.85 + 0.15 * g})`, filter: strike > 0.5 ? 'grayscale(1)' : undefined}}>
          {[-150, -75, 0, 75, 150].map((x, i) => <g key={i} transform={`translate(${x} ${Math.abs(x) / 10})`}><Human c={i === 2 ? '#E2C9A0' : '#E9DFCC'} /></g>)}
        </svg>
        <div style={{position: 'relative', display: 'inline-block', marginTop: 10, transform: `scale(${0.7 + 0.3 * n80})`, opacity: n80}}>
          <div style={{fontFamily: MS, fontWeight: 800, fontSize: 116, whiteSpace: 'nowrap', color: strike > 0.5 ? '#7d7468' : INK, letterSpacing: 2}}>80 MÖMİN</div>
          <div style={{position: 'absolute', left: -14, top: '50%', height: 12, width: `${strike * 106}%`, background: RED, transform: 'rotate(-4deg)', borderRadius: 6}} />
        </div>
        <div style={{marginTop: 18, display: 'inline-block', opacity: Math.min(1, stamp * 1.4), transform: `scale(${2 - stamp}) rotate(-5deg)`, border: `4px solid ${RED}`, padding: '6px 26px', fontFamily: MS, fontWeight: 800, fontSize: 46, letterSpacing: 6, color: RED}}>NƏSLİ KƏSİLDİ</div>
      </div>
      {/* ayırıcı */}
      <div style={{position: 'absolute', left: 959, top: 250, width: 2, height: 600 * k01(t, a + 0.5, 0.8), background: `repeating-linear-gradient(180deg, ${BROWN} 0 10px, transparent 10px 20px)`, opacity: 0.6}} />
      {/* sağ: 3 oğul → 8 milyard */}
      <div style={{position: 'absolute', left: 1020, top: 215, width: 760, textAlign: 'center'}}>
        <div style={{opacity: Math.min(1, treeK * 1.4), transform: `scale(${0.85 + 0.15 * treeK})`}}>
          <Tree t={t} at={sons} />
          <div style={{fontFamily: MS, fontWeight: 800, fontSize: 40, color: INK, marginTop: -6}}>NUHUN 3 OĞLU</div>
          <div style={{fontFamily: MS, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: ACC}}>SAM • HAM • YAFƏS</div>
        </div>
        <svg width={60} height={70} style={{display: 'block', margin: '8px auto 0', opacity: arrow}}>
          <path d={`M30 0 L30 ${50 * arrow}`} stroke={ACC} strokeWidth={5} strokeLinecap="round" />
          <path d="M14 44 L30 64 L46 44" fill="none" stroke={ACC} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={arrow > 0.9 ? 1 : 0} />
        </svg>
        <div style={{opacity: cntK, transform: `scale(${0.8 + 0.2 * cntK})`, marginTop: 4}}>
          <div style={{fontFamily: MS, fontWeight: 800, fontSize: 92, color: ACC, fontVariantNumeric: 'tabular-nums', letterSpacing: 1}}>{fmt(cnt)}</div>
          <div style={{fontFamily: MS, fontWeight: 800, fontSize: 34, letterSpacing: 10, color: INK}}>İNSAN</div>
        </div>
      </div>
    </Page>
  );
};
