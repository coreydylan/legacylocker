
import React from 'react';
import { Button } from "@/components/ui/button";
import { X, Edit3 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { FormData } from '@/types/onboarding';

interface SessionPillProps {
  formData: FormData;
  onContinue: () => void;
  onAbandon: () => void;
  isOpen: boolean;
}

const SessionPill: React.FC<SessionPillProps> = ({ 
  formData,
  onContinue, 
  onAbandon,
  isOpen
}) => {
  const [showConfirmAbandon, setShowConfirmAbandon] = React.useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  // Get appropriate edition name text based on form data
  const getEditionText = () => {
    if (!formData) return "your edition";
    
    const editionType = formData.editionFlow?.type;
    if (editionType === 'signature') return "your signature series";
    if (editionType === 'custom') return "your custom edition";
    if (editionType === 'concierge') return "your concierge edition";
    
    return "your edition";
  };

  const handleAbandon = () => {
    onAbandon();
    toast({
      title: "Progress cleared",
      description: "Your draft has been cleared. You can now start fresh."
    });
    setShowConfirmAbandon(false);
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        <Button
          onClick={onContinue}
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
