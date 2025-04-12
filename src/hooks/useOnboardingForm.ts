import { useState, useEffect, useCallback } from 'react';
import { FormData, SeriesType } from '../types/onboarding';
import { saveCurrentSession } from '../services/sessionService';

// Initialize monthly data with empty values
const initializeMonthlyData = () => {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return months.reduce((acc, month) => {
    acc[month] = {
      celebration: '',
      personalMessage: '',
      customDate: undefined,
      imageType: 'none',
      imageUrl: undefined,
      isLocked: false
    };
    return acc;
  }, {} as Record<string, any>);
};

export const useOnboardingForm = (selectedSeries: SeriesType | null) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    giftType: null,
    purchaser: {
      fullName: '',
      email: '',
    },
    recipient: {
      type: 'individual',
      firstName: '',
      lastName: '',
      relationship: '',
      includeWelcomeCard: false,
    },
    editionFlow: {
      type: selectedSeries?.type || 'signature',
      monthlyData: initializeMonthlyData()
    },
    selectedSeries: selectedSeries || undefined
  });

  // Reset to step 1 whenever the modal is opened and update edition type based on selection
  useEffect(() => {
    setCurrentStep(1);
    
    // Update the edition type based on the selected series
    if (selectedSeries) {
      setFormData(prev => ({
        ...prev,
        selectedSeries,
        editionFlow: {
          ...prev.editionFlow,
          type: selectedSeries.type || 'signature',
          monthlyData: prev.editionFlow.monthlyData || initializeMonthlyData()
        }
      }));
    }
  }, [selectedSeries]);

  // Update form data with proper typing
  const updateFormData = useCallback((sectionKey: keyof FormData, data: any) => {
    setFormData(prevData => {
      let updatedData: FormData;

      // Handle primitive values directly (like giftType)
      if (sectionKey === 'giftType') {
        // When changing gift type, ensure recipient structure is correctly initialized
        if (data === 'couple' && (!prevData.recipient || prevData.recipient.type !== 'couple')) {
          updatedData = {
            ...prevData,
            [sectionKey]: data,
            recipient: {
              type: 'couple',
              recipient1FirstName: '',
              recipient1LastName: '',
              recipient2FirstName: '',
              recipient2LastName: '',
              relationship: '',
              includeWelcomeCard: false,
            }
          };
        } else if ((data === 'individual' || data === 'myself') && 
                  (!prevData.recipient || prevData.recipient.type !== 'individual')) {
          updatedData = {
            ...prevData,
            [sectionKey]: data,
            recipient: {
              type: 'individual',
              firstName: '',
              lastName: '',
              relationship: '',
              includeWelcomeCard: false,
            }
          };
        } else {
          updatedData = {
            ...prevData,
            [sectionKey]: data
          };
        }
      } else {
        // Handle object values with type-safe spread
        if (typeof data === 'object' && data !== null) {
          updatedData = {
            ...prevData,
            [sectionKey]: {
              ...(prevData[sectionKey] as Record<string, any> || {}),
              ...data
            }
          };
        } else {
          updatedData = {
            ...prevData,
            [sectionKey]: data
          };
        }
      }
      
      // Save after each update
      saveCurrentSession(updatedData);
      
      return updatedData;
    });
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      // Skip step 3 if gift type is 'myself'
      if (currentStep === 2 && formData.giftType === 'myself') {
        setCurrentStep(4);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Skip back over step 3 if gift type is 'myself'
      if (currentStep === 4 && formData.giftType === 'myself') {
        setCurrentStep(2);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  // Determine if the current step is valid and can proceed
  const canProceed = () => {
    // Each step has its own validation logic
    switch (currentStep) {
      case 1: // Introduction
        return formData.giftType !== null;
      case 2: // Purchaser Info
        return formData.purchaser.fullName && formData.purchaser.email;
      case 3: // Recipient Info
        if (formData.recipient?.type === 'individual') {
          return formData.recipient.firstName && formData.recipient.lastName;
        } else if (formData.recipient?.type === 'couple') {
          return formData.recipient.recipient1FirstName && formData.recipient.recipient2FirstName;
        }
        return false;
      case 4: // Edition Flow
        return true; // This depends on the specific flow
      case 5: // Review
        return true; // Always able to submit at review
      default:
        return false;
    }
  };

  const totalSteps = 5;

  return {
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    updateFormData,
    handleNext,
    handleBack,
    canProceed,
    totalSteps
  };
};
