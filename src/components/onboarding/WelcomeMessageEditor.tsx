import React from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import truncate from 'lodash/truncate';
import { useDebouncedCallback } from 'use-debounce';

const WelcomeMessageEditor: React.FC = () => {
  const { saveSessionData } = useSessionManager();
  const { welcomeMessage, updateSession } = useSessionStore(state => ({
      welcomeMessage: state.session.recipient?.welcomeMessage || '',
      updateSession: state.updateSession,
  }));

  const debouncedSave = useDebouncedCallback(async () => {
    if (!useSessionStore.getState().sessionMetadata.isActive) {
      console.log('[Autosave] WelcomeMessageEditor: Skipped – session not active');
      return;
    }
    
    console.log('[Autosave] WelcomeMessageEditor: Triggering save via hook...');
    try {
      await saveSessionData();
      console.log('[Autosave] WelcomeMessageEditor: Success via hook');
    } catch (err) {
      console.error('[Autosave] WelcomeMessageEditor: Failed via hook:', err);
    }
  }, 1000);

  const characterLimit = 1700;
  const messageLength = welcomeMessage?.length || 0;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
     let newValue = event.target.value;
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
        className={cn(
          "min-h-[120px] bg-legacy-green/5 border-0 rounded-md px-3 py-2",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        )}
        maxLength={characterLimit}
      />
    </div>
  );
};

export default WelcomeMessageEditor; 