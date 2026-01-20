import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'lime';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-full font-bold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-stone-900 text-white hover:bg-stone-800 shadow-sm", 
    secondary: "bg-stone-100 text-stone-900 hover:bg-stone-200",
    outline: "border border-stone-200 bg-transparent hover:bg-stone-50 text-stone-900",
    ghost: "hover:bg-stone-100 text-stone-600 hover:text-stone-900",
    white: "bg-white text-stone-900 hover:bg-stone-50 shadow-sm border border-stone-100",
    lime: "bg-lime-400 text-stone-900 hover:bg-lime-300 shadow-sm" // High vis accent
  };

  const sizes = {
    sm: "h-8 px-4 text-xs tracking-wide",
    md: "h-11 px-6 text-sm tracking-wide",
    lg: "h-14 px-8 text-base tracking-wide",
    xl: "h-16 px-10 text-lg tracking-wide"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};