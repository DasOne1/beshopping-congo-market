
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Product } from '@/types';
import { useEffect } from 'react';

type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
type ProductUpdate = Partial<ProductInput> & { id: string };

interface UseProductsOptions {
  includeHidden?: boolean;
  includeInactive?: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { includeHidden = false, includeInactive = false } = options;
  const queryClient = useQueryClient();

  // Configuration de la synchronisation en temps réel pour les produits
  useEffect(() => {
    console.log('⚡ Configuration de la synchronisation en temps réel pour les produits...');
    
    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('🔄 Changement détecté dans les produits:', payload);
          
          // Invalider seulement les caches nécessaires
          queryClient.invalidateQueries({ queryKey: ['products'] });
          queryClient.invalidateQueries({ queryKey: ['preload-data'] });
        }
      )
      .subscribe();

    return () => {
      console.log('🧹 Nettoyage du canal de synchronisation produits...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: products = [], isLoading, refetch } = useQuery<Product[]>({
    queryKey: ['products', includeHidden, includeInactive],
    queryFn: async () => {
      console.log('📦 Récupération des produits depuis la base de données...');
      
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      // Appliquer les filtres selon les options
      if (!includeHidden) {
        query = query.eq('is_visible', true);
      }
      
      if (!includeInactive) {
        query = query.eq('status', 'active');
      }

      const { data, error } = await query;

      if (error) {
        console.error('❌ Erreur lors de la récupération des produits:', error);
        throw error;
      }
      
      console.log('✅ Produits récupérés:', data?.length || 0);
      return data as Product[];
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const createProduct = useMutation({
    mutationFn: async (product: ProductInput) => {
      // Nettoyer les IDs vides pour éviter les erreurs UUID
      const cleanProduct = {
        ...product,
        category_id: product.category_id && product.category_id.trim() !== '' ? product.category_id : null,
        subcategory_id: product.subcategory_id && product.subcategory_id.trim() !== '' ? product.subcategory_id : null,
      };

      const productData = {
        name: cleanProduct.name,
        description: cleanProduct.description,
        original_price: cleanProduct.original_price,
        discounted_price: cleanProduct.discounted_price,
        stock: cleanProduct.stock,
        category_id: cleanProduct.category_id,
        subcategory_id: cleanProduct.subcategory_id,
        images: cleanProduct.images || [],
        tags: cleanProduct.tags || [],
        featured: cleanProduct.featured || false,
        weight: cleanProduct.weight,
        dimensions: cleanProduct.dimensions,
        sku: cleanProduct.sku,
        status: cleanProduct.status || 'active',
        discount: cleanProduct.discount,
        is_visible: cleanProduct.is_visible ?? true,
        colors: cleanProduct.colors || [],
        sizes: cleanProduct.sizes || [],
        gender: cleanProduct.gender,
        material: cleanProduct.material,
        brand: cleanProduct.brand,
        collection: cleanProduct.collection,
        season: cleanProduct.season,
        care_instructions: cleanProduct.care_instructions,
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['preload-data'] });
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès",
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

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: ProductUpdate) => {
      // Nettoyer les IDs vides pour éviter les erreurs UUID
      const cleanUpdates = {
        ...updates,
        category_id: updates.category_id && updates.category_id.trim() !== '' ? updates.category_id : null,
        subcategory_id: updates.subcategory_id && updates.subcategory_id.trim() !== '' ? updates.subcategory_id : null,
      };

      const { data, error } = await supabase
        .from('products')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: (updatedProduct) => {
      queryClient.setQueryData(['products'], (oldData: Product[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        );
      });
      
      queryClient.invalidateQueries({ queryKey: ['preload-data'] });
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès",
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

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['products'], (oldData: Product[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(product => product.id !== deletedId);
      });
      
      queryClient.invalidateQueries({ queryKey: ['preload-data'] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
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
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch,
  };
};
