import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { FlipHorizontal } from 'lucide-react';

interface SamplePreviewProps {
  headline: string;
  subtitle?: string;
  badgeText?: string;
  storyBody: string;
  footerNote?: string;
  imageUrl?: string;
  emoji?: string;
  className?: string;
}

export function SamplePreview({
  headline,
  subtitle,
  badgeText,
  storyBody,
  footerNote,
  imageUrl,
  emoji,
  className,
}: SamplePreviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="relative aspect-[4/6] w-full">
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500 transform-gpu",
            isFlipped ? "rotate-y-180" : ""
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card */}
          <Card
            className={cn(
              "absolute inset-0 overflow-hidden",
              isFlipped ? "invisible" : ""
            )}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={headline}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <p className="text-gray-400">No image uploaded</p>
              </div>
            )}
            {badgeText && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                {badgeText}
              </div>
            )}
          </Card>

          {/* Back of card */}
          <Card
            className={cn(
              "absolute inset-0 p-6 flex flex-col",
              isFlipped ? "" : "invisible"
            )}
            style={{ transform: "rotateY(180deg)" }}
          >
            <h3 className="text-xl font-semibold mb-1">{headline}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
            )}
            <p className="text-sm text-gray-600 flex-grow">{storyBody}</p>
            {footerNote && (
              <p className="text-xs text-gray-500 mt-4">{footerNote}</p>
            )}
          </Card>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <FlipHorizontal className="h-4 w-4 mr-2" />
        Flip to {isFlipped ? "front" : "back"}
      </Button>
    </div>
  );
} 