import React from 'react';
import OnboardingNavigation from './OnboardingNavigation';
import SaveProgressButton from './SaveProgressButton';
import StepProgress from './StepProgress';
import { useSessionStore } from '@/lib/sessionStore';

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps: number;
  handleBack: () => void;
  onClose: () => void;
  setCurrentStep: (step: number) => void;
  lastSavedTime?: Date | null;
  onSaveClick: () => void;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  currentStep,
  totalSteps,
  handleBack,
  onClose,
  setCurrentStep,
  lastSavedTime,
  onSaveClick
}) => {
  return (
    <div className="flex items-center justify-between w-full px-6 py-4 bg-legacy-cream shadow-sm sticky top-0 z-10">
      <div className="w-1/3">
        <OnboardingNavigation
          currentStep={currentStep}
          handleBack={handleBack}
          onClose={onClose}
        />
      </div>
      <div className="w-1/3 flex justify-center">
        <StepProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          setCurrentStep={setCurrentStep}
        />
      </div>
      <div className="w-1/3 flex justify-end">
        <SaveProgressButton
          onClick={onSaveClick}
          lastSavedTime={lastSavedTime}
        />
      </div>
    </div>
  );
};

export default OnboardingHeader;
