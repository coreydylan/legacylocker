export const MAIN_STAGES = [
  { stage: 1, label: 'Setup' },       // Steps 1, 2, 3
  { stage: 2, label: 'Delivery' },    // Steps 4, 5
  { stage: 3, label: 'Customize' },   // Steps 6, 7
  { stage: 4, label: 'Review' },      // Step 8
] as const;

// Map Actual Step Number (1-8) to Main Stage Number (1-4)
export const STEP_TO_MAIN_STAGE_MAP: { [key: number]: number } = {
  1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 3, 7: 3, 8: 4,
};

export const STEP_TITLES: { [key: number]: { title: string; subtitle: string } } = {
  1: { title: 'Select Recipient', subtitle: 'Who is this amazing gift for?' },
  2: { title: 'Your Information', subtitle: 'Tell us a little about yourself.' },
  3: { title: 'Recipient Details', subtitle: "Let's get the details for the lucky recipient." },
  4: { title: 'Shipping Address', subtitle: 'Where should we send the welcome kit?' },
  5: { title: 'Envelope Name', subtitle: 'How should the envelope be addressed?' },
  6: { title: 'Welcome Card', subtitle: 'Personalize the welcome message.' },
  7: { title: 'Customize Edition', subtitle: 'Fine-tune the details of your selected edition.' },
  8: { title: 'Review & Checkout', subtitle: 'Almost there! Double-check everything.' },
};

export const TOTAL_STEPS = Object.keys(STEP_TITLES).length;
export const TOTAL_STAGES = MAIN_STAGES.length;

// Helper utils to retrieve stage/step details
export const getStageForStep = (step: number): number => {
  return STEP_TO_MAIN_STAGE_MAP[step];
};

export const getStepsForStage = (stageNumber: number): number[] => {
  return Object.entries(STEP_TO_MAIN_STAGE_MAP)
    .filter(([, stage]) => stage === stageNumber)
    .map(([step]) => Number(step))
    .sort((a, b) => a - b);
};

export const getFirstStepOfStage = (stageNumber: number): number => {
  const steps = getStepsForStage(stageNumber);
  return steps[0];
}; 