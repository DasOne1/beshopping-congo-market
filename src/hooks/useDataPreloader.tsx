/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { db } from '@/services/offlineStorage';
import { useAppStore } from '@/stores/appStore';

// Cache global en mémoire pour éviter les requêtes redondantes
const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const getCachedData = (key: string): any | null => {
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any, ttl: number = 300000) => { // 5 minutes par défaut
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

interface PreloadedData {
  categories: any[];
  products: Product[];
  settings: any[];
}

export const useDataPreloader = () => {
  const { connection } = useAppStore();

  const { data: isLoaded, isLoading, error } = useQuery({
    queryKey: ['preload-data'],
    queryFn: async (): Promise<PreloadedData> => {
      try {
        console.log('Début du préchargement des données essentielles...');
        
        // Vérifier d'abord le cache IndexedDB si hors ligne
        if (!connection.isOnline) {
          const offlineData = await Promise.all([
            db.getCachedData('categories', 'essential') as Promise<any[]>,
            db.getCachedData('products', 'featured') as Promise<Product[]>,
            db.getCachedData('settings', 'essential') as Promise<any[]>
          ]);

          if (offlineData.every(data => data !== null)) {
            console.log('Données chargées depuis le cache hors ligne');
            return {
              categories: offlineData[0] || [],
              products: offlineData[1] || [],
              settings: offlineData[2] || []
            };
          }
        }
        
        // Vérifier le cache mémoire ensuite
        const cachedData = getCachedData('preload-data');
        if (cachedData) {
          console.log('Données préchargées trouvées en cache mémoire');
          return cachedData;
        }

        // Si en ligne, charger depuis l'API
        if (connection.isOnline) {
          const promises = [
            supabase
              .from('categories')
              .select('id, name, slug')
              .limit(5),
            
            supabase
              .from('products')
              .select('id, name, images, tags, original_price, discounted_price, featured, status')
              .eq('featured', true)
              .eq('status', 'active')
              .limit(4),
            
            supabase
              .from('settings')
              .select('key, value')
              .in('key', ['site_name', 'currency', 'contact_phone'])
          ];

          const results = await Promise.allSettled(promises);
          
          let successCount = 0;
          const preloadedData: PreloadedData = {
            categories: [],
            products: [],
            settings: []
          };

          results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              successCount++;
              const dataKeys = ['categories', 'products', 'settings'] as const;
              const key = dataKeys[index];
              
              if (key === 'products') {
                const products = result.value.data?.map((product: any) => ({
                  ...product,
                  tags: product.tags || [],
                  description: product.description || '',
                  category_id: product.category_id || '',
                  stock: product.stock || 0,
                  created_at: product.created_at || new Date().toISOString(),
                  updated_at: product.updated_at || new Date().toISOString()
                })) || [];
                preloadedData[key] = products;
              } else {
                preloadedData[key] = result.value.data || [];
              }

              // Sauvegarder dans le cache IndexedDB pour utilisation hors ligne
              db.setCachedData(dataKeys[index], key === 'products' ? 'featured' : 'essential', result.value.data);
              
              console.log(`Données ${dataKeys[index]} préchargées avec succès`);
            }
          });

          console.log(`Préchargement terminé: ${successCount}/3 sources de données chargées`);
          
          // Mettre en cache mémoire
          setCachedData('preload-data', preloadedData, 600000);
          
          return preloadedData;
        }

        // Fallback si hors ligne et pas de cache
        return { categories: [], products: [], settings: [] };
      } catch (error) {
        console.error('Erreur lors du préchargement:', error);
        return { categories: [], products: [], settings: [] };
      }
    },
    retry: connection.isOnline ? 1 : 0, // Ne pas réessayer si hors ligne
    retryDelay: 500,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: connection.isOnline,
    refetchOnMount: connection.isOnline,
    throwOnError: false,
  });

  return {
    isLoaded: !!isLoaded,
    isLoading,
    error,
    preloadedData: isLoaded || { categories: [], products: [], settings: [] },
    isOffline: !connection.isOnline
  };
};