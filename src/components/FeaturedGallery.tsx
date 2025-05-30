
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useProducts } from '@/hooks/useProducts';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FeaturedGallery() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // Utiliser les données en temps réel
  useRealtimeSync();
  const { products } = useProducts();
  
  // Get the 5 most popular products from real data
  const featuredProducts = products?.filter(p => p.popular > 0 && p.status === 'active')
    .sort((a, b) => b.popular - a.popular)
    .slice(0, 5) || [];
  
  // Autoplay
  useEffect(() => {
    if (!api || !autoplay) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [api, autoplay]);
  
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

  if (featuredProducts.length === 0) {
    return (
      <section className="py-4 mb-6">
        <div className="container px-2 sm:px-4">
          <div className="animate-pulse">
            <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl h-48 mb-3"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 mb-6">
      <div className="container px-2 sm:px-4">
        <div className="relative" 
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <Carousel 
            setApi={setApi}
            className="w-full"
            opts={{ loop: true }}
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id}>
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 h-48 md:h-56">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-32 h-32 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-4 right-8 w-16 h-16 border border-white rounded-full"></div>
                    </div>
                    
                    <div className="relative z-10 flex items-center justify-between h-full p-6">
                      <div className="flex-1 text-white">
                        <h3 className="text-lg md:text-2xl font-bold mb-2">
                          Offre Spéciale !
                        </h3>
                        <p className="text-sm md:text-base mb-4 opacity-90">
                          {product.name}
                        </p>
                        <Link to={`/product/${product.id}`}>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="bg-white text-orange-500 hover:bg-white/90"
                          >
                            Acheter
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="relative">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full border-4 border-white/30"
                        />
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                          ${Math.floor(product.original_price / 1000)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
          <div className="flex justify-center mt-4 gap-2">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  current === index ? "bg-orange-500 w-6" : "bg-gray-300"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
