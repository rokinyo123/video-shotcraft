import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile} from 'remotion';
import {C, F} from '../theme';
import {BAR} from './layers';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.33, 0, 0.2, 1);
const env = (t: number, a: number, b: number, fin = 0.5, fout = 0.5) => interpolate(t, [a, a + fin, b - fout, b], [0, 1, 1, 0], clamp);
const pop = (t: number, a: number, d = 0.5) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
const fadeIn = (t: number, a: number, d = 0.5) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: ease});
type P = {t: number; a: number; b: number};

const Panel: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      background: 'linear-gradient(180deg, rgba(16,12,8,0.86), rgba(8,6,4,0.92))',
      border: `1px solid ${C.gold}55`,
      boxShadow: `0 30px 100px rgba(0,0,0,0.85), inset 0 0 50px ${C.gold}10`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Sitat — mərkəzdə və ya yanda. */
export const Quote: React.FC<P & {text: string; by?: string; color?: string; side?: 'center' | 'left' | 'right'; size?: number}> = ({
  t,
  a,
  b,
  text,
  by,
  color = C.ivory,
  side = 'center',
  size = 58,
}) => {
  const o = env(t, a, b, 0.5, 0.5);
  if (o <= 0) return null;
  const words = text.split(' ');
  const per = Math.min(0.12, 1.6 / words.length);
  const pos: React.CSSProperties =
    side === 'center' ? {left: 0, right: 0, justifyContent: 'center'} : side === 'left' ? {left: 110, justifyContent: 'flex-start'} : {right: 110, justifyContent: 'flex-end'};
  return (
    <div style={{position: 'absolute', top: BAR, bottom: BAR, display: 'flex', alignItems: 'center', opacity: o, ...pos}}>
      <div style={{maxWidth: side === 'center' ? 1380 : 860, textAlign: side === 'right' ? 'right' : side === 'left' ? 'left' : 'center'}}>
        <div style={{fontFamily: F.serif, fontSize: size * 2.4, lineHeight: 0.5, color: C.gold, opacity: 0.5, height: size * 0.9}}>“</div>
        <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: size, lineHeight: 1.25, color, textShadow: '0 6px 40px rgba(0,0,0,0.95)'}}>
          {words.map((w, i) => {
            const k = fadeIn(t, a + 0.15 + i * per, 0.35);
            return (
              <span key={i} style={{opacity: k, filter: `blur(${(1 - k) * 6}px)`, marginRight: '0.26em', display: 'inline-block'}}>
                {w}
              </span>
            );
          })}
        </div>
        {by && (
          <div style={{marginTop: 22, fontFamily: F.sans, fontSize: 22, letterSpacing: 6, color: C.gold, opacity: fadeIn(t, a + 1.2)}}>— {by}</div>
        )}
      </div>
    </div>
  );
};

/** 2–3 sütunlu müqayisə panelləri (3D girişlə). */
export const Columns: React.FC<
  P & {title?: string; items: {h: string; t: string; c?: string; at: number; ar?: string; img?: string; mark?: string}[]; focus?: {i: number; at: number}}
