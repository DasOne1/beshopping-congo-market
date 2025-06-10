
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { dataService } from '@/services/dataService';

import { ProductSlice, createProductSlice } from './slices/productSlice';
import { CategorySlice, createCategorySlice } from './slices/categorySlice';
import { OrderSlice, createOrderSlice } from './slices/orderSlice';
import { CustomerSlice, createCustomerSlice } from './slices/customerSlice';
import { DashboardSlice, createDashboardSlice } from './slices/dashboardSlice';

interface GlobalState extends 
  ProductSlice, 
  CategorySlice, 
  OrderSlice, 
  CustomerSlice, 
  DashboardSlice {
  
  // Cache metadata
  lastUpdated: {
    products: number;
    categories: number;
    orders: number;
    customers: number;
    stats: number;
  };
  
  // Cache management
  updateLastUpdated: (key: keyof GlobalState['lastUpdated']) => void;
  isDataFresh: (key: keyof GlobalState['lastUpdated'], maxAge?: number) => boolean;
  
  // Actions optimisées
  preloadAllData: () => Promise<void>;
  refreshData: (force?: boolean) => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // Slices avec le bon nombre d'arguments
      ...createProductSlice(set, get, { name: 'products' } as any),
      ...createCategorySlice(set, get, { name: 'categories' } as any),
      ...createOrderSlice(set, get, { name: 'orders' } as any),
      ...createCustomerSlice(set, get, { name: 'customers' } as any),
      ...createDashboardSlice(set, get, { name: 'dashboard' } as any),
      
      // Cache metadata
      lastUpdated: {
        products: 0,
        categories: 0,
        orders: 0,
        customers: 0,
        stats: 0,
      },
      
      // Cache management
      updateLastUpdated: (key) => set((state) => ({
        lastUpdated: { ...state.lastUpdated, [key]: Date.now() }
      })),
      
      isDataFresh: (key, maxAge = CACHE_DURATION) => {
        const lastUpdated = get().lastUpdated[key];
        return Date.now() - lastUpdated < maxAge;
      },
      
      // Préchargement optimisé
      preloadAllData: async () => {
        const state = get();
        if (state.isLoadingProducts || state.isLoadingCategories || 
            state.isLoadingOrders || state.isLoadingCustomers) {
          return;
        }
        
        try {
          console.log('🚀 Préchargement avec service centralisé...');
          await dataService.preloadAllData();
          
          await Promise.all([
            get().fetchCategories(true),
            get().fetchProducts(true),
            get().fetchOrders(true),
            get().fetchCustomers(true),
          ]);
          
          // Calculer les stats après avoir chargé les données
          await get().fetchDashboardStats(true);
          
          console.log('✅ Préchargement terminé avec succès');
        } catch (error) {
          console.error('Erreur lors du préchargement:', error);
        }
      },
      
      // Actualisation forcée de toutes les données
      refreshData: async (force = true) => {
        await Promise.all([
          get().fetchCategories(force),
          get().fetchProducts(force),
          get().fetchOrders(force),
          get().fetchCustomers(force),
        ]);
        await get().fetchDashboardStats(force);
      },
    }),
    {
      name: 'beshopping-store-v3',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
        orders: state.orders,
        customers: state.customers,
        dashboardStats: state.dashboardStats,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
