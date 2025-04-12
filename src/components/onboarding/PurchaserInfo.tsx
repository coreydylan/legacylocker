import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { User, Mail } from 'lucide-react';
import { useSessionStore } from '@/lib/sessionStore';
import { cn } from '@/lib/utils';

const PurchaserInfo: React.FC = () => {
  const { session, updateSession, nextStep } = useSessionStore();
  const purchaser = session.purchaser;

  const isEmailValid = purchaser.email.trim() !== '' &&
                       /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(purchaser.email);
  const isNameValid = purchaser.fullName.trim() !== '';
  const isValid = isNameValid && isEmailValid;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    updateSession(`purchaser.${id}`, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("PurchaserInfo: Submit attempt...");
    
    const currentName = session.purchaser.fullName;
    const currentEmail = session.purchaser.email;
    const currentEmailValid = currentEmail.trim() !== '' && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(currentEmail);
    const currentNameValid = currentName.trim() !== '';
    const currentIsValid = currentNameValid && currentEmailValid;

    console.log(`  Name: '${currentName}' (Valid: ${currentNameValid})`);
    console.log(`  Email: '${currentEmail}' (Valid: ${currentEmailValid})`);
    console.log(`  Overall Valid (re-checked): ${currentIsValid}`);

    if (currentIsValid) {
      console.log("  Form is valid. Proceeding to next step.");
      nextStep();
    } else {
      console.log("  Form is invalid. Aborting step change.");
    }
  };

  return (
    <div className="max-w-lg mx-auto py-12">
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
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="fullName"
                type="text"
                placeholder="Your full name"
                value={purchaser.fullName}
                onChange={handleInputChange}
                className={cn(
                  "pl-10 h-12",
                  !isNameValid && purchaser.fullName.length > 0 ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
                required
                aria-invalid={!isNameValid}
              />
            </div>
            {!isNameValid && purchaser.fullName.length > 0 && (
              <p className="text-xs text-red-600 pt-1">Please enter your full name.</p>
            )}
          </div>
          
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-legacy-green font-medium">
              Email Address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={purchaser.email}
                onChange={handleInputChange}
                className={cn(
                  "pl-10 h-12",
                  !isEmailValid && purchaser.email.length > 0 ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
                required
                aria-invalid={!isEmailValid}
              />
            </div>
            {!isEmailValid && purchaser.email.length > 0 && (
              <p className="text-xs text-red-600 pt-1">Please enter a valid email address.</p>
            )}
            <p className="text-xs text-gray-500 pt-1">
              We'll use this to save your progress and contact you about your order.
            </p>
          </div>
        </div>

        <div className="pt-8 text-center">
          <Button
            type="submit"
            disabled={!isValid}
            className={cn(
              "px-8 py-2 text-base font-medium",
              "bg-legacy-green hover:bg-legacy-green/90 text-white",
              "disabled:bg-gray-300 disabled:cursor-not-allowed"
            )}
          >
            Continue
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default PurchaserInfo;
