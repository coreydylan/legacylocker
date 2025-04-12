import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  SessionData, 
  createNewSession, 
  loadSessionFromLocalStorage, 
  updateField, 
  saveSession,
  initializeSession 
} from './sessionManager';

interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface Recipient {
  type: 'individual' | 'couple';
  firstName?: string;
  lastName?: string;
  relationship?: string;
  birthday?: string;
  includeWelcomeCard?: boolean;
  welcomeMessage?: string;
  recipient1FirstName?: string;
  recipient1LastName?: string;
  recipient2FirstName?: string;
  recipient2LastName?: string;
  anniversary?: string;
  shippingAddress?: ShippingAddress;
  cardAddresseeName?: string;
}

interface Purchaser {
  // ... existing code ...
}

interface SessionStore {
  // State
  session: SessionData;
  isLoading: boolean;
  
  // Actions
  initialize: () => void;
  updateSession: (path: string, value: any) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setLastCompletedStep: (step: number) => void;
  saveSessionProgress: (email?: string) => void;
  resetSession: () => void;
  submitSession: () => Promise<boolean>;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  // Initial state
  session: createNewSession(),
  isLoading: true,
  
  // Initialize session from localStorage or URL parameter
  initialize: () => {
    set({ isLoading: true });
    
    try {
      const session = initializeSession();
      set({ session, isLoading: false });
    } catch (error) {
      console.error('Failed to initialize session:', error);
      set({ session: createNewSession(), isLoading: false });
    }
  },
  
  // Update a field in the session
  updateSession: (path: string, value: any) => {
    const { session } = get();
    const updatedSession = updateField(session, path, value);
    set({ session: updatedSession });
  },
  
  // Set current step
  setCurrentStep: (step: number) => {
    const { session } = get();
    const updatedSession = {
      ...session,
      currentStep: step,
    };
    saveSession(updatedSession);
    set({ session: updatedSession });
  },
  
  // Move to next step
  nextStep: () => {
    const { session } = get();
    const nextStep = session.currentStep + 1;
    const lastCompletedStep = Math.max(session.lastCompletedStep, session.currentStep);
    
    const updatedSession = {
      ...session,
      currentStep: nextStep,
      lastCompletedStep,
    };
    
    saveSession(updatedSession);
    set({ session: updatedSession });
  },
  
  // Move to previous step
  prevStep: () => {
    const { session } = get();
    const prevStep = Math.max(1, session.currentStep - 1);
    
    const updatedSession = {
      ...session,
      currentStep: prevStep,
    };
    
    saveSession(updatedSession);
    set({ session: updatedSession });
  },
  
  // Update last completed step
  setLastCompletedStep: (step: number) => {
    const { session } = get();
    const updatedSession = {
      ...session,
      lastCompletedStep: step,
    };
    saveSession(updatedSession);
    set({ session: updatedSession });
  },
  
  // Save session progress with email
  saveSessionProgress: (email?: string) => {
    const { session } = get();
    const updatedSession = {
      ...session,
      email,
    };
    saveSession(updatedSession);
    set({ session: updatedSession });
  },
  
  // Reset session to initial state
  resetSession: () => {
    const newSession = createNewSession();
    saveSession(newSession);
    set({ session: newSession, isLoading: false });
  },
  
  // Placeholder for submitting the final session data
  submitSession: async (): Promise<boolean> => {
    const { session } = get();
    console.log("Submitting session:", session);
    
    // TODO: Implement actual API submission logic here
    // Example: const success = await api.submitOnboarding(session);
    const success = true; // Placeholder
    
    if (success) {
      console.log("Session submitted successfully!");
      // Optionally reset session after successful submission
      // get().resetSession(); 
    } else {
      console.error("Session submission failed.");
    }
    return success;
  },
})); 