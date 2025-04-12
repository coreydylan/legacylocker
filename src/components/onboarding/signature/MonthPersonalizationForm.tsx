import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TextStyleToggle from './TextStyleToggle';
import { MonthlyCardData } from '@/lib/sessionManager';

interface MonthPersonalizationFormProps {
  selectedMonth: string;
  currentMonthData: MonthlyCardData;
  handleMonthDataChange: (field: string, value: any) => void;
  openCalendars: Record<string, boolean>;
  handleCalendarToggle: (month: string, isOpen: boolean) => void;
  celebrationTypes: string[];
  handlePhotoUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const parseDate = (dateString?: string): Date | undefined => {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  } catch (error) {
    console.error("Error parsing date string:", dateString, error);
    return undefined;
  }
};

const MonthPersonalizationForm: React.FC<MonthPersonalizationFormProps> = ({
  selectedMonth,
  currentMonthData,
  handleMonthDataChange,
  openCalendars,
  handleCalendarToggle,
  celebrationTypes,
  handlePhotoUpload
}) => {
  const useExactText = currentMonthData.useExactText === undefined ? false : currentMonthData.useExactText;
  const useExactTitle = currentMonthData.useExactTitle === undefined ? false : currentMonthData.useExactTitle;
  const artworkOption = currentMonthData.artworkOption || 'from-story';
  
  const customDateString: string | undefined = currentMonthData.customDate;
  const selectedDateForCalendar: Date | undefined = parseDate(customDateString);

  return (
    <div className="p-4 space-y-5">
      {/* Section 1: Card Title */}
      <div className="space-y-3">
        <div className="pb-1 border-b border-legacy-cream/50 flex items-center justify-between">
          <h3 className="font-medium text-sm text-legacy-green uppercase tracking-wide">Card Title</h3>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="cardTitle" className="text-base font-medium">Title</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="w-72 p-3">
                  <p>A short headline that captures the essence of this memory.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input 
            id="cardTitle"
            className="h-10 text-base"
            placeholder='e.g., "The First Snowfall" or "You Always Knew"'
            value={currentMonthData.title || currentMonthData.celebration || ''}
            onChange={(e) => handleMonthDataChange('title', e.target.value)}
          />
          <TextStyleToggle 
            value={useExactTitle} 
            onChange={(checked) => handleMonthDataChange('useExactTitle', checked)}
            type="title"
          />
          <p className="text-xs text-muted-foreground italic">
            Short and sweet titles work best — or just jot the idea and we'll finesse it.
          </p>
        </div>
      </div>
      
      {/* Section 2: Your Memory */}
      <div className="space-y-3">
        <div className="pb-1 border-b border-legacy-cream/50 flex items-center justify-between">
          <h3 className="font-medium text-sm text-legacy-green uppercase tracking-wide">Your Memory</h3>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Label htmlFor="personalMessage" className="text-base font-medium">Tell us the moment</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="w-80 p-3">
                  <p>Share a short story, milestone, or reflection that captures this moment in your journey.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea 
            id="personalMessage"
            className="min-h-[100px] max-h-[200px] text-base p-3"
            placeholder="Tell us the moment — we'll help turn it into magic."
            value={currentMonthData.personalMessage || ''}
            onChange={(e) => handleMonthDataChange('personalMessage', e.target.value)}
          />
          
          <TextStyleToggle 
            value={useExactText} 
            onChange={(checked) => handleMonthDataChange('useExactText', checked)}
            type="memory"
          />
          
          <p className="text-xs text-muted-foreground italic">
            We'll keep your voice. Just give us the ideas — we'll do the writing.
          </p>
          
          {!useExactText && currentMonthData.personalMessage && (
            <div className="bg-legacy-gold/5 border border-legacy-gold/20 p-3 rounded-md mt-1">
              <p className="text-sm text-legacy-dark flex items-start gap-2">
                <span>
                  Our team will craft a compelling story based on your input.
                  You'll receive an email within 48 hours with our draft for your approval.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Section 3: Card Visual Style */}
      <div className="space-y-3">
        <div className="pb-1 border-b border-legacy-cream/50">
          <h3 className="font-medium text-sm text-legacy-green uppercase tracking-wide">Choose Your Artwork Style</h3>
        </div>

        <RadioGroup 
          value={artworkOption} 
          onValueChange={(value) => handleMonthDataChange('artworkOption', value)}
          className="space-y-2.5"
        >
          <div className={`border rounded-lg p-3 cursor-pointer transition-all ${artworkOption === 'use-photo' ? 'border-legacy-green bg-legacy-green/5' : 'border-gray-200'}`}>
            <div className="flex gap-3">
              <RadioGroupItem value="use-photo" id="use-photo" className="mt-0.5" />
              <div>
                <Label htmlFor="use-photo" className="font-medium text-base cursor-pointer">Use My Photo</Label>
                <p className="text-sm text-legacy-dark/70">We'll print it directly on your card.</p>
              </div>
            </div>
            
            {artworkOption === 'use-photo' && handlePhotoUpload && (
              <div className="mt-3 ml-7">
                <label htmlFor={`photo-upload-use-${selectedMonth}`} className="cursor-pointer">
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                    <div className="space-y-1 text-center">
                      <Button variant="ghost" className="h-auto p-1">
                        {currentMonthData.photoUrl ? (
                          <span className="text-legacy-green">Change photo ({currentMonthData.photoUrl})</span>
                        ) : (
                          <span className="text-legacy-green">Upload a photo</span>
                        )}
                      </Button>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, or GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </label>
                <input 
                  id={`photo-upload-use-${selectedMonth}`} 
                  type="file" 
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>
            )}
          </div>
          
          <div className={`border rounded-lg p-3 cursor-pointer transition-all ${artworkOption === 'from-photo' ? 'border-legacy-green bg-legacy-green/5' : 'border-gray-200'}`}>
            <div className="flex gap-3">
              <RadioGroupItem value="from-photo" id="from-photo" className="mt-0.5" />
              <div>
                <Label htmlFor="from-photo" className="font-medium text-base cursor-pointer">Turn My Photo Into Art</Label>
                <p className="text-sm text-legacy-dark/70">We'll transform your image into a custom illustration.</p>
              </div>
            </div>
            
            {artworkOption === 'from-photo' && handlePhotoUpload && (
              <div className="mt-3 ml-7">
                <label htmlFor={`photo-upload-transform-${selectedMonth}`} className="cursor-pointer">
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                    <div className="space-y-1 text-center">
                      <Button variant="ghost" className="h-auto p-1">
                        {currentMonthData.photoUrl ? (
                          <span className="text-legacy-green">Change photo ({currentMonthData.photoUrl})</span>
                        ) : (
                          <span className="text-legacy-green">Upload a photo</span>
                        )}
                      </Button>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, or GIF up to 5MB
                      </p>
                    </div>
                  </div>
                </label>
                <input 
                  id={`photo-upload-transform-${selectedMonth}`} 
                  type="file" 
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </div>
            )}
          </div>
          
          <div className={`border rounded-lg p-3 cursor-pointer transition-all ${artworkOption === 'from-story' ? 'border-legacy-green bg-legacy-green/5' : 'border-gray-200'}`}>
            <div className="flex gap-3">
              <RadioGroupItem value="from-story" id="from-story" className="mt-0.5" />
              <div>
                <Label htmlFor="from-story" className="font-medium text-base cursor-pointer">Create Art From My Story</Label>
                <p className="text-sm text-legacy-dark/70">No photo needed — we'll read your memory and bring it to life.</p>
              </div>
            </div>
          </div>
        </RadioGroup>
      </div>
      
      {/* Optional Special Delivery Date */}
      <div className="space-y-2.5 pt-1">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Custom Delivery Date</Label>
          <Badge variant="outline" className="text-muted-foreground bg-transparent">Optional</Badge>
        </div>
        
        <Popover 
          open={openCalendars[selectedMonth]} 
          onOpenChange={(open) => handleCalendarToggle(selectedMonth, open)}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-9 justify-start text-left font-normal text-base"
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {selectedDateForCalendar ? 
                format(selectedDateForCalendar, "PPP") : 
                <span className="text-muted-foreground">Select delivery date</span>
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto z-50" align="start">
            <div className="p-3">
              <Label className="mb-2 block">Choose when this card should arrive</Label>
              
              <div className="border rounded-md overflow-hidden space-y-3 p-3">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => {
                      const today = new Date();
                      handleMonthDataChange('customDate', today);
                      handleCalendarToggle(selectedMonth, false);
                    }}
                  >
                    Use today's date
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => {
                      const nextMonth = new Date();
                      nextMonth.setMonth(nextMonth.getMonth() + 1);
                      handleMonthDataChange('customDate', nextMonth);
                      handleCalendarToggle(selectedMonth, false);
                    }}
                  >
                    Use next month
                  </Button>
                </div>
                
                <div className="pt-3 border-t">
                  <Calendar
                    mode="single"
                    selected={selectedDateForCalendar}
                    onSelect={(date: Date | undefined) => {
                      const dateStringToStore: string | undefined = date ? date.toISOString() : undefined;
                      handleMonthDataChange('customDate', dateStringToStore);
                      handleCalendarToggle(selectedMonth, false);
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default MonthPersonalizationForm;
