import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import TL from './timeline.json';
import {AyahCard, Background, BgSpec, BigText, Grain, Leak, Letterbox, Particles, Pulse, SourceTag, Stamp, useT, Vignette} from '../ep1/layers';
import {Calligraphy, Chips, Columns, Comment, Counter, Dialog, NextEp, Quote, Strike, Subscribe} from '../ep1/layers2';
import {AyahChecks, Calendar, Chapter, Constellation, FiveNames, Flash, FTree, Glitch, Heavens, Ilk, TLine} from './parts';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
type Shot = {id: string; a: number; b: number; bg: BgSpec & {blur?: number}; tr: number};
type Layer = {type: string; a: number; b: number; [k: string]: any};
export const EP2_T0 = TL.T0 as number;
export const EP2_END = TL.END as number;
const SHOTS = [...(TL.shots as Shot[])].sort((x, y) => x.a - y.a);
const LAYERS = TL.layers as Layer[];

const renderLayer = (l: Layer, t: number, i: number) => {
  const p = {t, a: l.a, b: l.b};
  switch (l.type) {
    case 'chapter': return <Chapter key={i} {...p} n={l.n} title={l.title} />;
    case 'tline': return <TLine key={i} {...p} at0={l.at0} at1={l.at1} dimA={l.dimA} dimB={l.dimB} />;
    case 'ftree': return <FTree key={i} {...p} at0={l.at0} step={l.step} hiAt={l.hiAt} />;
    case 'calendar': return <Calendar key={i} {...p} at={l.at} dur={l.dur} />;
    case 'constellation': return <Constellation key={i} {...p} />;
    case 'ilk': return <Ilk key={i} {...p} items={l.items} />;
    case 'heavens': return <Heavens key={i} {...p} steps={l.steps} names={l.names} mid={l.mid} all_at={l.all_at} />;
    case 'ayahchecks': return <AyahChecks key={i} {...p} items={l.items} />;
    case 'fivenames': return <FiveNames key={i} {...p} items={l.items} />;
    case 'flash': return <Flash key={i} {...p} />;
    case 'glitch': return <Glitch key={i} {...p} />;
    case 'pulse': return <Pulse key={i} {...p} />;
    case 'big': return <BigText key={i} {...p} text={l.text} sub={l.sub} color={l.color} size={l.size} />;
    case 'stamp': return <Stamp key={i} {...p} top={l.top} main={l.main} color={l.color} />;
    case 'ayah': return <AyahCard key={i} {...p} ar={l.ar} az={l.az} ref_={l.ref_} />;
    case 'quote': return <Quote key={i} {...p} text={l.text} by={l.by} color={l.color} side={l.side} size={l.size} />;
    case 'columns': return <Columns key={i} {...p} title={l.title} items={l.items} focus={l.focus} />;
    case 'chips': return <Chips key={i} {...p} items={l.items} y={l.y} size={l.size} />;
    case 'callig': return <Calligraphy key={i} {...p} ar={l.ar} sub={l.sub} y={l.y} />;
    case 'counter': return <Counter key={i} {...p} from={l.from} to={l.to} at={l.at} dur={l.dur} label={l.label} suffix={l.suffix} y={l.y} />;
    case 'strike': return <Strike key={i} {...p} words={l.words} strikeAt={l.strikeAt} repl={l.repl} replAt={l.replAt} />;
    case 'comment': return <Comment key={i} {...p} text={l.text} />;
    case 'subscribe': return <Subscribe key={i} {...p} click={l.click} />;
    case 'dialog': return <Dialog key={i} {...p} who={l.who} text={l.text} side={l.side} c={l.c} />;
    case 'next': return <NextEp key={i} {...p} name={l.name} sub={l.sub} />;
    case 'source': return <SourceTag key={i} {...p} label={l.label} weak={l.weak} icon={l.icon} />;
    case 'leak': return <Leak key={i} t={t} a={l.a} />;
    default: return null;
  }
};

export const Main: React.FC<{from: number}> = ({from}) => {
  const t = useT(from);
  const shots = SHOTS.filter((s) => t >= s.a - 0.6 && t <= s.b + 0.6);
  const fr = LAYERS.filter((l) => l.type === 'freeze' && t >= l.a - 0.2 && t <= l.b + 0.3);
  const freeze = fr.reduce((m, l) => Math.max(m, interpolate(t, [l.a, l.a + 0.12, l.b, l.b + 0.3], [0, 1, 1, 0], clamp)), 0);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{filter: freeze > 0 ? `grayscale(${0.8 * freeze}) brightness(${1 - 0.4 * freeze})` : undefined}}>
        {shots.map((s) => {
          const fin = s.tr > 0 ? interpolate(t, [s.a - s.tr / 2, s.a + s.tr / 2], [0, 1], clamp) : t >= s.a ? 1 : 0;
          const next = SHOTS.find((n) => n.a >= s.b - 0.05 && n.a <= s.b + 0.05 && n.id !== s.id);
          const endT = !next || next.tr === 0 ? s.b : s.b + next.tr / 2;
          const o = fin * (t < endT ? 1 : 0);
          if (o <= 0) return null;
          return (
            <AbsoluteFill key={s.id} style={{opacity: o}}>
              <Background bg={s.bg} t={t} a={s.a} b={s.b + 0.6} from={from} />
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
      <Particles t={t} kind="dust" n={50} />
      {LAYERS.filter((l) => l.type !== 'freeze' && t >= l.a - 0.1 && t <= l.b + 0.1).map((l, i) => renderLayer(l, t, i))}
      <Vignette />
      <Grain t={t} />
      <Letterbox />
      <AbsoluteFill style={{background: '#000', opacity: interpolate(t, [EP2_END - 1.2, EP2_END], [0, 1], clamp)}} />
    </AbsoluteFill>
  );
};
