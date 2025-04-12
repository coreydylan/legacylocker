import React from 'react';
import { FormData, SeriesType } from '@/types/onboarding';
import Introduction from './Introduction';
import PurchaserInfo from './PurchaserInfo';
import RecipientInfo from './RecipientInfo';
import SignatureEditionFlow from './SignatureEditionFlow';
import CustomEditionFlow from './CustomEditionFlow';
import ConciergeEditionFlow from './ConciergeEditionFlow';
import ReviewCheckout from './ReviewCheckout';

interface OnboardingContentProps {
  currentStep: number;
  selectedSeries: SeriesType | null;
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
  handleSubmit: () => void;
}

const OnboardingContent: React.FC<OnboardingContentProps> = ({
  currentStep,
  selectedSeries,
  formData,
  updateFormData,
  handleSubmit
}) => {
  // Style transitions between steps
  const getStepStyles = (step: number) => {
    return {
      display: currentStep === step ? 'block' : 'none',
      transition: 'opacity 0.3s ease-in-out',
      opacity: currentStep === step ? 1 : 0,
    };
  };

  return (
    <div className="w-full">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
        {/* Step 1: Introduction */}
        <div style={getStepStyles(1)}>
          <Introduction 
            selectedSeries={selectedSeries} 
            formData={formData}
            updateFormData={updateFormData}
          />
        </div>

        {/* Step 2: Purchaser Info */}
        <div style={getStepStyles(2)}>
          <PurchaserInfo 
            formData={formData} 
            updateFormData={updateFormData}
          />
        </div>

        {/* Step 3: Recipient Info */}
        <div style={getStepStyles(3)}>
          <RecipientInfo 
            formData={formData} 
            updateFormData={updateFormData}
          />
        </div>

        {/* Step 4: Edition Flow (Signature, Custom, or Concierge) */}
        <div style={getStepStyles(4)}>
          {formData.editionFlow.type === 'signature' ? (
            <SignatureEditionFlow 
              formData={formData} 
              updateFormData={updateFormData}
            />
          ) : formData.editionFlow.type === 'custom' ? (
            <CustomEditionFlow 
              formData={formData} 
              updateFormData={updateFormData}
            />
          ) : (
            <ConciergeEditionFlow
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
        </div>

        {/* Step 5: Review & Checkout */}
        <div style={getStepStyles(5)}>
          <ReviewCheckout 
            formData={formData} 
            selectedSeries={selectedSeries}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingContent; 