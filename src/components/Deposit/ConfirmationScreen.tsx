import React from 'react';
import { CheckCircle, Clock, Home, ArrowRight } from 'lucide-react';
import Button from '../UI/Button';
import { Link } from 'react-router-dom';

interface ConfirmationScreenProps {
  onReset: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ onReset }) => {
  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
        {/* Success Icon */}
        <div className="p-4 bg-neon-green/10 rounded-2xl inline-block mb-6 animate-glow">
          <CheckCircle className="w-12 h-12 text-neon-green" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Deposit Submitted Successfully!
        </h1>

        {/* Message */}
        <p className="text-slate-300 mb-6">
          Your deposit request has been submitted and is now being processed. 
          You'll receive a confirmation once the transaction is verified.
        </p>

        {/* Timeline */}
        <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-5 h-5 text-yellow-400 mr-2" />
            <span className="text-yellow-400 font-medium">Processing Time</span>
          </div>
          <p className="text-slate-300 text-lg font-semibold">1 - 2 Hours</p>
          <p className="text-sm text-slate-400 mt-1">
            Your funds will be available in your account after verification
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link to="/">
            <Button className="w-full" icon={Home}>
              Back to Dashboard
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={onReset}
            icon={ArrowRight}
          >
            Make Another Deposit
          </Button>
        </div>

        {/* Support Note */}
        <div className="mt-6 p-4 bg-slate-700/50 rounded-xl">
          <p className="text-sm text-slate-300">
            <strong>Need help?</strong> Contact our support team if you don't see your 
            deposit reflected within 2 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationScreen;