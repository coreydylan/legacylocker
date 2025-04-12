
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
const SAVED_SESSION_KEY = 'legacy_locker_saved_session';

// Function to save session to backend
export const saveSessionToBackend = async (email: string, formData: FormData): Promise<string> => {
  // This is a placeholder that will be replaced with an actual API call
  console.log('Saving session to backend for email:', email);
  
  // Mock a successful response with a token
  const resumeToken = generateMockToken();
  
  // For now, save to localStorage as a placeholder
  const session: SavedSession = {
    email,
    formData,
    resumeToken,
    createdAt: new Date(),
    lastUpdatedAt: new Date()
  };
  
  localStorage.setItem(SAVED_SESSION_KEY, JSON.stringify(session));
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return resumeToken;
};

// Function to save current form state locally (between page visits)
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

// Function to check if there's an active session with meaningful data
export const hasActiveSession = (): boolean => {
  try {
    const sessionData = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!sessionData) return false;
    
    // Parse the session data
    const parsed = JSON.parse(sessionData);
    
    // Check if the formData has been populated with meaningful information
    if (parsed && parsed.formData) {
      const data = parsed.formData;
      
      // Only consider it an active session if the user has selected a gift type
      // and has either filled out purchaser info or recipient info
      if (data.giftType) {
        const hasPurchaserInfo = data.purchaser && 
          (data.purchaser.fullName || data.purchaser.email);
          
        const hasRecipientInfo = data.recipient && (
          (data.recipient.type === 'individual' && (data.recipient.firstName || data.recipient.lastName)) || 
          (data.recipient.type === 'couple' && (data.recipient.recipient1FirstName || data.recipient.recipient2FirstName))
        );
        
        return hasPurchaserInfo || hasRecipientInfo;
      }
      
      return false;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking active session:', error);
    return false;
  }
};

// Function to clear current session
export const clearCurrentSession = (): void => {
  localStorage.removeItem(CURRENT_SESSION_KEY);
};

// Helper function to generate a mock token
const generateMockToken = (): string => {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => {
    return Math.floor(Math.random() * 16).toString(16);
  });
};

// Function to retrieve a session by resume token (mock implementation)
export const getSessionByToken = async (token: string): Promise<SavedSession | null> => {
  // This will be replaced with an actual API call later
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

// Check if a token is expired (older than 30 days)
export const isTokenExpired = (session: SavedSession): boolean => {
  const now = new Date();
  const expiryDate = new Date(session.createdAt);
  expiryDate.setDate(expiryDate.getDate() + 30); // 30 day expiry
  
  return now > expiryDate;
};
