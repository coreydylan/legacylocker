import React, { ReactNode } from 'react';
import { useFadeOnScroll } from '@/hooks/use-fade-on-scroll';
import { cn } from '@/lib/utils';

interface FadeOnScrollProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  excludeHero?: boolean;
  duration?: number;
  delay?: number;
  delayBeforeFade?: number;
  fadeDirection?: 'up' | 'down' | 'none';
}

export const FadeOnScroll: React.FC<FadeOnScrollProps> = ({
  children,
  className,
  threshold = 0.1,
  rootMargin = '0px',
  excludeHero = false,
  duration = 500,
  delay = 0,
  delayBeforeFade = 50,
  fadeDirection = 'none',
}) => {
  const { ref, isVisible } = useFadeOnScroll({ 
    threshold, 
    rootMargin,
    delayBeforeFade
  });

  // If this is the hero section and excludeHero is true, don't apply the fade effect
  if (excludeHero) {
    return <div className={className}>{children}</div>;
  }

  // Determine the transform based on fade direction
  const getTransform = () => {
    if (fadeDirection === 'none') return '';
    if (fadeDirection === 'up') return isVisible ? 'translateY(0)' : 'translateY(20px)';
    if (fadeDirection === 'down') return isVisible ? 'translateY(0)' : 'translateY(-20px)';
    return '';
  };

  return (
    <div className={className}>
      {children}
    </div>
  );
}; 