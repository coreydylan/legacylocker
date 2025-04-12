import React from 'react';
import { cn } from "@/lib/utils";
import { useSessionStore } from '@/lib/sessionStore';
import { SessionData } from '@/lib/sessionManager';
import { useSignatureEditionFlow } from '@/hooks/useSignatureEditionFlow';

const CardProgressIndicator: React.FC = () => {
  const { session } = useSessionStore();
  const typedSession = session as SessionData;
  
  const { months, selectedMonth, handleMonthChange } = useSignatureEditionFlow();
  
  const getCardCompletionStatus = (monthIndex: number) => {
    const card = typedSession.editionFlow?.customEditionData?.cards?.[monthIndex];
    return Boolean(card?.title || card?.story);
  };

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
