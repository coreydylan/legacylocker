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
}

const FooterTab: React.FC<FooterTabProps> = ({ data, onUpdate }) => {
  const characterLimit = 80;
  const footerLength = data.footerMessage?.length || 0;

  const handleToggle = (checked: boolean) => {
      const update: Partial<CustomMonthData> = { footerEnabled: checked };
      // If enabling footer and no ship date exists, default to 1st of the month
      if (checked && !data.shipDate) {
          try {
            const monthIndex = ALL_MONTHS.indexOf(data.month);
            if (monthIndex !== -1) {
              const defaultDate = new Date(data.year, monthIndex, 1);
              update.shipDate = format(defaultDate, 'yyyy-MM-dd');
            }
          } catch (e) {
              console.error("Error creating default ship date:", e);
          }
      }
      // Optionally clear shipDate when disabling?
      // if (!checked) { update.shipDate = null; }
      onUpdate(update);
  };

  const handleFooterChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
     const newFooter = event.target.value;
     onUpdate({ footerMessage: newFooter });
  };

  const handleDateChange = (date: DateValue | null) => {
      onUpdate({ shipDate: dateToISOString(date) });
  };

  return (
    <div className="space-y-4 p-1">
       {/* Toggle Section */}
       <div className="flex items-center space-x-3">
         <Switch 
           id={`footer-toggle-${data.month}-${data.year}`}
           checked={data.footerEnabled}
           onCheckedChange={handleToggle}
         />
         <Label htmlFor={`footer-toggle-${data.month}-${data.year}`} className="text-base font-medium">
           Add a footer message?
         </Label>
       </div>
       <p className="text-xs text-gray-500 pl-10">
          Optionally add a footer at the bottom of your card designed to celebrate a special moment that month.
       </p>

      {/* Footer Input Section (Conditional) */}
      {data.footerEnabled && (
        <div className="space-y-4 pt-2 animate-fade-in pl-10">
           {/* Footer Text Area */}
           <div className="space-y-2">
             <div className="flex justify-between items-center">
                  <Label htmlFor={`footer-${data.month}-${data.year}`} className="text-sm font-medium">Footer Text</Label>
                  <span className={cn(
                      "text-xs font-medium",
                      footerLength > characterLimit ? "text-red-600" : "text-gray-500"
                  )}>
                     {footerLength}/{characterLimit}
                  </span>
             </div>
             <Textarea
               id={`footer-${data.month}-${data.year}`}
               value={data.footerMessage}
               onChange={handleFooterChange}
               placeholder="Enter your footer message..."
               className="min-h-[60px] rounded-lg border-gray-200 px-4 py-3 focus:ring-1 focus:ring-neutral-300"
               maxLength={characterLimit}
             />
           </div>
           {/* Ship Date Field */}
           <div className="space-y-2">
              <Label htmlFor={`ship-date-${data.month}-${data.year}`} className="text-sm font-medium">Arrive By Date</Label>
              <JollyDateField 
                aria-label="Arrive by date"
                value={parseDateToCalendarDate(data.shipDate)}
                onChange={handleDateChange}
                granularity="day"
              />
              <p className="text-xs text-gray-500 px-1">Select the date you'd like this card to arrive.</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default FooterTab; 