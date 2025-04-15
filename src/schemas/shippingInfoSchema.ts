import { z } from 'zod';

export const shippingAddressSchema = z.object({
  street: z.string().min(1, { message: 'Street address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State/Province is required' }),
  postalCode: z.string().min(1, { message: 'ZIP/Postal code is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  full: z.string().optional(),
});

export const shippingInfoSchema = z.object({
  shippingName: z.string().min(1, { message: 'Shipping name is required' }),
  shippingNameOverridden: z.boolean().optional().default(false),
  shippingAddress: shippingAddressSchema,
});

export type ShippingInfoFormValues = z.infer<typeof shippingInfoSchema>;