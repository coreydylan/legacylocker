import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useSessionStore } from '@/lib/sessionStore';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';

const Introduction: React.FC = () => {
  // Use the session store to get the selected series and recipient type
  const { session, updateSession } = useSessionStore();
  const { goNext } = useOnboardingNavigation();
  
  const selectedSeries = session.selectedSeries;
  const recipientType = session.recipientType;
  
  // Log only when component renders, not on every change
  useEffect(() => {
    console.log("Introduction: Rendered with series data:", selectedSeries);
  }, [selectedSeries]);

  const handleGiftTypeSelect = (type: 'myself' | 'individual' | 'couple') => {
    console.log(`Introduction: Selected gift type: ${type}`);
    
    // Update the session store
    updateSession('recipientType', type);
    
    // Update recipient structure based on gift type
    if (type === 'couple') {
      updateSession('recipient', {
        type: 'couple',
        recipient1FirstName: '',
        recipient1LastName: '',
        recipient2FirstName: '',
        recipient2LastName: '',
        relationship: '',
        includeWelcomeCard: false,
      });
    } else if (type === 'individual' || type === 'myself') {
      updateSession('recipient', {
        type: 'individual',
        firstName: '',
        lastName: '',
        relationship: '',
        includeWelcomeCard: false,
      });
    }
    
    // Move to next step
    console.log("Introduction: Moving to next step");
    goNext();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-legacy-green font-playfair">
          Let's create something meaningful.
        </h1>
        <p className="text-xl text-legacy-dark/80">
          You've selected <span className="font-medium">{selectedSeries?.display || 'a story series'}</span>.
          Now let's personalize it to make it truly special.
        </p>
      </div>

      <div className="py-4">
        <h2 className="text-xl font-medium mb-4 text-left">
          Is this a gift for yourself or someone else?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button
            type="button"
            variant="outline"
            className={`h-auto min-h-[160px] p-6 text-left flex flex-col items-start justify-start transition-all duration-200 ${
              recipientType === 'myself' 
                ? 'border-2 border-legacy-green bg-legacy-green/5' 
                : 'border-2 border-gray-200 hover:border-legacy-green/50 hover:bg-legacy-green/3'
            }`}
            onClick={() => handleGiftTypeSelect('myself')}
          >
            <div className="w-full space-y-2">
              <div className="font-medium text-lg mb-2">For Myself</div>
              <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-normal">
                I'm purchasing this subscription for my own enjoyment.
              </p>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            className={`h-auto min-h-[160px] p-6 text-left flex flex-col items-start justify-start transition-all duration-200 ${
              recipientType === 'individual' 
                ? 'border-2 border-legacy-green bg-legacy-green/5' 
                : 'border-2 border-gray-200 hover:border-legacy-green/50 hover:bg-legacy-green/3'
            }`}
            onClick={() => handleGiftTypeSelect('individual')}
          >
            <div className="w-full space-y-2">
              <div className="font-medium text-lg mb-2">For an Individual</div>
              <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-normal">
                I'm giving this to one special person.
              </p>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            className={`h-auto min-h-[160px] p-6 text-left flex flex-col items-start justify-start transition-all duration-200 ${
              recipientType === 'couple' 
                ? 'border-2 border-legacy-green bg-legacy-green/5' 
                : 'border-2 border-gray-200 hover:border-legacy-green/50 hover:bg-legacy-green/3'
            }`}
            onClick={() => handleGiftTypeSelect('couple')}
          >
            <div className="w-full space-y-2">
              <div className="font-medium text-lg mb-2">For a Couple</div>
              <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-normal">
                A shared gift for two people in a relationship.
              </p>
            </div>
          </Button>
        </div>
      </div>

      {/* About Series Box - Simple version */}
      {selectedSeries && (
        <div className="bg-legacy-cream/30 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-medium text-legacy-green mb-2">
            About {selectedSeries.display}
          </h3>
          <p className="text-legacy-dark/80 leading-relaxed">
            {selectedSeries.type === 'signature' 
              ? "A curated collection of 12 beautifully crafted cards delivered monthly, each celebrating moments that connect with your chosen theme."
              : selectedSeries.type === 'custom'
              ? "Your custom edition will be crafted specifically for you, telling a unique story that matters to you or your recipient."
              : "Our premium service with a dedicated writer to help craft your perfect story collection."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Introduction;
