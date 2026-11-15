import '@fontsource/oswald/700.css';
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const O = 'Oswald, sans-serif';
const RED = '#e3261c';

export const ThumbVertical: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {/* əl: aşağı hissə */}
    <Img src={staticFile('media/ep1/thumb_hand.jpg')} style={{position: 'absolute', left: -1150, top: 600, height: 1320, width: 2366, filter: 'contrast(1.15) saturate(1.15) brightness(1.08)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 560, height: 420, background: 'linear-gradient(180deg, #000 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0) 100%)'}} />
    {/* seriya */}
    <div style={{position: 'absolute', right: 44, top: 60, fontFamily: O, fontWeight: 700, fontSize: 100, lineHeight: 1, color: '#ffd21f', WebkitTextStroke: '4px #000', paintOrder: 'stroke fill'}}>1</div>
    {/* İLK İNSAN */}
    <div style={{position: 'absolute', left: 60, top: 196, width: 220, height: 34, background: RED}} />
    <div style={{position: 'absolute', left: 300, top: 172, fontFamily: O, fontWeight: 700, fontSize: 72, lineHeight: 1, color: '#fff'}}>İLK İNSAN</div>
    {/* HZ. ADƏMİN */}
    <div style={{position: 'absolute', left: 0, right: 0, top: 262, textAlign: 'center', fontFamily: O, fontWeight: 700, fontSize: 196, lineHeight: 1.05, color: '#fff', whiteSpace: 'nowrap', textShadow: '0 6px 30px rgba(0,0,0,0.8)'}}>HZ. ADƏMİN</div>
    {/* qutular */}
    <div style={{position: 'absolute', left: 60, top: 510, width: 18, height: 336, background: RED}} />
    <div style={{position: 'absolute', left: 100, top: 510, background: '#fff', padding: '0 30px', fontFamily: O, fontWeight: 700, fontSize: 128, lineHeight: 1.22, color: '#000'}}>İNANILMAZ</div>
    <div style={{position: 'absolute', left: 100, top: 690, background: '#fff', padding: '0 30px', fontFamily: O, fontWeight: 700, fontSize: 128, lineHeight: 1.22, color: '#000'}}>HƏYATI</div>
  </AbsoluteFill>
);
