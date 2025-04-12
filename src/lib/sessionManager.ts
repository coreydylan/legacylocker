import { v4 as uuidv4 } from 'uuid';
import get from 'lodash.get';
import set from 'lodash.set';

export interface SessionData {
  sessionId: string;
  email?: string;
  recipientType: 'myself' | 'individual' | 'couple' | null;
  purchaser: {
    fullName: string;
    email: string;
  };
  recipient: {
    type: 'individual' | 'couple';
    firstName?: string;
    lastName?: string;
    relationship?: string;
    birthday?: string;
    includeWelcomeCard?: boolean;
    welcomeMessage?: string;
    // Couple-specific fields
    recipient1FirstName?: string;
    recipient1LastName?: string;
    recipient2FirstName?: string;
    recipient2LastName?: string;
    recipient1Birthday?: string;
    recipient2Birthday?: string;
    anniversary?: string;
  };
  cards: {
    [month: string]: {
      title: string;
      story: string;
      imageType: 'ai' | 'upload' | 'none';
      imageUrl?: string;
      isLocked?: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
  currentStep: number;
  lastCompletedStep: number;
}

const LOCAL_STORAGE_KEY = 'legacy_locker_session';

// Create default session data structure
const createDefaultSession = (): SessionData => ({
  sessionId: uuidv4(),
  recipientType: null,
  purchaser: {
    fullName: '',
    email: '',
  },
  recipient: {
    type: 'individual',
  },
  cards: {
    jan: { title: '', story: '', imageType: 'none' },
    feb: { title: '', story: '', imageType: 'none' },
    mar: { title: '', story: '', imageType: 'none' },
    apr: { title: '', story: '', imageType: 'none' },
    may: { title: '', story: '', imageType: 'none' },
    jun: { title: '', story: '', imageType: 'none' },
    jul: { title: '', story: '', imageType: 'none' },
    aug: { title: '', story: '', imageType: 'none' },
    sep: { title: '', story: '', imageType: 'none' },
    oct: { title: '', story: '', imageType: 'none' },
    nov: { title: '', story: '', imageType: 'none' },
    dec: { title: '', story: '', imageType: 'none' },
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  currentStep: 1,
  lastCompletedStep: 0,
});

// Create a new session
export const createNewSession = (): SessionData => {
  const sessionData = createDefaultSession();
  return sessionData;
};

// Load session from localStorage
export const loadSessionFromLocalStorage = (): SessionData | null => {
  if (typeof window === 'undefined') return null;
  
  const savedSession = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!savedSession) return null;
  
  try {
    return JSON.parse(savedSession) as SessionData;
  } catch (error) {
    console.error('Failed to parse session data:', error);
    return null;
  }
};

// Load session by ID (currently from localStorage, will be from Supabase later)
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
  const updatedSession = { ...sessionData };
  set(updatedSession, path, value);
  updatedSession.updatedAt = new Date().toISOString();
  
  // Auto-save to localStorage
  saveSessionToLocalStorage(updatedSession);
  
  return updatedSession;
};

// Save session (currently to localStorage, will add Supabase later)
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
  const sessionIdFromUrl = getSessionIdFromUrl();
  let session: SessionData | null = null;
  
  if (sessionIdFromUrl) {
    session = loadSession(sessionIdFromUrl);
  }
  
  if (!session) {
    session = loadSessionFromLocalStorage();
  }
  
  if (!session) {
    session = createNewSession();
  }
  
  return session;
}; 