import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, ChevronLeft } from 'lucide-react';
import { useSessionStore } from '@/lib/sessionStore';
import { useOnboardingNavigation } from '@/hooks/useOnboardingNavigation';
import { motion } from 'framer-motion';
import { JollyDateField } from '@/components/ui/date-field';
import { parseDate } from '@internationalized/date';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipientInfoSchema, RecipientInfoFormValues } from '@/schemas/recipientInfoSchema';
import { cn } from '@/lib/utils';
import { CalendarDate, DateValue } from '@internationalized/date';
import { useDebouncedCallback } from 'use-debounce';
import { saveSessionToSupabase } from '@/lib/sessionService';
import { useToast } from '@/components/ui/use-toast';
import useMediaQuery from '@/hooks/useMediaQuery';

const INDIVIDUAL_RELATIONSHIPS = [
  'Parent',
  'Mom',
  'Dad',
  'Child',
  'Sibling',
  'Friend',
  'Partner',
  'Spouse',
  'Grandparent',
  'Grandma',
  'Grandpa',
  'Grandchild',
  'Colleague',
  'Mentor',
  'Other'
] as const;

const COUPLE_RELATIONSHIPS = [
  'Parents',
  'Friends',
  'Family Members',
  'Colleagues',
  'Other'
] as const;

