
import { useState, useEffect } from 'react';
import { FormData } from '@/types/onboarding';
import { 
  saveSessionToBackend, 
  saveCurrentSession, 
  getCurrentSession,
  clearCurrentSession,
  getSessionByToken,
  hasActiveSession
} from '@/services/sessionService';
import { useToast } from "@/hooks/use-toast";

export const useSessionManagement = (initialFormData: FormData) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSessionPillVisible, setIsSessionPillVisible] = useState(false);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const { formData: savedFormData, lastUpdatedAt } = getCurrentSession();
    if (savedFormData) {
      setFormData(savedFormData);
      if (lastUpdatedAt) {
        setLastSavedTime(lastUpdatedAt);
      }
    }
  }, []);

  // Handle save progress
  const handleSaveProgress = async (email: string, data: FormData): Promise<boolean> => {
    try {
      const resumeToken = await saveSessionToBackend(email, data);
      if (resumeToken) {
        setLastSavedTime(new Date());
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error saving progress:", error);
      return false;
    }
  };

  // Restore session from token
  const restoreSessionFromToken = async (token: string): Promise<boolean> => {
    try {
      const session = await getSessionByToken(token);
      if (session) {
        setFormData(session.formData);
        setLastSavedTime(session.lastUpdatedAt);
        saveCurrentSession(session.formData);
        
        toast({
          title: "Welcome back!",
          description: "Your saved progress has been restored.",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error restoring session:", error);
      return false;
    }
  };

  // Handle closing the onboarding modal
  const handleCloseOnboarding = () => {
    // Only show session pill if there's an active session with meaningful data
    if (hasActiveSession()) {
      setIsSessionPillVisible(true);
    }
  };

  // Handle continuing from pill
  const handleContinueFromPill = () => {
    setIsSessionPillVisible(false);
  };

  // Handle abandoning session from pill
  const handleAbandonSession = () => {
    clearCurrentSession();
    setIsSessionPillVisible(false);
    setFormData(initialFormData);
  };

  return {
    formData,
    setFormData,
    lastSavedTime,
    setLastSavedTime,
    isSaveModalOpen,
    setIsSaveModalOpen,
    handleSaveProgress,
    restoreSessionFromToken,
    handleCloseOnboarding,
    isSessionPillVisible,
    handleContinueFromPill,
    handleAbandonSession
  };
};
