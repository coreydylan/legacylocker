import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import setWith from 'lodash/setWith';
import cloneDeep from 'lodash/cloneDeep';
import { format, parseISO, getMonth, isValid, getYear, addMonths, subDays } from 'date-fns';
import truncate from 'lodash/truncate';

// Interface for month-specific signature customizations
export interface SignatureMonthCustomization {
  month: string; // e.g., 'January'
  shipDate: string; // ISO string (YYYY-MM-DD)
  footerMessage: string;
  enabled: boolean;
  occasions?: (string | 'birthday' | 'anniversary' | 'other')[]; // Allow general strings for holidays
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
  shipDate?: string | null; // Add optional shipDate (ISO string YYYY-MM-DD)
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

// Define the structure for Concierge contact details
interface ConciergeContact {
  method: 'email' | 'phone';
  phoneNumber?: string;
  availability?: string;
}

// Update ConciergeEditionData interface
export interface ConciergeEditionData {
  openEndedStory?: string;         // The main text input
  preferredContact?: ConciergeContact; // Nested object for contact info
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
  isCurrentStepValid: boolean; // <<< Add validation state
  submitTriggerCount: number; // <<< Add submit trigger state
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
  updateValidationStatus: (isValid: boolean) => void; // <<< Add validation action
  triggerSubmit: () => void; // <<< Add submit trigger action
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
    shipDate: undefined,
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
      isCurrentStepValid: false, // <<< Initialize validation state
      submitTriggerCount: 0, // <<< Initialize trigger state
  
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
          return { session: updatedSession, sessionMetadata: updatedMetadata, isCurrentStepValid: false };
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
          return { session: updatedSession, sessionMetadata: updatedMetadata, isCurrentStepValid: false };
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
          return { session: updatedSession, sessionMetadata: updatedMetadata, isCurrentStepValid: true };
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
        set({ session: newSession, sessionMetadata: initialMetadata, isLoading: false, isHydrated: true, isCurrentStepValid: false });
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

