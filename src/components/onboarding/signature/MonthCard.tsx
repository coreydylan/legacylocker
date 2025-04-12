import React from 'react';
import MonthPersonalizationForm from './MonthPersonalizationForm';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthCardProps {
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
  handleMonthDataChange: (field: string, value: any) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  openCalendars: Record<string, boolean>;
  handleCalendarToggle: (month: string, isOpen: boolean) => void;
  celebrationTypes: string[];
  months: string[];
  handleMonthChange: (month: string) => void;
  handlePhotoUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MonthCard: React.FC<MonthCardProps> = ({
  selectedMonth,
  prevMonth,
  nextMonth,
  currentMonthData,
  handleMonthDataChange,
  handlePrevMonth,
  handleNextMonth,
  openCalendars,
  handleCalendarToggle,
  celebrationTypes,
  months,
  handleMonthChange,
  handlePhotoUpload
}) => {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-legacy-cream">
      <div className="bg-legacy-green/10 p-3 border-b border-legacy-cream/30">
        <h2 className="text-xl font-medium text-center text-legacy-green">{selectedMonth}</h2>
      </div>
      
      <MonthPersonalizationForm
        selectedMonth={selectedMonth}
        currentMonthData={currentMonthData}
        handleMonthDataChange={handleMonthDataChange}
        openCalendars={openCalendars}
        handleCalendarToggle={handleCalendarToggle}
        celebrationTypes={celebrationTypes}
        handlePhotoUpload={handlePhotoUpload}
      />

      <div className="flex justify-between items-center w-full py-3 px-4 border-t border-legacy-cream/30">
        {prevMonth ? (
          <Button 
            variant="outline" 
            onClick={handlePrevMonth}
            className="text-legacy-dark/60 hover:text-legacy-green flex items-center border-legacy-cream"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {prevMonth}
          </Button>
        ) : (
          <div className="w-20" />
        )}
        
        {nextMonth ? (
          <Button 
            onClick={handleNextMonth}
            className="bg-legacy-green text-white hover:bg-legacy-green/90 flex items-center"
            size="sm"
          >
            {nextMonth}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button 
            className="bg-legacy-green text-white hover:bg-legacy-green/90"
            size="sm"
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
};

export default MonthCard;
