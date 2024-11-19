import React, { createContext, useContext, useState } from 'react';

interface User {
  email: string;
  username: string;
  isPremium: boolean;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    // Mock authentication with admin credentials
    if (email === 'admin' && password === 'admin') {
      setUser({ 
        email: 'admin@airdropfinder.com', 
        username: 'Admin', 
        isPremium: true,
        isAdmin: true 
      });
      return;
    }
    // Regular user authentication
    setUser({ 
      email, 
      username: email.split('@')[0], 
      isPremium: false 
    });
  };

  const signUp = async (email: string, password: string, username: string) => {
    setUser({ 
      email, 
      username, 
      isPremium: false 
    });
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}