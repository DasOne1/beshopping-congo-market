
import { Suspense, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import SplashScreen from "@/components/SplashScreen";
import { ScrollToTop } from "@/components/ScrollToTop";
import { MobileNavBar } from "@/components/MobileNavBar";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EmailCustomerAuth from "./pages/EmailCustomerAuth";
import AdminAuth from "./pages/AdminAuth";
import { useOptimizedRealtimeSync } from "@/hooks/useOptimizedRealtimeSync";

// Lazy components avec code splitting
import {
  LazyProducts,
  LazyCategories,
  LazyProductDetails,
  LazyCart,
  LazyFavorites,
  LazyContact,
  LazyAboutUs,
  LazyAccount,
  LazyCustomOrder,
  LazyAdminDashboard,
  LazyAdminCatalog,
  LazyAdminOrders,
  LazyAdminReports,
  LazyAdminAnalytics,
  LazyAdminSettings,
  LazyAdminProfile,
  LazyLoadingFallback,
} from "@/components/LazyComponents";

// Configuration optimisée de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: 500,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Composant principal avec synchronisation temps réel
const AppContent = () => {
  useOptimizedRealtimeSync();
  
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/customer-auth" element={<EmailCustomerAuth />} />
        <Route path="/admin/auth" element={<AdminAuth />} />

        <Route 
          path="/products" 
          element={
            <Suspense fallback={<LazyLoadingFallback />}>
              <LazyProducts />
            </Suspense>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <Suspense fallback={<LazyLoadingFallback />}>
              <LazyCategories />
            </Suspense>
          } 
        />
        <Route 
          path="/product/:id" 
          element={
            <Suspense fallback={<LazyLoadingFallback />}>
              <LazyProductDetails />
            </Suspense>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <Suspense fallback={<LazyLoadingFallback />}>
              <LazyCart />
            </Suspense>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <Suspense fallback={<LazyLoadingFallback />}>
              <LazyFavorites />
            </Suspense>
          } 
        />
        <Route 
          path="/contact" 
          element={
            <Suspense fallback={<LazyLoadingFallback />}>
              <LazyContact />
            </Suspense>
          } 
        />
        <Route 
          path="/about" 
          element={
            <Suspense fallback={<LazyLoadingFallback />}>
              <LazyAboutUs />
            </Suspense>
          } 
        />
        <Route 
          path="/account" 
          element={
            <Suspense fallback={<LazyLoadingFallback />}>
              <LazyAccount />
            </Suspense>
          } 
        />
        <Route 
          path="/custom-order" 
          element={
            <Suspense fallback={<LazyLoadingFallback />}>
              <LazyCustomOrder />
            </Suspense>
          } 
        />

        <Route path="/admin" element={<AdminLayout />}>
          <Route 
            path="dashboard" 
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <LazyAdminDashboard />
              </Suspense>
            } 
          />
          <Route 
            path="catalog" 
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <LazyAdminCatalog />
              </Suspense>
            } 
          />
          <Route 
            path="orders" 
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <LazyAdminOrders />
              </Suspense>
            } 
          />
          <Route 
            path="reports" 
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <LazyAdminReports />
              </Suspense>
            } 
          />
          <Route 
            path="analytics" 
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <LazyAdminAnalytics />
              </Suspense>
            } 
          />
          <Route 
            path="settings" 
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <LazyAdminSettings />
              </Suspense>
            } 
          />
          <Route 
            path="profile" 
            element={
              <Suspense fallback={<LazyLoadingFallback />}>
                <LazyAdminProfile />
              </Suspense>
            } 
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileNavBar />
    </>
  );
};

function App() {
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <FavoritesProvider>
            <Toaster />
            <SonnerToaster />
            <BrowserRouter>
              <ThemeProvider>
                {!splashComplete && (
                  <SplashScreen onComplete={() => setSplashComplete(true)} />
                )}
                {splashComplete && <AppContent />}
              </ThemeProvider>
            </BrowserRouter>
          </FavoritesProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
