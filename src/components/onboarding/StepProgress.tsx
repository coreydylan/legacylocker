import React from 'react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore'; // Import Zustand store hook

// Map ACTUAL steps to VISUAL step numbers
const VISUAL_STEP_MAP: { [key: number]: number } = {
  1: 1, // Recipient Selection -> Visual Step 1
  2: 2, // Purchaser Info -> Visual Step 2
  3: 3, // Recipient Info -> Visual Step 3
  4: 3, // Shipping Info -> Visual Step 3
  5: 3, // Envelope Addressee -> Visual Step 3
  6: 4, // Edition Details -> Visual Step 4
  7: 5  // Review -> Visual Step 5
};

// Define labels ONLY for the VISUAL steps
const STEP_LABELS: { [key: number]: string } = {
  1: 'Select Recipient', // Adjusted label
  2: 'Your Info',
  3: 'Recipient Details', // Combined label for steps 3, 4, 5
  4: 'Edition & Cards', // Adjusted label
  5: 'Review & Checkout' // Adjusted label
};

// Remove props interface, all data comes from the store
// interface StepProgressProps {
//   currentStep: number;
//   totalSteps: number;
//   setCurrentStep: (step: number) => void;
// }

// Remove props from component signature
const StepProgress: React.FC = () => {
  // Get state and actions from the store
  const { session, setCurrentStep } = useSessionStore();
  const actualCurrentStep = session.currentStep;
  const lastCompletedStep = session.lastCompletedStep;

  // Calculate the visual step based on the actual step
  const visualCurrentStep = VISUAL_STEP_MAP[actualCurrentStep] || 1;

  const visualSteps = Object.keys(STEP_LABELS).map(Number);
  const totalVisualSteps = visualSteps.length;

  // Determine the highest visual step that is considered complete
  // A visual step is complete if the *last* actual step mapping to it is completed.
  const lastCompletedVisualStep = Math.max(
    0,
    ...Object.entries(VISUAL_STEP_MAP)
      .filter(([actualStep]) => Number(actualStep) <= lastCompletedStep)
      .map(([, visualStep]) => visualStep)
  );

  const handleStepClick = (clickedVisualStep: number) => {
    // Find the FIRST actual step that maps to the clicked visual step
    const targetActualStep = Number(
      Object.keys(VISUAL_STEP_MAP).find(
        (key) => VISUAL_STEP_MAP[Number(key)] === clickedVisualStep
      )
    );

    // Allow navigation only if the target step is completed or is the next step after the last completed one
    if (targetActualStep <= lastCompletedStep + 1 && targetActualStep !== actualCurrentStep) {
      console.log(`StepProgress: Navigating from actual ${actualCurrentStep} to actual ${targetActualStep} (visual ${clickedVisualStep})`);
      setCurrentStep(targetActualStep);
    } else {
      console.log(`StepProgress: Click on visual step ${clickedVisualStep} denied. targetActualStep=${targetActualStep}, lastCompletedStep=${lastCompletedStep}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full px-2 sm:px-4">
      {/* Progress Steps Container - Allow wrapping on small screens */}
      <div className="flex items-start justify-between w-full mb-1">
        {visualSteps.map((visualStep, index) => {
          const isCompleted = visualStep <= lastCompletedVisualStep;
          const isActive = visualStep === visualCurrentStep;
          const firstActualStepForVisual = Number(Object.keys(VISUAL_STEP_MAP).find(key => VISUAL_STEP_MAP[Number(key)] === visualStep)) || 99;
          const isClickable = firstActualStepForVisual <= lastCompletedStep + 1;

          return (
            <React.Fragment key={visualStep}>
              {/* Step Element (Circle + Label) - Allow shrinking, center text */}
              <div className="flex flex-col items-center text-center pt-1 flex-shrink-0 w-[60px]">
                <button
                  onClick={() => handleStepClick(visualStep)}
                  disabled={!isClickable || isActive}
                  className={cn(
                    // Adjust size slightly for mobile?
                    "flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 text-xs sm:text-sm font-medium transition-all duration-150 mb-1",
                    isActive
                      ? "bg-legacy-green border-legacy-green text-white scale-110"
                      : isCompleted
                      ? "bg-legacy-green/10 border-legacy-green/50 text-legacy-green/80 hover:bg-legacy-green/30"
                      : "bg-gray-100 border-gray-300 text-gray-400",
                    isClickable && !isActive && "hover:border-legacy-green/70 cursor-pointer",
                    !isClickable && "cursor-not-allowed"
                  )}
                  aria-label={`Step ${visualStep}: ${STEP_LABELS[visualStep]}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {visualStep}
                </button>
                
                {/* Step Label - Relative positioning, allow wrapping, hide on extra small? */}
                <span 
                  className={cn(
                    "block text-[10px] sm:text-xs leading-tight px-1", // Smaller text, allow wrapping (block), padding
                    // Optional: Hide on very small screens if still too crowded
                    // "hidden xs:block", 
                    isActive ? 'text-legacy-green font-medium' : 'text-gray-500'
                  )}
                >
                  {STEP_LABELS[visualStep]}
                </span>
              </div>

              {/* Connector Line - Adjust margin */}
              {index < totalVisualSteps - 1 && (
                <div className={cn(
                  // Adjusted margin and width for consistent spacing
                  "h-0.5 flex-1 mt-4 mx-4", 
                  isCompleted ? "bg-legacy-green/50" : "bg-gray-300"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Remove extra spacing div */}
      {/* <div className="h-6" /> */}
    </div>
  );
};

export default StepProgress;
