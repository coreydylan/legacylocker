import { useState, useCallback } from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import { MonthlyCardData } from '@/lib/sessionStore';

interface CustomEditionState {
  selectedMonth: string | null;
  openCalendars: Set<string>;
  direction: 'next' | 'prev';
  containerHeight: number;
}

export const useCustomEditionFlow = () => {
  const [state, setState] = useState<CustomEditionState>({
    selectedMonth: null,
    openCalendars: new Set(),
    direction: 'next',
    containerHeight: 0,
  });

  const { updateSession } = useSessionStore();

  const handleMonthChange = useCallback((month: string) => {
    setState((prev) => ({
      ...prev,
      selectedMonth: month,
      direction: month > (prev.selectedMonth || '') ? 'next' : 'prev',
    }));
  }, []);

  const handleDataChange = useCallback((month: string, data: Partial<MonthlyCardData>) => {
    updateSession('monthlyCards', (session) => {
      if (!session) return session;
      return {
        ...session,
        [month]: {
          ...session[month],
          ...data,
        },
      };
    });
  }, [updateSession]);

  const toggleCalendar = useCallback((month: string) => {
    setState((prev) => {
      const newOpenCalendars = new Set(prev.openCalendars);
      if (newOpenCalendars.has(month)) {
        newOpenCalendars.delete(month);
      } else {
        newOpenCalendars.add(month);
      }
      return {
        ...prev,
        openCalendars: newOpenCalendars,
      };
    });
  }, []);

  const handlePhotoUpload = useCallback(async (month: string, file: File) => {
    try {
      // TODO: Implement actual photo upload logic
      const photoUrl = URL.createObjectURL(file);
      handleDataChange(month, { photoUrl });
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  }, [handleDataChange]);

  const setContainerHeight = useCallback((height: number) => {
    setState((prev) => ({
      ...prev,
      containerHeight: height,
    }));
  }, []);

  return {
    state,
    handleMonthChange,
    handleDataChange,
    toggleCalendar,
    handlePhotoUpload,
    setContainerHeight,
  };
}; 