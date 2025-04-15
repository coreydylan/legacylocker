import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { MonthlyCardData } from '@/lib/sessionStore';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SignatureCustomizationProps {
  selectedMonth: string;
  currentMonthData: MonthlyCardData;
  handleMonthDataChange: (month: string, data: Partial<MonthlyCardData>) => void;
  openCalendars: Record<string, boolean>;
  handleCalendarToggle: (month: string) => void;
  celebrationTypes: string[];
  months: string[];
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  prevMonth: string | null;
  nextMonth: string | null;
}

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

const SignatureCustomization: React.FC<SignatureCustomizationProps> = ({
  selectedMonth,
  currentMonthData,
  handleMonthDataChange,
  openCalendars,
  handleCalendarToggle,
  celebrationTypes,
  months,
  handlePrevMonth,
  handleNextMonth,
  prevMonth,
  nextMonth,
}) => {
  const customDateString: string | undefined = currentMonthData.customDate;
  const selectedDateForCalendar: Date | undefined = parseDate(customDateString);

  return (
    <div className="space-y-8">
      {/* Delivery Timing Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-legacy-green">Delivery Timing</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <RadioGroup
              value={currentMonthData.useExactText ? 'exact' : 'approximate'}
              onValueChange={(value) => {
                handleMonthDataChange(selectedMonth, {
                  useExactText: value === 'exact',
                });
              }}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exact" id="exact-date" />
                <Label htmlFor="exact-date">Exact Date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="approximate" id="approximate-date" />
                <Label htmlFor="approximate-date">Approximate Date</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Select Date</Label>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
                onClick={() => handleCalendarToggle(selectedMonth)}
              >
                {currentMonthData.customDate || 'Pick a date'}
              </Button>
              {openCalendars[selectedMonth] && (
                <Calendar
                  mode="single"
                  selected={currentMonthData.customDate ? new Date(currentMonthData.customDate) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      handleMonthDataChange(selectedMonth, {
                        customDate: date.toISOString().split('T')[0],
                      });
                      handleCalendarToggle(selectedMonth);
                    }
                  }}
                  className="rounded-md border"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Holiday Footer Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-legacy-green">Holiday Footer</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Holiday or Special Occasion</Label>
            <Select
              value={currentMonthData.celebration || ''}
              onValueChange={(value) => {
                handleMonthDataChange(selectedMonth, {
                  celebration: value,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a holiday or occasion" />
              </SelectTrigger>
              <SelectContent>
                {celebrationTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrevMonth}
          disabled={!prevMonth}
          className="w-32"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={handleNextMonth}
          disabled={!nextMonth}
          className="w-32"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default SignatureCustomization; 