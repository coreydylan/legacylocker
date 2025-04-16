import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';
import { Recipient } from '@/lib/sessionManager';
import { formatCardAddresseeName } from '@/lib/utils/formatCardAddresseeName';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { envelopePersonalizationSchema, EnvelopePersonalizationFormValues } from '@/schemas/envelopePersonalizationSchema';
import { useDebouncedCallback } from 'use-debounce';
import useMediaQuery from '@/hooks/useMediaQuery';

const EnvelopeAddresseeCard: React.FC = () => {
  const { saveSessionData } = useSessionManager();
  const { session, updateSession, updateValidationStatus, isCurrentStepValid } = useSessionStore();
  const { goNext, goBack } = useOnboardingNavigation();
  const recipient: Recipient | undefined = session.recipient;
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const defaultAddresseeName = formatCardAddresseeName(session);
  
  const getDefaultValues = (): EnvelopePersonalizationFormValues => {
    const initialAddresseeName = recipient?.cardAddresseeNameOverridden 
      ? (recipient?.cardAddresseeName || '') 
      : defaultAddresseeName;
    return {
      cardAddresseeName: initialAddresseeName,
      cardAddresseeNameOverridden: recipient?.cardAddresseeNameOverridden || false,
    };
  };
  
  const { 
    handleSubmit, 
    setValue,
    control,
    formState: { errors, isValid },
    watch
  } = useForm<EnvelopePersonalizationFormValues>({
    resolver: zodResolver(envelopePersonalizationSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  });
  
  const watchedFields = useWatch({ control });

  const debouncedSave = useDebouncedCallback(async () => {
    if (!useSessionStore.getState().sessionMetadata.isActive) {
      console.log('[Autosave] EnvelopeAddresseeCard: Skipped – session not active');
      return;
    }
    const currentData = watchedFields as EnvelopePersonalizationFormValues;
    console.log('[Autosave] EnvelopeAddresseeCard: Triggering save with data:', currentData);
    updateSession('recipient.cardAddresseeName', currentData.cardAddresseeName);
    updateSession('recipient.cardAddresseeNameOverridden', currentData.cardAddresseeNameOverridden);
    try {
      await saveSessionData();
      console.log('[Autosave] EnvelopeAddresseeCard: Success via hook');
    } catch (error) {
      console.error('[Autosave] EnvelopeAddresseeCard: Failed via hook:', error);
    }
  }, 1000);

  useEffect(() => {
    console.log('[Autosave] EnvelopeAddresseeCard: Field changed, debouncing save...');
    debouncedSave();
  }, [watchedFields, debouncedSave]); 

  useEffect(() => {
    const currentRecipient: Recipient | undefined = session.recipient;
    if (!currentRecipient?.cardAddresseeNameOverridden) {
      const newDefaultName = formatCardAddresseeName(session);
      setValue('cardAddresseeName', newDefaultName, { shouldValidate: true });
    }
  }, [session, setValue]);

  const handleAddresseeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cardAddresseeName', e.target.value, { shouldValidate: true });
    setValue('cardAddresseeNameOverridden', true);
  };

  const onSubmit = async (data: EnvelopePersonalizationFormValues) => {
    console.log('EnvelopeAddresseeCard: Form validated, onSubmit triggered.');
    debouncedSave.cancel();
    
    updateSession('recipient.cardAddresseeName', data.cardAddresseeName);
    updateSession('recipient.cardAddresseeNameOverridden', data.cardAddresseeNameOverridden);
    
    try {
      await saveSessionData(); 
      console.log('EnvelopeAddresseeCard: Final session save on submit successful via hook.');
    } catch (error) {
      console.error('EnvelopeAddresseeCard: Failed to save session on submit via hook:', error);
    }
    
    goNext();
  };

  const previewName = watch('cardAddresseeName') || defaultAddresseeName || "Recipient Name";

  useEffect(() => {
    console.log(`EnvelopeAddresseeCard: formState.isValid changed to: ${isValid}, updating store...`);
    updateValidationStatus(isValid);
  }, [isValid, updateValidationStatus]);

  return (
    <div className="max-w-xl mx-auto py-4 md:py-8 px-4 md:px-0">
      <div className="mb-6 md:mb-10 text-left md:text-center">
        <h1 className="text-xl md:text-3xl font-semibold text-legacy-green mb-3 md:mb-4">
          How should we address the envelope?
        </h1>
        <p className="text-sm md:text-lg text-gray-600 px-4 sm:px-0">
          Each card is delivered inside a custom-printed archival envelope. Let us know how you'd like it to appear.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 md:space-y-8"
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

        {!isMobile && (
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
              disabled={!isCurrentStepValid}
          >
            Continue
          </Button>
        </div>
        )}
      </motion.form>
    </div>
  );
};

export default EnvelopeAddresseeCard; 