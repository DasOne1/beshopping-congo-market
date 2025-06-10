
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useOptimizedCategories } from './useOptimizedData';

export const useCategories = () => {
  const { categories, isLoading, refetch } = useOptimizedCategories();
  const { addCategory, updateCategory, removeCategory } = useGlobalStore();

  const createCategory = useMutation({
    mutationFn: async (category: any) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newCategory) => {
      // Optimistic update
      const optimisticCategory = {
        ...newCategory,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      addCategory(optimisticCategory);
      return optimisticCategory;
    },
    onSuccess: (data, variables, context) => {
      // Replace optimistic update with real data
      if (context) {
        removeCategory(context.id);
        addCategory(data);
      }
      toast({
        title: "Catégorie créée",
        description: "La catégorie a été créée avec succès",
      });
    },
    onError: (error: any, variables, context) => {
      // Revert optimistic update
      if (context) {
        removeCategory(context.id);
      }
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, ...updates }) => {
      // Optimistic update
      updateCategory(id, updates);
      return { id, updates };
    },
    onSuccess: () => {
      toast({
        title: "Catégorie mise à jour",
        description: "La catégorie a été mise à jour avec succès",
      });
    },
    onError: (error: any, variables, context) => {
      // Revert optimistic update
      refetch();
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      // Optimistic update
      removeCategory(id);
      return { id };
    },
    onSuccess: () => {
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès",
      });
    },
    onError: (error: any, variables, context) => {
      // Revert optimistic update
      refetch();
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    categories,
    isLoading,
    createCategory,
    updateCategory: updateCategoryMutation,
    deleteCategory: deleteCategoryMutation,
    refetch,
  };
};
