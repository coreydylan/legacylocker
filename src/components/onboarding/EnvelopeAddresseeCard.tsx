import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';
import { Recipient } from '@/lib/sessionManager';
import { formatShipToName } from '@/lib/utils/formatShipToName';

const EnvelopeAddresseeCard: React.FC = () => {
  const { session, updateSession, nextStep, prevStep } = useSessionStore();
  const recipient: Recipient | undefined = session.recipient;

  const defaultAddresseeName = formatShipToName(session);
  
  const initialName = recipient?.cardAddresseeNameOverridden 
                        ? (recipient?.cardAddresseeName || '') 
                        : defaultAddresseeName;
  const [addresseeName, setAddresseeName] = useState<string>(initialName);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const currentRecipient: Recipient | undefined = session.recipient;
    const newDefaultName = formatShipToName(session);
    const currentName = currentRecipient?.cardAddresseeNameOverridden
                         ? (currentRecipient?.cardAddresseeName || '')
                         : newDefaultName;
    setAddresseeName(currentName);
    if (!currentRecipient?.cardAddresseeNameOverridden && currentName !== currentRecipient?.cardAddresseeName) {
        updateSession('recipient.cardAddresseeName', currentName);
    }
    setError(undefined); 
  }, [session, updateSession]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setAddresseeName(newName);
    updateSession('recipient.cardAddresseeName', newName);
    updateSession('recipient.cardAddresseeNameOverridden', true);
    if (!newName.trim()) {
      setError('Envelope addressee name cannot be empty.');
    } else {
      setError(undefined);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentRecipient: Recipient | undefined = session.recipient;
    const finalName = addresseeName.trim();

    if (!finalName) {
      setError('Envelope addressee name cannot be empty.');
      return;
    }
    
    if (!currentRecipient?.cardAddresseeNameOverridden) {
        updateSession('recipient.cardAddresseeName', finalName); 
    }
    
    console.log('EnvelopeAddresseeCard: Moving to next step');
    nextStep();
  };

  const previewName = addresseeName || defaultAddresseeName || "Recipient Name";

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
        onSubmit={handleSubmit}
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
            value={addresseeName}
            onChange={handleInputChange}
            className={cn(
              "h-12 w-full",
              error ? "border-red-500 focus-visible:ring-red-500" : ""
            )}
            aria-invalid={!!error}
            aria-describedby={error ? "addresseeName-error" : undefined}
          />
          {error && (
            <p id="addresseeName-error" className="text-xs text-red-600 pt-1">{error}</p>
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
            disabled={!addresseeName.trim() || !!error}
          >
            Continue
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default EnvelopeAddresseeCard; 