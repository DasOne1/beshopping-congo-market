
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
  tags?: string[];
  featured?: boolean;
  popular?: number;
  sku?: string;
  weight?: number;
  dimensions?: any;
  status?: string;
  created_at?: string;
  updated_at?: string;
  // Computed fields for compatibility
  originalPrice?: number;
  category?: string;
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
      
      // Transform data to match both interfaces
      return data.map(product => ({
        ...product,
        originalPrice: product.original_price,
        category: ''
      })) as Product[];
    },
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    staleTime: 2 * 60 * 1000, // 2 minutes - données considérées comme fraîches
    gcTime: 10 * 60 * 1000, // 10 minutes - temps avant suppression du cache
    refetchInterval: 5 * 60 * 1000, // Actualisation automatique toutes les 5 minutes si nécessaire
  });

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
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
        originalPrice: product.original_price,
        category: ''
      })) as Product[];
    },
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  const { data: popularProducts = [] } = useQuery({
    queryKey: ['products', 'popular'],
    queryFn: async () => {
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
        originalPrice: product.original_price,
        category: ''
      })) as Product[];
    },
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  const createProduct = useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Création d\'un nouveau produit...');
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          original_price: product.original_price || product.originalPrice || 0,
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
      
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['products'], (oldData: Product[] = []) => {
        const transformedProduct = {
          ...newProduct,
          originalPrice: newProduct.original_price,
          category: ''
        } as Product;
        return [transformedProduct, ...oldData];
      });

      // Invalider les requêtes pour synchroniser avec la base de données
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
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
      const updateData: any = { ...updates };
      
      // Convert compatibility fields
      if (updates.originalPrice && !updates.original_price) {
        updateData.original_price = updates.originalPrice;
        delete updateData.originalPrice;
      }
      delete updateData.category; // Remove computed field
      
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (updatedProduct) => {
      console.log('Produit mis à jour avec succès, mise à jour du cache...');
      
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['products'], (oldData: Product[] = []) => {
        const transformedProduct = {
          ...updatedProduct,
          originalPrice: updatedProduct.original_price,
          category: ''
        } as Product;
        return oldData.map(product => 
          product.id === updatedProduct.id ? transformedProduct : product
        );
      });

      queryClient.invalidateQueries({ queryKey: ['products'] });
      
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
      
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['products'], (oldData: Product[] = []) => {
        return oldData.filter(product => product.id !== deletedId);
      });

      queryClient.invalidateQueries({ queryKey: ['products'] });
      
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
