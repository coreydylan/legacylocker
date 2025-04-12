import React from 'react';
import { Button } from "@/components/ui/button";
import { useSessionStore } from '@/lib/sessionStore';
import { SessionData } from '@/lib/sessionManager';

const OnboardingFooter: React.FC = () => {
  const {
    session,
    prevStep,
    nextStep,
  } = useSessionStore();

  const typedSession = session as SessionData;
  const currentStep = typedSession.currentStep;
  const lastCompletedStep = typedSession.lastCompletedStep;
  const editionFlowType = typedSession.editionFlow?.type || 'signature';

  const totalSteps = 5;

  const canProceed = currentStep <= lastCompletedStep;

  const handleSubmit = () => {
    console.log("Footer: Handle Submit Clicked");
    alert("Submit Clicked - Implement Submission Logic");
  };

  return (
    <div className="px-4 sm:px-6 py-4 bg-white border-t shadow-sm">
      <div className="flex justify-between items-center max-w-3xl mx-auto w-full">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="border-legacy-green text-legacy-green hover:bg-legacy-green/10"
        >
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button 
            onClick={nextStep}
            className="bg-legacy-green hover:bg-legacy-green/90 text-white"
          >
            Continue
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            className={`${editionFlowType === 'concierge' ? 'bg-legacy-gold hover:bg-legacy-gold/90' : 'bg-legacy-green hover:bg-legacy-green/90'} text-white`}
          >
            {editionFlowType === 'concierge' ? 'Submit Request' : 'Complete Subscription'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFooter;
