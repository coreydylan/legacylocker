import React, { useMemo, useState } from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import { useModalStore } from '@/lib/modalStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Save, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ClearSessionButton from './onboarding/ClearSessionButton';
import ClearSessionDialog from './onboarding/ClearSessionDialog';

export function SessionBug() {
  const { sessionMetadata, saveSession, endSession, resetSession } = useSessionStore();
  const { isActive, editionType, lastSaved } = sessionMetadata;
  const { isOnboardingOpen, openOnboarding, closeOnboarding } = useModalStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for confirmation dialog
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  // Format the last saved time
  const lastSavedText = useMemo(() => {
    if (!lastSaved) return null;
    return formatDistanceToNow(new Date(lastSaved), { addSuffix: true });
  }, [lastSaved]);

  // Get the edition type display text
  const getEditionText = () => {
    if (!editionType) return "your edition";
    
    switch (editionType.toLowerCase()) {
      case 'signature':
        return "your signature series";
      case 'custom':
        return "your custom edition";
      case 'concierge':
        return "your concierge edition";
      default:
        return "your edition";
    }
  };

  // Styles for the fixed position container
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: 40, // Lower z-index to be below modals
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    alignItems: 'flex-end',
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly more opaque
    backdropFilter: 'blur(8px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  const handleSaveAndFinish = () => {
    // First save the session
    saveSession();
    
    // Close the onboarding modal if it's open
    if (isOnboardingOpen) {
      closeOnboarding();
    }
    
    // Show a toast notification
    toast({
      title: "Progress saved",
      description: "Your progress has been saved. You can resume anytime.",
    });
    
    // End the session (this will hide the session bug)
    endSession();
    
    // Navigate back to home page after saving
    navigate('/');
  };

  const handleResume = () => {
    openOnboarding();
  };

  // Function to handle confirmed clear action
  const handleConfirmClear = () => {
    console.log("SessionBug: Clearing session...");
    resetSession(); 
    setIsClearDialogOpen(false);
    toast({
      title: "Session Cleared",
      description: "Your previous session data has been removed.",
    });
  };

  // Show "Save & Finish Later" when the onboarding modal is open
  // or when we're on a personalization page
  const showSaveButton = isOnboardingOpen || window.location.pathname.includes('/personalize/');

  // Return null if session is not active OR if the onboarding modal is open
  if (!isActive || isOnboardingOpen) {
    return null;
  }

  return (
    <>
      <div style={containerStyle}>
        {lastSavedText && (
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Saved {lastSavedText}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            onClick={handleResume}
            className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow bg-legacy-green hover:bg-legacy-green/90"
          >
            <span>Resume Building {getEditionText()}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <ClearSessionButton onClick={() => setIsClearDialogOpen(true)} />
        </div>
      </div>
      
      <ClearSessionDialog
        open={isClearDialogOpen}
        onOpenChange={setIsClearDialogOpen}
        onConfirm={handleConfirmClear}
      />
    </>
  );
} 