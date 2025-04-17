import React, { useEffect, useState } from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import RecipientSelector from './RecipientSelector';
import PurchaserInfo from './PurchaserInfo';
import RecipientInfo from './RecipientInfo';
import ShippingInfoCard from './ShippingInfoCard';
import EnvelopeAddresseeCard from './EnvelopeAddresseeCard';
// Import the specific flow components
// import SignatureEditionFlow from './SignatureEditionFlow'; // <<< Remove deleted import
import CustomEditionFlow from './CustomEditionFlow';
import ConciergeEditionFlow from './ConciergeEditionFlow';
// CardCustomization might be part of Signature or used differently now
// import CardCustomization from './CardCustomization'; 
import ReviewCheckout from './ReviewCheckout';
import SaveProgressModal from './SaveProgressModal';
// import OnboardingHeader from './OnboardingHeader'; // <<< Remove Header import
import { SessionData, isValidSession } from '@/lib/sessionStore'; // Import SessionData for typing and isValidSession
// <<< Import new/renamed step components (will be created next) >>>
import WelcomeCardStep from './WelcomeCardStep';
import MonthlyCustomizationStep from './MonthlyCustomizationStep';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';


// Define steps in our onboarding flow - <<< Updated Steps >>>
const STEPS = {
  RECIPIENT_SELECTION: 1,
  PURCHASER_INFO: 2,
  RECIPIENT_INFO: 3,
  SHIPPING_INFO: 4,
  ENVELOPE_ADDRESSEE: 5,
  WELCOME_CARD: 6, // Renamed from EDITION_DETAILS
  MONTHLY_CUSTOMIZATION: 7, // New step for grid/notes
  REVIEW_CHECKOUT: 8 // Incremented
} as const;

interface OnboardingFlowProps {
  // Removed editionName prop, should be handled by store initialization
  onBack?: () => void;
}

// Helper to check if data for a step is valid (more comprehensive) - <<< Updated Logic >>>
const isStepDataValid = (session: SessionData | null | undefined, step: number): { isValid: boolean; errorMessage?: { title: string; description: string } } => {
  if (!session) return { isValid: false };
  if (step <= 0) return { isValid: false };

  switch (step) {
    case STEPS.RECIPIENT_SELECTION:
      return { isValid: true }; 
    case STEPS.PURCHASER_INFO:
      return { isValid: !!session.recipientType }; 
    case STEPS.RECIPIENT_INFO:
      return { isValid: !!session.purchaser?.fullName && !!session.purchaser?.email }; 
    case STEPS.SHIPPING_INFO: 
      return { isValid: !!session.recipient && (!!session.recipient.firstName || !!session.recipient.recipient1FirstName) }; 
    case STEPS.ENVELOPE_ADDRESSEE:
      return { isValid: !!session?.recipient?.shippingAddress?.street }; 
    case STEPS.WELCOME_CARD:
      // Only check cardAddresseeName if we have a selectedEdition
      if (!session.selectedEdition) {
        return { 
          isValid: false,
          errorMessage: {
            title: "Edition Required",
            description: "Please select an edition type before proceeding."
          }
        };
      }
      return { isValid: !!session.recipient?.cardAddresseeName }; 
    case STEPS.MONTHLY_CUSTOMIZATION:
      if (!session.selectedEdition) {
        return { 
          isValid: false,
          errorMessage: {
            title: "Edition Required",
            description: "Please select an edition type before proceeding to customization."
          }
        };
      }
      if (!session.selectedEdition.type) {
        return { 
          isValid: false,
          errorMessage: {
            title: "Edition Type Required",
            description: "Please select an edition type before proceeding to customization."
          }
        };
      }
      const prevStepValid = isStepDataValid(session, STEPS.WELCOME_CARD).isValid;
      return { isValid: prevStepValid }; 
    case STEPS.REVIEW_CHECKOUT:
      if (!session.selectedEdition) {
        return { 
          isValid: false,
          errorMessage: {
            title: "Edition Required",
            description: "Please select an edition type before proceeding to review."
          }
        };
      }
      const prevStepValid2 = isStepDataValid(session, STEPS.MONTHLY_CUSTOMIZATION).isValid;
      return { isValid: prevStepValid2 }; 
    default:
      return { isValid: false };
  }
};

