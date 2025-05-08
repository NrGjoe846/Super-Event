import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBdWZ_RJfLu8ViSvizBEQUgkl7El6s3wgs",
  authDomain: "super-event-91cc3.firebaseapp.com",
  projectId: "super-event-91cc3",
  storageBucket: "super-event-91cc3.firebasestorage.app",
  messagingSenderId: "142015021569",
  appId: "1:142015021569:web:2cb1ebb950976542eff600",
  measurementId: "G-BTT7J1T33G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
