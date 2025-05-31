
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDataPreloader = () => {
  const { data: isLoaded, isLoading, error } = useQuery({
    queryKey: ['preload-data'],
    queryFn: async () => {
      try {
        console.log('Début du préchargement des données essentielles...');
        
        // Précharger seulement les données essentielles
        const promises = [
          supabase.from('categories').select('id, name, slug').limit(10),
          supabase.from('products').select('id, name, images, original_price, featured').eq('featured', true).limit(6),
          supabase.from('settings').select('*').limit(5)
        ];

        const results = await Promise.allSettled(promises);
        
        let successCount = 0;
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            successCount++;
            console.log(`Données ${['catégories', 'produits', 'paramètres'][index]} préchargées avec succès`);
          } else {
            console.warn(`Erreur lors du préchargement ${['catégories', 'produits', 'paramètres'][index]}:`, result.reason);
          }
        });

        console.log(`Préchargement terminé: ${successCount}/3 sources de données chargées`);
        
        // Retourner true même si certaines données n'ont pas pu être chargées
        // L'application peut fonctionner avec des données partielles
        return true;
      } catch (error) {
        console.error('Erreur lors du préchargement:', error);
        // Ne pas bloquer l'application en cas d'erreur réseau
        return true;
      }
    },
    retry: 1,
    retryDelay: 1000,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    // Permettre à l'application de démarrer même si le préchargement échoue
    throwOnError: false,
  });

  return {
    isLoaded: !!isLoaded,
    isLoading,
    error,
  };
};
