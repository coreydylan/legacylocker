
import React from 'react';
import { cn } from "@/lib/utils";

interface MonthsIndicatorProps {
  months: string[];
  selectedMonth: string;
  monthlyData: Record<string, { personalMessage?: string; celebration?: string; customDate?: Date; }>;
}

const MonthsIndicator: React.FC<MonthsIndicatorProps> = ({ 
  months, 
  selectedMonth, 
  monthlyData
}) => {
  return (
    <div className="flex justify-center items-center mb-6">
      <div className="flex space-x-2">
        {months.map((month, index) => {
          const isActive = month === selectedMonth;
          const isComplete = Boolean(monthlyData?.[month]?.personalMessage);
          
          return (
            <div 
              key={month}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                isActive 
                  ? "bg-legacy-green" 
                  : isComplete 
                    ? "bg-legacy-green/30" 
                    : "border border-gray-300 bg-transparent"
              )}
              aria-label={`Month ${index + 1}: ${month}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MonthsIndicator;
