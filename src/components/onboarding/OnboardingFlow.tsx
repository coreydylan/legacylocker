import React, { useEffect } from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import RecipientSelector from './RecipientSelector';
import PurchaserInfo from './PurchaserInfo';
import RecipientInfo from './RecipientInfo';
import CardCustomization from './CardCustomization';
import ReviewCheckout from './ReviewCheckout';
import SaveProgressModal from './SaveProgressModal';
import OnboardingHeader from './OnboardingHeader';
import { cn } from '@/lib/utils';

// Define steps in our onboarding flow
const STEPS = {
  RECIPIENT_SELECTION: 1,
  PURCHASER_INFO: 2,
  RECIPIENT_INFO: 3,
  CARD_CUSTOMIZATION: 4,
  REVIEW_CHECKOUT: 5
} as const;

type Step = typeof STEPS[keyof typeof STEPS];

interface OnboardingFlowProps {
  editionName?: string;
  onBack?: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  editionName,
  onBack: externalOnBack
}) => {
  // Get state and actions from Zustand store
  const {
    session,
    isLoading,
    initialize,
    updateSession,
    setCurrentStep,
    nextStep,
    prevStep
  } = useSessionStore();
  
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [lastSavedTime, setLastSavedTime] = React.useState<Date | null>(null);
  
  // Initialize session on component mount
  useEffect(() => {
    // Clear console on mount for cleaner debugging
    console.clear();
    console.log("OnboardingFlow: Initializing session...");
    initialize();
    
    // If edition name is provided, update the session
    if (editionName) {
      updateSession('editionName', editionName);
    }
  }, [initialize, editionName, updateSession]);
  
  // Update last saved time display based on session updates
  useEffect(() => {
    if (session.updatedAt) {
      try {
        setLastSavedTime(new Date(session.updatedAt));
      } catch (e) {
        console.error("Failed to parse session updatedAt:", e);
        setLastSavedTime(null);
      }
    }
  }, [session.updatedAt]);
  
  // Handle saving progress
  const handleSaveProgress = () => {
    console.log("OnboardingFlow: Save progress clicked");
    setShowSaveModal(true);
  };
  
  // Handle save with email
  const handleSaveWithEmail = (email: string) => {
    console.log("OnboardingFlow: Saving session with email -", email);
    // Persist email directly in session for potential resume link
    updateSession('email', email);
    // Also update purchaser email if not already set
    if (!session.purchaser?.email) {
      updateSession('purchaser.email', email);
    }
    setLastSavedTime(new Date()); // Update display immediately
    setShowSaveModal(false);
    // NOTE: updateSession already calls saveSession internally
  };
  
  // Handle back button - use external handler if provided
  const handleBack = () => {
    console.log("OnboardingFlow: Back button clicked");
    if (externalOnBack) {
      externalOnBack();
    } else {
      prevStep();
    }
  };
  
  // Handle closing onboarding
  const handleClose = () => {
    console.log('OnboardingFlow: Close button clicked (implement confirmation?)');
    // TODO: Implement confirmation dialog before closing
    // Potentially resetSession() or navigate away
  };
  
  // Skip recipient info step if gift is for self
  useEffect(() => {
    if (session.recipientType === 'myself' && session.currentStep === STEPS.RECIPIENT_INFO) {
      console.log("OnboardingFlow: Skipping recipient info for 'myself' gift type");
      nextStep(); // Skip to card customization
    }
  }, [session.recipientType, session.currentStep, nextStep]);
  
  // Display loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-legacy-cream">
        <div className="text-lg font-medium text-legacy-green animate-pulse">Loading Onboarding...</div>
      </div>
    );
  }
  
  // Render current step based on session.currentStep
  const renderCurrentStep = () => {
    console.log(`OnboardingFlow: Rendering step ${session.currentStep}`);
    switch (session.currentStep) {
      case STEPS.RECIPIENT_SELECTION:
        // RecipientSelector now gets state from store, doesn't need props
        return <RecipientSelector />;

      case STEPS.PURCHASER_INFO:
        // PurchaserInfo now gets state from store
        return <PurchaserInfo />;

      case STEPS.RECIPIENT_INFO:
        // Assuming RecipientInfo will be refactored similarly
        // TODO: Refactor RecipientInfo to use useSessionStore
        // @ts-ignore - Temporarily ignore props mismatch until refactored
        return <RecipientInfo />;

      case STEPS.CARD_CUSTOMIZATION:
        // Assuming CardCustomization will be refactored similarly
        // TODO: Refactor CardCustomization to use useSessionStore
        // @ts-ignore - Temporarily ignore props mismatch until refactored
        return <CardCustomization />;

      case STEPS.REVIEW_CHECKOUT:
        // ReviewCheckout might need session data directly or use the store
        // TODO: Refactor ReviewCheckout to use useSessionStore if possible
        // @ts-ignore - Temporarily ignore props mismatch until refactored
        return <ReviewCheckout sessionData={session} />; // Pass session for now

      default:
        console.error(`OnboardingFlow: Unknown step number: ${session.currentStep}`);
        // Fallback to step 1 if currentStep is invalid
        setCurrentStep(STEPS.RECIPIENT_SELECTION);
        return <RecipientSelector />;
    }
  };

  return (
    <div className="min-h-screen bg-legacy-cream flex flex-col">
      <OnboardingHeader
        // Pass necessary state and handlers to the header
        currentStep={session.currentStep}
        totalSteps={Object.keys(STEPS).length}
        handleBack={handleBack}
        onClose={handleClose}
        setCurrentStep={setCurrentStep} // Allow header navigation
        lastSavedTime={lastSavedTime} // For display in SaveProgressButton
        onSaveClick={handleSaveProgress} // To trigger the save modal
      />

      {/* Main content area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Render step only when not loading and session is available */}
        {!isLoading && session ? renderCurrentStep() : null}
      </main>

      <SaveProgressModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        formData={session}
        onSaveProgress={async (email, data) => {
          handleSaveWithEmail(email);
          return true;
        }}
        setLastSavedTime={setLastSavedTime}
      />
    </div>
  );
};

export default OnboardingFlow; 