
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Cache local optimisé pour les produits
const productsCache = new Map<string, { data: Product[]; timestamp: number; etag?: string }>();

const getCachedProducts = (key: string): Product[] | null => {
  const cached = productsCache.get(key);
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
    return cached.data;
  }
  return null;
};

const setCachedProducts = (key: string, data: Product[], etag?: string) => {
  productsCache.set(key, {
    data,
    timestamp: Date.now(),
    etag
  });
};

export const useProducts = (filters?: {
  category?: string;
  featured?: boolean;
  status?: string;
  search?: string;
}) => {
  const queryClient = useQueryClient();
  const cacheKey = `products-${JSON.stringify(filters || {})}`;

  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      // Vérifier le cache local d'abord
      const cachedProducts = getCachedProducts(cacheKey);
      if (cachedProducts) {
        console.log('Produits trouvés en cache local');
        return cachedProducts;
      }

      console.log('Chargement des produits depuis Supabase...');
      
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          images,
          tags,
          original_price,
          discounted_price,
          category_id,
          stock,
          featured,
          status,
          created_at,
          updated_at,
          categories!inner(
            id,
            name,
            slug
          )
        `);

      // Application des filtres de manière optimisée
      if (filters?.category) {
        query = query.eq('categories.slug', filters.category);
      }
      
      if (filters?.featured) {
        query = query.eq('featured', true);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      } else {
        // Par défaut, charger seulement les produits actifs pour améliorer les performances
        query = query.eq('status', 'active');
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      // Limitation et tri optimisés
      query = query
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50); // Limiter le nombre de produits pour améliorer les performances

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors du chargement des produits:', error);
        throw error;
      }

      const formattedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images || [],
        tags: product.tags || [],
        original_price: product.original_price,
        discounted_price: product.discounted_price,
        category_id: product.category_id,
        stock: product.stock || 0,
        featured: product.featured || false,
        status: product.status as 'active' | 'inactive',
        created_at: product.created_at,
        updated_at: product.updated_at,
        category: product.categories ? {
          id: product.categories.id,
          name: product.categories.name,
          slug: product.categories.slug
        } : undefined
      }));

      // Mettre en cache les produits
      setCachedProducts(cacheKey, formattedProducts);
      
      console.log(`${formattedProducts.length} produits chargés et mis en cache`);
      return formattedProducts;
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Éviter le refetch automatique
    throwOnError: false,
  });

  // Produits vedettes
  const featuredProducts = products.filter(p => p.featured && p.status === 'active');
  
  // Produits populaires (basé sur le stock disponible pour simuler la popularité)
  const popularProducts = products
    .filter(p => p.status === 'active' && p.stock > 0)
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 8);

  // Fonction pour forcer le rafraîchissement uniquement si nécessaire
  const refreshProducts = async () => {
    console.log('Rafraîchissement forcé des produits...');
    // Vider le cache avant de refetch
    productsCache.delete(cacheKey);
    return refetch();
  };

  // Mutation pour créer un produit
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
        return [newProduct, ...oldData];
      });
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

  // Mutation pour mettre à jour un produit
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
        return oldData.map(product => 
          product.id === updatedProduct.id ? updatedProduct : product
        );
      });
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

  // Mutation pour supprimer un produit
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
        return oldData.filter(product => product.id !== deletedId);
      });
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
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

// Hook spécialisé pour un seul produit avec cache optimisé
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(
            id,
            name,
            slug
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
