
import { useState, useEffect } from 'react';
import { FormData } from '@/types/onboarding';
import { useToast } from './use-toast';

export const useSignatureEditionFlow = (
  formData: FormData,
  updateFormData: (key: keyof FormData, value: any) => void
) => {
  const [selectedMonth, setSelectedMonth] = useState("January");
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

  useEffect(() => {
    if (!formData.editionFlow.monthlyData) {
      const initialMonthlyData = months.reduce((acc, month) => {
        acc[month] = { 
          personalMessage: '', 
          celebration: '', 
          customDate: undefined,
          useExactText: false,
          useExactTitle: false,
          artworkOption: 'from-story',
          photoUrl: undefined
        };
        return acc;
      }, {} as Record<string, { 
        personalMessage?: string, 
        celebration?: string, 
        customDate?: Date,
        useExactText?: boolean,
        useExactTitle?: boolean,
        artworkOption?: string,
        photoUrl?: string
      }>);
      
      updateFormData('editionFlow', { 
        ...formData.editionFlow, 
        monthlyData: initialMonthlyData,
        currentMonth: "January"
      });
    }
    
    if (formData.editionFlow.currentMonth) {
      setSelectedMonth(formData.editionFlow.currentMonth);
    }
  }, [formData.editionFlow, updateFormData, months]);

  const currentMonthData = formData.editionFlow.monthlyData?.[selectedMonth] || { 
    personalMessage: '', 
    celebration: '', 
    customDate: undefined,
    useExactText: false,
    useExactTitle: false,
    artworkOption: 'from-story',
    photoUrl: undefined
  };

  const handleMonthChange = (newMonth: string) => {
    const currentIndex = months.indexOf(selectedMonth);
    const newIndex = months.indexOf(newMonth);
    
    setDirection(newIndex > currentIndex ? 'right' : 'left');
    setSelectedMonth(newMonth);
    updateFormData('editionFlow', { 
      ...formData.editionFlow, 
      currentMonth: newMonth
    });
  };

  const handlePrevMonth = () => {
    const currentIndex = months.indexOf(selectedMonth);
    if (currentIndex > 0) {
      const prevMonth = months[currentIndex - 1];
      setDirection('left');
      setSelectedMonth(prevMonth);
      updateFormData('editionFlow', { 
        ...formData.editionFlow, 
        currentMonth: prevMonth
      });
    }
  };

  const handleNextMonth = () => {
    const currentIndex = months.indexOf(selectedMonth);
    if (currentIndex < months.length - 1) {
      const nextMonth = months[currentIndex + 1];
      setDirection('right');
      setSelectedMonth(nextMonth);
      updateFormData('editionFlow', { 
        ...formData.editionFlow, 
        currentMonth: nextMonth
      });
    }
  };

  const handleMonthDataChange = (field: string, value: any) => {
    if (formData.editionFlow.monthlyData) {
      const updatedMonthlyData = {
        ...formData.editionFlow.monthlyData,
        [selectedMonth]: {
          ...formData.editionFlow.monthlyData[selectedMonth],
          [field]: value
        }
      };
      
      updateFormData('editionFlow', { 
        ...formData.editionFlow, 
        monthlyData: updatedMonthlyData
      });
    }
  };

  const handleCalendarToggle = (month: string, isOpen: boolean) => {
    setOpenCalendars(prev => ({
      ...prev,
      [month]: isOpen
    }));
  };
  
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // In a real implementation, this would handle file upload to a server
      // For now, we'll just store the file name
      handleMonthDataChange('photoUrl', event.target.files[0].name);
      toast({
        title: "Photo uploaded",
        description: `${event.target.files[0].name} has been selected for this card.`,
      });
    }
  };

  const currentIndex = months.indexOf(selectedMonth);
  const prevMonth = currentIndex > 0 ? months[currentIndex - 1] : null;
  const nextMonth = currentIndex < months.length - 1 ? months[currentIndex + 1] : null;

  return {
    selectedMonth,
    setSelectedMonth,
    openCalendars,
    direction,
    containerHeight,
    setContainerHeight,
    months,
    celebrationTypes,
    currentMonthData,
    prevMonth,
    nextMonth,
    handleMonthChange,
    handlePrevMonth,
    handleNextMonth,
    handleMonthDataChange,
    handleCalendarToggle,
    handlePhotoUpload
  };
};
