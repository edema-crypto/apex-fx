import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DollarSign, Wallet, ArrowRight } from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';

const withdrawSchema = yup.object({
  amount: yup.number()
    .min(10, 'Minimum withdrawal is $10')
    .required('Amount is required')
    .test('max-balance', 'Insufficient balance', function(value) {
      const { balance } = this.options.context || {};
      return value ? value <= balance : false;
    }),
  currency: yup.string().required('Please select a currency'),
  walletAddress: yup.string().required('Wallet address is required')
});

const currencies = [
  { code: 'BTC', name: 'Bitcoin', logo: 'https://titan-vault.vercel.app/imgs/btc.svg' },
  { code: 'ETH', name: 'Ethereum', logo: 'https://titan-vault.vercel.app/imgs/eth.svg' },
  { code: 'SOL', name: 'Solana', logo: 'https://titan-vault.vercel.app/imgs/solana.svg' },
  { code: 'USDC', name: 'USD Coin', logo: 'https://titan-vault.vercel.app/imgs/usdc.svg' },
  { code: 'USDT', name: 'Tether', logo: 'https://titan-vault.vercel.app/imgs/usdt.svg' }
];

interface WithdrawFormProps {
  balance: number;
  onSubmit: (data: any) => void;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ balance, onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(withdrawSchema),
    context: { balance }
  });

  const watchedAmount = watch('amount');

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
      {/* Balance Display */}
      <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Available Balance</span>
          <span className="text-xl font-semibold text-green-400"></span>
          <span className="text-xl font-semibold text-neon-green">
            {formatBalance(balance)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Amount */}
        <Input
          icon={DollarSign}
          label="Withdrawal Amount (USD)"
          type="number"
          step="0.01"
          placeholder="Enter amount"
          {...register('amount')}
          error={errors.amount?.message}
        />

        {/* Currency Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-3">
            Select Cryptocurrency
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {currencies.map((currency) => (
              <label key={currency.code} className="cursor-pointer">
                <input
                  type="radio"
                  value={currency.code}
                  {...register('currency')}
                  className="sr-only peer"
                />
                <div className="p-4 border border-slate-600 rounded-xl hover:border-slate-500 transition-all text-center peer-checked:border-neon-green peer-checked:bg-neon-green/10 peer-checked:ring-2 peer-checked:ring-[rgba(34,197,94,0.3)]">
                  <div className="flex items-center justify-center mb-2">
                    <img src={currency.logo} alt={currency.name} className="h-6" />
                  </div>
                  <div className="font-medium text-white">{currency.code}</div>
                  <div className="text-xs text-slate-400">{currency.name}</div>
                </div>
              </label>
            ))}
          </div>
          {errors.currency && (
            <p className="mt-1 text-sm text-red-400">{errors.currency.message}</p>
          )}
        </div>

        {/* Wallet Address */}
        <Input
          icon={Wallet}
          label="Destination Wallet Address"
          type="text"
          placeholder="Enter wallet address"
          {...register('walletAddress')}
          error={errors.walletAddress?.message}
        />

        {/* Fee Notice */}
        {watchedAmount && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
            <div className="flex items-start">
              <div className="p-1 bg-yellow-500/10 rounded-lg mr-3">
                <ArrowRight className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-medium text-yellow-400 mb-1">Fee Information</h4>
                <p className="text-sm text-slate-300">
                  A 10% withdrawal fee will be applied. You'll need to pay this fee 
                  before your withdrawal is processed.
                </p>
              </div>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" icon={ArrowRight}>
          Continue to Fee Payment
        </Button>
      </form>
    </div>
  );
};

export default WithdrawForm;