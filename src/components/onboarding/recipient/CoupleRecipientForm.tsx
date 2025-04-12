import React, { useState } from 'react';
import { CoupleRecipient } from '@/types/onboarding';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CoupleRecipientFormProps {
  recipient: CoupleRecipient;
  updateRecipient: (field: string, value: any) => void;
}

const CoupleRecipientForm: React.FC<CoupleRecipientFormProps> = ({ 
  recipient, 
  updateRecipient 
}) => {
  const [isRecipient1BirthdayOpen, setIsRecipient1BirthdayOpen] = useState(false);
  const [isRecipient2BirthdayOpen, setIsRecipient2BirthdayOpen] = useState(false);
  const [isAnniversaryOpen, setIsAnniversaryOpen] = useState(false);

  // Array of relationship options for couples
  const coupleRelationships = [
    "Parents", "Friends", "Family Members", "Colleagues", "Other"
  ];
  
  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pb-4">
      {/* Recipient 1 */}
      <div className="space-y-6">
        <h2 className="text-xl font-medium">Recipient 1</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipient1FirstName" className="text-base">First Name</Label>
            <Input 
              id="recipient1FirstName"
              className="h-12 text-base"
              value={recipient.recipient1FirstName}
              onChange={(e) => updateRecipient('recipient1FirstName', e.target.value)}
              placeholder="First recipient's first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient1LastName" className="text-base">Last Name</Label>
            <Input 
              id="recipient1LastName"
              className="h-12 text-base"
              value={recipient.recipient1LastName}
              onChange={(e) => updateRecipient('recipient1LastName', e.target.value)}
              placeholder="First recipient's last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Birthday (Optional)</Label>
          <Popover open={isRecipient1BirthdayOpen} onOpenChange={setIsRecipient1BirthdayOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {recipient.recipient1Birthday ? 
                  format(recipient.recipient1Birthday, "PPP") : 
                  <span className="text-muted-foreground">Select birthday</span>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto z-[60]" align="start">
              <Calendar
                mode="single"
                selected={recipient.recipient1Birthday}
                onSelect={(date) => {
                  updateRecipient('recipient1Birthday', date);
                  setIsRecipient1BirthdayOpen(false); // Close popover on select
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Recipient 2 */}
      <div className="space-y-6">
        <h2 className="text-xl font-medium">Recipient 2</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipient2FirstName" className="text-base">First Name</Label>
            <Input 
              id="recipient2FirstName"
              className="h-12 text-base"
              value={recipient.recipient2FirstName}
              onChange={(e) => updateRecipient('recipient2FirstName', e.target.value)}
              placeholder="Second recipient's first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient2LastName" className="text-base">Last Name</Label>
            <Input 
              id="recipient2LastName"
              className="h-12 text-base"
              value={recipient.recipient2LastName}
              onChange={(e) => updateRecipient('recipient2LastName', e.target.value)}
              placeholder="Second recipient's last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base">Birthday (Optional)</Label>
          <Popover open={isRecipient2BirthdayOpen} onOpenChange={setIsRecipient2BirthdayOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {recipient.recipient2Birthday ? 
                  format(recipient.recipient2Birthday, "PPP") : 
                  <span className="text-muted-foreground">Select birthday</span>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto z-[60]" align="start">
              <Calendar
                mode="single"
                selected={recipient.recipient2Birthday}
                onSelect={(date) => {
                  updateRecipient('recipient2Birthday', date);
                  setIsRecipient2BirthdayOpen(false); // Close popover on select
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Anniversary */}
      <div className="space-y-2 mt-8">
        <Label className="text-base">Anniversary Date (Optional)</Label>
        <Popover open={isAnniversaryOpen} onOpenChange={setIsAnniversaryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {recipient.anniversary ? 
                format(recipient.anniversary, "PPP") : 
                <span className="text-muted-foreground">Select anniversary date</span>
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto z-[60]" align="start">
            <Calendar
              mode="single"
              selected={recipient.anniversary}
              onSelect={(date) => {
                updateRecipient('anniversary', date);
                setIsAnniversaryOpen(false); // Close popover on select
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Relationship */}
      <div className="space-y-2 mt-8">
        <Label htmlFor="relationship" className="text-base">Your relationship to them</Label>
        <Select 
          value={recipient.relationship}
          onValueChange={(value) => updateRecipient('relationship', value)}
        >
          <SelectTrigger id="relationship" className="h-12 text-base">
            <SelectValue placeholder="Select your relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {coupleRelationships.map((rel) => (
                <SelectItem key={rel} value={rel}>{rel}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CoupleRecipientForm;
