import React from 'react';
import OnboardingStepper from './OnboardingStepper';
import { useSessionStore } from '@/lib/sessionStore';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface OnboardingHeaderProps {
  handleBack: () => void;
  onClose: () => void;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  handleBack,
  onClose,
}) => {
  const { session, nextStep } = useSessionStore();
  const selectedEdition = session.selectedEdition;
  const currentStep = session.currentStep;

  // TODO: Define total steps dynamically later if needed
  const totalSteps = 7; // Assuming 7 steps for now

  // Common badge styling
  const badgeClasses = "px-2 py-0.5 bg-stone-200 text-stone-700 rounded-md text-xs font-medium whitespace-nowrap";

  return (
    <div className="sticky top-0 z-10 bg-white pb-3">
      <div className="flex items-center justify-between w-full px-4 py-4 bg-legacy-cream shadow-sm gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 flex-shrink-0"
            aria-label="Close onboarding"
          >
            <X className="h-6 w-6" />
          </Button>
          {currentStep > 1 ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="text-legacy-green hover:bg-legacy-green/10 flex-shrink-0"
              aria-label="Go back"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          ) : (
            <div className="w-10 h-10 flex-shrink-0"></div>
          )}
        </div>

        <div className="flex-1 flex justify-center items-center min-w-0">
          <OnboardingStepper />
        </div>

        {currentStep < totalSteps ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={nextStep}
            className="text-legacy-green hover:bg-legacy-green/10 flex-shrink-0"
            aria-label="Go next"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        ) : (
          <div className="w-10 h-10 flex-shrink-0"></div>
        )}
      </div>

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
