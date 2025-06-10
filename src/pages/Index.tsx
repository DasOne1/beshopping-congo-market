
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Truck, Shield, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FeaturedGallery } from '@/components/FeaturedGallery';
import CategoryCarousel from '@/components/CategoryCarousel';
import WhatsAppContact from '@/components/WhatsAppContact';
import { useGlobalStore } from '@/store/useGlobalStore';

const HeroSection = () => (
  <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
    <div className="absolute inset-0 bg-[url('/shopping-cart-logo.svg')] bg-center bg-no-repeat bg-contain opacity-5"></div>
    
    <div className="container mx-auto px-4 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          Votre <span className="text-primary">Shopping</span> au Congo
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Découvrez des produits de qualité, livrés partout au Congo avec le sourire
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button size="lg" className="text-lg px-8 py-6 rounded-full">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Commencer mes achats
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full">
            <Phone className="mr-2 h-5 w-5" />
            Nous contacter
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

const FeatureSection = () => {
  const features = [
    {
      icon: Star,
      title: "Produits de Qualité",
      description: "Sélection rigoureuse de produits authentiques et durables"
    },
    {
      icon: Truck,
      title: "Livraison Rapide",
      description: "Livraison express partout au Congo en 24-48h"
    },
    {
      icon: Shield,
      title: "Paiement Sécurisé",
      description: "Transactions sécurisées et multiples moyens de paiement"
    }
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pourquoi Choisir BeShopping ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Une expérience d'achat unique, pensée pour vous simplifier la vie
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="text-center h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  const { preloadAllData } = useGlobalStore();

  useEffect(() => {
    preloadAllData();
  }, [preloadAllData]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Nos Catégories
              </h2>
              <p className="text-muted-foreground">
                Explorez nos différentes gammes de produits
              </p>
            </motion.div>
            <CategoryCarousel />
          </div>
        </section>

        <FeaturedGallery />
        <FeatureSection />
      </main>

      <Footer />
      <WhatsAppContact />
    </div>
  );
};

export default Index;
