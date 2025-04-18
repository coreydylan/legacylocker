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
  const recipient = session.recipient;

  // Define the recipient info step number
  const RECIPIENT_INFO_STEP = 3;

  // TODO: Define total steps dynamically later if needed
  const totalSteps = 7; // Assuming 7 steps for now

  // Common badge styling - Base style for the container
  const badgeClasses = "px-2 py-0.5 bg-legacy-green/10 text-legacy-green rounded-md whitespace-nowrap";

  return (
    <div className="sticky top-0 z-30 bg-legacy-green/5 backdrop-blur-sm min-h-[80px] sm:min-h-[120px]">
      {selectedEdition && (
        <div className="w-full max-w-3xl mx-auto flex flex-row items-center gap-2 mb-4 sm:mb-6 pt-2 sm:pt-3 px-4">
          {/* First tag: Add flex-1 to make it expand */}
          <div className={cn(badgeClasses, "flex-1 text-center truncate text-sm uppercase font-semibold")}>
            {
              // Dynamic text for Signature after Recipient Info step
              selectedEdition.type === 'signature' && 
              currentStep > RECIPIENT_INFO_STEP && 
              (recipient?.firstName || recipient?.recipient1FirstName) 
                ? `SIGNATURE EDITION FOR ${recipient.firstName || recipient.recipient1FirstName}`
                // Standard text
                : selectedEdition.type === 'concierge' 
                  ? 'Concierge Edition' 
                  : `${selectedEdition.type} Edition`
            }
          </div>
          {/* Second tag: Add flex-1 to make it expand */}
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
          className="absolute left-4 z-40 text-gray-500 hover:text-gray-700 flex-shrink-0 mt-0.5"
          aria-label="Close onboarding"
        >
          <X className="h-5 w-5" />
        </Button>
        {/* Container ignores pointer events so it doesn't block clicks on the close button */}
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 flex items-center w-full max-w-[90%] sm:max-w-none">
          {/* Stepper itself re‑enables pointer events for interactivity */}
          <div className="pointer-events-auto w-full">
            <OnboardingStepper />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingHeader;
