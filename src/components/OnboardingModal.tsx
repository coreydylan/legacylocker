import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
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

  useEffect(() => {
    if (selectedSeries && !session?.selectedEdition) {
      sessionManager.initializeNewLocalSession({
        id: selectedSeries.id,
        label: selectedSeries.label,
        type: selectedSeries.type
      });
    }
  }, [selectedSeries, session?.selectedEdition, sessionManager]);

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
        <DialogPortal>
          <DialogOverlay className="bg-black/30 backdrop-blur-[2px]" />
          <DialogContent className={cn(
            "fixed left-[50%] top-[50%] z-50",
            "h-[85vh] w-[85vw] max-w-[1000px]",
            "translate-x-[-50%] translate-y-[-50%]",
            "flex flex-col",
            "bg-white/90",
            "border border-white/20",
            "shadow-2xl",
            "rounded-xl overflow-hidden",
            "p-0",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            isMobile ? "" : "min-h-[600px]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          )}>
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/30 pointer-events-none" />
            <SafeAreaWrapper>
              <VisuallyHidden>
                <DialogTitle>Onboarding Form</DialogTitle>
              </VisuallyHidden>
              
              {isLoading ? (
                <div className="flex-grow flex items-center justify-center">
                  <div className="text-lg font-medium text-legacy-green/90 backdrop-blur-sm px-4 py-2 rounded-lg bg-white/40">
                    Loading Session...
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-shrink-0 bg-white/40 border-b border-white/20 w-full backdrop-blur-sm">
                    <OnboardingHeader
                      handleBack={handleBack}
                      onClose={() => handleModalCloseTrigger(false)}
                    />
                  </div>
                  
                  <div className={cn(
                    "flex-1 overflow-y-auto min-h-0",
                    "pb-24 md:pb-0",
                    "bg-white/20 backdrop-blur-sm"
                  )}>
                    <OnboardingFlow />
                  </div>
                </>
              )}
            </SafeAreaWrapper>
            <MobileNavFooter />
          </DialogContent>
        </DialogPortal>
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
