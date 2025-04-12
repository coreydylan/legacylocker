import React from 'react';
// import { FormData } from '@/types/onboarding'; // No longer needed
import { useSignatureEditionFlow } from '@/hooks/useSignatureEditionFlow'; // Import refactored hook
import MonthsIndicator from './signature/MonthsIndicator';
import MonthCarousel from './signature/MonthCarousel';
import SignatureEditionInfo from './signature/SignatureEditionInfo';
import { useSessionStore } from '@/lib/sessionStore'; // Import store hook for session data
import { SessionData } from '@/lib/sessionManager'; // Import SessionData for typing

// Remove props interface
// interface SignatureEditionFlowProps { ... }

// Remove props from component signature
const SignatureEditionFlow: React.FC = () => {
  // Call the refactored hook (no arguments needed)
  const {
    selectedMonth,
    openCalendars,
    direction,
    containerHeight,
    setContainerHeight,
    months,
    celebrationTypes,
    currentMonthData, // Data now comes directly from hook (derived from store)
    prevMonth,
    nextMonth,
    handleMonthChange,
    handleMonthDataChange,
    handlePrevMonth,
    handleNextMonth,
    handleCalendarToggle,
    handlePhotoUpload
  } = useSignatureEditionFlow();

  // Get session data for passing to MonthsIndicator
  const { session } = useSessionStore();
  const typedSession = session as SessionData;
  const monthlyData = typedSession.editionFlow?.monthlyData || {};

  return (
    <div className="space-y-5 pb-8">
      <div className="space-y-3 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-legacy-green font-playfair">Personalize Your Cards</h1>
        <p className="text-lg sm:text-xl text-legacy-dark/80">
          Add personal messages to each month's card to make them extra special.
        </p>
      </div>
      
      {/* Pass necessary data from hook and store */}
      <MonthsIndicator 
        months={months} 
        selectedMonth={selectedMonth} 
        monthlyData={monthlyData} // Pass monthlyData from session
      />

      <div className="space-y-8">
        {/* Pass all necessary props from the hook */}
        <MonthCarousel
          selectedMonth={selectedMonth}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
          currentMonthData={currentMonthData}
          openCalendars={openCalendars}
          direction={direction}
          containerHeight={containerHeight}
          setContainerHeight={setContainerHeight}
          handleMonthDataChange={handleMonthDataChange}
          handlePrevMonth={handlePrevMonth}
          handleNextMonth={handleNextMonth}
          handleCalendarToggle={handleCalendarToggle}
          celebrationTypes={celebrationTypes}
          months={months}
          handleMonthChange={handleMonthChange}
          handlePhotoUpload={handlePhotoUpload}
        />

        <div className="pt-10">
          {/* SignatureEditionInfo might need refactoring if it uses props */}
          <SignatureEditionInfo />
        </div>
      </div>
    </div>
  );
};

export default SignatureEditionFlow;
