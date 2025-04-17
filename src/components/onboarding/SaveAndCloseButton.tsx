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
    saveSessionToDb,
    saveSession,
  } = useSessionStore((state) => ({
    session: state.session,
    saveSessionToDb: state.saveSessionToDb,
    saveSession: state.saveSession,
  }));

  const purchaserEmail = session.purchaser?.email;
  const [isSaving, setIsSaving] = useState(false);

  const handleClick = () => {
    console.log('[SaveAndCloseButton] handleClick started.');
    setIsSaving(true);

    // Run save in background
    (async () => {
      console.log('[SaveAndCloseButton] Async save process starting...');
      try {
        console.log('[SaveAndCloseButton] Calling saveSession()...');
        saveSession();
        console.log('[SaveAndCloseButton] Calling saveSessionToDb()...');
        await saveSessionToDb();
        console.log('[SaveAndCloseButton] saveSessionToDb() successful.');

        if (purchaserEmail) {
          toast({
            title: 'Magic Link Sent',
            description: `We sent a magic link to ${purchaserEmail} so you can come back to this order any time.`,
          });
        } else {
          toast({
            title: 'Order Saved',
            description: 'You can resume your order later.',
          });
        }
        console.log('[SaveAndCloseButton] Calling onClose()...');
        onClose();
        console.log('[SaveAndCloseButton] onClose() called.');
      } catch (err) {
        console.error('[SaveAndCloseButton] Error saving session', err);
        toast({ title: 'Error', description: 'Failed to save your progress. Please try again.', variant: 'destructive' });
      } finally {
        console.log('[SaveAndCloseButton] Async save process finished (finally block).');
        setIsSaving(false);
      }
    })();
    console.log('[SaveAndCloseButton] handleClick finished (after async call initiated).');
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