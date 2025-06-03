
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface ProductSkeletonProps {
  count?: number;
  className?: string;
}

const ProductSkeleton = ({ count = 1, className }: ProductSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className={`overflow-hidden ${className}`}>
          <div className="relative">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="absolute top-2 left-2 h-6 w-16 rounded-md" />
            <Skeleton className="absolute top-2 right-2 h-8 w-8 rounded-full" />
          </div>
          <CardContent className="p-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default ProductSkeleton;
