import '@fontsource/oswald/700.css';
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const O = 'Oswald, sans-serif';
const RED = '#e3261c';

export const Thumbnail3: React.FC<{img?: string; full?: boolean}> = ({img = 'media/ep1/K16.jpg', full = false}) => (
  <AbsoluteFill style={{background: '#000'}}>
    <Img src={staticFile(img)} style={{position: 'absolute', right: full ? -110 : -260, top: 0, height: 720, width: 1280, objectFit: 'cover', filter: 'contrast(1.15) saturate(1.15) brightness(1.08)'}} />
    <AbsoluteFill style={{background: full ? 'linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 58%)' : 'linear-gradient(90deg, #000 0%, #000 34%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0) 64%)'}} />
    {/* İLK İNSAN */}
    <div style={{position: 'absolute', left: 48, top: 66, width: 250, height: 34, background: RED}} />
    <div style={{position: 'absolute', left: 316, top: 46, fontFamily: O, fontWeight: 700, fontSize: 60, lineHeight: 1, color: '#fff'}}>İLK İNSAN</div>
    {/* HZ. ADƏMİN */}
    <div style={{position: 'absolute', left: 40, top: 112, fontFamily: O, fontWeight: 700, fontSize: full ? 172 : 190, lineHeight: 1.05, color: '#fff', letterSpacing: 1, textShadow: '0 6px 30px rgba(0,0,0,0.8)', whiteSpace: 'nowrap'}}>HZ. ADƏMİN</div>
    {/* qırmızı şaquli xətt + ağ qutular */}
    <div style={{position: 'absolute', left: 48, top: 352, width: 16, height: 290, background: RED}} />
    <div style={{position: 'absolute', left: 84, top: 352, background: '#fff', padding: '0 26px', fontFamily: O, fontWeight: 700, fontSize: 110, lineHeight: 1.22, color: '#000'}}>İNANILMAZ</div>
    <div style={{position: 'absolute', left: 84, top: 506, background: '#fff', padding: '0 26px', fontFamily: O, fontWeight: 700, fontSize: 110, lineHeight: 1.22, color: '#000'}}>HƏYATI</div>
    {/* seriya nömrəsi */}
    <div style={{position: 'absolute', right: 36, top: 22, fontFamily: O, fontWeight: 700, fontSize: 90, lineHeight: 1, color: '#ffd21f', WebkitTextStroke: '4px #000', paintOrder: 'stroke fill', textShadow: '0 8px 30px rgba(0,0,0,0.8)'}}>1</div>
  </AbsoluteFill>
);
