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
  submitted_by?: string;
  status?: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
  event_types?: string[];
  parking_spaces?: number;
  setup_time?: number;
  cleanup_time?: number;
  cancellation_policy?: string;
  payment_terms?: string;
  special_features?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
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
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  specialFeatures?: string;
  eventTypes?: string[];
  parkingSpaces?: string;
  setupTime?: string;
  cleanupTime?: string;
  cancellationPolicy?: string;
  paymentTerms?: string;
}

export interface VenueAnalytics {
  total_views: number;
  total_bookings: number;
  total_favorites: number;
  recent_views: number;
  conversion_rate: number;
}

export interface VenueBooking {
  id?: string;
  venue_id: string;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  guest_count: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string;
  created_at?: string;
}

// Real-time subscription management
let venueSubscription: any = null;
let venueCallbacks: ((venues: Venue[]) => void)[] = [];

// Add a new venue with real-time updates
export const addDetailedVenue = async (data: DetailedVenueData): Promise<string> => {
  try {
    // First upload images if any
    let imageUrls: string[] = [];
    if (data.imageFiles && data.imageFiles.length > 0) {
      const uploadedImageInfos = await uploadImages(data.imageFiles, 'venue-images');
      imageUrls = uploadedImageInfos.map(info => info.url);
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to add venues');
    }

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
      submitted_by: user.id,
      status: 'pending' as const,
      event_types: data.eventTypes || [],
      parking_spaces: data.parkingSpaces ? parseInt(data.parkingSpaces) : null,
      setup_time: data.setupTime ? parseFloat(data.setupTime) : null,
      cleanup_time: data.cleanupTime ? parseFloat(data.cleanupTime) : null,
      cancellation_policy: data.cancellationPolicy || null,
      payment_terms: data.paymentTerms || null,
      special_features: data.specialFeatures || null,
      contact_email: data.contactEmail || null,
      contact_phone: data.contactPhone || null,
      website: data.website || null,
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

// Get all approved venues
export const getAllVenues = async (): Promise<Venue[]> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error:', error);
      return getMockVenues();
    }

    if (!data || data.length === 0) {
      return getMockVenues();
    }

    return data;
  } catch (error) {
    console.error("Error getting venues:", error);
    return getMockVenues();
  }
};

// Get venues by owner with real-time updates
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

    return data || [];
  } catch (error) {
    console.error("Error getting venues by owner:", error);
    throw error;
  }
};

// Get single venue with analytics
export const getVenueById = async (id: string): Promise<Venue | null> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .eq('status', 'approved')
      .single();

    if (error) {
      console.error('Error fetching venue:', error);
      return null;
    }

    // Increment view count
    await incrementVenueViews(id);

    return data;
  } catch (error) {
    console.error("Error getting venue by ID:", error);
    return null;
  }
};

// Increment venue views
export const incrementVenueViews = async (venueId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.rpc('increment_venue_views', {
      venue_uuid: venueId,
      user_uuid: user?.id || null,
      ip_addr: null,
      user_agent_string: navigator.userAgent
    });
  } catch (error) {
    console.error('Error incrementing venue views:', error);
  }
};

