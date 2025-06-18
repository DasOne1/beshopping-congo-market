
import React, { useState } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailAuthForm from '@/components/EmailAuthForm';
import PhoneAuthForm from '@/components/PhoneAuthForm';
import { useEmailAuth } from '@/hooks/useEmailAuth';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';

const CustomerAuth = () => {
  const location = useLocation();
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  
  // Utiliser les deux hooks d'authentification
  const emailAuth = useEmailAuth();
  const phoneAuth = usePhoneAuth();
  
  // Vérifier si l'utilisateur est connecté via l'une des méthodes
  const isAuthenticated = emailAuth.isAuthenticated || phoneAuth.isAuthenticated;
  const currentUser = emailAuth.currentCustomer || phoneAuth.currentCustomer;

  // Si l'utilisateur est déjà connecté, rediriger vers la destination ou la page d'accueil
  if (isAuthenticated && currentUser) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-4">
      {/* Bouton retour à l'accueil */}
      <div className="absolute top-6 left-6">
        <Button asChild variant="outline" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors">
          <Link to="/">
            <Home className="w-4 h-4" />
            Retour au shop
          </Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bienvenue
            </CardTitle>
            <CardDescription className="text-gray-600">
              Connectez-vous pour accéder à votre espace personnel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={authMethod} onValueChange={(value) => setAuthMethod(value as 'email' | 'phone')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email" className="text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Téléphone
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email">
                <EmailAuthForm onSuccess={() => {}} />
              </TabsContent>
              
              <TabsContent value="phone">
                <PhoneAuthForm onSuccess={() => {}} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CustomerAuth;
