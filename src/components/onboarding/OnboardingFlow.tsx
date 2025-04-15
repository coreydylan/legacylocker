import React, { useEffect, useState } from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import RecipientSelector from './RecipientSelector';
import PurchaserInfo from './PurchaserInfo';
import RecipientInfo from './RecipientInfo';
import ShippingInfoCard from './ShippingInfoCard';
import EnvelopeAddresseeCard from './EnvelopeAddresseeCard';
// Import the specific flow components
import SignatureEditionFlow from './SignatureEditionFlow'; 
import CustomEditionFlow from './CustomEditionFlow';
import ConciergeEditionFlow from './ConciergeEditionFlow';
// CardCustomization might be part of Signature or used differently now
// import CardCustomization from './CardCustomization'; 
import ReviewCheckout from './ReviewCheckout';
import SaveProgressModal from './SaveProgressModal';
// import OnboardingHeader from './OnboardingHeader'; // <<< Remove Header import
import { SessionData, isValidSession } from '@/lib/sessionStore'; // Import SessionData for typing and isValidSession


// Define steps in our onboarding flow
const STEPS = {
  RECIPIENT_SELECTION: 1,
  PURCHASER_INFO: 2,
  RECIPIENT_INFO: 3,
  SHIPPING_INFO: 4,
  ENVELOPE_ADDRESSEE: 5,
  EDITION_DETAILS: 6,
  REVIEW_CHECKOUT: 7
} as const;

interface OnboardingFlowProps {
  // Removed editionName prop, should be handled by store initialization
  onBack?: () => void;
}

// Helper to check if data for a step is valid (more comprehensive)
const isStepDataValid = (session: SessionData | null | undefined, step: number): boolean => {
  if (!session) return false;
  if (step <= 0) return false;

  switch (step) {
    case STEPS.RECIPIENT_SELECTION:
      return true; 
    case STEPS.PURCHASER_INFO:
      return !!session.recipientType; 
    case STEPS.RECIPIENT_INFO:
      return !!session.purchaser?.fullName && !!session.purchaser?.email; 
    case STEPS.SHIPPING_INFO: 
      // Correct boolean check: returns true if *either* firstName or recipient1FirstName exists
      return !!session.recipient && (!!session.recipient.firstName || !!session.recipient.recipient1FirstName);
    case STEPS.ENVELOPE_ADDRESSEE:
      // Use the correct field name 'street' from the ShippingAddress interface
      return !!session?.recipient?.shippingAddress?.street; 
    case STEPS.EDITION_DETAILS:
      return !!session.recipient?.cardAddresseeName;
    case STEPS.REVIEW_CHECKOUT:
       if (!session.selectedEdition) return false;
       return true; // Placeholder
    default:
      return false;
  }
};

