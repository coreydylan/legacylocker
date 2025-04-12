import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useOnboardingForm } from '@/hooks/useOnboardingForm';
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingStepContainer from '@/components/onboarding/OnboardingStepContainer';
import OnboardingFooter from '@/components/onboarding/OnboardingFooter';
import SaveProgressModal from '@/components/onboarding/SaveProgressModal';
import { submitOnboardingForm } from '@/api/onboarding';
import { SeriesType } from '@/types/onboarding';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import SessionPill from './onboarding/SessionPill';
import { useToast } from '@/hooks/use-toast';

export type { FormData } from '@/types/onboarding';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSeries: SeriesType | null;
  resumeToken?: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedSeries,
  resumeToken 
}) => {
  const { 
    currentStep, 
    formData: initialFormData, 
    updateFormData: updateInitialFormData,
    handleNext,
    handleBack,
    canProceed,
    totalSteps,
    setCurrentStep
  } = useOnboardingForm(selectedSeries);

  const {
    formData,
    setFormData,
    lastSavedTime,
    setLastSavedTime,
    isSaveModalOpen,
    setIsSaveModalOpen,
    handleSaveProgress,
    restoreSessionFromToken,
    handleCloseOnboarding,
    isSessionPillVisible,
    handleContinueFromPill,
    handleAbandonSession
  } = useSessionManagement(initialFormData);

  const { toast } = useToast();

  // Sync selected series with form data
  useEffect(() => {
    if (selectedSeries) {
      const updatedFormData = {
        ...formData,
        selectedSeries,
        editionFlow: {
          ...formData.editionFlow,
          type: selectedSeries.type || 'signature'
        }
      };
      setFormData(updatedFormData);
    }
  }, [selectedSeries, setFormData]);

  // Handle resume token
  useEffect(() => {
    if (resumeToken && isOpen) {
      restoreSessionFromToken(resumeToken);
    }
  }, [resumeToken, isOpen, restoreSessionFromToken]);

  const handleModalClose = () => {
    handleCloseOnboarding();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const result = await submitOnboardingForm(formData);
      if (result && result.success === true) {
        handleAbandonSession();
        onClose();
        toast({
          title: "Form submitted successfully",
          description: "Thank you for your submission!",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive"
      });
    }
  };

  // This ensures the form data is passed through to the onboarding form components
  const handleUpdateFormData = (key: keyof typeof formData, value: any) => {
    updateInitialFormData(key, value); // Updates in useOnboardingForm
    
    // Create a new copy to ensure all components get the update
    const newFormData = { ...formData };
    
    // Handle special cases for objects that need deep merging
    if (typeof value === 'object' && value !== null && key !== 'giftType' && key !== 'selectedSeries') {
      newFormData[key] = {
        ...(newFormData[key] as object),
        ...value
      };
    } else {
      newFormData[key] = value;
    }
    
    setFormData(newFormData);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleModalClose} modal>
        <DialogContent className="sm:max-w-full w-full h-[100vh] max-h-[100vh] p-0 m-0 bg-white flex flex-col overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Onboarding Form</DialogTitle>
          </VisuallyHidden>
          
          <div className="flex-shrink-0 bg-white border-b w-full">
            <OnboardingHeader
              currentStep={currentStep}
              totalSteps={totalSteps}
              handleBack={handleBack}
              onClose={handleModalClose}
              setCurrentStep={setCurrentStep}
              lastSavedTime={lastSavedTime}
              onSaveClick={() => setIsSaveModalOpen(true)}
            />
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0 pb-24 md:pb-16">
            <OnboardingStepContainer
              currentStep={currentStep}
              selectedSeries={selectedSeries}
              formData={formData}
              updateFormData={(key, value) => handleUpdateFormData(key as keyof typeof formData, value)}
              handleSubmit={handleSubmit}
            />
          </div>
          
          <div className="flex-shrink-0 bg-white border-t w-full absolute bottom-0 left-0 right-0">
            <OnboardingFooter
              currentStep={currentStep}
              totalSteps={totalSteps}
              canProceed={Boolean(canProceed())}
              handleBack={handleBack}
              handleNext={handleNext}
              handleSubmit={handleSubmit}
              formData={formData}
            />
          </div>
        </DialogContent>
      </Dialog>

      <SaveProgressModal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        formData={formData}
        onSaveProgress={handleSaveProgress}
        setLastSavedTime={setLastSavedTime}
      />

      {isSessionPillVisible && (
        <SessionPill
          formData={formData}
          onContinue={handleContinueFromPill}
          onAbandon={handleAbandonSession}
          isOpen={isSessionPillVisible}
        />
      )}
    </>
  );
};

export default OnboardingModal;
