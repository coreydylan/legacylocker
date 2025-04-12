import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ChevronLeft, Home, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';
import { ShippingAddress, Recipient } from '@/lib/sessionManager';
import AddressAutocomplete, { StructuredAddress } from './inputs/AddressAutocomplete';
import { formatShipToName } from '@/lib/utils/formatShipToName';

const ShippingInfoCard: React.FC = () => {
  const { session, updateSession, nextStep, prevStep } = useSessionStore();
  const recipient: Recipient | undefined = session.recipient;
  const initialAddress: ShippingAddress = recipient?.shippingAddress || {}; 
  
  const [addressString, setAddressString] = useState<string>(initialAddress.full || '');
  const [structuredAddress, setStructuredAddress] = useState<ShippingAddress>(initialAddress);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress | 'shippingName', string>>>({});

  const defaultShippingName = formatShipToName(recipient);
  const initialShippingName = recipient?.shippingNameOverridden 
                                 ? (recipient?.shippingName || '') 
                                 : defaultShippingName;
  const [shippingName, setShippingName] = useState<string>(initialShippingName);

  useEffect(() => {
    const currentRecipient: Recipient | undefined = session.recipient;
    const sessionAddress = currentRecipient?.shippingAddress || {};
    setStructuredAddress(sessionAddress);
    setAddressString(sessionAddress.full || '');

    const newDefaultName = formatShipToName(currentRecipient);
    const currentShippingName = currentRecipient?.shippingNameOverridden
                                 ? (currentRecipient?.shippingName || '')
                                 : newDefaultName;
    setShippingName(currentShippingName);
    if (!currentRecipient?.shippingNameOverridden && currentShippingName !== currentRecipient?.shippingName) {
        updateSession('recipient.shippingName', currentShippingName);    
    }

  }, [session.recipient, updateSession]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof ShippingAddress | 'shippingName', string>> = {};
    if (!structuredAddress.street?.trim()) newErrors.street = 'Street address is required.';
    if (!structuredAddress.city?.trim()) newErrors.city = 'City is required.';
    if (!structuredAddress.state?.trim()) newErrors.state = 'State/Province is required.';
    if (!structuredAddress.postalCode?.trim()) newErrors.postalCode = 'ZIP/Postal code is required.';
    if (!structuredAddress.country?.trim()) newErrors.country = 'Country is required.';
    if (addressString && !structuredAddress.street) {
       newErrors.full = 'Please select a valid address from the suggestions.';
    }
    if (!shippingName.trim()) newErrors.shippingName = 'Shipping name is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSelect = (selected: StructuredAddress) => {
    console.log('ShippingInfoCard: Address selected via autocomplete', selected);
    const updatedAddress: ShippingAddress = selected;
    setStructuredAddress(updatedAddress);
    setAddressString(updatedAddress.full || '');
    updateSession('recipient.shippingAddress', updatedAddress);
    setErrors(prev => ({ 
        ...prev, 
        street: undefined, 
        city: undefined, 
        state: undefined, 
        postalCode: undefined, 
        country: undefined, 
        full: undefined 
    }));
  };

  const handleAddressInputChange = (value: string) => {
    setAddressString(value);
    if (value.trim() === '') {
        const emptyAddress: ShippingAddress = {};
        setStructuredAddress(emptyAddress);
        updateSession('recipient.shippingAddress', emptyAddress);
        setErrors(prev => ({ 
            ...prev, 
            street: undefined, 
            city: undefined, 
            state: undefined, 
            postalCode: undefined, 
            country: undefined, 
            full: undefined 
        }));
    }
  };

  const handleShippingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setShippingName(newName);
    updateSession('recipient.shippingName', newName);
    updateSession('recipient.shippingNameOverridden', true);
    if (errors.shippingName) {
        setErrors(prev => ({ ...prev, shippingName: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentRecipient: Recipient | undefined = session.recipient;
    if (validateForm()) {
      if (!currentRecipient?.shippingNameOverridden) {
          updateSession('recipient.shippingName', shippingName); 
      }
      console.log('ShippingInfoCard: Form validated, moving to next step');
      nextStep();
    } else {
      console.log('ShippingInfoCard: Form validation failed', errors);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-legacy-green mb-4">
          Where should we send their cards?
        </h1>
        <p className="text-lg text-gray-600 px-4 sm:px-0">
          Each card is mailed in a custom archival envelope, then shipped inside a protective mailer to ensure it arrives safely and in great condition.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8"
      >
        <div>
          <h2 className="text-xl font-medium text-legacy-dark mb-4 border-b pb-2">Shipping Info</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shippingName" className="text-legacy-green font-medium">
                Shipping Name
              </Label>
              <Input
                 id="shippingName"
                 type="text"
                 placeholder="Name for the shipping label"
                 value={shippingName}
                 onChange={handleShippingNameChange}
                 className={cn(
                   "h-12 w-full",
                   errors.shippingName ? "border-red-500 focus-visible:ring-red-500" : ""
                 )}
                 aria-invalid={!!errors.shippingName}
                 aria-describedby={errors.shippingName ? "shippingName-error" : undefined}
              />
              {errors.shippingName && (
                 <p id="shippingName-error" className="text-xs text-red-600 pt-1">{errors.shippingName}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="addressAutocomplete" className="text-legacy-green font-medium">
                Shipping Address
              </Label>
              <AddressAutocomplete
                value={addressString} 
                onChange={handleAddressInputChange} 
                onSelect={handleAddressSelect} 
                placeholder="Start typing the recipient's address..."
                error={errors.full || errors.street || errors.city || errors.state || errors.postalCode || errors.country} 
              />
              {structuredAddress.street && !errors.full && (
                <div className="text-sm text-muted-foreground mt-2 pl-1 border-l-2 border-legacy-green/50 ml-1">
                  <p className="pl-3">
                    <strong className="text-gray-700 block mb-0.5">{shippingName}</strong> 
                    {structuredAddress.street}<br />
                    {structuredAddress.city}, {structuredAddress.state} {structuredAddress.postalCode}<br />
                    {structuredAddress.country}
                  </p>
                </div>
              )}
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
            disabled={!shippingName.trim() || !structuredAddress.street || !structuredAddress.city || !structuredAddress.state || !structuredAddress.postalCode || !structuredAddress.country || Object.values(errors).some(e => !!e)}
          >
            Continue
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default ShippingInfoCard; 