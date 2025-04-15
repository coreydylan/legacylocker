// Define the recipient types
export interface IndividualRecipient {
  type: 'individual';
  firstName: string;
  lastName: string;
  relationship: string;
  birthday?: Date;
  includeWelcomeCard: boolean;
  welcomeMessage?: string;
}

export interface CoupleRecipient {
  type: 'couple';
  recipient1FirstName: string;
  recipient1LastName: string;
  recipient2FirstName: string;
  recipient2LastName: string;
  relationship: string;
  recipient1Birthday?: Date;
  recipient2Birthday?: Date;
  anniversary?: Date;
  includeWelcomeCard: boolean;
  welcomeMessage?: string;
}

// Define the form data structure
export interface FormData {
  giftType: 'myself' | 'individual' | 'couple' | null;
  purchaser: {
    fullName: string;
    email: string;
  };
  recipient: IndividualRecipient | CoupleRecipient;
  selectedSeries?: SeriesType;
  editionFlow: {
    type: 'signature' | 'custom' | 'concierge';
    // For Signature Edition
    monthlyData?: {
      [month: string]: {
        personalMessage?: string;
        celebration?: string;
        customDate?: Date;
      }
    };
    // For Custom Edition
    customEditionData?: {
      // Old structure (keeping for backward compatibility)
      monthlyStories?: {
        [month: string]: {
          story: string;
          emotionalImpact?: string;
          year?: string;
          imageUrl?: string;
        }
      };
      // New structure - 12 cards with individual titles and stories
      cards?: Array<{
        id: number;
        title: string;
        story: string;
        useAiArt: boolean;
        useTeamCopy?: boolean;
        photoUrl?: string;
        artworkOption?: string;
      }>;
      theme?: string;
      currentCard?: number;
      openEndedStory?: string;
      scheduleCall?: boolean;
    };
    // For Concierge Edition
    conciergeData?: {
      openEndedStory?: string;
      scheduleCall?: boolean;
      preferredContact?: {
        method?: string;
        preferredTime?: string;
        phoneNumber?: string;
        additionalNotes?: string;
        availability?: string;
      };
    };
    currentMonth?: string;
  };
}

export interface SeriesType {
  id: string;
  label: string;
  description?: string;
  type: 'signature' | 'custom' | 'concierge';
  isHighlighted?: boolean;
}

// Ensure FormSubmissionResult has a boolean success property
export interface FormSubmissionResult {
  success: boolean;
}
