import React, { useMemo } from 'react';

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
  badgeOn?: boolean;
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
  STORY_COPY_WIDTH: Math.round(FRAME.WIDTH * 0.89),
};

// Utility function for headline class (8 tiers)
function getHeadlineClass(headline: string = '') {
  const len = headline.length;
  if (len === 0) return 'headline-xl'; // Default for empty
  if (len <= 10) return 'headline-xl'; // 1-10
  if (len <= 14) return 'headline-lg'; // 11-14
  if (len <= 17) return 'headline-md'; // 15-17
  if (len <= 19) return 'headline-sm'; // 18-19 
  if (len === 20) return 'headline-s';  // 20 (New)
  if (len === 21) return 'headline-xs'; // 21
  if (len === 22) return 'headline-xxs';// 22 (New)
  return 'headline-xxxs'; // 23-24 (Was xxs)
}

// Function to get subtitle margin based on headline class (inverted logic)
function getSubtitleMargin(headlineClass: string): number {
  switch (headlineClass) {
    case 'headline-xl': return 35; // Largest margin for largest font
    case 'headline-lg': return 35;
    case 'headline-md': return 20;
    case 'headline-sm': return 13;
    case 'headline-s':  return 11;
    case 'headline-xs': return 8;
    case 'headline-xxs': return 6;
    case 'headline-xxxs': return 0; // Smallest margin for smallest font
    default: return 35; // Default to largest margin
  }
}

// Function to get story body margin based on headline class
function getStoryMargin(headlineClass: string): number {
  switch (headlineClass) {
    case 'headline-xl': return 44; // Largest margin for largest font
    case 'headline-lg': return 42;
    case 'headline-md': return 40;
    case 'headline-sm': return 38;
    case 'headline-s':  return 36;
    case 'headline-xs': return 34;
    case 'headline-xxs': return 32;
    case 'headline-xxxs': return 30; // Smallest margin for smallest font
    default: return 44; // Default to largest margin
  }
}

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
  badgeOn = true,
}) => {

  const headlineClass = getHeadlineClass(headline);
  const subtitleMargin = getSubtitleMargin(headlineClass);
  const storyMargin = getStoryMargin(headlineClass);

  // Determine badge text size class based on LONGEST line length
  const badgeTextClass = useMemo(() => {
    const lines = badgeText.split('\n');
    // Find the maximum length of any line
    const maxLength = lines.reduce((max, line) => Math.max(max, line.length), 0);
    
    if (maxLength <= 8) return 'badge-xl';
    if (maxLength <= 10) return 'badge-lg'; // Adjusted threshold to match input validation max
    if (maxLength <= 12) return 'badge-md'; // Adjusted threshold
    // If longest line is > 12 (shouldn't happen with validation), default to smallest
    // Or, adjust if validation changes. Let's keep 10 as max for now.
    // We might need fewer classes if max line length is strictly 10.
    // Let's simplify based on max 10 chars per line validation:
    // if (maxLength <= 6) return 'badge-xl';
    // if (maxLength <= 8) return 'badge-lg';
    // return 'badge-md'; // 9-10 chars
    
    // Reverting to original thresholds but based on maxLength
    if (maxLength <= 8) return 'badge-xl';
    if (maxLength <= 12) return 'badge-lg'; // Max length per line is 10, so this tier might not be hit often
    if (maxLength <= 16) return 'badge-md'; // Max length per line is 10
    return 'badge-sm'; // Max length per line is 10
    
    // --- Let's simplify based on the 10 char limit per line --- 
    // if (maxLength <= 6) return 'badge-xl'; // Use largest for short lines
    // if (maxLength <= 8) return 'badge-lg'; // Medium for mid-length
    // return 'badge-md'; // Smallest reasonable size for 9-10 chars
    
    // --- Final Simplification based on 10 char limit --- 
    if (maxLength <= 6) return 'badge-xl'; // 1-6 Chars => Largest Font/Spacing
    if (maxLength <= 8) return 'badge-lg'; // 7-8 Chars => Medium Font/Spacing
    return 'badge-md'; // 9-10 Chars => Smallest Font/Spacing (Remove badge-sm?)

  }, [badgeText]);

  return (
    <div 
      className="font-source-serif"
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
          className={`headline-base ${headlineClass}`}
          style={{
            position: 'absolute',
            top: DIMENSIONS.TOP_MARGIN,
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '91%',
            height: DIMENSIONS.HEADER_HEIGHT,
            color: frameColor,
            textAlign: 'center',
          }}
        >
          {headline}
        </div>

        {/* Subtitle */}
        <div
          className="card-subtitle-style"
          style={{
            position: 'absolute',
            top: DIMENSIONS.TOP_MARGIN + DIMENSIONS.HEADER_HEIGHT + subtitleMargin,
            left: '10%',
            right: '10%',
            height: DIMENSIONS.SUBTITLE_HEIGHT,
            color: frameColor,
          }}
        >
          {subtitle}
        </div>

        {/* Story Copy Box */}
        <div
          style={{
            position: 'absolute',
            top: DIMENSIONS.TOP_MARGIN + DIMENSIONS.HEADER_HEIGHT + 
                 subtitleMargin + DIMENSIONS.SUBTITLE_HEIGHT + 
                 storyMargin,
            left: '50%',
            transform: 'translateX(-50%)',
            width: DIMENSIONS.STORY_COPY_WIDTH,
            height: DIMENSIONS.STORY_CONTAINER_HEIGHT,
            color: frameColor,
            fontSize: '24px',
            fontWeight: 400,
            lineHeight: 1.3,
            textAlign: 'left',
            overflow: 'hidden',
            whiteSpace: 'pre-line',
            overflowWrap: 'break-word'
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
            fontSize: '26px',
            fontWeight: 300,
            textTransform: 'uppercase',
            letterSpacing: '0.09em',
            marginBottom: '8px',
          }}>
            CARD {cardNumber} OF {totalCards}
          </div>
          <div style={{ 
            color: frameColor,
            fontSize: '32px',
            fontWeight: 600,
            letterSpacing: '0.08em',
          }}>
            {editionTitle} • {giftFromCopy}
          </div>
        </div>

        {/* Badge - Conditionally Rendered */}
        {badgeOn && (
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
                className={`badge-text-base ${badgeTextClass}`}
                style={{
                  width: DIMENSIONS.BADGE_TEXT_WIDTH,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  padding: '10px',
                }}
              >
                {badgeText}
              </div>
            </div>
          </div>
        )}

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