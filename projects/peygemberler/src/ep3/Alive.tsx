import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {FPS} from '../theme';
import {Grain, Letterbox, Vignette} from '../ep1/layers';

// "Gizli arxivdən canlanan səhnə": qızılı qravüra cizgiləri çəkilir → fənər işığı rəngi açır → səhnə canlanır.
export const ALIVE_FRAMES = 8 * FPS;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Rain: React.FC<{t: number; o: number}> = ({t, o}) => (
  <AbsoluteFill style={{opacity: o}}>
    {Array.from({length: 140}, (_, i) => {
      const sp = 1.6 + rnd(i) * 1.2;
      const y = ((rnd(i + 7) + t * sp) % 1.2) * 1200 - 120;
      const x = rnd(i + 3) * 2100 - 90 - y * 0.18;
      const len = 40 + rnd(i + 9) * 60;
      return <div key={i} style={{position: 'absolute', left: x, top: y, width: 1.6, height: len, background: 'linear-gradient(180deg, rgba(220,230,255,0), rgba(220,230,255,0.55))', transform: 'rotate(10deg)'}} />;
    })}
  </AbsoluteFill>
);

export const Alive: React.FC<{img?: string; lines?: string}> = ({img = 'media/ep3/img_2.jpg', lines = 'media/ep3/img_2_lines.png'}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  // 1) cizgilər çəkilir (gəminin mərkəzindən yayılır)
  const draw = interpolate(t, [0.1, 2.2], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const R = 60 + draw * 1500;
  const lineMask = `radial-gradient(circle at 52% 48%, #000 ${R - 260}px, rgba(0,0,0,0.4) ${R - 120}px, transparent ${R}px)`;
  // 2) fənər: rəngli kadrı dairəvi işıqla açır
  const lx = interpolate(t, [2.0, 3.7], [18, 80], {...clamp, easing: Easing.inOut(Easing.sin)});
  const ly = 48 + Math.sin(t * 2.2) * 8;
  const lr = interpolate(t, [2.0, 2.4, 3.6, 4.3], [0, 260, 330, 2400], clamp);
  const colorMask = `radial-gradient(circle at ${lx}% ${ly}%, #000 ${lr * 0.55}px, rgba(0,0,0,0.6) ${lr * 0.8}px, transparent ${lr}px)`;
  const linesO = interpolate(t, [3.8, 4.6], [1, 0.0], clamp);
  // 3) canlanma
  const live = interpolate(t, [3.9, 4.6], [0, 1], clamp);
  const push = interpolate(t, [0, 8], [1.0, 1.12], {easing: Easing.inOut(Easing.sin)});
  const pan = interpolate(t, [0, 8], [10, -14]);
  const flashes = [4.05, 5.6, 7.1];
  const flash = Math.max(0, ...flashes.map((a) => interpolate(t, [a, a + 0.05, a + 0.12, a + 0.18, a + 0.5], [0, 0.9, 0.2, 0.7, 0], clamp)));
  const shake = live * (Math.sin(t * 23) * 2.2 + Math.sin(t * 37) * 1.3);
  const seed = Math.floor(t * 12);
  const bf = 0.008 + 0.002 * Math.sin(t * 1.3);
  const cam: React.CSSProperties = {position: 'absolute', inset: 0, transform: `translate(${pan + shake}px, ${shake * 0.6}px) scale(${push})`};
  const full: React.CSSProperties = {position: 'absolute', width: 1920, height: 1080, objectFit: 'cover'};
  return (
    <AbsoluteFill style={{background: '#0d0905'}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id="sea">
          <feTurbulence type="fractalNoise" baseFrequency={`${bf} ${bf * 3.2}`} numOctaves={2} seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={18 * live} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="sky">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.006" numOctaves={2} seed={Math.floor(t * 4)} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={10 * live} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {/* köhnə perqament fonu */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #2b1e10 0%, #120c06 70%)'}} />
      <div style={cam}>
        {/* rəngli səhnə (fənər maskası ilə) */}
        <div style={{position: 'absolute', inset: 0, WebkitMaskImage: colorMask, maskImage: colorMask}}>
          {/* səma qatı — yavaş */}
          <div style={{position: 'absolute', inset: 0, clipPath: 'inset(0 0 40% 0)', transform: `translateX(${live * -6 * t}px)`}}>
            <Img src={staticFile(img)} style={{...full, filter: `url(#sky) contrast(1.08) brightness(${1 + flash * 0.9})`}} />
          </div>
          {/* gəmi + dəniz qatı */}
          <div style={{position: 'absolute', inset: 0, clipPath: 'inset(58% 0 0 0)'}}>
            <Img src={staticFile(img)} style={{...full, filter: `url(#sea) contrast(1.08) brightness(${1 + flash * 0.6})`}} />
          </div>
          <div style={{position: 'absolute', inset: 0, clipPath: 'inset(0 0 0 0)', WebkitMaskImage: 'linear-gradient(180deg, transparent 52%, #000 58%, #000 60%, transparent 66%)', maskImage: 'linear-gradient(180deg, transparent 52%, #000 58%, #000 60%, transparent 66%)'}}>
            <Img src={staticFile(img)} style={{...full, filter: `contrast(1.08) brightness(${1 + flash * 0.7})`}} />
          </div>
          {/* gəminin özü (orta zona, sabit) */}
          <div style={{position: 'absolute', inset: 0, WebkitMaskImage: 'radial-gradient(ellipse 30% 42% at 50% 40%, #000 60%, transparent 100%)', maskImage: 'radial-gradient(ellipse 30% 42% at 50% 40%, #000 60%, transparent 100%)'}}>
            <Img src={staticFile(img)} style={{...full, filter: `contrast(1.08) brightness(${1 + flash * 0.7})`}} />
          </div>
        </div>
        {/* qızılı qravüra cizgiləri */}
        <div style={{position: 'absolute', inset: 0, opacity: linesO, WebkitMaskImage: lineMask, maskImage: lineMask, mixBlendMode: 'screen', filter: `drop-shadow(0 0 ${6 + 6 * Math.sin(t * 6)}px rgba(255,200,110,0.8))`}}>
          <Img src={staticFile(lines)} style={full} />
        </div>
      </div>
      {/* fənərin isti halosu */}
      {t > 2.0 && t < 4.3 ? (
        <AbsoluteFill style={{background: `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,190,100,0.28) 0px, rgba(255,190,100,0) ${lr * 1.1}px)`, mixBlendMode: 'screen'}} />
      ) : null}
      <Rain t={t} o={live * 0.8} />
      <AbsoluteFill style={{background: '#dfe8ff', opacity: flash * 0.35, mixBlendMode: 'screen'}} />
      <Vignette />
      <Grain t={t} />
      <Letterbox />
    </AbsoluteFill>
  );
};
