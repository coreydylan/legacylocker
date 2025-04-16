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
  console.log("--- Rendering OnboardingFlow ---");
  const {
    session,
    isLoading,
    initialize,
    setCurrentStep,
    nextStep,
    prevStep,
    updateValidationStatus
  } = useSessionStore();
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  
  useEffect(() => {
    console.log("OnboardingFlow: Initializing session (in useEffect)...");
    initialize();
  }, [initialize]);
  
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
  
  console.log(`OnboardingFlow: isLoading=${isLoading}, session defined=${!!session}`);
  if (isLoading || !session) {
    console.log("OnboardingFlow: Rendering Loading State");
    return (
      <div className="flex items-center justify-center min-h-screen bg-legacy-cream">
        <div className="text-lg font-medium text-legacy-green animate-pulse">Loading Onboarding...</div>
      </div>
    );
  }
  
  // Render current step based on session.currentStep, validated
  const renderCurrentStep = () => {
    console.log(`OnboardingFlow: Attempting to render step ${session.currentStep}`);
    console.log(`OnboardingFlow: Current Session data:`, JSON.stringify(session));

    let stepToRender = session.currentStep;
    const isSessionValid = isValidSession(session);
    console.log(`OnboardingFlow: isValidSession result: ${isSessionValid}`);
    if (!isSessionValid) {
        console.warn("Current session is invalid according to isValidSession, finding first incomplete step");
        stepToRender = findFirstIncompleteStep(session);
        console.log(`Redirecting to first incomplete step: ${stepToRender}`);
    }
    
    const isDataValidForStep = isStepDataValid(session, stepToRender);
    console.log(`OnboardingFlow: isStepDataValid for step ${stepToRender}: ${isDataValidForStep}`);
    if (!isDataValidForStep){
        console.warn(`Data for step ${stepToRender} is invalid. Finding first incomplete step.`);
        stepToRender = findFirstIncompleteStep(session);
        console.log(`Redirecting to first incomplete step instead: ${stepToRender}`);
    }

    console.log(`OnboardingFlow: Final step to render: ${stepToRender}`);

    // <<< Add effect to manage validation status for the specific step >>>
    useEffect(() => {
        console.log(`[ValidationEffect] Running for stepToRender: ${stepToRender}, editionType: ${session.selectedEdition?.type}`);
        // Step 6 (EDITION_DETAILS) is generally considered valid immediately,
        // especially for Signature/Concierge where user input isn't strictly required to proceed.
        // Custom requires all months complete, which is handled internally by CustomEditionFlow.
        if (stepToRender === STEPS.EDITION_DETAILS) {
            const editionType = session.selectedEdition?.type;
            if (editionType === 'signature' || editionType === 'concierge') {
                console.log(`[ValidationEffect] Step ${stepToRender} (${editionType}) is active, CALLING updateValidationStatus(true).`);
                updateValidationStatus(true);
            } else {
                console.log(`[ValidationEffect] Step ${stepToRender} (${editionType}) is active, but validation handled by component.`);
            }
        } 
        // You might add else if clauses here for other steps that should be
        // considered valid immediately upon rendering, if any.
        else {
            // For other steps, rely on the component's internal logic to set validation
            console.log(`[ValidationEffect] Step ${stepToRender} is not EDITION_DETAILS, validation handled by component.`);
            // updateValidationStatus(false); // Optionally reset if needed, but might cause flashes
        }
    }, [stepToRender, session.selectedEdition?.type, updateValidationStatus]);

    switch (stepToRender) {
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
        console.log(`OnboardingFlow: No matching component for step ${stepToRender}, rendering null`);
        return null;
    }
  };

  console.log("OnboardingFlow: Rendering step content area");
  return (
    <div className="flex-grow container mx-auto px-4 pt-4 pb-8 md:pt-8">
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