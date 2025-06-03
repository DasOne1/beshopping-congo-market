
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { AppStoreProvider } from '@/stores/appStore';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy loading des composants
const Index = lazy(() => import('@/pages/Index'));
const Products = lazy(() => import('@/pages/Products'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const Account = lazy(() => import('@/pages/Account'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Auth = lazy(() => import('@/pages/Auth'));

// Admin routes
const AdminLogin = lazy(() => import('@/pages/Admin/Login'));
const AdminDashboard = lazy(() => import('@/pages/Admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/Admin/Products'));
const AdminProductForm = lazy(() => import('@/pages/Admin/ProductForm'));
const AdminCategories = lazy(() => import('@/pages/Admin/Categories'));
const AdminCategoryForm = lazy(() => import('@/pages/Admin/CategoryForm'));
const AdminOrders = lazy(() => import('@/pages/Admin/Orders'));
const AdminOrderDetail = lazy(() => import('@/pages/Admin/OrderDetail'));
const AdminCustomers = lazy(() => import('@/pages/Admin/Customers'));
const AdminSettings = lazy(() => import('@/pages/Admin/Settings'));

// Configuration du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Ne pas retry si l'erreur est une erreur d'authentification
        if (error && typeof error === 'object' && 'status' in error) {
          if ([401, 403, 404].includes(error.status as number)) {
            return false;
          }
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AppStoreProvider>
          <CartProvider>
            <FavoritesProvider>
              <Router>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Suspense 
                    fallback={
                      <div className="min-h-screen flex items-center justify-center">
                        <LoadingSpinner />
                      </div>
                    }
                  >
                    <Routes>
                      {/* Routes publiques */}
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/auth" element={<Auth />} />

                      {/* Routes admin */}
                      <Route path="/dasgabriel@adminaccess" element={<AdminLogin />} />
                      <Route path="/dasgabriel@adminaccess/dashboard" element={<AdminDashboard />} />
                      
                      {/* Gestion des produits */}
                      <Route path="/dasgabriel@adminaccess/catalog" element={<AdminProducts />} />
                      <Route path="/dasgabriel@adminaccess/catalog/new" element={<AdminProductForm />} />
                      <Route path="/dasgabriel@adminaccess/catalog/edit/:id" element={<AdminProductForm />} />
                      
                      {/* Gestion des catégories */}
                      <Route path="/dasgabriel@adminaccess/catalog/categories" element={<AdminCategories />} />
                      <Route path="/dasgabriel@adminaccess/catalog/categories/new" element={<AdminCategoryForm />} />
                      <Route path="/dasgabriel@adminaccess/catalog/categories/edit/:id" element={<AdminCategoryForm />} />
                      
                      {/* Gestion des commandes */}
                      <Route path="/dasgabriel@adminaccess/orders" element={<AdminOrders />} />
                      <Route path="/dasgabriel@adminaccess/orders/:id" element={<AdminOrderDetail />} />
                      
                      {/* Gestion des clients */}
                      <Route path="/dasgabriel@adminaccess/customers" element={<AdminCustomers />} />
                      
                      {/* Paramètres */}
                      <Route path="/dasgabriel@adminaccess/settings" element={<AdminSettings />} />
                    </Routes>
                  </Suspense>
                </div>
              </Router>
              <Toaster />
            </FavoritesProvider>
          </CartProvider>
        </AppStoreProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
