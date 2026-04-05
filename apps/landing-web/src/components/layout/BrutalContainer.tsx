import React from 'react';
import { cn } from '@xinchao/ui-web/src/utils/cn'; // Assuming utils exists, or use local cn

interface BrutalContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

export const BrutalContainer: React.FC<BrutalContainerProps> = ({ 
  children, 
  className, 
  maxWidth = '7xl' 
}) => {
  return (
    <div className={cn(
      'mx-auto px-6 w-full',
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
};
