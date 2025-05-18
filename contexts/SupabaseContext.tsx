"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';

type SupabaseContextType = {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{
    user: User | null;
    error: Error | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
    user: User | null;
    error: Error | null;
  }>;
  signOut: () => Promise<{ error: AuthError | null }>;
};

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión actual y configurar el listener
    const setData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Escuchar cambios de autenticación
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session);
          setUser(session?.user ?? null);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    setData();
  }, []);

  const value = {
    user,
    session,
    signUp: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { user: data.user, error };
    },
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { user: data.user, error };
    },
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
    },
  };

  return (
    <SupabaseContext.Provider value={value}>
      {!loading && children}
    </SupabaseContext.Provider>
  );
}

// Hook para usar el contexto
export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase debe ser usado dentro de un SupabaseProvider');
  }
  return context;
}; 