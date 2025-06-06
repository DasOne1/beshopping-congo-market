
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SimpleAuthForm from '@/components/SimpleAuthForm';
import { useAuth } from '@/hooks/useAuth';

const CustomerAuth = () => {
  const location = useLocation();
  const { customer } = useAuth();
  
  // Si l'utilisateur est déjà connecté, rediriger vers la destination ou la page d'accueil
  if (customer) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6 pt-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Connexion Client</h1>
            <p className="text-muted-foreground">
              Connectez-vous pour passer votre commande
            </p>
          </div>
          
          <SimpleAuthForm />
        </div>
      </div>

      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default CustomerAuth;
