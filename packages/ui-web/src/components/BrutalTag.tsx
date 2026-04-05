import React from 'react';

interface BrutalTagProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundColor?: string;
  rotate?: string;
}

export const BrutalTag: React.FC<BrutalTagProps> = ({ 
  children, 
  backgroundColor = 'bg-brand-pink',
  rotate = '-rotate-2',
  className 
}) => {
  return (
    <div className={`inline-block px-4 py-1 ${backgroundColor} border-2 border-text-main rounded-full font-black text-xs uppercase tracking-widest brutal-shadow-sm ${rotate} ${className}`}>
      {children}
    </div>
  );
};
