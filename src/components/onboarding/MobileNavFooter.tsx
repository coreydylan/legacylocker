import React from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import { useModalStore } from '@/lib/modalStore';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import SaveAndCloseButton from './SaveAndCloseButton'; // Reuse existing button
import { cn } from '@/lib/utils';

const MobileNavFooter: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const {
    isCurrentStepValid,
    nextStep,
    prevStep,
    session,
    triggerSubmit
  } = useSessionStore(state => ({
    isCurrentStepValid: state.isCurrentStepValid,
    nextStep: state.nextStep,
    prevStep: state.prevStep,
    session: state.session, // Needed for currentStep
    triggerSubmit: state.triggerSubmit // <<< Get trigger action
  }));
  const { closeOnboarding } = useModalStore(); // Get close action from modal store

  const currentStep = session.currentStep;
  const totalSteps = 7; // Assuming 7 steps, adjust if needed
  const recipientInfoStep = 3; // Define the step number for recipient info

  // Function to handle Save & Close, similar to OnboardingModal
  const handleSaveAndClose = () => {
    // Note: This assumes saveSession is implicitly called by button/store
    // If not, add saveSession() call here.
    closeOnboarding(); 
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
        {/* <<< Conditionally Render Save & Finish Later Button >>> */}
        {currentStep > recipientInfoStep ? (
          <SaveAndCloseButton onClose={handleSaveAndClose} />
        ) : (
          // <<< Placeholder to maintain layout balance when button is hidden >>>
          <div className="w-auto opacity-0 pointer-events-none">
            {/* Render a dummy button or fixed-width element if exact spacing needed */} 
            <Button variant="secondary" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span>Save & Finish Later</span>
            </Button>
          </div>
        )}
        
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
              onClick={nextStep}
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