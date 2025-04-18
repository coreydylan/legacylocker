import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import setWith from 'lodash/setWith';
import cloneDeep from 'lodash/cloneDeep';
import { format, parseISO, getMonth, isValid, getYear, addMonths, subDays } from 'date-fns';
import truncate from 'lodash/truncate';
import { supabase } from './supabaseClient'; // <<< Import Supabase client

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
  storyLocked?: boolean; // <<< Add lock state for Story
  // Artwork Tab
  artworkOption: 'from-story' | 'use-photo' | 'from-photo' | null; // null = not selected
  photoUrl?: string; // URL if photo uploaded
  artworkLocked?: boolean; // <<< Add lock state for Artwork
  // Footer Tab
  enabled: boolean;
  footerMessage: string;
  shipDate: string;
  notesLocked?: boolean; // <<< Add lock state for Notes/Footer
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

// --- NEW: Interface for the result of the shared calculation logic ---
interface MonthlyEventDetail {
  month: string;
  year: number;
  calculatedShipDate: string; // "" if none applicable
  calculatedFooterMessage: string; // "" if none applicable
  calculatedEnabled: boolean; // True if either date or message was generated
  occasions: (string | 'birthday' | 'anniversary' | 'other')[]; // Keep track of all relevant occasions for the month
  recipients: string[]; // Keep track of all relevant recipients for the month
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
  saveSessionProgress: (email?: string) => Promise<void>; // <<< Modified to be async
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
  initializeCustomDataDates: () => void; // <<< Add action interface
  // Supabase actions
  saveSessionToDb: () => Promise<void>; // <<< New action
  loadSessionFromDb: (sessionId: string) => Promise<boolean>; // <<< New action (returns true on success)
  // Add setHydrated action
  setHydrated: (value: boolean) => void;
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

// --- NEW: Shared calculation logic extracted into a helper function ---
const calculateMonthlyEventDetails = async (
  recipient: SessionData['recipient'],
  purchaser: SessionData['purchaser'],
  recipientType: SessionData['recipientType'],
  chronologicalMonths: { month: string; year: number }[]
): Promise<MonthlyEventDetail[]> => {
  const LOG_PREFIX = "[calculateMonthlyEventDetails]";
  console.log(`${LOG_PREFIX}: Running calculation...`);

  if (!recipient || !purchaser || !recipientType) {
      console.log(`${LOG_PREFIX}: Missing recipient, purchaser, or recipientType. Returning empty details.`);
      return chronologicalMonths.map(cm => ({
          ...cm,
          calculatedShipDate: '',
          calculatedFooterMessage: '',
          calculatedEnabled: false,
          occasions: [],
          recipients: [],
      }));
  }

  // --- Logic largely copied from initializeSignatureData ---
  const CALENDARIFIC_API_KEY = '97c7s5VRboUw0XCPNq4mKkdKwOdJ0klU'; // Consider moving to env variables
  const CALENDARIFIC_COUNTRY = 'US';
  const currentYear = getYear(new Date()); // Fetch for current year initially
  let holidaysFromApi: any[] = [];

  type Event = {
      occasion: string | 'birthday' | 'anniversary';
      recipient: string;
      date: string; // ISO Format YYYY-MM-DD
      holidayName?: string; // For holiday identification
  };

  try {
      console.log(`${LOG_PREFIX}: Fetching holidays for ${CALENDARIFIC_COUNTRY}, year ${currentYear}...`);
      const response = await fetch(`https://calendarific.com/api/v2/holidays?api_key=${CALENDARIFIC_API_KEY}&country=${CALENDARIFIC_COUNTRY}&year=${currentYear}`);
      if (!response.ok) throw new Error(`Calendarific API error: ${response.status}`);
      const data = await response.json();
      holidaysFromApi = data.response?.holidays || [];
      console.log(`${LOG_PREFIX}: Fetched ${holidaysFromApi.length} holidays for ${currentYear}.`);
      // Fetch next year's holidays if needed
      const nextYear = currentYear + 1;
      if (chronologicalMonths.some(cm => cm.year === nextYear)) {
           console.log(`${LOG_PREFIX}: Fetching holidays for ${CALENDARIFIC_COUNTRY}, year ${nextYear}...`);
           const nextYearResponse = await fetch(`https://calendarific.com/api/v2/holidays?api_key=${CALENDARIFIC_API_KEY}&country=${CALENDARIFIC_COUNTRY}&year=${nextYear}`);
           if(nextYearResponse.ok) {
               const nextYearData = await nextYearResponse.json();
               const nextYearHolidays = nextYearData.response?.holidays || [];
               holidaysFromApi.push(...nextYearHolidays);
                console.log(`${LOG_PREFIX}: Added ${nextYearHolidays.length} holidays for ${nextYear}. Total: ${holidaysFromApi.length}`);
           } else {
                console.warn(`${LOG_PREFIX}: Failed to fetch holidays for ${nextYear}. Status: ${nextYearResponse.status}`);
           }
      }

  } catch (error) {
      console.error(`${LOG_PREFIX}: Failed to fetch holidays:`, error);
  }

  const purchaserFirstName = purchaser.fullName?.split(' ')[0] || 'Me';

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

  const allRelevantEvents: Event[] = [];
  const relationship = recipient?.relationship;

  // Add relevant holidays based on relationship
  if (relationship && relationshipHolidayMap[relationship] && holidaysFromApi.length > 0) {
      relationshipHolidayMap[relationship].forEach(mapping => {
          mapping.holidayNames.forEach(holidayName => {
              // Find holiday matching the name AND the year it occurs in based on chrono months
              const apiHoliday = holidaysFromApi.find(h => {
                 if (h.name !== holidayName) return false;
                 // Check if this holiday's year matches any year in our 12-month target range
                 try {
                    const holidayYear = getYear(parseISO(h.date?.iso));
                    return chronologicalMonths.some(cm => cm.year === holidayYear);
                 } catch (e) { return false; }
              });
              if (apiHoliday?.date?.iso) {
                  allRelevantEvents.push({
                      occasion: holidayName,
                      recipient: mapping.recipientLabel,
                      date: apiHoliday.date.iso, // YYYY-MM-DD format
                      holidayName: holidayName
                  });
              }
          });
      });
  }

  // Determine recipient names for personal events
  let coupleRecipientName = '';
  let individualRecipientName = '';
  const recipientNamesByDate: { [key: string]: string } = {}; // Map birthday/anniv date to name
  if (recipientType === 'myself') {
      const name = purchaser.fullName?.split(' ')[0] || 'You';
      individualRecipientName = name;
      if (recipient.birthday) recipientNamesByDate[recipient.birthday] = name;
  } else if (recipientType === 'individual' && recipient.firstName) {
      individualRecipientName = recipient.firstName;
      if (recipient.birthday) recipientNamesByDate[recipient.birthday] = recipient.firstName;
  } else if (recipientType === 'couple') {
      const r1 = recipient.recipient1FirstName;
      const r2 = recipient.recipient2FirstName;
      if (r1 && r2) coupleRecipientName = `${r1} & ${r2}`;
      else if (r1) coupleRecipientName = r1;
      else if (r2) coupleRecipientName = r2;
      if (r1 && recipient.recipient1Birthday) recipientNamesByDate[recipient.recipient1Birthday] = r1;
      if (r2 && recipient.recipient2Birthday) recipientNamesByDate[recipient.recipient2Birthday] = r2;
  }

  // Add personal events
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
          const recipientName = occasion === 'anniversary'
              ? (coupleRecipientName || 'You Two')
              : (recipientNamesByDate[date] || individualRecipientName || 'Recipient');
          allRelevantEvents.push({ occasion, recipient: recipientName, date: date, holidayName: undefined });
      }
  });

   console.log(`${LOG_PREFIX}: All relevant events identified:`, allRelevantEvents);

  // Group events by month name for easier lookup
  const eventsByMonthName = new Map<string, Event[]>();
  allRelevantEvents.forEach(event => {
      const monthName = getMonthNameFromDate(event.date);
      if (monthName) {
          const monthEvents = eventsByMonthName.get(monthName) || [];
          monthEvents.push(event);
          eventsByMonthName.set(monthName, monthEvents);
      }
  });

  // Iterate through the chronological months and calculate details for each slot
  const monthlyDetails = chronologicalMonths.map(chronoMonth => {
      const { month: currentMonthName, year: currentYear } = chronoMonth;
      const eventsThisMonthName = eventsByMonthName.get(currentMonthName) || [];
      
      const eventsThisMonthAndYear = eventsThisMonthName.filter(event => {
           if (!event.date) return false;
            try {
               const eventYear = getYear(parseISO(event.date)); 
               return eventYear === currentYear || event.occasion === 'birthday' || event.occasion === 'anniversary';
            } catch (e) {
                console.error(`${LOG_PREFIX}: Error parsing year for event date ${event.date}`);
                return false;
            }
      });

      let finalShipDate = '';
      let finalFooterMessage = '';
      let finalEnabled = false;
      let finalOccasions: (string | 'birthday' | 'anniversary' | 'other')[] = [];
      let finalRecipients: string[] = [];

      if (eventsThisMonthAndYear.length > 0) {
           console.log(`${LOG_PREFIX}: Processing ${currentMonthName} ${currentYear}. Found events for this year:`, eventsThisMonthAndYear);
           finalEnabled = true; // Enable if any events match the month/year

           const personalEventsThisMonth = eventsThisMonthAndYear.filter(e => e.occasion === 'birthday' || e.occasion === 'anniversary');
           const holidayEventsThisMonth = eventsThisMonthAndYear.filter(e => e.occasion !== 'birthday' && e.occasion !== 'anniversary');
           
           // <<< MODIFIED: Prioritize relationship holiday >>>
           let priorityHolidayEvent: Event | undefined = undefined;
           const relationshipHolidays = relationship ? (relationshipHolidayMap[relationship] || []) : [];
           const priorityHolidayNames = relationshipHolidays.flatMap(mapping => mapping.holidayNames); 
           priorityHolidayEvent = holidayEventsThisMonth.find(hEvent => priorityHolidayNames.includes(hEvent.occasion)); 

           if(priorityHolidayEvent) {
                console.log(`${LOG_PREFIX}: ${currentMonthName} ${currentYear} - Found priority holiday: ${priorityHolidayEvent.occasion}`);
           }

           finalOccasions = eventsThisMonthAndYear.map(e => e.occasion);
           finalRecipients = eventsThisMonthAndYear.map(e => e.recipient).filter((v, i, a) => a.indexOf(v) === i);

           let footerParts: string[] = [];
           let shipDateSourceEvent: Event | undefined = undefined;

           // 1. Handle Priority Holiday (sets baseline and date precedence)
           if (priorityHolidayEvent) {
                footerParts.push(`Happy ${priorityHolidayEvent.occasion}`);
                shipDateSourceEvent = priorityHolidayEvent; 
           }

           // 2. Handle Personal Events (adds to footer, sets date ONLY if no priority holiday)
           if (personalEventsThisMonth.length > 0) {
               const hasBirthday = personalEventsThisMonth.some(e => e.occasion === 'birthday');
               const hasAnniversary = personalEventsThisMonth.some(e => e.occasion === 'anniversary');
               const birthdayEvents = personalEventsThisMonth.filter(e => e.occasion === 'birthday');
               const anniversaryEvent = personalEventsThisMonth.find(e => e.occasion === 'anniversary');
               let personalFooterPart = '';
               if (hasBirthday && hasAnniversary && anniversaryEvent) {
                    const birthdayNames = birthdayEvents.map(b => b.recipient).join(' & ');
                   personalFooterPart = `Happy Anniversary ${anniversaryEvent.recipient || 'You Two'} & Happy Birthday ${birthdayNames}`;
               } else if (birthdayEvents.length > 1) { 
                   const names = birthdayEvents.map(e => e.recipient).join(' & ');
                   personalFooterPart = `Happy birthday ${names}`;
               } else if (birthdayEvents.length === 1) { 
                   personalFooterPart = `Happy birthday ${birthdayEvents[0].recipient}`;
               } else if (anniversaryEvent) { 
                   personalFooterPart = `Happy Anniversary ${anniversaryEvent.recipient || 'You Two'}`;
               }
               
               if (personalFooterPart) {
                   footerParts.push(personalFooterPart); 
               }
               
               if (!shipDateSourceEvent) { // Only use personal event date if no priority holiday
                   shipDateSourceEvent = personalEventsThisMonth[0]; 
               }
           }
           
           // 3. Handle Non-Priority Holidays (only if footer is still empty)
           if (footerParts.length === 0 && holidayEventsThisMonth.length > 0) {
               // This handles cases like Valentine's Day if no personal/priority events exist
               const nonPriorityHoliday = holidayEventsThisMonth[0]; 
               footerParts.push(`Happy ${nonPriorityHoliday.occasion}`);
               if (!shipDateSourceEvent) { // Should already be false if we are here
                  shipDateSourceEvent = nonPriorityHoliday;
               }
           }
           
           // 4. Construct Final Footer
           let generatedFooter = footerParts.join(' & '); 
           if (generatedFooter) {
               generatedFooter += `! Love, ${purchaserFirstName}`;
           }
           finalFooterMessage = truncate(generatedFooter.trim(), { length: 80, omission: '...' });

           // 5. Calculate Final Ship Date from the determined source event
           if (shipDateSourceEvent?.date) {
               try {
                   const originalEventDate = parseISO(shipDateSourceEvent.date);
                   const eventDay = originalEventDate.getDate();
                   const eventMonth = getMonth(originalEventDate); 
                   const targetDate = new Date(currentYear, eventMonth, eventDay);
                   if (isValid(targetDate)) {
                       finalShipDate = format(targetDate, 'yyyy-MM-dd');
                       console.log(`${LOG_PREFIX}: ${currentMonthName} ${currentYear} - Final Ship Date from ${shipDateSourceEvent.occasion}: ${finalShipDate}`);
                   } else { finalShipDate = ''; }
               } catch (e) { finalShipDate = ''; }
           } else {
               finalShipDate = '';
           }
           
      } else {
          // No events for this specific month/year
          finalEnabled = false;
          finalFooterMessage = '';
          finalShipDate = '';
      }

      // Return the calculated details 
      return {
          month: currentMonthName,
          year: currentYear,
          calculatedShipDate: finalShipDate,
          calculatedFooterMessage: finalFooterMessage,
          calculatedEnabled: finalEnabled,
          occasions: finalOccasions,
          recipients: finalRecipients,
      };
  });

  console.log(`${LOG_PREFIX}: Calculation complete. Result:`, monthlyDetails);
  return monthlyDetails;
};
// --- END of new helper function ---

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
    storyLocked: false, // <<< Initialize Story lock state
    artworkOption: null,
    photoUrl: undefined,
    artworkLocked: false, // <<< Initialize Artwork lock state
    enabled: false,
    footerMessage: '',
    shipDate: '',
    notesLocked: false, // <<< Initialize Notes lock state
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
  
  // Only check recipientType if we're past step 1
  if (session.currentStep > 1) {
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

  // Only check selectedEdition if we're past step 5 (WELCOME_CARD)
  if (session.currentStep > 5) {
    if (!session.selectedEdition) return false;
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
        console.log("[StoreAction initialize]: Running...");
        // This function now ONLY handles isLoading based on hydration.
        // Initializers (SignatureData, CustomDataDates) will be called elsewhere (e.g., relevant component mount).
        if (get().isHydrated) {
          console.log("[StoreAction initialize]: Store is hydrated, setting isLoading=false.");
          set({ isLoading: false });
        } else {
          console.log("[StoreAction initialize]: Store not hydrated yet, setting isLoading=true.");
          set({ isLoading: true });
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
          // Automatically save to DB on step change? Maybe too frequent.
          // Consider calling saveSessionToDb explicitly where needed.
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
          // Automatically save to DB on step change? Maybe too frequent.
          // Consider calling saveSessionToDb explicitly where needed.
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
          return { session: updatedSession, sessionMetadata: updatedMetadata, isCurrentStepValid: true }; // Assume valid when going back
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
  // <<< Modified saveSessionProgress >>>
  saveSessionProgress: async (email?: string) => {
        const updatedEmail = email ?? get().session.email;
        const updatedSessionData = {
            ...get().session,
            email: updatedEmail,
            updatedAt: new Date().toISOString(),
        };

        set(state => ({
            session: updatedSessionData,
            sessionMetadata: { ...state.sessionMetadata, lastSaved: new Date() }
        }));

        // Now, save the updated session to Supabase
        await get().saveSessionToDb();
  },
  resetSession: () => {
        console.log("Resetting session state...");
        const newSession = createNewSession(); // Use helper
        const initialMetadata = { sessionId: null, isActive: false, editionType: null, lastSaved: null };
        set({ session: newSession, sessionMetadata: initialMetadata, isLoading: false, isHydrated: true, isCurrentStepValid: false });
        // Clear the persisted state in localStorage as well
        localStorage.removeItem('legacyLockerSession');
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
        console.log("['initializeSignatureData']: Running...");
        const { recipient, purchaser, recipientType } = get().session;
        const chronologicalMonths = getChronologicalMonths(); // Needed for calculation

        // Call the shared calculation function
         const monthlyEventDetails = await calculateMonthlyEventDetails(recipient, purchaser, recipientType, chronologicalMonths);

        set(state => {
            // Map the calculated details to the signatureData structure
            const updatedSignatureData = ALL_MONTHS.map(monthName => {
                // Find the *first* chronological detail matching this month name
                const relevantDetail = monthlyEventDetails.find(detail => detail.month === monthName);
                const existingMonthData = state.session.signatureData.find(sd => sd.month === monthName) || { month: monthName, shipDate: '', footerMessage: '', enabled: false, occasions: [], recipients: []}; 

                return {
                    ...existingMonthData, 
                    enabled: relevantDetail?.calculatedEnabled ?? false,
                    shipDate: relevantDetail?.calculatedShipDate ?? '',
                    footerMessage: relevantDetail?.calculatedFooterMessage ?? '',
                    occasions: relevantDetail?.occasions ?? [], 
                    recipients: relevantDetail?.recipients ?? [], 
                };
            });

            console.log("['initializeSignatureData']: Final signatureData:", updatedSignatureData);
            if (JSON.stringify(state.session.signatureData) !== JSON.stringify(updatedSignatureData)) {
               return { session: { ...state.session, signatureData: updatedSignatureData, updatedAt: new Date().toISOString() } };
            }
            return {}; 
        });
    },

      initializeCustomDataDates: async () => {
          console.log("['initializeCustomDataDates']: Running...");
          const { recipient, purchaser, recipientType } = get().session;
          const chronologicalMonths = getChronologicalMonths();

          // Call the shared calculation function
          const monthlyEventDetails = await calculateMonthlyEventDetails(recipient, purchaser, recipientType, chronologicalMonths);

           set(state => {
               // Map the calculated details directly to the customData structure
               const updatedCustomData = state.session.customData.map(customMonthData => {
                   // Find the *exact* detail matching this month AND year
                   const relevantDetail = monthlyEventDetails.find(detail =>
                       detail.month === customMonthData.month && detail.year === customMonthData.year
                   );

                   if (relevantDetail) {
                       // Update the fields using the calculated values
                       return {
                           ...customMonthData,
                           enabled: relevantDetail.calculatedEnabled, 
                           shipDate: relevantDetail.calculatedShipDate, 
                           footerMessage: relevantDetail.calculatedFooterMessage,
                       };
                   }
                   return customMonthData;
               });

               console.log("['initializeCustomDataDates']: Final customData:", updatedCustomData);
               if (JSON.stringify(state.session.customData) !== JSON.stringify(updatedCustomData)) {
                 return {
                     session: {
                         ...state.session,
                         customData: updatedCustomData,
                         updatedAt: new Date().toISOString()
                     }
                 };
               }
               return {}; 
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
           console.log(`[updateCustomMonth] Updating ${month} ${year} with:`, data);
           if (data.footerMessage && typeof data.footerMessage === 'string') {
               data.footerMessage = truncate(data.footerMessage, { length: 80, omission: '' });
           }
           const updateData: Partial<CustomMonthData> = {
               ...data,
               enabled: data.enabled !== undefined ? data.enabled : undefined, 
               shipDate: data.shipDate !== undefined ? data.shipDate : undefined, 
           };
            delete (updateData as any).footerEnabled;


          set(state => {
              const updatedCustomData = state.session.customData.map(monthData => {
                  if (monthData.month === month && monthData.year === year) {
                      return { ...monthData, ...updateData };
                  }
                  return monthData;
              });
              const currentChronologicalMonths = getChronologicalMonths();
              const finalCustomData = currentChronologicalMonths.map(chronoMonth => {
                  const existingData = updatedCustomData.find(cd => cd.month === chronoMonth.month && cd.year === chronoMonth.year);
                  return existingData || {
                      month: chronoMonth.month, year: chronoMonth.year,
                      title: '', useExactTitle: false, story: '', useExactStory: false,
                      artworkOption: null, photoUrl: undefined,
                      enabled: false, footerMessage: '', shipDate: '' 
                  };
              });

              return {
                  session: {
                      ...state.session,
                      customData: finalCustomData,
                      updatedAt: new Date().toISOString(),
                  },
                  isCurrentStepValid: false
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

      // <<< NEW ACTION: Save session state via Edge Function >>>
      saveSessionToDb: async () => {
        const { session, sessionMetadata } = get();
        const sessionId = sessionMetadata.sessionId;

        if (!sessionId) {
          console.warn('[saveSessionToDb] No session ID found, cannot invoke function.');
          throw new Error('No session ID available to save.'); // Throw error to indicate failure
        }

        console.log(`[saveSessionToDb] Preparing payload for Edge Function for session: ${sessionId}`);

        // Prepare the session data payload
        const sessionDataToSave = cloneDeep(session);

        // Calculate expires_at
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30-day expiration
        const expiresAtISO = expiresAt.toISOString();

        // Construct the payload for the Edge Function
        const payload = {
            id: sessionId, 
            session_data: sessionDataToSave, 
            email: session.purchaser?.email, 
            updated_at: session.updatedAt || new Date().toISOString(),
            expires_at: expiresAtISO 
        };

        console.log(`[saveSessionToDb] Invoking 'save-session' Edge Function...`);
        try {
          const { data, error } = await supabase.functions.invoke(
            'save-session', 
            { body: payload } 
          );

          if (error) {
            console.error('[saveSessionToDb] Edge Function invocation error:', error);
            throw new Error(`Edge Function invocation failed: ${error.message}`);
          }

          if (data?.error) {
             console.error('[saveSessionToDb] Edge Function returned an error:', data.error);
             throw new Error(`Edge Function execution failed: ${data.error}`);
          }
          
          if (!data?.success) {
             console.error('[saveSessionToDb] Edge Function did not return success:', data);
             throw new Error('Edge Function execution did not indicate success.');
          }

          console.log(`[saveSessionToDb] Edge Function invoked successfully for session ${sessionId}.`);
          // Update lastSaved timestamp in local state on successful save
          set(state => ({
              sessionMetadata: { ...state.sessionMetadata, lastSaved: new Date() }
          }));

        } catch (err) {
            console.error("[saveSessionToDb] Error invoking Edge Function:", err);
            // Re-throw the error so calling functions (like autosave) know it failed
            throw err; 
        }
      },

      // <<< NEW ACTION: Load session state from Supabase >>>
      loadSessionFromDb: async (sessionId: string): Promise<boolean> => {
          if (!sessionId) {
              console.warn("[loadSessionFromDb] No sessionId provided.");
              return false;
          }
          console.log(`[loadSessionFromDb] Attempting to load session ${sessionId} from Supabase...`);
          set({ isLoading: true });

          try {
              const { data, error } = await supabase
                  .from('sessions')
                  .select('session_data, expires_at') 
                  .eq('id', sessionId) 
                  .single();

              if (error) {
                  console.error(`[loadSessionFromDb] Error loading session ${sessionId}:`, error);
                  set({ isLoading: false, isHydrated: true });
                  return false;
              }

              if (data && data.session_data) {
                  if (data.expires_at && new Date() > new Date(data.expires_at)) {
                      console.warn(`[loadSessionFromDb] Session ${sessionId} has expired (${data.expires_at}). Not loading.`);
                      set({ isLoading: false, isHydrated: true });
                      return false; 
                  }

                  console.log(`[loadSessionFromDb] Session ${sessionId} loaded successfully.`);
                  const loadedSession = data.session_data as SessionData;
                  
                  if (isValidSession(loadedSession)) {
                      // Force the internal sessionId to match the DB row ID used for lookup
                      loadedSession.sessionId = sessionId; 
                      console.log(`[loadSessionFromDb] Aligning internal session ID to DB ID: ${sessionId}`);
                      
                      set({
                          session: loadedSession, // Use the modified loadedSession
                          sessionMetadata: {
                             // Use the aligned sessionId for metadata as well
                             sessionId: sessionId, 
                             isActive: true,
                             editionType: loadedSession.selectedEdition?.type || null,
                             lastSaved: loadedSession.updatedAt ? new Date(loadedSession.updatedAt) : new Date(),
                          },
                          isLoading: false,
                          isHydrated: true,
                          isCurrentStepValid: true
                      });
                      return true;
                  } else {
                      console.warn(`[loadSessionFromDb] Loaded session ${sessionId} is invalid. Resetting.`);
                      get().resetSession();
                      set({ isLoading: false, isHydrated: true });
                      return false;
                  }
              } else {
                  console.warn(`[loadSessionFromDb] No session data found for ID ${sessionId}.`);
                  set({ isLoading: false, isHydrated: true });
                  return false;
              }
          } catch (err) {
              console.error("[loadSessionFromDb] Unexpected error during Supabase select:", err);
               set({ isLoading: false, isHydrated: true });
              return false;
          }
      },

      // Add the setHydrated function
      setHydrated: (value: boolean) => {
        console.log(`[StoreAction setHydrated]: Setting isHydrated to ${value}`);
        set({ isHydrated: value });
        // If we're setting hydrated to true, also set isLoading to false
        if (value) {
          set({ isLoading: false });
        }
      },

    }),
    {
      name: 'legacyLockerSession',
      storage: createJSONStorage(() => localStorage),
      // <<< Modified partialize: Only persist metadata and submit trigger count >>>
      partialize: (state) => ({
          sessionMetadata: state.sessionMetadata,
          submitTriggerCount: state.submitTriggerCount
        }),
      // <<< Improved onRehydrateStorage: Ensures hydration completes properly >>>
      onRehydrateStorage: () => (_finalState, _finalError) => {
        console.log("[onRehydrateStorage] Starting hydration process...");
        
        if (_finalError) {
          console.error("[onRehydrateStorage] Hydration error for persisted metadata:", _finalError);
          // Reset only the persisted parts if error occurs
          if (_finalState) {
              _finalState.sessionMetadata = { sessionId: null, isActive: false, editionType: null, lastSaved: null };
              _finalState.submitTriggerCount = 0;
          }
        } else if (_finalState) {
            console.log("[onRehydrateStorage] Metadata hydration successful.", _finalState.sessionMetadata);
        }

        return (_finalState, _finalError) => {
          console.log("[onRehydrateStorage] Setting final hydration state (mutate state)...");
          if (_finalState) {
            _finalState.isHydrated = true;
            _finalState.isLoading = false;
          }
          console.log("[onRehydrateStorage] Post-hydration: isHydrated set to true, isLoading set to false");
        };
      },
    }
  )
);

// Export the function (if needed elsewhere, but it's internal to the store action)
// export { initializeSignatureData }; 