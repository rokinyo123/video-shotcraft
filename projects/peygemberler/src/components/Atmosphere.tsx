import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

/** Qaranlıq fon + yuxarıdan zəif nur + vinyet + toz zərrəcikləri + film dənəsi. */
export const Atmosphere: React.FC<{
  light?: number; // 0..1 yuxarıdan enən nurun gücü
  dust?: number; // toz sayı
  tint?: string;
}> = ({light = 0.6, dust = 70, tint = C.bgWarm}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${tint} 0%, ${C.bg} 70%)`,
        }}
      />
      {/* Yuxarıdan enən nur sütunu */}
      <AbsoluteFill
        style={{
          opacity: light,
          background:
            'linear-gradient(180deg, rgba(240,217,160,0.16) 0%, rgba(240,217,160,0.05) 35%, rgba(0,0,0,0) 70%)',
          clipPath: 'polygon(38% 0, 62% 0, 78% 100%, 22% 100%)',
          filter: 'blur(30px)',
        }}
      />
      {/* Toz */}
      <svg width={width} height={height} style={{position: 'absolute'}}>
        {new Array(dust).fill(0).map((_, i) => {
          const x0 = random(`dx${i}`) * width;
          const y0 = random(`dy${i}`) * height;
          const sp = 0.15 + random(`ds${i}`) * 0.5;
          const r = 0.6 + random(`dr${i}`) * 2.2;
          const x = (x0 + Math.sin((frame + i * 40) / 90) * 30 + frame * sp * 0.3) % width;
          const y = (y0 - frame * sp + height) % height;
          const tw = 0.25 + 0.75 * Math.abs(Math.sin(frame / 40 + i));
          return <circle key={i} cx={x} cy={y} r={r} fill={C.goldSoft} opacity={0.18 * tw} />;
        })}
      </svg>
      {/* Vinyet */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.85) 100%)',
        }}
      />
      <Grain />
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const frame = useCurrentFrame();
  const seed = frame % 8;
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
