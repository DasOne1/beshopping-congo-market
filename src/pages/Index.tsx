
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
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  
  // Activer la synchronisation en temps réel
  useRealtimeSync();
  
  const { products, featuredProducts, popularProducts, isLoading: productsLoading } = useProducts();
  const { categories } = useCategories();
  const { trackEvent } = useAnalytics();

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
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="space-y-2">
                <Badge className="mb-2">Nouveau sur BeShopping Congo</Badge>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Découvrez les
                  <span className="text-primary block"> meilleurs produits</span>
                  du Congo
                </h1>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                Une sélection soigneusement choisie des produits les plus recherchés, 
                livrés directement chez vous à Kinshasa et dans tout le Congo.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button 
                  size="lg" 
                  className="text-base md:text-lg px-6 md:px-8"
                  onClick={() => navigate('/products')}
                >
                  Explorer les produits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-base md:text-lg px-6 md:px-8"
                  onClick={() => navigate('/custom-order')}
                >
                  <Palette className="mr-2 h-5 w-5" />
                  Commande personnalisée
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {featuredProducts.slice(0, 4).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className={index % 2 === 0 ? "mt-4 md:mt-8" : ""}
                  >
                    <div className="relative group overflow-hidden rounded-lg shadow-lg">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-32 md:h-48 object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Carousel - Sticky */}
      <div className="sticky top-14 md:top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border/40">
        <CategoryCarousel />
      </div>

      {/* Featured Products Carousel */}
      <FeaturedGallery />

      {/* Products by Category - One per line */}
      {productsByCategory.map((group, groupIndex) => (
        <section key={group.category.id} className="py-6">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{group.category.name}</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(`/products?category=${group.category.id}`)}
                  className="text-sm"
                >
                  Voir tout
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
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

      <Footer />
    </>
  );
};

export default Index;