      initializeSignatureData: async () => {
        console.log("[\'initializeSignatureData\']: Running...");
        const CALENDARIFIC_API_KEY = '97c7s5VRboUw0XCPNq4mKkdKwOdJ0klU';
        const CALENDARIFIC_COUNTRY = 'US';
        const currentYear = getYear(new Date());
        let holidaysFromApi: any[] = [];

        // Update Event type definition for occasion
        type Event = {
            occasion: string | 'birthday' | 'anniversary'; // Allow general strings
            recipient: string;
            date: string; // ISO Format YYYY-MM-DD
            holidayName?: string; // Still useful internally
        };

        try {
          console.log(`[\'initializeSignatureData\']: Fetching holidays for ${CALENDARIFIC_COUNTRY}, year ${currentYear}...`);
          const response = await fetch(`https://calendarific.com/api/v2/holidays?api_key=${CALENDARIFIC_API_KEY}&country=${CALENDARIFIC_COUNTRY}&year=${currentYear}`);
          if (!response.ok) throw new Error(`Calendarific API error: ${response.status}`);
          const data = await response.json();
          holidaysFromApi = data.response?.holidays || [];
          console.log(`[\'initializeSignatureData\']: Fetched ${holidaysFromApi.length} holidays.`);
        } catch (error) {
          console.error("[\'initializeSignatureData\']: Failed to fetch holidays:", error);
        }

        set(state => {
          if (!state.isHydrated || state.isLoading) return {};

          const { recipient, purchaser, recipientType } = state.session;
          const purchaserFirstName = purchaser.fullName?.split(' ')[0] || 'Me';
          let currentSignatureData = cloneDeep(state.session.signatureData);

          if (!currentSignatureData || currentSignatureData.length !== 12) {
             currentSignatureData = ALL_MONTHS.map(month => ({
              month, shipDate: '', footerMessage: '', enabled: false, occasions: [], recipients: [],
            }));
          }

          // --- Get the chronological month/year sequence --- 
          const chronologicalMonths = getChronologicalMonths();
          console.log("[\'initializeSignatureData\']: Chronological Months Sequence:", chronologicalMonths);

          const relationshipHolidayMap: { [key: string]: { recipientLabel: string; holidayNames: string[] }[] } = {
             'Mom': [{ recipientLabel: 'Mom', holidayNames: ["Mother's Day"] }],
             'Dad': [{ recipientLabel: 'Dad', holidayNames: ["Father's Day"] }],
             'Grandma': [{ recipientLabel: 'Grandma', holidayNames: ["Mother's Day", "Grandparents Day"] }],
             'Grandpa': [{ recipientLabel: 'Grandpa', holidayNames: ["Father's Day", "Grandparents Day"] }],
             'Parent': [{ recipientLabel: 'Parent', holidayNames: ["Mother's Day", "Father's Day"] }],
             'Grandparent': [{ recipientLabel: 'Grandparent', holidayNames: ["Mother's Day", "Father's Day", "Grandparents Day"] }],
             'Spouse': [{ recipientLabel: 'My Love', holidayNames: ["Valentine's Day"] }],
             'Partner': [{ recipientLabel: 'My Love', holidayNames: ["Valentine's Day"] }],
             'Sibling': [{ recipientLabel: 'Sibling', holidayNames: ["National Siblings Day"] }],
          };
          const relevantHolidays: Event[] = [];
          const relationship = recipient?.relationship;
          if (relationship && relationshipHolidayMap[relationship] && holidaysFromApi.length > 0) {
              relationshipHolidayMap[relationship].forEach(mapping => {
                  mapping.holidayNames.forEach(holidayName => {
                      const apiHoliday = holidaysFromApi.find(h => h.name === holidayName);
                      if (apiHoliday?.date?.iso) {
                          relevantHolidays.push({ occasion: holidayName, recipient: mapping.recipientLabel, date: apiHoliday.date.iso, holidayName: holidayName });
                      }
                  });
              });
          }

          const hasPersonalDates = recipient.birthday || recipient.anniversary || recipient.recipient1Birthday || recipient.recipient2Birthday;
          if (!recipientType || (!hasPersonalDates && relevantHolidays.length === 0)) {
            console.log("[\'initializeSignatureData\']: Skipping prefill.");
            return {};
          }

          const eventsByMonth = new Map<string, Event[]>();
          let coupleRecipientName = '';
          let individualRecipientName = '';
          const recipientNames: { [key: string]: string } = {};
           if (recipientType === 'myself') {
              const name = purchaser.fullName?.split(' ')[0] || 'You';
              individualRecipientName = name;
              if(recipient.birthday) recipientNames[recipient.birthday] = name;
           } else if (recipientType === 'individual' && recipient.firstName) {
             individualRecipientName = recipient.firstName;
              if(recipient.birthday) recipientNames[recipient.birthday] = recipient.firstName;
           } else if (recipientType === 'couple') {
             const r1 = recipient.recipient1FirstName; const r2 = recipient.recipient2FirstName;
             if (r1 && r2) coupleRecipientName = `${r1} & ${r2}`;
             else if (r1) coupleRecipientName = r1; else if (r2) coupleRecipientName = r2;
             if(r1 && recipient.recipient1Birthday) recipientNames[recipient.recipient1Birthday] = r1;
             if(r2 && recipient.recipient2Birthday) recipientNames[recipient.recipient2Birthday] = r2;
           }

          const potentialPersonalEvents: { date?: string; occasion: 'birthday' | 'anniversary'; }[] = [];
          if (recipientType === 'individual' || recipientType === 'myself') {
              if (recipient.birthday) potentialPersonalEvents.push({ date: recipient.birthday, occasion: 'birthday' });
          } else if (recipientType === 'couple') {
              if (recipient.recipient1Birthday) potentialPersonalEvents.push({ date: recipient.recipient1Birthday, occasion: 'birthday' });
              if (recipient.recipient2Birthday) potentialPersonalEvents.push({ date: recipient.recipient2Birthday, occasion: 'birthday' });
              if (recipient.anniversary) potentialPersonalEvents.push({ date: recipient.anniversary, occasion: 'anniversary' });
          }

          potentialPersonalEvents.forEach(({ date, occasion }) => {
            if (date) {
              const monthName = getMonthNameFromDate(date);
              const recipientName = occasion === 'anniversary' ? (coupleRecipientName || 'You') : (recipientNames[date] || individualRecipientName || 'Recipient');
              if (monthName) {
                const monthEvents = eventsByMonth.get(monthName) || [];
                 try {
                    monthEvents.push({ occasion, recipient: recipientName, date: date, holidayName: undefined });
                    eventsByMonth.set(monthName, monthEvents);
                 } catch (e) { console.error(`Error processing personal event date: ${date}`, e); }
              }
            }
          });
          relevantHolidays.forEach(holiday => {
              const monthName = getMonthNameFromDate(holiday.date);
              if (monthName) {
                  const monthEvents = eventsByMonth.get(monthName) || [];
                  monthEvents.push(holiday);
                  eventsByMonth.set(monthName, monthEvents);
              }
          });

          currentSignatureData = currentSignatureData.map(monthData => {
            const monthName = monthData.month;
            const events: Event[] = eventsByMonth.get(monthName) || [];
            if (events.length === 0) return monthData;

            let newFooter = '';
            let newOccasions: (string | 'birthday' | 'anniversary' | 'other')[] = [];
            let newRecipients: string[] = [];
            let newEnabled = true;
            let newShipDate = monthData.shipDate;

            const personalEvents = events.filter((e: Event) => e.occasion === 'birthday' || e.occasion === 'anniversary');
            const holidayEvents = events.filter((e: Event) => e.occasion !== 'birthday' && e.occasion !== 'anniversary');

            if (personalEvents.length > 0 && personalEvents[0]) {
                 const firstPersonalEvent = personalEvents[0];
                 newOccasions.push(...personalEvents.map((e: Event) => e.occasion));
                 newRecipients.push(...personalEvents.map((e: Event) => e.recipient));
                 const hasBirthday = personalEvents.some((e: Event) => e.occasion === 'birthday');
                 const hasAnniversary = personalEvents.some((e: Event) => e.occasion === 'anniversary');
                 const birthdayEvent = personalEvents.find((e: Event) => e.occasion === 'birthday');
                 if (hasBirthday && hasAnniversary && birthdayEvent) {
                     newFooter = `Happy anniversary ${coupleRecipientName || 'you two'} & happy birthday ${birthdayEvent.recipient}! Love, ${purchaserFirstName}`;
                 } else if (personalEvents.length > 1) {
                      const names = personalEvents.map((e: Event) => e.recipient).join(' & ');
                      newFooter = `Happy birthday ${names}! Love, ${purchaserFirstName}`;
                  } else if (hasBirthday) {
                      newFooter = `Happy birthday ${firstPersonalEvent.recipient}! Love, ${purchaserFirstName}`;
                  } else if (hasAnniversary) {
                      newFooter = `Happy Anniversary ${coupleRecipientName || ''}! Love, ${purchaserFirstName}`;
                  }

                 if (!newShipDate && firstPersonalEvent.date) {
                      try {
                          const originalDate = parseISO(firstPersonalEvent.date);
                          const eventMonth = getMonth(originalDate); // 0-indexed
                          const eventDay = originalDate.getDate(); // Original day
                          const eventMonthName = ALL_MONTHS[eventMonth];

                          // Find the target year from the chronological sequence
                          const targetMonthInfo = chronologicalMonths.find(m => m.month === eventMonthName);
                          const targetYear = targetMonthInfo ? targetMonthInfo.year : getYear(new Date()); // Fallback to current year

                          // Construct the date with the correct year
                          const targetDate = new Date(targetYear, eventMonth, eventDay);
                          newShipDate = format(targetDate, 'yyyy-MM-dd');
                           console.log(`[\'initializeSignatureData\']: Calculated target ship date for ${firstPersonalEvent.occasion} (${eventMonthName} ${eventDay}): ${newShipDate}`);
                      } catch(e) { console.error("Error calculating target personal ship date:", e); }
                 }

            } else if (holidayEvents.length > 0 && holidayEvents[0]) {
                 const firstHoliday = holidayEvents[0];
                 newOccasions.push(firstHoliday.occasion);
                 newRecipients.push(...holidayEvents.map((e: Event) => e.recipient).filter((v, i, a) => a.indexOf(v) === i));
                 newFooter = `Happy ${firstHoliday.occasion}! Love, ${purchaserFirstName}`;

                 if (!newShipDate && firstHoliday.date) {
                     try {
                         // Date from API is already YYYY-MM-DD
                         newShipDate = firstHoliday.date;
                     } catch(e) { console.error("Error setting holiday ship date:", e); }
                 }
            }

            if (personalEvents.length > 0 && holidayEvents.length > 0) {
                 holidayEvents.forEach((hEvent: Event) => {
                     if (!newOccasions.includes(hEvent.occasion)) newOccasions.push(hEvent.occasion);
                     if (!newRecipients.includes(hEvent.recipient)) newRecipients.push(hEvent.recipient);
                 });
            }

            newFooter = truncate(newFooter.trim(), { length: 80, omission: '...' });

            if (newEnabled && !newShipDate) {
                  // Find target year for this specific month in the sequence
                  const targetMonthInfo = chronologicalMonths.find(m => m.month === monthName);
                  const targetYear = targetMonthInfo ? targetMonthInfo.year : getYear(new Date());
                  const monthNumber = ALL_MONTHS.indexOf(monthName);
                  try {
                      newShipDate = format(new Date(targetYear, monthNumber, 1), 'yyyy-MM-dd');
                      console.log(`[\'initializeSignatureData\']: Setting fallback ship date for ${monthName}: ${newShipDate}`);
                  } catch (e) { console.error("Error calculating default ship date:", e); newShipDate = '';}
              }

            return {
              ...monthData,
              enabled: newEnabled,
              occasions: newOccasions.length > 0 ? newOccasions : monthData.occasions,
              recipients: newRecipients.length > 0 ? newRecipients : monthData.recipients,
              footerMessage: newFooter || monthData.footerMessage,
              shipDate: newShipDate || '',
            };
          });

           console.log("[\'initializeSignatureData\']: Final signatureData:", currentSignatureData);
           return { session: { ...state.session, signatureData: currentSignatureData, updatedAt: new Date().toISOString() } };

        });
      },

