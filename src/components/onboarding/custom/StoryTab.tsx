import React from 'react';
import { CustomMonthData } from '@/lib/sessionStore';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Pencil, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

interface StoryTabProps {
  data: CustomMonthData;
  onUpdate: (update: Partial<CustomMonthData>) => void;
}

const StoryTab: React.FC<StoryTabProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6 p-1">
      {/* Title Section */}
      <div className="space-y-2">
        <Label htmlFor={`title-${data.month}-${data.year}`}>Card Title</Label>
        <Input 
          id={`title-${data.month}-${data.year}`}
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder='e.g., "The First Snowfall" or "You Always Knew"'
          className="rounded-lg border-gray-200 px-4 py-3 focus:ring-1 focus:ring-neutral-300"
        />
        <div className="flex space-x-1 rounded-lg bg-muted p-0.5 mt-2">
             <Button
                 variant={data.useExactTitle ? "outline" : "secondary"}
                 className={cn(
                     "flex-1 justify-center h-9 px-3 shadow-sm text-xs md:text-sm rounded-md",
                     data.useExactTitle ? "bg-white border-gray-300 text-gray-700" : "bg-gray-200 text-gray-600 border-transparent"
                 )}
                 onClick={() => onUpdate({ useExactTitle: true })}
             >
                 <Pencil size={16} className="mr-1 md:mr-2"/>
                 Use my exact title
             </Button>
             <Button
                 variant={!data.useExactTitle ? "outline" : "secondary"}
                 className={cn(
                    "flex-1 justify-center h-9 px-3 shadow-sm text-xs md:text-sm rounded-md",
                    !data.useExactTitle ? "bg-white border-gray-300 text-gray-700" : "bg-gray-200 text-gray-600 border-transparent"
                 )}
                 onClick={() => onUpdate({ useExactTitle: false })}
             >
                 <Sparkles size={16} className="mr-1 md:mr-2"/>
                 Let Legacy Locker polish it
             </Button>
        </div>
        <p className="text-xs text-gray-500 px-1">Short and sweet titles work best — or just jot the idea and we'll finesse it.</p> 
      </div>

      {/* Story Section */}
      <div className="space-y-2">
        <Label htmlFor={`story-${data.month}-${data.year}`}>Your Story</Label>
        <Textarea
           id={`story-${data.month}-${data.year}`}
           value={data.story}
           onChange={(e) => onUpdate({ story: e.target.value })}
           placeholder="Tell us the moment — we'll help turn it into magic."
           className="min-h-[120px] rounded-lg border-gray-200 px-4 py-3 focus:ring-1 focus:ring-neutral-300"
        />
         <div className="flex space-x-1 rounded-lg bg-muted p-0.5 mt-2">
             <Button
                 variant={data.useExactStory ? "outline" : "secondary"}
                 className={cn(
                     "flex-1 justify-center h-9 px-3 shadow-sm text-xs md:text-sm rounded-md",
                     data.useExactStory ? "bg-white border-gray-300 text-gray-700" : "bg-gray-200 text-gray-600 border-transparent"
                 )}
                 onClick={() => onUpdate({ useExactStory: true })}
             >
                 <Pencil size={16} className="mr-1 md:mr-2"/>
                 Use my exact text
             </Button>
             <Button
                 variant={!data.useExactStory ? "outline" : "secondary"}
                 className={cn(
                    "flex-1 justify-center h-9 px-3 shadow-sm text-xs md:text-sm rounded-md",
                    !data.useExactStory ? "bg-white border-gray-300 text-gray-700" : "bg-gray-200 text-gray-600 border-transparent"
                 )}
                 onClick={() => onUpdate({ useExactStory: false })}
             >
                 <Sparkles size={16} className="mr-1 md:mr-2"/>
                 Let Legacy Locker craft it
             </Button>
        </div>
         <p className="text-xs text-gray-500 px-1">We'll keep your voice. Just give us the ideas — we'll do the writing.</p> 
      </div>
    </div>
  );
};

export default StoryTab; 