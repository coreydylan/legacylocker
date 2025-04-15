import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Mail, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { purchaserInfoSchema, PurchaserInfoFormValues } from '@/schemas/purchaserInfoSchema';

const PurchaserInfo: React.FC = () => {
  const { session, updateSession, startSession, sessionMetadata } = useSessionStore();
  const { goNext, goBack } = useOnboardingNavigation();
  
  // Initialize form with react-hook-form and zod validation
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm<PurchaserInfoFormValues>({
    resolver: zodResolver(purchaserInfoSchema),
    defaultValues: {
      fullName: session.purchaser?.fullName || '',
      email: session.purchaser?.email || '',
    },
    mode: 'onChange'
  });

  const onSubmit = (data: PurchaserInfoFormValues) => {
    console.log('PurchaserInfo: Form validated, saving data:', data);
    updateSession('purchaser', data);
    
    // Activate the session if it's not already active, using editionFlow.type
    const editionType = session.editionFlow?.type;
    if (!sessionMetadata.isActive && editionType) {
      console.log('PurchaserInfo: Activating session with edition type:', editionType);
      startSession(editionType);
    }
    
    goNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-legacy-dark mb-2">Your Information</h2>
        <p className="text-muted-foreground">
          Please provide your contact information so we can keep you updated on your order.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            disabled={!isValid}
            className="bg-legacy-green hover:bg-legacy-green/90"
          >
            Continue
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default PurchaserInfo;
