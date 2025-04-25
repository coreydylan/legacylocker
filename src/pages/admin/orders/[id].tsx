import React, { useState, useEffect } from 'react';
// Remove AdminLayout import
// import AdminLayout from '@/components/AdminLayout';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import RecipientGrid from '@/components/admin/orders/RecipientGrid';

// Re-use or define the Order type (ensure it includes all needed fields eventually)
interface Order {
  id: string;
  order_date: string;
  purchaser_name?: string; // Assuming these might be fetched
  order_status?: string;
  ready_for_production?: boolean;
  payment_status?: string;
  review_required?: boolean;
  stripe_receipt_url?: string;
  // Add more fields as needed for the detail view
  // e.g., payment_intent_id, assigned_team_member, internal_notes, etc.
  
  // Add Purchaser Fields
  purchaser_email?: string;
  purchaser_phone?: string;
  
  // Add Shipping Fields
  shipping_name?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
}

// Define possible statuses (move to constants later?)
const ORDER_STATUSES = ['pending', 'processing', 'ready', 'shipped', 'delivered', 'cancelled', 'on_hold'];
const PAYMENT_STATUSES = ['paid', 'unpaid', 'refunded', 'pending'];

// Type for the editable form data
// Use Partial<Order> initially, refine types if needed
type OrderFormData = Partial<Pick<Order, 'order_status' | 'ready_for_production' | 'review_required' | 'payment_status' | 'purchaser_name' | 'purchaser_email' | 'purchaser_phone' | 'shipping_name' | 'shipping_address_line1' | 'shipping_address_line2' | 'shipping_city' | 'shipping_state' | 'shipping_postal_code' | 'shipping_country'>> & { id: string };

const AdminOrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<OrderFormData | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('orders')
          // Select all columns for now, refine later if needed
          .select('*') 
          .eq('id', id)
          .maybeSingle(); // Use maybeSingle as the ID might not exist

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          setError(`Order with ID ${id} not found.`);
        } else {
          setOrder(data);
          setFormData({ 
            id: data.id,
            order_status: data.order_status,
            ready_for_production: data.ready_for_production,
            review_required: data.review_required,
            payment_status: data.payment_status,
            purchaser_name: data.purchaser_name,
            purchaser_email: data.purchaser_email,
            purchaser_phone: data.purchaser_phone,
            shipping_name: data.shipping_name,
            shipping_address_line1: data.shipping_address_line1,
            shipping_address_line2: data.shipping_address_line2,
            shipping_city: data.shipping_city,
            shipping_state: data.shipping_state,
            shipping_postal_code: data.shipping_postal_code,
            shipping_country: data.shipping_country,
          });
        }
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError('Failed to fetch order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  // Form Change Handler
  const handleFormChange = (field: keyof Omit<OrderFormData, 'id'>, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Toggle Edit Mode
  const handleToggleEdit = () => {
    if (isEditing && order) {
      // If cancelling, reset form data to original order data
      setFormData({ 
        id: order.id,
        order_status: order.order_status,
        ready_for_production: order.ready_for_production,
        review_required: order.review_required,
        payment_status: order.payment_status,
        purchaser_name: order.purchaser_name,
        purchaser_email: order.purchaser_email,
        purchaser_phone: order.purchaser_phone,
        shipping_name: order.shipping_name,
        shipping_address_line1: order.shipping_address_line1,
        shipping_address_line2: order.shipping_address_line2,
        shipping_city: order.shipping_city,
        shipping_state: order.shipping_state,
        shipping_postal_code: order.shipping_postal_code,
        shipping_country: order.shipping_country,
      });
    }
    setIsEditing(!isEditing);
  };

  // Handle Save
  const handleSave = async () => {
    if (!formData || !id) return;
    setIsSaving(true);
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
            order_status: formData.order_status,
            ready_for_production: formData.ready_for_production,
            review_required: formData.review_required,
            payment_status: formData.payment_status,
            purchaser_name: formData.purchaser_name,
            purchaser_email: formData.purchaser_email,
            purchaser_phone: formData.purchaser_phone,
            shipping_name: formData.shipping_name,
            shipping_address_line1: formData.shipping_address_line1,
            shipping_address_line2: formData.shipping_address_line2,
            shipping_city: formData.shipping_city,
            shipping_state: formData.shipping_state,
            shipping_postal_code: formData.shipping_postal_code,
            shipping_country: formData.shipping_country,
         })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      // Update local order state optimistically or re-fetch
      setOrder(prev => prev ? { ...prev, ...formData } : null);
      setIsEditing(false);
      toast({ title: "Success", description: "Order details updated." });

    } catch (err: any) {
      console.error("Error saving order:", err);
      setError("Failed to save order details. Please try again.");
      toast({ title: "Error", description: err.message || "Failed to save order details.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!order || !formData) {
    // This case should ideally be covered by the error state from fetchOrder,
    // but added as a fallback.
    return <div className="p-8">Order not found.</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/orders')}>
           <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
        </Button>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" onClick={handleToggleEdit} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleToggleEdit}>
              <Edit className="mr-2 h-4 w-4" /> Edit Overview
            </Button>
          )}
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2">Order #{order.id.substring(0, 8)}...</h1>
      <p className="text-muted-foreground mb-6">Manage details for this order placed on {new Date(order.order_date).toLocaleDateString()}.</p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="purchaser">Purchaser</TabsTrigger>
          <TabsTrigger value="recipients">Recipients</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Cards</TabsTrigger>
          <TabsTrigger value="production">Card Production</TabsTrigger>
          <TabsTrigger value="internal">Internal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="p-6 border rounded-lg bg-card shadow-sm">
             <h2 className="text-xl font-semibold mb-6">Order Overview</h2>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Left Column: Core Details */}
               <div className="space-y-4">
                 <div>
                   <Label htmlFor="orderStatus" className="text-sm font-medium">Order Status</Label>
                   {isEditing ? (
                     <Select 
                       value={formData.order_status || ''} 
                       onValueChange={(value) => handleFormChange('order_status', value)}
                       disabled={isSaving}
                     >
                       <SelectTrigger id="orderStatus" className="mt-1">
                         <SelectValue placeholder="Select status..." />
                       </SelectTrigger>
                       <SelectContent>
                         {ORDER_STATUSES.map(status => (
                           <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   ) : (
                     <p id="orderStatus" className="mt-1 text-lg font-semibold">{order.order_status || 'N/A'}</p>
                   )}
                 </div>
                 {/* Flags Section */}
                 <div>
                   <Label className="text-sm font-medium">Flags</Label>
                   <div className="mt-1 space-y-2">
                     {/* Ready for Production Flag */}
                     <div className="flex items-center space-x-2">
                       <Switch 
                         id="readyForProduction"
                         checked={formData.ready_for_production || false}
                         onCheckedChange={(checked) => handleFormChange('ready_for_production', checked)}
                         disabled={!isEditing || isSaving}
                       />
                       <Label htmlFor="readyForProduction" className="text-sm font-normal">Ready for Production</Label>
                     </div>
                     {/* Review Required Flag */}
                     <div className="flex items-center space-x-2">
                       <Switch 
                         id="reviewRequired"
                         checked={formData.review_required || false}
                         onCheckedChange={(checked) => handleFormChange('review_required', checked)}
                         disabled={!isEditing || isSaving}
                       />
                       <Label htmlFor="reviewRequired" className="text-sm font-normal">Review Required</Label>
                     </div>
                   </div>
                 </div>
                 <div>
                    <Label className="text-sm font-medium text-muted-foreground">Order Date</Label>
                    <p className="mt-1">{new Date(order.order_date).toLocaleString()}</p>
                 </div>
                 {/* Add other core fields as needed */}
               </div>

               {/* Right Column: Payment Block */}
               <div className="space-y-4">
                 <h3 className="text-lg font-semibold border-b pb-2">Payment</h3>
                 <div>
                   <Label htmlFor="paymentStatus" className="text-sm font-medium">Payment Status</Label>
                   {/* TODO: Make this an editable Select/Toggle */}
                   <div id="paymentStatus" className="mt-1">
                      {isEditing ? (
                       <Select 
                         value={formData.payment_status || ''} 
                         onValueChange={(value) => handleFormChange('payment_status', value)}
                         disabled={isSaving}
                       >
                         <SelectTrigger id="paymentStatus" className="mt-1">
                           <SelectValue placeholder="Select status..." />
                         </SelectTrigger>
                         <SelectContent>
                           {PAYMENT_STATUSES.map(status => (
                             <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     ) : order.payment_status === 'paid' ? (
                         <Badge variant="default">Paid</Badge>
                       ) : order.payment_status === 'unpaid' ? (
                         <Badge variant="destructive">Unpaid</Badge>
                       ) : (
                         <Badge variant="secondary">{order.payment_status || 'N/A'}</Badge> // Handle other statuses
                       )}
                   </div>
                 </div>
                 <div>
                   <Label className="text-sm font-medium text-muted-foreground">Stripe Receipt</Label>
                   {order.stripe_receipt_url ? ( // Assuming column name is stripe_receipt_url
                     <a 
                       href={order.stripe_receipt_url} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="mt-1 block text-blue-600 hover:underline text-sm truncate"
                     >
                       View Receipt ({order.stripe_receipt_url.substring(0, 30)}...)
                     </a>
                   ) : (
                     <p className="mt-1 text-sm text-muted-foreground">N/A</p>
                   )}
                 </div>
                 {/* Add payment_intent_id or other payment fields if needed */}
               </div>
             </div>
          </div>
        </TabsContent>
        <TabsContent value="purchaser">
          {/* TODO: Add separate Edit/Save controls for this section later */}
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Purchaser & Shipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Purchaser Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">Purchaser Details</h3>
                <div>
                  <Label htmlFor="purchaserName">Full Name</Label>
                  <Input id="purchaserName" defaultValue={order.purchaser_name || ''} readOnly className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="purchaserEmail">Email</Label>
                  <Input id="purchaserEmail" type="email" defaultValue={order.purchaser_email || ''} readOnly className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="purchaserPhone">Phone</Label>
                  <Input id="purchaserPhone" type="tel" defaultValue={order.purchaser_phone || ''} readOnly className="mt-1" />
                </div>
              </div>

              {/* Shipping Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2 mb-4">Shipping Address</h3>
                <div>
                  <Label htmlFor="shippingName">Recipient Name</Label>
                  <Input id="shippingName" defaultValue={order.shipping_name || ''} readOnly className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor="shippingAddress1">Address Line 1</Label>
                  <Input id="shippingAddress1" defaultValue={order.shipping_address_line1 || ''} readOnly className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor="shippingAddress2">Address Line 2</Label>
                  <Input id="shippingAddress2" defaultValue={order.shipping_address_line2 || ''} readOnly className="mt-1" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="shippingCity">City</Label>
                    <Input id="shippingCity" defaultValue={order.shipping_city || ''} readOnly className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="shippingState">State/Province</Label>
                    <Input id="shippingState" defaultValue={order.shipping_state || ''} readOnly className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="shippingPostalCode">Postal Code</Label>
                    <Input id="shippingPostalCode" defaultValue={order.shipping_postal_code || ''} readOnly className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="shippingCountry">Country</Label>
                  {/* TODO: Consider using a Select for country if you have a predefined list */}
                  <Input id="shippingCountry" defaultValue={order.shipping_country || ''} readOnly className="mt-1" />
                </div>
                {/* TODO: Add "Copy from purchaser" helper button here */}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="recipients">
           <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Recipients</h2>
            <RecipientGrid orderId={order.id} />
          </div>
        </TabsContent>
         <TabsContent value="monthly">
           <div className="p-4 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Monthly Card Settings</h2>
            <p>Table for monthly card settings (overrides, artwork) will go here.</p>
            {/* TODO: Implement MonthlySettingsTable component */}
          </div>
        </TabsContent>
         <TabsContent value="production">
           <div className="p-4 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Card Production</h2>
            <p>Table listing cards for production (status, AI story) will go here.</p>
            {/* TODO: Implement ProductionTable component */}
          </div>
        </TabsContent>
         <TabsContent value="internal">
           <div className="p-4 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Internal / Team</h2>
            <p>Assigned team member selector and internal notes will go here.</p>
            {/* TODO: Implement internal fields */}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* TODO: Add Right-side action bar here */}
    </div>
  );
};

export default AdminOrderDetailPage; 