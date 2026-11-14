import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Arc, Globe, Label, Pin, Stars, toVec3} from './Globe';
import {C, F} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

export type GlobeProps = {
  dur: number;
  keys: [number, number, number, number][]; // [saniyə, enlik, uzunluq, məsafə]
  pins: {lat: number; lon: number; color: string; at: number; s?: number; title?: string; sub?: string; left?: boolean; lift?: number; dlat?: number; dlon?: number; size?: number}[];
  arcs?: {from: [number, number]; to: [number, number]; a: number; b: number; color: string; h?: number}[];
  highlight?: Record<string, string>;
  title?: {text: string; a: number; b: number};
  stamp?: {text: string; at: number};
};

const camAt = (keys: GlobeProps['keys'], t: number) => {
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1][0]) i++;
  const [t0, la0, lo0, d0] = keys[i];
  const [t1, la1, lo1, d1] = keys[i + 1];
  const p = interpolate(t, [t0, t1], [0, 1], {...clamp, easing: ease});
  return {lat: la0 + (la1 - la0) * p, lon: lo0 + (lo1 - lo0) * p, dist: d0 + (d1 - d0) * p};
};

const Rig: React.FC<{keys: GlobeProps['keys']; t: number}> = ({keys, t}) => {
  const {camera} = useThree();
  const {lat, lon, dist} = camAt(keys, t);
  camera.position.copy(toVec3(lat - 9 * Math.min(1, 1.8 / dist), lon, dist));
  camera.lookAt(toVec3(lat, lon, 1));
  camera.updateProjectionMatrix();
  return null;
};

const useFonts = () => {
  const [h] = useState(() => delayRender('fonts', {timeoutInMilliseconds: 120000}));
  const [ok, setOk] = useState(false);
  useEffect(() => {
    Promise.all([document.fonts.load('600 76px "Cormorant Garamond"'), document.fonts.load('400 40px Inter')]).then(() => {
      setOk(true);
      continueRender(h);
    });
  }, [h]);
  return ok;
};

export const GlobeScene: React.FC<GlobeProps> = (p) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = frame / 30;
  const ok = useFonts();
  const pulse = (t * 0.8) % 1;
  const ls = camAt(p.keys, t).dist / 2.6;
  const fade = interpolate(t, [0, 0.6, p.dur - 0.6, p.dur], [0, 1, 1, 0], clamp);
  const st = p.stamp ? interpolate(t, [p.stamp.at, p.stamp.at + 0.35], [0, 1], clamp) : 0;
  return (
    <AbsoluteFill style={{background: C.bg, opacity: fade}}>
      {ok && (
        <ThreeCanvas width={width} height={height} camera={{fov: 32, near: 0.01, far: 200}} gl={{antialias: true}}>
          <Rig keys={p.keys} t={t} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[-3, 2, 4]} intensity={1.6} color={C.goldSoft} />
          <Stars />
          <Globe highlight={p.highlight ?? {}} />
          {p.pins.map((q, i) => {
            const k = interpolate(t, [q.at, q.at + 1.1], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
            return (
              <React.Fragment key={i}>
                <Pin lat={q.lat} lon={q.lon} color={q.color} t={k} pulse={(pulse + i * 0.17) % 1} s={q.s} />
                {q.title && (
                  <Label
                    lat={q.lat + (q.dlat ?? 0)}
                    lon={q.lon + (q.dlon ?? 0.8)}
                    lift={q.lift ?? 0.07}
                    title={q.title}
                    sub={q.sub}
                    color={q.color}
                    opacity={k}
                    scale={(q.size ?? 0.1) * ls}
                    left={q.left}
                  />
                )}
              </React.Fragment>
            );
          })}
          {(p.arcs ?? []).map((a, i) => (
            <Arc key={i} from={a.from} to={a.to} progress={interpolate(t, [a.a, a.b], [0, 1], {...clamp, easing: ease})} color={a.color} height={a.h ?? 0.2} />
          ))}
        </ThreeCanvas>
      )}
      {p.title && (
        <div
          style={{
            position: 'absolute',
            top: 128,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: F.serif,
            fontWeight: 600,
            fontSize: 58,
            color: C.ivory,
            opacity: interpolate(t, [p.title.a, p.title.a + 0.8, p.title.b - 0.6, p.title.b], [0, 1, 1, 0], clamp),
            textShadow: '0 4px 30px #000',
          }}
        >
          {p.title.text}
        </div>
      )}
      {p.stamp && (
        <div
          style={{
            position: 'absolute',
            right: 140,
            top: 170,
            transform: `rotate(-8deg) scale(${2.2 - 1.2 * st})`,
            opacity: st,
            border: `5px solid ${C.ember}`,
            color: C.ember,
            padding: '14px 30px',
            fontFamily: F.sans,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: 6,
            background: 'rgba(7,6,10,0.6)',
          }}
        >
          {p.stamp.text}
        </div>
      )}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 85% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)'}} />
    </AbsoluteFill>
  );
};
