import React from 'react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

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

  // Find the first actual step corresponding to a visual step
  const findFirstActualStep = (visualStep: number): number | undefined => {
    const actualStepStr = Object.keys(VISUAL_STEP_MAP).find(
      (key) => VISUAL_STEP_MAP[Number(key)] === visualStep
    );
    return actualStepStr ? Number(actualStepStr) : undefined;
  };

  const handleStepChange = (selectedVisualStepStr: string) => {
    const selectedVisualStep = Number(selectedVisualStepStr);
    const targetActualStep = findFirstActualStep(selectedVisualStep);

    if (targetActualStep !== undefined && targetActualStep <= lastCompletedStep + 1 && targetActualStep !== actualCurrentStep) {
      setCurrentStep(targetActualStep);
    }
  };

  return (
    <div className="w-full px-2 flex justify-center">
      <Select.Root 
        value={String(visualCurrentStep)} 
        onValueChange={handleStepChange}
      >
        <Select.Trigger 
          className="flex items-center justify-center text-xs font-medium text-legacy-green bg-transparent border-none p-0 h-auto focus:outline-none focus:ring-0"
          aria-label="Select Step"
        >
          <Select.Value>
            {`Step ${visualCurrentStep} of ${totalVisualSteps} • ${STEP_LABELS[visualCurrentStep]}`}
          </Select.Value>
          <Select.Icon className="ml-1">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        
        <Select.Portal>
          <Select.Content 
            className="bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50" // Ensure high z-index
            position="popper" 
            sideOffset={5}
            align="center"
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white cursor-default">
              <ChevronUpIcon />
            </Select.ScrollUpButton>
            
            <Select.Viewport className="p-1">
              {visualSteps.map((visualStep) => {
                const isCompleted = visualStep <= lastCompletedVisualStep;
                const isActive = visualStep === visualCurrentStep;
                const firstActualStepForVisual = findFirstActualStep(visualStep);
                const isClickable = firstActualStepForVisual !== undefined && firstActualStepForVisual <= lastCompletedStep + 1;

                return (
                  <Select.Item
                    key={visualStep}
                    value={String(visualStep)}
                    disabled={!isClickable}
                    className={cn(
                      "relative flex items-center px-8 py-2 rounded-sm text-xs leading-none select-none data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-legacy-green/10 data-[highlighted]:text-legacy-green",
                      isActive ? "font-semibold text-legacy-green" : "font-normal text-gray-700",
                      isCompleted && !isActive ? "text-legacy-green/80" : "",
                      !isClickable && "text-gray-400 cursor-not-allowed",
                      isClickable && "cursor-pointer"
                    )}
                  >
                    <Select.ItemText>
                      {`Step ${visualStep}: ${STEP_LABELS[visualStep]}`}
                    </Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.Viewport>
            
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white cursor-default">
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
};

export default OnboardingStepperMobile; 