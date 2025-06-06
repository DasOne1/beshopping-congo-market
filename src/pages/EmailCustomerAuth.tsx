import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmailAuthForm from '@/components/EmailAuthForm';
import { useEmailAuth } from '@/hooks/useEmailAuth';

const EmailCustomerAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useEmailAuth();
  
  // Récupérer la page d'origine depuis l'état de navigation ou l'URL
  const from = location.state?.from || new URLSearchParams(location.search).get('from') || '/account';

  // Si l'utilisateur est déjà connecté, le rediriger vers la page d'origine
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <Card className="shadow-lg border-2">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <CardTitle className="text-2xl flex items-center justify-center">
                <User className="mr-2 h-6 w-6" />
                Authentification Client
              </CardTitle>
              <CardDescription className="text-center">
                Connectez-vous avec votre adresse email pour accéder à votre espace client
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <EmailAuthForm onSuccess={() => navigate(from, { replace: true })} />
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EmailCustomerAuth;
