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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des produits:', error);
        // Retourner un tableau vide au lieu de lancer une erreur pour permettre l'affichage progressif
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
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
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
  });

  const { data: popularProducts = [] } = useQuery({
    queryKey: ['products', 'popular'],
    queryFn: async () => {
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
  });

  const createProduct = useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès",
      });
    },
    onError: (error: any) => {
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
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