const RecipientInfo: React.FC = () => {
  const { session, updateSession, updateValidationStatus, isCurrentStepValid } = useSessionStore();
  const { goNext, goBack } = useOnboardingNavigation();
  const recipientType = session.recipientType;
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Helper to safely convert CalendarDate to ISO string
  const dateToISOString = (date: DateValue | null | undefined): string | null => {
    if (!date) return null;
    try {
      // Convert CalendarDate/DateValue to a standard JS Date object first
      const jsDate = new Date(date.year, date.month - 1, date.day); // Use constructor
      return jsDate.toISOString();
    } catch (e) {
      console.error("Error converting date to ISO string:", e);
      return null;
    }
  };
  
  // Helper to safely parse ISO string or YYYY-MM-DD to CalendarDate
  const parseDateToCalendarDate = (dateStr: string | null | undefined): CalendarDate | undefined => {
    console.log(`RecipientInfo: parseDateToCalendarDate called with: '${dateStr}'`);
    if (!dateStr) return undefined;
    try {
      // Try parsing as full ISO string first
      let date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        // Extract YYYY-MM-DD from the JS Date (in UTC) to avoid timezone shifts
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1; // JS months are 0-indexed
        const day = date.getUTCDate();
        const parsed = new CalendarDate(year, month, day);
        console.log(`RecipientInfo: parseDateToCalendarDate (ISO path) result: ${parsed}`);
        return parsed;
      }
      
      // Fallback: Try parsing as YYYY-MM-DD string directly
      const directParsed = parseDate(dateStr);
      console.log(`RecipientInfo: parseDateToCalendarDate (YYYY-MM-DD path) result: ${directParsed}`);
      return directParsed;

    } catch (e) {
      console.error('Error parsing date string:', dateStr, e);
      return undefined;
    }
  };

  // Create default values based on recipient type
  const getDefaultValues = (): RecipientInfoFormValues => {
    // Start with fully-formed default structures for both types
    const defaultIndividual = {
      type: 'individual' as const,
      firstName: '',
      lastName: '',
      relationship: '',
      birthday: null,
      includeWelcomeCard: false,
      welcomeMessage: '',
    };
    const defaultCouple = {
      type: 'couple' as const,
      recipient1FirstName: '',
      recipient1LastName: '',
      recipient2FirstName: '',
      recipient2LastName: '',
      relationship: '',
      recipient1Birthday: null,
      recipient2Birthday: null,
      anniversary: null,
      includeWelcomeCard: false,
      welcomeMessage: '',
    };

    const existingRecipient = session.recipient;

    if (recipientType === 'couple') {
      // Merge existing couple data with defaults
      return {
        ...defaultCouple,
        ...(existingRecipient && existingRecipient.type === 'couple' ? existingRecipient : {}),
      };
    } else { // Default to individual if type is null or 'individual'
      // Merge existing individual data with defaults
      return {
        ...defaultIndividual,
        ...(existingRecipient && existingRecipient.type === 'individual' ? existingRecipient : {}),
      };
    }
  };

  // Initialize form with react-hook-form and zod validation
  const { 
    register, 
    handleSubmit, 
    control,
    formState: { errors, isValid } 
  } = useForm<RecipientInfoFormValues>({
    // Use the schema that now expects strings for dates
    resolver: zodResolver(recipientInfoSchema), 
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  });

  // --- Debounced Autosave Logic --- 
  const watchedFields = useWatch({ control }); // Watch all fields

  const debouncedSave = useDebouncedCallback(async () => {
    const currentData = watchedFields;
    console.log('[Autosave] RecipientInfo: Triggering save with data:', currentData);
    updateSession('recipient', currentData);
    try {
      await saveSessionToSupabase();
      console.log('[Autosave] RecipientInfo: Session saved to Supabase.');
    } catch (error) {
      console.error('[Autosave] RecipientInfo: Failed to save session to Supabase:', error);
    }
  }, 1000); 

  useEffect(() => {
    // Directly call debouncedSave whenever watchedFields changes.
    // The initial state will be saved once after the first render + debounce.
    console.log('[Autosave] RecipientInfo: Field changed, debouncing save...');
    debouncedSave();
  // Depend only on watchedFields (the object reference changes on update) and debouncedSave
  }, [watchedFields, debouncedSave]); 
  // --- End Autosave Logic --- 

  // Type guard to check if errors are for individual recipient
  const isIndividualErrors = (errors: any): errors is { 
    firstName?: { message: string }, 
    lastName?: { message: string },
    relationship?: { message: string },
    birthday?: { message: string },
    includeWelcomeCard?: { message: string },
    welcomeMessage?: { message: string }
  } => {
    return 'firstName' in errors || 'lastName' in errors;
  };

  // Type guard to check if errors are for couple recipient
  const isCoupleErrors = (errors: any): errors is { 
    recipient1FirstName?: { message: string }, 
    recipient1LastName?: { message: string },
    recipient2FirstName?: { message: string },
    recipient2LastName?: { message: string },
    relationship?: { message: string },
    recipient1Birthday?: { message: string },
    recipient2Birthday?: { message: string },
    anniversary?: { message: string },
    includeWelcomeCard?: { message: string },
    welcomeMessage?: { message: string }
  } => {
    return 'recipient1FirstName' in errors || 'recipient1LastName' in errors || 
           'recipient2FirstName' in errors || 'recipient2LastName' in errors;
  };

  const onSubmit = async (data: RecipientInfoFormValues) => {
    console.log('RecipientInfo: Form validated, onSubmit triggered.');
    debouncedSave.cancel();
    updateSession('recipient', data); 

    // --- Final Save and Email Logic ---
    let purchaserEmail: string | undefined;
    try {
      console.log('[SUBMIT] RecipientInfo: Calling final saveSessionToSupabase...');
      await saveSessionToSupabase(); 
      console.log('[SUBMIT] RecipientInfo: Final session save successful.');

      // --- Call Backend API to Send Resume Email ---
      // Get necessary data from the session store
      const { session } = useSessionStore.getState();
      purchaserEmail = session.purchaser?.email || session.email; // Use purchaser email or the saved email
      const sessionId = session.sessionId;
      
      // Determine recipient's first name based on the form data type
      const recipientFirstName = data.type === 'individual' 
                                  ? data.firstName 
                                  : data.recipient1FirstName; // Use first name for couple

      console.log(`[SUBMIT] RecipientInfo: Checking API call condition - sessionId: ${sessionId}, purchaserEmail: ${purchaserEmail}`);
      
      // Send email if we have a session ID and purchaser email
      if (sessionId && purchaserEmail) {
          console.log(`[SUBMIT] RecipientInfo: Attempting call to /api/send-resume-email for ${purchaserEmail} / ${sessionId}.`);
          try {
              const response = await fetch('/api/send-resume-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email: purchaserEmail, sessionId, recipientFirstName }), // Include recipientFirstName
              });
              
              if (!response.ok) {
                  // Throw an error to be caught by the outer catch block
                  throw new Error(`API responded with status: ${response.status}`);
              }
              
              const responseData = await response.json(); // Assuming your API returns JSON
              console.log('[SUBMIT] RecipientInfo: API call to /api/send-resume-email successful.', responseData);

          } catch (err) {
              console.error('[SUBMIT] RecipientInfo: API call to /api/send-resume-email FAILED:', err);
              // Log the error but don't block navigation
          }
          
          // Show toast after attempting to send email
          toast({
            title: "Magic Link Sent",
            description: `We emailed a magic link to ${purchaserEmail}. Your progress is saved automatically.`,
          });

      } else {
         console.log('[SUBMIT] RecipientInfo: Conditions NOT met for calling email API.');
         if (!sessionId) {
             console.warn('[SUBMIT] RecipientInfo: Session ID not found for email API.');
         }
         if (!purchaserEmail) {
             console.warn('[SUBMIT] RecipientInfo: Purchaser email not found for email API.');
         }
      }
      // --- End API Call Logic ---

    } catch (error) {
      console.error('[SUBMIT] RecipientInfo: Final saveSessionToSupabase FAILED:', error);
      // Show a generic save toast even if email failed or wasn't sent
      toast({
        title: "Progress Saved",
        description: "Your progress has been saved automatically.",
        variant: "default" // Or use a different variant if preferred
      });
    }
    // --- End Final Save and Email Logic ---

    console.log('RecipientInfo: Calling goNext()...');
    goNext(); 
  };

  // --- Update store validation status based on form validity ---
  useEffect(() => {
    console.log(`RecipientInfo: formState.isValid changed to: ${isValid}, updating store...`);
    updateValidationStatus(isValid);
  }, [isValid, updateValidationStatus]);
  // --- End validation status update ---

  return (
    <div className="max-w-xl mx-auto py-4 md:py-8 px-4 md:px-0">
      <div className="mb-6 md:mb-10 text-left md:text-center">
        <h1 className="text-xl md:text-3xl font-semibold text-legacy-green mb-3 md:mb-4">
          {recipientType === 'individual' 
            ? "Recipient Information" 
            : "Couple Information"}
        </h1>
        <p className="text-sm md:text-lg text-gray-600 px-4 sm:px-0">
          {recipientType === 'individual'
            ? "Tell us about the person you're gifting to"
            : "Tell us about the couple you're gifting to"}
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 md:space-y-8"
      >
        {recipientType === 'individual' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-legacy-green font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  className={cn(
                    "h-12 w-full",
                    isIndividualErrors(errors) && errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""
                  )}
                />
                {isIndividualErrors(errors) && errors.firstName && 
                  <p className="text-xs text-red-600 pt-1">{errors.firstName.message}</p>
                }
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-legacy-green font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  className={cn(
                    "h-12 w-full",
                    isIndividualErrors(errors) && errors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""
                  )}
                />
                {isIndividualErrors(errors) && errors.lastName && 
                  <p className="text-xs text-red-600 pt-1">{errors.lastName.message}</p>
                }
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship" className="text-legacy-green font-medium">
                Your relationship to them
              </Label>
              <Controller
                name="relationship"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger 
                      id="relationship" 
                      className={cn(
                        "h-12 w-full",
                        errors.relationship ? "border-red-500 focus-visible:ring-red-500" : ""
                      )}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          const trigger = e.currentTarget;
                          trigger.click();
                        }
                      }}
                    >
                      <SelectValue placeholder="Select your relationship" />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {INDIVIDUAL_RELATIONSHIPS.map((rel) => (
                        <SelectItem key={rel} value={rel}>
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.relationship && <p className="text-xs text-red-600 pt-1">{errors.relationship.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthday" className="text-legacy-green font-medium">
                Birthday (Optional)
              </Label>
              <Controller
                name="birthday"
                control={control}
                render={({ field }) => (
                  <JollyDateField
                    value={parseDateToCalendarDate(field.value)}
                    onChange={(date) => field.onChange(dateToISOString(date))}
                    className="h-12 w-full"
                  />
                )}
              />
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Why special dates matter</h4>
                  <p className="text-sm text-muted-foreground">
                    When you provide important dates like birthdays or anniversaries, we can ensure special cards arrive at just the right time to celebrate these milestones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-medium text-legacy-dark mb-4 border-b pb-2">First Recipient</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipient1FirstName" className="text-legacy-green font-medium">
                      First Name
                    </Label>
                    <Input
                      id="recipient1FirstName"
                      {...register('recipient1FirstName')}
                      className={cn(
                        "h-12 w-full",
                        isCoupleErrors(errors) && errors.recipient1FirstName ? "border-red-500 focus-visible:ring-red-500" : ""
                      )}
                    />
                    {isCoupleErrors(errors) && errors.recipient1FirstName && 
                      <p className="text-xs text-red-600 pt-1">{errors.recipient1FirstName.message}</p>
                    }
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient1LastName" className="text-legacy-green font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="recipient1LastName"
                      {...register('recipient1LastName')}
                      className={cn(
                        "h-12 w-full",
                        isCoupleErrors(errors) && errors.recipient1LastName ? "border-red-500 focus-visible:ring-red-500" : ""
                      )}
                    />
                    {isCoupleErrors(errors) && errors.recipient1LastName && 
                      <p className="text-xs text-red-600 pt-1">{errors.recipient1LastName.message}</p>
                    }
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient1Birthday" className="text-legacy-green font-medium">
                    Birthday (Optional)
                  </Label>
                  <Controller
                    name="recipient1Birthday"
                    control={control}
                    render={({ field }) => (
                      <JollyDateField
                        value={parseDateToCalendarDate(field.value)}
                        onChange={(date) => field.onChange(dateToISOString(date))}
                        className="h-12 w-full"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-medium text-legacy-dark mb-4 border-b pb-2">Second Recipient</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipient2FirstName" className="text-legacy-green font-medium">
                      First Name
                    </Label>
                    <Input
                      id="recipient2FirstName"
                      {...register('recipient2FirstName')}
                      className={cn(
                        "h-12 w-full",
                        isCoupleErrors(errors) && errors.recipient2FirstName ? "border-red-500 focus-visible:ring-red-500" : ""
                      )}
                    />
                    {isCoupleErrors(errors) && errors.recipient2FirstName && 
                      <p className="text-xs text-red-600 pt-1">{errors.recipient2FirstName.message}</p>
                    }
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient2LastName" className="text-legacy-green font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="recipient2LastName"
                      {...register('recipient2LastName')}
                      className={cn(
                        "h-12 w-full",
                        isCoupleErrors(errors) && errors.recipient2LastName ? "border-red-500 focus-visible:ring-red-500" : ""
                      )}
                    />
                    {isCoupleErrors(errors) && errors.recipient2LastName && 
                      <p className="text-xs text-red-600 pt-1">{errors.recipient2LastName.message}</p>
                    }
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient2Birthday" className="text-legacy-green font-medium">
                    Birthday (Optional)
                  </Label>
                  <Controller
                    name="recipient2Birthday"
                    control={control}
                    render={({ field }) => (
                      <JollyDateField
                        value={parseDateToCalendarDate(field.value)}
                        onChange={(date) => field.onChange(dateToISOString(date))}
                        className="h-12 w-full"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="relationship" className="text-legacy-green font-medium">
                  Your relationship to them
                </Label>
                <Controller
                  name="relationship"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger 
                        id="relationship" 
                        className={cn(
                          "h-12 w-full",
                          errors.relationship ? "border-red-500 focus-visible:ring-red-500" : ""
                        )}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            const trigger = e.currentTarget;
                            trigger.click();
                          }
                        }}
                      >
                        <SelectValue placeholder="Select your relationship" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {COUPLE_RELATIONSHIPS.map((rel) => (
                          <SelectItem key={rel} value={rel}>
                            {rel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.relationship && <p className="text-xs text-red-600 pt-1">{errors.relationship.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="anniversary" className="text-legacy-green font-medium">
                  Anniversary (Optional)
                </Label>
                <Controller
                  name="anniversary"
                  control={control}
                  render={({ field }) => (
                    <JollyDateField
                      value={parseDateToCalendarDate(field.value)}
                      onChange={(date) => field.onChange(dateToISOString(date))}
                      className="h-12 w-full"
                    />
                  )}
                />
              </div>
              
              <div className="bg-muted/50 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium mb-1">Why special dates matter</h4>
                    <p className="text-sm text-muted-foreground">
                      When you provide important dates like birthdays or anniversaries, we can ensure special cards arrive at just the right time to celebrate these milestones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conditionally render desktop buttons */}
        {!isMobile && (
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
              disabled={!isCurrentStepValid}
            >
              Continue
            </Button>
          </div>
        )}
      </motion.form>
    </div>
  );
};

export default RecipientInfo;