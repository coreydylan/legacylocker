import React from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import truncate from 'lodash/truncate';

const WelcomeMessageEditor: React.FC = () => {
  const { welcomeMessage, updateSession } = useSessionStore(state => ({
      // Safely access nested property
      welcomeMessage: state.session.recipient?.welcomeMessage || '',
      updateSession: state.updateSession,
  }));

  const characterLimit = 150; // Allow a bit more for a welcome message
  const messageLength = welcomeMessage?.length || 0;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
     let newValue = event.target.value;
     // Apply limit locally before updating store 
     // Although updateSession also truncates footers, specific logic here is clearer
     if (newValue.length > characterLimit) {
         newValue = truncate(newValue, { length: characterLimit, omission: '' });
     }
     updateSession('recipient.welcomeMessage', newValue);
  };

  return (
    <div className="p-4 md:p-6 border bg-white rounded-lg shadow-sm space-y-3 max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold text-legacy-green">Welcome Card Message</h3>
      <p className="text-sm text-gray-600">
        Craft a short welcome message for your recipient. This optional card will be included with their very first monthly delivery.
      </p>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
             <Label htmlFor="welcome-message" className="text-sm font-medium">Your Message</Label>
             <span className={cn(
                 "text-xs font-medium",
                 messageLength > characterLimit ? "text-red-600" : "text-gray-500"
             )}>
                {messageLength}/{characterLimit}
             </span>
        </div>
        <Textarea
          id="welcome-message"
          value={welcomeMessage}
          onChange={handleChange}
          placeholder="e.g., Looking forward to sharing this journey with you!"
          className="min-h-[80px]"
          maxLength={characterLimit} // Browser enforcement
        />
      </div>
    </div>
  );
};

export default WelcomeMessageEditor; 