import React from 'react';
import { CANVAS, DIMENSIONS, FONTS } from './constants';

interface BadgeProps {
  badgeColor: string;
  badgeText?: string;
}

export const Badge: React.FC<BadgeProps> = ({ badgeColor, badgeText }) => {
  if (!badgeText) return null;

  return (
    <div
      style={{
        position: 'absolute',
        right: DIMENSIONS.BADGE.RIGHT_OFFSET,
        bottom: DIMENSIONS.BADGE.BOTTOM_OFFSET,
        width: DIMENSIONS.BADGE.OUTER_DIAMETER,
        height: DIMENSIONS.BADGE.OUTER_DIAMETER,
        borderRadius: '50%',
        backgroundColor: badgeColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: DIMENSIONS.BADGE.INNER_DIAMETER,
          height: DIMENSIONS.BADGE.INNER_DIAMETER,
          borderRadius: '50%',
          border: `${CANVAS.STROKE}px solid white`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: DIMENSIONS.BADGE.TEXT_WIDTH,
            height: DIMENSIONS.BADGE.TEXT_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            textAlign: 'center',
            padding: '10px',
            fontFamily: FONTS.BADGE,
            textTransform: 'uppercase',
          }}
        >
          {badgeText}
        </div>
      </div>
    </div>
  );
}; 