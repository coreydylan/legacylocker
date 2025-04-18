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
  const { sessionStatus } = sessionManager;

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

    if (isHydrated && !isLoading && selectedSeries && !session.selectedEdition) {
      console.log('[OnboardingModal] Initializing new session - guard passed');
      sessionManager.initializeNewLocalSession({
        id: selectedSeries.id,
        label: selectedSeries.label,
        type: selectedSeries.type
      });
    }
  }, [isHydrated, isLoading, selectedSeries, session.selectedEdition]);

  const handleModalCloseTrigger = (open: boolean) => {
    if (!open) {
      console.log('[OnboardingModal] Modal close triggered. Bypassing save logic for debug.');
      // --- TEMPORARILY BYPASS ALL LOGIC ---
      /*
      (async () => {
        try {
          // 1) Active session → always save before closing
          if (sessionMetadata.isActive && sessionMetadata.sessionId) {
            console.log('[OnboardingModal] Active session detected. Saving latest progress before close.', {
              sessionId: sessionMetadata.sessionId,
            });
            await sessionManager.saveSessionData();
            console.log('[OnboardingModal] Active session saved successfully.');
            onClose(); // Original call was here
            return;
          }

          // 2) Inactive session but with meaningful data → prompt to save
          const hasMeaningfulData = !!(
            session.selectedEdition ||
            session.purchaser?.email ||
            session.recipient?.firstName ||
            session.recipient?.lastName ||
            session.recipient?.relationship
          );

          if (!sessionMetadata.sessionId && hasMeaningfulData) {
            console.log('[OnboardingModal] Unsaved data detected in inactive session. Prompting user to save.');
            const confirmSave = window.confirm('You have unsaved progress. Would you like to save it before closing?');

            if (confirmSave) {
              const editionType: EditionType = (session.selectedEdition?.type || 'signature') as EditionType;
              console.log('[OnboardingModal] User opted to save. Activating session with edition:', editionType);
              startSession(editionType);
              saveSession();
              await saveSessionToDb();
              console.log('[OnboardingModal] Session activated & saved successfully.');
            } else {
              console.log('[OnboardingModal] User declined to save progress. Performing soft reset.');
              storeResetSession();
            }
          } else if (!sessionMetadata.sessionId && !hasMeaningfulData) {
            // 3) Truly empty / abandoned session → safe to reset
            console.log('[OnboardingModal] No meaningful data found. Resetting session.');
            storeResetSession();
          }

          // Original onClose call was here
          // onClose(); 
        } catch (err) {
          console.error('[OnboardingModal] Error during close handling:', err);
          // Original onClose call was here
          // onClose(); 
        }
      })();
      */
      // --- END BYPASS ---

      // Call onClose directly for debugging
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
                <SaveAndCloseButton onClose={() => handleModalCloseTrigger(false)} />
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
