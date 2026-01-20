import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
  const baseClasses = "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium tracking-wide uppercase";
  
  const variants = {
    primary: "bg-primary-50 text-primary-800",
    secondary: "bg-stone-100 text-stone-600",
    outline: "border border-stone-200 text-stone-600",
    success: "bg-primary-50 text-primary-700"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};