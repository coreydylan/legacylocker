import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SamplePreview } from '@/components/admin/SamplePreview';
import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useStorySelector } from '@/hooks/useStorySelector';

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
  website_description?: string | null;
}

interface SignaturePreviewProps {
  samples: StorySample[];
  className?: string;
  onSampleSelect?: (sample: StorySample) => void;
}

export const SignaturePreview: React.FC<SignaturePreviewProps> = ({
  samples,
  className,
  onSampleSelect,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const { openStorySelector } = useStorySelector();

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

  // Handle navigation
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + samples.length) % samples.length);
    setIsFlipped(false);
    setIsPaused(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % samples.length);
    setIsFlipped(false);
    setIsPaused(true);
  };

  const handleExploreCTA = () => {
    const handleEditionSelection = (window as any).handleStoryEditionSelection;
    if (handleEditionSelection) {
      handleEditionSelection('signature');
    }
  };

  if (samples.length === 0) {
    return null;
  }

  const currentSample = samples[currentIndex];

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden md:flex gap-0 justify-center">
        {/* Left side - Card preview */}
        <div 
          className={cn("relative w-[460px]", className)}
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

        {/* Right side - Story list */}
        <div className="w-[600px] flex items-center pl-12">
          <div className="space-y-4 w-[500px]">
            {samples.map((sample, index) => (
              <p key={sample.id} className="flex items-start">
                {sample.icon && <span className="mr-3 mt-1 text-2xl">{sample.icon}</span>}
                <button
                  onClick={() => handleSampleClick(index)}
                  className={cn(
                    "text-left px-2 py-1 rounded-sm transition-colors text-legacy-slate text-[clamp(20px,2vw,26px)] leading-relaxed whitespace-nowrap",
                    "hover:bg-legacy-cream",
                    index === currentIndex && "bg-legacy-cream font-medium"
                  )}
                >
                  {sample.headline}
                </button>
              </p>
            ))}
            {currentSample.website_description && (
              <p className="text-[clamp(20px,2vw,26px)] leading-relaxed text-[#444]">
                {currentSample.website_description}
              </p>
            )}
            <p className="flex items-start">
              <span className="mr-3 mt-1 text-2xl">✨</span>
              <button
                onClick={handleExploreCTA}
                className="group text-left px-2 py-1 rounded-sm transition-colors text-legacy-slate text-[clamp(20px,2vw,26px)] leading-relaxed flex items-center bg-legacy-green/10 hover:bg-legacy-green/20"
              >
                <span>Explore more signature stories</span>
                <ChevronRightIcon className="w-5 h-5 ml-2 text-legacy-slate/10 transition-all group-hover:text-legacy-slate/60" />
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full">
        {/* Mobile Card preview */}
        <div className="flex justify-center">
          <div 
            className="h-[70vh] aspect-[2/3]"
            onTouchStart={handleMouseEnter}
            onTouchEnd={handleMouseLeave}
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
              displayMode="mobile"
              badgeOn={currentSample.badge_off_or_on}
              footerOn={currentSample.footer_off_or_on}
              showFlipButton={true}
              className="overflow-visible"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="mt-8 px-6 space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              className="p-2 text-legacy-slate hover:text-legacy-slate/80 transition-colors"
              aria-label="Previous story"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center justify-center">
              {currentSample.icon && (
                <span className="mr-3 text-xl">{currentSample.icon}</span>
              )}
              <span className="text-base font-medium text-legacy-slate">
                {currentSample.headline}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="p-2 text-legacy-slate hover:text-legacy-slate/80 transition-colors"
              aria-label="Next story"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <button
            onClick={handleExploreCTA}
            className="w-full flex items-center justify-center space-x-2 py-3 text-sm font-medium text-legacy-slate bg-legacy-green/10 hover:bg-legacy-green/20 rounded-lg transition-colors"
          >
            <span>Explore more signature stories</span>
            <ChevronRightIcon className="w-4 h-4 ml-1 text-legacy-slate/10 transition-colors hover:text-legacy-slate/60" />
          </button>
        </div>
      </div>
    </>
  );
}; 