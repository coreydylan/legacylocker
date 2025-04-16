import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import SaveProgressModal from '@/components/onboarding/SaveProgressModal';
import { SeriesType } from '@/types/onboarding';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useSessionStore } from '@/lib/sessionStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useModalStore } from '@/lib/modalStore';
import { useToast } from '@/hooks/use-toast';
import { SafeAreaWrapper } from '@/components/utils/SafeAreaWrapper';
import MobileNavFooter from './onboarding/MobileNavFooter';
import { cn } from '@/lib/utils';
import useMediaQuery from '@/hooks/useMediaQuery';
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
  const sessionManager = useSessionManager();

  const { 
    session, 
    sessionMetadata,
    isLoading,
    isHydrated,
    prevStep,
    nextStep,
  } = useSessionStore();

  const { closeOnboarding } = useModalStore();
  
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  const { toast } = useToast();

  const isMobile = useMediaQuery('(max-width: 768px)');

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

  const handleModalCloseTrigger = (open: boolean) => {
    if (!open) {
      console.log("OnboardingModal: Modal close triggered (onOpenChange: false)...");
      sessionManager.handleModalClose();
      closeOnboarding();
      onClose();
    }
  };

  const handleBack = () => {
    prevStep();
  };

  const handleSubmit = async () => {
    console.log("OnboardingModal: Submit button clicked (Not Implemented)");
    toast({ title: "Submit (Not Implemented)", description: "Checkout/Submit logic needed in Review step." });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleModalCloseTrigger} modal>
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
                    onClose={() => handleModalCloseTrigger(false)}
                  />
                </div>
                
                <div className={cn(
                  "flex-1 overflow-y-auto min-h-0",
                  "pb-24 md:pb-0"
                )}>
                  <OnboardingFlow />
                </div>
              </>
            )}
          </SafeAreaWrapper>
          <MobileNavFooter />
        </DialogContent>
      </Dialog>

      <SaveProgressModal
        open={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        setLastSavedTime={setLastSavedTime}
      />
    </>
  );
};

export default OnboardingModal;
