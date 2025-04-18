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
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
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
    <div className="flex items-center justify-between w-full gap-4 px-4 max-w-lg mx-auto">
      {MAIN_STAGES.map(({ stage, label }) => {
        const stageActive = stage === currentStage;
        const stageCompleted = isStageCompleted(stage);
        const firstStepOfStage = getStepsForStage(stage)[0];
        const stageClickable = firstStepOfStage <= lastCompletedStep + 1;

        return (
          <HoverCard key={stage} openDelay={100} closeDelay={100}>
            <HoverCardTrigger asChild>
              <button
                className={cn(
                  'relative flex flex-col items-center transition-all duration-150',
                  stageClickable ? 'cursor-pointer' : 'cursor-default opacity-60'
                )}
              >
                <span
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium mb-1',
                    stageActive
                      ? 'bg-legacy-green text-white border-legacy-green scale-110'
                      : stageCompleted
                      ? 'bg-legacy-green/10 text-legacy-green border-legacy-green/50'
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
            </HoverCardTrigger>
            <HoverCardContent 
              side="bottom" 
              align="center" 
              className="w-auto p-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[100]"
            >
              <div className="font-semibold px-2 py-1.5 text-sm">{label}</div>
              <DropdownMenuSeparator className="my-1" />
              <div className="space-y-1">
                {getStepsForStage(stage).map((stepNum) => {
                  const isCompleted = stepNum <= lastCompletedStep;
                  const isActive = stepNum === actualCurrentStep;
                  const isClickable = stepNum <= lastCompletedStep + 1;
                  return (
                    <button
                      key={stepNum}
                      disabled={!isClickable}
                      onClick={() => handleStepClick(stepNum)}
                      className={cn(
                        'flex w-full items-center gap-2 text-sm px-2 py-1.5 rounded-sm outline-none transition-colors',
                        'focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none',
                        isActive && 'font-semibold text-legacy-green',
                        isClickable ? 'cursor-pointer hover:bg-legacy-green/10' : 'cursor-not-allowed opacity-60'
                      )}
                    >
                      {isCompleted && <Check className="h-3 w-3 text-legacy-green" />}
                      <span className="flex-1 text-left">{STEP_TITLES[stepNum].title}</span>
                    </button>
                  );
                })}
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </div>
  );
};

export default OnboardingStepperDesktop; 