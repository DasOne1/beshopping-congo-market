
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';

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

  // Fonction pour forcer le rafraîchissement uniquement si nécessaire
  const refreshProducts = async () => {
    console.log('Rafraîchissement forcé des produits...');
    // Vider le cache avant de refetch
    productsCache.delete(cacheKey);
    return refetch();
  };

  return {
    products,
    isLoading,
    error,
    refreshProducts,
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
