
import React from 'react';
import { cn } from "@/lib/utils";

interface CardProgressIndicatorProps {
  months: string[];
  selectedMonth: string;
  getCardCompletionStatus: (monthIndex: number) => boolean;
  handleMonthChange: (month: string) => void;
}

const CardProgressIndicator: React.FC<CardProgressIndicatorProps> = ({ 
  months, 
  selectedMonth, 
  getCardCompletionStatus,
  handleMonthChange 
}) => {
  return (
    <div className="flex justify-center items-center mb-6">
      <div className="flex space-x-2">
        {months.map((month, i) => {
          const isActive = month === selectedMonth;
          const isCompleted = getCardCompletionStatus(i);
          
          return (
            <button
              key={month}
              onClick={() => handleMonthChange(month)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                isActive 
                  ? "bg-legacy-green scale-125" 
                  : isCompleted 
                    ? "bg-legacy-green/30" 
                    : "border border-gray-300 bg-transparent"
              )}
              aria-label={`Month ${month}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CardProgressIndicator;
