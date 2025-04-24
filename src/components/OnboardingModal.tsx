import React, { useEffect, useState, useRef } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogContent as BaseDialogContent, DialogTitle, DialogPortal, DialogOverlay } from "@/components/ui/dialog";
import OnboardingHeader from '@/components/onboarding/OnboardingHeader';
import OnboardingHeaderMobile from '@/components/onboarding/OnboardingHeaderMobile';
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
import SaveAndCloseButton from './onboarding/SaveAndCloseButton';
import { EditionType } from '@/lib/sessionStore';
import OrderConfirmationScreen from '@/components/onboarding/OrderConfirmationScreen';

export type { FormData } from '@/types/onboarding';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSeries: SeriesType | null;
  resumeToken?: string;
}

// Custom DialogContent without close button
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Content
    ref={ref}
    className={className}
    {...props}
  >
    {children}
  </DialogPrimitive.Content>
));
DialogContent.displayName = "DialogContent";

const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedSeries,
  resumeToken 
}) => {
  const sessionManager = useSessionManager();
  const { sessionStatus, setSessionStatus } = sessionManager;

  const { 
    session, 
    sessionMetadata,
    isLoading,
    isHydrated,
    prevStep,
    nextStep,
    startSession,
    saveSession,
    saveSessionToDb,
    resetSession: storeResetSession,
    submitTriggerCount,
    submitSession,
    setSessionComplete,
    flushAndResetSession,
  } = useSessionStore((state) => ({
    session: state.session,
    sessionMetadata: state.sessionMetadata,
    isLoading: state.isLoading,
    isHydrated: state.isHydrated,
    prevStep: state.prevStep,
    nextStep: state.nextStep,
    startSession: state.startSession,
    saveSession: state.saveSession,
    saveSessionToDb: state.saveSessionToDb,
    resetSession: state.resetSession,
    submitTriggerCount: state.submitTriggerCount,
    submitSession: state.submitSession,
    setSessionComplete: state.setSessionComplete,
    flushAndResetSession: state.flushAndResetSession,
  }));

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
    console.log('[OnboardingModal] Mount state:', {
      isHydrated,
      isLoading,
      selectedSeries,
      selectedEdition: session.selectedEdition
    });

    if (isHydrated && !isLoading && selectedSeries && !sessionMetadata.sessionId && !session.selectedEdition) {
      console.log('[OnboardingModal] Initializing new session - guard passed');
      sessionManager.initializeNewLocalSession({
        id: selectedSeries.id,
        label: selectedSeries.label,
        type: selectedSeries.type
      });
    }
  }, [isHydrated, isLoading, selectedSeries, session.selectedEdition, sessionMetadata.sessionId, sessionManager]);

  // --- Effect to handle submission triggered by MobileNavFooter ---
  useEffect(() => {
    if (submitTriggerCount > 0) {
      console.log('[OnboardingModal] Submit triggered by count:', submitTriggerCount);
      
      setSessionStatus('processing'); 

      (async () => {
        try {
          const success = await submitSession();
          if (success) {
            console.log('[OnboardingModal] Session submission successful.');
            setSessionStatus('completed'); 
            setSessionComplete(true);
            toast({ title: "Order Placed!", description: "Your order has been successfully submitted." });
            // Flush and reset session now that order is placed
            try {
              await flushAndResetSession();
            } catch (e) { console.error('[OnboardingModal] flushAndResetSession error post-submit:', e); }
          } else {
            console.error('[OnboardingModal] Session submission failed.');
            setSessionStatus('idle');
            toast({ title: "Submission Failed", description: "There was an error placing your order. Please try again.", variant: "destructive" });
          }
        } catch (error) {
          console.error('[OnboardingModal] Error during session submission:', error);
          setSessionStatus('idle');
          toast({ title: "Error", description: "An unexpected error occurred during submission.", variant: "destructive" });
        }
      })();
    }
  }, [submitTriggerCount, submitSession, setSessionStatus, setSessionComplete, toast, flushAndResetSession]);
  // --- End Submission Effect ---

  const handleModalCloseTrigger = (open: boolean) => {
    if (!open) {
      // User clicked 'X' or outside modal - discard current state without saving
      console.log('[OnboardingModal] Modal close triggered via UI (X or overlay) – resetting state.');
      storeResetSession(); // Use the reset action directly from the store
      onClose(); // Call the original onClose to hide the modal UI
      
      // Original flush logic moved to post-submit effect and SaveAndCloseButton
      /* flushAndResetSession()
        .catch(err => console.error('[OnboardingModal] Error during flushAndResetSession:', err))
        .finally(() => onClose());
      */
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
          {/* Restore DialogOverlay */}
          <DialogOverlay className="bg-black/30 backdrop-blur-[2px]" />
          <DialogPrimitive.Content
            style={isMobile ? { top: 0, left: 0, transform: 'none' } : undefined}
            className={cn(
              // Base styles applied to both
              "fixed z-50 flex flex-col p-0 overflow-hidden",

              // Conditional styles
              isMobile
                ? [ // Mobile specifics
                    "inset-0 w-[100vw] h-[100dvh] max-w-none", // Fullscreen sizing
                    "bg-white",                               // Solid background
                    "border-none rounded-none shadow-none"    // Edge-to-edge appearance
                  ]
                : [ // Desktop specifics
                    "left-[50%] top-[50%]",                  // Centering position
                    "h-[85vh] w-[85vw] max-w-3xl",           // Specific size
                    "translate-x-[-50%] translate-y-[-50%]", // Centering transform
                    "bg-white/90",                            // Semi-transparent background
                    "border border-white/20",                 // Border
                    "shadow-2xl",                             // Shadow
                    "rounded-xl",                             // Rounded corners
                    "min-h-[600px]",                          // Min height
                    // Radix animations (Desktop only)
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
                    "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
                  ]
            )}
          >
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
                  <div className="flex-shrink-0 bg-white/40 border-b border-white/20 w-full backdrop-blur-sm z-30">
                    {isMobile ? (
                      <OnboardingHeaderMobile
                        handleBack={handleBack}
                        onClose={() => handleModalCloseTrigger(false)}
                      />
                    ) : (
                      <OnboardingHeader
                        handleBack={handleBack}
                        onClose={() => handleModalCloseTrigger(false)}
                      />
                    )}
                  </div>
                  
                  {/* Restore Content Flow Div */}
                  
                  <div className={cn(
                    "flex-1 overflow-y-auto min-h-0",
                    "pb-24 md:pb-0",
                    "bg-white/20 backdrop-blur-sm"
                  )}>
                    {sessionStatus === 'completed' ? (
                      <OrderConfirmationScreen />
                    ) : (
                      <OnboardingFlow />
                    )}
                  </div>
                   
                </>
              )}
            </SafeAreaWrapper>
            <MobileNavFooter triggerModalClose={() => handleModalCloseTrigger(false)} />
            {!isMobile && sessionMetadata.isActive && (
              <div className="fixed bottom-6 right-6 z-[100]">
                <SaveAndCloseButton onClose={closeOnboarding} />
              </div>
            )}
          </DialogPrimitive.Content>
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
