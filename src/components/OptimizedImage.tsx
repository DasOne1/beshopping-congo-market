
import React, { memo, useState } from 'react';
import { useLazyImage } from '@/hooks/useLazyImage';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = memo(({
  src,
  alt,
  className = '',
  placeholder = '/shopping-cart-logo.svg',
  width,
  height,
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { ref, src: imageSrc, isLoaded, isError } = useLazyImage({
    src,
    placeholder,
    loading,
  });

  const handleLoad = () => {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 300);
    onLoad?.();
  };

  const handleError = () => {
    onError?.();
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden bg-muted',
        className
      )}
      style={{ width, height }}
    >
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-all duration-300',
          !isLoaded && 'opacity-50 scale-105',
          isLoaded && !isTransitioning && 'opacity-100 scale-100',
          isTransitioning && 'opacity-90 scale-102',
          isError && 'opacity-60'
        )}
        style={{
          filter: !isLoaded ? 'blur(4px)' : 'blur(0px)',
        }}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted/50 to-muted/30 animate-pulse" />
      )}
      
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/80">
          <span className="text-muted-foreground text-sm">
            Image non disponible
          </span>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
