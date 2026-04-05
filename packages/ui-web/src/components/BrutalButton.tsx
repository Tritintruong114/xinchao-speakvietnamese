import React from 'react';
import { cn } from '../utils/cn';

export interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const BrutalButton = React.forwardRef<HTMLButtonElement, BrutalButtonProps>(
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

BrutalButton.displayName = 'BrutalButton';
