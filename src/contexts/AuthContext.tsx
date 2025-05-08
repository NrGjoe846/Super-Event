import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  isVenueOwner: boolean;
  photoURL?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string, isVenueOwner: boolean) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createUserObject = (user: FirebaseUser, isVenueOwner = false): AuthUser => {
  return {
    id: user.uid,
    name: user.displayName || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    isGuest: false,
    isVenueOwner: isVenueOwner,
    photoURL: user.photoURL || undefined
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userObject = createUserObject(firebaseUser);
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
      const userObject = createUserObject(firebaseUser);
      setUser(userObject);
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Failed to login");
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user: firebaseUser } = await signInWithPopup(auth, provider);
      const userObject = createUserObject(firebaseUser);
      setUser(userObject);
    } catch (error: any) {
      console.error("Google login error:", error);
      throw new Error(error.message || "Failed to login with Google");
    }
  };

  const signup = async (name: string, email: string, password: string, isVenueOwner: boolean) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      const userObject = createUserObject(firebaseUser, isVenueOwner);
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
      navigate('/auth');
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
