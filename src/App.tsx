
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useDataPreloader } from '@/hooks/useDataPreloader';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import SplashScreen from '@/components/SplashScreen';
import UserLayout from '@/components/UserLayout';

// Public Pages
import Index from '@/pages/Index';
import Products from '@/pages/Products';
import ProductDetails from '@/pages/ProductDetails';
import PublicCategories from '@/pages/Categories';
import Cart from '@/pages/Cart';
import Favorites from '@/pages/Favorites';
import CustomOrder from '@/pages/CustomOrder';
import Contact from '@/pages/Contact';
import AboutUs from '@/pages/AboutUs';
import Account from '@/pages/Account';
import NotFound from '@/pages/NotFound';

// Admin Pages
import AdminAuth from '@/components/AdminAuth';
import Dashboard from '@/pages/Admin/Dashboard';
import Orders from '@/pages/Admin/Orders';
import AdminProducts from '@/pages/Admin/Products';
import ProductForm from '@/pages/Admin/ProductForm';
import AdminCategories from '@/pages/Admin/Categories';
import CategoryForm from '@/pages/Admin/CategoryForm';
import Catalog from '@/pages/Admin/Catalog';
import Customers from '@/pages/Admin/Customers';
import Analytics from '@/pages/Admin/Analytics';
import Settings from '@/pages/Admin/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutes - données considérées comme fraîches
      gcTime: 10 * 60 * 1000, // 10 minutes - temps avant suppression du cache
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  const { isLoading } = useDataPreloader();
  
  // Activer la synchronisation en temps réel
  useRealtimeSync();

  if (isLoading) {
    return <SplashScreen onComplete={() => {}} />;
  }

  return (
    <Routes>
      {/* Public Routes with UserLayout */}
      <Route path="/" element={<UserLayout><Index /></UserLayout>} />
      <Route path="/products" element={<UserLayout><Products /></UserLayout>} />
      <Route path="/product/:id" element={<UserLayout><ProductDetails /></UserLayout>} />
      <Route path="/categories" element={<UserLayout><PublicCategories /></UserLayout>} />
      <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
      <Route path="/favorites" element={<UserLayout><Favorites /></UserLayout>} />
      <Route path="/custom-order" element={<UserLayout><CustomOrder /></UserLayout>} />
      <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
      <Route path="/about" element={<UserLayout><AboutUs /></UserLayout>} />
      <Route path="/account" element={<UserLayout><Account /></UserLayout>} />

      {/* Admin Routes - AdminLayout is already included in each admin page */}
      <Route path="/admin" element={<AdminAuth><Dashboard /></AdminAuth>} />
      <Route path="/admin/orders" element={<AdminAuth><Orders /></AdminAuth>} />
      <Route path="/admin/products" element={<AdminAuth><AdminProducts /></AdminAuth>} />
      <Route path="/admin/products/new" element={<AdminAuth><ProductForm /></AdminAuth>} />
      <Route path="/admin/products/edit/:id" element={<AdminAuth><ProductForm /></AdminAuth>} />
      <Route path="/admin/categories" element={<AdminAuth><AdminCategories /></AdminAuth>} />
      <Route path="/admin/categories/new" element={<AdminAuth><CategoryForm /></AdminAuth>} />
      <Route path="/admin/categories/edit/:id" element={<AdminAuth><CategoryForm /></AdminAuth>} />
      <Route path="/admin/catalog" element={<AdminAuth><Catalog /></AdminAuth>} />
      <Route path="/admin/customers" element={<AdminAuth><Customers /></AdminAuth>} />
      <Route path="/admin/analytics" element={<AdminAuth><Analytics /></AdminAuth>} />
      <Route path="/admin/settings" element={<AdminAuth><Settings /></AdminAuth>} />

      {/* 404 Route */}
      <Route path="*" element={<UserLayout><NotFound /></UserLayout>} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router>
              <AppContent />
              <Toaster />
            </Router>
          </FavoritesProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
