
import React, { useState } from 'react';
import { IndividualRecipient } from '@/types/onboarding';
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

interface IndividualRecipientFormProps {
  recipient: IndividualRecipient;
  updateRecipient: (field: string, value: any) => void;
}

const IndividualRecipientForm: React.FC<IndividualRecipientFormProps> = ({ 
  recipient, 
  updateRecipient 
}) => {
  const [isBirthdayOpen, setIsBirthdayOpen] = useState(false);

  // Ensure recipient has the expected shape and default properties
  const safeRecipient = {
    firstName: '',
    lastName: '',
    relationship: '',
    birthday: undefined,
    ...recipient
  };

  // Array of relationship options
  const individualRelationships = [
    "Parent", "Child", "Sibling", "Friend", "Partner", "Spouse", 
    "Grandparent", "Grandchild", "Colleague", "Mentor", "Other"
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-base">First Name</Label>
          <Input 
            id="firstName"
            className="h-12 text-base"
            value={safeRecipient.firstName}
            onChange={(e) => updateRecipient('firstName', e.target.value)}
            placeholder="Recipient's first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-base">Last Name</Label>
          <Input 
            id="lastName"
            className="h-12 text-base"
            value={safeRecipient.lastName}
            onChange={(e) => updateRecipient('lastName', e.target.value)}
            placeholder="Recipient's last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-base">Birthday (Optional)</Label>
        <Popover open={isBirthdayOpen} onOpenChange={setIsBirthdayOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {safeRecipient.birthday ? 
                format(safeRecipient.birthday, "PPP") : 
                <span className="text-muted-foreground">Select birthday</span>
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 pointer-events-auto z-[60]" align="start">
            <Calendar
              mode="single"
              selected={safeRecipient.birthday}
              onSelect={(date) => {
                updateRecipient('birthday', date);
                setIsBirthdayOpen(false);
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="relationship" className="text-base">Your relationship to them</Label>
        <Select 
          value={safeRecipient.relationship}
          onValueChange={(value) => updateRecipient('relationship', value)}
        >
          <SelectTrigger id="relationship" className="h-12 text-base">
            <SelectValue placeholder="Select your relationship" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {individualRelationships.map((rel) => (
                <SelectItem key={rel} value={rel}>{rel}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default IndividualRecipientForm;
