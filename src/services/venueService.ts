import { 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  getDocs 
} from "firebase/firestore";
import { 
  ref, 
  set, 
  remove, 
  onValue, 
  push 
} from "firebase/database";
import { db, rtdb, venuesCollection, venuesRef } from "@/lib/firebase";

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
  // Subscribe to Firestore updates
  const unsubscribeFirestore = onSnapshot(venuesCollection, (snapshot) => {
    const venues = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Venue));
    subscriber(venues);
  });

  // Subscribe to Realtime Database updates
  const unsubscribeRTDB = onValue(venuesRef, (snapshot) => {
    const venues = [];
    snapshot.forEach((childSnapshot) => {
      venues.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    subscriber(venues);
  });

  return () => {
    unsubscribeFirestore();
    unsubscribeRTDB();
  };
};

export const getAllVenues = async (): Promise<Venue[]> => {
  const snapshot = await getDocs(venuesCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Venue));
};

export const getVenuesByOwner = async (ownerId: string): Promise<Venue[]> => {
  const q = query(venuesCollection, where("owner_id", "==", ownerId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Venue));
};

export const getVenueById = async (id: string): Promise<Venue> => {
  const docRef = doc(db, 'venues', id);
  const snapshot = await getDocs(query(venuesCollection, where("id", "==", id)));
  if (snapshot.empty) throw new Error("Venue not found");
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Venue;
};

export const addVenue = async (formData: VenueFormData, ownerId: string): Promise<Venue> => {
  const timestamp = new Date().toISOString();
  const venueData = {
    ...formData,
    price: parseInt(formData.price),
    featured: false,
    rating: 0,
    owner_id: ownerId,
    created_at: timestamp,
    updated_at: timestamp,
  };

  // Add to Firestore
  const docRef = await addDoc(venuesCollection, venueData);
  const newVenue = { id: docRef.id, ...venueData } as Venue;

  // Add to Realtime Database
  const newVenueRef = push(venuesRef);
  await set(newVenueRef, {
    ...newVenue,
    id: newVenueRef.key
  });

  return newVenue;
};

export const updateVenue = async (
  venueId: string,
  ownerId: string,
  updates: Partial<VenueFormData>
): Promise<Venue> => {
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
  await set(rtdbRef, updateData);

  const updatedVenue = await getVenueById(venueId);
  return updatedVenue;
};

export const deleteVenue = async (venueId: string, ownerId: string): Promise<void> => {
  // Delete from Firestore
  const venueRef = doc(db, 'venues', venueId);
  await deleteDoc(venueRef);

  // Delete from Realtime Database
  const rtdbRef = ref(rtdb, `venues/${venueId}`);
  await remove(rtdbRef);
};
