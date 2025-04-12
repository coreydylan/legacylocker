
import React from 'react';
import { FormData } from '@/types/onboarding';
import { useSignatureEditionFlow } from '@/hooks/useSignatureEditionFlow';
import MonthsIndicator from './signature/MonthsIndicator';
import MonthCarousel from './signature/MonthCarousel';
import SignatureEditionInfo from './signature/SignatureEditionInfo';

interface SignatureEditionFlowProps {
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
}

const SignatureEditionFlow: React.FC<SignatureEditionFlowProps> = ({ formData, updateFormData }) => {
  const {
    selectedMonth,
    openCalendars,
    direction,
    containerHeight,
    setContainerHeight,
    months,
    celebrationTypes,
    currentMonthData,
    prevMonth,
    nextMonth,
    handleMonthChange,
    handleMonthDataChange,
    handlePrevMonth,
    handleNextMonth,
    handleCalendarToggle,
    handlePhotoUpload
  } = useSignatureEditionFlow(formData, updateFormData);

  return (
    <div className="space-y-5 pb-8">
      <div className="space-y-3 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-legacy-green font-playfair">Personalize Your Cards</h1>
        <p className="text-lg sm:text-xl text-legacy-dark/80">
          Add personal messages to each month's card to make them extra special.
        </p>
      </div>
      
      <MonthsIndicator 
        months={months} 
        selectedMonth={selectedMonth} 
        monthlyData={formData.editionFlow.monthlyData || {}} 
      />

      <div className="space-y-8">
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
          <SignatureEditionInfo />
        </div>
      </div>
    </div>
  );
};

export default SignatureEditionFlow;
