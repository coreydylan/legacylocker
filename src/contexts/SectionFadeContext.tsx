import React, { createContext, useContext, useState } from 'react';

interface SectionFadeContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const SectionFadeContext = createContext<SectionFadeContextType | undefined>(undefined);

export const SectionFadeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <SectionFadeContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </SectionFadeContext.Provider>
  );
};

export const useSectionFade = () => {
  const context = useContext(SectionFadeContext);
  if (!context) {
    throw new Error('useSectionFade must be used within a SectionFadeProvider');
  }
  return context;
}; 