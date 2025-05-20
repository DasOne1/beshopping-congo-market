
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AnimatePresence } from "framer-motion";

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
import SplashScreen from "./components/SplashScreen";
import { MobileNavBar } from "./components/MobileNavBar";

const queryClient = new QueryClient();

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
                      <Route path="/" element={<Index />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/product/:productId" element={<ProductDetails />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/account" element={<Account />} />
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminDashboard />} />
                      
                      {/* Catch-all */}
                      <Route path="*" element={<NotFound />} />
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
