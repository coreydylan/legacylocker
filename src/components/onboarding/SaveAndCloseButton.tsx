import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useSessionStore } from '@/lib/sessionStore';

interface SaveAndCloseButtonProps {
  onClose: () => void; // Function to close the modal
}

const SaveAndCloseButton: React.FC<SaveAndCloseButtonProps> = ({ onClose }) => {
  const { toast } = useToast();
  const {
    session,
    sessionMetadata,
    saveSessionToDb,
    saveSession,
    startSession,
  } = useSessionStore((state) => ({
    session: state.session,
    sessionMetadata: state.sessionMetadata,
    saveSessionToDb: state.saveSessionToDb,
    saveSession: state.saveSession,
    startSession: state.startSession,
  }));

  const purchaserEmail = session.purchaser?.email;
  const [isSaving, setIsSaving] = useState(false);

  const handleClick = async () => {
    if (!sessionMetadata.isActive || !sessionMetadata.sessionId) {
      console.warn('[SaveAndCloseButton] Cannot save, session is not active.');
      toast({ title: 'Error', description: 'Cannot save, session not active.', variant: 'destructive'});
      return;
    }
    
    console.log(`[SaveAndCloseButton] Saving session ${sessionMetadata.sessionId}...`);
    setIsSaving(true);

    try {
      // 1. Update local session timestamp
      saveSession(); 
      
      // 2. Persist to database
      await saveSessionToDb();
      console.log(`[SaveAndCloseButton] Session ${sessionMetadata.sessionId} saved successfully.`);

      // 3. Show appropriate toast
      if (purchaserEmail) {
        toast({
          title: 'Progress Saved & Magic Link Sent',
          description: `We saved your progress and sent a resume link to ${purchaserEmail}.`,
        });
      } else {
        toast({
          title: 'Progress Saved',
          description: 'Your progress has been saved. You can resume later from this device.',
        });
      }

      // 4. Close the modal (without resetting the session state)
      onClose();

    } catch (err) {
      console.error('[SaveAndCloseButton] Error saving session:', err);
      toast({ title: 'Save Error', description: 'Failed to save your progress. Please try again.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleClick}
      disabled={isSaving}
      className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
    >
      {isSaving ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Save className="h-4 w-4" />
      )}
      <span>{isSaving ? 'Saving...' : 'Save & Finish Later'}</span>
    </Button>
  );
};

export default SaveAndCloseButton; 