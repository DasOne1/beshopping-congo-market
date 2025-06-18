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
    <img
      src="/shopping-cart-logo.svg"
      alt="BeShopping Logo"
      className={cn('object-contain', sizeClasses[size], className)}
      draggable={false}
    />
  );

  if (asLink) {
    return <Link to="/">{logoContent}</Link>;
  }

  return logoContent;
}
