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

// Simulate a database
let venues: Venue[] = [];

export const addVenue = async (formData: VenueFormData, ownerId: string): Promise<Venue> => {
  try {
    // Validate data
    if (!formData.name || !formData.location || !formData.price || !formData.description) {
      throw new Error("Please fill in all required fields");
    }

    if (formData.images.length === 0) {
      throw new Error("Please add at least one venue image");
    }

    // In a real app, you would:
    // 1. Upload images to a storage service
    // 2. Save venue data to your database
    // 3. Handle transactions and rollbacks

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newVenue: Venue = {
      ...formData,
      id: Math.random().toString(36).substring(2, 9),
      ownerId,
      price: parseInt(formData.price),
      rating: 0,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    venues.push(newVenue);
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
    return venues.filter(venue => venue.ownerId === ownerId);
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
};

export const deleteVenue = async (venueId: string, ownerId: string): Promise<void> => {
  try {
    const venue = venues.find(v => v.id === venueId);
    
    if (!venue) {
      throw new Error("Venue not found");
    }

    if (venue.ownerId !== ownerId) {
      throw new Error("Unauthorized");
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    venues = venues.filter(v => v.id !== venueId);
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
    return updatedVenue;
  } catch (error) {
    console.error("Error updating venue:", error);
    throw error;
  }
};
