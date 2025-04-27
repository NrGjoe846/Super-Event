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
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  isVenueOwner: boolean;
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

const createUserObject = (firebaseUser: FirebaseUser, isVenueOwner = false): User => ({
  id: firebaseUser.uid,
  name: firebaseUser.displayName || 'User',
  email: firebaseUser.email || '',
  isGuest: false,
  isVenueOwner: isVenueOwner || firebaseUser.metadata?.customClaims?.isVenueOwner || false
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(createUserObject(firebaseUser));
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
      setUser(createUserObject(firebaseUser));
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to login");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { user: firebaseUser } = await signInWithPopup(auth, googleProvider);
      setUser(createUserObject(firebaseUser));
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

      // Create custom user object with venue owner status
      const userObject = createUserObject(firebaseUser, isVenueOwner);
      setUser(userObject);

      // Store additional user data in Firestore if needed
      // await setDoc(doc(db, "users", firebaseUser.uid), {
      //   name,
      //   email,
      //   isVenueOwner,
      //   createdAt: new Date()
      // });
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
