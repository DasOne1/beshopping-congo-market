
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';

interface ConnectionState {
  isOnline: boolean;
  isReconnecting: boolean;
  lastSyncTime: number;
}

interface PerformanceMetrics {
  cacheHitRatio: number;
  averageLoadTime: number;
  totalRequests: number;
  cacheHits: number;
}

interface UIState {
  sidebarOpen: boolean;
  filtersOpen: boolean;
  currentPage: string;
  loadingStates: Record<string, boolean>;
  errors: Record<string, string | null>;
}

interface AppState {
  connection: ConnectionState;
  performance: PerformanceMetrics;
  ui: UIState;
  
  // Actions
  setOnlineStatus: (status: boolean) => void;
  setReconnecting: (status: boolean) => void;
  updateLastSync: () => void;
  recordCacheHit: () => void;
  recordRequest: (loadTime: number) => void;
  setLoading: (key: string, status: boolean) => void;
  setError: (key: string, error: string | null) => void;
  clearErrors: () => void;
}

export const useAppStore = create<AppState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        connection: {
          isOnline: navigator.onLine,
          isReconnecting: false,
          lastSyncTime: Date.now(),
        },
        performance: {
          cacheHitRatio: 0,
          averageLoadTime: 0,
          totalRequests: 0,
          cacheHits: 0,
        },
        ui: {
          sidebarOpen: false,
          filtersOpen: false,
          currentPage: '/',
          loadingStates: {},
          errors: {},
        },

        setOnlineStatus: (status) =>
          set((state) => ({
            connection: { ...state.connection, isOnline: status },
          })),

        setReconnecting: (status) =>
          set((state) => ({
            connection: { ...state.connection, isReconnecting: status },
          })),

        updateLastSync: () =>
          set((state) => ({
            connection: { ...state.connection, lastSyncTime: Date.now() },
          })),

        recordCacheHit: () =>
          set((state) => {
            const newCacheHits = state.performance.cacheHits + 1;
            return {
              performance: {
                ...state.performance,
                cacheHits: newCacheHits,
                cacheHitRatio: (newCacheHits / state.performance.totalRequests) * 100,
              },
            };
          }),

        recordRequest: (loadTime) =>
          set((state) => {
            const newTotalRequests = state.performance.totalRequests + 1;
            const newAverageLoadTime =
              (state.performance.averageLoadTime * state.performance.totalRequests + loadTime) /
              newTotalRequests;
            
            return {
              performance: {
                ...state.performance,
                totalRequests: newTotalRequests,
                averageLoadTime: newAverageLoadTime,
                cacheHitRatio: (state.performance.cacheHits / newTotalRequests) * 100,
              },
            };
          }),

        setLoading: (key, status) =>
          set((state) => ({
            ui: {
              ...state.ui,
              loadingStates: { ...state.ui.loadingStates, [key]: status },
            },
          })),

        setError: (key, error) =>
          set((state) => ({
            ui: {
              ...state.ui,
              errors: { ...state.ui.errors, [key]: error },
            },
          })),

        clearErrors: () =>
          set((state) => ({
            ui: { ...state.ui, errors: {} },
          })),
      }),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          connection: { lastSyncTime: state.connection.lastSyncTime },
          performance: state.performance,
          ui: {
            sidebarOpen: state.ui.sidebarOpen,
            currentPage: state.ui.currentPage,
          },
        }),
      }
    )
  )
);
