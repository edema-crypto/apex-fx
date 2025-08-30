import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] sm:min-h-[48px]';
  
  const variants = {
    primary: 'bg-neon-green hover:bg-dark-green text-deep-black shadow-lg hover:shadow-neon-green/25 focus:ring-neon-green font-semibold',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 hover:border-slate-500 focus:ring-slate-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-red-500/25 focus:ring-red-500',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/25 focus:ring-emerald-500'
  };

  const sizes = {
    sm: 'px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm',
    md: 'px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base',
    lg: 'px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-current border-t-transparent mr-2" />
      ) : Icon ? (
        <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;