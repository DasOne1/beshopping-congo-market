
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { dataService } from '@/services/dataService';

interface Product {
  id: string;
  name: string;
  images: string[];
  original_price: number;
  discounted_price?: number;
  category_id: string;
  description?: string;
  stock: number;
  status: string;
  featured?: boolean;
  tags?: string[];
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  order_number?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  total_amount: number;
  status: string;
  created_at?: string;
  order_items?: any[];
}

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  total_spent?: number;
  orders_count?: number;
  created_at: string;
}

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
}

interface GlobalState {
  // Data
  products: Product[];
  categories: Category[];
  orders: Order[];
  customers: Customer[];
  dashboardStats: DashboardStats | null;
  
  // Loading states
  isLoadingProducts: boolean;
  isLoadingCategories: boolean;
  isLoadingOrders: boolean;
  isLoadingCustomers: boolean;
  isLoadingStats: boolean;
  
  // Cache metadata
  lastUpdated: {
    products: number;
    categories: number;
    orders: number;
    customers: number;
    stats: number;
  };
  
  // Actions
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setOrders: (orders: Order[]) => void;
  setCustomers: (customers: Customer[]) => void;
  setDashboardStats: (stats: DashboardStats) => void;
  
  // Loading actions
  setLoadingProducts: (loading: boolean) => void;
  setLoadingCategories: (loading: boolean) => void;
  setLoadingOrders: (loading: boolean) => void;
  setLoadingCustomers: (loading: boolean) => void;
  setLoadingStats: (loading: boolean) => void;
  
  // Cache management
  updateLastUpdated: (key: keyof GlobalState['lastUpdated']) => void;
  isDataFresh: (key: keyof GlobalState['lastUpdated'], maxAge?: number) => boolean;
  
  // Data fetching with cache
  fetchProducts: (force?: boolean) => Promise<void>;
  fetchCategories: (force?: boolean) => Promise<void>;
  fetchOrders: (force?: boolean) => Promise<void>;
  fetchCustomers: (force?: boolean) => Promise<void>;
  fetchDashboardStats: (force?: boolean) => Promise<void>;
  
  // Optimistic updates
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  removeCategory: (id: string) => void;
  
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  removeOrder: (id: string) => void;
  
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  
  // Actions optimisées
  preloadAllData: () => Promise<void>;
  refreshData: (force?: boolean) => Promise<void>;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      categories: [],
      orders: [],
      customers: [],
      dashboardStats: null,
      
      isLoadingProducts: false,
      isLoadingCategories: false,
      isLoadingOrders: false,
      isLoadingCustomers: false,
      isLoadingStats: false,
      
      lastUpdated: {
        products: 0,
        categories: 0,
        orders: 0,
        customers: 0,
        stats: 0,
      },
      
      // Basic setters
      setProducts: (products) => set({ products }),
      setCategories: (categories) => set({ categories }),
      setOrders: (orders) => set({ orders }),
      setCustomers: (customers) => set({ customers }),
      setDashboardStats: (stats) => set({ dashboardStats: stats }),
      
      setLoadingProducts: (loading) => set({ isLoadingProducts: loading }),
      setLoadingCategories: (loading) => set({ isLoadingCategories: loading }),
      setLoadingOrders: (loading) => set({ isLoadingOrders: loading }),
      setLoadingCustomers: (loading) => set({ isLoadingCustomers: loading }),
      setLoadingStats: (loading) => set({ isLoadingStats: loading }),
      
      // Cache management
      updateLastUpdated: (key) => set((state) => ({
        lastUpdated: { ...state.lastUpdated, [key]: Date.now() }
      })),
      
      isDataFresh: (key, maxAge = CACHE_DURATION) => {
        const lastUpdated = get().lastUpdated[key];
        return Date.now() - lastUpdated < maxAge;
      },
      
      // Optimized data fetching
      fetchProducts: async (force = false) => {
        const state = get();
        if (!force && state.products.length > 0 && state.isDataFresh('products')) {
          return;
        }
        
        if (state.isLoadingProducts) return;
        
        try {
          set({ isLoadingProducts: true });
          const products = await dataService.getProducts(!force);
          
          set({ 
            products: products || [], 
            isLoadingProducts: false
          });
          get().updateLastUpdated('products');
        } catch (error) {
          console.error('Error fetching products:', error);
          set({ isLoadingProducts: false });
        }
      },
      
