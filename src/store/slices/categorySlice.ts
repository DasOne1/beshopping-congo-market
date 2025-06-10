
import { StateCreator } from 'zustand';
import { Category } from '../types';
import { dataService } from '@/services/dataService';

export interface CategorySlice {
  categories: Category[];
  isLoadingCategories: boolean;
  
  setCategories: (categories: Category[]) => void;
  setLoadingCategories: (loading: boolean) => void;
  fetchCategories: (force?: boolean) => Promise<void>;
  
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  removeCategory: (id: string) => void;
}

export const createCategorySlice: StateCreator<CategorySlice> = (set, get) => ({
  categories: [],
  isLoadingCategories: false,
  
  setCategories: (categories) => set({ categories }),
  setLoadingCategories: (loading) => set({ isLoadingCategories: loading }),
  
  fetchCategories: async (force = false) => {
    const state = get();
    if (!force && state.categories.length > 0) {
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
    } catch (error) {
      console.error('Error fetching categories:', error);
      set({ categories: [], isLoadingCategories: false });
    }
  },
  
  addCategory: (category) => set((state) => ({
    categories: [category, ...state.categories]
  })),
  
  updateCategory: (id, updates) => set((state) => ({
    categories: state.categories.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  
  removeCategory: (id) => set((state) => ({
    categories: state.categories.filter(c => c.id !== id)
  })),
});
