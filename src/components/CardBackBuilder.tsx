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
  MARGIN: 81, // 0.27in inset
  STROKE: 5,
};

// Frame dimensions (internal area)
const FRAME = {
  WIDTH: CANVAS.WIDTH - (CANVAS.MARGIN * 2),
  HEIGHT: CANVAS.HEIGHT - (CANVAS.MARGIN * 2),
};

// Derived measurements exactly per specifications
const DIMENSIONS = {
  // Vertical spacing and heights - using exact percentages from requirements
  TOP_MARGIN: Math.round(FRAME.HEIGHT * 0.036), // 3.6% of frame height from top of frame to top of header
  HEADER_HEIGHT: Math.round(FRAME.HEIGHT * 0.058), // 5.8% of frame height for header
  HEADER_TO_SUBTITLE_MARGIN: Math.round(FRAME.HEIGHT * 0.029), // 2.9% of frame height between header and subtitle
  SUBTITLE_HEIGHT: Math.round(FRAME.HEIGHT * 0.022), // 2.2% of frame height for subtitle
  SUBTITLE_TO_STORY_MARGIN: Math.round(FRAME.HEIGHT * 0.027), // 2.7% of frame height between subtitle and story body
  STORY_CONTAINER_HEIGHT: Math.round(FRAME.HEIGHT * 0.55), // 55% of frame height for story container
  
  // Other existing measurements
  CARD_DETAILS_HEIGHT: Math.round(FRAME.HEIGHT * 0.10),
  FOOTER_HEIGHT: Math.round(FRAME.HEIGHT * 0.05),
  BADGE_SIZE: Math.round(FRAME.HEIGHT * 0.16),
  BADGE_INNER_SIZE: Math.round(FRAME.HEIGHT * 0.16 * 0.84),
  BADGE_TEXT_WIDTH: Math.round(FRAME.WIDTH * 0.065),
  BADGE_TEXT_HEIGHT: Math.round(FRAME.HEIGHT * 0.11),
  BADGE_RIGHT_OFFSET: Math.round(FRAME.WIDTH * 0.04),
  BADGE_BOTTOM_OFFSET: Math.round(FRAME.HEIGHT * 0.112),
  STORY_COPY_WIDTH: Math.round(FRAME.WIDTH * 0.75),
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
        backgroundColor: 'white',
      }}
    >
      {/* Outer Frame */}
      <div
        style={{
          position: 'absolute',
          top: CANVAS.MARGIN,
          left: CANVAS.MARGIN,
          right: CANVAS.MARGIN,
          bottom: CANVAS.MARGIN,
          border: `${CANVAS.STROKE}px solid ${frameColor}`,
        }}
      >
        {/* Headline */}
        <div
          style={{
            position: 'absolute',
            top: 59,
            left: '10%',
            right: '10%',
            height: 95,
            color: frameColor,
            fontFamily: 'Source Serif 4 Variable, serif',
            fontSize: '64px',
            fontWeight: 'bold',
            fontStyle: 'italic',
            lineHeight: '95px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {headline}
        </div>

        {/* Subtitle */}
        <div
          style={{
            position: 'absolute',
            top: 202,
            left: '10%',
            right: '10%',
            height: 36,
            color: frameColor,
            fontFamily: 'Source Serif 4 Variable, serif',
            fontSize: '28px',
            fontWeight: 338,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            lineHeight: '36px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {subtitle}
        </div>

        {/* Story Copy Box */}
        <div
          style={{
            position: 'absolute',
            top: 282,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 779,
            height: 901,
            color: frameColor,
            fontFamily: 'Source Serif 4 Variable, serif',
            fontSize: '24px',
            fontWeight: 400,
            lineHeight: 1.6,
            textAlign: 'left',
            overflow: 'hidden',
            columnCount: 2,
            columnGap: '40px',
          }}
        >
          {storyBody}
        </div>

        {/* Card Details Box - Position depends on footerOn */}
        <div
          style={{
            position: 'absolute',
            bottom: footerOn ? DIMENSIONS.FOOTER_HEIGHT : 0,
            left: 0,
            right: 0,
            height: DIMENSIONS.CARD_DETAILS_HEIGHT,
            backgroundColor: cardDetailsBgColor,
            borderTop: `${CANVAS.STROKE}px solid ${frameColor}`,
            padding: '30px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ 
            color: frameColor,
            fontFamily: 'Source Serif 4 Variable, serif',
            fontSize: '24px',
            fontWeight: 300,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
          }}>
            CARD {cardNumber} OF {totalCards}
          </div>
          <div style={{ 
            color: frameColor,
            fontFamily: 'Source Serif 4 Variable, serif',
            fontSize: '32px',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}>
            {editionTitle} • {giftFromCopy}
          </div>
        </div>

        {/* Badge */}
        <div
          style={{
            position: 'absolute',
            right: DIMENSIONS.BADGE_RIGHT_OFFSET,
            bottom: DIMENSIONS.BADGE_BOTTOM_OFFSET + (footerOn ? 0 : -DIMENSIONS.FOOTER_HEIGHT),
            width: DIMENSIONS.BADGE_SIZE,
            height: DIMENSIONS.BADGE_SIZE,
            borderRadius: '50%',
            backgroundColor: badgeColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
                fontFamily: 'Source Serif 4 Variable, serif',
                fontSize: '24px',
                fontWeight: 500,
                textAlign: 'center',
                padding: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {badgeText}
            </div>
          </div>
        </div>

        {/* Custom Footer - Only shown when footerOn is true */}
        {footerOn && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: DIMENSIONS.FOOTER_HEIGHT,
              backgroundColor: frameColor,
              padding: '0 40px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Custom Note */}
            <div
              style={{
                color: cardDetailsBgColor,
                fontFamily: 'Source Serif 4 Variable, serif',
                fontSize: '20px',
                fontWeight: 400,
                letterSpacing: '0.02em',
                maxWidth: '70%', // Ensure it doesn't overlap with icons
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {customNote}
            </div>
            
            {/* Icons Container */}
            <div
              style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              {icons.map((icon, index) => (
                <div
                  key={index}
                  style={{
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: cardDetailsBgColor, // Icons should match the cream color
                  }}
                >
                  {/* Icon placeholder - replace with actual icon component */}
                  {icon}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 