      updateSignatureMonth: (month: string, data: Partial<SignatureMonthCustomization>) => {
         if (data.footerMessage && typeof data.footerMessage === 'string') {
             const omission = data.footerMessage.length > 80 ? '...' : '';
             data.footerMessage = truncate(data.footerMessage, { length: 80, omission });
         }
        set(state => {
          const updatedSignatureData = state.session.signatureData.map(monthData => {
            if (monthData.month === month) {
              const mergedData = {
                ...monthData,
                ...data,
                occasions: data.occasions ?? monthData.occasions,
                recipients: data.recipients ?? monthData.recipients,
              };
              return mergedData;
            }
            return monthData;
          });
          const updatedSession = { ...state.session, signatureData: updatedSignatureData, updatedAt: new Date().toISOString() };
          return { session: updatedSession, isCurrentStepValid: false };
        });
      },

      updateCustomMonth: (month: string, year: number, data: Partial<CustomMonthData>) => {
          if (data.footerMessage && typeof data.footerMessage === 'string') {
              data.footerMessage = truncate(data.footerMessage, { length: 80, omission: '' });
          }
          set(state => {
              const updatedCustomData = state.session.customData.map(monthData => {
                  if (monthData.month === month && monthData.year === year) {
                      return { ...monthData, ...data };
                  }
                  return monthData;
              });
              const finalCustomData = updatedCustomData.length === 12 ? updatedCustomData : getChronologicalMonths().map(m => ({ ...state.session.customData.find(cd => cd.month === m.month && cd.year === m.year)!, ...({month: m.month, year: m.year}) }));

              return {
                  session: {
                      ...state.session,
                      customData: finalCustomData,
                      updatedAt: new Date().toISOString(),
                  },
                  isCurrentStepValid: false // <<< Reset validation status on data change
              };
          });
      },

