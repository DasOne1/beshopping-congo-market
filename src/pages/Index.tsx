
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Shield, ArrowRight, Star, TrendingUp, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CategoryCarousel from '@/components/CategoryCarousel';
import { FeaturedGallery } from '@/components/FeaturedGallery';
import WhatsAppContact from '@/components/WhatsAppContact';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const heroImages = [
  '/images/pic1.jpeg',
  '/images/pic2.jpeg',
  '/images/pic3.jpeg',
  '/images/pic4.jpeg',
];

const Index = () => {
  const navigate = useNavigate();
  
  // Activer la synchronisation en temps réel
  useRealtimeSync();
  
  const { products, featuredProducts, popularProducts, isLoading: productsLoading } = useProducts();
  const { categories } = useCategories();
  const { trackEvent } = useAnalytics();

  const [currentHero, setCurrentHero] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Track page view
    trackEvent.mutate({
      event_type: 'view_product',
      session_id: sessionStorage.getItem('session_id') || 'anonymous',
      metadata: { page: 'home' }
    });
  }, []);

  // Group products by category with real-time data
  const productsByCategory = categories?.map(category => ({
    category,
    products: products?.filter(p => p.category_id === category.id && p.status === 'active').slice(0, 6) || []
  })).filter(group => group.products.length > 0) || [];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header fixe */}
      <Header />
      
      {/* Main content avec padding pour éviter que le contenu soit caché par le header fixe */}
      <main className="pt-14 md:pt-16">
        {/* Hero Section - Amélioration du responsive et gestion du débordement */}
        <section
          className="relative overflow-hidden py-12 md:py-20 min-h-[420px] md:min-h-[480px] flex items-center"
          style={{
            backgroundImage: `url(${heroImages[currentHero]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.7s ease-in-out',
          }}
        >
          {/* Overlay pour lisibilité */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-background/80 to-secondary/70 opacity-80 z-0"></div>
          <div className="container mx-auto px-4 relative z-10 flex items-center min-h-[350px] md:min-h-[400px]">
            <div className="max-w-2xl space-y-4 md:space-y-6 py-6 md:py-8">
              <Badge className="mb-2 px-3 md:px-4 py-1 text-sm md:text-base bg-primary/90 text-white shadow-lg">
                Bienvenue sur BeShopping Congo
              </Badge>
              <h1 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white drop-shadow-md">
                Découvrez les
                <span className="text-primary block">meilleurs produits</span>
                du Congo
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl">
                Une sélection soigneusement choisie des produits les plus recherchés,
                livrés directement chez vous à Lubumbashi et dans tout le Congo.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4 md:mt-6">
                <Button 
                  size="lg" 
                  className="text-sm md:text-base lg:text-lg px-4 md:px-6 lg:px-8 shadow-md bg-primary hover:bg-primary/90 text-white"
                  onClick={() => navigate('/products')}
                >
                  <ShoppingBag className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Explorer les produits
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-sm md:text-base lg:text-lg px-4 md:px-6 lg:px-8 border-primary text-primary hover:bg-primary/10"
                  onClick={() => navigate('/custom-order')}
                >
                  <Palette className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  Commande personnalisée
                </Button>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4 mt-4 md:mt-6">
                <div className="flex items-center gap-2 text-primary font-medium text-sm md:text-base">
                  <Truck className="h-4 w-4 md:h-5 md:w-5" /> 
                  Livraison rapide
                </div>
                <div className="flex items-center gap-2 text-primary font-medium text-sm md:text-base">
                  <Shield className="h-4 w-4 md:h-5 md:w-5" /> 
                  Paiement sécurisé
                </div>
                <div className="flex items-center gap-2 text-primary font-medium text-sm md:text-base">
                  <Star className="h-4 w-4 md:h-5 md:w-5" /> 
                  Qualité garantie
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Carousel - Sticky mais en dessous du header fixe */}
        <div className="sticky top-14 md:top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border/40">
          <div className="flex justify-center items-center w-full overflow-hidden">
            <CategoryCarousel />
          </div>
        </div>

        {/* Featured Products Carousel - Amélioration du conteneur */}
        <div className="w-full overflow-hidden">
          <FeaturedGallery />
        </div>

        {/* Products by Category - One per line avec amélioration responsive */}
        {productsByCategory.map(group => (
          <section key={group.category.id} className="py-4 md:py-6">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-4 md:mb-6"
              >
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <h2 className="text-lg md:text-xl font-bold">{group.category.name}</h2>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate(`/products?category=${group.category.id}`)}
                    className="text-xs md:text-sm"
                  >
                    Voir tout
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
              >
                {group.products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <ProductCard product={product} viewMode="single" />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        ))}

        {/* Footer avec padding pour éviter que le contenu soit caché par la navbar mobile */}
        <div className="pb-16 md:pb-0">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default Index;
