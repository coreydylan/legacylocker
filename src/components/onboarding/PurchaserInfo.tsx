import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Mail, ChevronLeft, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';
import { useSessionManager } from '@/hooks/useSessionManager';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { purchaserInfoSchema, PurchaserInfoFormValues } from '@/schemas/purchaserInfoSchema';
import { useDebouncedCallback } from 'use-debounce';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import useMediaQuery from '@/hooks/useMediaQuery';

const PurchaserInfo: React.FC = () => {
  console.log('PURCHASER INFO COMPONENT RENDERED');
  const { saveSessionData } = useSessionManager();
  const { session, updateSession, updateValidationStatus, isCurrentStepValid } = useSessionStore();
  const { goNext, goBack } = useOnboardingNavigation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors, isValid } 
  } = useForm<PurchaserInfoFormValues>({
    resolver: zodResolver(purchaserInfoSchema),
    defaultValues: {
      fullName: session.purchaser?.fullName || '',
      email: session.purchaser?.email || '',
    },
    mode: 'onChange'
  });

  // --- Update store validation status based on form validity ---
  useEffect(() => {
    console.log(`PurchaserInfo: formState.isValid changed to: ${isValid}, updating store...`);
    updateValidationStatus(isValid);
  }, [isValid, updateValidationStatus]);
  // --- End validation status update ---

  // --- Debounced Autosave Logic --- 
  const watchedFields = useWatch({ control });

  const debouncedSave = useDebouncedCallback(async () => {
    const currentData = { 
      fullName: watchedFields.fullName, 
      email: watchedFields.email 
    };
    if (useSessionStore.getState().sessionMetadata.isActive) {
      console.log('[Autosave] PurchaserInfo: Triggering save with data:', currentData);
      updateSession('purchaser', currentData);
      try {
        await saveSessionData();
        console.log('[Autosave] PurchaserInfo: Session saved via hook.');
      } catch (error) {
        console.error('[Autosave] PurchaserInfo: Failed to save session via hook:', error);
      }
    } else {
      console.log('[Autosave] PurchaserInfo: Skipping save, session not active yet.');
    }
  }, 1000);

  useEffect(() => {
    if (watchedFields.fullName && watchedFields.email) {
      console.log('[Autosave] PurchaserInfo: Field changed, debouncing save...');
      debouncedSave();
    }
  }, [watchedFields.fullName, watchedFields.email, debouncedSave]);
  // --- End Autosave Logic --- 

  const onSubmit = (data: PurchaserInfoFormValues) => { 
    console.log('[SUBMIT] PurchaserInfo: onSubmit started.');
    
    updateSession('purchaser', data);
    console.log('[SUBMIT] PurchaserInfo: Purchaser info updated locally.', data);
    
    console.log('[SUBMIT] PurchaserInfo: Cancelling pending autosave...');
    debouncedSave.cancel();
    
    console.log('[SUBMIT] PurchaserInfo: Calling goNext()...');
    goNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto px-4 md:px-0 py-4 md:py-8"
    >
      <div className="mb-6 md:mb-8 md:text-left">
        <h2 className="text-xl md:text-3xl font-semibold text-legacy-dark mb-2">Your Information</h2>
        <p className="text-sm md:text-lg text-muted-foreground">
          Please provide your contact information so we can keep you updated on your order.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className={cn(
            "flex items-center h-12 w-full rounded-md border border-input bg-background pl-3 pr-3",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            errors.fullName && "border-red-500 focus-within:ring-red-500"
          )}>
            <User className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
            <input
              id="fullName"
              placeholder="Your full name"
              className={cn(
                "flex-1 w-full h-full p-0 border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground",
                "text-base md:text-sm"
              )}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className={cn(
            "flex items-center h-12 w-full rounded-md border border-input bg-background pl-3 pr-3",
            "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            errors.email && "border-red-500 focus-within:ring-red-500"
          )}>
            <Mail className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              className={cn(
                "flex-1 w-full h-full p-0 border-0 bg-transparent focus:outline-none focus:ring-0 placeholder:text-muted-foreground",
                "text-base md:text-sm"
              )}
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="p-4 rounded-md bg-legacy-cream/20 border border-legacy-green/15 space-y-2 text-sm">
          <p className="text-legacy-dark/90 leading-relaxed"> 
            We'll send a magic link to this email so you can easily resume customizing anytime.
            We only use this email for your order updates and the magic link... 
            <span className="italic">unless you'd like to stay in touch?</span>
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <Checkbox 
              id="mailingListOptIn" 
              className="data-[state=checked]:bg-legacy-green data-[state=checked]:border-legacy-green" 
            />
            <Label 
              htmlFor="mailingListOptIn" 
              className="text-sm font-normal text-gray-600 leading-snug cursor-pointer"
            >
              Yes, occasional updates (max once a month) ✨
            </Label>
          </div>
        </div>

        {/* Conditionally render desktop buttons */}
        {!isMobile && (
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={!isCurrentStepValid}
              className="bg-legacy-green hover:bg-legacy-green/90"
            >
              Continue
            </Button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default PurchaserInfo;
