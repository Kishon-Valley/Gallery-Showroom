import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types/user';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
  sendVerificationEmail: () => Promise<void>;
  verifyEmail: () => Promise<User | null>;
  isVerificationEmailSent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google');
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with email:', error);
      setError('Invalid email or password');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setError(null);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`
          },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out');
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setError(null);
      // In a real app, you would use Supabase's email verification functionality
      // This is a simulated implementation
      if (!user?.email) {
        throw new Error('User email is not available');
      }
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });
      if (error) throw error;
      setIsVerificationEmailSent(true);
    } catch (error) {
      console.error('Error sending verification email:', error);
      setError('Failed to send verification email');
      throw error;
    }
  };

  const verifyEmail = async () => {
    try {
      setError(null);
      // In a real implementation, this would be handled by Supabase automatically
      // when the user clicks the verification link
      // This is just a simulation for the UI flow
      // Update the user metadata to indicate email is verified
      const { error } = await supabase.auth.updateUser({
        data: { isEmailVerified: true }
      });
      if (error) throw error;
      
      // Refresh the user data
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      return data.user;
    } catch (error) {
      console.error('Error verifying email:', error);
      setError('Failed to verify email');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut,
    sendVerificationEmail,
    verifyEmail,
    isVerificationEmailSent,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 