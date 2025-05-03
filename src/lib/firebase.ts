import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCUVW3Wvo6K8SNKDQRzfhsK7CzKt-mN4xs",
  authDomain: "super-events-c4712.firebaseapp.com",
  projectId: "super-events-c4712",
  storageBucket: "super-events-c4712.firebasestorage.app",
  messagingSenderId: "548162277629",
  appId: "1:548162277629:web:cbfc0425afcb88c59fae94",
  measurementId: "G-0T3EL4MBNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
