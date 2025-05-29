
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { useDataPreloader } from '@/hooks/useDataPreloader';
import { useTheme } from '@/contexts/ThemeContext';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { isLoaded, isLoading, error } = useDataPreloader();
  const { theme } = useTheme();

  // Déterminer le thème effectif (résoudre 'system')
  const getEffectiveTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const effectiveTheme = getEffectiveTheme();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isLoading) {
      // Animation de progression plus rapide
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + 25; // Augmentation plus rapide
          return newProgress <= 75 ? newProgress : 75; // Ne pas aller à 100% tant que les données ne sont pas chargées
        });
      }, 150); // Intervalle plus court
    } else if (isLoaded || error) {
      // Compléter immédiatement la progression
      setLoadingProgress(100);
      
      // Réduire le temps d'attente avant de masquer le splash screen
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 300); // Animation de sortie plus rapide
      }, 400); // Temps d'affichage réduit

      return () => clearTimeout(timer);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [isLoading, isLoaded, error, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            effectiveTheme === 'dark' 
              ? 'bg-gray-900' 
              : 'bg-orange-50'
          }`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                transition: { 
                  repeat: Infinity, 
                  duration: 1.5, // Rotation plus rapide
                  ease: "linear"
                }
              }}
              className="mb-6"
            >
              <Logo size="large" className="text-primary" />
            </motion.div>
            
            <motion.h1 
              className={`text-2xl font-bold text-primary mb-8 ${
                effectiveTheme === 'dark' ? 'text-orange-400' : 'text-primary'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              BeShop Congo
            </motion.h1>
            
            {/* Barre de progression adaptée au thème */}
            <div className={`w-64 h-2 rounded-full mb-4 ${
              effectiveTheme === 'dark' 
                ? 'bg-gray-700' 
                : 'bg-gray-200'
            }`}>
              <motion.div
                className={`h-full rounded-full ${
                  effectiveTheme === 'dark' 
                    ? 'bg-orange-400' 
                    : 'bg-primary'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            
            <motion.div 
              className={`text-sm font-medium ${
                effectiveTheme === 'dark' 
                  ? 'text-gray-300' 
                  : 'text-muted-foreground'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {isLoading ? 'Chargement...' : 
               error ? 'Prêt malgré l\'erreur' : 
               'Prêt !'}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
