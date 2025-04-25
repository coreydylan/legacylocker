import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import OrderTable, { Order } from '@/components/admin/orders/OrderTable';
import OrderFilters, { BooleanFilterValue } from '@/components/admin/orders/OrderFilters';
import useDebounce from '@/hooks/useDebounce';
import { DateRange } from 'react-day-picker'; // Import DateRange
import { addDays } from 'date-fns'; // Helper for date manipulation
import { Button } from '@/components/ui/button'; // Import Button
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { useToast } from "@/components/ui/use-toast"; // Import useToast
import { Trash2, Loader2 } from 'lucide-react'; // Import icons

const AdminOrdersListPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast(); // Initialize toast
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter States
  const [textFilter, setTextFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
  const [readyFilter, setReadyFilter] = useState<BooleanFilterValue>('all');
  const [reviewFilter, setReviewFilter] = useState<BooleanFilterValue>('all');
  const [paidFilter, setPaidFilter] = useState<string | 'all'>('all');
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(undefined);

  // Selection State
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({});

  // Action States
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounced Values
  const debouncedTextFilter = useDebounce(textFilter, 500);

  // Define fetchOrders outside useEffect
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('orders')
        .select('id, order_date, purchaser_name, order_status, ready_for_production, payment_status, review_required')
        .order('order_date', { ascending: false });
      
      // Apply Filters (Use debouncedTextFilter here)
      if (debouncedTextFilter) {
        query = query.ilike('purchaser_name', `%${debouncedTextFilter}%`);
      }
      if (statusFilter !== 'all') {
        query = query.eq('order_status', statusFilter);
      }
      if (readyFilter !== 'all') {
        query = query.eq('ready_for_production', readyFilter === 'yes');
      }
      if (reviewFilter !== 'all') {
        query = query.eq('review_required', reviewFilter === 'yes');
      }
      if (paidFilter !== 'all') {
        query = query.eq('payment_status', paidFilter);
      }
      if (dateFilter?.from) {
        query = query.gte('order_date', dateFilter.from.toISOString());
      }
      if (dateFilter?.to) {
        const inclusiveToDate = addDays(dateFilter.to, 1);
        query = query.lt('order_date', inclusiveToDate.toISOString()); 
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }
      setOrders(data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please try again.');
      setOrders([]); // Clear orders on error
    } finally {
      setLoading(false);
    }
  };

  // useEffect now just calls fetchOrders and resets selection
  useEffect(() => {
    setSelectedRowIds({}); 
    fetchOrders();
  }, [debouncedTextFilter, statusFilter, readyFilter, reviewFilter, paidFilter, dateFilter]); // Dependencies remain the same

  // Add back derived selection state
  const numSelected = useMemo(() => Object.values(selectedRowIds).filter(Boolean).length, [selectedRowIds]);
  const isAllSelected = useMemo(() => orders.length > 0 && numSelected === orders.length, [orders, numSelected]);
  const isIndeterminate = useMemo(() => numSelected > 0 && numSelected < orders.length, [numSelected, orders.length]);

  // Add back selection Handlers
  const handleRowSelect = (orderId: string) => {
    setSelectedRowIds(prev => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const handleSelectAll = () => {
    const newSelectedState = !isAllSelected;
    const newSelectedRowIds: Record<string, boolean> = {};
    orders.forEach(order => {
      newSelectedRowIds[order.id] = newSelectedState;
    });
    setSelectedRowIds(newSelectedRowIds);
  };

  // Add back Bulk Action Handlers (Placeholders)
  const handleMarkReady = () => {
    const idsToUpdate = Object.entries(selectedRowIds).filter(([, isSelected]) => isSelected).map(([id]) => id);
    console.log("Mark Ready clicked for IDs:", idsToUpdate);
    // TODO: Implement Supabase update logic
    alert(`Placeholder: Mark ${idsToUpdate.length} orders as Ready for Production`);
  };

  const handleAssign = () => {
    const idsToUpdate = Object.entries(selectedRowIds).filter(([, isSelected]) => isSelected).map(([id]) => id);
    console.log("Assign clicked for IDs:", idsToUpdate);
    // TODO: Implement assignment logic (e.g., show modal with user list)
    alert(`Placeholder: Assign ${idsToUpdate.length} orders`);
  };

  const handleExportCsv = () => {
    const idsToExport = Object.entries(selectedRowIds).filter(([, isSelected]) => isSelected).map(([id]) => id);
    console.log("Export CSV clicked for IDs:", idsToExport);
    // TODO: Implement CSV export logic
    alert(`Placeholder: Export ${idsToExport.length} orders to CSV`);
  };

  // Confirmation Handler - Performs deletion
  const confirmDeleteSelected = async () => {
    const idsToDelete = Object.entries(selectedRowIds)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (idsToDelete.length === 0) {
      setIsDeleteDialogOpen(false); // Close dialog if somehow no IDs were selected
      return;
    }

    setIsDeleting(true);
    console.log("Deleting orders:", idsToDelete);
    try {
      const { error: deleteError } = await supabase
        .from('orders')
        .delete()
        .in('id', idsToDelete);
      
      if (deleteError) {
        throw deleteError;
      }

      toast({ title: "Success", description: `${idsToDelete.length} order(s) deleted successfully.` });
      setSelectedRowIds({}); // Clear selection
      await fetchOrders(); // Call the refactored fetchOrders

    } catch (err: any) {
       console.error('Error deleting orders:', err);
       toast({ title: "Error", description: err.message || "Failed to delete orders.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };
  
  // Return JSX
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      
      <OrderFilters 
        textFilter={textFilter}
        onTextFilterChange={setTextFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        readyFilter={readyFilter}
        onReadyFilterChange={setReadyFilter}
        reviewFilter={reviewFilter}
        onReviewFilterChange={setReviewFilter}
        paidFilter={paidFilter}
        onPaidFilterChange={setPaidFilter}
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter} // Pass date filter state and handler
      />
      
      {/* Bulk Actions Bar - Update buttons */}
      <div className="mb-4 flex items-center space-x-2 flex-wrap gap-y-2"> 
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleMarkReady} 
          disabled={numSelected === 0}
        >
          Mark Ready ({numSelected})
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleAssign} 
          disabled={numSelected === 0}
        >
          Assign ({numSelected})
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportCsv} 
          disabled={numSelected === 0}
        >
          Export CSV ({numSelected})
        </Button>
        
        {/* Delete Selected Button / Dialog - Remove onClick from Trigger */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm" 
              disabled={numSelected === 0 || isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" /> 
              Delete Selected ({numSelected})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the selected 
                {numSelected} order(s) and all associated data (recipients, settings, etc.).
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteSelected} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isDeleting ? 'Deleting...' : 'Yes, delete order(s)'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <OrderTable 
          orders={orders} 
          selectedRowIds={selectedRowIds}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          isAllSelected={isAllSelected}
          isIndeterminate={isIndeterminate}
        />
      )}
    </div>
  );
};

export default AdminOrdersListPage;
