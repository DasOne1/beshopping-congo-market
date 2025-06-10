
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useGlobalStore } from '@/store/useGlobalStore';

export const useOptimizedRealtimeSync = () => {
  const { 
    addProduct, updateProduct, removeProduct,
    addCategory, updateCategory, removeCategory,
    addOrder, updateOrder, removeOrder,
    addCustomer, updateCustomer, removeCustomer
  } = useGlobalStore();
  
  const channelsRef = useRef<any[]>([]);

  useEffect(() => {
    console.log('🔄 Configuration de la synchronisation temps réel optimisée...');

    // Canal pour les produits
    const productsChannel = supabase
      .channel('optimized-products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('🔄 Produit modifié:', payload.eventType);
          
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new) addProduct(payload.new as any);
              break;
            case 'UPDATE':
              if (payload.new) updateProduct(payload.new.id, payload.new as any);
              break;
            case 'DELETE':
              if (payload.old) removeProduct(payload.old.id);
              break;
          }
        }
      )
      .subscribe();

    // Canal pour les catégories
    const categoriesChannel = supabase
      .channel('optimized-categories-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'categories'
        },
        (payload) => {
          console.log('🔄 Catégorie modifiée:', payload.eventType);
          
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new) addCategory(payload.new as any);
              break;
            case 'UPDATE':
              if (payload.new) updateCategory(payload.new.id, payload.new as any);
              break;
            case 'DELETE':
              if (payload.old) removeCategory(payload.old.id);
              break;
          }
        }
      )
      .subscribe();

    // Canal pour les commandes
    const ordersChannel = supabase
      .channel('optimized-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('🔄 Commande modifiée:', payload.eventType);
          
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new) addOrder(payload.new as any);
              break;
            case 'UPDATE':
              if (payload.new) updateOrder(payload.new.id, payload.new as any);
              break;
            case 'DELETE':
              if (payload.old) removeOrder(payload.old.id);
              break;
          }
        }
      )
      .subscribe();

    // Canal pour les clients
    const customersChannel = supabase
      .channel('optimized-customers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        (payload) => {
          console.log('🔄 Client modifié:', payload.eventType);
          
          switch (payload.eventType) {
            case 'INSERT':
              if (payload.new) addCustomer(payload.new as any);
              break;
            case 'UPDATE':
              if (payload.new) updateCustomer(payload.new.id, payload.new as any);
              break;
            case 'DELETE':
              if (payload.old) removeCustomer(payload.old.id);
              break;
          }
        }
      )
      .subscribe();

    // Stocker les références des canaux
    channelsRef.current = [productsChannel, categoriesChannel, ordersChannel, customersChannel];

    // Nettoyage lors du démontage
    return () => {
      console.log('🧹 Nettoyage des canaux temps réel...');
      channelsRef.current.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channelsRef.current = [];
    };
  }, [addProduct, updateProduct, removeProduct, addCategory, updateCategory, removeCategory, addOrder, updateOrder, removeOrder, addCustomer, updateCustomer, removeCustomer]);
};
