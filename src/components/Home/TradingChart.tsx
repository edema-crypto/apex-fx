import React from 'react';
import { BarChart3, ExternalLink } from 'lucide-react';

const TradingChart: React.FC = () => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-neon-green/10 rounded-xl mr-3 animate-glow">
            <BarChart3 className="w-5 h-5 text-neon-green" />
          </div>
          <h2 className="text-xl font-semibold text-white">Market Overview</h2>
        </div>
        <button className="flex items-center text-neon-green hover:text-dark-green text-sm font-medium transition-colors">
          <ExternalLink className="w-4 h-4 mr-1" />
          Full Chart
        </button>
      </div>
      
      <div className="bg-slate-700/30 rounded-xl p-6 h-64 flex items-center justify-center border border-slate-600/50">
        {/* TradingView Chart Placeholder */}
        <div className="text-center">
          <div className="p-4 bg-neon-green/10 rounded-xl inline-block mb-4 animate-glow">
            <BarChart3 className="w-8 h-8 text-neon-green" />
          </div>
          <p className="text-slate-300 font-medium mb-2">TradingView Chart</p>
          <p className="text-sm text-slate-400">Real-time market data would be embedded here</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-1">BTC/USD</p>
          <p className="text-sm font-semibold text-neon-green">$42,150.89</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-1">ETH/USD</p>
          <p className="text-sm font-semibold text-neon-green">$2,621.45</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-1">SOL/USD</p>
          <p className="text-sm font-semibold text-neon-green">$98.76</p>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;