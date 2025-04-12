import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, X } from 'lucide-react';
import { useSessionStore } from '@/lib/sessionStore';

interface OnboardingNavigationProps {
  handleBack: () => void;
  onClose: () => void;
}

const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  handleBack,
  onClose,
}) => {
  const { session } = useSessionStore();
  const currentStep = session.currentStep;
  
  return (
    <div className="flex items-center space-x-4">
      {currentStep > 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-legacy-green hover:bg-legacy-green/10"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="text-legacy-green hover:bg-legacy-green/10"
        aria-label="Close onboarding"
      >
        <X className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default OnboardingNavigation;

