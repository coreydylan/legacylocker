import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SamplePreviewProps {
  imageUrl?: string;
  className?: string;
}

export function SamplePreview({
  imageUrl,
  className,
}: SamplePreviewProps) {
  console.log('(Simplified) SamplePreview received imageUrl:', imageUrl);

  return (
    <div className={cn("w-full", className)}>
      <Card className="overflow-hidden aspect-[2/3] w-full">
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
  );
} 