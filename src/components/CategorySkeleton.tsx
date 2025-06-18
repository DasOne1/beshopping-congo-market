
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface CategorySkeletonProps {
  count?: number;
  className?: string;
}

const CategorySkeleton = ({ count = 1, className }: CategorySkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className={`overflow-hidden ${className}`}>
          <Skeleton className="aspect-square w-full" />
          <CardContent className="p-3 text-center space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4 mx-auto" />
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default CategorySkeleton;
