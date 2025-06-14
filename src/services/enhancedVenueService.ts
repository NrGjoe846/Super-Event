import { 
  getAllVenues as getSupabaseVenues, 
  addDetailedVenue as addSupabaseVenue,
  deleteVenue as deleteSupabaseVenue,
  getVenuesByOwner as getSupabaseVenuesByOwner,
  Venue,
  DetailedVenueData
} from './venueService';
import { 
  saveVenueToJson, 
  getVenuesFromStorage, 
  getSuperEventsUserVenues, 
  convertJsonToVenue,
  deleteVenueFromStorage,
  isSuperEventsUser,
  initializeSampleData
} from './jsonVenueService';

const SUPER_EVENTS_USER_ID = 'superevents_user';
const SUPER_EVENTS_EMAIL = 'superevents@gmail.com';

// Enhanced venue service that combines Supabase and JSON storage
export const addVenueEnhanced = async (venueData: DetailedVenueData, userEmail?: string): Promise<string> => {
  try {
    // Check if this is the special super events user
    if (isSuperEventsUser(userEmail)) {
      // Save to JSON for super events user
      const venueId = await saveVenueToJson(venueData);
      console.log('Venue saved to JSON for super events user:', venueId);
      return venueId;
    } else {
      // Use Supabase for other users
      return await addSupabaseVenue(venueData);
    }
  } catch (error) {
    console.error('Error in enhanced venue service:', error);
    throw error;
  }
};

// Enhanced get all venues that combines both sources
export const getAllVenuesEnhanced = async (userEmail?: string): Promise<Venue[]> => {
  try {
    let venues: Venue[] = [];
    
    // Always get Supabase venues first
    try {
      const supabaseVenues = await getSupabaseVenues();
      venues = [...supabaseVenues];
    } catch (error) {
      console.warn('Could not fetch Supabase venues:', error);
    }
    
    // Initialize sample data for super events user if needed
    if (isSuperEventsUser(userEmail)) {
      initializeSampleData();
    }
    
    // Add JSON venues (especially for super events user)
    const jsonVenues = getVenuesFromStorage();
    const convertedJsonVenues = jsonVenues.map(convertJsonToVenue);
    
    // Merge venues, avoiding duplicates
    const allVenues = [...venues];
    convertedJsonVenues.forEach(jsonVenue => {
      if (!allVenues.find(v => v.id === jsonVenue.id)) {
        allVenues.push(jsonVenue);
      }
    });
    
    // If this is the super events user, prioritize their JSON venues
    if (isSuperEventsUser(userEmail)) {
      const userJsonVenues = getSuperEventsUserVenues();
      const convertedUserVenues = userJsonVenues.map(convertJsonToVenue);
      
      // Add user's venues to the beginning of the list
      convertedUserVenues.forEach(userVenue => {
        const existingIndex = allVenues.findIndex(v => v.id === userVenue.id);
        if (existingIndex >= 0) {
          allVenues[existingIndex] = userVenue; // Update existing
        } else {
          allVenues.unshift(userVenue); // Add to beginning
        }
      });
    }
    
    return allVenues;
  } catch (error) {
    console.error('Error getting enhanced venues:', error);
    return [];
  }
};

// Enhanced get user venues
export const getUserVenuesEnhanced = async (userId: string, userEmail?: string): Promise<Venue[]> => {
  try {
    if (isSuperEventsUser(userEmail)) {
      // Initialize sample data if needed
      initializeSampleData();
      
      // Get from JSON for super events user
      const jsonVenues = getSuperEventsUserVenues();
      return jsonVenues.map(convertJsonToVenue);
    } else {
      // Use Supabase for other users
      return await getSupabaseVenuesByOwner(userId);
    }
  } catch (error) {
    console.error('Error getting user venues enhanced:', error);
    return [];
  }
};

// Enhanced delete venue
export const deleteVenueEnhanced = async (venueId: string, userId?: string, userEmail?: string): Promise<void> => {
  try {
    if (isSuperEventsUser(userEmail)) {
      // Delete from JSON for super events user
      deleteVenueFromStorage(venueId);
    } else {
      // Use Supabase for other users
      await deleteSupabaseVenue(venueId, userId);
    }
  } catch (error) {
    console.error('Error deleting venue enhanced:', error);
    throw error;
  }
};

// Export the utility functions
export { isSuperEventsUser };

// Get super events user ID
export const getSuperEventsUserId = (): string => {
  return SUPER_EVENTS_USER_ID;
};
