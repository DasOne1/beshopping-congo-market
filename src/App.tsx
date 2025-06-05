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
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import CustomerAuth from '@/pages/CustomerAuth';

// Admin Pages
import AdminAuth from '@/components/AdminAuth';
import AdminAuthPage from '@/pages/Admin/AdminAuth';
import Dashboard from '@/pages/Admin/Dashboard';
import Orders from '@/pages/Admin/Orders';
import AdminProducts from '@/pages/Admin/Products';
import ProductForm from '@/pages/Admin/ProductForm';
import AdminCategories from '@/pages/Admin/Categories';
import CategoryForm from '@/pages/Admin/CategoryForm';
import Catalog from '@/pages/Admin/Catalog';
import Customers from '@/pages/Admin/Customers';
import Analytics from '@/pages/Admin/Analytics';
import AdminAccounts from '@/pages/Admin/AdminAccounts';
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
      <Route path="/customer-auth" element={<CustomerAuth />} />

      {/* Admin Authentication Route */}
      <Route path="/dasgabriel@adminaccess" element={<AdminAuthPage />} />

      {/* Admin Routes - Protected with AdminAuth */}
      <Route path="/dasgabriel@adminaccess/dashboard" element={<AdminAuth><Dashboard /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/orders" element={<AdminAuth><Orders /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/products" element={<AdminAuth><AdminProducts /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/products/new" element={<AdminAuth><ProductForm /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/products/edit/:id" element={<AdminAuth><ProductForm /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/categories" element={<AdminAuth><AdminCategories /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/categories/new" element={<AdminAuth><CategoryForm /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/categories/edit/:id" element={<AdminAuth><CategoryForm /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/catalog" element={<AdminAuth><Catalog /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/customers" element={<AdminAuth><Customers /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/analytics" element={<AdminAuth><Analytics /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/accounts" element={<AdminAuth><AdminAccounts /></AdminAuth>} />
      <Route path="/dasgabriel@adminaccess/settings" element={<AdminAuth><Settings /></AdminAuth>} />

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
