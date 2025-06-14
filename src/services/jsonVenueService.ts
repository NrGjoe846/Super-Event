import { Venue } from './venueService';

const VENUES_FILE_PATH = '/src/data/superEventsVenues.json';
const SUPER_EVENTS_USER_ID = 'superevents_user';
const SUPER_EVENTS_EMAIL = 'superevents@gmail.com';

export interface JsonVenueData {
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

export interface VenuesJsonFile {
  venues: JsonVenueData[];
  lastUpdated: string | null;
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

// Load venues from JSON file
export const loadVenuesFromJson = async (): Promise<JsonVenueData[]> => {
  try {
    // Import the JSON file dynamically
    const venuesModule = await import('../data/superEventsVenues.json');
    return venuesModule.venues || [];
  } catch (error) {
    console.error('Error loading venues from JSON:', error);
    return [];
  }
};

// Save venue to JSON file (simulated - in real implementation this would need a backend)
export const saveVenueToJson = async (venueData: any): Promise<string> => {
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
    const venue: JsonVenueData = {
      id: `venue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: venueData.venueName,
      location: venueData.location,
      capacity: venueData.capacity,
      description: venueData.description,
      price: venueData.price,
      amenities: venueData.amenities || [],
      availability: venueData.availability || [],
      images: imageBase64Array,
      rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
      featured: Math.random() > 0.7, // 30% chance of being featured
      status: 'approved', // Auto-approve for demo
      created_at: new Date().toISOString(),
      submitted_by: SUPER_EVENTS_USER_ID,
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

    // Since we can't directly write to files in the browser, we'll store in localStorage
    // but with a special key that indicates it should be part of the JSON file
    const existingVenues = getVenuesFromStorage();
    existingVenues.push(venue);
    
    localStorage.setItem('superevents_json_venues', JSON.stringify({
      venues: existingVenues,
      lastUpdated: new Date().toISOString()
    }));

    console.log('Venue saved to JSON storage:', venue);
    return venue.id;
  } catch (error) {
    console.error('Error saving venue to JSON:', error);
    throw error;
  }
};

// Get venues from storage (simulating JSON file read)
export const getVenuesFromStorage = (): JsonVenueData[] => {
  try {
    const stored = localStorage.getItem('superevents_json_venues');
    if (stored) {
      const data = JSON.parse(stored);
      return data.venues || [];
    }
    return [];
  } catch (error) {
    console.error('Error reading venues from storage:', error);
    return [];
  }
};

// Get user-specific venues
export const getSuperEventsUserVenues = (): JsonVenueData[] => {
  const allVenues = getVenuesFromStorage();
  return allVenues.filter(venue => venue.submitted_by === SUPER_EVENTS_USER_ID);
};

// Convert JsonVenueData to Venue format for compatibility
export const convertJsonToVenue = (jsonVenue: JsonVenueData): Venue => {
  return {
    id: jsonVenue.id,
    name: jsonVenue.name,
    location: jsonVenue.location,
    capacity: jsonVenue.capacity,
    description: jsonVenue.description,
    price: jsonVenue.price,
    amenities: jsonVenue.amenities,
    availability: jsonVenue.availability,
    images: jsonVenue.images,
    rating: jsonVenue.rating,
    featured: jsonVenue.featured,
    bookings: [],
    reviews: [],
    status: jsonVenue.status,
    created_at: jsonVenue.created_at,
    submitted_by: jsonVenue.submitted_by,
    event_types: jsonVenue.event_types,
    parking_spaces: jsonVenue.parking_spaces,
    setup_time: jsonVenue.setup_time,
    cleanup_time: jsonVenue.cleanup_time,
    cancellation_policy: jsonVenue.cancellation_policy,
    payment_terms: jsonVenue.payment_terms,
    special_features: jsonVenue.special_features,
    contact_email: jsonVenue.contact_email,
    contact_phone: jsonVenue.contact_phone,
    website: jsonVenue.website,
  };
};

// Delete venue from storage
export const deleteVenueFromStorage = (venueId: string): void => {
  try {
    const allVenues = getVenuesFromStorage();
    const filteredVenues = allVenues.filter(venue => venue.id !== venueId);
    
    localStorage.setItem('superevents_json_venues', JSON.stringify({
      venues: filteredVenues,
      lastUpdated: new Date().toISOString()
    }));
    
    console.log('Venue deleted from JSON storage:', venueId);
  } catch (error) {
    console.error('Error deleting venue from storage:', error);
    throw error;
  }
};

// Export venues data as JSON file for download
export const exportVenuesAsJson = (): void => {
  try {
    const venues = getVenuesFromStorage();
    const dataStr = JSON.stringify({
      venues,
      lastUpdated: new Date().toISOString(),
      exportedAt: new Date().toISOString(),
      totalVenues: venues.length
    }, null, 2);
    
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `super_events_venues_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Error exporting venues as JSON:', error);
  }
};

// Clear all venue data
export const clearAllVenueData = (): void => {
  localStorage.removeItem('superevents_json_venues');
  console.log('All Super Events venue data cleared');
};

// Check if user is the special super events user
export const isSuperEventsUser = (userEmail?: string): boolean => {
  return userEmail === SUPER_EVENTS_EMAIL;
};

// Initialize with some sample data if empty
export const initializeSampleData = (): void => {
  const existingVenues = getVenuesFromStorage();
  if (existingVenues.length === 0) {
    const sampleVenues: JsonVenueData[] = [
      {
        id: 'sample_venue_1',
        name: 'Super Events Demo Venue',
        location: 'Chennai, Tamil Nadu, India',
        capacity: '100-500',
        description: 'A beautiful demo venue for Super Events platform showcasing modern amenities and elegant design perfect for all types of events.',
        price: 50000,
        amenities: ['WiFi', 'Parking', 'Catering', 'AV Equipment', 'Air Conditioning'],
        availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        images: [
          'https://images.pexels.com/photos/1045541/pexels-photo-1045541.jpeg',
          'https://images.pexels.com/photos/260928/pexels-photo-260928.jpeg'
        ],
        rating: 4.8,
        featured: true,
        status: 'approved',
        created_at: new Date().toISOString(),
        submitted_by: SUPER_EVENTS_USER_ID,
        event_types: ['Wedding', 'Corporate Event', 'Birthday Party'],
        parking_spaces: 100,
        setup_time: 2,
        cleanup_time: 1,
        cancellation_policy: 'flexible',
        payment_terms: '50-50',
        special_features: 'Demo venue with all modern amenities',
        contact_email: 'demo@superevents.com',
        contact_phone: '+91 98765 43210',
        website: 'https://superevents.demo.com'
      }
    ];

    localStorage.setItem('superevents_json_venues', JSON.stringify({
      venues: sampleVenues,
      lastUpdated: new Date().toISOString()
    }));
  }
};
