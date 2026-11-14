import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, F} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Girişdəki sual kartı: nömrə + böyük sual + kiçik alt sətir. */
export const QuestionCard: React.FC<{
  n: number;
  question: string;
  sub?: string;
  from: number;
  to: number;
}> = ({n, question, sub, from, to}) => {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [from, from + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const outP = interpolate(frame, [to - 10, to], [1, 0], clamp);
  if (frame < from || frame > to) return null;
  const zoom = interpolate(frame, [from, to], [1.04, 1], clamp);
  const subP = interpolate(frame, [from + 30, from + 48], [0, 1], clamp);
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        opacity: inP * outP,
        transform: `scale(${zoom})`,
      }}
    >
      <div style={{width: '74%', textAlign: 'center'}}>
        <div
          style={{
            fontFamily: F.sans,
            color: C.gold,
            fontSize: 22,
            letterSpacing: 10,
            marginBottom: 28,
          }}
        >
          SUAL {String(n).padStart(2, '0')}
        </div>
        <div
          style={{
            fontFamily: F.serif,
            fontWeight: 700,
            color: C.ivory,
            fontSize: 84,
            lineHeight: 1.12,
            filter: `blur(${(1 - inP) * 8}px)`,
            textShadow: '0 6px 40px rgba(0,0,0,0.9)',
          }}
        >
          {question}
        </div>
        {sub && (
          <div
            style={{
              marginTop: 30,
              fontFamily: F.serif,
              fontStyle: 'italic',
              fontWeight: 500,
              color: C.dim,
              fontSize: 40,
              opacity: subP,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Seriyanın sabit başlıq animasiyası — hər bölümdə eyni işlədilir. */
export const SeriesTitle: React.FC<{from: number; episode: string; name: string}> = ({from, episode, name}) => {
  const frame = useCurrentFrame() - from;
  if (frame < 0) return null;
  const line = interpolate(frame, [0, 24], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const title = interpolate(frame, [6, 36], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const spacing = interpolate(frame, [6, 120], [38, 18], {...clamp, easing: Easing.out(Easing.quad)});
  const ep = interpolate(frame, [40, 60], [0, 1], clamp);
  const flash = interpolate(frame, [0, 3, 20], [0, 0.55, 0], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{background: C.goldSoft, opacity: flash, mixBlendMode: 'screen'}} />
      <div style={{textAlign: 'center'}}>
        <div
          style={{
            fontFamily: F.sans,
            fontSize: 26,
            letterSpacing: spacing / 2,
            color: C.gold,
            opacity: title,
            marginBottom: 18,
          }}
        >
          PEYĞƏMBƏRLƏRİN
        </div>
        <div
          style={{
            fontFamily: F.serif,
            fontWeight: 700,
            fontSize: 132,
            letterSpacing: spacing,
            color: C.ivory,
            opacity: title,
            filter: `blur(${(1 - title) * 14}px)`,
            textShadow: `0 0 60px rgba(214,168,78,${0.35 * title})`,
            whiteSpace: 'nowrap',
          }}
        >
          GİZLİ TARİXİ
        </div>
        <div
          style={{
            margin: '26px auto',
            height: 2,
            width: 760 * line,
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          }}
        />
        <div style={{opacity: ep, fontFamily: F.serif, fontSize: 46, color: C.goldSoft, fontStyle: 'italic'}}>
          {episode} · {name}
        </div>
      </div>
    </AbsoluteFill>
  );
};
