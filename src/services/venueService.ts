import { toast } from "@/hooks/use-toast";

export interface VenueFormData {
  name: string;
  location: string;
  price: string;
  description: string;
  capacity: string;
  amenities: string[];
  availability: string[];
  images: string[];
}

export interface Venue extends Omit<VenueFormData, 'price'> {
  id: string;
  ownerId: string;
  price: number;
  rating: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Get venues from localStorage or initialize empty array
const getStoredVenues = (): Venue[] => {
  const stored = localStorage.getItem('venues');
  return stored ? JSON.parse(stored) : [];
};

// Save venues to localStorage
const saveVenues = (venues: Venue[]) => {
  localStorage.setItem('venues', JSON.stringify(venues));
};

export const addVenue = async (formData: VenueFormData, ownerId: string): Promise<Venue> => {
  try {
    // Validate data
    if (!formData.name || !formData.location || !formData.price || !formData.description) {
      throw new Error("Please fill in all required fields");
    }

    if (formData.images.length === 0) {
      throw new Error("Please add at least one venue image");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newVenue: Venue = {
      ...formData,
      id: `venue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      ownerId,
      price: parseInt(formData.price),
      rating: 4.5 + Math.random() * 0.5, // Random initial rating between 4.5-5
      featured: Math.random() > 0.8, // 20% chance of being featured
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Get current venues and add new one
    const currentVenues = getStoredVenues();
    const updatedVenues = [...currentVenues, newVenue];
    saveVenues(updatedVenues);

    return newVenue;
  } catch (error) {
    console.error("Error adding venue:", error);
    throw error;
  }
};

export const getVenuesByOwner = async (ownerId: string): Promise<Venue[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const venues = getStoredVenues();
    return venues.filter(venue => venue.ownerId === ownerId);
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
};

export const getAllVenues = async (): Promise<Venue[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getStoredVenues();
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
};

export const deleteVenue = async (venueId: string, ownerId: string): Promise<void> => {
  try {
    const venues = getStoredVenues();
    const venue = venues.find(v => v.id === venueId);
    
    if (!venue) {
      throw new Error("Venue not found");
    }

    if (venue.ownerId !== ownerId) {
      throw new Error("Unauthorized");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedVenues = venues.filter(v => v.id !== venueId);
    saveVenues(updatedVenues);
  } catch (error) {
    console.error("Error deleting venue:", error);
    throw error;
  }
};

export const updateVenue = async (
  venueId: string,
  ownerId: string,
  updates: Partial<VenueFormData>
): Promise<Venue> => {
  try {
    const venues = getStoredVenues();
    const venueIndex = venues.findIndex(v => v.id === venueId);
    
    if (venueIndex === -1) {
      throw new Error("Venue not found");
    }

    if (venues[venueIndex].ownerId !== ownerId) {
      throw new Error("Unauthorized");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedVenue = {
      ...venues[venueIndex],
      ...updates,
      updatedAt: new Date(),
    };

    venues[venueIndex] = updatedVenue;
    saveVenues(venues);
    
    return updatedVenue;
  } catch (error) {
    console.error("Error updating venue:", error);
    throw error;
  }
};
