import { FormData } from '@/types/onboarding';

// Types
export interface SavedSession {
  email: string;
  formData: FormData;
  resumeToken: string;
  createdAt: Date;
  lastUpdatedAt: Date;
}

// Constants
const CURRENT_SESSION_KEY = 'legacy_locker_current_session';
// const SAVED_SESSION_KEY = 'legacy_locker_saved_session';

// Function to save session to backend
/*
export const saveSessionToBackend = async (email: string, formData: FormData): Promise<string> => {
  console.log('Saving session to backend for email:', email);
  const resumeToken = generateMockToken();
  const session: SavedSession = {
    email,
    formData,
    resumeToken,
    createdAt: new Date(),
    lastUpdatedAt: new Date()
  };
  localStorage.setItem(SAVED_SESSION_KEY, JSON.stringify(session));
  await new Promise(resolve => setTimeout(resolve, 800));
  return resumeToken;
};
*/

// Function to save current form state locally (between page visits)
// This is used for non-persistent local drafts before session activation
export const saveCurrentSession = (formData: FormData): void => {
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify({
      formData,
      lastUpdatedAt: new Date()
    }));
  } catch (error) {
    console.error('Failed to save current session:', error);
  }
};

// Function to retrieve current session
// Used for local drafts
export const getCurrentSession = (): { formData: FormData | null, lastUpdatedAt: Date | null } => {
  try {
    const sessionData = localStorage.getItem(CURRENT_SESSION_KEY);
    if (sessionData) {
      const parsed = JSON.parse(sessionData);
      return {
        formData: parsed.formData,
        lastUpdatedAt: parsed.lastUpdatedAt ? new Date(parsed.lastUpdatedAt) : null
      };
    }
  } catch (error) {
    console.error('Failed to retrieve current session:', error);
  }
  
  return { formData: null, lastUpdatedAt: null };
};

// Function to check if there's an active local draft session
// This doesn't check Supabase or the main session store
export const hasActiveSession = (): boolean => {
  try {
    const sessionData = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!sessionData) return false;
    const parsed = JSON.parse(sessionData);
    if (parsed && parsed.formData) {
      const data = parsed.formData;
      // Example check: has selected an edition type?
      return !!data.selectedEdition;
      // Adjust this check based on when a local draft should be considered active
    }
    return false;
  } catch (error) {
    console.error('Error checking active session:', error);
    return false;
  }
};

// Function to clear current local draft session
export const clearCurrentSession = (): void => {
  localStorage.removeItem(CURRENT_SESSION_KEY);
};

// <<< Comment out legacy token generator >>>
/*
const generateMockToken = (): string => {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => {
    return Math.floor(Math.random() * 16).toString(16);
  });
};
*/

// <<< Comment out legacy token retrieval >>>
/*
export const getSessionByToken = async (token: string): Promise<SavedSession | null> => {
  try {
    const savedSessionStr = localStorage.getItem(SAVED_SESSION_KEY);
    if (savedSessionStr) {
      const savedSession = JSON.parse(savedSessionStr);
      if (savedSession.resumeToken === token) {
        return {
          ...savedSession,
          createdAt: new Date(savedSession.createdAt),
          lastUpdatedAt: new Date(savedSession.lastUpdatedAt)
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error retrieving session by token:', error);
    return null;
  }
};
*/

// <<< Comment out legacy token expiration check >>>
/*
export const isTokenExpired = (session: SavedSession): boolean => {
  const now = new Date();
  const expiryDate = new Date(session.createdAt);
  expiryDate.setDate(expiryDate.getDate() + 30);
  return now > expiryDate;
};
*/
