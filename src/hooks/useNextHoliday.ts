import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addMonths, isSameMonth, isAfter, isBefore } from 'date-fns';

interface Holiday {
  name: string;
  date: Date;
}

const FIXED_HOLIDAYS: Holiday[] = [
  { name: "Valentine's Day", date: new Date(new Date().getFullYear(), 1, 14) }, // February 14
  { name: "Mother's Day", date: new Date(new Date().getFullYear(), 4, 14) }, // Second Sunday in May
  { name: "Father's Day", date: new Date(new Date().getFullYear(), 5, 21) }, // Third Sunday in June
  { name: "Grandparent's Day", date: new Date(new Date().getFullYear(), 8, 10) }, // First Sunday after Labor Day
  { name: "the holidays", date: new Date(new Date().getFullYear(), 11, 25) }, // December 25 (represents holiday season)
];

export function useNextHoliday() {
  const [nextHoliday, setNextHoliday] = useState<Holiday | null>(null);
  const [displayText, setDisplayText] = useState<string>("");

  useEffect(() => {
    const now = new Date();
    
    // Find the next upcoming holiday
    const upcoming = FIXED_HOLIDAYS
      .map(holiday => {
        // Adjust holiday date if it's already passed this year
        let date = holiday.date;
        if (isBefore(date, now)) {
          date = new Date(date.setFullYear(date.getFullYear() + 1));
        }
        return { ...holiday, date };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .find(holiday => isAfter(holiday.date, now));

    if (upcoming) {
      setNextHoliday(upcoming);
      
      // Format the display text
      if (isSameMonth(upcoming.date, addMonths(now, 1))) {
        setDisplayText(`${upcoming.name} is next month`);
      } else {
        setDisplayText(`${upcoming.name} is in ${format(upcoming.date, 'MMMM')}`);
      }
    }
  }, []);

  return { nextHoliday, displayText };
} 