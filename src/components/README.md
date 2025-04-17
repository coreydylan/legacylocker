# CardBackBuilder Component

A portable React component for rendering 4x6 story card backs using SVG layers. This component is designed to generate print-ready cards with customizable content and styling.

## Features

- Renders a 4x6 inch card at 300dpi (1200px x 1800px)
- Fully customizable text content, colors, and styling
- Exportable as a PNG image
- Modular and portable design
- Responsive layout

## Usage

```jsx
import CardBackBuilder from '@/components/CardBackBuilder';

// Basic usage with default props
<CardBackBuilder />

// Customized usage
<CardBackBuilder
  frameColor="#2C5530"
  cardDetailsBgColor="#F9F5EC"
  badgeColor="#ED9831"
  customNote="A special message for you on this card."
  footerOn={true}
  cardCount="CARD 1 OF 12"
  editionText="ATLANTA BASEBALL EDITION"
  giftFromCopy="A GIFT FROM LUKAS TO MOM"
  headline="The Day I Hit My First Home Run"
  subtitle="A BASEBALL MEMORY"
  storyBody="Your story text goes here..."
  badgeText="HOME RUN"
  icons={['/icons/baseball.svg', '/icons/trophy.svg']}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `frameColor` | string | '#2C5530' | Color of the card frame |
| `cardDetailsBgColor` | string | '#F9F5EC' | Background color of the card details box |
| `badgeColor` | string | '#ED9831' | Color of the badge |
| `customNote` | string | undefined | Custom note text for the footer |
| `footerOn` | boolean | true | Whether to show the footer |
| `cardCount` | string | 'CARD 1 OF 12' | Card count text |
| `editionText` | string | 'ATLANTA BASEBALL EDITION' | Edition text |
| `giftFromCopy` | string | 'A GIFT FROM LUKAS TO MOM' | Gift from text |
| `headline` | string | 'Your Story Headline' | Story headline |
| `subtitle` | string | 'YOUR STORY SUBTITLE' | Story subtitle |
| `storyBody` | string | 'Your story text goes here...' | Story body text |
| `badgeText` | string | undefined | Badge text |
| `icons` | string[] | [] | Array of icon URLs |
| `className` | string | undefined | Additional CSS class name |

## Component Structure

The CardBackBuilder component consists of the following layers:

1. **OuterFrame**: 5px stroke with customizable color
2. **CardDetailsBox**: Contains card count, edition text, and gift from copy
3. **CustomFooter**: Optional footer with custom note and icons
4. **Badge**: Optional badge with customizable text and color
5. **Headline**: Story headline with customizable text
6. **Subtitle**: Story subtitle with customizable text
7. **StoryBody**: Main story text with customizable content

## Export Functionality

The component includes an "Export as Image" button that converts the SVG to a PNG image and triggers a download. This is useful for creating print-ready cards.

## Demo

A demo page is available at `/card-builder-demo` that showcases the component with interactive controls for all customizable properties.

## Dependencies

- React
- Tailwind CSS (for styling)
- Source Serif 4 Variable font
- Source Code Pro font

## License

MIT 