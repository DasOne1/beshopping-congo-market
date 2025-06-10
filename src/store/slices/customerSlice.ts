
import { StateCreator } from 'zustand';
import { Customer } from '../types';
import { dataService } from '@/services/dataService';

export interface CustomerSlice {
  customers: Customer[];
  isLoadingCustomers: boolean;
  
  setCustomers: (customers: Customer[]) => void;
  setLoadingCustomers: (loading: boolean) => void;
  fetchCustomers: (force?: boolean) => Promise<void>;
  
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
}

export const createCustomerSlice: StateCreator<CustomerSlice> = (set, get) => ({
  customers: [],
  isLoadingCustomers: false,
  
  setCustomers: (customers) => set({ customers }),
  setLoadingCustomers: (loading) => set({ isLoadingCustomers: loading }),
  
  fetchCustomers: async (force = false) => {
    const state = get();
    if (!force && state.customers.length > 0) {
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
    } catch (error) {
      console.error('Error fetching customers:', error);
      set({ customers: [], isLoadingCustomers: false });
    }
  },
  
  addCustomer: (customer) => set((state) => ({
    customers: [customer, ...state.customers]
  })),
  
  updateCustomer: (id, updates) => set((state) => ({
    customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  
  removeCustomer: (id) => set((state) => ({
    customers: state.customers.filter(c => c.id !== id)
  })),
});
