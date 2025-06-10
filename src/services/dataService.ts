
import { supabase } from '@/integrations/supabase/client';
import { getCachedData, setCachedData, safeAsync } from '@/utils/cleanupUtils';

// Service centralisé pour toutes les opérations de données
export class DataService {
  private static instance: DataService;
  
  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Récupération optimisée des produits
  async getProducts(useCache = true) {
    const cacheKey = 'products';
    
    if (useCache) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    return safeAsync(
      async () => {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setCachedData(cacheKey, data || []);
        return data || [];
      },
      [],
      'Erreur lors du chargement des produits'
    );
  }

  // Récupération optimisée des catégories
  async getCategories(useCache = true) {
    const cacheKey = 'categories';
    
    if (useCache) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    return safeAsync(
      async () => {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true });
          
        if (error) throw error;
        
        setCachedData(cacheKey, data || []);
        return data || [];
      },
      [],
      'Erreur lors du chargement des catégories'
    );
  }

  // Récupération optimisée des commandes
  async getOrders(useCache = true) {
    const cacheKey = 'orders';
    
    if (useCache) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    return safeAsync(
      async () => {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items(*)
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setCachedData(cacheKey, data || []);
        return data || [];
      },
      [],
      'Erreur lors du chargement des commandes'
    );
  }

  // Récupération optimisée des clients
  async getCustomers(useCache = true) {
    const cacheKey = 'customers';
    
    if (useCache) {
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
    }

    return safeAsync(
      async () => {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setCachedData(cacheKey, data || []);
        return data || [];
      },
      [],
      'Erreur lors du chargement des clients'
    );
  }

  // Invalidation sélective du cache
  invalidateCache(keys: string[]) {
    keys.forEach(key => {
      setCachedData(key, null, 0);
    });
  }

  // Préchargement intelligent de toutes les données
  async preloadAllData() {
    const promises = [
      this.getCategories(false),
      this.getProducts(false),
      this.getOrders(false),
      this.getCustomers(false),
    ];

    const results = await Promise.allSettled(promises);
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    
    console.log(`✅ Préchargement terminé: ${successCount}/${promises.length} réussi`);
    
    return {
      success: successCount === promises.length,
      loaded: successCount,
      total: promises.length,
    };
  }
}

export const dataService = DataService.getInstance();