// Helper to find the first step for which data is *missing* - <<< Updated Logic >>>
const findFirstIncompleteStep = (session: SessionData): number => {
  // First check if we have a selectedEdition
  if (!session.selectedEdition) {
    return STEPS.RECIPIENT_SELECTION;
  }

  // Then check steps sequentially
  if (!isStepDataValid(session, STEPS.PURCHASER_INFO).isValid) return STEPS.RECIPIENT_SELECTION;
  if (!isStepDataValid(session, STEPS.RECIPIENT_INFO).isValid) return STEPS.PURCHASER_INFO;
  if (!isStepDataValid(session, STEPS.SHIPPING_INFO).isValid) return STEPS.RECIPIENT_INFO;
  if (!isStepDataValid(session, STEPS.ENVELOPE_ADDRESSEE).isValid) return STEPS.SHIPPING_INFO;
  if (!isStepDataValid(session, STEPS.WELCOME_CARD).isValid) return STEPS.ENVELOPE_ADDRESSEE;
  if (!isStepDataValid(session, STEPS.MONTHLY_CUSTOMIZATION).isValid) return STEPS.WELCOME_CARD;
  if (!isStepDataValid(session, STEPS.REVIEW_CHECKOUT).isValid) return STEPS.MONTHLY_CUSTOMIZATION;
  
  return STEPS.REVIEW_CHECKOUT; // If all valid, default to last step
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
  const { toast } = useToast();
  
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  
  // --- Calculate Step to Render --- 
  let stepToRender = session?.currentStep ?? STEPS.RECIPIENT_SELECTION;
  if (session) {
    const isSessionValidFlag = isValidSession(session);
    console.log(`OnboardingFlow: isValidSession result: ${isSessionValidFlag}`);
    if (!isSessionValidFlag) {
      console.warn("Current session is invalid according to isValidSession, finding first incomplete step");
      stepToRender = findFirstIncompleteStep(session);
      console.log(`Redirecting to first incomplete step: ${stepToRender}`);
    }
    
    const validationResult = isStepDataValid(session, stepToRender);
    console.log(`OnboardingFlow: isStepDataValid for step ${stepToRender}: ${validationResult.isValid}`);
    
    if (!validationResult.isValid) {
      console.warn(`Data for step ${stepToRender} is invalid. Finding first incomplete step.`);
      if (validationResult.errorMessage) {
        toast({
          title: validationResult.errorMessage.title,
          description: validationResult.errorMessage.description,
          variant: "destructive"
        });
      }
      stepToRender = findFirstIncompleteStep(session);
      console.log(`Redirecting to first incomplete step instead: ${stepToRender}`);
    }
  }
  console.log(`OnboardingFlow: Final step to render: ${stepToRender}`);

  // --- Effects --- 

  // Initialize session
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

  // Manage validation status for specific steps
  useEffect(() => {
    console.log(`[ValidationEffect] Running for stepToRender: ${stepToRender}, editionType: ${session?.selectedEdition?.type}`);
    const editionType = session?.selectedEdition?.type;

    if (stepToRender === STEPS.WELCOME_CARD) { 
        console.log(`[ValidationEffect] Step ${stepToRender} (WELCOME_CARD) is active, CALLING updateValidationStatus(true).`);
        updateValidationStatus(true);
    }
    else if (stepToRender === STEPS.MONTHLY_CUSTOMIZATION) { 
        if (!editionType) {
            console.warn("[ValidationEffect] No edition type found for MONTHLY_CUSTOMIZATION step");
            updateValidationStatus(false);
            return;
        }
        if (editionType === 'signature' || editionType === 'concierge') {
            console.log(`[ValidationEffect] Step ${stepToRender} (${editionType}) is active, CALLING updateValidationStatus(true).`);
            updateValidationStatus(true);
        } else if (editionType === 'custom'){
             console.log(`[ValidationEffect] Step ${stepToRender} (custom) is active, but validation handled by component.`);
        }
    } 
    else {
        console.log(`[ValidationEffect] Step ${stepToRender} is not WELCOME_CARD or MONTHLY_CUSTOMIZATION, validation handled by component.`);
    }
  }, [stepToRender, session?.selectedEdition?.type, updateValidationStatus, toast]);

  // --- Event Handlers ---
  const handleSaveProgress = () => {
    console.log("OnboardingFlow: Save progress clicked - handled by store action");
    setShowSaveModal(true);
  };
  
  const handleBack = () => {
    console.log("OnboardingFlow: Back button clicked");
    if (externalOnBack) {
      externalOnBack();
    } else {
      // Use the store's action which should update currentStep
      prevStep(); 
    }
  };
  
  const handleClose = () => {
    console.log('OnboardingFlow: Close button clicked (logic handled by OnboardingModal)');
    // Likely handled by parent context/modal logic
  };

  // --- Render Logic --- 
  if (isLoading || !session) {
    console.log("OnboardingFlow: Rendering Loading State");
    return (
      <div className="flex items-center justify-center min-h-screen bg-legacy-cream">
        <div className="text-lg font-medium text-legacy-green animate-pulse">Loading Onboarding...</div>
      </div>
    );
  }

  // Simple function to render the component based on the calculated step
  const renderStepComponent = (step: number) => {
    switch (step) {
      case STEPS.RECIPIENT_SELECTION: return <RecipientSelector />;
      case STEPS.PURCHASER_INFO: return <PurchaserInfo />;
      case STEPS.RECIPIENT_INFO: return <RecipientInfo />;
      case STEPS.SHIPPING_INFO: return <ShippingInfoCard />;
      case STEPS.ENVELOPE_ADDRESSEE: return <EnvelopeAddresseeCard />;
      case STEPS.WELCOME_CARD:
        if (!session.selectedEdition) {
          return (
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-lg text-red-600 mb-4">Error: Edition not selected.</p>
              <p>Please go back and select an edition.</p>
              <Button onClick={handleBack} className="mt-4">
                Go Back
              </Button>
            </div>
          );
        }
        const editionTypeStep6 = session.selectedEdition.type;
        console.log(`Rendering WELCOME_CARD for edition type: ${editionTypeStep6}`);
        if (!editionTypeStep6) {
          return (
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-lg text-red-600 mb-4">Error: Edition type not selected.</p>
              <p>Please go back and select an edition type.</p>
              <Button onClick={handleBack} className="mt-4">
                Go Back
              </Button>
            </div>
          );
        }
        return <WelcomeCardStep />;
      case STEPS.MONTHLY_CUSTOMIZATION:
        if (!session.selectedEdition) {
          return (
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-lg text-red-600 mb-4">Error: Edition not selected.</p>
              <p>Please go back and select an edition.</p>
              <Button onClick={handleBack} className="mt-4">
                Go Back
              </Button>
            </div>
          );
        }
        const editionTypeStep7 = session.selectedEdition.type;
        console.log(`Rendering MONTHLY_CUSTOMIZATION for edition type: ${editionTypeStep7}`);
        if (!editionTypeStep7) {
          return (
            <div className="flex flex-col items-center justify-center p-8">
              <p className="text-lg text-red-600 mb-4">Error: Edition type not selected.</p>
              <p>Please go back and select an edition type.</p>
              <Button onClick={handleBack} className="mt-4">
                Go Back
              </Button>
            </div>
          );
        }
        switch (editionTypeStep7) {
          case 'signature': return <MonthlyCustomizationStep />;
          case 'custom': return <CustomEditionFlow />;
          case 'concierge': return <ConciergeEditionFlow />;
          default:
            return (
              <div className="flex flex-col items-center justify-center p-8">
                <p className="text-lg text-red-600 mb-4">Error: Invalid edition type.</p>
                <p>Please go back and select a valid edition type.</p>
                <Button onClick={handleBack} className="mt-4">
                  Go Back
                </Button>
              </div>
            );
        }
      case STEPS.REVIEW_CHECKOUT: return <ReviewCheckout />;
      default:
        console.log(`OnboardingFlow: No matching component for step ${step}, rendering null`);
        return null;
    }
  };

  console.log("OnboardingFlow: Rendering step content area");
  return (
    <div className="flex-grow container mx-auto px-4 pt-4 pb-8 md:pt-8">
      {/* Header removed, handle save/back/close via context or props if needed */}

      {/* Render the calculated step content */}
      {renderStepComponent(stepToRender)}

      <SaveProgressModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        setLastSavedTime={setLastSavedTime} // Pass if needed by modal
      /> 
    </div>
  );
};

export default OnboardingFlow; 