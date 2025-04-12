import { SessionData } from '@/lib/sessionManager'; // Import the full SessionData type

/**
 * Formats the recipient's name for shipping labels and envelopes based on type.
 * Handles 'myself', 'individual', and 'couple' types.
 * @param session The full session data object from the store.
 * @returns A formatted string like "John Smith", "John and Jane Smith", or "John Smith and Jane Doe". Returns empty string if essential names are missing.
 */
export function formatShipToName(session: SessionData | undefined | null): string {
  if (!session) return "";

  // Handle 'myself' - Use purchaser name
  if (session.recipientType === 'myself') {
    const { fullName } = session.purchaser || {};
    return fullName?.trim() || ""; // Return purchaser's full name or empty string
  }

  // Handle 'individual' or 'couple' - Use recipient data
  const recipient = session.recipient;
  if (!recipient) return "";

  if (recipient.type === 'individual') {
    const { firstName, lastName } = recipient;
    if (!firstName || !lastName) return "";
    return `${firstName} ${lastName}`.trim();
  }

  if (recipient.type === 'couple') {
    const { recipient1FirstName, recipient1LastName, recipient2FirstName, recipient2LastName } = recipient;
    if (!recipient1FirstName || !recipient1LastName || !recipient2FirstName || !recipient2LastName) {
      return "";
    }
    if (recipient1LastName === recipient2LastName) {
      return `${recipient1FirstName} and ${recipient2FirstName} ${recipient1LastName}`.trim();
    }
    return `${recipient1FirstName} ${recipient1LastName} and ${recipient2FirstName} ${recipient2LastName}`.trim();
  }
  
  return ""; // Fallback
} 