
import { StateCreator } from 'zustand';
import { Order } from '../types';
import { dataService } from '@/services/dataService';

export interface OrderSlice {
  orders: Order[];
  isLoadingOrders: boolean;
  
  setOrders: (orders: Order[]) => void;
  setLoadingOrders: (loading: boolean) => void;
  fetchOrders: (force?: boolean) => Promise<void>;
  
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  removeOrder: (id: string) => void;
}

export const createOrderSlice: StateCreator<OrderSlice> = (set, get) => ({
  orders: [],
  isLoadingOrders: false,
  
  setOrders: (orders) => set({ orders }),
  setLoadingOrders: (loading) => set({ isLoadingOrders: loading }),
  
  fetchOrders: async (force = false) => {
    const state = get();
    if (!force && state.orders.length > 0) {
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
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ isLoadingOrders: false });
    }
  },
  
  addOrder: (order) => set((state) => ({
    orders: [order, ...state.orders]
  })),
  
  updateOrder: (id, updates) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, ...updates } : o)
  })),
  
  removeOrder: (id) => set((state) => ({
    orders: state.orders.filter(o => o.id !== id)
  })),
});
