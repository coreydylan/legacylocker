import React from 'react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';
import {
  MAIN_STAGES,
  getStageForStep,
  getStepsForStage,
  STEP_TITLES,
} from '@/constants/onboardingStages';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Check } from 'lucide-react';

const OnboardingStepperDesktop: React.FC = () => {
  const { session, setCurrentStep } = useSessionStore();
  const actualCurrentStep = session.currentStep;
  const lastCompletedStep = session.lastCompletedStep;
  const currentStage = getStageForStep(actualCurrentStep);

  const handleStepClick = (step: number) => {
    if (step <= lastCompletedStep + 1 && step !== actualCurrentStep) {
      setCurrentStep(step);
    }
  };

  const isStageCompleted = (stageNumber: number) => {
    const stageSteps = getStepsForStage(stageNumber);
    return stageSteps.every((step) => step <= lastCompletedStep);
  };

  return (
    <div className="flex items-center justify-center w-full gap-4 px-4 max-w-xl mx-auto">
      {MAIN_STAGES.map(({ stage, label }) => {
        const stageActive = stage === currentStage;
        const stageCompleted = isStageCompleted(stage);
        const firstStepOfStage = getStepsForStage(stage)[0];
        const stageClickable = firstStepOfStage <= lastCompletedStep + 1;

        return (
          <DropdownMenu key={stage}>
            <DropdownMenuTrigger asChild>
              <button
                disabled={!stageClickable}
                className={cn(
                  'relative flex flex-col items-center transition-all duration-150',
                  stageClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                )}
              >
                <span
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium mb-1',
                    stageActive
                      ? 'bg-legacy-green text-white border-legacy-green scale-110'
                      : stageCompleted
                      ? 'bg-legacy-green/10 text-legacy-green border-legacy-green/50 hover:bg-legacy-green/20'
                      : 'bg-gray-100 text-gray-400 border-gray-300'
                  )}
                >
                  {stage}
                </span>
                <span
                  className={cn(
                    'text-xs leading-tight',
                    stageActive ? 'text-legacy-green font-medium' : 'text-gray-600'
                  )}
                >
                  {label}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="center">
              <DropdownMenuLabel>{label}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {getStepsForStage(stage).map((stepNum) => {
                const isCompleted = stepNum <= lastCompletedStep;
                const isActive = stepNum === actualCurrentStep;
                const isClickable = stepNum <= lastCompletedStep + 1;
                return (
                  <DropdownMenuItem
                    key={stepNum}
                    disabled={!isClickable}
                    onSelect={() => handleStepClick(stepNum)}
                    className={cn(
                      'flex items-center gap-2 text-sm',
                      isActive && 'font-semibold text-legacy-green',
                      !isClickable && 'cursor-not-allowed opacity-60'
                    )}
                  >
                    {isCompleted && <Check className="h-3 w-3 text-legacy-green" />}
                    <span>{STEP_TITLES[stepNum].title}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}
    </div>
  );
};

export default OnboardingStepperDesktop; 