import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DollarSign, Wallet, Save, User } from 'lucide-react';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';

const transactionSchema = yup.object({
  type: yup.string().oneOf(['deposit', 'withdrawal']).required('Type is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be greater than 0')
    .required('Amount is required'),
  currency: yup.string().required('Currency is required'),
  walletAddress: yup.string().optional(),
  userId: yup.string().required('User is required')
});

interface TransactionAddModalProps {
  users: Array<{ id: string; firstName: string; lastName: string }>;
  selectedUserId: string;
  onSave: (data: any) => void;
  onClose: () => void;
}

const TransactionAddModal: React.FC<TransactionAddModalProps> = ({ users, selectedUserId, onSave, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(transactionSchema),
    defaultValues: {
      type: 'deposit',
      amount: undefined,
      currency: 'USDT',
      walletAddress: '',
      userId: selectedUserId || (users[0]?.id ?? '')
    }
  });

  const onSubmit = (data: any) => {
    onSave({
      type: data.type,
      amount: Number(data.amount),
      currency: data.currency,
      walletAddress: data.walletAddress || undefined
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add Transaction" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Type</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100" {...register('type')}>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
            {errors.type && <p className="mt-1 text-sm text-red-400">{String(errors.type.message)}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">User</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-100" {...register('userId')}>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                ))}
              </select>
            </div>
            {errors.userId && <p className="mt-1 text-sm text-red-400">{String(errors.userId.message)}</p>}
          </div>
        </div>

        <Input
          icon={DollarSign}
          label="Amount (USD)"
          type="number"
          step="0.01"
          placeholder="Enter amount"
          {...register('amount')}
          error={errors.amount?.message}
        />

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Currency</label>
          <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-100" {...register('currency')}>
            <option value="USDT">USDT</option>
            <option value="USDC">USDC</option>
            <option value="BTC">BTC</option>
            <option value="ETH">ETH</option>
            <option value="SOL">SOL</option>
          </select>
          {errors.currency && <p className="mt-1 text-sm text-red-400">{String(errors.currency.message)}</p>}
        </div>

        <Input
          icon={Wallet}
          label="Wallet Address (optional)"
          type="text"
          placeholder="Enter wallet address"
          {...register('walletAddress')}
          error={errors.walletAddress?.message}
        />

        <div className="flex space-x-4 pt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" icon={Save} className="flex-1">
            Save Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TransactionAddModal;


