import React from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import CustomMonthAccordion from './custom/CustomMonthAccordion';
import WelcomeMessageEditor from './WelcomeMessageEditor';
import { Button } from "@/components/ui/button";

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
  const { nextStep, prevStep, customData, isLoading, isHydrated } = useSessionStore(state => ({
      nextStep: state.nextStep,
      prevStep: state.prevStep,
      customData: state.session.customData || [], // Get custom data for validation
      isLoading: state.isLoading, // Keep for potential loading state
      isHydrated: state.isHydrated, // Keep for potential loading state
  }));
  
  // Validation using helper and current customData structure
  const canContinue = checkAllMonthsComplete(customData);

  const handleContinue = () => {
      if (canContinue || process.env.NODE_ENV === 'development') { 
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
                  <h1 className="text-3xl sm:text-4xl font-bold text-legacy-green font-playfair">Customize Your Cards</h1>
                  <p className="text-lg sm:text-xl text-legacy-dark/80">Loading Customization Options...</p>
              </div>
              {/* Optional: Add Skeletons here too */}
          </div>
      );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-legacy-green font-playfair">Customize Your Cards</h1>
        <p className="text-lg sm:text-xl text-legacy-dark/80">
          Optionally add a welcome message, then personalize the story, artwork, and footer for each month below.
        </p>
      </div>
      
      {/* --- Add Welcome Message Editor --- */}
      <WelcomeMessageEditor />

      {/* Render the Accordion */}
      <CustomMonthAccordion />

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 max-w-3xl mx-auto"> 
          <Button variant="outline" onClick={handlePrevious} className="w-32">
              Previous
          </Button>
          <Button 
              onClick={handleContinue} 
              className="w-32 bg-legacy-green hover:bg-legacy-green/90"
              disabled={!canContinue && process.env.NODE_ENV !== 'development'} 
            >
              Continue
          </Button>
      </div>
    </div>
  );
};

export default CustomEditionFlow;
