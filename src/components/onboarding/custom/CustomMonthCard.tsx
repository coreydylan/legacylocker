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
import { CheckCircle2, CircleEllipsis, XCircle, Edit3, ImageIcon, MessageSquareText } from 'lucide-react'; // Icons
import { CustomMonthData } from '@/lib/sessionStore';
import StoryTab from './StoryTab';
import ArtworkTab from './ArtworkTab';
import FooterTab from './FooterTab';
import { cn } from '@/lib/utils';

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

  const handleUpdate = (update: Partial<CustomMonthData>) => {
    onUpdate(month, year, update);
  };

  const statusMap: Record<CompletionStatus, { text: string; icon: React.ElementType; className: string }> = {
    'complete': { text: 'Complete', icon: CheckCircle2, className: 'bg-green-100 text-green-800 border-green-300' },
    'in-progress': { text: 'In Progress', icon: CircleEllipsis, className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    'not-started': { text: 'Not Started', icon: XCircle, className: 'bg-red-100 text-red-800 border-red-300' },
  };

  const statusInfo = statusMap[overallStatus];

  return (
    <AccordionItem value={accordionValue} className="border bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Accordion Header / Trigger */}
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 [&[data-state=open]]:bg-gray-50">
        <div className="flex justify-between items-center w-full">
          {/* Left Side: Month/Year and Section Tracker */}
          <div className="flex flex-col items-start text-left space-y-1.5">
            <span className="text-lg font-medium text-legacy-gray-darker">
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
          
          {/* Right Side: Status Badge */}
          <Badge variant="outline" className={cn("ml-4 flex items-center space-x-1.5", statusInfo.className)}>
             <statusInfo.icon size={14} />
             <span>{statusInfo.text}</span>
           </Badge>
        </div>
      </AccordionTrigger>

      {/* Accordion Content: Tabs */}
      <AccordionContent className="p-4 border-t bg-gray-50/50">
        <Tabs defaultValue={initialTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="story">Story</TabsTrigger>
            <TabsTrigger value="artwork">Artwork</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>
          <TabsContent value="story" className="pt-6">
            <StoryTab data={monthData} onUpdate={handleUpdate} />
          </TabsContent>
          <TabsContent value="artwork" className="pt-6">
            <ArtworkTab data={monthData} onUpdate={handleUpdate} />
          </TabsContent>
          <TabsContent value="footer" className="pt-6">
            <FooterTab data={monthData} onUpdate={handleUpdate} />
          </TabsContent>
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  );
};

export default CustomMonthCard; 