import React from 'react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';

// Map ACTUAL steps to VISUAL step numbers (same as desktop)
const VISUAL_STEP_MAP: { [key: number]: number } = {
  1: 1, 2: 2, 3: 3, 4: 3, 5: 3, 6: 4, 7: 5
};

// Define labels ONLY for the VISUAL steps (same as desktop)
const STEP_LABELS: { [key: number]: string } = {
  1: 'Select Recipient', 2: 'Your Info', 3: 'Recipient Details',
  4: 'Edition & Cards', 5: 'Review & Checkout'
};

const OnboardingStepperMobile: React.FC = () => {
  const { session, setCurrentStep } = useSessionStore();
  const actualCurrentStep = session.currentStep;
  const lastCompletedStep = session.lastCompletedStep;
  const visualCurrentStep = VISUAL_STEP_MAP[actualCurrentStep] || 1;
  const visualSteps = Object.keys(STEP_LABELS).map(Number);
  const totalVisualSteps = visualSteps.length;
  const lastCompletedVisualStep = Math.max(
    0,
    ...Object.entries(VISUAL_STEP_MAP)
      .filter(([actualStep]) => Number(actualStep) <= lastCompletedStep)
      .map(([, visualStep]) => visualStep)
  );

  const handleStepClick = (clickedVisualStep: number) => {
    const targetActualStep = Number(
      Object.keys(VISUAL_STEP_MAP).find(
        (key) => VISUAL_STEP_MAP[Number(key)] === clickedVisualStep
      )
    );
    if (targetActualStep <= lastCompletedStep + 1 && targetActualStep !== actualCurrentStep) {
      setCurrentStep(targetActualStep);
    } 
  };

  return (
    // Simplified layout for mobile
    <div className="flex flex-col items-center w-full px-2">
      <div className="flex items-center justify-between w-full">
        {visualSteps.map((visualStep, index) => {
          const isCompleted = visualStep <= lastCompletedVisualStep;
          const isActive = visualStep === visualCurrentStep;
          const firstActualStepForVisual = Number(Object.keys(VISUAL_STEP_MAP).find(key => VISUAL_STEP_MAP[Number(key)] === visualStep)) || 99;
          const isClickable = firstActualStepForVisual <= lastCompletedStep + 1;

          return (
            <React.Fragment key={visualStep}>
              {/* Step Circle only - Label implicitly handled by aria-label */}
               <button
                  onClick={() => handleStepClick(visualStep)}
                  disabled={!isClickable || isActive}
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full border-2 text-xs font-medium transition-all duration-150", // Smaller size for mobile
                    isActive
                      ? "bg-legacy-green border-legacy-green text-white scale-110"
                      : isCompleted
                      ? "bg-legacy-green/10 border-legacy-green/50 text-transparent" // Hide number on completed mobile
                      : "bg-gray-100 border-gray-300 text-gray-400",
                    isClickable && !isActive && "hover:border-legacy-green/70 cursor-pointer",
                    !isClickable && "cursor-not-allowed"
                  )}
                  aria-label={`Step ${visualStep}: ${STEP_LABELS[visualStep]}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {visualStep}
                </button>
              
              {/* Connector Line - Thinner margin */}
              {index < totalVisualSteps - 1 && (
                <div className={cn(
                  "h-0.5 flex-1 mx-1", // Reduced margin
                  isCompleted ? "bg-legacy-green/50" : "bg-gray-300"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Display Current Step Label Below */}
      <div className="mt-2 text-center">
          <span className="text-xs font-medium text-legacy-green">
              {STEP_LABELS[visualCurrentStep]}
          </span>
      </div>
    </div>
  );
};

export default OnboardingStepperMobile; 