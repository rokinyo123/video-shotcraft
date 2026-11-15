import '@fontsource/inter/900.css';
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F} from './theme';

export const Thumbnail: React.FC<{img: string; hook: string; hook2: string}> = ({img, hook, hook2}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Img src={staticFile(img)} style={{position: 'absolute', right: -120, top: 0, height: 720, width: 1280 * 1.0, objectFit: 'cover', filter: 'contrast(1.15) saturate(1.15) brightness(1.05)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.82) 36%, rgba(0,0,0,0.15) 62%, rgba(0,0,0,0) 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 90% at 70% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)'}} />
    <div style={{position: 'absolute', left: 56, top: 54, fontFamily: F.sans, fontWeight: 600, fontSize: 26, letterSpacing: 7, color: C.goldSoft}}>
      PEYĞƏMBƏRLƏRİN GİZLİ TARİXİ
    </div>
    <div style={{position: 'absolute', left: 56, top: 92, width: 120, height: 4, background: C.gold}} />
    <div style={{position: 'absolute', left: 44, top: 150, fontFamily: F.serif, fontWeight: 700, fontSize: 250, lineHeight: 1, color: C.gold, textShadow: '0 8px 40px rgba(0,0,0,0.9), 0 0 60px rgba(214,168,78,0.35)'}}>
      ADƏM
    </div>
    <div style={{position: 'absolute', left: 56, top: 430, fontFamily: F.sans, fontWeight: 900, fontSize: 72, lineHeight: 1.02, color: '#fff', textShadow: '0 6px 24px #000'}}>
      {hook}
    </div>
    <div style={{position: 'absolute', left: 56, top: 520, display: 'inline-block', background: C.ember, padding: '8px 20px', fontFamily: F.sans, fontWeight: 900, fontSize: 52, color: '#fff', transform: 'rotate(-2deg)', boxShadow: '0 8px 30px rgba(0,0,0,0.6)'}}>
      {hook2}
    </div>
  </AbsoluteFill>
);
