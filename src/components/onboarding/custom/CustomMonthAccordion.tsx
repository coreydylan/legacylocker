import React, { useState, useMemo, useEffect } from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import { Accordion } from "@/components/ui/accordion";
import CustomMonthCard from './CustomMonthCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getMonth, addMonths, getYear } from 'date-fns';

// --- Reusable helpers ---
const ALL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
interface ChronologicalMonth {
  month: string;
  year: number;
}
const getChronologicalMonths = (): ChronologicalMonth[] => {
  const now = new Date();
  const chronologicalMonths: ChronologicalMonth[] = [];
  for (let i = 1; i <= 12; i++) {
    const targetDate = addMonths(now, i);
    chronologicalMonths.push({
      month: ALL_MONTHS[getMonth(targetDate)],
      year: getYear(targetDate),
    });
  }
  return chronologicalMonths;
};
// --- End Helpers ---

const CustomMonthAccordion: React.FC = () => {
  const { customData, updateCustomMonth, isLoading, isHydrated } = useSessionStore(state => ({
    customData: state.session.customData || [],
    updateCustomMonth: state.updateCustomMonth,
    isLoading: state.isLoading,
    isHydrated: state.isHydrated,
  }));

  // State to manage which accordion item is open
  const [openAccordionValue, setOpenAccordionValue] = useState<string | undefined>(undefined);
  // State to manage which tab to open initially when an item is opened via section tracker
  const [initialTabTarget, setInitialTabTarget] = useState<'story' | 'artwork' | 'footer'>('story');

  // Calculate chronological months
  const orderedMonths = useMemo(() => getChronologicalMonths(), []);

  // Create a map for quick lookup
  const customDataMap = useMemo(() => {
    const map = new Map<string, typeof customData[0]>();
    if (customData.length === 12) {
      customData.forEach(data => map.set(`${data.month}-${data.year}`, data));
    }
    return map;
  }, [customData]);

  // Automatically open the first incomplete month when data is loaded
  useEffect(() => {
     if (isHydrated && customDataMap.size === 12 && !openAccordionValue) {
         const firstIncomplete = orderedMonths.find(({ month, year }) => {
             const data = customDataMap.get(`${month}-${year}`);
             const status = data ? getCompletionStatus(data).overall : 'not-started';
             return status !== 'complete';
         });
         if (firstIncomplete) {
             setOpenAccordionValue(`${firstIncomplete.month}-${firstIncomplete.year}`);
         }
     }
  }, [isHydrated, customDataMap, orderedMonths, openAccordionValue]);
  
   // Helper function from CustomMonthCard (needed for useEffect logic)
   const getCompletionStatus = (data: typeof customData[0]): { overall: 'complete' | 'in-progress' | 'not-started' } => {
       const sections = {
            story: !!(data.title && data.story),
            artwork: data.artworkOption !== null,
            footer: !data.footerEnabled || !!data.footerMessage,
        };
        const isComplete = sections.story && sections.artwork && sections.footer;
        const isInProgress = !isComplete && (sections.story || sections.artwork || sections.footer);
        if (isComplete) return { overall: 'complete' };
        if (isInProgress) return { overall: 'in-progress' };
        return { overall: 'not-started' };
    };

  // Handler for when a section icon is clicked in the header
  const handleSectionClick = (accordionValue: string, tab: 'story' | 'artwork' | 'footer') => {
      console.log(`Section click: Accordion ${accordionValue}, Tab ${tab}`);
      setInitialTabTarget(tab);
      // Ensure the accordion item is open or opens it
      setOpenAccordionValue(accordionValue);
  };

  if (isLoading || !isHydrated) {
    return (
      <div className="space-y-4 max-w-3xl mx-auto">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-[70px] rounded-lg" /> // Skeleton for collapsed state
        ))}
      </div>
    );
  }

  if (customDataMap.size !== 12 && isHydrated) {
    console.error("[CustomMonthAccordion]: Custom data size mismatch after hydration.");
    return <p className="text-center text-red-600">Error loading customization data.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Accordion 
        type="single" // Only one item open at a time
        collapsible // Allow closing the open item
        value={openAccordionValue} // Controlled component
        onValueChange={setOpenAccordionValue} // Update state on change
        className="space-y-4"
      >
        {orderedMonths.map(({ month, year }) => {
          const accordionValue = `${month}-${year}`;
          const monthData = customDataMap.get(accordionValue);

          if (!monthData) {
            console.error(`[CustomMonthAccordion]: Missing data for ${month}-${year}`);
            return (
              <div key={accordionValue} className="border p-4 rounded-lg bg-red-50 text-red-700">
                 Error: Data unavailable for {month} {year}.
              </div>
            );
          }
          
          // Determine the initial tab only if this accordion item is the one being opened
          const effectiveInitialTab = openAccordionValue === accordionValue ? initialTabTarget : 'story';

          return (
            <CustomMonthCard
              key={accordionValue}
              monthData={monthData}
              onUpdate={updateCustomMonth}
              accordionValue={accordionValue}
              initialTab={effectiveInitialTab} // Pass calculated initial tab
              onSectionClick={(tab) => handleSectionClick(accordionValue, tab)} // Pass handler down
            />
          );
        })}
      </Accordion>
    </div>
  );
};

export default CustomMonthAccordion; 