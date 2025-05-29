
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { Toaster } from '@/components/ui/toaster';
import { MobileNavBar } from '@/components/MobileNavBar';
import SplashScreen from '@/components/SplashScreen';

// Pages
import Index from '@/pages/Index';
import Products from '@/pages/Products';
import ProductDetails from '@/pages/ProductDetails';
import Categories from '@/pages/Categories';
import Cart from '@/pages/Cart';
import Favorites from '@/pages/Favorites';
import Account from '@/pages/Account';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import CustomOrder from '@/pages/CustomOrder';
import NotFound from '@/pages/NotFound';

// Admin Pages
import AdminLayout from '@/components/Admin/AdminLayout';
import Dashboard from '@/pages/Admin/Dashboard';
import Catalog from '@/pages/Admin/Catalog';
import AdminProducts from '@/pages/Admin/Products';
import AdminCategories from '@/pages/Admin/Categories';
import Orders from '@/pages/Admin/Orders';
import Customers from '@/pages/Admin/Customers';
import Analytics from '@/pages/Admin/Analytics';
import Settings from '@/pages/Admin/Settings';

// Create a client
const queryClient = new QueryClient();

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <QueryClientProvider client={queryClient}>
        <SplashScreen onComplete={handleSplashComplete} />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <FavoritesProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/custom-order" element={<CustomOrder />} />
                  
                  {/* Admin Routes - Plus besoin d'authentification */}
                  <Route path="/admin" element={
                    <AdminAuth>
                      <AdminLayout>
                        <Dashboard />
                      </AdminLayout>
                    </AdminAuth>
                  } />
                  <Route path="/admin/products" element={
                    <AdminAuth>
                      <AdminLayout>
                        <AdminProducts />
                      </AdminLayout>
                    </AdminAuth>
                  } />
                  <Route path="/admin/categories" element={
                    <AdminAuth>
                      <AdminLayout>
                        <AdminCategories />
                      </AdminLayout>
                    </AdminAuth>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminAuth>
                      <AdminLayout>
                        <Orders />
                      </AdminLayout>
                    </AdminAuth>
                  } />
                  <Route path="/admin/customers" element={
                    <AdminAuth>
                      <AdminLayout>
                        <Customers />
                      </AdminLayout>
                    </AdminAuth>
                  } />
                  <Route path="/admin/analytics" element={
                    <AdminAuth>
                      <AdminLayout>
                        <Analytics />
                      </AdminLayout>
                    </AdminAuth>
                  } />
                  <Route path="/admin/settings" element={
                    <AdminAuth>
                      <AdminLayout>
                        <Settings />
                      </AdminLayout>
                    </AdminAuth>
                  } />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
                <MobileNavBar />
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
