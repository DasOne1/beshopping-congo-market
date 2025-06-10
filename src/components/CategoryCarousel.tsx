
import React from 'react';
import { useOptimizedCategories } from '@/hooks/useOptimizedCategories';
import CategoryCard from './CategoryCard';

const CategoryCarousel = () => {
  const { categories, isLoading } = useOptimizedCategories();

  if (isLoading) {
    return (
      <div className="flex space-x-4 overflow-x-auto py-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-2"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex space-x-4 overflow-x-auto py-4 px-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoryCarousel;
