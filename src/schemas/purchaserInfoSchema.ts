import { z } from 'zod';

export const purchaserInfoSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

export type PurchaserInfoFormValues = z.infer<typeof purchaserInfoSchema>;