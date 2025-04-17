import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Types
export interface CardBackBuilderProps {
  // Global variables with defaults
  frameColor?: string;
  cardDetailsBgColor?: string;
  badgeColor?: string;
  customNote?: string;
  footerOn?: boolean;
  cardCount?: string;
  editionText?: string;
  giftFromCopy?: string;
  headline?: string;
  subtitle?: string;
  storyBody?: string;
  badgeText?: string;
  icons?: string[];
  className?: string;
}

// Default values
const DEFAULT_PROPS = {
  frameColor: '#2C5530',
  cardDetailsBgColor: '#F9F5EC',
  badgeColor: '#ED9831',
  footerOn: true,
  cardCount: 'CARD 1 OF 12',
  editionText: 'ATLANTA BASEBALL EDITION',
  giftFromCopy: 'A GIFT FROM LUKAS TO MOM',
  headline: 'Your Story Headline',
  subtitle: 'YOUR STORY SUBTITLE',
  storyBody: 'Your story text goes here...',
  icons: [],
};

// Canvas dimensions (4x6 inches at 300dpi)
const CANVAS_WIDTH = 1200; // 4 inches * 300dpi
const CANVAS_HEIGHT = 1800; // 6 inches * 300dpi
const FRAME_PADDING = 54; // 0.18 inches * 300dpi
const STROKE_WIDTH = 5;

// Component
export const CardBackBuilder: React.FC<CardBackBuilderProps> = ({
  frameColor = DEFAULT_PROPS.frameColor,
  cardDetailsBgColor = DEFAULT_PROPS.cardDetailsBgColor,
  badgeColor = DEFAULT_PROPS.badgeColor,
  customNote,
  footerOn = DEFAULT_PROPS.footerOn,
  cardCount = DEFAULT_PROPS.cardCount,
  editionText = DEFAULT_PROPS.editionText,
  giftFromCopy = DEFAULT_PROPS.giftFromCopy,
  headline = DEFAULT_PROPS.headline,
  subtitle = DEFAULT_PROPS.subtitle,
  storyBody = DEFAULT_PROPS.storyBody,
  badgeText,
  icons = DEFAULT_PROPS.icons,
  className,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Export function
  const exportToImage = async () => {
    if (!svgRef.current) return;
    
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      
      // Create an image from the SVG
      const img = new Image();
      img.src = svgUrl;
      
      // Draw the image on the canvas
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          resolve(null);
        };
      });
      
      // Convert canvas to image
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = 'card-back.png';
      link.href = dataUrl;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(svgUrl);
    } catch (error) {
      console.error('Error exporting to image:', error);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        xmlns="http://www.w3.org/2000/svg"
        className="bg-white"
      >
        {/* 1. OuterFrame */}
        <rect
          x={FRAME_PADDING}
          y={FRAME_PADDING}
          width={CANVAS_WIDTH - 2 * FRAME_PADDING}
          height={CANVAS_HEIGHT - 2 * FRAME_PADDING}
          fill="white"
          stroke={frameColor}
          strokeWidth={STROKE_WIDTH}
        />
        
        {/* 2. CardDetailsBox */}
        <rect
          x={FRAME_PADDING}
          y={CANVAS_HEIGHT - FRAME_PADDING - 180}
          width={CANVAS_WIDTH - 2 * FRAME_PADDING}
          height={180}
          fill={cardDetailsBgColor}
          stroke={frameColor}
          strokeWidth={STROKE_WIDTH}
        />
        
        {/* Card Count */}
        <text
          x={FRAME_PADDING + 20}
          y={CANVAS_HEIGHT - FRAME_PADDING - 120}
          fontFamily="source-serif-4-variable"
          fontSize="24"
          fontWeight="300"
          fill={frameColor}
          style={{ textTransform: 'uppercase' }}
        >
          {cardCount}
        </text>
        
        {/* Edition and Gift From */}
        <text
          x={FRAME_PADDING + 20}
          y={CANVAS_HEIGHT - FRAME_PADDING - 60}
          fontFamily="source-serif-4-variable"
          fontSize="24"
          fontWeight="600"
          fill={frameColor}
        >
          {editionText} • {giftFromCopy}
        </text>
        
        {/* 3. CustomFooter (if enabled) */}
        {footerOn && customNote && (
          <g>
            <rect
              x={FRAME_PADDING}
              y={CANVAS_HEIGHT - FRAME_PADDING - 270}
              width={CANVAS_WIDTH - 2 * FRAME_PADDING}
              height={90}
              fill={frameColor}
            />
            <text
              x={FRAME_PADDING + 20}
              y={CANVAS_HEIGHT - FRAME_PADDING - 220}
              fontFamily="source-serif-4-variable"
              fontSize="18"
              fill={cardDetailsBgColor}
            >
              {customNote}
            </text>
            
            {/* Icons */}
            {icons.map((icon, index) => (
              <image
                key={index}
                href={icon}
                x={CANVAS_WIDTH - FRAME_PADDING - 32 - index * 40}
                y={CANVAS_HEIGHT - FRAME_PADDING - 270 + 29}
                width="32"
                height="32"
              />
            ))}
          </g>
        )}
        
        {/* 4. Badge (if text provided) */}
        {badgeText && (
          <g transform={`translate(${CANVAS_WIDTH - FRAME_PADDING - 48}, ${CANVAS_HEIGHT - FRAME_PADDING - 202})`}>
            {/* Outer circle */}
            <circle
              cx="144"
              cy="144"
              r="144"
              fill={badgeColor}
            />
            
            {/* Inner circle with white border */}
            <circle
              cx="144"
              cy="144"
              r="121"
              fill={badgeColor}
              stroke="white"
              strokeWidth={STROKE_WIDTH}
            />
            
            {/* Badge text */}
            <text
              x="144"
              y="144"
              fontFamily="Source Code Pro"
              fontSize="24"
              fontWeight="700"
              fill="white"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ textTransform: 'uppercase' }}
            >
              {badgeText}
            </text>
          </g>
        )}
        
        {/* 5. Headline */}
        <text
          x={FRAME_PADDING + 20}
          y={FRAME_PADDING + 60}
          fontFamily="source-serif-4-variable"
          fontSize="48"
          fontWeight="700"
          fontStyle="italic"
          fill={frameColor}
        >
          {headline}
        </text>
        
        {/* 6. Subtitle */}
        <text
          x={FRAME_PADDING + 20}
          y={FRAME_PADDING + 120}
          fontFamily="source-serif-4-variable"
          fontSize="24"
          fontWeight="300"
          fill={frameColor}
          style={{ textTransform: 'uppercase' }}
        >
          {subtitle}
        </text>
        
        {/* 7. StoryBody */}
        <foreignObject
          x={FRAME_PADDING + 20}
          y={FRAME_PADDING + 160}
          width={CANVAS_WIDTH - 2 * FRAME_PADDING - 40}
          height={1026}
        >
          <div
            style={{
              fontFamily: 'source-serif-4-variable',
              fontSize: '24px',
              color: frameColor,
              lineHeight: '1.5',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {storyBody}
          </div>
        </foreignObject>
      </svg>
      
      {/* Export button */}
      <button
        onClick={exportToImage}
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Export as Image
      </button>
    </div>
  );
};

export default CardBackBuilder; 