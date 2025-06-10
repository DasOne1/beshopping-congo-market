
import { StateCreator } from 'zustand';
import { DashboardStats, Order, Product, Customer } from '../types';

export interface DashboardSlice {
  dashboardStats: DashboardStats | null;
  isLoadingStats: boolean;
  
  setDashboardStats: (stats: DashboardStats) => void;
  setLoadingStats: (loading: boolean) => void;
  fetchDashboardStats: (force?: boolean) => Promise<void>;
}

export const createDashboardSlice: StateCreator<
  DashboardSlice,
  [],
  [],
  DashboardSlice
> = (set, get) => ({
  dashboardStats: null,
  isLoadingStats: false,
  
  setDashboardStats: (stats) => set({ dashboardStats: stats }),
  setLoadingStats: (loading) => set({ isLoadingStats: loading }),
  
  fetchDashboardStats: async (force = false) => {
    const state = get();
    if (!force && state.dashboardStats) {
      return;
    }
    
    if (state.isLoadingStats) return;
    
    try {
      set({ isLoadingStats: true });
      
      // On va récupérer les données depuis le store global
      // Cette fonction sera appelée après que les autres données soient chargées
      const globalState = get() as any;
      const orders: Order[] = globalState.orders || [];
      const products: Product[] = globalState.products || [];
      const customers: Customer[] = globalState.customers || [];
      
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      
      const stats: DashboardStats = {
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalRevenue: orders
          .filter((o: Order) => o.status === 'delivered')
          .reduce((sum: number, order: Order) => sum + order.total_amount, 0),
        pendingOrders: orders.filter((o: Order) => o.status === 'pending').length,
        activeOrders: orders.filter((o: Order) => o.status === 'processing' || o.status === 'shipped').length,
        completedOrders: orders.filter((o: Order) => o.status === 'delivered').length,
        processingOrders: orders.filter((o: Order) => o.status === 'processing').length,
        todayOrders: orders.filter((o: Order) => {
          const orderDate = new Date(o.created_at || '');
          return orderDate.toDateString() === today.toDateString();
        }).length,
        monthlyOrders: orders.filter((o: Order) => {
          const orderDate = new Date(o.created_at || '');
          return orderDate >= startOfMonth;
        }).length,
        yearlyOrders: orders.filter((o: Order) => {
          const orderDate = new Date(o.created_at || '');
          return orderDate >= startOfYear;
        }).length,
      };
      
      set({ 
        dashboardStats: stats, 
        isLoadingStats: false
      });
    } catch (error) {
      console.error('Error calculating stats:', error);
      set({ isLoadingStats: false });
    }
  },
});
