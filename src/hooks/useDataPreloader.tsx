
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

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
  const { data: isLoaded, isLoading, error } = useQuery({
    queryKey: ['preload-data'],
    queryFn: async (): Promise<PreloadedData> => {
      try {
        console.log('Début du préchargement des données essentielles...');
        
        // Vérifier le cache mémoire d'abord
        const cachedData = getCachedData('preload-data');
        if (cachedData) {
          console.log('Données préchargées trouvées en cache');
          return cachedData;
        }

        // Précharger seulement les données essentielles avec optimisation
        const promises = [
          // Catégories essentielles avec limitation stricte
          supabase
            .from('categories')
            .select('id, name, slug')
            .limit(5),
          
          // Produits vedettes uniquement
          supabase
            .from('products')
            .select('id, name, images, tags, original_price, discounted_price, featured, status')
            .eq('featured', true)
            .eq('status', 'active')
            .limit(4),
          
          // Paramètres de base uniquement
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
              // S'assurer que les produits ont tous les champs requis
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
            console.log(`Données ${dataKeys[index]} préchargées avec succès`);
          } else {
            console.warn(`Erreur lors du préchargement ${['catégories', 'produits', 'paramètres'][index]}:`, result.reason);
          }
        });

        console.log(`Préchargement terminé: ${successCount}/3 sources de données chargées`);
        
        // Mettre en cache les données préchargées pour 10 minutes
        setCachedData('preload-data', preloadedData, 600000);
        
        // Retourner les données préchargées même partielles
        return preloadedData;
      } catch (error) {
        console.error('Erreur lors du préchargement:', error);
        // Ne pas bloquer l'application en cas d'erreur réseau
        return { categories: [], products: [], settings: [] };
      }
    },
    retry: 1,
    retryDelay: 500, // Réduction du délai de retry
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (augmenté pour garder en cache plus longtemps)
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Ne pas refetch automatiquement au montage
    throwOnError: false,
  });

  return {
    isLoaded: !!isLoaded,
    isLoading,
    error,
    preloadedData: isLoaded || { categories: [], products: [], settings: [] },
  };
};
