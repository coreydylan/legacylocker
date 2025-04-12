import React from 'react';
import { Button } from "@/components/ui/button";
import { X, Edit3 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useSessionStore } from '@/lib/sessionStore';
import { SessionData } from '@/lib/sessionManager';

interface SessionPillProps {
  isOpen: boolean;
}

const SessionPill: React.FC<SessionPillProps> = ({ isOpen }) => {
  const { session, resetSession } = useSessionStore();
  const typedSession = session as SessionData;
  
  const [showConfirmAbandon, setShowConfirmAbandon] = React.useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const getEditionText = () => {
    const editionType = typedSession.editionFlow?.type;
    const seriesName = typedSession.selectedSeries?.display;
    
    if (seriesName) return `your ${seriesName} series`;
    
    if (editionType === 'signature') return "your signature series";
    if (editionType === 'custom') return "your custom edition";
    if (editionType === 'concierge') return "your concierge edition";
    
    return "your edition";
  };

  const handleAbandon = () => {
    resetSession();
    toast({
      title: "Progress cleared",
      description: "Your draft has been cleared. You can now start fresh."
    });
    setShowConfirmAbandon(false);
  };

  const handleContinue = () => {
    console.log("SessionPill: Continue clicked - parent should handle showing flow.");
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        <Button
          onClick={handleContinue}
          className="bg-legacy-green hover:bg-legacy-green/90 text-white shadow-md rounded-full pl-4 pr-5 py-6"
        >
          <Edit3 className="mr-2 h-4 w-4" />
          Continue building {getEditionText()}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowConfirmAbandon(true)}
          className="border-destructive text-destructive hover:bg-destructive/10 rounded-full px-4 py-2 text-sm shadow-sm"
        >
          <X className="mr-1 h-4 w-4" />
          Abandon this edition
        </Button>
      </div>
      
      <AlertDialog open={showConfirmAbandon} onOpenChange={setShowConfirmAbandon}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your current progress. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleAbandon}>
              Yes, abandon
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SessionPill;
