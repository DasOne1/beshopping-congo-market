
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useOptimizedProducts } from './useOptimizedData';

// Réexporter Product depuis le store
export type { Product } from '@/store/types';

export const useProducts = () => {
  const { products, isLoading, refetch } = useOptimizedProducts();
  const { addProduct, updateProduct, removeProduct } = useGlobalStore();

  // Produits vedettes (depuis le cache)
  const featuredProducts = products.filter(p => p.featured && p.status === 'active').slice(0, 8);
  
  // Produits populaires (depuis le cache)
  const popularProducts = products
    .filter(p => p.status === 'active')
    .sort((a, b) => (b.popular || 0) - (a.popular || 0))
    .slice(0, 6);

  const createProduct = useMutation({
    mutationFn: async (product: any) => {
      const productWithDefaults = {
        ...product,
        is_visible: product.is_visible !== undefined ? product.is_visible : true,
        tags: product.tags || [],
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productWithDefaults])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newProduct) => {
      const optimisticProduct = {
        ...newProduct,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_visible: newProduct.is_visible !== undefined ? newProduct.is_visible : true,
        tags: newProduct.tags || [],
      };
      addProduct(optimisticProduct);
      return optimisticProduct;
    },
    onSuccess: (data, variables, context) => {
      if (context) {
        removeProduct(context.id);
        addProduct(data);
      }
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès",
      });
    },
    onError: (error: any, variables, context) => {
      if (context) {
        removeProduct(context.id);
      }
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, ...updates }) => {
      updateProduct(id, updates);
      return { id, updates };
    },
    onSuccess: () => {
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès",
      });
    },
    onError: (error: any, variables, context) => {
      refetch();
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      removeProduct(id);
      return { id };
    },
    onSuccess: () => {
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      });
    },
    onError: (error: any, variables, context) => {
      refetch();
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    products,
    featuredProducts,
    popularProducts,
    isLoading,
    createProduct,
    updateProduct: updateProductMutation,
    deleteProduct,
    refetch,
  };
};
