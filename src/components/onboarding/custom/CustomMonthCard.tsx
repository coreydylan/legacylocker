import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ChevronDown, Lock, Unlock } from 'lucide-react';
import { CustomMonthData, useSessionStore } from '@/lib/sessionStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import StoryTab from './StoryTab';
import ArtworkTab from './ArtworkTab';
import FooterTab from './FooterTab';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';

// Define completion status types
type CompletionStatus = 'complete' | 'in-progress' | 'not-started';
type SectionStatus = { story: boolean; artwork: boolean; footer: boolean };

// Define the possible tab values
export type CustomMonthTab = 'story' | 'artwork' | 'custom-notes'; // <<< Rename 'footer'

// Define Lock Status types
type LockStatus = 'locked' | 'in-progress' | 'not-started';
interface SectionLockStatus {
  story: LockStatus;
  artwork: LockStatus;
  notes: LockStatus;
}

interface CustomMonthCardProps {
  monthData: CustomMonthData;
  onUpdate: (month: string, year: number, update: Partial<CustomMonthData>) => void;
  accordionValue: string; // e.g., "January-2024"
  initialTab?: CustomMonthTab; // Optional: To open to a specific tab
}

// Updated helper function for Lock Status
const getSectionLockStatus = (data: CustomMonthData): SectionLockStatus => {
  const getStatus = (
    isLocked: boolean | undefined,
    hasProgress: boolean
  ): LockStatus => {
    if (isLocked) return 'locked';
    if (hasProgress) return 'in-progress';
    return 'not-started';
  };

  const storyInProgress = !!(data.title || data.story);
  const artworkInProgress = data.artworkOption !== null;
  // Notes are in progress if enabled=true OR if disabled but has content (user might disable later)
  const notesInProgress = data.enabled || !!(data.footerMessage || data.shipDate);

  return {
    story: getStatus(data.storyLocked, storyInProgress),
    artwork: getStatus(data.artworkLocked, artworkInProgress),
    notes: getStatus(data.notesLocked, notesInProgress),
  };
};

