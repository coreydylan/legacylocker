import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const customCardSchema = z.object({
  celebrationType: z.string().min(1, 'Please select a celebration type'),
  date: z.date().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  photoUrl: z.string().optional(),
});

type CustomCardFormValues = z.infer<typeof customCardSchema>;

interface CustomCardFormProps {
  initialData?: Partial<CustomCardFormValues>;
  onSubmit: (data: CustomCardFormValues) => void;
  onPhotoUpload?: (file: File) => void;
}

export const CustomCardForm: React.FC<CustomCardFormProps> = ({
  initialData,
  onSubmit,
  onPhotoUpload,
}) => {
  const form = useForm<CustomCardFormValues>({
    resolver: zodResolver(customCardSchema),
    defaultValues: initialData,
  });

  const handleSubmit = (data: CustomCardFormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Celebration Type</label>
          <Select
            value={form.watch('celebrationType')}
            onValueChange={(value) => form.setValue('celebrationType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select celebration type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Birthday">Birthday</SelectItem>
              <SelectItem value="Anniversary">Anniversary</SelectItem>
              <SelectItem value="Graduation">Graduation</SelectItem>
              <SelectItem value="Wedding">Wedding</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.celebrationType && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.celebrationType.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !form.watch('date') && 'text-muted-foreground'
                )}
              >
                {form.watch('date') ? format(form.watch('date')!, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch('date')}
                onSelect={(date) => form.setValue('date', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <Input
            {...form.register('title')}
            placeholder="Enter title"
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea
            {...form.register('description')}
            placeholder="Enter description"
            rows={4}
          />
          {form.formState.errors.description && (
            <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onPhotoUpload) {
                onPhotoUpload(file);
              }
            }}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Changes
      </Button>
    </form>
  );
}; 