import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/amiri/400.css';
import React from 'react';
import {Composition} from 'remotion';
import {Ep1Acilis, EP1_ACILIS_FRAMES} from './ep1/Acilis';
import {A18Enis, A18_FRAMES} from './ep1/A18Enis';
import {Episode} from './ep1/Episode';
import {Thumbnail} from './Thumbnail';
import {Thumbnail2} from './Thumbnail2';
import {Thumbnail3} from './Thumbnail3';
import {ThumbVertical} from './ThumbVertical';
import {Trailer, TRAILER_DUR} from './ep2/Trailer';
import {Main as Ep2Main, EP2_T0, EP2_END} from './ep2/Main';
import {GlobeScene} from './three/GlobeScene';
import {GLOBES} from './three/globes';
import {FPS} from './theme';
import {LogoSpin, LOGO_FRAMES} from './brand/LogoSpin';
import {ShortEnd, SHORT_END_FRAMES} from './brand/ShortEnd';
import {ShortTrailer, SHORT_FRAMES} from './brand/ShortTrailer';
import {Ep3Intro, EP3_INTRO_DUR} from './ep3/Intro';
import {Alive, ALIVE_FRAMES} from './ep3/Alive';
import {Bolum2, B2_DUR} from './ep3/Bolum2';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Ep1Acilis"
      component={Ep1Acilis}
      durationInFrames={EP1_ACILIS_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition id="A18Enis" component={A18Enis} durationInFrames={A18_FRAMES} fps={FPS} width={1920} height={1080} />
    <Composition id="Ep1Min1" component={Episode} durationInFrames={Math.round(61.6 * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{from: 0, to: 61.6}} />
    {[
      ['Ep1Part1', 0, 312.45],
      ['Ep1Part2', 312.45, 710.01],
      ['Ep1Part3', 710.01, 1015.0],
    ].map(([id, a, b]) => (
      <Composition key={id as string} id={id as string} component={Episode} durationInFrames={Math.round(((b as number) - (a as number)) * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{from: a as number, to: b as number}} />
    ))}
    {Object.entries(GLOBES).map(([id, g]) => (
      <Composition key={id} id={id} component={GlobeScene} durationInFrames={Math.round(g.dur * FPS)} fps={FPS} width={1920} height={1080} defaultProps={g} />
    ))}
        <Composition id="ThumbA" component={Thumbnail} durationInFrames={1} fps={30} width={1280} height={720} defaultProps={{img: 'media/ep1/K16.jpg', hook: '30 METR BOYU?', hook2: 'GİZLİ QALAN SİRLƏR'}} />
      <Composition id="ThumbB" component={Thumbnail} durationInFrames={1} fps={30} width={1280} height={720} defaultProps={{img: 'media/ep1/K13_last.jpg', hook: 'İBLİS NƏ GÖRDÜ?', hook2: 'İÇİ BOŞ BƏDƏN'}} />
      <Composition id="ThumbC" component={Thumbnail2} durationInFrames={1} fps={30} width={1280} height={720} />
      <Composition id="ThumbD" component={Thumbnail3} durationInFrames={1} fps={30} width={1280} height={720} />
      <Composition id="ThumbE" component={Thumbnail3} durationInFrames={1} fps={30} width={1280} height={720} defaultProps={{img: 'media/ep1/thumb_hand.jpg', full: true}} />
      <Composition id="ThumbIdris" component={Thumbnail3} durationInFrames={1} fps={30} width={1280} height={720} defaultProps={{img: 'media/ep2/thumb_light.jpg', full: true, top: 'GÖYƏ QALDIRILAN', name: 'HZ. İDRİSİN', l1: 'SİRLİ', l2: 'HƏYATI', num: '2', shift: 340, nameTop: 138, nameSize: 164}} />
      <Composition id="ThumbVIdris" component={ThumbVertical} durationInFrames={1} fps={30} width={1080} height={1920} defaultProps={{img: 'media/ep2/thumb_light.jpg', imgLeft: -779, top: 'GÖYƏ QALDIRILAN', name: 'HZ. İDRİSİN', l1: 'SİRLİ', l2: 'HƏYATI', num: '2', dy: 26}} />
      <Composition id="ThumbV" component={ThumbVertical} durationInFrames={1} fps={30} width={1080} height={1920} />
      <Composition id="Ep2Trailer" component={Trailer} durationInFrames={Math.round(TRAILER_DUR * FPS)} fps={FPS} width={1920} height={1080} />
      {[
        ['Ep2MainA', EP2_T0, 392],
        ['Ep2MainB', 392, EP2_END],
      ].map(([id, a, b]) => (
        <Composition key={id as string} id={id as string} component={Ep2Main} durationInFrames={Math.round(((b as number) - (a as number)) * FPS)} fps={FPS} width={1920} height={1080} defaultProps={{from: a as number}} />
      ))}
  <Composition id="LogoSpin" component={LogoSpin} durationInFrames={LOGO_FRAMES} fps={30} width={1080} height={1080} defaultProps={{green: false}} />
  <Composition id="LogoSpinGreen" component={LogoSpin} durationInFrames={LOGO_FRAMES} fps={30} width={1080} height={1080} defaultProps={{green: true}} />
  <Composition id="ShortEnd" component={ShortEnd} durationInFrames={SHORT_END_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="ShortTrailer" component={ShortTrailer} durationInFrames={SHORT_FRAMES} fps={30} width={1080} height={1920} />
  <Composition id="Ep3Intro" component={Ep3Intro} durationInFrames={Math.round(EP3_INTRO_DUR * 30)} fps={30} width={1920} height={1080} />
  <Composition id="Alive" component={Alive} durationInFrames={ALIVE_FRAMES} fps={30} width={1920} height={1080} />
  <Composition id="Ep3Bolum2" component={Bolum2} durationInFrames={Math.round(B2_DUR * 30)} fps={30} width={1920} height={1080} />
</>
);
