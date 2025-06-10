
import { useEffect, useCallback } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';

// Hook pour les produits avec cache intelligent
export const useOptimizedProducts = (forceRefresh = false) => {
  const { 
    products, 
    isLoadingProducts, 
    fetchProducts 
  } = useGlobalStore();

  useEffect(() => {
    fetchProducts(forceRefresh);
  }, [fetchProducts, forceRefresh]);

  const refetch = useCallback(() => {
    fetchProducts(true);
  }, [fetchProducts]);

  return {
    products,
    isLoading: isLoadingProducts,
    refetch,
  };
};

// Hook pour les catégories avec cache intelligent
export const useOptimizedCategories = (forceRefresh = false) => {
  const { 
    categories, 
    isLoadingCategories, 
    fetchCategories 
  } = useGlobalStore();

  useEffect(() => {
    fetchCategories(forceRefresh);
  }, [fetchCategories, forceRefresh]);

  const refetch = useCallback(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  return {
    categories,
    isLoading: isLoadingCategories,
    refetch,
  };
};

// Hook pour les commandes avec cache intelligent
export const useOptimizedOrders = (forceRefresh = false) => {
  const { 
    orders, 
    isLoadingOrders, 
    fetchOrders 
  } = useGlobalStore();

  useEffect(() => {
    fetchOrders(forceRefresh);
  }, [fetchOrders, forceRefresh]);

  const refetch = useCallback(() => {
    fetchOrders(true);
  }, [fetchOrders]);

  return {
    orders,
    isLoading: isLoadingOrders,
    refetch,
  };
};

// Hook pour les clients avec cache intelligent
export const useOptimizedCustomers = (forceRefresh = false) => {
  const { 
    customers, 
    isLoadingCustomers, 
    fetchCustomers 
  } = useGlobalStore();

  useEffect(() => {
    fetchCustomers(forceRefresh);
  }, [fetchCustomers, forceRefresh]);

  const refetch = useCallback(() => {
    fetchCustomers(true);
  }, [fetchCustomers]);

  return {
    customers,
    isLoading: isLoadingCustomers,
    refetch,
  };
};

// Hook pour les statistiques du dashboard
export const useOptimizedDashboard = (forceRefresh = false) => {
  const { 
    dashboardStats, 
    isLoadingStats, 
    fetchDashboardStats 
  } = useGlobalStore();

  useEffect(() => {
    fetchDashboardStats(forceRefresh);
  }, [fetchDashboardStats, forceRefresh]);

  const refetch = useCallback(() => {
    fetchDashboardStats(true);
  }, [fetchDashboardStats]);

  return {
    stats: dashboardStats,
    isLoading: isLoadingStats,
    refetch,
  };
};

// Hook pour la préparation des données au démarrage
export const useDataPreloader = () => {
  const { 
    fetchProducts, 
    fetchCategories, 
    fetchOrders, 
    fetchCustomers, 
    fetchDashboardStats 
  } = useGlobalStore();

  const preloadAllData = useCallback(async () => {
    console.log('🚀 Préchargement de toutes les données...');
    
    // Préchargement en parallèle de toutes les données critiques
    await Promise.allSettled([
      fetchCategories(),
      fetchProducts(),
      fetchOrders(),
      fetchCustomers(),
      fetchDashboardStats(),
    ]);
    
    console.log('✅ Préchargement terminé');
  }, [fetchProducts, fetchCategories, fetchOrders, fetchCustomers, fetchDashboardStats]);

  return { preloadAllData };
};
