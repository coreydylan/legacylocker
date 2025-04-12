import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useSession } from '@/contexts/SessionContext';
import SaveAndResumeModal from './SaveAndResumeModal';

interface OnboardingHeaderProps {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  title,
  onBack,
  showBackButton = true,
  currentStep,
  totalSteps,
}) => {
  const { sessionData } = useSession();
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  return (
    <div className="px-4 py-3 sm:px-6 sm:py-4 border-b bg-white flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton && onBack && (
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="mr-2 text-legacy-green hover:text-legacy-green/90"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}
        
        <div>
          <h1 className="text-lg font-medium text-legacy-dark">
            {title}
          </h1>
          {currentStep && totalSteps && (
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          )}
        </div>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="text-legacy-green border-legacy-green hover:bg-legacy-green/5"
        onClick={() => setSaveModalOpen(true)}
      >
        Save & Finish Later
      </Button>
      
      <SaveAndResumeModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
      />
    </div>
  );
};

export default OnboardingHeader; 