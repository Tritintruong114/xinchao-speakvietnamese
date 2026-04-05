import React from 'react';

interface BrutalHeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  italic?: boolean;
}

export const BrutalHeading: React.FC<BrutalHeadingProps> = ({ 
  children, 
  as: Component = 'h1', 
  className = '', 
  italic = true 
}) => {
  const baseStyles = "font-black leading-tight tracking-tighter uppercase";
  const italicStyles = italic ? "italic" : "";
  
  const sizeStyles = {
    h1: "text-6xl md:text-8xl",
    h2: "text-4xl md:text-6xl",
    h3: "text-3xl md:text-4xl",
    h4: "text-2xl",
    h5: "text-xl",
    h6: "text-lg",
  };

  return (
    <Component className={`${baseStyles} ${italicStyles} ${sizeStyles[Component]} ${className}`}>
      {children}
    </Component>
  );
};
