import '@fontsource/oswald/700.css';
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const O = 'Oswald, sans-serif';
const RED = '#e3261c';

export const ThumbVertical: React.FC<{img?: string; imgLeft?: number; top?: string; name?: string; l1?: string; l2?: string; num?: string; dy?: number}> = ({img = 'media/ep1/thumb_hand.jpg', imgLeft = -1220, top = 'İLK İNSAN', name = 'HZ. ADƏMİN', l1 = 'İNANILMAZ', l2 = 'HƏYATI', num = '1', dy = 0}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {/* əl: aşağı hissə */}
    <Img src={staticFile(img)} style={{position: 'absolute', left: imgLeft, top: 520, height: 1400, width: 2489, filter: 'contrast(1.15) saturate(1.15) brightness(1.08)', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 22%)', maskImage: 'linear-gradient(180deg, transparent 0%, #000 22%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 560, height: 420, background: 'linear-gradient(180deg, #000 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0) 100%)'}} />
    {/* seriya */}
    <div style={{position: 'absolute', right: 44, top: 60, fontFamily: O, fontWeight: 700, fontSize: 100, lineHeight: 1, color: '#ffd21f', WebkitTextStroke: '4px #000', paintOrder: 'stroke fill'}}>{num}</div>
    {/* İLK İNSAN */}
    <div style={{position: 'absolute', left: 60, top: 196, width: 220, height: 34, background: RED}} />
    <div style={{position: 'absolute', left: 300, top: 172, fontFamily: O, fontWeight: 700, fontSize: 72, lineHeight: 1, color: '#fff'}}>{top}</div>
    {/* HZ. ADƏMİN */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 262 + dy, textAlign: 'center', fontFamily: O, fontWeight: 700, fontSize: 196, lineHeight: 1.05, color: '#fff', whiteSpace: 'nowrap', textShadow: '0 6px 30px rgba(0,0,0,0.8)'}}>{name}</div>
    {/* qutular */}
    <div style={{position: 'absolute', left: 60, top: 510 + dy, width: 18, height: 336, background: RED}} />
    <div style={{position: 'absolute', left: 100, top: 510 + dy, background: '#fff', padding: '0 30px', fontFamily: O, fontWeight: 700, fontSize: 128, lineHeight: 1.22, color: '#000'}}>{l1}</div>
    <div style={{position: 'absolute', left: 100, top: 690 + dy, background: '#fff', padding: '0 30px', fontFamily: O, fontWeight: 700, fontSize: 128, lineHeight: 1.22, color: '#000'}}>{l2}</div>
  </AbsoluteFill>
);
