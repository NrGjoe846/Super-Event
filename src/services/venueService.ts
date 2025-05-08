import { 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  getDocs,
  serverTimestamp,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove 
} from "firebase/firestore";
import { 
  ref, 
  set, 
  remove, 
  onValue, 
  push,
  update,
  serverTimestamp as rtdbServerTimestamp
} from "firebase/database";
import { db, rtdb, venuesCollection, venuesRef, logError, logAnalyticsEvent } from "@/lib/firebase";

export interface VenueFormData {
  name: string;
  location: string;
  price: number;
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
  
  const unsubscribeFirestore = onSnapshot(
    venuesCollection,
    (snapshot) => {
      const venues = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Venue));
      subscribers.forEach(sub => sub(venues));
    },
    (error) => {
      logError(error, { source: 'Firestore subscription' });
    }
  );

  return () => {
    subscribers.delete(subscriber);
    unsubscribeFirestore();
  };
};

export const getAllVenues = async (): Promise<Venue[]> => {
  try {
    const snapshot = await getDocs(venuesCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Venue));
  } catch (error) {
    logError(error as Error, { action: 'getAllVenues' });
    throw new Error('Failed to fetch venues');
  }
};

export const getVenuesByOwner = async (ownerId: string): Promise<Venue[]> => {
  try {
    const q = query(venuesCollection, where("owner_id", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Venue));
  } catch (error) {
    logError(error as Error, { action: 'getVenuesByOwner', ownerId });
    throw new Error('Failed to fetch owner venues');
  }
};

export const getVenueById = async (id: string): Promise<Venue> => {
  try {
    const docRef = doc(db, 'venues', id);
    const snapshot = await getDocs(query(venuesCollection, where("id", "==", id)));
    if (snapshot.empty) throw new Error("Venue not found");
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Venue;
  } catch (error) {
    logError(error as Error, { action: 'getVenueById', id });
    throw new Error('Failed to fetch venue');
  }
};

export const addVenue = async (formData: VenueFormData, ownerId: string): Promise<Venue> => {
  const batch = writeBatch(db);
  const timestamp = new Date().toISOString();

  try {
    const venueData = {
      ...formData,
      featured: false,
      rating: 0,
      owner_id: ownerId,
      created_at: timestamp,
      updated_at: timestamp,
      booking_count: 0,
      view_count: 0
    };

    // Add to Firestore
    const docRef = await addDoc(venuesCollection, venueData);

    // Add to Realtime Database for real-time updates
    const rtdbRef = ref(rtdb, `venues/${docRef.id}`);
    await set(rtdbRef, {
      ...venueData,
      id: docRef.id,
      rtdb_timestamp: rtdbServerTimestamp()
    });

    logAnalyticsEvent('venue_created', {
      venue_id: docRef.id,
      owner_id: ownerId
    });

    return { id: docRef.id, ...venueData } as Venue;
  } catch (error) {
    logError(error as Error, {
      action: 'addVenue',
      ownerId,
      formData
    });
    throw new Error('Failed to add venue');
  }
};

export const updateVenue = async (
  venueId: string,
  ownerId: string,
  updates: Partial<VenueFormData>
): Promise<Venue> => {
  try {
    const timestamp = new Date().toISOString();
    const venueRef = doc(db, 'venues', venueId);
    
    const updateData = {
      ...updates,
      updated_at: timestamp
    };

    // Update in Firestore
    await updateDoc(venueRef, updateData);

    // Update in Realtime Database
    const rtdbRef = ref(rtdb, `venues/${venueId}`);
    await update(rtdbRef, updateData);

    const updatedVenue = await getVenueById(venueId);
    return updatedVenue;
  } catch (error) {
    logError(error as Error, {
      action: 'updateVenue',
      venueId,
      ownerId,
      updates
    });
    throw new Error('Failed to update venue');
  }
};

export const deleteVenue = async (venueId: string, ownerId: string): Promise<void> => {
  try {
    const batch = writeBatch(db);

    // Delete from Firestore
    const venueRef = doc(db, 'venues', venueId);
    batch.delete(venueRef);

    // Update user's venue count
    const userRef = doc(db, 'users', ownerId);
    batch.update(userRef, {
      venue_count: increment(-1),
      venues: arrayRemove(venueId)
    });

    await batch.commit();

    // Delete from Realtime Database
    const rtdbRef = ref(rtdb, `venues/${venueId}`);
    await remove(rtdbRef);

    logAnalyticsEvent('venue_deleted', {
      venue_id: venueId,
      owner_id: ownerId
    });
  } catch (error) {
    logError(error as Error, {
      action: 'deleteVenue',
      venueId,
      ownerId
    });
    throw new Error('Failed to delete venue');
  }
};
