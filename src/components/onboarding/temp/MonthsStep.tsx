
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import MonthCarousel from '../signature/MonthCarousel';
import CardProgressIndicator from './CardProgressIndicator';

interface MonthsStepProps {
  selectedMonth: string;
  prevMonth: string | null;
  nextMonth: string | null;
  currentMonthData: {
    personalMessage?: string;
    celebration?: string;
    customDate?: Date;
    useExactText?: boolean;
    useExactTitle?: boolean;
    artworkOption?: string;
    photoUrl?: string;
  };
  months: string[];
  direction: 'left' | 'right';
  containerHeight: number | string;
  openCalendars: Record<string, boolean>;
  celebrationTypes: string[];
  handleMonthDataChange: (field: string, value: any) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleMonthChange: (month: string) => void;
  handleCalendarToggle: (month: string, isOpen: boolean) => void;
  handlePreviousStep: () => void;
  setContainerHeight: (height: number | string) => void;
  getCardCompletionStatus: (monthIndex: number) => boolean;
  handlePhotoUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MonthsStep: React.FC<MonthsStepProps> = ({
  selectedMonth,
  prevMonth,
  nextMonth,
  currentMonthData,
  months,
  direction,
  containerHeight,
  openCalendars,
  celebrationTypes,
  handleMonthDataChange,
  handlePrevMonth,
  handleNextMonth,
  handleMonthChange,
  handleCalendarToggle,
  handlePreviousStep,
  setContainerHeight,
  getCardCompletionStatus,
  handlePhotoUpload
}) => {
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
        currentMonthData={currentMonthData}
        handleMonthDataChange={handleMonthDataChange}
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
        handlePhotoUpload={handlePhotoUpload}
      />

      <div className="mt-6">
        <Button 
          variant="outline" 
          onClick={handlePreviousStep}
          className="text-legacy-dark/60 hover:text-legacy-green border-legacy-cream"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Story Tips
        </Button>
      </div>
    </>
  );
};

export default MonthsStep;
