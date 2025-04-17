import React from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import { useModalStore } from '@/lib/modalStore';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import SaveAndCloseButton from './SaveAndCloseButton'; // Reuse existing button
import { cn } from '@/lib/utils';

// <<< Define props interface >>>
interface MobileNavFooterProps {
  triggerModalClose: () => void;
}

const MobileNavFooter: React.FC<MobileNavFooterProps> = ({ triggerModalClose }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const {
    isCurrentStepValid,
    nextStep,
    prevStep,
    session,
    triggerSubmit,
    sessionMetadata, // <<< Add sessionMetadata
  } = useSessionStore((state) => ({
    isCurrentStepValid: state.isCurrentStepValid,
    nextStep: state.nextStep,
    prevStep: state.prevStep,
    session: state.session, // Needed for currentStep
    triggerSubmit: state.triggerSubmit, // <<< Get submit trigger action
    sessionMetadata: state.sessionMetadata, // <<< Get sessionMetadata
  }));
  const { closeOnboarding } = useModalStore(); // Get close action from modal store

  const currentStep = session.currentStep;
  const totalSteps = 8; // <<< Updated total steps
  const recipientInfoStep = 3; // Define the step number for recipient info

  // Close handler passed to SaveAndCloseButton
  // <<< Use the passed-in prop >>>
  const handleSaveAndClose = triggerModalClose;

  /**
   * Handle Continue button click on mobile.
   * If the current step contains a form element, submit it so that
   * the step component's onSubmit handler can persist data and call goNext().
   * If no form is present, just advance to the next step directly.
   */
  const handleContinue = () => {
    if (!isCurrentStepValid) return; // Guard, button should already be disabled

    // Try to find the first form inside the onboarding modal content
    const activeForm = document.querySelector('form');

    if (activeForm) {
      // requestSubmit triggers native form submission which will invoke
      // the React onSubmit handler defined in the component.
      // It's supported by modern browsers (including Safari 16+). Fallback to submit() if not.
      if (typeof (activeForm as HTMLFormElement).requestSubmit === 'function') {
        (activeForm as HTMLFormElement).requestSubmit();
      } else {
        (activeForm as HTMLFormElement).dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    } else {
      // No form on this step, advance using the store action
      nextStep();
    }
  };

  // Don't render anything on desktop
  if (!isMobile) {
    return null;
  }

  // Don't render if session isn't active (e.g., before step 1 completes)
  // This mirrors the logic in OnboardingModal for the SaveAndCloseButton
  // Adjust this condition if the footer should appear earlier/later
  // if (!sessionMetadata.isActive) { 
  //   return null;
  // }
  // Decided to always show footer on mobile when modal is open for now

  return (
    // Add mask-image for top gradient fade
    <div className={cn(
      "fixed bottom-0 left-0 z-20 w-full bg-white/80 backdrop-blur-sm shadow-lg",
      // Apply mask: solid black (opaque mask) for bottom 90%, fades to transparent at the top 10%
      "[mask-image:linear-gradient(to_top,black_90%,transparent_100%)]",
      "[-webkit-mask-image:linear-gradient(to_top,black_90%,transparent_100%)]" // Include -webkit prefix for broader compatibility
    )}>
      <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-4">
        {/* Save & Finish Later Button (conditionally visible) */}
        <div className="min-w-[168px]"> {/* Wrapper to prevent layout shift */}
          {sessionMetadata.isActive && (
            <SaveAndCloseButton onClose={handleSaveAndClose} />
          )}
        </div>

        {/* Back and Continue Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevStep}
            disabled={currentStep === 1}
            aria-label="Go back"
            className="border-legacy-green text-legacy-green hover:bg-legacy-green/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          {currentStep < totalSteps ? (
            <Button
              variant="default"
              onClick={handleContinue}
              disabled={!isCurrentStepValid}
              className="bg-legacy-green hover:bg-legacy-green/90 px-4 py-2 text-sm font-medium"
            >
              Continue
            </Button>
          ) : (
            // Final step button
             <Button
              variant="default"
              onClick={triggerSubmit} // <<< Call triggerSubmit action
              aria-label="Place Order Now"
              // Consider adding disabled state based on payment readiness/submission status if needed
              className="bg-legacy-green hover:bg-legacy-green/90 px-4 py-2 text-sm font-medium" 
            >
              {/* Updated text */}
              Place Order Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNavFooter; 