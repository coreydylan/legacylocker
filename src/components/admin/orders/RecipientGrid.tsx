import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle, Edit2, Trash2, Loader2 } from 'lucide-react';

// Zod schema for validation
const recipientSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().optional(), // Last name optional?
  birthday: z.string().optional(), 
  is_primary: z.boolean().default(false),
  // Add other fields like recipient_type, relationship if needed in the form
});

type RecipientFormData = z.infer<typeof recipientSchema>;

// Interface matching DB structure
interface OrderRecipient {
  id: string; 
  order_id: string;
  created_at?: string; 
  first_name?: string | null;
  last_name?: string | null;
  birthday?: string | null;
  is_primary?: boolean | null;
  recipient_type?: string | null;
  relationship?: string | null;
}

interface RecipientGridProps {
  orderId: string;
}

const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';
  try {
    // Attempt to parse and format. Adjust format as needed.
    return new Date(dateString + 'T00:00:00').toLocaleDateString(); 
  } catch {
    return 'Invalid Date';
  }
};

const RecipientGrid: React.FC<RecipientGridProps> = ({ orderId }) => {
  const [recipients, setRecipients] = useState<OrderRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // CRUD State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<OrderRecipient | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Store ID being deleted

  // React Hook Form setup
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<RecipientFormData>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
        first_name: '',
        last_name: '',
        birthday: '',
        is_primary: false,
    }
  });

  // Fetch Logic (moved into a reusable function)
  const fetchRecipients = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('order_recipients')
        .select('*')
        .eq('order_id', orderId)

      if (fetchError) {
        throw fetchError;
      }
      setRecipients(data || []);
    } catch (err: any) {
      console.error('Error fetching recipients:', err);
      setError('Failed to fetch recipients.');
      setRecipients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, [orderId]);

  // --- CRUD Handlers ---

  const handleOpenDialog = (recipient: OrderRecipient | null = null) => {
    setEditingRecipient(recipient);
    if (recipient) {
      // Pre-fill form for editing
      reset({
        first_name: recipient.first_name || '',
        last_name: recipient.last_name || '',
        birthday: recipient.birthday ? recipient.birthday.split('T')[0] : '',
        is_primary: recipient.is_primary || false,
      });
    } else {
      // Reset form for adding
      reset();
    }
    setIsDialogOpen(true);
  };

  const onSubmit: SubmitHandler<RecipientFormData> = async (formData) => {
    setIsSaving(true);
    try {
      const dataToSubmit = {
        first_name: formData.first_name,
        last_name: formData.last_name || null,
        birthday: formData.birthday || null,
        is_primary: formData.is_primary,
        order_id: orderId,
      };

      let error: any = null;
      if (editingRecipient) {
        // Update
        const { error: updateError } = await supabase
          .from('order_recipients')
          .update(dataToSubmit)
          .eq('id', editingRecipient.id);
        error = updateError;
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from('order_recipients')
          .insert(dataToSubmit);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Recipient ${editingRecipient ? 'updated' : 'added'} successfully.`,
      });
      setIsDialogOpen(false);
      fetchRecipients(); // Refresh the list

    } catch (err: any) {
      console.error('Error saving recipient:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to save recipient.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecipient = async (recipientId: string) => {
    if (isDeleting === recipientId) return; // Prevent double clicks

    if (window.confirm('Are you sure you want to delete this recipient?')) {
      setIsDeleting(recipientId);
      try {
        const { error: deleteError } = await supabase
          .from('order_recipients')
          .delete()
          .eq('id', recipientId);

        if (deleteError) {
          throw deleteError;
        }

        toast({
          title: "Success",
          description: "Recipient deleted successfully.",
        });
        fetchRecipients(); // Refresh the list

      } catch (err: any) {
        console.error('Error deleting recipient:', err);
        toast({
          title: "Error",
          description: err.message || "Failed to delete recipient.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(null);
      }
    }
  };

  if (loading) {
    return <p>Loading recipients...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error loading recipients: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => handleOpenDialog()}> 
              <PlusCircle className="mr-2 h-4 w-4" /> Add Recipient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingRecipient ? 'Edit Recipient' : 'Add New Recipient'}</DialogTitle>
              <DialogDescription>
                {editingRecipient ? 'Update the details for this recipient.' : 'Enter the details for the new recipient.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="first_name" className="text-right">First Name</Label>
                <Input id="first_name" {...register("first_name")} className="col-span-3" />
                {errors.first_name && <p className="col-span-4 text-red-500 text-sm text-right">{errors.first_name.message}</p>}
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="last_name" className="text-right">Last Name</Label>
                <Input id="last_name" {...register("last_name")} className="col-span-3" />
                {errors.last_name && <p className="col-span-4 text-red-500 text-sm text-right">{errors.last_name.message}</p>}
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthday" className="text-right">Birthday</Label>
                <Input id="birthday" type="date" {...register("birthday")} className="col-span-3" />
                {errors.birthday && <p className="col-span-4 text-red-500 text-sm text-right">{errors.birthday.message}</p>}
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="is_primary" className="text-right">Primary Recipient?</Label>
                 <div className="col-span-3 flex items-center">
                    <Checkbox id="is_primary" {...register("is_primary")} />
                 </div>
                {errors.is_primary && <p className="col-span-4 text-red-500 text-sm text-right">{errors.is_primary.message}</p>}
              </div>
               <DialogFooter>
                 <DialogClose asChild>
                   <Button type="button" variant="outline" disabled={isSaving}>Cancel</Button>
                 </DialogClose>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSaving ? 'Saving...' : 'Save Recipient'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead>Primary?</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recipients.length > 0 ? (
              recipients.map((recipient) => (
                <TableRow key={recipient.id}>
                  <TableCell className="font-medium">{`${recipient.first_name || ''} ${recipient.last_name || ''}`.trim() || '-'}</TableCell>
                  <TableCell>{formatDate(recipient.birthday)}</TableCell>
                  <TableCell>
                    {recipient.is_primary && <Badge variant="secondary">Primary</Badge>}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(recipient)} className="h-8 w-8">
                       <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteRecipient(recipient.id)} 
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      disabled={isDeleting === recipient.id}
                    >
                      {isDeleting === recipient.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No recipients added for this order yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecipientGrid; 