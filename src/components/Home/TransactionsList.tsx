import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'pending' | 'completed';
  createdAt: Date;
}

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-600/50 hover:border-slate-600 transition-all duration-200"
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-xl mr-4 ${
              transaction.type === 'deposit' 
                ? 'bg-neon-green/10 border border-neon-green/20' 
                : 'bg-red-500/10 border border-red-500/20'
            }`}>
              {transaction.type === 'deposit' ? (
                <ArrowDownLeft className="w-5 h-5 text-neon-green" />
              ) : (
                <ArrowUpRight className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div>
              <div className="flex items-center mb-1">
                <p className="text-sm font-medium text-white capitalize mr-2">
                  {transaction.type}
                </p>
                <span className="px-2 py-0.5 text-xs font-medium bg-slate-600 text-slate-300 rounded-md">
                  {transaction.currency}
                </span>
              </div>
              <p className="text-xs text-slate-400">{formatDate(transaction.createdAt)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-1">
              <p className={`text-sm font-medium ${
                transaction.type === 'deposit' ? 'text-neon-green' : 'text-red-400'
              }`}>
                {transaction.type === 'deposit' ? '+' : '-'}{formatAmount(transaction.amount)}
              </p>
            </div>
            <div className="flex items-center justify-end">
              {transaction.status === 'completed' ? (
                <CheckCircle className="w-3 h-3 text-neon-green mr-1" />
              ) : (
                <Clock className="w-3 h-3 text-yellow-400 mr-1" />
              )}
              <span className={`text-xs capitalize ${
                transaction.status === 'completed' ? 'text-neon-green' : 'text-yellow-400'
              }`}>
                {transaction.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsList;