import React from 'react';
// import { SessionProvider } from '@/contexts/SessionContext'; // Remove unused import
import OnboardingFlow from './onboarding/OnboardingFlow';

interface PersonalizationContainerProps {
  editionName?: string; // Keep passing editionName
  onBack?: () => void;
}

const PersonalizationContainer: React.FC<PersonalizationContainerProps> = ({ 
  editionName,
  onBack
}) => {
  // The editionName/selectedSeries is now initialized within OnboardingModal/OnboardingFlow
  // using the store. We just need to render the flow.
  return (
    // Remove SessionProvider wrapper
    <OnboardingFlow 
      // Pass onBack if needed by OnboardingFlow
      onBack={onBack}
      // NOTE: OnboardingFlow itself no longer takes editionName prop
      // It relies on the initialization logic using useSessionStore
    />
  );
};

export default PersonalizationContainer; 