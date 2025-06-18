
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDataPreloader } from '@/hooks/useDataPreloader';
import SplashScreen from '@/components/SplashScreen';
import CategoryCarousel from '@/components/CategoryCarousel';
import FeaturedGallery from '@/components/FeaturedGallery';
import { useCachedCategories } from '@/hooks/useCachedCategories';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const { isLoading: isPreloading } = useDataPreloader();
  
  // Récupérer seulement les catégories visibles côté client
  const { categories, isLoading: categoriesLoading } = useCachedCategories(false);
  const { products, isLoading: productsLoading } = useProducts();

  useEffect(() => {
    console.log('🏠 Page d\'accueil chargée');
  }, []);

  if (isPreloading || categoriesLoading || productsLoading) {
    return <SplashScreen />;
  }

  // Filtrer les produits visibles et actifs
  const featuredProducts = products?.filter(product => 
    product.is_visible && 
    product.status === 'active' && 
    product.featured
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm"></div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative z-10 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Bienvenue dans notre Boutique
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Découvrez notre collection exclusive de produits de qualité, soigneusement sélectionnés pour vous.
            </p>
          </motion.div>
        </section>

        {/* Categories Section */}
        {categories && categories.length > 0 && (
          <section className="py-16 px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="max-w-7xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Nos Catégories
              </h2>
              <CategoryCarousel categories={categories} />
            </motion.div>
          </section>
        )}

        {/* Featured Products Section */}
        {featuredProducts.length > 0 && (
          <section className="py-16 px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="max-w-7xl mx-auto"
            >
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Produits Vedettes
              </h2>
              <FeaturedGallery products={featuredProducts} />
            </motion.div>
          </section>
        )}

        {/* Call to Action */}
        <motion.section
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="py-20 px-4 text-center"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Prêt à découvrir nos produits ?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Explorez notre catalogue complet et trouvez exactement ce que vous cherchez.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/products"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Voir tous les produits
              </a>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Index;
