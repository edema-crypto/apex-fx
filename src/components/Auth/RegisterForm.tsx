import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { User, Mail, Lock, Eye, EyeOff, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../UI/Button';
import Input from '../UI/Input';

const registerSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

interface RegisterFormProps {
  onRegister: (data: any) => Promise<boolean>;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema)
  });

  const passwordValue = watch('password') as string | undefined;

  const passwordScore = useMemo(() => {
    const value = passwordValue || '';
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value)) score += 1;
    if (/[0-9]/.test(value)) score += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score += 1;
    if (value.length >= 12) score += 1;
    return score; // 0-5
  }, [passwordValue]);

  const strengthMeta = useMemo(() => {
    switch (passwordScore) {
      case 0:
      case 1:
        return { label: 'Very weak', color: 'bg-red-500', textColor: 'text-red-400', width: 'w-1/5' };
      case 2:
        return { label: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-400', width: 'w-2/5' };
      case 3:
        return { label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-400', width: 'w-3/5' };
      case 4:
        return { label: 'Strong', color: 'bg-green-500', textColor: 'text-green-400', width: 'w-4/5' };
      default:
        return { label: 'Very strong', color: 'bg-emerald-500', textColor: 'text-emerald-400', width: 'w-full' };
    }
  }, [passwordScore]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await onRegister(data);
      if (success) {
        toast.success('Account created successfully!');
        // Redirect to onboarding page after successful registration
        window.location.href = '/onboarding';
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto relative px-4 sm:px-0">
      {/* Abstract green background accents */}
      <div className="pointer-events-none absolute -inset-x-6 sm:-inset-x-10 -top-6 sm:-top-10 -bottom-6 sm:-bottom-10 opacity-40">
        <div className="absolute -top-4 sm:-top-6 -left-6 sm:-left-8 w-48 sm:w-64 h-48 sm:h-64 bg-neon-green/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 -right-6 sm:-right-10 w-56 sm:w-72 h-56 sm:h-72 bg-dark-green/20 blur-3xl rounded-full" />
      </div>
      <div className="relative bg-rich-black border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ec1e8e78-e8e4-4f4d-a225-181630b1f3cd-ChatGPT_Image_Aug_28__2025__12_07_34_AM-removebg-preview.png" alt="ApexFX" className="h-16 sm:h-18 md:h-20" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Join ApexFX</h1>
          <p className="text-sm sm:text-base text-slate-400">Create your trading account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">First Name</label>
              <Input
                icon={User}
                placeholder="First name"
                {...register('firstName')}
                error={errors.firstName?.message}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">Last Name</label>
              <Input
                icon={User}
                placeholder="Last name"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">Email Address</label>
            <Input
              icon={Mail}
              placeholder="Enter your email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">Password</label>
            <div className="relative">
              <Input
                icon={Lock}
                placeholder="Create a strong password"
                type={showPassword ? "text" : "password"}
                {...register('password')}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-neon-green transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {passwordValue && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Password strength:</span>
                  <span className={`font-medium ${strengthMeta.textColor}`}>{strengthMeta.label}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className={`h-2 rounded-full transition-all duration-300 ${strengthMeta.color} ${strengthMeta.width}`} />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-200 mb-2">Confirm Password</label>
            <div className="relative">
              <Input
                icon={Lock}
                placeholder="Confirm your password"
                type={showConfirmPassword ? "text" : "password"}
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-neon-green transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 sm:py-3.5 md:py-4 text-sm sm:text-base font-medium"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        {/* Switch to Login */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-slate-400">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-neon-green hover:text-dark-green font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;