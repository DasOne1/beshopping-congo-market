
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDataPreloader = () => {
  const { data: isLoaded, isLoading, error } = useQuery({
    queryKey: ['preload-data'],
    queryFn: async () => {
      try {
        // Précharger seulement les données essentielles pour réduire le temps de chargement
        const promises = [
          supabase.from('categories').select('id, name, slug').limit(10),
          supabase.from('products').select('id, name, images, original_price, featured').eq('featured', true).limit(6),
          supabase.from('settings').select('*').limit(5)
        ];

        const [categoriesResult, productsResult, settingsResult] = await Promise.all(promises);

        if (categoriesResult.error) throw categoriesResult.error;
        if (productsResult.error) throw productsResult.error;
        if (settingsResult.error) throw settingsResult.error;

        console.log('Données essentielles préchargées:', { 
          categories: categoriesResult.data?.length, 
          products: productsResult.data?.length,
          settings: settingsResult.data?.length 
        });

        return true;
      } catch (error) {
        console.error('Erreur lors du préchargement:', error);
        // Ne pas bloquer l'application en cas d'erreur réseau
        return true;
      }
    },
    retry: 1, // Réduire le nombre de tentatives
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  return {
    isLoaded: !!isLoaded,
    isLoading,
    error,
  };
};
