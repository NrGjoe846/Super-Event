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

// Add a new venue
export const addDetailedVenue = async (data: DetailedVenueData): Promise<string> => {
  try {
    // First upload images
    const uploadedImageInfos = await uploadImages(data.imageFiles, 'venue-images');
    const imageUrls = uploadedImageInfos.map(info => info.url);

    // Prepare venue data for Supabase
    const venueData = {
      name: data.venueName,
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

// Get all venues with fallback to mock data
export const getAllVenues = async (): Promise<Venue[]> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      // Return mock data as fallback
      return getMockVenues();
    }

    if (!data || data.length === 0) {
      // Return mock data if no venues found
      return getMockVenues();
    }

    return data;
  } catch (error) {
    console.error("Error getting venues:", error);
    // Return mock data as fallback
    return getMockVenues();
  }
};

// Mock venues for fallback
const getMockVenues = (): Venue[] => {
  return [
    {
      id: "1",
      name: "Taj Palace Banquet Hall",
      location: "New Delhi, India",
      description: "A luxurious banquet hall perfect for grand weddings and corporate events",
      capacity: "200-1000",
      price: 75000,
      rating: 4.9,
      featured: true,
      images: [
        "https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg",
        "https://images.pexels.com/photos/265129/pexels-photo-265129.jpeg",
        "https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg"
      ],
      amenities: [
        "Valet Parking",
        "Catering",
        "DJ System",
        "Air Conditioning",
        "Decoration"
      ],
      availability: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      bookings: [],
      reviews: []
    },
    {
      id: "2",
      name: "Marine Drive Convention",
      location: "Mumbai, Maharashtra",
      description: "Modern convention center with stunning sea views",
      capacity: "100-500",
      price: 65000,
      rating: 4.7,
      featured: false,
      images: [
        "https://images.pexels.com/photos/260928/pexels-photo-260928.jpeg",
        "https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg"
      ],
      amenities: [
        "WiFi",
        "Projector",
        "Sound System",
        "Catering",
        "Security"
      ],
      availability: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      bookings: [],
      reviews: []
    },
    {
      id: "3",
      name: "Royal Rajputana Heritage",
      location: "Jaipur, Rajasthan",
      description: "Historic palace venue with traditional Rajasthani architecture",
      capacity: "150-800",
      price: 82000,
      rating: 4.8,
      featured: true,
      images: [
        "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg",
        "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg"
      ],
      amenities: [
        "Heritage Architecture",
        "Royal Catering",
        "Traditional Music",
        "Parking",
        "Photography"
      ],
      availability: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      bookings: [],
      reviews: []
    },
    {
      id: "4",
      name: "Mysore Palace Gardens",
      location: "Mysore, Karnataka",
      description: "Beautiful garden venue with palace backdrop",
      capacity: "300-1200",
      price: 120000,
      rating: 4.9,
      featured: false,
      images: [
        "https://images.pexels.com/photos/2291462/pexels-photo-2291462.jpeg",
        "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg"
      ],
      amenities: [
        "Garden Setting",
        "Palace Views",
        "Catering",
        "Parking",
        "Security"
      ],
      availability: [
        "Friday",
        "Saturday",
        "Sunday"
      ],
      bookings: [],
      reviews: []
    },
    {
      id: "5",
      name: "Kerala Backwaters Resort",
      location: "Kochi, Kerala",
      description: "Serene backwater venue perfect for intimate celebrations",
      capacity: "50-300",
      price: 95000,
      rating: 4.6,
      featured: false,
      images: [
        "https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg",
        "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg"
      ],
      amenities: [
        "Waterfront",
        "Boat Access",
        "Seafood Catering",
        "Accommodation",
        "Spa Services"
      ],
      availability: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      bookings: [],
      reviews: []
    }
  ];
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
