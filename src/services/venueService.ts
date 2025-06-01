import { supabase } from '@/lib/supabase';
import { uploadImages } from './storageService';

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

// Add a new venue
export const addDetailedVenue = async (data: DetailedVenueData): Promise<string> => {
  try {
    // First upload images
    const uploadedImageInfos = await uploadImages(data.imageFiles, 'venue-images');
    const imageUrls = uploadedImageInfos.map(info => info.url);

    // Prepare venue data for Supabase
    const venueData = {
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
      submitted_by: data.userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert into Supabase
    const { data: venue, error } = await supabase
      .from('venues')
      .insert([venueData])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(error.message);
    }

    if (!venue) {
      throw new Error('Failed to create venue - no data returned');
    }

    return venue.id;
  } catch (error) {
    console.error("Error adding venue:", error);
    throw error;
  }
};

// Get all venues
export const getAllVenues = async (): Promise<Venue[]> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error getting venues:", error);
    throw error;
  }
};

// Get venues by owner
export const getVenuesByOwner = async (userId: string): Promise<Venue[]> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('submitted_by', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error getting venues by owner:", error);
    throw error;
  }
};

// Update an existing venue
export const editVenue = async (id: string, venueData: Partial<Venue>): Promise<void> => {
  try {
    const updateData = {
      ...venueData,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('venues')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error updating venue:", error);
    throw error;
  }
};

// Delete a venue
export const deleteVenue = async (id: string, userId?: string): Promise<void> => {
  try {
    let query = supabase
      .from('venues')
      .delete();

    // If userId is provided, ensure the venue belongs to the user
    if (userId) {
      query = query.eq('submitted_by', userId);
    }

    const { error } = await query.eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error deleting venue:", error);
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
