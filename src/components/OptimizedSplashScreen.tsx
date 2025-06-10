
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Loader2 } from 'lucide-react';
import { useDataPreloader } from '@/hooks/useOptimizedData';
import { useGlobalStore } from '@/store/useGlobalStore';

interface OptimizedSplashScreenProps {
  onComplete: () => void;
}

const OptimizedSplashScreen = ({ onComplete }: OptimizedSplashScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initialisation...');
  const { preloadAllData } = useDataPreloader();
  const { products, categories, orders, customers, dashboardStats } = useGlobalStore();

  useEffect(() => {
    const loadApp = async () => {
      try {
        // Étape 1: Afficher immédiatement les données en cache si disponibles
        setProgress(10);
        setCurrentStep('Chargement du cache...');
        
        // Vérifier si on a des données en cache
        const hasCache = products.length > 0 || categories.length > 0;
        
        if (hasCache) {
          setProgress(30);
          setCurrentStep('Données disponibles en cache');
          // Petit délai pour montrer que les données sont prêtes
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Étape 2: Précharger toutes les données en arrière-plan
        setProgress(40);
        setCurrentStep('Actualisation des données...');
        
        // Préchargement progressif
        await preloadAllData();
        
        setProgress(80);
        setCurrentStep('Finalisation...');
        
        // Délai final pour une transition fluide
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setProgress(100);
        setCurrentStep('Prêt !');
        
        // Délai avant de masquer le splash screen
        setTimeout(() => {
          onComplete();
        }, 500);
        
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        // Continuer même en cas d'erreur
        setCurrentStep('Prêt !');
        setTimeout(onComplete, 1000);
      }
    };

    loadApp();
  }, [onComplete, preloadAllData, products.length, categories.length]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-gradient-to-br from-primary via-primary/80 to-secondary flex items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="text-center space-y-8 px-4">
          {/* Logo animé */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl">
              <ShoppingBag className="w-12 h-12 text-primary" />
            </div>
            
            {/* Cercle de chargement */}
            <motion.div
              className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-2"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
              BeShopping
            </h1>
            <p className="text-white/90 text-lg font-medium">
              Votre boutique en ligne au Congo
            </p>
          </motion.div>

          {/* Barre de progression */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="w-64 mx-auto space-y-3"
          >
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-white/90">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">{currentStep}</span>
            </div>
          </motion.div>

          {/* Statistiques en temps réel si disponibles */}
          {(products.length > 0 || categories.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="grid grid-cols-2 gap-4 text-white/80 text-sm"
            >
              <div className="text-center">
                <div className="font-bold text-lg">{categories.length}</div>
                <div>Catégories</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{products.length}</div>
                <div>Produits</div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OptimizedSplashScreen;
