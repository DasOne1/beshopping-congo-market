
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
import AdminLayout from "@/components/AdminLayout";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import Account from "./pages/Account";
import CustomOrder from "./pages/CustomOrder";
import NotFound from "./pages/NotFound";
import EmailCustomerAuth from "./pages/EmailCustomerAuth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import { useState } from "react";

const queryClient = new QueryClient();

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
                {splashComplete && (
                  <>
                    <ScrollToTop />
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/product/:id" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/account" element={<Account />} />
                      <Route path="/custom-order" element={<CustomOrder />} />
                      <Route path="/customer-auth" element={<EmailCustomerAuth />} />

                      {/* Admin routes */}
                      <Route path="/admin/auth" element={<AdminAuth />} />
                      <Route path="/admin" element={
                        <AdminProtectedRoute>
                          <AdminLayout />
                        </AdminProtectedRoute>
                      }>
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="categories" element={<AdminCategories />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                        <Route path="settings" element={<AdminSettings />} />
                      </Route>

                      {/* 404 route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    
                    {/* Only show mobile nav for public routes */}
                    <Routes>
                      <Route path="/admin/*" element={null} />
                      <Route path="*" element={<MobileNavBar />} />
                    </Routes>
                  </>
                )}
              </ThemeProvider>
            </BrowserRouter>
          </FavoritesProvider>
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
