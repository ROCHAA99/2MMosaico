import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "font-bold transition-all duration-200 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";
  
  const variants = {
    primary: "bg-brand-yellow text-brand-red hover:bg-[#ffe066] hover:shadow-lg hover:shadow-yellow-500/20",
    secondary: "bg-white text-brand-red hover:bg-gray-50 border border-gray-200",
    outline: "bg-transparent text-white border border-white/40 hover:bg-white/10 hover:border-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};