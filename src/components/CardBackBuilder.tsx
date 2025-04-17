import React from 'react';

interface CardBackBuilderProps {
  // Content
  headline?: string;
  subtitle?: string;
  storyBody?: string;
  badgeText?: string;
  customNote?: string;
  cardNumber?: number;
  totalCards?: number;
  editionTitle?: string;
  giftFromCopy?: string;
  // Style controls
  footerOn?: boolean;
  frameColor?: string;
  cardDetailsBgColor?: string;
  badgeColor?: string;
  icons?: string[];
}

// Constants for card dimensions (4x6 inches at 300dpi)
const CANVAS = {
  WIDTH: 1200,
  HEIGHT: 1800,
  MARGIN: 81, // 0.18in inset
  STROKE: 5,
};

// Derived measurements
const DIMENSIONS = {
  CARD_DETAILS_HEIGHT: Math.round(CANVAS.HEIGHT * 0.10), // 10% of height
  FOOTER_HEIGHT: Math.round(CANVAS.HEIGHT * 0.05), // 5% of height
  BADGE_SIZE: Math.round(CANVAS.HEIGHT * 0.16), // 16% of height
  BADGE_INNER_SIZE: Math.round(CANVAS.HEIGHT * 0.16 * 0.84), // 84% of badge size
  BADGE_TEXT_WIDTH: Math.round(CANVAS.WIDTH * 0.065), // 6.5% of width
  BADGE_TEXT_HEIGHT: Math.round(CANVAS.HEIGHT * 0.11), // 11% of height
  BADGE_RIGHT_OFFSET: Math.round(CANVAS.WIDTH * 0.04), // 4% from right
  BADGE_BOTTOM_OFFSET: Math.round(CANVAS.HEIGHT * 0.112), // 11.2% from bottom
  STORY_COPY_WIDTH: Math.round(CANVAS.WIDTH * 0.9), // 90% of width
  STORY_COPY_HEIGHT: Math.round(CANVAS.HEIGHT * 0.57), // 57% of height
};

export const CardBackBuilder: React.FC<CardBackBuilderProps> = ({
  // Content
  headline = '',
  subtitle = '',
  storyBody = '',
  badgeText = '',
  customNote = '',
  cardNumber = 1,
  totalCards = 12,
  editionTitle = 'Legacy Locker',
  giftFromCopy = 'A Gift From',
  // Style controls
  footerOn = true,
  frameColor = '#2C5530',
  cardDetailsBgColor = '#F9F5EC',
  badgeColor = '#ED9831',
  icons = [],
}) => {
  return (
    <div 
      style={{ 
        width: CANVAS.WIDTH,
        height: CANVAS.HEIGHT,
        position: 'relative',
        fontFamily: 'Source Serif 4 Variable, serif',
      }}
    >
      {/* Outer Frame */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          border: `${CANVAS.STROKE}px solid ${frameColor}`,
          margin: CANVAS.MARGIN,
        }}
      >
        {/* Headline */}
        <div
          style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            right: '5%',
            color: frameColor,
            fontSize: '48px',
            fontWeight: 'bold',
            fontStyle: 'italic',
          }}
        >
          {headline}
        </div>

        {/* Subtitle */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            right: '5%',
            color: frameColor,
            fontSize: '24px',
            fontWeight: 338,
            textTransform: 'uppercase',
          }}
        >
          {subtitle}
        </div>

        {/* Story Copy Box */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: DIMENSIONS.STORY_COPY_WIDTH,
            height: DIMENSIONS.STORY_COPY_HEIGHT,
            color: frameColor,
            fontSize: '24px',
            lineHeight: 1.5,
            overflow: 'hidden',
          }}
        >
          {storyBody}
        </div>

        {/* Card Details Box */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: DIMENSIONS.CARD_DETAILS_HEIGHT,
            backgroundColor: cardDetailsBgColor,
            borderTop: `${CANVAS.STROKE}px solid ${frameColor}`,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ 
            color: frameColor,
            fontSize: '18px',
            fontWeight: 300,
            textTransform: 'uppercase',
          }}>
            CARD {cardNumber} OF {totalCards}
          </div>
          <div style={{ 
            color: frameColor,
            fontSize: '24px',
            fontWeight: 600,
          }}>
            {editionTitle} • {giftFromCopy}
          </div>
        </div>

        {/* Badge */}
        <div
          style={{
            position: 'absolute',
            right: DIMENSIONS.BADGE_RIGHT_OFFSET,
            bottom: DIMENSIONS.BADGE_BOTTOM_OFFSET,
            width: DIMENSIONS.BADGE_SIZE,
            height: DIMENSIONS.BADGE_SIZE,
            borderRadius: '50%',
            backgroundColor: badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: DIMENSIONS.BADGE_INNER_SIZE,
              height: DIMENSIONS.BADGE_INNER_SIZE,
              borderRadius: '50%',
              border: `${CANVAS.STROKE}px solid white`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: DIMENSIONS.BADGE_TEXT_WIDTH,
                height: DIMENSIONS.BADGE_TEXT_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px',
                textAlign: 'center',
                padding: '10px',
              }}
            >
              {badgeText}
            </div>
          </div>
        </div>

        {/* Footer */}
        {footerOn && (
          <div
            style={{
              position: 'absolute',
              bottom: -CANVAS.MARGIN,
              left: -CANVAS.MARGIN,
              right: -CANVAS.MARGIN,
              height: DIMENSIONS.FOOTER_HEIGHT,
              backgroundColor: frameColor,
              color: 'white',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '18px' }}>{customNote}</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {icons.map((icon, index) => (
                <div key={index} style={{ width: '24px', height: '24px' }}>
                  {/* Placeholder for icons */}
                  ★
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 