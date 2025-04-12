
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface MonthNavigationProps {
  prevMonth: string | null;
  nextMonth: string | null;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
}

const MonthNavigation: React.FC<MonthNavigationProps> = ({ 
  prevMonth, 
  nextMonth, 
  handlePrevMonth, 
  handleNextMonth 
}) => {
  return (
    <div className="flex justify-between items-center w-full max-w-lg mx-auto mt-6 py-4 px-6 border-t border-legacy-cream/30">
      {prevMonth ? (
        <Button 
          variant="outline" 
          onClick={handlePrevMonth}
          className="text-legacy-dark/60 hover:text-legacy-green flex items-center px-4 border-legacy-cream"
          aria-label={`Go to previous month: ${prevMonth}`}
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          {prevMonth}
        </Button>
      ) : (
        <div className="w-24" />
      )}
      
      {nextMonth ? (
        <Button 
          onClick={handleNextMonth}
          className="bg-legacy-green/10 text-legacy-green hover:bg-legacy-green/20 flex items-center font-medium px-4"
          aria-label={`Go to next month: ${nextMonth}`}
        >
          {nextMonth}
          <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      ) : (
        <Button 
          className="bg-legacy-green text-white hover:bg-legacy-green/90 px-6"
          onClick={() => {/* Handle completion */}}
        >
          Complete
        </Button>
      )}
    </div>
  );
};

export default MonthNavigation;
