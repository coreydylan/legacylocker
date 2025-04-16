import React, { useEffect, useMemo } from 'react';
import { useSessionStore } from '@/lib/sessionStore';
import SignatureMonthCard from './SignatureMonthCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from "@/components/ui/button";
import { getMonth, addMonths, getYear } from 'date-fns';
import useMediaQuery from '@/hooks/useMediaQuery';

// Define outside component for stability if needed elsewhere
const ALL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface ChronologicalMonth {
  month: string;
  year: number;
}

// Helper function to get the next 12 months with year
const getChronologicalMonths = (): ChronologicalMonth[] => {
  const now = new Date();
  const chronologicalMonths: ChronologicalMonth[] = [];

  for (let i = 1; i <= 12; i++) { // Start from next month (i=1)
    const targetDate = addMonths(now, i);
    chronologicalMonths.push({
      month: ALL_MONTHS[getMonth(targetDate)],
      year: getYear(targetDate),
    });
  }
  return chronologicalMonths;
};

const SignatureMonthGrid: React.FC = () => {
  const { 
      session, 
      updateSignatureMonth, 
      isLoading, 
      isHydrated, 
      initializeSignatureData, 
      nextStep,
      prevStep,
      isCurrentStepValid
    } = useSessionStore(state => ({
    session: state.session,
    updateSignatureMonth: state.updateSignatureMonth,
    isLoading: state.isLoading,
    isHydrated: state.isHydrated,
    initializeSignatureData: state.initializeSignatureData,
    nextStep: state.nextStep,
    prevStep: state.prevStep,
    isCurrentStepValid: state.isCurrentStepValid
  }));

  const signatureData = session.signatureData || [];
  const purchaserFirstName = session.purchaser?.fullName?.split(' ')[0] || 'Me';
  const isMobile = useMediaQuery('(max-width: 768px)');

  // orderedMonths will now be ChronologicalMonth[]
  const orderedMonths = useMemo(() => getChronologicalMonths(), []);

  useEffect(() => {
    if (isHydrated) {
      console.log("['SignatureMonthGrid']: Hydrated, calling initializeSignatureData...");
      initializeSignatureData();
    }
  }, [
      isHydrated, 
      initializeSignatureData, 
      session.recipient?.birthday,
      session.recipient?.recipient1Birthday,
      session.recipient?.recipient2Birthday,
      session.recipient?.anniversary,
      session.recipientType,
      session.purchaser?.fullName
    ]);

  if (isLoading || !isHydrated) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-[180px] rounded-lg" />
        ))}
      </div>
    );
  }

  // Create a map for quick lookup of data by month name
  const signatureDataMap = useMemo(() => {
      const map = new Map<string, typeof signatureData[0]>();
      if (signatureData.length === 12) {
          signatureData.forEach(data => map.set(data.month, data));
      }
      return map;
  }, [signatureData]);

  if (signatureDataMap.size !== 12 && isHydrated) {
    console.error("['SignatureMonthGrid']: Error: signatureData map size is not 12 after hydration.");
    return <p className="text-center text-red-600">Error loading month customization data. Please try refreshing.</p>;
  }

  const handleContinue = () => {
      console.log("['SignatureMonthGrid']: Continue clicked");
      nextStep();
  };

  const handlePrevious = () => {
      console.log("['SignatureMonthGrid']: Previous clicked");
      prevStep();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {orderedMonths.map(({ month: monthName, year }) => {
          const monthData = signatureDataMap.get(monthName);
          if (!monthData) {
              console.error(`['SignatureMonthGrid']: Missing data for month: ${monthName}`);
              return null;
          }
          return (
              <SignatureMonthCard
                key={`${monthName}-${year}`}
                monthData={monthData}
                year={year}
                onUpdate={updateSignatureMonth}
                purchaserFirstName={purchaserFirstName}
              />
          );
        })}
      </div>

      {/* Conditionally render desktop buttons */}
      {!isMobile && (
        <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handlePrevious} className="w-32">
                Previous
            </Button>
            <Button 
              onClick={handleContinue} 
              className="w-32 bg-legacy-green hover:bg-legacy-green/90"
              disabled={!isCurrentStepValid}
            >
                Continue
            </Button>
        </div>
      )}
    </div>
  );
};

export default SignatureMonthGrid; 