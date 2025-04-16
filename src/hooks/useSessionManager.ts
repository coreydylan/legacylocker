import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSessionStore, EditionType, isValidSession } from '@/lib/sessionStore';
import { useToast } from '@/hooks/use-toast';
// import { useModalStore } from '@/lib/modalStore'; // If managing confirmation modals centrally

// Helper to simulate tracking (replace with actual calls)
const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] Event: ${eventName}`, properties || '');
  // Example: posthog.capture(eventName, properties);
};

// Define possible load error types
interface LoadError {
  type: 'expired' | 'not_found' | 'invalid' | 'unknown';
  message: string;
}

export function useSessionManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [loadError, setLoadError] = useState<LoadError | null>(null);
  // const { openConfirmationModal } = useModalStore(); // Example if using modal store

  const {
    session,
    sessionMetadata,
    isLoading,
    isHydrated,
    startSession,
    saveSessionToDb,
    loadSessionFromDb,
    resetSession: storeResetSession,
    updateSession,
    initializeSignatureData,
    initializeCustomDataDates,
    setHydrated
  } = useSessionStore();

  // --- Core Session Lifecycle Functions ---

  const initializeNewLocalSession = useCallback((edition: { id: string; label: string; type: EditionType }) => {
    console.log('[SessionManager] Initializing new local session:', edition);
    updateSession('selectedEdition', edition);
    updateSession('editionFlow.type', edition.type);
    // Reset step counters when starting a new local session
    updateSession('currentStep', 1);
    updateSession('lastCompletedStep', 0);
  }, [updateSession]);

  const activateAndPersistSession = useCallback(async () => {
    const currentSessionState = useSessionStore.getState();
    const purchaserEmail = currentSessionState.session.purchaser?.email;
    const editionType = currentSessionState.session.selectedEdition?.type;

    if (currentSessionState.sessionMetadata.isActive) {
      console.warn('[SessionManager] Session already active. Attempting save instead.');
      await saveSessionData(); // Save latest data if already active
      return;
    }

    if (!purchaserEmail) {
      console.error('[SessionManager] Cannot activate session: Purchaser email missing.');
      toast({ title: "Error", description: "Cannot save session, email is missing.", variant: "destructive" });
      return;
    }
    if (!editionType) {
        console.error('[SessionManager] Cannot activate session: Edition type missing.');
        toast({ title: "Error", description: "Cannot save session, edition type is missing.", variant: "destructive" });
        return;
    }

    console.log('[SessionManager] Activating and persisting session...');
    startSession(editionType); // Assigns UUID and sets isActive=true

    const newSessionId = useSessionStore.getState().sessionMetadata.sessionId;
    if (!newSessionId) {
        console.error('[SessionManager] Failed to get sessionId after calling startSession.');
        toast({ title: "Error", description: "Failed to initialize session ID.", variant: "destructive" });
        return;
    }

    try {
      await saveSessionToDb(); // Saves with the new ID
      console.log('[SessionManager] Session saved to Supabase successfully.');

      const recipientFirstName = currentSessionState.session.recipient?.firstName || currentSessionState.session.recipient?.recipient1FirstName;
      console.log(`[SessionManager] Attempting to send resume email to ${purchaserEmail} for session ${newSessionId}`);
      const response = await fetch('/api/send-resume-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: purchaserEmail, sessionId: newSessionId, recipientFirstName }),
      });

      if (!response.ok) {
        console.error(`[SessionManager] Send resume email API failed: ${response.status}`);
        toast({ title: "Progress Saved", description: "Your progress was saved, but we couldn't send the resume email.", variant: "destructive"});
      } else {
        console.log('[SessionManager] Resume email sent successfully.');
        toast({ title: "Magic Link Sent", description: `We emailed a magic link to ${purchaserEmail}. Your progress is saved.` });
      }

    } catch (error) {
      console.error('[SessionManager] Error during activateAndPersistSession:', error);
      toast({ title: "Save Error", description: "Could not save your session progress.", variant: "destructive" });
    }
  }, [startSession, saveSessionToDb, toast]); // Removed saveSessionData from deps

  const saveSessionData = useCallback(async () => {
    const { sessionMetadata: currentMeta, session: currentSess } = useSessionStore.getState();
    if (!currentMeta.isActive || !currentMeta.sessionId || !currentSess.purchaser?.email) {
      console.warn('[SessionManager] Skipping save: Session not active or missing ID/email.', { meta: currentMeta, email: currentSess.purchaser?.email });
      return;
    }
    console.log('[SessionManager] Saving session data to Supabase...');
    try {
      await saveSessionToDb();
      console.log('[SessionManager] Session data saved successfully.');
    } catch (error) {
      console.error('[SessionManager] Error saving session data:', error);
      toast({ title: "Autosave Failed", description: "Could not automatically save changes.", variant: "destructive" });
    }
  }, [saveSessionToDb, toast]);

  const loadSessionFromUrlParam = useCallback(async () => {
    const currentMeta = useSessionStore.getState().sessionMetadata;
    const searchParams = new URLSearchParams(location.search);
    const sessionIdParam = searchParams.get('session_id');
    
    setLoadError(null);

    if (sessionIdParam) {
      if (sessionIdParam === currentMeta.sessionId) {
          console.log(`[SessionManager] Session ${sessionIdParam} already loaded, skipping restore.`);
          return;
      }
      
      console.log(`[SessionManager] Found session_id param: ${sessionIdParam}. Attempting load.`);
      trackEvent('resume_session_attempt', { sessionId: sessionIdParam });
      
      setHydrated(false);
      const success = await loadSessionFromDb(sessionIdParam);
      
      if (success) {
        console.log('[SessionManager] Session loaded successfully from URL.');
        await Promise.all([
            initializeSignatureData(),
            initializeCustomDataDates()
        ]);
        trackEvent('resume_session_success', { sessionId: sessionIdParam });
        toast({ title: "Session Resumed", description: "Your progress has been restored." });
        navigate(location.pathname, { replace: true });
      } else {
        console.warn('[SessionManager] Failed to load session from URL param or session was invalid/expired.');
        const errorType = 'not_found';
        setLoadError({ type: errorType, message: 'Could not load session from link.' });
        trackEvent('resume_session_failed', { sessionId: sessionIdParam, reason: errorType });
        toast({ title: "Load Failed", description: "Could not load the session from the link. It might be expired or invalid.", variant: "destructive" });
        navigate(location.pathname, { replace: true });
        storeResetSession();
      }
    } else {
       console.log('[SessionManager] No session_id param found.');
    }
  }, [
    location.search, 
    location.pathname, 
    loadSessionFromDb, 
    initializeSignatureData, 
    initializeCustomDataDates, 
    storeResetSession, 
    navigate, 
    toast, 
    setHydrated,
    sessionMetadata.sessionId
  ]);

  const resetSessionAndState = useCallback(() => {
    console.log('[SessionManager] Resetting session state...');
    storeResetSession();
    toast({ title: "Session Cleared", description: "Your progress has been cleared." });
  }, [storeResetSession, toast]);

  // --- UI Interaction / Lifecycle Functions ---

  const handleModalClose = useCallback(() => {
    console.log('[SessionManager] Handling modal close...');
    const { isActive, sessionId } = useSessionStore.getState().sessionMetadata;
    const purchaserEmail = useSessionStore.getState().session.purchaser?.email;

    if (isActive && sessionId) {
      console.log('[SessionManager] Modal closed with active session.');
      if (purchaserEmail) {
         toast({ title: "Progress Saved", description: `We sent a magic link to ${purchaserEmail} to resume.` });
      } else {
         toast({ title: "Progress Saved", description: "You can resume your session later." });
      }
    } else {
      console.log('[SessionManager] Modal closed with inactive session. Resetting.');
      storeResetSession(); // Reset without toast
    }
  }, [toast, storeResetSession]);

  const isStartOverConfirmationRequired = useCallback((): boolean => {
    const { isActive, sessionId } = useSessionStore.getState().sessionMetadata;
    const requiresConfirmation = !!(isActive && sessionId);
    console.log(`[SessionManager] Start over confirmation required: ${requiresConfirmation}`);
    return requiresConfirmation;
  }, []);

  // --- Return State and Functions ---
  return {
    session,
    sessionMetadata,
    isLoading,
    isHydrated,
    loadError,
    initializeNewLocalSession,
    activateAndPersistSession,
    saveSessionData,
    loadSessionFromUrlParam,
    resetSessionAndState,
    handleModalClose,
    isStartOverConfirmationRequired,
  };
} 