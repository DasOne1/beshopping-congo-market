import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedSkeletonProps {
  className?: string;
}

const LoadingDots = () => (
  <div className="flex items-center justify-center gap-4">
    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-sky-400 animate-bounce" />
    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-amber-400 animate-bounce [animation-delay:0.15s]" />
  </div>
);

const OptimizedSkeleton: React.FC<OptimizedSkeletonProps> = memo(({ 
  className = "" 
}) => {
  return (
    <div className={cn(
      'fixed inset-0 w-full h-full flex items-center justify-center bg-background/80 backdrop-blur-sm',
      className
    )}>
      <LoadingDots />
    </div>
  );
});

OptimizedSkeleton.displayName = 'OptimizedSkeleton';

export default OptimizedSkeleton;
