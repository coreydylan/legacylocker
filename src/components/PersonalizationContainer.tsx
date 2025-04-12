import React from 'react';
import { SessionProvider } from '@/contexts/SessionContext';
import OnboardingFlow from './onboarding/OnboardingFlow';

const PersonalizationContainer: React.FC = () => {
  return (
    <SessionProvider>
      <OnboardingFlow />
    </SessionProvider>
  );
};

export default PersonalizationContainer; 