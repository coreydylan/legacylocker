import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import MonthCarousel from '../signature/MonthCarousel';
import CardProgressIndicator from './CardProgressIndicator';
import { useSignatureEditionFlow } from '@/hooks/useSignatureEditionFlow';
import { useSessionStore } from '@/lib/sessionStore';
import { SessionData, CustomCardData } from '@/lib/sessionManager';

interface MonthsStepProps {
  handlePreviousStep: () => void;
}

const MonthsStep: React.FC<MonthsStepProps> = ({ handlePreviousStep }) => {
  const { session, updateSession } = useSessionStore();
  const typedSession = session as SessionData;
  
  const {
  selectedMonth,
  months,
  direction,
  containerHeight,
    setContainerHeight,
    prevMonth,
    nextMonth,
    celebrationTypes,
  openCalendars,
    handleMonthChange,
  handlePrevMonth,
  handleNextMonth,
  handleCalendarToggle,
  } = useSignatureEditionFlow();

  const currentCardIndex = months.indexOf(selectedMonth);
  const currentCustomCardData: CustomCardData = 
    typedSession.editionFlow?.customEditionData?.cards?.[currentCardIndex] || 
    { id: currentCardIndex + 1, title: '', story: '' };

  const handleCustomDataChange = (field: keyof CustomCardData, value: any) => {
    if (currentCardIndex < 0) return;
    const fieldName = String(field);
    updateSession(`editionFlow.customEditionData.cards.${currentCardIndex}.${fieldName}`, value);
  };
  
  const handleCustomPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const filePath = `uploads/custom/${typedSession.sessionId}/${currentCardIndex + 1}-${file.name}`;
      handleCustomDataChange('photoUrl', filePath);
      console.log(`Custom photo selected: ${file.name}`);
    }
  };

  const getCardCompletionStatus = (monthIndex: number) => {
    const card = typedSession.editionFlow?.customEditionData?.cards?.[monthIndex];
    return Boolean(card?.title || card?.story);
  };

  return (
    <>
      <CardProgressIndicator
        months={months}
        selectedMonth={selectedMonth}
        getCardCompletionStatus={getCardCompletionStatus}
        handleMonthChange={handleMonthChange}
      />

      <MonthCarousel
        selectedMonth={selectedMonth}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
        currentMonthData={{
          personalMessage: currentCustomCardData.story, 
          celebration: currentCustomCardData.title,
          useExactText: currentCustomCardData.useExactText,
          useExactTitle: currentCustomCardData.useExactTitle,
          artworkOption: currentCustomCardData.artworkOption,
          photoUrl: currentCustomCardData.photoUrl
        }}
        handleMonthDataChange={handleCustomDataChange}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        openCalendars={openCalendars}
        handleCalendarToggle={handleCalendarToggle}
        direction={direction}
        containerHeight={containerHeight}
        setContainerHeight={setContainerHeight}
        celebrationTypes={celebrationTypes}
        months={months}
        handleMonthChange={handleMonthChange}
        handlePhotoUpload={handleCustomPhotoUpload}
      />

      <div className="mt-6">
        <Button 
          variant="outline" 
          onClick={handlePreviousStep}
          className="text-legacy-dark/60 hover:text-legacy-green border-legacy-cream"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Intro
        </Button>
      </div>
    </>
  );
};

export default MonthsStep;
