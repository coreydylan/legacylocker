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
  // Track overall status of the checkout/order flow so the UI can react (e.g., show confirmation)
  const [sessionStatus, setSessionStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
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

  const initializeNewLocalSession = useCallback((edition: EditionType) => {
    const { sessionMetadata: currentMeta } = useSessionStore.getState();
    if (currentMeta.isActive && currentMeta.sessionId) {
      console.warn('[SessionManager] initializeNewLocalSession called but active session already exists. Aborting to prevent overwrite.', currentMeta);
      return;
    }

    console.log('[SessionManager] Initializing new local session:', edition);
    startSession(edition);

    console.log('[SessionManager] Called startSession action.');

  }, [startSession]);

  const activateAndPersistSession = useCallback(async () => {
    const currentSessionState = useSessionStore.getState();
    const purchaserEmail = currentSessionState.session.purchaser?.email;
    const selectedEdition = currentSessionState.session.selectedEdition;

    console.log('[activateAndPersistSession] Start');
    
    // If the session is already active we should still persist the latest data
    // and (re‑)send the resume email if it has not been sent yet. The previous
    // early‑return prevented this, which meant users never received their
    // magic link once they completed the recipient info step.
    let newSessionId = currentSessionState.sessionMetadata.sessionId;

    if (!currentSessionState.sessionMetadata.isActive) {
      // --- First‑time activation path ---
      if (!purchaserEmail) {
        console.error('[activateAndPersistSession] Missing purchaser email. Aborting.');
        toast({ title: 'Error', description: 'Cannot save session, email is missing.', variant: 'destructive' });
        return;
      }

      if (!selectedEdition) {
        console.error('[activateAndPersistSession] Missing selectedEdition. Aborting.');
        toast({ title: 'Error', description: 'Cannot save session, edition details are missing.', variant: 'destructive' });
        return;
      }

      // Start session (assigns ID)
      startSession(selectedEdition);
      newSessionId = useSessionStore.getState().sessionMetadata.sessionId;
      console.log('[activateAndPersistSession] New session ID assigned:', newSessionId);

      if (!newSessionId) {
        console.error('[activateAndPersistSession] Failed to get session ID after startSession. Aborting.');
        toast({ title: 'Error', description: 'Failed to initialize session ID.', variant: 'destructive' });
        return; // Cannot proceed without session ID
      }
    } else {
      console.log('[activateAndPersistSession] Session already active – proceeding to save & email.');
      // Guard against missing ID (should never happen when active)
      if (!newSessionId) {
        console.warn('[activateAndPersistSession] Active session missing ID. Generating new one.');
        startSession(selectedEdition || { id: '', label: '', type: 'signature' });
        newSessionId = useSessionStore.getState().sessionMetadata.sessionId;
      }
    }

    // Persist the session data (upsert)
    try {
      console.log('[activateAndPersistSession] Saving session to Supabase...');
      await saveSessionToDb();
      console.log('[activateAndPersistSession] Session successfully saved to Supabase');
    } catch (err) {
      console.error('[activateAndPersistSession] Supabase save failed, aborting email send:', err);
      toast({ title: 'Error Saving', description: 'Failed to save your progress. Please try again.', variant: 'destructive' });
      return; // Do not attempt email if save failed
    }

    // --- Email Magic Link ---
    const recipientFirstName = currentSessionState.session.recipient?.firstName || currentSessionState.session.recipient?.recipient1FirstName;
    const purchaserName = currentSessionState.session.purchaser?.fullName;
    const editionTitle = currentSessionState.session.selectedEdition?.label;
    const editionType = currentSessionState.session.selectedEdition?.type;
    console.log(`[activateAndPersistSession] Sending resume email to ${purchaserEmail} for session ${newSessionId}`);

    try {
      const response = await fetch('/api/send-resume-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: purchaserEmail, 
          sessionId: newSessionId, 
          recipientFirstName,
          purchaserName,
          editionTitle,
          editionType
        }),
      });

      if (!response.ok) {
        console.error(`[activateAndPersistSession] Resume email API call failed: ${response.status}`);
        toast({ title: 'Progress Saved', description: "We saved your progress, but couldn't send your magic link email.", variant: 'default' });
      } else {
        console.log('[activateAndPersistSession] Resume email sent successfully');
        toast({ title: 'Magic Link Sent', description: `We emailed a magic link to ${purchaserEmail}. Your progress is saved!` });
      }
    } catch (error) {
      console.error('[activateAndPersistSession] Unexpected error during email send API call:', error);
      toast({ title: 'Progress Saved', description: "We saved your progress, but couldn't send your magic link email due to a network issue.", variant: 'default' });
    }

    // END activateAndPersistSession
  }, [startSession, saveSessionToDb, toast]); 

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
          if (!isHydrated) setHydrated(true);
          return true;
      }
      
      console.log(`[SessionManager] Found session_id param: ${sessionIdParam}. Attempting load.`);
      trackEvent('resume_session_attempt', { sessionId: sessionIdParam });
      
      // Don't set hydrated to false here, as it can cause the loading spinner to appear
      // setHydrated(false);
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
        return true;
      } else {
        console.warn('[SessionManager] Failed to load session from URL param or session was invalid/expired.');
        const errorType = 'not_found';
        setLoadError({ type: errorType, message: 'Could not load session from link.' });
        trackEvent('resume_session_failed', { sessionId: sessionIdParam, reason: errorType });
        toast({ title: "Load Failed", description: "Could not load the session from the link. It might be expired or invalid.", variant: "destructive" });
        navigate(location.pathname, { replace: true });
        storeResetSession();
        if (!isHydrated) setHydrated(true);
        return false;
      }
    } else {
       console.log('[SessionManager] No session_id param found.');
       if (!isHydrated) setHydrated(true);
       return true;
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
    sessionMetadata.sessionId,
    isHydrated
  ]);

  const resetSessionAndState = useCallback(() => {
    console.log('[SessionManager] Resetting session state...');
    storeResetSession();
    toast({ title: "Session Cleared", description: "Your progress has been cleared." });
  }, [storeResetSession, toast]);

  // --- UI Interaction / Lifecycle Functions ---

  const handleModalClose = useCallback(async () => {
    console.log('[SessionManager] handleModalClose invoked – evaluating session state...');

    const {
      session: currentSession,
      sessionMetadata: currentMeta,
      startSession,
      saveSession,
      saveSessionToDb,
      resetSession: resetFromStore,
    } = useSessionStore.getState();

    // 1) If session is active, save and exit
    if (currentMeta.isActive && currentMeta.sessionId) {
      console.log('[SessionManager] Active session detected. Saving before close.', { sessionId: currentMeta.sessionId });
      try {
        await saveSessionToDb();
        console.log('[SessionManager] Active session saved.');
      } catch (e) {
        console.error('[SessionManager] Failed to save active session during close:', e);
      }

      const purchaserEmail = currentSession.purchaser?.email;
      if (purchaserEmail) {
        toast({ title: 'Progress Saved', description: `We sent a magic link to ${purchaserEmail} to resume.` });
      } else {
        toast({ title: 'Progress Saved', description: 'You can resume your session later.' });
      }

      return; // Done
    }

    // 2) Inactive session but with meaningful data – prompt to save
    const hasMeaningfulData = !!(
      currentSession.selectedEdition ||
      currentSession.purchaser?.email ||
      currentSession.recipient?.firstName ||
      currentSession.recipient?.lastName ||
      currentSession.recipient?.relationship
    );

    if (!currentMeta.sessionId && hasMeaningfulData) {
      console.log('[SessionManager] Unsaved progress detected on inactive session. Prompting user...');
      const confirmSave = window.confirm('You have unsaved progress. Would you like to save it before closing?');

      if (confirmSave) {
        const editionObj = currentSession.selectedEdition ?? { id: '', label: '', type: 'signature' };
        console.log('[SessionManager] User agreed to save. Activating & saving with edition', editionObj.type);
        startSession(editionObj);
        saveSession();
        try {
          await saveSessionToDb();
          console.log('[SessionManager] Inactive session activated & saved successfully.');
        } catch (e) {
          console.error('[SessionManager] Failed to save newly activated session:', e);
          toast({ title: 'Save Failed', description: 'We could not save your progress. Please try again.', variant: 'destructive' });
        }
      } else {
        console.log('[SessionManager] User declined to save. Clearing session.');
        resetFromStore();
      }

      return;
    }

    // 3) Truly empty session – reset silently
    if (!currentMeta.sessionId && !hasMeaningfulData) {
      console.log('[SessionManager] No meaningful data. Performing silent reset.');
      resetFromStore();
    }
  }, [toast]);

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
    // Order/checkout status helpers
    sessionStatus,
    setSessionStatus,
  };
}