
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { Loader } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 25;
        return newProgress <= 100 ? newProgress : 100;
      });
    }, 500);

    // Total animation time: 2.5 seconds (500ms * 5 steps)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation to complete
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

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
            
            {/* Loading indicators */}
            <div className="flex space-x-3 mb-8">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className={`h-3 w-3 rounded-full ${loadingProgress > i * 25 ? 'bg-primary' : 'bg-gray-300'}`}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: loadingProgress > i * 25 ? [0.8, 1.2, 1] : 0.8,
                    opacity: loadingProgress > i * 25 ? 1 : 0.5
                  }}
                  transition={{ 
                    delay: i * 0.2,
                    duration: 0.5,
                  }}
                />
              ))}
            </div>
            
            <motion.div 
              className="mt-4 text-sm text-muted-foreground font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: loadingProgress === 100 ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              Ready!
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
