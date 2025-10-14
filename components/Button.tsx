import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary: 'bg-brand-gray-900 text-white hover:bg-brand-gray-700 focus:ring-brand-gray-500 disabled:bg-brand-gray-300 disabled:cursor-not-allowed',
    secondary: 'bg-white text-brand-gray-800 border border-brand-gray-300 hover:bg-brand-gray-50 focus:ring-brand-gray-400 disabled:bg-brand-gray-50 disabled:text-brand-gray-400 disabled:cursor-not-allowed',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};