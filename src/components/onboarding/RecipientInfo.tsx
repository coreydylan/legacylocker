import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, ChevronLeft } from 'lucide-react';
import { useSessionStore } from '@/lib/sessionStore';
import { motion } from 'framer-motion';
import { JollyDateField } from '@/components/ui/date-field';
import { parseDate, CalendarDate } from '@internationalized/date';

interface RecipientData {
  firstName?: string;
  lastName?: string;
  relationship?: string;
  birthday?: string;
  anniversary?: string;
  recipient1FirstName?: string;
  recipient1LastName?: string;
  recipient2FirstName?: string;
  recipient2LastName?: string;
  recipient1Birthday?: string;
  recipient2Birthday?: string;
}

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
  const { session, updateSession, nextStep, prevStep } = useSessionStore();
  const recipientType = session.recipientType;
  const recipient: RecipientData = session.recipient || {};

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string | undefined) => {
    const updatedRecipient = { ...recipient, [field]: value };
    updateSession('recipient', updatedRecipient);
  };

  const handleDateChange = (field: string, value: CalendarDate | null) => {
    const updatedRecipient = {
      ...recipient,
      [field]: value ? value.toString() : undefined,
    };
    updateSession('recipient', updatedRecipient);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
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

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('RecipientInfo: Form validated, moving to next step');
      nextStep();
    } else {
      console.log('RecipientInfo: Form validation failed');
    }
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

  const renderDateField = (label: string, field: 'birthday' | 'anniversary' | 'recipient1Birthday' | 'recipient2Birthday') => (
    <JollyDateField
      label={`${label} (Optional)`}
      value={parseDateSafely(recipient[field])}
      onChange={(date) => handleDateChange(field, date)}
    />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Recipient Information</CardTitle>
          <CardDescription>
            {recipientType === 'individual'
              ? "Tell us about the person you're gifting to"
              : "Tell us about the couple you're gifting to"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recipientType === 'individual' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={recipient.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                  {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={recipient.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                  {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="relationship">Your relationship to them</Label>
                <Select
                  value={recipient.relationship || ''}
                  onValueChange={(value) => handleInputChange('relationship', value)}
                >
                  <SelectTrigger id="relationship">
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
                {errors.relationship && <p className="text-sm text-red-500">{errors.relationship}</p>}
              </div>
              {renderDateField('Birthday', 'birthday')}
              {renderDateField('Anniversary', 'anniversary')}
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
            </>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">First Recipient</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipient1FirstName">First Name</Label>
                    <Input
                      id="recipient1FirstName"
                      value={recipient.recipient1FirstName || ''}
                      onChange={(e) => handleInputChange('recipient1FirstName', e.target.value)}
                    />
                    {errors.recipient1FirstName && <p className="text-sm text-red-600">{errors.recipient1FirstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient1LastName">Last Name</Label>
                    <Input
                      id="recipient1LastName"
                      value={recipient.recipient1LastName || ''}
                      onChange={(e) => handleInputChange('recipient1LastName', e.target.value)}
                    />
                     {errors.recipient1LastName && <p className="text-sm text-red-600">{errors.recipient1LastName}</p>}
                  </div>
                </div>
                {renderDateField('Birthday', 'recipient1Birthday')}
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
                    />
                    {errors.recipient2FirstName && <p className="text-sm text-red-600">{errors.recipient2FirstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient2LastName">Last Name</Label>
                    <Input
                      id="recipient2LastName"
                      value={recipient.recipient2LastName || ''}
                      onChange={(e) => handleInputChange('recipient2LastName', e.target.value)}
                    />
                    {errors.recipient2LastName && <p className="text-sm text-red-600">{errors.recipient2LastName}</p>}
                  </div>
                </div>
                {renderDateField('Birthday', 'recipient2Birthday')}
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Your relationship to them</Label>
                <Select
                  value={recipient.relationship || ''}
                  onValueChange={(value) => handleInputChange('relationship', value)}
                >
                  <SelectTrigger id="relationship">
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
                {errors.relationship && <p className="text-sm text-red-600">{errors.relationship}</p>}
              </div>
              {renderDateField('Anniversary', 'anniversary')}
              <div className="bg-muted/50 rounded-lg p-4">
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
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={handleSubmit}>Continue</Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RecipientInfo;
