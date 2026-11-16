import React from 'react';
import {AbsoluteFill, Easing, interpolate} from 'remotion';
import {BAR, env} from '../ep1/layers';
import {Icon} from '../ep1/icons';
import {C, F} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.33, 0, 0.2, 1);
type P = {t: number; a: number; b: number};
const k01 = (t: number, a: number, d = 0.5) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: ease});
const pop = (t: number, a: number, d = 0.45) => interpolate(t, [a, a + d], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.7))});

/** Fəsil başlığı: video üzərində qızılı başlıq. */
export const Chapter: React.FC<P & {n: number; title: string}> = ({t, a, b, n, title}) => {
  const o = env(t, a, b, 0.4, 0.8);
  if (o <= 0) return null;
  const sp = interpolate(t, [a, a + 2.5], [26, 10], {...clamp, easing: Easing.out(Easing.cubic)});
  const line = k01(t, a + 0.2, 1.0);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: BAR + 70, textAlign: 'center', opacity: o}}>
      <div style={{fontFamily: F.sans, fontSize: 24, letterSpacing: 12, color: C.gold}}>{n}-{n === 1 ? 'Cİ' : n === 2 ? 'Cİ' : n === 3 ? 'CÜ' : n === 4 ? 'CÜ' : 'Cİ'} FƏSİL</div>
      <div style={{margin: '14px auto', height: 2, width: 520 * line, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`}} />
      <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 64, letterSpacing: sp, color: C.ivory, textShadow: '0 6px 40px #000', filter: `blur(${(1 - o) * 8}px)`}}>{title}</div>
    </div>
  );
};

/** ADƏM ——— NUH zaman xətti: 10 əsr yanır, sonra sönür. */
export const TLine: React.FC<P & {at0: number; at1: number; dimA: number; dimB: number}> = ({t, a, b, at0, at1, dimA, dimB}) => {
  const o = env(t, a, b, 0.5, 0.5);
  if (o <= 0) return null;
  const x0 = 360, x1 = 1560, w = (x1 - x0) / 10;
  const draw = k01(t, a, 1.0);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={x0} y1={560} x2={x0 + (x1 - x0) * draw} y2={560} stroke="rgba(240,217,160,0.4)" strokeWidth={2} />
        {new Array(10).fill(0).map((_, i) => {
          const lit = k01(t, at0 + (i * (at1 - at0)) / 10, 0.25);
          const dim = k01(t, dimA + (i * (dimB - dimA)) / 10, 0.6);
          const c = dim > 0.5 ? '#5a5248' : C.gold;
          return (
            <g key={i} opacity={lit}>
              <rect x={x0 + i * w + 6} y={540} width={w - 12} height={40} fill={c} opacity={0.25 + 0.6 * (1 - dim)} style={{filter: dim < 0.5 ? 'drop-shadow(0 0 10px rgba(214,168,78,0.8))' : undefined}} />
              <text x={x0 + i * w + w / 2} y={620} textAnchor="middle" fill={c} fontFamily="Inter" fontSize={22}>{i + 1}</text>
            </g>
          );
        })}
        {[
          [x0, 'ADƏM'],
          [x1, 'NUH'],
        ].map(([x, s]) => (
          <g key={s as string} opacity={draw}>
            <circle cx={x as number} cy={560} r={14} fill={C.gold} />
            <text x={x as number} y={500} textAnchor="middle" fill={C.ivory} fontFamily="Cormorant Garamond" fontWeight={700} fontSize={52}>{s}</text>
          </g>
        ))}
      </svg>
      <div style={{position: 'absolute', top: 650, left: 0, right: 0, textAlign: 'center', fontFamily: F.serif, fontWeight: 700, fontSize: 70, color: C.gold, opacity: k01(t, at1, 0.5), textShadow: '0 6px 30px #000'}}>
        10 ƏSR
      </div>
    </AbsoluteFill>
  );
};

/** Soy ağacı: Adəm → … → İdris → … → Nuh. */
export const FTree: React.FC<P & {at0: number; step: number; hiAt: number}> = ({t, a, b, at0, step, hiAt}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const names = ['ADƏM', 'ŞEYS', 'ƏNUŞ', 'QEYNAN', 'MƏHLAİL', 'YƏRD', 'İDRİS', '…', 'NUH'];
  const hi = k01(t, hiAt, 0.6);
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 0}}>
        {names.map((n, i) => {
          const k = pop(t, at0 + i * step);
          const isI = n === 'İDRİS';
          const col = isI ? (hi > 0 ? '#ffe6a6' : C.goldSoft) : n === 'NUH' ? C.goldSoft : C.ivory;
          return (
            <React.Fragment key={i}>
              {i > 0 && <div style={{width: 46, height: 2, background: C.gold, opacity: k, transform: `scaleX(${k})`}} />}
              <div
                style={{
                  opacity: Math.min(1, k),
                  transform: `scale(${(0.7 + 0.3 * k) * (isI ? 1 + 0.25 * hi : 1)})`,
                  padding: n === '…' ? '0 6px' : '14px 18px',
                  border: n === '…' ? 'none' : `2px solid ${isI ? '#ffe6a6' : C.gold + '88'}`,
                  background: 'rgba(8,6,4,0.8)',
                  fontFamily: F.serif,
                  fontWeight: 700,
                  fontSize: isI ? 40 : 30,
                  color: col,
                  boxShadow: isI ? `0 0 ${30 + 30 * hi}px rgba(214,168,78,${0.4 + 0.4 * hi})` : undefined,
                }}
              >
                {n}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 640, fontFamily: F.sans, fontSize: 26, letterSpacing: 8, color: C.gold, opacity: hi}}>ADƏMDƏN SONRA 6-CI NƏSİL</div>
    </AbsoluteFill>
  );
};

/** 365 günlük dairəvi təqvim. */
export const Calendar: React.FC<P & {at: number; dur: number}> = ({t, a, b, at, dur}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  const p = interpolate(t, [at, at + dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const n = Math.round(365 * p);
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {new Array(365).fill(0).map((_, i) => {
          const ang = (i / 365) * Math.PI * 2 - Math.PI / 2;
          const on = i < n;
          const r0 = 250, r1 = i % 30 === 0 ? 300 : 282;
          return (
            <line key={i} x1={960 + r0 * Math.cos(ang)} y1={540 + r0 * Math.sin(ang)} x2={960 + r1 * Math.cos(ang)} y2={540 + r1 * Math.sin(ang)} stroke={on ? C.gold : 'rgba(240,217,160,0.15)'} strokeWidth={on ? 2.4 : 1.2} />
          );
        })}
      </svg>
      <div style={{textAlign: 'center'}}>
        <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 150, color: C.gold, lineHeight: 1, textShadow: '0 0 50px rgba(214,168,78,0.5)'}}>{n}</div>
        <div style={{fontFamily: F.sans, fontSize: 26, letterSpacing: 8, color: C.ivory, marginTop: 8}}>{p >= 1 ? '365 İL = 365 GÜN' : 'GÜN'}</div>
      </div>
    </AbsoluteFill>
  );
};

/** Ulduz bürcü. */
export const Constellation: React.FC<P> = ({t, a, b}) => {
  const o = env(t, a, b, 0.3, 0.4);
  if (o <= 0) return null;
  const pts = [[1180, 210], [1290, 160], [1420, 230], [1530, 180], [1610, 300], [1480, 360], [1350, 330], [1700, 140]];
  const lines = [[0, 1], [1, 2], [2, 3], [3, 7], [3, 4], [4, 5], [5, 6], [6, 2]];
  const p = interpolate(t, [a + 0.1, a + Math.min(2.2, (b - a) * 0.8)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: o, filter: 'drop-shadow(0 0 8px rgba(255,215,140,0.9))'}}>
      {lines.map(([i, j], k) => {
        const q = Math.max(0, Math.min(1, p * lines.length - k));
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[j];
        return q > 0 ? <line key={k} x1={x1} y1={y1} x2={x1 + (x2 - x1) * q} y2={y1 + (y2 - y1) * q} stroke={C.goldSoft} strokeWidth={2.2} /> : null;
      })}
      {pts.map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={5 + 2 * Math.sin(t * 5 + k)} fill="#fff6dc" opacity={interpolate(p * pts.length - k, [0, 0.5], [0, 1], clamp)} />
      ))}
    </svg>
  );
};

/** "İLKLƏR" siyahısı (sol tərəfdə). */
export const Ilk: React.FC<P & {items: {text: string; at: number}[]}> = ({t, a, b, items}) => {
  const o = env(t, a, b, 0.5, 0.6);
  if (o <= 0) return null;
  const cur = items.filter((it) => t >= it.at).length - 1;
  return (
    <div style={{position: 'absolute', left: 80, top: BAR + 60, opacity: o, background: 'linear-gradient(90deg, rgba(8,6,4,0.85), rgba(8,6,4,0.55))', padding: '26px 34px 18px', borderLeft: `4px solid ${C.gold}`}}>
      <div style={{fontFamily: F.sans, fontSize: 20, letterSpacing: 10, color: C.gold, marginBottom: 10}}>İLKLƏR</div>
      {items.map((it, i) => {
        const k = k01(t, it.at, 0.4);
        const active = i === cur;
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, margin: '8px 0', opacity: 0.25 + 0.75 * k, transform: `translateX(${(1 - k) * -30}px)`}}>
            <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 28, color: active ? '#ffe6a6' : C.gold, width: 44}}>{String(i + 1).padStart(2, '0')}</div>
            <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: active ? 40 : 32, color: active ? '#fff3cf' : C.ivory, textShadow: active ? '0 0 24px rgba(214,168,78,0.8)' : undefined}}>{it.text}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Yeddi səma: adlarla, 4-cü qat vurğulanır, sonra "tam orta". */
export const Heavens: React.FC<P & {steps: number[]; names: string[]; mid: number; all_at: number}> = ({t, a, b, steps, names, mid, all_at}) => {
  const o = env(t, a, b, 0.6, 0.6);
  if (o <= 0) return null;
  const n = steps.filter((s) => t >= s).length;
  const allK = k01(t, all_at, 1.0);
  const midK = k01(t, mid, 0.6);
  const last = steps[steps.length - 1];
  const fl = interpolate(t, [last, last + 0.08, last + 0.7], [0, 0.6, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: o}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        {names.map((nm, i) => {
          const y = 900 - i * 112;
          const lit = i < n || allK > 0;
          const isFour = i === 3;
          const op = i < n ? 1 : 0.25 + 0.6 * allK;
          const strong = isFour && n >= 4;
          return (
            <g key={i} opacity={op}>
              <ellipse cx={960} cy={y} rx={520 - i * 26} ry={40 - i * 2} fill="none" stroke={strong ? '#fff3cf' : lit ? C.gold : 'rgba(240,217,160,0.3)'} strokeWidth={strong ? 5 : 2.2} style={{filter: strong ? 'drop-shadow(0 0 14px rgba(255,230,166,0.95))' : undefined}} />
              <text x={960 - (520 - i * 26) - 30} y={y + 10} textAnchor="end" fill={strong ? '#ffe6a6' : C.goldSoft} fontFamily="Inter" fontSize={26}>{i + 1}</text>
              <text x={960 + (520 - i * 26) + 30} y={y + 12} fill={strong ? '#ffe6a6' : C.ivory} fontFamily="Cormorant Garamond" fontWeight={700} fontSize={strong ? 40 : 30}>{nm}</text>
            </g>
          );
        })}
        {midK > 0 && (
          <g opacity={midK}>
            <text x={360} y={900 - 1 * 112 + 10} textAnchor="end" fill={C.goldSoft} fontFamily="Inter" fontSize={24}>3 QAT ↓</text>
            <text x={360} y={900 - 5 * 112 + 10} textAnchor="end" fill={C.goldSoft} fontFamily="Inter" fontSize={24}>3 QAT ↑</text>
            <text x={960} y={900 - 3 * 112 - 60} textAnchor="middle" fill="#ffe6a6" fontFamily="Inter" fontSize={26} letterSpacing={6}>TAM ORTA</text>
          </g>
        )}
      </svg>
      <AbsoluteFill style={{background: '#fff6e0', opacity: fl, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

/** Üç ayə: hər biri ✓ alır. */
export const AyahChecks: React.FC<P & {items: {q: string; r: string; ref: string; at: number; ok: number}[]}> = ({t, a, b, items}) => {
  const o = env(t, a, b, 0.4, 0.5);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center'}}>
      <div>
        {items.map((it, i) => {
          const k = k01(t, it.at, 0.5);
          const ok = pop(t, it.ok);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 28, margin: '26px 0', opacity: k, transform: `translateX(${(1 - k) * 50}px)`}}>
              <Icon name="quran" size={44} color={C.gold} />
              <div style={{width: 900}}>
                <div style={{fontFamily: F.serif, fontStyle: 'italic', fontWeight: 600, fontSize: 46, color: C.ivory, textShadow: '0 4px 24px #000'}}>“{it.q}”</div>
                <div style={{fontFamily: F.sans, fontSize: 20, letterSpacing: 6, color: C.gold}}>{it.ref}</div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: ok, transform: `scale(${0.6 + 0.4 * ok})`}}>
                <Icon name="check" size={46} color="#3ddc84" />
                <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 40, color: '#bff5d4'}}>{it.r}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Beş ad (ərəbcə + azərbaycanca) və beş işıq. */
export const FiveNames: React.FC<P & {items: {ar: string; az: string; at: number}[]}> = ({t, a, b, items}) => {
  const o = env(t, a, b, 0.4, 0.6);
  if (o <= 0) return null;
  return (
    <AbsoluteFill style={{opacity: o, justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,0,0,0.55), transparent)'}}>
      <div style={{display: 'flex', gap: 54}}>
        {items.map((it, i) => {
          const k = k01(t, it.at, 0.6);
          return (
            <div key={i} style={{textAlign: 'center', opacity: k, transform: `translateY(${(1 - k) * 40}px)`, filter: `blur(${(1 - k) * 8}px)`}}>
              <div style={{width: 14, height: 14, borderRadius: 7, background: '#ffe6a6', margin: '0 auto 18px', boxShadow: '0 0 30px 10px rgba(255,214,140,0.7)'}} />
              <div dir="rtl" style={{fontFamily: F.arabic, fontSize: 84, color: C.goldSoft, lineHeight: 1.3, textShadow: '0 0 30px rgba(214,168,78,0.6)'}}>{it.ar}</div>
              <div style={{fontFamily: F.serif, fontWeight: 700, fontSize: 40, color: C.ivory, letterSpacing: 4}}>{it.az}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Ağ flaş. */
export const Flash: React.FC<P> = ({t, a, b}) => {
  const o = interpolate(t, [a, a + 0.06, b], [0, 0.75, 0], clamp);
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: '#fff6e0', opacity: o, mixBlendMode: 'screen'}} />;
};

/** Glitch: rəng sürüşməsi və zolaqlar. */
export const Glitch: React.FC<P> = ({t, a, b}) => {
  if (t < a || t > b) return null;
  const f = Math.floor(t * 30);
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen', pointerEvents: 'none'}}>
      {new Array(6).fill(0).map((_, i) => {
        const y = ((f * 37 + i * 173) % 1000) + 40;
        return <div key={i} style={{position: 'absolute', left: 0, right: 0, top: y, height: 6 + ((f + i) % 4) * 6, background: i % 2 ? 'rgba(80,220,255,0.35)' : 'rgba(255,60,80,0.35)', transform: `translateX(${((f * 13 + i * 29) % 60) - 30}px)`}} />;
      })}
    </AbsoluteFill>
  );
};
