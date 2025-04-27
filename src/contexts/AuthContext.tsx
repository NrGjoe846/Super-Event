import React, { createContext, useState, useContext, useEffect } from "react";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { auth, googleProvider, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  isVenueOwner: boolean;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string, isVenueOwner: boolean) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createUserObject = async (firebaseUser: FirebaseUser, isVenueOwner = false): Promise<User> => {
  // Check if user document exists in Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || userData?.name || 'User',
    email: firebaseUser.email || '',
    isGuest: false,
    isVenueOwner: userData?.isVenueOwner || isVenueOwner,
    photoURL: firebaseUser.photoURL || undefined
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userObject = await createUserObject(firebaseUser);
        setUser(userObject);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      const userObject = await createUserObject(firebaseUser);
      setUser(userObject);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to login");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, googleProvider);
      const userObject = await createUserObject(firebaseUser);
      
      // Create/update user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        isVenueOwner: false,
        photoURL: firebaseUser.photoURL,
        lastLogin: new Date()
      }, { merge: true });

      setUser(userObject);
    } catch (error: any) {
      console.error("Google login error:", error);
      throw new Error(error.message || "Failed to login with Google");
    }
  };

  const signup = async (name: string, email: string, password: string, isVenueOwner: boolean) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      await updateProfile(firebaseUser, {
        displayName: name
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        name,
        email,
        isVenueOwner,
        createdAt: new Date(),
        lastLogin: new Date()
      });

      const userObject = await createUserObject(firebaseUser, isVenueOwner);
      setUser(userObject);
    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error.message || "Failed to create account");
    }
  };

  const continueAsGuest = () => {
    const guestUser = {
      id: `guest-${Math.random().toString(36).substring(2, 9)}`,
      name: "Guest User",
      email: "",
      isGuest: true,
      isVenueOwner: false
    };
    setUser(guestUser);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !user.isGuest,
        isLoading,
        login,
        loginWithGoogle,
        signup,
        continueAsGuest,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
