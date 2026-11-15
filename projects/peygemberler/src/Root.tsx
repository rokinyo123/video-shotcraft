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
import {GlobeScene} from './three/GlobeScene';
import {GLOBES} from './three/globes';
import {FPS} from './theme';

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
</>
);
