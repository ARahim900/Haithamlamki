'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { signInWithEmail, signUp, signOut, type User, type Session } from '@/lib/auth';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({ user: session?.user ?? null, session, loading: false });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user ?? null, session, loading: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await signInWithEmail(email, password);
    return data;
  }, []);

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    const data = await signUp(email, password, fullName);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await signOut();
  }, []);

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    isAuthenticated: !!state.session,
    login,
    register,
    logout,
  };
}
