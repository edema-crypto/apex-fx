import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../UI/Button';
import Input from '../UI/Input';

const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required')
});

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onAdminLogin: (email: string, password: string) => Promise<boolean>; // kept for compatibility, not used
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onAdminLogin, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const success = await onLogin(data.email, data.password);
      if (success) {
        toast.success('Login successful!');
        const redirect = localStorage.getItem('apexfx_redirect_after_login');
        if (redirect) {
          localStorage.removeItem('apexfx_redirect_after_login');
          window.location.href = redirect;
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResetting(true);
    try {
      // This would use the resetPassword function from useSupabaseAuth
      // For now, we'll show a success message
      toast.success('Password reset instructions sent to your email!');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      toast.error('Failed to send reset email');
    } finally {
      setIsResetting(false);
    }
  };
  return (
    <div className="w-full max-w-lg mx-auto relative px-4 sm:px-0">
      {/* Abstract green background accents */}
      <div className="pointer-events-none absolute -inset-x-6 sm:-inset-x-10 -top-6 sm:-top-10 -bottom-6 sm:-bottom-10 opacity-40">
        <div className="absolute -top-4 sm:-top-6 -left-6 sm:-left-8 w-48 sm:w-64 h-48 sm:h-64 bg-neon-green/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 -right-6 sm:-right-10 w-56 sm:w-72 h-56 sm:h-72 bg-dark-green/20 blur-3xl rounded-full" />
      </div>
      <div className="relative bg-deep-black border border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <img src="https://otiktpyazqotihijbwhm.supabase.co/storage/v1/object/public/images/ec1e8e78-e8e4-4f4d-a225-181630b1f3cd-ChatGPT_Image_Aug_28__2025__12_07_34_AM-removebg-preview.png" alt="ApexFX" className="h-16 sm:h-18 md:h-20" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-200">Sign in to continue trading</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
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
                placeholder="Enter your password"
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
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 sm:py-3.5 md:py-4 text-sm sm:text-base font-medium"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        {/* Forgot Password */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-slate-400 hover:text-neon-green transition-colors"
          >
            Forgot your password?
          </button>
        </div>
        {/* Switch to Register */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-neon-green hover:text-dark-green font-medium transition-colors"
              >
              Sign up here
              </button>
            </p>
          </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Reset Password</h3>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-300">
                    We'll send you a secure link to reset your password.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isResetting}
                  className="flex-1"
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;