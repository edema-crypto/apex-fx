import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useProfile } from '../hooks/useProfile';
import { useTransactions } from '../hooks/useTransactions';
import { useAdminData } from '../hooks/useAdminData';
import { Profile, Transaction } from '../lib/supabase';

interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
  initialBalance: number;
  avatar?: string;
  transactions: AuthTransaction[];
}

interface AuthTransaction {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'denied';
  timestamp: Date;
  type: 'credit' | 'debit';
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => Promise<void>;
  addTransaction: (transaction: Omit<AuthTransaction, 'id' | 'timestamp'>) => Promise<void>;
  getUsers: () => AuthUser[];
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user: supabaseUser, 
    loading: authLoading, 
    isAdminAuthenticated,
    signUp, 
    signIn, 
    signOut 
  } = useSupabaseAuth();
  
  const { profile, loading: profileLoading, updateProfile } = useProfile(supabaseUser);
  const { transactions, loading: transactionsLoading, addTransaction: addSupabaseTransaction } = useTransactions(supabaseUser);
  const { users: adminUsers, addTransactionForUser } = useAdminData(isAdminAuthenticated);

  const [user, setUser] = useState<AuthUser | null>(null);

  // Convert Supabase data to AuthContext format
  useEffect(() => {
    if (supabaseUser && profile && !profileLoading) {
      const authTransactions: AuthTransaction[] = transactions.map(t => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        status: t.status,
        timestamp: new Date(t.created_at),
        type: t.type
      }));

      const authUser: AuthUser = {
        id: supabaseUser.id,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: supabaseUser.email || '',
        balance: profile.balance,
        initialBalance: profile.initial_balance,
        avatar: profile.avatar_url || undefined,
        transactions: authTransactions
      };

      setUser(authUser);
    } else if (!supabaseUser) {
      setUser(null);
    }
  }, [supabaseUser, profile, transactions, profileLoading]);

  const login = async (email: string, password: string): Promise<boolean> => {
    return await signIn(email, password);
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    // For admin login, we still use regular Supabase auth but check admin status
    if (email === 'admin@apexfx.com' && password === 'ApexFX@Secure2025') {
      return await signIn(email, password);
    }
    return false;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    return await signUp(userData.email, userData.password, userData.firstName, userData.lastName);
  };

  const logout = async () => {
    await signOut();
  };

  const updateUser = async (userData: Partial<AuthUser>) => {
    if (!supabaseUser) return;

    const profileUpdates: Partial<Profile> = {};
    
    if (userData.firstName !== undefined) profileUpdates.first_name = userData.firstName;
    if (userData.lastName !== undefined) profileUpdates.last_name = userData.lastName;
    if (userData.avatar !== undefined) profileUpdates.avatar_url = userData.avatar;

    await updateProfile(profileUpdates);
  };

  const addTransaction = async (transactionData: Omit<AuthTransaction, 'id' | 'timestamp'>) => {
    if (!supabaseUser) return;

    await addSupabaseTransaction({
      amount: transactionData.amount,
      description: transactionData.description,
      status: transactionData.status,
      type: transactionData.type,
      currency: 'USD'
    });
  };

  const getUsers = (): AuthUser[] => {
    return adminUsers.map(profile => ({
      id: profile.id,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      email: '', // We don't have email in profiles, would need to join with auth.users
      balance: profile.balance,
      initialBalance: profile.initial_balance,
      avatar: profile.avatar_url || undefined,
      transactions: [] // Would need to fetch per user
    }));
  };

  const loading = authLoading || profileLoading || transactionsLoading;
  const isAuthenticated = !!supabaseUser && !!profile;

  const value = {
    user,
    isAuthenticated,
    isAdminAuthenticated,
    loading,
    login,
    adminLogin,
    register,
    logout,
    updateUser,
    addTransaction,
    getUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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