
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
    small: 'h-10 w-10',
    medium: 'h-12 w-12',
    large: 'h-24 w-24',
  };

  const logoContent = (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Background gradient circle */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-xl shadow-lg"
        initial={{ scale: 0, opacity: 0, rotate: -180 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Geometric pattern */}
      <motion.div 
        className="absolute inset-2 border-2 border-white/30 rounded-lg"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      
      {/* Inner decoration */}
      <motion.div 
        className="absolute top-1 right-1 w-2 h-2 bg-white/40 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
      
      {/* Logo text */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <span className="text-white font-bold text-lg leading-none">B</span>
        <span className="text-white/80 font-medium text-xs leading-none">S</span>
      </motion.div>
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-xl"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 100, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
  
  if (asLink) {
    return <Link to="/">{logoContent}</Link>;
  }
  
  return logoContent;
}
