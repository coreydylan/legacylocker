import React from 'react';
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
  return (
    <Card className="overflow-hidden aspect-[4/5] w-full max-w-[200px] mx-auto">
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
  );
} 