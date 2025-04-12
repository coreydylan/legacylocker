import React from 'react';
import { cn } from '@/lib/utils';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
}

const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  totalSteps,
  setCurrentStep,
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  const handleStepClick = (step: number) => {
    // Allow navigation only to previous steps for now
    // TODO: Add logic to check lastCompletedStep if needed
    if (step < currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {steps.map((step, index) => {
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        const isClickable = step < currentStep; // Only allow clicking previous steps

        return (
          <React.Fragment key={step}>
            <button
              onClick={() => handleStepClick(step)}
              disabled={!isClickable}
              className={cn(
                "flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs font-medium transition-all duration-150",
                isActive
                  ? "bg-legacy-green border-legacy-green text-white scale-110"
                  : isCompleted
                  ? "bg-legacy-green/20 border-legacy-green/50 text-legacy-green/80 hover:bg-legacy-green/30"
                  : "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed",
                isClickable && !isActive && "hover:border-legacy-green/70 cursor-pointer"
              )}
              aria-label={`Go to step ${step}`}
              aria-current={isActive ? 'step' : undefined}
            >
              {step}
            </button>
            {index < totalSteps - 1 && (
              <div className={cn(
                "h-0.5 w-4 transition-colors duration-300 ease-in-out",
                isCompleted ? "bg-legacy-green/50" : "bg-gray-300"
              )}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepProgress;
