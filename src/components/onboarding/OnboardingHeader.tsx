import React from 'react';
import OnboardingNavigation from './OnboardingNavigation';
import SaveProgressButton from './SaveProgressButton';
import StepProgress from './StepProgress';
import { useSessionStore } from '@/lib/sessionStore';
import { useOnboardingNavigation, STEPS } from '@/hooks/useOnboardingNavigation';

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
  const { currentStep } = useOnboardingNavigation();
  const selectedSeries = session.selectedSeries;

  // Get step name based on current step
  const getStepName = () => {
    switch (currentStep) {
      case STEPS.STORY_SERIES_SELECTOR:
        return 'Select Series';
      case STEPS.INTRODUCTION:
        return 'Introduction';
      case STEPS.PURCHASER_INFO:
        return 'Your Info';
      case STEPS.RECIPIENT_INFO:
        return 'Recipient Info';
      case STEPS.SHIPPING_INFO:
        return 'Shipping';
      case STEPS.ENVELOPE_PERSONALIZATION:
        return 'Personalization';
      case STEPS.SIGNATURE_EDITION_DETAILS:
        return 'Details';
      case STEPS.REVIEW_CHECKOUT:
        return 'Review & Checkout';
      default:
        return 'Step ' + currentStep;
    }
  };

  return (
    <div className="flex items-center justify-between w-full px-6 py-4 bg-legacy-cream shadow-sm sticky top-0 z-10">
      <div className="w-1/4">
        <OnboardingNavigation
          handleBack={handleBack}
          onClose={onClose}
        />
      </div>
      <div className="w-2/4 flex justify-center">
        <StepProgress />
      </div>
      <div className="w-1/4 flex justify-end items-center space-x-4">
        {selectedSeries && currentStep > STEPS.STORY_SERIES_SELECTOR && (
          <div className="rounded-full border px-2 py-0.5 text-xs font-medium text-muted-foreground border-muted whitespace-nowrap">
            {selectedSeries.type === 'signature' ? 'Signature' : 
             selectedSeries.type === 'custom' ? 'Custom' : 
             'Concierge'} • {selectedSeries.display}
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
