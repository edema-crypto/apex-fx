import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { useAuth } from '../../contexts/AuthContext';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'success' | 'denied';
  timestamp: Date;
  type: 'credit' | 'debit';
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  initialBalance: number;
  avatar?: string;
  transactions: Transaction[];
}

const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getUsers, addTransaction } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [transactionForm, setTransactionForm] = useState({
    amount: '',
    description: '',
    status: 'success' as const
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user data from AuthContext
  useEffect(() => {
    const loadUserData = () => {
      const users = getUsers();
      const targetUser = users.find(u => u.id === id);
      if (targetUser) {
        setUser(targetUser);
      }
    };
    
    loadUserData();
    
    // Set up an interval to refresh user data
    const interval = setInterval(loadUserData, 1000);
    
    return () => clearInterval(interval);
  }, [id, getUsers]);

  // Calculate P&L percentage
  const calculatePnL = () => {
    if (!user || user.initialBalance === 0) return 0;
    return ((user.balance - user.initialBalance) / user.initialBalance) * 100;
  };

  const pnlPercentage = calculatePnL();
  const pnlAmount = user ? user.balance - user.initialBalance : 0;

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionForm.amount || !transactionForm.description || !user) return;

    setIsSubmitting(true);
    
    try {
      const amount = parseFloat(transactionForm.amount);
      if (isNaN(amount)) return;

      // Determine transaction type based on amount sign
      const type: 'credit' | 'debit' = amount >= 0 ? 'credit' : 'debit';
      const absoluteAmount = Math.abs(amount);

      // Add transaction through AuthContext
      addTransaction({
        amount: absoluteAmount,
        description: transactionForm.description,
        status: transactionForm.status,
        type
      });

      // Reset form
      setTransactionForm({
        amount: '',
        description: '',
        status: 'success'
      });

      // Force refresh user data immediately
      setTimeout(() => {
        const users = getUsers();
        const updatedUser = users.find(u => u.id === id);
        if (updatedUser) {
          setUser(updatedUser);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while user data is being fetched
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        <div className="text-center text-slate-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">User Account Management</h1>
            <p className="text-sm sm:text-base text-slate-400">Manage {user.firstName} {user.lastName}'s account</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* User Info & P&L Card */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-lg sm:text-2xl text-slate-400 font-semibold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-white">{user.firstName} {user.lastName}</h2>
                <p className="text-sm text-slate-400">{user.email}</p>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Current Balance */}
              <div className="bg-slate-800 rounded-xl p-3 sm:p-4">
                <p className="text-sm text-slate-400 mb-1">Current Balance</p>
                <p className="text-xl sm:text-2xl font-bold text-white">${(user.balance || 0).toFixed(2)}</p>
              </div>
              
              {/* Initial Balance */}
              <div className="bg-slate-800 rounded-xl p-3 sm:p-4">
                <p className="text-sm text-slate-400 mb-1">Initial Balance</p>
                <p className="text-base sm:text-lg font-semibold text-white">${(user.initialBalance || 0).toFixed(2)}</p>
              </div>

              {/* P&L Indicator - Prominently Displayed */}
              <div className="bg-slate-800 rounded-xl p-3 sm:p-4">
                <p className="text-sm text-slate-400 mb-2">Profit & Loss</p>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${pnlAmount >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    {pnlAmount >= 0 ? (
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className={`text-lg sm:text-xl font-bold ${pnlAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pnlAmount >= 0 ? '+' : ''}{pnlAmount.toFixed(2)}
                    </p>
                    <p className={`text-sm font-medium ${pnlAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Transaction Count */}
              <div className="bg-slate-800 rounded-xl p-3 sm:p-4">
                <p className="text-sm text-slate-400 mb-1">Total Transactions</p>
                <p className="text-lg sm:text-xl font-semibold text-white">{user.transactions?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Transaction Management */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Single Transaction Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Add New Transaction</h3>
            
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={transactionForm.amount}
                      onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Use positive values for deposits/credits, negative for withdrawals/debits
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Status</label>
                  <select
                    value={transactionForm.status}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, status: e.target.value as 'pending' | 'success' | 'denied' }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-neon-green text-sm sm:text-base"
                  >
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="denied">Denied</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Description</label>
                <Input
                  placeholder="e.g., Bank Transfer Deposit, Referral Bonus, Withdrawal via bank transfer"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              {/* Balance Impact Preview */}
              <div className="bg-slate-800 rounded-xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-sm text-slate-300">Balance Impact</span>
                  <span className="text-sm text-slate-400">
                    {transactionForm.amount && transactionForm.status === 'success' ? (
                      <>
                        Balance will be {parseFloat(transactionForm.amount) >= 0 ? 'increased' : 'decreased'} by 
                        <span className={`font-medium ${parseFloat(transactionForm.amount) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {' '}${Math.abs(parseFloat(transactionForm.amount)).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      'Enter amount and select status to see balance impact'
                    )}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                icon={Save}
                loading={isSubmitting}
                className="w-full"
                disabled={!transactionForm.amount || !transactionForm.description}
              >
                Save Transaction & Update Balance
              </Button>
            </form>
          </div>

          {/* Transaction History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Transaction History</h3>
            
            <div className="space-y-3">
              {user.transactions && user.transactions.length > 0 ? (
                user.transactions.map((transaction) => (
                  <div key={transaction.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-slate-800 rounded-xl border border-slate-700 gap-3">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${
                        transaction.status === 'success' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                        transaction.status === 'pending' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                        'text-red-400 bg-red-400/10 border-red-400/20'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm sm:text-base">{transaction.description}</p>
                        <p className="text-xs text-slate-400">
                          {new Date(transaction.timestamp).toLocaleDateString()} at {new Date(transaction.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold text-base sm:text-lg ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-400 capitalize">{transaction.type}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 sm:py-8 text-slate-400">
                  <p>No transactions found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
