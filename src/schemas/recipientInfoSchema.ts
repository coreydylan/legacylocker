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

// Define individual recipient schema
const individualSchema = baseRecipientSchema.extend({
  type: z.literal('individual'),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  // Expect optional string for birthday
  birthday: z.string().optional().nullable(), 
});

// Define couple recipient schema
const coupleSchema = baseRecipientSchema.extend({
  type: z.literal('couple'),
  recipient1FirstName: z.string().min(1, "First recipient's first name is required"),
  recipient1LastName: z.string().min(1, "First recipient's last name is required"),
  recipient2FirstName: z.string().min(1, "Second recipient's first name is required"),
  recipient2LastName: z.string().min(1, "Second recipient's last name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  // Expect optional strings for dates
  recipient1Birthday: z.string().optional().nullable(),
  recipient2Birthday: z.string().optional().nullable(),
  anniversary: z.string().optional().nullable(),
  includeWelcomeCard: z.boolean().optional(),
  welcomeMessage: z.string().optional(),
});

// Discriminated union based on the type field
export const recipientInfoSchema = z.discriminatedUnion('type', [
  individualSchema,
  coupleSchema,
]);

export type RecipientInfoFormValues = z.infer<typeof recipientInfoSchema>;