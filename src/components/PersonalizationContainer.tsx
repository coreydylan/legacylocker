import React from 'react';
import { SessionProvider } from '@/contexts/SessionContext';
import OnboardingFlow from './onboarding/OnboardingFlow';

interface PersonalizationContainerProps {
  editionName?: string;
  onBack?: () => void;
}

const PersonalizationContainer: React.FC<PersonalizationContainerProps> = ({ 
  editionName,
  onBack
}) => {
  return (
    <SessionProvider>
      <OnboardingFlow 
        editionName={editionName}
        onBack={onBack}
      />
    </SessionProvider>
  );
};

export default PersonalizationContainer; 