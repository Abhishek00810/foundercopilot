// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, FC } from 'react';
import { supabase } from '../lib/supabase/client'; // Import our new client
import { User, Session } from '@supabase/supabase-js';

// Define the context shape
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // This is the magic. It gets the current session and user on load.
    const getInitialSession = async () => {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setIsLoading(false);
    }
    
    getInitialSession();

    // This listener updates the state whenever the auth state changes.
    // (e.g., user signs in, signs out, token is refreshed)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Cleanup the listener when the component unmounts
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Expose the user, session, and a logout function
  const value: AuthContextType = {
    user,
    session,
    isLoading,
    logout: async () => {
        await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create the custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
