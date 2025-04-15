import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import SaveProgressModal from '@/components/onboarding/SaveProgressModal';
import { SeriesType } from '@/types/onboarding';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useSessionStore } from '@/lib/sessionStore';
import { useModalStore } from '@/lib/modalStore';
import SaveAndCloseButton from './onboarding/SaveAndCloseButton';
import ClearSessionButton from './onboarding/ClearSessionButton';
import ClearSessionDialog from './onboarding/ClearSessionDialog';
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
    sessionMetadata,
    initialize, 
    updateSession,
    isLoading,
    prevStep,
    nextStep,
    setCurrentStep,
    saveSession,
    resetSession
  } = useSessionStore();

  const { closeOnboarding } = useModalStore();
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const hasInitialized = useRef(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      console.log("OnboardingModal: Initializing/Resuming session...");
      
      // Only initialize once when opening
      if (!hasInitialized.current) {
        // Check if session already has series data
        const hasExistingSeries = !!session.selectedSeries;
        
        if (!hasExistingSeries) {
          initialize();
          
          // Only update the session if the selectedSeries prop is provided
          if (selectedSeries) {
            console.log("OnboardingModal: Setting selected series in session:", selectedSeries);
            updateSession('selectedSeries', selectedSeries);
            updateSession('selectedEdition', selectedSeries);
            updateSession('editionFlow.type', selectedSeries.type || 'signature');
            
            // We no longer activate the session here - it will be activated after the user
            // completes the PurchaserInfo step
          }
        } else {
          console.log("OnboardingModal: Using existing session with series:", session.selectedSeries);
        }
        
        hasInitialized.current = true;
      }
    } else {
      // Reset the initialization flag when modal is closed
      hasInitialized.current = false;
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
    saveSession();
    closeOnboarding();
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

  const handleConfirmClear = () => {
    console.log("OnboardingModal: Clearing session...");
    resetSession(); 
    setIsClearDialogOpen(false);
    closeOnboarding();
    onClose();
    toast({
      title: "Session Cleared",
      description: "Your session data has been removed.",
    });
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
                />
              </div>
              
              <div className="flex-1 overflow-y-auto min-h-0">
                <OnboardingFlow />
              </div>
            </>
          )}
          
          {sessionMetadata.isActive && (
            <div style={{
              position: 'fixed', 
              bottom: '24px', 
              right: '24px', 
              zIndex: 10, 
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <SaveAndCloseButton onClose={handleModalClose} />
              <ClearSessionButton onClick={() => setIsClearDialogOpen(true)} />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ClearSessionDialog
        open={isClearDialogOpen}
        onOpenChange={setIsClearDialogOpen}
        onConfirm={handleConfirmClear}
      />

      <SaveProgressModal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        setLastSavedTime={setLastSavedTime}
      />
    </>
  );
};

export default OnboardingModal;
