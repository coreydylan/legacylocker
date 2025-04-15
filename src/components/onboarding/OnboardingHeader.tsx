import React from 'react';
import OnboardingNavigation from './OnboardingNavigation';
import SaveProgressButton from './SaveProgressButton';
import OnboardingStepper from './OnboardingStepper';
import { useSessionStore } from '@/lib/sessionStore';

interface OnboardingHeaderProps {
  handleBack: () => void;
  onClose: () => void;
  onSaveClick: () => void;
  lastSavedTime?: Date | null;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  handleBack,
  onClose,
  lastSavedTime,
  onSaveClick
}) => {
  const { session } = useSessionStore();
  const selectedEdition = session.selectedEdition;
  const currentStep = session.currentStep;

  return (
    <div className="flex items-center justify-between w-full px-6 py-4 bg-legacy-cream shadow-sm sticky top-0 z-10">
      <div className="w-1/4">
        <OnboardingNavigation
          handleBack={handleBack}
          onClose={onClose}
        />
      </div>
      <div className="w-2/4 flex justify-center">
        <OnboardingStepper />
      </div>
      <div className="w-1/4 flex justify-end items-center space-x-4">
        {selectedEdition && currentStep > 1 && (
          <div className="hidden sm:block rounded-full border px-2 py-0.5 text-xs font-medium text-muted-foreground border-muted whitespace-nowrap">
            {selectedEdition.type === 'signature' ? 'Signature' : 
             selectedEdition.type === 'custom' ? 'Custom' : 
             'Concierge'} • {selectedEdition.label}
          </div>
        )}
        <SaveProgressButton
          onClick={onSaveClick}
          lastSavedTime={lastSavedTime}
        />
      </div>
    </div>
  );
};

export default OnboardingHeader;
