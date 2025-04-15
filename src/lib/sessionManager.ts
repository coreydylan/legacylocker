import { v4 as uuidv4 } from 'uuid';
import set from 'lodash.set';
import get from 'lodash.get';
import cloneDeep from 'lodash/cloneDeep';
import setWith from 'lodash/setWith';
import { SeriesType } from '@/types/onboarding';

// Import and re-export types from sessionStore
export type { 
    SessionData, 
    MonthlyCardData, 
    EditionType, 
    CustomEditionData,
    ConciergeEditionData,
    ShippingAddress 
} from './sessionStore';

// Import necessary types locally if needed for internal logic (check usage)
// If SessionData etc. are used *within* this file, keep the import:
import { SessionData, MonthlyCardData, CustomEditionData, ConciergeEditionData, ShippingAddress } from './sessionStore';

export interface CustomCardData { /* ... */ }

// Define the structure for the recipient
export interface Recipient {
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
  
  // Fields for Shipping Label
  shippingName?: string;            // Potentially overridden name for shipping
  shippingNameOverridden?: boolean; // Tracks if user manually edited shipping name
  
  // Fields for Envelope
  cardAddresseeName?: string;       // Potentially overridden name for envelope
  cardAddresseeNameOverridden?: boolean; // Tracks if user manually edited envelope name
}

// Define the structure for the purchaser
export interface Purchaser {
  fullName?: string;
  email?: string;
}

// Define the structure for the selected series
export interface SelectedSeries {
  type: 'signature' | 'custom' | 'concierge';
  name?: string;
  edition?: string;
}

const LOCAL_STORAGE_KEY = 'legacyLockerSession';

// Define MONTHS constant needed by createDefaultMonthlyData
const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// Helper to create default monthly data structure (if needed, check if already in sessionStore)
const createDefaultMonthlyData = (): Record<string, MonthlyCardData> => {
    // Implementation (ensure this aligns with sessionStore's initialization)
    return {}; // Placeholder
};

// Function to create default concierge data
const createDefaultConciergeData = (): ConciergeEditionData => ({
  openEndedStory: '',
  preferredContact: {
    method: 'email' // Default contact method
  }
});

// Function to create default custom edition data
const createDefaultCustomEditionData = (): CustomEditionData => ({
  cards: Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: '',
    story: '',
    useExactText: false,
    useExactTitle: false,
    artworkOption: 'from-story',
    photoUrl: undefined
  })),
  theme: 'Custom Story',
  currentCard: 1
});

// Create default session data structure
const createDefaultSession = (): SessionData => {
  // Ensure this function returns data matching the imported SessionData structure
  // ... implementation likely needs updating based on sessionStore.ts's createNewSession ...
  return { /* ... initial data matching SessionData from sessionStore ... */ } as SessionData;
};

// Create a new session
export const createNewSession = (): SessionData => {
  const sessionData = createDefaultSession();
  // Save?
  return sessionData;
};

// Load session from localStorage
export const loadSessionFromLocalStorage = (): SessionData | null => {
  if (typeof window === 'undefined') return null;
  
  const savedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!savedSession) return null;
  
  try {
    // Ensure parsed data conforms to imported SessionData
    return JSON.parse(savedSession) as SessionData;
  } catch (error) {
    console.error('Failed to parse session data:', error);
    return null;
  }
};

// Load session by ID 
export const loadSession = (sessionId: string): SessionData | null => {
  const savedSession = loadSessionFromLocalStorage();
  
  if (savedSession && savedSession.sessionId === sessionId) {
    return savedSession;
  }
  
  return null;
};

// Save session to localStorage
export const saveSessionToLocalStorage = (sessionData: SessionData): void => {
  if (typeof window === 'undefined') return;
  
  const updatedSession = {
    ...sessionData,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSession));
};

// Update a field in the session data
export const updateField = (
  sessionData: SessionData,
  path: string,
  value: any
): SessionData => {
  const updatedSession = cloneDeep(sessionData);
  setWith(updatedSession, path, value, cloneDeep);
  updatedSession.updatedAt = new Date().toISOString();
  
  // Auto-save to localStorage
  saveSessionToLocalStorage(updatedSession);
  
  return updatedSession;
};

// Save session
export const saveSession = (sessionData: SessionData): void => {
  saveSessionToLocalStorage(sessionData);
};

// Helper to get query parameter from URL
export const getSessionIdFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('sessionId');
};

// Initialize session from URL or localStorage or create new
export const initializeSession = (): SessionData => {
  // This function might be redundant if initialization is handled by the zustand store
  // Review if this is still needed or if createNewSession from sessionStore is used
  const sessionIdFromUrl = getSessionIdFromUrl();
  let session: SessionData | null = null;
  
  if (sessionIdFromUrl) {
    session = loadSession(sessionIdFromUrl);
  }
  
  if (!session) {
    session = loadSessionFromLocalStorage();
  }
  
  if (!session) {
    // Consider using createNewSession from sessionStore here if applicable
    session = createNewSession(); 
  }
  
  return session;
}; 