import React from 'react';
import { CustomMonthData } from '@/lib/sessionStore';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface FooterTabProps {
  data: CustomMonthData;
  onUpdate: (update: Partial<CustomMonthData>) => void;
}

const FooterTab: React.FC<FooterTabProps> = ({ data, onUpdate }) => {
  const characterLimit = 80;
  const footerLength = data.footerMessage?.length || 0;

  const handleToggle = (checked: boolean) => {
      onUpdate({ footerEnabled: checked });
      // Optionally clear message when disabling
      // if (!checked) {
      //     onUpdate({ footerMessage: '' });
      // }
  };

  const handleFooterChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
     const newFooter = event.target.value;
     // Update state via callback (which handles truncation in store action)
     onUpdate({ footerMessage: newFooter });
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

      {/* Footer Input Section (Conditional) */}
      {data.footerEnabled && (
        <div className="space-y-2 pt-2 animate-fade-in">
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
             className="min-h-[60px]"
             maxLength={characterLimit} // Browser enforcement
           />
         </div>
      )}
    </div>
  );
};

export default FooterTab; 