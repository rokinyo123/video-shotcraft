import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {Arc, Globe, ISO, Label, Pin, Stars, toVec3} from '../three/Globe';
import {Grain} from '../components/Atmosphere';
import {SourceTag} from '../components/Text';
import {C, F, s} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

const SRI_LANKA: [number, number] = [7.87, 80.77];
const JEDDAH: [number, number] = [21.54, 39.17];
const ARAFAT: [number, number] = [21.355, 39.984];

// Kamera açar kadrları: [saniyə, enlik, uzunluq, məsafə]
const KEYS: [number, number, number, number][] = [
  [0, 12, 95, 4.4],
  [3.5, 10, 86, 2.6],
  [6.5, 8, 81, 1.75], // Şri-Lanka
  [9.0, 8, 80, 1.7],
  [12.0, 21, 40, 1.62], // Ciddə + Ərəfat
  [14.5, 21, 40.5, 1.6],
  [17.5, 16, 60, 2.4], // hər iki yay görünür
  [21.0, 17, 58, 2.75],
];

const camAt = (t: number) => {
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
  const [t0, la0, lo0, d0] = KEYS[i];
  const [t1, la1, lo1, d1] = KEYS[i + 1];
  const p = interpolate(t, [t0, t1], [0, 1], {...clamp, easing: ease});
  return {lat: la0 + (la1 - la0) * p, lon: lo0 + (lo1 - lo0) * p, dist: d0 + (d1 - d0) * p};
};

const CameraRig: React.FC<{t: number}> = ({t}) => {
  const {camera} = useThree();
  const {lat, lon, dist} = camAt(t);
  const pos = toVec3(lat - 9 * Math.min(1, 1.8 / dist), lon, dist); // bir az cənubdan, maili baxış
  camera.position.copy(pos);
  camera.lookAt(toVec3(lat, lon, 1));
  camera.updateProjectionMatrix();
  return null;
};

const useFonts = () => {
  const [handle] = useState(() => delayRender('fonts'));
  const [ok, setOk] = useState(false);
  useEffect(() => {
    Promise.all([
      document.fonts.load('600 76px "Cormorant Garamond"'),
      document.fonts.load('400 40px Inter'),
    ]).then(() => {
      setOk(true);
      continueRender(handle);
    });
  }, [handle]);
  return ok;
};

export const A18_FRAMES = s(22);

const labelScale = (t: number) => camAt(t).dist / 2.6;

export const A18Enis: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const t = frame / 30;
  const fontsOk = useFonts();

  const pinSL = interpolate(t, [5.2, 6.4], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  const pinJD = interpolate(t, [10.8, 12.0], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  const pinAR = interpolate(t, [16.2, 17.0], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  const pulse = (t * 0.8) % 1;
  const arc1 = interpolate(t, [13.0, 17.0], [0, 1], {...clamp, easing: ease});
  const arc2 = interpolate(t, [14.5, 16.4], [0, 1], {...clamp, easing: ease});
  const stamp = interpolate(t, [18.6, 19.0], [0, 1], clamp);
  const fadeIn = interpolate(t, [0, 1], [0, 1], clamp);
  const fadeOut = interpolate(t, [21.3, 22], [1, 0], clamp);

  return (
    <AbsoluteFill style={{background: C.bg, opacity: fadeIn * fadeOut}}>
      {fontsOk && (
        <ThreeCanvas width={width} height={height} camera={{fov: 32, near: 0.01, far: 200}} gl={{antialias: true}}>
          <CameraRig t={t} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[-3, 2, 4]} intensity={1.6} color={C.goldSoft} />
          <Stars />
          <Globe highlight={{[ISO.sriLanka]: '#1f7a46', [ISO.saudi]: '#3a2c1a'}} />
          <Pin lat={SRI_LANKA[0]} lon={SRI_LANKA[1]} color="#3ddc84" t={pinSL} pulse={pulse} />
          <Pin lat={JEDDAH[0]} lon={JEDDAH[1]} color={C.gold} t={pinJD} pulse={pulse} />
          <Pin lat={ARAFAT[0]} lon={ARAFAT[1]} color="#ffffff" t={pinAR} pulse={pulse} />
          <Arc from={SRI_LANKA} to={ARAFAT} progress={arc1} color="#3ddc84" height={0.22} />
          <Arc from={JEDDAH} to={ARAFAT} progress={arc2} color={C.gold} height={0.03} />
          <Label lat={SRI_LANKA[0]} lon={SRI_LANKA[1] + 0.8} lift={0.07} title="ADƏM" sub="Şri-Lanka (Sərəndib)" color="#3ddc84" opacity={pinSL} scale={0.1 * labelScale(t)} />
          <Label lat={JEDDAH[0]} lon={JEDDAH[1] - 0.6} lift={0.06} title="HƏVVA" sub="Ciddə" color={C.gold} opacity={pinJD} scale={0.085 * labelScale(t)} left />
          <Label lat={ARAFAT[0] - 0.4} lon={ARAFAT[1] + 0.6} lift={0.03} title="ƏRƏFAT" sub="Qovuşma yeri" color="#ffffff" opacity={pinAR} scale={0.085 * labelScale(t)} />
        </ThreeCanvas>
      )}

      {/* Başlıq */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 80,
          fontFamily: F.serif,
          fontWeight: 600,
          fontSize: 54,
          color: C.ivory,
          opacity: interpolate(t, [0.6, 1.6, 4.5, 5.2], [0, 1, 1, 0], clamp),
          textShadow: '0 4px 30px #000',
        }}
      >
        Adəm və Həvva harada endilər?
      </div>

      {/* "Zəif rəvayət" möhürü */}
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 110,
          transform: `rotate(-8deg) scale(${2.2 - 1.2 * stamp})`,
          opacity: stamp,
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
        ZƏİF RƏVAYƏT
      </div>
      <SourceTag label="Təbəri · İbn Kəsir — isnadı zəif" from={s(18.6)} to={s(21.4)} weak />

      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse 90% 85% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)'}}
      />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
