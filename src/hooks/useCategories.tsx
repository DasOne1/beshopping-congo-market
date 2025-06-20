
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Category } from '@/types';

interface ExtendedCategory extends Category {
  children?: ExtendedCategory[];
  parent?: Category;
}

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery<ExtendedCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      console.log('Chargement des catégories depuis la base de données...');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      // Organiser les catégories avec leurs relations parent/enfant
      const categoriesMap = new Map<string, ExtendedCategory>();
      const categoriesData = data as ExtendedCategory[];

      // Première passe : créer la map
      categoriesData.forEach(cat => {
        categoriesMap.set(cat.id, { ...cat, children: [] });
      });

      // Deuxième passe : établir les relations
      categoriesData.forEach(cat => {
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

      console.log('Catégories chargées avec relations:', categoriesMap.size);
      return Array.from(categoriesMap.values());
    },
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchInterval: false,
  });

  const createCategory = useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Création d\'une nouvelle catégorie...');
      
      // Nettoyer le parent_id pour éviter les erreurs UUID
      const cleanCategory = {
        ...category,
        parent_id: category.parent_id && category.parent_id.trim() !== '' && category.parent_id !== 'none' ? category.parent_id : null,
      };

      const { data, error } = await supabase
        .from('categories')
        .insert([cleanCategory])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newCategory) => {
      console.log('Catégorie créée avec succès, mise à jour du cache...');
      
      queryClient.setQueryData(['categories'], (oldData: ExtendedCategory[] = []) => {
        const updatedData = [newCategory, ...oldData];
        const categoriesMap = new Map<string, ExtendedCategory>();
        
        updatedData.forEach(cat => {
          categoriesMap.set(cat.id, { ...cat, children: [] });
        });

        updatedData.forEach(cat => {
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

        return Array.from(categoriesMap.values());
      });

      queryClient.invalidateQueries({ queryKey: ['categories-with-relationships'] });
      
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
      
      // Nettoyer le parent_id pour éviter les erreurs UUID
      const cleanUpdates = {
        ...updates,
        parent_id: updates.parent_id && updates.parent_id.trim() !== '' && updates.parent_id !== 'none' ? updates.parent_id : null,
      };

      const { data, error } = await supabase
        .from('categories')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (updatedCategory) => {
      console.log('Catégorie mise à jour avec succès, mise à jour du cache...');
      
      queryClient.setQueryData(['categories'], (oldData: ExtendedCategory[] = []) => {
        const updatedData = oldData.map(category => 
          category.id === updatedCategory.id ? { ...category, ...updatedCategory } : category
        );

        const categoriesMap = new Map<string, ExtendedCategory>();
        
        updatedData.forEach(cat => {
          categoriesMap.set(cat.id, { ...cat, children: [] });
        });

        updatedData.forEach(cat => {
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

        return Array.from(categoriesMap.values());
      });

      queryClient.invalidateQueries({ queryKey: ['categories-with-relationships'] });
      
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
      
      queryClient.setQueryData(['categories'], (oldData: ExtendedCategory[] = []) => {
        const updatedData = oldData.filter(category => category.id !== deletedId);

        const categoriesMap = new Map<string, ExtendedCategory>();
        
        updatedData.forEach(cat => {
          categoriesMap.set(cat.id, { ...cat, children: [] });
        });

        updatedData.forEach(cat => {
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

        return Array.from(categoriesMap.values());
      });

      queryClient.invalidateQueries({ queryKey: ['categories-with-relationships'] });
      
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
