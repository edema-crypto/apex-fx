import React, { useState } from 'react';
import { DollarSign, Eye, EyeOff, TrendingUp, TrendingDown } from 'lucide-react';

interface BalanceCardProps {
  balance: number;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const [showBalance, setShowBalance] = useState(true);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Mock performance data
  const performanceChange = 8.24;
  const isPositive = performanceChange > 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-3 bg-neon-green/10 rounded-xl mr-4 animate-glow">
              <DollarSign className="w-6 h-6 text-neon-green" />
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-1">Total Balance</p>
              <div className="flex items-center">
                {showBalance ? (
                  <h2 className="text-3xl font-bold text-white">{formatBalance(balance)}</h2>
                ) : (
                  <h2 className="text-3xl font-bold text-white">••••••••</h2>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 text-slate-400 hover:text-neon-green hover:bg-slate-700 rounded-lg transition-all duration-200"
          >
            {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`p-1 rounded-lg mr-2 ${isPositive ? 'bg-neon-green/10' : 'bg-red-500/10'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-neon-green" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            <span className={`text-sm font-medium ${isPositive ? 'text-neon-green' : 'text-red-400'}`}>
              {isPositive ? '+' : ''}{performanceChange}%
            </span>
            <span className="text-sm text-slate-400 ml-2">this month</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Available</p>
            <p className="text-sm font-medium text-white">{formatBalance(balance * 0.95)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;