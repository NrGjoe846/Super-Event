import { supabase } from '@/lib/supabase';
import { uploadImages } from './storageService';
import venueData from '../data/venues.json';
import { writeFile } from 'fs/promises';
import path from 'path';

export interface Venue {
  id?: string;
  name: string;
  location: string;
  capacity: string;
  description: string;
  price: number;
  amenities: string[];
  availability: string[];
  images: string[];
  rating: number;
  featured: boolean;
  bookings: any[];
  reviews: any[];
  created_at?: string;
  updated_at?: string;
  submitted_by?: string;
}

export interface DetailedVenueData {
  name: string;
  location: string;
  capacity: string;
  description: string;
  price: number;
  amenities: string[];
  availability: string[];
  imageFiles: File[];
  userId?: string;
}

// Function to update venues.json file
const updateVenuesFile = async (venues: Venue[]) => {
  try {
    const jsonPath = path.resolve(__dirname, '../data/venues.json');
    await writeFile(jsonPath, JSON.stringify({ venues }, null, 2));
  } catch (error) {
    console.error('Error updating venues.json:', error);
    throw error;
  }
};

// Add a new venue
export const addDetailedVenue = async (data: DetailedVenueData): Promise<string> => {
  try {
    const uploadedImageInfos = await uploadImages(data.imageFiles, 'venue-images');
    const imageUrls = uploadedImageInfos.map(info => info.url);

    const newVenue: Venue = {
      id: `v${venueData.venues.length + 1}`,
      name: data.name,
      location: data.location,
      capacity: data.capacity,
      description: data.description,
      price: data.price,
      amenities: data.amenities,
      availability: data.availability,
      images: imageUrls,
      rating: 0,
      featured: false,
      bookings: [],
      reviews: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      submitted_by: data.userId,
    };

    // Add to local data
    venueData.venues.push(newVenue);
    await updateVenuesFile(venueData.venues);

    // Also add to Supabase for persistence
    const { data: venue, error } = await supabase
      .from('venues')
      .insert(newVenue)
      .select()
      .single();

    if (error) throw error;
    return venue.id;
  } catch (error) {
    console.error("Error adding venue:", error);
    throw error;
  }
};

// Get all venues
export const getAllVenues = async (): Promise<Venue[]> => {
  try {
    // First try to get from Supabase
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback to local JSON if Supabase fails
      console.warn('Falling back to local venue data');
      return venueData.venues;
    }

    return data;
  } catch (error) {
    console.error("Error getting venues:", error);
    // Fallback to local JSON
    return venueData.venues;
  }
};

// Update an existing venue
export const editVenue = async (id: string, venueData: Partial<Venue>): Promise<void> => {
  try {
    // Update in local data
    const venueIndex = venueData.venues.findIndex(v => v.id === id);
    if (venueIndex !== -1) {
      venueData.venues[venueIndex] = {
        ...venueData.venues[venueIndex],
        ...venueData,
        updated_at: new Date().toISOString()
      };
      await updateVenuesFile(venueData.venues);
    }

    // Update in Supabase
    const { error } = await supabase
      .from('venues')
      .update({
        ...venueData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating venue:", error);
    throw error;
  }
};

// Delete a venue
export const deleteVenue = async (id: string): Promise<void> => {
  try {
    // Delete from local data
    venueData.venues = venueData.venues.filter(v => v.id !== id);
    await updateVenuesFile(venueData.venues);

    // Delete from Supabase
    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting venue:", error);
    throw error;
  }
};

// Add a review to a venue
export const addReview = async (venueId: string, review: any): Promise<void> => {
  try {
    const venue = venueData.venues.find(v => v.id === venueId);
    if (venue) {
      venue.reviews.push(review);
      venue.rating = calculateAverageRating(venue.reviews);
      await updateVenuesFile(venueData.venues);
    }
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

// Add a booking to a venue
export const addBooking = async (venueId: string, booking: any): Promise<void> => {
  try {
    const venue = venueData.venues.find(v => v.id === venueId);
    if (venue) {
      venue.bookings.push(booking);
      await updateVenuesFile(venueData.venues);
    }
  } catch (error) {
    console.error("Error adding booking:", error);
    throw error;
  }
};

// Helper function to calculate average rating
const calculateAverageRating = (reviews: any[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
};

// Subscribe to venue changes
export const subscribeToVenues = (callback: (venues: Venue[]) => void): (() => void) => {
  // Initial fetch
  getAllVenues().then(callback).catch(console.error);

  // Subscribe to realtime changes
  const subscription = supabase
    .channel('venues_channel')
    .on('postgres_changes', 
      {
        event: '*',
        schema: 'public',
        table: 'venues'
      },
      async () => {
        const venues = await getAllVenues();
        callback(venues);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};
