import { z } from 'zod';

export const envelopePersonalizationSchema = z.object({
  cardAddresseeName: z.string().min(1, { message: 'Envelope addressee name is required' }),
  cardAddresseeNameOverridden: z.boolean().optional().default(false),
});

export type EnvelopePersonalizationFormValues = z.infer<typeof envelopePersonalizationSchema>;