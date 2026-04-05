import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInAnonymously as firebaseSignInAnonymously, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  signInAnonymously: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      if (firebaseUser) {
        // Sync with Supabase profiles
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', firebaseUser.uid)
            .single();

          if (error && error.code === 'PGRST116') {
            // Profile not found, create one
            await supabase.from('profiles').insert([
              { 
                id: firebaseUser.uid, 
                email: firebaseUser.email || null,
                display_name: firebaseUser.displayName || 'Learner',
                xp: 0,
                streak: 0
              }
            ]);
          }
        } catch (err) {
          console.error('Error syncing profile:', err);
        }
      }
    });

    return unsubscribe;
  }, []);

  const signInAnonymously = async () => {
    try {
      await firebaseSignInAnonymously(auth);
    } catch (error) {
      console.error('Anonymous sign-in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInAnonymously, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
