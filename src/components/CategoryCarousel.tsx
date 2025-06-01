
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useCategories } from '@/hooks/useCategories';
import CategorySkeleton from './CategorySkeleton';

const CategoryCarousel = () => {
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-8 bg-gradient-to-br from-background/50 to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Explorez nos Catégories
          </h2>
          <div className="flex justify-center">
            <CategorySkeleton count={4} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gradient-to-br from-background/50 to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Explorez nos Catégories
          </h2>
          
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {categories.map((category, index) => (
                  <CarouselItem key={category.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="h-full"
                    >
                      <Link to={`/products?category=${category.id}`} className="block h-full">
                        <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
                          <CardContent className="p-0 h-full flex flex-col">
                            <div className="relative overflow-hidden rounded-t-lg">
                              <img
                                src={category.image || '/shopping_logo.png'}
                                alt={category.name}
                                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <Badge 
                                variant="secondary" 
                                className="absolute top-3 right-3 bg-primary/90 text-primary-foreground border-0 backdrop-blur-sm"
                              >
                                Nouveau
                              </Badge>
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between">
                              <div>
                                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                                  {category.name}
                                </h3>
                                <p className="text-muted-foreground text-sm line-clamp-3">
                                  {category.description || `Découvrez notre collection ${category.name.toLowerCase()}`}
                                </p>
                              </div>
                              <div className="mt-4 flex items-center text-primary font-medium text-sm">
                                Voir les produits
                                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
