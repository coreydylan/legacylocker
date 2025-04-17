import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SamplePreviewProps {
  headline: string;
  storyBody: string;
  footerNote?: string;
  imageUrl?: string;
  emoji?: string;
  className?: string;
}

export function SamplePreview({
  headline,
  storyBody,
  footerNote,
  imageUrl,
  emoji,
  className,
}: SamplePreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative w-full max-w-[200px] mx-auto">
        <div
          className={cn(
            "w-full transition-all duration-500 transform-gpu",
            isFlipped ? "rotate-y-180" : ""
          )}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {/* Front of card */}
          <div
            className={cn(
              "absolute w-full backface-hidden",
              isFlipped ? "invisible" : "visible"
            )}
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <Card className="overflow-hidden aspect-[4/5] w-full">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Card front"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                  No image uploaded
                </div>
              )}
            </Card>
          </div>

          {/* Back of card */}
          <div
            className={cn(
              "absolute w-full backface-hidden rotate-y-180",
              isFlipped ? "visible" : "invisible"
            )}
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <Card className="p-3 aspect-[4/5] w-full flex flex-col">
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-base font-bold mb-1">{headline}</h3>
                <p className="text-xs whitespace-pre-line line-clamp-6">{storyBody}</p>
              </div>
              {footerNote && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {footerNote}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={() => setIsFlipped(!isFlipped)}
        className="mt-1"
        size="sm"
      >
        {isFlipped ? "Show Front" : "Show Back"}
      </Button>
    </div>
  );
} 