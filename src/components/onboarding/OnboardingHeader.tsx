import React from 'react';
import OnboardingStepper from './OnboardingStepper';
import { useSessionStore } from '@/lib/sessionStore';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from '@/lib/utils';

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

  // Common badge styling - Base style for the container
  const badgeClasses = "px-2 py-0.5 bg-legacy-green/10 text-legacy-green rounded-md whitespace-nowrap";

  return (
    <div className="sticky top-0 z-10 bg-legacy-green/5 backdrop-blur-sm min-h-[80px] sm:min-h-[120px]">
      {selectedEdition && (
        <div className="max-w-xl mx-auto flex gap-2 mb-4 sm:mb-6 pt-2 sm:pt-3 px-4">
          {/* Tag 1: General Edition Type */}
          <div className={cn(badgeClasses, "flex-1 text-center truncate text-sm uppercase font-semibold")}>
            {selectedEdition.type === 'concierge' ? 'Concierge Edition' : `${selectedEdition.type} Edition`}
          </div>
          {/* Tag 2: Display naturalLanguageName or fallback to label */}
          {selectedEdition.type !== 'concierge' && (
             <div className={cn(badgeClasses, "flex-1 text-center truncate text-sm uppercase font-semibold")} title={selectedEdition.label || ''}>
              {/* Use naturalLanguageName, fallback to label */}
              {selectedEdition.naturalLanguageName || selectedEdition.label || ''}
            </div>
          )}
        </div>
      )}

      <div className="relative flex items-center w-full px-2 py-3 sm:py-4 md:py-6 gap-2 mt-2 sm:mt-4 border-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute left-4 text-gray-500 hover:text-gray-700 flex-shrink-0 mt-0.5"
          aria-label="Close onboarding"
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center w-full max-w-[90%] sm:max-w-none">
          <OnboardingStepper />
        </div>
      </div>
    </div>
  );
};

export default OnboardingHeader;
