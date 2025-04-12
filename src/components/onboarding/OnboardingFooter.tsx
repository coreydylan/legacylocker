import React from 'react';
import { Button } from "@/components/ui/button";
import { FormData, SeriesType } from '@/types/onboarding';

interface OnboardingFooterProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  handleBack: () => void;
  handleNext: () => void;
  handleSubmit: () => void;
  formData: FormData;
}

const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  currentStep,
  totalSteps,
  canProceed,
  handleBack,
  handleNext,
  handleSubmit,
  formData
}) => {
  return (
    <div className="px-4 sm:px-6 py-4 bg-white border-t shadow-sm">
      <div className="flex justify-between items-center max-w-3xl mx-auto w-full">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="border-legacy-green text-legacy-green hover:bg-legacy-green/10"
        >
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button 
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-legacy-green hover:bg-legacy-green/90 text-white"
          >
            Continue
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            className={`${formData.editionFlow.type === 'concierge' ? 'bg-legacy-gold hover:bg-legacy-gold/90' : 'bg-legacy-green hover:bg-legacy-green/90'} text-white`}
          >
            {formData.editionFlow.type === 'concierge' ? 'Submit Request' : 'Complete Subscription'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFooter;
