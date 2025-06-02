/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useDataPreloader } from '@/hooks/useDataPreloader';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { db } from '@/services/offlineStorage';
import SplashScreen from '@/components/SplashScreen';
import UserLayout from '@/components/UserLayout';
import PerformanceIndicator from '@/components/PerformanceIndicator';
import OptimizedSkeleton from '@/components/OptimizedSkeleton';

// Lazy load pages for better performance
const Index = lazy(() => import('@/pages/Index'));
const Products = lazy(() => import('@/pages/Products'));
const ProductDetails = lazy(() => import('@/pages/ProductDetails'));
const PublicCategories = lazy(() => import('@/pages/Categories'));
const Cart = lazy(() => import('@/pages/Cart'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const CustomOrder = lazy(() => import('@/pages/CustomOrder'));
const Contact = lazy(() => import('@/pages/Contact'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));
const Account = lazy(() => import('@/pages/Account'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin Pages - Lazy loaded
const AdminAuth = lazy(() => import('@/components/AdminAuth'));
const AdminAuthPage = lazy(() => import('@/pages/Admin/AdminAuth'));
const Dashboard = lazy(() => import('@/pages/Admin/Dashboard'));
const Orders = lazy(() => import('@/pages/Admin/Orders'));
const AdminProducts = lazy(() => import('@/pages/Admin/Products'));
const ProductForm = lazy(() => import('@/pages/Admin/ProductForm'));
const AdminCategories = lazy(() => import('@/pages/Admin/Categories'));
const CategoryForm = lazy(() => import('@/pages/Admin/CategoryForm'));
const Catalog = lazy(() => import('@/pages/Admin/Catalog'));
const Customers = lazy(() => import('@/pages/Admin/Customers'));
const Analytics = lazy(() => import('@/pages/Admin/Analytics'));
const AdminAccounts = lazy(() => import('@/pages/Admin/AdminAccounts'));
const Settings = lazy(() => import('@/pages/Admin/Settings'));

// Enhanced QueryClient with persistence and offline support
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry if offline
        if (!navigator.onLine) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst'
    },
    mutations: {
      networkMode: 'offlineFirst',
      retry: (failureCount, error) => {
        if (!navigator.onLine) return false;
        return failureCount < 1;
      }
    }
  }
});

// Simple persistence using localStorage
const persistQueryClient = () => {
  const cacheKey = 'react-query-cache';
  
  // Save cache on page unload
  window.addEventListener('beforeunload', () => {
    const cache = queryClient.getQueryCache().getAll();
    localStorage.setItem(cacheKey, JSON.stringify(cache.map(query => ({
      queryKey: query.queryKey,
      state: query.state
    }))));
  });

  // Restore cache on load
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      const parsedCache = JSON.parse(cachedData);
      parsedCache.forEach((item: any) => {
        queryClient.setQueryData(item.queryKey, item.state.data);
      });
    }
  } catch (error) {
    console.error('Failed to restore cache:', error);
  }
};

function AppContent() {
  const { isLoading } = useDataPreloader();
  
  // Activate optimization hooks
  useRealtimeSync();
  useNetworkStatus();
  usePerformanceMonitor();

  // Initialize cache persistence
  useEffect(() => {
    persistQueryClient();
  }, []);

  // Clean up expired cache periodically
  useEffect(() => {
    const cleanup = async () => {
      try {
        await db.clearExpiredCache();
      } catch (error) {
        console.error('Cache cleanup error:', error);
      }
    };

    // Clean up on mount and every 5 minutes
    cleanup();
    const interval = setInterval(cleanup, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return <SplashScreen onComplete={() => {}} />;
  }

  const PageFallback = () => (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <OptimizedSkeleton type="grid" count={8} />
      </div>
    </UserLayout>
  );

  const AdminFallback = () => (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <OptimizedSkeleton type="list" />
      </div>
    </div>
  );

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <Suspense fallback={<PageFallback />}>
            <UserLayout><Index /></UserLayout>
          </Suspense>
        } />
        <Route path="/products" element={
          <Suspense fallback={<PageFallback />}>
            <UserLayout><Products /></UserLayout>
          </Suspense>
        } />
        <Route path="/product/:id" element={
          <Suspense fallback={<PageFallback />}>
            <UserLayout><ProductDetails /></UserLayout>
          </Suspense>
        } />
        <Route path="/categories" element={
          <Suspense fallback={<PageFallback />}>
            <UserLayout><PublicCategories /></UserLayout>
          </Suspense>
        } />
        <Route path="/cart" element={
          <Suspense fallback={<PageFallback />}>
            <UserLayout><Cart /></UserLayout>
          </Suspense>
        } />
        <Route path="/favorites" element={
          <Suspense fallback={<PageFallback />}>
            <UserLayout><Favorites /></UserLayout>
          </Suspense>
        } />
        <Route path="/custom-order" element={
          <Suspense fallback={<PageFallback />}>
            <UserLayout><CustomOrder /></UserLayout>
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<PageFallback />}>
            <UserLayout><Contact /></UserLayout>
          </Suspense>
        } />
        <Route path="/about" element={
          <Suspense fallback={<PageFallback />}>
            <UserLayout><AboutUs /></UserLayout>
          </Suspense>
        } />
        <Route path="/account" element={
          <Suspense fallback={<PageFallback />}>
            <UserLayout><Account /></UserLayout>
          </Suspense>
        } />

        {/* Admin Routes */}
        <Route path="/dasgabriel@adminaccess" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuthPage />
          </Suspense>
        } />
        
        <Route path="/dasgabriel@adminaccess/dashboard" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><Dashboard /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/orders" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><Orders /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/products" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><AdminProducts /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/products/new" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><ProductForm /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/products/edit/:id" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><ProductForm /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/categories" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><AdminCategories /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/categories/new" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><CategoryForm /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/categories/edit/:id" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><CategoryForm /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/catalog" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><Catalog /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/customers" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><Customers /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/analytics" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><Analytics /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/admin-accounts" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><AdminAccounts /></AdminAuth>
          </Suspense>
        } />
        <Route path="/dasgabriel@adminaccess/settings" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminAuth><Settings /></AdminAuth>
          </Suspense>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <Suspense fallback={<PageFallback />}>
            <UserLayout><NotFound /></UserLayout>
          </Suspense>
        } />
      </Routes>
      <PerformanceIndicator />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router>
              <div className="App">
                <AppContent />
                <Toaster />
              </div>
            </Router>
          </FavoritesProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
