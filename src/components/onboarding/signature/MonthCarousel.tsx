
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import MonthCard from './MonthCard';

interface MonthCarouselProps {
  selectedMonth: string;
  prevMonth: string | null;
  nextMonth: string | null;
  currentMonthData: {
    personalMessage?: string;
    celebration?: string;
    customDate?: Date;
    useExactText?: boolean;
    useExactTitle?: boolean;
    artworkOption?: string;
    photoUrl?: string;
  };
  openCalendars: Record<string, boolean>;
  direction: 'left' | 'right';
  containerHeight: number | string;
  setContainerHeight: (height: number | string) => void;
  handleMonthDataChange: (field: string, value: any) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleCalendarToggle: (month: string, isOpen: boolean) => void;
  celebrationTypes: string[];
  months: string[];
  handleMonthChange: (month: string) => void;
  handlePhotoUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const MonthCarousel: React.FC<MonthCarouselProps> = ({
  selectedMonth,
  prevMonth,
  nextMonth,
  currentMonthData,
  openCalendars,
  direction,
  containerHeight,
  setContainerHeight,
  handleMonthDataChange,
  handlePrevMonth,
  handleNextMonth,
  handleCalendarToggle,
  celebrationTypes,
  months,
  handleMonthChange,
  handlePhotoUpload
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const monthCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measureHeight = () => {
      if (monthCardRef.current) {
        const height = monthCardRef.current.offsetHeight + 10;
        setContainerHeight(height);
      }
    };

    measureHeight();
    const timeoutId = setTimeout(measureHeight, 50);
    
    return () => clearTimeout(timeoutId);
  }, [selectedMonth, currentMonthData, setContainerHeight]);

  const variants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? -500 : 500,
      opacity: 0
    })
  };

  return (
    <div className="space-y-4">
      {/* Hidden element for measuring height */}
      <div 
        ref={monthCardRef} 
        style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0, right: 0 }} 
        aria-hidden="true"
      >
        <div className="w-full px-4">
          <MonthCard
            selectedMonth={selectedMonth}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            currentMonthData={currentMonthData}
            handleMonthDataChange={handleMonthDataChange}
            handlePrevMonth={handlePrevMonth}
            handleNextMonth={handleNextMonth}
            openCalendars={openCalendars}
            handleCalendarToggle={handleCalendarToggle}
            celebrationTypes={celebrationTypes}
            months={months}
            handleMonthChange={handleMonthChange}
            handlePhotoUpload={handlePhotoUpload}
          />
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="relative" 
        style={{ 
          minHeight: typeof containerHeight === 'number' ? `${containerHeight}px` : containerHeight
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={selectedMonth}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute w-full"
            style={{ top: 0, left: 0, right: 0 }}
          >
            <div className="w-full px-4">
              <MonthCard
                selectedMonth={selectedMonth}
                prevMonth={prevMonth}
                nextMonth={nextMonth}
                currentMonthData={currentMonthData}
                handleMonthDataChange={handleMonthDataChange}
                handlePrevMonth={handlePrevMonth}
                handleNextMonth={handleNextMonth}
                openCalendars={openCalendars}
                handleCalendarToggle={handleCalendarToggle}
                celebrationTypes={celebrationTypes}
                months={months}
                handleMonthChange={handleMonthChange}
                handlePhotoUpload={handlePhotoUpload}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MonthCarousel;
