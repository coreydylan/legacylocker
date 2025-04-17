import React, { useState, forwardRef, ForwardedRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { CardBackBuilder } from '@/components/CardBackBuilder';

interface SamplePreviewProps {
  imageUrl?: string;
  className?: string;
  // Card back props - matches CardBackBuilder interface
  headline?: string;
  subtitle?: string;
  storyBody?: string;
  badgeText?: string;
  customNote?: string;
  cardNumber?: number;
  totalCards?: number;
  editionTitle?: string;
  giftFromCopy?: string;
  footerOn?: boolean;
  frameColor?: string;
  cardDetailsBgColor?: string;
  badgeColor?: string;
  icons?: string[];
  badgeOn?: boolean;
  // Controls
  showFlipButton?: boolean;
  isFlipped?: boolean;
  onFlip?: () => void;
  // Display mode
  displayMode?: 'thumbnail' | 'dialog' | 'fullsize' | 'mobile';
}

// Scale factors for different display modes
const SCALE_FACTORS = {
  thumbnail: 0.15,
  dialog: 0.35,
  fullsize: 1.0,
  mobile: 0.31
};

// Use forwardRef to allow parent components to get a ref to the inner div
export const SamplePreview = forwardRef<HTMLDivElement, SamplePreviewProps>((
  {
    imageUrl,
    className,
    // Card back props
  headline,
    subtitle,
  storyBody,
    badgeText,
    customNote,
    cardNumber = 1,
    totalCards = 12,
    editionTitle = "Legacy Locker",
    giftFromCopy = "A Gift From",
    footerOn,
    frameColor = "#2C5530",
    cardDetailsBgColor = "#F9F5EC",
    badgeColor = "#ED9831",
    icons = [],
    badgeOn = true,
    // Controls
    showFlipButton = true,
    isFlipped = false,
    onFlip,
    // Display mode
    displayMode = 'dialog'
  }, 
  ref: ForwardedRef<HTMLDivElement> // Accept the forwarded ref
) => {
  const [flipped, setFlipped] = useState(isFlipped);
  const scale = SCALE_FACTORS[displayMode];

  const handleFlip = () => {
    const newFlippedState = !flipped;
    setFlipped(newFlippedState);
    if (onFlip) onFlip();
  };

  return (
    <div className={cn("relative aspect-[2/3] w-full", className)}>
      {/* Front of card - only shown when not flipped */}
      {!flipped && (
        <Card className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full bg-white flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Card front"
                className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                <p className="text-sm text-center px-4">
                  No image uploaded.<br />
                  Upload an image for the front of the card.
                </p>
                </div>
              )}
          </div>
        </Card>
      )}

      {/* Back of card - only shown when flipped */}
      {flipped && (
        <Card className="absolute inset-0 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-white">
          <div
              ref={ref} // Attach ref here
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'center center',
                width: '1200px',
                height: '1800px',
                backgroundImage: 'url("../../styles/card-bg.webp")',
                backgroundSize: 'cover',
                backgroundPosition: 'center center'
              }}
            >
              <CardBackBuilder
                headline={headline}
                subtitle={subtitle}
                storyBody={storyBody}
                badgeText={badgeText}
                customNote={customNote}
                cardNumber={cardNumber}
                totalCards={totalCards}
                editionTitle={editionTitle}
                giftFromCopy={giftFromCopy}
                footerOn={footerOn}
                frameColor={frameColor}
                cardDetailsBgColor={cardDetailsBgColor}
                badgeColor={badgeColor}
                icons={icons}
                badgeOn={badgeOn}
              />
                </div>
          </div>
        </Card>
      )}

      {showFlipButton && (
      <Button
        variant="outline"
          size="icon"
          className="absolute top-2 right-2 z-20 bg-white/80 hover:bg-white"
          onClick={handleFlip}
        >
          <RotateCw className="h-4 w-4" />
      </Button>
      )}
    </div>
  );
});

SamplePreview.displayName = "SamplePreview"; // Add display name for DevTools 