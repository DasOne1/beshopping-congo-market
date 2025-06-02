
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useAppStore } from '@/stores/appStore';
import { db } from '@/services/offlineStorage';
import { Product } from '@/types';

const PRODUCTS_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const FEATURED_PRODUCTS_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

export const useOptimizedProducts = () => {
  const queryClient = useQueryClient();
  const { recordCacheHit, recordRequest, setLoading, setError } = useAppStore();

  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products-optimized'],
    queryFn: async (): Promise<Product[]> => {
      const startTime = Date.now();
      setLoading('products', true);
      setError('products', null);

      try {
        // Try to get from IndexedDB first
        const cachedProducts = await db.getCachedData<Product[]>('products', 'all');
        
        if (cachedProducts && navigator.onLine) {
          console.log('📦 Using cached products');
          recordCacheHit();
          
          // Return cached data immediately, then fetch fresh data in background
          setTimeout(() => fetchAndCacheProducts(), 100);
          return cachedProducts;
        }

        // Fetch fresh data
        return await fetchAndCacheProducts();
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('products', 'Erreur lors du chargement des produits');
        
        // Try to return cached data as fallback
        const cachedProducts = await db.getCachedData<Product[]>('products', 'all');
        return cachedProducts || [];
      } finally {
        const loadTime = Date.now() - startTime;
        recordRequest(loadTime);
        setLoading('products', false);
      }
    },
    staleTime: PRODUCTS_CACHE_TIME,
    gcTime: PRODUCTS_CACHE_TIME * 2,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry if offline
      if (!navigator.onLine) return false;
      return failureCount < 2;
    },
  });

  const fetchAndCacheProducts = async (): Promise<Product[]> => {
    console.log('🌐 Fetching fresh products from API');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    const formattedProducts = (data || []).map(product => ({
      ...product,
      tags: product.tags || [],
      images: product.images || [],
      description: product.description || '',
      category_id: product.category_id || '',
      stock: product.stock || 0,
      discount: product.discount || 0,
      popular: product.popular || 0,
      status: (product.status as 'active' | 'inactive' | 'draft') || 'active',
      created_at: product.created_at || new Date().toISOString(),
      updated_at: product.updated_at || new Date().toISOString()
    })) as Product[];

    // Cache in IndexedDB
    await db.setCachedData('products', 'all', formattedProducts, PRODUCTS_CACHE_TIME);
    
    // Log performance
    await db.logPerformance('api_call', {
      endpoint: 'products',
      count: formattedProducts.length,
      timestamp: Date.now(),
    });

    return formattedProducts;
  };

  // Optimized featured products with separate cache
  const featuredProducts = useQuery({
    queryKey: ['products-featured'],
    queryFn: async (): Promise<Product[]> => {
      // Try cache first
      const cached = await db.getCachedData<Product[]>('products', 'featured');
      if (cached) {
        recordCacheHit();
        return cached;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('status', 'active')
        .limit(6);
      
      if (error) throw error;
      
      const formatted = data?.map(product => ({
        ...product,
        tags: product.tags || [],
        images: product.images || [],
      })) as Product[] || [];

      await db.setCachedData('products', 'featured', formatted, FEATURED_PRODUCTS_CACHE_TIME);
      return formatted;
    },
    staleTime: FEATURED_PRODUCTS_CACHE_TIME,
    gcTime: FEATURED_PRODUCTS_CACHE_TIME * 2,
    enabled: !isLoading, // Only fetch after main products are loaded
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
    onMutate: async (newProduct) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['products-optimized'] });
      
      const previousProducts = queryClient.getQueryData(['products-optimized']);
      
      queryClient.setQueryData(['products-optimized'], (old: Product[] = []) => [
        {
          ...newProduct,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Product,
        ...old,
      ]);

      return { previousProducts };
    },
    onError: (err, newProduct, context) => {
      queryClient.setQueryData(['products-optimized'], context?.previousProducts);
      toast({
        title: "Erreur",
        description: "Impossible de créer le produit.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products-optimized'] });
      toast({
        title: "Produit créé",
        description: "Le produit a été créé avec succès.",
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
    onMutate: async ({ id, ...updates }) => {
      await queryClient.cancelQueries({ queryKey: ['products-optimized'] });
      
      const previousProducts = queryClient.getQueryData(['products-optimized']);
      
      queryClient.setQueryData(['products-optimized'], (old: Product[] = []) =>
        old.map(product => 
          product.id === id ? { ...product, ...updates } : product
        )
      );

      return { previousProducts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['products-optimized'], context?.previousProducts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products-optimized'] });
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
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ['products-optimized'] });
      
      const previousProducts = queryClient.getQueryData(['products-optimized']);
      
      queryClient.setQueryData(['products-optimized'], (old: Product[] = []) =>
        old.filter(product => product.id !== deletedId)
      );

      return { previousProducts };
    },
    onError: (err, deletedId, context) => {
      queryClient.setQueryData(['products-optimized'], context?.previousProducts);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products-optimized'] });
    },
  });

  return {
    products,
    featuredProducts: featuredProducts.data || [],
    isLoading: isLoading || featuredProducts.isLoading,
    error: error || featuredProducts.error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch,
  };
};
