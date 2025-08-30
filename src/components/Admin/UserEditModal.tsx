import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, DollarSign, Save } from 'lucide-react';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';

const userSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  balance: yup.number().min(0, 'Balance cannot be negative').required('Balance is required')
});

interface UserEditModalProps {
  user: any;
  onSave: (userData: any) => void;
  onClose: () => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, onSave, onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      balance: user.balance
    }
  });

  const onSubmit = (data: any) => {
    onSave(data);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit User" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            icon={User}
            label="First Name"
            placeholder="Enter first name"
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <Input
            icon={User}
            label="Last Name"
            placeholder="Enter last name"
            {...register('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        <Input
          icon={DollarSign}
          label="Balance (USD)"
          type="number"
          step="0.01"
          placeholder="Enter balance"
          {...register('balance')}
          error={errors.balance?.message}
        />

        <div className="flex space-x-4 pt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" icon={Save} className="flex-1">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserEditModal;