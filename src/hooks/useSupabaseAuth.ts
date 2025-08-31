import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        await checkAdminStatus(session?.user);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (user: User | null) => {
    if (!user?.email) {
      setIsAdminAuthenticated(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', user.email)
        .single();

      setIsAdminAuthenticated(!error && !!data);
    } catch (error) {
      setIsAdminAuthenticated(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success('Account created successfully!');
        return true;
      }

      return false;
    } catch (error) {
      toast.error('An error occurred during registration');
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success('Login successful!');
        return true;
      }

      return false;
    } catch (error) {
      toast.error('An error occurred during login');
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        setIsAdminAuthenticated(false);
        toast.success('Signed out successfully');
      }
    } catch (error) {
      toast.error('An error occurred during sign out');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Password reset email sent!');
      return true;
    } catch (error) {
      toast.error('An error occurred sending reset email');
      return false;
    }
  };

  return {
    user,
    session,
    loading,
    isAdminAuthenticated,
    signUp,
    signIn,
    signOut,
    resetPassword
  };
};