import React from 'react';
import OnboardingStepper from './OnboardingStepper';
import { useSessionStore } from '@/lib/sessionStore';
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from '@/lib/utils';

interface OnboardingHeaderMobileProps {
  handleBack: () => void;
  onClose: () => void;
}

const OnboardingHeaderMobile: React.FC<OnboardingHeaderMobileProps> = ({
  handleBack,
  onClose,
}) => {
  const { session } = useSessionStore();
  const selectedEdition = session.selectedEdition;

  const badgeClasses = "px-2 py-0.5 bg-legacy-green/10 text-legacy-green rounded-md text-xs font-medium whitespace-nowrap";

  const formatEditionLabel = (edition: typeof selectedEdition): string => {
    if (!edition) return 'N/A';
    const { type, label } = edition;
    if (type === 'concierge') return '';
    if (!label) return 'N/A';
    
    const parts = label.split(' – ');
    const category = parts[0]?.trim();
    const subcategory = parts[1]?.trim(); 
    const location = parts.length === 3 ? parts[2]?.trim() : undefined; 

    if (category === 'Sports' && location && subcategory) {
      return `${location} ${subcategory}`;
    }
    if (category === 'Music' && location && subcategory) {
      return `${location} ${subcategory}`;
    }
    if (category === 'Local History' && location) { 
      return `${location} Local History`; 
    }
    return label;
  };

  return (
    <div className="sticky top-0 z-10 bg-legacy-green/5 backdrop-blur-sm min-h-[80px]">
      {selectedEdition && (
        <div className="max-w-xl mx-auto flex gap-2 mb-4 pt-2 px-4">
          <div className={cn(badgeClasses, "flex-1 text-center truncate")}>
            {selectedEdition.type === 'concierge' ? 'Concierge Edition' : `${selectedEdition.type.charAt(0).toUpperCase() + selectedEdition.type.slice(1)} Edition`}
          </div>
          {selectedEdition.type !== 'concierge' && (
             <div className={cn(badgeClasses, "flex-1 text-center truncate")} title={selectedEdition.label || ''}>
              {formatEditionLabel(selectedEdition)}
            </div>
          )}
        </div>
      )}

      <div className="relative flex items-center w-full px-2 py-3 gap-2 mt-2 border-none">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute left-4 text-gray-500 hover:text-gray-700 flex-shrink-0 mt-0.5"
          aria-label="Close onboarding"
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center w-full max-w-[90%]">
          <OnboardingStepper />
        </div>
      </div>
    </div>
  );
};

export default OnboardingHeaderMobile; 