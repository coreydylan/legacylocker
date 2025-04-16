import React, { useEffect } from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import CustomMonthAccordion from './custom/CustomMonthAccordion';
import WelcomeMessageEditor from './WelcomeMessageEditor';
import { Button } from "@/components/ui/button";
import useMediaQuery from '@/hooks/useMediaQuery';

// Helper function to check overall completion (can be moved to a util file later)
const checkAllMonthsComplete = (customData: any[]): boolean => {
    if (!customData || customData.length !== 12) return false;
    
    const getCompletionStatus = (data: any): boolean => {
        // Check based on CustomMonthData structure
        if (!data) return false; // Handle potential missing data
        const sections = {
            story: !!(data.title && data.story),
            artwork: data.artworkOption !== null,
            footer: !data.footerEnabled || !!data.footerMessage,
        };
        return sections.story && sections.artwork && sections.footer;
    };

    return customData.every(getCompletionStatus);
};

const CustomEditionFlow: React.FC = () => { 
  // Get ONLY necessary store state/actions
  const { 
    nextStep, 
    prevStep, 
    customData, 
    isLoading, 
    isHydrated,
    updateValidationStatus,
    isCurrentStepValid
  } = useSessionStore(state => ({
      nextStep: state.nextStep,
      prevStep: state.prevStep,
      customData: state.session.customData || [], // Get custom data for validation
      isLoading: state.isLoading, // Keep for potential loading state
      isHydrated: state.isHydrated, // Keep for potential loading state
      updateValidationStatus: state.updateValidationStatus,
      isCurrentStepValid: state.isCurrentStepValid
  }));
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Validation using helper and current customData structure
  const canContinue = checkAllMonthsComplete(customData);

  // --- Update store validation status based on form validity ---
  useEffect(() => {
    console.log(`CustomEditionFlow: canContinue changed to: ${canContinue}, updating store...`);
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
      
      {/* --- Add Welcome Message Editor --- */}
      <WelcomeMessageEditor />

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
