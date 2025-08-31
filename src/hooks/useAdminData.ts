import { useState, useEffect } from 'react';
import { supabase, Profile, Transaction } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useAdminData = (isAdminAuthenticated: boolean) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminData();
      
      // Set up real-time subscriptions for admin data
      const profilesSubscription = supabase
        .channel('admin_profiles')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles'
          },
          () => {
            fetchUsers(); // Refresh users when profiles change
          }
        )
        .subscribe();

      const transactionsSubscription = supabase
        .channel('admin_transactions')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions'
          },
          () => {
            fetchAllTransactions(); // Refresh transactions when they change
          }
        )
        .subscribe();

      return () => {
        profilesSubscription.unsubscribe();
        transactionsSubscription.unsubscribe();
      };
    } else {
      setUsers([]);
      setAllTransactions([]);
      setLoading(false);
    }
  }, [isAdminAuthenticated]);

  const fetchAdminData = async () => {
    await Promise.all([fetchUsers(), fetchAllTransactions()]);
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAllTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setAllTransactions(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, updates: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        toast.error('Failed to update user');
        return false;
      }

      toast.success('User updated successfully!');
      await fetchUsers(); // Refresh users list
      return true;
    } catch (error) {
      toast.error('An error occurred updating user');
      return false;
    }
  };

  const addTransactionForUser = async (userId: string, transactionData: {
    amount: number;
    description: string;
    status: 'pending' | 'success' | 'denied';
    type: 'credit' | 'debit';
    currency?: string;
    wallet_address?: string;
  }) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          amount: transactionData.amount,
          description: transactionData.description,
          status: transactionData.status,
          type: transactionData.type,
          currency: transactionData.currency || 'USD',
          wallet_address: transactionData.wallet_address
        });

      if (error) {
        toast.error('Failed to add transaction');
        return false;
      }

      toast.success('Transaction added successfully!');
      await fetchAllTransactions(); // Refresh transactions
      return true;
    } catch (error) {
      toast.error('An error occurred adding transaction');
      return false;
    }
  };

  return {
    users,
    allTransactions,
    loading,
    updateUserProfile,
    addTransactionForUser,
    refetch: fetchAdminData
  };
};