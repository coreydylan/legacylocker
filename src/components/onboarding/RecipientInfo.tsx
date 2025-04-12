import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, User, ChevronLeft } from 'lucide-react';
import { useSessionStore } from '@/lib/sessionStore';
import { SessionData } from '@/lib/sessionManager';

const RecipientInfo: React.FC = () => {
  const { session, updateSession, nextStep, prevStep } = useSessionStore();
  const typedSession = session as SessionData;
  const recipientType = typedSession.recipientType;
  const recipient: Partial<SessionData['recipient']> = typedSession.recipient || {};

  const [errors, setErrors] = useState<any>({});

  const parseDate = (dateString?: string): Date | undefined => {
    if (!dateString) return undefined;
    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? undefined : date;
      } catch (error) {
        console.error("Error parsing date string:", dateString, error);
        return undefined;
      }
  };
  
  const validateForm = () => {
      const newErrors: any = {};
      if (recipientType === 'individual') {
          if (!(recipient.firstName || '').trim()) newErrors.firstName = 'First name is required.';
          if (!(recipient.lastName || '').trim()) newErrors.lastName = 'Last name is required.';
          if (!(recipient.relationship || '').trim()) newErrors.relationship = 'Relationship is required.';
      } else if (recipientType === 'couple') {
          if (!(recipient.recipient1FirstName || '').trim()) newErrors.recipient1FirstName = 'First name (1) is required.';
          if (!(recipient.recipient1LastName || '').trim()) newErrors.recipient1LastName = 'Last name (1) is required.';
          if (!(recipient.recipient2FirstName || '').trim()) newErrors.recipient2FirstName = 'First name (2) is required.';
          if (!(recipient.recipient2LastName || '').trim()) newErrors.recipient2LastName = 'Last name (2) is required.';
          if (!(recipient.relationship || '').trim()) newErrors.relationship = 'Relationship is required.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
      updateSession(`recipient.${field}`, value);
      if (errors[field]) {
          setErrors((prev: any) => ({ ...prev, [field]: undefined }));
      }
  };

  const handleSubmit = () => {
      if (validateForm()) {
          console.log('RecipientInfo: Form validated, moving to next step');
          nextStep();
      } else {
          console.log('RecipientInfo: Form validation failed');
      }
  };

  useEffect(() => {
      validateForm();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFormFields = () => {
      if (recipientType === 'individual') {
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={recipient.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="First name"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                   {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={recipient.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Last name"
                     className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relationship">Your Relationship</Label>
                <Input
                  id="relationship"
                  value={recipient.relationship || ''}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  placeholder="e.g. Friend, Parent, Sibling"
                  className={errors.relationship ? 'border-red-500' : ''}
                />
                 {errors.relationship && <p className="text-sm text-red-600">{errors.relationship}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !(recipient.birthday || '') && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {(recipient.birthday || '') ? (
                        format(parseDate(recipient.birthday) || new Date(), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parseDate(recipient.birthday)}
                      onSelect={(date) => 
                        handleInputChange('birthday', date ? date.toISOString() : undefined)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          );
      } else if (recipientType === 'couple') {
          return (
            <>
              <div className="space-y-4">
                <h3 className="font-medium">First Recipient</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipient1FirstName">First Name</Label>
                    <Input
                      id="recipient1FirstName"
                      value={recipient.recipient1FirstName || ''}
                      onChange={(e) => handleInputChange('recipient1FirstName', e.target.value)}
                      placeholder="First name"
                      className={errors.recipient1FirstName ? 'border-red-500' : ''}
                    />
                    {errors.recipient1FirstName && <p className="text-sm text-red-600">{errors.recipient1FirstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient1LastName">Last Name</Label>
                    <Input
                      id="recipient1LastName"
                      value={recipient.recipient1LastName || ''}
                      onChange={(e) => handleInputChange('recipient1LastName', e.target.value)}
                      placeholder="Last name"
                      className={errors.recipient1LastName ? 'border-red-500' : ''}
                    />
                     {errors.recipient1LastName && <p className="text-sm text-red-600">{errors.recipient1LastName}</p>}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Second Recipient</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipient2FirstName">First Name</Label>
                    <Input
                      id="recipient2FirstName"
                      value={recipient.recipient2FirstName || ''}
                      onChange={(e) => handleInputChange('recipient2FirstName', e.target.value)}
                      placeholder="First name"
                      className={errors.recipient2FirstName ? 'border-red-500' : ''}
                    />
                    {errors.recipient2FirstName && <p className="text-sm text-red-600">{errors.recipient2FirstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient2LastName">Last Name</Label>
                    <Input
                      id="recipient2LastName"
                      value={recipient.recipient2LastName || ''}
                      onChange={(e) => handleInputChange('recipient2LastName', e.target.value)}
                      placeholder="Last name"
                      className={errors.recipient2LastName ? 'border-red-500' : ''}
                    />
                     {errors.recipient2LastName && <p className="text-sm text-red-600">{errors.recipient2LastName}</p>}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relationship">Their Relationship</Label>
                <Input
                  id="relationship"
                  value={recipient.relationship || ''}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  placeholder="e.g. Married, Partners, Dating"
                  className={errors.relationship ? 'border-red-500' : ''}
                />
                 {errors.relationship && <p className="text-sm text-red-600">{errors.relationship}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="anniversary">Anniversary Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !(recipient.anniversary || '') && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {(recipient.anniversary || '') ? (
                        format(parseDate(recipient.anniversary) || new Date(), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parseDate(recipient.anniversary)}
                      onSelect={(date) => 
                        handleInputChange('anniversary', date ? date.toISOString() : undefined)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          );
      }
      return null;
  };
  
  const commonFields = (
      <>
          <div className="flex items-center space-x-2 pt-4 border-t mt-6">
              <Switch
                  id="includeWelcomeCard"
                  checked={recipient.includeWelcomeCard ?? false}
                  onCheckedChange={(checked) => handleInputChange('includeWelcomeCard', checked)}
              />
              <Label htmlFor="includeWelcomeCard">Include a welcome card</Label>
          </div>
          
          {(recipient.includeWelcomeCard ?? false) && (
              <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                      id="welcomeMessage"
                      value={recipient.welcomeMessage || ''}
                      onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                      placeholder="Write a personal message to include with the first card..."
                      rows={4}
                  />
              </div>
          )}
      </>
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-legacy-green mb-4">
          Recipient Information
        </h1>
        <p className="text-lg text-gray-600">
          {recipientType === 'individual' 
            ? "Tell us who will be receiving this special gift."
            : "Tell us about the couple receiving this gift."
          }
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{recipientType === 'individual' ? 'Individual Recipient' : 'Couple Recipients'}</CardTitle>
          <CardDescription>
            {recipientType === 'individual' 
              ? "Enter details about the person receiving this gift."
              : "Enter details about the couple receiving this gift."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderFormFields()} 
          {commonFields}
        </CardContent>
        <CardFooter className="justify-between pt-4 border-t">
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
            onClick={handleSubmit}
            disabled={Object.keys(errors).some(key => errors[key])}
            className="bg-legacy-green text-white hover:bg-legacy-green/90"
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RecipientInfo;
