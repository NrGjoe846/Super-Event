import { supabase } from '@/lib/supabase';
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

export interface Venue {
  id: string;
  name: string;
  location: string;
  description: string;
  price: number;
  capacity: string;
  featured: boolean;
  rating: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  images: string[];
  amenities: string[];
  availability: string[];
}

type VenueSubscriber = (venues: Venue[]) => void;
const subscribers = new Set<VenueSubscriber>();

export const subscribeToVenues = (subscriber: VenueSubscriber) => {
  subscribers.add(subscriber);

  // Set up real-time subscription
  const subscription = supabase
    .channel('venues_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'venues'
      },
      async () => {
        // Fetch updated venues when changes occur
        const venues = await getAllVenues();
        subscribers.forEach(sub => sub(venues));
      }
    )
    .subscribe();

  return () => {
    subscribers.delete(subscriber);
    subscription.unsubscribe();
  };
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

    // Insert venue
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .insert({
        name: formData.name,
        location: formData.location,
        description: formData.description,
        price: parseInt(formData.price),
        capacity: formData.capacity,
        owner_id: ownerId,
        featured: false,
        rating: 0
      })
      .select()
      .single();

    if (venueError) throw venueError;

    // Insert images
    const { error: imagesError } = await supabase
      .from('venue_images')
      .insert(
        formData.images.map(url => ({
          venue_id: venue.id,
          url
        }))
      );

    if (imagesError) throw imagesError;

    // Insert amenities
    if (formData.amenities.length > 0) {
      const { error: amenitiesError } = await supabase
        .from('venue_amenities')
        .insert(
          formData.amenities.map(name => ({
            venue_id: venue.id,
            name
          }))
        );

      if (amenitiesError) throw amenitiesError;
    }

    // Insert availability
    if (formData.availability.length > 0) {
      const { error: availabilityError } = await supabase
        .from('venue_availability')
        .insert(
          formData.availability.map(day => ({
            venue_id: venue.id,
            day
          }))
        );

      if (availabilityError) throw availabilityError;
    }

    // Fetch complete venue data
    const completeVenue = await getVenueById(venue.id);
    return completeVenue;
  } catch (error) {
    console.error("Error adding venue:", error);
    throw error;
  }
};

export const getVenueById = async (id: string): Promise<Venue> => {
  // Fetch venue with related data
  const { data: venue, error: venueError } = await supabase
    .from('venues')
    .select(`
      *,
      venue_images (url),
      venue_amenities (name),
      venue_availability (day)
    `)
    .eq('id', id)
    .single();

  if (venueError) throw venueError;

  return {
    ...venue,
    images: venue.venue_images.map(img => img.url),
    amenities: venue.venue_amenities.map(amenity => amenity.name),
    availability: venue.venue_availability.map(avail => avail.day)
  };
};

export const getVenuesByOwner = async (ownerId: string): Promise<Venue[]> => {
  try {
    const { data: venues, error } = await supabase
      .from('venues')
      .select(`
        *,
        venue_images (url),
        venue_amenities (name),
        venue_availability (day)
      `)
      .eq('owner_id', ownerId);

    if (error) throw error;

    return venues.map(venue => ({
      ...venue,
      images: venue.venue_images.map(img => img.url),
      amenities: venue.venue_amenities.map(amenity => amenity.name),
      availability: venue.venue_availability.map(avail => avail.day)
    }));
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
};

export const getAllVenues = async (): Promise<Venue[]> => {
  try {
    const { data: venues, error } = await supabase
      .from('venues')
      .select(`
        *,
        venue_images (url),
        venue_amenities (name),
        venue_availability (day)
      `);

    if (error) throw error;

    return venues.map(venue => ({
      ...venue,
      images: venue.venue_images.map(img => img.url),
      amenities: venue.venue_amenities.map(amenity => amenity.name),
      availability: venue.venue_availability.map(avail => avail.day)
    }));
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
};

export const deleteVenue = async (venueId: string, ownerId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', venueId)
      .eq('owner_id', ownerId);

    if (error) throw error;
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
    // Update venue
    const { error: venueError } = await supabase
      .from('venues')
      .update({
        name: updates.name,
        location: updates.location,
        description: updates.description,
        price: updates.price ? parseInt(updates.price) : undefined,
        capacity: updates.capacity
      })
      .eq('id', venueId)
      .eq('owner_id', ownerId);

    if (venueError) throw venueError;

    // Update images if provided
    if (updates.images) {
      // Delete existing images
      await supabase
        .from('venue_images')
        .delete()
        .eq('venue_id', venueId);

      // Insert new images
      const { error: imagesError } = await supabase
        .from('venue_images')
        .insert(
          updates.images.map(url => ({
            venue_id: venueId,
            url
          }))
        );

      if (imagesError) throw imagesError;
    }

    // Update amenities if provided
    if (updates.amenities) {
      // Delete existing amenities
      await supabase
        .from('venue_amenities')
        .delete()
        .eq('venue_id', venueId);

      // Insert new amenities
      const { error: amenitiesError } = await supabase
        .from('venue_amenities')
        .insert(
          updates.amenities.map(name => ({
            venue_id: venueId,
            name
          }))
        );

      if (amenitiesError) throw amenitiesError;
    }

    // Update availability if provided
    if (updates.availability) {
      // Delete existing availability
      await supabase
        .from('venue_availability')
        .delete()
        .eq('venue_id', venueId);

      // Insert new availability
      const { error: availabilityError } = await supabase
        .from('venue_availability')
        .insert(
          updates.availability.map(day => ({
            venue_id: venueId,
            day
          }))
        );

      if (availabilityError) throw availabilityError;
    }

    // Fetch and return updated venue
    return await getVenueById(venueId);
  } catch (error) {
    console.error("Error updating venue:", error);
    throw error;
  }
};
