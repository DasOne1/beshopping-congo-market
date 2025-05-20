
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { mockProducts } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function FeaturedGallery() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  // Get the 5 most popular products
  const featuredProducts = [...mockProducts]
    .sort((a, b) => b.popular - a.popular)
    .slice(0, 5);
  
  // Autoplay
  useEffect(() => {
    if (!api || !autoplay) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    
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

  return (
    <section className="py-4 bg-gradient-to-b from-accent/50 to-transparent">
      <div className="container">
        <motion.h2 
          className="text-xl md:text-2xl font-semibold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Gallery Highlights
        </motion.h2>
        
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
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Link to={`/product/${product.id}`} className="block">
                      <div className="rounded-lg overflow-hidden relative group">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                          <h3 className="font-medium truncate">{product.name}</h3>
                          <p className="text-sm opacity-80">{product.originalPrice.toLocaleString()} CDF</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 -left-4 -translate-y-1/2" />
            <CarouselNext className="absolute top-1/2 -right-4 -translate-y-1/2" />
          </Carousel>
          
          <div className="flex justify-center mt-4 gap-2">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors duration-300",
                  current === index ? "bg-primary" : "bg-primary/30"
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
