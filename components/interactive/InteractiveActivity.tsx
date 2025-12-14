import React from 'react';
import { BubbleWrap } from './BubbleWrap';
import { RipplePond } from './RipplePond';
import { DoodlePad } from './DoodlePad';

interface Props {
  type: 'bubble-wrap' | 'ripple-pond' | 'doodle-pad';
}

export function InteractiveActivity({ type }: Props) {
  switch (type) {
    case 'bubble-wrap':
      return <BubbleWrap />;
    case 'ripple-pond':
      return <RipplePond />;
    case 'doodle-pad':
      return <DoodlePad />;
    default:
      return null;
  }
}

