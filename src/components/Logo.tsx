
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  asLink?: boolean;
}

export function Logo({ size = 'medium', className, asLink = false }: LogoProps) {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-10 w-10',
    large: 'h-20 w-20',
  };

  const logoContent = (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <motion.img
        src="/lovable-uploads/8845cfb8-ce55-4575-8d18-4c2ff0b84e80.png"
        alt="BeProgress Logo"
        className="w-full h-full object-contain"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
  
  if (asLink) {
    return <Link to="/">{logoContent}</Link>;
  }
  
  return logoContent;
}