      updateValidationStatus: (isValid: boolean) => {
        console.log(`Setting validation status to: ${isValid}`);
        set({ isCurrentStepValid: isValid });
      },

      triggerSubmit: () => {
        console.log('[StoreAction] triggerSubmit called');
        set(state => ({ submitTriggerCount: state.submitTriggerCount + 1 }));
      },

      startSession: (editionType: EditionType) => {
          const newId = uuidv4();
          set((state) => ({
              sessionMetadata: {
                  ...state.sessionMetadata,
                  sessionId: newId,
                  isActive: true,
                  editionType,
                  lastSaved: new Date(),
              },
              session: {
                  ...state.session,
                  selectedEdition: state.session.selectedEdition ? {
                      ...state.session.selectedEdition,
                      type: editionType,
                  } : null,
              },
              isCurrentStepValid: false // <<< Reset validation on start
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
              isCurrentStepValid: false // <<< Reset validation on end
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
          sessionMetadata: state.sessionMetadata,
          submitTriggerCount: state.submitTriggerCount
        }),
      onRehydrateStorage: () => (state, error) => {
        let hydrationComplete = false;
        let initialValidationStatus = false; // <<< Default validation status post-hydration
        if (error) {
          console.error("Hydration error:", error);
          if (state) {
             state.session = createNewSession();
             state.sessionMetadata = { sessionId: null, isActive: false, editionType: null, lastSaved: null };
          } else {
             console.error("State is undefined during hydration error handling.");
          }
        } else if (state) {
            console.log("Hydration successful.");
           if (isValidSession(state.session)) {
               console.log("Rehydrated session is valid.");
               state.sessionMetadata = {
                   ...state.sessionMetadata,
                   sessionId: state.session.sessionId,
                   isActive: true,
                   editionType: state.session.selectedEdition?.type || null,
                };
           } else {
               console.warn("Rehydrated session is invalid or expired. Resetting.");
               state.session = createNewSession();
               state.sessionMetadata = { sessionId: null, isActive: false, editionType: null, lastSaved: null };
           }
           hydrationComplete = true;
        }

        return (finalState, finalError) => {
          if (finalState) {
             finalState.isLoading = false;
             finalState.isHydrated = hydrationComplete;
             finalState.isCurrentStepValid = initialValidationStatus; 
             // Do not reset submitTriggerCount on rehydrate, let it persist
             if (hydrationComplete && !finalError) {
                console.log("Post-hydration: Initializing signature data...");
                Promise.resolve().then(() => finalState.initializeSignatureData());
             } else {
                console.log("Post-hydration: Skipping signature data initialization due to error or incomplete hydration.");
             }
          }
        };
      },
    }
  )
);

// Export the function (if needed elsewhere, but it's internal to the store action)
// export { initializeSignatureData }; 