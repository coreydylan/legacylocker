import React, { useState, useEffect } from 'react';
import { FormData } from '@/types/onboarding';
import { 
  // saveSessionToBackend, // <<< Commented out in service
  saveCurrentSession, 
  getCurrentSession,
  clearCurrentSession,
  hasActiveSession
} from '@/services/sessionService';
import { useToast } from "@/hooks/use-toast";

// <<< NOTE: This hook seems potentially legacy given the new useSessionManager >>>
// <<< Consider deleting this hook entirely if it's no longer used. >>>
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
    // This likely calls the commented-out saveSessionToBackend
    console.warn('handleSaveProgress in useSessionManagement likely calls legacy code.');
    return false; // Return false as legacy code is disabled
  };

  // Restore session from token
  const restoreSessionFromToken = async (token: string): Promise<boolean> => {
    console.warn('restoreSessionFromToken in useSessionManagement is legacy code.');
    toast({ title: "Error", description: "Session restore link is outdated.", variant: "destructive" });
    return false;
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
    restoreSessionFromToken, // Returns a stub function now
    handleCloseOnboarding,
    isSessionPillVisible,
    handleContinueFromPill,
    handleAbandonSession
  };
};
