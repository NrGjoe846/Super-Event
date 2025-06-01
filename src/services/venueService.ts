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
    const uploadedImageInfos = await uploadImages(data.imageFiles, 'venue-images');
    const imageUrls = uploadedImageInfos.map(info => info.url);

    const newVenue: Venue = {
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
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting venues:", error);
    throw error;
  }
};

// Update an existing venue
export const editVenue = async (id: string, venueData: Partial<Venue>): Promise<void> => {
  try {
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
