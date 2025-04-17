import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SamplePreview } from '@/components/admin/SamplePreview';

interface StorySample {
  id: string;
  story_series_id: string;
  headline: string;
  subtitle: string | null;
  story_body: string;
  badge_text: string | null;
  frame_color: string | null;
  icon: string | null;
  badge_color: string | null;
  card_count: number | null;
  edition_text: string | null;
  image_url: string | null;
  custom_note: string | null;
  badge_off_or_on: boolean;
  footer_off_or_on: boolean;
}

interface StoryPreviewProps {
  samples: StorySample[];
  className?: string;
  onSampleSelect?: (sample: StorySample) => void;
}

export const StoryPreview: React.FC<StoryPreviewProps> = ({
  samples,
  className,
  onSampleSelect,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Auto-rotation logic
  useEffect(() => {
    if (isPaused || samples.length === 0) return;

    const rotateCard = () => {
      if (isFlipped) {
        // If currently showing back, move to next card's front
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % samples.length);
      } else {
        // If showing front, flip to back
        setIsFlipped(true);
      }
    };

    timeoutRef.current = setTimeout(rotateCard, 3500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isFlipped, isPaused, samples.length]);

  // Handle hover state
  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Add a small delay before resuming
    setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  // Handle manual flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Handle sample selection from list
  const handleSampleClick = (index: number) => {
    setCurrentIndex(index);
    setIsFlipped(false);
    setIsPaused(true);
    if (onSampleSelect) {
      onSampleSelect(samples[index]);
    }
  };

  if (samples.length === 0) {
    return null;
  }

  const currentSample = samples[currentIndex];

  return (
    <div className="flex gap-8">
      {/* Left side - Story list */}
      <div className="w-64 space-y-2">
        {samples.map((sample, index) => (
          <button
            key={sample.id}
            onClick={() => handleSampleClick(index)}
            className={cn(
              "w-full text-left px-4 py-2 rounded-lg transition-colors",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              index === currentIndex && "bg-gray-100 dark:bg-gray-800 font-medium"
            )}
          >
            {sample.headline}
          </button>
        ))}
      </div>

      {/* Right side - Card preview */}
      <div 
        className={cn("relative w-[400px]", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SamplePreview
          imageUrl={currentSample.image_url}
          headline={currentSample.headline}
          subtitle={currentSample.subtitle}
          storyBody={currentSample.story_body}
          badgeText={currentSample.badge_text}
          customNote={currentSample.custom_note}
          cardNumber={currentSample.card_count}
          editionTitle={currentSample.edition_text}
          frameColor={currentSample.frame_color}
          badgeColor={currentSample.badge_color}
          icons={currentSample.icon ? [currentSample.icon] : []}
          isFlipped={isFlipped}
          onFlip={handleFlip}
          displayMode="dialog"
          badgeOn={currentSample.badge_off_or_on}
          footerOn={currentSample.footer_off_or_on}
          showFlipButton={true}
        />
      </div>
    </div>
  );
}; 