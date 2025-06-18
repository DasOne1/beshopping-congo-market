
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Product } from '@/types';
import { useEffect } from 'react';

type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
type ProductUpdate = Partial<ProductInput> & { id: string };

export const useProducts = () => {
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
    queryKey: ['products'],
    queryFn: async () => {
      console.log('📦 Récupération des produits depuis la base de données...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_visible', true) // Filtrer seulement les produits visibles côté client
        .eq('status', 'active') // Seulement les produits actifs
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Erreur lors de la récupération des produits:', error);
        throw error;
      }
      
      console.log('✅ Produits récupérés:', data?.length || 0);
      return data as Product[];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes - données considérées comme fraîches
    gcTime: 1000 * 60 * 10, // 10 minutes - cache en mémoire
    refetchOnWindowFocus: false, // Éviter les refetch inutiles
    refetchOnMount: false, // Éviter les refetch inutiles au montage
    retry: 3, // Retry automatique en cas d'erreur réseau
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const createProduct = useMutation({
    mutationFn: async (product: ProductInput) => {
      const productData = {
        name: product.name,
        description: product.description,
        original_price: product.original_price,
        discounted_price: product.discounted_price,
        stock: product.stock,
        category_id: product.category_id,
        images: product.images || [],
        tags: product.tags || [],
        featured: product.featured || false,
        weight: product.weight,
        dimensions: product.dimensions,
        sku: product.sku,
        status: product.status || 'active',
        discount: product.discount,
        is_visible: product.is_visible ?? true,
        colors: product.colors || [],
        sizes: product.sizes || [],
        gender: product.gender,
        material: product.material,
        brand: product.brand,
        collection: product.collection,
        season: product.season,
        care_instructions: product.care_instructions,
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
      // Optimisation : mise à jour ciblée du cache
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
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: (updatedProduct) => {
      // Optimisation : mise à jour ciblée plutôt qu'invalidation complète
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
      // Optimisation : suppression ciblée du cache
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
