import React from 'react';
import OnboardingNavigation from './OnboardingNavigation';
import OnboardingStepper from './OnboardingStepper';
import { useSessionStore } from '@/lib/sessionStore';

interface OnboardingHeaderProps {
  handleBack: () => void;
  onClose: () => void;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  handleBack,
  onClose,
}) => {
  const { session } = useSessionStore();
  const selectedEdition = session.selectedEdition;
  const currentStep = session.currentStep;

  // Common badge styling
  const badgeClasses = "px-2 py-0.5 bg-stone-200 text-stone-700 rounded-md text-xs font-medium whitespace-nowrap";

  return (
    <div className="sticky top-0 z-10 bg-white pb-3">
      <div className="flex items-center justify-between w-full px-6 py-4 bg-legacy-cream shadow-sm">
        <div className="w-1/4">
          <OnboardingNavigation
            handleBack={handleBack}
            onClose={onClose}
          />
        </div>
        <div className="w-2/4 flex justify-center items-center">
          <OnboardingStepper />
        </div>
        <div className="w-1/4 flex justify-end items-center space-x-4">
          {/* Removed the edition indicator div */}
        </div>
      </div>

      {/* Updated container for multiple badges - removed currentStep check */}
      {selectedEdition && (
        <div className="flex justify-center items-center pt-3 space-x-2">
          {selectedEdition.type === 'signature' && (
            <>
              <div className={badgeClasses}>Signature Edition</div>
              <div className={badgeClasses}>{selectedEdition.label || 'N/A'}</div>
            </>
          )}
          {selectedEdition.type === 'custom' && (
            <>
              <div className={badgeClasses}>Custom Edition</div>
              <div className={badgeClasses}>{selectedEdition.label || 'N/A'}</div>
            </>
          )}
          {selectedEdition.type === 'concierge' && (
            <div className={badgeClasses}>Concierge Edition</div>
          )}
        </div>
      )}
    </div>
  );
};

export default OnboardingHeader;
