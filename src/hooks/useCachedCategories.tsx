
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';

interface ExtendedCategory extends Category {
  children?: ExtendedCategory[];
  parent?: Category;
}

export const useCachedCategories = (includeHidden: boolean = false) => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery<ExtendedCategory[]>({
    queryKey: ['categories-with-relationships', includeHidden],
    queryFn: async () => {
      console.log('📂 Chargement des catégories avec relations...');
      let query = supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      // Filtrer par visibilité sauf si explicitement demandé
      if (!includeHidden) {
        query = query.eq('is_visible', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Organiser les catégories avec leurs relations parent/enfant
      const categoriesMap = new Map<string, ExtendedCategory>();
      const categories = data as ExtendedCategory[];

      // Première passe : créer la map
      categories.forEach(cat => {
        categoriesMap.set(cat.id, { ...cat, children: [] });
      });

      // Deuxième passe : établir les relations
      categories.forEach(cat => {
        const category = categoriesMap.get(cat.id)!;
        
        if (cat.parent_id) {
          const parent = categoriesMap.get(cat.parent_id);
          if (parent) {
            category.parent = parent;
            if (!parent.children) parent.children = [];
            parent.children.push(category);
          }
        }
      });

      console.log('✅ Catégories avec relations chargées:', categoriesMap.size);
      return Array.from(categoriesMap.values());
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Éviter les refetch inutiles
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const getCategoryWithChildren = (categoryId: string): ExtendedCategory | null => {
    return categories.find(cat => cat.id === categoryId) || null;
  };

  const getAllCategoryIds = (categoryId: string): string[] => {
    const category = getCategoryWithChildren(categoryId);
    if (!category) return [categoryId];

    const getAllIds = (cat: ExtendedCategory): string[] => {
      let ids = [cat.id];
      if (cat.children && cat.children.length > 0) {
        cat.children.forEach(child => {
          ids = ids.concat(getAllIds(child));
        });
      }
      return ids;
    };

    return getAllIds(category);
  };

  return {
    categories,
    isLoading,
    getCategoryWithChildren,
    getAllCategoryIds,
  };
};
