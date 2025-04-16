import React from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import truncate from 'lodash/truncate';
import { useDebouncedCallback } from 'use-debounce';
import { saveSessionToSupabase } from '@/lib/sessionService';

const WelcomeMessageEditor: React.FC = () => {
  const { welcomeMessage, updateSession } = useSessionStore(state => ({
      // Safely access nested property
      welcomeMessage: state.session.recipient?.welcomeMessage || '',
      updateSession: state.updateSession,
  }));

  // --- Debounced Save Logic --- 
  const debouncedSave = useDebouncedCallback(() => {
    console.log('[Autosave] WelcomeMessageEditor: Triggering Supabase save...');
    saveSessionToSupabase();
  }, 1000); // 1 second debounce
  // --- End Debounced Save Logic ---

  const characterLimit = 1700; // Updated character limit
  const messageLength = welcomeMessage?.length || 0;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
     let newValue = event.target.value;
     // Apply limit locally before updating store 
     if (newValue.length > characterLimit) {
         newValue = truncate(newValue, { length: characterLimit, omission: '' });
     }
     updateSession('recipient.welcomeMessage', newValue);
     debouncedSave(); 
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-end items-center pr-1">
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
        placeholder="Craft a short welcome message for your recipient. This optional card will be included with their very first monthly delivery."
        className="min-h-[120px]"
        maxLength={characterLimit}
      />
    </div>
  );
};

export default WelcomeMessageEditor; 