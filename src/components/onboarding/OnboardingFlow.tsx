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
import { SessionData } from '@/lib/sessionManager'; // Import SessionData for typing


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
  }, [initialize]);
  
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

  const handleSaveProgress = () => {
    console.log("OnboardingFlow: Save progress clicked");
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
  
  const typedSession = session as SessionData;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-legacy-cream">
        <div className="text-lg font-medium text-legacy-green animate-pulse">Loading Onboarding...</div>
      </div>
    );
  }
  
  // Render current step based on session.currentStep
  const renderCurrentStep = () => {
    console.log(`OnboardingFlow: Rendering step ${typedSession.currentStep}`);
    switch (typedSession.currentStep) {
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
        const editionType = typedSession.editionFlow?.type || 'signature';
        console.log(`OnboardingFlow: Rendering edition type: ${editionType}`);
        if (editionType === 'custom') {
          return <CustomEditionFlow />;
        } else if (editionType === 'concierge') {
          return <ConciergeEditionFlow />;
        } else {
          // Assume signature is the default
          return <SignatureEditionFlow />;
        }

      case STEPS.REVIEW_CHECKOUT:
        return <ReviewCheckout />;

      default:
        console.error(`OnboardingFlow: Unknown step number: ${typedSession.currentStep}`);
        setCurrentStep(STEPS.RECIPIENT_SELECTION);
        return <RecipientSelector />;
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

      {/* SaveProgressModal is likely handled by OnboardingModal now */}
      {/* 
      <SaveProgressModal
        open={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        setLastSavedTime={setLastSavedTime}
      /> 
      */}
    </div>
  );
};

export default OnboardingFlow; 