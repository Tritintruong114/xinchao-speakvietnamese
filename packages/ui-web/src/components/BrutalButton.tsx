import React from 'react';
import { cn } from '../utils/cn';

export const BRUTAL_BUTTON_BASE_STYLES =
  'px-6 py-3 font-bold text-lg border-2 border-text-main rounded-lg brutal-shadow brutal-shadow-hover brutal-shadow-pressed transition-all duration-100 flex items-center justify-center gap-2';

export const BRUTAL_BUTTON_VARIANTS = {
  primary: 'bg-brand-red text-white',
  secondary: 'bg-brand-yellow text-text-main',
  ghost: 'bg-white text-text-main',
} as const;

export function getBrutalButtonClassName(options: {
  variant?: keyof typeof BRUTAL_BUTTON_VARIANTS;
  className?: string;
}) {
  const { variant = 'primary', className } = options;
  return cn(BRUTAL_BUTTON_BASE_STYLES, BRUTAL_BUTTON_VARIANTS[variant], className);
}

export interface BrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof BRUTAL_BUTTON_VARIANTS;
}

export const BrutalButton = React.forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={getBrutalButtonClassName({ variant, className })}
        {...props}
      />
    );
  }
);

BrutalButton.displayName = 'BrutalButton';
