import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon, User, Users } from 'lucide-react';

interface RecipientInfoProps {
  recipientType: 'myself' | 'individual' | 'couple' | null;
  recipientData: {
    type: 'individual' | 'couple';
    firstName?: string;
    lastName?: string;
    relationship?: string;
    birthday?: string;
    includeWelcomeCard?: boolean;
    welcomeMessage?: string;
    // Couple-specific fields
    recipient1FirstName?: string;
    recipient1LastName?: string;
    recipient2FirstName?: string;
    recipient2LastName?: string;
    recipient1Birthday?: string;
    recipient2Birthday?: string;
    anniversary?: string;
  };
  onUpdate: (key: string, value: any) => void;
  onNext: () => void;
}

const RecipientInfo: React.FC<RecipientInfoProps> = ({ 
  recipientType,
  recipientData,
  onUpdate,
  onNext
}) => {
  const [activeTab, setActiveTab] = useState<'individual' | 'couple'>(
    recipientData.type || 'individual'
  );
  
  // Parse string dates to Date objects for the date pickers
  const parseDate = (dateString?: string) => {
    if (!dateString) return undefined;
    return new Date(dateString);
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    const tabValue = value as 'individual' | 'couple';
    setActiveTab(tabValue);
    onUpdate('type', tabValue);
  };
  
  // Check if form is valid for navigation
  const isIndividualValid = 
    recipientData.firstName && 
    recipientData.lastName && 
    recipientData.relationship;
    
  const isCoupleValid = 
    recipientData.recipient1FirstName && 
    recipientData.recipient1LastName && 
    recipientData.recipient2FirstName && 
    recipientData.recipient2LastName && 
    recipientData.relationship;
    
  const isFormValid = activeTab === 'individual' ? isIndividualValid : isCoupleValid;
  
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-semibold text-legacy-green mb-4">
          Recipient Information
        </h1>
        <p className="text-lg text-gray-600">
          Tell us who will be receiving this special gift.
        </p>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger 
            value="individual"
            className="flex items-center gap-2"
            disabled={recipientType === 'couple'}
          >
            <User className="h-4 w-4" />
            Individual
          </TabsTrigger>
          <TabsTrigger 
            value="couple"
            className="flex items-center gap-2"
            disabled={recipientType === 'individual'}
          >
            <Users className="h-4 w-4" />
            Couple
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Recipient</CardTitle>
              <CardDescription>
                Enter details about the person receiving this gift.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={recipientData.firstName || ''}
                    onChange={(e) => onUpdate('firstName', e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={recipientData.lastName || ''}
                    onChange={(e) => onUpdate('lastName', e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relationship">Your Relationship</Label>
                <Input
                  id="relationship"
                  value={recipientData.relationship || ''}
                  onChange={(e) => onUpdate('relationship', e.target.value)}
                  placeholder="e.g. Friend, Parent, Sibling"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthday">Birthday (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !recipientData.birthday && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {recipientData.birthday ? (
                        format(parseDate(recipientData.birthday) || new Date(), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parseDate(recipientData.birthday)}
                      onSelect={(date) => 
                        onUpdate('birthday', date ? date.toISOString() : undefined)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="includeWelcomeCard"
                  checked={recipientData.includeWelcomeCard || false}
                  onCheckedChange={(checked) => onUpdate('includeWelcomeCard', checked)}
                />
                <Label htmlFor="includeWelcomeCard">Include a welcome card</Label>
              </div>
              
              {recipientData.includeWelcomeCard && (
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={recipientData.welcomeMessage || ''}
                    onChange={(e) => onUpdate('welcomeMessage', e.target.value)}
                    placeholder="Write a personal message to include with the first card..."
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                onClick={onNext}
                disabled={!isIndividualValid}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="couple">
          <Card>
            <CardHeader>
              <CardTitle>Couple Recipients</CardTitle>
              <CardDescription>
                Enter details about the couple receiving this gift.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">First Recipient</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="recipient1FirstName">First Name</Label>
                    <Input
                      id="recipient1FirstName"
                      value={recipientData.recipient1FirstName || ''}
                      onChange={(e) => onUpdate('recipient1FirstName', e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient1LastName">Last Name</Label>
                    <Input
                      id="recipient1LastName"
                      value={recipientData.recipient1LastName || ''}
                      onChange={(e) => onUpdate('recipient1LastName', e.target.value)}
                      placeholder="Last name"
                    />
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
                      value={recipientData.recipient2FirstName || ''}
                      onChange={(e) => onUpdate('recipient2FirstName', e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient2LastName">Last Name</Label>
                    <Input
                      id="recipient2LastName"
                      value={recipientData.recipient2LastName || ''}
                      onChange={(e) => onUpdate('recipient2LastName', e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="relationship">Your Relationship</Label>
                <Input
                  id="relationship"
                  value={recipientData.relationship || ''}
                  onChange={(e) => onUpdate('relationship', e.target.value)}
                  placeholder="e.g. Friends, Parents, Siblings"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="anniversary">Anniversary (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !recipientData.anniversary && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {recipientData.anniversary ? (
                        format(parseDate(recipientData.anniversary) || new Date(), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={parseDate(recipientData.anniversary)}
                      onSelect={(date) => 
                        onUpdate('anniversary', date ? date.toISOString() : undefined)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="includeWelcomeCard"
                  checked={recipientData.includeWelcomeCard || false}
                  onCheckedChange={(checked) => onUpdate('includeWelcomeCard', checked)}
                />
                <Label htmlFor="includeWelcomeCard">Include a welcome card</Label>
              </div>
              
              {recipientData.includeWelcomeCard && (
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={recipientData.welcomeMessage || ''}
                    onChange={(e) => onUpdate('welcomeMessage', e.target.value)}
                    placeholder="Write a personal message to include with the first card..."
                    rows={4}
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                onClick={onNext}
                disabled={!isCoupleValid}
              >
                Continue
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecipientInfo;
