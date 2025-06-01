
import React from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';
import CategorySkeleton from './CategorySkeleton';

const CategoryCarousel = () => {
  const { categories, isLoading } = useCategories();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 640px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    }
  });

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Nos Catégories
            </h2>
            <p className="text-muted-foreground">
              Découvrez nos différentes catégories de produits
            </p>
          </div>
          
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="rounded-full shadow-md hover:shadow-lg transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {categories.map((category) => (
              <div key={category.id} className="flex-none w-32 sm:w-36">
                <Link
                  to={`/products?category=${category.id}`}
                  className="group block text-center p-4 hover:bg-muted/50 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative mb-4 mx-auto">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300 group-hover:scale-105">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-primary font-semibold text-lg">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                    {category.name}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile navigation dots */}
        <div className="flex md:hidden justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={scrollPrev}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollNext}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
