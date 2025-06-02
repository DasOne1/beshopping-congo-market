import React from 'react';
import { useLocation } from 'react-router-dom';
import { MobileNavBar } from './MobileNavBar';
import { ScrollToTop } from './ScrollToTop';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import OfflineGuard from './OfflineGuard';
import type { QueryKey } from '@tanstack/react-query';

interface UserLayoutProps {
  children: React.ReactNode;
}

// Map des routes vers leurs queryKeys
const routeQueryKeys: Record<string, QueryKey | QueryKey[]> = {
  '/': [['products'], ['categories']], // Page d'accueil nécessite les deux
  '/products': ['products'],
  '/categories': ['categories'],
  '/product': ['products'], // Pour les pages de détail de produit
  '/cart': ['products'], // Le panier a besoin des produits
  '/favorites': ['products'], // Les favoris aussi
  '/account': ['user'], // Page de compte utilisateur
  '/custom-order': ['products', 'categories'], // Commande personnalisée
};

export default function UserLayout({ children }: UserLayoutProps) {
  useScrollToTop();
  const location = useLocation();
  
  // Trouver la queryKey correspondante à la route actuelle
  const getQueryKeysForRoute = () => {
    const path = location.pathname;
    
    // Gérer les routes dynamiques (ex: /product/123)
    const baseRoute = Object.keys(routeQueryKeys).find(route => 
      path.startsWith(route)
    );

    return baseRoute ? routeQueryKeys[baseRoute] : null;
  };

  const queryKeys = getQueryKeysForRoute();

  // Si la route n'a pas besoin de données ou n'est pas dans notre map
  if (!queryKeys) {
    return (
      <div className="min-h-screen bg-background">
        {children}
        <ScrollToTop />
        <MobileNavBar />
      </div>
    );
  }

  // Pour les routes qui nécessitent plusieurs jeux de données
  if (Array.isArray(queryKeys[0])) {
    return (
      <div className="min-h-screen bg-background">
        {(queryKeys as QueryKey[]).reduce((acc, queryKey) => (
          <OfflineGuard queryKey={queryKey}>
            {acc}
          </OfflineGuard>
        ), children)}
        <ScrollToTop />
        <MobileNavBar />
      </div>
    );
  }

  // Pour les routes qui ne nécessitent qu'un jeu de données
  return (
    <div className="min-h-screen bg-background">
      <OfflineGuard queryKey={queryKeys}>
        {children}
      </OfflineGuard>
      <ScrollToTop />
      <MobileNavBar />
    </div>
  );
}
