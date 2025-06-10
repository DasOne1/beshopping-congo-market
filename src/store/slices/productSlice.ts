
import { StateCreator } from 'zustand';
import { Product } from '../types';
import { dataService } from '@/services/dataService';

export interface ProductSlice {
  products: Product[];
  isLoadingProducts: boolean;
  
  setProducts: (products: Product[]) => void;
  setLoadingProducts: (loading: boolean) => void;
  fetchProducts: (force?: boolean) => Promise<void>;
  
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
}

export const createProductSlice: StateCreator<ProductSlice> = (set, get) => ({
  products: [],
  isLoadingProducts: false,
  
  setProducts: (products) => set({ products }),
  setLoadingProducts: (loading) => set({ isLoadingProducts: loading }),
  
  fetchProducts: async (force = false) => {
    const state = get();
    if (!force && state.products.length > 0) {
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
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ isLoadingProducts: false });
    }
  },
  
  addProduct: (product) => set((state) => ({
    products: [product, ...state.products]
  })),
  
  updateProduct: (id, updates) => set((state) => ({
    products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  
  removeProduct: (id) => set((state) => ({
    products: state.products.filter(p => p.id !== id)
  })),
});
