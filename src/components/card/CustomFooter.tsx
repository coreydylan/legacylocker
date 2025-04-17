import React from 'react';
import { CANVAS, DIMENSIONS, FONTS } from './constants';

interface CustomFooterProps {
  frameColor: string;
  customNote?: string;
  icons?: string[];
}

export const CustomFooter: React.FC<CustomFooterProps> = ({
  frameColor,
  customNote,
  icons = [],
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: -CANVAS.MARGIN,
        left: -CANVAS.MARGIN,
        right: -CANVAS.MARGIN,
        height: DIMENSIONS.FOOTER.HEIGHT,
        backgroundColor: frameColor,
        color: 'white',
        padding: DIMENSIONS.FOOTER.PADDING,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: FONTS.PRIMARY,
      }}
    >
      <div style={{ fontSize: '18px' }}>{customNote}</div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {icons.map((icon, index) => (
          <div
            key={index}
            style={{
              width: DIMENSIONS.FOOTER.ICON_SIZE,
              height: DIMENSIONS.FOOTER.ICON_SIZE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Placeholder for icons */}
            ★
          </div>
        ))}
      </div>
    </div>
  );
}; 