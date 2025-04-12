import React, { useState, useEffect } from 'react';
// import { FormData } from '@/types/onboarding'; // Not needed
import { useSignatureEditionFlow } from '@/hooks/useSignatureEditionFlow'; // Refactored hook
import IntroStep from './custom/IntroStep';
import CoachingStep from './custom/CoachingStep';
import MonthsStep from './custom/MonthsStep';
import ThemeDisplay from './custom/ThemeDisplay';
import InfoSection from './custom/InfoSection';
import { useSessionStore } from '@/lib/sessionStore'; // Import store hook
import { SessionData } from '@/lib/sessionManager'; // Import SessionData for typing

// interface CustomEditionFlowProps { ... } // Remove props interface

// Define the step types for the custom edition flow
type CustomFlowStep = 'coaching' | 'intro' | 'months';

// Remove props from component signature
const CustomEditionFlow: React.FC = () => { 
  // Get store state/actions
  const { session, updateSession } = useSessionStore();
  const typedSession = session as SessionData;
  
  // Internal step management
  // TODO: Initialize based on session if resuming?
  const [currentStep, setCurrentStep] = useState<CustomFlowStep>('coaching');
  
  // Use the refactored hook (no args needed)
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
  } = useSignatureEditionFlow();
  
  // Initialize custom edition data in session if it doesn't exist
  useEffect(() => {
    if (!typedSession.editionFlow?.customEditionData) {
      // Initialize the custom data structure
      const initialCustomData = {
          cards: Array.from({ length: 12 }, (_, i) => ({
            id: i + 1,
            title: '',
            story: '',
            useExactText: false,
            useExactTitle: false,
            artworkOption: 'from-story',
            photoUrl: undefined
          })),
        theme: typedSession.selectedSeries?.display || 'Custom Story',
        currentCard: 1 // Default to the first card
      };
      updateSession('editionFlow.customEditionData', initialCustomData);
    }
  }, [typedSession.editionFlow, typedSession.selectedSeries, updateSession]);
    
  // Sync the hook's selectedMonth with the custom data's currentCard in session
  useEffect(() => {
    const monthIndex = months.indexOf(selectedMonth);
    const currentCardInSession = typedSession.editionFlow?.customEditionData?.currentCard;
    if (monthIndex >= 0 && currentCardInSession !== monthIndex + 1) {
      updateSession('editionFlow.customEditionData.currentCard', monthIndex + 1);
    }
  }, [selectedMonth, months, typedSession.editionFlow?.customEditionData?.currentCard, updateSession]);

  // Handle navigating between intro, coaching, and month cards
  const handleNextStep = () => {
    if (currentStep === 'coaching') {
      setCurrentStep('intro');
    } else if (currentStep === 'intro') {
      setCurrentStep('months');
    }
    // TODO: Should this call the main `nextStep` from useSessionStore when finishing 'months'?
  };
  
  const handlePreviousStep = () => {
    if (currentStep === 'months') {
      setCurrentStep('intro');
    } else if (currentStep === 'intro') {
      setCurrentStep('coaching');
    }
    // TODO: Should this call the main `prevStep` if going back from 'coaching'?
  };
  
  // Get completion for progress indicators (using session data)
  const getCardCompletionStatus = (monthIndex: number) => {
    const card = typedSession.editionFlow?.customEditionData?.cards?.[monthIndex];
    if (!card) return false;
    return Boolean(card.title || card.story);
  };
  
  // Get theme from session data
  const theme = typedSession.selectedSeries?.display || 
                typedSession.editionFlow?.customEditionData?.theme || 
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
        {/* Theme Display - Check if props needed or use store */}
        <ThemeDisplay theme={theme} />

        {/* Render the appropriate content based on the current step */}
        {currentStep === 'coaching' && (
          // CoachingStep likely needs refactoring
          <CoachingStep 
            handleNextStep={handleNextStep} 
            handlePreviousStep={handlePreviousStep} // Pass prev handler
          />
        )}
        
        {currentStep === 'intro' && (
          // IntroStep likely needs refactoring
          <IntroStep 
            handleNextStep={handleNextStep} 
            // Add handlePreviousStep if needed
          />
        )}
        
        {currentStep === 'months' && (
          // MonthsStep likely needs refactoring
          <MonthsStep 
            selectedMonth={selectedMonth}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            // Pass currentMonthData from the *custom* structure in session
            currentMonthData={typedSession.editionFlow?.customEditionData?.cards?.[months.indexOf(selectedMonth)] || {}}
            months={months}
            direction={direction}
            containerHeight={containerHeight}
            openCalendars={openCalendars}
            celebrationTypes={celebrationTypes} // This might be specific to signature?
            // Update handler needs to target the custom data structure
            handleMonthDataChange={(field, value) => updateSession(`editionFlow.customEditionData.cards.${months.indexOf(selectedMonth)}.${field}`, value)}
            handlePrevMonth={handlePrevMonth} // Hook handles month change
            handleNextMonth={handleNextMonth} // Hook handles month change
            handleMonthChange={handleMonthChange} // Hook handles month change
            handleCalendarToggle={handleCalendarToggle}
            handlePreviousStep={handlePreviousStep} // Back to intro step
            setContainerHeight={setContainerHeight}
            getCardCompletionStatus={getCardCompletionStatus}
            handlePhotoUpload={handlePhotoUpload} // Hook handles photo upload (needs custom path)
          />
        )}
        
        {/* Info Section - Check if props needed */}
        {currentStep === 'months' && <InfoSection />}
      </div>
    </div>
  );
};

export default CustomEditionFlow;
