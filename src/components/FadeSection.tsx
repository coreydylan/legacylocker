import React from 'react';
import { SectionFadeProvider } from '@/contexts/SectionFadeContext';

interface FadeSectionProps {
  children: React.ReactNode;
}

export const FadeSection: React.FC<FadeSectionProps> = ({ children }) => {
  return (
    <SectionFadeProvider>
      {children}
    </SectionFadeProvider>
  );
}; 