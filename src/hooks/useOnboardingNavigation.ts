import { useCallback } from 'react';
import { useSessionStore } from '@/lib/sessionStore';

// Define the steps in the onboarding flow
export const STEPS = {
  STORY_SERIES_SELECTOR: 1,
  INTRODUCTION: 2,
  PURCHASER_INFO: 3,
  RECIPIENT_INFO: 4,
  SHIPPING_INFO: 5,
  ENVELOPE_PERSONALIZATION: 6,
  SIGNATURE_EDITION_DETAILS: 7,
  REVIEW_CHECKOUT: 8
} as const;

export type StepKey = keyof typeof STEPS;
export type StepValue = typeof STEPS[StepKey];

export const useOnboardingNavigation = () => {
  const { 
    session, 
    setCurrentStep, 
    nextStep: storeNextStep, 
    prevStep: storePrevStep,
    setLastCompletedStep 
  } = useSessionStore();

  const currentStep = session.currentStep;
  const lastCompletedStep = session.lastCompletedStep;

  // Check if a step can be accessed based on the last completed step
  const canAccessStep = useCallback((step: number): boolean => {
    return step <= lastCompletedStep + 1;
  }, [lastCompletedStep]);

  // Go to the next step
  const goNext = useCallback(() => {
    // Update the last completed step if needed
    if (currentStep > lastCompletedStep) {
      setLastCompletedStep(currentStep);
    }
    storeNextStep();
  }, [currentStep, lastCompletedStep, setLastCompletedStep, storeNextStep]);

  // Go to the previous step
  const goBack = useCallback(() => {
    storePrevStep();
  }, [storePrevStep]);

  // Jump to a specific step (only if it can be accessed)
  const jumpToStep = useCallback((step: number) => {
    if (canAccessStep(step)) {
      setCurrentStep(step);
    } else {
      console.warn(`Cannot jump to step ${step} because it's not accessible yet.`);
    }
  }, [canAccessStep, setCurrentStep]);

  return {
    currentStep,
    lastCompletedStep,
    canAccessStep,
    goNext,
    goBack,
    jumpToStep,
    setLastCompletedStep
  };
};