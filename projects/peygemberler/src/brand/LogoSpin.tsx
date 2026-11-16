import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// İstifadəçinin loqosu: halqa yerində qalır, içindəki beyin 3D fırlanıb ESGAROW-a, sonra yenə beyinə çevrilir.
export const LOGO_FPS = 30;
export const LOGO_FRAMES = 6 * LOGO_FPS;
const S = 1080 / 600; // mənbə 600px
const CX = 299.5 * S, R = 258 * S;

const ease = Easing.inOut(Easing.cubic);
const angleAt = (t: number) => {
  if (t < 1.4) return Math.sin((t / 1.4) * Math.PI) * 6; // yüngül yırğalanma
  if (t < 2.9) return interpolate(t, [1.4, 2.9], [0, 540], {easing: ease});
  if (t < 4.4) return 540 + Math.sin(((t - 2.9) / 1.5) * Math.PI) * 6;
  return interpolate(t, [4.4, 5.9], [540, 1080], {easing: ease, extrapolateRight: 'clamp'});
};

export const LogoSpin: React.FC<{green?: boolean}> = ({green}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const ang = angleAt(t);
  const spinning = (t > 1.4 && t < 2.9) || (t > 4.4 && t < 5.9);
  // parıltı zolağı
  const sheenX = spinning ? ((ang % 180) / 180) * 2.4 - 0.7 : -2;
  const arrive = Math.max(0, 1 - Math.abs(t - 3.0) / 0.5);
  const face: React.CSSProperties = {position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden'};
  return (
    <AbsoluteFill style={{background: green ? '#00ff00' : 'transparent'}}>
      <AbsoluteFill style={green ? {WebkitMaskImage: `url(${staticFile('brand/outer_mask.png')})`, WebkitMaskSize: '100% 100%', maskImage: `url(${staticFile('brand/outer_mask.png')})`, maskSize: '100% 100%'} : undefined}>
        <Img src={staticFile('brand/plate.png')} style={{width: 1080, height: 1080, position: 'absolute'}} />
        {/* fırlanan disk */}
        <div style={{position: 'absolute', left: CX - R, top: CX - R, width: 2 * R, height: 2 * R, perspective: 2200}}>
          <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${ang}deg)`}}>
            <div style={{...face}}>
              <Img src={staticFile('brand/face.png')} style={{position: 'absolute', width: 1080, height: 1080, left: -(CX - R), top: -(CX - R)}} />
            </div>
            <div style={{...face, transform: 'rotateY(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
              <div style={{position: 'absolute', width: 2 * R, height: 2 * R, borderRadius: '50%', background: `radial-gradient(circle, rgba(255,214,110,${0.35 * arrive}) 0%, rgba(255,214,110,0) 60%)`}} />
              <Word />
            </div>
          </div>
          {/* parıltı */}
          <div style={{position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', pointerEvents: 'none'}}>
            <div style={{position: 'absolute', top: -R, bottom: -R, width: R * 0.5, left: `${sheenX * 100}%`, transform: 'rotate(18deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,250,230,0.55) 50%, rgba(255,255,255,0) 100%)', mixBlendMode: 'screen'}} />
          </div>
        </div>
        <Img src={staticFile('brand/ring.png')} style={{width: 1080, height: 1080, position: 'absolute'}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const GOLD = 'linear-gradient(180deg, #ffe7a0 0%, #f2c14a 30%, #c98d14 55%, #f7d06a 75%, #a86f0c 100%)';
const Word: React.FC = () => {
  const depth = Array.from({length: 9}, (_, i) => `0 ${i + 1}px 0 #6e4705`).join(',');
  return (
    <div style={{position: 'relative', textAlign: 'center'}}>
      <div style={{position: 'absolute', inset: 0, fontFamily: 'Cormorant Garamond', fontWeight: 700, fontSize: 150, letterSpacing: 6, color: '#6e4705', textShadow: `${depth}, 0 18px 26px rgba(0,0,0,0.45)`}}>ESGAROW</div>
      <div style={{position: 'relative', fontFamily: 'Cormorant Garamond', fontWeight: 700, fontSize: 150, letterSpacing: 6, background: GOLD, WebkitBackgroundClip: 'text', color: 'transparent'}}>ESGAROW</div>
    </div>
  );
};
