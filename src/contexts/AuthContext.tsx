import React, { createContext, useState, useContext, useEffect } from "react";
import { mockUsers, validateCredentials } from "@/services/mockUsers";

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
  signup: (name: string, email: string, password: string, isVenueOwner: boolean) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const validatedUser = validateCredentials(email, password);
      if (!validatedUser) {
        throw new Error("Invalid credentials");
      }
      
      const userToStore = {
        id: validatedUser.id,
        name: validatedUser.name,
        email: validatedUser.email,
        isGuest: false,
        isVenueOwner: validatedUser.isVenueOwner
      };
      
      setUser(userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, isVenueOwner: boolean) => {
    setIsLoading(true);
    try {
      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === email);
      if (existingUser) {
        throw new Error("Email already exists");
      }

      // Create new user
      const newUser = {
        id: `user${mockUsers.length + 1}`,
        name,
        email,
        password,
        isVenueOwner,
        createdAt: new Date()
      };

      // Add to mock users array
      mockUsers.push(newUser);

      // Create user object for state/storage (without password)
      const userToStore = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isGuest: false,
        isVenueOwner: newUser.isVenueOwner
      };
      
      setUser(userToStore);
      localStorage.setItem("user", JSON.stringify(userToStore));
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
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
    localStorage.setItem("user", JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
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
