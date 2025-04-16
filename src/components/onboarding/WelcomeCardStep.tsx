import React from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import WelcomeMessageEditor from './WelcomeMessageEditor';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // Import cn if needed for styling
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import useMediaQuery from '@/hooks/useMediaQuery';

// This component assumes it's rendered within the flow where session is available
const WelcomeCardStep: React.FC = () => {
  const { 
    session, 
    updateSession, 
    prevStep, 
    nextStep, 
    isCurrentStepValid
  } = useSessionStore(state => ({
    session: state.session,
    updateSession: state.updateSession,
    prevStep: state.prevStep,
    nextStep: state.nextStep,
    isCurrentStepValid: state.isCurrentStepValid
  }));
  
  const includeWelcomeCard = session.recipient.includeWelcomeCard || false;
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Handler for welcome card toggle
  const handleWelcomeToggle = (checked: boolean) => {
    updateSession('recipient.includeWelcomeCard', checked);
    if (!checked) {
      updateSession('recipient.welcomeMessage', '');
    }
  };

  return (
    // Use py-4 for mobile consistency, remove md:py-0 as parent handles desktop spacing
    <div className="space-y-6 py-4">
      {/* Welcome Card Header Box - Add relative positioning */}
      <div className="relative max-w-2xl mx-auto border border-legacy-green/20 rounded-lg p-4 md:p-6 bg-legacy-green/10 shadow-sm">
        {/* <<< Remove Flexbox wrapper, let text flow naturally >>> */}
        {/* <div className="flex justify-between items-start gap-4"> */} 
          {/* <<< Text Content takes full width >>> */}
          <div className="space-y-2 pr-12"> {/* Add right padding to prevent text overlap with switch */}
            <h3 className="text-lg font-medium text-legacy-green">Welcome Card</h3>
            <p className="text-sm text-legacy-green/90 leading-relaxed"> 
              With the very first delivery, we can include an optional welcome card featuring a note from you (at no extra cost). It's a chance to share why you picked this gift, what you hope it brings them, or anything else that feels worth saying before the journey begins. Think of it as your opening message—a personal prelude to the year ahead.
            </p>
          </div>
          {/* <<< Absolutely Position Switch >>> */}
          <Switch
            id="welcome-toggle"
            checked={includeWelcomeCard}
            onCheckedChange={handleWelcomeToggle}
            aria-label="Include Welcome Card"
            className="absolute top-4 right-4 md:top-6 md:right-6" // Adjust positioning
          />
        {/* </div> */}
      </div>
      
      {/* Conditionally Render WelcomeMessageEditor */} 
      {includeWelcomeCard && (
        <div className="max-w-2xl mx-auto animate-fade-in">
          <WelcomeMessageEditor />
        </div>
      )}

      {/* <<< Add Desktop Navigation Buttons >>> */}
      {!isMobile && (
        <div className="flex justify-between items-center pt-6 border-t max-w-2xl mx-auto">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="text-legacy-dark/60 hover:text-legacy-green border-legacy-cream"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            type="button"
            onClick={nextStep}
            disabled={!isCurrentStepValid}
            className="bg-legacy-green hover:bg-legacy-green/90 px-8 py-2 text-base font-medium text-white"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Mobile navigation is handled by MobileNavFooter */}
    </div>
  );
};

export default WelcomeCardStep; 