import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { getDatabase, ref, set, remove, onValue } from "firebase/database";

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

// Firestore Collections
export const venuesCollection = collection(db, 'venues');

// Realtime Database References
export const venuesRef = ref(rtdb, 'venues');
