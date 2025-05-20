
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
      <motion.div 
        className="absolute inset-0 bg-primary opacity-90 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div 
        className="absolute inset-0 border-2 border-white dark:border-background rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      <motion.span 
        className="relative z-10 text-white dark:text-background font-bold text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        BS
      </motion.span>
    </div>
  );
  
  if (asLink) {
    return <Link to="/">{logoContent}</Link>;
  }
  
  return logoContent;
}
