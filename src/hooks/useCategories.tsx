
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
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
  // Relations pour les sous-catégories
  children?: Category[];
  parent?: Category;
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
      
      // Organiser les catégories avec leurs relations parent/enfant
      const categoriesMap = new Map<string, Category>();
      const rootCategories: Category[] = [];

      // D'abord, créer toutes les catégories
      data?.forEach(cat => {
        const category: Category = {
          ...cat,
          is_visible: cat.is_visible ?? true,
          children: []
        };
        categoriesMap.set(cat.id, category);
      });

      // Ensuite, établir les relations parent/enfant
      data?.forEach(cat => {
        const category = categoriesMap.get(cat.id)!;
        
        if (cat.parent_id) {
          const parent = categoriesMap.get(cat.parent_id);
          if (parent) {
            category.parent = parent;
            parent.children!.push(category);
          }
        } else {
          rootCategories.push(category);
        }
      });

      console.log('Catégories chargées:', rootCategories.length, 'catégories principales');
      return Array.from(categoriesMap.values()) as Category[];
    },
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchInterval: false,
  });

  // Fonction pour obtenir uniquement les catégories visibles (côté utilisateur)
  const getVisibleCategories = () => {
    return categories.filter(cat => cat.is_visible);
  };

  // Fonction pour obtenir les catégories principales (sans parent)
  const getRootCategories = () => {
    return categories.filter(cat => !cat.parent_id);
  };

  // Fonction pour obtenir les sous-catégories d'une catégorie
  const getSubCategories = (parentId: string) => {
    return categories.filter(cat => cat.parent_id === parentId);
  };

  // Fonction pour obtenir toutes les catégories (y compris cachées) pour l'admin
  const getAllCategories = () => {
    return categories;
  };

  const createCategory = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Création d\'une nouvelle catégorie...');
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...category,
          is_visible: category.is_visible ?? true
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newCategory) => {
      console.log('Catégorie créée avec succès, mise à jour du cache...');
      
      queryClient.setQueryData(['categories'], (oldData: Category[] = []) => {
        const formattedCategory: Category = {
          ...newCategory,
          is_visible: newCategory.is_visible ?? true,
          children: []
        };
        return [formattedCategory, ...oldData];
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
      
      queryClient.setQueryData(['categories'], (oldData: Category[] = []) => {
        return oldData.map(category => 
          category.id === updatedCategory.id ? {
            ...updatedCategory,
            is_visible: updatedCategory.is_visible ?? true,
            children: category.children || []
          } : category
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
      
      // Vérifier s'il y a des sous-catégories
      const subCategories = getSubCategories(id);
      if (subCategories.length > 0) {
        throw new Error('Impossible de supprimer une catégorie qui a des sous-catégories. Supprimez d\'abord les sous-catégories.');
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      console.log('Catégorie supprimée avec succès, mise à jour du cache...');
      
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
    getVisibleCategories,
    getRootCategories,
    getSubCategories,
    getAllCategories,
  };
};