> = ({t, a, b, title, items, focus}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const w = items.length === 2 ? 640 : 500;
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center'}}>
      {title && (
        <div style={{position: 'absolute', top: BAR + 46, fontFamily: F.sans, fontSize: 24, letterSpacing: 10, color: C.gold, opacity: fadeIn(t, a)}}>{title}</div>
      )}
      <div style={{display: 'flex', gap: 46, marginTop: title ? 40 : 0, perspective: 1600}}>
        {items.map((it, i) => {
          const k = interpolate(t, [it.at, it.at + 0.7], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          const isF = focus && t >= focus.at;
          const dim = isF && focus!.i !== i ? 0.35 : 1;
          const big = isF && focus!.i === i ? 1.06 : 1;
          const col = it.c ?? C.gold;
          return (
            <div key={i} style={{opacity: k * dim, transform: `rotateY(${(1 - k) * (i - (items.length - 1) / 2) * -30}deg) translateY(${(1 - k) * 60}px) scale(${big})`, transition: 'none'}}>
              <Panel style={{width: w, minHeight: 360, padding: '34px 36px', borderTop: `4px solid ${col}`}}>
                {it.img && (
                  <div style={{height: 200, margin: '-34px -36px 24px', overflow: 'hidden'}}>
                    <Img src={staticFile(it.img)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)'}} />
                  </div>
                )}
                {it.mark && <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 64, color: col, lineHeight: 1}}>{it.mark}</div>}
                <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 48, color: col, lineHeight: 1.1, marginTop: 6}}>{it.h}</div>
                {it.ar && (
                  <div dir="rtl" style={{fontFamily: F.arabic, fontSize: 40, color: C.goldSoft, marginTop: 16, lineHeight: 1.6}}>
                    {it.ar}
                  </div>
                )}
                <div style={{fontFamily: F.sans, fontSize: 28, color: C.ivory, lineHeight: 1.4, marginTop: 16}}>{it.t}</div>
              </Panel>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Bir sətirdə görünən söz "çipləri". */
export const Chips: React.FC<P & {items: {text: string; at: number; c?: string}[]; y?: number; size?: number}> = ({t, a, b, items, y = 50, size = 64}) => {
  const o = env(t, a, b, 0.3, 0.5);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: `${y}%`, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center', gap: 34, flexWrap: 'wrap', opacity: o}}>
      {items.map((it, i) => {
        const k = pop(t, it.at, 0.5);
        return (
          <div
            key={i}
            style={{
              opacity: Math.min(1, k),
              transform: `scale(${0.6 + 0.4 * k})`,
              padding: '14px 34px',
              border: `2px solid ${it.c ?? C.gold}`,
              background: 'rgba(8,6,4,0.75)',
              fontFamily: F.serif,
              fontWeight: 700,
              fontSize: size,
              color: it.c ?? C.ivory,
              letterSpacing: 2,
              boxShadow: `0 0 40px ${(it.c ?? C.gold) + '33'}`,
            }}
          >
            {it.text}
          </div>
        );
      })}
    </div>
  );
};

/** Nömrələnmiş siyahı (məs. Cümə günü hadisələri). */
export const List: React.FC<P & {title: string; sub?: string; items: {text: string; at: number}[]}> = ({t, a, b, title, sub, items}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const k0 = interpolate(t, [a, a + 0.8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', gap: 80, alignItems: 'center'}}>
        <Panel style={{width: 420, height: 480, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `perspective(1200px) rotateY(${(1 - k0) * 70}deg)`}}>
          <div style={{width: '100%', height: 70, background: '#7a1d10', marginTop: -2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans, letterSpacing: 8, color: C.ivory, fontSize: 22}}>
            HƏFTƏNİN GÜNÜ
          </div>
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 120, color: C.gold}}>{title}</div>
            {sub && <div style={{fontFamily: F.sans, fontSize: 24, color: C.ivory, letterSpacing: 4}}>{sub}</div>}
          </div>
        </Panel>
        <div>
          {items.map((it, i) => {
            const k = fadeIn(t, it.at, 0.5);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, margin: '22px 0', opacity: k, transform: `translateX(${(1 - k) * 60}px)`}}>
                <div style={{width: 64, height: 64, border: `2px solid ${C.gold}`, borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.serif, fontWeight: 700, fontSize: 34, color: C.gold}}>
                  {i + 1}
                </div>
                <div style={{fontFamily: F.serif, fontWeight: 600, fontSize: 54, color: C.ivory}}>{it.text}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Böyük ərəb xəttatlığı. */
export const Calligraphy: React.FC<P & {ar: string; sub?: string; y?: number}> = ({t, a, b, ar, sub, y = 44}) => {
  const o = env(t, a, b, 0.6, 0.6);
  if (o <= 0) return null;
  const r = interpolate(t, [a, a + 1.8], [0, 100], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: `${y}%`, transform: 'translateY(-50%)', textAlign: 'center', opacity: o}}>
      <div dir="rtl" style={{fontFamily: F.arabic, fontSize: 150, color: C.goldSoft, textShadow: `0 0 50px ${C.gold}88, 0 6px 30px #000`, clipPath: `inset(0 0 0 ${100 - r}%)`}}>
        {ar}
      </div>
      {sub && <div style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 46, color: C.ivory, opacity: fadeIn(t, a + 1.2)}}>{sub}</div>}
    </div>
  );
};

