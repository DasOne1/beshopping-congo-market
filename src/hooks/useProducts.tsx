
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Product {
  id: string;
  name: string;
  description: string;
  original_price: number;
  discounted_price?: number;
  discount?: number;
  images: string[];
  stock: number;
  category_id?: string;
  tags: string[];
  featured?: boolean;
  popular?: number;
  sku?: string;
  weight?: number;
  dimensions?: any;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProducts = () => {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Chargement des produits depuis la base de données...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des produits:', error);
        return [];
      }
      
      console.log('Produits chargés:', data?.length);
      return data.map(product => ({
        ...product,
        tags: product.tags || []
      })) as Product[];
    },
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes - données considérées fraîches
    gcTime: 30 * 60 * 1000, // 30 minutes - garde en cache
    refetchInterval: false,
  });

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      // Essayer d'abord de récupérer depuis le cache des produits
      const cachedProducts = queryClient.getQueryData(['products']) as Product[];
      if (cachedProducts && cachedProducts.length > 0) {
        const featured = cachedProducts.filter(p => p.featured && p.status === 'active').slice(0, 6);
        if (featured.length > 0) {
          console.log('Produits vedettes récupérés depuis le cache');
          return featured;
        }
      }

      console.log('Chargement des produits vedettes...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('status', 'active')
        .limit(6);

      if (error) {
        console.error('Erreur lors du chargement des produits vedettes:', error);
        return [];
      }
      
      return data.map(product => ({
        ...product,
        tags: product.tags || []
      })) as Product[];
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 heure
    enabled: true, // Toujours activé pour éviter les dépendances
  });

  const { data: popularProducts = [] } = useQuery({
    queryKey: ['products', 'popular'],
    queryFn: async () => {
      // Essayer d'abord de récupérer depuis le cache des produits
      const cachedProducts = queryClient.getQueryData(['products']) as Product[];
      if (cachedProducts && cachedProducts.length > 0) {
        const popular = cachedProducts
          .filter(p => p.status === 'active')
          .sort((a, b) => (b.popular || 0) - (a.popular || 0))
          .slice(0, 8);
        if (popular.length > 0) {
          console.log('Produits populaires récupérés depuis le cache');
          return popular;
        }
      }

      console.log('Chargement des produits populaires...');
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('popular', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Erreur lors du chargement des produits populaires:', error);
        return [];
      }
      
      return data.map(product => ({
        ...product,
        tags: product.tags || []
      })) as Product[];
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 heure
    enabled: true, // Toujours activé pour éviter les dépendances
  });

  const createProduct = useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Création d\'un nouveau produit...');
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          original_price: product.original_price,
          discounted_price: product.discounted_price,
          discount: product.discount,
          images: product.images,
          stock: product.stock,
          category_id: product.category_id,
          tags: product.tags,
          featured: product.featured,
          popular: product.popular || 0,
          sku: product.sku,
          weight: product.weight,
          dimensions: product.dimensions,
          status: product.status || 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newProduct) => {
      console.log('Produit créé avec succès, mise à jour du cache...');
      
      queryClient.setQueryData(['products'], (oldData: Product[] = []) => {
        return [newProduct, ...oldData];
      });

      // Invalider seulement les requêtes dérivées
      queryClient.invalidateQueries({ queryKey: ['products', 'featured'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'popular'] });
      
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès",
      });
    },
    onError: (error: any) => {
      console.error('Erreur lors de la création du produit:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
      console.log('Mise à jour du produit:', id);
      
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (updatedProduct) => {
      console.log('Produit mis à jour avec succès, mise à jour du cache...');
      
      queryClient.setQueryData(['products'], (oldData: Product[] = []) => {
        return oldData.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        );
      });

      // Invalider seulement les requêtes dérivées
      queryClient.invalidateQueries({ queryKey: ['products', 'featured'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'popular'] });
      
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès",
      });
    },
    onError: (error: any) => {
      console.error('Erreur lors de la mise à jour du produit:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      console.log('Suppression du produit:', id);
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      console.log('Produit supprimé avec succès, mise à jour du cache...');
      
      queryClient.setQueryData(['products'], (oldData: Product[] = []) => {
        return oldData.filter(product => product.id !== deletedId);
      });

      // Invalider seulement les requêtes dérivées
      queryClient.invalidateQueries({ queryKey: ['products', 'featured'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'popular'] });
      
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      console.error('Erreur lors de la suppression du produit:', error);
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
    error,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
