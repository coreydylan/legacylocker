import React from 'react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';
import * as Select from '@radix-ui/react-select';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import {
  MAIN_STAGES,
  getStageForStep,
  getStepsForStage,
  STEP_TITLES,
  TOTAL_STEPS,
} from '@/constants/onboardingStages';

const OnboardingStepperMobile: React.FC = () => {
  const { session, setCurrentStep } = useSessionStore();
  const actualCurrentStep = session.currentStep;
  const lastCompletedStep = session.lastCompletedStep;

  const handleStepChange = (selectedStepStr: string) => {
    const selectedStep = Number(selectedStepStr);
    if (selectedStep <= lastCompletedStep + 1 && selectedStep !== actualCurrentStep) {
      setCurrentStep(selectedStep);
    }
  };

  const triggerLabel = `Step ${actualCurrentStep} of ${TOTAL_STEPS} • ${STEP_TITLES[actualCurrentStep].title}`;

  return (
    <div className="w-full px-0 flex justify-center">
      <Select.Root value={String(actualCurrentStep)} onValueChange={handleStepChange}>
        <Select.Trigger
          className="flex items-center justify-center text-sm sm:text-xs font-medium text-legacy-green bg-transparent border-none p-0 h-auto w-full max-w-[320px] sm:max-w-none focus:outline-none focus:ring-0"
          aria-label="Select Step"
        >
          <Select.Value>{triggerLabel}</Select.Value>
          <Select.Icon className="ml-1">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 max-h-72 overflow-y-auto"
            position="popper"
            sideOffset={5}
            align="center"
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white cursor-default">
              <ChevronUpIcon />
            </Select.ScrollUpButton>

            <Select.Viewport className="p-1">
              {MAIN_STAGES.map(({ stage, label }) => {
                return (
                  <Select.Group key={stage}>
                    <Select.Label className="px-2 py-1 text-sm sm:text-xs font-semibold text-gray-500">
                      {label}
                    </Select.Label>
                    {getStepsForStage(stage).map((stepNum) => {
                      const isCompleted = stepNum <= lastCompletedStep;
                      const isActive = stepNum === actualCurrentStep;
                      const isClickable = stepNum <= lastCompletedStep + 1;

                      return (
                        <Select.Item
                          key={stepNum}
                          value={String(stepNum)}
                          disabled={!isClickable}
                          className={cn(
                            'relative flex items-center px-8 py-2 rounded-sm text-sm sm:text-xs leading-none select-none',
                            'data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none',
                            'data-[highlighted]:outline-none data-[highlighted]:bg-legacy-green/10 data-[highlighted]:text-legacy-green',
                            isActive ? 'font-semibold text-legacy-green' : 'font-normal text-gray-700',
                            isCompleted && !isActive ? 'text-legacy-green/80' : '',
                            !isClickable && 'cursor-not-allowed'
                          )}
                        >
                          <Select.ItemText>{STEP_TITLES[stepNum].title}</Select.ItemText>
                          <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                      );
                    })}
                  </Select.Group>
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