import { Venue } from './venueService';

const VENUES_STORAGE_KEY = 'super_events_venues';
const USER_VENUES_KEY = 'super_events_user_venues';

export interface LocalVenueData {
  id: string;
  name: string;
  location: string;
  capacity: string;
  description: string;
  price: number;
  amenities: string[];
  availability: string[];
  images: string[]; // Base64 encoded images
  rating: number;
  featured: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  submitted_by: string;
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

// Convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Save venue to JSON storage
export const saveVenueToJSON = async (venueData: any, userId: string): Promise<string> => {
  try {
    // Convert image files to base64
    const imageBase64Array: string[] = [];
    if (venueData.imageFiles && venueData.imageFiles.length > 0) {
      for (const file of venueData.imageFiles) {
        const base64 = await fileToBase64(file);
        imageBase64Array.push(base64);
      }
    }

    // Create venue object
    const venue: LocalVenueData = {
      id: `venue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: venueData.venueName,
      location: venueData.location,
      capacity: venueData.capacity,
      description: venueData.description,
      price: venueData.price,
      amenities: venueData.amenities || [],
      availability: venueData.availability || [],
      images: imageBase64Array,
      rating: 0,
      featured: false,
      status: 'approved', // Auto-approve for demo
      created_at: new Date().toISOString(),
      submitted_by: userId,
      event_types: venueData.eventTypes || [],
      parking_spaces: venueData.parkingSpaces ? parseInt(venueData.parkingSpaces) : undefined,
      setup_time: venueData.setupTime ? parseFloat(venueData.setupTime) : undefined,
      cleanup_time: venueData.cleanupTime ? parseFloat(venueData.cleanupTime) : undefined,
      cancellation_policy: venueData.cancellationPolicy || undefined,
      payment_terms: venueData.paymentTerms || undefined,
      special_features: venueData.specialFeatures || undefined,
      contact_email: venueData.contactEmail || undefined,
      contact_phone: venueData.contactPhone || undefined,
      website: venueData.website || undefined,
    };

    // Get existing venues
    const existingVenues = getVenuesFromJSON();
    
    // Add new venue
    existingVenues.push(venue);
    
    // Save to localStorage
    localStorage.setItem(VENUES_STORAGE_KEY, JSON.stringify(existingVenues));
    
    // Also save user-specific venues
    const userVenues = getUserVenuesFromJSON(userId);
    userVenues.push(venue);
    localStorage.setItem(`${USER_VENUES_KEY}_${userId}`, JSON.stringify(userVenues));

    console.log('Venue saved to JSON:', venue);
    return venue.id;
  } catch (error) {
    console.error('Error saving venue to JSON:', error);
    throw error;
  }
};

// Get all venues from JSON storage
export const getVenuesFromJSON = (): LocalVenueData[] => {
  try {
    const stored = localStorage.getItem(VENUES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading venues from JSON:', error);
    return [];
  }
};

// Get user-specific venues from JSON storage
export const getUserVenuesFromJSON = (userId: string): LocalVenueData[] => {
  try {
    const stored = localStorage.getItem(`${USER_VENUES_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading user venues from JSON:', error);
    return [];
  }
};

// Convert LocalVenueData to Venue format for compatibility
export const convertToVenueFormat = (localVenue: LocalVenueData): Venue => {
  return {
    id: localVenue.id,
    name: localVenue.name,
    location: localVenue.location,
    capacity: localVenue.capacity,
    description: localVenue.description,
    price: localVenue.price,
    amenities: localVenue.amenities,
    availability: localVenue.availability,
    images: localVenue.images,
    rating: localVenue.rating,
    featured: localVenue.featured,
    bookings: [],
    reviews: [],
    status: localVenue.status,
    created_at: localVenue.created_at,
    submitted_by: localVenue.submitted_by,
    event_types: localVenue.event_types,
    parking_spaces: localVenue.parking_spaces,
    setup_time: localVenue.setup_time,
    cleanup_time: localVenue.cleanup_time,
    cancellation_policy: localVenue.cancellation_policy,
    payment_terms: localVenue.payment_terms,
    special_features: localVenue.special_features,
    contact_email: localVenue.contact_email,
    contact_phone: localVenue.contact_phone,
    website: localVenue.website,
  };
};

// Delete venue from JSON storage
export const deleteVenueFromJSON = (venueId: string, userId: string): void => {
  try {
    // Remove from all venues
    const allVenues = getVenuesFromJSON();
    const filteredAllVenues = allVenues.filter(venue => venue.id !== venueId);
    localStorage.setItem(VENUES_STORAGE_KEY, JSON.stringify(filteredAllVenues));
    
    // Remove from user venues
    const userVenues = getUserVenuesFromJSON(userId);
    const filteredUserVenues = userVenues.filter(venue => venue.id !== venueId);
    localStorage.setItem(`${USER_VENUES_KEY}_${userId}`, JSON.stringify(filteredUserVenues));
    
    console.log('Venue deleted from JSON:', venueId);
  } catch (error) {
    console.error('Error deleting venue from JSON:', error);
    throw error;
  }
};

// Export venues data as JSON file
export const exportVenuesToJSON = (): void => {
  try {
    const venues = getVenuesFromJSON();
    const dataStr = JSON.stringify(venues, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `super_events_venues_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Error exporting venues to JSON:', error);
  }
};

// Clear all venue data (for testing)
export const clearAllVenueData = (): void => {
  localStorage.removeItem(VENUES_STORAGE_KEY);
  // Clear all user-specific venue data
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(USER_VENUES_KEY)) {
      localStorage.removeItem(key);
    }
  });
  console.log('All venue data cleared');
};
