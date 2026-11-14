import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Uzanmış, ruhsuz gil bədənin siluəti (üz və detallar qəsdən yoxdur).
const BODY =
  // çiyin → sinə → qarın → omba → dizlər (bir az qalxıq) → baldır → ayaq
  'M 222 206 C 236 182, 262 172, 300 170 C 350 166, 410 164, 455 176 C 500 188, 540 194, 585 192 ' +
  'C 630 190, 665 184, 705 190 C 760 198, 815 180, 870 172 C 900 168, 925 176, 950 192 ' +
  'C 990 214, 1040 218, 1080 216 C 1098 206, 1112 192, 1124 196 C 1134 212, 1132 236, 1112 242 ' +
  'L 240 242 C 222 240, 214 226, 222 206 Z';
// Bədən boyunca uzanan qol (yalnız işıq-kölgə xətti)
const ARM = 'M 300 196 C 380 204, 470 214, 560 218 C 600 220, 630 222, 650 220';

const CX = 640;
const CY = 212;
const RX = 540;
const RY = 78;

type Props = {
  reveal: number; // 0..1 bədənin görünməsi
  orbitFrom: number; // kölgənin dövrəyə başladığı kadr
  orbitTo: number;
  rimLight?: number; // 0..1
};

/** Gil bədən + ətrafında dövrə vuran kölgə (İblisin "dolanması" — simvolik, abstrakt). */
export const ClayFigure: React.FC<Props> = ({reveal, orbitFrom, orbitTo, rimLight = 1}) => {
  const frame = useCurrentFrame();

  const orbitAlpha = interpolate(frame, [orbitFrom, orbitFrom + 30, orbitTo - 15, orbitTo], [0, 1, 1, 0], clamp);
  const angleAt = (f: number) => ((f - orbitFrom) / 30) * 0.75 - Math.PI / 2;

  const trail = (front: boolean) => {
    if (orbitAlpha <= 0) return null;
    const pts = [];
    for (let k = 0; k < 34; k++) {
      const f = frame - k * 0.6;
      if (f < orbitFrom) break;
      const a = angleAt(f);
      const depth = Math.sin(a); // >0 = önə yaxın
      if (front !== depth > 0) continue;
      const x = CX + RX * Math.cos(a);
      const y = CY + RY * Math.sin(a);
      const scale = 0.75 + 0.35 * (depth + 1) / 2;
      const fade = (1 - k / 34) * orbitAlpha * (front ? 1 : 0.6);
      const wob = Math.sin((f + k * 7) / 6) * 8;
      pts.push(
        <g key={k} opacity={fade}>
          {k === 0 && (
            <ellipse cx={x + wob} cy={y - 70 * scale} rx={95 * scale} ry={150 * scale} fill="url(#aura)" />
          )}
          <ellipse cx={x + wob} cy={y - 70 * scale} rx={(58 - k) * scale} ry={(105 - k * 2) * scale} fill="#050101" />
          {k < 2 && <circle cx={x} cy={y - 95 * scale} r={6 * scale} fill={C.ember} filter="url(#glow)" />}
        </g>,
      );
    }
    return <g filter="url(#smokeBlur)">{pts}</g>;
  };

  return (
    <svg viewBox="0 0 1280 400" style={{position: 'absolute', left: 0, top: '30%', width: '100%', overflow: 'visible'}}>
      <defs>
        <linearGradient id="clay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d5638" />
          <stop offset="0.35" stopColor="#4a3020" />
          <stop offset="1" stopColor="#120b07" />
        </linearGradient>
        <radialGradient id="smoke">
          <stop offset="0" stopColor="#000" stopOpacity="0.98" />
          <stop offset="0.5" stopColor="#120403" stopOpacity="0.85" />
          <stop offset="0.75" stopColor={C.emberDeep} stopOpacity="0.45" />
          <stop offset="1" stopColor={C.ember} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="aura">
          <stop offset="0.4" stopColor={C.ember} stopOpacity="0.55" />
          <stop offset="1" stopColor={C.ember} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mist">
          <stop offset="0" stopColor={C.goldSoft} stopOpacity="0.18" />
          <stop offset="1" stopColor={C.goldSoft} stopOpacity="0" />
        </radialGradient>
        <filter id="tex">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
        <filter id="soft">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="smokeBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* Yer üzərindəki nur ləkəsi */}
      <ellipse cx={CX} cy={250} rx={620} ry={70} fill="url(#mist)" opacity={reveal} />

      {trail(false)}

      <g opacity={reveal} filter="url(#tex)">
        <ellipse cx={168} cy={200} rx={44} ry={40} fill="url(#clay)" transform="rotate(-12 168 200)" />
        <path d="M 196 214 C 205 200, 222 196, 236 200 L 236 236 L 200 232 Z" fill="url(#clay)" />
        <path d={BODY} fill="url(#clay)" />
        <path d={ARM} fill="none" stroke="#0d0805" strokeWidth={4} opacity={0.3} />
      </g>
      {/* Yuxarıdan düşən kənar işığı */}
      <g opacity={reveal * rimLight * 0.9} filter="url(#soft)">
        <path d={BODY} fill="none" stroke={C.goldSoft} strokeWidth={2.5} transform="translate(0,-2)" opacity={0.7} />
        <ellipse cx={168} cy={197} rx={44} ry={40} fill="none" stroke={C.goldSoft} strokeWidth={2.5} opacity={0.7} transform="rotate(-12 168 197)" />
      </g>
      {/* Bədənin altındakı kölgə */}
      <ellipse cx={CX} cy={246} rx={520} ry={10} fill="#000" opacity={0.7 * reveal} filter="url(#soft)" />

      {trail(true)}
    </svg>
  );
};
