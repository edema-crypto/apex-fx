import React from 'react';

interface CryptoIconProps {
  currency: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const cryptoLogos: Record<string, string> = {
  BTC: 'https://titan-vault.vercel.app/imgs/btc.svg',
  SOL: 'https://titan-vault.vercel.app/imgs/solana.svg',
  ETH: 'https://titan-vault.vercel.app/imgs/eth.svg',
  USDT: 'https://titan-vault.vercel.app/imgs/usdt.svg',
  USDC: 'https://titan-vault.vercel.app/imgs/usdc.svg'
};

const CryptoIcon: React.FC<CryptoIconProps> = ({ currency, size = 'md', className = '' }) => {
  const logoUrl = cryptoLogos[currency.toUpperCase()];
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  if (!logoUrl) {
    // Fallback for unknown currencies
    return (
      <div className={`${sizeClasses[size]} bg-slate-600 rounded-full flex items-center justify-center ${className}`}>
        <span className="text-xs font-bold text-slate-300">
          {currency.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={logoUrl} 
      alt={`${currency} logo`}
      className={`${sizeClasses[size]} ${className}`}
      onError={(e) => {
        // Fallback if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const fallback = target.nextElementSibling as HTMLElement;
        if (fallback) fallback.style.display = 'flex';
      }}
    />
  );
};

export default CryptoIcon;