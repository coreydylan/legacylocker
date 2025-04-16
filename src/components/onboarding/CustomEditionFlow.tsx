import React, { useEffect, useState, useRef } from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import CustomMonthAccordion from './custom/CustomMonthAccordion';
import { Button } from "@/components/ui/button";
import useMediaQuery from '@/hooks/useMediaQuery';
import CoachingCarousel from './CoachingCarousel';
import CoachingCardsButton from './CoachingCardsButton';
import { Lock } from 'lucide-react';

// Helper function to check overall completion (can be moved to a util file later)
const checkAllMonthsComplete = (customData: any[]): boolean => {
    if (!customData || customData.length !== 12) return false;
    
    const getCompletionStatus = (data: any): boolean => {
        // Check based on CustomMonthData structure
        if (!data) return false; // Handle potential missing data
        const sections = {
            story: !!(data.title && data.story),
            artwork: data.artworkOption !== null,
            footer: !data.enabled || !!data.footerMessage,
        };
        return sections.story && sections.artwork && sections.footer;
    };

    return customData.every(getCompletionStatus);
};

const CustomEditionFlow: React.FC = () => { 
  // Get ONLY necessary store state/actions
  const { 
    session,
    nextStep, 
    prevStep, 
    customData, 
    isLoading, 
    isHydrated,
    updateValidationStatus,
    isCurrentStepValid,
    initializeCustomDataDates,
    initializeSignatureData
  } = useSessionStore(state => ({
      session: state.session,
      nextStep: state.nextStep,
      prevStep: state.prevStep,
      customData: state.session.customData || [], // Get custom data for validation
      isLoading: state.isLoading, // Keep for potential loading state
      isHydrated: state.isHydrated, // Keep for potential loading state
      updateValidationStatus: state.updateValidationStatus,
      isCurrentStepValid: state.isCurrentStepValid,
      initializeCustomDataDates: state.initializeCustomDataDates,
      initializeSignatureData: state.initializeSignatureData
  }));
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Add state for coaching cards visibility
  const [isCoachingOpen, setIsCoachingOpen] = useState(true);
  
  // Add a ref to track initialization
  const hasInitializedData = useRef(false);

  // --- Initialize Custom/Signature Data when component mounts and data is ready --- 
  useEffect(() => {
    // Conditions: Hydrated, Recipient exists, relevant date fields exist, not already initialized
    const recipient = session.recipient;
    const canInitialize = 
        isHydrated && 
        recipient && 
        (recipient.birthday || recipient.recipient1Birthday || recipient.recipient2Birthday || recipient.anniversary) &&
        !hasInitializedData.current; 

    if (canInitialize) {
      console.log("[CustomEditionFlow Effect]: Conditions met. Running initializers...");
      // Call both initializers here to ensure data is ready for either UI part
      initializeCustomDataDates(); 
      initializeSignatureData(); // Ensure signature data is also up-to-date if needed elsewhere
      hasInitializedData.current = true; // Mark as initialized
      console.log("[CustomEditionFlow Effect]: Initializers called.");
    } else {
        // Log why initialization didn't run (optional, for debugging)
        if (isHydrated && !hasInitializedData.current) {
           console.log("[CustomEditionFlow Effect]: Skipping initialization. Hydrated: ", isHydrated, " Recipient: ", !!recipient, " Has Dates: ", !!(recipient?.birthday || recipient?.recipient1Birthday || recipient?.recipient2Birthday || recipient?.anniversary), " Initialized Ref: ", hasInitializedData.current);
        }
    }
    // Dependencies: Hydration status and specific recipient fields that trigger the calculation
  }, [
      isHydrated, 
      session.recipient?.birthday, 
      session.recipient?.recipient1Birthday, 
      session.recipient?.recipient2Birthday, 
      session.recipient?.anniversary,
      initializeCustomDataDates,
      initializeSignatureData
  ]);
  // --- End Initialization Effect --- 

  // Validation using helper and current customData structure
  const canContinue = checkAllMonthsComplete(session.customData || []);

  // --- Update store validation status based on form validity ---
  useEffect(() => {
    console.log(`CustomEditionFlow: canContinue evaluated to: ${canContinue}, updating validation status...`);
    updateValidationStatus(canContinue);
  }, [canContinue, updateValidationStatus]);
  // --- End validation status update ---

  const handleContinue = () => {
      if (isCurrentStepValid || process.env.NODE_ENV === 'development') { 
         console.log("[CustomEditionFlow]: Continue clicked");
         nextStep();
      } else {
          alert("Please ensure all 12 months are marked as 'Complete' before continuing.");
      }
  };

  const handlePrevious = () => {
      console.log("[CustomEditionFlow]: Previous clicked");
      prevStep();
  };

  // Add a basic loading state before rendering the accordion
  if (isLoading || !isHydrated) {
      return (
          <div className="space-y-8">
              {/* Header */}
              <div className="space-y-3 text-center px-4">
                  <h1 className="text-3xl sm:text-4xl font-bold text-legacy-green font-playfair">Loading Customization Options...</h1>
              </div>
              {/* Optional: Add Skeletons here too */}
          </div>
      );
  }

  return (
    <div className="space-y-6 md:space-y-8 py-4 md:py-0">
      <div className="space-y-2 md:space-y-3 px-4 text-left md:text-center">
        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-legacy-green font-playfair">Customize Your Cards</h1>
        <p className="text-sm md:text-lg lg:text-xl text-legacy-dark/80">
          Optionally add a welcome message, then personalize the story, artwork, and footer for each month below.
        </p>
      </div>
      
      {/* Render Coaching Carousel or Button */}
      {isCoachingOpen ? (
        <CoachingCarousel 
          isOpen={isCoachingOpen} 
          onClose={() => setIsCoachingOpen(false)} 
        />
      ) : (
        <CoachingCardsButton onClick={() => setIsCoachingOpen(true)} />
      )}

      {/* --- Info Bar --- */}
      <div className="max-w-3xl mx-auto mb-4 md:mb-6">
        <div className="flex items-center w-full rounded-lg border border-gray-200 shadow-sm bg-white px-4 py-3">
          <p className="text-xs md:text-sm text-gray-700">
             As you complete sections, click the <Lock size={12} className="inline-block mx-1 align-baseline text-gray-500" /> icon when you are finished. Once all months have turned green, you're ready to submit!
          </p>
        </div>
      </div>

      {/* Render the Accordion */}
      <CustomMonthAccordion />

      {/* Conditionally render desktop buttons */}
      {!isMobile && (
      <div className="flex justify-between pt-4 max-w-3xl mx-auto"> 
          <Button variant="outline" onClick={handlePrevious} className="w-32">
              Previous
          </Button>
          <Button 
              onClick={handleContinue} 
              className="w-32 bg-legacy-green hover:bg-legacy-green/90"
                disabled={!isCurrentStepValid && process.env.NODE_ENV !== 'development'} 
            >
              Continue
          </Button>
      </div>
      )}
    </div>
  );
};

export default CustomEditionFlow;
