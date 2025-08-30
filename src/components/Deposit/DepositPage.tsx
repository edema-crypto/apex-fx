import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import CurrencySelector from './CurrencySelector';
import WalletAddress from './WalletAddress';
import ProofUpload from './ProofUpload';
import ConfirmationScreen from './ConfirmationScreen';
import Button from '../UI/Button';
import Input from '../UI/Input';
import { DollarSign, ArrowRight } from 'lucide-react';

const depositSchema = yup.object({
  amount: yup.number()
    .min(10, 'Minimum deposit is $10')
    .max(50000, 'Maximum deposit is $50,000')
    .required('Amount is required')
});

interface DepositPageProps {
  onDeposit: (transaction: any) => void;
}

const DepositPage: React.FC<DepositPageProps> = ({ onDeposit }) => {
  const [step, setStep] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedWalletAddress, setSelectedWalletAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [proofFile, setProofFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(depositSchema)
  });

  const onSubmit = (data: any) => {
    setAmount(data.amount);
    setStep(2);
  };

  const handleCurrencySelect = (currency: string, walletAddress: string) => {
    setSelectedCurrency(currency);
    setSelectedWalletAddress(walletAddress);
    setStep(3);
  };

  const handleProofUpload = (file: File) => {
    setProofFile(file);
    setStep(4);
  };

  const handleConfirmDeposit = () => {
    const transaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount,
      currency: selectedCurrency,
      walletAddress: selectedWalletAddress,
      status: 'pending',
      createdAt: new Date()
    };
    
    onDeposit(transaction);
    toast.success('Deposit submitted successfully!');
    setStep(5);
  };

  const resetFlow = () => {
    setStep(1);
    setSelectedCurrency('');
    setSelectedWalletAddress('');
    setAmount(0);
    setProofFile(null);
  };

  if (step === 5) {
    return <ConfirmationScreen onReset={resetFlow} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="p-4 bg-neon-green/10 rounded-2xl inline-block mb-4 animate-glow">
          <DollarSign className="w-8 h-8 text-neon-green" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Deposit Funds</h1>
        <p className="text-slate-400">Add funds to your ApexFX account</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <React.Fragment key={stepNumber}>
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step >= stepNumber ? 'bg-neon-green text-deep-black font-semibold' : 'bg-slate-700 text-slate-400'}
            `}>
              {stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`
                w-12 h-0.5 mx-2
                ${step > stepNumber ? 'bg-neon-green' : 'bg-slate-700'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Enter Deposit Amount</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                icon={DollarSign}
                label="Amount (USD)"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                {...register('amount')}
                error={errors.amount?.message}
              />
              <Button type="submit" className="w-full" icon={ArrowRight}>
                Continue
              </Button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Select Cryptocurrency</h2>
            <p className="text-slate-400 mb-6">
              Choose the cryptocurrency you'll use to deposit ${amount}
            </p>
            <CurrencySelector onSelect={handleCurrencySelect} />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Payment Details</h2>
            <p className="text-slate-400 mb-6">
              Send your {selectedCurrency} payment to the address below
            </p>
            <WalletAddress 
              currency={selectedCurrency} 
              amount={amount}
              walletAddress={selectedWalletAddress}
              onNext={() => setStep(4)} 
            />
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Upload Proof of Payment</h2>
            <p className="text-slate-400 mb-6">
              Upload a screenshot or transaction receipt as proof of your payment
            </p>
            <ProofUpload 
              onUpload={handleProofUpload} 
              onConfirm={handleConfirmDeposit}
              hasProof={!!proofFile}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositPage;