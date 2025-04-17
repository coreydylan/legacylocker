import React from 'react';
import { CANVAS } from './constants';

interface OuterFrameProps {
  frameColor: string;
  children: React.ReactNode;
}

export const OuterFrame: React.FC<OuterFrameProps> = ({ frameColor, children }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        border: `${CANVAS.STROKE}px solid ${frameColor}`,
        margin: CANVAS.MARGIN,
        backgroundColor: 'white',
      }}
    >
      {children}
    </div>
  );
}; 