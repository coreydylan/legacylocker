// Print dimensions (4x6 inches at 300dpi)
export const CANVAS = {
  WIDTH: 1200, // 4in * 300dpi
  HEIGHT: 1800, // 6in * 300dpi
  MARGIN: 54,  // 0.18in * 300dpi
  STROKE: 5,
} as const;

// Element dimensions as percentages of canvas
export const DIMENSIONS = {
  CARD_DETAILS: {
    HEIGHT: Math.round(CANVAS.HEIGHT * 0.10), // 10% of height = 180px
    PADDING: 20,
    FONT: {
      COUNT: 18,
      TITLE: 24,
    },
  },
  FOOTER: {
    HEIGHT: Math.round(CANVAS.HEIGHT * 0.05), // 5% of height = 90px
    PADDING: 20,
    ICON_SIZE: 32,
  },
  BADGE: {
    OUTER_DIAMETER: Math.round(CANVAS.HEIGHT * 0.16), // 16% of height = 288px
    INNER_DIAMETER: Math.round(CANVAS.HEIGHT * 0.16 * 0.84), // 84% of outer = 242px
    TEXT_WIDTH: Math.round(CANVAS.WIDTH * 0.065), // 6.5% of width = 78px
    TEXT_HEIGHT: Math.round(CANVAS.HEIGHT * 0.11), // 11% of height = 198px
    RIGHT_OFFSET: Math.round(CANVAS.WIDTH * 0.04), // 4% from right = 48px
    BOTTOM_OFFSET: Math.round(CANVAS.HEIGHT * 0.112), // 11.2% from bottom = 202px
  },
  STORY: {
    WIDTH: Math.round(CANVAS.WIDTH * 0.9), // 90% of width = 1080px
    HEIGHT: Math.round(CANVAS.HEIGHT * 0.57), // 57% of height = 1026px
  },
  TEXT: {
    HEADLINE: {
      TOP: '5%',
      SIZE: 48,
    },
    SUBTITLE: {
      TOP: '15%',
      SIZE: 24,
    },
    STORY: {
      TOP: '25%',
      SIZE: 24,
      LINE_HEIGHT: 1.5,
    },
  },
} as const;

// Default colors
export const COLORS = {
  FRAME: '#2C5530', // Legacy Locker deep green
  CARD_DETAILS_BG: '#F9F5EC', // Legacy cream
  BADGE: '#ED9831', // Badge orange
} as const;

// Font families
export const FONTS = {
  PRIMARY: 'Source Serif 4 Variable, serif',
  BADGE: 'Source Code Pro, monospace',
} as const;

// Character limits
export const CHAR_LIMITS = {
  HEADLINE: 25,
  SUBTITLE: 50,
  BADGE_TEXT: 20,
  STORY_BODY: 1700,
  CUSTOM_NOTE: 100,
} as const; 