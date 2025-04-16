import React from 'react';
import SignatureMonthGrid from './signature/SignatureMonthGrid'; // Import the new grid component
import { useSessionStore } from '@/lib/sessionStore'; // Keep store hook if needed for other parts
import WelcomeMessageEditor from './WelcomeMessageEditor'; // Import the new component

interface SignatureEditionFlowProps {
  hideCustomization?: boolean; // Keep prop if needed, though grid likely always shows
}

const SignatureEditionFlow: React.FC<SignatureEditionFlowProps> = ({ hideCustomization = false }) => {
  // Remove the useSignatureEditionFlow hook
  // const {
  //   selectedMonth,
  //   openCalendars,
  //   ...rest of old hook values
  // } = useSignatureEditionFlow();

  // Session store might still be needed if other info is displayed here
  const { isLoading, isHydrated } = useSessionStore(state => ({
    isLoading: state.isLoading,
    isHydrated: state.isHydrated,
  }));

  // Remove useEffect for initializeMonthlyData - handled by store now

  // Basic loading state (can be enhanced)
  if (isLoading || !isHydrated) {
      return (
          <div className="space-y-8">
              {/* Header */}
              <div className="space-y-3 text-center px-4">
                  <h1 className="text-3xl sm:text-4xl font-bold text-legacy-green font-playfair">Personalize Your Signature Cards</h1>
                  <p className="text-lg sm:text-xl text-legacy-dark/80">Loading Customization Options...</p>
              </div>
          </div>
      );
  }

  return (
    // Add space-y-8 for spacing between Welcome Card and Grid
    <div className="space-y-6 md:space-y-8 py-4 md:py-0">
      {/* Header */}
      <div className="space-y-2 md:space-y-3 px-4 text-left md:text-center">
        <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-legacy-green font-playfair">Personalize Your Signature Cards</h1>
        <p className="text-sm md:text-lg lg:text-xl text-legacy-dark/80">
          Optionally add a welcome message and customize ship dates or special footers.
        </p>
      </div>
      
      {/* --- Add Welcome Message Editor --- */} 
      <WelcomeMessageEditor />
      
      {/* Conditionally render Grid or hide message */} 
      {!hideCustomization ? (
           <SignatureMonthGrid />
       ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center max-w-3xl mx-auto">
            <p className="text-legacy-dark/80">Monthly signature customization options are managed here.</p> 
          </div>
       )}

      {/* Navigation Buttons remain handled by the parent step component */}
    </div>
  );
};

export default SignatureEditionFlow;
