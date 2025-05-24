import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  onSnapshot, // For real-time updates
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase'; // Assuming db is exported from firebase.ts
import { uploadImages } from './storageService'; // Import for image uploading

const VENUES_COLLECTION = 'venues';

export interface Venue {
  id?: string;
  venueName: string;
  location: string;
  capacity: string; // Was number, changed to string to match "100-500"
  description: string;
  price?: number; // Added
  amenities?: string[]; // Added
  availability?: string[]; // Added
  images: string[]; // Was imageUrl (string), changed to images (string[])
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  submittedBy?: string; // Added
  featured?: boolean; // For consistency with Venues.tsx Card, assuming it might exist
  rating?: number;    // For consistency with Venues.tsx Card, assuming it might exist
}

export interface DetailedVenueData {
  venueName: string; // from formData.name
  location: string;
  capacity: string; // e.g., "100-500"
  description: string;
  price: number;
  amenities: string[];
  availability: string[];
  imageFiles: File[]; // Files to be uploaded
  userId?: string; // Optional user ID
}

// Get venues by owner ID
export const getVenuesByOwner = async (ownerId: string): Promise<Venue[]> => {
  try {
    const q = query(
      collection(db, VENUES_COLLECTION),
      where('submittedBy', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Venue));
  } catch (error) {
    console.error("Error getting venues by owner: ", error);
    throw error;
  }
};

// Create a new venue
export const addVenue = async (venueData: Omit<Venue, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, VENUES_COLLECTION), {
      ...venueData,
      capacity: Number(venueData.capacity), // Ensure capacity is a number
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding venue: ", error);
    throw error;
  }
};

// Add a new venue with detailed information and image uploads
export const addDetailedVenue = async (data: DetailedVenueData): Promise<string> => {
  try {
    // 1. Upload images to Firebase Storage
    // Assuming onProgress callback is optional in uploadImages or not needed here
    const uploadedImageInfos = await uploadImages(data.imageFiles, 'venue-images');
    const imageUrls = uploadedImageInfos.map(info => info.url);

    // 2. Prepare data for Firestore
    const venueDocData = {
      venueName: data.venueName,
      location: data.location,
      capacity: data.capacity, // Store as string range e.g. "100-500"
      description: data.description,
      price: data.price, // Assumed to be a number
      amenities: data.amenities,
      availability: data.availability,
      images: imageUrls, // Array of download URLs
      createdAt: Timestamp.now(), // Make sure Timestamp is imported
      updatedAt: Timestamp.now(), // Make sure Timestamp is imported
      ...(data.userId && { submittedBy: data.userId }), // Optional: store who submitted it
    };

    // 3. Add document to Firestore
    const docRef = await addDoc(collection(db, VENUES_COLLECTION), venueDocData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding detailed venue: ", error);
    // It's good practice to throw a more specific error or handle it appropriately
    if (error instanceof Error) {
      throw new Error(`Failed to add detailed venue: ${error.message}`);
    }
    throw new Error("Failed to add detailed venue due to an unknown error.");
  }
};

// Get all venues (no pagination)
export const getAllVenues = async (): Promise<Venue[]> => {
  try {
    const q = query(collection(db, VENUES_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Venue));
  } catch (error) {
    console.error("Error getting all venues: ", error);
    throw error;
  }
};

// Get all venues with pagination
export const getVenues = async (
  pageLimit: number = 10,
  lastVisibleVenue?: QueryDocumentSnapshot<DocumentData>
): Promise<{ venues: Venue[]; lastVisible: QueryDocumentSnapshot<DocumentData> | null }> => {
  try {
    let venueQuery = query(
      collection(db, VENUES_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(pageLimit)
    );

    if (lastVisibleVenue) {
      venueQuery = query(
        collection(db, VENUES_COLLECTION),
        orderBy('createdAt', 'desc'),
        startAfter(lastVisibleVenue),
        limit(pageLimit)
      );
    }

    const querySnapshot = await getDocs(venueQuery);
    const venues = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Venue));
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    
    return { venues, lastVisible };
  } catch (error) {
    console.error("Error getting venues: ", error);
    throw error;
  }
};

// Subscribe to venue changes for real-time updates
export const subscribeToVenues = (
  callback: (venues: Venue[]) => void
): (() => void) /* Unsubscribe function */ => {
  const q = query(collection(db, VENUES_COLLECTION), orderBy('createdAt', 'desc'));
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const venues = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Venue));
    callback(venues);
  }, (error) => {
    console.error("Error listening to venue changes:", error);
    // Optionally, you could have the callback accept an error argument
    // callback([], error); 
  });

  return unsubscribe;
};

// Update an existing venue
export const editVenue = async (id: string, venueData: Partial<Omit<Venue, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const venueDocRef = doc(db, VENUES_COLLECTION, id);
    const updateData: any = { ...venueData, updatedAt: Timestamp.now() };
    if (venueData.capacity !== undefined) {
      updateData.capacity = Number(venueData.capacity); // Ensure capacity is a number
    }
    await updateDoc(venueDocRef, updateData);
  } catch (error) {
    console.error("Error updating venue: ", error);
    throw error;
  }
};

// Delete a venue
export const deleteVenue = async (id: string): Promise<void> => {
  try {
    const venueDocRef = doc(db, VENUES_COLLECTION, id);
    await deleteDoc(venueDocRef);
  } catch (error) {
    console.error("Error deleting venue: ", error);
    throw error;
  }
};
