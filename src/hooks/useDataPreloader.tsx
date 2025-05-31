
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDataPreloader = () => {
  const { data: isLoaded, isLoading, error } = useQuery({
    queryKey: ['preload-data'],
    queryFn: async () => {
      try {
        console.log('Début du préchargement optimisé...');
        
        // Précharger uniquement les données les plus critiques avec des requêtes très limitées
        const promises = [
          // Seulement 3 catégories principales
          supabase.from('categories').select('id, name, slug').limit(3),
          // Seulement 2 produits vedettes pour l'aperçu
          supabase.from('products').select('id, name, images, original_price, featured, status').eq('featured', true).eq('status', 'active').limit(2),
        ];

        const results = await Promise.allSettled(promises);
        
        let successCount = 0;
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successCount++;
            console.log(`Données ${['catégories', 'produits'][index]} préchargées rapidement`);
          } else {
            console.warn(`Erreur rapide ${['catégories', 'produits'][index]}:`, result.reason);
          }
        });

        console.log(`Préchargement optimisé terminé: ${successCount}/2 sources chargées`);
        
        // Retourner true même si une source échoue
        return true;
      } catch (error) {
        console.error('Erreur lors du préchargement optimisé:', error);
        // Ne jamais bloquer l'application
        return true;
      }
    },
    retry: 0, // Pas de retry pour accélérer
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  return {
    isLoaded: !!isLoaded,
    isLoading,
    error,
  };
};
