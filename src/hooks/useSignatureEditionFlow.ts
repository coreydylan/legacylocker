import { useState, useEffect, useCallback } from 'react';
// import { FormData } from '@/types/onboarding'; // No longer needed as arg
import { useToast } from './use-toast';
import { useSessionStore, SessionData } from '@/lib/sessionStore'; // Import SessionData from sessionStore instead of sessionManager

// Remove formData and updateFormData from arguments
export const useSignatureEditionFlow = () => {
  // Get session and update action from the store
  const { session, updateSession } = useSessionStore();
  const typedSession = session as SessionData;
  
  // Use state for UI control, derived from session where possible
  const [selectedMonth, setSelectedMonth] = useState(typedSession.editionFlow?.currentMonth || "January");
  const [openCalendars, setOpenCalendars] = useState<Record<string, boolean>>({});
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [containerHeight, setContainerHeight] = useState<number | string>('auto');
  const { toast } = useToast();

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const celebrationTypes = [
    "Birthday", "Anniversary", "Graduation", "Retirement",
    "New Job", "New Home", "Baby Shower", "Wedding",
    "Holiday", "Other"
  ];

  // Initialize monthly data in the session if it doesn't exist
  useEffect(() => {
    if (!typedSession.editionFlow?.monthlyData) {
      const initialMonthlyData = months.reduce((acc, month) => {
        acc[month] = { 
          personalMessage: '', 
          celebration: '', 
          customDate: '',
          useExactText: false,
          useExactTitle: false,
          artworkOption: 'from-story',
          photoUrl: '',
          title: ''
        };
        return acc;
      }, {} as Record<string, any>);
      
      // Update the session directly
      updateSession('editionFlow.monthlyData', initialMonthlyData);
      updateSession('editionFlow.currentMonth', "January");
    }
    
    // Sync local selectedMonth state with session
    if (typedSession.editionFlow?.currentMonth && selectedMonth !== typedSession.editionFlow.currentMonth) {
      setSelectedMonth(typedSession.editionFlow.currentMonth);
    }
  }, [typedSession.editionFlow, updateSession, months, selectedMonth]);

  // Get current month data safely from session
  const currentMonthData = typedSession.editionFlow?.monthlyData?.[selectedMonth] || { 
    personalMessage: '', 
    celebration: '', 
    customDate: '',
    useExactText: false,
    useExactTitle: false,
    artworkOption: 'from-story',
    photoUrl: '',
    title: ''
  };

  const handleMonthChange = (newMonth: string) => {
    const currentIndex = months.indexOf(selectedMonth);
    const newIndex = months.indexOf(newMonth);
    
    setDirection(newIndex > currentIndex ? 'right' : 'left');
    setSelectedMonth(newMonth); // Update local state for UI transition
    updateSession('editionFlow.currentMonth', newMonth); // Update session state
  };

  const handlePrevMonth = () => {
    const currentIndex = months.indexOf(selectedMonth);
    if (currentIndex > 0) {
      const prevMonth = months[currentIndex - 1];
      setDirection('left');
      setSelectedMonth(prevMonth);
      updateSession('editionFlow.currentMonth', prevMonth);
    }
  };

  const handleNextMonth = () => {
    const currentIndex = months.indexOf(selectedMonth);
    if (currentIndex < months.length - 1) {
      const nextMonth = months[currentIndex + 1];
      setDirection('right');
      setSelectedMonth(nextMonth);
      updateSession('editionFlow.currentMonth', nextMonth);
    }
  };

  // Update specific field for the selected month in the session
  const handleMonthDataChange = (field: string, value: any) => {
    updateSession(`editionFlow.monthlyData.${selectedMonth}.${field}`, value);
  };

  const handleCalendarToggle = (month: string, isOpen: boolean) => {
    setOpenCalendars(prev => ({
      ...prev,
      [month]: isOpen
    }));
  };
  
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // TODO: Implement actual file upload logic (e.g., to Supabase storage)
      // For now, store a placeholder or file name
      const fileName = event.target.files[0].name;
      handleMonthDataChange('photoUrl', `uploads/${fileName}`); // Example path
      toast({
        title: "Photo selected",
        description: `${fileName} selected for upload.`,
      });
    }
  };

  const currentIndex = months.indexOf(selectedMonth);
  const prevMonth = currentIndex > 0 ? months[currentIndex - 1] : null;
  const nextMonth = currentIndex < months.length - 1 ? months[currentIndex + 1] : null;

  const initializeMonthlyData = useCallback(() => {
    // Initialize monthly data in the session if it doesn't exist
    if (!typedSession.editionFlow?.monthlyData) {
      const initialMonthlyData = months.reduce((acc, month) => {
        acc[month] = { 
          personalMessage: '', 
          celebration: '', 
          customDate: '',
          useExactText: false,
          useExactTitle: false,
          artworkOption: 'from-story',
          photoUrl: '',
          title: ''
        };
        return acc;
      }, {} as Record<string, any>);
      
      // Update the session directly
      updateSession('editionFlow.monthlyData', initialMonthlyData);
      updateSession('editionFlow.currentMonth', "January");
    }
  }, [months, updateSession, typedSession.editionFlow]);

  return {
    selectedMonth,
    // setSelectedMonth, // Usually not needed externally if synced with store
    openCalendars,
    direction,
    containerHeight,
    setContainerHeight,
    months,
    celebrationTypes,
    currentMonthData, // Derived from session
    prevMonth, // Derived locally
    nextMonth, // Derived locally
    handleMonthChange, // Updates session
    handlePrevMonth, // Updates session
    handleNextMonth, // Updates session
    handleMonthDataChange, // Updates session
    handleCalendarToggle, // Local UI state
    handlePhotoUpload, // Updates session (placeholder)
    initializeMonthlyData
  };
};