// Get venue analytics
export const getVenueAnalytics = async (venueId: string): Promise<VenueAnalytics | null> => {
  try {
    const { data, error } = await supabase.rpc('get_venue_analytics', {
      venue_uuid: venueId
    });

    if (error) {
      console.error('Error fetching venue analytics:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error getting venue analytics:", error);
    return null;
  }
};

// Update venue status (for admin use)
export const updateVenueStatus = async (venueId: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> => {
  try {
    const { error } = await supabase
      .from('venues')
      .update({ status })
      .eq('id', venueId);

    if (error) {
      console.error('Error updating venue status:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error updating venue status:", error);
    throw error;
  }
};

// Update an existing venue
export const editVenue = async (id: string, venueData: Partial<Venue>): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const updateData = {
      ...venueData,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('venues')
      .update(updateData)
      .eq('id', id)
      .eq('submitted_by', user.id); // Ensure user can only edit their own venues

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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', id)
      .eq('submitted_by', user.id); // Ensure user can only delete their own venues

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error deleting venue:", error);
    throw error;
  }
};

// Add venue to favorites
export const addToFavorites = async (venueId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { error } = await supabase
      .from('venue_favorites')
      .insert([{ venue_id: venueId, user_id: user.id }]);

    if (error && error.code !== '23505') { // Ignore duplicate key error
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

// Remove venue from favorites
export const removeFromFavorites = async (venueId: string): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { error } = await supabase
      .from('venue_favorites')
      .delete()
      .eq('venue_id', venueId)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

// Get user's favorite venues
export const getUserFavorites = async (): Promise<Venue[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return [];
    }

    const { data, error } = await supabase
      .from('venue_favorites')
      .select(`
        venue_id,
        venues (*)
      `)
      .eq('user_id', user.id);

    if (error) {
      throw new Error(error.message);
    }

    return data?.map(item => item.venues).filter(Boolean) || [];
  } catch (error) {
    console.error("Error getting user favorites:", error);
    return [];
  }
};

// Create a venue booking
export const createVenueBooking = async (bookingData: Omit<VenueBooking, 'id' | 'created_at'>): Promise<VenueBooking> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
      .from('venue_bookings')
      .insert([{ ...bookingData, user_id: user.id }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// Get venue bookings for a specific venue
export const getVenueBookings = async (venueId: string): Promise<VenueBooking[]> => {
  try {
    const { data, error } = await supabase
      .from('venue_bookings')
      .select('*')
      .eq('venue_id', venueId)
      .order('booking_date', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Error getting venue bookings:", error);
    return [];
  }
};

// Check venue availability for a specific date and time
export const checkVenueAvailability = async (
  venueId: string, 
  date: string, 
  startTime: string, 
  endTime: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('venue_bookings')
      .select('id')
      .eq('venue_id', venueId)
      .eq('booking_date', date)
      .neq('status', 'cancelled')
      .or(`and(start_time.lte.${startTime},end_time.gt.${startTime}),and(start_time.lt.${endTime},end_time.gte.${endTime}),and(start_time.gte.${startTime},end_time.lte.${endTime})`);

    if (error) {
      throw new Error(error.message);
    }

    return !data || data.length === 0;
  } catch (error) {
    console.error("Error checking venue availability:", error);
    return false;
  }
};

// Real-time subscription management
const notifyVenueCallbacks = async () => {
  try {
    const venues = await getAllVenues();
    venueCallbacks.forEach(callback => callback(venues));
  } catch (error) {
    console.error('Error notifying venue callbacks:', error);
  }
};

// Subscribe to venue changes with real-time updates
export const subscribeToVenues = (callback: (venues: Venue[]) => void): (() => void) => {
  // Add callback to list
  venueCallbacks.push(callback);

  // Initial fetch
  getAllVenues().then(callback).catch(console.error);

  // Set up real-time subscription if not already done
  if (!venueSubscription) {
    venueSubscription = supabase
      .channel('venues_realtime')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'venues'
        },
        async (payload) => {
          console.log('Real-time venue update:', payload);
          await notifyVenueCallbacks();
        }
      )
      .subscribe((status) => {
        console.log('Venue subscription status:', status);
      });
  }

  // Return unsubscribe function
  return () => {
    // Remove callback from list
    venueCallbacks = venueCallbacks.filter(cb => cb !== callback);
    
    // If no more callbacks, unsubscribe from real-time
    if (venueCallbacks.length === 0 && venueSubscription) {
      venueSubscription.unsubscribe();
      venueSubscription = null;
    }
  };
};

// Subscribe to user's venues (for venue owners)
export const subscribeToUserVenues = (userId: string, callback: (venues: Venue[]) => void): (() => void) => {
  // Initial fetch
  getVenuesByOwner(userId).then(callback).catch(console.error);

  // Set up real-time subscription
  const subscription = supabase
    .channel(`user_venues_${userId}`)
    .on('postgres_changes', 
      {
        event: '*',
        schema: 'public',
        table: 'venues',
        filter: `submitted_by=eq.${userId}`
      },
      async () => {
        const venues = await getVenuesByOwner(userId);
        callback(venues);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};

// Search venues with filters
export const searchVenues = async (filters: {
  query?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  capacity?: string;
  eventType?: string;
}): Promise<Venue[]> => {
  try {
    let query = supabase
      .from('venues')
      .select('*')
      .eq('status', 'approved');

    // Text search
    if (filters.query) {
      query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%,location.ilike.%${filters.query}%`);
    }

    // Location filter
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    // Price range filter
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      query = query.overlaps('amenities', filters.amenities);
    }

    // Event type filter
    if (filters.eventType) {
      query = query.overlaps('event_types', [filters.eventType]);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Error searching venues:", error);
    return [];
  }
};

// Get venue statistics for dashboard
export const getVenueStatistics = async (userId?: string): Promise<{
  totalVenues: number;
  approvedVenues: number;
  pendingVenues: number;
  rejectedVenues: number;
  totalBookings: number;
  totalRevenue: number;
}> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      throw new Error('User ID required');
    }

    // Get venue counts
    const { data: venues, error: venuesError } = await supabase
      .from('venues')
      .select('id, status')
      .eq('submitted_by', targetUserId);

    if (venuesError) throw venuesError;

    const totalVenues = venues?.length || 0;
    const approvedVenues = venues?.filter(v => v.status === 'approved').length || 0;
    const pendingVenues = venues?.filter(v => v.status === 'pending').length || 0;
    const rejectedVenues = venues?.filter(v => v.status === 'rejected').length || 0;

    // Get booking statistics
    const { data: bookings, error: bookingsError } = await supabase
      .from('venue_bookings')
      .select('total_amount')
      .in('venue_id', venues?.map(v => v.id) || []);

    if (bookingsError) throw bookingsError;

    const totalBookings = bookings?.length || 0;
    const totalRevenue = bookings?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;

    return {
      totalVenues,
      approvedVenues,
      pendingVenues,
      rejectedVenues,
      totalBookings,
      totalRevenue
    };
  } catch (error) {
    console.error("Error getting venue statistics:", error);
    return {
      totalVenues: 0,
      approvedVenues: 0,
      pendingVenues: 0,
      rejectedVenues: 0,
      totalBookings: 0,
      totalRevenue: 0
    };
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
      reviews: [],
      status: 'approved'
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
      reviews: [],
      status: 'approved'
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
      reviews: [],
      status: 'approved'
    }
  ];
};
