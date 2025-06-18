
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';

export const useCachedCategories = (includeHidden = false) => {
  const { data: categories = [], isLoading, refetch } = useQuery<Category[]>({
    queryKey: ['categories', includeHidden ? 'all' : 'visible'],
    queryFn: async () => {
      console.log('🗂️ Récupération des catégories depuis la base de données...');
      
      let query = supabase
        .from('categories')
        .select('*')
        .order('name');

      // Filtrer seulement les catégories visibles côté client si includeHidden est false
      if (!includeHidden) {
        query = query.eq('is_visible', true);
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erreur lors de la récupération des catégories:', error);
        throw error;
      }
      
      console.log('✅ Catégories récupérées:', data?.length || 0);
      return data as Category[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fonction pour obtenir tous les IDs de catégories (parent + enfants)
  const getAllCategoryIds = (categoryId: string): string[] => {
    if (!categories || categoryId === 'all') return [];
    
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (!selectedCategory) return [categoryId];
    
    // Si c'est une catégorie parent, inclure toutes ses sous-catégories
    const subcategories = categories.filter(cat => cat.parent_id === categoryId);
    const allIds = [categoryId, ...subcategories.map(sub => sub.id)];
    
    return allIds;
  };

  return { 
    categories, 
    isLoading, 
    refetch,
    getAllCategoryIds
  };
};
