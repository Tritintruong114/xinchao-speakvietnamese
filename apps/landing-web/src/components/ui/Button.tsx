import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const baseStyles = "px-6 py-3 font-bold text-lg border-2 border-text-main rounded-lg brutal-shadow brutal-shadow-hover brutal-shadow-pressed transition-all duration-100 flex items-center justify-center gap-2";
    
    const variants = {
      primary: "bg-brand-red text-white",
      secondary: "bg-brand-yellow text-text-main",
      ghost: "bg-white text-text-main",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
