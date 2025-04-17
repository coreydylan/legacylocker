import { useEffect, useRef, useState } from 'react';

interface UseFadeOnScrollOptions {
  threshold?: number;
  rootMargin?: string;
  delayBeforeFade?: number;
}

export const useFadeOnScroll = (options: UseFadeOnScrollOptions = {}) => {
  const { 
    threshold = 0.3,
    rootMargin = '-30% 0px 0px 0px',
    delayBeforeFade = 0
  } = options;
  
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Add a small delay before changing visibility
        timeoutRef.current = setTimeout(() => {
          setIsVisible(entry.isIntersecting);
        }, delayBeforeFade);
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [threshold, rootMargin, delayBeforeFade]);

  return { ref, isVisible };
}; 