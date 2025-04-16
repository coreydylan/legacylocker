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
import { SafeAreaWrapper } from '@/components/utils/SafeAreaWrapper';
import MobileNavFooter from './onboarding/MobileNavFooter';
import { cn } from '@/lib/utils';
import useMediaQuery from '@/hooks/useMediaQuery';
import { saveSessionToSupabase } from '@/lib/sessionService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

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
    isHydrated,
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

  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isOpen && isHydrated) {
      console.log("OnboardingModal: Modal open and store hydrated. Checking initialization...");

      if (!hasInitialized.current) {
        console.log("OnboardingModal: Running initialization logic...");
        
        const hasExistingSeries = !!session.selectedSeries;

        if (!hasExistingSeries) {
           console.log("OnboardingModal: No existing series found, calling initialize().");
           initialize();

          if (selectedSeries) {
            console.log("OnboardingModal: Setting selected series in session:", selectedSeries);
            updateSession('selectedSeries', selectedSeries);
            updateSession('selectedEdition', selectedSeries);
            updateSession('editionFlow.type', selectedSeries.type || 'signature');
          }
        } else {
          console.log("OnboardingModal: Using existing session with series:", session.selectedSeries);
           console.log("OnboardingModal: Re-calling initialize() to ensure data consistency after hydration.");
           initialize();
        }

        hasInitialized.current = true;
        console.log("OnboardingModal: Initialization marked as complete.");
      } else {
         console.log("OnboardingModal: Initialization already completed for this session.");
      }
    } else if (!isOpen) {
      console.log("OnboardingModal: Modal closed, resetting initialization flag.");
      hasInitialized.current = false;
    } else if (isOpen && !isHydrated) {
      console.log("OnboardingModal: Modal open but store NOT hydrated yet. Waiting...");
    }
  }, [isOpen, isHydrated, initialize, selectedSeries, session.selectedSeries, updateSession]);

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
        <DialogContent className="sm:max-w-full w-full h-full p-0 m-0 bg-white flex flex-col">
          <SafeAreaWrapper>
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
                
                <div className={cn(
                  "flex-1 overflow-y-auto min-h-0",
                  "pb-24 md:pb-0"
                )}>
                  <OnboardingFlow />
                </div>
                
                {!isMobile && sessionMetadata.isActive && session.currentStep > 3 && (
                  <div className="flex-shrink-0">
                    <div className="flex justify-end items-center gap-2 px-6 py-4">
                      <ClearSessionButton onClick={() => setIsClearDialogOpen(true)} />
                      <SaveAndCloseButton onClose={handleModalClose} />
                    </div>
                  </div>
                )}
              </>
            )}
          </SafeAreaWrapper>
          <MobileNavFooter />
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
