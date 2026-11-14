import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import TL from './timeline.json';
import {
  AyahCard,
  Background,
  BgSpec,
  BigText,
  Corner,
  Grain,
  Letterbox,
  Particles,
  Pulse,
  QCard,
  SeriesTitle,
  SourceTag,
  Stamp,
  Subtitle,
  useT,
  Vignette,
} from './layers';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type Shot = {id: string; a: number; b: number; bg: BgSpec; tr: number};
type Layer = {type: string; a: number; b: number; [k: string]: any};

const renderLayer = (l: Layer, t: number, i: number) => {
  const p = {t, a: l.a, b: l.b};
  switch (l.type) {
    case 'particles':
      return t >= l.a && t <= l.b ? <Particles key={i} t={t} kind={l.kind} n={l.n} alpha={(l.alpha ?? 1) * interpolate(t, [l.a, l.a + 1, l.b - 1, l.b], [0, 1, 1, 0], clamp)} /> : null;
    case 'pulse':
      return <Pulse key={i} {...p} />;
    case 'big':
      return <BigText key={i} {...p} text={l.text} sub={l.sub} color={l.color} size={l.size} />;
    case 'stamp':
      return <Stamp key={i} {...p} top={l.top} main={l.main} color={l.color} />;
    case 'ayah':
      return <AyahCard key={i} {...p} ar={l.ar} az={l.az} ref_={l.ref_} />;
    case 'qcard':
      return <QCard key={i} {...p} n={l.n} q={l.q} sub={l.sub} subAt={l.subAt} img={l.img} />;
    case 'title':
      return <SeriesTitle key={i} {...p} />;
    case 'source':
      return <SourceTag key={i} {...p} label={l.label} weak={l.weak} />;
    default:
      return null;
  }
};

/** Qlobal zaman xəttinin [from, to] aralığını göstərir. */
export const Episode: React.FC<{from: number; to: number}> = ({from}) => {
  const t = useT(from);
  const shots = (TL.shots as Shot[]).filter((s) => t >= s.a - 0.6 && t <= s.b + 0.6);
  const titleOn = (TL.layers as Layer[]).some((l) => l.type === 'title' && t >= l.a && t <= l.b);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {shots.map((s) => {
        const fin = s.tr > 0 ? interpolate(t, [s.a - s.tr / 2, s.a + s.tr / 2], [0, 1], clamp) : t >= s.a ? 1 : 0;
        const fout = interpolate(t, [s.b - 0.01, s.b + 0.5], [1, 0], clamp);
        const next = (TL.shots as Shot[]).find((n) => n.a >= s.b - 0.05 && n.a <= s.b + 0.05 && n.id !== s.id);
        const hardNext = next && next.tr === 0;
        const o = fin * (hardNext ? (t < s.b ? 1 : 0) : fout);
        if (o <= 0) return null;
        return (
          <AbsoluteFill key={s.id} style={{opacity: o}}>
            <Background bg={s.bg} t={t} a={s.a} b={s.b + 0.6} />
          </AbsoluteFill>
        );
      })}
      {(TL.layers as Layer[]).filter((l) => t >= l.a - 0.1 && t <= l.b + 0.1).map((l, i) => renderLayer(l, t, i))}
      <Vignette />
      <Grain t={t} />
      <Letterbox />
      {(TL.subs as {a: number; b: number; text: string}[])
        .filter((s) => t >= s.a && t <= s.b)
        .map((s, i) => (
          <Subtitle key={i} text={s.text} t={t} a={s.a} b={s.b} />
        ))}
      <Corner alpha={titleOn ? 0 : interpolate(t, [52, 54], [0, 1], clamp)} />
      <AbsoluteFill style={{background: '#000', opacity: interpolate(t, [0, 1.2], [1, 0], clamp)}} />
    </AbsoluteFill>
  );
};
