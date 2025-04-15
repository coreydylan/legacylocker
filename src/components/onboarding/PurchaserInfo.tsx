import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const { session, updateSession } = useSessionStore();
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
    goNext();
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-legacy-green mb-4">
          Your Information
        </h1>
        <p className="text-lg text-gray-600">
          Please provide your details so we can personalize your experience.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          {/* Full Name Input */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-legacy-green font-medium">
              Full Name
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="fullName"
                type="text"
                placeholder="Your full name"
                className={cn(
                  "!px-0 !pl-12 h-12 w-full",
                  errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
                {...register('fullName')}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />
            </div>
            {errors.fullName && (
              <p id="fullName-error" className="text-xs text-red-600 pt-1">{errors.fullName.message}</p>
            )}
          </div>
          
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-legacy-green font-medium">
              Email Address
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className={cn(
                  "!px-0 !pl-12 h-12 w-full",
                  errors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
                {...register('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-xs text-red-600 pt-1">{errors.email.message}</p>
            )}
            <p className="text-xs text-gray-500 pt-1">
              We'll use this to save your progress and contact you about your order.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8">
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

export default PurchaserInfo;
