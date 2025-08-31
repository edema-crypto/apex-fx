import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Transaction } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useTransactions = (user: User | null) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      
      // Set up real-time subscription for transaction changes
      const subscription = supabase
        .channel('transaction_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setTransactions(prev => [payload.new as Transaction, ...prev]);
            } else if (payload.eventType === 'UPDATE') {
              setTransactions(prev => 
                prev.map(t => t.id === payload.new.id ? payload.new as Transaction : t)
              );
            } else if (payload.eventType === 'DELETE') {
              setTransactions(prev => 
                prev.filter(t => t.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transactionData: {
    amount: number;
    description: string;
    status: 'pending' | 'success' | 'denied';
    type: 'credit' | 'debit';
    currency?: string;
    wallet_address?: string;
  }) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
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
      return true;
    } catch (error) {
      toast.error('An error occurred adding transaction');
      return false;
    }
  };

  const updateTransactionStatus = async (transactionId: string, status: 'pending' | 'success' | 'denied') => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (error) {
        toast.error('Failed to update transaction');
        return false;
      }

      toast.success('Transaction updated successfully!');
      return true;
    } catch (error) {
      toast.error('An error occurred updating transaction');
      return false;
    }
  };

  return {
    transactions,
    loading,
    addTransaction,
    updateTransactionStatus,
    refetch: fetchTransactions
  };
};