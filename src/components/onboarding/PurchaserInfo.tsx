import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Mail, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';

const PurchaserInfo: React.FC = () => {
  const { session, updateSession, nextStep, prevStep } = useSessionStore();
  const purchaser = session.purchaser || { fullName: '', email: '' };

  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  const validateForm = () => {
    const newErrors: { fullName?: string; email?: string } = {};
    if (!purchaser.fullName?.trim()) {
      newErrors.fullName = 'Full name is required.';
    }
    if (!purchaser.email?.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(purchaser.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    updateSession(`purchaser.${id}`, value);
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('PurchaserInfo: Form validated, moving to next step');
      nextStep();
    } else {
      console.log('PurchaserInfo: Form validation failed');
    }
  };
  
  useEffect(() => {
    if (purchaser.fullName || purchaser.email) {
      validateForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        onSubmit={handleSubmit}
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
                value={purchaser.fullName || ''}
                onChange={handleInputChange}
                className={cn(
                  "!px-0 !pl-12 h-12 w-full",
                  errors.fullName && purchaser.fullName?.length > 0 ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
                required
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />
            </div>
            {errors.fullName && purchaser.fullName?.length > 0 && (
              <p id="fullName-error" className="text-xs text-red-600 pt-1">{errors.fullName}</p>
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
                value={purchaser.email || ''}
                onChange={handleInputChange}
                className={cn(
                  "!px-0 !pl-12 h-12 w-full",
                  errors.email && purchaser.email?.length > 0 ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && purchaser.email?.length > 0 && (
              <p id="email-error" className="text-xs text-red-600 pt-1">{errors.email}</p>
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
            onClick={prevStep}
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
            disabled={Object.keys(errors).some(key => errors[key as keyof typeof errors])}
          >
            Continue
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default PurchaserInfo;
