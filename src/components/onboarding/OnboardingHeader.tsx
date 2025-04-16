import React from 'react';
import OnboardingStepper from './OnboardingStepper';
import { useSessionStore } from '@/lib/sessionStore';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from '@/lib/utils';

interface OnboardingHeaderProps {
  handleBack: () => void;
  onClose: () => void;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  handleBack,
  onClose,
}) => {
  const { session, nextStep } = useSessionStore();
  const selectedEdition = session.selectedEdition;
  const currentStep = session.currentStep;

  // TODO: Define total steps dynamically later if needed
  const totalSteps = 7; // Assuming 7 steps for now

  // Common badge styling - <<< Update colors to lighter green >>>
  const badgeClasses = "px-2 py-0.5 bg-legacy-green/10 text-legacy-green rounded-md text-xs font-medium whitespace-nowrap";

  // Helper function to format the specific edition label (Music/Sports/History focus)
  const formatEditionLabel = (edition: typeof selectedEdition): string => {
    if (!edition) return 'N/A';

    const { type, label } = edition;

    // No specific label formatting needed for concierge here
    if (type === 'concierge') return ''; // Return empty or N/A if needed elsewhere

    // Fallback if label is missing
    if (!label) return 'N/A'; // Or return type like before?

    const parts = label.split(' – ');
    const category = parts[0]?.trim();
    const subcategory = parts[1]?.trim(); 
    const location = parts.length === 3 ? parts[2]?.trim() : undefined; 

    // Apply formatting rules based on parsed parts
    if (category === 'Sports' && location && subcategory) {
      return `${location} ${subcategory}`;
    }
    if (category === 'Music' && location && subcategory) {
      return `${location} ${subcategory}`;
    }
    if (category === 'Local History' && location) { 
      return `${location} Local History`; 
    }
    
    // Fallback: Return original label if no specific rule matched
    return label; 
  };

  return (
    <div className="sticky top-0 z-10 bg-legacy-cream">
      {selectedEdition && (
        <div className="max-w-xl mx-auto flex gap-2 mb-2 pt-3 px-4">
          {/* <<< First tag: General Edition Type >>> */}
          <div className={cn(badgeClasses, "flex-1 text-center truncate")}>
            {selectedEdition.type === 'concierge' ? 'Concierge Edition' : `${selectedEdition.type.charAt(0).toUpperCase() + selectedEdition.type.slice(1)} Edition`}
          </div>
          {/* <<< Second tag: Specific Formatted Label (if not concierge) >>> */}
          {selectedEdition.type !== 'concierge' && (
             <div className={cn(badgeClasses, "flex-1 text-center truncate")} title={selectedEdition.label || ''}>
              {formatEditionLabel(selectedEdition)}
            </div>
          )}
        </div>
      )}

      <div className="relative flex items-center w-full px-4 py-2 md:py-6 shadow-sm gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 flex-shrink-0"
            aria-label="Close onboarding"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center min-w-0">
          <OnboardingStepper />
        </div>
      </div>
    </div>
  );
};

export default OnboardingHeader;
