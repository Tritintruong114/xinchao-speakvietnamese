import React from 'react';
import { cn } from '../utils/cn';

interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundColor?: string;
  withShadow?: boolean;
}

export const BrutalCard: React.FC<BrutalCardProps> = ({ 
  children, 
  className, 
  backgroundColor = 'bg-white',
  withShadow = true,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "border-2 border-text-main rounded-xl p-4", 
        backgroundColor,
        withShadow && "brutal-shadow",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};
