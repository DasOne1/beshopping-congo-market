
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
import { Bookmark, ShoppingCart } from 'lucide-react';

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
    <section className="py-4 mb-6">
      <div className="container px-2 sm:px-4">
        <motion.h2 
          className="text-xl md:text-2xl font-semibold mb-4 pl-1 border-l-4 border-primary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Explore New Fashion Trends
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
                      <div className="glass-effect overflow-hidden relative group rounded-2xl">
                        <div className="absolute top-3 left-3 z-10 bg-white/80 dark:bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                          <span className="text-yellow-400 mr-1">★</span>
                          <span className="text-sm font-medium">{(Math.random() * 2 + 3).toFixed(1)}</span>
                        </div>
                        
                        <div className="absolute top-3 right-3 z-10">
                          <div className="glass-effect rounded-full p-2">
                            <Bookmark size={16} className="text-primary" />
                          </div>
                        </div>
                        
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full aspect-[4/3] object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent text-white">
                          <h3 className="font-medium truncate">{product.name}</h3>
                          <p className="text-sm opacity-90">{product.originalPrice.toLocaleString()} CDF</p>
                          
                          <div className="absolute bottom-4 right-4 bg-primary rounded-full p-2 shadow-lg">
                            <ShoppingCart size={18} className="text-white" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 -left-4 -translate-y-1/2 hidden md:flex" />
            <CarouselNext className="absolute top-1/2 -right-4 -translate-y-1/2 hidden md:flex" />
          </Carousel>
          
          <div className="flex justify-center mt-4 gap-2">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors duration-300",
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
