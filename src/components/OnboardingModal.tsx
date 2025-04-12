import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import SaveProgressModal from '@/components/onboarding/SaveProgressModal';
import { SeriesType } from '@/types/onboarding';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useSessionStore } from '@/lib/sessionStore';
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
    session, 
    initialize, 
    resetSession,
    updateSession,
    isLoading,
    prevStep,
    nextStep,
    setCurrentStep
  } = useSessionStore();
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      console.log("OnboardingModal: Initializing/Resuming session...");
      initialize(); 
      if (selectedSeries) {
        updateSession('selectedSeries', selectedSeries);
        updateSession('editionFlow.type', selectedSeries.type || 'signature');
      }
    }
  }, [isOpen, resumeToken, selectedSeries, initialize, updateSession]);

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

  const handleModalClose = () => {
    console.log("OnboardingModal: Closing modal...");
    resetSession();
    onClose();
  };
  
  const handleSaveClick = () => {
    setIsSaveModalOpen(true);
  };
  
  const handleBack = () => {
    prevStep();
  };

  const handleSubmit = async () => {
    console.log("OnboardingModal: Submitting...");
    toast({ title: "Submit (Not Implemented)", description: "Checkout/Submit logic needed." });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleModalClose} modal>
        <DialogContent className="sm:max-w-full w-full h-[100vh] max-h-[100vh] p-0 m-0 bg-white flex flex-col overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Onboarding Form</DialogTitle>
          </VisuallyHidden>
          
          {isLoading ? (
            <div className="flex-grow flex items-center justify-center">
              <p>Loading Session...</p>
            </div>
          ) : (
            <>
              <div className="flex-shrink-0 bg-white border-b w-full">
                <OnboardingHeader
                  handleBack={handleBack}
                  onClose={handleModalClose}
                  lastSavedTime={lastSavedTime}
                  onSaveClick={handleSaveClick}
                />
              </div>
              
              <div className="flex-1 overflow-y-auto min-h-0">
                <OnboardingFlow />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <SaveProgressModal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        setLastSavedTime={setLastSavedTime}
      />

      {/* SessionPill likely needs refactoring to use store */}
    </>
  );
};

export default OnboardingModal;
