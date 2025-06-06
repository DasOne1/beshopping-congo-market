
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Export du type Product unifié
export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  tags: string[];
  original_price: number;
  discounted_price?: number;
  discount?: number;
  featured: boolean;
  popular?: number;
  status: 'active' | 'inactive' | 'draft';
  category_id: string;
  stock: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// Cache en mémoire pour éviter les requêtes redondantes
const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const getCachedData = (key: string): any | null => {
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any, ttl: number = 300000) => {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

export const useProducts = () => {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async (): Promise<Product[]> => {
      // Vérifier le cache mémoire d'abord
      const cachedProducts = getCachedData('products');
      if (cachedProducts) {
        console.log('Produits trouvés en cache');
        return cachedProducts;
      }

      console.log('Chargement des produits depuis la base de données...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors du chargement des produits:', error);
        throw error;
      }

      const formattedProducts = (data || []).map(product => ({
        ...product,
        tags: product.tags || [],
        images: product.images || [],
        description: product.description || '',
        category_id: product.category_id || '',
        stock: product.stock || 0,
        discount: product.discount || 0,
        popular: product.popular || 0,
        is_visible: product.is_visible ?? true,
        status: (product.status as 'active' | 'inactive' | 'draft') || 'active',
        created_at: product.created_at || new Date().toISOString(),
        updated_at: product.updated_at || new Date().toISOString()
      })) as Product[];

      // Mettre en cache pour 5 minutes
      setCachedData('products', formattedProducts, 300000);
      
      return formattedProducts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

  // Dériver les produits vedettes et populaires
  const featuredProducts = products.filter(product => product.featured);
  const popularProducts = products.filter(product => product.featured); // On utilise featured comme critère

  const createProduct = useMutation({
    mutationFn: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (newProduct) => {
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['products'], (oldData: Product[] = []) => {
        const formattedProduct = {
          ...newProduct,
          tags: newProduct.tags || [],
          images: newProduct.images || [],
          description: newProduct.description || '',
          category_id: newProduct.category_id || '',
          stock: newProduct.stock || 0,
          discount: newProduct.discount || 0,
          popular: newProduct.popular || 0,
          is_visible: newProduct.is_visible ?? true,
          status: (newProduct.status as 'active' | 'inactive' | 'draft') || 'active',
          created_at: newProduct.created_at || new Date().toISOString(),
          updated_at: newProduct.updated_at || new Date().toISOString()
        } as Product;
        
        const updatedProducts = [formattedProduct, ...oldData];
        setCachedData('products', updatedProducts, 300000);
        return updatedProducts;
      });
      
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la création du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le produit.",
        variant: "destructive",
      });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Product> & { id: string }) => {
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
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['products'], (oldData: Product[] = []) => {
        const formattedProduct = {
          ...updatedProduct,
          tags: updatedProduct.tags || [],
          images: updatedProduct.images || [],
          description: updatedProduct.description || '',
          category_id: updatedProduct.category_id || '',
          stock: updatedProduct.stock || 0,
          discount: updatedProduct.discount || 0,
          popular: updatedProduct.popular || 0,
          is_visible: updatedProduct.is_visible ?? true,
          status: (updatedProduct.status as 'active' | 'inactive' | 'draft') || 'active',
          created_at: updatedProduct.created_at || new Date().toISOString(),
          updated_at: updatedProduct.updated_at || new Date().toISOString()
        } as Product;
        
        const updatedProducts = oldData.map(product => 
          product.id === formattedProduct.id ? formattedProduct : product
        );
        setCachedData('products', updatedProducts, 300000);
        return updatedProducts;
      });
      
      toast({
        title: "Produit mis à jour",
        description: "Le produit a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le produit.",
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
      // Mise à jour optimiste du cache
      queryClient.setQueryData(['products'], (oldData: Product[] = []) => {
        const updatedProducts = oldData.filter(product => product.id !== deletedId);
        setCachedData('products', updatedProducts, 300000);
        return updatedProducts;
      });
      
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression du produit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit.",
        variant: "destructive",
      });
    },
  });

  // Fonction pour forcer le rechargement
  const forceRefresh = () => {
    memoryCache.delete('products');
    queryClient.invalidateQueries({ queryKey: ['products'] });
    refetch();
  };

  return {
    products,
    featuredProducts,
    popularProducts,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: forceRefresh,
  };
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async (): Promise<Product | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      
      return {
        ...data,
        tags: data.tags || [],
        images: data.images || [],
        description: data.description || '',
        category_id: data.category_id || '',
        stock: data.stock || 0,
        discount: data.discount || 0,
        popular: data.popular || 0,
        is_visible: data.is_visible ?? true,
        status: (data.status as 'active' | 'inactive' | 'draft') || 'active',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      } as Product;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
