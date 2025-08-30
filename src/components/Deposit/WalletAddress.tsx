import React from 'react';
import { Copy, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../UI/Button';



interface WalletAddressProps {
  currency: string;
  amount: number;
  walletAddress: string;
  onNext: () => void;
}

const WalletAddress: React.FC<WalletAddressProps> = ({ currency, amount, walletAddress, onNext }) => {
  const address = walletAddress;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Address copied to clipboard!');
    });
  };

  return (
    <div className="space-y-6">
      {/* Payment Instructions */}
      <div className="bg-neon-green/5 border border-neon-green/20 rounded-xl p-4">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 text-neon-green mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-neon-green mb-1">Payment Instructions</h3>
            <p className="text-sm text-slate-300">
              Send exactly ${amount} worth of {currency} to the wallet address below. 
              Your deposit will be processed within 1-2 hours after payment confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Address */}
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">
          {currency} Wallet Address
        </label>
        <div className="bg-slate-700 border border-slate-600 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <p className="text-white font-mono text-sm break-all">{address}</p>
            </div>
            <button
              onClick={() => copyToClipboard(address)}
              className="p-2 text-slate-400 hover:text-neon-green hover:bg-slate-600 rounded-lg transition-all duration-200"
              title="Copy address"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Placeholder */}
      <div className="text-center">
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-8 inline-block">
          <div className="w-32 h-32 bg-slate-600/50 rounded-lg flex items-center justify-center">
            <p className="text-slate-400 text-sm text-center">QR Code<br />Placeholder</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">Scan QR code to copy address</p>
      </div>

      {/* Continue Button */}
      <Button onClick={onNext} className="w-full" icon={ArrowRight}>
        I've Made the Payment
      </Button>
    </div>
  );
};

export default WalletAddress;