import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { DateRange, SelectRangeEventHandler } from 'react-day-picker';

// Define statuses here or import from a constants file later
const ORDER_STATUSES = ['pending', 'processing', 'ready', 'shipped', 'delivered', 'cancelled', 'on_hold']; 
const PAYMENT_STATUSES = ['paid', 'unpaid', 'refunded', 'pending'];

// Define and export the type for boolean filter values
export type BooleanFilterValue = 'all' | 'yes' | 'no';

interface OrderFiltersProps {
  textFilter: string;
  onTextFilterChange: (value: string) => void;
  statusFilter: string | 'all';
  onStatusFilterChange: (value: string | 'all') => void;
  readyFilter: BooleanFilterValue;
  onReadyFilterChange: (value: BooleanFilterValue) => void;
  reviewFilter: BooleanFilterValue;
  onReviewFilterChange: (value: BooleanFilterValue) => void;
  paidFilter: string | 'all';
  onPaidFilterChange: (value: string | 'all') => void;
  dateFilter: DateRange | undefined;
  onDateFilterChange: SelectRangeEventHandler;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ 
  textFilter, onTextFilterChange, 
  statusFilter, onStatusFilterChange,
  readyFilter, onReadyFilterChange,
  reviewFilter, onReviewFilterChange,
  paidFilter, onPaidFilterChange,
  dateFilter, onDateFilterChange,
}) => {

  // Helper for boolean select change
  const handleBooleanChange = (handler: (value: BooleanFilterValue) => void) => (value: string) => {
    handler(value as BooleanFilterValue);
  };
  
  return (
    <div className="mb-6 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 items-end">
        {/* Text Search */}
        <div>
          <Label htmlFor="textSearch">Search (Name)</Label>
          <Input 
            id="textSearch" 
            placeholder="Search by purchaser name..."
            value={textFilter}
            onChange={(e) => onTextFilterChange(e.target.value)}
          />
        </div>

        {/* Status Select */}
        <div>
          <Label htmlFor="statusFilter">Order Status</Label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger id="statusFilter">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {ORDER_STATUSES.map(status => (
                <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ready Filter */}
        <div>
          <Label htmlFor="readyFilter">Ready for Prod?</Label>
          <Select value={readyFilter} onValueChange={handleBooleanChange(onReadyFilterChange)}>
            <SelectTrigger id="readyFilter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Review Filter */}
        <div>
          <Label htmlFor="reviewFilter">Needs Review?</Label>
          <Select value={reviewFilter} onValueChange={handleBooleanChange(onReviewFilterChange)}>
            <SelectTrigger id="reviewFilter">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Paid Filter */}
        <div>
          <Label htmlFor="paidFilter">Payment Status</Label>
          <Select value={paidFilter} onValueChange={onPaidFilterChange}>
            <SelectTrigger id="paidFilter">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {PAYMENT_STATUSES.map(status => (
                <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Picker */}
        <div className="min-w-[280px]">
          <Label htmlFor="orderDateRange">Order Date</Label>
          <DatePickerWithRange 
            date={dateFilter} 
            onDateChange={onDateFilterChange} 
            className="mt-1"
            id="orderDateRange"
          />
        </div>

      </div>
      {/* Optional Clear/Apply Buttons */}
      {/* <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={() => { 
          onTextFilterChange(''); 
          onStatusFilterChange('all'); 
          onReadyFilterChange('all'); 
          onReviewFilterChange('all'); 
          onPaidFilterChange('all');
          // TODO: Clear date filter 
        }}>Clear Filters</Button>
      </div> */}
    </div>
  );
};

export default OrderFilters; 