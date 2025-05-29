
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Configuration de la synchronisation en temps réel...');

    // Synchronisation pour les produits
    const productsChannel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Changement détecté dans les produits:', payload);
          
          // Invalider toutes les requêtes liées aux produits
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['products', 'featured'] });
          queryClient.invalidateQueries({ queryKey: ['products', 'popular'] });
        }
      )
      .subscribe();

    // Synchronisation pour les catégories
    const categoriesChannel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        (payload) => {
          console.log('Changement détecté dans les catégories:', payload);
          queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
      )
      .subscribe();

    // Synchronisation pour les commandes
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Changement détecté dans les commandes:', payload);
          queryClient.invalidateQueries({ queryKey: ['orders'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        }
      )
      .subscribe();

    // Nettoyage lors du démontage
    return () => {
      console.log('Nettoyage des canaux de synchronisation...');
      supabase.removeChannel(productsChannel);
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(ordersChannel);
    };
  }, [queryClient]);
};
