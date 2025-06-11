import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Venue, addDetailedVenue as addVenue, editVenue } from '../services/venueService';

// Enhanced schema for form validation using Zod
const venueSchema = z.object({
  venueName: z.string().min(3, { message: 'Venue name must be at least 3 characters long' }),
  location: z.string().min(5, { message: 'Location must be at least 5 characters long' }),
  minCapacity: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().min(10, { message: 'Minimum capacity must be at least 10' })
  ),
  maxCapacity: z.preprocess(
    (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().min(10, { message: 'Maximum capacity must be at least 10' })
  ),
  description: z.string().min(50, { message: 'Description must be at least 50 characters long' }),
  price: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().min(1000, { message: 'Price must be at least ₹1,000' })
  ),
  contactEmail: z.string().email({ message: 'Please enter a valid email address' }).optional().or(z.literal('')),
  contactPhone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }).optional().or(z.literal('')),
  website: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  specialFeatures: z.string().optional(),
  parkingSpaces: z.preprocess(
    (val) => (typeof val === 'string' && val !== '' ? parseInt(val, 10) : undefined),
    z.number().min(0).optional()
  ),
  setupTime: z.preprocess(
    (val) => (typeof val === 'string' && val !== '' ? parseFloat(val) : undefined),
    z.number().min(0).optional()
  ),
  cleanupTime: z.preprocess(
    (val) => (typeof val === 'string' && val !== '' ? parseFloat(val) : undefined),
    z.number().min(0).optional()
  ),
  cancellationPolicy: z.string().optional(),
  paymentTerms: z.string().optional(),
}).refine((data) => data.maxCapacity > data.minCapacity, {
  message: "Maximum capacity must be greater than minimum capacity",
  path: ["maxCapacity"],
});

export type VenueFormData = z.infer<typeof venueSchema>;

interface VenueFormProps {
  venueToEdit?: Venue | null;
  onFormSubmit: () => void;
  onCancel?: () => void;
}

const VenueForm: React.FC<VenueFormProps> = ({ venueToEdit, onFormSubmit, onCancel }) => {
  const isEditMode = !!venueToEdit;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue, watch } = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      venueName: '',
      location: '',
      minCapacity: 10,
      maxCapacity: 100,
      description: '',
      price: 1000,
      contactEmail: '',
      contactPhone: '',
      website: '',
      specialFeatures: '',
      parkingSpaces: undefined,
      setupTime: undefined,
      cleanupTime: undefined,
      cancellationPolicy: '',
      paymentTerms: '',
    },
  });

  useEffect(() => {
    if (venueToEdit) {
      // Parse capacity string to get min and max values
      const capacityParts = venueToEdit.capacity?.split('-') || ['10', '100'];
      const minCapacity = parseInt(capacityParts[0]) || 10;
      const maxCapacity = parseInt(capacityParts[1]) || 100;

      reset({
        venueName: venueToEdit.name || '',
        location: venueToEdit.location || '',
        minCapacity,
        maxCapacity,
        description: venueToEdit.description || '',
        price: venueToEdit.price || 1000,
        contactEmail: venueToEdit.contact_email || '',
        contactPhone: venueToEdit.contact_phone || '',
        website: venueToEdit.website || '',
        specialFeatures: venueToEdit.special_features || '',
        parkingSpaces: venueToEdit.parking_spaces || undefined,
        setupTime: venueToEdit.setup_time || undefined,
        cleanupTime: venueToEdit.cleanup_time || undefined,
        cancellationPolicy: venueToEdit.cancellation_policy || '',
        paymentTerms: venueToEdit.payment_terms || '',
      });
    } else {
      reset({
        venueName: '',
        location: '',
        minCapacity: 10,
        maxCapacity: 100,
        description: '',
        price: 1000,
        contactEmail: '',
        contactPhone: '',
        website: '',
        specialFeatures: '',
        parkingSpaces: undefined,
        setupTime: undefined,
        cleanupTime: undefined,
        cancellationPolicy: '',
        paymentTerms: '',
      });
    }
  }, [venueToEdit, reset]);

  const onSubmit: SubmitHandler<VenueFormData> = async (data) => {
    try {
      if (isEditMode && venueToEdit?.id) {
        const updateData = {
          name: data.venueName,
          location: data.location,
          capacity: `${data.minCapacity}-${data.maxCapacity}`,
          description: data.description,
          price: data.price,
          contact_email: data.contactEmail || null,
          contact_phone: data.contactPhone || null,
          website: data.website || null,
          special_features: data.specialFeatures || null,
          parking_spaces: data.parkingSpaces || null,
          setup_time: data.setupTime || null,
          cleanup_time: data.cleanupTime || null,
          cancellation_policy: data.cancellationPolicy || null,
          payment_terms: data.paymentTerms || null,
        };
        
        await editVenue(venueToEdit.id, updateData);
        toast.success('Venue updated successfully!');
      } else {
        const venueData = {
          venueName: data.venueName,
          location: data.location,
          capacity: `${data.minCapacity}-${data.maxCapacity}`,
          description: data.description,
          price: data.price,
          amenities: [], // Will be set in the full add venue form
          availability: [], // Will be set in the full add venue form
          imageFiles: [], // Will be set in the full add venue form
          contactEmail: data.contactEmail || undefined,
          contactPhone: data.contactPhone || undefined,
          website: data.website || undefined,
          specialFeatures: data.specialFeatures || undefined,
          parkingSpaces: data.parkingSpaces?.toString() || undefined,
          setupTime: data.setupTime?.toString() || undefined,
          cleanupTime: data.cleanupTime?.toString() || undefined,
          cancellationPolicy: data.cancellationPolicy || undefined,
          paymentTerms: data.paymentTerms || undefined,
        };
        
        await addVenue(venueData);
        toast.success('Venue added successfully!');
      }
      reset();
      onFormSubmit();
    } catch (error) {
      console.error('Failed to save venue:', error);
      toast.error('Failed to save venue. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4 border rounded-lg shadow-sm bg-card text-card-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label htmlFor="venueName">Venue Name *</Label>
          <Input id="venueName" {...register('venueName')} className="mt-1" placeholder="e.g., Royal Palace Banquet Hall" />
          {errors.venueName && <p className="text-sm text-red-500 mt-1">{errors.venueName.message}</p>}
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="location">Complete Address *</Label>
          <Input id="location" {...register('location')} className="mt-1" placeholder="e.g., 123 Main Street, New Delhi, India - 110001" />
          {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <Label htmlFor="minCapacity">Minimum Capacity *</Label>
          <Input id="minCapacity" type="number" {...register('minCapacity')} className="mt-1" placeholder="e.g., 100" />
          {errors.minCapacity && <p className="text-sm text-red-500 mt-1">{errors.minCapacity.message}</p>}
        </div>

        <div>
          <Label htmlFor="maxCapacity">Maximum Capacity *</Label>
          <Input id="maxCapacity" type="number" {...register('maxCapacity')} className="mt-1" placeholder="e.g., 500" />
          {errors.maxCapacity && <p className="text-sm text-red-500 mt-1">{errors.maxCapacity.message}</p>}
        </div>

        <div>
          <Label htmlFor="price">Price per Day (₹) *</Label>
          <Input id="price" type="number" {...register('price')} className="mt-1" placeholder="50000" />
          {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <Label htmlFor="parkingSpaces">Parking Spaces</Label>
          <Input id="parkingSpaces" type="number" {...register('parkingSpaces')} className="mt-1" placeholder="e.g., 50" />
          {errors.parkingSpaces && <p className="text-sm text-red-500 mt-1">{errors.parkingSpaces.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" {...register('description')} className="mt-1" rows={4} placeholder="Describe your venue in detail..." />
        {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="specialFeatures">Special Features</Label>
        <Textarea id="specialFeatures" {...register('specialFeatures')} className="mt-1" rows={3} placeholder="Any unique features, recent renovations, awards..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="setupTime">Setup Time (Hours)</Label>
          <Input id="setupTime" type="number" step="0.5" {...register('setupTime')} className="mt-1" placeholder="e.g., 2" />
          {errors.setupTime && <p className="text-sm text-red-500 mt-1">{errors.setupTime.message}</p>}
        </div>

        <div>
          <Label htmlFor="cleanupTime">Cleanup Time (Hours)</Label>
          <Input id="cleanupTime" type="number" step="0.5" {...register('cleanupTime')} className="mt-1" placeholder="e.g., 1" />
          {errors.cleanupTime && <p className="text-sm text-red-500 mt-1">{errors.cleanupTime.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input id="contactEmail" type="email" {...register('contactEmail')} className="mt-1" placeholder="venue@example.com" />
          {errors.contactEmail && <p className="text-sm text-red-500 mt-1">{errors.contactEmail.message}</p>}
        </div>

        <div>
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input id="contactPhone" type="tel" {...register('contactPhone')} className="mt-1" placeholder="+91 98765 43210" />
          {errors.contactPhone && <p className="text-sm text-red-500 mt-1">{errors.contactPhone.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="website">Website URL</Label>
        <Input id="website" type="url" {...register('website')} className="mt-1" placeholder="https://www.yourvenue.com" />
        {errors.website && <p className="text-sm text-red-500 mt-1">{errors.website.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
          <select id="cancellationPolicy" {...register('cancellationPolicy')} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
            <option value="">Select policy</option>
            <option value="flexible">Flexible (24 hours notice)</option>
            <option value="moderate">Moderate (7 days notice)</option>
            <option value="strict">Strict (30 days notice)</option>
            <option value="non-refundable">Non-refundable</option>
          </select>
        </div>

        <div>
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <select id="paymentTerms" {...register('paymentTerms')} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue/20">
            <option value="">Select terms</option>
            <option value="full-advance">Full payment in advance</option>
            <option value="50-50">50% advance, 50% on event day</option>
            <option value="30-70">30% advance, 70% on event day</option>
            <option value="installments">Multiple installments</option>
          </select>
        </div>
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
