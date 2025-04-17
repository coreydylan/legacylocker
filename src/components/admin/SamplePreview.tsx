import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SamplePreviewProps {
  imageUrl?: string;
  className?: string;
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SamplePreview({
  imageUrl,
  className,
  isFlipped,
  setIsFlipped,
}: SamplePreviewProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative w-full max-w-[200px] mx-auto" style={{ perspective: "1000px" }}>
        <div
          className={cn(
            "relative w-full h-full transition-all duration-500 transform-style-3d aspect-[4/5]",
            isFlipped ? "rotate-y-180" : ""
          )}
        >
          <div className="absolute w-full h-full backface-hidden">
            <Card className="overflow-hidden w-full h-full">
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

          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <Card className="w-full h-full bg-muted">
              {/* Content removed */}
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