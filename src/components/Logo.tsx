
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  asLink?: boolean;
}

const Logo = ({ size = 'medium', className, asLink = false }: LogoProps) => {
  const sizeClasses = {
    small: 'h-8 w-8 text-lg',
    medium: 'h-10 w-10 text-xl',
    large: 'h-16 w-16 text-3xl',
  };

  const logoContent = (
    <div className={cn(
      'bg-primary text-primary-foreground rounded-lg font-bold flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      BS
    </div>
  );
  
  if (asLink) {
    return <Link to="/">{logoContent}</Link>;
  }
  
  return logoContent;
};

export default Logo;
