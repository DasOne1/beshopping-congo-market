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
      
      queryClient.setQueryData(['categories'], (oldData: ExtendedCategory[] = []) => {
        // Ajouter la nouvelle catégorie
        const updatedData = [newCategory, ...oldData];

        // Reconstruire les relations parent/enfant
        const categoriesMap = new Map<string, ExtendedCategory>();
        
        // Première passe : créer la map
        updatedData.forEach(cat => {
          categoriesMap.set(cat.id, { ...cat, children: [] });
        });

        // Deuxième passe : établir les relations
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

      // Invalider seulement le cache des relations
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
      
      queryClient.setQueryData(['categories'], (oldData: ExtendedCategory[] = []) => {
        // Mettre à jour la catégorie dans le cache
        const updatedData = oldData.map(category => 
          category.id === updatedCategory.id ? { ...category, ...updatedCategory } : category
        );

        // Reconstruire les relations parent/enfant
        const categoriesMap = new Map<string, ExtendedCategory>();
        
        // Première passe : créer la map
        updatedData.forEach(cat => {
          categoriesMap.set(cat.id, { ...cat, children: [] });
        });

        // Deuxième passe : établir les relations
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

      // Invalider seulement le cache des relations, pas le cache principal
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
        // Supprimer la catégorie
        const updatedData = oldData.filter(category => category.id !== deletedId);

        // Reconstruire les relations parent/enfant
        const categoriesMap = new Map<string, ExtendedCategory>();
        
        // Première passe : créer la map
        updatedData.forEach(cat => {
          categoriesMap.set(cat.id, { ...cat, children: [] });
        });

        // Deuxième passe : établir les relations
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

      // Invalider seulement le cache des relations
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
