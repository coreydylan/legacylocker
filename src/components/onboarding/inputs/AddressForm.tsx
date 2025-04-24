import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { StructuredAddress } from './AddressAutocomplete';

interface AddressFormProps {
  address: StructuredAddress;
  onChange: (address: StructuredAddress) => void;
  className?: string;
  error?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onChange,
  className,
  error
}) => {
  const handleChange = (field: keyof StructuredAddress, value: string) => {
    onChange({
      ...address,
      [field]: value
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-2">
        <Label htmlFor="street" className="text-legacy-green font-medium">Street Address</Label>
        <Input
          id="street"
          value={address.street || ''}
          onChange={(e) => handleChange('street', e.target.value)}
          className={cn(
            "h-12 w-full bg-legacy-green/5 border-0 rounded-md px-3 py-2",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            error ? "ring-2 ring-red-500 focus-visible:ring-red-500" : ""
          )}
          placeholder="Street address"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-legacy-green font-medium">City</Label>
          <Input
            id="city"
            value={address.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className={cn(
              "h-12 w-full bg-legacy-green/5 border-0 rounded-md px-3 py-2",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              error ? "ring-2 ring-red-500 focus-visible:ring-red-500" : ""
            )}
            placeholder="City"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state" className="text-legacy-green font-medium">State</Label>
          <Input
            id="state"
            value={address.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            className={cn(
              "h-12 w-full bg-legacy-green/5 border-0 rounded-md px-3 py-2",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              error ? "ring-2 ring-red-500 focus-visible:ring-red-500" : ""
            )}
            placeholder="State"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode" className="text-legacy-green font-medium">Postal Code</Label>
          <Input
            id="postalCode"
            value={address.postalCode || ''}
            onChange={(e) => handleChange('postalCode', e.target.value)}
            className={cn(
              "h-12 w-full bg-legacy-green/5 border-0 rounded-md px-3 py-2",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              error ? "ring-2 ring-red-500 focus-visible:ring-red-500" : ""
            )}
            placeholder="Postal code"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-legacy-green font-medium">Country</Label>
          <Input
            id="country"
            value={address.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
            className={cn(
              "h-12 w-full bg-legacy-green/5 border-0 rounded-md px-3 py-2",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              error ? "ring-2 ring-red-500 focus-visible:ring-red-500" : ""
            )}
            placeholder="Country"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default AddressForm; 