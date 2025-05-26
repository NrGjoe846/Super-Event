import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button'; // Assuming shadcn/ui button
import { Input } from './ui/input';   // Assuming shadcn/ui input
import { Textarea } from './ui/textarea'; // Assuming shadcn/ui textarea
import { Label } from './ui/label';   // Assuming shadcn/ui label
import { toast } from 'sonner';      // Assuming sonner for toasts
import { Venue, addDetailedVenue as addVenue, editVenue } from '../services/venueService';

// Schema for form validation using Zod
const venueSchema = z.object({
  venueName: z.string().min(3, { message: 'Venue name must be at least 3 characters long' }),
  location: z.string().min(3, { message: 'Location must be at least 3 characters long' }),
  capacity: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().min(1, { message: 'Capacity must be a positive number' })
  ),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL' }),
});

export type VenueFormData = z.infer<typeof venueSchema>;

interface VenueFormProps {
  venueToEdit?: Venue | null;
  onFormSubmit: () => void; // Callback to refresh list or close modal
  onCancel?: () => void;
}

const VenueForm: React.FC<VenueFormProps> = ({ venueToEdit, onFormSubmit, onCancel }) => {
  const isEditMode = !!venueToEdit;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: venueToEdit || {
      venueName: '',
      location: '',
      capacity: 0,
      description: '',
      imageUrl: '',
    },
  });

  useEffect(() => {
    if (venueToEdit) {
      reset(venueToEdit);
    } else {
      reset({
        venueName: '',
        location: '',
        capacity: 0,
        description: '',
        imageUrl: '',
      });
    }
  }, [venueToEdit, reset]);

  const onSubmit: SubmitHandler<VenueFormData> = async (data) => {
    try {
      if (isEditMode && venueToEdit?.id) {
        await editVenue(venueToEdit.id, data);
        toast.success('Venue updated successfully!');
      } else {
        await addVenue(data);
        toast.success('Venue added successfully!');
      }
      reset();
      onFormSubmit(); // Call parent callback
    } catch (error) {
      console.error('Failed to save venue:', error);
      toast.error('Failed to save venue. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
      <div>
        <Label htmlFor="venueName">Venue Name</Label>
        <Input id="venueName" {...register('venueName')} className="mt-1" />
        {errors.venueName && <p className="text-sm text-red-500 mt-1">{errors.venueName.message}</p>}
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" {...register('location')} className="mt-1" />
        {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
      </div>

      <div>
        <Label htmlFor="capacity">Capacity</Label>
        <Input id="capacity" type="number" {...register('capacity')} className="mt-1" />
        {errors.capacity && <p className="text-sm text-red-500 mt-1">{errors.capacity.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} className="mt-1" />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" {...register('imageUrl')} className="mt-1" />
        {errors.imageUrl && <p className="text-sm text-red-500 mt-1">{errors.imageUrl.message}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Venue')}
        </Button>
      </div>
    </form>
  );
};

export default VenueForm;
