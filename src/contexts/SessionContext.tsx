import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  SessionData, 
  createNewSession, 
  loadSession, 
  saveSession, 
  updateField,
  sendResumeLink
} from '@/services/sessionManager';

// Define the context type
interface SessionContextType {
  sessionData: SessionData | null;
  isLoading: boolean;
  error: string | null;
  initializeSession: (sessionId?: string) => void;
  updateSessionField: (path: string, value: any) => void;
  saveAndExitSession: (email: string) => Promise<string>;
  clearError: () => void;
}

// Create the context with default values
const SessionContext = createContext<SessionContextType>({
  sessionData: null,
  isLoading: false,
  error: null,
  initializeSession: () => {},
  updateSessionField: () => {},
  saveAndExitSession: async () => '',
  clearError: () => {}
});

// Hook for components to use the session context
export const useSession = () => useContext(SessionContext);

// Provider component
export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session on component mount
  useEffect(() => {
    // Check URL for sessionId parameter
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('sessionId');
    
    initializeSession(sessionId || undefined);
  }, []);

  // Initialize or create a session
  const initializeSession = (sessionId?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to load an existing session
      let session = loadSession(sessionId);
      
      // If no session found, create a new one
      if (!session) {
        session = createNewSession();
      }
      
      setSessionData(session);
    } catch (err) {
      console.error('Failed to initialize session:', err);
      setError('Failed to initialize session. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update a specific field in the session
  const updateSessionField = (path: string, value: any) => {
    if (!sessionData) return;
    
    try {
      // Create a deep copy of the session data
      const updatedSession = JSON.parse(JSON.stringify(sessionData));
      
      // Update the field using a helper function like lodash.set
      // Here we're using a simple implementation for nested paths
      const pathParts = path.split('.');
      let current = updatedSession;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      // Set the value at the final path
      current[pathParts[pathParts.length - 1]] = value;
      
      // Update the timestamp
      updatedSession.updatedAt = new Date().toISOString();
      
      // Save to storage
      saveSession(updatedSession);
      
      // Update state
      setSessionData(updatedSession);
    } catch (err) {
      console.error('Failed to update session field:', err);
      setError('Failed to save your changes. Please try again.');
    }
  };

  // Save session and send a resume link
  const saveAndExitSession = async (email: string): Promise<string> => {
    if (!sessionData) throw new Error('No active session');
    
    try {
      // Update the email in the session
      const updatedSession = { ...sessionData, email };
      saveSession(updatedSession);
      setSessionData(updatedSession);
      
      // Send resume link (this will be implemented with Supabase later)
      await sendResumeLink(email, updatedSession.sessionId);
      
      // Return the session ID
      return updatedSession.sessionId;
    } catch (err) {
      console.error('Failed to save and exit session:', err);
      setError('Failed to save your progress. Please try again.');
      throw err;
    }
  };

  // Clear any error
  const clearError = () => setError(null);

  // Provide the context
  return (
    <SessionContext.Provider
      value={{
        sessionData,
        isLoading,
        error,
        initializeSession,
        updateSessionField,
        saveAndExitSession,
        clearError
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}; 