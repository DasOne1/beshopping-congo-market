
import { StateCreator } from 'zustand';
import { DashboardStats } from '../types';

export interface DashboardSlice {
  dashboardStats: DashboardStats | null;
  isLoadingStats: boolean;
  
  setDashboardStats: (stats: DashboardStats) => void;
  setLoadingStats: (loading: boolean) => void;
  fetchDashboardStats: (force?: boolean) => Promise<void>;
}

export const createDashboardSlice: StateCreator<
  DashboardSlice & { orders: any[]; products: any[]; customers: any[] }
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
      
      const orders = state.orders || [];
      const products = state.products || [];
      const customers = state.customers || [];
      
      const stats: DashboardStats = {
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customers.length,
        totalRevenue: orders
          .filter((o: any) => o.status === 'delivered')
          .reduce((sum: number, order: any) => sum + order.total_amount, 0),
        pendingOrders: orders.filter((o: any) => o.status === 'pending').length,
        activeOrders: orders.filter((o: any) => o.status === 'processing' || o.status === 'shipped').length,
        completedOrders: orders.filter((o: any) => o.status === 'delivered').length,
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
