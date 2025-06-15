
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Subcategory } from '@/types';

type SubcategoryInput = Omit<Subcategory, 'id' | 'created_at' | 'updated_at'>;
type SubcategoryUpdate = Partial<SubcategoryInput> & { id: string };

export const useSubcategories = (categoryId?: string) => {
  const queryClient = useQueryClient();

  const { data: subcategories = [], isLoading } = useQuery<Subcategory[]>({
    queryKey: ['subcategories', categoryId],
    queryFn: async () => {
      let query = supabase
        .from('categories')
        .select('*')
        .not('parent_id', 'is', null)
        .order('name', { ascending: true });

      if (categoryId) {
        query = query.eq('parent_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data.map(item => ({
        ...item,
        subcategory_id: item.id,
        category_id: item.parent_id || '',
      })) as Subcategory[];
    },
  });

  const createSubcategory = useMutation({
    mutationFn: async (subcategory: SubcategoryInput) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: subcategory.name,
          description: subcategory.description,
          slug: subcategory.slug,
          parent_id: subcategory.category_id,
          is_visible: subcategory.is_visible,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subcategories'] });
      toast({
        title: "Sous-catégorie créée",
        description: "La sous-catégorie a été créée avec succès",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    subcategories,
    isLoading,
    createSubcategory,
  };
};
