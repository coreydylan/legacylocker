import { DateValue, CalendarDate, parseDate } from '@internationalized/date';

/**
 * Converts a CalendarDate/DateValue object to an ISO 8601 string (YYYY-MM-DD).
 * Returns null if the input is null or undefined.
 */
export const dateToISOString = (date: DateValue | null | undefined): string | null => {
    if (!date) return null;
    try {
      // CalendarDate and DateValue from react-aria have year, month, day properties
      const year = date.year;
      const month = String(date.month).padStart(2, '0');
      const day = String(date.day).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      console.error("Error converting date value to ISO string:", e);
      return null;
    }
};
  
/**
 * Safely parses an ISO 8601 string (YYYY-MM-DD) or a JS Date compatible string 
 * into a CalendarDate object.
 * Returns undefined if parsing fails or input is invalid.
 */
export const parseDateToCalendarDate = (dateStr: string | null | undefined): CalendarDate | undefined => {
    // console.log(`Utils: parseDateToCalendarDate called with: '${dateStr}'`); // Optional logging
    if (!dateStr) return undefined;
    try {
      // Use react-aria's parseDate for direct YYYY-MM-DD parsing
      return parseDate(dateStr);
    } catch (e) {
      // Fallback for potentially other formats (e.g., full ISO string from JS Date)
      try {
          let date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
              // Extract YYYY-MM-DD from the JS Date (in UTC) to avoid timezone shifts
              const year = date.getUTCFullYear();
              const month = date.getUTCMonth() + 1; // JS months are 0-indexed
              const day = date.getUTCDate();
              return new CalendarDate(year, month, day);
          }
      } catch (innerErr) {
          console.error('Error parsing date string (both methods failed):', dateStr, e, innerErr);
      }
      return undefined;
    }
}; 