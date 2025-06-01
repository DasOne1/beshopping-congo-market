
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCategories } from '@/hooks/useCategories';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useNavigate } from 'react-router-dom';

const CategoryCarousel = () => {
  const { categories, isLoading } = useCategories();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Activer la synchronisation en temps réel pour les catégories
  useRealtimeSync();

  // Gérer le scroll pour ajuster la taille du carousel
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Commencer à réduire la taille après 200px de scroll
      setIsScrolled(scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  if (isLoading) {
    return (
      <section className={`py-6 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}>
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-center">Categories</h2>
          </div>
          <div className="flex justify-center gap-4 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className={`bg-gray-200 rounded-full mb-2 transition-all duration-300 ${isScrolled ? 'w-12 h-12' : 'w-16 h-16'}`}></div>
                <div className="bg-gray-200 h-3 w-12 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Dupliquer les catégories pour l'effet infini
  const duplicatedCategories = categories ? [...categories, ...categories] : [];

  return (
    <section className={`py-6 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`mb-6 transition-all duration-300 ${isScrolled ? 'mb-3' : 'mb-6'}`}
        >
          <div className="flex justify-center items-center mb-4">
            <h2 className={`font-bold transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'}`}>Categories</h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          <Carousel 
            className="w-full max-w-6xl"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2 flex">
              {duplicatedCategories?.map((category, index) => (
                <CarouselItem key={`${category.id}-${index}`} className="pl-2 basis-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * (index % categories!.length) }}
                    className="flex flex-col items-center cursor-pointer mx-2"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div className={`rounded-full overflow-hidden bg-gray-100 mb-2 border-2 border-gray-200 hover:border-primary transition-all duration-300 ${isScrolled ? 'w-12 h-12' : 'w-16 h-16'}`}>
                      <img 
                        src={category.image || `/shopping_logo.png`} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className={`font-medium text-center max-w-[60px] truncate transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-xs'}`}>
                      {category.name}
                    </span>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryCarousel;
