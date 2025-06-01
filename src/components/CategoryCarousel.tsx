
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useCategories } from '@/hooks/useCategories';
import CategorySkeleton from './CategorySkeleton';

const CategoryCarousel = () => {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-foreground">
            Catégories
          </h2>
          <div className="flex justify-center">
            <CategorySkeleton count={5} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-foreground">
            Catégories
          </h2>
          
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-4xl mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {categories.map((category, index) => (
                  <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="h-full"
                    >
                      <Link to={`/products?category=${category.id}`} className="block h-full group">
                        <div className="flex flex-col items-center space-y-3 p-2">
                          {/* Cercle parfait pour l'image */}
                          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-muted group-hover:ring-2 group-hover:ring-primary/30 transition-all duration-300">
                            <img
                              src={category.image || '/shopping_logo.png'}
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          
                          {/* Nom de la catégorie */}
                          <div className="text-center">
                            <h3 className="font-medium text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 max-w-[80px] sm:max-w-[100px]">
                              {category.name}
                            </h3>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 lg:-left-8" />
              <CarouselNext className="hidden md:flex -right-4 lg:-right-8" />
            </Carousel>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
