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
      return !!session.recipient && (!!session.recipient.firstName || !!session.recipient.recipient1FirstName);
    case STEPS.ENVELOPE_ADDRESSEE:
      return !!session?.recipient?.shippingAddress?.street; 
    case STEPS.WELCOME_CARD: // Data needed TO ENTER Welcome Card step
      return !!session.recipient?.cardAddresseeName;
    case STEPS.MONTHLY_CUSTOMIZATION: // Data needed TO ENTER Customization step
      // No specific new data required from Welcome Card step itself
      return isStepDataValid(session, STEPS.WELCOME_CARD); // Depends on previous step being valid
    case STEPS.REVIEW_CHECKOUT: // Data needed TO ENTER Review step
      if (!session.selectedEdition) return false;
      // Check previous step is valid
      return isStepDataValid(session, STEPS.MONTHLY_CUSTOMIZATION);
    default:
      return false;
  }
};

// Helper to find the first step for which data is *missing* - <<< Updated Logic >>>
const findFirstIncompleteStep = (session: SessionData): number => {
  // Check steps sequentially
  if (!isStepDataValid(session, STEPS.PURCHASER_INFO)) return STEPS.RECIPIENT_SELECTION;
  if (!isStepDataValid(session, STEPS.RECIPIENT_INFO)) return STEPS.PURCHASER_INFO;
  if (!isStepDataValid(session, STEPS.SHIPPING_INFO)) return STEPS.RECIPIENT_INFO;
  if (!isStepDataValid(session, STEPS.ENVELOPE_ADDRESSEE)) return STEPS.SHIPPING_INFO;
  if (!isStepDataValid(session, STEPS.WELCOME_CARD)) return STEPS.ENVELOPE_ADDRESSEE;
  if (!isStepDataValid(session, STEPS.MONTHLY_CUSTOMIZATION)) return STEPS.WELCOME_CARD;
  if (!isStepDataValid(session, STEPS.REVIEW_CHECKOUT)) return STEPS.MONTHLY_CUSTOMIZATION;
  
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
  const [prevStepRendered, setPrevStepRendered] = useState<number | null>(null);
  
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

    // <<< Add effect to track the previously rendered step >>>
    useEffect(() => {
      setPrevStepRendered(stepToRender);
    }, [stepToRender]);

    // <<< Add effect to manage validation status for the specific step >>>
    useEffect(() => {
        console.log(`[ValidationEffect] Running for stepToRender: ${stepToRender}, editionType: ${session.selectedEdition?.type}`);
        const editionType = session.selectedEdition?.type;

        // Steps 6 (Welcome) is always valid initially for all types (optional message)
        if (stepToRender === STEPS.WELCOME_CARD) { 
            console.log(`[ValidationEffect] Step ${stepToRender} (WELCOME_CARD) is active, CALLING updateValidationStatus(true).`);
            updateValidationStatus(true);
        }
        // Step 7 (Monthly Customization) is valid initially for Signature/Concierge
        else if (stepToRender === STEPS.MONTHLY_CUSTOMIZATION) { 
            if (editionType === 'signature' || editionType === 'concierge') {
                console.log(`[ValidationEffect] Step ${stepToRender} (${editionType}) is active, CALLING updateValidationStatus(true).`);
                updateValidationStatus(true);
            } else if (editionType === 'custom'){
                 // For custom edition on step 7, validation is handled within CustomEditionFlow
                 console.log(`[ValidationEffect] Step ${stepToRender} (custom) is active, but validation handled by component.`);
                 // We might need to reset it here? Let's leave it for now.
                 // updateValidationStatus(false); 
            }
        } 
        else {
            // For other steps, rely on the component's internal logic to set validation
            console.log(`[ValidationEffect] Step ${stepToRender} is not WELCOME_CARD or MONTHLY_CUSTOMIZATION, validation handled by component.`);
        }
    }, [stepToRender, session.selectedEdition?.type, updateValidationStatus]);

    // <<< Modify effect to send resume email ONLY on transition >>>
    useEffect(() => {
        // Check if we just transitioned from RECIPIENT_INFO to SHIPPING_INFO
        if (stepToRender === STEPS.SHIPPING_INFO && prevStepRendered === STEPS.RECIPIENT_INFO) {
            console.log(`[EmailEffect] Transitioned from RECIPIENT_INFO to SHIPPING_INFO, sending resume email...`);
            
            // Get necessary data from the session store
            const purchaserEmail = session.purchaser?.email || session.email;
            const sessionId = session.sessionId;
            
            // Determine recipient's first name based on the recipient type
            let recipientFirstName = '';
            if (session.recipientType === 'individual' && session.recipient?.firstName) {
                recipientFirstName = session.recipient.firstName;
            } else if (session.recipientType === 'couple' && session.recipient?.recipient1FirstName) {
                recipientFirstName = session.recipient.recipient1FirstName;
            }
            
            // Send email if we have a session ID and purchaser email
            if (sessionId && purchaserEmail) {
                console.log(`[EmailEffect] Attempting to send resume email to ${purchaserEmail} for session ${sessionId}`);
                
                // Call the API to send the resume email
                fetch('/api/send-resume-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: purchaserEmail, sessionId, recipientFirstName }),
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`API responded with status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('[EmailEffect] Resume email sent successfully:', data);
                    
                    // Show toast notification
                    toast({
                        title: "Magic Link Sent",
                        description: `We emailed a magic link to ${purchaserEmail}. Your progress is saved automatically.`,
                    });
                })
                .catch(err => {
                    console.error('[EmailEffect] Failed to send resume email:', err);
                });
            } else {
                console.warn('[EmailEffect] Cannot send resume email - missing sessionId or purchaserEmail');
                if (!sessionId) console.warn('[EmailEffect] Session ID not found');
                if (!purchaserEmail) console.warn('[EmailEffect] Purchaser email not found');
            }
        }
    }, [stepToRender, prevStepRendered, session.purchaser?.email, session.email, session.sessionId, session.recipientType, session.recipient, toast]);

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

      case STEPS.WELCOME_CARD:
        const editionTypeStep6 = session.selectedEdition?.type;
        console.log(`Rendering WELCOME_CARD for edition type: ${editionTypeStep6}`);
        switch (editionTypeStep6) {
          case 'signature':
          case 'custom': // Custom also has welcome card step
          case 'concierge': // Concierge also has welcome card step
             return <WelcomeCardStep />;
          default:
            console.error(`Invalid or missing editionType for WELCOME_CARD: ${editionTypeStep6}`);
            return <div>Error loading welcome card step.</div>; // Fallback
        }

      case STEPS.MONTHLY_CUSTOMIZATION:
        const editionTypeStep7 = session.selectedEdition?.type;
        console.log(`Rendering MONTHLY_CUSTOMIZATION for edition type: ${editionTypeStep7}`);
        switch (editionTypeStep7) {
          case 'signature':
             return <MonthlyCustomizationStep />; // Contains notes header + grid
          case 'custom':
            return <CustomEditionFlow />; // Custom handles its own full flow here
          case 'concierge':
            return <ConciergeEditionFlow />; // Concierge handles its own flow here
          default:
            console.error(`Invalid or missing editionType for MONTHLY_CUSTOMIZATION: ${editionTypeStep7}`);
             return <div>Error loading customization step.</div>; // Fallback
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