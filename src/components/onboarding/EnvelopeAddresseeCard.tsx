import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';
import { Recipient } from '@/lib/sessionManager';
import { formatCardAddresseeName } from '@/lib/utils/formatCardAddresseeName';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { envelopePersonalizationSchema, EnvelopePersonalizationFormValues } from '@/schemas/envelopePersonalizationSchema';

const EnvelopeAddresseeCard: React.FC = () => {
  const { session, updateSession } = useSessionStore();
  const { goNext, goBack } = useOnboardingNavigation();
  const recipient: Recipient | undefined = session.recipient;
  
  // Get default addressee name from recipient info
  const defaultAddresseeName = formatCardAddresseeName(session);
  
  // Get initial values for the form
  const getDefaultValues = (): EnvelopePersonalizationFormValues => {
    const initialAddresseeName = recipient?.cardAddresseeNameOverridden 
      ? (recipient?.cardAddresseeName || '') 
      : defaultAddresseeName;
      
    return {
      cardAddresseeName: initialAddresseeName,
      cardAddresseeNameOverridden: recipient?.cardAddresseeNameOverridden || false,
    };
  };
  
  // Initialize form with react-hook-form and zod validation
  const { 
    handleSubmit, 
    setValue,
    formState: { errors, isValid },
    watch
  } = useForm<EnvelopePersonalizationFormValues>({
    resolver: zodResolver(envelopePersonalizationSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  });
  
  // Update addressee name when recipient info changes
  useEffect(() => {
    const currentRecipient: Recipient | undefined = session.recipient;
    
    // Only update if not overridden by user
    if (!currentRecipient?.cardAddresseeNameOverridden) {
      const newDefaultName = formatCardAddresseeName(session);
      setValue('cardAddresseeName', newDefaultName, { shouldValidate: true });
    }
  }, [session, setValue]);

  // Handle addressee name change
  const handleAddresseeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cardAddresseeName', e.target.value, { shouldValidate: true });
    setValue('cardAddresseeNameOverridden', true);
  };

  // Form submission handler
  const onSubmit = (data: EnvelopePersonalizationFormValues) => {
    console.log('EnvelopeAddresseeCard: Form validated, saving data:', data);
    
    // Update session with envelope personalization info
    updateSession('recipient.cardAddresseeName', data.cardAddresseeName);
    updateSession('recipient.cardAddresseeNameOverridden', data.cardAddresseeNameOverridden);
    
    goNext();
  };

  const previewName = watch('cardAddresseeName') || defaultAddresseeName || "Recipient Name";

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-legacy-green mb-4">
          How should we address the envelope?
        </h1>
        <p className="text-lg text-gray-600 px-4 sm:px-0">
          Each card is delivered inside a custom-printed archival envelope. Let us know how you'd like it to appear.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div className="space-y-2">
          <Label htmlFor="cardAddresseeName" className="text-legacy-green font-medium">
            Name on Envelope
          </Label>
          <Input
            id="cardAddresseeName"
            type="text"
            placeholder="e.g., James and Anne or Grandma Betty"
            value={watch('cardAddresseeName')}
            onChange={handleAddresseeNameChange}
            className={cn(
              "h-12 w-full",
              errors.cardAddresseeName ? "border-red-500 focus-visible:ring-red-500" : ""
            )}
            aria-invalid={!!errors.cardAddresseeName}
            aria-describedby={errors.cardAddresseeName ? "cardAddresseeName-error" : undefined}
          />
          {errors.cardAddresseeName && (
            <p id="cardAddresseeName-error" className="text-xs text-red-600 pt-1">{errors.cardAddresseeName.message}</p>
          )}
        </div>

        <div className="mt-6">
          <div className="relative w-full max-w-md mx-auto aspect-[16/9] bg-legacy-cream p-6 rounded-lg shadow-md overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center p-4"> 
              <p className="font-homemade-apple text-2xl sm:text-3xl text-legacy-dark text-center break-words">
                {previewName} 
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            className="text-legacy-dark/60 hover:text-legacy-green border-legacy-cream"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            type="submit"
            className={cn(
              "px-8 py-2 text-base font-medium",
              "bg-legacy-green hover:bg-legacy-green/90 text-white",
              "disabled:bg-gray-300 disabled:cursor-not-allowed"
            )}
            disabled={!isValid}
          >
            Continue
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default EnvelopeAddresseeCard; 