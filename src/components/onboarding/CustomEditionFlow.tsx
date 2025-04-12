
import React, { useState, useEffect } from 'react';
import { FormData } from '@/types/onboarding';
import { useSignatureEditionFlow } from '@/hooks/useSignatureEditionFlow';
import IntroStep from './custom/IntroStep';
import CoachingStep from './custom/CoachingStep';
import MonthsStep from './custom/MonthsStep';
import ThemeDisplay from './custom/ThemeDisplay';
import InfoSection from './custom/InfoSection';

interface CustomEditionFlowProps {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
}

// Define the step types for the custom edition flow
type CustomFlowStep = 'coaching' | 'intro' | 'months';

const CustomEditionFlow: React.FC<CustomEditionFlowProps> = ({ formData, updateFormData }) => {
  // Starting with coaching step instead of intro
  const [currentStep, setCurrentStep] = useState<CustomFlowStep>('coaching');
  
  const {
    selectedMonth,
    months,
    direction,
    containerHeight,
    setContainerHeight,
    prevMonth,
    nextMonth,
    currentMonthData,
    celebrationTypes,
    openCalendars,
    handleMonthChange,
    handlePrevMonth,
    handleNextMonth,
    handleMonthDataChange,
    handleCalendarToggle,
    handlePhotoUpload
  } = useSignatureEditionFlow(formData, updateFormData);
  
  // Initialize custom edition data if it doesn't exist
  useEffect(() => {
    if (!formData.editionFlow.customEditionData) {
      updateFormData('editionFlow', { 
        ...formData.editionFlow,
        customEditionData: {
          cards: Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            title: '',
            story: '',
            useExactText: false,
            useExactTitle: false,
            artworkOption: 'from-story',
            photoUrl: undefined
          })),
          theme: formData.selectedSeries?.display || 'Custom Story',
          currentCard: 1
        }
      });
    }
    
    // Set the selected card/month in formData
    const monthIndex = months.indexOf(selectedMonth);
    if (monthIndex >= 0) {
      updateFormData('editionFlow', { 
        ...formData.editionFlow, 
        customEditionData: {
          ...formData.editionFlow.customEditionData,
          currentCard: monthIndex + 1
        }
      });
    }
  }, [formData.editionFlow, updateFormData, selectedMonth, months, formData.selectedSeries]);

  // Handle navigating between intro, coaching, and month cards
  const handleNextStep = () => {
    if (currentStep === 'coaching') {
      setCurrentStep('intro');
    } else if (currentStep === 'intro') {
      setCurrentStep('months');
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep === 'months') {
      setCurrentStep('intro');
    } else if (currentStep === 'intro') {
      setCurrentStep('coaching');
    }
  };
  
  // Get completion for progress indicators
  const getCardCompletionStatus = (monthIndex: number) => {
    const card = formData.editionFlow.customEditionData?.cards?.[monthIndex];
    if (!card) return false;
    return Boolean(card.title || card.story);
  };
  
  // Get theme from form data
  const theme = formData.selectedSeries?.display || 
                formData.editionFlow.customEditionData?.theme || 
                'Custom Story';

  return (
    <div className="space-y-5 pb-8">
      <div className="space-y-3 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-legacy-green font-playfair">Personalize Your Custom Cards</h1>
        <p className="text-lg sm:text-xl text-legacy-dark/80">
          Create a unique series of cards with your own stories and memories.
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Theme Display */}
        <ThemeDisplay theme={theme} />

        {/* Render the appropriate content based on the current step */}
        {currentStep === 'coaching' && (
          <CoachingStep 
            handleNextStep={handleNextStep} 
            handlePreviousStep={() => {}} // No previous step from coaching
          />
        )}
        
        {currentStep === 'intro' && (
          <IntroStep 
            handleNextStep={handleNextStep} 
          />
        )}
        
        {currentStep === 'months' && (
          <MonthsStep 
            selectedMonth={selectedMonth}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            currentMonthData={currentMonthData}
            months={months}
            direction={direction}
            containerHeight={containerHeight}
            openCalendars={openCalendars}
            celebrationTypes={celebrationTypes}
            handleMonthDataChange={handleMonthDataChange}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            handleMonthChange={handleMonthChange}
            handleCalendarToggle={handleCalendarToggle}
            handlePreviousStep={handlePreviousStep}
            setContainerHeight={setContainerHeight}
            getCardCompletionStatus={getCardCompletionStatus}
            handlePhotoUpload={handlePhotoUpload}
          />
        )}
        
        {/* Info Section - only show in months step */}
        {currentStep === 'months' && <InfoSection />}
      </div>
    </div>
  );
};

export default CustomEditionFlow;
