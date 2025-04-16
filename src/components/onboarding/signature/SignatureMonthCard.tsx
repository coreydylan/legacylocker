import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { SignatureMonthCustomization, useSessionStore } from '@/lib/sessionStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import { format, parseISO, isValid } from 'date-fns';
import { CalendarIcon, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from 'use-debounce';

interface SignatureMonthCardProps {
  monthData: SignatureMonthCustomization;
  year: number;
  onUpdate: (month: string, data: Partial<SignatureMonthCustomization>) => void;
  purchaserFirstName: string;
}

const SignatureMonthCard: React.FC<SignatureMonthCardProps> = ({
  monthData,
  year,
  onUpdate,
  purchaserFirstName,
}) => {
  const { saveSessionData } = useSessionManager();
  const { month, enabled, occasions = [], recipients = [], shipDate, footerMessage } = monthData;
  const characterLimit = 80;

  const ALL_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const debouncedSave = useDebouncedCallback(async () => {
    if (!useSessionStore.getState().sessionMetadata.isActive) {
        console.log(`[Autosave] SignatureMonthCard (${month}): Skipped – session not active`);
        return;
    }
    console.log(`[Autosave] SignatureMonthCard (${month}): Triggering save via hook...`);
    try {
        await saveSessionData();
        console.log(`[Autosave] SignatureMonthCard (${month}): Success via hook`);
    } catch (err) {
        console.error(`[Autosave] SignatureMonthCard (${month}): Failed via hook:`, err);
    }
  }, 1000);

  const handleToggle = (checked: boolean) => {
    const updateData: Partial<SignatureMonthCustomization> = { enabled: checked };
    if (checked && !footerMessage && occasions.length === 0) {
      let defaultFooter = `Thinking of you! Love, ${purchaserFirstName}`;
      if (defaultFooter.length > characterLimit) {
           defaultFooter = defaultFooter.substring(0, characterLimit);
      }
      updateData.footerMessage = defaultFooter;
      updateData.occasions = ['other'];
    }
    if (checked && !shipDate) {
        const monthIndex = ALL_MONTHS.indexOf(month);
        const defaultDate = new Date(year, monthIndex >= 0 ? monthIndex : 0, 1);
        updateData.shipDate = format(defaultDate, 'yyyy-MM-dd');
    }
    onUpdate(month, updateData);
    debouncedSave();
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      onUpdate(month, { shipDate: format(date, 'yyyy-MM-dd') });
      debouncedSave();
    }
  };

  const handleFooterChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
     const newFooter = event.target.value;
     if (newFooter.length <= characterLimit) {
        onUpdate(month, { footerMessage: newFooter });
        debouncedSave();
     } else {
         console.warn("Footer message character limit reached.");
     }
  };

  const getOccasionLabel = () => {
    const hasBirthday = occasions.includes('birthday');
    const hasAnniversary = occasions.includes('anniversary');
    const holidayName = occasions.find(occ => occ !== 'birthday' && occ !== 'anniversary' && occ !== 'other');
    const birthdayRecipient = recipients[occasions.indexOf('birthday')];
    const anniversaryRecipient = recipients[occasions.indexOf('anniversary')];
    if (hasBirthday && hasAnniversary && birthdayRecipient) {
      return `Celebrate ${anniversaryRecipient || 'their'} anniversary and ${birthdayRecipient}'s birthday?`;
    }
    if (hasBirthday && birthdayRecipient) {
      return `Celebrate ${birthdayRecipient}'s Birthday?`;
    }
    if (hasAnniversary) {
      return `Celebrate ${anniversaryRecipient || 'Your'} Anniversary?`;
    }
    if (holidayName) {
        return `Celebrate ${holidayName}?`;
    }
    if (occasions.includes('other') || enabled) {
      return 'Customize this month?';
    } 
    return 'Customize this month?';
  };

  const getTooltipContent = () => {
      if (occasions.length === 0) return null;
       const contentParts = occasions.map((occ, index) => {
           const recip = recipients[index] || 'recipient';
           if (occ === 'birthday') return `${recip}'s Birthday`;
           else if (occ === 'anniversary') return `${recip}'s Anniversary`;
           else if (occ !== 'other') return occ;
           return null;
       }).filter(part => part !== null);
      if (contentParts.length === 0) return null;
      return <p>This month is pre-enabled for {contentParts.join(' and ')}.</p>;
  };

  const parsedDate = shipDate ? parseISO(shipDate) : undefined;
  const displayDate = parsedDate && isValid(parsedDate) ? format(parsedDate, 'PPP') : 'Pick a date';
  const footerLength = footerMessage?.length || 0;

  return (
    <div className="border rounded-lg p-4 space-y-3 transition-all duration-300 ease-in-out bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <Label htmlFor={`toggle-${month}-${year}`} className="text-lg font-medium text-legacy-gray-darker">
          {month} {year}
        </Label>
        <Switch
          id={`toggle-${month}-${year}`}
          checked={enabled}
          onCheckedChange={handleToggle}
          aria-label={`Customize ${month} ${year}`}
        />
      </div>

      {enabled && (
        <div className="pt-3 space-y-4 animate-fade-in">
          <div className="flex items-center space-x-2">
             {(occasions.includes('birthday') || occasions.includes('anniversary')) && 
               <span className="text-xl">🎉</span>} 
             <Label className="text-base font-normal text-legacy-gray-dark">
                 {getOccasionLabel()}
             </Label>
             {occasions.length > 0 && !occasions.includes('other') && (
                 <TooltipProvider>
                     <Tooltip>
                         <TooltipTrigger asChild>
                             <Info className="h-4 w-4 text-gray-400 cursor-help" />
                         </TooltipTrigger>
                         <TooltipContent>
                             {getTooltipContent()}
                         </TooltipContent>
                     </Tooltip>
                 </TooltipProvider>
             )}
          </div>

          <div className="space-y-1">
            <Label htmlFor={`date-${month}-${year}`} className="text-sm font-medium text-legacy-gray-darker">Arrive By Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!shipDate ? "text-muted-foreground" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {displayDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={parsedDate && isValid(parsedDate) ? parsedDate : undefined}
                  onSelect={handleDateChange}
                  initialFocus
                  defaultMonth={parsedDate && isValid(parsedDate) ? parsedDate : new Date(year, ALL_MONTHS.indexOf(month))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
                 <Label htmlFor={`footer-${month}-${year}`} className="text-sm font-medium text-legacy-gray-darker">Footer Message</Label>
                 <span className={cn(
                     "text-xs font-medium",
                     footerLength > characterLimit ? "text-red-600" : "text-legacy-gray-medium"
                 )}>
                    {footerLength}/{characterLimit}
                 </span>
            </div>
            <Textarea
              id={`footer-${month}-${year}`}
              value={footerMessage}
              onChange={handleFooterChange}
              placeholder="e.g., Happy Birthday! Love, The Smiths"
              className="min-h-[60px]"
              maxLength={characterLimit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignatureMonthCard; 