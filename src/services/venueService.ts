import { supabase } from '@/lib/supabase';
import { uploadImages } from './storageService';

export interface Venue {
  id?: string;
  venueName: string;
  location: string;
  capacity: string;
  description: string;
  price?: number;
  amenities?: string[];
  availability?: string[];
  images: string[];
  created_at?: string;
  updated_at?: string;
  submitted_by?: string;
  featured?: boolean;
  rating?: number;
}

export interface DetailedVenueData {
  venueName: string;
  location: string;
  capacity: string;
  description: string;
  price: number;
  amenities: string[];
  availability: string[];
  imageFiles: File[];
  userId?: string;
}

// Add a new venue with detailed information and image uploads
export const addDetailedVenue = async (data: DetailedVenueData): Promise<string> => {
  try {
    const uploadedImageInfos = await uploadImages(data.imageFiles, 'venue-images');
    const imageUrls = uploadedImageInfos.map(info => info.url);

    const venueData = {
      venueName: data.venueName,
      location: data.location,
      capacity: data.capacity,
      description: data.description,
      price: data.price,
      amenities: data.amenities,
      availability: data.availability,
      images: imageUrls,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      submitted_by: data.userId,
    };

    const { data: venue, error } = await supabase
      .from('venues')
      .insert(venueData)
      .select()
      .single();

    if (error) throw error;
    return venue.id;
  } catch (error) {
    console.error("Error adding detailed venue: ", error);
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
    console.error("Error getting all venues: ", error);
    throw error;
  }
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
      async (payload) => {
        // Fetch all venues again to ensure we have the complete, updated list
        const venues = await getAllVenues();
        callback(venues);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
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
    console.error("Error updating venue: ", error);
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
    console.error("Error deleting venue: ", error);
    throw error;
  }
};
