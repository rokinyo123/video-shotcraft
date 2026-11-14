import React from 'react';
import {interpolate, useCurrentFrame, Easing} from 'remotion';
import {C, F} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Rəvayətçi cümləsi: söz-söz dumandan çıxır, sonda yumşaq sönür.
 * `from`/`to` kadr ilə verilir (Sequence daxilində yox, mütləq zamanla).
 */
export const NarrationLine: React.FC<{
  text: string;
  from: number;
  to: number;
  size?: number;
  y?: number; // ekranın hündürlüyünə görə faiz
  color?: string;
  italic?: boolean;
}> = ({text, from, to, size = 64, y = 78, color = C.ivory, italic = false}) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 9) return null;
  const words = text.split(' ');
  const out = interpolate(frame, [to, to + 8], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: '8%',
        right: '8%',
        top: `${y}%`,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontFamily: F.serif,
        fontWeight: 600,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: size,
        lineHeight: 1.25,
        color,
        opacity: out,
        textShadow: '0 4px 30px rgba(0,0,0,0.9)',
        letterSpacing: 0.5,
      }}
    >
      {words.map((w, i) => {
        const start = from + i * 4;
        const p = interpolate(frame, [start, start + 14], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              filter: `blur(${(1 - p) * 10}px)`,
              transform: `translateY(${(1 - p) * 14}px)`,
              marginRight: '0.28em',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Ekranın aşağı-sol küncündə mənbə nişanı — hər fakt üçün. */
export const SourceTag: React.FC<{label: string; from: number; to: number; weak?: boolean}> = ({
  label,
  from,
  to,
  weak = false,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, from + 12, to, to + 12], [0, 1, 1, 0], clamp);
  if (p <= 0) return null;
  const accent = weak ? C.ember : C.gold;
  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        bottom: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        opacity: p,
        transform: `translateX(${(1 - p) * -24}px)`,
        fontFamily: F.sans,
        fontSize: 24,
        letterSpacing: 2,
        color: C.ivory,
        textTransform: 'uppercase',
      }}
    >
      <div style={{width: 4, height: 34, background: accent}} />
      <div>
        <div style={{fontSize: 15, color: accent, letterSpacing: 4, marginBottom: 4}}>
          {weak ? 'Rəvayət · zəif' : 'Mənbə'}
        </div>
        {label}
      </div>
    </div>
  );
};
