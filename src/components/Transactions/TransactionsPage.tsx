import React, { useState } from 'react';
import { History, Search, Filter, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, X } from 'lucide-react';
import Input from '../UI/Input';
import Button from '../UI/Button';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'credit' | 'debit';
  amount: number;
  currency?: string;
  status: 'pending' | 'completed' | 'success' | 'denied';
  createdAt?: Date;
  timestamp?: Date;
  walletAddress?: string;
  description?: string;
}

interface TransactionsPageProps {
  transactions: Transaction[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Normalize transaction data to handle both formats
  const normalizedTransactions = (transactions || []).map(transaction => {
    // Map AuthContext format to display format
    const displayType = transaction.type === 'credit' ? 'deposit' : 
                       transaction.type === 'debit' ? 'withdrawal' : 
                       transaction.type;
    
    const displayStatus = transaction.status === 'success' ? 'completed' : 
                         transaction.status === 'denied' ? 'denied' : 
                         transaction.status;
    
    const displayDate = transaction.createdAt || transaction.timestamp;
    
    // Extract currency from description if not present
    let currency = transaction.currency;
    if (!currency && transaction.description) {
      // Try to extract currency from description (e.g., "Deposit 100 USDT" -> "USDT")
      const currencyMatch = transaction.description.match(/\b(USDT|BTC|ETH|BNB|SOL|USD|EUR)\b/i);
      if (currencyMatch) {
        currency = currencyMatch[1].toUpperCase();
      } else {
        currency = 'USD'; // Default currency
      }
    }

    return {
      ...transaction,
      displayType,
      displayStatus,
      displayDate,
      displayCurrency: currency || 'USD'
    };
  });

  // Filter transactions
  const filteredTransactions = normalizedTransactions.filter(transaction => {
    const matchesSearch = 
      (transaction.displayCurrency?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || transaction.displayStatus === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.displayType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Paginate transactions
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Date not available';
    
    try {
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return 'Date error';
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-3 bg-blue-500/10 rounded-xl mr-4">
            <History className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Transaction History</h1>
            <p className="text-slate-400">View and manage all your transactions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <Input
              icon={Search}
              placeholder="Search by transaction ID, currency, or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="denied">Denied</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
          </select>

          {/* Clear Filters */}
          <Button variant="secondary" onClick={clearFilters} icon={X} size="sm">
            Clear
          </Button>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions</span>
          <div className="flex items-center">
            <Filter className="w-4 h-4 mr-1" />
            <span>Filters active: {[searchTerm, statusFilter !== 'all' ? statusFilter : null, typeFilter !== 'all' ? typeFilter : null].filter(Boolean).length}</span>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        {paginatedTransactions.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No transactions found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/50 hover:border-slate-600 hover:bg-slate-700/50 transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl mr-4 ${
                    transaction.displayType === 'deposit' 
                      ? 'bg-neon-green/10 border border-neon-green/20' 
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                    {transaction.displayType === 'deposit' ? (
                      <ArrowDownLeft className="w-5 h-5 text-neon-green" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <p className="text-sm font-medium text-white capitalize mr-3">
                        {transaction.displayType}
                      </p>
                      <span className="px-2 py-0.5 text-xs font-medium bg-slate-600 text-slate-300 rounded-md mr-2">
                        {transaction.displayCurrency}
                      </span>
                      <span className="text-xs text-slate-500">ID: {transaction.id}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {formatDate(transaction.displayDate)}
                    </p>
                    {transaction.description && (
                      <p className="text-xs text-slate-500 mt-1 max-w-48 truncate">
                        {transaction.description}
                      </p>
                    )}
                    {transaction.walletAddress && (
                      <p className="text-xs text-slate-500 font-mono mt-1 truncate max-w-48">
                        To: {transaction.walletAddress}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-1">
                    <p className={`text-lg font-semibold ${
                      transaction.displayType === 'deposit' ? 'text-neon-green' : 'text-red-400'
                    }`}>
                      {transaction.displayType === 'deposit' ? '+' : '-'}{formatAmount(transaction.amount)}
                    </p>
                  </div>
                  <div className="flex items-center justify-end">
                    {transaction.displayStatus === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-neon-green mr-1" />
                    ) : transaction.displayStatus === 'denied' ? (
                      <X className="w-4 h-4 text-red-400 mr-1" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-400 mr-1" />
                    )}
                    <span className={`text-sm capitalize font-medium ${
                      transaction.displayStatus === 'completed' ? 'text-neon-green' : 
                      transaction.displayStatus === 'denied' ? 'text-red-400' : 
                      'text-yellow-400'
                    }`}>
                      {transaction.displayStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
            <div className="text-sm text-slate-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
