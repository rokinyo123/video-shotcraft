import '@fontsource/oswald/700.css';
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// Shorts sonluğu: fırlanan loqo + "Tam video kanalda" + bəyən / şərh / abunə animasiyası.
export const SHORT_END_FRAMES = 8 * 30;
const O = 'Oswald, sans-serif';
const SERIF = '"Cormorant Garamond", serif';

const Btn: React.FC<{at: number; icon: React.ReactNode; label: string; color: string; y: number}> = ({at, icon, label, color, y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 11, stiffness: 160}});
  const tap = f - at - 14; // barmaq toxunuşu
  const press = tap >= 0 && tap < 8 ? 1 - Math.sin((tap / 8) * Math.PI) * 0.12 : 1;
  const on = tap >= 4;
  const ring = tap >= 4 ? interpolate(tap, [4, 22], [0, 1], {extrapolateRight: 'clamp'}) : 0;
  const handX = interpolate(tap, [-14, 0, 10], [260, 0, 40], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const handO = interpolate(tap, [-14, -8, 10, 16], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 140, top: y, width: 800, height: 150, transform: `scale(${s * press})`, opacity: s}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 75, background: on ? color : 'rgba(255,255,255,0.12)', border: '3px solid rgba(255,255,255,0.85)', boxShadow: on ? `0 0 ${50 * (1 - ring)}px ${color}` : 'none', display: 'flex', alignItems: 'center', paddingLeft: 60, gap: 40}}>
        <div style={{width: 80, height: 80, transform: on ? `scale(${1 + 0.25 * Math.sin(Math.min(1, ring * 2) * Math.PI)}) rotate(${label.includes('ABUN') ? Math.sin(ring * 30) * 18 * (1 - ring) : 0}deg)` : 'none'}}>{icon}</div>
        <div style={{fontFamily: O, fontWeight: 700, fontSize: 70, color: '#fff', letterSpacing: 2}}>{label}</div>
      </div>
      {/* dalğa */}
      {ring > 0 && ring < 1 ? <div style={{position: 'absolute', inset: -30 * ring, borderRadius: 100, border: `4px solid ${color}`, opacity: 1 - ring}} /> : null}
      {/* barmaq */}
      <div style={{position: 'absolute', left: 560 + handX, top: 60 + handX * 0.3, fontSize: 110, opacity: handO, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.6))'}}>👆</div>
    </div>
  );
};

const Like = ({on}: {on?: boolean}) => (
  <svg viewBox="0 0 24 24" width="80" height="80"><path fill="#fff" d="M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.3l1-4.6v-.3c0-.4-.2-.8-.4-1.1L13.2 1 6.6 7.6C6.2 8 6 8.5 6 9v10c0 1.1.9 2 2 2h9c.8 0 1.5-.5 1.8-1.2l3-7.1c.1-.2.2-.5.2-.7v-2z"/></svg>
);
const Comment = () => (
  <svg viewBox="0 0 24 24" width="80" height="80"><path fill="#fff" d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V6c0-1.1-.9-2-2-2zM7 13a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/></svg>
);
const Bell = () => (
  <svg viewBox="0 0 24 24" width="80" height="80"><path fill="#fff" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.1-1.6-5.6-4.5-6.3V4a1.5 1.5 0 00-3 0v.7C7.6 5.4 6 7.9 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
);

export const ShortEnd: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inO = interpolate(f, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const logoS = spring({frame: f - 2, fps, config: {damping: 12}});
  const t1 = spring({frame: f - 14, fps, config: {damping: 14}});
  const t2 = spring({frame: f - 24, fps, config: {damping: 14}});
  const t3 = interpolate(f, [40, 56], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const out = interpolate(f, [SHORT_END_FRAMES - 10, SHORT_END_FRAMES], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{background: '#000', opacity: out}}>
      <Img src={staticFile('media/ep2/thumb_zigg.jpg')} style={{position: 'absolute', left: -1100, top: 0, height: 1920, width: 3413, objectFit: 'cover', filter: `blur(18px) brightness(0.35)`, transform: `scale(${1.05 + f / 3000})`, opacity: inO}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, rgba(214,168,78,0.18) 0%, rgba(0,0,0,0) 55%)'}} />
      {/* loqo */}
      <div style={{position: 'absolute', left: 315, top: 130, width: 450, height: 450, transform: `scale(${logoS})`, clipPath: 'ellipse(47.6% 49.4% at 48.6% 49.9%)'}}>
        <OffthreadVideo src={staticFile('brand/logo3d.mp4')} muted style={{width: 450, height: 450}} />
      </div>
      {/* yazılar */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', opacity: t1, transform: `translateY(${(1 - t1) * 40}px)`}}>
        <div style={{fontFamily: O, fontWeight: 700, fontSize: 112, color: '#fff', lineHeight: 1.05, textShadow: '0 6px 30px #000'}}>TAM VİDEO</div>
        <div style={{display: 'inline-block', marginTop: 14, background: '#e3261c', padding: '6px 34px', fontFamily: O, fontWeight: 700, fontSize: 72, color: '#fff', transform: 'rotate(-1.5deg)'}}>YOUTUBE KANALIMDA</div>
      </div>
      <div style={{position: 'absolute', left: 80, right: 80, top: 905, textAlign: 'center', opacity: t2, fontFamily: SERIF, fontWeight: 700, fontSize: 56, lineHeight: 1.2, color: '#f0d9a0', textShadow: '0 4px 20px #000'}}>
        Peyğəmbərlərin gizli tarixi davam edir...
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center', opacity: t3, fontFamily: O, fontWeight: 700, fontSize: 44, letterSpacing: 3, color: '#efe6d2'}}>
        NÖVBƏTİ SİRRİ QAÇIRMAMAQ ÜÇÜN
      </div>
      <Btn at={56} icon={<Like />} label="BƏYƏN" color="#1e88e5" y={1080} />
      <Btn at={86} icon={<Comment />} label="ŞƏRH YAZ" color="#2e9e5b" y={1250} />
      <Btn at={116} icon={<Bell />} label="ABUNƏ OL" color="#e3261c" y={1420} />
    </AbsoluteFill>
  );
};