// Helper to find the first step for which data is *missing*
const findFirstIncompleteStep = (session: SessionData): number => {
  for (let i = 1; i <= STEPS.REVIEW_CHECKOUT; i++) {
    if (!isStepDataValid(session, i + 1)) { // Check if data for the *next* step is missing
      return i; // Return the current step as incomplete
    }
  }
  return STEPS.REVIEW_CHECKOUT; // If all steps are valid, return the last one
};

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ 
  onBack: externalOnBack
}) => {
  const {
    session,
    isLoading,
    initialize,
    setCurrentStep,
    nextStep,
    prevStep
  } = useSessionStore();
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  
  useEffect(() => {
    console.clear();
    console.log("OnboardingFlow: Initializing session...");
    initialize();
    
    // Don't include session in deps, it creates an infinite loop
  }, [initialize]); // Removed session from dependency array
  
  // Separate effect for logging session changes
  useEffect(() => {
    console.log("Session updated:", session);
  }, [session.updatedAt]);

  useEffect(() => {
    if (session?.updatedAt) {
      try {
        setLastSavedTime(new Date(session.updatedAt));
      } catch (e) {
        console.error("Failed to parse session updatedAt:", e);
        setLastSavedTime(null);
      }
    } else {
      setLastSavedTime(null);
    }
  }, [session?.updatedAt]);

  const handleSaveProgress = () => {
    console.log("OnboardingFlow: Save progress clicked - handled by store action");
    setShowSaveModal(true);
  };
  
  const handleBack = () => {
    console.log("OnboardingFlow: Back button clicked");
    if (externalOnBack) {
      externalOnBack();
    } else {
      prevStep();
    }
  };
  
  const handleClose = () => {
    console.log('OnboardingFlow: Close button clicked (logic handled by OnboardingModal)');
  };
  
  if (isLoading || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-legacy-cream">
        <div className="text-lg font-medium text-legacy-green animate-pulse">Loading Onboarding...</div>
      </div>
    );
  }
  
  // Render current step based on session.currentStep, validated
  const renderCurrentStep = () => {
    console.log(`OnboardingFlow: Attempting to render step ${session.currentStep}`);
    console.log(`OnboardingFlow: Current Session data:`, session);

    // Validate session and find first incomplete step before rendering
    let stepToRender = session.currentStep;
    if (!isValidSession(session)) {
        console.warn("Current session is invalid according to isValidSession, resetting to step 1");
        // If the whole session is invalid (e.g., stale), might need a reset mechanism
        // For now, let's try finding the first truly incomplete step based on data presence
        stepToRender = findFirstIncompleteStep(session);
        // setCurrentStep(stepToRender); // Optionally force store update
        console.log(`Redirecting to first incomplete step: ${stepToRender}`);
    }
    // Additional check: is the data needed *for* this step present?
    // This prevents rendering step 5 if step 4 data is missing
    if (!isStepDataValid(session, stepToRender)){
        console.warn(`Data for step ${stepToRender} is invalid. Finding previous valid step.`);
        stepToRender = findFirstIncompleteStep(session);
        console.log(`Redirecting to first incomplete step instead: ${stepToRender}`);
    }

    switch (stepToRender) { // Use validated stepToRender
      case STEPS.RECIPIENT_SELECTION:
        return <RecipientSelector />;

      case STEPS.PURCHASER_INFO:
        return <PurchaserInfo />;

      case STEPS.RECIPIENT_INFO:
        return <RecipientInfo />;

      case STEPS.SHIPPING_INFO:
        return <ShippingInfoCard />;

      case STEPS.ENVELOPE_ADDRESSEE:
        return <EnvelopeAddresseeCard />;

      case STEPS.EDITION_DETAILS:
        // Use selectedEdition.type from the session data
        const editionType = session.selectedEdition?.type; // Use .type directly
        console.log(`Rendering EDITION_DETAILS for edition type: ${editionType}`);
        
        switch (editionType) {
          case 'custom':
            return <CustomEditionFlow />;
          case 'concierge':
            return <ConciergeEditionFlow />;
          case 'signature':
            // Pass hideCustomization prop correctly
            return <SignatureEditionFlow hideCustomization={false} />;
          default:
            console.error(`Invalid or missing editionType: ${editionType}`);
            // Fallback or redirect logic
            return (
              <div className="flex flex-col items-center justify-center p-8">
                <p className="text-lg text-red-600 mb-4">Error: Edition details cannot be loaded.</p>
                <p>Please go back and select an edition.</p>
                {/* Optionally add a button to go back? */}
              </div>
            );
        }

      case STEPS.REVIEW_CHECKOUT:
        return <ReviewCheckout />;

      default:
        console.error(`OnboardingFlow: Unknown or invalid validated step number: ${stepToRender}`);
        // Fallback to the first step if something goes wrong
        // setCurrentStep(STEPS.RECIPIENT_SELECTION); // Careful with loops
        return <RecipientSelector />; // Render step 1 as fallback
    }
  };

  return (
    // Remove surrounding div if not needed, just render the step content
    // The parent (OnboardingModal) provides the main layout now
    <div className="flex-grow container mx-auto px-4 py-8">
      {/* <<< Remove OnboardingHeader rendering >>> */}
      {/* 
      <OnboardingHeader
        handleBack={handleBack}
        onClose={handleClose} 
        lastSavedTime={lastSavedTime}
        onSaveClick={handleSaveProgress}
      /> 
      */}

      {/* Render only the current step content */}
      {!isLoading && session ? renderCurrentStep() : null}

      {/* Pass the setLastSavedTime function to SaveProgressModal */}
      <SaveProgressModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        setLastSavedTime={setLastSavedTime}
      /> 
    </div>
  );
};

export default OnboardingFlow; 