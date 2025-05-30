import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot, 
  getDocs,
  serverTimestamp,
  enableIndexedDbPersistence,
  CACHE_SIZE_UNLIMITED
} from "firebase/firestore";
import { 
  getDatabase, 
  ref, 
  set, 
  remove, 
  onValue, 
  push,
  onDisconnect,
  serverTimestamp as rtdbServerTimestamp,
  connectDatabaseEmulator,
  enableLogging
} from "firebase/database";
import { getStorage } from "firebase/storage"; // For Firebase Storage

// IMPORTANT: Move this configuration to environment variables for production!
const firebaseConfig = {
  apiKey: "AIzaSyBdWZ_RJfLu8ViSvizBEQUgkl7El6s3wgs",
  authDomain: "super-event-91cc3.firebaseapp.com",
  projectId: "super-event-91cc3",
  storageBucket: "super-event-91cc3.firebasestorage.app",
  messagingSenderId: "142015021569",
  appId: "1:142015021569:web:2cb1ebb950976542eff600",
  measurementId: "G-BTT7J1T33G",
  databaseURL: "https://super-event-91cc3-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app); // For Firebase Storage

// Enable offline persistence for Firestore
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db, {
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  }).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence disabled');
    } else if (err.code === 'unimplemented') {
      console.warn('Browser does not support persistence');
    }
  });
}

// Collections
export const venuesCollection = collection(db, 'venues');
export const venuesRef = ref(rtdb, 'venues');
export const onlineUsersRef = ref(rtdb, 'online');
export const presenceRef = ref(rtdb, '.info/connected');

// Error reporting function
export const logError = async (error: Error, context?: any) => {
  try {
    const errorRef = collection(db, 'errors');
    await addDoc(errorRef, {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent
    });
  } catch (e) {
    console.error('Error logging failed:', e);
  }
};

// Analytics helper
export const logAnalyticsEvent = (eventName: string, params?: any) => {
  try {
    analytics.logEvent(eventName, {
      ...params,
      timestamp: new Date().toISOString(),
      sessionId: localStorage.getItem('sessionId')
    });
  } catch (e) {
    console.error('Analytics logging failed:', e);
  }
};

// Initialize error boundaries
window.addEventListener('error', (event) => {
  logError(event.error, {
    type: 'window.error',
    url: window.location.href
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logError(new Error(event.reason), {
    type: 'unhandledrejection',
    url: window.location.href
  });
});
