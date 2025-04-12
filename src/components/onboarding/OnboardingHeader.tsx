import React from 'react';
import OnboardingNavigation from './OnboardingNavigation';
import SaveProgressButton from './SaveProgressButton';
import StepProgress from './StepProgress';

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
  return (
    <div className="flex items-center justify-between w-full px-6 py-4 bg-legacy-cream shadow-sm sticky top-0 z-10">
      <div className="w-1/3">
        <OnboardingNavigation
          handleBack={handleBack}
          onClose={onClose}
        />
      </div>
      <div className="w-1/3 flex justify-center">
        <StepProgress />
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