      fetchCategories: async (force = false) => {
        const state = get();
        if (!force && state.categories.length > 0 && state.isDataFresh('categories')) {
          return;
        }
        
        if (state.isLoadingCategories) return;
        
        try {
          set({ isLoadingCategories: true });
          const categories = await dataService.getCategories(!force);
          
          set({ 
            categories: categories || [], 
            isLoadingCategories: false
          });
          get().updateLastUpdated('categories');
        } catch (error) {
          console.error('Error fetching categories:', error);
          set({ isLoadingCategories: false });
        }
      },
      
      fetchOrders: async (force = false) => {
        const state = get();
        if (!force && state.orders.length > 0 && state.isDataFresh('orders')) {
          return;
        }
        
        if (state.isLoadingOrders) return;
        
        try {
          set({ isLoadingOrders: true });
          const orders = await dataService.getOrders(!force);
          
          set({ 
            orders: orders || [], 
            isLoadingOrders: false
          });
          get().updateLastUpdated('orders');
        } catch (error) {
          console.error('Error fetching orders:', error);
          set({ isLoadingOrders: false });
        }
      },
      
      fetchCustomers: async (force = false) => {
        const state = get();
        if (!force && state.customers.length > 0 && state.isDataFresh('customers')) {
          return;
        }
        
        if (state.isLoadingCustomers) return;
        
        try {
          set({ isLoadingCustomers: true });
          const customers = await dataService.getCustomers(!force);
          
          set({ 
            customers: customers || [], 
            isLoadingCustomers: false
          });
          get().updateLastUpdated('customers');
        } catch (error) {
          console.error('Error fetching customers:', error);
          set({ isLoadingCustomers: false });
        }
      },
      
      fetchDashboardStats: async (force = false) => {
        const state = get();
        if (!force && state.dashboardStats && state.isDataFresh('stats')) {
          return;
        }
        
        if (state.isLoadingStats) return;
        
        try {
          set({ isLoadingStats: true });
          
          const orders = state.orders.length > 0 ? state.orders : [];
          const products = state.products.length > 0 ? state.products : [];
          const customers = state.customers.length > 0 ? state.customers : [];
          
          const stats: DashboardStats = {
            totalOrders: orders.length,
            totalProducts: products.length,
            totalCustomers: customers.length,
            totalRevenue: orders
              .filter(o => o.status === 'delivered')
              .reduce((sum, order) => sum + order.total_amount, 0),
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            activeOrders: orders.filter(o => o.status === 'processing' || o.status === 'shipped').length,
            completedOrders: orders.filter(o => o.status === 'delivered').length,
          };
          
          set({ 
            dashboardStats: stats, 
            isLoadingStats: false
          });
          get().updateLastUpdated('stats');
        } catch (error) {
          console.error('Error calculating stats:', error);
          set({ isLoadingStats: false });
        }
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
          const result = await dataService.preloadAllData();
          
          await Promise.all([
            get().fetchCategories(true),
            get().fetchProducts(true),
            get().fetchOrders(true),
            get().fetchCustomers(true),
            get().fetchDashboardStats(true),
          ]);
          
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
          get().fetchDashboardStats(force),
        ]);
      },
      
      // Optimistic updates
      addProduct: (product) => set((state) => ({
        products: [product, ...state.products]
      })),
      
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      
      removeProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      
      addCategory: (category) => set((state) => ({
        categories: [category, ...state.categories]
      })),
      
      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      
      removeCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      })),
      
      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
      })),
      
      updateOrder: (id, updates) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, ...updates } : o)
      })),
      
      removeOrder: (id) => set((state) => ({
        orders: state.orders.filter(o => o.id !== id)
      })),
      
      addCustomer: (customer) => set((state) => ({
        customers: [customer, ...state.customers]
      })),
      
      updateCustomer: (id, updates) => set((state) => ({
        customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
      
      removeCustomer: (id) => set((state) => ({
        customers: state.customers.filter(c => c.id !== id)
      })),
    }),
    {
      name: 'beshopping-store-v2',
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
