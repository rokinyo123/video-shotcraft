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
  </>
);
