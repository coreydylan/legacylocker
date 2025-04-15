import React from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { recipientInfoSchema, RecipientInfoFormValues } from '@/schemas/recipientInfoSchema';
import { cn } from '@/lib/utils';

const INDIVIDUAL_RELATIONSHIPS = [
  'Parent',
  'Child',
  'Sibling',
  'Friend',
  'Partner',
  'Spouse',
  'Grandparent',
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
  const { session, updateSession } = useSessionStore();
  const { goNext, goBack } = useOnboardingNavigation();
  const recipientType = session.recipientType;
  
  // Create default values based on recipient type
  const getDefaultValues = (): RecipientInfoFormValues => {
    const recipient = session.recipient || {
      type: recipientType,
      firstName: '',
      lastName: '',
      recipient1FirstName: '',
      recipient1LastName: '',
      recipient2FirstName: '',
      recipient2LastName: '',
      relationship: '',
      birthday: '',
      recipient1Birthday: '',
      recipient2Birthday: '',
      anniversary: '',
      includeWelcomeCard: false,
      welcomeMessage: ''
    };
    
    if (recipientType === 'couple') {
      return {
        type: 'couple',
        recipient1FirstName: recipient.recipient1FirstName || '',
        recipient1LastName: recipient.recipient1LastName || '',
        recipient2FirstName: recipient.recipient2FirstName || '',
        recipient2LastName: recipient.recipient2LastName || '',
        relationship: recipient.relationship || '',
        recipient1Birthday: recipient.recipient1Birthday || '',
        recipient2Birthday: recipient.recipient2Birthday || '',
        anniversary: recipient.anniversary || '',
        includeWelcomeCard: recipient.includeWelcomeCard || false,
        welcomeMessage: recipient.welcomeMessage || '',
      };
    } else {
      return {
        type: 'individual',
        firstName: recipient.firstName || '',
        lastName: recipient.lastName || '',
        relationship: recipient.relationship || '',
        birthday: recipient.birthday || '',
        includeWelcomeCard: recipient.includeWelcomeCard || false,
        welcomeMessage: recipient.welcomeMessage || '',
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
    resolver: zodResolver(recipientInfoSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange'
  });

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

  const onSubmit = (data: RecipientInfoFormValues) => {
    console.log('RecipientInfo: Form validated, saving data:', data);
    updateSession('recipient', data);
    goNext();
  };

  const parseDateSafely = (dateStr?: string) => {
    if (!dateStr) return undefined;
    try {
      // Handle ISO strings
      if (dateStr.includes('T')) {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return undefined;
        return parseDate(date.toISOString().split('T')[0]);
      }
      // Handle YYYY-MM-DD strings
      return parseDate(dateStr);
    } catch (e) {
      console.error('Error parsing date:', e);
      return undefined;
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-legacy-green mb-4">
          {recipientType === 'individual' 
            ? "Recipient Information" 
            : "Couple Information"}
        </h1>
        <p className="text-lg text-gray-600 px-4 sm:px-0">
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
        className="space-y-8"
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
                    value={parseDateSafely(field.value)}
                    onChange={(date) => field.onChange(date ? date.toString() : '')}
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
                        value={parseDateSafely(field.value)}
                        onChange={(date) => field.onChange(date ? date.toString() : '')}
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
                        value={parseDateSafely(field.value)}
                        onChange={(date) => field.onChange(date ? date.toString() : '')}
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
                      value={parseDateSafely(field.value)}
                      onChange={(date) => field.onChange(date ? date.toString() : '')}
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
            disabled={!isValid}
          >
            Continue
          </Button>
        </div>
      </motion.form>
    </div>
  );
};

export default RecipientInfo;