/** Rəqəm sayğacı. */
export const Counter: React.FC<P & {from: number; to: number; at: number; dur: number; label: string; suffix?: string; y?: number}> = ({
  t,
  a,
  b,
  from,
  to,
  at,
  dur,
  label,
  suffix = '',
  y = 30,
}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const v = Math.round(interpolate(t, [at, at + dur], [from, to], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: `${y}%`, textAlign: 'center', opacity: o}}>
      <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 170, color: C.gold, lineHeight: 1, textShadow: '0 0 60px rgba(214,168,78,0.4), 0 8px 40px #000'}}>
        {v}
        <span style={{fontSize: 70}}>{suffix}</span>
      </div>
      <div style={{fontFamily: F.sans, fontSize: 26, letterSpacing: 8, color: C.ivory}}>{label}</div>
    </div>
  );
};

/** A12: Adəmin 1000 ili → 40 il Davuda. */
export const LifeBars: React.FC<P & {cut: number; join: number}> = ({t, a, b, cut, join}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const grow = interpolate(t, [a, a + 1.4], [0, 1], {...clamp, easing: ease});
  const c = interpolate(t, [cut, cut + 0.8], [0, 1], {...clamp, easing: ease});
  const j = interpolate(t, [join, join + 1.0], [0, 1], {...clamp, easing: ease});
  const W = 1300;
  const px = (y: number) => (y / 1000) * W;
  const adam = interpolate(c, [0, 1], [1000, 960]);
  const dav = 60 + 40 * j;
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: W}}>
        {[
          {n: 'ADƏM', v: adam, c: C.gold, total: 1000},
          {n: 'DAVUD', v: dav, c: '#fff3cf', total: 100},
        ].map((r, i) => (
          <div key={i} style={{marginBottom: 70}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: F.serif, fontWeight: 700, fontSize: 52, color: r.c}}>
              <span>{r.n}</span>
              <span>{Math.round(r.v)} il</span>
            </div>
            <div style={{position: 'relative', height: 46, background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.gold}44`, marginTop: 12}}>
              <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: px(r.v) * grow, background: `linear-gradient(90deg, ${r.c}55, ${r.c})`}} />
            </div>
          </div>
        ))}
        {/* qopub düşən 40 il */}
        {c > 0 && j < 1 && (
          <div
            style={{
              position: 'absolute',
              left: (1920 - W) / 2 + px(960) - (px(960) - px(60)) * j,
              top: 1080 / 2 - 70 + 116 * j,
              width: px(40),
              height: 46,
              background: '#fff3cf',
              boxShadow: '0 0 30px #fff3cf',
              opacity: 1 - j * 0.2,
              transform: `translateY(${-30 * Math.sin(Math.PI * j)}px)`,
            }}
          />
        )}
        <div style={{textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 46, color: C.goldSoft, opacity: j}}>“Mənim ömrümdən ona qırx il əlavə et.”</div>
      </div>
    </AbsoluteFill>
  );
};

/** A07: 60 dirsək miqyası — insan, bina, Adəm (arxadan siluet). */
export const Scale: React.FC<P & {ruler: number; build: number; done: number}> = ({t, a, b, ruler, build, done}) => {
  const o = env(t, a, b, 0.5, 0.5);
  if (o <= 0) return null;
  const H = 640; // 30 m
  const base = 900;
  const m = (x: number) => (x / 30) * H;
  const r = interpolate(t, [ruler, ruler + 5.5], [0, 1], {...clamp, easing: ease});
  const bd = interpolate(t, [build, build + 1.2], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const dn = fadeIn(t, done, 0.6);
  const cub = Math.round(60 * r);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <svg width={1920} height={1080}>
        <defs>
          <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.goldSoft} stopOpacity="0.95" />
            <stop offset="1" stopColor={C.gold} stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {/* üfüq xətti */}
        <line x1={200} x2={1720} y1={base} y2={base} stroke={C.gold} strokeOpacity={0.5} strokeWidth={2} />
        {[0, 5, 10, 15, 20, 25, 30].map((v) => (
          <g key={v} opacity={0.35}>
            <line x1={330} x2={1700} y1={base - m(v)} y2={base - m(v)} stroke={C.gold} strokeDasharray="4 10" />
            <text x={300} y={base - m(v) + 8} fill={C.ivory} fontFamily="Inter" fontSize={22} textAnchor="end">
              {v} m
            </text>
          </g>
        ))}
        {/* adi insan 1.75 m */}
        <g transform={`translate(520 ${base})`}>
          <ellipse cx={0} cy={-m(1.75) + 6} rx={6} ry={7} fill={C.ivory} />
          <rect x={-7} y={-m(1.75) + 13} width={14} height={m(1.75) - 13} rx={6} fill={C.ivory} />
          <text x={0} y={40} fill={C.ivory} fontFamily="Inter" fontSize={22} textAnchor="middle">
            insan · 1,75 m
          </text>
        </g>
        {/* 9 mərtəbəli bina */}
        <g transform={`translate(820 ${base})`} opacity={bd}>
          <rect x={-90} y={-m(27) * bd} width={180} height={m(27) * bd} fill="rgba(239,230,210,0.08)" stroke={C.ivory} strokeOpacity={0.6} />
          {new Array(9).fill(0).map((_, i) => (
            <line key={i} x1={-90} x2={90} y1={-m(3) * (i + 1) * bd} y2={-m(3) * (i + 1) * bd} stroke={C.ivory} strokeOpacity={0.25} />
          ))}
          <text x={0} y={40} fill={C.ivory} fontFamily="Inter" fontSize={22} textAnchor="middle">
            9 mərtəbəli bina
          </text>
        </g>
        {/* Adəm — arxadan, nurlu siluet; boy ölçü xətti ilə birlikdə böyüyür */}
        <g transform={`translate(1240 ${base})`}>
          <g transform={`scale(${Math.max(0.0001, r)})`}>
            <ellipse cx={0} cy={-H + 52} rx={44} ry={52} fill="url(#sil)" />
            <path d={`M -95 ${-H + 130} Q 0 ${-H + 90} 95 ${-H + 130} L 110 ${-H + 360} L 70 ${-H + 380} L 64 ${-1} L 12 0 L 0 ${-H + 420} L -12 0 L -64 -1 L -70 ${-H + 380} L -110 ${-H + 360} Z`} fill="url(#sil)" />
          </g>
          <text x={0} y={40} fill={C.gold} fontFamily="Inter" fontSize={22} textAnchor="middle" opacity={dn}>
            Adəm · 60 dirsək
          </text>
        </g>
        {/* ölçü xətti */}
        <g transform={`translate(1400 ${base})`}>
          <line x1={0} x2={0} y1={0} y2={-H * r} stroke={C.gold} strokeWidth={3} />
          <line x1={-14} x2={14} y1={-H * r} y2={-H * r} stroke={C.gold} strokeWidth={3} />
          <text x={26} y={-H * r + 12} fill={C.gold} fontFamily="Cormorant Garamond" fontWeight={700} fontSize={56}>
            {cub} dirsək
          </text>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 360, top: BAR + 60, textAlign: 'left', opacity: dn}}>
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 110, color: C.gold, lineHeight: 1}}>≈ 27–30 m</div>
        <div style={{fontFamily: F.sans, fontSize: 24, letterSpacing: 4, color: C.ivory}}>1 dirsək ≈ 45–50 sm</div>
      </div>
    </AbsoluteFill>
  );
};

/** A19: əkiz cütlər və çarpaz evlilik. */
export const TwinTree: React.FC<P & {cross: number; ban: number; haram: number}> = ({t, a, b, cross, ban, haram}) => {
  const o = env(t, a, b, 0.5, 0.5);
  if (o <= 0) return null;
  const c = interpolate(t, [cross, cross + 1.2], [0, 1], {...clamp, easing: ease});
  const bn = pop(t, ban, 0.4);
  const hr = fadeIn(t, haram, 0.5);
  const box = (x: number, y: number, label: string, col: string, k: number) => (
    <g opacity={k} transform={`translate(${x} ${y})`}>
      <rect x={-130} y={-46} width={260} height={92} fill="rgba(10,8,6,0.85)" stroke={col} strokeWidth={2} />
      <text x={0} y={14} textAnchor="middle" fill={C.ivory} fontFamily="Cormorant Garamond" fontWeight={700} fontSize={40}>
        {label}
      </text>
    </g>
  );
  const k1 = fadeIn(t, a + 0.2), k2 = fadeIn(t, a + 1.0);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <svg width={1920} height={1080}>
        <text x={560} y={300} textAnchor="middle" fill={C.gold} fontFamily="Inter" fontSize={24} letterSpacing={6} opacity={k1}>
          1-Cİ DOĞUM
        </text>
        <text x={1360} y={300} textAnchor="middle" fill={C.gold} fontFamily="Inter" fontSize={24} letterSpacing={6} opacity={k2}>
          2-Cİ DOĞUM
        </text>
        {box(560, 400, 'Oğlan A', '#7fb3ff', k1)}
        {box(560, 620, 'Qız A', '#ff9fb8', k1)}
        {box(1360, 400, 'Oğlan B', '#7fb3ff', k2)}
        {box(1360, 620, 'Qız B', '#ff9fb8', k2)}
        {/* qadağan: öz əkizi */}
        <g opacity={bn}>
          <line x1={560} x2={560} y1={446} y2={574} stroke={C.ember} strokeWidth={4} strokeDasharray="10 8" />
          <text x={600} y={522} fill={C.ember} fontFamily="Inter" fontWeight={600} fontSize={60}>
            ✕
          </text>
        </g>
        {/* çarpaz evlilik */}
        <g opacity={c > 0 ? 1 : 0}>
          <path d="M 690 400 L 1230 620" stroke="#3ddc84" strokeWidth={4} fill="none" strokeDasharray="800" strokeDashoffset={800 * (1 - c)} />
          <path d="M 1230 400 L 690 620" stroke="#3ddc84" strokeWidth={4} fill="none" strokeDasharray="800" strokeDashoffset={800 * (1 - c)} />
          <text x={960} y={490} textAnchor="middle" fill="#3ddc84" fontFamily="Inter" fontWeight={600} fontSize={60} opacity={c}>
            ✓
          </text>
        </g>
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 770, textAlign: 'center', opacity: hr}}>
        <span style={{border: `3px solid ${C.ember}`, padding: '12px 30px', fontFamily: F.sans, fontWeight: 600, letterSpacing: 4, fontSize: 30, color: C.ember, background: 'rgba(8,6,4,0.8)'}}>
          SONRAKI ŞƏRİƏTLƏRDƏ — HARAM
        </span>
      </div>
    </AbsoluteFill>
  );
};

/** A20: "Qabil / Habil" üstündən xətt → "Adəmin iki oğlu". */
export const Strike: React.FC<P & {words: string[]; strikeAt: number; repl: string; replAt: number; ar?: string; ref_?: string}> = ({
  t,
  a,
  b,
  words,
  strikeAt,
  repl,
  replAt,
  ar,
  ref_,
}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const s = interpolate(t, [strikeAt, strikeAt + 0.6], [0, 1], {...clamp, easing: ease});
  const r = fadeIn(t, replAt, 0.7);
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', gap: 80, opacity: 1 - 0.55 * r, transform: `translateY(${-70 * r}px) scale(${1 - 0.25 * r})`}}>
        {words.map((w, i) => (
          <div key={i} style={{position: 'relative', fontFamily: F.serif, fontWeight: 700, fontSize: 130, color: C.ivory}}>
            “{w}”
            <div style={{position: 'absolute', left: -10, top: '52%', height: 8, width: `${(s * 110).toFixed(1)}%`, background: C.ember, transform: 'rotate(-4deg)'}} />
          </div>
        ))}
      </div>
      <div style={{textAlign: 'center', opacity: r, marginTop: 10}}>
        {ar && (
          <div dir="rtl" style={{fontFamily: F.arabic, fontSize: 90, color: C.goldSoft}}>
            {ar}
          </div>
        )}
        <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 66, color: C.gold}}>{repl}</div>
        {ref_ && <div style={{fontFamily: F.sans, letterSpacing: 6, fontSize: 22, color: C.ivory, marginTop: 10}}>{ref_}</div>}
      </div>
    </AbsoluteFill>
  );
};

/** Eyni cümlə 3 dəfə, hər dəfə daha böyük. */
export const Repeat: React.FC<P & {text: string; times: number[]}> = ({t, a, b, text, times}) => {
  const o = env(t, a, b, 0.2, 0.6);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 10}}>
      {times.map((tm, i) => {
        const k = pop(t, tm, 0.45);
        return (
          <div
            key={i}
            style={{
              fontFamily: F.serif,
              fontWeight: 700,
              fontSize: 64 + i * 26,
              color: i === 2 ? C.gold : C.ivory,
              opacity: Math.min(1, k) * (i === 2 ? 1 : 0.55 + 0.2 * i),
              transform: `scale(${0.7 + 0.3 * k})`,
              textShadow: i === 2 ? '0 0 60px rgba(214,168,78,0.55)' : '0 6px 30px #000',
              letterSpacing: 2,
            }}
          >
            {text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** "MALUM" sözünün iki mənası. */
export const Malum: React.FC<P & {split: number}> = ({t, a, b, split}) => {
  const o = env(t, a, b, 0.5, 0.5);
  if (o <= 0) return null;
  const s = interpolate(t, [split, split + 1.0], [0, 1], {...clamp, easing: ease});
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontFamily: F.sans, letterSpacing: 10, fontSize: 24, color: C.gold, marginBottom: 20}}>LATIN DİLİ</div>
      <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 180, color: C.ivory, letterSpacing: 12}}>MALUM</div>
      <div style={{display: 'flex', gap: 300, marginTop: 30}}>
        {[
          {w: 'alma', c: '#e2483a', x: -1},
          {w: 'pislik', c: C.gold, x: 1},
        ].map((it, i) => (
          <div key={i} style={{opacity: s, transform: `translateX(${it.x * (1 - s) * -150}px)`, textAlign: 'center'}}>
            <div style={{fontFamily: F.sans, fontSize: 60, color: it.c}}>↓</div>
            <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 80, color: it.c}}>{it.w}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Qırmızı ✕ möhürü. */
export const XMark: React.FC<P> = ({t, a, b}) => {
  const o = env(t, a, b, 0.05, 0.5);
  if (o <= 0) return null;
  const k = interpolate(t, [a, a + 0.2], [2.4, 1], {...clamp, easing: Easing.in(Easing.quad)});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 520, lineHeight: 1, color: '#e2483a', transform: `scale(${k})`, textShadow: '0 0 60px rgba(226,72,58,0.6)'}}>✕</div>
    </AbsoluteFill>
  );
};

/** Kiçik nəticə nişanı (yuxarı-sol). */
export const Verdict: React.FC<P & {text: string; c?: string}> = ({t, a, b, text, c = '#3ddc84'}) => {
  const o = env(t, a, b, 0.3, 0.5);
  if (o <= 0) return null;
  const k = pop(t, a, 0.45);
  return (
    <div style={{position: 'absolute', left: 90, top: BAR + 50, opacity: o, transform: `scale(${0.8 + 0.2 * k})`, transformOrigin: 'left top'}}>
      <span style={{border: `3px solid ${c}`, color: c, background: 'rgba(8,6,4,0.8)', padding: '12px 26px', fontFamily: F.sans, fontWeight: 600, fontSize: 30, letterSpacing: 4}}>{text}</span>
    </div>
  );
};

/** Şərh çağırışı. */
export const Comment: React.FC<P & {text: string}> = ({t, a, b, text}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const k = pop(t, a, 0.5);
  return (
    <div style={{position: 'absolute', right: 110, bottom: BAR + 60, opacity: o, transform: `scale(${0.8 + 0.2 * k})`, transformOrigin: 'right bottom'}}>
      <Panel style={{padding: '22px 34px', display: 'flex', alignItems: 'center', gap: 22, borderLeft: `5px solid ${C.gold}`}}>
        <svg width={56} height={56} viewBox="0 0 24 24">
          <path d="M4 4h16v11H8l-4 4z" fill="none" stroke={C.gold} strokeWidth={1.6} strokeLinejoin="round" />
          <circle cx={9} cy={9.5} r={1} fill={C.gold} />
          <circle cx={12} cy={9.5} r={1} fill={C.gold} />
          <circle cx={15} cy={9.5} r={1} fill={C.gold} />
        </svg>
        <div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 30, color: C.ivory, letterSpacing: 1}}>{text}</div>
      </Panel>
    </div>
  );
};

/** Abunə ol düyməsi + zəng. */
export const Subscribe: React.FC<P & {click: number}> = ({t, a, b, click}) => {
  const o = env(t, a, b, 0.4, 0.6);
  if (o <= 0) return null;
  const k = pop(t, a, 0.5);
  const cl = t >= click;
  const press = interpolate(t, [click, click + 0.08, click + 0.2], [1, 0.92, 1], clamp);
  const ring = cl ? Math.sin((t - click) * 30) * 14 * Math.exp(-(t - click) * 3) : 0;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 36, transform: `scale(${(0.7 + 0.3 * k) * press})`}}>
        <div
          style={{
            padding: '30px 64px',
            background: cl ? '#3a3330' : '#c4302b',
            color: '#fff',
            fontFamily: F.sans,
            fontWeight: 600,
            fontSize: 52,
            letterSpacing: 2,
            borderRadius: 14,
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
          }}
        >
          {cl ? 'ABUNƏ OLUNDU ✓' : 'ABUNƏ OL'}
        </div>
        <svg width={110} height={110} viewBox="0 0 24 24" style={{transform: `rotate(${ring}deg)`}}>
          <path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0" fill="none" stroke={C.gold} strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/** Dialoq sətri — sol/sağ tərəfdə, danışanın adı ilə. */
export const Dialog: React.FC<P & {who: string; text: string; side: 'left' | 'right'; c?: string}> = ({t, a, b, who, text, side, c = C.gold}) => {
  const o = env(t, a, b, 0.35, 0.4);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', top: BAR + 140, [side]: 110, width: 820, textAlign: side, opacity: o, transform: `translateX(${(1 - o) * (side === 'left' ? -40 : 40)}px)`}}>
      <div style={{fontFamily: F.sans, letterSpacing: 8, fontSize: 22, color: c}}>{who}</div>
      <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 54, lineHeight: 1.25, color: C.ivory, marginTop: 10, textShadow: '0 6px 40px #000'}}>“{text}”</div>
    </div>
  );
};

/** Növbəti bölüm kartı. */
export const NextEp: React.FC<P> = ({t, a, b}) => {
  const o = env(t, a, b, 0.8, 1.2);
  if (o <= 0) return null;
  const sp = interpolate(t, [a, a + 4], [40, 18], {...clamp, easing: Easing.out(Easing.quad)});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontFamily: F.sans, letterSpacing: 10, fontSize: 26, color: C.gold}}>NÖVBƏTİ BÖLÜM</div>
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 170, letterSpacing: sp, color: C.ivory, textShadow: '0 0 60px rgba(214,168,78,0.4)'}}>İDRİS</div>
        <div style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 44, color: C.goldSoft}}>Səmaya qaldırılan peyğəmbərin sirri</div>
      </div>
    </AbsoluteFill>
  );
};
