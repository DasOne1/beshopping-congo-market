
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";

import Index from "./pages/Index";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminOrders from "./pages/Admin/Orders";
import AdminCatalog from "./pages/Admin/Catalog";
import AdminCustomers from "./pages/Admin/Customers";
import AdminSettings from "./pages/Admin/Settings";
import SplashScreen from "./components/SplashScreen";
import { MobileNavBar } from "./components/MobileNavBar";
import AdminAuth from "./components/AdminAuth";

const queryClient = new QueryClient();

// Page transition component
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="layout-container"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  // Check if the app has been loaded before
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    
    if (hasSeenSplash) {
      setShowSplash(false);
    } else {
      sessionStorage.setItem("hasSeenSplash", "true");
    }
    
    // Prevent body scroll issues
    document.body.style.overflow = "auto";
    document.body.style.position = "relative";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <CartProvider>
            <FavoritesProvider>
              <Toaster />
              <Sonner />
              
              <AnimatePresence>
                {showSplash ? (
                  <SplashScreen onComplete={() => setShowSplash(false)} />
                ) : (
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={
                        <PageTransition>
                          <Index />
                        </PageTransition>
                      } />
                      <Route path="/products" element={
                        <PageTransition>
                          <Products />
                        </PageTransition>
                      } />
                      <Route path="/categories" element={
                        <PageTransition>
                          <Categories />
                        </PageTransition>
                      } />
                      <Route path="/product/:productId" element={
                        <PageTransition>
                          <ProductDetails />
                        </PageTransition>
                      } />
                      <Route path="/cart" element={
                        <PageTransition>
                          <Cart />
                        </PageTransition>
                      } />
                      <Route path="/favorites" element={
                        <PageTransition>
                          <Favorites />
                        </PageTransition>
                      } />
                      <Route path="/about" element={
                        <PageTransition>
                          <AboutUs />
                        </PageTransition>
                      } />
                      <Route path="/contact" element={
                        <PageTransition>
                          <Contact />
                        </PageTransition>
                      } />
                      <Route path="/account" element={
                        <PageTransition>
                          <Account />
                        </PageTransition>
                      } />
                      
                      {/* Admin Routes - Protected with authentication */}
                      <Route path="/admin" element={
                        <AdminAuth>
                          <AdminDashboard />
                        </AdminAuth>
                      } />
                      <Route path="/admin/orders" element={
                        <AdminAuth>
                          <AdminOrders />
                        </AdminAuth>
                      } />
                      <Route path="/admin/products" element={
                        <AdminAuth>
                          <AdminCatalog />
                        </AdminAuth>
                      } />
                      <Route path="/admin/customers" element={
                        <AdminAuth>
                          <AdminCustomers />
                        </AdminAuth>
                      } />
                      <Route path="/admin/settings" element={
                        <AdminAuth>
                          <AdminSettings />
                        </AdminAuth>
                      } />
                      
                      {/* Catch-all */}
                      <Route path="*" element={
                        <PageTransition>
                          <NotFound />
                        </PageTransition>
                      } />
                    </Routes>
                    <MobileNavBar />
                  </BrowserRouter>
                )}
              </AnimatePresence>
            </FavoritesProvider>
          </CartProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
