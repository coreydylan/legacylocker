import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import setWith from 'lodash/setWith';
import cloneDeep from 'lodash/cloneDeep';
import { format, parseISO, getMonth, isValid, getYear, addMonths } from 'date-fns';
import truncate from 'lodash/truncate';

// Interface for month-specific signature customizations
export interface SignatureMonthCustomization {
  month: string; // e.g., 'January'
  shipDate: string; // ISO string, defaults to 1st of the month
  footerMessage: string;
  enabled: boolean;
  occasions?: ('birthday' | 'anniversary' | 'other')[];
  recipients?: string[]; // Name(s) of the recipient(s)
}

// Interface for Custom Edition month-specific data
export interface CustomMonthData {
  month: string; // e.g., 'January' (matches ALL_MONTHS)
  year: number; // The specific year for this card instance
  // Story Tab
  title: string;
  useExactTitle: boolean;
  story: string;
  useExactStory: boolean;
  // Artwork Tab
  artworkOption: 'from-story' | 'use-photo' | 'from-photo' | null; // null = not selected
  photoUrl?: string; // URL if photo uploaded
  // Footer Tab
  footerEnabled: boolean;
  footerMessage: string;
}

export interface SessionData {
  sessionId: string;
  email?: string;
  recipientType: 'myself' | 'individual' | 'couple' | null;
  selectedEdition: {
    id: string;
    label: string;
    description: string;
    type: 'signature' | 'custom' | 'concierge';
    isHighlighted?: boolean;
  } | null;
  purchaser: {
    fullName: string;
    email: string;
    phone: string;
  };
  recipient: {
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
    recipient1Birthday?: string;
    recipient2Birthday?: string;
    anniversary?: string;
    shippingAddress?: ShippingAddress;
    cardAddresseeName?: string;
    shippingName?: string;
    shippingNameOverridden?: boolean;
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
  editionFlow: {
    type: EditionType | null;
    monthlyData?: Record<string, MonthlyCardData>;
    currentMonth?: string;
    customEditionData?: CustomEditionData;
    conciergeData?: ConciergeEditionData;
  };
  selectedSeries: string;
  shipping: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  envelopePersonalization: {
    addresseeName: string;
    returnAddress: string;
  };
  signatureDetails: {
    signature: string;
    title: string;
  };
  monthlyCards: Record<string, MonthlyCardData>;
  signatureData: SignatureMonthCustomization[];
  customData: CustomMonthData[]; // Added customData
}

export interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  full?: string;
}

export interface MonthlyCardData {
  personalMessage: string;
  celebration: string;
  customDate: string;
  useExactText: boolean;
  useExactTitle: boolean;
  artworkOption: 'from-story' | 'use-photo' | 'from-photo';
  photoUrl: string;
  title: string;
}

export interface CustomEditionData {
  // ... fields ...
}

export interface ConciergeEditionData {
  // ... fields ...
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

// Add type safety for edition types
export type EditionType = 'signature' | 'custom' | 'concierge';

// Update SessionMetadata to use EditionType
interface SessionMetadata {
  sessionId: string | null;
  isActive: boolean;
  editionType: EditionType | null;
  lastSaved: Date | null;
}

interface SessionStore {
  session: SessionData;
  sessionMetadata: SessionMetadata; // Added sessionMetadata state
  isLoading: boolean;
  isHydrated: boolean;
  initialize: () => void;
  updateSession: (path: string, value: any) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setLastCompletedStep: (step: number) => void;
  saveSessionProgress: (email?: string) => void;
  resetSession: () => void;
  submitSession: () => Promise<boolean>;
  initializeSignatureData: () => void;
  updateSignatureMonth: (month: string, data: Partial<SignatureMonthCustomization>) => void;
  updateCustomMonth: (month: string, year: number, data: Partial<CustomMonthData>) => void;
  // Added sessionMetadata actions
  startSession: (editionType: EditionType) => void;
  endSession: () => void;
  saveSession: () => void;
}

const ALL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper to get month name from ISO date string (0 = January)
const getMonthNameFromDate = (dateString?: string): string | null => {
  if (!dateString) return null;
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return null;
    return ALL_MONTHS[getMonth(date)];
  } catch (error) {
    console.error('Error parsing date for month name:', dateString, error);
    return null;
  }
};