const CustomMonthCard: React.FC<CustomMonthCardProps> = ({
  monthData,
  onUpdate,
  accordionValue,
  initialTab = 'story',
}) => {
  const { saveSessionData } = useSessionManager();
  const { month, year } = monthData;
  const sectionLockStatus = useMemo(() => getSectionLockStatus(monthData), [monthData]);
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  // <<< Add derived state to check if all sections are locked >>>
  const isAllLocked = useMemo(() => {
    return sectionLockStatus.story === 'locked' && 
           sectionLockStatus.artwork === 'locked' && 
           sectionLockStatus.notes === 'locked';
  }, [sectionLockStatus]);

  // --- Debounced Save Logic --- 
  const debouncedSave = useDebouncedCallback(async () => {
    // Check if session is active before saving
    if (!useSessionStore.getState().sessionMetadata.isActive) {
      console.log(`[Autosave] CustomMonthCard (${month}-${year}): Skipped – session not active`);
      return;
    }
    console.log(`[Autosave] CustomMonthCard (${month}-${year}): Triggering save via hook...`);
    try {
      // Call manager hook save
      await saveSessionData();
      console.log(`[Autosave] CustomMonthCard (${month}-${year}): Success via hook`);
    } catch (err) {
      console.error(`[Autosave] CustomMonthCard (${month}-${year}): Failed via hook:`, err);
    }
  }, 1000);

  // Use initialTab prop to set the default value for the Tabs component
  const [activeTab, setActiveTab] = useState<CustomMonthTab>(initialTab);
  
  // Update active tab if initialTab prop changes (when opened via section tracker)
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Helper to handle tab navigation click
  const handleTabNavigationClick = (e: React.MouseEvent | React.KeyboardEvent, tab: CustomMonthTab) => {
    e.stopPropagation(); // Stop propagation to prevent accordion toggle
    console.log(`[TabClick Ref] Clicked tab: ${tab}. IsOpen: ${isOpen}`);
    setActiveTab(tab);
    
    // If the month is closed, find and click the accordion trigger to open it
    if (!isOpen && itemRef.current) {
      console.log(`[TabClick Ref] Accordion is closed (isOpen=${isOpen}). Attempting to open...`);
      const accordionElement = itemRef.current;
      console.log(`[TabClick Ref] Found accordion element for ${accordionValue}:`, accordionElement);
      if (accordionElement.getAttribute('data-state') === 'closed') {
        const trigger = accordionElement.querySelector<HTMLElement>('button[data-state="closed"]');
        console.log(`[TabClick Ref] Found trigger element:`, trigger);
        if (trigger) {
          console.log(`[TabClick Ref] Clicking trigger for ${accordionValue}...`);
          trigger.click();
        } else {
          console.warn(`[TabClick Ref] Could not find trigger button element within itemRef for ${accordionValue}`);
        }
      } else {
        console.warn(`[TabClick Ref] Accordion element not found via ref or not closed for ${accordionValue}. State: ${accordionElement?.getAttribute('data-state')}`);
      }
    } else {
       console.log(`[TabClick Ref] Accordion already open (isOpen=${isOpen}) or itemRef is null. Only setting active tab.`);
    }
  };

  // This function is called by the child tabs AND the lock icons
  const handleUpdate = (update: Partial<CustomMonthData>) => {
    onUpdate(month, year, update);
    debouncedSave();
  };

  // Effect to track accordion open state
  useEffect(() => {
    const node = itemRef.current;
    if (!node) {
        console.warn(`[Effect Ref ${accordionValue}] itemRef.current is null on mount. Observer not set up yet.`);
        return; // Don't proceed if the node isn't available yet
    }

    console.log(`[Effect Ref ${accordionValue}] Setting up MutationObserver on:`, node);
    
    const handleAccordionChange = (mutationsList: MutationRecord[]) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
                const targetElement = mutation.target as HTMLElement;
                const newState = targetElement.getAttribute('data-state');
                console.log(`[Observer Ref ${accordionValue}] data-state changed to: ${newState}`);
                const isAccordionOpen = newState === 'open';
                setIsOpen(isAccordionOpen);
            }
        }
    };

    // Initial check - Get initial state directly from the ref'd node
    const initialState = node.getAttribute('data-state');
    console.log(`[Effect Ref ${accordionValue}] Initial state check from node: ${initialState}`);
    setIsOpen(initialState === 'open');
    
    // Set up mutation observer to watch for data-state changes on the specific node
    const observer = new MutationObserver(handleAccordionChange);
    console.log(`[Effect Ref ${accordionValue}] Observing element:`, node);
    observer.observe(node, {
        attributes: true,
        attributeFilter: ['data-state']
    });
    

    return () => {
        console.log(`[Effect Ref ${accordionValue}] Disconnecting MutationObserver.`);
        observer.disconnect();
    };
  }, [accordionValue]); // Rerun effect if accordionValue changes (though unlikely)

  // Helper to get lock icon class based on status
  const getLockClass = (status: LockStatus): string => {
    switch (status) {
      case 'locked':
        return 'text-green-600'; // Green for locked
      case 'in-progress':
        return 'text-yellow-600'; // Yellow for in-progress
      case 'not-started':
      default:
        return 'text-gray-400'; // Gray for not-started
    }
  };

  // Helper to handle lock clicks
  const handleLockClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    section: keyof SectionLockStatus
  ) => {
    e.stopPropagation(); // Prevent accordion toggle
    
    // Check if the section is already locked - if so, allow unlocking
    const lockKey = `${section}Locked` as keyof Pick<CustomMonthData, 'storyLocked' | 'artworkLocked' | 'notesLocked'>;
    const currentLockedState = monthData[lockKey];
    
    // If already locked, allow unlocking
    if (currentLockedState) {
      handleUpdate({ [lockKey]: false });
      return;
    }
    
    // Check if the section is complete before allowing it to be locked
    let isSectionComplete = false;
    
    switch (section) {
      case 'story':
        // Story is complete if both title and story are filled
        isSectionComplete = !!(monthData.title && monthData.story);
        break;
      case 'artwork':
        // Artwork is complete if an option is selected
        isSectionComplete = monthData.artworkOption !== null;
        break;
      case 'notes':
        // Notes are complete if enabled and has a message, or if disabled
        isSectionComplete = monthData.enabled ? !!monthData.footerMessage : true;
        break;
    }
    
    // Only allow locking if the section is complete
    if (isSectionComplete) {
      handleUpdate({ [lockKey]: true });
    } else {
      // Optionally show a message to the user that the section needs to be completed
      alert(`Please complete the ${section} section before locking it.`);
    }
  };

  // Log state values just before rendering
  console.log(`[Render ${accordionValue}] isOpen: ${isOpen}, activeTab: ${activeTab}`);

  return (
    <AccordionItem 
      ref={itemRef}
      value={accordionValue} 
      className="group overflow-hidden [&_[data-state]]:no-underline border-b-0 my-0 py-0"
    >
      {/* Accordion Header / Trigger */}
      <AccordionTrigger className="flex w-full group/trigger no-underline hover:no-underline data-[state=open]:no-underline [&>svg]:hidden [&_*]:no-underline">
        <div className={cn(
          "flex items-center w-full rounded-lg border shadow-sm transition-colors duration-200", // Base styles
          isAllLocked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200' // Conditional background and border
        )}>
          {/* Left Side: Chevron and Month/Year */}
          <div className="flex items-center gap-2 md:gap-3 px-2 py-2 md:px-4 md:py-3">
            <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200 group-data-[state=open]/trigger:rotate-180" />
            <span className="manrope-header-4 text-neutral-800 no-underline hover:no-underline">
              {month} {year}
            </span>
          </div>

          {/* Right Side: Tab-like Status Indicators */}
          <div className="flex items-stretch ml-auto h-full">
            {/* Story Tab/Indicator */}
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => handleTabNavigationClick(e, 'story')}
              onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleTabNavigationClick(e, 'story') : null}
              className={cn(
                "flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 cursor-pointer relative transition-colors no-underline hover:bg-gray-50/50",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-inset focus-visible:ring-legacy-blue/60",
                {
                  'bg-gray-50': isOpen && activeTab === 'story' && !isAllLocked,
                  'bg-green-100': isOpen && activeTab === 'story' && isAllLocked,
                  'hover:bg-green-200': isOpen && activeTab === 'story' && isAllLocked
                }
              )}
              aria-label={`Navigate to Story tab. Status: ${sectionLockStatus.story}`}
            >
              {/* Lock/Unlock Icon Button */}
              <button
                onClick={(e) => handleLockClick(e, 'story')}
                className={cn(
                  "z-10 rounded-full p-1 md:p-1.5 flex items-center justify-center focus-visible:outline-none",
                  "transition-colors hover:bg-gray-100", // Neutral hover
                  getLockClass(sectionLockStatus.story), // Apply color based on status
                  monthData.storyLocked ? 'bg-green-50' : 'bg-gray-50' // Optional: subtle bg based on lock state
                )}
                aria-label={`Story section is ${sectionLockStatus.story}. Click to ${monthData.storyLocked ? 'unlock' : 'lock'}.`}
              >
                {monthData.storyLocked ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
              {/* Tab Text */}
              <span className="manrope-header-6 text-gray-700 no-underline hover:no-underline">Story</span>
            </div>

            {/* Artwork Tab/Indicator */}
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => handleTabNavigationClick(e, 'artwork')}
              onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleTabNavigationClick(e, 'artwork') : null}
              className={cn(
                "flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 cursor-pointer relative transition-colors border-l border-gray-200 no-underline hover:bg-gray-50/50",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-inset focus-visible:ring-legacy-blue/60",
                {
                  'bg-gray-50': isOpen && activeTab === 'artwork' && !isAllLocked,
                  'bg-green-100': isOpen && activeTab === 'artwork' && isAllLocked,
                  'hover:bg-green-200': isOpen && activeTab === 'artwork' && isAllLocked
                }
              )}
              aria-label={`Navigate to Artwork tab. Status: ${sectionLockStatus.artwork}`}
            >
              <button
                onClick={(e) => handleLockClick(e, 'artwork')}
                className={cn(
                  "z-10 rounded-full p-1 md:p-1.5 flex items-center justify-center focus-visible:outline-none",
                  "transition-colors hover:bg-gray-100", // Neutral hover
                  getLockClass(sectionLockStatus.artwork), // Apply color based on status
                  monthData.artworkLocked ? 'bg-green-50' : 'bg-gray-50' // Optional: subtle bg based on lock state
                )}
                aria-label={`Artwork section is ${sectionLockStatus.artwork}. Click to ${monthData.artworkLocked ? 'unlock' : 'lock'}.`}
              >
                {monthData.artworkLocked ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
              <span className="manrope-header-6 text-gray-700 no-underline hover:no-underline">Artwork</span>
            </div>

            {/* Notes Tab/Indicator */}
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => handleTabNavigationClick(e, 'custom-notes')}
              onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? handleTabNavigationClick(e, 'custom-notes') : null}
              className={cn(
                "flex items-center gap-1 md:gap-2 px-3 py-2 md:px-6 md:py-3 cursor-pointer relative transition-colors border-l border-gray-200 no-underline hover:bg-gray-50/50",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-inset focus-visible:ring-legacy-blue/60",
                {
                   'bg-gray-50': isOpen && activeTab === 'custom-notes' && !isAllLocked,
                   'bg-green-100': isOpen && activeTab === 'custom-notes' && isAllLocked,
                   'hover:bg-green-200': isOpen && activeTab === 'custom-notes' && isAllLocked
                }
              )}
              aria-label={`Navigate to Custom Notes tab. Status: ${sectionLockStatus.notes}`}
            >
              <button
                onClick={(e) => handleLockClick(e, 'notes')}
                className={cn(
                  "z-10 rounded-full p-1 md:p-1.5 flex items-center justify-center focus-visible:outline-none",
                  "transition-colors hover:bg-gray-100", // Neutral hover
                  getLockClass(sectionLockStatus.notes), // Apply color based on status
                  monthData.notesLocked ? 'bg-green-50' : 'bg-gray-50' // Optional: subtle bg based on lock state
                )}
                aria-label={`Custom Notes section is ${sectionLockStatus.notes}. Click to ${monthData.notesLocked ? 'unlock' : 'lock'}.`}
              >
                {monthData.notesLocked ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
              <span className="manrope-header-6 text-gray-700 no-underline hover:no-underline">Custom Notes</span>
            </div>
          </div>
        </div>
      </AccordionTrigger>

      {/* Accordion Content */}
      <AccordionContent className="">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CustomMonthTab)} className="w-full">
          <TabsContent value="story" className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-legacy-blue/50">
            <StoryTab 
              data={monthData} 
              onUpdate={handleUpdate} 
              isLocked={monthData.storyLocked}
            />
          </TabsContent>
          <TabsContent value="artwork" className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-legacy-blue/50">
            <ArtworkTab 
              data={monthData} 
              onUpdate={handleUpdate} 
              isLocked={monthData.artworkLocked}
            />
          </TabsContent>
          <TabsContent value="custom-notes" className="focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-legacy-blue/50">
            <FooterTab 
              data={monthData} 
              onUpdate={handleUpdate} 
              isLocked={monthData.notesLocked}
            />
          </TabsContent>
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CustomMonthCard; 