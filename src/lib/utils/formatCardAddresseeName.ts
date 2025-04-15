import { Session } from '../sessionManager';

/**
 * Formats the card addressee name based on recipient type and information
 * @param session The current session object
 * @returns Formatted name for the card addressee
 */
export function formatCardAddresseeName(session: Session): string {
  const recipient = session.recipient;
  
  if (!recipient) {
    return '';
  }
  
  if (recipient.type === 'couple') {
    // For couples, format as "First1 & First2 Last" if they share a last name
    // Otherwise format as "First1 Last1 & First2 Last2"
    const first1 = recipient.recipient1FirstName || '';
    const last1 = recipient.recipient1LastName || '';
    const first2 = recipient.recipient2FirstName || '';
    const last2 = recipient.recipient2LastName || '';
    
    if (last1 && last2 && last1 === last2) {
      // Same last name
      return `${first1} & ${first2} ${last1}`;
    } else {
      // Different last names
      const name1 = first1 + (last1 ? ` ${last1}` : '');
      const name2 = first2 + (last2 ? ` ${last2}` : '');
      
      if (name1 && name2) {
        return `${name1} & ${name2}`;
      } else if (name1) {
        return name1;
      } else if (name2) {
        return name2;
      }
    }
  } else {
    // For individuals, format as "First Last"
    const firstName = recipient.firstName || '';
    const lastName = recipient.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
  }
  
  return '';
}