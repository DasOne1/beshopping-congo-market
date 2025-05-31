import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('Chargement des catégories depuis la base de données...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      console.log('Catégories chargées:', data?.length);
      return data as Category[];
    },
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes - catégories changent moins souvent
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: false, // Désactiver l'actualisation automatique
  });

  const createCategory = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Création d\'une nouvelle catégorie...');
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newCategory) => {
      console.log('Catégorie créée avec succès, mise à jour du cache...');
      
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['categories'], (oldData: Category[] = []) => {
        return [newCategory, ...oldData];
      });

      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      toast({
        title: "Catégorie créée",
        description: "La catégorie a été créée avec succès",
      });
    },
    onError: (error: any) => {
      console.error('Erreur lors de la création de la catégorie:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Category> & { id: string }) => {
      console.log('Mise à jour de la catégorie:', id);
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (updatedCategory) => {
      console.log('Catégorie mise à jour avec succès, mise à jour du cache...');
      
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['categories'], (oldData: Category[] = []) => {
        return oldData.map(category => 
          category.id === updatedCategory.id ? updatedCategory : category
        );
      });

      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      toast({
        title: "Catégorie mise à jour",
        description: "La catégorie a été mise à jour avec succès",
      });
    },
    onError: (error: any) => {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      console.log('Suppression de la catégorie:', id);
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      console.log('Catégorie supprimée avec succès, mise à jour du cache...');
      
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['categories'], (oldData: Category[] = []) => {
        return oldData.filter(category => category.id !== deletedId);
      });

      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      toast({
        title: "Catégorie supprimée",
        description: "La catégorie a été supprimée avec succès",
      });
    },
    onError: (error: any) => {
      console.error('Erreur lors de la suppression de la catégorie:', error);
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
    updateCategory,
    deleteCategory,
  };
};
