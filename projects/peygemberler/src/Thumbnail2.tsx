import '@fontsource/inter/900.css';
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F} from './theme';

const cells = [
  {img: 'media/ep1/K18_last.jpg', t: '30 METR?'},
  {img: 'media/ep1/K38.jpg', t: 'ALMA DEYİL?'},
  {img: 'media/ep1/K13_last.jpg', t: 'İBLİS NƏ GÖRDÜ?'},
  {img: 'media/ep1/GlobeArrival_hold.jpg', t: 'ŞRİ-LANKA?'},
];

export const Thumbnail2: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {/* Sol yarı: Adəm */}
    <div style={{position: 'absolute', left: 0, top: 0, width: 640, height: 720, overflow: 'hidden'}}>
      <Img src={staticFile('media/ep1/K16.jpg')} style={{position: 'absolute', left: -470, top: 0, height: 720, width: 1280, objectFit: 'cover', filter: 'contrast(1.15) saturate(1.15) brightness(1.05)'}} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.92) 100%)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 34, textAlign: 'center', fontFamily: F.sans, fontWeight: 600, fontSize: 22, letterSpacing: 6, color: C.goldSoft}}>PEYĞƏMBƏRLƏRİN GİZLİ TARİXİ</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 40, textAlign: 'center', fontFamily: F.serif, fontWeight: 700, fontSize: 190, lineHeight: 1, color: C.gold, textShadow: '0 8px 40px #000, 0 0 60px rgba(214,168,78,0.35)'}}>ADƏM</div>
    </div>
    {/* Sağ yarı: sirlər */}
    {cells.map((c, i) => {
      const x = 640 + (i % 2) * 320, y = (Math.floor(i / 2)) * 360;
      return (
        <div key={i} style={{position: 'absolute', left: x, top: y, width: 320, height: 360, overflow: 'hidden', borderLeft: `3px solid #000`, borderTop: i > 1 ? '3px solid #000' : undefined}}>
          <Img src={staticFile(c.img)} style={{position: 'absolute', left: '50%', top: 0, height: 360, width: 640, objectFit: 'cover', transform: 'translateX(-50%)', filter: 'contrast(1.1) saturate(1.1)'}} />
          <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.9) 100%)'}} />
          <div style={{position: 'absolute', left: 14, right: 14, bottom: 18, fontFamily: F.sans, fontWeight: 900, fontSize: 31, lineHeight: 1.05, color: '#fff', textShadow: '0 4px 16px #000'}}>{c.t}</div>
        </div>
      );
    })}
    {/* Orta xətt */}
    <div style={{position: 'absolute', left: 637, top: 0, width: 6, height: 720, background: C.gold, boxShadow: '0 0 24px rgba(214,168,78,0.8)'}} />
    <div style={{position: 'absolute', left: 320, top: 455, transform: 'translate(-50%,-50%) rotate(-3deg)', background: C.ember, padding: '10px 22px', fontFamily: F.sans, fontWeight: 900, fontSize: 40, color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.7)', whiteSpace: 'nowrap'}}>GİZLİ QALAN SİRLƏR</div>
  </AbsoluteFill>
);
