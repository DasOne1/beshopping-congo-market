
import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailAuthForm from '@/components/EmailAuthForm';
import PhoneAuthForm from '@/components/PhoneAuthForm';
import { useAuth } from '@/hooks/useAuth';

const CustomerAuth = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Si l'utilisateur est déjà connecté, rediriger vers la destination ou la page d'accueil
  if (user) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4 relative">
      {/* Bouton retour au shop - élégant et bien positionné */}
      <div className="absolute top-6 left-6 z-10">
        <Button asChild variant="outline" className="flex items-center gap-2 bg-white/90 hover:bg-white dark:bg-gray-800/90 dark:hover:bg-gray-800 backdrop-blur-sm border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour au shop</span>
            <Home className="w-4 h-4 sm:hidden" />
          </Link>
        </Button>
      </div>

      {/* Logo en arrière-plan décoratif */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 dark:opacity-10 pointer-events-none">
        <div className="text-[20rem] font-bold text-primary/20">BeShopping</div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-20"
      >
        <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
          <CardHeader className="text-center space-y-6 pb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <User className="w-10 h-10 text-white" />
            </motion.div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Bienvenue
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                Connectez-vous pour accéder à votre espace personnel
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="pb-8">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <TabsTrigger 
                  value="email" 
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 transition-all duration-200"
                >
                  📧 Email
                </TabsTrigger>
                <TabsTrigger 
                  value="phone" 
                  className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 transition-all duration-200"
                >
                  📱 Téléphone
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-6">
                <EmailAuthForm onSuccess={() => {}} />
              </TabsContent>
              
              <TabsContent value="phone" className="space-y-6">
                <PhoneAuthForm onSuccess={() => {}} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer décoratif */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <p>🛍️ Votre shopping en toute sécurité</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CustomerAuth;
