import React from 'react';
import SignatureMonthGrid from './signature/SignatureMonthGrid';
import { cn } from "@/lib/utils"; // Import cn if needed

// This component assumes it's rendered within the flow where session is available
const MonthlyCustomizationStep: React.FC = () => {

  // No specific state or actions needed here directly,
  // as SignatureMonthGrid handles its own logic.
  
  return (
    // Use py-4 for mobile consistency, remove md:py-0 as parent handles desktop spacing
    <div className="space-y-6 py-4">
      {/* Custom Notes Header Box */} 
      <div className="max-w-2xl mx-auto border border-legacy-green/20 rounded-lg p-4 md:p-6 space-y-2 bg-legacy-green/10 shadow-sm">
        <h3 className="text-lg font-manrope font-medium text-legacy-green">Custom Notes</h3>
        <p className="text-sm text-legacy-green/90 leading-relaxed">
          Each Legacy Locker card includes a powerful story from your chosen theme. Here, you can optionally include a short note to appear at the bottom of the card—just a simple way to mark a birthday, anniversary, or moment that matters that month. Cards are set to ship near the beginning of each month, but you'll also have the option to adjust the "arrive by" date to better align with any special moments you want to celebrate.
        </p>
      </div>

      {/* Render the Month Grid */}
      <SignatureMonthGrid />

      {/* Desktop navigation buttons are handled by parent/other components */}
      {/* Mobile navigation is handled by MobileNavFooter */}
    </div>
  );
};

export default MonthlyCustomizationStep; 