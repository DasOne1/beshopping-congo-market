
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface OfflineConnectionPromptProps {
  onRetry?: () => void;
  message?: string;
  className?: string;
}

const OfflineConnectionPrompt: React.FC<OfflineConnectionPromptProps> = ({
  onRetry,
  message = "Pour accéder aux données, veuillez vous connecter à Internet.",
  className = ""
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-center min-h-[400px] ${className}`}
    >
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <WifiOff className="h-16 w-16 text-muted-foreground" />
              <div className="absolute -top-1 -right-1">
                <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          <CardTitle className="text-xl">Connexion requise</CardTitle>
          <CardDescription className="text-center">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Vérifiez votre connexion Internet et réessayez.</p>
          </div>
          <Button 
            onClick={handleRetry} 
            className="w-full"
            variant="default"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              Retour
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OfflineConnectionPrompt;
