
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Export du type Product
export interface Product {
  id: string;
  name: string;
  description?: string;
  images: string[];
  tags: string[];
  original_price: number;
  discounted_price?: number;
  featured: boolean;
  status: 'active' | 'inactive' | 'draft';
  category_id?: string;
  stock: number;
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
        created_at: product.created_at || new Date().toISOString(),
        updated_at: product.updated_at || new Date().toISOString()
      }));

      // Mettre en cache pour 5 minutes
      setCachedData('products', formattedProducts, 300000);
      
      return formattedProducts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    throwOnError: false,
  });

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
        const updatedProducts = [newProduct, ...oldData];
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
        const updatedProducts = oldData.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
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
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
