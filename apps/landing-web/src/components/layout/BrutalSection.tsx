import React from 'react';
import { cn } from '@xinchao/ui-web';

interface BrutalSectionProps {
  children: React.ReactNode;
  backgroundColor?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
  as?: React.ElementType;
}

export const BrutalSection: React.FC<BrutalSectionProps> = ({
  children,
  backgroundColor = 'bg-brand-cream',
  padding = 'md',
  className,
  id,
  as: Component = 'section',
}) => {
  const paddingClasses = {
    none: 'py-0',
    sm: 'py-8',
    md: 'py-16 md:py-24',
    lg: 'py-24 md:py-32',
  };

  return (
    <Component
      id={id}
      className={cn(backgroundColor, paddingClasses[padding], 'relative overflow-hidden', className)}
    >
      {children}
    </Component>
  );
};
