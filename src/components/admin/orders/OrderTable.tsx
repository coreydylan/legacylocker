import React from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, XCircle } from 'lucide-react';

// Define the Order type (can be shared or imported if defined elsewhere)
export interface Order {
  id: string;
  order_date: string;
  purchaser_name: string;
  order_status: string;
  ready_for_production: boolean;
  payment_status: string;
  // Add other fields displayed in the table
  review_required?: boolean; // Make optional if not always present
}

interface OrderTableProps {
  orders: Order[];
  selectedRowIds: Record<string, boolean>;
  onRowSelect: (orderId: string) => void;
  onSelectAll: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return 'Invalid Date';
  }
};

const OrderTable: React.FC<OrderTableProps> = ({ 
  orders, 
  selectedRowIds,
  onRowSelect,
  onSelectAll,
  isAllSelected,
  isIndeterminate,
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Checkbox Header */}
            <TableHead className="px-4">
              <Checkbox
                checked={isAllSelected || isIndeterminate}
                onCheckedChange={onSelectAll}
                aria-label="Select all rows"
                data-state={isIndeterminate ? 'indeterminate' : undefined}
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Purchaser</TableHead>
            {/* <TableHead>Recipient(s)</TableHead> */}
            {/* <TableHead>Edition</TableHead> */}
            <TableHead>Status</TableHead>
            <TableHead>Ready for Prod?</TableHead>
            <TableHead>Review?</TableHead>
            <TableHead>$ Paid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow 
                key={order.id}
                data-state={selectedRowIds[order.id] ? 'selected' : undefined}
              >
                {/* Checkbox Cell */}
                <TableCell className="px-4">
                  <Checkbox
                    checked={selectedRowIds[order.id] || false}
                    onCheckedChange={() => onRowSelect(order.id)}
                    aria-label={`Select row ${order.id}`}
                  />
                </TableCell>
                {/* Data Cells */}
                <TableCell>
                  <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline">
                    {order.id.substring(0, 8)}...
                  </Link>
                </TableCell>
                <TableCell>{formatDate(order.order_date)}</TableCell>
                <TableCell>{order.purchaser_name}</TableCell>
                {/* <TableCell>...</TableCell> */}
                {/* <TableCell>...</TableCell> */}
                <TableCell>
                  <Badge variant="outline">{order.order_status || 'N/A'}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  {order.ready_for_production ? <CheckCircle className="h-5 w-5 text-green-500 inline" /> : <XCircle className="h-5 w-5 text-red-500 inline" />}
                </TableCell>
                {/* Review Status Cell */}
                <TableCell className="text-center">
                  {order.review_required === undefined ? (
                     <span className="text-muted-foreground">-</span>
                  ) : order.review_required ? (
                    <CheckCircle className="h-5 w-5 text-orange-500 inline" /> 
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-400 inline" />
                  )}
                </TableCell>
                <TableCell>
                  {order.payment_status === 'paid' ? (
                    <Badge variant="default">Paid</Badge>
                  ) : (
                    <Badge variant="destructive">{order.payment_status || 'Unpaid'}</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              {/* Update colSpan to account for checkbox */}
              <TableCell colSpan={8} className="text-center h-24">No orders found matching your filters.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable; 