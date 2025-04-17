import React from 'react';
import { CANVAS, DIMENSIONS, FONTS } from './constants';

interface CardDetailsBoxProps {
  frameColor: string;
  backgroundColor: string;
  cardNumber: number;
  totalCards: number;
  editionTitle: string;
  giftFromCopy: string;
}

export const CardDetailsBox: React.FC<CardDetailsBoxProps> = ({
  frameColor,
  backgroundColor,
  cardNumber,
  totalCards,
  editionTitle,
  giftFromCopy,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: DIMENSIONS.CARD_DETAILS.HEIGHT,
        backgroundColor,
        borderTop: `${CANVAS.STROKE}px solid ${frameColor}`,
        padding: DIMENSIONS.CARD_DETAILS.PADDING,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        fontFamily: FONTS.PRIMARY,
      }}
    >
      <div
        style={{
          color: frameColor,
          fontSize: DIMENSIONS.CARD_DETAILS.FONT.COUNT,
          fontWeight: 300,
          textTransform: 'uppercase',
        }}
      >
        CARD {cardNumber} OF {totalCards}
      </div>
      <div
        style={{
          color: frameColor,
          fontSize: DIMENSIONS.CARD_DETAILS.FONT.TITLE,
          fontWeight: 600,
        }}
      >
        {editionTitle} • {giftFromCopy}
      </div>
    </div>
  );
}; 