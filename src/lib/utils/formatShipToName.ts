import { Recipient } from '@/lib/sessionManager'; // Import the existing Recipient type

/**
 * Formats the recipient's name for shipping labels and envelopes based on type.
 * @param recipient The recipient object from the session store.
 * @returns A formatted string like "John Smith", "John and Jane Smith", or "John Smith and Jane Doe". Returns empty string if essential names are missing.
 */
export function formatShipToName(recipient: Recipient | undefined | null): string {
  if (!recipient) return "";

  // Handle individual recipient
  if (recipient.type === 'individual') {
    const { firstName, lastName } = recipient;
    if (!firstName || !lastName) return ""; // Need both for a valid individual name
    return `${firstName} ${lastName}`.trim();
  }

  // Handle couple recipient
  if (recipient.type === 'couple') {
    const { recipient1FirstName, recipient1LastName, recipient2FirstName, recipient2LastName } = recipient;
    
    // Check if all necessary names for a couple are present
    if (!recipient1FirstName || !recipient1LastName || !recipient2FirstName || !recipient2LastName) {
      return ""; // Need all four names for a valid couple format
    }

    // Handle same last name
    if (recipient1LastName === recipient2LastName) {
      return `${recipient1FirstName} and ${recipient2FirstName} ${recipient1LastName}`.trim();
    }

    // Handle different last names
    return `${recipient1FirstName} ${recipient1LastName} and ${recipient2FirstName} ${recipient2LastName}`.trim();
  }
  
  // Fallback for unknown type or missing data
  return "";
} 