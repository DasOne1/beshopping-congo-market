
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDataPreloader = () => {
  const { data: isLoaded, isLoading, error } = useQuery({
    queryKey: ['preload-data'],
    queryFn: async () => {
      try {
        // Précharger les catégories
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*');
        
        if (categoriesError) throw categoriesError;

        // Précharger les produits
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*');
        
        if (productsError) throw productsError;

        // Précharger les paramètres
        const { data: settings, error: settingsError } = await supabase
          .from('settings')
          .select('*');
        
        if (settingsError) throw settingsError;

        console.log('Données préchargées:', { 
          categories: categories?.length, 
          products: products?.length,
          settings: settings?.length 
        });

        return true;
      } catch (error) {
        console.error('Erreur lors du préchargement:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    isLoaded: !!isLoaded,
    isLoading,
    error,
  };
};
