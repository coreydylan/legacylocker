import React from 'react';
import { Button } from "@/components/ui/button";
import { FormData, SeriesType } from '@/types/onboarding';

interface IntroductionProps {
  selectedSeries: SeriesType | null;
  formData: FormData;
  updateFormData: (key: keyof FormData, value: any) => void;
}

const Introduction: React.FC<IntroductionProps> = ({ selectedSeries, formData, updateFormData }) => {
  const handleGiftTypeSelect = (type: 'myself' | 'individual' | 'couple') => {
    console.log(`Introduction - Selected gift type: ${type}`);
    
    // Update formData with the selected gift type
    updateFormData('giftType', type);
    
    // Also update recipient structure based on gift type
    if (type === 'couple') {
      updateFormData('recipient', {
        type: 'couple',
        recipient1FirstName: '',
        recipient1LastName: '',
        recipient2FirstName: '',
        recipient2LastName: '',
        relationship: '',
        includeWelcomeCard: false,
      });
    } else if (type === 'individual' || type === 'myself') {
      updateFormData('recipient', {
        type: 'individual',
        firstName: '',
        lastName: '',
        relationship: '',
        includeWelcomeCard: false,
      });
    }
    
    // Move to next step manually if necessary
    setTimeout(() => {
      if (formData.giftType === type) {
        console.log("Gift type successfully updated, proceeding to next step");
        updateFormData('currentStep' as any, 2); // Move to second step
      } else {
        console.error("Failed to update gift type", {current: formData.giftType, selected: type});
      }
    }, 300);
  };

  return (
    <div className="space-y-8">
      {/* Debug info */}
      <div className="text-xs bg-gray-100 p-2 rounded-md">
        <p>Current selection: {formData.giftType || 'none'}</p>
      </div>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-legacy-green font-playfair">Let's create something meaningful.</h1>
        <p className="text-xl text-legacy-dark/80">
          You've selected <span className="font-medium">{selectedSeries?.display || 'a story series'}</span>. 
          Now let's personalize it to make it truly special.
        </p>
      </div>

      <div className="py-4">
        <h2 className="text-xl font-medium mb-4 text-left">Is this a gift for yourself or someone else?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Button
            type="button"
            variant="outline"
            className={`h-auto min-h-[160px] p-6 text-left flex flex-col items-start justify-start transition-all duration-200 ${
              formData.giftType === 'myself' 
                ? 'border-2 border-legacy-green bg-legacy-green/5 ring-2 ring-legacy-green/20' 
                : 'border-2 border-gray-200 hover:border-legacy-green/50 hover:bg-legacy-green/3'
            }`}
            onClick={() => handleGiftTypeSelect('myself')}
          >
            <div className="w-full space-y-2">
              <div className="font-medium text-lg mb-2">For Myself</div>
              <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-normal">I'm purchasing this subscription for my own enjoyment.</p>
              {formData.giftType === 'myself' && <p className="text-xs text-legacy-green mt-2">✓ Selected</p>}
            </div>
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className={`h-auto min-h-[160px] p-6 text-left flex flex-col items-start justify-start transition-all duration-200 ${
              formData.giftType === 'individual' 
                ? 'border-2 border-legacy-green bg-legacy-green/5 ring-2 ring-legacy-green/20' 
                : 'border-2 border-gray-200 hover:border-legacy-green/50 hover:bg-legacy-green/3'
            }`}
            onClick={() => handleGiftTypeSelect('individual')}
          >
            <div className="w-full space-y-2">
              <div className="font-medium text-lg mb-2">For an Individual</div>
              <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-normal">I'm giving this to one special person.</p>
              {formData.giftType === 'individual' && <p className="text-xs text-legacy-green mt-2">✓ Selected</p>}
            </div>
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className={`h-auto min-h-[160px] p-6 text-left flex flex-col items-start justify-start transition-all duration-200 ${
              formData.giftType === 'couple' 
                ? 'border-2 border-legacy-green bg-legacy-green/5 ring-2 ring-legacy-green/20' 
                : 'border-2 border-gray-200 hover:border-legacy-green/50 hover:bg-legacy-green/3'
            }`}
            onClick={() => handleGiftTypeSelect('couple')}
          >
            <div className="w-full space-y-2">
              <div className="font-medium text-lg mb-2">For a Couple</div>
              <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-normal">A shared gift for two people in a relationship.</p>
              {formData.giftType === 'couple' && <p className="text-xs text-legacy-green mt-2">✓ Selected</p>}
            </div>
          </Button>
        </div>
      </div>

      <div className="bg-legacy-cream/50 p-6 rounded-lg">
        <h3 className="font-medium text-lg mb-2">About {selectedSeries?.display || 'this series'}</h3>
        <p className="text-legacy-dark/80">
          {selectedSeries?.type === 'custom' 
            ? "Your custom edition will be crafted specifically for you, telling a unique story that matters to you or your recipient."
            : selectedSeries?.type === 'concierge'
            ? "Our concierge edition provides a premium, bespoke service with a dedicated writer to help craft your perfect story."
            : "This signature edition contains 12 beautifully crafted cards that will be delivered monthly, celebrating moments that connect with the theme you've chosen."}
        </p>
      </div>

      {/* Add continue button at the bottom */}
      {formData.giftType && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => updateFormData('currentStep' as any, 2)}
            className="px-8 py-2 bg-legacy-green hover:bg-legacy-green/90 text-white"
          >
            Continue
          </Button>
        </div>
      )}
    </div>
  );
};

export default Introduction;
