
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useProducts } from '@/hooks/useProducts';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FeaturedGallery() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // Utiliser les données en temps réel
  useRealtimeSync();
  const { featuredProducts } = useProducts();
  
  // Filtrer uniquement les produits vedettes actifs
  const displayedProducts = featuredProducts?.filter(p => p.featured && p.status === 'active') || [];
  
  // Autoplay
  useEffect(() => {
    if (!api || !autoplay || displayedProducts.length === 0) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [api, autoplay, displayedProducts.length]);
  
  useEffect(() => {
    if (!api) return;
    
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (displayedProducts.length === 0) {
    return (
      <section className="py-3 md:py-4 mb-4 md:mb-6">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl md:rounded-2xl h-40 md:h-48 mb-3"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-3 md:py-4 mb-4 md:mb-6 w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="relative w-full" 
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <Carousel 
            setApi={setApi}
            className="w-full"
            opts={{ loop: true }}
          >
            <CarouselContent className="ml-0">
              {displayedProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-0">
                  <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 h-40 md:h-48 lg:h-56 w-full">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-3 md:top-4 right-3 md:right-4 w-20 md:w-32 h-20 md:h-32 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-3 md:bottom-4 right-6 md:right-8 w-8 md:w-16 h-8 md:h-16 border border-white rounded-full"></div>
                    </div>
                    
                    <div className="relative z-10 flex items-center justify-between h-full p-4 md:p-6">
                      <div className="flex-1 text-white max-w-[60%] md:max-w-[65%]">
                        <h3 className="text-base md:text-lg lg:text-2xl font-bold mb-1 md:mb-2">
                          Produit Vedette !
                        </h3>
                        <p className="text-xs md:text-sm lg:text-base mb-3 md:mb-4 opacity-90 line-clamp-2">
                          {product.name}
                        </p>
                        <Link to={`/product/${product.id}`}>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="bg-white text-orange-500 hover:bg-white/90 text-xs md:text-sm px-3 md:px-4 py-1 md:py-2"
                          >
                            Acheter
                            <ArrowRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="relative flex-shrink-0">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 object-cover rounded-full border-2 md:border-4 border-white/30"
                        />
                        <div className="absolute -top-1 md:-top-2 -right-1 md:-right-2 bg-green-500 text-white text-xs px-1 md:px-2 py-0.5 md:py-1 rounded-full font-bold">
                          ${Math.floor((product.discounted_price || product.original_price) / 1000)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          {/* Pagination points */}
          {displayedProducts.length > 1 && (
            <div className="flex justify-center mt-3 md:mt-4 gap-1 md:gap-2">
              {displayedProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300",
                    current === index ? "bg-orange-500 w-4 md:w-6" : "bg-gray-300"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
