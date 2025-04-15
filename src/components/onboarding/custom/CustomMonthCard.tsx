import React from 'react';
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
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleEllipsis, XCircle, Edit3, ImageIcon, MessageSquareText, ChevronDown } from 'lucide-react'; // Icons
import { CustomMonthData } from '@/lib/sessionStore';
import StoryTab from './StoryTab';
import ArtworkTab from './ArtworkTab';
import FooterTab from './FooterTab';
import { cn } from '@/lib/utils';
import { useDebouncedCallback } from 'use-debounce';
import { saveSessionToSupabase } from '@/lib/sessionService';

// Define completion status types
type CompletionStatus = 'complete' | 'in-progress' | 'not-started';
type SectionStatus = { story: boolean; artwork: boolean; footer: boolean };

interface CustomMonthCardProps {
  monthData: CustomMonthData;
  onUpdate: (month: string, year: number, update: Partial<CustomMonthData>) => void;
  accordionValue: string; // e.g., "January-2024"
  initialTab?: 'story' | 'artwork' | 'footer'; // Optional: To open to a specific tab
  onSectionClick: (tab: 'story' | 'artwork' | 'footer') => void; // Callback when section tracker icon clicked
}

// Helper function to determine completion status
const getCompletionStatus = (data: CustomMonthData): { overall: CompletionStatus; sections: SectionStatus } => {
  const sections: SectionStatus = {
    story: !!(data.title && data.story),
    artwork: data.artworkOption !== null,
    footer: !data.footerEnabled || !!data.footerMessage,
  };

  const isComplete = sections.story && sections.artwork && sections.footer;
  const isInProgress = !isComplete && (sections.story || sections.artwork || sections.footer);

  let overall: CompletionStatus;
  if (isComplete) {
    overall = 'complete';
  } else if (isInProgress) {
    overall = 'in-progress';
  } else {
    overall = 'not-started';
  }

  return { overall, sections };
};

const CustomMonthCard: React.FC<CustomMonthCardProps> = ({
  monthData,
  onUpdate,
  accordionValue,
  initialTab = 'story', // Default to story tab
  onSectionClick,
}) => {
  const { month, year } = monthData;
  const { overall: overallStatus, sections: sectionStatus } = getCompletionStatus(monthData);

  // --- Debounced Save Logic --- 
  const debouncedSave = useDebouncedCallback(() => {
    console.log(`[Autosave] CustomMonthCard (${month}-${year}): Triggering Supabase save...`);
    saveSessionToSupabase();
  }, 1000); // 1 second debounce
  // --- End Debounced Save Logic ---

  // This function is called by the child tabs
  const handleUpdate = (update: Partial<CustomMonthData>) => {
    // Update the Zustand store first
    onUpdate(month, year, update);
    // Then trigger the debounced save
    debouncedSave(); 
  };

  const statusMap: Record<CompletionStatus, { text: string; icon: React.ElementType; className: string }> = {
    'complete': { text: 'Complete', icon: CheckCircle2, className: 'border-green-200 bg-green-100 text-green-700' },
    'in-progress': { text: 'In Progress', icon: CircleEllipsis, className: 'border-amber-200 bg-amber-100 text-amber-700' },
    'not-started': { text: 'Not Started', icon: XCircle, className: 'border-gray-200 bg-gray-100 text-gray-600' },
  };

  const statusInfo = statusMap[overallStatus];

  return (
    <AccordionItem value={accordionValue} className="group border bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Accordion Header / Trigger */}
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 data-[state=open]:bg-gray-50/80">
        <div className="flex justify-between items-center w-full">
          {/* Left Side: Month/Year and Section Tracker */}
          <div className="flex flex-col items-start text-left space-y-1.5">
            <span className="text-lg font-semibold text-neutral-800">
                {month} {year}
            </span>
            {/* Inline Section Tracker */}
            <div className="flex items-center space-x-3 text-xs text-gray-500">
                <button 
                    onClick={(e) => { e.stopPropagation(); onSectionClick('story'); }} 
                    className={cn("flex items-center space-x-1 hover:text-legacy-blue", sectionStatus.story ? 'text-green-600 font-medium' : 'text-gray-400')}
                    aria-label="Go to Story section"
                 >
                    <Edit3 size={14} /> <span>Story</span>
                 </button>
                 <button 
                    onClick={(e) => { e.stopPropagation(); onSectionClick('artwork'); }}
                    className={cn("flex items-center space-x-1 hover:text-legacy-blue", sectionStatus.artwork ? 'text-green-600 font-medium' : 'text-gray-400')}
                    aria-label="Go to Artwork section"
                 >
                     <ImageIcon size={14} /> <span>Artwork</span>
                 </button>
                 <button 
                    onClick={(e) => { e.stopPropagation(); onSectionClick('footer'); }}
                    className={cn("flex items-center space-x-1 hover:text-legacy-blue", sectionStatus.footer ? 'text-green-600 font-medium' : 'text-gray-400')}
                    aria-label="Go to Footer section"
                 >
                     <MessageSquareText size={14} /> <span>Footer</span>
                 </button>
            </div>
          </div>
          
          {/* Right Side: Status Badge & Chevron */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={cn("ml-auto text-xs font-medium rounded-full px-2.5 py-0.5 border", statusInfo.className)}>
               <statusInfo.icon size={12} className="mr-1" />
               <span>{statusInfo.text}</span>
             </Badge>
             <ChevronDown className="h-5 w-5 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
           </div>
        </div>
      </AccordionTrigger>

      {/* Accordion Content: Tabs */}
      <AccordionContent className="p-4 border-t bg-white divide-y divide-gray-100">
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gray-100/80 rounded-lg backdrop-blur-sm shadow-sm">
            <TabsTrigger 
              value="story" 
              className="text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors data-[state=active]:bg-white data-[state=active]:text-neutral-800 data-[state=active]:shadow rounded-md py-1.5"
            >
                Story
             </TabsTrigger>
            <TabsTrigger 
              value="artwork" 
              className="text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors data-[state=active]:bg-white data-[state=active]:text-neutral-800 data-[state=active]:shadow rounded-md py-1.5"
            >
                Artwork
             </TabsTrigger>
            <TabsTrigger 
              value="footer" 
              className="text-sm font-medium text-neutral-500 hover:text-neutral-700 transition-colors data-[state=active]:bg-white data-[state=active]:text-neutral-800 data-[state=active]:shadow rounded-md py-1.5"
             >
                Footer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="story" className="pt-6 hover:bg-gray-50/50 rounded-b-lg -mx-4 px-4 pb-4">
            <StoryTab data={monthData} onUpdate={handleUpdate} />
          </TabsContent>
          <TabsContent value="artwork" className="pt-6 hover:bg-gray-50/50 rounded-b-lg -mx-4 px-4 pb-4">
            <ArtworkTab data={monthData} onUpdate={handleUpdate} />
          </TabsContent>
          <TabsContent value="footer" className="pt-6 hover:bg-gray-50/50 rounded-b-lg -mx-4 px-4 pb-4">
            <FooterTab data={monthData} onUpdate={handleUpdate} />
          </TabsContent>
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CustomMonthCard; 