
import React, { useEffect } from 'react';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCarousel from '@/components/CategoryCarousel';
import { FeaturedGallery } from '@/components/FeaturedGallery';
import WhatsAppContact from '@/components/WhatsAppContact';
import { useGlobalStore } from '@/store/useGlobalStore';

const Index = () => {
  const { preloadAllData } = useGlobalStore();

  useEffect(() => {
    preloadAllData();
  }, [preloadAllData]);

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-primary/5 to-secondary/5 py-12 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Bienvenue chez BeShopping
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Découvrez notre sélection exceptionnelle de produits de qualité
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors">
                Voir nos produits
              </button>
              <button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors">
                En savoir plus
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
              Nos Catégories
            </h2>
            <Suspense fallback={
              <div className="flex space-x-4 overflow-x-auto py-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-2"></div>
                    <div className="w-16 h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            }>
              <CategoryCarousel />
            </Suspense>
          </div>
        </section>

        {/* Featured Products */}
        <Suspense fallback={
          <section className="py-6 md:py-8">
            <div className="container mx-auto px-4">
              <div className="mb-6">
                <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-96 animate-pulse mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        }>
          <FeaturedGallery />
        </Suspense>

        {/* Services Section */}
        <section className="py-12 md:py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">
              Pourquoi nous choisir ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Livraison Rapide</h3>
                <p className="text-muted-foreground">
                  Livraison gratuite pour toutes commandes
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Qualité Premium</h3>
                <p className="text-muted-foreground">
                  Produits de haute qualité sélectionnés avec soin
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎧</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Support 24/7</h3>
                <p className="text-muted-foreground">
                  Assistance client disponible à tout moment
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <WhatsAppContact phoneNumber="+243123456789" message="Bonjour, je souhaite plus d'informations sur vos produits." />
      <Footer />
    </>
  );
};

export default Index;
