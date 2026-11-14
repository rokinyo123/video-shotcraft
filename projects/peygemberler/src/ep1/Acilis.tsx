import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Atmosphere} from '../components/Atmosphere';
import {ClayFigure} from '../components/ClayFigure';
import {NarrationLine, SourceTag} from '../components/Text';
import {QuestionCard, SeriesTitle} from '../components/Cards';
import {C, s} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Zaman xətti (saniyə). Səsləndirmə yazılandan sonra bu rəqəmlər real səsə görə düzəldiləcək.
const T = {
  bodyIn: 2,
  l1: [3, 6.2],
  l2: [6.7, 10],
  orbit: [9.5, 21],
  l3: [10.5, 13.8],
  l4: [14.3, 16.4],
  l5: [16.9, 20.4],
  cut: 21,
  l6: [21.8, 24.4],
  l7: [24.9, 27.6],
  q1: [28, 34],
  q2: [34, 39],
  q3: [39, 45],
  title: 45.5,
  end: 55,
};

export const EP1_ACILIS_FRAMES = s(T.end);

export const Ep1Acilis: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  // Bədən səhnəsi kəsilənə qədər görünür
  const bodyReveal =
    interpolate(t, [T.bodyIn, T.bodyIn + 4], [0, 1], clamp) * (t < T.cut ? 1 : 0);
  const camZoom = interpolate(t, [0, T.cut], [1.0, 1.12], clamp);
  const sceneLight = t < T.cut ? 0.7 : t < T.title ? 0.25 : 0.9;

  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill style={{transform: `scale(${camZoom})`}}>
        <Atmosphere light={sceneLight} dust={t < T.cut ? 80 : 40} />
        {t < T.cut && <ClayFigure reveal={bodyReveal} orbitFrom={s(T.orbit[0])} orbitTo={s(T.orbit[1])} />}
      </AbsoluteFill>

      {/* Rəvayət mətni (altyazı funksiyasını da daşıyır) */}
      <NarrationLine text="Hələ insan nəfəs almamışdı." from={s(T.l1[0])} to={s(T.l1[1])} />
      <NarrationLine text="Hələ heç bir göz açılmamışdı." from={s(T.l2[0])} to={s(T.l2[1])} />
      <NarrationLine text="Amma biri artıq onun ətrafında fırlanırdı…" from={s(T.l3[0])} to={s(T.l3[1])} />
      <NarrationLine text="diqqətlə baxırdı…" from={s(T.l4[0])} to={s(T.l4[1])} italic />
      <NarrationLine
        text="və onun zəif nöqtəsini tapmışdı."
        from={s(T.l5[0])}
        to={s(T.l5[1])}
        color={C.goldSoft}
      />

      <NarrationLine text="Bu səhnə nağıl deyil." from={s(T.l6[0])} to={s(T.l6[1])} y={50} size={88} />
      <NarrationLine text="Səhih Müslimdə nəql olunur." from={s(T.l7[0])} to={s(T.l7[1])} y={50} size={64} color={C.goldSoft} />
      <SourceTag label="Səhih Müslim, 2611" from={s(T.l6[0])} to={s(T.l7[1])} />

      <QuestionCard
        n={1}
        question="Adəm həqiqətən otuz metr boyunda idimi?"
        sub="…və İbn Həcər niyə izah edə bilmədiyini etiraf etdi?"
        from={s(T.q1[0])}
        to={s(T.q1[1])}
      />
      <QuestionCard
        n={2}
        question="Qadağan meyvə alma deyildisə, bəs nə idi?"
        from={s(T.q2[0])}
        to={s(T.q2[1])}
      />
      <QuestionCard
        n={3}
        question="Adəm Musaya hansı cümlə ilə qalib gəldi?"
        sub="Səhih Buxari · Səhih Müslim"
        from={s(T.q3[0])}
        to={s(T.q3[1])}
      />

      <SeriesTitle from={s(T.title)} episode="1-ci bölüm" name="Adəm" />

      {/* Sona doğru qaralma */}
      <AbsoluteFill
        style={{background: '#000', opacity: interpolate(t, [T.end - 1.2, T.end], [0, 1], clamp)}}
      />

      {/* --- SƏS --- */}
      <Sequence from={0} durationInFrames={s(T.cut)}>
        <Audio src={staticFile('audio/drone.wav')} volume={(f) => interpolate(f, [0, 90, s(T.cut) - 6, s(T.cut)], [0, 0.55, 0.6, 0], clamp)} />
      </Sequence>
      <Sequence from={s(T.orbit[0])} durationInFrames={s(T.cut - T.orbit[0])}>
        <Audio src={staticFile('audio/heartbeat.wav')} volume={(f) => interpolate(f, [0, 60], [0, 0.9], clamp)} />
      </Sequence>
      <Sequence from={s(T.l6[0])} durationInFrames={s(T.title - T.l6[0])}>
        <Audio src={staticFile('audio/drone.wav')} volume={0.28} />
      </Sequence>
      {[T.q1[0], T.q2[0], T.q3[0]].map((q) => (
        <Sequence key={q} from={s(q)} durationInFrames={s(1.4)}>
          <Audio src={staticFile('audio/whoosh.wav')} volume={0.5} />
        </Sequence>
      ))}
      {[T.q1[0], T.q2[0], T.q3[0]].map((q) => (
        <Sequence key={`h${q}`} from={s(q) + 4} durationInFrames={s(1.2)}>
          <Audio src={staticFile('audio/hit.wav')} volume={0.6} />
        </Sequence>
      ))}
      <Sequence from={s(T.title - 6)} durationInFrames={s(6)}>
        <Audio src={staticFile('audio/riser.wav')} volume={0.5} />
      </Sequence>
      <Sequence from={s(T.title)} durationInFrames={s(5)}>
        <Audio src={staticFile('audio/boom.wav')} volume={1} />
      </Sequence>
      <Sequence from={s(T.title)} durationInFrames={s(T.end - T.title)}>
        <Audio src={staticFile('audio/drone.wav')} volume={(f) => interpolate(f, [0, 30, s(T.end - T.title) - 30, s(T.end - T.title)], [0, 0.5, 0.5, 0], clamp)} />
      </Sequence>
    </AbsoluteFill>
  );
};
