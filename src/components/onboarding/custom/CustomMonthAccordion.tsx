import React, { useState, useMemo, useEffect } from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import { Accordion } from "@/components/ui/accordion";
import CustomMonthCard from './CustomMonthCard';
import type { CustomMonthTab } from './CustomMonthCard';
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
  const { customData, updateCustomMonth, isLoading, isHydrated, initializeCustomDataDates } = useSessionStore(state => ({
    customData: state.session.customData || [],
    updateCustomMonth: state.updateCustomMonth,
    isLoading: state.isLoading,
    isHydrated: state.isHydrated,
    initializeCustomDataDates: state.initializeCustomDataDates,
  }));

  // State to manage which accordion item is open
  const [openAccordionValue, setOpenAccordionValue] = useState<string | undefined>(undefined);
  // State to manage which tab to open initially when an item is opened via section tracker
  const [initialTabTarget, setInitialTabTarget] = useState<CustomMonthTab>('story');
  // State to track if initial open has been attempted
  const [initialOpenAttempted, setInitialOpenAttempted] = useState(false);

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

  // Automatically open the first incomplete month ONCE when data is loaded
  useEffect(() => {
     // Only run if hydrated, data is ready, and we haven't tried opening yet
     if (isHydrated && customDataMap.size === 12 && !initialOpenAttempted) {
         // Check if something isn't already open (e.g., potentially restored)
         if (openAccordionValue === undefined) {
             // <<< Comment out the logic that finds and opens the first incomplete item >>>
             /*
             const firstIncomplete = orderedMonths.find(({ month, year }) => {
                 const data = customDataMap.get(`${month}-${year}`);
                 const status = data ? getCompletionStatus(data).overall : 'not-started';
                 return status !== 'complete';
             });
             if (firstIncomplete) {
                 console.log("[CustomMonthAccordion Effect]: Automatically opening first incomplete month:", `${firstIncomplete.month}-${firstIncomplete.year}`);
                 setOpenAccordionValue(`${firstIncomplete.month}-${firstIncomplete.year}`);
             }
             */
             console.log("[CustomMonthAccordion Effect]: Skipping auto-open logic.");
         }
         // Mark that we've attempted the initial open (or skip logic)
         setInitialOpenAttempted(true);
     }
  // Only depend on hydration status, data readiness, and the attempt flag
  }, [isHydrated, customDataMap, orderedMonths, initialOpenAttempted, openAccordionValue]); // Keep openAccordionValue here to prevent potential race conditions where it might be set externally before this runs
  
   // Helper function from CustomMonthCard (needed for useEffect logic)
   const getCompletionStatus = (data: typeof customData[0]): { overall: 'complete' | 'in-progress' | 'not-started' } => {
       const sections = {
            story: !!(data.title && data.story),
            artwork: data.artworkOption !== null,
            footer: data.enabled || !!data.footerMessage,
        };
        const isComplete = sections.story && sections.artwork && sections.footer;
        const isInProgress = !isComplete && (sections.story || sections.artwork || sections.footer);
        if (isComplete) return { overall: 'complete' };
        if (isInProgress) return { overall: 'in-progress' };
        return { overall: 'not-started' };
    };

  // Handler for when a section icon is clicked in the header - REMOVED as unused
  // const handleSectionClick = (accordionValue: string, tab: CustomMonthTab) => {
  //     console.log(`Section click: Accordion ${accordionValue}, Tab ${tab}`);
  //     setInitialTabTarget(tab);
  //     // Ensure the accordion item is open or opens it
  //     setOpenAccordionValue(accordionValue);
  // };

  // Ensure custom data dates are initialized once hydration is complete
  useEffect(() => {
    if (isHydrated) {
      console.log("[CustomMonthAccordion]: Hydrated – initializing custom data dates...");
      initializeCustomDataDates();
    }
  }, [isHydrated, initializeCustomDataDates]);

  if (isLoading || !isHydrated) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-legacy-green/5 rounded-xl p-6 flex items-center justify-between animate-pulse"
          >
            <div className="text-2xl font-medium text-legacy-green/20">
              {orderedMonths[index]?.month} {orderedMonths[index]?.year}
            </div>
            <div className="w-12 h-6 bg-legacy-green/10 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (customDataMap.size !== 12 && isHydrated) {
    console.error("[CustomMonthAccordion]: Custom data size mismatch after hydration.");
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div 
            key={index} 
            className="bg-legacy-green/5 rounded-xl p-6 flex items-center justify-between animate-pulse"
          >
            <div className="text-2xl font-medium text-legacy-green/20">
              {orderedMonths[index]?.month} {orderedMonths[index]?.year}
            </div>
            <div className="w-12 h-6 bg-legacy-green/10 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Accordion 
        type="single" // Only one item open at a time
        collapsible // Allow closing the open item
        value={openAccordionValue} // Controlled component
        onValueChange={setOpenAccordionValue} // Update state on change
        className=""
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
              // onSectionClick={(tab) => handleSectionClick(accordionValue, tab)} // REMOVED prop
            />
          );
        })}
      </Accordion>
    </div>
  );
};

export default CustomMonthAccordion; 