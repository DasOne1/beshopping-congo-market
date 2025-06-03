import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  id: string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
  className?: string;
  onClick?: () => void;
}

const CategoryCard = ({ 
  id, 
  name, 
  description, 
  image, 
  slug,
  className,
  onClick 
}: CategoryCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn("cursor-pointer", className)}
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={image || `/shopping-cart-logo.svg`} 
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <CardContent className="p-3 text-center">
          <h3 className="font-medium">{name}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;
