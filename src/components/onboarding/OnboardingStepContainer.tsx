import React from 'react';
import { FormData, SeriesType, IndividualRecipient, CoupleRecipient } from '@/types/onboarding';
import { SessionData } from '@/lib/sessionManager';
import Introduction from './Introduction';
import PurchaserInfo from './PurchaserInfo';
import RecipientInfo from './RecipientInfo';
import CardCustomization from './CardCustomization';
import ReviewCheckout from './ReviewCheckout';

interface OnboardingStepContainerProps {
  currentStep: number;
  selectedSeries: SeriesType | null;
  formData: FormData;
  updateFormData: (key: keyof FormData | string, value: any) => void;
  handleSubmit: () => void;
}

const OnboardingStepContainer: React.FC<OnboardingStepContainerProps> = ({
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

  // Convert form data to session data for review
  const convertToSessionData = (): SessionData => {
    // Helper function to safely convert Date to ISO string
    const dateToISOString = (date: Date | undefined): string => {
      return date instanceof Date ? date.toISOString() : '';
    };

    // Prepare recipient data based on type
    let recipientData;
    if (formData.recipient.type === 'individual') {
      const indRecipient = formData.recipient as IndividualRecipient;
      recipientData = {
        type: 'individual' as const,
        firstName: indRecipient.firstName || '',
        lastName: indRecipient.lastName || '',
        relationship: indRecipient.relationship || '',
        birthday: dateToISOString(indRecipient.birthday),
        includeWelcomeCard: indRecipient.includeWelcomeCard || false,
        welcomeMessage: indRecipient.welcomeMessage || '',
        // Explicitly set couple fields to undefined
        recipient1FirstName: undefined,
        recipient1LastName: undefined,
        recipient2FirstName: undefined,
        recipient2LastName: undefined,
        recipient1Birthday: undefined,
        recipient2Birthday: undefined,
        anniversary: undefined,
      };
    } else {
      const coupleRecipient = formData.recipient as CoupleRecipient;
      recipientData = {
        type: 'couple' as const,
        // Explicitly set individual fields to undefined
        firstName: undefined,
        lastName: undefined,
        birthday: undefined,
        // Set couple fields
        recipient1FirstName: coupleRecipient.recipient1FirstName || '',
        recipient1LastName: coupleRecipient.recipient1LastName || '',
        recipient2FirstName: coupleRecipient.recipient2FirstName || '',
        recipient2LastName: coupleRecipient.recipient2LastName || '',
        relationship: coupleRecipient.relationship || '',
        recipient1Birthday: dateToISOString(coupleRecipient.recipient1Birthday),
        recipient2Birthday: dateToISOString(coupleRecipient.recipient2Birthday),
        anniversary: dateToISOString(coupleRecipient.anniversary),
        includeWelcomeCard: coupleRecipient.includeWelcomeCard || false,
        welcomeMessage: coupleRecipient.welcomeMessage || '',
      };
    }

    // Create session data with properly typed recipient
    // @ts-ignore - Single ignore for final recipient assignment
    const sessionData: SessionData = {
      sessionId: crypto.randomUUID(),
      recipientType: formData.giftType,
      purchaser: {
        fullName: formData.purchaser.fullName || '',
        email: formData.purchaser.email || '',
      },
      recipient: recipientData,
      cards: Object.entries(formData.editionFlow.monthlyData || {}).reduce((acc, [month, data]) => ({
        ...acc,
        [month]: {
          title: data.celebration || '',
          story: data.personalMessage || '',
          imageType: 'none' as const,
          isLocked: true,
        }
      }), {}),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStep: currentStep,
      lastCompletedStep: currentStep - 1,
    };

    return sessionData;
  };

  // Handle step transitions
  const handleNextStep = () => {
    updateFormData('currentStep', currentStep + 1);
  };

  return (
    <div className="h-full relative z-0">
      <div className="max-w-3xl mx-auto p-6 md:p-10">
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
            formData={formData.purchaser} 
            onUpdate={(key, value) => updateFormData(`purchaser.${key}`, value)}
            onNext={handleNextStep}
          />
        </div>

        {/* Step 3: Recipient Info */}
        <div style={getStepStyles(3)}>
          <RecipientInfo 
            recipientType={formData.giftType}
            // @ts-ignore - Temporarily ignore type mismatch between form and session data format
            recipientData={formData.recipient}
            onUpdate={(key, value) => updateFormData(`recipient.${key}`, value)}
            onNext={handleNextStep}
          />
        </div>

        {/* Step 4: Card Customization */}
        <div style={getStepStyles(4)}>
          <CardCustomization 
            cards={convertToSessionData().cards}
            onUpdate={(month, field, value) => 
              updateFormData(`editionFlow.monthlyData.${month}.${field === 'title' ? 'celebration' : 'personalMessage'}`, value)
            }
            onNext={handleNextStep}
          />
        </div>

        {/* Step 5: Review & Checkout */}
        <div style={getStepStyles(5)}>
          <ReviewCheckout 
            sessionData={convertToSessionData()}
            onEdit={(step) => updateFormData('currentStep', step)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepContainer;
