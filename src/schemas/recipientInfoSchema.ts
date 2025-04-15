import { z } from 'zod';

// Helper for date validation with year range
const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear(); // Current year

const dateWithYearValidation = z.preprocess((arg) => {
    // Allow empty strings or undefined to pass through (for optional fields)
    if (arg === '' || arg === null || arg === undefined) return undefined;
    // If it's already a Date object, return it
    if (arg instanceof Date) return arg;
    // Try parsing the string
    if (typeof arg === 'string') {
        try {
            // Attempt to parse common formats (YYYY-MM-DD is expected from JollyDateField)
            const date = new Date(arg + 'T00:00:00'); // Add time to avoid timezone issues with Date constructor
            if (!isNaN(date.getTime())) {
                return date;
            }
        } catch (e) { /* Ignore parsing errors, handled by refine below */ }
    }
    return undefined; // Return undefined if parsing fails or input is invalid type
}, z.date()
    .min(new Date(MIN_YEAR, 0, 1), { message: `Year must be ${MIN_YEAR} or later` })
    .max(new Date(MAX_YEAR, 11, 31), { message: `Year cannot be in the future` })
    .optional()
    .nullable() // Allow null/undefined from preprocess to pass
);

// Base schema for common fields
const baseRecipientSchema = z.object({
  relationship: z.string().min(1, { message: 'Relationship is required' }),
  includeWelcomeCard: z.boolean().optional().default(false),
  welcomeMessage: z.string().optional(),
});

// Individual recipient schema
const individualRecipientSchema = baseRecipientSchema.extend({
  type: z.literal('individual'),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  birthday: dateWithYearValidation, // Use custom validator
});

// Couple recipient schema
const coupleRecipientSchema = baseRecipientSchema.extend({
  type: z.literal('couple'),
  recipient1FirstName: z.string().min(1, { message: 'First name (1) is required' }),
  recipient1LastName: z.string().min(1, { message: 'Last name (1) is required' }),
  recipient2FirstName: z.string().min(1, { message: 'First name (2) is required' }),
  recipient2LastName: z.string().min(1, { message: 'Last name (2) is required' }),
  recipient1Birthday: dateWithYearValidation, // Use custom validator
  recipient2Birthday: dateWithYearValidation, // Use custom validator
  anniversary: dateWithYearValidation, // Use custom validator
});

// Discriminated union for recipient types
export const recipientInfoSchema = z.discriminatedUnion('type', [
  individualRecipientSchema,
  coupleRecipientSchema
]);

export type RecipientInfoFormValues = z.infer<typeof recipientInfoSchema>;