// Helper to get next 12 months with year (reusable)
const getChronologicalMonths = (): { month: string; year: number }[] => {
  const now = new Date();
  const chronologicalMonths: { month: string; year: number }[] = [];
  for (let i = 1; i <= 12; i++) {
    const targetDate = addMonths(now, i);
    chronologicalMonths.push({
      month: ALL_MONTHS[getMonth(targetDate)],
      year: getYear(targetDate),
    });
  }
  return chronologicalMonths;
};

// Define createNewSession *before* useSessionStore
const createNewSession = (): SessionData => {
  const now = new Date().toISOString();
  const defaultSignatureData = ALL_MONTHS.map(month => ({
    month,
    shipDate: '', 
    footerMessage: '',
    enabled: false,
    occasions: [],
    recipients: [],
  }));
  const defaultCustomData = getChronologicalMonths().map(({ month, year }) => ({
    month,
    year,
    title: '',
    useExactTitle: false,
    story: '',
    useExactStory: false,
    artworkOption: null,
    photoUrl: undefined,
    footerEnabled: false,
    footerMessage: '',
  }));

  return {
    sessionId: uuidv4(),
    email: undefined,
    recipientType: null,
    selectedEdition: null,
    purchaser: { fullName: '', email: '', phone: '' },
    recipient: { type: 'individual', includeWelcomeCard: false, welcomeMessage: '' }, // Ensure welcome fields defaults
    cards: { },
    createdAt: now,
    updatedAt: now,
    currentStep: 1,
    lastCompletedStep: 0,
    editionFlow: {
      type: null,
      monthlyData: {},
      currentMonth: '',
      customEditionData: undefined,
      conciergeData: undefined,
    },
    selectedSeries: '',
    shipping: {
      address1: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    envelopePersonalization: {
      addresseeName: '',
      returnAddress: '',
    },
    signatureDetails: {
      signature: '',
      title: '',
    },
    monthlyCards: {},
    signatureData: defaultSignatureData,
    customData: defaultCustomData, // Initialize customData
  };
};

// Define isValidSession *before* useSessionStore as it's used in onRehydrate
export const isValidSession = (session: SessionData | null | undefined): session is SessionData => {
  if (!session) return false;
  const maxSteps = 7; 
  
  // Basic checks (always required)
  if (!session.sessionId || typeof session.sessionId !== 'string') return false;
  if (typeof session.currentStep !== 'number' || session.currentStep < 1 || session.currentStep > maxSteps) return false;

  // --- Conditional Checks based on progress --- 
  
  // Only check these fields if we're past step 1
  if (session.currentStep > 1) {
    // selectedEdition should exist after step 1 (where it's chosen)
    if (!session.selectedEdition) return false;
    
    // recipientType should exist after step 1 (where it's chosen)
    if (!session.recipientType) return false;
  }
  
  // Only check purchaser info if we're past step 2
  if (session.currentStep > 2) {
    if (!session.purchaser || !session.purchaser.fullName || !session.purchaser.email) return false;
  }

  // Only check recipient info if we're past step 3
  if (session.currentStep > 3) {
    if (!session.recipient) return false;
    // Check for either individual or couple recipient data
    const hasIndividualData = session.recipient.firstName;
    const hasCoupleData = session.recipient.recipient1FirstName;
    if (!hasIndividualData && !hasCoupleData) return false;
  }

  // Check updatedAt timestamp validity (if present)
  if (session.updatedAt) {
    try {
      const lastUpdated = new Date(session.updatedAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      if (lastUpdated < sevenDaysAgo) return false;
    } catch (e) { return false; }
  }

  // Passed all relevant checks for the current step
  return true;
};

// Now create the store
export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
  session: createNewSession(),
  sessionMetadata: {
    sessionId: null,
    isActive: false,
    editionType: null,
    lastSaved: null,
  },
  isLoading: true,
      isHydrated: false,
  
  initialize: () => {
        // This function is called by the consuming component (e.g., _app.tsx or layout)
        // after the store is potentially hydrated.
        if (get().isHydrated) {
          set({ isLoading: false });
          // Call initialization logic if hydrated
          get().initializeSignatureData();
        } else {
          // Still waiting for hydration
    set({ isLoading: true });
          // The onRehydrateStorage logic will eventually set isHydrated and call initializeSignatureData
        }
      },
      
  updateSession: (path: string, value: any) => {
        set(state => {
          const updatedSession = cloneDeep(state.session);
          setWith(updatedSession, path, value, cloneDeep);
          updatedSession.updatedAt = new Date().toISOString();
          // Also update metadata lastSaved when session is updated
          const updatedMetadata = { ...state.sessionMetadata, lastSaved: new Date() };
          return { session: updatedSession, sessionMetadata: updatedMetadata };
        });
      },
  setCurrentStep: (step: number) => {
        set(state => {
    const updatedSession = {
            ...state.session,
      currentStep: step,
            lastCompletedStep: Math.max(state.session.lastCompletedStep, step - 1),
            updatedAt: new Date().toISOString(),
    };
          const updatedMetadata = { ...state.sessionMetadata, lastSaved: new Date() };
          return { session: updatedSession, sessionMetadata: updatedMetadata };
        });
  },
  nextStep: () => {
        set(state => {
          const nextStep = state.session.currentStep + 1;
    const updatedSession = {
            ...state.session,
      currentStep: nextStep,
            lastCompletedStep: Math.max(state.session.lastCompletedStep, state.session.currentStep),
            updatedAt: new Date().toISOString(),
    };
          const updatedMetadata = { ...state.sessionMetadata, lastSaved: new Date() };
          return { session: updatedSession, sessionMetadata: updatedMetadata };
        });
  },
  prevStep: () => {
        set(state => {
          const prevStep = Math.max(1, state.session.currentStep - 1);
    const updatedSession = {
            ...state.session,
      currentStep: prevStep,
            updatedAt: new Date().toISOString(),
    };
          const updatedMetadata = { ...state.sessionMetadata, lastSaved: new Date() };
          return { session: updatedSession, sessionMetadata: updatedMetadata };
        });
  },
  setLastCompletedStep: (step: number) => {
        set(state => {
    const updatedSession = {
            ...state.session,
            lastCompletedStep: Math.max(state.session.lastCompletedStep, step),
            updatedAt: new Date().toISOString(),
    };
          const updatedMetadata = { ...state.sessionMetadata, lastSaved: new Date() };
          return { session: updatedSession, sessionMetadata: updatedMetadata };
        });
  },
  saveSessionProgress: (email?: string) => {
        set(state => {
    const updatedSession = {
            ...state.session,
            email: email ?? state.session.email,
            updatedAt: new Date().toISOString(),
    };
          const updatedMetadata = { ...state.sessionMetadata, lastSaved: new Date() };
          return { session: updatedSession, sessionMetadata: updatedMetadata };
        });
  },
  resetSession: () => {
        console.log("Resetting session state (persist middleware will handle storage)...");
        const newSession = createNewSession(); // Use helper
        // Reset metadata as well
        const initialMetadata = { sessionId: null, isActive: false, editionType: null, lastSaved: null };
        set({ session: newSession, sessionMetadata: initialMetadata, isLoading: false, isHydrated: true });
        // Let persist handle clearing/overwriting storage based on new state
        // localStorage.removeItem('legacyLockerSession'); // Usually not needed with persist
      },
  submitSession: async (): Promise<boolean> => {
    const { session } = get();
    console.log("Submitting session:", session);
        const success = true; 
    if (success) {
      console.log("Session submitted successfully!");
    } else {
      console.error("Session submission failed.");
    }
    return success;
  },

      initializeSignatureData: () => {
        console.log("['initializeSignatureData']: Running...");
        set(state => {
          if (!state.isHydrated || state.isLoading) {
             console.log("['initializeSignatureData']: Skipping (not hydrated or loading).");
             return {};
          }

          const { recipient, purchaser, recipientType } = state.session;
          console.log("['initializeSignatureData']: Recipient Data:", recipient);
          console.log("['initializeSignatureData']: Purchaser Data:", purchaser);
          console.log("['initializeSignatureData']: Recipient Type:", recipientType);
          
          let currentSignatureData = cloneDeep(state.session.signatureData);

          // Ensure structure
          if (!currentSignatureData || currentSignatureData.length !== 12) {
             console.log("['initializeSignatureData']: Resetting signatureData structure (length was not 12).");
             currentSignatureData = ALL_MONTHS.map(month => ({
              month,
              shipDate: '',
              footerMessage: '',
              enabled: false,
              occasions: [],
              recipients: [],
            }));
          }

          const hasRecipientData = recipientType && (recipient.firstName || recipient.recipient1FirstName || recipient.birthday || recipient.anniversary || recipient.recipient1Birthday || recipient.recipient2Birthday);
          console.log("['initializeSignatureData']: Has Recipient Data?", hasRecipientData);

          if (hasRecipientData) {
            // Define a structure for events
            type Event = { occasion: 'birthday' | 'anniversary'; recipient: string; date: string };
            const eventsByMonth = new Map<string, Event[]>();

            // --- Determine recipient names --- 
            let coupleRecipientName = ''; // For anniversary
            let individualRecipientName = ''; // For single recipient birthday
            const recipientNames: { [key: string]: string } = {}; // Map birthday date to specific recipient name

            if (recipientType === 'myself') {
              const name = purchaser.fullName?.split(' ')[0] || 'You';
              individualRecipientName = name;
              if(recipient.birthday) recipientNames[recipient.birthday] = name;
            } else if (recipientType === 'individual' && recipient.firstName) {
              individualRecipientName = recipient.firstName;
               if(recipient.birthday) recipientNames[recipient.birthday] = recipient.firstName;
            } else if (recipientType === 'couple') {
              const r1 = recipient.recipient1FirstName;
              const r2 = recipient.recipient2FirstName;
              if (r1 && r2) coupleRecipientName = `${r1} and ${r2}`;
              else if (r1) coupleRecipientName = r1;
              else if (r2) coupleRecipientName = r2;
              
              if(r1 && recipient.recipient1Birthday) recipientNames[recipient.recipient1Birthday] = r1;
              if(r2 && recipient.recipient2Birthday) recipientNames[recipient.recipient2Birthday] = r2;
            }
            const purchaserFirstName = purchaser.fullName?.split(' ')[0] || 'Me';

            // --- Gather all potential events --- 
            const potentialEvents: { date?: string; occasion: 'birthday' | 'anniversary'; }[] = [];
            if (recipientType === 'individual') {
                potentialEvents.push({ date: recipient.birthday, occasion: 'birthday' });
            } else if (recipientType === 'couple') {
                potentialEvents.push({ date: recipient.recipient1Birthday, occasion: 'birthday' });
                potentialEvents.push({ date: recipient.recipient2Birthday, occasion: 'birthday' });
                potentialEvents.push({ date: recipient.anniversary, occasion: 'anniversary' });
            } else if (recipientType === 'myself') {
                potentialEvents.push({ date: recipient.birthday, occasion: 'birthday' });
            }

            // --- Group valid events by month --- 
            potentialEvents.forEach(({ date, occasion }) => {
              if (date) {
                const monthName = getMonthNameFromDate(date);
                const recipientName = occasion === 'anniversary' 
                    ? (coupleRecipientName || 'You') 
                    : (recipientNames[date] || individualRecipientName || 'Recipient');
                
                if (monthName) {
                  const monthEvents = eventsByMonth.get(monthName) || [];
                  monthEvents.push({ occasion, recipient: recipientName, date });
                  eventsByMonth.set(monthName, monthEvents);
                }
              }
            });
            console.log("['initializeSignatureData']: Grouped Events:", eventsByMonth);

            // --- Apply events to signatureData --- 
            currentSignatureData = currentSignatureData.map(monthData => {
              const monthName = monthData.month;
              const events = eventsByMonth.get(monthName);
              let newFooter = '';
              let newOccasions: ('birthday' | 'anniversary')[] = [];
              let newRecipients: string[] = [];
              let newEnabled = false;
              let newShipDate = monthData.shipDate; // Keep existing if manually set

              if (events && events.length > 0) {
                newEnabled = true;
                const hasBirthday = events.some(e => e.occasion === 'birthday');
                const hasAnniversary = events.some(e => e.occasion === 'anniversary');
                const birthdayEvent = events.find(e => e.occasion === 'birthday');

                if (hasBirthday && hasAnniversary && birthdayEvent) {
                  // Specific Anniversary + Birthday case
                  newOccasions = ['anniversary', 'birthday'];
                  newRecipients = [coupleRecipientName || 'You', birthdayEvent.recipient]; // Order might matter for display
                  newFooter = `Happy anniversary to you both — and a very happy birthday to ${birthdayEvent.recipient}! Love, ${purchaserFirstName}`;
                  if (!newShipDate) newShipDate = format(parseISO(events[0].date), 'yyyy-MM-dd'); // Default to first event date
                
                } else if (events.length > 1) { // Generic multiple events (e.g., two birthdays)
                   newOccasions = events.map(e => e.occasion);
                   newRecipients = events.map(e => e.recipient);
                   // Simple combined footer for other multi-event cases
                   const occasionText = newOccasions.join(' & ');
                   newFooter = `Happy ${occasionText}! Love, ${purchaserFirstName}`;
                   if (!newShipDate) newShipDate = format(parseISO(events[0].date), 'yyyy-MM-dd');
                   
                } else { // Single event
                  const event = events[0];
                  newOccasions = [event.occasion];
                  newRecipients = [event.recipient];
                  if (event.occasion === 'birthday') {
                    newFooter = `Happy birthday ${event.recipient}! Love, ${purchaserFirstName}`;
                  } else if (event.occasion === 'anniversary') {
                    newFooter = `Happy Anniversary! Love, ${purchaserFirstName}`;
                  }
                   if (!newShipDate) newShipDate = format(parseISO(event.date), 'yyyy-MM-dd');
                }

                // Apply 80 char limit to generated footers
                newFooter = truncate(newFooter, { length: 80, omission: '...' });

              } else {
                 // No events this month, ensure it's reset (unless manually enabled later)
                 newEnabled = monthData.enabled; // Keep manual toggle state?
                 newFooter = monthData.footerMessage; // Keep manual footer?
                 // If we reset, keep shipDate only if manually enabled?
                 newShipDate = monthData.enabled ? monthData.shipDate : ''; 
              }
              
              // Set default ship date (1st of month) only if enabled (by event or manually) and still not set
               if (newEnabled && !newShipDate) {
                    console.log(`['initializeSignatureData']: Setting default ship date (1st) for ${monthName}`);
                    const currentYear = getYear(new Date()); // Use current year as base
                    const monthNumber = ALL_MONTHS.indexOf(monthName);
                    // Figure out the actual year for this month in the sequence
                    // TODO: This logic needs refinement if sequence spans multiple years significantly
                    const occurrenceYear = (getMonth(new Date()) + 1 + ALL_MONTHS.indexOf(monthName)) >= 12 ? currentYear + 1 : currentYear;
                    const defaultDate = new Date(occurrenceYear, monthNumber, 1);
                    newShipDate = format(defaultDate, 'yyyy-MM-dd');
                }

              return {
                ...monthData,
                enabled: newEnabled,
                occasions: newOccasions,
                recipients: newRecipients,
                footerMessage: newFooter,
                shipDate: newShipDate,
              };
            });
            
            console.log("['initializeSignatureData']: Final signatureData (before update):", currentSignatureData);
            return { session: { ...state.session, signatureData: currentSignatureData, updatedAt: new Date().toISOString() } };
          } else {
             console.log("['initializeSignatureData']: Skipping prefill logic (no recipient data).");
             return {};
          }
        });
      },

      updateSignatureMonth: (month: string, data: Partial<SignatureMonthCustomization>) => {
         // Apply 80 char limit if footer message is being updated
         if (data.footerMessage && typeof data.footerMessage === 'string') {
             data.footerMessage = truncate(data.footerMessage, { length: 80, omission: '' }); // Truncate without ellipsis for user input
         }
        set(state => {
          const updatedSignatureData = state.session.signatureData.map(monthData => {
            if (monthData.month === month) {
              // Note: Simple spread merge might not be ideal if merging arrays like occasions/recipients
              // but okay for updating footer/shipDate/enabled
              return { ...monthData, ...data }; 
            }
            return monthData;
          });
          return { session: { ...state.session, signatureData: updatedSignatureData, updatedAt: new Date().toISOString() } };
        });
      },

      // Action to update a specific month's custom data
      updateCustomMonth: (month: string, year: number, data: Partial<CustomMonthData>) => {
          // Apply 80 char limit if footer message is being updated
          if (data.footerMessage && typeof data.footerMessage === 'string') {
              data.footerMessage = truncate(data.footerMessage, { length: 80, omission: '' });
          }
          set(state => {
              const updatedCustomData = state.session.customData.map(monthData => {
                  // Match based on both month and year for custom data
                  if (monthData.month === month && monthData.year === year) {
                      return { ...monthData, ...data };
                  }
                  return monthData;
              });
              // Ensure customData always has 12 entries if somehow corrupted
              const finalCustomData = updatedCustomData.length === 12 ? updatedCustomData : getChronologicalMonths().map(m => ({ ...state.session.customData.find(cd => cd.month === m.month && cd.year === m.year)!, ...({month: m.month, year: m.year}) }));

              return {
                  session: {
                      ...state.session,
                      customData: finalCustomData,
                      updatedAt: new Date().toISOString(),
                  }
              };
          });
      },

      // --- Actions for sessionMetadata --- 
      startSession: (editionType: EditionType) => {
          const newId = uuidv4(); // Use uuidv4 instead of crypto.randomUUID
          set((state) => ({
              sessionMetadata: {
                  ...state.sessionMetadata,
                  sessionId: newId,
                  isActive: true,
                  editionType,
                  lastSaved: new Date(),
              },
              // Also update the session's selectedEdition type to match
              session: {
                  ...state.session,
                  selectedEdition: state.session.selectedEdition ? {
                      ...state.session.selectedEdition,
                      type: editionType,
                  } : null,
              }
          }));
      },
      endSession: () => {
          set((state) => ({
              sessionMetadata: {
                  sessionId: null,
                  isActive: false,
                  editionType: null,
                  lastSaved: null,
              },
          }));
      },
      saveSession: () => {
          set((state) => ({
              sessionMetadata: {
                  ...state.sessionMetadata,
                  lastSaved: new Date(),
              },
              session: {
                  ...state.session,
                  updatedAt: new Date().toISOString(),
              }
          }));
      },

    }),
    {
      name: 'legacyLockerSession',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
          session: state.session, 
          sessionMetadata: state.sessionMetadata // Ensure metadata is persisted
        }),
      onRehydrateStorage: () => (state, error) => {
        let hydrationComplete = false;
        if (error) {
          console.error("Hydration error:", error);
          if (state) {
             // Reset both session and metadata on error
             state.session = createNewSession();
             state.sessionMetadata = { sessionId: null, isActive: false, editionType: null, lastSaved: null };
          } else {
             console.error("State unavailable during hydration error handling.");
          }
          hydrationComplete = true;
        } else {
           // Validate main session
           if (state?.session && !isValidSession(state.session)) {
              console.warn("Hydrated session is invalid. Resetting state...");
              state.session = createNewSession();
              // Reset metadata as well if main session is invalid
              state.sessionMetadata = { sessionId: null, isActive: false, editionType: null, lastSaved: null };
           }
           // Ensure metadata is initialized if somehow missing after hydration
           if (state && !state.sessionMetadata) {
              console.warn("Hydrated state missing sessionMetadata. Initializing...");
              state.sessionMetadata = { sessionId: null, isActive: false, editionType: null, lastSaved: null };
           }
           hydrationComplete = true;
        }
        if (hydrationComplete) {
          setTimeout(() => {
            // Use the state from the rehydration callback if available
            const finalState = { isLoading: false, isHydrated: true };
            useSessionStore.setState(finalState);
          }, 0);
        }
      },
    }
  )
); 