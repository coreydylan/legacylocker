import React from 'react';
import { CustomMonthData } from '@/lib/sessionStore';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CalendarIcon } from 'lucide-react';
import { JollyDateField } from '@/components/ui/date-field';
import { parseDateToCalendarDate, dateToISOString } from '../../../lib/utils/dateUtils';
import { DateValue } from '@internationalized/date';
import { format } from 'date-fns';

// Define months array (if not imported)
const ALL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface FooterTabProps {
  data: CustomMonthData;
  onUpdate: (update: Partial<CustomMonthData>) => void;
  isLocked?: boolean;
}

const FooterTab: React.FC<FooterTabProps> = ({ data, onUpdate, isLocked }) => {
  const characterLimit = 80;
  const footerLength = data.footerMessage?.length || 0;
  const isEnabled = data.enabled;

  const handleEnabledChange = (checked: boolean) => {
    if (!checked) {
      onUpdate({ enabled: false, footerMessage: '', shipDate: '' });
    } else {
      onUpdate({ enabled: true });
    }
  };

  const handleFooterChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
     const newFooter = event.target.value;
     onUpdate({ footerMessage: newFooter });
  };

  const handleDateChange = (date: DateValue | null) => {
      onUpdate({ shipDate: dateToISOString(date) });
  };

  return (
    <div className={cn(
      "space-y-4 sm:space-y-6",
      isLocked && "opacity-50 cursor-not-allowed pointer-events-none"
    )}>
      <div className="flex items-center space-x-2 sm:space-x-3 rounded-lg border border-gray-200 p-2 sm:p-3 bg-gray-50/50">
            <Switch
                id={`enable-footer-${data.month}-${data.year}`}
                checked={isEnabled}
                onCheckedChange={handleEnabledChange}
                aria-label="Enable custom note and date"
                disabled={isLocked}
            />
            <Label htmlFor={`enable-footer-${data.month}-${data.year}`} className="font-medium text-neutral-700 cursor-pointer text-[10px] sm:text-sm md:text-base">
                Add custom note & arrive-by date for {data.month}?
            </Label>
        </div>

       <div className={cn(
           "space-y-3 sm:space-y-4 transition-opacity duration-200",
           isEnabled ? "opacity-100" : "opacity-50 pointer-events-none"
       )}>
           <div className="space-y-1 sm:space-y-2">
             <div className="flex justify-between items-center">
                  <Label htmlFor={`footer-${data.month}-${data.year}`} className="text-[10px] sm:text-sm font-medium">
                    Optional custom note
                  </Label>
                  <span className={cn(
                      "text-[10px] sm:text-xs font-medium",
                      footerLength > characterLimit ? "text-red-600" : "text-gray-500"
                  )}>
                     {footerLength}/{characterLimit}
                  </span>
             </div>
             <Textarea
               id={`footer-${data.month}-${data.year}`}
               value={data.footerMessage}
               onChange={handleFooterChange}
               placeholder={isEnabled ? "Enter your footer message..." : "Enable above to add note"}
               className="min-h-[50px] sm:min-h-[60px] rounded-lg border-gray-200 px-3 py-2 sm:px-4 sm:py-3 focus:ring-1 focus:ring-neutral-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-[10px] sm:text-sm md:text-base"
               maxLength={characterLimit}
               disabled={isLocked || !isEnabled}
             />
           </div>
           <div className="space-y-1 sm:space-y-2">
              <Label htmlFor={`ship-date-${data.month}-${data.year}`} className="text-[10px] sm:text-sm font-medium">Arrive By Date</Label>
              <JollyDateField
                aria-label="Arrive by date"
                value={parseDateToCalendarDate(data.shipDate)}
                onChange={handleDateChange}
                granularity="day"
                isDisabled={isLocked || !isEnabled}
              />
              <p className="text-[10px] sm:text-xs text-gray-500 px-1">
                {isEnabled ? "Select the date you'd like this card to arrive." : "Enable above to set date."}
              </p>
            </div>
       </div>
    </div>
  );
};

export default FooterTab; 