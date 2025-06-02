
import React, { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface OptimizedSkeletonProps {
  type: 'product' | 'category' | 'list' | 'grid';
  count?: number;
  className?: string;
}

const ProductSkeleton = memo(() => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <CardContent className="p-3 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-8 w-full" />
    </CardContent>
  </Card>
));

const CategorySkeleton = memo(() => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <CardContent className="p-3 text-center space-y-2">
      <Skeleton className="h-4 w-2/3 mx-auto" />
      <Skeleton className="h-3 w-1/2 mx-auto" />
    </CardContent>
  </Card>
));

const ListSkeleton = memo(() => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
        <Skeleton className="h-16 w-16 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
));

const GridSkeleton = memo(({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
));

const OptimizedSkeleton: React.FC<OptimizedSkeletonProps> = memo(({ 
  type, 
  count = 6, 
  className = "" 
}) => {
  const skeletonComponents = {
    product: ProductSkeleton,
    category: CategorySkeleton,
    list: ListSkeleton,
    grid: () => <GridSkeleton count={count} />,
  };

  const SkeletonComponent = skeletonComponents[type];

  return (
    <div className={`animate-pulse ${className}`}>
      <SkeletonComponent />
    </div>
  );
});

OptimizedSkeleton.displayName = 'OptimizedSkeleton';

export default OptimizedSkeleton;
