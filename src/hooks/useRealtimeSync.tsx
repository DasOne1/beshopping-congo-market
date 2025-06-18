/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Configuration de la synchronisation en temps réel optimisée...');

    // Synchronisation pour les produits avec mise à jour optimiste
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
          
          // Mise à jour optimiste du cache selon le type d'événement
          if (payload.eventType === 'INSERT' && payload.new) {
            queryClient.setQueryData(['products'], (oldData: any[] = []) => {
              return [payload.new, ...oldData];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            queryClient.setQueryData(['products'], (oldData: any[] = []) => {
              return oldData.map(product => 
                product.id === payload.new.id ? { ...product, ...payload.new } : product
              );
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            queryClient.setQueryData(['products'], (oldData: any[] = []) => {
              return oldData.filter(product => product.id !== payload.old.id);
            });
          }
          
          // Invalider toutes les requêtes liées aux produits pour synchronisation complète
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['preload-data'] });
        }
      )
      .subscribe();

    // Synchronisation pour les catégories avec mise à jour optimiste
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
          
          // Mise à jour optimiste du cache
          if (payload.eventType === 'INSERT' && payload.new) {
            queryClient.setQueryData(['categories'], (oldData: any[] = []) => {
              return [payload.new, ...oldData];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            queryClient.setQueryData(['categories'], (oldData: any[] = []) => {
              return oldData.map(category => 
                category.id === payload.new.id ? { ...category, ...payload.new } : category
              );
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            queryClient.setQueryData(['categories'], (oldData: any[] = []) => {
              return oldData.filter(category => category.id !== payload.old.id);
            });
          }
          
          queryClient.invalidateQueries({ queryKey: ['categories'] });
          queryClient.invalidateQueries({ queryKey: ['preload-data'] });
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
          
          // Mise à jour optimiste du cache
          if (payload.eventType === 'INSERT' && payload.new) {
            queryClient.setQueryData(['orders'], (oldData: any[] = []) => {
              return [payload.new, ...oldData];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            queryClient.setQueryData(['orders'], (oldData: any[] = []) => {
              return oldData.map(order => 
                order.id === payload.new.id ? { ...order, ...payload.new } : order
              );
            });
          } else if (payload.eventType === 'DELETE' && payload.old) {
            queryClient.setQueryData(['orders'], (oldData: any[] = []) => {
              return oldData.filter(order => order.id !== payload.old.id);
            });
          }
          
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
