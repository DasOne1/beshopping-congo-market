
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { useDataPreloader } from '@/hooks/useDataPreloader';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const { isLoaded, isLoading, error } = useDataPreloader();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (isLoading) {
      // Simulate loading progress while data is being preloaded
      progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + 15;
          return newProgress <= 80 ? newProgress : 80; // Don't go to 100% until data is loaded
        });
      }, 300);
    } else if (isLoaded || error) {
      // Complete the progress when data is loaded or if there's an error
      setLoadingProgress(100);
      
      // Wait a bit before hiding splash screen
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onComplete, 500); // Wait for exit animation
      }, 800);

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-orange-50 dark:bg-gray-900"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                transition: { 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "linear"
                }
              }}
              className="mb-6"
            >
              <Logo size="large" className="text-primary" />
            </motion.div>
            
            <motion.h1 
              className="text-2xl font-bold text-primary mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              BeShop Congo
            </motion.h1>
            
            {/* Loading bar */}
            <div className="w-64 h-2 bg-gray-200 rounded-full mb-4">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            
            <motion.div 
              className="text-sm text-muted-foreground font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? 'Chargement des données...' : 
               error ? 'Erreur de chargement' : 
               'Prêt !'}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
