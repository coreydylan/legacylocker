import React from 'react';
import { useFadeOnScroll } from '@/hooks/use-fade-on-scroll';
import { motion } from 'framer-motion';
import { useSectionFade } from '@/contexts/SectionFadeContext';

interface FadeContentProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  duration?: number;
  delay?: number;
  isLastInSection?: boolean;
}

export const FadeContent: React.FC<FadeContentProps> = ({
  children,
  threshold = 0.3, // Start fading when element is 30% from the bottom of viewport
  rootMargin = '-30% 0px 0px 0px', // Offset the trigger point to 70% of viewport height
  duration = 400,
  delay = 0,
  isLastInSection = false,
}) => {
  const { ref, isVisible: isElementVisible } = useFadeOnScroll({ 
    threshold, 
    rootMargin,
    delayBeforeFade: 0
  });

  const { isVisible: isSectionVisible, setIsVisible: setSectionVisible } = useSectionFade();

  // If this is the last element in the section, its visibility controls the section
  React.useEffect(() => {
    if (isLastInSection) {
      setSectionVisible(isElementVisible);
    }
  }, [isLastInSection, isElementVisible, setSectionVisible]);

  // Use section visibility if this is not the last element
  const effectiveVisibility = isLastInSection ? isElementVisible : isSectionVisible;

  return (
    <motion.div 
      ref={ref}
      style={{
        opacity: effectiveVisibility ? 1 : 0,
        transition: `opacity ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </motion.div>
  );
}; 