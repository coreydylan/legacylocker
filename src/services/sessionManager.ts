import { v4 as uuidv4 } from 'uuid';
import set from 'lodash.set';
import get from 'lodash.get';

// Define the SessionData interface
export interface SessionData {
  sessionId: string;
  email?: string;
  edition?: string;
  recipientType?: 'myself' | 'individual' | 'couple';
  cards: {
    [month: string]: {
      title?: string;
      story?: string;
      imageType?: string;
      personalMessage?: string;
      celebration?: string;
      customDate?: string;
      imageUrl?: string;
    }
  };
  createdAt: string;
  updatedAt: string;
}

// Storage keys
const SESSION_STORAGE_KEY = 'legacy_locker_session';

/**
 * Creates a new session with default values
 */
export function createNewSession(): SessionData {
  const now = new Date().toISOString();
  const months = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];
  
  // Initialize empty cards for all months
  const cards = months.reduce((acc, month) => {
    acc[month] = {};
    return acc;
  }, {} as SessionData['cards']);
  
  const session: SessionData = {
    sessionId: uuidv4(),
    cards,
    createdAt: now,
    updatedAt: now
  };
  
  // Save to localStorage
  saveSession(session);
  
  return session;
}

/**
 * Loads a session from localStorage by ID
 */
export function loadSession(sessionId?: string): SessionData | null {
  try {
    // If no sessionId is provided, try to load the most recent session
    if (!sessionId) {
      const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    }
    
    // Otherwise, try to find the session with the specified ID
    // This would involve querying Supabase in the future
    const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
    const parsedData = sessionData ? JSON.parse(sessionData) : null;
    
    if (parsedData && parsedData.sessionId === sessionId) {
      return parsedData;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
}

/**
 * Saves a session to localStorage
 */
export function saveSession(sessionData: SessionData): void {
  try {
    // Update the timestamp
    sessionData.updatedAt = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

/**
 * Updates a specific field in the session data
 */
export function updateField(path: string, value: any): SessionData | null {
  const session = loadSession();
  if (!session) return null;
  
  // Update the field using lodash.set for nested path support
  set(session, path, value);
  
  // Save the updated session
  saveSession(session);
  
  return session;
}

// ============= Supabase Function Stubs =============

/**
 * Creates a new session in Supabase
 * Note: This is a stub that will be implemented later
 */
export async function createSessionInSupabase(sessionData: SessionData): Promise<SessionData | null> {
  // This will be implemented when Supabase is integrated
  console.log('Creating session in Supabase:', sessionData);
  return sessionData;
}

/**
 * Updates a session in Supabase
 * Note: This is a stub that will be implemented later
 */
export async function updateSessionInSupabase(sessionId: string, updates: Partial<SessionData>): Promise<SessionData | null> {
  // This will be implemented when Supabase is integrated
  console.log(`Updating session ${sessionId} in Supabase:`, updates);
  return null;
}

/**
 * Gets a session from Supabase
 * Note: This is a stub that will be implemented later
 */
export async function getSessionFromSupabase(sessionId: string): Promise<SessionData | null> {
  // This will be implemented when Supabase is integrated
  console.log(`Getting session ${sessionId} from Supabase`);
  return null;
}

/**
 * Sends a magic link email to resume a session
 * Note: This is a stub that will be implemented later
 */
export async function sendResumeLink(email: string, sessionId: string): Promise<boolean> {
  // This will be implemented when Supabase is integrated
  console.log(`Sending resume link for session ${sessionId} to ${email}`);
  return true;
}

// ============= Helper Functions =============

/**
 * Converts legacy FormData to SessionData
 * This helps migrating existing data
 */
export function convertLegacyFormData(formData: any): SessionData {
  const now = new Date().toISOString();
  const recipientType = formData.giftType || undefined;
  const edition = formData.selectedSeries?.display || undefined;
  
  // Initialize cards structure
  const months = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];
  
  // Initialize empty cards for all months
  const cards = months.reduce((acc, month) => {
    acc[month] = {};
    return acc;
  }, {} as SessionData['cards']);
  
  // Map monthly data if available (signature edition)
  if (formData.editionFlow?.monthlyData) {
    const monthsMap: Record<string, string> = {
      'January': 'jan',
      'February': 'feb',
      'March': 'mar',
      'April': 'apr',
      'May': 'may',
      'June': 'jun',
      'July': 'jul',
      'August': 'aug',
      'September': 'sep',
      'October': 'oct',
      'November': 'nov',
      'December': 'dec'
    };
    
    Object.entries(formData.editionFlow.monthlyData).forEach(([month, data]: [string, any]) => {
      const shortMonth = monthsMap[month];
      if (shortMonth && data) {
        cards[shortMonth] = {
          personalMessage: data.personalMessage,
          celebration: data.celebration,
          customDate: data.customDate ? new Date(data.customDate).toISOString() : undefined
        };
      }
    });
  }
  
  return {
    sessionId: uuidv4(),
    email: formData.purchaser?.email,
    edition,
    recipientType,
    cards,
    createdAt: now,
    updatedAt: now
  };
} 