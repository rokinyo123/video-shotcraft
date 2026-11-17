import '@fontsource/oswald/700.css';
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ShortEnd, SHORT_END_FRAMES} from './ShortEnd';

// YouTube Shorts treyleri (şaquli): soyuq açılış (Merac / "qardaşım"), sonra treyler, sonda kanal kartı.
const FPS = 30;
export const SEGS: [number, number][] = [[24.72, 31.4], [0.8, 24.6], [31.4, 52.0]];
const segFrames = SEGS.map(([a, b]) => Math.round((b - a) * FPS));
export const SHORT_BODY = segFrames.reduce((x, y) => x + y, 0);
export const SHORT_FRAMES = SHORT_BODY + SHORT_END_FRAMES;
const O = 'Oswald, sans-serif';
const SRC = staticFile('media/ep2/trailer_h.mp4');

// 16:9 kadr: letterbox kəsilir (1920x844), hündürlük 1010-a böyüdülür, mərkəzdən 1080 en
const VH0 = 700, VY = 470;
const Clip: React.FC<{from: number}> = ({from}) => {
  const f = useCurrentFrame();
  const punch = interpolate(f, [0, 8], [1.12, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const st = from + f / FPS; // treylerdə zaman
  // seriya başlığı geniş olduğu üçün o hissədə kadr tam enə qayıdır
  const k = interpolate(st, [99, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  const VH = VH0 + (1080 * 844 / 1920 - VH0) * k;
  const VW = (1920 / 844) * VH;
  const scale = VH / 844;
  const top = VY + (VH0 - VH) / 2;
  const vid = (style: React.CSSProperties) => (
    <OffthreadVideo src={SRC} startFrom={Math.round(from * FPS)} muted style={{position: 'absolute', width: 1920 * scale, height: 1080 * scale, ...style}} />
  );
  return (
    <>
      {/* bulanıq fon */}
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        {vid({left: (1080 - 1920 * 2.4) / 2, top: (1920 - 1080 * 2.4) / 2, width: 1920 * 2.4, height: 1080 * 2.4, filter: 'blur(30px) brightness(0.45) saturate(1.2)'})}
      </div>
      <div style={{position: 'absolute', left: 0, top, width: 1080, height: VH, overflow: 'hidden', transform: `scale(${punch})`, boxShadow: '0 0 60px rgba(0,0,0,0.8)'}}>
        {vid({left: (1080 - VW) / 2, top: -118 * scale})}
        <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 80px rgba(0,0,0,0.6)'}} />
      </div>
    </>
  );
};

const Headline: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s1 = spring({frame: f + 12, fps, config: {damping: 13, stiffness: 180}});
  const s2 = spring({frame: f + 8, fps, config: {damping: 13, stiffness: 180}});
  const shine = interpolate(f % 90, [0, 30], [-0.4, 1.4], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
      <div style={{display: 'inline-block', transform: `scale(${s1})`, background: '#e3261c', padding: '4px 28px', fontFamily: O, fontWeight: 700, fontSize: 64, color: '#fff', letterSpacing: 1}}>ÖLMƏDƏN GÖYƏ</div>
      <div style={{transform: `scale(${s2})`, marginTop: 10, fontFamily: O, fontWeight: 700, fontSize: 80, lineHeight: 1.05, color: '#fff', textShadow: `0 6px 24px #000, 0 0 ${18 * Math.max(0, 1 - Math.abs(shine - 0.5) * 2)}px #ffd96b`}}>
        QALDIRILAN <span style={{color: '#ffd21f'}}>PEYĞƏMBƏR</span>
      </div>
    </div>
  );
};

const Footer: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, top: VY + VH0 + 150, textAlign: 'center', fontFamily: O, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: '#f0d9a0', textShadow: '0 4px 16px #000'}}>
    PEYĞƏMBƏRLƏRİN GİZLİ TARİXİ · 2-Cİ BÖLÜM
  </div>
);

export const ShortTrailer: React.FC = () => {
  let acc = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {SEGS.map(([a], i) => {
        const from = acc;
        acc += segFrames[i];
        return (
          <Sequence key={i} from={from} durationInFrames={segFrames[i]}>
            <Clip from={a} />
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={SHORT_BODY}>
        <Headline />
        <Footer />
        <Img src={staticFile('brand/brain_emblem.png')} style={{position: 'absolute', top: VY + VH0 + 22, left: 475, width: 120, height: 120, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.8))'}} />
      </Sequence>
      <Sequence from={SHORT_BODY}>
        <ShortEnd />
      </Sequence>
    </AbsoluteFill>
  );
};
