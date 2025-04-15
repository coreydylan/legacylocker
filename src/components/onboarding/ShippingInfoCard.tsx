import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/lib/sessionStore';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';
import { ShippingAddress, Recipient } from '@/lib/sessionManager';
import AddressAutocomplete, { StructuredAddress } from './inputs/AddressAutocomplete';
import { formatShipToName } from '@/lib/utils/formatShipToName';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingInfoSchema, ShippingInfoFormValues } from '@/schemas/shippingInfoSchema';

const ShippingInfoCard: React.FC = () => {
  const { session, updateSession } = useSessionStore();
  const { goNext, goBack } = useOnboardingNavigation();
  const recipient: Recipient | undefined = session.recipient;
  
  // Get default shipping name from recipient info
  const defaultShippingName = formatShipToName(session);
  
  // Get initial values for the form
  const getDefaultValues = (): ShippingInfoFormValues => {
    const initialShippingName = recipient?.shippingNameOverridden 
      ? (recipient?.shippingName || '') 
      : defaultShippingName;
      
    return {
      shippingName: initialShippingName,
      shippingNameOverridden: recipient?.shippingNameOverridden || false,
      shippingAddress: recipient?.shippingAddress || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        full: ''
      }
    };
  };
  
  // State for address autocomplete
  const [addressString, setAddressString] = useState<string>(
    recipient?.shippingAddress?.full || ''
  );
  
  // Initialize form with react-hook-form and zod validation
  const { 
    register, 
    handleSubmit, 
    control,
    setValue,
    formState: { errors, isValid },
    watch
  } = useForm<ShippingInfoFormValues>({
    resolver: zodResolver(shippingInfoSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  });
  
  // Watch the shipping address to update the UI
  const shippingAddress = watch('shippingAddress');
  
  // Update shipping name when recipient info changes
  useEffect(() => {
    const currentRecipient: Recipient | undefined = session.recipient;
    const newDefaultName = formatShipToName(session);
    
    // Only update if not overridden by user
    if (!currentRecipient?.shippingNameOverridden) {
      setValue('shippingName', newDefaultName);
    }
  }, [session, setValue]);

  // Handle address selection from autocomplete
  const handleAddressSelect = (selected: StructuredAddress) => {
    console.log('ShippingInfoCard: Address selected via autocomplete', selected);
    setAddressString(selected.full || '');
    
    // Update form values
    setValue('shippingAddress', {
      street: selected.street || '',
      city: selected.city || '',
      state: selected.state || '',
      postalCode: selected.postalCode || '',
      country: selected.country || '',
      full: selected.full || ''
    }, { shouldValidate: true });
  };

  // Handle address input change
  const handleAddressInputChange = (value: string) => {
    setAddressString(value);
    if (value.trim() === '') {
      // Clear address fields if input is empty
      setValue('shippingAddress', {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        full: ''
      }, { shouldValidate: true });
    }
  };

  // Handle shipping name change
  const handleShippingNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('shippingName', e.target.value, { shouldValidate: true });
    setValue('shippingNameOverridden', true);
  };

  // Form submission handler
  const onSubmit = (data: ShippingInfoFormValues) => {
    console.log('ShippingInfoCard: Form validated, saving data:', data);
    
    // Update session with shipping info
    updateSession('recipient.shippingName', data.shippingName);
    updateSession('recipient.shippingNameOverridden', data.shippingNameOverridden);
    updateSession('recipient.shippingAddress', data.shippingAddress);
    
    goNext();
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
        onSubmit={handleSubmit(onSubmit)}
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
                value={watch('shippingName')}
                onChange={handleShippingNameChange}
                className={cn(
                  "h-12 w-full",
                  errors.shippingName ? "border-red-500 focus-visible:ring-red-500" : ""
                )}
                aria-invalid={!!errors.shippingName}
                aria-describedby={errors.shippingName ? "shippingName-error" : undefined}
              />
              {errors.shippingName && (
                <p id="shippingName-error" className="text-xs text-red-600 pt-1">{errors.shippingName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="addressAutocomplete" className="text-legacy-green font-medium">
                Shipping Address
              </Label>
              <Controller
                name="shippingAddress.full"
                control={control}
                render={({ field }) => (
                  <AddressAutocomplete
                    value={addressString}
                    onChange={handleAddressInputChange}
                    onSelect={handleAddressSelect}
                    placeholder="Start typing the recipient's address..."
                    error={errors.shippingAddress?.street?.message || 
                           errors.shippingAddress?.city?.message || 
                           errors.shippingAddress?.state?.message || 
                           errors.shippingAddress?.postalCode?.message || 
                           errors.shippingAddress?.country?.message}
                  />
                )}
              />
              
              {shippingAddress.street && !errors.shippingAddress?.street && (
                <div className="text-sm text-muted-foreground mt-2 pl-1 border-l-2 border-legacy-green/50 ml-1">
                  <p className="pl-3">
                    <strong className="text-gray-700 block mb-0.5">{watch('shippingName')}</strong> 
                    {shippingAddress.street}<br />
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}<br />
                    {shippingAddress.country}
                  </p>
                </div>
              )}
              
              {(errors.shippingAddress?.street || 
                errors.shippingAddress?.city || 
                errors.shippingAddress?.state || 
                errors.shippingAddress?.postalCode || 
                errors.shippingAddress?.country) && (
                <p className="text-xs text-red-600 pt-1">
                  Please select a complete address from the suggestions.
                </p>
              )}
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
          >
            Continue
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default ShippingInfoCard; 