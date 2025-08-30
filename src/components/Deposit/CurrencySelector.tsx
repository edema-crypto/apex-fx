import React from 'react';
import CryptoIcon from '../Crypto/CryptoIcon';

const currencies = [
  { 
    code: 'BTC', 
    name: 'Bitcoin', 
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    walletAddress: '135is3VweCLK9jdYb5RbYQueJQUt7FHyzW'
  },
  { 
    code: 'ETH', 
    name: 'Ethereum', 
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/20',
    walletAddress: '0xaa54f3fe25a34111a99cb5868b899ab443aa62af'
  },
  { 
    code: 'SOL', 
    name: 'Solana', 
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/20',
    walletAddress: '6z2JW4JXSDBQPVHrroSJkjtmAYUYVK2AxjHa8mYLxPwA'
  },
  { 
    code: 'USDC', 
    name: 'USD Coin', 
    color: 'text-neon-green',
    bgColor: 'bg-neon-green/10 border-neon-green/20',
    walletAddress: 'C5kY1sZgCdxDMocEwdCZwfj9WJsVaZF2sNqLqvA8HLN'
  },
  { 
    code: 'USDT', 
    name: 'Tether', 
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    walletAddress: 'TFRZCJnuTzgYAxfFzS4wbiL6xiq5vtSoFZ'
  }
];

interface CurrencySelectorProps {
  onSelect: (currency: string, walletAddress: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {currencies.map((currency) => {
        return (
          <button
            key={currency.code}
            onClick={() => onSelect(currency.code, currency.walletAddress)}
            className={`
              flex items-center p-6 rounded-xl border transition-all duration-200 
              hover:scale-105 hover:shadow-lg text-left
              ${currency.bgColor} hover:border-slate-500
            `}
          >
            <div className={`p-3 rounded-xl mr-4 bg-slate-700/50`}>
              <CryptoIcon currency={currency.code} size="lg" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">{currency.code}</h3>
              <p className="text-sm text-slate-400">{currency.name}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CurrencySelector;